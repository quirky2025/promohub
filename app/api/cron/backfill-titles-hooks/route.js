import { sourcingDb } from '@/lib/sourcingDb';
import crypto from 'crypto';

// D15 补漏 · 批量给这批新导入的产品补 display_title(NP115 标准,跟老产品那次同规则)+
// seo_description(标题下的 SEO 钩子,Rulebook §9)。Lily 2026-07-23 原话:
// - 标题不能带 SKU("BND67 SKIL, PUSH METAL BALL PENS" 这种要清理)
// - 要加限定词前缀(Custom/Advertising/Logo Printed/Customised/Imprinted/Promo,
//   md5(sku) 加权轮换,权重跟老产品那次一致:Custom30 Promo25 Customised15 LogoPrinted15 Imprinted10 Advertising5)
// - 无逗号、≤68字符
// - SEO钩子:一句、逐产品不同,用 description 第一句 + 轮换 CTA(Add your logo/Brand/
//   Personalise/Put your logo on)+ 印刷方式(有真实印刷方式就带上,通用占位就不带)+
//   "From N units"(单复数处理)
// 用法:GET /api/cron/backfill-titles-hooks?key=<PROBE_KEY>&dry=1   先看不写库
//      GET /api/cron/backfill-titles-hooks?key=<PROBE_KEY>         正式写库

export const maxDuration = 60;

const BATCH_SINCE = '2026-07-22 00:00:00';

function authorised(request) {
  const key = new URL(request.url).searchParams.get('key');
  const probeKey = process.env.PROBE_KEY || process.env.TRENDS_PROBE_KEY;
  return !!probeKey && key === probeKey;
}

// md5(sku) 前两个 hex 字符 → 0-255 → 加权轮换,权重跟老产品那次一致
const QUALIFIERS = [
  ['Custom', 30], ['Promo', 25], ['Customised', 15], ['Logo Printed', 15], ['Imprinted', 10], ['Advertising', 5],
];
function pickQualifier(sku) {
  const h = crypto.createHash('md5').update(String(sku)).digest();
  const n = h[0] % 100;
  let acc = 0;
  for (const [word, weight] of QUALIFIERS) { acc += weight; if (n < acc) return word; }
  return QUALIFIERS[0][0];
}

const CTAS = ['Add your logo to', 'Brand', 'Personalise', 'Put your logo on'];
function pickCta(sku) {
  const h = crypto.createHash('md5').update(String(sku) + ':cta').digest();
  return CTAS[h[0] % CTAS.length];
}

function toTitleCase(s) {
  // 只对整串是 ALL CAPS(或大部分大写)的供应商原名做 Title Case,混合大小写的("Vistro Pen")原样保留
  if (s !== s.toUpperCase()) return s;
  return s.toLowerCase().replace(/(^|[\s\-/])([a-z])/g, (m, sep, ch) => sep + ch.toUpperCase());
}

// 清理供应商原始 name:去掉 SKU、"(Custom Made To Order - XXX)" 这类供应商内部备注、逗号
// Lily 2026-07-23 实测发现:名字里嵌的货号(如"BND67")经常跟 supplier_sku(如"FD67.MTO")
// 不是同一个字符串——供应商内部有两套编号——所以不能只按 supplier_sku 精确匹配去删,
// 还要按"开头是个像货号的大写字母+数字 token"这种通用形状去删。
function cleanBaseName(rawName, sku) {
  let s = String(rawName || '').trim();
  // 去掉 "(... Made To Order ... - CODE)" / "(... MTO ...)" 这类括号备注
  s = s.replace(/\(\s*[^)]*(made to order|mto)[^)]*\)/gi, ' ').trim();
  // 去掉开头就是 supplier_sku 本身的 token
  const skuCore = String(sku || '').replace(/\.MTO$/i, '');
  if (skuCore) {
    const esc = skuCore.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    s = s.replace(new RegExp(`^${esc}\\s*,?\\s*`, 'i'), '');
  }
  // 去掉开头任意一个"货号形状"的 token(2-6 位大写字母/数字混合,比如 BND67、S898、FD70XL)
  s = s.replace(/^[A-Z]{1,4}\d{1,5}[A-Z]{0,4}\s*,?\s*/, '');
  s = toTitleCase(s);
  s = s.replace(/,/g, ' ').replace(/\s+/g, ' ').trim();
  return s;
}

function buildDisplayTitle(rawName, sku, capacity) {
  const base = cleanBaseName(rawName, sku);
  const qualifier = pickQualifier(sku);
  // 容量已经出现在名字里(比如"Windsor 1L Tea Infuser Bottle"本身就带"1L")就不重复加前缀
  const capStr = capacity ? String(capacity).trim() : '';
  const capPrefix = capStr && /^\d/.test(capStr) && !base.toLowerCase().includes(capStr.toLowerCase()) ? `${capStr} ` : '';
  let title = `${qualifier} ${capPrefix}${base}`.replace(/\s+/g, ' ').trim();
  if (title.length > 68) {
    // 截到 68 字符内,不切词中间
    title = title.slice(0, 68).replace(/\s+\S*$/, '').trim();
  }
  return title;
}

function firstSentence(desc) {
  const s = String(desc || '').trim();
  if (!s) return '';
  const m = s.match(/^[^.!?]+[.!?]?/);
  return (m ? m[0] : s).replace(/\.$/, '').trim();
}

function buildHook(rawName, sku, description, minQty, decoNames) {
  const base = cleanBaseName(rawName, sku);
  const cta = pickCta(sku);
  const realDecos = (decoNames || []).filter(n => n && !/refer to product branding/i.test(n)).slice(0, 2);
  const decoClause = realDecos.length ? ` with ${realDecos.join(' or ')}` : '';
  const sentence = firstSentence(description);
  const qtyText = Number(minQty) === 1 ? 'From 1 unit.' : `From ${minQty || 50} units.`;
  // 例句只有一个破折号(CTA分句 — 描述分句),"From N units"直接接在描述句后面,不再加第二个破折号
  const lead = `${cta} the ${base}${decoClause}`;
  const tail = sentence ? `${sentence.charAt(0).toLowerCase()}${sentence.slice(1)}. ${qtyText}` : qtyText;
  return `${lead} — ${tail}`.slice(0, 300);
}

export async function GET(request) {
  if (!authorised(request)) return Response.json({ error: 'unauthorized' }, { status: 401 });
  const url = new URL(request.url);
  const dry = url.searchParams.get('dry') === '1';
  const db = sourcingDb();
  const results = [];

  try {
    const { data: rows, error } = await db.from('products')
      .select('id, supplier, supplier_sku, name, description, min_qty, capacity, display_title')
      .in('supplier', ['Trends', 'PromoBrands']).gte('created_at', BATCH_SINCE);
    if (error) throw new Error(error.message);

    for (const row of (rows || [])) {
      try {
        const { data: decos } = await db.from('decoration_options').select('name').eq('product_id', row.id);
        const decoNames = (decos || []).map(d => d.name);

        const display_title = buildDisplayTitle(row.name, row.supplier_sku, row.capacity);
        const seo_hook = buildHook(row.name, row.supplier_sku, row.description, row.min_qty, decoNames);

        if (!dry) {
          const { error: uErr } = await db.from('products').update({
            display_title, seo_description: seo_hook,
          }).eq('id', row.id);
          if (uErr) throw new Error(uErr.message);
        }
        results.push({ code: row.supplier_sku, display_title, seo_hook });
      } catch (e) {
        results.push({ code: row.supplier_sku, result: `error: ${String(e?.message || e).slice(0, 160)}` });
      }
    }

    return Response.json({ dry, count: results.length, results });
  } catch (e) {
    return Response.json({ error: String(e?.message || e) }, { status: 500 });
  }
}

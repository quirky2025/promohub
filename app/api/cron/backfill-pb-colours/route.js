import sharp from 'sharp';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { sourcingDb } from '@/lib/sourcingDb';
import { colourSlug, cleanColour } from '@/lib/colourName';
import { tierMargin } from '@/lib/pricing';
import { COLOUR_SWATCH } from '@/lib/colourSwatch';

// Lily 2026-07-23(Windsor Tea Bottle S898.06 实测发现):PB 的 Inventory 里,基础款(没有
// 配件)有时会把自己的品名词当"颜色"用,比如这款瓶子本体叫 colour:"Bottle",跟真正的颜色
// 变体 "Black Pouch"/"Pink Pouch" 混在一起——"Bottle" 根本不是颜色,是基础库存行的误用。
// 规则:如果同一产品里,某个颜色词是单个词、且不含任何已知颜色词,但"兄弟"颜色词里有至少
// 一个含已知颜色词(比如 "Black Pouch" 含 "Black"),就把这个误用词过滤掉,不当颜色选项。
const KNOWN_COLOUR_WORDS = Object.keys(COLOUR_SWATCH).map(w => w.toLowerCase());
function hasKnownColourWord(name) {
  const low = String(name || '').toLowerCase();
  return KNOWN_COLOUR_WORDS.some(w => low.includes(w));
}
function dropNonColourInventoryTags(names) {
  if (names.length < 2) return names;
  const realOnes = names.filter(hasKnownColourWord);
  if (!realOnes.length) return names; // 一个真颜色词都没有,不敢乱删,原样保留
  return names.filter(n => hasKnownColourWord(n) || n.trim().includes(' '));
}

// D15 补漏 · 批量回填 PB 产品的颜色图片(用真实 img.colour 字段匹配,配合模糊包含匹配)+
// 用修好的 pbTiers()(按 Des 文字找 Unbranded,不按编号猜)重新判断 quote_only/tiers。
// 根因(Lily 2026-07-23 用 S898.06/S777/D435 三个例子发现):
// ① 之前颜色图片靠猜文件名 "_ub_<颜色>" 模式,PB 实际文件名五花八门,根本对不上;
// ② 之前价格表只认固定编号(table4=Unbranded),但编号每个产品不一样,D435 的 Unbranded 在 table5。
// import-products/route.js 已经修好这两处解析逻辑,但只对以后的导入生效——这批已经进库的 PB
// 产品需要重新拉一次原始数据,重建 colours/pricing_tiers。
// PB 没有单条查询接口,只能翻页扫全部目录,一次性收集这批需要的 code,分批处理避免超时。
// 用法:GET /api/cron/backfill-pb-colours?key=<PROBE_KEY>&limit=8&dry=1

export const maxDuration = 280;

const PB_TOKEN_URL = 'https://promobrandrestapi.auth.ap-southeast-2.amazoncognito.com/oauth2/token';
const PB_BASE = process.env.PROMOBRANDS_API_BASE || 'https://api.promobrands.com.au';
const R2_PUBLIC = process.env.R2_PUBLIC_BASE || 'https://pub-fbec7c9199f04af8ab95a413a4620d37.r2.dev';
const VARIANTS = [160, 400, 900];
const BATCH_SINCE = '2026-07-22 00:00:00';

function authorised(request) {
  const key = new URL(request.url).searchParams.get('key');
  const probeKey = process.env.PROBE_KEY || process.env.TRENDS_PROBE_KEY;
  return !!probeKey && key === probeKey;
}
function displayColourName(raw) {
  const { name, mode } = cleanColour(raw);
  const isCustom = !((mode === 'solid' || mode === 'compound') && name);
  return { name: isCustom ? 'Custom' : name, isCustom };
}
const slugify = (s) => String(s || '').toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY },
});
async function imageToR2(srcUrl, keyStem) {
  try {
    const res = await fetch(srcUrl, { cache: 'no-store' });
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 100) return null;
    for (const w of VARIANTS) {
      const webp = await sharp(buf).resize({ width: w, withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
      const key = keyStem.replace('{w}', String(w));
      await r2.send(new PutObjectCommand({ Bucket: process.env.R2_BUCKET, Key: key, Body: webp, ContentType: 'image/webp' }));
    }
    return `${R2_PUBLIC}/${keyStem.replace('{w}', '400')}`;
  } catch { return null; }
}

async function pbIdToken() {
  const clientId = String(process.env.PROMOBRANDS_CLIENT_ID || '').replace(/\s+/g, '');
  const refreshToken = String(process.env.PROMOBRANDS_REFRESH_TOKEN || '').replace(/\s+/g, '');
  const res = await fetch(PB_TOKEN_URL, {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'refresh_token', client_id: clientId, refresh_token: refreshToken }),
    cache: 'no-store',
  });
  const data = await res.json().catch(() => ({}));
  if (!data.id_token) throw new Error('PB token exchange failed');
  return data.id_token;
}

function pbTiers(prod) {
  const table = prod?.Product_Price_Table || {};
  const keys = Object.keys(table).filter(k => /^Product_Price_table\d+$/.test(k));
  const prefixOf = (k) => k.replace('Product_Price_table', 'productPricetable');
  const hasData = (t, prefix) => t && Number(t[`${prefix}Qty1`]) > 0;
  let chosen = null;
  for (const k of keys) {
    const t = table[k];
    if (hasData(t, prefixOf(k)) && /unbranded/i.test(String(t[`${prefixOf(k)}Des`] || ''))) { chosen = { t, prefix: prefixOf(k) }; break; }
  }
  if (!chosen) for (const k of keys) { const t = table[k]; if (hasData(t, prefixOf(k))) { chosen = { t, prefix: prefixOf(k) }; break; } }
  const out = [];
  if (chosen) for (let i = 1; i <= 7; i++) {
    const q = Number(chosen.t[`${chosen.prefix}Qty${i}`]); const pr = Number(chosen.t[`${chosen.prefix}Price${i}`]);
    if (q > 0 && pr > 0) out.push({ q, cost: pr });
  }
  return out.sort((a, b) => a.q - b.q);
}

export async function GET(request) {
  if (!authorised(request)) return Response.json({ error: 'unauthorized' }, { status: 401 });
  const started = Date.now();
  const url = new URL(request.url);
  const dry = url.searchParams.get('dry') === '1';
  const limit = Math.max(1, parseInt(url.searchParams.get('limit') || '8', 10) || 8);
  // Lily 2026-07-23 发现"一直卡住不动"(跟 backfill-trends-colours 同一个根因):靠"有没有真实
  // 图片"判断处理过没有,但 PB 有些颜色本来就没有对应的 Unbranded 图(或者本来就是 Custom),
  // 永远判定成"没处理过",每次都占掉批次名额,后面的产品永远轮不到。改成用 offset 游标翻页。
  const offset = Math.max(0, parseInt(url.searchParams.get('offset') || '0', 10) || 0);
  // sku=<code> · 只重跑单个产品(比如发现某个产品的颜色/图片规则问题,补丁修好后单独重跑这一个,
  // 不用把整批 61 个重新扫一遍)。可传逗号分隔多个。
  const skuFilter = (url.searchParams.get('sku') || '').split(',').map(s => s.trim().toUpperCase()).filter(Boolean);
  const db = sourcingDb();
  const results = [];

  try {
    let query = db.from('products')
      .select('id, supplier_sku, colours, quote_only, min_qty')
      .eq('supplier', 'PromoBrands').gte('created_at', BATCH_SINCE)
      .order('id', { ascending: true });
    if (skuFilter.length) query = db.from('products').select('id, supplier_sku, colours, quote_only, min_qty').eq('supplier', 'PromoBrands').in('supplier_sku', skuFilter);
    const { data: allRows, error } = await query;
    if (error) throw new Error(error.message);

    const todo = allRows || [];
    const targets = skuFilter.length ? todo : todo.slice(offset, offset + limit);
    if (!targets.length) return Response.json({ dry, total_todo: todo.length, offset, hint: '这批全部处理完了', results: [] });

    const need = new Map(targets.map(r => [r.supplier_sku.trim().toUpperCase(), r]));
    const token = await pbIdToken();
    let after = 0;
    for (;;) {
      if (!need.size || Date.now() - started > 200000) break;
      const qs = after > 0 ? `PageSize=100&Order=ASC&After=${after}` : 'PageSize=100&Order=ASC';
      const res = await fetch(`${PB_BASE}/product?${qs}`, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }, cache: 'no-store' });
      if (!res.ok) break;
      const list = await res.json().catch(() => null);
      if (!Array.isArray(list) || !list.length) break;
      for (const prod of list) {
        after = Math.max(after, Number(prod.Product_ID) || after);
        const codeU = String(prod.Product_Code || '').trim().toUpperCase();
        const row = need.get(codeU);
        if (!row) continue;
        need.delete(codeU);
        try {
          const sku = row.supplier_sku.toLowerCase();
          const unbranded = (prod.Product_Images?.productUnbrandedImages || []).slice(0, 24);
          const ubByColour = new Map();
          for (const img of unbranded) {
            if (!img?.mediaItemUrl) continue;
            const file = slugify(img.slug || img.mediaItemUrl.split('/').pop().replace(/\.\w+$/, ''));
            const imgUrl = await imageToR2(img.mediaItemUrl, `suppliers/promobrands/products/_variants/w{w}/unbranded/${sku}/${file}.webp`);
            if (!imgUrl) continue;
            let colour = String(img.colour || '').trim();
            if (!colour || /^unbranded$/i.test(colour)) continue;
            ubByColour.set(colour.toLowerCase(), { colour, url: imgUrl });
          }
          function findUbImage(name) {
            const key = name.toLowerCase();
            if (ubByColour.has(key)) return ubByColour.get(key);
            for (const [k, v] of ubByColour) { if (key.includes(k) || k.includes(key)) return v; }
            return null;
          }
          const invColours = (Array.isArray(prod.Inventory) ? prod.Inventory : [])
            .map(r => String(r?.InventoryDetails?.colour || '').trim()).filter(c => c && !/^misc$/i.test(c));
          const dedupedInv = [...new Set(invColours)];
          const names = dedupedInv.length ? dropNonColourInventoryTags(dedupedInv) : (prod.Colour ? [prod.Colour] : ['Default']);
          const colours = names.map(n => {
            const { name: label, isCustom } = displayColourName(n);
            if (isCustom) return { name: label, hex: '', image: '' };
            const hit = findUbImage(n);
            return { name: label, hex: '', image: hit ? hit.url : '' };
          });
          const colour_slugs = names.filter(n => n !== 'Default').map(n => colourSlug(n));

          const costTiers = pbTiers(prod);
          const update = { colours, colour_slugs };
          let tiersChanged = false;
          if (row.quote_only && costTiers.length) {
            update.quote_only = false;
            update.min_qty = costTiers[0].q;
            tiersChanged = true;
          }

          if (!dry) {
            const { error: uErr } = await db.from('products').update(update).eq('id', row.id);
            if (uErr) throw new Error(uErr.message);
            if (tiersChanged) {
              // Lily 2026-07-24 实锤(S777 实测,前台价格 = 供应商成本 × margin²):存供应商
              // 进货成本(raw cost),加价(tierMargin)由前台显示时做,别在这里乘一遍,否则
              // 前台再乘一次 = 加价两遍。见 PRICING-RULES §1.1、import-products/route.js 同款修复。
              const tiers = costTiers.map((t, i, arr) => ({
                product_id: row.id, sort_order: i, min_qty: t.q,
                max_qty: arr[i + 1] ? arr[i + 1].q - 1 : null,
                base_price: Number(Number(t.cost).toFixed(2)),
              }));
              await db.from('pricing_tiers').delete().eq('product_id', row.id);
              await db.from('pricing_tiers').insert(tiers);
            }
          }
          results.push({ code: row.supplier_sku, colours: colours.length, real_images: ubByColour.size, tiers_fixed: tiersChanged });
        } catch (e) {
          results.push({ code: row.supplier_sku, result: `error: ${String(e?.message || e).slice(0, 160)}` });
        }
      }
      if (list.length < 100) break;
    }
    for (const [, row] of need) results.push({ code: row.supplier_sku, result: 'not found in catalog scan (time budget or gone)' });

    const nextOffset = offset + targets.length;
    const remaining = todo.length - nextOffset;
    const nextUrl = `${url.origin}${url.pathname}?key=${url.searchParams.get('key')}${dry ? '&dry=1' : ''}&offset=${nextOffset}`;
    const hint = remaining > 0 ? `还有 ${remaining} 个待处理,下一步打开:${nextUrl}` : '这批全部处理完了';
    return Response.json({ dry, total_todo: todo.length, processed: targets.length, offset, next_offset: nextOffset, remaining, hint, next_url: remaining > 0 ? nextUrl : null, results, elapsed_s: Math.round((Date.now() - started) / 1000) });
  } catch (e) {
    return Response.json({ error: String(e?.message || e) }, { status: 500 });
  }
}

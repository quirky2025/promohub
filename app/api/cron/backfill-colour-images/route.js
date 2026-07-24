import { sourcingDb } from '@/lib/sourcingDb';

// D15 补漏 · 就地修复颜色图片(不删产品、不重导、不重新下载图片)。
// 根因:导入器把"颜色↔图片"配错了 —— Trends 之前用 caption("Main"/"Back")当颜色键(错),
// PB 的图片标签又乱("Black2"/"Olive2"/Navy 标成"Unbranded")。图片其实早就下载进 R2、
// 也存在 product_colours(name='Default').images 里,只是 products.colours[].image 没配对。
// 本路由:重新拉一次供应商原始数据(只要 metadata,不下载图),按图片顺序对齐到已存的 R2 URL,
// 用"精确→去尾数字→首词→互相包含"多级匹配,把每个颜色配上正确的已存图片,直接更新 products.colours。
// 用法:
//   GET /api/cron/backfill-colour-images?key=<KEY>&supplier=trends&dry=1&limit=30&offset=0
//   GET /api/cron/backfill-colour-images?key=<KEY>&supplier=pb&dry=1
//   先用 dry=1 预览(不写库),确认对了再去掉 &dry=1 正式跑。跟着 next_url 继续直到处理完。

export const maxDuration = 280;

const TRENDS_BASE = process.env.TRENDS_API_BASE || 'https://au.api.trends.nz';
const PB_TOKEN_URL = 'https://promobrandrestapi.auth.ap-southeast-2.amazoncognito.com/oauth2/token';
const PB_BASE = process.env.PROMOBRANDS_API_BASE || 'https://api.promobrands.com.au';
const BATCH_SINCE = '2026-07-22 00:00:00';

const slugify = (s) => String(s || '').toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

function authorised(request) {
  const key = new URL(request.url).searchParams.get('key');
  const probeKey = process.env.PROBE_KEY || process.env.TRENDS_PROBE_KEY;
  const authHeader = request.headers.get('authorization') || '';
  if (probeKey && key === probeKey) return true;
  if (process.env.CRON_SECRET && authHeader === `Bearer ${process.env.CRON_SECRET}`) return true;
  return false;
}

// "Custom/未识别"颜色不该配图(交给前端色块),和导入器 displayColourName 的口径保持一致的简化判断。
function isCustomColour(name) {
  return /custom|assorted|multi|mixed|其他/i.test(String(name || ''));
}

// 颜色选项名 → 图片颜色标签,多级匹配:
// 1) 精确  2) 去掉结尾数字(Black2→black, Olive2→olive)  3) 首词(Silver and black→silver)
// 4) 互相包含(Translucent Blue and black 含 blue)。tagMap: Map<lowerTag, url>
function matchImage(optName, tagMap) {
  const low = String(optName).toLowerCase().trim();
  if (!low) return '';
  if (tagMap.has(low)) return tagMap.get(low);
  const noDigit = low.replace(/\d+$/, '').trim();
  if (noDigit && tagMap.has(noDigit)) return tagMap.get(noDigit);
  const first = low.split(/[\/,&]|\band\b|\s+/).filter(Boolean)[0];
  if (first && tagMap.has(first)) return tagMap.get(first);
  for (const [tag, url] of tagMap) {
    const t = tag.replace(/\d+$/, '').trim();
    if (t && (low.includes(t) || t.includes(low))) return url;
  }
  return '';
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

// 在已存的 gallery(R2 URL 数组)里找结尾/包含某片段的那张
function findInGallery(gallery, needle) {
  if (!needle) return '';
  const hit = gallery.find(u => String(u).includes(needle));
  return hit || '';
}

// Trends:重建 图片颜色标签 → 已存R2 URL。导入器命名 {code}-{n}.webp(n 从 1 起,只数有 link 的图)。
function trendsTagMap(item, gallery) {
  const tagMap = new Map();
  const imgs = Array.isArray(item.images) ? item.images : [];
  let n = 0;
  for (const im of imgs.slice(0, 12)) {
    const link = String(im?.link || im?.url || '').trim();
    if (!link) continue;
    n += 1;
    const colour = String(im?.colour || '').trim().toLowerCase();
    if (!colour) continue;
    if (tagMap.has(colour)) continue;
    const url = findInGallery(gallery, `-${n}.webp`);
    if (url) tagMap.set(colour, url);
  }
  return tagMap;
}

// PB:重建 图片颜色标签 → 已存R2 URL。导入器命名 unbranded/{sku}/{slugify(slug||filename)}.webp。
function pbTagMap(prod, sku, gallery) {
  const tagMap = new Map();
  const unbranded = (prod.Product_Images?.productUnbrandedImages || []).slice(0, 24);
  for (const img of unbranded) {
    if (!img?.mediaItemUrl) continue;
    let colour = String(img.colour || '').trim();
    if (!colour || /^unbranded$/i.test(colour)) continue; // 乱标/空的留给人工 JSON
    const file = slugify(img.slug || img.mediaItemUrl.split('/').pop().replace(/\.\w+$/, ''));
    const url = findInGallery(gallery, `/${file}.webp`);
    const key = colour.toLowerCase();
    if (url && !tagMap.has(key)) tagMap.set(key, url);
  }
  return tagMap;
}

export async function GET(request) {
  if (!authorised(request)) return Response.json({ error: 'unauthorized' }, { status: 401 });
  const started = Date.now();
  const url = new URL(request.url);
  const supplier = url.searchParams.get('supplier') === 'pb' ? 'PromoBrands' : 'Trends';
  const dry = url.searchParams.get('dry') === '1';
  const limit = Math.max(1, parseInt(url.searchParams.get('limit') || '30', 10) || 30);
  const offset = Math.max(0, parseInt(url.searchParams.get('offset') || '0', 10) || 0);
  const db = sourcingDb();
  const trendsToken = process.env.TRENDS_API_TOKEN;
  const results = [];

  try {
    // 只处理"有颜色、但至少一个颜色缺图"的产品
    const { data: allRows, error } = await db.from('products')
      .select('id, supplier_sku, supplier, colours')
      .eq('supplier', supplier).gte('created_at', BATCH_SINCE)
      .order('supplier_sku');
    if (error) throw new Error(error.message);

    const needs = (allRows || []).filter(p =>
      Array.isArray(p.colours) && p.colours.length &&
      p.colours.some(c => !c.image && !isCustomColour(c.name)));
    const rows = needs.slice(offset, offset + limit);

    // 预取 PB token(只在处理 PB 且需要翻目录时)
    let pbToken = null, pbFound = new Map();
    if (supplier === 'PromoBrands' && rows.length) {
      pbToken = await pbIdToken();
      const need = new Map(rows.map(r => [String(r.supplier_sku).trim().toUpperCase(), r]));
      let after = 0;
      for (let i = 0; i < 80; i++) {
        if (!need.size || Date.now() - started > 200000) break;
        const qs = after > 0 ? `PageSize=100&Order=ASC&After=${after}` : 'PageSize=100&Order=ASC';
        const res = await fetch(`${PB_BASE}/product?${qs}`, { headers: { Authorization: `Bearer ${pbToken}`, Accept: 'application/json' }, cache: 'no-store' });
        if (!res.ok) break;
        const list = await res.json().catch(() => null);
        if (!Array.isArray(list) || !list.length) break;
        for (const prod of list) {
          after = Math.max(after, Number(prod.Product_ID) || after);
          const codeU = String(prod.Product_Code || '').trim().toUpperCase();
          if (need.has(codeU)) { pbFound.set(codeU, prod); need.delete(codeU); }
        }
        if (list.length < 100) break;
      }
    }

    for (const row of rows) {
      if (Date.now() - started > 250000) { results.push({ code: row.supplier_sku, result: 'time budget — 再开一次继续' }); continue; }
      const code = row.supplier_sku;
      try {
        // 已存 gallery(全部图片的有序 R2 URL)
        const { data: def } = await db.from('product_colours')
          .select('images').eq('product_id', row.id).eq('name', 'Default').maybeSingle();
        const gallery = Array.isArray(def?.images) ? def.images : [];
        if (!gallery.length) { results.push({ code, result: 'skipped: 没有已存图片' }); continue; }

        // 拉原始 metadata 建 tagMap
        let tagMap;
        if (supplier === 'Trends') {
          const res = await fetch(`${TRENDS_BASE}/api/v1/products/${code}.json`, {
            headers: { Authorization: `Bearer ${trendsToken}`, Accept: 'application/json' }, cache: 'no-store',
          });
          if (!res.ok) { results.push({ code, result: `error: trends ${res.status}` }); continue; }
          const json = await res.json().catch(() => null);
          const item = json?.data?.[0] || json?.data;
          if (!item) { results.push({ code, result: 'error: 原始数据取不到' }); continue; }
          tagMap = trendsTagMap(item, gallery);
        } else {
          const prod = pbFound.get(String(code).trim().toUpperCase());
          if (!prod) { results.push({ code, result: 'skipped: PB 目录里没扫到(时间预算/已下架)' }); continue; }
          tagMap = pbTagMap(prod, slugify(code), gallery);
        }

        // 逐颜色配图(只补缺图的;已有图的不动)
        let filled = 0;
        const before = row.colours.map(c => ({ ...c }));
        const after = row.colours.map(c => {
          if (c.image || isCustomColour(c.name)) return c;
          const img = matchImage(c.name, tagMap);
          if (img) { filled += 1; return { ...c, image: img, images: [img] }; }
          return c;
        });
        const stillMissing = after.filter(c => !c.image && !isCustomColour(c.name)).map(c => c.name);

        if (!dry && filled > 0) {
          const { error: uErr } = await db.from('products').update({ colours: after }).eq('id', row.id);
          if (uErr) throw new Error(uErr.message);
        }
        results.push({ code, filled, still_missing: stillMissing, tags: [...tagMap.keys()], result: dry ? 'would update' : (filled ? 'updated' : 'no match') });
      } catch (e) {
        results.push({ code, result: `error: ${String(e?.message || e).slice(0, 160)}` });
      }
    }

    const nextOffset = offset + rows.length;
    const remaining = needs.length - nextOffset;
    const nextUrl = remaining > 0
      ? `${url.origin}${url.pathname}?key=${url.searchParams.get('key')}&supplier=${url.searchParams.get('supplier') || 'trends'}${dry ? '&dry=1' : ''}&offset=${nextOffset}`
      : null;
    return Response.json({
      supplier, dry, total_need_fix: needs.length, processed: rows.length, offset, remaining,
      hint: remaining > 0 ? `还有 ${remaining} 个,打开 next_url 继续` : '这批全部处理完了',
      next_url: nextUrl, results, elapsed_s: Math.round((Date.now() - started) / 1000),
    });
  } catch (e) {
    return Response.json({ error: String(e?.message || e) }, { status: 500 });
  }
}

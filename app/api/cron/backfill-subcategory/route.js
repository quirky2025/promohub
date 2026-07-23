import { sourcingDb } from '@/lib/sourcingDb';

// D15 补漏 · 回填 subcategory(Lily 2026-07-23:"SUBCAT 一次次是空的"——查到根因是导入器
// import-products/route.js 里 subcategory 之前一律硬写 null,从来没有真正赋值过,不是某几个
// 产品漏了,是这一批 147 个全部都是空的。导入器本身已经修好(改成用供应商原始分类树 + 正式
// nav_subcategories 表匹配),但已经导进来的这批需要重新拉一次原始数据、重新算一遍 subcategory。
// 用法:GET /api/cron/backfill-subcategory?key=<PROBE_KEY>&limit=20&offset=0
//   跟着返回的 next_url 继续,直到 hint 显示"这批全部处理完了"。

export const maxDuration = 60;

const TRENDS_BASE = process.env.TRENDS_API_BASE || 'https://au.api.trends.nz';
const PB_TOKEN_URL = 'https://promobrandrestapi.auth.ap-southeast-2.amazoncognito.com/oauth2/token';
const PB_BASE = process.env.PROMOBRANDS_API_BASE || 'https://api.promobrands.com.au';
const BATCH_SINCE = '2026-07-22 00:00:00';

const TRENDS_CAT = {
  'Pens': 'Pens', 'Apparel': 'Apparel', 'Drinkware': 'Drinkware', 'Business': 'Office & Desk',
  'Print': 'Marketing Materials', 'Packaging': 'Packaging', 'Promotion': 'Giveaways & Event Accessories',
  'Technology': 'Technology', 'Bags': 'Bags', 'Personal': 'Personal Care', 'Headwear': 'Headwear',
  'Leisure': 'Outdoor & Sports',
};
const TRENDS_SUB_OVERRIDE = {
  'Key Rings': 'Key Rings', 'Pet Accessories': 'Pet', 'Games & Puzzles': 'Toys & Games',
  'Plush Toys': 'Toys & Games', 'Home & Living': 'Home & Living', 'Cheese & Serving Boards': 'Home & Living',
  'Coasters': 'Home & Living', 'Candles & Diffusers': 'Home & Living', 'Tools': 'Tools & Auto',
  'Travel': 'Travel', 'Suitcases': 'Bags',
};
const PB_CAT = {
  'Bags': 'Bags', 'Drinkware': 'Drinkware', 'Keychains': 'Key Rings', 'Office': 'Office & Desk',
  'Apparel': 'Apparel', 'Outdoor & Leisure': 'Outdoor & Sports', 'Pens & Writing Instruments': 'Pens',
  'Tech & Audio': 'Technology', 'Tools & Torches': 'Tools & Auto', 'Tradeshow': 'Giveaways & Event Accessories',
  'Health & Wellness': 'Personal Care', 'Home & Entertainment': 'Home & Living', 'Plush': 'Toys & Games',
  'Stress Relievers': 'Toys & Games', 'Essential & PPE Products': 'Personal Care', 'Bic Promo': 'Pens',
  'Premium Gifting': 'Home & Living', 'Pet Accessories': 'Pet', 'Gift Pack': 'Giveaways & Event Accessories',
};
const PB_SUB_OVERRIDE = { 'Toys & Games': 'Toys & Games', 'Sunglasses': 'Outdoor & Sports', 'Umbrellas': 'Outdoor & Sports' };
const FALLBACK_CAT = 'Giveaways & Event Accessories';

function authorised(request) {
  const key = new URL(request.url).searchParams.get('key');
  const probeKey = process.env.PROBE_KEY || process.env.TRENDS_PROBE_KEY;
  return !!probeKey && key === probeKey;
}

function trendsMapCategory(item) {
  const cats = item.categories;
  const names = [];
  (Array.isArray(cats) ? cats : []).forEach(c => {
    if (typeof c === 'string') names.push(c);
    else if (c && typeof c === 'object') { if (c.name) names.push(c.name); if (c.category) names.push(c.category); (c.subcategories || c.children || []).forEach?.(s => names.push(s?.name || s)); }
  });
  for (const n of names) if (TRENDS_SUB_OVERRIDE[n]) return { category: TRENDS_SUB_OVERRIDE[n], names };
  for (const n of names) if (TRENDS_CAT[n]) return { category: TRENDS_CAT[n], names };
  return { category: FALLBACK_CAT, names };
}

function pbMapCategory(prod) {
  const cats = Array.isArray(prod.Category) ? prod.Category : [];
  const names = [];
  cats.forEach(c => { if (c.Category_Name) names.push(c.Category_Name); (c.Child_Category || []).forEach(ch => ch.Category_Name && names.push(ch.Category_Name)); });
  for (const c of cats) for (const ch of (c.Child_Category || [])) if (PB_SUB_OVERRIDE[ch.Category_Name]) return { category: PB_SUB_OVERRIDE[ch.Category_Name], names };
  for (const c of cats) if (PB_CAT[c.Category_Name]) return { category: PB_CAT[c.Category_Name], names };
  return { category: FALLBACK_CAT, names };
}

// Lily 2026-07-23(第一轮回填发现):很多产品分类顶级映射表(TRENDS_CAT/PB_CAT)没覆盖到供应商
// 原始分类树里的这一层("Notebooks & Compendiums"/"Crossbody & Belt Bags"/"Bucket Hats"这些),
// 于是掉进兜底分类"Giveaways & Event Accessories"——这个兜底桶在 nav_subcategories 里本来就
// 没有子类,所以按兜底分类去找子类永远找不到。改成:如果供应商原始分类树里的某一层名字,
// 直接就是 nav_subcategories 里任何一个分类下的正式子类名,直接采用那个(分类,子类)组合,
// 不局限于当前(可能本来就错的)兜底分类——这样能顺便把分类本身也纠正过来。
function resolveSubcategoryGlobal(currentCategory, names, subByCategory, allSubEntries) {
  const cleanNames = (names || []).map(n => String(n || '').trim()).filter(Boolean);
  const valid = subByCategory?.get(currentCategory) || [];

  for (const n of cleanNames) {
    const hit = valid.find(v => v.toLowerCase() === n.toLowerCase());
    if (hit) return { category: currentCategory, subcategory: hit };
  }
  for (const n of cleanNames) {
    const low = n.toLowerCase();
    const hit = allSubEntries.find(e => e.subcategory.toLowerCase() === low);
    if (hit) return { category: hit.category, subcategory: hit.subcategory };
  }
  for (const n of cleanNames) {
    const low = n.toLowerCase();
    const hit = valid.find(v => low.includes(v.toLowerCase()) || v.toLowerCase().includes(low));
    if (hit) return { category: currentCategory, subcategory: hit };
  }
  for (const n of cleanNames) {
    const low = n.toLowerCase();
    const hit = allSubEntries.find(e => low.includes(e.subcategory.toLowerCase()) || e.subcategory.toLowerCase().includes(low));
    if (hit) return { category: hit.category, subcategory: hit.subcategory };
  }
  return null;
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

export async function GET(request) {
  if (!authorised(request)) return Response.json({ error: 'unauthorized' }, { status: 401 });
  const started = Date.now();
  const url = new URL(request.url);
  const dry = url.searchParams.get('dry') === '1';
  const limit = Math.max(1, parseInt(url.searchParams.get('limit') || '20', 10) || 20);
  const offset = Math.max(0, parseInt(url.searchParams.get('offset') || '0', 10) || 0);
  const db = sourcingDb();
  const trendsToken = process.env.TRENDS_API_TOKEN;
  const results = [];

  try {
    const { data: navSubs } = await db.from('nav_subcategories').select('category, subcategory');
    const subByCategory = new Map();
    const allSubEntries = [];
    (navSubs || []).forEach(r => {
      if (!r.category || !r.subcategory) return;
      if (!subByCategory.has(r.category)) subByCategory.set(r.category, []);
      subByCategory.get(r.category).push(r.subcategory);
      allSubEntries.push({ category: r.category, subcategory: r.subcategory });
    });

    const { data: allRows, error } = await db.from('products')
      .select('id, supplier, supplier_sku, category, subcategory')
      .in('supplier', ['Trends', 'PromoBrands']).gte('created_at', BATCH_SINCE)
      .is('subcategory', null)
      .order('id', { ascending: true });
    if (error) throw new Error(error.message);

    const todo = allRows || [];
    const rows = todo.slice(offset, offset + limit);

    // PB 产品要靠翻页扫目录才能拿原始数据,先收集这批要找的 code
    const pbNeed = new Map(rows.filter(r => r.supplier === 'PromoBrands').map(r => [String(r.supplier_sku).trim().toUpperCase(), r]));
    const pbFound = new Map();
    if (pbNeed.size) {
      const token = await pbIdToken();
      let after = 0;
      for (let i = 0; i < 60; i++) {
        if (!pbNeed.size || Date.now() - started > 40000) break;
        const qs = after > 0 ? `PageSize=100&Order=ASC&After=${after}` : 'PageSize=100&Order=ASC';
        const res = await fetch(`${PB_BASE}/product?${qs}`, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }, cache: 'no-store' });
        if (!res.ok) break;
        const list = await res.json().catch(() => null);
        if (!Array.isArray(list) || !list.length) break;
        for (const prod of list) {
          after = Math.max(after, Number(prod.Product_ID) || after);
          const codeU = String(prod.Product_Code || '').trim().toUpperCase();
          if (pbNeed.has(codeU)) { pbFound.set(codeU, prod); pbNeed.delete(codeU); }
        }
        if (list.length < 100) break;
      }
    }

    for (const row of rows) {
      try {
        let category, names;
        if (row.supplier === 'Trends') {
          const res = await fetch(`${TRENDS_BASE}/api/v1/products/${row.supplier_sku}.json`, {
            headers: { Authorization: `Bearer ${trendsToken}`, Accept: 'application/json' }, cache: 'no-store',
          });
          if (!res.ok) { results.push({ code: row.supplier_sku, result: `error: trends ${res.status}` }); continue; }
          const json = await res.json().catch(() => null);
          const item = json?.data?.[0] || json?.data;
          if (!item) { results.push({ code: row.supplier_sku, result: 'error: 原始数据取不到' }); continue; }
          ({ category, names } = trendsMapCategory(item));
        } else {
          const prod = pbFound.get(String(row.supplier_sku).trim().toUpperCase());
          if (!prod) { results.push({ code: row.supplier_sku, result: 'not found in PB catalog scan (time budget or gone)' }); continue; }
          ({ category, names } = pbMapCategory(prod));
        }
        const match = resolveSubcategoryGlobal(category || row.category, names, subByCategory, allSubEntries);
        if (!match) { results.push({ code: row.supplier_sku, result: `no match anywhere in nav_subcategories (names: ${(names || []).join(', ')})` }); continue; }
        const categoryChanged = match.category !== row.category;
        if (!dry) {
          const update = { subcategory: match.subcategory };
          if (categoryChanged) update.category = match.category;
          const { error: uErr } = await db.from('products').update(update).eq('id', row.id);
          if (uErr) throw new Error(uErr.message);
        }
        results.push({
          code: row.supplier_sku, subcategory: match.subcategory,
          category: categoryChanged ? `${row.category} -> ${match.category}` : row.category,
          result: dry ? 'would update' : 'updated',
        });
      } catch (e) {
        results.push({ code: row.supplier_sku, result: `error: ${String(e?.message || e).slice(0, 160)}` });
      }
    }

    const nextOffset = offset + rows.length;
    const remaining = todo.length - nextOffset;
    const nextUrl = `${url.origin}${url.pathname}?key=${url.searchParams.get('key')}${dry ? '&dry=1' : ''}&offset=${nextOffset}`;
    const hint = remaining > 0 ? `还有 ${remaining} 个待处理,下一步打开:${nextUrl}` : '这批全部处理完了';
    return Response.json({ dry, total_todo: todo.length, processed: rows.length, offset, next_offset: nextOffset, remaining, hint, next_url: remaining > 0 ? nextUrl : null, results, elapsed_s: Math.round((Date.now() - started) / 1000) });
  } catch (e) {
    return Response.json({ error: String(e?.message || e) }, { status: 500 });
  }
}

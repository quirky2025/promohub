import sharp from 'sharp';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { sourcingDb } from '@/lib/sourcingDb';
import { tierMargin, decoUnitPrice, SETUP_FEE } from '@/lib/pricing';
import { colourSlug, cleanColour } from '@/lib/colourName';

// Lily 2026-07-22: 供应商颜色字段有时不是真颜色,是描述性文字("Design your own" 之类的定制品说明)。
// 用 cleanColour() 识别——solid/compound 才是真颜色,原样用;其余(full_colour/placeholder/unknown)
// 一律显示 "Custom",不把供应商的原始措辞抄进色块名。IMAGE-RULES.md §二。
function displayColourName(raw) {
  const { name, mode } = cleanColour(raw);
  return (mode === 'solid' || mode === 'compound') && name ? name : 'Custom';
}

// MOQ 兜底:没有价格阶梯时(quote_only),先尝试从产品描述文字里抓 "MOQ ... 1,000" 这种写法,
// 抓不到才退回硬编码 50——50 只是占位,不是真实 MOQ,不能装作权威数字。
function moqFromText(text) {
  const m = String(text || '').match(/MOQ[^\d]{0,10}([\d,]{2,7})/i);
  if (!m) return null;
  const n = parseInt(m[1].replace(/,/g, ''), 10);
  return n > 0 ? n : null;
}

// D15 · API 产品导入器(Trends + PromoBrands)。规则文档:PRICING-RULES.md + IMAGE-RULES.md。
// - 全部创建为草稿(is_published=false),Lily 后台审核后发布
// - 定价:基础价 = 供应商价 × tierMargin(档位);印刷 = decoUnitPrice(成本);setup 固定 $60
//   (Trends/PB 服装按硬货处理 —— PRICING-RULES §3.1,Lily 2026-07-22)
// - 图片:原图 → sharp → w160/w400/w900 webp → R2(路径按 IMAGE-RULES §三)
// - 双表:products.colours = 色块(image/hex 二选一);product_colours(Default).images = 画廊(第0张=主图)
// - 幂等:已存在的 supplier_sku(任何状态)一律跳过 → 反复触发即分批推进
// 用法:
//   GET ?key=<PROBE_KEY>&supplier=trends&limit=6      分批导入 Trends 缺的
//   GET ?key=<PROBE_KEY>&supplier=pb&limit=6          分批导入 PB 缺的
//   GET ?key=<PROBE_KEY>&supplier=trends&inspect=133391   看单品原始 API 数据(调解析用)

export const maxDuration = 300;

const TRENDS_BASE = process.env.TRENDS_API_BASE || 'https://au.api.trends.nz';
const PB_TOKEN_URL = 'https://promobrandrestapi.auth.ap-southeast-2.amazoncognito.com/oauth2/token';
const PB_BASE = process.env.PROMOBRANDS_API_BASE || 'https://api.promobrands.com.au';
const R2_PUBLIC = process.env.R2_PUBLIC_BASE || 'https://pub-fbec7c9199f04af8ab95a413a4620d37.r2.dev';
const VARIANTS = [160, 400, 900];

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY },
});

function authorised(request) {
  const key = new URL(request.url).searchParams.get('key');
  const probeKey = process.env.PROBE_KEY || process.env.TRENDS_PROBE_KEY;
  return !!probeKey && key === probeKey;
}

const slugify = (s) => String(s || '').toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

// ── 类目映射(右侧必须是前台真实在用的主类目;未命中 → Giveaways 并记 warning)──
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

// ── 图片:下载 → 3 尺寸 webp → R2;返回 w400 公网 URL(失败返回 null 并记 warning)──
async function imageToR2(srcUrl, keyStem, warnings) {
  try {
    const res = await fetch(srcUrl, { cache: 'no-store' });
    if (!res.ok) { warnings.push(`img ${res.status}: ${srcUrl}`); return null; }
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 100) { warnings.push(`img empty: ${srcUrl}`); return null; }
    for (const w of VARIANTS) {
      const webp = await sharp(buf).resize({ width: w, withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
      const key = keyStem.replace('{w}', String(w));
      await r2.send(new PutObjectCommand({ Bucket: process.env.R2_BUCKET, Key: key, Body: webp, ContentType: 'image/webp' }));
    }
    return `${R2_PUBLIC}/${keyStem.replace('{w}', '400')}`;
  } catch (e) {
    warnings.push(`img fail ${srcUrl}: ${String(e?.message || e).slice(0, 80)}`);
    return null;
  }
}

async function existingSkus(db) {
  const set = new Set();
  const PAGE = 1000;
  for (let from = 0; ; from += PAGE) {
    const { data } = await db.from('products').select('supplier_sku').range(from, from + PAGE - 1);
    (data || []).forEach(p => p.supplier_sku && set.add(String(p.supplier_sku).toUpperCase()));
    if (!data || data.length < PAGE) break;
  }
  return set;
}

async function uniqueSlug(db, base) {
  let s = base || 'product';
  for (let i = 0; i < 20; i++) {
    const cand = i === 0 ? s : `${s}-${i + 1}`;
    const { data } = await db.from('products').select('id').eq('slug', cand).limit(1).maybeSingle();
    if (!data) return cand;
  }
  return `${s}-${Date.now()}`;
}

// ── 建品(草稿)+ 子表 ──
async function createProduct(db, row, tiers, decos, gallery) {
  row.is_published = false;
  const { data: created, error } = await db.from('products').insert(row).select('id').single();
  if (error) throw new Error(`products insert: ${error.message}`);
  const pid = created.id;
  if (tiers.length) {
    const { error: tErr } = await db.from('pricing_tiers').insert(tiers.map((t, i) => ({ ...t, product_id: pid, sort_order: i })));
    if (tErr) throw new Error(`pricing_tiers: ${tErr.message}`);
  }
  if (decos.length) {
    const { error: dErr } = await db.from('decoration_options').insert(decos.map((d, i) => ({ ...d, product_id: pid, sort_order: i })));
    if (dErr) throw new Error(`decoration_options: ${dErr.message}`);
  }
  const { error: cErr } = await db.from('product_colours').insert({ product_id: pid, name: 'Default', hex: '', images: gallery, sort_order: 0 });
  if (cErr) throw new Error(`product_colours: ${cErr.message}`);
  return pid;
}

// ════════ TRENDS ════════
async function trendsList(token, page) {
  const res = await fetch(`${TRENDS_BASE}/api/v1/products.json?page_size=250&page_no=${page}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }, cache: 'no-store',
  });
  if (!res.ok) throw new Error(`trends products.json ${res.status}`);
  return res.json();
}

function trendsMapCategory(item) {
  const cats = item.categories;
  const names = [];
  (Array.isArray(cats) ? cats : []).forEach(c => {
    if (typeof c === 'string') names.push(c);
    else if (c && typeof c === 'object') { if (c.name) names.push(c.name); if (c.category) names.push(c.category); (c.subcategories || c.children || []).forEach?.(s => names.push(s?.name || s)); }
  });
  for (const n of names) if (TRENDS_SUB_OVERRIDE[n]) return { category: TRENDS_SUB_OVERRIDE[n], hint: n };
  for (const n of names) if (TRENDS_CAT[n]) return { category: TRENDS_CAT[n], hint: n };
  return { category: FALLBACK_CAT, hint: names.join('/') || 'unmapped' };
}

function trendsTiers(item) {
  // pricing 结构未官宣,做最常见两种兼容:[{qty,price}] 或 {qty1..,price1..}
  const out = [];
  const p = item.pricing;
  if (Array.isArray(p)) {
    p.forEach(t => {
      const q = Number(t.qty ?? t.min_qty ?? t.quantity); const pr = Number(t.price ?? t.unit_price);
      if (q > 0 && pr > 0) out.push({ q, cost: pr });
    });
  } else if (p && typeof p === 'object') {
    for (let i = 1; i <= 8; i++) {
      const q = Number(p[`qty${i}`]); const pr = Number(p[`price${i}`]);
      if (q > 0 && pr > 0) out.push({ q, cost: pr });
    }
  }
  out.sort((a, b) => a.q - b.q);
  return out;
}

async function importTrends(db, started, limit, warningsAll) {
  const token = process.env.TRENDS_API_TOKEN;
  if (!token) throw new Error('Missing TRENDS_API_TOKEN');
  const have = await existingSkus(db);
  const results = [];
  let imported = 0;

  for (let page = 1; page < 40 && imported < limit; page++) {
    if (Date.now() - started > 230000) break;
    const json = await trendsList(token, page);
    const items = json?.data || [];
    if (!items.length) break;
    for (const item of items) {
      if (imported >= limit || Date.now() - started > 230000) break;
      const code = String(item.code || '');
      if (!code || have.has(code.toUpperCase())) continue;
      if (!/^active$/i.test(String(item.active || ''))) continue;
      const isSale = /\bsale\b/i.test(JSON.stringify(item.categories || '')) || /\bsale\b/i.test(String(item.status || ''));
      if (isSale) continue; // Lily 规则:Sale 货不进

      const warnings = [];
      try {
        // 图片:media.trends.nz/images/<code>_<n>.jpg → R2 扁平 <code>-<n>.webp
        const count = Math.min(Number(item.image_count) || 0, 12) || 6;
        const gallery = [];
        for (let n = 1; n <= count; n++) {
          const url = await imageToR2(
            `https://media.trends.nz/images/${code}_${n}.jpg`,
            `suppliers/trends/products/_variants/w{w}/${code}-${n}.webp`,
            n <= 2 ? warnings : [] // 只对前两张的失败记 warning,后面的可能本来就不存在
          );
          if (url) gallery.push(url);
          else if (n > (Number(item.image_count) || 0)) break;
        }
        if (!gallery.length) { results.push({ code, result: 'skipped: 无可用图片' }); continue; }

        const { category, hint } = trendsMapCategory(item);
        const colourNames = (Array.isArray(item.colours) ? item.colours : [])
          .map(c => (typeof c === 'string' ? c : c?.name)).filter(Boolean).slice(0, 24);
        // IMAGE-RULES §二:Trends 序号每产品不同,不自动配色图 → 色块用名字(前端 swatch 兜底 hex)
        const colours = colourNames.map(n => ({ name: displayColourName(n), hex: '', image: '' }));

        const specs = (Array.isArray(item.additional_specifications) ? item.additional_specifications : [])
          .filter(s => s?.specification && s?.description)
          .map(s => ({ name: s.specification, value: s.description }));
        const materials = (Array.isArray(item.additional_materials) ? item.additional_materials : [])
          .filter(m => m?.component && m?.material)
          .map(m => `${m.component}: ${m.material}`).join('\n');

        const costTiers = trendsTiers(item);
        if (!costTiers.length) warnings.push('pricing 结构未识别,tiers 为空(用 inspect 看原始数据)');
        const tiers = costTiers.map((t, i, arr) => ({
          min_qty: t.q,
          max_qty: arr[i + 1] ? arr[i + 1].q - 1 : null,
          base_price: Number((t.cost * tierMargin(i)).toFixed(2)),
        }));

        // 印刷方式:branding_options 结构未官宣 → 通用 Print 一条打底,细节后补
        const decos = [{
          name: 'Print Per Colour/Position', detail: 'Refer to product branding options',
          per_unit: decoUnitPrice(0.3), has_setup: true, setup_fee: SETUP_FEE,
          default_setup_qty: 1, setup_qty_editable: true, type: 'print',
        }];
        if (!Array.isArray(item.branding_options) || !item.branding_options.length) warnings.push('branding_options 空/未识别,印刷用了通用打底');

        const row = {
          supplier: 'Trends', supplier_sku: code,
          name: item.name || code,
          slug: await uniqueSlug(db, slugify(item.name || code)),
          category, subcategory: null,
          seo_description: String(item.description || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 400) || null,
          features: (Array.isArray(item.features) ? item.features : []).filter(Boolean).slice(0, 8),
          specs, materials: materials || null,
          dimensions: typeof item.dimensions === 'string' ? item.dimensions : null,
          colours, colour_slugs: colourNames.map(n => colourSlug(n)),
          packing: typeof item.packaging === 'string' ? item.packaging : null,
          // 无价格阶梯 = 走不了普通计算器,自动转"Get a Quote"模式(前台 quote_only,无 ref 价则显示 Price on application)
          quote_only: !costTiers.length,
          min_qty: costTiers[0]?.q || moqFromText(item.description) || 50,
        };
        await createProduct(db, row, tiers, decos, gallery);
        have.add(code.toUpperCase());
        imported++;
        results.push({ code, result: 'created (draft)', category, cat_hint: hint, images: gallery.length, tiers: tiers.length, warnings: warnings.length ? warnings : undefined });
      } catch (e) {
        results.push({ code, result: `error: ${String(e?.message || e).slice(0, 160)}` });
        warningsAll.push(code);
      }
    }
    if (page >= (json?.page_count || 1)) break;
  }
  return { imported, results };
}

// ════════ PROMOBRANDS ════════
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

function pbMapCategory(prod) {
  const cats = Array.isArray(prod.Category) ? prod.Category : [];
  for (const c of cats) for (const ch of (c.Child_Category || [])) if (PB_SUB_OVERRIDE[ch.Category_Name]) return { category: PB_SUB_OVERRIDE[ch.Category_Name], hint: ch.Category_Name };
  for (const c of cats) if (PB_CAT[c.Category_Name]) return { category: PB_CAT[c.Category_Name], hint: c.Category_Name };
  return { category: FALLBACK_CAT, hint: cats.map(c => c.Category_Name).join('/') || 'unmapped' };
}

function pbTiers(prod) {
  const t = prod?.Product_Price_Table?.Product_Price_table4; // Unbranded
  const out = [];
  if (t) for (let i = 1; i <= 7; i++) {
    const q = Number(t[`productPricetable4Qty${i}`]); const pr = Number(t[`productPricetable4Price${i}`]);
    if (q > 0 && pr > 0) out.push({ q, cost: pr });
  }
  return out.sort((a, b) => a.q - b.q);
}

async function importPB(db, started, limit) {
  const token = await pbIdToken();
  const have = await existingSkus(db);
  const results = [];
  let imported = 0;
  let after = 0;

  for (;;) {
    if (imported >= limit || Date.now() - started > 230000) break;
    const qs = after > 0 ? `PageSize=100&Order=ASC&After=${after}` : 'PageSize=100&Order=ASC';
    const res = await fetch(`${PB_BASE}/product?${qs}`, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }, cache: 'no-store' });
    if (!res.ok) throw new Error(`PB /product ${res.status}`);
    const list = await res.json().catch(() => null);
    if (!Array.isArray(list) || !list.length) break;

    for (const prod of list) {
      after = Math.max(after, Number(prod.Product_ID) || after);
      if (imported >= limit || Date.now() - started > 230000) break;
      const code = String(prod.Product_Code || '');
      if (!code || have.has(code.toUpperCase())) continue;

      const warnings = [];
      try {
        const sku = code.toLowerCase();
        // 画廊 = branded(bd_1 优先)→ R2 branded/<sku>/;色块 = unbranded 分色图 → R2 unbranded/<sku>/
        const branded = (prod.Product_Images?.productBrandedImages || []).slice(0, 8);
        const gallery = [];
        for (const img of branded) {
          if (!img?.mediaItemUrl) continue;
          const file = slugify(img.slug || img.mediaItemUrl.split('/').pop().replace(/\.\w+$/, ''));
          const url = await imageToR2(img.mediaItemUrl, `suppliers/promobrands/products/_variants/w{w}/branded/${sku}/${file}.webp`, warnings);
          if (url) gallery.push(url);
        }
        const unbranded = (prod.Product_Images?.productUnbrandedImages || []).slice(0, 24);
        const ubByColour = new Map();
        for (const img of unbranded) {
          if (!img?.mediaItemUrl) continue;
          const file = slugify(img.slug || img.mediaItemUrl.split('/').pop().replace(/\.\w+$/, ''));
          const url = await imageToR2(img.mediaItemUrl, `suppliers/promobrands/products/_variants/w{w}/unbranded/${sku}/${file}.webp`, warnings);
          if (!url) continue;
          const m = (img.mediaItemUrl.split('/').pop() || '').match(/_ub_(.+)\.\w+$/i);
          const colour = m ? m[1].replace(/[-_]+/g, ' ').trim() : '';
          ubByColour.set(colour.toLowerCase() || `c${ubByColour.size}`, { colour, url });
        }
        if (!gallery.length && !ubByColour.size) { results.push({ code, result: 'skipped: 无可用图片' }); continue; }
        if (!gallery.length) gallery.push([...ubByColour.values()][0].url);

        // 色块:库存里的颜色为准;有对应 ub 分色图用图,没有留给 swatch
        const invColours = (Array.isArray(prod.Inventory) ? prod.Inventory : [])
          .map(r => String(r?.InventoryDetails?.colour || '').trim()).filter(c => c && !/^misc$/i.test(c));
        const names = invColours.length ? [...new Set(invColours)] : (prod.Colour ? [prod.Colour] : ['Default']);
        const colours = names.map(n => {
          const hit = ubByColour.get(n.toLowerCase());
          return { name: displayColourName(n), hex: '', image: hit ? hit.url : '' };
        });

        const costTiers = pbTiers(prod);
        if (!costTiers.length) warnings.push('无 Unbranded 价格表,tiers 为空');
        const tiers = costTiers.map((t, i, arr) => ({
          min_qty: t.q, max_qty: arr[i + 1] ? arr[i + 1].q - 1 : null,
          base_price: Number((t.cost * tierMargin(i)).toFixed(2)),
        }));

        // 印刷方式(1-6)→ decoration_options;setup 固定 $60(PRICING-RULES §2.1/§3.1)
        const im = prod.Product_Imprint_Method || {};
        const decos = [];
        for (let i = 1; i <= 6; i++) {
          const des = im[`productImprintmethod${i}Des`];
          const cost = Number(im[`productImprintmethod${i}Cost`]);
          if (!des || !(cost > 0)) continue;
          decos.push({
            name: `${des} Per ${im[`productImprintmethod${i}Hascolour`] ? 'Colour/' : ''}Position`,
            detail: im[`productImprintmethod${i}Size`] || null,
            per_unit: decoUnitPrice(cost), has_setup: true, setup_fee: SETUP_FEE,
            default_setup_qty: 1, setup_qty_editable: true, type: 'print',
          });
        }
        if (!decos.length) warnings.push('无印刷方式(Imprint Method 字段空),decos 为空 — 发布前需人工补印刷方式和单价');

        const { category, hint } = pbMapCategory(prod);
        const specs = [];
        for (let i = 1; i <= 4; i++) {
          const n = prod[`Detail_Name_${i}`]; const v = prod[`Detail_Description_${i}`];
          if (n && v && !/material|dimension/i.test(n)) specs.push({ name: n, value: v });
        }
        const dimDetail = [1, 2, 3, 4].map(i => (/dimension/i.test(prod[`Detail_Name_${i}`] || '') ? prod[`Detail_Description_${i}`] : null)).find(Boolean);
        const matDetail = [1, 2, 3, 4].map(i => (/material/i.test(prod[`Detail_Name_${i}`] || '') ? prod[`Detail_Description_${i}`] : null)).find(Boolean);
        // MOQ 兜底(Lily 2026-07-22):没有价格阶梯时 min_qty 不能瞎猜 50——PB 有时把真实 MOQ
        // 放在 Detail_Name/Description 字段里(如 "MOQ"/"1000pcs"),没有才退到描述文字里找 "MOQ ... 数字"。
        const moqDetail = [1, 2, 3, 4]
          .map(i => (/moq/i.test(prod[`Detail_Name_${i}`] || '') ? String(prod[`Detail_Description_${i}`] || '').match(/([\d,]{2,7})/) : null))
          .map(m => (m ? parseInt(m[1].replace(/,/g, ''), 10) : null))
          .find(n => n > 0);

        const row = {
          supplier: 'PromoBrands', supplier_sku: code,
          name: prod.Name || code,
          slug: await uniqueSlug(db, slugify(prod.Name || code)),
          category, subcategory: null,
          seo_description: String(prod.Description || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 400) || null,
          features: (Array.isArray(prod.Hightlights) ? prod.Hightlights : []).map(h => h?.Highlights).filter(h => h && !/days service/i.test(h)).slice(0, 8),
          specs, materials: matDetail ? String(matDetail).replace(/•/g, '').trim() : null,
          dimensions: dimDetail || null,
          colours, colour_slugs: names.filter(n => n !== 'Default').map(n => colourSlug(n)),
          packing: prod.Packing || null,
          is_eco: prod.Is_Eco === 1,
          // 无价格阶梯 = 走不了普通计算器,自动转"Get a Quote"模式(前台 quote_only,无 ref 价则显示 Price on application)
          quote_only: !costTiers.length,
          // min_qty 优先级:价格阶梯第一档 > Detail 字段里标"MOQ"的 > 描述文字里的"MOQ ... 数字" > 兜底 50(占位,不代表真实值)
          min_qty: costTiers[0]?.q || moqDetail || moqFromText(prod.Description) || 50,
        };
        await createProduct(db, row, tiers, decos, gallery);
        have.add(code.toUpperCase());
        imported++;
        results.push({ code, result: 'created (draft)', category, cat_hint: hint, images: gallery.length + ubByColour.size, tiers: tiers.length, decos: decos.length, warnings: warnings.length ? warnings : undefined });
      } catch (e) {
        results.push({ code, result: `error: ${String(e?.message || e).slice(0, 160)}` });
      }
    }
    if (list.length < 100) break;
  }
  return { imported, results };
}

// ════════ 入口 ════════
export async function GET(request) {
  if (!authorised(request)) return Response.json({ error: 'unauthorized' }, { status: 401 });
  const started = Date.now();
  const url = new URL(request.url);
  const supplier = url.searchParams.get('supplier');
  const limit = Math.min(20, Math.max(1, parseInt(url.searchParams.get('limit') || '6', 10) || 6));
  const inspect = url.searchParams.get('inspect');
  const db = sourcingDb();

  try {
    if (inspect && supplier === 'trends') {
      const token = process.env.TRENDS_API_TOKEN;
      const res = await fetch(`${TRENDS_BASE}/api/v1/products/${inspect}.json`, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }, cache: 'no-store' });
      return Response.json({ inspect, status: res.status, body: await res.json().catch(() => null) });
    }
    if (supplier === 'trends') {
      const warningsAll = [];
      const r = await importTrends(db, started, limit, warningsAll);
      return Response.json({ supplier: 'Trends', ...r, elapsed_s: Math.round((Date.now() - started) / 1000), hint: r.imported >= limit ? '还有剩余,再开一次同样的 URL 继续' : '本轮扫完' });
    }
    if (supplier === 'pb') {
      const r = await importPB(db, started, limit);
      return Response.json({ supplier: 'PromoBrands', ...r, elapsed_s: Math.round((Date.now() - started) / 1000), hint: r.imported >= limit ? '还有剩余,再开一次同样的 URL 继续' : '本轮扫完' });
    }
    return Response.json({ error: 'supplier=trends|pb required' }, { status: 400 });
  } catch (e) {
    return Response.json({ error: String(e?.message || e) }, { status: 500 });
  }
}

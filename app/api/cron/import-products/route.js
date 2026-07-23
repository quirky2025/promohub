import sharp from 'sharp';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { sourcingDb } from '@/lib/sourcingDb';
import { tierMargin, decoUnitPrice, SETUP_FEE } from '@/lib/pricing';
import { colourSlug, cleanColour } from '@/lib/colourName';
import { COLOUR_SWATCH } from '@/lib/colourSwatch';

// Lily 2026-07-23(Windsor Tea Bottle S898.06 实测发现):PB 的 Inventory 里,基础款(没有配件)
// 有时把自己的品名词当"颜色"用,比如瓶子本体 colour:"Bottle",跟真正颜色变体 "Black Pouch"/
// "Pink Pouch" 混在一起——"Bottle" 根本不是颜色。规则:某颜色词是单个词、不含任何已知颜色词,
// 但兄弟颜色词里有含已知颜色词的,就把这个误用词过滤掉。
const KNOWN_COLOUR_WORDS = Object.keys(COLOUR_SWATCH).map(w => w.toLowerCase());
function hasKnownColourWord(name) {
  const low = String(name || '').toLowerCase();
  return KNOWN_COLOUR_WORDS.some(w => low.includes(w));
}
function dropNonColourInventoryTags(names) {
  if (names.length < 2) return names;
  const realOnes = names.filter(hasKnownColourWord);
  if (!realOnes.length) return names;
  return names.filter(n => hasKnownColourWord(n) || n.trim().includes(' '));
}

// Lily 2026-07-22: 供应商颜色字段有时不是真颜色,是描述性文字("Design your own" 之类的定制品说明)。
// 用 cleanColour() 识别——solid/compound 才是真颜色,原样用;其余(full_colour/placeholder/unknown)
// 一律显示 "Custom"。IMAGE-RULES.md §二硬规则:定制品 image 和 hex 都必须空,不能拿到什么图就配什么图
// (哪怕 unbranded 图集里刚好有同名文件也不行)——所以这里连 isCustom 一起返回,调用处强制清空 image/hex。
function displayColourName(raw) {
  const { name, mode } = cleanColour(raw);
  const isCustom = !((mode === 'solid' || mode === 'compound') && name);
  return { name: isCustom ? 'Custom' : name, isCustom };
}

// MOQ 兜底:没有价格阶梯时(quote_only),先尝试从产品描述文字里抓 "MOQ ... 1,000" 这种写法,
// 抓不到才退回硬编码 50——50 只是占位,不是真实 MOQ,不能装作权威数字。
function moqFromText(text) {
  const m = String(text || '').match(/MOQ[^\d]{0,10}([\d,]{2,7})/i);
  if (!m) return null;
  const n = parseInt(m[1].replace(/,/g, ''), 10);
  return n > 0 ? n : null;
}

// 去 HTML 标签 + 压空白,给两处用:seo_description(卡片下方短摘要,400 字)和
// description(Description tab 右栏正文,给长一点,2000 字)。Lily 2026-07-23:
// 导入器之前只填了 seo_description,PDP 的 Description 正文块靠 product.description
// 渲染,一直是空的——两个字段都要填,来源一样,只是截断长度不同。
function cleanText(raw, maxLen) {
  const s = String(raw || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return s ? s.slice(0, maxLen) : null;
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
  for (const n of names) if (TRENDS_SUB_OVERRIDE[n]) return { category: TRENDS_SUB_OVERRIDE[n], hint: n, names };
  for (const n of names) if (TRENDS_CAT[n]) return { category: TRENDS_CAT[n], hint: n, names };
  return { category: FALLBACK_CAT, hint: names.join('/') || 'unmapped', names };
}

// Lily 2026-07-23 发现"SUBCAT一次次是空的":之前 subcategory 一律硬写 null,从来没有真正
// 赋值过——不是某几个产品漏了,是全部产品都没有。改成:用供应商原始分类树里的每一层名字
// (names,包含比顶级 category 更细的子类名,比如 Trends 的"Drink Bottles"),去 nav_subcategories
// 正式分类表里找这个 category 下有没有对得上的 subcategory(先精确,再宽松包含匹配),
// 找到就用,找不到才留空(比硬写死 null 好,不会每个产品都空)。
// 第一轮回填实测发现:很多供应商原始分类名(比如"Notebooks & Compendiums"/"Crossbody & Belt
// Bags"/"Bucket Hats")没被顶级映射表(TRENDS_CAT/PB_CAT)覆盖,掉进兜底分类,而兜底分类在
// nav_subcategories 里没有子类,永远配不上——所以放宽:如果供应商原始分类树里任何一层名字,
// 直接就是 nav_subcategories 里"任何"分类下的正式子类名,直接采用那组(分类,子类),顺便把
// 分类本身也纠正过来,不局限于当前(可能本来就错的)兜底分类。
function resolveSubcategory(category, names, subByCategory, allSubEntries) {
  const cleanNames = (names || []).map(n => String(n || '').trim()).filter(Boolean);
  const valid = subByCategory?.get(category) || [];
  for (const n of cleanNames) {
    const hit = valid.find(v => v.toLowerCase() === n.toLowerCase());
    if (hit) return { category, subcategory: hit };
  }
  for (const n of cleanNames) {
    const low = n.toLowerCase();
    const hit = (allSubEntries || []).find(e => e.subcategory.toLowerCase() === low);
    if (hit) return { category: hit.category, subcategory: hit.subcategory };
  }
  for (const n of cleanNames) {
    const low = n.toLowerCase();
    const hit = valid.find(v => low.includes(v.toLowerCase()) || v.toLowerCase().includes(low));
    if (hit) return { category, subcategory: hit };
  }
  for (const n of cleanNames) {
    const low = n.toLowerCase();
    const hit = (allSubEntries || []).find(e => low.includes(e.subcategory.toLowerCase()) || e.subcategory.toLowerCase().includes(low));
    if (hit) return { category: hit.category, subcategory: hit.subcategory };
  }
  return { category, subcategory: null };
}

async function loadSubcategoryMap(db) {
  const { data } = await db.from('nav_subcategories').select('category, subcategory');
  const map = new Map();
  const all = [];
  (data || []).forEach(r => {
    if (!r.category || !r.subcategory) return;
    if (!map.has(r.category)) map.set(r.category, []);
    map.get(r.category).push(r.subcategory);
    all.push({ category: r.category, subcategory: r.subcategory });
  });
  map.__all = all; // 挂一个 __all 方便调用处直接拿到全量(Map 本身用 category 查子类列表)
  return map;
}

function trendsTiers(item) {
  // pricing 结构未官宣,兼容三种:① 扁平 [{qty,price}] ② {qty1..,price1..}
  // ③ Indent 结构 [{type,prices:[{quantity,price}],additional_costs:[...]}] ——2026-07-23 发现
  // 127014/107039 这类 Indent 产品用的是③,之前只认①/②,导致有真实价格表的产品被误判成
  // quote_only(前台整个变"Get a Quote"模式,颜色/印刷方式选择器全部消失)。
  const out = [];
  const p = item.pricing;
  if (Array.isArray(p)) {
    for (const block of p) {
      if (Array.isArray(block?.prices)) {
        for (const t of block.prices) {
          const q = Number(t.quantity ?? t.qty); const pr = Number(t.price ?? t.unit_price);
          if (q > 0 && pr > 0) out.push({ q, cost: pr });
        }
      } else {
        const q = Number(block.qty ?? block.min_qty ?? block.quantity); const pr = Number(block.price ?? block.unit_price);
        if (q > 0 && pr > 0) out.push({ q, cost: pr });
      }
    }
  } else if (p && typeof p === 'object') {
    for (let i = 1; i <= 8; i++) {
      const q = Number(p[`qty${i}`]); const pr = Number(p[`price${i}`]);
      if (q > 0 && pr > 0) out.push({ q, cost: pr });
    }
  }
  out.sort((a, b) => a.q - b.q);
  return out;
}

// Indent 结构的 pricing[].additional_costs 里 type='DO' 才是真实印刷方式(type='DS' 是
// Pre-Production Sample 这类样品费,不算印刷方式,排除)。description/branding_area 已经是
// 现成的干净格式("Screen Print (two colour max)" / "Sides - 150mm x 320mm..."),直接用,不用再拼。
function trendsBrandingCosts(item) {
  const p = Array.isArray(item.pricing) ? item.pricing : [];
  return p.flatMap(block => (Array.isArray(block?.additional_costs) ? block.additional_costs : []))
    .filter(ac => ac?.type === 'DO' && ac?.description);
}

// Indent 产品的运输方式(Sea/Air)决定交期文案;lead time 原文来自 additional_specifications
// 里的 "Production Lead Time",是自由文字(如"14-16 weeks, sampling is additional time"),
// 不是纯数字——存原文,前台模板要能直接展示整句而不是硬拼"X business days"。
function trendsIndentInfo(item) {
  const first = Array.isArray(item.pricing) ? item.pricing[0] : null;
  const type = String(first?.type || '').toLowerCase();
  const indentType = /sea/.test(type) ? 'indent_sea' : /air/.test(type) ? 'indent_air' : null;
  const leadSpec = (Array.isArray(item.additional_specifications) ? item.additional_specifications : [])
    .find(s => /lead time/i.test(s?.specification || ''));
  return { indentType, indentLeadTime: leadSpec?.description || null };
}

async function importTrends(db, started, limit, warningsAll, subByCategory) {
  const token = process.env.TRENDS_API_TOKEN;
  if (!token) throw new Error('Missing TRENDS_API_TOKEN');
  const have = await existingSkus(db);
  const results = [];
  let imported = 0;
  // Lily 2026-07-23:之前"本轮扫完"只看 imported<limit,但真正原因常常是图片下载/R2上传太慢
  // 撞到 230s 时间预算提前收工,不是真的扫完供应商全部页——两种情况混报导致"以为导完了"。
  // 分开记录:timedOut=true 才是"还没扫完,只是没时间了",不能报 本轮扫完。
  let timedOut = false;

  outer:
  for (let page = 1; page < 40 && imported < limit; page++) {
    if (Date.now() - started > 230000) { timedOut = true; break; }
    const json = await trendsList(token, page);
    const items = json?.data || [];
    if (!items.length) break;
    for (const item of items) {
      if (imported >= limit) break;
      if (Date.now() - started > 230000) { timedOut = true; break outer; }
      const code = String(item.code || '').trim();
      if (!code || have.has(code.toUpperCase())) continue;
      if (!/^active$/i.test(String(item.active || ''))) continue;
      const isSale = /\bsale\b/i.test(JSON.stringify(item.categories || '')) || /\bsale\b/i.test(String(item.status || ''));
      if (isSale) continue; // Lily 规则:Sale 货不进

      const warnings = [];
      try {
        // 图片:优先用 item.images[].link(API 原始真实地址,最可靠)。
        // 2026-07-23 发现:猜文件名的旧写法(下划线分隔、从 1 开始编号,如 <code>_1.jpg)
        // 和 Trends 实际地址(连字符分隔、从 0 开始编号,如 129451-0.jpg ~ 129451-4.jpg)对不上,
        // 导致一整批新品(129xxx/133xxx 段)全部误判"无可用图片"。IMAGE-RULES.md 也提过
        // Trends 编号规律每个产品不同,不该硬猜——有真实 link 就直接用,没有才退回猜测兜底。
        const rawImages = Array.isArray(item.images) ? item.images : [];
        const gallery = [];
        // Lily 2026-07-23(107039 实测):item.images[] 每张图其实自带 caption 字段(如
        // "Bright Green"/"Dark Green"),跟 colours 字符串里的颜色名精确对得上,不是瞎猜文件名——
        // 这个可以放心拿来配色块真实照片。注意 colour 字段(小写、粗粒度)不能用来配,
        // 比如 Bright Green 和 Dark Green 的 colour 字段都是 "green",分不清是哪个,
        // 必须用 caption(跟 colours 字符串里的名字一模一样)才能精确对应。
        const imgByColour = new Map();
        if (rawImages.length) {
          let n = 0;
          for (const im of rawImages.slice(0, 12)) {
            const link = String(im?.link || im?.url || '').trim().replace(/^\/\//, 'https://');
            if (!link) continue;
            n += 1;
            const url = await imageToR2(
              link,
              `suppliers/trends/products/_variants/w{w}/${code}-${n}.webp`,
              n <= 2 ? warnings : []
            );
            if (url) {
              gallery.push(url);
              const captionTag = String(im?.caption || '').trim().toLowerCase();
              if (captionTag && !imgByColour.has(captionTag)) imgByColour.set(captionTag, url);
            }
          }
        }
        if (!gallery.length) {
          // 兜底:猜测地址,连字符分隔、从 0 开始编号(与实测数据一致)
          const count = Math.min(Number(item.image_count) || 0, 12) || 6;
          for (let n = 0; n < count; n++) {
            const url = await imageToR2(
              `https://media.trends.nz/images/${code}-${n}.jpg`,
              `suppliers/trends/products/_variants/w{w}/${code}-${n + 1}.webp`,
              n <= 1 ? warnings : []
            );
            if (url) gallery.push(url);
            else if (n >= (Number(item.image_count) || 0)) break;
          }
        }
        if (!gallery.length) { results.push({ code, result: 'skipped: 无可用图片' }); continue; }

        const { category: catGuess, hint, names: catNames } = trendsMapCategory(item);
        const { category, subcategory } = resolveSubcategory(catGuess, catNames, subByCategory, subByCategory.__all);
        // Lily 2026-07-23(107039 真实数据实锤):item.colours 根本不是数组,是逗号分隔的字符串
        // (如 "Clear, Yellow, Orange...Black." 结尾还带句号),之前按数组解析永远得到空数组,
        // 导致 Trends 产品的"选择颜色"那一步整个消失。改成按逗号拆字符串,顺手去掉结尾句号。
        const colourNames = String(item.colours || '').replace(/\.\s*$/, '')
          .split(',').map(s => s.trim()).filter(Boolean).slice(0, 24);
        // 有真实颜色照片(caption 精确匹配)就用,没有的(Custom/未识别)才交给前端用 hex/主图兜底
        const colours = colourNames.map(n => {
          const { name: label, isCustom } = displayColourName(n);
          if (isCustom) return { name: label, hex: '', image: '' };
          const hit = imgByColour.get(n.toLowerCase());
          return { name: label, hex: '', image: hit || '' };
        });

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

        // 印刷方式:Indent 结构(pricing[].additional_costs,type='DO')有真实方式名+尺寸+单价,
        // 直接用;没有这个结构的(非 Indent 的普通产品)才退回通用 Print 打底。
        const brandingCosts = trendsBrandingCosts(item);
        const decos = brandingCosts.length
          ? brandingCosts.map(ac => ({
              name: ac.description,
              detail: ac.branding_area || null,
              per_unit: decoUnitPrice(Number(ac.unit_price) || 0),
              // Lily 2026-07-23:之前这里信了供应商原始 setup_price,供应商写 0 我们就显示 $0。
              // 家规是只要有印刷方式,setup 一律固定收 $60(PRICING-RULES §2.1/§3.1),不管供应商
              // 自己报价是多少 —— 跟 PB 那边的逻辑对齐,不再看供应商原始值。
              has_setup: true,
              setup_fee: SETUP_FEE,
              default_setup_qty: 1, setup_qty_editable: true, type: 'print',
            }))
          : [{
              name: 'Print Per Colour/Position', detail: 'Refer to product branding options',
              per_unit: decoUnitPrice(0.3), has_setup: true, setup_fee: SETUP_FEE,
              default_setup_qty: 1, setup_qty_editable: true, type: 'print',
            }];
        if (!brandingCosts.length && (!Array.isArray(item.branding_options) || !item.branding_options.length)) warnings.push('branding_options 空/未识别,印刷用了通用打底');

        const { indentType, indentLeadTime } = trendsIndentInfo(item);
        const featuresJoined = (Array.isArray(item.features) ? item.features : []).filter(Boolean).join('. ');

        const row = {
          supplier: 'Trends', supplier_sku: code,
          name: item.name || code,
          slug: await uniqueSlug(db, slugify(item.name || code)),
          category, subcategory,
          // Lily 2026-07-23(107039 实测):有些 Trends 产品 description 字段源头就是空字符串
          // (不是抓取失败),但 features 数组有真实卖点文字——description 全空时用 features
          // 拼一段兜底,不要让 Description tab 整个空着。
          seo_description: cleanText(item.description, 400) || cleanText(featuresJoined, 400),
          description: cleanText(item.description, 2000) || cleanText(featuresJoined, 2000),
          features: (Array.isArray(item.features) ? item.features : []).filter(Boolean).slice(0, 8),
          specs, materials: materials || null,
          dimensions: typeof item.dimensions === 'string' ? item.dimensions : null,
          colours, colour_slugs: colourNames.map(n => colourSlug(n)),
          packing: typeof item.packaging === 'string' ? item.packaging : null,
          // 无价格阶梯 = 走不了普通计算器,自动转"Get a Quote"模式(前台 quote_only,无 ref 价则显示 Price on application)
          quote_only: !costTiers.length,
          min_qty: costTiers[0]?.q || moqFromText(item.description) || 50,
          indent_type: indentType,
          indent_lead_time: indentLeadTime,
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
  return { imported, results, timedOut };
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
  const names = [];
  cats.forEach(c => { if (c.Category_Name) names.push(c.Category_Name); (c.Child_Category || []).forEach(ch => ch.Category_Name && names.push(ch.Category_Name)); });
  for (const c of cats) for (const ch of (c.Child_Category || [])) if (PB_SUB_OVERRIDE[ch.Category_Name]) return { category: PB_SUB_OVERRIDE[ch.Category_Name], hint: ch.Category_Name, names };
  for (const c of cats) if (PB_CAT[c.Category_Name]) return { category: PB_CAT[c.Category_Name], hint: c.Category_Name, names };
  return { category: FALLBACK_CAT, hint: cats.map(c => c.Category_Name).join('/') || 'unmapped', names };
}

// Lily 2026-07-23(D435 Discovery A5 Notebook 实测,第二版):价格档编号(table1/table4/table5..)
// 每个产品不固定——D435 的"Unbranded"在 table5,S898.06 的"Unbranded"却在 table4,不能按编号猜。
// 唯一可靠的是每个表自带的 Des 文字("Unbranded"/"10 Days Service"..)。改成先扫全部表找
// Des 含"Unbranded"的那个;找不到就退而求其次,挑第一个有真实数据的表(不能整体没价格)。
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
  if (!chosen) {
    for (const k of keys) {
      const t = table[k];
      if (hasData(t, prefixOf(k))) { chosen = { t, prefix: prefixOf(k) }; break; }
    }
  }

  const out = [];
  if (chosen) for (let i = 1; i <= 7; i++) {
    const q = Number(chosen.t[`${chosen.prefix}Qty${i}`]); const pr = Number(chosen.t[`${chosen.prefix}Price${i}`]);
    if (q > 0 && pr > 0) out.push({ q, cost: pr });
  }
  return out.sort((a, b) => a.q - b.q);
}

async function importPB(db, started, limit, subByCategory) {
  const token = await pbIdToken();
  const have = await existingSkus(db);
  const results = [];
  let imported = 0;
  let after = 0;
  // 见 importTrends 同一条注释:分开记录时间预算截断 vs 真正扫完供应商全部页。
  let timedOut = false;

  outer:
  for (;;) {
    if (imported >= limit) break;
    if (Date.now() - started > 230000) { timedOut = true; break; }
    const qs = after > 0 ? `PageSize=100&Order=ASC&After=${after}` : 'PageSize=100&Order=ASC';
    const res = await fetch(`${PB_BASE}/product?${qs}`, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }, cache: 'no-store' });
    if (!res.ok) throw new Error(`PB /product ${res.status}`);
    const list = await res.json().catch(() => null);
    if (!Array.isArray(list) || !list.length) break;

    for (const prod of list) {
      after = Math.max(after, Number(prod.Product_ID) || after);
      if (imported >= limit) break;
      if (Date.now() - started > 230000) { timedOut = true; break outer; }
      const code = String(prod.Product_Code || '').trim(); // PB 偶尔带尾随空格(如 "S940 "),不清掉会存进 supplier_sku 里
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
          // Lily 2026-07-23(S898.06/S777 两个真实例子发现):PB 文件名根本不是 "_ub_<颜色>"
          // 这种模式(实际是 Windsor_Black_Unbranded.jpg / S777_UB_1.jpg 这种五花八门的格式),
          // 猜文件名从一开始就是错的。API 其实直接给了 img.colour 字段,应该直接读,猜文件名只
          // 作最后兜底(img.colour 缺失时)。"Unbranded"/空 不算真颜色,不进匹配池(只进画廊)。
          let colour = String(img.colour || '').trim();
          if (!colour || /^unbranded$/i.test(colour)) {
            const m = (img.mediaItemUrl.split('/').pop() || '').match(/_ub_(.+)\.\w+$/i);
            colour = m ? m[1].replace(/[-_]+/g, ' ').trim() : '';
          }
          if (!colour) continue;
          ubByColour.set(colour.toLowerCase(), { colour, url });
        }
        if (!gallery.length && !ubByColour.size) { results.push({ code, result: 'skipped: 无可用图片' }); continue; }
        if (!gallery.length) gallery.push([...ubByColour.values()][0].url);

        // 库存颜色名和图片颜色名经常对不上("Black Pouch" vs "Black","Light Green" vs "Green"),
        // 先精确匹配,不行再互相包含匹配(大小写不敏感),两边都对不上才留空(交给人工/主图兜底)。
        function findUbImage(name) {
          const key = name.toLowerCase();
          if (ubByColour.has(key)) return ubByColour.get(key);
          for (const [k, v] of ubByColour) { if (key.includes(k) || k.includes(key)) return v; }
          return null;
        }

        // 色块:库存里的颜色为准;有对应 ub 分色图用图,没有留给 swatch
        const invColours = (Array.isArray(prod.Inventory) ? prod.Inventory : [])
          .map(r => String(r?.InventoryDetails?.colour || '').trim()).filter(c => c && !/^misc$/i.test(c));
        const dedupedInv = [...new Set(invColours)];
        const names = dedupedInv.length ? dropNonColourInventoryTags(dedupedInv) : (prod.Colour ? [prod.Colour] : ['Default']);
        const colours = names.map(n => {
          const { name: label, isCustom } = displayColourName(n);
          if (isCustom) return { name: label, hex: '', image: '' }; // IMAGE-RULES §二:定制品 image/hex 都必须空
          const hit = findUbImage(n);
          return { name: label, hex: '', image: hit ? hit.url : '' };
        });

        const costTiers = pbTiers(prod);
        if (!costTiers.length) warnings.push('无 Unbranded 价格表,tiers 为空');
        const tiers = costTiers.map((t, i, arr) => ({
          min_qty: t.q, max_qty: arr[i + 1] ? arr[i + 1].q - 1 : null,
          base_price: Number((t.cost * tierMargin(i)).toFixed(2)),
        }));

        // 印刷方式(1-6)→ decoration_options;setup 固定 $60(PRICING-RULES §2.1/§3.1)
        // Lily 2026-07-23:PB 原始 Des 字段会把位置/尺寸变体(Front)/(Side)/(Medium)/(Small)
        // 和个别方式的独立 MOQ("| 250 MOQ")一起写在方式名字里,拼出来的名字很别扭("Digital
        // Transfer (Front) Per Colour/Position"),而且部分产品同一产品不同印刷方式起订量不同,
        // 之前这个信息被埋没在名字里看不出来。改成:名字只留干净的方式名,(Front)/(Side)/MOQ
        // 一律挪到 detail(尺寸那一行)最前面,和 Front 的其它 UI 一致展示位置说明。
        const im = prod.Product_Imprint_Method || {};
        const decos = [];
        for (let i = 1; i <= 6; i++) {
          let des = im[`productImprintmethod${i}Des`];
          const cost = Number(im[`productImprintmethod${i}Cost`]);
          if (!des || !(cost > 0)) continue;
          des = String(des).trim();
          let qualifier = '';
          const parenMatch = des.match(/\s*\(([^)]+)\)\s*$/);
          if (parenMatch) { qualifier = parenMatch[1]; des = des.slice(0, parenMatch.index).trim(); }
          let moqOverride = null;
          const moqMatch = des.match(/\|\s*(\d[\d,]*)\s*MOQ\s*$/i);
          if (moqMatch) { moqOverride = parseInt(moqMatch[1].replace(/,/g, ''), 10); des = des.slice(0, moqMatch.index).trim().replace(/\|\s*$/, '').trim(); }
          const size = im[`productImprintmethod${i}Size`] || null;
          // Lily 2026-07-23:站内已有产品(Logoline 等)的真实格式是 "Front - 25 x 15mm"
          // (位置 + 短横线 + 尺寸,没有括号/中点),照现成标准对齐,不要自创格式。
          let detail = qualifier && size ? `${qualifier} - ${size}` : (size || qualifier || null);
          if (moqOverride > 0) detail = detail ? `${detail} (${moqOverride} MOQ)` : `${moqOverride} MOQ`;
          decos.push({
            name: `${des} Per ${im[`productImprintmethod${i}Hascolour`] ? 'Colour/' : ''}Position`,
            detail,
            per_unit: decoUnitPrice(cost), has_setup: true, setup_fee: SETUP_FEE,
            default_setup_qty: 1, setup_qty_editable: true, type: 'print',
          });
        }
        if (!decos.length) warnings.push('无印刷方式(Imprint Method 字段空),decos 为空 — 发布前需人工补印刷方式和单价');

        const { category: catGuess, hint, names: catNames } = pbMapCategory(prod);
        const { category, subcategory } = resolveSubcategory(catGuess, catNames, subByCategory, subByCategory.__all);
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
          category, subcategory,
          seo_description: cleanText(prod.Description, 400),
          description: cleanText(prod.Description, 2000),
          // Lily 2026-07-23:发现批量导入的 PB 产品 Features 几乎全空,怀疑是字段名对不上
          // (原来只认 prod.Hightlights,拼写可能跟 PB 实际字段不一致)——两种拼法都认,保险。
          features: (Array.isArray(prod.Hightlights) ? prod.Hightlights : Array.isArray(prod.Highlights) ? prod.Highlights : [])
            .map(h => (typeof h === 'string' ? h : h?.Highlights || h?.Highlight || h?.highlight))
            .filter(h => h && !/days service/i.test(h)).slice(0, 8),
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
  return { imported, results, timedOut };
}

// ════════ 入口 ════════
export async function GET(request) {
  if (!authorised(request)) return Response.json({ error: 'unauthorized' }, { status: 401 });
  const started = Date.now();
  const url = new URL(request.url);
  const supplier = url.searchParams.get('supplier');
  // Lily 2026-07-23:去掉 20 的硬顶——真正的天花板是下面 230s 的时间预算(图片下载/R2上传
  // 慢才是瓶颈),limit 设再高也不会因此跑更久,只是不再人为卡在一个偏低的数字上。
  const limit = Math.max(1, parseInt(url.searchParams.get('limit') || '15', 10) || 15);
  const inspect = url.searchParams.get('inspect');
  const db = sourcingDb();

  try {
    if (inspect && supplier === 'trends') {
      const token = process.env.TRENDS_API_TOKEN;
      const res = await fetch(`${TRENDS_BASE}/api/v1/products/${inspect}.json`, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }, cache: 'no-store' });
      return Response.json({ inspect, status: res.status, body: await res.json().catch(() => null) });
    }
    // PB 没有单条查询接口(见 backfill-description 同款注释),只能翻页找,加个时间预算防超时。
    if (inspect && supplier === 'pb') {
      const token = await pbIdToken();
      let after = 0;
      for (let i = 0; i < 60; i++) {
        if (Date.now() - started > 25000) return Response.json({ inspect, found: false, reason: 'timeout while paging' });
        const qs = after > 0 ? `PageSize=100&Order=ASC&After=${after}` : 'PageSize=100&Order=ASC';
        const res = await fetch(`${PB_BASE}/product?${qs}`, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }, cache: 'no-store' });
        if (!res.ok) return Response.json({ inspect, found: false, reason: `PB ${res.status}` });
        const list = await res.json().catch(() => null);
        if (!Array.isArray(list) || !list.length) break;
        for (const prod of list) {
          after = Math.max(after, Number(prod.Product_ID) || after);
          if (String(prod.Product_Code || '').trim().toUpperCase() === String(inspect).trim().toUpperCase()) {
            return Response.json({ inspect, found: true, body: prod });
          }
        }
        if (list.length < 100) break;
      }
      return Response.json({ inspect, found: false, reason: 'not in catalog scan' });
    }
    if (supplier === 'trends') {
      const warningsAll = [];
      const subByCategory = await loadSubcategoryMap(db);
      const r = await importTrends(db, started, limit, warningsAll, subByCategory);
      // Lily 2026-07-23:imported<limit 不等于"扫完了"——常常是图片下载/R2上传太慢撞了 230s
      // 时间预算,提前收工。timedOut=true 时必须说明"还没扫完",不能报 本轮扫完。
      const hint = r.imported >= limit ? '还有剩余,再开一次同样的 URL 继续'
        : r.timedOut ? '时间用完提前收工,不代表扫完,再开一次同样的 URL 继续'
        : '本轮扫完';
      return Response.json({ supplier: 'Trends', ...r, elapsed_s: Math.round((Date.now() - started) / 1000), hint });
    }
    if (supplier === 'pb') {
      const subByCategory = await loadSubcategoryMap(db);
      const r = await importPB(db, started, limit, subByCategory);
      const hint = r.imported >= limit ? '还有剩余,再开一次同样的 URL 继续'
        : r.timedOut ? '时间用完提前收工,不代表扫完,再开一次同样的 URL 继续'
        : '本轮扫完';
      return Response.json({ supplier: 'PromoBrands', ...r, elapsed_s: Math.round((Date.now() - started) / 1000), hint });
    }
    return Response.json({ error: 'supplier=trends|pb required' }, { status: 400 });
  } catch (e) {
    return Response.json({ error: String(e?.message || e) }, { status: 500 });
  }
}

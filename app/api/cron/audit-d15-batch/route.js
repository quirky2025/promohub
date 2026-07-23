import { sourcingDb } from '@/lib/sourcingDb';

// D15 补漏 · 系统性扫描整批(Lily 2026-07-23 说"几乎每个都有问题",不能再靠人工一个个点开找了)。
// 一次性把今天导入的 Trends+PB 全部产品拉一遍,检查已知的几类问题模式,输出一份完整清单:
//   - subcategory 是空的,或者 category+subcategory 组合不在 nav_subcategories 正式分类表里
//   - colours 是空数组(选颜色步骤会消失)
//   - features 是空的(Features 标签页会是空的)
//   - description 是空的
//   - 没有 product_stock 记录(库存同步还没跑到这个产品)
//   - 同一产品里有两个颜色共用同一张图(颜色图片错位/串了的强信号)
//   - 产品名字带有明显强烈提示词、但分类跟提示词对不上(比如名字里有"Power Bank"但分类是
//     "Office & Desk"不是"Tech")——这一类只是提示,不是 100% 一定错,需要人工确认
// 用法:GET /api/cron/audit-d15-batch?key=<PROBE_KEY>

export const maxDuration = 60;

const BATCH_SINCE = '2026-07-22 00:00:00';

function authorised(request) {
  const key = new URL(request.url).searchParams.get('key');
  const probeKey = process.env.PROBE_KEY || process.env.TRENDS_PROBE_KEY;
  return !!probeKey && key === probeKey;
}

// 提示词只用来"怀疑",不用来自动改——分类判断最终还是要人来定。
const CATEGORY_KEYWORDS = {
  'Tech': ['power bank', 'powerbank', 'charger', 'charging', 'cable', 'speaker', 'earbud', 'headphone', 'bluetooth', ' usb', 'wireless charg', 'phone stand', 'device stand', 'phone holder', 'earphone'],
  'Drinkware': [' bottle', ' mug', 'tumbler', ' flask', ' cup ', 'drinkware'],
  'Bags': [' bag', 'tote', 'backpack', 'satchel', 'duffle'],
  'Pens': [' pen ', ' pens', 'stylus', 'ballpoint'],
  'Headwear': [' cap ', 'beanie', ' hat ', 'bucket hat'],
  'Apparel': ['t-shirt', 'polo', 'hoodie', 'jacket', 'sweatshirt'],
  'Office & Desk': ['notebook', 'notepad', 'sticky note', 'desk mat', 'jigsaw'],
};

function suspiciousCategory(name, category) {
  const low = ` ${String(name || '').toLowerCase()} `;
  for (const [cat, kws] of Object.entries(CATEGORY_KEYWORDS)) {
    if (cat === category) continue;
    if (kws.some((kw) => low.includes(kw))) return cat;
  }
  return null;
}

export async function GET(request) {
  if (!authorised(request)) return Response.json({ error: 'unauthorized' }, { status: 401 });
  const db = sourcingDb();

  try {
    const { data: navSubs, error: navErr } = await db.from('nav_subcategories').select('category, subcategory');
    if (navErr) throw new Error(`nav_subcategories: ${navErr.message}`);
    const validPairs = new Set((navSubs || []).map((r) => `${r.category}|||${r.subcategory}`));

    const { data: rows, error } = await db.from('products')
      .select('id, supplier, supplier_sku, name, slug, category, subcategory, colours, features, description, display_title')
      .in('supplier', ['Trends', 'PromoBrands'])
      .gte('created_at', BATCH_SINCE);
    if (error) throw new Error(`products: ${error.message}`);

    const { data: stockRows, error: stockErr } = await db.from('product_stock').select('product_id');
    if (stockErr) throw new Error(`product_stock: ${stockErr.message}`);
    const stockedIds = new Set((stockRows || []).map((r) => r.product_id));

    const issues = [];
    const summary = {};
    const bump = (k) => { summary[k] = (summary[k] || 0) + 1; };

    for (const p of rows || []) {
      const flags = [];
      if (!p.subcategory) { flags.push('subcategory_empty'); bump('subcategory_empty'); }
      else if (!validPairs.has(`${p.category}|||${p.subcategory}`)) { flags.push(`subcategory_not_in_taxonomy(${p.category} / ${p.subcategory})`); bump('subcategory_not_in_taxonomy'); }

      if (!Array.isArray(p.colours) || p.colours.length === 0) { flags.push('colours_empty'); bump('colours_empty'); }
      if (!Array.isArray(p.features) || p.features.length === 0) { flags.push('features_empty'); bump('features_empty'); }
      if (!p.description) { flags.push('description_empty'); bump('description_empty'); }
      if (!stockedIds.has(p.id)) { flags.push('no_stock_row'); bump('no_stock_row'); }
      if (p.display_title && /\b[A-Z0-9]{2,}[.\-]?[A-Z0-9]*\b/.test(p.supplier_sku) && p.display_title.toUpperCase().includes(String(p.supplier_sku).replace(/\.MTO$/i, '').toUpperCase())) {
        flags.push('display_title_still_has_sku'); bump('display_title_still_has_sku');
      }

      if (Array.isArray(p.colours)) {
        const imgs = p.colours.map((c) => c?.image).filter(Boolean);
        if (imgs.length > 1 && new Set(imgs).size < imgs.length) { flags.push('duplicate_colour_images'); bump('duplicate_colour_images'); }
      }

      const catGuess = suspiciousCategory(p.name, p.category);
      if (catGuess) { flags.push(`category_maybe_wrong(should_be_${catGuess}?)`); bump('category_maybe_wrong'); }

      if (flags.length) {
        issues.push({ code: p.supplier_sku, name: p.name, slug: p.slug, category: p.category, subcategory: p.subcategory, flags });
      }
    }

    return Response.json({ total_scanned: (rows || []).length, total_flagged: issues.length, summary, issues });
  } catch (e) {
    return Response.json({ error: String(e?.message || e) }, { status: 500 });
  }
}

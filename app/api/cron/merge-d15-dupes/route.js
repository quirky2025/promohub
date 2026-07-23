import { sourcingDb } from '@/lib/sourcingDb';

// D15 补漏 · 一次性合并"新草稿行 vs 老已发布行"重复 SKU。
// 根因:D15 批量导入时,凡是 trim(supplier_sku) 已存在(任何状态)本该跳过,但历史上有些老产品
// 的 supplier_sku 带了前后空格(比如 "D436 "),trim 前不算重复,于是又建了一条新的草稿行,
// 新行 subcategory/colours 是这次全部修好的,但它是草稿(is_published=false),前台完全看不到——
// 前台一直显示的是"老的那条已发布行",所以 Lily 反复看到"改了怎么还是没变"。
// 策略(保守,不动 category,只补字段+删草稿行):
//   - old(已发布) 保留 category、slug、is_published 不变(已上线过,category 默认信老的)
//   - old.subcategory ← new.subcategory(新行走的是 nav_subcategories 正式表解析,权威)
//   - old.colours ← new.colours(修了 trim/假颜色的 bug)
//   - old.features/description/display_title/materials/dimensions/packing/alt_text
//     仅当 old 对应字段为空/null 时,才用 new 补上(不覆盖老行已有内容)
//   - 合并完删除 new(草稿)行
// 用法:GET /api/cron/merge-d15-dupes?key=<PROBE_KEY>&dry=1   先看一遍要改什么,不写库
//       GET /api/cron/merge-d15-dupes?key=<PROBE_KEY>        真正执行

export const maxDuration = 60;
const BATCH_SINCE = '2026-07-22 00:00:00';

function authorised(request) {
  const key = new URL(request.url).searchParams.get('key');
  const probeKey = process.env.PROBE_KEY || process.env.TRENDS_PROBE_KEY;
  return !!probeKey && key === probeKey;
}

const FILL_IF_EMPTY = ['features', 'description', 'display_title', 'materials', 'dimensions', 'packing', 'alt_text', 'meta_title', 'meta_description', 'seo_description'];

function isEmpty(v) {
  if (v == null) return true;
  if (Array.isArray(v)) return v.length === 0;
  if (typeof v === 'string') return v.trim() === '';
  return false;
}

export async function GET(request) {
  if (!authorised(request)) return Response.json({ error: 'unauthorized' }, { status: 401 });
  const db = sourcingDb();
  const dry = new URL(request.url).searchParams.get('dry') === '1';

  try {
    const { data: rows, error } = await db
      .from('products')
      .select('id, supplier, supplier_sku, name, slug, category, subcategory, colours, features, description, display_title, materials, dimensions, packing, alt_text, meta_title, meta_description, seo_description, is_published, created_at')
      .in('supplier', ['Trends', 'PromoBrands']);
    if (error) throw new Error(`products: ${error.message}`);

    const bySku = new Map();
    for (const p of rows || []) {
      const key = String(p.supplier_sku || '').trim().toUpperCase();
      if (!key) continue;
      if (!bySku.has(key)) bySku.set(key, []);
      bySku.get(key).push(p);
    }

    const results = [];
    for (const [sku, group] of bySku.entries()) {
      if (group.length < 2) continue;
      const oldRow = group.find((p) => p.is_published) || group[0];
      const newRow = group.find((p) => p.id !== oldRow.id && !p.is_published && new Date(p.created_at) >= new Date(BATCH_SINCE));
      if (!newRow) continue; // 不是"老发布行 + 新草稿行"这种模式,跳过,人工看

      const update = {};
      if (newRow.subcategory && newRow.subcategory !== oldRow.subcategory) update.subcategory = newRow.subcategory;
      if (Array.isArray(newRow.colours) && newRow.colours.length) update.colours = newRow.colours;
      for (const f of FILL_IF_EMPTY) {
        if (isEmpty(oldRow[f]) && !isEmpty(newRow[f])) update[f] = newRow[f];
      }

      const changedKeys = Object.keys(update);
      results.push({
        sku, name: oldRow.name,
        old_slug: oldRow.slug, new_slug: newRow.slug,
        changed: changedKeys,
        will_delete_row_id: newRow.id,
      });

      if (!dry && changedKeys.length) {
        const { error: upErr } = await db.from('products').update(update).eq('id', oldRow.id);
        if (upErr) { results[results.length - 1].error = upErr.message; continue; }
      }
      if (!dry) {
        const { error: delErr } = await db.from('products').delete().eq('id', newRow.id);
        if (delErr) results[results.length - 1].delete_error = delErr.message;
      }
    }

    return Response.json({ dry, pairs_found: results.length, results });
  } catch (e) {
    return Response.json({ error: String(e?.message || e) }, { status: 500 });
  }
}

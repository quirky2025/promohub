import { isAdmin, unauthorized } from '@/lib/adminAuth';
import { sourcingDb } from '@/lib/sourcingDb';

// D12 · 热销榜 API:GET /api/admin/popular?days=7
// 数据 = popular_products() SQL 函数(库存快照消耗) join products(名称/类目/链接)

export async function GET(request) {
  if (!(await isAdmin(request))) return unauthorized();
  const url = new URL(request.url);
  const days = Math.min(90, Math.max(2, parseInt(url.searchParams.get('days') || '7', 10) || 7));
  const db = sourcingDb();

  const { data: rows, error } = await db.rpc('popular_products', { days_back: days });
  if (error) return Response.json({ error: error.message }, { status: 500 });

  const skus = [...new Set((rows || []).map(r => r.supplier_sku))];
  const prodBySku = {};
  for (let i = 0; i < skus.length; i += 200) {
    const { data: prods } = await db
      .from('products')
      .select('supplier_sku, name, display_title, slug, category, is_published')
      .in('supplier_sku', skus.slice(i, i + 200));
    (prods || []).forEach(p => { prodBySku[p.supplier_sku] = p; });
  }

  const items = (rows || []).map(r => {
    const p = prodBySku[r.supplier_sku];
    return {
      supplier_sku: r.supplier_sku,
      colour_name: r.colour_name,
      consumed: r.consumed,
      per_day: Math.round((r.consumed / Math.max(1, days)) * 10) / 10,
      latest_qty: r.latest_qty,
      snapshots: r.snapshots,
      name: p ? (p.display_title || p.name) : null,
      slug: p?.slug || null,
      category: p?.category || null,
      published: p?.is_published ?? null,
    };
  });

  return Response.json({ days, count: items.length, items });
}

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Single source of truth for admin category dropdowns (decision 2026-07-18: admin follows the live site).
// Live url_pages drive what customers actually see; product_filter.category/.subcategory hold the
// raw products.category / products.subcategory values, so these options are always valid to save.
export async function GET() {
  const { data: pages, error } = await supabase
    .from('url_pages')
    .select('product_filter')
    .eq('status', 'live');
  if (error) return Response.json({ error: error.message }, { status: 500 });

  const map = new Map(); // category -> Set of subcategories
  for (const p of pages || []) {
    const f = p.product_filter || {};
    if (f.type === 'category' && f.category) {
      if (!map.has(f.category)) map.set(f.category, new Set());
    } else if (f.type === 'subcategory' && f.category && f.subcategory) {
      if (!map.has(f.category)) map.set(f.category, new Set());
      map.get(f.category).add(f.subcategory);
    }
  }

  // Legacy categories: still present on products but not used by the live site.
  // Listed separately so old products can still be found and re-classified.
  const dbCategories = new Set();
  const PAGE = 1000; // PostgREST max-rows safe paging
  for (let from = 0; ; from += PAGE) {
    const { data: rows, error: pErr } = await supabase
      .from('products')
      .select('category')
      .range(from, from + PAGE - 1);
    if (pErr) break;
    (rows || []).forEach(r => { if (r.category) dbCategories.add(r.category); });
    if (!rows || rows.length < PAGE) break;
  }
  const legacy = [...dbCategories].filter(c => !map.has(c)).sort();

  const categories = [...map.keys()].sort().map(c => ({
    category: c,
    subcategories: [...map.get(c)].sort(),
  }));

  return Response.json({ categories, legacy });
}

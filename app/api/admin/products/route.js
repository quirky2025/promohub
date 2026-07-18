import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const LIST_COLUMNS = 'id, name, slug, category, subcategory, brand, collection, is_eco, is_new_arrival, is_sale, is_published, indent_type, status, meta_title, meta_description, alt_text, supplier_sku, seo_description, features, dimensions, materials, capacity, packing, description';

// Apply search + category filters (shared by the count queries and the list query)
function applyCommonFilters(query, { search, category }) {
  if (search) query = query.or(`name.ilike.%${search}%,supplier_sku.ilike.%${search}%`);
  if (category) query = query.ilike('category', category);
  return query;
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const published = searchParams.get('published');
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
  const pageSize = Math.min(200, Math.max(1, parseInt(searchParams.get('pageSize') || '50', 10) || 50));

  // Exact DB counts (head:true = count only, no rows, no truncation).
  // Same search/category filters as the list so tab numbers always match the table.
  const countQuery = (withPublished) => {
    let q = supabase.from('products').select('id', { count: 'exact', head: true });
    q = applyCommonFilters(q, { search, category });
    if (withPublished) q = q.eq('is_published', true);
    return q;
  };

  const [allRes, pubRes] = await Promise.all([countQuery(false), countQuery(true)]);
  if (allRes.error) return Response.json({ error: allRes.error.message }, { status: 500 });
  if (pubRes.error) return Response.json({ error: pubRes.error.message }, { status: 500 });

  const counts = {
    all: allRes.count ?? 0,
    published: pubRes.count ?? 0,
    unpublished: (allRes.count ?? 0) - (pubRes.count ?? 0),
  };

  // Server-side pagination — no more .limit(3000) truncation.
  let query = supabase
    .from('products')
    .select(LIST_COLUMNS)
    .order('name');

  query = applyCommonFilters(query, { search, category });
  if (published === 'true') query = query.eq('is_published', true);
  // "not published" must include NULLs (is_published is not true), not just false
  if (published === 'false') query = query.not('is_published', 'is', true);

  const from = (page - 1) * pageSize;
  query = query.range(from, from + pageSize - 1);

  const { data, error } = await query;
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ products: data || [], counts, page, pageSize });
}

export async function PATCH(req) {
  const body = await req.json();
  const { id, ...updates } = body;
  if (!id) return Response.json({ error: 'No id' }, { status: 400 });

  const { error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id);

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ success: true });
}

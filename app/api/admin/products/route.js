import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const published = searchParams.get('published');

  let query = supabase
    .from('products')
    .select('id, name, slug, category, subcategory, brand, collection, is_eco, is_new_arrival, is_sale, is_published, indent_type, status, meta_title, meta_description, alt_text, supplier_sku, seo_description, features, dimensions, materials, capacity, packing, description')
    .order('name')
    .limit(3000);

  if (search) query = query.or(`name.ilike.%${search}%,supplier_sku.ilike.%${search}%`);
  if (category) query = query.ilike('category', category);
  if (published === 'true') query = query.eq('is_published', true);
  if (published === 'false') query = query.eq('is_published', false);

  const { data, error } = await query;
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}

export async function PATCH(req) {
  const body = await req.json();
  const { id, ...updates } = body;
  if (!id) return Response.json({ error: 'No id' }, { status: 400 });

  // Only update allowed fields
  const allowedFields = [
    'name', 'category', 'subcategory', 'brand', 'collection',
    'is_eco', 'is_new_arrival', 'is_sale', 'is_published', 'indent_type',
    'meta_title', 'meta_description', 'alt_text', 'seo_description',
    'features', 'dimensions', 'materials', 'capacity', 'packing', 'description',
  ];

  const filtered = Object.fromEntries(
    Object.entries(updates).filter(([k]) => allowedFields.includes(k))
  );

  const { error } = await supabase
    .from('products')
    .update(filtered)
    .eq('id', id);

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ success: true });
}

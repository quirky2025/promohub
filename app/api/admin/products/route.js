import { isAdmin, unauthorized } from '@/lib/adminAuth';
import { sourcingDb } from '@/lib/sourcingDb';

export async function GET(req) {
  if (!(await isAdmin(req))) return unauthorized();

  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const published = searchParams.get('published');
  const supabase = sourcingDb();

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
  if (!(await isAdmin(req))) return unauthorized();

  const body = await req.json();
  const { id, ...updates } = body;
  if (!id) return Response.json({ error: 'No id' }, { status: 400 });

  const { error } = await sourcingDb()
    .from('products')
    .update(updates)
    .eq('id', id);

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ success: true });
}

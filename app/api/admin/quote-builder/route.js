import { getAdminUser, unauthorized } from '@/lib/adminAuth';
import { sourcingDb } from '@/lib/sourcingDb';

// GET ?q=term  → product search (id, name, sku, min_qty)
// GET ?id=uuid → full pricing detail (colours, pricing tiers, decoration options)
export async function GET(request) {
  const user = await getAdminUser(request);
  if (!user) return unauthorized();
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const q = (searchParams.get('q') || '').trim();
    const db = sourcingDb();

    if (id) {
      const { data, error } = await db
        .from('products')
        .select(`id, name, supplier_sku, slug, min_qty,
          product_colours(id, name, hex, sort_order),
          pricing_tiers(id, min_qty, max_qty, base_price, sort_order),
          decoration_options(id, name, detail, per_unit, has_setup, default_setup_qty, sort_order, type)`)
        .eq('id', id)
        .single();
      if (error) return Response.json({ error: error.message }, { status: 404 });
      data.pricing_tiers = (data.pricing_tiers || []).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
      data.decoration_options = (data.decoration_options || []).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
      data.product_colours = (data.product_colours || []).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
      return Response.json({ product: data });
    }

    if (q) {
      let query = db.from('products').select('id, name, supplier_sku, slug, min_qty').limit(20);
      query = query.or(`name.ilike.%${q}%,supplier_sku.ilike.%${q}%`);
      const { data, error } = await query;
      if (error) return Response.json({ error: error.message }, { status: 500 });
      return Response.json({ products: data || [] });
    }

    return Response.json({ products: [] });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

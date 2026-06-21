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
        .select(`id, name, supplier_sku, slug, min_qty, colours,
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

    const custQ = (searchParams.get('customer') || '').trim();
    if (custQ) {
      const [coName, ctMatch] = await Promise.all([
        db.from('companies').select('id, name, billing_address').ilike('name', `%${custQ}%`).limit(20),
        db.from('contacts').select('company_id').or(`email.ilike.%${custQ}%,first_name.ilike.%${custQ}%,last_name.ilike.%${custQ}%`).limit(20),
      ]);
      const ids = [...new Set([...(coName.data || []).map(c => c.id), ...(ctMatch.data || []).map(c => c.company_id)].filter(Boolean))];
      if (ids.length === 0) return Response.json({ customers: [] });
      const [comps, cts] = await Promise.all([
        db.from('companies').select('id, name, billing_address').in('id', ids).limit(30),
        db.from('contacts').select('id, company_id, first_name, last_name, email, phone').in('company_id', ids).limit(100),
      ]);
      const compMap = {}; (comps.data || []).forEach(c => { compMap[c.id] = c; });
      const customers = (cts.data || []).map(c => { const co = compMap[c.company_id] || {}; return { company_id: c.company_id, company: co.name || '', billing_address: co.billing_address || null, name: [c.first_name, c.last_name].filter(Boolean).join(' '), email: c.email || '', phone: c.phone || '' }; });
      (comps.data || []).forEach(co => { if (!customers.some(x => x.company_id === co.id)) customers.push({ company_id: co.id, company: co.name || '', billing_address: co.billing_address || null, name: '', email: '', phone: '' }); });
      return Response.json({ customers });
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

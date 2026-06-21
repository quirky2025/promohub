import { getAdminUser, unauthorized } from '@/lib/adminAuth';
import { sourcingDb } from '@/lib/sourcingDb';
import { fmtAddrRow, fmtBilling, pickDefaultDelivery } from '@/lib/companyAddress';

export async function GET(request) {
  const user = await getAdminUser(request);
  if (!user) return unauthorized();
  try {
    const db = sourcingDb();
    const [coRes, ctRes, qRes, oRes, adRes] = await Promise.all([
      db.from('companies').select('id, name, industry, lifecycle_stage, needs_review, phone, billing_address, payment_terms, notes, created_at').order('name', { ascending: true }).limit(2000),
      db.from('contacts').select('company_id, email, first_name, last_name, auth_user_id').limit(5000),
      db.from('quotes').select('company_id').not('company_id', 'is', null).limit(5000),
      db.from('orders').select('company_id').not('company_id', 'is', null).limit(5000),
      db.from('company_addresses').select('*').limit(5000),
    ]);
    if (coRes.error) return Response.json({ error: coRes.error.message }, { status: 500 });
    const count = (rows) => { const m = {}; (rows || []).forEach(r => { if (r.company_id) m[r.company_id] = (m[r.company_id] || 0) + 1; }); return m; };
    const byCo = {}; (ctRes.data || []).forEach(c => { (byCo[c.company_id] = byCo[c.company_id] || []).push(c); });
    const addrByCo = {}; (adRes && !adRes.error ? adRes.data : []).forEach(a => { (addrByCo[a.company_id] = addrByCo[a.company_id] || []).push(a); });
    const qc = count(qRes.data), oc = count(oRes.data);
    const customers = (coRes.data || []).map(c => {
      const cts = byCo[c.id] || [];
      const primary = cts[0] || null;
      const rows = addrByCo[c.id] || [];
      const delivery = fmtAddrRow(pickDefaultDelivery(rows)) || fmtBilling(c.billing_address);
      const billingRow = rows.filter(r => r.kind === 'billing').find(r => r.is_default) || rows.find(r => r.kind === 'billing');
      const billing = fmtAddrRow(billingRow);
      return {
        ...c,
        delivery_address: delivery,
        billing_address_str: billing,
        address: delivery,
        has_address: !!delivery,
        registered: cts.some(x => x.auth_user_id),
        contact_count: cts.length,
        primary_email: primary?.email || null,
        quote_count: qc[c.id] || 0,
        order_count: oc[c.id] || 0,
      };
    });
    return Response.json({ customers });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  const user = await getAdminUser(request);
  if (!user) return unauthorized();
  try {
    const body = await request.json();
    const { id, action } = body;
    if (!id) return Response.json({ error: 'Missing id' }, { status: 400 });
    const db = sourcingDb();

    if (action === 'address') {
      const text = (body.address || '').trim();
      const kind = body.kind === 'billing' ? 'billing' : 'delivery';
      // upsert the default row of this kind in company_addresses (shared with /account)
      const { data: existing } = await db.from('company_addresses').select('id').eq('company_id', id).eq('kind', kind).eq('is_default', true).maybeSingle();
      if (existing) {
        await db.from('company_addresses').update({ line1: text, line2: null, suburb: null, state: null, postcode: null }).eq('id', existing.id);
      } else if (text) {
        await db.from('company_addresses').insert({ company_id: id, kind, is_default: true, line1: text, country: 'Australia' });
      }
      return Response.json({ ok: true, kind, address: text });
    }

    let updates = {};
    if (action === 'industry') updates = { industry: body.industry || null };
    else if (action === 'notes') updates = { notes: body.notes || null };
    else if (action === 'name') updates = { name: (body.name || '').trim() || undefined };
    else return Response.json({ error: 'Unsupported action' }, { status: 400 });
    const { data, error } = await db.from('companies').update(updates).eq('id', id).select('*').single();
    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ customer: data });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

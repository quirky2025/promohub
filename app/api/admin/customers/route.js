import { getAdminUser, unauthorized } from '@/lib/adminAuth';
import { sourcingDb } from '@/lib/sourcingDb';

const fmtAddr = (a) => { if (!a) return ''; if (typeof a === 'string') return a; try { return Object.values(a).filter(Boolean).join(', '); } catch { return ''; } };

export async function GET(request) {
  const user = await getAdminUser(request);
  if (!user) return unauthorized();
  try {
    const db = sourcingDb();
    const [coRes, ctRes, qRes, oRes] = await Promise.all([
      db.from('companies').select('id, name, industry, lifecycle_stage, needs_review, phone, billing_address, payment_terms, notes, created_at').order('name', { ascending: true }).limit(2000),
      db.from('contacts').select('company_id, email, first_name, last_name, auth_user_id').limit(5000),
      db.from('quotes').select('company_id').not('company_id', 'is', null).limit(5000),
      db.from('orders').select('company_id').not('company_id', 'is', null).limit(5000),
    ]);
    if (coRes.error) return Response.json({ error: coRes.error.message }, { status: 500 });
    const count = (rows) => { const m = {}; (rows || []).forEach(r => { if (r.company_id) m[r.company_id] = (m[r.company_id] || 0) + 1; }); return m; };
    const byCo = {}; (ctRes.data || []).forEach(c => { (byCo[c.company_id] = byCo[c.company_id] || []).push(c); });
    const qc = count(qRes.data), oc = count(oRes.data);
    const customers = (coRes.data || []).map(c => {
      const cts = byCo[c.id] || [];
      const primary = cts[0] || null;
      return {
        ...c,
        address: fmtAddr(c.billing_address),
        has_address: !!fmtAddr(c.billing_address),
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
    let updates = {};
    if (action === 'address') updates = { billing_address: body.address ? { full: String(body.address).trim() } : {} };
    else if (action === 'industry') updates = { industry: body.industry || null };
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

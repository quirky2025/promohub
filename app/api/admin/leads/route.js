import { getAdminUser, unauthorized } from '@/lib/adminAuth';
import { sourcingDb } from '@/lib/sourcingDb';

export const STAGES = ['lead', 'contacted', 'quoted', 'follow_up', 'won', 'lost'];

async function audit(db, actorEmail, action, entityId, before, after) {
  try {
    await db.from('admin_audit_log').insert({
      actor_email: actorEmail, action, entity_type: 'lead',
      entity_id: entityId, before_data: before || null, after_data: after || null,
    });
  } catch { /* audit table optional */ }
}

export async function GET(request) {
  const user = await getAdminUser(request);
  if (!user) return unauthorized();
  try {
    const db = sourcingDb();
    const [coRes, ctRes, qRes, qrRes, oRes] = await Promise.all([
      db.from('companies').select('id, name, industry, lifecycle_stage, needs_review, phone, notes, created_at, updated_at').order('updated_at', { ascending: false }).limit(1000),
      db.from('contacts').select('company_id, email, first_name, last_name').limit(5000),
      db.from('quotes').select('company_id, total, status, created_at').not('company_id', 'is', null).limit(5000),
      db.from('quote_requests').select('company_id, created_at').not('company_id', 'is', null).limit(5000),
      db.from('orders').select('company_id, total, created_at').not('company_id', 'is', null).limit(5000),
    ]);
    if (coRes.error) return Response.json({ error: coRes.error.message }, { status: 500 });

    const byCompany = (rows, key) => {
      const m = {};
      (rows || []).forEach(r => { const k = r.company_id; if (!k) return; (m[k] = m[k] || []).push(r); });
      return m;
    };
    const contacts = byCompany(ctRes.data);
    const quotes = byCompany(qRes.data);
    const enquiries = byCompany(qrRes.data);
    const orders = byCompany(oRes.data);

    const lastTs = (...lists) => {
      let t = 0;
      lists.forEach(l => (l || []).forEach(r => { const d = +new Date(r.created_at); if (d > t) t = d; }));
      return t ? new Date(t).toISOString() : null;
    };

    const leads = (coRes.data || []).map(c => {
      const ct = contacts[c.id] || [];
      const primary = ct[0] || null;
      return {
        ...c,
        contact_count: ct.length,
        primary_contact: primary ? { name: [primary.first_name, primary.last_name].filter(Boolean).join(' ') || null, email: primary.email } : null,
        quote_count: (quotes[c.id] || []).length,
        enquiry_count: (enquiries[c.id] || []).length,
        order_count: (orders[c.id] || []).length,
        last_activity: lastTs(quotes[c.id], enquiries[c.id], orders[c.id]) || c.created_at,
      };
    });
    leads.sort((a, b) => +new Date(b.last_activity) - +new Date(a.last_activity));

    const counts = STAGES.reduce((acc, s) => { acc[s] = leads.filter(l => (l.lifecycle_stage || 'lead') === s).length; return acc; }, {});
    counts.all = leads.length;
    counts.needs_review = leads.filter(l => l.needs_review).length;

    return Response.json({ leads, counts, stages: STAGES });
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
    if (!id) return Response.json({ error: 'Missing company id' }, { status: 400 });
    const db = sourcingDb();
    const { data: before } = await db.from('companies').select('*').eq('id', id).single();

    let updates = {};
    if (action === 'stage') {
      if (!STAGES.includes(body.lifecycle_stage)) return Response.json({ error: 'Invalid stage' }, { status: 400 });
      updates = { lifecycle_stage: body.lifecycle_stage };
    } else if (action === 'note') {
      updates = { notes: body.notes || null };
    } else if (action === 'industry') {
      updates = { industry: body.industry || null };
    } else if (action === 'review_clear') {
      updates = { needs_review: false };
    } else if (action === 'name') {
      updates = { name: (body.name || '').trim() || before?.name };
    } else {
      return Response.json({ error: 'Unsupported action' }, { status: 400 });
    }

    const { data, error } = await db.from('companies').update(updates).eq('id', id).select('*').single();
    if (error) return Response.json({ error: error.message }, { status: 500 });
    await audit(db, user.email, `lead_${action}`, id, before, data);
    return Response.json({ lead: data });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

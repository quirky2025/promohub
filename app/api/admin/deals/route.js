import { getAdminUser, unauthorized } from '@/lib/adminAuth';
import { sourcingDb } from '@/lib/sourcingDb';

export const STATUSES = ['new', 'in_progress', 'quote_sent', 'follow_up', 'won', 'lost', 'expired'];

// quotes.status historically used pending/sent/accepted/declined → normalize to unified set
const QUOTE_STATUS_MAP = {
  pending: 'new', in_progress: 'in_progress', sent: 'quote_sent', accepted: 'won',
  declined: 'lost', expired: 'expired', follow_up: 'follow_up', quote_sent: 'quote_sent',
  new: 'new', won: 'won', lost: 'lost',
};
function normQuoteStatus(s) { return QUOTE_STATUS_MAP[s] || 'new'; }
function normEnquiryStatus(s) { return STATUSES.includes(s) ? s : 'new'; }

async function audit(db, actor, action, type, id, before, after) {
  try { await db.from('admin_audit_log').insert({ actor_email: actor, action, entity_type: type, entity_id: id, before_data: before || null, after_data: after || null }); } catch {}
}

export async function GET(request) {
  const user = await getAdminUser(request);
  if (!user) return unauthorized();
  try {
    const db = sourcingDb();
    const [qRes, eRes] = await Promise.all([
      db.from('quotes').select('*').limit(1000),
      db.from('quote_requests').select('*').limit(1000),
    ]);
    if (qRes.error && eRes.error) return Response.json({ error: qRes.error.message }, { status: 500 });

    const quotes = (qRes.data || []).map(q => ({
      id: q.quote_number, kind: 'quote',
      reference: q.quote_number || null,
      customer_name: q.customer_name || null,
      customer_email: q.customer_email || null,
      customer_company: q.customer_company || null,
      company_id: q.company_id || null,
      product_name: q.product_name || null,
      summary: [q.product_name, q.quantity ? `qty ${q.quantity}` : null, q.colour].filter(Boolean).join(' · '),
      total: q.total || 0,
      status: normQuoteStatus(q.status),
      lost_reason: q.lost_reason || null,
      created_at: q.created_at,
    }));
    const enquiries = (eRes.data || []).map(e => ({
      id: e.id, kind: 'enquiry',
      reference: null,
      customer_name: e.name || null,
      customer_email: e.email || null,
      customer_company: e.company || null,
      company_id: e.company_id || null,
      product_name: null,
      summary: e.message || '',
      total: 0,
      status: normEnquiryStatus(e.status),
      lost_reason: e.lost_reason || null,
      created_at: e.created_at,
    }));

    const deals = [...quotes, ...enquiries].sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
    const counts = STATUSES.reduce((acc, s) => { acc[s] = deals.filter(d => d.status === s).length; return acc; }, {});
    counts.all = deals.length;
    counts.enquiry = deals.filter(d => d.kind === 'enquiry').length;
    counts.quote = deals.filter(d => d.kind === 'quote').length;

    return Response.json({ deals, counts, statuses: STATUSES });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  const user = await getAdminUser(request);
  if (!user) return unauthorized();
  try {
    const body = await request.json();
    const { id, kind, action } = body;
    if (!id || !kind) return Response.json({ error: 'Missing id/kind' }, { status: 400 });
    const table = kind === 'quote' ? 'quotes' : 'quote_requests';
    const noteCol = kind === 'quote' ? 'internal_notes' : 'internal_notes';
    const idCol = kind === 'quote' ? 'quote_number' : 'id';
    const db = sourcingDb();
    const { data: before } = await db.from(table).select('*').eq(idCol, id).single();

    let updates = {};
    if (action === 'status') {
      if (!STATUSES.includes(body.status)) return Response.json({ error: 'Invalid status' }, { status: 400 });
      updates = { status: body.status };
      if (body.status !== 'lost') updates.lost_reason = null;
    } else if (action === 'lost') {
      updates = { status: 'lost', lost_reason: body.lost_reason || null };
    } else if (action === 'note') {
      updates = { [noteCol]: body.note || null };
    } else {
      return Response.json({ error: 'Unsupported action' }, { status: 400 });
    }

    const { data, error } = await db.from(table).update(updates).eq(idCol, id).select('*').single();
    if (error) return Response.json({ error: error.message }, { status: 500 });
    await audit(db, user.email, `deal_${action}`, kind, id, before, data);
    return Response.json({ ok: true, deal: data });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

import { getAdminUser, unauthorized } from '@/lib/adminAuth';
import { sourcingDb } from '@/lib/sourcingDb';

export async function GET(request) {
  const user = await getAdminUser(request);
  if (!user) return unauthorized();
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const kind = searchParams.get('kind');
    if (!id || !kind) return Response.json({ error: 'Missing id/kind' }, { status: 400 });
    const table = kind === 'quote' ? 'quotes' : 'quote_requests';
    const db = sourcingDb();

    const { data: record, error } = await db.from(table).select('*').eq('id', id).single();
    if (error) return Response.json({ error: error.message }, { status: 404 });

    let company = null, contacts = [], history = { quotes: [], enquiries: [], orders: [] }, activity = [];
    if (record.company_id) {
      const [co, ct, q, e, o, act] = await Promise.all([
        db.from('companies').select('*').eq('id', record.company_id).single(),
        db.from('contacts').select('id, email, first_name, last_name, title, phone, auth_user_id').eq('company_id', record.company_id),
        db.from('quotes').select('id, quote_number, product_name, total, status, created_at').eq('company_id', record.company_id).order('created_at', { ascending: false }).limit(50),
        db.from('quote_requests').select('id, message, status, created_at').eq('company_id', record.company_id).order('created_at', { ascending: false }).limit(50),
        db.from('orders').select('*').eq('company_id', record.company_id).order('created_at', { ascending: false }).limit(50),
        db.from('company_activity').select('*').eq('company_id', record.company_id).order('created_at', { ascending: false }).limit(100),
      ]);
      company = co.data || null;
      contacts = ct.data || [];
      history = { quotes: q.data || [], enquiries: e.data || [], orders: o.data || [] };
      activity = act && !act.error ? (act.data || []) : [];
    }

    return Response.json({ record, kind, company, contacts, history, activity });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

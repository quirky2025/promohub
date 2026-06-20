import { getAdminUser, unauthorized } from '@/lib/adminAuth';
import { sourcingDb } from '@/lib/sourcingDb';

export async function GET(request, { params }) {
  const user = await getAdminUser(request);
  if (!user) return unauthorized();
  try {
    const { id } = await params;
    const db = sourcingDb();
    const [co, contacts, quotes, enquiries, orders] = await Promise.all([
      db.from('companies').select('*').eq('id', id).single(),
      db.from('contacts').select('id, email, first_name, last_name, title, department, phone, role, status, auth_user_id').eq('company_id', id).order('created_at', { ascending: true }),
      db.from('quotes').select('id, quote_number, product_name, quantity, total, status, created_at').eq('company_id', id).order('created_at', { ascending: false }).limit(50),
      db.from('quote_requests').select('id, message, quantity, date_needed, source, created_at').eq('company_id', id).order('created_at', { ascending: false }).limit(50),
      db.from('orders').select('*').eq('company_id', id).order('created_at', { ascending: false }).limit(50),
    ]);
    if (co.error) return Response.json({ error: co.error.message }, { status: 404 });
    return Response.json({
      company: co.data,
      contacts: contacts.data || [],
      quotes: quotes.data || [],
      enquiries: enquiries.data || [],
      orders: orders.data || [],
    });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

import { getAdminUser, unauthorized } from '@/lib/adminAuth';
import { sourcingDb } from '@/lib/sourcingDb';

// Local-stock suppliers (separate from Sourcing factories).
export async function GET(request) {
  const user = await getAdminUser(request);
  if (!user) return unauthorized();
  try {
    const db = sourcingDb();
    const { data, error } = await db.from('suppliers').select('*').order('name', { ascending: true });
    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ suppliers: data || [] });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request) {
  const user = await getAdminUser(request);
  if (!user) return unauthorized();
  try {
    const b = await request.json();
    if (!b.name) return Response.json({ error: 'Name required' }, { status: 400 });
    const db = sourcingDb();
    const { data, error } = await db.from('suppliers').insert({
      name: b.name,
      contact_name: b.contact_name || null,
      email: b.email || null,
      phone: b.phone || null,
      payment_terms: b.payment_terms || 'prepaid',
      notes: b.notes || null,
    }).select('*').single();
    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ supplier: data });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  const user = await getAdminUser(request);
  if (!user) return unauthorized();
  try {
    const b = await request.json();
    if (!b.id) return Response.json({ error: 'Missing id' }, { status: 400 });
    const db = sourcingDb();
    const updates = {};
    for (const k of ['name', 'contact_name', 'email', 'phone', 'payment_terms', 'notes']) {
      if (b[k] !== undefined) updates[k] = b[k] || null;
    }
    const { data, error } = await db.from('suppliers').update(updates).eq('id', b.id).select('*').single();
    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ supplier: data });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

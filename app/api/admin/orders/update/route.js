import { getAdminUser, unauthorized } from '@/lib/adminAuth';
import { sourcingDb } from '@/lib/sourcingDb';

// Update a small set of editable order fields via service role (bypasses RLS).
export async function PATCH(request) {
  const user = await getAdminUser(request);
  if (!user) return unauthorized();
  try {
    const b = await request.json();
    if (!b.id) return Response.json({ error: 'Missing id' }, { status: 400 });
    const db = sourcingDb();
    const updates = {};
    for (const k of ['delivery_address', 'internal_notes', 'tracking_number', 'tracking_url']) {
      if (b[k] !== undefined) updates[k] = b[k];
    }
    if (Object.keys(updates).length === 0) {
      return Response.json({ error: 'No fields to update' }, { status: 400 });
    }
    const { data, error } = await db.from('orders').update(updates).eq('id', b.id).select('*').single();
    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ order: data });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

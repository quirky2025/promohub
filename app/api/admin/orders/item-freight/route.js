import { getAdminUser, unauthorized } from '@/lib/adminAuth';
import { sourcingDb } from '@/lib/sourcingDb';

// Per-product freight — a product can ship to MORE THAN ONE address, so each
// product carries a list of parcels: [{ carrier, tracking, deliverTo }].
// Stored on items[index].parcels so it lives with the product.
export async function POST(request) {
  const user = await getAdminUser(request);
  if (!user) return unauthorized();
  try {
    const { orderId, index, parcels } = await request.json();
    if (!orderId || index == null) return Response.json({ error: 'Missing fields' }, { status: 400 });

    const db = sourcingDb();
    const { data: order, error: readErr } = await db
      .from('orders').select('items').eq('id', orderId).single();
    if (readErr || !order || !Array.isArray(order.items)) {
      return Response.json({ error: 'Order or items not found' }, { status: 404 });
    }

    const clean = Array.isArray(parcels)
      ? parcels.map((p) => ({
          carrier: (p.carrier || '').trim(),
          tracking: (p.tracking || '').trim(),
          deliverTo: (p.deliverTo || '').trim(),
          recipient: (p.recipient || '').trim(),
          notifyEmail: (p.notifyEmail || '').trim(),
          notified_at: p.notified_at || null,
        }))
      : [];

    const idx = Number(index);
    const items = order.items.map((it, i) => (i === idx ? { ...it, parcels: clean } : it));

    const { error: upErr } = await db.from('orders').update({ items }).eq('id', orderId);
    if (upErr) return Response.json({ error: upErr.message }, { status: 500 });

    return Response.json({ success: true, items });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

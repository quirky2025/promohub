import { getAdminUser, unauthorized } from '@/lib/adminAuth';
import { sourcingDb } from '@/lib/sourcingDb';

// Per-product freight: each product ships on its own (carrier + tracking + a
// deliver-to address). Stored on items[index] so it lives with the product.
export async function POST(request) {
  const user = await getAdminUser(request);
  if (!user) return unauthorized();
  try {
    const { orderId, index, carrier, tracking, deliverTo } = await request.json();
    if (!orderId || index == null) return Response.json({ error: 'Missing fields' }, { status: 400 });

    const db = sourcingDb();
    const { data: order, error: readErr } = await db
      .from('orders').select('items').eq('id', orderId).single();
    if (readErr || !order || !Array.isArray(order.items)) {
      return Response.json({ error: 'Order or items not found' }, { status: 404 });
    }

    const idx = Number(index);
    const items = order.items.map((it, i) => (i === idx ? {
      ...it,
      freight_carrier: carrier ?? it.freight_carrier ?? '',
      freight_tracking: tracking ?? it.freight_tracking ?? '',
      freight_deliver_to: deliverTo ?? it.freight_deliver_to ?? '',
    } : it));

    const { error: upErr } = await db.from('orders').update({ items }).eq('id', orderId);
    if (upErr) return Response.json({ error: upErr.message }, { status: 500 });

    return Response.json({ success: true, items });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

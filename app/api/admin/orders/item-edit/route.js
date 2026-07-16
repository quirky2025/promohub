import { getAdminUser, unauthorized } from '@/lib/adminAuth';
import { sourcingDb } from '@/lib/sourcingDb';

const round2 = (n) => Math.round((Number(n) || 0) * 100) / 100;

// Revise a line item to its FINAL produced spec (branding) and/or price/qty.
// Recomputes the order totals. If the order was already paid, the amount the
// customer paid is captured once (amount_paid) so a credit note / balance can
// be worked out from the difference.
export async function POST(request) {
  const user = await getAdminUser(request);
  if (!user) return unauthorized();
  try {
    const { orderId, index, branding, unitPrice, qty } = await request.json();
    if (!orderId || index == null) return Response.json({ error: 'Missing fields' }, { status: 400 });

    const db = sourcingDb();
    const { data: order } = await db.from('orders').select('*').eq('id', orderId).single();
    if (!order || !Array.isArray(order.items)) return Response.json({ error: 'Order not found' }, { status: 404 });

    const idx = Number(index);
    const items = order.items.map((it, i) => {
      if (i !== idx) return it;
      const q = qty != null && qty !== '' ? Number(qty) : (Number(it.qty ?? it.quantity) || 1);
      const u = unitPrice != null && unitPrice !== '' ? Number(unitPrice) : (Number(it.unitPrice ?? it.unit_price) || 0);
      const next = { ...it, qty: q, unitPrice: u, subtotal: round2(q * u) };
      if (branding != null) { next.branding = branding; next.brandingMethod = branding; }
      return next;
    });

    const shipping = Number(order.shipping) || 0;
    const subtotal = round2(items.reduce((s, it) => {
      const q = Number(it.qty ?? it.quantity) || 0;
      const u = Number(it.unitPrice ?? it.unit_price) || 0;
      return s + (it.subtotal != null ? Number(it.subtotal) : q * u);
    }, 0));
    const gst = round2((subtotal + shipping) * 0.10);
    const total = round2(subtotal + shipping + gst);

    const updates = { items, subtotal, gst, total, total_net: round2(subtotal + shipping), gst_total: gst, total_gross: total };
    if (order.payment_status === 'paid' && order.amount_paid == null) updates.amount_paid = round2(order.total);

    const { error } = await db.from('orders').update(updates).eq('id', orderId);
    if (error) return Response.json({ error: error.message }, { status: 500 });

    return Response.json({ success: true, order: { ...order, ...updates } });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

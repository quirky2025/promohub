import { getAdminUser, unauthorized } from '@/lib/adminAuth';
import { sourcingDb } from '@/lib/sourcingDb';

// Record a payment (deposit or balance) against an order.
// Inserts into order_payments; a DB trigger recomputes orders.amount_paid /
// payment_state / paid_in_full_at. We also keep the legacy payment_status in sync
// so the Orders board reflects it.
export async function POST(request) {
  const user = await getAdminUser(request);
  if (!user) return unauthorized();

  try {
    const { orderId, orderNumber, amount, method, note } = await request.json();
    const amt = Number(amount);
    if (!orderId || !Number.isFinite(amt) || amt <= 0) {
      return Response.json({ error: 'Missing order or valid amount' }, { status: 400 });
    }

    const db = sourcingDb();

    const { error: insErr } = await db.from('order_payments').insert({
      order_id: orderId,
      order_number: orderNumber || null,
      amount: amt,
      method: method || 'eft',
      note: note || null,
      recorded_by: user.email,
    });
    if (insErr) {
      return Response.json({ error: insErr.message }, { status: 500 });
    }

    // Re-read order (trigger has updated amount_paid / payment_state).
    const { data: order } = await db.from('orders').select('*').eq('id', orderId).single();
    const gross = Number(order?.total_gross ?? order?.total ?? 0);
    const paid = Number(order?.amount_paid ?? 0);
    const payment_status = gross > 0 && paid >= gross ? 'paid' : paid > 0 ? 'pending' : 'unpaid';
    await db.from('orders').update({ payment_status }).eq('id', orderId);

    return Response.json({ success: true, order: { ...order, payment_status } });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

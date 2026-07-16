import { getAdminUser, unauthorized } from '@/lib/adminAuth';
import { sourcingDb } from '@/lib/sourcingDb';

const round2 = (n) => Math.round((Number(n) || 0) * 100) / 100;

// POST { orderId } → settle the order's net adjustment against the bank.
// Net < 0 (credit) → bank OUT (you refunded the customer).
// Net > 0 (balance) → bank IN (the customer paid the extra).
// Idempotent-ish: refuses if already settled (delete via DELETE to redo).
export async function POST(request) {
  const user = await getAdminUser(request);
  if (!user) return unauthorized();
  try {
    const { orderId } = await request.json();
    if (!orderId) return Response.json({ error: 'Missing orderId' }, { status: 400 });

    const db = sourcingDb();
    const { data: order } = await db.from('orders').select('*').eq('id', orderId).single();
    if (!order) return Response.json({ error: 'Order not found' }, { status: 404 });
    if (order.adjustment_settled_at) return Response.json({ error: 'Already settled' }, { status: 400 });

    const adj = Array.isArray(order.adjustments) ? order.adjustments : [];
    const net = round2(adj.reduce((s, a) => s + (Number(a.amount) || 0), 0));   // ex GST
    const incGst = round2(net * 1.1);
    const amt = Math.abs(incGst);
    if (amt < 0.01) return Response.json({ error: 'No adjustment to settle' }, { status: 400 });

    const credit = net < 0;
    const orderNumber = order.order_number || order.invoice_number || '';

    await db.from('bank_transactions').insert({
      txn_date: new Date().toISOString().slice(0, 10),
      direction: credit ? 'out' : 'in',
      amount_aud: amt,
      gst_aud: round2(amt / 11),
      business_line: 'local_stock',
      category: credit ? 'credit_note' : 'sales',
      counterparty: order.customer_name || null,
      description: `${credit ? 'Credit note refund' : 'Balance received'} — ${orderNumber}`,
      reference: orderNumber,
      reconciled: true,
      source: 'system',
      linked_type: 'order_adjustment',
      linked_id: orderId,
      created_by: user.email,
    });

    const settledAt = new Date().toISOString();
    const { data: updated } = await db.from('orders')
      .update({ adjustment_settled_at: settledAt }).eq('id', orderId).select('*').single();

    return Response.json({ success: true, order: updated || { ...order, adjustment_settled_at: settledAt }, direction: credit ? 'out' : 'in', amount: amt });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

// DELETE ?id=  → undo the settlement (remove the bank txn + clear the flag).
export async function DELETE(request) {
  const user = await getAdminUser(request);
  if (!user) return unauthorized();
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return Response.json({ error: 'Missing id' }, { status: 400 });
    const db = sourcingDb();
    try { await db.from('bank_transactions').delete().eq('linked_type', 'order_adjustment').eq('linked_id', id); } catch (_) { /* finance optional */ }
    const { data: updated } = await db.from('orders').update({ adjustment_settled_at: null }).eq('id', id).select('*').single();
    return Response.json({ success: true, order: updated });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

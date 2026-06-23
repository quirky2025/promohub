import { getAdminUser, unauthorized } from '@/lib/adminAuth';
import { sourcingDb } from '@/lib/sourcingDb';
import { Resend } from 'resend';
import { quirkyEmail } from '@/lib/emailLayout';

const resend = new Resend(process.env.RESEND_API_KEY);

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
    const gross = Number(order?.total_gross) || Number(order?.total) || 0;
    const paid = Number(order?.amount_paid ?? 0);
    const payment_status = gross > 0 && paid >= gross ? 'paid' : paid > 0 ? 'pending' : 'unpaid';
    await db.from('orders').update({ payment_status }).eq('id', orderId);

    // When this payment tips the order into FULLY PAID (not on a deposit, and
    // only on the transition — so it doesn't resend if recorded again), email
    // the customer: payment received → next step is production.
    const justFullyPaid = gross > 0 && paid >= gross && (paid - amt) < gross;
    if (justFullyPaid && order?.customer_email) {
      try {
        const orderNo = order.order_number || orderNumber || '';
        const name = order.customer_name || 'there';
        const bodyHtml = `
          <p style="font-size:15px;margin:0 0 16px;">Hi ${name},</p>
          <div style="background:#F8F7F4;border-radius:10px;padding:14px 18px;margin:0 0 16px;font-size:14px;">
            <span style="color:#7A7570;">Order</span> <strong style="color:#1B2A4A;">${orderNo}</strong>
            &nbsp;·&nbsp; <span style="color:#7A7570;">Status</span> <strong style="color:#2D6A4F;">✓ Payment received</strong>
            &nbsp;·&nbsp; <span style="color:#7A7570;">Next step</span> <strong style="color:#1B2A4A;">Production</strong>
          </div>
          <p style="font-size:15px;line-height:1.6;margin:0 0 16px;">Thanks for your payment — it's landed in our account and we're now moving into production. We'll let you know the moment your order is dispatched.</p>
          <p style="font-size:14px;line-height:1.6;color:#3D3A36;margin:16px 0 0;">Any questions, just reply or call us on <strong>02 9477 4748</strong>.</p>`;
        await resend.emails.send({
          from: 'QuirkyPromo <noreply@quirkypromo.com.au>',
          replyTo: 'hello@quirkypromo.com.au',
          to: [order.customer_email],
          subject: `Payment received — production starting — ${orderNo}`,
          html: quirkyEmail(bodyHtml),
        });
      } catch (_) { /* email failure must not block payment recording */ }
    }

    return Response.json({ success: true, order: { ...order, payment_status } });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

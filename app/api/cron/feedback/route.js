import { sourcingDb } from '@/lib/sourcingDb';
import { Resend } from 'resend';
import { quirkyEmail } from '@/lib/emailLayout';

const resend = new Resend(process.env.RESEND_API_KEY);

// Daily cron (see vercel.json): ~7 days after delivery, email the customer asking
// for feedback — once per order (guarded by feedback_requested_at).
export async function GET(request) {
  // If CRON_SECRET is set in Vercel, Vercel adds it as a Bearer token — verify it.
  if (process.env.CRON_SECRET && request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const db = sourcingDb();
    const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data: orders, error } = await db.from('orders')
      .select('*')
      .not('delivered_at', 'is', null)
      .lte('delivered_at', cutoff)
      .is('feedback_requested_at', null)
      .limit(100);
    if (error) return Response.json({ error: error.message }, { status: 500 });

    let sent = 0;
    for (const o of (orders || [])) {
      if (!o.customer_email) continue;
      try {
        const name = o.customer_name || 'there';
        const orderNo = o.order_number || o.invoice_number || '';
        const prods = (Array.isArray(o.items) ? o.items.map(it => it.productName || it.name).filter(Boolean) : []);
        const prodText = prods.length ? prods.join(', ') : 'your order';
        const body = `
          <p style="font-size:15px;margin:0 0 16px;">Hi ${name},</p>
          <p style="font-size:15px;line-height:1.6;margin:0 0 16px;">A little while back we made your <strong>${prodText}</strong>${o.job_name ? ` for <strong>${o.job_name}</strong>` : ''} — and now that it's had a few days to settle in, we'd love to know how it's going.</p>
          <p style="font-size:15px;line-height:1.6;margin:0 0 16px;">Did everything arrive in great shape? Are the prints looking sharp? Just hit reply with a quick line — good or not-so-good, we read every one and it genuinely helps us improve.</p>
          <p style="font-size:15px;line-height:1.6;margin:0 0 16px;">And whenever you need more, we've kept your artwork on file — reorders are quick and easy. Just reply and we'll sort it.</p>
          <p style="font-size:14px;line-height:1.6;color:#3D3A36;margin:16px 0 0;">Thank you for choosing QuirkyPromo. &#128153;</p>`;
        await resend.emails.send({
          from: 'QuirkyPromo <noreply@quirkypromo.com.au>',
          replyTo: 'hello@quirkypromo.com.au',
          to: [o.customer_email],
          subject: `How are your ${prods[0] || 'promo products'} working out? — ${orderNo}`,
          html: quirkyEmail(body),
        });
        await db.from('orders').update({ feedback_requested_at: new Date().toISOString() }).eq('id', o.id);
        sent++;
      } catch (_) { /* skip this order, keep going */ }
    }
    return Response.json({ success: true, checked: (orders || []).length, sent });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

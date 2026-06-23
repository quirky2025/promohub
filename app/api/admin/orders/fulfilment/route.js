import { getAdminUser, unauthorized } from '@/lib/adminAuth';
import { sourcingDb } from '@/lib/sourcingDb';
import { Resend } from 'resend';
import { quirkyEmail } from '@/lib/emailLayout';

const resend = new Resend(process.env.RESEND_API_KEY);

// POST { orderId, action: 'dispatch' | 'delivered' | 'feedback', trackingNumber?, trackingUrl?, carrier? }
export async function POST(request) {
  const user = await getAdminUser(request);
  if (!user) return unauthorized();

  try {
    const b = await request.json();
    const { orderId, action } = b;
    if (!orderId || !action) return Response.json({ error: 'Missing orderId/action' }, { status: 400 });

    const db = sourcingDb();
    const { data: o } = await db.from('orders').select('*').eq('id', orderId).single();
    if (!o) return Response.json({ error: 'Order not found' }, { status: 404 });

    const name = o.customer_name || 'there';
    const orderNo = o.order_number || o.invoice_number || '';
    const email = o.customer_email;
    let updates = {};
    let subject = '', body = '';

    if (action === 'dispatch') {
      const now = new Date().toISOString();
      updates = { status: 'dispatched', dispatched_at: now };
      if (b.trackingNumber !== undefined) updates.tracking_number = b.trackingNumber || null;
      if (b.trackingUrl !== undefined) updates.tracking_url = b.trackingUrl || null;
      const trackLine = b.trackingNumber
        ? `<div style="background:#F8F7F4;border-radius:10px;padding:14px 18px;margin:16px 0;font-size:14px;">
             <span style="color:#7A7570;">Carrier</span> <strong style="color:#1B2A4A;">${b.carrier || 'Courier'}</strong>
             &nbsp;·&nbsp; <span style="color:#7A7570;">Tracking</span> <strong style="color:#1B2A4A;">${b.trackingNumber}</strong>
             ${b.trackingUrl ? `<div style="margin-top:8px;"><a href="${b.trackingUrl}" style="color:#C9A96E;">Track your parcel →</a></div>` : ''}
           </div>` : '';
      subject = `Your order has been dispatched — ${orderNo}`;
      body = `
        <p style="font-size:15px;margin:0 0 16px;">Hi ${name},</p>
        <p style="font-size:15px;line-height:1.6;margin:0 0 16px;">Great news — your order <strong>${orderNo}</strong> is on its way! 🚚</p>
        ${trackLine}
        <p style="font-size:14px;line-height:1.6;color:#3D3A36;margin:16px 0 0;">Any questions, just reply or call us on <strong>02 9477 4748</strong>.</p>`;
    } else if (action === 'delivered') {
      updates = { status: 'completed', delivered_at: new Date().toISOString() };
      subject = `Your order has arrived — ${orderNo}`;
      body = `
        <p style="font-size:15px;margin:0 0 16px;">Hi ${name},</p>
        <p style="font-size:15px;line-height:1.6;margin:0 0 16px;">Your order <strong>${orderNo}</strong> has been delivered. We hope it's everything you wanted! 🎉</p>
        <p style="font-size:14px;line-height:1.6;color:#3D3A36;margin:16px 0 0;">If anything isn't quite right, just reply or call us on <strong>02 9477 4748</strong>.</p>`;
    } else if (action === 'feedback') {
      updates = { feedback_requested_at: new Date().toISOString() };
      const prods = (Array.isArray(o.items) ? o.items.map(it => it.productName || it.name).filter(Boolean) : []);
      const prodText = prods.length ? prods.join(', ') : 'your order';
      subject = `How are your ${prods[0] || 'promo products'} working out? — ${orderNo}`;
      body = `
        <p style="font-size:15px;margin:0 0 16px;">Hi ${name},</p>
        <p style="font-size:15px;line-height:1.6;margin:0 0 16px;">A little while back we made your <strong>${prodText}</strong>${o.job_name ? ` for <strong>${o.job_name}</strong>` : ''} — and now that it's had a few days to settle in, we'd love to know how it's going.</p>
        <p style="font-size:15px;line-height:1.6;margin:0 0 16px;">Did everything arrive in great shape? Are the prints looking sharp? Just hit reply with a quick line — good or not-so-good, we read every one and it genuinely helps us improve.</p>
        <p style="font-size:15px;line-height:1.6;margin:0 0 16px;">And whenever you need more, we've kept your artwork on file — reorders are quick and easy. Just reply and we'll sort it.</p>
        <p style="font-size:14px;line-height:1.6;color:#3D3A36;margin:16px 0 0;">Thank you for choosing QuirkyPromo. 💛</p>`;
    } else {
      return Response.json({ error: 'Unknown action' }, { status: 400 });
    }

    const { error: upErr } = await db.from('orders').update(updates).eq('id', orderId);
    if (upErr && !/column|does not exist|could not find/i.test(upErr.message || '')) {
      return Response.json({ error: upErr.message }, { status: 500 });
    }

    if (email) {
      await resend.emails.send({
        from: 'QuirkyPromo <noreply@quirkypromo.com.au>',
        replyTo: 'hello@quirkypromo.com.au',
        to: [email],
        subject,
        html: quirkyEmail(body),
      });
    }

    return Response.json({ success: true });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

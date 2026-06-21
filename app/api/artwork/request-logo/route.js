import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import crypto from 'crypto';
import { quirkyEmail } from '@/lib/emailLayout';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    const { orderNumber, customerName, customerEmail, productName, paymentMethod } = body;

    const token = crypto.randomBytes(32).toString('hex');

    // Save pending artwork record (no logo yet)
    await supabase.from('artworks').insert({
      order_number: orderNumber,
      customer_name: customerName,
      customer_email: customerEmail,
      product_name: productName,
      status: 'awaiting_logo',
      token,
      payment_method: paymentMethod,
    });

    const uploadUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/upload/${token}`;

    // Email to customer requesting logo
    await resend.emails.send({
      from: 'QuirkyPromo <noreply@quirkypromo.com.au>',
      replyTo: 'hello@quirkypromo.com.au',
      to: [customerEmail],
      subject: `One quick step for your order ${orderNumber} — upload your logo`,
      html: quirkyEmail(`
        <p style="font-size:15px;margin:0 0 16px;">Hi ${customerName},</p>
        <p style="font-size:15px;line-height:1.6;margin:0 0 16px;">Thank you so much for your order of <strong>${productName}</strong> — we can't wait to get started! To create your free artwork mockup, we just need your logo file.</p>
        <div style="text-align:center;margin:28px 0;">
          <a href="${uploadUrl}" style="display:inline-block;background:#C9A96E;color:#fff;text-decoration:none;padding:15px 38px;border-radius:10px;font-weight:700;font-size:16px;">Upload your logo →</a>
        </div>
        <div style="background:#F8F7F4;border-radius:10px;padding:16px 20px;margin:0 0 16px;font-size:14px;">
          <div style="font-weight:700;color:#1B2A4A;margin-bottom:8px;">Accepted file formats</div>
          <div style="color:#000000;font-weight:700;">VECTOR FILES ONLY — AI, PDF, EPS or SVG. We cannot print from PNG or JPG.</div>
        </div>
        <p style="font-size:14px;line-height:1.6;color:#7A7570;margin:0;">Prefer email? Send your logo to <a href="mailto:hello@quirkypromo.com.au" style="color:#C9A96E;">hello@quirkypromo.com.au</a> and quote <strong>${orderNumber}</strong>. Any questions, just reply or call us on <strong style="color:#1B2A4A;">02 9477 4748</strong>.</p>
      `),
    });

    // Notify you
    await resend.emails.send({
      from: 'QuirkyPromo <noreply@quirkypromo.com.au>',
      replyTo: customerEmail,
      to: ['hello@quirkypromo.com.au'],
      subject: `Awaiting Logo — ${orderNumber} — ${customerName}`,
      html: `<p><strong>${customerName}</strong> placed order <strong>${orderNumber}</strong> for <strong>${productName}</strong> but did not upload a logo.<br>A "please upload logo" email has been sent to ${customerEmail}.</p>`,
    });

    return Response.json({ success: true, token });
  } catch (error) {
    return Response.json({ error: 'Failed' }, { status: 500 });
  }
}

import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import crypto from 'crypto';

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
      subject: `Action Required: Upload Your Logo — ${orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; color: #1a1a1a;">
          <div style="background: #1B2A4A; padding: 28px 32px; border-radius: 12px 12px 0 0;">
            <h1 style="color: #C9A96E; font-family: Georgia, serif; font-size: 24px; margin: 0 0 4px;">QuirkyPromo</h1>
            <p style="color: rgba(255,255,255,0.6); font-size: 14px; margin: 0;">Logo Upload Required · ${orderNumber}</p>
          </div>
          <div style="background: #fff; border: 1px solid #E0DDD7; border-top: none; padding: 28px 32px; border-radius: 0 0 12px 12px;">
            <p style="font-size: 15px; margin: 0 0 16px;">Hi ${customerName},</p>
            <p style="font-size: 15px; margin: 0 0 24px;">Thank you for your order of <strong>${productName}</strong>! To create your artwork mockup, we need your logo file.</p>

            <div style="text-align: center; margin: 32px 0;">
              <a href="${uploadUrl}" style="display: inline-block; background: #C9A96E; color: #fff; text-decoration: none; padding: 16px 40px; border-radius: 10px; font-weight: 700; font-size: 16px;">
                Upload Your Logo →
              </a>
            </div>

            <div style="background: #F8F7F4; border-radius: 10px; padding: 16px 20px; margin: 0 0 24px; font-size: 14px;">
              <div style="font-weight: 700; color: #1B2A4A; margin-bottom: 8px;">Accepted file formats:</div>
              <div style="color: #7A7570;">AI, PDF, PNG, JPG, EPS, SVG</div>
              <div style="color: #7A7570; margin-top: 8px;">For best results, please provide a vector file (AI, PDF, or EPS).</div>
            </div>

            <p style="font-size: 13px; color: #7A7570; text-align: center;">Or email your logo directly to <a href="mailto:hello@quirkypromo.com.au" style="color: #C9A96E;">hello@quirkypromo.com.au</a> with your order number <strong>${orderNumber}</strong>.</p>
            <p style="font-size: 14px; color: #7A7570; text-align: center; margin-top: 16px;">Questions? Call us: <strong style="color: #1B2A4A;">02 9477 4748</strong></p>
          </div>
        </div>
      `,
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

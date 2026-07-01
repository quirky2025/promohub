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
    const {
      orderNumber, customerName, customerEmail,
      productName, productImageUrl, logoUrl, logoPngUrl,
      paymentMethod, brandingSummary, colour, qty, token: existingToken,
    } = body;

    // Use existing token or generate new one
    const token = existingToken || crypto.randomBytes(32).toString('hex');

    // Save to Supabase (update if token exists, insert if new)
    if (existingToken) {
      await supabase.from('artworks').update({
        logo_url: logoUrl,
        logo_png_url: logoPngUrl,
        product_image_url: productImageUrl || '',
        status: 'logo_received',
      }).eq('token', existingToken);
    } else {
      await supabase.from('artworks').insert({
        order_number: orderNumber,
        customer_name: customerName,
        customer_email: customerEmail,
        product_name: productName,
        product_image_url: productImageUrl || '',
        logo_url: logoUrl,
        logo_png_url: logoPngUrl,
        mockup_url: '',
        status: 'logo_received',
        token,
        payment_method: paymentMethod,
      });
    }

    const adminUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/admin/artworks`;

    // ✅ Only notify YOU — do NOT send mockup to customer yet
    await resend.emails.send({
      from: 'QuirkyPromo <noreply@quirkypromo.com.au>',
      replyTo: customerEmail,
      to: ['hello@quirkypromo.com.au'],
      subject: `🎨 Logo Received — ${orderNumber} — ${customerName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto;">
          <div style="background: #1B2A4A; padding: 20px 28px; border-radius: 12px 12px 0 0;">
            <h2 style="color: #C9A96E; margin: 0; font-size: 20px;">Logo Received — Action Required</h2>
            <p style="color: rgba(255,255,255,0.6); margin: 4px 0 0; font-size: 14px;">${orderNumber} · ${customerName}</p>
          </div>
          <div style="background: #fff; border: 1px solid #E0DDD7; border-top: none; padding: 20px 28px; border-radius: 0 0 12px 12px;">
            <p style="font-size: 15px;"><strong>${customerName}</strong> has uploaded their logo for order <strong style="color: #C9A96E;">${orderNumber}</strong>.</p>

            <div style="background: #ffffff; border-radius: 10px; padding: 16px 20px; margin: 16px 0; font-size: 14px;">
              <div style="margin-bottom: 6px;"><span style="color: #7A7570;">Product:</span> <strong>${productName}</strong></div>
              ${colour ? `<div style="margin-bottom: 6px;"><span style="color: #7A7570;">Colour:</span> <strong>${colour}</strong></div>` : ''}
              ${qty ? `<div style="margin-bottom: 6px;"><span style="color: #7A7570;">Quantity:</span> <strong>${qty}</strong></div>` : ''}
              ${brandingSummary ? `<div style="margin-bottom: 6px;"><span style="color: #7A7570;">Branding:</span> <strong>${brandingSummary}</strong></div>` : ''}
              <div><span style="color: #7A7570;">Payment:</span> <strong>${paymentMethod === 'eft' ? 'EFT (Invoice after approval)' : 'Credit Card (Paid)'}</strong></div>
            </div>

            <div style="margin: 20px 0; text-align: center;">
              <p style="color: #7A7570; font-size: 13px; margin-bottom: 8px;">Customer Logo:</p>
              <img src="${logoPngUrl || logoUrl}" alt="Customer Logo" style="max-width: 300px; max-height: 200px; border: 1px solid #E0DDD7; border-radius: 8px; padding: 10px; background: #fff;" />
            </div>

            <div style="margin: 16px 0;">
              <a href="${logoUrl}" download style="display: inline-block; background: #1B2A4A; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 600; margin-right: 10px;">
                Download Logo
              </a>
              ${productImageUrl ? `<a href="${productImageUrl}" download style="display: inline-block; background: #fff; color: #1B2A4A; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 600; border: 1.5px solid #1B2A4A;">
                Download Product Image
              </a>` : ''}
            </div>

            <div style="background: #FEF3C7; border-radius: 8px; padding: 14px 16px; margin: 16px 0; font-size: 14px; color: #92400E;">
              <strong>Next step:</strong> Please create the Mockup using Gaoding or Photoshop, then upload it in the Admin panel.
            </div>

            <a href="${adminUrl}" style="display: inline-block; background: #C9A96E; color: #fff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 700; font-size: 15px;">
              Go to Admin Panel →
            </a>

            <p style="font-size: 13px; color: #7A7570; margin-top: 16px;">
              Customer email: <a href="mailto:${customerEmail}" style="color: #C9A96E;">${customerEmail}</a>
            </p>
          </div>
        </div>
      `,
    });

    // ✅ Send acknowledgement to customer — logo received, mockup coming soon
    await resend.emails.send({
      from: 'QuirkyPromo <noreply@quirkypromo.com.au>',
      replyTo: 'hello@quirkypromo.com.au',
      to: [customerEmail],
      subject: `Got it! We're preparing your mockup — ${orderNumber}`,
      html: quirkyEmail(`
        <p style="font-size:15px;margin:0 0 16px;">Hi ${customerName},</p>
        <p style="font-size:15px;line-height:1.6;margin:0 0 16px;">Thank you — we've received your logo for <strong>${productName}</strong>! Our team is now putting together your artwork mockup, and we'll send it over for your approval very soon.</p>
        <div style="background:#ffffff;border-radius:10px;padding:16px 20px;margin:0 0 16px;font-size:14px;">
          <div style="margin-bottom:6px;"><span style="color:#7A7570;">Order</span> <strong style="color:#C9A96E;">${orderNumber}</strong></div>
          <div style="margin-bottom:6px;"><span style="color:#7A7570;">Product</span> <strong>${productName}</strong></div>
          ${colour ? `<div style="margin-bottom:6px;"><span style="color:#7A7570;">Colour</span> <strong>${colour}</strong></div>` : ''}
          ${qty ? `<div><span style="color:#7A7570;">Quantity</span> <strong>${qty}</strong></div>` : ''}
        </div>
        <p style="font-size:14px;line-height:1.6;color:#7A7570;margin:0;">Sit tight — there's nothing more you need to do right now. Any questions, just reply or call us on <strong style="color:#1B2A4A;">02 9477 4748</strong>.</p>
      `),
    });

    return Response.json({ success: true, token });
  } catch (error) {
    return Response.json({ error: 'Failed to process artwork' }, { status: 500 });
  }
}

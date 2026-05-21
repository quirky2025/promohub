import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function generateInvoiceNumber() {
  const year = new Date().getFullYear();
  const { count } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true });
  const num = String((count || 0) + 1).padStart(4, '0');
  return `QP-${year}-${num}`;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { customer, items, subtotal, shipping, gst, total, paymentMethod, surcharge } = body;

    const invoiceNumber = await generateInvoiceNumber();
    const deliveryAddress = [
      customer.street,
      customer.street2,
      customer.suburb,
      customer.state,
      customer.postcode,
      'Australia'
    ].filter(Boolean).join(', ');

    // Save to Supabase
    const { error } = await supabase.from('orders').insert({
      invoice_number: invoiceNumber,
      customer_name: customer.name,
      customer_email: customer.email,
      customer_phone: customer.phone || '',
      customer_company: customer.company || '',
      delivery_address: deliveryAddress,
      items: items,
      subtotal,
      shipping,
      gst,
      total,
      payment_method: paymentMethod,
      payment_status: paymentMethod === 'stripe' ? 'paid' : 'unpaid',
      created_at: new Date().toISOString(),
    });

    if (error) throw error;

    // Build items HTML for email
    const itemsHtml = items.map(item => `
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #F0EEED;">
          <div style="font-weight: 600; color: #1B2A4A;">${item.productName}</div>
          ${item.colour ? `<div style="font-size: 12px; color: #7A7570;">Colour: ${item.colour}</div>` : ''}
          ${item.addons?.length ? item.addons.map(a => `<div style="font-size: 12px; color: #7A7570;">+ ${a.name}</div>`).join('') : ''}
          <div style="font-size: 12px; color: #7A7570;">Qty: ${item.qty} × $${item.unitPrice.toFixed(2)}</div>
        </td>
        <td style="padding: 10px 0; border-bottom: 1px solid #F0EEED; text-align: right; font-weight: 600; color: #1B2A4A; font-family: monospace;">$${item.subtotal.toFixed(2)}</td>
      </tr>
    `).join('');

    const bankDetailsHtml = paymentMethod === 'eft' ? `
      <div style="background: #F8F7F4; border-radius: 10px; padding: 16px 20px; margin: 20px 0;">
        <div style="font-weight: 700; color: #1B2A4A; margin-bottom: 12px;">Bank Transfer Details:</div>
        <table style="width: 100%; font-size: 14px;">
          <tr><td style="color: #7A7570; padding: 4px 0;">Account Name</td><td style="font-weight: 600; text-align: right;">Grow Your Marketing</td></tr>
          <tr><td style="color: #7A7570; padding: 4px 0;">Bank</td><td style="font-weight: 600; text-align: right;">ANZ</td></tr>
          <tr><td style="color: #7A7570; padding: 4px 0;">BSB</td><td style="font-weight: 600; text-align: right; font-family: monospace;">012-306</td></tr>
          <tr><td style="color: #7A7570; padding: 4px 0;">Account Number</td><td style="font-weight: 600; text-align: right; font-family: monospace;">192040129</td></tr>
          <tr><td style="color: #7A7570; padding: 4px 0;">Reference</td><td style="font-weight: 600; text-align: right; color: #C9A96E;">${invoiceNumber}</td></tr>
        </table>
      </div>
    ` : '';

    const emailHtml = `
      <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 620px; margin: 0 auto; color: #1a1a1a;">
        <div style="background: #1B2A4A; padding: 28px 32px; border-radius: 12px 12px 0 0;">
          <h1 style="color: #C9A96E; font-family: Georgia, serif; font-size: 24px; margin: 0 0 4px;">QuirkyPromo</h1>
          <p style="color: rgba(255,255,255,0.6); font-size: 14px; margin: 0;">Order Confirmation · ${invoiceNumber}</p>
        </div>
        <div style="background: #fff; border: 1px solid #E0DDD7; border-top: none; padding: 28px 32px; border-radius: 0 0 12px 12px;">
          <p style="font-size: 15px; margin: 0 0 16px;">Hi ${customer.name},</p>
          <p style="font-size: 15px; margin: 0 0 24px;">Thank you for your order! We'll send you a <strong>free digital proof</strong> for approval shortly. Production only begins after you approve the artwork.</p>

          <h2 style="font-size: 14px; color: #1B2A4A; margin: 0 0 12px; padding-bottom: 10px; border-bottom: 1px solid #F0EEED; text-transform: uppercase; letter-spacing: 0.08em;">Order Details</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            ${itemsHtml}
          </table>

          <table style="width: 100%; font-size: 14px; margin-bottom: 20px;">
            <tr><td style="color: #7A7570; padding: 4px 0;">Subtotal (excl. GST)</td><td style="text-align: right; font-family: monospace;">$${subtotal.toFixed(2)}</td></tr>
            <tr><td style="color: #7A7570; padding: 4px 0;">Shipping & Handling</td><td style="text-align: right; font-family: monospace;">$${shipping.toFixed(2)}</td></tr>
            <tr><td style="color: #7A7570; padding: 4px 0;">GST (10%)</td><td style="text-align: right; font-family: monospace;">$${gst.toFixed(2)}</td></tr>
            ${surcharge ? `<tr><td style="color: #7A7570; padding: 4px 0;">Credit card surcharge (2%)</td><td style="text-align: right; font-family: monospace;">$${surcharge.toFixed(2)}</td></tr>` : ''}
            <tr style="font-weight: 700; font-size: 16px; border-top: 2px solid #E0DDD7;">
              <td style="padding: 10px 0; color: #1B2A4A;">Total (incl. GST)</td>
              <td style="text-align: right; color: #C9A96E; font-family: monospace;">$${total.toFixed(2)}</td>
            </tr>
          </table>

          <p style="font-size: 13px; color: #7A7570; margin: 0 0 4px;">Payment Status: <strong style="color: ${paymentMethod === 'stripe' ? '#2D6A4F' : '#C0392B'}">${paymentMethod === 'stripe' ? 'PAID' : 'AWAITING PAYMENT'}</strong></p>

          ${bankDetailsHtml}

          <h2 style="font-size: 14px; color: #1B2A4A; margin: 20px 0 12px; padding-bottom: 10px; border-bottom: 1px solid #F0EEED; text-transform: uppercase; letter-spacing: 0.08em;">Delivery Address</h2>
          <p style="font-size: 14px; color: #3D3A36; margin: 0 0 20px;">${deliveryAddress}</p>

          <p style="font-size: 14px; color: #7A7570; margin: 0 0 4px;">Questions? Call us: <strong style="color: #1B2A4A;">02 9477 4748</strong></p>
          <p style="font-size: 14px; color: #7A7570; margin: 0;">Or email: <a href="mailto:hello@quirkypromo.com.au" style="color: #C9A96E;">hello@quirkypromo.com.au</a></p>

          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #F0EEED; font-size: 12px; color: #B0AAA3;">
            ABN: 95 656 714 270 · QuirkyPromo · quirkypromo.com.au
          </div>
        </div>
      </div>
    `;

    // Email to customer
    await resend.emails.send({
      from: 'QuirkyPromo <noreply@quirkypromo.com.au>',
      replyTo: 'hello@quirkypromo.com.au',
      to: [customer.email],
      subject: `Order Confirmed — ${invoiceNumber}`,
      html: emailHtml,
    });

    // Email to you
    await resend.emails.send({
      from: 'QuirkyPromo <noreply@quirkypromo.com.au>',
      replyTo: customer.email,
      to: ['hello@quirkypromo.com.au'],
      subject: `New Order: ${invoiceNumber} — ${customer.name}`,
      html: emailHtml,
    });

    return Response.json({ success: true, invoiceNumber });
  } catch (error) {
    console.error('Order API error:', error);
    return Response.json({ error: 'Failed to process order' }, { status: 500 });
  }
}

import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ PO260001 格式
async function generateOrderNumber() {
  const year = String(new Date().getFullYear()).slice(2);
  const { count } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true });
  const num = String((count || 0) + 1).padStart(4, '0');
  return `PO${year}${num}`;
}

// ✅ 生成 Invoice PDF
async function generateInvoicePDF({
  orderNumber, invoiceDate,
  customer, deliveryAddress,
  items, subtotal, shipping, gst, surcharge, total,
  paymentMethod, paymentStatus,
}) {
  const isEFT = paymentMethod === 'eft';
  const docTitle = isEFT ? 'ORDER CONFIRMATION' : 'INVOICE';
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4
  const { width, height } = page.getSize();

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontReg = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const NAVY = rgb(0.106, 0.165, 0.290);
  const GOLD = rgb(0.788, 0.663, 0.431);
  const GREY = rgb(0.478, 0.459, 0.439);
  const WHITE = rgb(1, 1, 1);
  const LIGHT = rgb(0.973, 0.969, 0.957);
  const BLACK = rgb(0.1, 0.1, 0.1);
  const GREEN = rgb(0.176, 0.416, 0.310);
  const RED = rgb(0.753, 0.224, 0.169);

  // ── HEADER ──────────────────────────────────────────────
  page.drawRectangle({ x: 0, y: height - 80, width, height: 80, color: NAVY });
  page.drawText('QUIRKY', { x: 40, y: height - 45, size: 22, font: fontBold, color: WHITE });
  page.drawText('PROMO', { x: 117, y: height - 45, size: 22, font: fontBold, color: GOLD });
  page.drawText('quirkypromo.com.au  |  hello@quirkypromo.com.au  |  02 9477 4748', {
    x: 40, y: height - 62, size: 8, font: fontReg, color: rgb(0.7, 0.7, 0.7),
  });

  // INVOICE label
  page.drawText(docTitle, { x: width - (isEFT ? 220 : 130), y: height - 38, size: isEFT ? 14 : 28, font: fontBold, color: GOLD });
  page.drawText(orderNumber, { x: width - 130, y: height - 52, size: 9, font: fontReg, color: WHITE });
  page.drawText(`Date: ${invoiceDate}`, { x: width - 130, y: height - 64, size: 8, font: fontReg, color: rgb(0.7, 0.7, 0.7) });

  let y = height - 100;

  // ── ISSUED BY + CUSTOMER ─────────────────────────────────
  page.drawText('Issued by', { x: 40, y, size: 9, font: fontBold, color: NAVY });
  page.drawText('QuirkyPromo', { x: 40, y: y - 13, size: 9, font: fontReg, color: BLACK });
  page.drawText('ABN: 95 656 714 270', { x: 40, y: y - 25, size: 9, font: fontReg, color: BLACK });
  page.drawText('02 9477 4748', { x: 40, y: y - 37, size: 9, font: fontReg, color: BLACK });
  page.drawText('hello@quirkypromo.com.au', { x: 40, y: y - 49, size: 9, font: fontReg, color: BLACK });

  page.drawText('Bill To', { x: 300, y, size: 9, font: fontBold, color: NAVY });
  page.drawText(customer.name || '', { x: 300, y: y - 13, size: 9, font: fontBold, color: BLACK });
  if (customer.company) page.drawText(customer.company, { x: 300, y: y - 25, size: 9, font: fontReg, color: BLACK });
  page.drawText(customer.email || '', { x: 300, y: y - 37, size: 9, font: fontReg, color: BLACK });
  if (customer.phone) page.drawText(customer.phone, { x: 300, y: y - 49, size: 9, font: fontReg, color: BLACK });
  if (deliveryAddress) page.drawText(deliveryAddress.substring(0, 60), { x: 300, y: y - 61, size: 8, font: fontReg, color: GREY });

  y -= 90;

  // ── PAYMENT STATUS BADGE ─────────────────────────────────
  const badgeColor = paymentStatus === 'paid' ? GREEN : (isEFT ? rgb(0.106, 0.165, 0.290) : RED);
  const badgeText = paymentStatus === 'paid' ? 'PAID' : (isEFT ? 'ORDER RECEIVED' : 'AWAITING PAYMENT');
  page.drawRectangle({ x: 40, y: y - 6, width: 120, height: 20, color: badgeColor, borderRadius: 4 });
  page.drawText(badgeText, { x: 48, y: y - 1, size: 8, font: fontBold, color: WHITE });

  // Payment method
  const methodText = paymentMethod === 'stripe' ? 'Paid by Card' : 'Payment: EFT Bank Transfer';
  page.drawText(methodText, { x: 170, y: y - 1, size: 8, font: fontReg, color: GREY });

  y -= 24;

  // ── DIVIDER ──────────────────────────────────────────────
  page.drawLine({ start: { x: 40, y }, end: { x: width - 40, y }, thickness: 0.5, color: rgb(0.88, 0.87, 0.84) });
  y -= 20;

  // ── ITEMS TABLE ──────────────────────────────────────────
  page.drawText('ORDER DETAILS', { x: 40, y, size: 8, font: fontBold, color: NAVY });
  y -= 18;

  // Table header
  page.drawRectangle({ x: 40, y: y - 4, width: width - 80, height: 20, color: NAVY });
  page.drawText('ITEM', { x: 48, y: y + 1, size: 8, font: fontBold, color: WHITE });
  page.drawText('QTY', { x: 310, y: y + 1, size: 8, font: fontBold, color: WHITE });
  page.drawText('UNIT PRICE', { x: 360, y: y + 1, size: 8, font: fontBold, color: WHITE });
  page.drawText('AMOUNT', { x: 460, y: y + 1, size: 8, font: fontBold, color: WHITE });
  y -= 22;

  // Items
  items.forEach((item, idx) => {
    const addonLines = item.addons?.length || 0;
    const rowHeight = Math.max(36, (2 + addonLines) * 13 + 8);
    const rowColor = idx % 2 === 0 ? LIGHT : WHITE;
    page.drawRectangle({ x: 40, y: y - rowHeight + 18, width: width - 80, height: rowHeight, color: rowColor });

    page.drawText(item.productName || '', { x: 48, y: y + 4, size: 9, font: fontBold, color: NAVY });
    let detY = y - 8;
    if (item.colour) {
      page.drawText(`Colour: ${item.colour}`, { x: 48, y: detY, size: 7.5, font: fontReg, color: GREY });
      detY -= 12;
    }
    if (item.addons?.length) {
      item.addons.forEach(a => {
        page.drawText(`+ ${a.name}`, { x: 48, y: detY, size: 7.5, font: fontReg, color: GREY });
        detY -= 12;
      });
    }
    page.drawText(String(item.qty), { x: 318, y: y + 4, size: 9, font: fontReg, color: BLACK });
    page.drawText(`$${item.unitPrice.toFixed(2)}`, { x: 360, y: y + 4, size: 9, font: fontReg, color: BLACK });
    page.drawText(`$${item.subtotal.toFixed(2)}`, { x: 460, y: y + 4, size: 9, font: fontBold, color: NAVY });
    y -= rowHeight;
  });

  // Shipping row
  page.drawRectangle({ x: 40, y: y - 4, width: width - 80, height: 20, color: WHITE });
  page.drawText('Shipping & Handling (per domestic address)', { x: 48, y: y + 1, size: 9, font: fontReg, color: BLACK });
  page.drawText('1', { x: 318, y: y + 1, size: 9, font: fontReg, color: BLACK });
  page.drawText(`$${shipping.toFixed(2)}`, { x: 360, y: y + 1, size: 9, font: fontReg, color: BLACK });
  page.drawText(`$${shipping.toFixed(2)}`, { x: 460, y: y + 1, size: 9, font: fontBold, color: NAVY });
  y -= 28;

  // ── TOTALS ───────────────────────────────────────────────
  page.drawLine({ start: { x: 380, y: y + 10 }, end: { x: width - 40, y: y + 10 }, thickness: 0.5, color: rgb(0.88, 0.87, 0.84) });
  y -= 4;

  function totRow(label, value, bold = false) {
    page.drawText(label, { x: 390, y, size: 9, font: bold ? fontBold : fontReg, color: bold ? NAVY : GREY });
    page.drawText(value, { x: 490, y, size: 9, font: bold ? fontBold : fontReg, color: bold ? GOLD : BLACK });
    y -= 16;
  }

  totRow('Subtotal (excl. GST)', `$${subtotal.toFixed(2)}`);
  totRow('Shipping & Handling', `$${shipping.toFixed(2)}`);
  totRow('GST (10%)', `$${gst.toFixed(2)}`);
  if (surcharge) totRow('Card surcharge (2%)', `$${surcharge.toFixed(2)}`);
  page.drawLine({ start: { x: 380, y: y + 12 }, end: { x: width - 40, y: y + 12 }, thickness: 1, color: NAVY });
  y -= 4;
  totRow('TOTAL (incl. GST)', `$${total.toFixed(2)}`, true);

  y -= 20;

  // ── EFT BANK DETAILS ─────────────────────────────────────
  if (paymentMethod === 'eft') {
    page.drawRectangle({ x: 40, y: y - 82, width: width - 80, height: 92, color: LIGHT, borderColor: GOLD, borderWidth: 0.5 });
    page.drawText('Bank Transfer Details', { x: 52, y: y - 6, size: 9, font: fontBold, color: NAVY });
    const bank = [
      ['Account Name', 'Grow Your Marketing'],
      ['Bank', 'ANZ'],
      ['BSB', '012-306'],
      ['Account Number', '192040129'],
      ['Reference', orderNumber],
    ];
    bank.forEach(([label, value], i) => {
      page.drawText(label, { x: 52, y: y - 22 - (i * 13), size: 8, font: fontReg, color: GREY });
      const isRef = label === 'Reference';
      page.drawText(value, { x: 200, y: y - 22 - (i * 13), size: 8, font: isRef ? fontBold : fontReg, color: isRef ? GOLD : BLACK });
    });
    y -= 100;
  }

  y -= 10;

  // ── FOOTER ───────────────────────────────────────────────
  page.drawLine({ start: { x: 40, y: 50 }, end: { x: width - 40, y: 50 }, thickness: 0.5, color: rgb(0.88, 0.87, 0.84) });
  page.drawText('Thank you for your order! We will send you a free digital proof for approval before production begins.', { x: 40, y: 36, size: 7.5, font: fontReg, color: GREY });
  page.drawText('ABN: 95 656 714 270  |  QuirkyPromo  |  quirkypromo.com.au', { x: 40, y: 24, size: 7.5, font: fontReg, color: GREY });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { customer, items, subtotal, shipping, gst, total, paymentMethod, surcharge, stripePaymentId } = body;

    // ✅ Stripe服务端验证
    let paymentStatus = 'unpaid';
    if (paymentMethod === 'stripe') {
      if (!stripePaymentId) {
        return Response.json({ error: 'Missing payment ID' }, { status: 400 });
      }
      const paymentIntent = await stripe.paymentIntents.retrieve(stripePaymentId);
      if (paymentIntent.status !== 'succeeded') {
        return Response.json({ error: 'Payment not completed' }, { status: 400 });
      }
      paymentStatus = 'paid';
    }

    const orderNumber = await generateOrderNumber();
    const invoiceDate = new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });

    const deliveryAddress = [
      customer.street, customer.street2, customer.suburb,
      customer.state, customer.postcode, 'Australia'
    ].filter(Boolean).join(', ');

    // Save to Supabase
    const { error } = await supabase.from('orders').insert({
      invoice_number: orderNumber,
      customer_name: customer.name,
      customer_email: customer.email,
      customer_phone: customer.phone || '',
      customer_company: customer.company || '',
      delivery_address: deliveryAddress,
      items,
      subtotal,
      shipping,
      gst,
      total,
      payment_method: paymentMethod,
      payment_status: paymentStatus,
      created_at: new Date().toISOString(),
    });

    if (error) throw error;

    // ✅ Generate Invoice PDF
    const pdfBuffer = await generateInvoicePDF({
      orderNumber,
      invoiceDate,
      customer,
      deliveryAddress,
      items,
      subtotal,
      shipping,
      gst,
      surcharge,
      total,
      paymentMethod,
      paymentStatus,
    });
    const pdfBase64 = pdfBuffer.toString('base64');

    // Build items HTML for email
    const itemsHtml = items.map(item => `
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #F0EEED;">
          <div style="font-weight: 600; color: #1B2A4A;">${item.productName}</div>
          ${item.colour ? `<div style="font-size: 12px; color: #7A7570;">Colour: ${item.colour}</div>` : ''}
          ${item.addons?.length ? item.addons.map(a => `<div style="font-size: 12px; color: #7A7570;">+ ${a.name}</div>`).join('') : ''}
          <div style="font-size: 12px; color: #7A7570;">Qty: ${item.qty} x $${item.unitPrice.toFixed(2)}</div>
        </td>
        <td style="padding: 10px 0; border-bottom: 1px solid #F0EEED; text-align: right; font-weight: 600; color: #1B2A4A; font-family: monospace;">$${item.subtotal.toFixed(2)}</td>
      </tr>
    `).join('');

    const bankDetailsHtml = paymentMethod === 'eft' ? `
      <div style="background: #F8F7F4; border-radius: 10px; padding: 16px 20px; margin: 20px 0; border: 1px solid #C9A96E;">
        <div style="font-weight: 700; color: #1B2A4A; margin-bottom: 12px;">Bank Transfer Details</div>
        <table style="width: 100%; font-size: 14px;">
          <tr><td style="color: #7A7570; padding: 4px 0;">Account Name</td><td style="font-weight: 600; text-align: right;">Grow Your Marketing</td></tr>
          <tr><td style="color: #7A7570; padding: 4px 0;">Bank</td><td style="font-weight: 600; text-align: right;">ANZ</td></tr>
          <tr><td style="color: #7A7570; padding: 4px 0;">BSB</td><td style="font-weight: 600; text-align: right; font-family: monospace;">012-306</td></tr>
          <tr><td style="color: #7A7570; padding: 4px 0;">Account Number</td><td style="font-weight: 600; text-align: right; font-family: monospace;">192040129</td></tr>
          <tr><td style="color: #7A7570; padding: 4px 0;">Reference</td><td style="font-weight: 600; text-align: right; color: #C9A96E;">${orderNumber}</td></tr>
        </table>
      </div>
    ` : '';

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; color: #1a1a1a;">
        <div style="background: #1B2A4A; padding: 28px 32px; border-radius: 12px 12px 0 0;">
          <h1 style="color: #C9A96E; font-family: Georgia, serif; font-size: 24px; margin: 0 0 4px;">QuirkyPromo</h1>
          <p style="color: rgba(255,255,255,0.6); font-size: 14px; margin: 0;">Order Confirmation  |  ${orderNumber}</p>
        </div>
        <div style="background: #fff; border: 1px solid #E0DDD7; border-top: none; padding: 28px 32px; border-radius: 0 0 12px 12px;">
          <p style="font-size: 15px; margin: 0 0 16px;">Hi ${customer.name},</p>
          <p style="font-size: 15px; margin: 0 0 24px;">Thank you for your order! Please find your <strong>${paymentMethod === 'eft' ? 'Order Confirmation' : 'Invoice'} PDF attached</strong>. We'll send you a free digital proof for approval shortly. Production only begins after you approve the artwork.</p>

          <h2 style="font-size: 14px; color: #1B2A4A; margin: 0 0 12px; padding-bottom: 10px; border-bottom: 1px solid #F0EEED; text-transform: uppercase; letter-spacing: 0.08em;">Order Details</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            ${itemsHtml}
          </table>

          <table style="width: 100%; font-size: 14px; margin-bottom: 20px;">
            <tr><td style="color: #7A7570; padding: 4px 0;">Subtotal (excl. GST)</td><td style="text-align: right; font-family: monospace;">$${subtotal.toFixed(2)}</td></tr>
            <tr><td style="color: #7A7570; padding: 4px 0;">Shipping & Handling</td><td style="text-align: right; font-family: monospace;">$${shipping.toFixed(2)}</td></tr>
            <tr><td style="color: #7A7570; padding: 4px 0;">GST (10%)</td><td style="text-align: right; font-family: monospace;">$${gst.toFixed(2)}</td></tr>
            ${surcharge ? `<tr><td style="color: #7A7570; padding: 4px 0;">Card surcharge (2%)</td><td style="text-align: right; font-family: monospace;">$${surcharge.toFixed(2)}</td></tr>` : ''}
            <tr style="font-weight: 700; font-size: 16px; border-top: 2px solid #E0DDD7;">
              <td style="padding: 10px 0; color: #1B2A4A;">Total (incl. GST)</td>
              <td style="text-align: right; color: #C9A96E; font-family: monospace;">$${total.toFixed(2)}</td>
            </tr>
          </table>

          <p style="font-size: 13px; color: #7A7570; margin: 0 0 16px;">Payment Status: <strong style="color: ${paymentStatus === 'paid' ? '#2D6A4F' : '#C0392B'}">${paymentStatus === 'paid' ? 'PAID' : 'AWAITING PAYMENT'}</strong></p>

          ${bankDetailsHtml}

          <h2 style="font-size: 14px; color: #1B2A4A; margin: 20px 0 12px; padding-bottom: 10px; border-bottom: 1px solid #F0EEED; text-transform: uppercase; letter-spacing: 0.08em;">Delivery Address</h2>
          <p style="font-size: 14px; color: #3D3A36; margin: 0 0 20px;">${deliveryAddress}</p>

          <p style="font-size: 14px; color: #7A7570; margin: 0 0 4px;">Questions? Call us: <strong style="color: #1B2A4A;">02 9477 4748</strong></p>
          <p style="font-size: 14px; color: #7A7570; margin: 0;">Or email: <a href="mailto:hello@quirkypromo.com.au" style="color: #C9A96E;">hello@quirkypromo.com.au</a></p>

          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #F0EEED; font-size: 12px; color: #B0AAA3;">
            ABN: 95 656 714 270  |  QuirkyPromo  |  quirkypromo.com.au
          </div>
        </div>
      </div>
    `;

    // ✅ Email to customer with PDF
    await resend.emails.send({
      from: 'QuirkyPromo <noreply@quirkypromo.com.au>',
      replyTo: 'hello@quirkypromo.com.au',
      to: [customer.email],
      subject: paymentMethod === 'eft' ? `Order Confirmation — ${orderNumber}` : `Invoice — ${orderNumber}`,
      html: emailHtml,
      attachments: [{ filename: paymentMethod === 'eft' ? `OrderConfirmation_${orderNumber}.pdf` : `Invoice_${orderNumber}.pdf`, content: pdfBase64 }],
    });

    // ✅ Email to you with PDF
    await resend.emails.send({
      from: 'QuirkyPromo <noreply@quirkypromo.com.au>',
      replyTo: customer.email,
      to: ['hello@quirkypromo.com.au'],
      subject: `New Order: ${orderNumber} — ${customer.name}`,
      html: emailHtml,
      attachments: [{ filename: paymentMethod === 'eft' ? `OrderConfirmation_${orderNumber}.pdf` : `Invoice_${orderNumber}.pdf`, content: pdfBase64 }],
    });

    return Response.json({ success: true, orderNumber });
  } catch (error) {
    console.error('Order API error:', error);
    return Response.json({ error: 'Failed to process order' }, { status: 500 });
  }
}

import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
const resend = new Resend(process.env.RESEND_API_KEY);

async function generateInvoiceNumber() {
  const year = String(new Date().getFullYear()).slice(2);
  const { count } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true });
  const num = String((count || 0) + 1).padStart(4, '0');
  return `INV${year}${num}`;
}

async function generateApprovalPDF({ artwork, approvedBy, approvedAt, ipAddress }) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 400]);
  const { width, height } = page.getSize();
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontReg = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const NAVY = rgb(0.106, 0.165, 0.290);
  const GOLD = rgb(0.788, 0.663, 0.431);
  const GREY = rgb(0.478, 0.459, 0.439);
  const WHITE = rgb(1, 1, 1);

  // Header
  page.drawRectangle({ x: 0, y: height - 70, width, height: 70, color: NAVY });
  page.drawText('QUIRKY', { x: 40, y: height - 38, size: 20, font: fontBold, color: WHITE });
  page.drawText('PROMO', { x: 108, y: height - 38, size: 20, font: fontBold, color: GOLD });
  page.drawText('ARTWORK APPROVAL CERTIFICATE', { x: width - 260, y: height - 35, size: 12, font: fontBold, color: GOLD });
  page.drawText('quirkypromo.com.au', { x: 40, y: height - 55, size: 8, font: fontReg, color: rgb(0.7, 0.7, 0.7) });

  let y = height - 100;

  page.drawText('This document confirms that the artwork mockup has been reviewed and approved.', {
    x: 40, y, size: 9, font: fontReg, color: GREY,
  });
  y -= 30;

  const rows = [
    ['Order Number (PO)', artwork.order_number],
    ['Product', artwork.product_name],
    ['Customer', artwork.customer_name],
    ['Email', artwork.customer_email],
    ['Approved By', approvedBy],
    ['Approval Date', new Date(approvedAt).toLocaleString('en-AU', { timeZone: 'Australia/Sydney' })],
    ['IP Address', ipAddress],
    ['Document Reference', artwork.token.substring(0, 16).toUpperCase()],
  ];

  rows.forEach(([label, value]) => {
    page.drawText(label, { x: 40, y, size: 9, font: fontBold, color: NAVY });
    page.drawText(String(value || ''), { x: 220, y, size: 9, font: fontReg, color: rgb(0.1, 0.1, 0.1) });
    y -= 20;
  });

  y -= 10;
  page.drawLine({ start: { x: 40, y }, end: { x: width - 40, y }, thickness: 0.5, color: rgb(0.88, 0.87, 0.84) });
  y -= 20;

  page.drawText('Signature:', { x: 40, y, size: 9, font: fontBold, color: NAVY });
  page.drawText(approvedBy, { x: 120, y, size: 14, font: fontBold, color: NAVY });
  y -= 20;
  page.drawText(`Electronically signed on ${new Date(approvedAt).toLocaleString('en-AU', { timeZone: 'Australia/Sydney' })}`, {
    x: 40, y, size: 8, font: fontReg, color: GREY,
  });

  y -= 30;
  page.drawText('By approving this artwork, the customer confirms they have reviewed and accepted the mockup.', {
    x: 40, y, size: 7.5, font: fontReg, color: GREY,
  });
  page.drawText('Production will commence based on this approved artwork.', {
    x: 40, y: y - 12, size: 7.5, font: fontReg, color: GREY,
  });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { token, approvedBy, ipAddress, notes } = body;

    // Get artwork record
    const { data: artwork, error } = await supabase
      .from('artworks')
      .select('*')
      .eq('token', token)
      .single();

    if (error || !artwork) {
      return Response.json({ error: 'Artwork not found' }, { status: 404 });
    }
    if (artwork.status === 'approved') {
      return Response.json({ error: 'Already approved' }, { status: 400 });
    }

    const approvedAt = new Date().toISOString();

    // Update artwork status
    await supabase.from('artworks').update({
      status: 'approved',
      approved_by: approvedBy,
      approved_at: approvedAt,
      ip_address: ipAddress,
      notes: notes || '',
    }).eq('token', token);

    // Generate Approval PDF
    const approvalPdf = await generateApprovalPDF({ artwork, approvedBy, approvedAt, ipAddress });
    const approvalPdfBase64 = approvalPdf.toString('base64');
    const approvalFilename = `ArtworkApproval_${artwork.order_number}.pdf`;

    // ── EFT: Generate and send Invoice ──────────────────────
    if (artwork.payment_method === 'eft') {
      const invoiceNumber = await generateInvoiceNumber();

      // Get order details from orders table
      const { data: order } = await supabase
        .from('orders')
        .select('*')
        .eq('invoice_number', artwork.order_number)
        .single();

      if (order) {
        // Update order with invoice number
        await supabase.from('orders').update({
          payment_status: 'invoiced',
        }).eq('invoice_number', artwork.order_number);

        const invoiceHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto;">
            <div style="background: #1B2A4A; padding: 28px 32px; border-radius: 12px 12px 0 0;">
              <h1 style="color: #C9A96E; font-family: Georgia, serif; font-size: 24px; margin: 0 0 4px;">QuirkyPromo</h1>
              <p style="color: rgba(255,255,255,0.6); font-size: 14px; margin: 0;">Invoice · ${invoiceNumber}</p>
            </div>
            <div style="background: #fff; border: 1px solid #E0DDD7; border-top: none; padding: 28px 32px; border-radius: 0 0 12px 12px;">
              <p style="font-size: 15px; margin: 0 0 16px;">Hi ${artwork.customer_name},</p>
              <p style="font-size: 15px; margin: 0 0 24px;">Thank you for approving your artwork! Please find your <strong>Invoice attached</strong>. Production will begin once payment is received.</p>

              <div style="background: #F8F7F4; border-radius: 10px; padding: 16px 20px; margin: 0 0 24px;">
                <div style="margin-bottom: 6px;"><span style="color: #7A7570;">Order Number:</span> <strong style="color: #C9A96E;">${artwork.order_number}</strong></div>
                <div style="margin-bottom: 6px;"><span style="color: #7A7570;">Invoice Number:</span> <strong style="color: #1B2A4A;">${invoiceNumber}</strong></div>
                <div><span style="color: #7A7570;">Amount Due:</span> <strong style="color: #C9A96E;">$${order.total.toFixed(2)} incl. GST</strong></div>
              </div>

              <div style="background: #FDF8F0; border: 1px solid #C9A96E; border-radius: 10px; padding: 16px 20px; margin: 0 0 24px;">
                <div style="font-weight: 700; color: #1B2A4A; margin-bottom: 12px;">Bank Transfer Details</div>
                <table style="width: 100%; font-size: 14px;">
                  <tr><td style="color: #7A7570; padding: 4px 0;">Account Name</td><td style="font-weight: 600; text-align: right;">Grow Your Marketing</td></tr>
                  <tr><td style="color: #7A7570; padding: 4px 0;">Bank</td><td style="font-weight: 600; text-align: right;">ANZ</td></tr>
                  <tr><td style="color: #7A7570; padding: 4px 0;">BSB</td><td style="font-weight: 600; text-align: right; font-family: monospace;">012-306</td></tr>
                  <tr><td style="color: #7A7570; padding: 4px 0;">Account Number</td><td style="font-weight: 600; text-align: right; font-family: monospace;">192040129</td></tr>
                  <tr><td style="color: #7A7570; padding: 4px 0;">Reference</td><td style="font-weight: 600; text-align: right; color: #C9A96E;">${invoiceNumber}</td></tr>
                </table>
              </div>

              <p style="font-size: 14px; color: #7A7570;">Questions? Call us: <strong style="color: #1B2A4A;">02 9477 4748</strong></p>
            </div>
          </div>
        `;

        await resend.emails.send({
          from: 'QuirkyPromo <noreply@quirkypromo.com.au>',
          replyTo: 'hello@quirkypromo.com.au',
          to: [artwork.customer_email],
          subject: `Invoice ${invoiceNumber} — ${artwork.order_number}`,
          html: invoiceHtml,
          attachments: [
            { filename: approvalFilename, content: approvalPdfBase64 },
          ],
        });

        // Notify you
        await resend.emails.send({
          from: 'QuirkyPromo <noreply@quirkypromo.com.au>',
          replyTo: artwork.customer_email,
          to: ['hello@quirkypromo.com.au'],
          subject: `Artwork Approved + Invoice Sent — ${artwork.order_number}`,
          html: `<p><strong>${artwork.customer_name}</strong> approved artwork for <strong>${artwork.product_name}</strong>.<br>Invoice <strong>${invoiceNumber}</strong> sent. Awaiting payment.</p>`,
          attachments: [{ filename: approvalFilename, content: approvalPdfBase64 }],
        });
      }
    } else {
      // Stripe: already paid, just send approval confirmation + notify you to start production
      await resend.emails.send({
        from: 'QuirkyPromo <noreply@quirkypromo.com.au>',
        replyTo: 'hello@quirkypromo.com.au',
        to: [artwork.customer_email],
        subject: `Artwork Approved — Production Starting — ${artwork.order_number}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto;">
            <div style="background: #1B2A4A; padding: 28px 32px; border-radius: 12px 12px 0 0;">
              <h1 style="color: #C9A96E; font-family: Georgia, serif; font-size: 24px; margin: 0;">QuirkyPromo</h1>
            </div>
            <div style="background: #fff; border: 1px solid #E0DDD7; border-top: none; padding: 28px 32px; border-radius: 0 0 12px 12px;">
              <p>Hi ${artwork.customer_name},</p>
              <p>Your artwork has been approved and <strong>production is now starting</strong> for your order <strong>${artwork.order_number}</strong>.</p>
              <p>We'll notify you as soon as your order is dispatched.</p>
              <p style="color: #7A7570; font-size: 14px;">Questions? Call us: <strong style="color: #1B2A4A;">02 9477 4748</strong></p>
            </div>
          </div>
        `,
        attachments: [{ filename: approvalFilename, content: approvalPdfBase64 }],
      });

      // Notify you to start production
      await resend.emails.send({
        from: 'QuirkyPromo <noreply@quirkypromo.com.au>',
        replyTo: artwork.customer_email,
        to: ['hello@quirkypromo.com.au'],
        subject: `PRODUCTION START — ${artwork.order_number} — Artwork Approved`,
        html: `<p><strong>${artwork.customer_name}</strong> approved artwork for <strong>${artwork.product_name}</strong>.<br>Payment already received. <strong>Ready to place supplier order.</strong></p>`,
        attachments: [{ filename: approvalFilename, content: approvalPdfBase64 }],
      });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Artwork approve error:', error);
    return Response.json({ error: 'Failed to process approval' }, { status: 500 });
  }
}

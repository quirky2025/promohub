import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { PDFDocument } from 'pdf-lib';
import { quirkyEmail } from '@/lib/emailLayout';
import { generateApprovalCertificate } from '@/lib/certGen';
import { generateOrderDocPDF } from '@/lib/orderDocPdf';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
const resend = new Resend(process.env.RESEND_API_KEY);

const BANK = { name: 'Grow Your Marketing', bank: 'ANZ', bsb: '012-306', acct: '192040129' };
const money = (n) => '$' + Number(n || 0).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

async function generateInvoiceNumber() {
  const year = String(new Date().getFullYear()).slice(2);
  const { count } = await supabase.from('orders').select('*', { count: 'exact', head: true });
  return `INV${year}${String((count || 0) + 1).padStart(4, '0')}`;
}

// Combine the approved ARTWORK proof (page 1+) with the CERTIFICATE (last).
async function buildApprovedPack(artworkUrl, certBytes) {
  const merged = await PDFDocument.create();
  if (artworkUrl) {
    try {
      const res = await fetch(artworkUrl);
      if (res.ok) {
        const buf = new Uint8Array(await res.arrayBuffer());
        const looksPdf = /\.pdf($|\?)/i.test(artworkUrl) || (res.headers.get('content-type') || '').includes('pdf');
        if (looksPdf) {
          const a = await PDFDocument.load(buf);
          const pages = await merged.copyPages(a, a.getPageIndices());
          pages.forEach(p => merged.addPage(p));
        } else {
          let img; try { img = await merged.embedPng(buf); } catch { img = await merged.embedJpg(buf); }
          const pg = merged.addPage([595, 842]);
          const maxW = 515, maxH = 760;
          let w = img.width, h = img.height; const r = Math.min(maxW / w, maxH / h);
          w *= r; h *= r;
          pg.drawImage(img, { x: (595 - w) / 2, y: (842 - h) / 2, width: w, height: h });
        }
      }
    } catch { /* skip artwork if unavailable */ }
  }
  const c = await PDFDocument.load(certBytes);
  const cPages = await merged.copyPages(c, c.getPageIndices());
  cPages.forEach(p => merged.addPage(p));
  return await merged.save();
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { token, approvedBy, notes } = body;

    const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim()
      || req.headers.get('x-real-ip') || '';
    const host = req.headers.get('host');
    const proto = req.headers.get('x-forwarded-proto') || 'https';
    const site = host ? `${proto}://${host}` : (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.quirkypromo.com.au');

    const { data: artwork, error } = await supabase.from('artworks').select('*').eq('token', token).single();
    if (error || !artwork) return Response.json({ error: 'Artwork not found' }, { status: 404 });
    if (artwork.status === 'approved') return Response.json({ error: 'Already approved' }, { status: 400 });

    const approvedAt = new Date().toISOString();
    const approvedAtText = new Date(approvedAt).toLocaleString('en-AU', { timeZone: 'Australia/Sydney' });

    await supabase.from('artworks').update({
      status: 'approved', approved_by: approvedBy, approved_at: approvedAt, ip_address: ip, notes: notes || '',
    }).eq('token', token);

    // Certificate, then combine: ARTWORK (front) + CERTIFICATE (back)
    const certBytes = await generateApprovalCertificate({
      brandLogoUrl: site + '/quirky-logo-light.png',
      refNumber: `AP-${artwork.order_number}-V1`,
      approvedOnText: approvedAtText,
      signerName: approvedBy,
      signerEmail: artwork.customer_email,
      approvedAtText, ip,
      orderNumber: artwork.order_number,
      productName: artwork.product_name,
      version: 'V1',
    });
    const packBytes = await buildApprovedPack(artwork.mockup_url, certBytes);
    const packB64 = Buffer.from(packBytes).toString('base64');
    const packFile = `ArtworkApproval_${artwork.order_number}.pdf`;

    if (artwork.payment_method === 'eft') {
      const invoiceNumber = await generateInvoiceNumber();
      const { data: order } = await supabase.from('orders').select('*').eq('invoice_number', artwork.order_number).single();
      const attachments = [{ filename: packFile, content: packB64 }];
      let amountText = '';

      if (order) {
        await supabase.from('orders').update({ payment_status: 'invoiced' }).eq('invoice_number', artwork.order_number);
        amountText = money(order.total);
        try {
          const items = Array.isArray(order.items) ? order.items : [];
          const invBytes = await generateOrderDocPDF({
            docType: 'TAX INVOICE',
            orderNumber: invoiceNumber,
            date: new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }),
            customer: { company: order.customer_company, name: order.customer_name, email: order.customer_email, phone: order.customer_phone },
            deliveryAddress: order.delivery_address || '',
            items: items.map(it => ({
              stockCode: it.sku || it.productSku || it.stockCode || '',
              name: it.productName || it.name || 'Product',
              colour: it.colour || '', branding: it.branding || '',
              addons: Array.isArray(it.addons) ? it.addons.map(a => a.name || a) : [],
              qty: it.qty || it.quantity || 1, unit: it.unitPrice || it.unit || 0,
              lineTotal: it.subtotal != null ? it.subtotal : null,
            })),
            subtotal: order.subtotal, shipping: order.shipping, gst: order.gst, total: order.total,
            paymentStatus: 'awaiting', leadTimeDays: '5–7', bank: BANK, quoteRef: order.quote_ref || '',
          });
          attachments.push({ filename: `TaxInvoice_${invoiceNumber}.pdf`, content: Buffer.from(invBytes).toString('base64') });
        } catch (e) { /* still send pack if invoice PDF fails */ }
      }

      const bodyHtml = `
        <p style="font-size:15px;margin:0 0 16px;">Hi ${artwork.customer_name},</p>
        <p style="font-size:15px;line-height:1.6;margin:0 0 16px;">Thank you for approving your artwork for <strong>${artwork.product_name}</strong>! Your <strong>Tax Invoice</strong> and your <strong>approved artwork + certificate</strong> are attached. Production begins as soon as payment is received.</p>
        <div style="background:#F8F7F4;border-radius:10px;padding:14px 18px;margin:16px 0;font-size:14px;">
          <span style="color:#7A7570;">Order</span> <strong style="color:#1B2A4A;">${artwork.order_number}</strong>
          &nbsp;·&nbsp; <span style="color:#7A7570;">Invoice</span> <strong style="color:#1B2A4A;">${invoiceNumber}</strong>
          ${amountText ? `&nbsp;·&nbsp; <span style="color:#7A7570;">Amount due</span> <strong style="color:#C0392B;">${amountText} incl. GST</strong>` : ''}
        </div>
        <div style="background:#F8F7F4;border:1px solid #C9A96E;border-radius:10px;padding:16px 20px;margin:16px 0;">
          <div style="font-weight:700;color:#1B2A4A;margin-bottom:10px;">How to pay</div>
          <table style="width:100%;font-size:14px;">
            <tr><td style="color:#7A7570;padding:3px 0;">Account Name</td><td style="text-align:right;font-weight:600;">${BANK.name}</td></tr>
            <tr><td style="color:#7A7570;padding:3px 0;">Bank</td><td style="text-align:right;font-weight:600;">${BANK.bank}</td></tr>
            <tr><td style="color:#7A7570;padding:3px 0;">BSB</td><td style="text-align:right;font-weight:600;font-family:monospace;">${BANK.bsb}</td></tr>
            <tr><td style="color:#7A7570;padding:3px 0;">Account Number</td><td style="text-align:right;font-weight:600;font-family:monospace;">${BANK.acct}</td></tr>
            <tr><td style="color:#7A7570;padding:3px 0;">Reference</td><td style="text-align:right;font-weight:700;color:#C9A96E;">${invoiceNumber}</td></tr>
          </table>
          <div style="font-size:12px;color:#7A7570;margin-top:10px;">Prefer credit card? Call us on 02 9477 4748 — a 2% surcharge applies.</div>
        </div>
        <p style="font-size:14px;line-height:1.6;color:#3D3A36;margin:16px 0 0;">Any questions, just reply or call us on <strong>02 9477 4748</strong>.</p>`;

      await resend.emails.send({
        from: 'QuirkyPromo <noreply@quirkypromo.com.au>', replyTo: 'hello@quirkypromo.com.au',
        to: [artwork.customer_email], subject: `Tax Invoice ${invoiceNumber} — ${artwork.order_number}`,
        html: quirkyEmail(bodyHtml), attachments,
      });
      await resend.emails.send({
        from: 'QuirkyPromo <noreply@quirkypromo.com.au>', replyTo: artwork.customer_email,
        to: ['hello@quirkypromo.com.au'], subject: `Artwork Approved + Invoice — ${artwork.order_number}`,
        html: quirkyEmail(`<p><strong>${artwork.customer_name}</strong> approved <strong>${artwork.product_name}</strong>. Invoice <strong>${invoiceNumber}</strong> sent — awaiting payment.</p>`),
        attachments,
      });
    } else {
      const bodyHtml = `
        <p style="font-size:15px;margin:0 0 16px;">Hi ${artwork.customer_name},</p>
        <p style="font-size:15px;line-height:1.6;margin:0 0 16px;">Your artwork for <strong>${artwork.product_name}</strong> is approved and <strong>production is now starting</strong> for order <strong>${artwork.order_number}</strong>. Your <strong>approved artwork + certificate</strong> is attached for your records.</p>
        <p style="font-size:15px;line-height:1.6;margin:0 0 16px;">We'll let you know as soon as your order is dispatched.</p>
        <p style="font-size:14px;line-height:1.6;color:#3D3A36;margin:16px 0 0;">Any questions, just reply or call us on <strong>02 9477 4748</strong>.</p>`;
      await resend.emails.send({
        from: 'QuirkyPromo <noreply@quirkypromo.com.au>', replyTo: 'hello@quirkypromo.com.au',
        to: [artwork.customer_email], subject: `Artwork Approved — Production Starting — ${artwork.order_number}`,
        html: quirkyEmail(bodyHtml), attachments: [{ filename: packFile, content: packB64 }],
      });
      await resend.emails.send({
        from: 'QuirkyPromo <noreply@quirkypromo.com.au>', replyTo: artwork.customer_email,
        to: ['hello@quirkypromo.com.au'], subject: `PRODUCTION START — ${artwork.order_number} — Approved`,
        html: quirkyEmail(`<p><strong>${artwork.customer_name}</strong> approved <strong>${artwork.product_name}</strong>. Payment already received. Ready to place supplier order.</p>`),
        attachments: [{ filename: packFile, content: packB64 }],
      });
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: 'Failed to process approval' }, { status: 500 });
  }
}

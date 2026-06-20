import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import { resolveB2BFromRequest, resolveOrCreateLeadFromQuote } from '@/lib/b2bContext';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// ✅ 生成 Q260001 格式编号
async function generateQuoteNumber() {
  const year = String(new Date().getFullYear()).slice(2); // "26"
  const { count } = await supabase
    .from('quotes')
    .select('*', { count: 'exact', head: true });
  const num = String((count || 0) + 1).padStart(4, '0');
  return `Q${year}${num}`;
}

// ✅ 生成 PDF Quote
async function generateQuotePDF({
  quoteNumber, validUntil,
  customer, product,
  qty, colour, brandingSummary, addons,
  unitPrice, subtotal, shipping, gst, total,
  deliveryAddress, requiredDate, notes,
  docType = 'QUOTE', leadTimeDays = 7, disc = 0, totalPages = 1,
}) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4
  const { width, height } = page.getSize();

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontReg = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Colours
  const NAVY = rgb(0.106, 0.165, 0.290);  // #1B2A4A
  const GOLD = rgb(0.788, 0.663, 0.431);  // #C9A96E
  const GREY = rgb(0.478, 0.459, 0.439);  // #7A7570
  const WHITE = rgb(1, 1, 1);
  const LIGHT = rgb(0.973, 0.969, 0.957); // #F8F7F4
  const BLACK = rgb(0.1, 0.1, 0.1);

  // logo image (gold box + white text on navy) — fallback to text
  let logoImg = null;
  try { logoImg = await pdfDoc.embedPng(fs.readFileSync(path.join(process.cwd(), 'public', 'quirky-logo-quote.png'))); } catch (e) { logoImg = null; }

  const BORDER = rgb(0.72, 0.72, 0.72);
  const rt = (text, xRight, yy, size, font, color) => { const w = font.widthOfTextAtSize(String(text), size); page.drawText(String(text), { x: xRight - w, y: yy, size, font, color }); };

  // ── NAVY HEADER BAND ────────────────────────────────────
  page.drawRectangle({ x: 0, y: height - 100, width, height: 100, color: NAVY });
  if (logoImg) {
    const lh = 32, lw = lh * (logoImg.width / logoImg.height);
    page.drawImage(logoImg, { x: 40, y: height - 52, width: lw, height: lh });
  } else {
    page.drawText('QUIRKY', { x: 40, y: height - 46, size: 20, font: fontBold, color: WHITE });
    page.drawText('PROMO', { x: 40 + fontBold.widthOfTextAtSize('QUIRKY', 20), y: height - 46, size: 20, font: fontBold, color: GOLD });
  }
  page.drawText('Quirky Promo   ABN 95 656 714 270', { x: 40, y: height - 72, size: 8, font: fontReg, color: WHITE });
  page.drawText('02 9477 4748   ·   hello@quirkypromo.com.au   ·   quirkypromo.com.au', { x: 40, y: height - 84, size: 8, font: fontReg, color: rgb(0.78, 0.81, 0.88) });
  const dW = fontBold.widthOfTextAtSize(docType, 22);
  page.drawText(docType, { x: width - 40 - dW, y: height - 52, size: 22, font: fontBold, color: GOLD });
  rt(quoteNumber || '', width - 40, height - 68, 11, fontReg, WHITE);

  // ── META (right) ────────────────────────────────────────
  let metaY = height - 120;
  const metaRow = (label, val) => { page.drawText(label, { x: 400, y: metaY, size: 8.5, font: fontReg, color: GREY }); rt(val, width - 40, metaY, 8.5, fontReg, BLACK); metaY -= 13; };
  metaRow('Date:', new Date().toLocaleDateString('en-AU'));
  if (validUntil) metaRow(docType === 'QUOTE' ? 'Valid until:' : 'Date:', validUntil);
  metaRow('Page:', `1 of ${totalPages || 1}`);

  // ── CUSTOMER / DELIVERY BOXES ───────────────────────────
  let y = height - 122;
  const gap = 14, bw = (width - 80 - gap) / 2, cdX = 40, ddX = 40 + bw + gap, bH = 82, bTop = y;
  page.drawText('Customer Detail:', { x: cdX, y: bTop + 2, size: 8, font: fontBold, color: NAVY });
  page.drawText('Delivery Detail:', { x: ddX, y: bTop + 2, size: 8, font: fontBold, color: NAVY });
  page.drawRectangle({ x: cdX, y: bTop - bH, width: bw, height: bH, borderColor: BORDER, borderWidth: 0.8 });
  page.drawRectangle({ x: ddX, y: bTop - bH, width: bw, height: bH, borderColor: BORDER, borderWidth: 0.8 });
  let cy = bTop - 14;
  [customer.company, customer.name, customer.email, customer.phone].filter(Boolean).forEach(l => { page.drawText(String(l).substring(0, 44), { x: cdX + 8, y: cy, size: 8.5, font: fontReg, color: BLACK }); cy -= 13; });
  let dy = bTop - 14;
  (deliveryAddress ? String(deliveryAddress).split(/,\s*/) : ['Same as customer']).slice(0, 5).forEach(l => { page.drawText(l.substring(0, 44), { x: ddX + 8, y: dy, size: 8.5, font: fontReg, color: BLACK }); dy -= 13; });
  y = bTop - bH - 24;

  // ── ITEM TABLE ──────────────────────────────────────────
  const cStock = 44, cDesc = 120, cQtyR = 360, cUnit = 368, cPriceR = 432, cDiscR = 474, cTaxR = 510, cTotR = 552;
  const HH = 18;
  page.drawRectangle({ x: 40, y: y - HH, width: width - 80, height: HH, color: NAVY });
  const thy = y - HH + 6;
  page.drawText('Stock Code', { x: cStock, y: thy, size: 7.5, font: fontBold, color: WHITE });
  page.drawText('Description', { x: cDesc, y: thy, size: 7.5, font: fontBold, color: WHITE });
  rt('Qty', cQtyR, thy, 7.5, fontBold, WHITE);
  page.drawText('Unit', { x: cUnit, y: thy, size: 7.5, font: fontBold, color: WHITE });
  rt('Price', cPriceR, thy, 7.5, fontBold, WHITE);
  rt('Disc%', cDiscR, thy, 7.5, fontBold, WHITE);
  rt('Tax%', cTaxR, thy, 7.5, fontBold, WHITE);
  rt('Total Value', cTotR, thy, 7.5, fontBold, WHITE);
  y -= HH + 4;

  // product row
  const addonsList = addons ? addons.split(', ').filter(Boolean) : [];
  const hasBranding = brandingSummary && brandingSummary !== 'None / Unbranded' && brandingSummary !== 'Unbranded';
  const descLines = [];
  if (colour) descLines.push(`Colour: ${colour}`);
  if (hasBranding) descLines.push(`Branding: ${brandingSummary}`);
  addonsList.forEach(x => descLines.push(`Add-on: ${x}`));
  const rowH = Math.max(34, 16 + descLines.length * 11 + 6);
  page.drawRectangle({ x: 40, y: y - rowH, width: width - 80, height: rowH, color: LIGHT });
  const r1 = y - 13;
  page.drawText(String(product.sku || '—'), { x: cStock, y: r1, size: 8, font: fontReg, color: BLACK });
  page.drawText(String(product.name || '').substring(0, 46), { x: cDesc, y: r1, size: 8.5, font: fontBold, color: NAVY });
  let liny = r1 - 11;
  descLines.forEach(l => { page.drawText(l.substring(0, 62), { x: cDesc, y: liny, size: 7.5, font: fontReg, color: GREY }); liny -= 11; });
  rt(String(qty), cQtyR, r1, 8, fontReg, BLACK);
  page.drawText('EA', { x: cUnit, y: r1, size: 8, font: fontReg, color: BLACK });
  rt(`$${unitPrice.toFixed(2)}`, cPriceR, r1, 8, fontReg, BLACK);
  rt(`${(Number(disc) || 0).toFixed(2)}`, cDiscR, r1, 8, fontReg, BLACK);
  rt('10.00', cTaxR, r1, 8, fontReg, BLACK);
  rt(`$${subtotal.toFixed(2)}`, cTotR, r1, 8, fontBold, NAVY);
  y -= rowH + 2;

  // freight row
  const fr = y - 12;
  page.drawText('FREIGHT', { x: cStock, y: fr, size: 8, font: fontReg, color: BLACK });
  page.drawText('Shipping & Handling', { x: cDesc, y: fr, size: 8.5, font: fontReg, color: BLACK });
  rt('1', cQtyR, fr, 8, fontReg, BLACK);
  page.drawText('EA', { x: cUnit, y: fr, size: 8, font: fontReg, color: BLACK });
  rt(`$${shipping.toFixed(2)}`, cPriceR, fr, 8, fontReg, BLACK);
  rt('0.00', cDiscR, fr, 8, fontReg, BLACK);
  rt('10.00', cTaxR, fr, 8, fontReg, BLACK);
  rt(`$${shipping.toFixed(2)}`, cTotR, fr, 8, fontBold, NAVY);
  y -= 26;
  page.drawLine({ start: { x: 40, y: y + 6 }, end: { x: width - 40, y: y + 6 }, thickness: 0.5, color: BORDER });

  // ── TOTALS (right) ──────────────────────────────────────
  y -= 6;
  const totRow = (label, value, bold) => { page.drawText(label, { x: 380, y, size: 9, font: bold ? fontBold : fontReg, color: bold ? NAVY : GREY }); rt(value, cTotR, y, 9, bold ? fontBold : fontReg, bold ? GOLD : BLACK); y -= 15; };
  totRow('Subtotal (excl. GST)', `$${subtotal.toFixed(2)}`);
  totRow('Shipping & Handling', `$${shipping.toFixed(2)}`);
  totRow('GST (10%)', `$${gst.toFixed(2)}`);
  page.drawLine({ start: { x: 378, y: y + 11 }, end: { x: width - 40, y: y + 11 }, thickness: 1, color: NAVY });
  totRow('TOTAL (incl. GST)', `$${total.toFixed(2)}`, true);
  y -= 12;
  if (requiredDate) { page.drawText(`Required by: ${requiredDate}`, { x: 40, y, size: 8, font: fontReg, color: GREY }); }
  y -= 24;

  // ── NOTE (bold) ─────────────────────────────────────────
  const noteText = docType === 'QUOTE'
    ? `NOTE: Estimated production lead time is ${leadTimeDays} business days from artwork approval and receipt of full payment.`
    : `NOTE: Production commences only after artwork approval and full payment have been received. Estimated lead time: ${leadTimeDays} business days.`;
  const noteWords = noteText.split(' ');
  const noteRendered = [];
  { let line = ''; for (const w of noteWords) { if (fontBold.widthOfTextAtSize(line + w, 9) > width - 110) { noteRendered.push(line.trim()); line = w + ' '; } else line += w + ' '; } if (line.trim()) noteRendered.push(line.trim()); }
  const noteH = 12 + noteRendered.length * 12;
  page.drawRectangle({ x: 40, y: y - noteH + 6, width: width - 80, height: noteH, color: rgb(0.98, 0.94, 0.85) });
  noteRendered.forEach((l, i) => page.drawText(l, { x: 50, y: y - 6 - i * 12, size: 9, font: fontBold, color: NAVY }));
  y -= noteH + 8;
  page.drawText('Stock and pricing are subject to availability and are confirmed at the time of order.', { x: 40, y, size: 7.5, font: fontReg, color: GREY });
  y -= 16;

  if (notes) {
    page.drawText('Notes:', { x: 40, y, size: 8, font: fontBold, color: NAVY }); y -= 12;
    let line = ''; for (const w of String(notes).split(' ')) { if ((line + w).length > 95) { page.drawText(line.trim(), { x: 40, y, size: 8, font: fontReg, color: GREY }); y -= 12; line = w + ' '; } else line += w + ' '; } if (line.trim()) { page.drawText(line.trim(), { x: 40, y, size: 8, font: fontReg, color: GREY }); }
  }

  // ── FOOTER ──────────────────────────────────────────────
  page.drawLine({ start: { x: 40, y: 48 }, end: { x: width - 40, y: 48 }, thickness: 0.5, color: BORDER });
  page.drawText(docType === 'QUOTE' ? `This quote is valid until ${validUntil}.` : 'Thank you for your order.', { x: 40, y: 34, size: 7.5, font: fontReg, color: GREY });
  page.drawText('Quirky Promo  ·  ABN 95 656 714 270  ·  quirkypromo.com.au  ·  hello@quirkypromo.com.au', { x: 40, y: 23, size: 7.5, font: fontReg, color: GREY });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

export async function POST(req) {
  try {
    const body = await req.json();
    const b2b = await resolveB2BFromRequest(req);
    const {
      name, company, email, phone,
      qty, colour,
      brandingMethod, padPositions, padColours, screenPositions, otherPositions, personalisationLines,
      pmsColours, extraOptions,
      requiredDate, deliveryAddress, artworkFileName,
      notes, purpose,
      docType, leadTimeDays, disc,
      productName, productSku,
      unitPrice, subtotal, shipping, gst, total,
    } = body;

    if (!name || !email) {
      return Response.json({ error: 'Name and email are required' }, { status: 400 });
    }

    // Build branding summary
    function getBrandingType(n) {
      const s = (n || '').toLowerCase();
      if (s.includes('pad print')) return 'pad';
      if (s.includes('screen print')) return 'screen';
      if (s.includes('personalisation') || s.includes('personalization')) return 'personalisation';
      return 'other';
    }

    let brandingSummary = body.brandingSummary || brandingMethod || 'None / Unbranded';
    if (!body.brandingSummary && brandingMethod) {
      const bt = getBrandingType(brandingMethod);
      if (bt === 'pad') brandingSummary = `${brandingMethod} — ${padPositions} position(s), ${padColours} colour(s)`;
      else if (bt === 'screen') brandingSummary = `${brandingMethod} — ${screenPositions} position(s), 1 colour`;
      else if (bt === 'personalisation') brandingSummary = `${brandingMethod} — ${personalisationLines} line(s)`;
      else if (otherPositions) brandingSummary = `${brandingMethod} — ${otherPositions} position(s)`;
    }

    // Valid until date (14 days)
    const validUntilDate = new Date();
    validUntilDate.setDate(validUntilDate.getDate() + 14);
    const validUntil = validUntilDate.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });

    // Quote number
    const quoteNumber = await generateQuoteNumber();

    // Fold Occasion / Event into notes (no extra column needed)
    const notesCombined = (purpose ? `Occasion / Event: ${purpose}\n` : '') + (notes || '');

    // ✅ Save to Supabase
    const link = b2b.company_id ? b2b : await resolveOrCreateLeadFromQuote({ email, name, company, phone });
    await supabase.from('quotes').insert({
      quote_number: quoteNumber,
      customer_name: name,
      customer_email: email,
      customer_phone: phone || '',
      customer_company: company || '',
      product_name: productName,
      product_sku: productSku || '',
      quantity: qty || null,
      colour: colour || '',
      branding_method: brandingMethod || '',
      branding_summary: brandingSummary,
      addons: extraOptions?.join(', ') || '',
      delivery_address: deliveryAddress || '',
      required_date: requiredDate || '',
      artwork_filename: artworkFileName || '',
      notes: notesCombined,
      subtotal: subtotal || 0,
      gst: gst || 0,
      shipping: shipping || 30,
      total: total || 0,
      status: body.status || 'pending',
      valid_until: validUntil,
      ...link,
    });

    // ✅ Generate PDF
    const pdfBuffer = await generateQuotePDF({
      quoteNumber,
      validUntil,
      customer: { name, company, email, phone },
      product: { name: productName, sku: productSku },
      qty: qty || 0,
      colour: colour || '',
      brandingSummary,
      addons: extraOptions?.join(', ') || '',
      unitPrice: unitPrice || 0,
      subtotal: subtotal || 0,
      shipping: shipping || 30,
      gst: gst || 0,
      total: total || 0,
      deliveryAddress: deliveryAddress || '',
      requiredDate: requiredDate || '',
      notes: notesCombined,
      docType: docType || 'QUOTE',
      leadTimeDays: leadTimeDays || 7,
      disc: disc || 0,
    });

    const pdfBase64 = pdfBuffer.toString('base64');

    // ── EMAIL HTML ──────────────────────────────────────────
    const extrasHtml = extraOptions?.length
      ? `<tr><td style="padding: 6px 0; color: #7A7570; width: 160px;">Add-ons</td><td style="color: #1B2A4A;">${extraOptions.join(', ')}</td></tr>`
      : '';
    const artworkHtml = artworkFileName
      ? `<tr><td style="padding: 6px 0; color: #7A7570;">Artwork File</td><td style="color: #2D6A4F; font-weight: 600;">✅ ${artworkFileName}</td></tr>`
      : `<tr><td style="padding: 6px 0; color: #7A7570;">Artwork</td><td style="color: #B0AAA3;">To be provided separately</td></tr>`;
    const dateHtml = requiredDate
      ? `<tr><td style="padding: 6px 0; color: #7A7570;">Required Date</td><td style="font-weight: 600; color: #C0392B;">${requiredDate}</td></tr>`
      : '';

    const internalHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; color: #1a1a1a;">
        <div style="background: #1B2A4A; padding: 28px 32px; border-radius: 12px 12px 0 0;">
          <h1 style="color: #C9A96E; font-family: Georgia, serif; font-size: 24px; margin: 0 0 4px;">New Quote Request</h1>
          <p style="color: rgba(255,255,255,0.6); font-size: 14px; margin: 0;">${quoteNumber} · QuirkyPromo.com.au</p>
        </div>
        <div style="background: #fff; border: 1px solid #E0DDD7; border-top: none; padding: 28px 32px; border-radius: 0 0 12px 12px;">
          <h2 style="font-size: 14px; color: #1B2A4A; margin: 0 0 12px; padding-bottom: 10px; border-bottom: 1px solid #F0EEED; text-transform: uppercase; letter-spacing: 0.08em;">📦 Product</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
            <tr><td style="padding: 6px 0; color: #7A7570; width: 160px;">Product</td><td style="font-weight: 600; color: #1B2A4A;">${productName}</td></tr>
            ${productSku ? `<tr><td style="padding: 6px 0; color: #7A7570;">SKU</td><td style="font-family: monospace;">${productSku}</td></tr>` : ''}
            <tr><td style="padding: 6px 0; color: #7A7570;">Quantity</td><td style="font-weight: 600; color: #1B2A4A;">${qty || '—'}</td></tr>
            <tr><td style="padding: 6px 0; color: #7A7570;">Colour</td><td>${colour || '—'}</td></tr>
            <tr><td style="padding: 6px 0; color: #7A7570;">Branding</td><td>${brandingSummary}</td></tr>
            ${extrasHtml}
            ${artworkHtml}
            ${dateHtml}
          </table>
          <h2 style="font-size: 14px; color: #1B2A4A; margin: 0 0 12px; padding-bottom: 10px; border-bottom: 1px solid #F0EEED; text-transform: uppercase; letter-spacing: 0.08em;">💰 Pricing</h2>
          <table style="width: 100%; font-size: 14px; margin-bottom: 24px;">
            <tr><td style="color: #7A7570; padding: 4px 0;">Unit Price (excl. GST)</td><td style="text-align: right; font-family: monospace;">$${(unitPrice||0).toFixed(2)}</td></tr>
            <tr><td style="color: #7A7570; padding: 4px 0;">Subtotal</td><td style="text-align: right; font-family: monospace;">$${(subtotal||0).toFixed(2)}</td></tr>
            <tr><td style="color: #7A7570; padding: 4px 0;">Shipping</td><td style="text-align: right; font-family: monospace;">$${(shipping||30).toFixed(2)}</td></tr>
            <tr><td style="color: #7A7570; padding: 4px 0;">GST (10%)</td><td style="text-align: right; font-family: monospace;">$${(gst||0).toFixed(2)}</td></tr>
            <tr style="font-weight: 700; border-top: 2px solid #E0DDD7;"><td style="padding: 8px 0; color: #1B2A4A;">Total (incl. GST)</td><td style="text-align: right; color: #C9A96E; font-family: monospace;">$${(total||0).toFixed(2)}</td></tr>
          </table>
          <h2 style="font-size: 14px; color: #1B2A4A; margin: 0 0 12px; padding-bottom: 10px; border-bottom: 1px solid #F0EEED; text-transform: uppercase; letter-spacing: 0.08em;">👤 Customer</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
            <tr><td style="padding: 6px 0; color: #7A7570; width: 160px;">Name</td><td style="font-weight: 600;">${name}</td></tr>
            ${company ? `<tr><td style="padding: 6px 0; color: #7A7570;">Company</td><td>${company}</td></tr>` : ''}
            <tr><td style="padding: 6px 0; color: #7A7570;">Email</td><td><a href="mailto:${email}" style="color: #C9A96E;">${email}</a></td></tr>
            ${phone ? `<tr><td style="padding: 6px 0; color: #7A7570;">Phone</td><td>${phone}</td></tr>` : ''}
          </table>
          ${notes ? `<h2 style="font-size: 14px; color: #1B2A4A; margin: 0 0 12px; padding-bottom: 10px; border-bottom: 1px solid #F0EEED; text-transform: uppercase; letter-spacing: 0.08em;">💬 Notes</h2><div style="background: #F8F7F4; border-radius: 8px; padding: 16px; font-size: 14px; color: #3D3A36; white-space: pre-wrap; margin-bottom: 24px;">${notes}</div>` : ''}
          <div style="text-align: center; padding-top: 20px; border-top: 1px solid #F0EEED;">
            <a href="mailto:${email}?subject=Re: Quote ${quoteNumber} for ${encodeURIComponent(productName)}" style="display: inline-block; background: #C9A96E; color: #fff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 14px;">Reply to ${name}</a>
          </div>
        </div>
      </div>
    `;

    const customerHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; color: #1a1a1a;">
        <div style="background: #1B2A4A; padding: 28px 32px; border-radius: 12px 12px 0 0;">
          <h1 style="color: #C9A96E; font-family: Georgia, serif; font-size: 24px; margin: 0 0 4px;">QuirkyPromo</h1>
          <p style="color: rgba(255,255,255,0.6); font-size: 14px; margin: 0;">Your Quote · ${quoteNumber}</p>
        </div>
        <div style="background: #fff; border: 1px solid #E0DDD7; border-top: none; padding: 28px 32px; border-radius: 0 0 12px 12px;">
          <p style="font-size: 15px; margin: 0 0 16px;">Hi ${name},</p>
          <p style="font-size: 15px; margin: 0 0 24px;">Thank you for your enquiry! Please find your quote attached as a PDF. This quote is valid for <strong>14 days</strong>.</p>
          <div style="background: #F8F7F4; border-radius: 10px; padding: 16px 20px; margin: 0 0 24px; font-size: 14px;">
            <div style="margin-bottom: 6px;"><span style="color: #7A7570;">Quote Number:</span> <strong style="color: #C9A96E;">${quoteNumber}</strong></div>
            <div style="margin-bottom: 6px;"><span style="color: #7A7570;">Product:</span> <strong>${productName}</strong></div>
            <div style="margin-bottom: 6px;"><span style="color: #7A7570;">Quantity:</span> <strong>${qty || '—'}</strong></div>
            ${colour ? `<div style="margin-bottom: 6px;"><span style="color: #7A7570;">Colour:</span> <strong>${colour}</strong></div>` : ''}
            <div style="margin-bottom: 6px;"><span style="color: #7A7570;">Total (incl. GST):</span> <strong style="color: #C9A96E;">$${(total||0).toFixed(2)}</strong></div>
            <div><span style="color: #7A7570;">Valid until:</span> <strong>${validUntil}</strong></div>
          </div>
          ${artworkFileName ? `<p style="font-size: 14px; color: #7A7570; margin: 0 0 16px;">📎 Please email your artwork file <strong>${artworkFileName}</strong> to <a href="mailto:hello@quirkypromo.com.au" style="color: #C9A96E;">hello@quirkypromo.com.au</a></p>` : ''}
          <p style="font-size: 14px; color: #7A7570; margin: 0 0 8px;">Ready to proceed? Reply to this email or call us:</p>
          <p style="font-size: 18px; font-weight: 700; color: #1B2A4A; margin: 0 0 24px;">📞 02 9477 4748</p>
          <p style="font-size: 14px; color: #7A7570; margin: 0;">The QuirkyPromo Team</p>
        </div>
      </div>
    `;

    // ✅ Email to business with PDF attached
    await resend.emails.send({
      from: 'QuirkyPromo <noreply@quirkypromo.com.au>',
      to: ['hello@quirkypromo.com.au'],
      replyTo: email,
      subject: `New Quote Request: ${quoteNumber} — ${productName}`,
      html: internalHtml,
      attachments: [{ filename: `${quoteNumber}.pdf`, content: pdfBase64 }],
    });

    // ✅ Email to customer with PDF attached
    await resend.emails.send({
      from: 'QuirkyPromo <noreply@quirkypromo.com.au>',
      replyTo: 'hello@quirkypromo.com.au',
      to: [email],
      subject: `Your Quote from QuirkyPromo — ${quoteNumber}`,
      html: customerHtml,
      attachments: [{ filename: `${quoteNumber}.pdf`, content: pdfBase64 }],
    });

    return Response.json({ success: true, quoteNumber });
  } catch (error) {
    return Response.json({ error: 'Failed to process quote' }, { status: 500 });
  }
}
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
  const GREY = rgb(0.08, 0.08, 0.08);  // unified: all body text black
  const WHITE = rgb(1, 1, 1);
  const LIGHT = rgb(0.973, 0.969, 0.957); // #F8F7F4
  const BLACK = rgb(0.1, 0.1, 0.1);
  const money = (n) => '$' + Number(n || 0).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // logo image (gold box + white text on navy) — fallback to text
  let logoImg = null;
  try { logoImg = await pdfDoc.embedPng(fs.readFileSync(path.join(process.cwd(), 'public', 'quirky-logo-quote.png'))); } catch (e) { logoImg = null; }

  const BORDER = rgb(0.72, 0.72, 0.72);
  const rt = (text, xRight, yy, size, font, color) => { const w = font.widthOfTextAtSize(String(text), size); page.drawText(String(text), { x: xRight - w, y: yy, size, font, color }); };

  // ── NAVY HEADER BAND ──── (unified standard: band 110, image logo, title 18, meta x392)
  page.drawRectangle({ x: 0, y: height - 110, width, height: 110, color: NAVY });
  if (logoImg) {
    const lw = 150, lh = lw * (256 / 1400);
    page.drawImage(logoImg, { x: 40, y: height - 42, width: lw, height: lh });
  } else {
    page.drawText('QUIRKY', { x: 40, y: height - 36, size: 20, font: fontBold, color: WHITE });
    page.drawText('PROMO', { x: 112, y: height - 36, size: 20, font: fontBold, color: GOLD });
  }
  const compInfo = [['ABN:', '95 656 714 270'], ['Phone:', '02 9477 4748'], ['Email:', 'hello@quirkypromo.com.au'], ['Web:', 'quirkypromo.com.au']];
  let ciY = height - 64;
  compInfo.forEach(([lab, val]) => { page.drawText(lab, { x: 40, y: ciY, size: 9, font: fontBold, color: WHITE }); page.drawText(val, { x: 40 + fontBold.widthOfTextAtSize(lab, 9) + 5, y: ciY, size: 9, font: fontReg, color: WHITE }); ciY -= 12; });
  const META_X = 392;
  const META_R = width - 40;
  rt(docType, META_R, height - 35, 18, fontBold, WHITE);

  // Meta — label left (x=392), value right-aligned (W-40)
  const metaPairs = [
    ['Quote#:', quoteNumber || ''],
    ['Date:', new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })],
    [docType === 'QUOTE' ? 'Valid until:' : 'Order date:', validUntil || ''],
    ['Page:', `1 of ${totalPages || 1}`],
  ];
  let metaY = height - 60;
  metaPairs.forEach(([lab, val]) => { page.drawText(lab, { x: META_X, y: metaY, size: 9, font: fontBold, color: WHITE }); rt(String(val), META_R, metaY, 9, fontReg, WHITE); metaY -= 12; });

  // ── CUSTOMER / DELIVERY BOXES ───────────────────────────
  let y = height - 122;
  const gap = 14, bw = (width - 80 - gap) / 2, cdX = 40, ddX = 40 + bw + gap, bH = 82, bTop = y;
  page.drawText('Customer Detail:', { x: cdX, y: bTop + 2, size: 8, font: fontBold, color: BLACK });
  page.drawText('Delivery Detail:', { x: ddX, y: bTop + 2, size: 8, font: fontBold, color: BLACK });
  page.drawRectangle({ x: cdX, y: bTop - bH, width: bw, height: bH, borderColor: BORDER, borderWidth: 0.8 });
  page.drawRectangle({ x: ddX, y: bTop - bH, width: bw, height: bH, borderColor: BORDER, borderWidth: 0.8 });
  let cy = bTop - 14;
  [customer.company, customer.name, customer.email, customer.phone].filter(Boolean).forEach(l => { page.drawText(String(l).substring(0, 44), { x: cdX + 8, y: cy, size: 8.5, font: fontReg, color: BLACK }); cy -= 13; });
  let dy = bTop - 14;
  (deliveryAddress ? String(deliveryAddress).split(/,\s*/) : ['TO BE CONFIRMED']).slice(0, 5).forEach(l => { page.drawText(l.substring(0, 44), { x: ddX + 8, y: dy, size: 8.5, font: fontReg, color: BLACK }); dy -= 13; });
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
  page.drawLine({ start: { x: 40, y: y - rowH }, end: { x: width - 40, y: y - rowH }, thickness: 0.5, color: BORDER });
  const r1 = y - 13;
  page.drawText(String(product.sku || '—'), { x: cStock, y: r1, size: 8, font: fontReg, color: BLACK });
  page.drawText(String(product.name || '').substring(0, 46), { x: cDesc, y: r1, size: 8.5, font: fontBold, color: NAVY });
  let liny = r1 - 11;
  descLines.forEach(l => { page.drawText(l.substring(0, 62), { x: cDesc, y: liny, size: 7.5, font: fontReg, color: BLACK }); liny -= 11; });
  rt(String(qty), cQtyR, r1, 8, fontReg, BLACK);
  page.drawText('EA', { x: cUnit, y: r1, size: 8, font: fontReg, color: BLACK });
  rt(`${money(unitPrice)}`, cPriceR, r1, 8, fontReg, BLACK);
  rt(`${(Number(disc) || 0).toFixed(2)}`, cDiscR, r1, 8, fontReg, BLACK);
  rt('10.00', cTaxR, r1, 8, fontReg, BLACK);
  rt(`${money(subtotal)}`, cTotR, r1, 8, fontBold, BLACK);
  y -= rowH + 2;

  // freight row
  const fr = y - 12;
  page.drawText('FREIGHT', { x: cStock, y: fr, size: 8, font: fontReg, color: BLACK });
  page.drawText('Shipping & Handling', { x: cDesc, y: fr, size: 8.5, font: fontReg, color: BLACK });
  rt('1', cQtyR, fr, 8, fontReg, BLACK);
  page.drawText('EA', { x: cUnit, y: fr, size: 8, font: fontReg, color: BLACK });
  rt(`${money(shipping)}`, cPriceR, fr, 8, fontReg, BLACK);
  rt('0.00', cDiscR, fr, 8, fontReg, BLACK);
  rt('10.00', cTaxR, fr, 8, fontReg, BLACK);
  rt(`${money(shipping)}`, cTotR, fr, 8, fontBold, BLACK);
  y -= 26;
  page.drawLine({ start: { x: 40, y: y + 6 }, end: { x: width - 40, y: y + 6 }, thickness: 0.5, color: BORDER });

  // ── TOTALS (right) ──────────────────────────────────────
  y -= 6;
  const totRow = (label, value, bold, big) => { const sz = big ? 12 : 9; page.drawText(label, { x: 358, y, size: sz, font: bold ? fontBold : fontReg, color: BLACK }); rt(value, cTotR, y, sz, bold ? fontBold : fontReg, BLACK); y -= big ? 18 : 15; };
  totRow('Subtotal (excl. GST)', `${money(subtotal)}`);
  totRow('Shipping & Handling', `${money(shipping)}`);
  totRow('GST (10%)', `${money(gst)}`);
  page.drawLine({ start: { x: 378, y: y + 11 }, end: { x: width - 40, y: y + 11 }, thickness: 1, color: NAVY });
  totRow('TOTAL (incl. GST)', `${money(total)}`, true, true);
  y -= 12;
  if (requiredDate) { page.drawText(`Required by: ${requiredDate}`, { x: 40, y, size: 8, font: fontBold, color: BLACK }); }
  y -= 24;

  // ── NOTE (bold) ─────────────────────────────────────────
  const note1 = docType === 'QUOTE'
    ? `NOTE: Estimated production lead time is ${leadTimeDays} business days from artwork approval and receipt of full payment.`
    : `NOTE: Production commences only after artwork approval and full payment have been received. Estimated lead time: ${leadTimeDays} business days.`;
  const note2 = 'NOTE: Stock and pricing are subject to availability and are confirmed at the time of order.';
  const wrapNote = (t) => { const out = []; let line = ''; for (const w of t.split(' ')) { if (fontBold.widthOfTextAtSize(line + w, 9) > width - 110) { out.push(line.trim()); line = w + ' '; } else line += w + ' '; } if (line.trim()) out.push(line.trim()); return out; };
  const noteLines = [...wrapNote(note1), '', ...wrapNote(note2)];
  const NPAD = 11, NLH = 13;
  const noteH = NPAD * 2 + noteLines.length * NLH - (NLH - 9);
  page.drawRectangle({ x: 40, y: y - noteH, width: width - 80, height: noteH, color: rgb(0.98, 0.94, 0.85) });
  let nY = y - NPAD - 8;
  noteLines.forEach(l => { if (l) page.drawText(l, { x: 50, y: nY, size: 9, font: fontBold, color: BLACK }); nY -= NLH; });
  y -= noteH + 14;

  // (Notes are internal only — not shown on the customer PDF)

  // ── FOOTER ──────────────────────────────────────────────
  page.drawLine({ start: { x: 40, y: 48 }, end: { x: width - 40, y: 48 }, thickness: 0.5, color: BORDER });
  page.drawText(docType === 'QUOTE' ? `This quote is valid until ${validUntil}.` : 'Thank you for your order.', { x: 40, y: 34, size: 7.5, font: fontReg, color: BLACK });
  page.drawText('Quirky Promo  ·  ABN 95 656 714 270  ·  quirkypromo.com.au  ·  hello@quirkypromo.com.au', { x: 40, y: 23, size: 7.5, font: fontReg, color: BLACK });

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
      docType, leadTimeDays, disc, customerMessage,
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

    // Valid until date (30 days)
    const validUntilDate = new Date();
    validUntilDate.setDate(validUntilDate.getDate() + 30);
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

    // Save delivery address back to the company (only if it has none yet) → auto-fills next time
    if (deliveryAddress && deliveryAddress.trim() && link.company_id) {
      try {
        const { data: existing } = await supabase.from('company_addresses').select('id').eq('company_id', link.company_id).eq('kind', 'delivery').eq('is_default', true).maybeSingle();
        if (!existing) await supabase.from('company_addresses').insert({ company_id: link.company_id, kind: 'delivery', is_default: true, line1: deliveryAddress.trim(), country: 'Australia' });
      } catch {}
    }

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
        <div style="background: #1B2A4A; padding: 20px 32px; border-radius: 12px 12px 0 0;">
          <img src="https://www.quirkypromo.com.au/quirky-logo-quote.png" alt="QuirkyPromo" height="30" style="display:block;height:30px;" />
          <p style="color: rgba(255,255,255,0.8); font-size: 14px; margin: 8px 0 0;">New Quote Request · ${quoteNumber}</p>
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

    const _msg = (customerMessage && customerMessage.trim())
      ? customerMessage
      : `Hi ${name},\n\nThank you so much for your enquiry — it was great to hear from you. I've put together a quote for you, attached as a PDF.\n\nAny questions at all, just reply to this email or call me on 02 9477 4748.\n\nKind regards,\nThe QuirkyPromo Team`;
    const _msgHtml = String(_msg).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
    const customerHtml = `
      <div style="font-family: Arial, Helvetica, sans-serif; max-width: 620px; margin: 0 auto; color: #1a1a1a;">
        <div style="padding: 6px 2px;">
          <div style="font-size: 15px; line-height: 1.75; color: #3D3A36; margin: 0 0 8px;">${_msgHtml}</div>
        </div>
        <div style="background: #1B2A4A; border-radius: 8px; padding: 14px 18px; margin-top: 10px;">
          <img src="https://www.quirkypromo.com.au/quirky-logo-quote.png" alt="QuirkyPromo" height="26" style="display:block;height:26px;margin-bottom:8px;" />
          <span style="font-size: 12px; color: rgba(255,255,255,0.85);">02 9477 4748 &nbsp;&middot;&nbsp; hello@quirkypromo.com.au &nbsp;&middot;&nbsp; quirkypromo.com.au &nbsp;&middot;&nbsp; Quote ${quoteNumber} (valid until ${validUntil})</span>
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
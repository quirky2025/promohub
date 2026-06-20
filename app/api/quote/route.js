import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import { resolveB2BFromRequest, resolveOrCreateLeadFromQuote } from '@/lib/b2bContext';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

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

  // ── HEADER BAR ──────────────────────────────────────────
  page.drawRectangle({ x: 0, y: height - 80, width, height: 80, color: NAVY });

  // Logo text
  page.drawText('QUIRKY', { x: 40, y: height - 45, size: 22, font: fontBold, color: WHITE });
  page.drawText('PROMO', { x: 117, y: height - 45, size: 22, font: fontBold, color: GOLD });
  page.drawText('quirkypromo.com.au  ·  hello@quirkypromo.com.au  ·  02 9477 4748', {
    x: 40, y: height - 62, size: 8, font: fontReg, color: rgb(0.7, 0.7, 0.7),
  });

  // "QUOTE" label top right
  page.drawText('QUOTE', { x: width - 120, y: height - 38, size: 28, font: fontBold, color: GOLD });
  page.drawText(`${quoteNumber}`, { x: width - 120, y: height - 52, size: 9, font: fontReg, color: WHITE });
  page.drawText(`Valid until: ${validUntil}`, { x: width - 120, y: height - 64, size: 8, font: fontReg, color: rgb(0.7, 0.7, 0.7) });

  let y = height - 100;

  // ── ISSUED BY + CUSTOMER ─────────────────────────────────
  // Left: Issued by
  page.drawText('Issued by', { x: 40, y, size: 9, font: fontBold, color: NAVY });
  page.drawText('QuirkyPromo', { x: 40, y: y - 13, size: 9, font: fontReg, color: BLACK });
  page.drawText('ABN: 95 656 714 270', { x: 40, y: y - 25, size: 9, font: fontReg, color: BLACK });
  page.drawText('02 9477 4748', { x: 40, y: y - 37, size: 9, font: fontReg, color: BLACK });
  page.drawText('hello@quirkypromo.com.au', { x: 40, y: y - 49, size: 9, font: fontReg, color: BLACK });

  // Right: Customer
  page.drawText('Customer', { x: 300, y, size: 9, font: fontBold, color: NAVY });
  page.drawText(customer.name || '', { x: 300, y: y - 13, size: 9, font: fontBold, color: BLACK });
  if (customer.company) page.drawText(customer.company, { x: 300, y: y - 25, size: 9, font: fontReg, color: BLACK });
  page.drawText(customer.email || '', { x: 300, y: y - 37, size: 9, font: fontReg, color: BLACK });
  if (customer.phone) page.drawText(customer.phone, { x: 300, y: y - 49, size: 9, font: fontReg, color: BLACK });
  if (deliveryAddress) {
    const da = String(deliveryAddress);
    page.drawText('Deliver to:', { x: 300, y: y - 61, size: 8, font: fontBold, color: NAVY });
    page.drawText(da.substring(0, 50), { x: 300, y: y - 72, size: 8, font: fontReg, color: GREY });
    if (da.length > 50) page.drawText(da.substring(50, 100), { x: 300, y: y - 82, size: 8, font: fontReg, color: GREY });
  }

  y -= 90;

  // ── DIVIDER ─────────────────────────────────────────────
  page.drawLine({ start: { x: 40, y }, end: { x: width - 40, y }, thickness: 0.5, color: rgb(0.88, 0.87, 0.84) });
  y -= 20;

  // ── PRODUCT DETAILS ──────────────────────────────────────
  page.drawText('PRODUCT DETAILS', { x: 40, y, size: 8, font: fontBold, color: NAVY });
  y -= 18;

  // Table header bar (white text on navy)
  const HB = 18;
  page.drawRectangle({ x: 40, y: y - HB, width: width - 80, height: HB, color: NAVY });
  const hY = y - HB + 6;
  page.drawText('ITEM', { x: 48, y: hY, size: 8, font: fontBold, color: WHITE });
  page.drawText('QTY', { x: 290, y: hY, size: 8, font: fontBold, color: WHITE });
  page.drawText('UNIT PRICE', { x: 350, y: hY, size: 8, font: fontBold, color: WHITE });
  page.drawText('NET AMOUNT', { x: 430, y: hY, size: 8, font: fontBold, color: WHITE });
  page.drawText('GST', { x: 515, y: hY, size: 8, font: fontBold, color: WHITE });
  y -= HB + 6;

  // Product row (sits fully below the header bar — no overlap)
  const addonsList = addons ? addons.split(', ').filter(Boolean) : [];
  const hasBranding = brandingSummary && brandingSummary !== 'None / Unbranded';
  const rowLines = 1 + (product.sku ? 1 : 0) + (colour ? 1 : 0) + (hasBranding ? 1 : 0) + addonsList.length;
  const rowHeight = Math.max(44, rowLines * 12 + 16);

  const rowTop = y;
  page.drawRectangle({ x: 40, y: rowTop - rowHeight, width: width - 80, height: rowHeight, color: LIGHT });

  const nameY = rowTop - 14;
  page.drawText(product.name || '', { x: 48, y: nameY, size: 9, font: fontBold, color: NAVY });
  let detailY = nameY - 12;
  if (product.sku) {
    page.drawText(`SKU: ${product.sku}`, { x: 48, y: detailY, size: 7.5, font: fontReg, color: GREY });
    detailY -= 12;
  }
  if (colour) {
    page.drawText(`Colour: ${colour}`, { x: 48, y: detailY, size: 8, font: fontReg, color: GREY });
    detailY -= 12;
  }
  if (hasBranding) {
    page.drawText(`Branding: ${brandingSummary.substring(0, 55)}`, { x: 48, y: detailY, size: 7.5, font: fontReg, color: GREY });
    detailY -= 12;
  }
  addonsList.forEach(addon => {
    page.drawText(`Add-on: ${addon}`, { x: 48, y: detailY, size: 7.5, font: fontReg, color: GREY });
    detailY -= 12;
  });

  page.drawText(String(qty), { x: 295, y: nameY, size: 9, font: fontReg, color: BLACK });
  page.drawText(`$${unitPrice.toFixed(2)}`, { x: 350, y: nameY, size: 9, font: fontReg, color: BLACK });
  page.drawText(`$${subtotal.toFixed(2)}`, { x: 430, y: nameY, size: 9, font: fontBold, color: NAVY });
  page.drawText('10%', { x: 520, y: nameY, size: 9, font: fontReg, color: BLACK });
  y = rowTop - rowHeight - 8;

  // Shipping row
  page.drawRectangle({ x: 40, y: y - 4, width: width - 80, height: 20, color: WHITE });
  page.drawText('Shipping & Handling', { x: 48, y: y + 1, size: 9, font: fontReg, color: BLACK });
  page.drawText('1', { x: 295, y: y + 1, size: 9, font: fontReg, color: BLACK });
  page.drawText(`$${shipping.toFixed(2)}`, { x: 350, y: y + 1, size: 9, font: fontReg, color: BLACK });
  page.drawText(`$${shipping.toFixed(2)}`, { x: 430, y: y + 1, size: 9, font: fontBold, color: NAVY });
  page.drawText('10%', { x: 520, y: y + 1, size: 9, font: fontReg, color: BLACK });
  y -= 30;

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
  page.drawLine({ start: { x: 380, y: y + 12 }, end: { x: width - 40, y: y + 12 }, thickness: 1, color: NAVY });
  y -= 4;
  totRow('TOTAL (incl. GST)', `$${total.toFixed(2)}`, true);

  y -= 20;

  // ── ADDITIONAL INFO ─────────────────────────────────────
  if (requiredDate) {
    page.drawText(`Required by: ${requiredDate}`, { x: 40, y, size: 8, font: fontReg, color: GREY });
    y -= 14;
  }
  if (notes) {
    page.drawText('Notes:', { x: 40, y, size: 8, font: fontBold, color: NAVY });
    y -= 12;
    // Word wrap notes
    const words = notes.split(' ');
    let line = '';
    for (const word of words) {
      if ((line + word).length > 90) {
        page.drawText(line.trim(), { x: 40, y, size: 8, font: fontReg, color: GREY });
        y -= 12;
        line = word + ' ';
      } else {
        line += word + ' ';
      }
    }
    if (line.trim()) {
      page.drawText(line.trim(), { x: 40, y, size: 8, font: fontReg, color: GREY });
      y -= 12;
    }
    y -= 8;
  }

  y -= 10;

  // ── WHY QUIRKYPROMO BOX ──────────────────────────────────
  page.drawRectangle({ x: 40, y: y - 72, width: width - 80, height: 82, color: LIGHT, borderColor: rgb(0.88, 0.87, 0.84), borderWidth: 0.5 });
  page.drawText('Why Choose QuirkyPromo?', { x: 52, y: y - 6, size: 9, font: fontBold, color: NAVY });
const reasons = [
  '*  Free digital proof — production only begins after your approval',
  '*  $30 flat rate shipping Australia-wide',
  '*  Quality guarantee — we make it right if something\'s wrong',
  '*  Reply within 1 hour  |  02 9477 4748  |  hello@quirkypromo.com.au',
];
  reasons.forEach((r, i) => {
    page.drawText(r, { x: 52, y: y - 20 - (i * 13), size: 8, font: fontReg, color: GREY });
  });
  y -= 90;

  // ── FOOTER ───────────────────────────────────────────────
  page.drawLine({ start: { x: 40, y: 50 }, end: { x: width - 40, y: 50 }, thickness: 0.5, color: rgb(0.88, 0.87, 0.84) });
  page.drawText(`This quote is valid for 14 days from the date of issue (${validUntil}).`, { x: 40, y: 36, size: 7.5, font: fontReg, color: GREY });
  page.drawText('ABN: 95 656 714 270  ·  QuirkyPromo  ·  quirkypromo.com.au', { x: 40, y: 24, size: 7.5, font: fontReg, color: GREY });

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
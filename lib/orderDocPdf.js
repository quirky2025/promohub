// lib/orderDocPdf.js
// Shared Order Confirmation / Tax Invoice PDF generator.
// Mirrors the approved QUOTE design: navy header band, gold/white logo,
// bold ABN/Phone/Email/Web labels, 8-column item table, thousands separators,
// TOTAL block anchored low with generous whitespace, How-to-Pay box, NOTE box.
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

const NAVY = rgb(0.106, 0.165, 0.290);
const GOLD = rgb(0.788, 0.663, 0.431);
const GREY = rgb(0.478, 0.459, 0.439);
const WHITE = rgb(1, 1, 1);
const LIGHT = rgb(0.973, 0.969, 0.957);
const CREAM = rgb(0.984, 0.949, 0.866);
const BLACK = rgb(0.1, 0.1, 0.1);
const LINEC = rgb(0.88, 0.87, 0.84);
const GREEN = rgb(0.176, 0.416, 0.31);

function money(n) {
  return '$' + Number(n || 0).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

async function loadLogo(pdf) {
  // 1) local public file (dev + bundled deploys)
  try {
    const p = path.join(process.cwd(), 'public', 'quirky-logo-quote.png');
    return await pdf.embedPng(fs.readFileSync(p));
  } catch (_) {}
  // 2) production URL fallback
  try {
    const res = await fetch('https://www.quirkypromo.com.au/quirky-logo-quote.png');
    if (res.ok) return await pdf.embedPng(await res.arrayBuffer());
  } catch (_) {}
  return null; // caller draws text logo
}

export async function generateOrderDocPDF(o) {
  const isPaid = o.paymentStatus === 'paid';
  const docTitle = o.docType || 'TAX INVOICE';
  const isInvoice = docTitle === 'TAX INVOICE';
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]);
  const { width, height } = page.getSize();
  const fB = await pdf.embedFont(StandardFonts.HelveticaBold);
  const fR = await pdf.embedFont(StandardFonts.Helvetica);
  const logo = await loadLogo(pdf);

  const right = (txt, xEnd, y, size, font, color) =>
    page.drawText(txt, { x: xEnd - font.widthOfTextAtSize(txt, size), y, size, font, color });

  // ── HEADER BAND ──
  page.drawRectangle({ x: 0, y: height - 110, width, height: 110, color: NAVY });
  if (logo) {
    const lw = 150, lh = lw * (256 / 1400);
    page.drawImage(logo, { x: 40, y: height - 42, width: lw, height: lh });
  } else {
    page.drawText('QUIRKY', { x: 40, y: height - 36, size: 20, font: fB, color: WHITE });
    page.drawText('PROMO', { x: 112, y: height - 36, size: 20, font: fB, color: GOLD });
  }
  const cb = [['ABN:', '95 656 714 270'], ['Phone:', '02 9477 4748'], ['Email:', 'hello@quirkypromo.com.au'], ['Web:', 'quirkypromo.com.au']];
  let cy = height - 64;
  cb.forEach(([l, v]) => {
    page.drawText(l, { x: 40, y: cy, size: 9, font: fB, color: WHITE });
    page.drawText(v, { x: 40 + fB.widthOfTextAtSize(l, 9) + 5, y: cy, size: 9, font: fR, color: WHITE });
    cy -= 12;
  });
  right(docTitle, width - 40, height - 44, 18, fB, WHITE);
  const meta = isInvoice ? [
    ['Inv #:', o.orderNumber],
    ['Order #:', o.orderNumber],
    ...(o.quoteRef ? [['Quote Ref:', o.quoteRef]] : []),
    ['Order Date:', o.date],
    ['Page:', '1 of 1'],
  ] : [
    ['OC #:', o.orderNumber],
    ...(o.quoteRef ? [['Quote Ref:', o.quoteRef]] : []),
    ['Order Date:', o.date],
    ['Page:', '1 of 1'],
  ];
  let my = height - 58;
  meta.forEach(([l, v]) => {
    page.drawText(l, { x: 392, y: my, size: 9, font: fB, color: WHITE });
    right(String(v || ''), width - 40, my, 9, fR, WHITE);
    my -= 12;
  });

  // ── BILL TO / DELIVER TO ──
  let y = height - 122;
  page.drawText('Bill To:', { x: 40, y, size: 9, font: fB, color: NAVY });
  page.drawText('Deliver To:', { x: 304, y, size: 9, font: fB, color: NAVY });
  page.drawRectangle({ x: 40, y: y - 70, width: 245, height: 64, borderColor: LINEC, borderWidth: 0.8 });
  page.drawRectangle({ x: 300, y: y - 70, width: 255, height: 64, borderColor: LINEC, borderWidth: 0.8 });
  const bill = [o.customer.company, o.customer.name, o.customer.email, o.customer.phone].filter(Boolean);
  let by = y - 17;
  bill.forEach((t, i) => { page.drawText(String(t), { x: 48, y: by, size: 9, font: i === 0 ? fB : fR, color: BLACK }); by -= 13; });
  const delv = String(o.deliveryAddress || 'TO BE CONFIRMED').split('\n').filter(Boolean).slice(0, 4);
  let dy = y - 17;
  delv.forEach(t => { page.drawText(t.substring(0, 42), { x: 312, y: dy, size: 9, font: fR, color: BLACK }); dy -= 13; });

  // ── ITEMS TABLE ──
  y = y - 96;
  page.drawRectangle({ x: 40, y: y - 6, width: width - 80, height: 20, color: NAVY });
  page.drawText('Stock Code', { x: 48, y: y - 1, size: 8, font: fB, color: WHITE });
  page.drawText('Description', { x: 120, y: y - 1, size: 8, font: fB, color: WHITE });
  page.drawText('Qty', { x: 347, y: y - 1, size: 8, font: fB, color: WHITE });
  page.drawText('Unit', { x: 368, y: y - 1, size: 8, font: fB, color: WHITE });
  page.drawText('Price', { x: 408, y: y - 1, size: 8, font: fB, color: WHITE });
  page.drawText('Disc%', { x: 444, y: y - 1, size: 8, font: fB, color: WHITE });
  page.drawText('Tax%', { x: 478, y: y - 1, size: 8, font: fB, color: WHITE });
  right('Total Value', width - 48, y - 1, 8, fB, WHITE);
  y -= 18;

  const drawRow = (it) => {
    const det = [];
    if (it.colour) det.push(`Colour: ${it.colour}`);
    if (it.branding) det.push(`Branding: ${it.branding}`);
    (it.addons || []).forEach(a => det.push(`+ ${a}`));
    const rowH = Math.max(34, 18 + det.length * 11 + 8);
    page.drawLine({ start: { x: 40, y: y - rowH + 14 }, end: { x: width - 40, y: y - rowH + 14 }, thickness: 0.4, color: LINEC });
    page.drawText(String(it.stockCode || ''), { x: 48, y: y - 2, size: 9, font: fR, color: BLACK });
    page.drawText(String(it.name || ''), { x: 120, y: y - 2, size: 9, font: fB, color: NAVY });
    let ddy = y - 14;
    det.forEach(d => { page.drawText(d.substring(0, 70), { x: 120, y: ddy, size: 7.5, font: fR, color: BLACK }); ddy -= 11; });
    page.drawText(String(it.qty), { x: 347, y: y - 2, size: 9, font: fR, color: BLACK });
    page.drawText('EA', { x: 368, y: y - 2, size: 9, font: fR, color: BLACK });
    right(money(it.unit), 436, y - 2, 9, fR, BLACK);
    page.drawText('0.00', { x: 444, y: y - 2, size: 9, font: fR, color: BLACK });
    page.drawText('10.00', { x: 476, y: y - 2, size: 9, font: fR, color: BLACK });
    right(money(it.lineTotal != null ? it.lineTotal : it.qty * it.unit), width - 48, y - 2, 9, fB, NAVY);
    y -= rowH;
  };
  (o.items || []).forEach(drawRow);

  // freight row
  page.drawText('FREIGHT', { x: 48, y: y - 2, size: 9, font: fR, color: BLACK });
  page.drawText('Shipping & Handling', { x: 120, y: y - 2, size: 9, font: fR, color: BLACK });
  page.drawText('1', { x: 347, y: y - 2, size: 9, font: fR, color: BLACK });
  page.drawText('EA', { x: 368, y: y - 2, size: 9, font: fR, color: BLACK });
  right(money(o.shipping), 436, y - 2, 9, fR, BLACK);
  page.drawText('0.00', { x: 444, y: y - 2, size: 9, font: fR, color: BLACK });
  page.drawText('10.00', { x: 476, y: y - 2, size: 9, font: fR, color: BLACK });
  right(money(o.shipping), width - 48, y - 2, 9, fB, NAVY);
  y -= 14;
  page.drawLine({ start: { x: 40, y }, end: { x: width - 40, y }, thickness: 0.5, color: LINEC });

  // ── anchor TOTAL + payment + notes near bottom (max whitespace) ──
  const totalsH = (o.surcharge ? 4 : 3) * 16 + 6 + 8 + 4 + 26;
  const payH = !isInvoice ? 50 : (isPaid ? 80 : 162);
  const notesH = 48;
  const FOOTER_TOP = 72;
  y = Math.min(y - 24, FOOTER_TOP + notesH + payH + totalsH);

  const totRow = (label, value, opt = {}) => {
    const sz = opt.big ? 14 : 9;
    page.drawText(label, { x: 358, y, size: sz, font: opt.big ? fB : fR, color: BLACK });
    right(value, width - 48, y, sz, opt.big ? fB : fR, BLACK);
    y -= opt.big ? 4 : 16;
  };
  totRow('Subtotal (excl. GST)', money(o.subtotal));
  totRow('Shipping & Handling', money(o.shipping));
  totRow('GST (10%)', money(o.gst));
  if (o.surcharge) totRow('Card surcharge (2%)', money(o.surcharge));
  y -= 6;
  page.drawLine({ start: { x: 358, y: y + 8 }, end: { x: width - 48, y: y + 8 }, thickness: 1, color: NAVY });
  y -= 8;
  totRow('TOTAL (incl. GST)', money(o.total), { big: true });
  y -= 26;

  // ── STATUS + PAYMENT BOX ──
  if (isInvoice) {
    const stamp = isPaid ? 'PAID — thank you!' : `AMOUNT DUE: ${money(o.total)}`;
    page.drawText(stamp, { x: 40, y, size: 13, font: fB, color: isPaid ? GREEN : rgb(0.75, 0.22, 0.17) });
    y -= 18;
    if (!isPaid) {
      page.drawText('Stock is subject to availability — pay promptly to lock in your stock and price.', { x: 40, y, size: 8.5, font: fR, color: BLACK });
      y -= 16;
    } else {
      y -= 4;
    }
    if (isPaid) {
      page.drawRectangle({ x: 40, y: y - 40, width: width - 80, height: 46, borderColor: GREEN, borderWidth: 0.6 });
      page.drawText('Payment received in full. Thank you for your business!', { x: 52, y: y - 14, size: 10, font: fB, color: GREEN });
      page.drawText('This tax invoice is for your records.', { x: 52, y: y - 30, size: 8.5, font: fR, color: BLACK });
      y -= 58;
    } else {
      const bk = o.bank || {};
      page.drawRectangle({ x: 40, y: y - 110, width: width - 80, height: 116, borderColor: GOLD, borderWidth: 0.6 });
      page.drawText('How to Pay', { x: 52, y: y - 16, size: 10, font: fB, color: NAVY });
      const rows = [
        ['Account Name', bk.name || ''],
        ['Bank', bk.bank || ''],
        ['BSB', bk.bsb || ''],
        ['Account Number', bk.acct || ''],
        ['Reference', o.orderNumber],
      ];
      rows.forEach(([l, v], i) => {
        const ry = y - 34 - i * 13;
        page.drawText(l, { x: 52, y: ry, size: 8.5, font: fR, color: BLACK });
        page.drawText(String(v), { x: 175, y: ry, size: 8.5, font: l === 'Reference' ? fB : fR, color: l === 'Reference' ? GOLD : BLACK });
      });
      page.drawText('Prefer to pay by credit card? Call us on 02 9477 4748 — a 2% surcharge applies.', { x: 52, y: y - 102, size: 8, font: fR, color: BLACK });
      y -= 128;
    }
  } else {
    page.drawRectangle({ x: 40, y: y - 38, width: width - 80, height: 44, borderColor: LINEC, borderWidth: 0.6 });
    page.drawText('This is your order confirmation.', { x: 52, y: y - 16, size: 10, font: fB, color: NAVY });
    page.drawText('A separate tax invoice is attached with payment details.', { x: 52, y: y - 30, size: 8.5, font: fR, color: BLACK });
    y -= 50;
  }

  // ── NOTES (clean, no fill) ──
  page.drawLine({ start: { x: 40, y: y + 4 }, end: { x: width - 40, y: y + 4 }, thickness: 0.4, color: LINEC });
  page.drawText('Good to know', { x: 40, y: y - 12, size: 8.5, font: fB, color: NAVY });
  page.drawText('Production only begins after artwork approval and payment received.', { x: 40, y: y - 26, size: 8.5, font: fR, color: BLACK });
  page.drawText(`Production lead time is ${o.leadTimeDays || 7} business days.`, { x: 40, y: y - 39, size: 8.5, font: fR, color: BLACK });

  // ── FOOTER ──
  page.drawLine({ start: { x: 40, y: 50 }, end: { x: width - 40, y: 50 }, thickness: 0.5, color: LINEC });
  page.drawText('Thank you for your order. We look forward to creating something great for you.', { x: 40, y: 36, size: 7.5, font: fR, color: BLACK });
  page.drawText('Quirky Promo  ·  ABN 95 656 714 270  ·  quirkypromo.com.au  ·  hello@quirkypromo.com.au', { x: 40, y: 24, size: 7.5, font: fR, color: BLACK });

  return Buffer.from(await pdf.save());
}

export const QUIRKY_BANK = { name: 'Grow Your Marketing', bank: 'ANZ', bsb: '012-306', acct: '192040129' };

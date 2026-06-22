// lib/poDocPdf.js
// Supplier PURCHASE ORDER PDF — same house style as the customer Tax Invoice / OC
// (navy header band, gift-box logo, Stock Code column). The supplier is NOT printed
// on the document (drop-ship / white-label); DELIVER TO is the customer's details.
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

const NAVY = rgb(0.106, 0.165, 0.290);
const GOLD = rgb(0.788, 0.663, 0.431);
const WHITE = rgb(1, 1, 1);
const BLACK = rgb(0.08, 0.08, 0.08);
const GREY = rgb(0.08, 0.08, 0.08);
const LINEC = rgb(0.86, 0.85, 0.82);
const LIGHT = rgb(0.973, 0.969, 0.957);

async function loadLogo(pdf) {
  try {
    const p = path.join(process.cwd(), 'public', 'quirky-logo-quote.png');
    return await pdf.embedPng(fs.readFileSync(p));
  } catch (e) { /* fall through */ }
  try {
    const res = await fetch('https://www.quirkypromo.com.au/quirky-logo-quote.png');
    if (res.ok) return await pdf.embedPng(new Uint8Array(await res.arrayBuffer()));
  } catch (e) { /* fall through */ }
  return null;
}

const money = (n) => '$' + Number(n || 0).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// o: { poNumber, date, ourRef,
//      deliver{name,phone,address},
//      items[{stockCode,name,qty,unitCost,branding}], freight, paymentNote }
export async function generatePurchaseOrderPDF(o) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]);
  const { width: W, height: H } = page.getSize();
  const fB = await pdf.embedFont(StandardFonts.HelveticaBold);
  const fR = await pdf.embedFont(StandardFonts.Helvetica);
  const fM = await pdf.embedFont(StandardFonts.Courier);
  const tw = (t, s, f) => f.widthOfTextAtSize(t, s);
  const right = (t, xE, y, s, f, c) => page.drawText(t, { x: xE - tw(t, s, f), y, size: s, font: f, color: c });
  const logo = await loadLogo(pdf);
  const M = 40;

  // ── HEADER BAND ── (unified with OC / Tax Invoice / Quote)
  page.drawRectangle({ x: 0, y: H - 110, width: W, height: 110, color: NAVY });
  if (logo) {
    const lw = 150, lh = lw * (256 / 1400);
    page.drawImage(logo, { x: 40, y: H - 42, width: lw, height: lh });
  } else {
    page.drawText('QUIRKY', { x: 40, y: H - 36, size: 20, font: fB, color: WHITE });
    page.drawText('PROMO', { x: 112, y: H - 36, size: 20, font: fB, color: GOLD });
  }
  const cb = [['ABN:', '95 656 714 270'], ['Phone:', '02 9477 4748'], ['Email:', 'hello@quirkypromo.com.au'], ['Web:', 'quirkypromo.com.au']];
  let cy = H - 64;
  cb.forEach(([l, v]) => {
    page.drawText(l, { x: 40, y: cy, size: 9, font: fB, color: WHITE });
    page.drawText(v, { x: 40 + tw(l, 9, fB) + 5, y: cy, size: 9, font: fR, color: WHITE });
    cy -= 12;
  });
  right('PURCHASE ORDER', W - 40, H - 44, 18, fB, WHITE);
  const meta = [['PO #:', o.poNumber || ''], ['Date:', o.date || ''], ...(o.ourRef ? [['Our ref:', o.ourRef]] : [])];
  let my = H - 60;
  meta.forEach(([l, v]) => {
    page.drawText(l, { x: 392, y: my, size: 9, font: fB, color: WHITE });
    right(String(v || ''), W - 40, my, 9, fR, WHITE);
    my -= 12;
  });

  // ── JOB (left) + DELIVER TO (right) — the labels are the big bold titles ──
  const topY = H - 134;
  const d = o.deliver || {};

  page.drawText('JOB', { x: M, y: topY, size: 13, font: fB, color: NAVY });
  if (o.jobName) page.drawText(String(o.jobName), { x: M, y: topY - 18, size: 10.5, font: fR, color: BLACK });

  let ry = topY;
  page.drawText('DELIVER TO', { x: 310, y: ry, size: 13, font: fB, color: NAVY });
  ry -= 18;
  if (d.company) { page.drawText(d.company, { x: 310, y: ry, size: 10.5, font: fB, color: NAVY }); ry -= 13; }
  if (d.name) { page.drawText((d.company ? 'Attn: ' : '') + d.name, { x: 310, y: ry, size: 10, font: fR, color: BLACK }); ry -= 13; }
  if (d.phone) { page.drawText('Phone: ' + d.phone, { x: 310, y: ry, size: 10, font: fR, color: BLACK }); ry -= 13; }
  (d.address || '').split('\n').filter(Boolean).forEach(line => { page.drawText(line, { x: 310, y: ry, size: 10, font: fR, color: BLACK }); ry -= 13; });

  // ── ITEMS TABLE (detailed unit pricing) ──
  let y = Math.min(ry, topY - 36) - 16;
  const cCode = M + 6, cDesc = M + 90, cQty = W - M - 200, cUnit = W - M - 110, cTot = W - M - 8;
  page.drawRectangle({ x: M, y: y - 4, width: W - 2 * M, height: 20, color: NAVY });
  page.drawText('Stock Code', { x: cCode, y: y + 2, size: 8.5, font: fB, color: WHITE });
  page.drawText('Description', { x: cDesc, y: y + 2, size: 8.5, font: fB, color: WHITE });
  right('Qty', cQty, y + 2, 8.5, fB, WHITE);
  right('Unit cost', cUnit + 30, y + 2, 8.5, fB, WHITE);
  right('Total', cTot, y + 2, 8.5, fB, WHITE);
  y -= 14;
  let subtotal = 0;
  (o.items || []).forEach(it => {
    const qty = Number(it.qty) || 0, unit = Number(it.unitCost) || 0;
    const line = qty * unit; subtotal += line;
    page.drawText(String(it.stockCode || ''), { x: cCode, y: y - 6, size: 9, font: fM, color: BLACK });
    page.drawText(String(it.name || ''), { x: cDesc, y: y - 6, size: 9, font: fR, color: BLACK });
    if (it.branding) page.drawText(it.branding, { x: cDesc, y: y - 16, size: 7.5, font: fR, color: GREY });
    right(String(qty), cQty, y - 6, 9, fR, BLACK);
    right(money(unit), cUnit + 30, y - 6, 9, fR, BLACK);
    right(money(line), cTot, y - 6, 9, fR, BLACK);
    y -= it.branding ? 25 : 16;
    page.drawLine({ start: { x: M, y: y + 2 }, end: { x: W - M, y: y + 2 }, thickness: 0.4, color: LINEC });
  });

  // ── TOTALS ──
  y -= 12;
  const lblX = W - M - 200;
  const row = (label, val, bold) => {
    page.drawText(label, { x: lblX, y, size: bold ? 11 : 9.5, font: bold ? fB : fR, color: bold ? NAVY : GREY });
    right(val, cTot, y, bold ? 12 : 10, bold ? fB : fR, bold ? NAVY : BLACK);
    y -= bold ? 18 : 15;
  };
  const freight = Number(o.freight) || 0;
  row('Subtotal', money(subtotal));
  row('Freight', money(freight));
  y -= 4;
  page.drawLine({ start: { x: lblX, y: y + 12 }, end: { x: cTot, y: y + 12 }, thickness: 1, color: NAVY });
  row('Total cost', money(subtotal + freight), true);

  // ── FOOTER ──
  page.drawRectangle({ x: M, y: 64, width: W - 2 * M, height: 30, color: LIGHT });
  page.drawText('Please confirm dispatch date and send your invoice to hello@quirkypromo.com.au.', { x: M + 12, y: 75, size: 9, font: fR, color: NAVY });
  page.drawLine({ start: { x: M, y: 44 }, end: { x: W - M, y: 44 }, thickness: 0.5, color: LINEC });
  page.drawText('QuirkyPromo  ·  ABN 95 656 714 270  ·  quirkypromo.com.au', { x: M, y: 30, size: 7.5, font: fR, color: GREY });
  right('Page 1 of 1', W - M, 30, 7.5, fR, GREY);

  return await pdf.save();
}

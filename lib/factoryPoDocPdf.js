// lib/factoryPoDocPdf.js
// FACTORY PURCHASE ORDER (RMB) — our PO to a China factory. Same house style as
// the customer Tax Invoice / OC / supplier PO (navy header band, gift-box logo),
// but amounts are in RMB (¥), terms are EXW, and the SHIP TO is our forwarder.
// See DOC_STANDARDS.md.
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

const money = (n) => '¥' + Number(n || 0).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// pdf-lib StandardFonts only encode WinAnsi (Latin-1). Strip anything outside it
// (e.g. Chinese characters in a spec) so the document never throws at runtime.
function safe(t) {
  return String(t == null ? '' : t).replace(/[^\x09\x0A\x0D\x20-\x7E\xA0-\xFF]/g, '');
}

// o: { poNumber, date, ourRef,
//      supplier{name,contact,phone,address}, shipTo{label,address},
//      incoterm, paymentTerms, currencyNote,
//      items[{name,spec,qty,unitRmb}], charges[{label,amountRmb}], notes }
export async function generateFactoryPoPDF(o) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]);
  const { width: W, height: H } = page.getSize();
  const fB = await pdf.embedFont(StandardFonts.HelveticaBold);
  const fR = await pdf.embedFont(StandardFonts.Helvetica);
  const fM = await pdf.embedFont(StandardFonts.Courier);
  const tw = (t, s, f) => f.widthOfTextAtSize(safe(t), s);
  const draw = (t, x, y, s, f, c) => page.drawText(safe(t), { x, y, size: s, font: f, color: c });
  const right = (t, xE, y, s, f, c) => page.drawText(safe(t), { x: xE - tw(t, s, f), y, size: s, font: f, color: c });
  const logo = await loadLogo(pdf);
  const M = 40;

  // ── HEADER BAND ── (unified with OC / Tax Invoice / Quote / supplier PO)
  page.drawRectangle({ x: 0, y: H - 110, width: W, height: 110, color: NAVY });
  if (logo) {
    const lw = 150, lh = lw * (256 / 1400);
    page.drawImage(logo, { x: 40, y: H - 42, width: lw, height: lh });
  } else {
    draw('QUIRKY', 40, H - 36, 20, fB, WHITE);
    draw('PROMO', 112, H - 36, 20, fB, GOLD);
  }
  const cb = [['ABN:', '95 656 714 270'], ['Phone:', '02 9477 4748'], ['Email:', 'hello@quirkypromo.com.au'], ['Web:', 'quirkypromo.com.au']];
  let cy = H - 64;
  cb.forEach(([l, v]) => {
    draw(l, 40, cy, 9, fB, WHITE);
    draw(v, 40 + tw(l, 9, fB) + 5, cy, 9, fR, WHITE);
    cy -= 12;
  });
  right('PURCHASE ORDER', W - 40, H - 35, 18, fB, WHITE);
  const meta = [['PO #:', o.poNumber || ''], ['Date:', o.date || ''], ...(o.ourRef ? [['Our ref:', o.ourRef]] : [])];
  let my = H - 60;
  meta.forEach(([l, v]) => {
    draw(l, 392, my, 9, fB, WHITE);
    right(String(v || ''), W - 40, my, 9, fR, WHITE);
    my -= 12;
  });

  // ── SUPPLIER (left) + SHIP TO (right) ──
  const topY = H - 134;
  const sup = o.supplier || {};
  const ship = o.shipTo || {};

  let ly = topY;
  draw('SUPPLIER', M, ly, 13, fB, NAVY); ly -= 18;
  if (sup.name) { draw(sup.name, M, ly, 10.5, fB, NAVY); ly -= 13; }
  if (sup.contact) { draw('Attn: ' + sup.contact, M, ly, 10, fR, BLACK); ly -= 13; }
  if (sup.phone) { draw('Tel: ' + sup.phone, M, ly, 10, fR, BLACK); ly -= 13; }
  safe(sup.address || '').split('\n').filter(Boolean).forEach((line) => { draw(line, M, ly, 10, fR, BLACK); ly -= 13; });

  let ry = topY;
  draw('SHIP TO', 310, ry, 13, fB, NAVY); ry -= 18;
  draw(ship.label || 'Our forwarder', 310, ry, 10.5, fB, NAVY); ry -= 13;
  safe(ship.address || '').split('\n').filter(Boolean).forEach((line) => { draw(line, 310, ry, 10, fR, BLACK); ry -= 13; });
  draw('Incoterm: ' + (o.incoterm || 'EXW'), 310, ry, 10, fB, BLACK); ry -= 13;

  // ── ITEMS TABLE (RMB) ──
  let y = Math.min(ly, ry, topY - 60) - 16;
  const cDesc = M + 6, cQty = W - M - 200, cUnit = W - M - 110, cTot = W - M - 8;
  page.drawRectangle({ x: M, y: y - 4, width: W - 2 * M, height: 20, color: NAVY });
  draw('Description', cDesc, y + 2, 8.5, fB, WHITE);
  right('Qty', cQty, y + 2, 8.5, fB, WHITE);
  right('Unit (RMB)', cUnit + 30, y + 2, 8.5, fB, WHITE);
  right('Total (RMB)', cTot, y + 2, 8.5, fB, WHITE);
  y -= 14;

  let total = 0;
  (o.items || []).forEach((it) => {
    const qty = Number(it.qty) || 0, unit = Number(it.unitRmb) || 0;
    const line = qty * unit; total += line;
    draw(String(it.name || ''), cDesc, y - 6, 9, fB, BLACK);
    if (it.spec) draw(String(it.spec), cDesc, y - 16, 7.5, fR, GREY);
    right(String(qty), cQty, y - 6, 9, fR, BLACK);
    right(money(unit), cUnit + 30, y - 6, 9, fR, BLACK);
    right(money(line), cTot, y - 6, 9, fR, BLACK);
    y -= it.spec ? 25 : 16;
    page.drawLine({ start: { x: M, y: y + 2 }, end: { x: W - M, y: y + 2 }, thickness: 0.4, color: LINEC });
  });
  (o.charges || []).forEach((ch) => {
    const amt = Number(ch.amountRmb) || 0;
    if (!amt) return;
    total += amt;
    draw(String(ch.label || ''), cDesc, y - 6, 9, fR, BLACK);
    right('1', cQty, y - 6, 9, fR, BLACK);
    right(money(amt), cUnit + 30, y - 6, 9, fR, BLACK);
    right(money(amt), cTot, y - 6, 9, fR, BLACK);
    y -= 16;
    page.drawLine({ start: { x: M, y: y + 2 }, end: { x: W - M, y: y + 2 }, thickness: 0.4, color: LINEC });
  });

  // ── TOTAL ──
  y -= 12;
  const lblX = W - M - 200;
  page.drawLine({ start: { x: lblX, y: y + 12 }, end: { x: cTot, y: y + 12 }, thickness: 1, color: NAVY });
  draw('Total (EXW)', lblX, y, 11, fB, NAVY);
  right(money(total), cTot, y, 12, fB, NAVY);
  y -= 22;

  // ── TERMS ──
  if (o.paymentTerms) { draw('Payment terms: ' + o.paymentTerms, M, y, 9, fR, BLACK); y -= 14; }
  if (o.notes) {
    safe(o.notes).split('\n').filter(Boolean).forEach((line) => { draw(line, M, y, 9, fR, BLACK); y -= 12; });
  }

  // ── FOOTER ──
  page.drawRectangle({ x: M, y: 64, width: W - 2 * M, height: 30, color: LIGHT });
  draw('Please confirm this order, lead time and deposit invoice by reply. Mark all cartons with our PO #.', M + 12, 75, 9, fR, NAVY);
  page.drawLine({ start: { x: M, y: 44 }, end: { x: W - M, y: 44 }, thickness: 0.5, color: LINEC });
  draw('QuirkyPromo  ·  ABN 95 656 714 270  ·  quirkypromo.com.au', M, 30, 7.5, fR, GREY);
  right('Page 1 of 1', W - M, 30, 7.5, fR, GREY);

  return await pdf.save();
}

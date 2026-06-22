// lib/certGen.js
// Branded "Certificate of Approval" (PandaDoc-style). pdf-lib, provider-neutral.
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const NAVY = rgb(0.106, 0.165, 0.290);
const GOLD = rgb(0.788, 0.663, 0.431);
const WHITE = rgb(1, 1, 1);
const BLACK = rgb(0.08, 0.08, 0.08);
const GREY = rgb(0.40, 0.39, 0.37);
const LINEC = rgb(0.84, 0.83, 0.80);
const LIGHT = rgb(0.974, 0.970, 0.960);
const FRAME = rgb(0.80, 0.74, 0.55);

async function fetchEmbed(pdf, url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const buf = new Uint8Array(await res.arrayBuffer());
    try { return await pdf.embedPng(buf); } catch { return await pdf.embedJpg(buf); }
  } catch { return null; }
}

// o: { brandLogoUrl, refNumber, approvedOnText, signerName, signerEmail,
//      approvedAtText, ip, location, orderNumber, productName, version }
export async function generateApprovalCertificate(o) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]);
  const { width: W, height: H } = page.getSize();
  const fB = await pdf.embedFont(StandardFonts.HelveticaBold);
  const fR = await pdf.embedFont(StandardFonts.Helvetica);
  const fTI = await pdf.embedFont(StandardFonts.TimesRomanItalic);
  const fM = await pdf.embedFont(StandardFonts.CourierBold);
  const tw = (t, s, f) => f.widthOfTextAtSize(t, s);
  const right = (t, xE, y, s, f, c) => page.drawText(t, { x: xE - tw(t, s, f), y, size: s, font: f, color: c });
  const logo = await fetchEmbed(pdf, o.brandLogoUrl);

  const M = 46;
  page.drawRectangle({ x: 24, y: 24, width: W - 48, height: H - 48, borderColor: FRAME, borderWidth: 1.4 });
  page.drawRectangle({ x: 30, y: 30, width: W - 60, height: H - 60, borderColor: FRAME, borderWidth: 0.5 });
  page.drawRectangle({ x: 30, y: H - 36, width: W - 60, height: 6, color: GOLD });

  if (logo) {
    const lw = 150, lh = lw * 256 / 1400;
    page.drawImage(logo, { x: (W - lw) / 2, y: H - 86, width: lw, height: lh });
  } else {
    const t = 'QuirkyPromo';
    page.drawText('Quirky', { x: (W - tw('QuirkyPromo', 20, fB)) / 2, y: H - 74, size: 20, font: fB, color: GOLD });
    page.drawText('Promo', { x: (W - tw('QuirkyPromo', 20, fB)) / 2 + tw('Quirky', 20, fB), y: H - 74, size: 20, font: fB, color: NAVY });
  }

  const ts = 24;
  const tWidth = tw('CERTIFICATE ', ts, fB) + tw('OF ', ts, fTI) + tw('APPROVAL', ts, fB);
  let tx = (W - tWidth) / 2, ty = H - 128;
  page.drawText('CERTIFICATE ', { x: tx, y: ty, size: ts, font: fB, color: NAVY }); tx += tw('CERTIFICATE ', ts, fB);
  page.drawText('OF ', { x: tx, y: ty, size: ts, font: fTI, color: NAVY }); tx += tw('OF ', ts, fTI);
  page.drawText('APPROVAL', { x: tx, y: ty, size: ts, font: fB, color: NAVY });
  page.drawLine({ start: { x: M, y: ty - 14 }, end: { x: W - M, y: ty - 14 }, thickness: 0.8, color: LINEC });

  let y = ty - 40;
  page.drawText('REF. NUMBER', { x: M, y: y + 12, size: 7.5, font: fR, color: GREY });
  page.drawText(o.refNumber || '', { x: M, y: y - 2, size: 10, font: fM, color: NAVY });
  right('DOCUMENT APPROVED ON', W - M, y + 12, 7.5, fR, GREY);
  right(o.approvedOnText || '', W - M, y - 2, 10, fM, NAVY);

  y -= 44;
  page.drawLine({ start: { x: M, y: y + 16 }, end: { x: W - M, y: y + 16 }, thickness: 0.8, color: NAVY });
  const colA = M, colB = M + 185, colC = M + 360;
  page.drawText('SIGNER', { x: colA, y, size: 10, font: fB, color: NAVY });
  page.drawText('TIMESTAMP', { x: colB, y, size: 10, font: fB, color: NAVY });
  page.drawText('SIGNATURE', { x: colC, y, size: 10, font: fB, color: NAVY });

  y -= 26;
  page.drawText('NAME', { x: colA, y, size: 7, font: fR, color: GREY });
  page.drawText(o.signerName || '', { x: colA, y: y - 12, size: 9.5, font: fB, color: BLACK });
  page.drawText('EMAIL', { x: colA, y: y - 30, size: 7, font: fR, color: GREY });
  page.drawText(o.signerEmail || '', { x: colA, y: y - 42, size: 9, font: fM, color: BLACK });

  page.drawText('APPROVED', { x: colB, y, size: 7, font: fR, color: GREY });
  page.drawText(o.approvedAtText || '', { x: colB, y: y - 12, size: 8.5, font: fM, color: BLACK });

  page.drawRectangle({ x: colC, y: y - 16, width: W - M - colC, height: 30, borderColor: LINEC, borderWidth: 0.8 });
  page.drawText(o.signerName || '', { x: colC + 10, y: y - 6, size: 15, font: fTI, color: NAVY });
  page.drawText('IP ADDRESS', { x: colC, y: y - 32, size: 7, font: fR, color: GREY });
  page.drawText(o.ip || '-', { x: colC, y: y - 44, size: 8.5, font: fM, color: BLACK });
  if (o.location) {
    page.drawText('LOCATION', { x: colC, y: y - 62, size: 7, font: fR, color: GREY });
    page.drawText(o.location, { x: colC, y: y - 74, size: 8.5, font: fM, color: BLACK });
  }

  y -= 104;
  page.drawRectangle({ x: M, y: y - 30, width: W - 2 * M, height: 40, color: LIGHT, borderColor: LINEC, borderWidth: 0.8 });
  page.drawText('APPROVED DOCUMENT', { x: M + 12, y: y - 2, size: 7.5, font: fR, color: GREY });
  page.drawText(`Artwork Approval - ${o.productName || ''}  -  Order ${o.orderNumber || ''}  -  Proof ${o.version || 'V1'}`, { x: M + 12, y: y - 18, size: 9.5, font: fB, color: NAVY });

  page.drawText('Approved with', { x: M, y: 70, size: 8, font: fR, color: GREY });
  page.drawText('Quirky', { x: M, y: 54, size: 13, font: fB, color: GOLD });
  page.drawText('Promo', { x: M + tw('Quirky', 13, fB), y: 54, size: 13, font: fB, color: NAVY });
  page.drawText('QuirkyPromo  -  ABN 95 656 714 270  -  This certificate is a record of electronic approval.', { x: M, y: 40, size: 7, font: fR, color: GREY });

  return await pdf.save();
}

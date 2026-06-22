// lib/proofGen.js
// Provider-neutral Artwork Approval proof generator.
// Reads the product template image + customer logo from URLs (Cloudinary today,
// Cloudflare later — no provider-specific code), composites the logo into the
// print box, and renders the branded "ARTWORK APPROVAL" proof (v2 layout).
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const NAVY = rgb(0.106, 0.165, 0.290);
const GOLD = rgb(0.788, 0.663, 0.431);
const WHITE = rgb(1, 1, 1);
const BLACK = rgb(0.08, 0.08, 0.08);
const LINEC = rgb(0.86, 0.85, 0.82);
const LIGHT = rgb(0.974, 0.970, 0.960);

// pdf-lib can only embed PNG/JPG. Customer logos are often vector (AI/PDF/EPS/SVG)
// and live on Cloudinary — deliver a rasterised PNG via an on-the-fly transform.
export function rasterLogoUrl(url) {
  if (!url || typeof url !== 'string') return url;
  if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
    const marker = '/upload/';
    const i = url.indexOf(marker);
    const after = url.slice(i + marker.length);
    const first = after.split('/')[0];
    if (/^(f_|q_|w_|h_|c_|e_|pg_)/.test(first)) return url; // already transformed
    const isPdf = /\.pdf($|\?)/i.test(url);
    const t = isPdf ? 'f_png,pg_1,w_1000/' : 'f_png,w_1000/';
    return url.slice(0, i + marker.length) + t + after;
  }
  return url;
}

async function fetchEmbed(pdf, url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`fetch failed (${res.status}) ${url}`);
  const buf = new Uint8Array(await res.arrayBuffer());
  try { return await pdf.embedPng(buf); }
  catch { return await pdf.embedJpg(buf); }
}

const DISCLAIMER = 'Colour proofs are to be used as a guide only. Line drawing is for approximate print positional guide only. Please familiarise yourself with the product prior to approving. It is not intended to be an exact scale or detailed representation. Small details or text, including (TM)(R)(C), may fill in and not be legible. Dotted lines will not be printed and are for maximum print guide only. The fine lines and details in your logo may not be able to be produced clearly.';

// o: { brandLogoUrl, templateUrl, customerLogoUrl, box{x,y,w,h},
//      orderNumber, date, quoteRef, version, productName, stockCode, qty,
//      productColour, printColour, pms, printMethod, position, docRef }
export async function generateArtworkProof(o) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]);
  const { width: W, height: H } = page.getSize();
  const fB = await pdf.embedFont(StandardFonts.HelveticaBold);
  const fR = await pdf.embedFont(StandardFonts.Helvetica);
  const tw = (t, s, f) => f.widthOfTextAtSize(t, s);
  const right = (t, xE, y, s, f, c) => page.drawText(t, { x: xE - tw(t, s, f), y, size: s, font: f, color: c });

  const logo = await fetchEmbed(pdf, o.brandLogoUrl);
  const tpl = await fetchEmbed(pdf, o.templateUrl);
  const cust = await fetchEmbed(pdf, rasterLogoUrl(o.customerLogoUrl));

  const M = 40, topY = H - 40, lw = 138, lh = lw * 256 / 1400;

  // right block: our logo + meta (defines header height)
  page.drawImage(logo, { x: W - M - lw, y: topY - lh, width: lw, height: lh });
  const meta = [['Order #', o.orderNumber], ['Date', o.date], ...(o.quoteRef ? [['Quote Ref', o.quoteRef]] : [])];
  let my = topY - lh - 15;
  meta.forEach(([l, v]) => {
    const vs = tw(v, 9, fB), ls = tw(l + '  ', 8.5, fR);
    right(v, W - M, my, 9, fB, NAVY);
    page.drawText(l, { x: W - M - vs - ls, y: my, size: 8.5, font: fR, color: BLACK });
    my -= 13;
  });
  const rb = my + 13 - 3;

  // left badge, same height as right block
  const bX = M, bW = 300, bY = rb, bH = topY - bY;
  page.drawRectangle({ x: bX, y: bY, width: bW, height: bH, color: NAVY });
  page.drawRectangle({ x: bX, y: bY, width: 5, height: bH, color: GOLD });
  const cY = bY + bH / 2;
  page.drawText('ARTWORK APPROVAL', { x: bX + 20, y: cY + 3, size: 13, font: fB, color: WHITE });
  page.drawText('PROOF', { x: bX + 20, y: cY - 15, size: 9.5, font: fB, color: GOLD });
  page.drawText(o.version || 'V1', { x: bX + 20 + tw('PROOF  ', 9.5, fB), y: cY - 15, size: 9.5, font: fB, color: WHITE });

  // hero template + customer logo composited into the print box
  const heroTop = H - 118, bandTop = 226, availH = heroTop - bandTop;
  let hH = availH, hW = tpl.width / tpl.height * hH;
  if (hW > W - 2 * M - 40) { hW = W - 2 * M - 40; hH = tpl.height / tpl.width * hW; }
  const hx = (W - hW) / 2, hy = bandTop + (availH - hH) / 2;
  page.drawImage(tpl, { x: hx, y: hy, width: hW, height: hH });
  const bxX = hx + o.box.x * hW, bxW = o.box.w * hW;
  const bxTop = hy + hH - o.box.y * hH, bxH = o.box.h * hH, bxY = bxTop - bxH;
  const fit = 0.88;
  let cw = bxW * fit, ch = cust.height / cust.width * cw;
  if (ch > bxH * fit) { ch = bxH * fit; cw = cust.width / cust.height * ch; }
  page.drawImage(cust, { x: bxX + (bxW - cw) / 2, y: bxY + (bxH - ch) / 2, width: cw, height: ch });

  // bottom info band
  const bandX = M, bandW = W - 2 * M, bandH = 104, bandY = 110;
  page.drawRectangle({ x: bandX, y: bandY, width: bandW, height: bandH, color: LIGHT });
  page.drawRectangle({ x: bandX, y: bandY, width: bandW, height: bandH, borderColor: LINEC, borderWidth: 0.8 });
  const col = [bandX + 16, bandX + 200, bandX + 372];
  const field = (cx, ly, l, v) => {
    page.drawText(l, { x: cx, y: ly, size: 7.5, font: fR, color: BLACK });
    page.drawText(v || '-', { x: cx, y: ly - 13, size: 10, font: fB, color: NAVY });
  };
  field(col[0], bandY + bandH - 18, 'PRODUCT', o.productName);
  field(col[1], bandY + bandH - 18, 'STOCK CODE', o.stockCode);
  field(col[2], bandY + bandH - 18, 'QUANTITY', String(o.qty || ''));
  field(col[0], bandY + bandH - 52, 'PRODUCT COLOUR', o.productColour);
  field(col[1], bandY + bandH - 52, 'PRINT COLOUR', o.printColour);
  field(col[2], bandY + bandH - 52, 'PMS #', o.pms);
  const pmY = bandY + 16;
  page.drawText('PRINT METHOD', { x: col[0], y: pmY + 8, size: 7.5, font: fR, color: BLACK });
  page.drawText(o.printMethod || '-', { x: col[0], y: pmY - 6, size: 10, font: fB, color: NAVY });
  page.drawText('Position: ' + (o.position || 'Front, centred'), { x: col[2], y: pmY - 6, size: 9, font: fR, color: BLACK });

  // disclaimer + footer
  page.drawText('Please check this Artwork Approval carefully', { x: M, y: 99, size: 8, font: fB, color: NAVY });
  const wrap = (t, x, y, maxW, s, lh2) => {
    const ws = t.split(' '); let line = '';
    for (const w of ws) {
      if (tw((line + w), s, fR) > maxW) { page.drawText(line.trim(), { x, y, size: s, font: fR, color: BLACK }); y -= lh2; line = w + ' '; }
      else line += w + ' ';
    }
    if (line.trim()) page.drawText(line.trim(), { x, y, size: s, font: fR, color: BLACK });
  };
  wrap(DISCLAIMER, M, 87, W - 2 * M, 7.2, 9.2);
  page.drawLine({ start: { x: M, y: 40 }, end: { x: W - M, y: 40 }, thickness: 0.5, color: LINEC });
  page.drawText('Approve online - production begins after approval & payment.', { x: M, y: 28, size: 8, font: fB, color: NAVY });
  right('Doc Ref: ' + (o.docRef || '') + '   .   Page 1 of 1', W - M, 28, 8, fR, BLACK);

  return await pdf.save(); // Uint8Array
}

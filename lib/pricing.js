// lib/pricing.js
// ── Single source of truth for pricing + quote/branding rules ───────────────
// Every page that shows a price, builds a quote, or labels a branding method
// imports from HERE. Change a number once and the whole site stays in sync.
// (This is what stops the "$7,259 vs $7,260" / laser-label / lead-time drift.)

export const MARGIN = 1.40;       // sell price (ex-GST) = supplier cost * MARGIN

// Tiered margin on the GARMENT/base price by tier POSITION (smallest-qty tier = index 0):
//   1st tier → 1.50 (50%), 2nd tier → 1.45 (45%), 3rd tier onwards → 1.40 (40%).
// Applies ONLY to the base/garment price. Decoration per-unit stays at MARGIN (40%),
// and quote_only reference prices are NOT tiered.
export const tierMargin = (index) => (index === 0 ? 1.50 : index === 1 ? 1.45 : 1.40);

export const GST = 0.10;          // Australian GST 10%
export const SHIPPING = 30;       // flat domestic shipping ($)
export const SETUP_FEE = 60;      // branding setup fee — FLAT $ charged to customer (NOT ×MARGIN)
export const LEAD_TIME = '3-7';   // production lead time (business days, Trends standard)

// Customer-facing per-unit DECORATION price = supplier cost × MARGIN, rounded UP to
// the nearest $0.10 (never below cost). Applies to every decoration method site-wide.
// (Product/garment unit prices are NOT rounded — only decoration per-unit.)
export const decoUnitPrice = (perUnit) => {
  const cents = (Number(perUnit) || 0) * MARGIN * 100;
  return Math.ceil(cents / 10 - 1e-6) * 10 / 100;
};

// ── Branding method classification (drives the quote line label) ────────────
export const isColourMethod = (d) => {
  const n = (d?.name || '').toLowerCase();
  return n.includes('screen print') || n.includes('pad print');
};
export const isOneColourLocked = (d) => {
  const x = (d?.detail || '').toLowerCase();
  return x.includes('one colour') || x.includes('1 colour');
};
// Laser engraving / etching / debossing have no colour — show the method name only.
export const isEngravingMethod = (d) => {
  const n = (d?.name || '').toLowerCase();
  return n.includes('laser') || n.includes('engrav') || n.includes('deboss') || n.includes('emboss') || n.includes('etch');
};
export const brandingLabel = (d, setupQty) =>
  isEngravingMethod(d) ? d.name
    : isColourMethod(d) ? `${d.name} — ${isOneColourLocked(d) ? 1 : (setupQty || 1)} COL · 1 POS`
      : `${d.name} — Full Colour · 1 POS`;

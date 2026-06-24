// lib/pricing.js
// ── Single source of truth for pricing + quote/branding rules ───────────────
// Every page that shows a price, builds a quote, or labels a branding method
// imports from HERE. Change a number once and the whole site stays in sync.
// (This is what stops the "$7,259 vs $7,260" / laser-label / lead-time drift.)

export const MARGIN = 1.40;       // sell price (ex-GST) = supplier cost * MARGIN
export const GST = 0.10;          // Australian GST 10%
export const SHIPPING = 30;       // flat domestic shipping ($)
export const SETUP_FEE = 40;      // branding setup fee base ($)
export const LEAD_TIME = '3-7';   // production lead time (business days, Trends standard)

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

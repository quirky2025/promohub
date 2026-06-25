// lib/colourCards.js
// Reusable fabric colour cards. Backend stores colour CODES (e.g. "JHT-23106");
// admin/frontend render the matching swatch from here so the code and the colour
// block always line up. Hex values are visual approximations of the JHT 经典棉
// (Classical Cotton) swatch card JHT-23101..JHT-23156 — fine to refine later by
// sampling the original swatch photos.

export const JHT_CLASSICAL_COTTON = {
  'JHT-23101': { hex: '#F5F3EE', name: 'White' },
  'JHT-23102': { hex: '#BE2A7E', name: 'Magenta' },
  'JHT-23103': { hex: '#C3CE25', name: 'Lime' },
  'JHT-23104': { hex: '#C9E2DF', name: 'Pale aqua' },
  'JHT-23105': { hex: '#F3F2ED', name: 'White' },
  'JHT-23106': { hex: '#C71F2D', name: 'Red' },
  'JHT-23107': { hex: '#5BB85C', name: 'Grass green' },
  'JHT-23108': { hex: '#A9CBD8', name: 'Powder blue' },
  'JHT-23109': { hex: '#F2C200', name: 'Yellow' },
  'JHT-23110': { hex: '#C01F2E', name: 'Crimson' },
  'JHT-23111': { hex: '#8AA64E', name: 'Sage green' },
  'JHT-23112': { hex: '#6BBFB4', name: 'Teal' },
  'JHT-23113': { hex: '#F0A81E', name: 'Amber' },
  'JHT-23114': { hex: '#8E2230', name: 'Maroon' },
  'JHT-23115': { hex: '#8A8C3C', name: 'Olive' },
  'JHT-23116': { hex: '#9FA89A', name: 'Sage grey' },
  'JHT-23117': { hex: '#E07B2E', name: 'Orange' },
  'JHT-23118': { hex: '#7E2D45', name: 'Plum' },
  'JHT-23119': { hex: '#2E9E5B', name: 'Emerald' },
  'JHT-23120': { hex: '#1F7A43', name: 'Dark green' },
  'JHT-23121': { hex: '#E78A52', name: 'Coral' },
  'JHT-23122': { hex: '#C16A3A', name: 'Rust' },
  'JHT-23123': { hex: '#1E5A52', name: 'Petrol' },
  'JHT-23124': { hex: '#1B5048', name: 'Dark teal' },
  'JHT-23125': { hex: '#5BB8D6', name: 'Sky blue' },
  'JHT-23126': { hex: '#9C4A8E', name: 'Purple' },
  'JHT-23127': { hex: '#C9A96E', name: 'Tan' },
  'JHT-23128': { hex: '#9A968C', name: 'Taupe' },
  'JHT-23129': { hex: '#C2C4C2', name: 'Light grey' },
  'JHT-23130': { hex: '#6B4A9E', name: 'Violet' },
  'JHT-23131': { hex: '#ADADA8', name: 'Grey' },
  'JHT-23132': { hex: '#4A2E22', name: 'Dark brown' },
  'JHT-23133': { hex: '#1FB8C4', name: 'Turquoise' },
  'JHT-23134': { hex: '#283C82', name: 'Royal blue' },
  'JHT-23135': { hex: '#C7BD9A', name: 'Sand' },
  'JHT-23136': { hex: '#3E3E3C', name: 'Charcoal' },
  'JHT-23137': { hex: '#2D8FB0', name: 'Ocean blue' },
  'JHT-23138': { hex: '#1E2547', name: 'Dark navy' },
  'JHT-23139': { hex: '#9FA0A0', name: 'Grey' },
  'JHT-23140': { hex: '#1A1A1C', name: 'Near black' },
  'JHT-23141': { hex: '#2E7DB0', name: 'Blue' },
  'JHT-23142': { hex: '#44384E', name: 'Aubergine' },
  'JHT-23143': { hex: '#6E6E6B', name: 'Slate grey' },
  'JHT-23144': { hex: '#16161A', name: 'Black' },
  'JHT-23145': { hex: '#4A6FB0', name: 'Cornflower' },
  'JHT-23146': { hex: '#1F2E52', name: 'Navy' },
  'JHT-23147': { hex: '#8C8D8C', name: 'Grey' },
  'JHT-23148': { hex: '#111114', name: 'Black' },
  'JHT-23149': { hex: '#EAC0CC', name: 'Blush pink' },
  'JHT-23150': { hex: '#F2C21E', name: 'Gold' },
  'JHT-23151': { hex: '#E573A8', name: 'Rose pink' },
  'JHT-23152': { hex: '#F2E81E', name: 'Bright yellow' },
  'JHT-23153': { hex: '#D2202E', name: 'Red' },
  'JHT-23154': { hex: '#9B6FC4', name: 'Lavender' },
  'JHT-23155': { hex: '#B0202E', name: 'Deep red' },
  'JHT-23156': { hex: '#6B4A36', name: 'Brown' },
};

export const COLOUR_CARDS = { JHT: JHT_CLASSICAL_COTTON };

// Look up a swatch by code (case/space tolerant). Returns { hex, name } or null.
export function swatch(code) {
  const c = String(code || '').trim().toUpperCase();
  return JHT_CLASSICAL_COTTON[c] || null;
}

// Parse a stored "JHT-23101, JHT-23102, ..." string into [{ code, hex, name }].
export function parseColours(str) {
  if (!str) return [];
  return String(str)
    .split(/[,\n;]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((code) => {
      const sw = swatch(code);
      return { code, hex: sw?.hex || null, name: sw?.name || null };
    });
}

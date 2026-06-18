// lib/filterAttributes.js
// Unified FILTER attributes layer (Phase 1). UI reads this; raw fields unchanged.
// Keyword/token based so new values map automatically.

// ---------------- Colour families (TOKEN-aware: match whole tokens, not substring) ----------------
// colour_slugs are MAIN tokens, possibly compound ("x-and-y" / "x-cup-and-y-band").
// Split on "-and-" then on "-"; match a family if any keyword equals a token.
const COLOUR_FAMILIES = {
  Black:   ['black','jet','obsidian','basalt','carbon','onyx'],
  White:   ['white','eggshell','ivory','cream','overlocking'],
  Grey:    ['grey','gray','charcoal','gunmetal','graphite','slate','steel','heather','ash','smoke','melange','marle'],
  Silver:  ['silver','chrome','titanium','brushed','metallic'],
  Gold:    ['gold'],
  Blue:    ['blue','navy','teal','aqua','cyan','petrol','reflex','prussian','indigo','denim','sapphire','ocean','reef','cobalt'],
  Green:   ['green','olive','sage','lime','mint','kiwi','kelly','forest','myrtle'],
  Red:     ['red','burgundy','scarlet','cranberry','berry','maroon'],
  Orange:  ['orange'],
  Yellow:  ['yellow','mustard','canary'],
  Purple:  ['purple','mauve','lilac','lavender','plum','magenta','fuchsia','fushia','violet'],
  Pink:    ['pink','coral','peach','blush'],
  Natural: ['natural','kraft','beige','tan','stone','ecru','wood','cork','taupe','sand','khaki'],
  Brown:   ['brown','bronze','chocolate'],
  Clear:   ['clear','frosted','translucent','transparent'],
};
// Multi shown to customer; never surface "Other".
const COLOUR_MULTI_TOKENS = ['multicolour','multicoloured','multi','pms','camo','rainbow','mix'];

export function colourFamiliesOf(colourSlugs) {
  const out = new Set();
  for (const slug of colourSlugs || []) {
    for (const part of String(slug).toLowerCase().split('-and-')) {
      const toks = new Set(part.split('-').filter(Boolean));
      for (const [fam, kws] of Object.entries(COLOUR_FAMILIES)) {
        if (kws.some(kw => toks.has(kw))) out.add(fam);
      }
      if (COLOUR_MULTI_TOKENS.some(kw => toks.has(kw))) out.add('Multi');
    }
  }
  return [...out];
}

// ---------------- Decoration families (front-end: 6) ----------------
// Source = decoration_options.name (type='branding'). Exclude charges/accessories,
// then map to ONE family by priority (Transfer before Full Colour so "Digital
// Transfer" -> Transfer). Raw name keeps the granular detail in the DB.
const DECORATION_CHARGE_KW = [
  'additional','sample','polybag','kitting','fee','upload','metallic thread',
  'clip','holder','cable','puller','connector','joiner','microfibre','pouch',
  'combinations','tube','attachment','duet'
];
const DECORATION_FAMILY_ORDER = [
  ['Transfer',          ['colourflex','digiflex','transfer']],
  ['Embroidery',        ['embroidery','woven','knitted']],
  ['Laser Engraving',   ['laser','engrav']],
  ['Special',           ['pvc','resin','deboss','emboss','doming','foil','etch']],
  ['Screen / Pad Print', ['screen print','pad print','offset','puff']],
  ['Full Colour',       ['full colour','full color','digital','sublimation','uvdtf','prism','rotary']],
];
export function isDecorationCharge(name) {
  const n = String(name || '').toLowerCase();
  return DECORATION_CHARGE_KW.some(kw => n.includes(kw));
}
export function decorationFamilyOf(name) {
  if (isDecorationCharge(name)) return null;
  const n = String(name).toLowerCase();
  for (const [fam, kws] of DECORATION_FAMILY_ORDER) if (kws.some(kw => n.includes(kw))) return fam;
  return null;
}
export function decorationFamiliesOf(decorationNames) {
  const out = new Set();
  for (const name of decorationNames || []) { const f = decorationFamilyOf(name); if (f) out.add(f); }
  return [...out];
}

// ---------------- Buckets / simple maps ----------------
export function moqBucket(minQty) {
  const q = Number(minQty);
  if (!Number.isFinite(q)) return null;
  if (q <= 25) return '<=25';
  if (q <= 50) return '<=50';
  if (q <= 100) return '<=100';
  if (q <= 250) return '<=250';
  if (q <= 500) return '<=500';
  return '>500';
}

// Item price only, ex-GST. UI MUST show this note next to the Price filter.
export const PRICE_NOTE = 'Item price only, ex GST. Excludes branding/decoration, setup and freight.';
export function priceBucket(price) {
  const p = Number(price);
  if (!Number.isFinite(p)) return null;
  if (p < 2) return '<$2';
  if (p < 5) return '$2-5';
  if (p < 10) return '$5-10';
  if (p < 25) return '$10-25';
  return '$25+';
}

// Capacity: parse to ml ("5L"->5000, "500ml"->500, "1.5L"->1500). Two bucket sets.
function capacityMl(capacity) {
  const s = String(capacity || '').toLowerCase().replace(/\s/g, '');
  let m = s.match(/([\d.]+)ml/); if (m) return parseFloat(m[1]);
  m = s.match(/([\d.]+)l/);      if (m) return parseFloat(m[1]) * 1000;
  return null;
}
// Bags / Coolers -> litre buckets
export function capacityBucketBags(capacity) {
  const ml = capacityMl(capacity); if (ml == null) return null;
  const l = ml / 1000;
  if (l <= 5) return '<=5L';
  if (l <= 15) return '6-15L';
  if (l <= 25) return '16-25L';
  return '25L+';
}
// Drinkware -> ml buckets
export function capacityBucketDrinkware(capacity) {
  const ml = capacityMl(capacity); if (ml == null) return null;
  if (ml < 500) return '<500ml';
  if (ml < 750) return '500-749ml';
  if (ml <= 1000) return '750ml-1L';
  return '1L+';
}

const STOCK_TYPE = { local_stock: 'Local Stock', indent_air: 'Indent Air', indent_sea: 'Indent Sea' };
export function stockTypeOf(fulfillment) {
  return STOCK_TYPE[String(fulfillment || '').toLowerCase()] || (fulfillment ? 'Local Stock' : null);
}

// ---------------- Material families (keyword/substring, ONE family per tag, priority order) ----------------
// material_tags entries are free-ish strings; take the first family that matches.
// RPET first (recycled) and Non-Woven before Plastic so "non-woven polypropylene"
// -> Non-Woven, "recycled polyester" -> RPET (not Polyester/Plastic).
const MATERIAL_ORDER = [
  ['RPET',      ['rpet','r-pet','recycled pet','recycled polyester','recycled poly']],
  ['Non-Woven', ['non-woven','nonwoven','non woven']],
  ['Cotton',    ['cotton','calico']],
  ['Canvas',    ['canvas']],
  ['Jute',      ['jute','hessian','burlap']],
  ['Nylon',     ['nylon']],
  ['Polyester', ['polyester']],
  ['Metal',     ['metal','aluminium','aluminum','stainless','steel','tin']],
  ['Plastic',   ['plastic','polypropylene','pvc','acrylic']],
];
export function materialFamiliesOf(materialTags) {
  const out = new Set();
  for (const raw of materialTags || []) {
    const t = String(raw).toLowerCase();
    for (const [fam, kws] of MATERIAL_ORDER) {
      if (kws.some(kw => t.includes(kw))) { out.add(fam); break; }
    }
  }
  return [...out];
}

// Free-text source (product.materials, e.g. "Jute with cotton handles",
// "Recycled Polyester (rPET)"). Surfaces EVERY family mentioned (option 1),
// with precedence: recycled -> RPET (not Polyester); non-woven -> Non-Woven (not Plastic).
export function materialFamiliesFromText(text) {
  const t = String(text || '').toLowerCase();
  if (!t) return [];
  const out = new Set();
  for (const [fam, kws] of MATERIAL_ORDER) {
    if (kws.some(kw => t.includes(kw))) out.add(fam);
  }
  if (out.has('RPET')) out.delete('Polyester');
  if (out.has('Non-Woven')) out.delete('Plastic');
  return [...out];
}

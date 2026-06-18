// lib/filterAttributes.js
// Unified FILTER attributes layer (Phase 1). UI reads this; raw fields unchanged.
// Keyword/token based so new values map automatically.

// ---------------- Colour families (TOKEN-aware: match whole tokens, not substring) ----------------
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

function capacityMl(capacity) {
  const s = String(capacity || '').toLowerCase().replace(/\s/g, '');
  let m = s.match(/([\d.]+)ml/); if (m) return parseFloat(m[1]);
  m = s.match(/([\d.]+)l/);      if (m) return parseFloat(m[1]) * 1000;
  return null;
}
export function capacityBucketBags(capacity) {
  const ml = capacityMl(capacity); if (ml == null) return null;
  const l = ml / 1000;
  if (l <= 5) return '<=5L';
  if (l <= 15) return '6-15L';
  if (l <= 25) return '16-25L';
  return '25L+';
}
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

// ---------------- Material families ----------------
// Tag source (material_tags): ONE family per tag, first match by priority order.
const MATERIAL_ORDER = [
  ['RPET',            ['rpet','r-pet','recycled pet','recycled polyester','recycled poly']],
  ['Non-Woven',       ['non-woven','nonwoven','non woven']],
  ['Stainless Steel', ['stainless']],
  ['Aluminium',       ['alumini','aluminum']],
  ['Tritan',          ['tritan']],
  ['Glass',           ['glass','borosilicate']],
  ['Ceramic',         ['ceramic','porcelain','stoneware','earthenware']],
  ['Bamboo',          ['bamboo']],
  ['Silicone',        ['silicone']],
  ['Cotton',          ['cotton','calico']],
  ['Canvas',          ['canvas']],
  ['Jute',            ['jute','hessian','burlap']],
  ['Nylon',           ['nylon']],
  ['Wool',            ['wool','merino']],
  ['Polyester',       ['polyester']],
  ['Wood',            ['wood','timber','cork','beech','birch']],
  ['Metal',           ['metal','steel','tin','iron','zinc','copper']],
  ['Plastic',         ['plastic','polypropylene','pvc','acrylic']],
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

// Free-text source: product.materials AND product.name. Surfaces EVERY family
// mentioned (option 1), word-boundary regex. Precedence: recycled->RPET (not
// Polyester); non-woven->Non-Woven (not Plastic); stainless/alu/tritan suppress
// generic Metal/Plastic. "Juco" = jute+cotton blend -> both.
const MATERIAL_TEXT = [
  ['RPET',            /\brpet\b|\br-pet\b|recycled\s+pet|recycled\s+poly\w*/],
  ['Non-Woven',       /\bnon[-\s]?woven\b/],
  ['Stainless Steel', /\bstainless\b/],
  ['Aluminium',       /\balumini\w*\b|\baluminum\b/],
  ['Tritan',          /\btritan\b/],
  ['Glass',           /\bglass\b|\bborosilicate\b/],
  ['Ceramic',         /\bceramic\b|\bporcelain\b|\bstoneware\b|\bearthenware\b/],
  ['Bamboo',          /\bbamboo\b/],
  ['Silicone',        /\bsilicone\b/],
  ['Cotton',          /\bcotton\b|\bcalico\b|\bjuco\b/],
  ['Canvas',          /\bcanvas\b/],
  ['Jute',            /\bjute\b|\bhessian\b|\bburlap\b|\bjuco\b/],
  ['Nylon',           /\bnylon\b/],
  ['Wool',            /\bwool\b|\bmerino\b/],
  ['Polyester',       /\bpoly(ester)?\b/],
  ['Wood',            /\bwood(en)?\b|\btimber\b|\bbeech\b|\bbirch\b/],
  ['Metal',           /\bmetal\b|\bsteel\b|\btin\b|\biron\b|\bzinc\b|\bcopper\b/],
  ['Plastic',         /\bplastic\b|\bpolypropylene\b|\bpvc\b|\bacrylic\b/],
];
export function materialFamiliesFromText(text) {
  const t = String(text || '').toLowerCase();
  if (!t) return [];
  const out = new Set();
  for (const [fam, re] of MATERIAL_TEXT) if (re.test(t)) out.add(fam);
  if (out.has('RPET')) out.delete('Polyester');
  if (out.has('Non-Woven')) out.delete('Plastic');
  if (out.has('Stainless Steel')) out.delete('Metal');
  if (out.has('Aluminium')) out.delete('Metal');
  if (out.has('Tritan')) out.delete('Plastic');
  return [...out];
}

// ---------------- BPA Free (drinkware) ----------------
// True if text explicitly says "BPA free", OR the item is an inherently BPA-free
// material (steel/glass/ceramic/Tritan/bamboo/silicone). Generic plastic & aluminium
// are NOT auto-claimed (liners/resins vary) unless the copy states BPA-free.
const BPA_FREE_MATERIALS = ['Stainless Steel','Glass','Ceramic','Tritan','Bamboo','Silicone'];
export function isBpaFreeText(text) {
  const t = String(text || '').toLowerCase();
  if (!t) return false;
  if (/bpa[\s-]?free/.test(t)) return true;
  return materialFamiliesFromText(t).some(f => BPA_FREE_MATERIALS.includes(f));
}

// ---------------- Gender / For (apparel) ----------------
// Derived from name + subcategory keywords. \bmen\b does NOT match "women" (no boundary).
const GENDER_TEXT = [
  ['Women',  /\bwomen\b|\bwoman\b|\bwomens\b|\bladies\b|\bfemale\b|\bgirls?\b/],
  ['Men',    /\bmen\b|\bmens\b|\bmale\b|\bboys?\b/],
  ['Kids',   /\bkids?\b|\bchild\b|\bchildren\b|\byouth\b|\btoddlers?\b|\binfant\b|\bbaby\b/],
  ['Unisex', /\bunisex\b/],
];
export function gendersFromText(text) {
  const t = String(text || '').toLowerCase();
  if (!t) return [];
  const out = new Set();
  for (const [g, re] of GENDER_TEXT) if (re.test(t)) out.add(g);
  return [...out];
}

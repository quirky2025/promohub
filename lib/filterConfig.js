// lib/filterConfig.js
// Which facets each category shows + how to get a product's facet value(s).
// p = product with raw fields + page-precomputed p._price and p._decorationNames.
import {
  colourFamiliesOf, decorationFamiliesOf, moqBucket, priceBucket,
  capacityBucketBags, capacityBucketDrinkware, materialFamiliesOf,
  materialFamiliesFromText, materialPrimaryFromText, primaryBottleMaterial, isBpaFreeText, gendersFromText, stockTypeOf,
} from './filterAttributes.js';

const arr = v => (v == null || v === '') ? [] : [v];
function inkColours(v) {
  if (!v) return [];
  if (/multi|\||\bor\b/i.test(v)) return ['Multi'];
  return [v];
}
const matText = p => `${p.name || ''} ${p.materials || ''}`;

// DRINKWARE: only true bottle-body materials count. Whitelist (not blacklist) so
// accessory materials (silicone seal, PP/metal lid, polyester strap, jute/cotton
// sleeve) never show on drinkware -- only the bottle itself.
const DRINKWARE_BOTTLE = ['Stainless Steel','Aluminium','Glass','Tritan','Ceramic','Polypropylene','Bamboo','RPET'];
const materialBase = p => [...new Set([
  ...materialPrimaryFromText(p.materials),
  ...materialFamiliesFromText(p.name),
  ...materialFamiliesOf(p.material_tags),
])];

// facet = { key, label, isType?, order?, noThin?, get:(p)=>string[] }
// ---- Global facets (every category) ----
const colour   = { key: 'colour',   label: 'Colour',            get: p => colourFamiliesOf(p.colour_slugs) };
const price    = { key: 'price',    label: 'Price',             order: ['<$1','$1-2','$2-5','$5-10','$10-25','$25+'], get: p => arr(priceBucket(p._price)) };
const moq      = { key: 'moq',      label: 'Min Qty',           order: ['<=25','<=50','<=100','<=250','<=500','>500'], get: p => arr(moqBucket(p.min_qty)) };
const HIDE_BRANDS = new Set(['Intex', 'IntexGlobal']); // 供应商,不作为消费者品牌展示
const brand    = { key: 'brand',    label: 'Brand',             get: p => arr(p.brand).filter(b => b && !HIDE_BRANDS.has(b)) };
const branding = { key: 'branding', label: 'Branding',          get: p => decorationFamiliesOf(p._decorationNames) };
const stock    = { key: 'stock',    label: 'Stock / Lead time', noThin: true, get: p => arr(stockTypeOf(p.fulfillment)) };
const eco      = { key: 'eco',      label: 'Eco',               noThin: true, get: p => p.is_eco ? ['Eco / Sustainable'] : [] };

// Material — global, but Drinkware uses a variant that drops textile accessories.
const material   = { key: 'material', label: 'Material', get: materialBase };
const materialDw = { key: 'material', label: 'Material', get: p => primaryBottleMaterial(p.materials, p.name, DRINKWARE_BOTTLE) };

// PENS: Material facet = BARREL material only (TAXONOMY_V2 §2.6). Silicone on
// pens is almost always the stylus TIP component, not the barrel — showing it
// in the Material facet misleads buyers. Component materials excluded here at
// the facet layer (product data untouched; collection rules use material_tags
// and are unaffected).
const PEN_COMPONENT_MATERIALS = new Set(['Silicone']);
const materialPens = { key: 'material', label: 'Material', get: p => materialBase(p).filter(m => !PEN_COMPONENT_MATERIALS.has(m)) };

export const GLOBAL = [colour, price, moq, brand, branding, stock, eco]; // material appended per-category in facetsFor

// ---- Category-specific facets ----
const bagType    = { key: 'bagType',   label: 'Bag Type',   isType: true, get: p => arr(p.subcategory) };
const capacity   = { key: 'capacity',  label: 'Capacity',   order: ['<=5L','6-15L','16-25L','25L+'], get: p => arr(capacityBucketBags(p.capacity)) };
const capacityDw = { key: 'capacity',  label: 'Capacity',   order: ['<500ml','500-749ml','750ml-1L','1L+'], get: p => arr(capacityBucketDrinkware(p.capacity)) };
const bpaFree    = { key: 'bpaFree',   label: 'Safety',     noThin: true, get: p => isBpaFreeText(matText(p)) ? ['BPA Free'] : [] };
const penType    = { key: 'penType',   label: 'Pen Type',   isType: true, get: p => arr(p.subcategory) };
const mechanism  = { key: 'mechanism', label: 'Mechanism',  get: p => arr(p.pen_mechanism) };
const inkColour  = { key: 'inkColour', label: 'Ink Colour', get: p => inkColours(p.pen_ink_colour) };
const gender     = { key: 'gender',    label: 'Gender',     get: p => { const g = gendersFromText(`${p.name || ''} ${p.subcategory || ''}`); return g.length ? g : ['Unisex']; } };

export const CATEGORY = {
  Bags:      [bagType, capacity],
  Drinkware: [capacityDw, bpaFree],
  Pens:      [penType, mechanism, inkColour],
  Apparel:   [gender],
};

// includeType=false on subcategory pages (the "type" facet == current page).
export function facetsFor(category, { includeType = true } = {}) {
  const mat = category === 'Drinkware' ? materialDw
    : category === 'Pens' ? materialPens // barrel materials only (§2.6)
    : material;
  const catFacets = CATEGORY[category] || [];
  const genderFacet = catFacets.filter(f => f.key === 'gender'); // Apparel only
  const otherCat = catFacets.filter(f => f.key !== 'gender');    // type facets (bagType, penType, capacity…)
  // Pin Gender + Material to the top of the sidebar, then global facets, then type facets.
  const all = [...genderFacet, mat, ...GLOBAL, ...otherCat];
  return includeType ? all : all.filter(f => !f.isType);
}

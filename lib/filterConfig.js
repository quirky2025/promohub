// lib/filterConfig.js
// Which facets each category shows + how to get a product's facet value(s).
// p = product with raw fields + page-precomputed p._price and p._decorationNames.
import {
  colourFamiliesOf, decorationFamiliesOf, moqBucket, priceBucket,
  capacityBucketBags, capacityBucketDrinkware, materialFamiliesOf,
  materialFamiliesFromText, materialPrimaryFromText, isBpaFreeText, gendersFromText, stockTypeOf,
} from './filterAttributes.js';

const arr = v => (v == null || v === '') ? [] : [v];
function inkColours(v) {
  if (!v) return [];
  if (/multi|\||\bor\b/i.test(v)) return ['Multi'];
  return [v];
}
const matText = p => `${p.name || ''} ${p.materials || ''}`;

// facet = { key, label, isType?, order?, noThin?, get:(p)=>string[] }
// ---- Global facets (every category) ----
const colour   = { key: 'colour',   label: 'Colour',            get: p => colourFamiliesOf(p.colour_slugs) };
const price    = { key: 'price',    label: 'Price',             order: ['<$2','$2-5','$5-10','$10-25','$25+'], get: p => arr(priceBucket(p._price)) };
const moq      = { key: 'moq',      label: 'Min Qty',           order: ['<=25','<=50','<=100','<=250','<=500','>500'], get: p => arr(moqBucket(p.min_qty)) };
const brand    = { key: 'brand',    label: 'Brand',             get: p => arr(p.brand) };
const branding = { key: 'branding', label: 'Branding',          get: p => decorationFamiliesOf(p._decorationNames) };
const stock    = { key: 'stock',    label: 'Stock / Lead time', noThin: true, get: p => arr(stockTypeOf(p.fulfillment)) };
const eco      = { key: 'eco',      label: 'Eco',               noThin: true, get: p => p.is_eco ? ['Eco / Sustainable'] : [] };
const material = { key: 'material', label: 'Material',          get: p => [...new Set([...materialPrimaryFromText(p.materials), ...materialFamiliesFromText(p.name), ...materialFamiliesOf(p.material_tags)])] };

export const GLOBAL = [colour, price, moq, brand, branding, stock, eco, material];

// ---- Category-specific facets ----
const bagType    = { key: 'bagType',   label: 'Bag Type',   isType: true, get: p => arr(p.subcategory) };
const capacity   = { key: 'capacity',  label: 'Capacity',   order: ['<=5L','6-15L','16-25L','25L+'], get: p => arr(capacityBucketBags(p.capacity)) };
const capacityDw = { key: 'capacity',  label: 'Capacity',   order: ['<500ml','500-749ml','750ml-1L','1L+'], get: p => arr(capacityBucketDrinkware(p.capacity)) };
const bpaFree    = { key: 'bpaFree',   label: 'Safety',     noThin: true, get: p => isBpaFreeText(matText(p)) ? ['BPA Free'] : [] };
const penType    = { key: 'penType',   label: 'Pen Type',   isType: true, get: p => arr(p.subcategory) };
const mechanism  = { key: 'mechanism', label: 'Mechanism',  get: p => arr(p.pen_mechanism) };
const inkColour  = { key: 'inkColour', label: 'Ink Colour', get: p => inkColours(p.pen_ink_colour) };
const gender     = { key: 'gender',    label: 'Gender',     get: p => gendersFromText(`${p.name || ''} ${p.subcategory || ''}`) };

export const CATEGORY = {
  Bags:      [bagType, capacity],
  Drinkware: [capacityDw, bpaFree],
  Pens:      [penType, mechanism, inkColour],
  Apparel:   [gender],
};

// includeType=false on subcategory pages (the "type" facet == current page).
export function facetsFor(category, { includeType = true } = {}) {
  const all = [...GLOBAL, ...(CATEGORY[category] || [])];
  return includeType ? all : all.filter(f => !f.isType);
}

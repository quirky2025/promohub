// lib/smartCollections.js — D8 Collections Manager rule engine.
// Membership = rule hits + pinned − excluded. Nothing is stored as a static list.
// Used by: admin preview/publish (service client) AND the public collection page
// (anon client) — pass the supabase client in.
//
// NOTE: no imports from lib/urlPages.js (it imports us — keep this one-directional).

import { calculatorFromPrice } from '@/lib/decorationPricing';
import { materialFamiliesOf, materialFamiliesFromText, materialPrimaryFromText } from '@/lib/filterAttributes';
import { productMaterialFacetValues } from '@/lib/filterConfig';

// A product's material FAMILIES (all mentioned) — used for the admin options list.
export function productMaterialFamilies(p) {
  return [...new Set([
    ...materialPrimaryFromText(p?.materials),
    ...materialFamiliesFromText(p?.name),
    ...materialFamiliesOf(p?.material_tags),
  ])];
}

// Same field set the category pages select — cards + filters render identically.
export const COLLECTION_PRODUCT_SELECT = `
  id,
  name,
  slug,
  category,
  subcategory,
  brand,
  min_qty,
  is_eco,
  is_published,
  product_colours ( id, name, hex, images, sort_order ),
  supplier_sku, decoration_model, supplier, colour_slugs, fulfillment, capacity, pen_mechanism, pen_ink_colour, material_tags, materials, pricing_tiers ( min_qty, base_price ), decoration_options ( name, type )
`;

// Card "From $X" price — cheapest tier × 1.4 (matches lib/urlPages.getLowestPrice default).
function fromPrice(product) {
  if (product?.decoration_model === 'calculator') return calculatorFromPrice(product) || 0;
  if (!product?.pricing_tiers?.length) return 0;
  const values = product.pricing_tiers
    .map(t => Number.parseFloat(t.base_price))
    .filter(v => Number.isFinite(v));
  return values.length ? Math.min(...values) * 1.4 : 0;
}

const arr = (v) => (Array.isArray(v) ? v.filter(Boolean) : []);
const num = (v) => (v === null || v === undefined || v === '' ? null : Number(v));

export function normalizeRules(rules) {
  const r = rules || {};
  return {
    category: arr(r.category),
    subcategory: arr(r.subcategory),
    brand: arr(r.brand),
    supplier: arr(r.supplier),
    colours: arr(r.colours),
    material_tags: arr(r.material_tags),
    decoration_model: arr(r.decoration_model),
    print_methods: arr(r.print_methods),
    price_min: num(r.price_min),
    price_max: num(r.price_max),
    min_qty_max: num(r.min_qty_max),
    is_eco: r.is_eco === true,
  };
}

function hasAnyRule(r) {
  return (
    r.category.length || r.subcategory.length || r.brand.length || r.supplier.length ||
    r.colours.length || r.material_tags.length || r.decoration_model.length ||
    r.print_methods.length || r.price_min !== null || r.price_max !== null ||
    r.min_qty_max !== null || r.is_eco
  );
}

// jsonb "contains ANY of" — OR of contains filters (same pattern the public
// collections page uses; values come from our own DB, no commas/parens).
function orContains(column, values) {
  return values.map(v => `${column}.cs.${JSON.stringify([v])}`).join(',');
}

async function fetchRuleHits(db, r, limit) {
  if (!hasAnyRule(r)) return []; // no rules = empty (never "every product")

  let q = db
    .from('products')
    .select(COLLECTION_PRODUCT_SELECT)
    .eq('is_published', true)
    .order('name')
    .limit(limit);

  if (r.category.length) q = q.in('category', r.category);
  if (r.subcategory.length) q = q.in('subcategory', r.subcategory);
  if (r.brand.length) q = q.in('brand', r.brand);
  if (r.supplier.length) q = q.in('supplier', r.supplier);
  if (r.decoration_model.length) q = q.in('decoration_model', r.decoration_model);
  if (r.is_eco) q = q.eq('is_eco', true);
  if (r.min_qty_max !== null) q = q.lte('min_qty', r.min_qty_max);
  if (r.colours.length) q = q.or(orContains('colour_slugs', r.colours));

  const { data, error } = await q;
  if (error) {
    console.error('[smart_collections] rule query failed', error);
    return [];
  }

  // Post-filters that PostgREST can't express cheaply:
  let hits = data || [];
  if (r.material_tags.length) {
    // Material rule matches EXACTLY like the sidebar Material filter for the
    // product's category (Pens = barrel material only, §2.6) — so a collection
    // and the filter can never disagree.
    const wanted = new Set(r.material_tags.map(m => String(m).toLowerCase()));
    hits = hits.filter(p => (productMaterialFacetValues(p, p.category) || [])
      .some(f => wanted.has(String(f).toLowerCase())));
  }
  if (r.price_min !== null || r.price_max !== null) {
    hits = hits.filter(p => {
      const price = fromPrice(p);
      if (price <= 0) return false;
      if (r.price_min !== null && price < r.price_min) return false;
      if (r.price_max !== null && price > r.price_max) return false;
      return true;
    });
  }
  if (r.print_methods.length) {
    const wanted = r.print_methods.map(m => m.toLowerCase());
    hits = hits.filter(p => {
      const names = (p.decoration_options || []).filter(d => d.type !== 'addon').map(d => (d.name || '').toLowerCase());
      return wanted.some(w => names.some(n => n.includes(w)));
    });
  }
  return hits;
}

// → { products (pinned first, then A–Z), count }
export async function resolveCollectionProducts(db, collection, { limit = 1000 } = {}) {
  const r = normalizeRules(collection?.rules);
  const pinnedIds = arr(collection?.pinned);
  const excludedIds = new Set(arr(collection?.excluded));

  const hits = await fetchRuleHits(db, r, limit);
  const byId = new Map(hits.map(p => [p.id, p]));

  // Pinned products count as members even when outside the rules — fetch missing ones.
  const missingPinned = pinnedIds.filter(id => !byId.has(id) && !excludedIds.has(id));
  if (missingPinned.length) {
    const { data } = await db
      .from('products')
      .select(COLLECTION_PRODUCT_SELECT)
      .eq('is_published', true)
      .in('id', missingPinned);
    (data || []).forEach(p => byId.set(p.id, p));
  }

  excludedIds.forEach(id => byId.delete(id));

  const pinnedSet = new Set(pinnedIds);
  const pinned = pinnedIds.map(id => byId.get(id)).filter(Boolean);
  const rest = [...byId.values()]
    .filter(p => !pinnedSet.has(p.id))
    .sort((a, b) => (a.name || '').localeCompare(b.name || ''));

  const products = [...pinned, ...rest];
  return { products, count: products.length };
}

// Published material/attribute collections for a category — powers the
// "Shop by material" entry points on category pages (TAXONOMY_V2 step 4).
export async function getMaterialCollections(db, category) {
  if (!category) return [];
  const { data, error } = await db
    .from('smart_collections')
    .select('name, slug, ctype, rules')
    .eq('status', 'published')
    .eq('ctype', 'attribute')
    .order('name');
  if (error) return [];
  return (data || [])
    .filter(c => (c.rules?.category || []).includes(category))
    .map(c => ({ label: c.name, href: `/${c.slug}` }));
}

// Rows for the materialised collection_products map (feeds PDP "Also Found In").
export function membershipRows(collectionId, products, pinnedIds) {
  const order = new Map((pinnedIds || []).map((id, i) => [id, i]));
  return products.map(p => ({
    collection_id: collectionId,
    product_id: p.id,
    pinned_order: order.has(p.id) ? order.get(p.id) : null,
  }));
}

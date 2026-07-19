// lib/alsoFoundIn.js — D9 · PDP "Also found in" internal-link block
// (PDP_ALSO_FOUND_IN_SPEC.md). Links a product to the collection pages it
// belongs to, computed from product fields. Live + indexable pages only.
// Priority: scenario collections > colour pages > subcategory page > eco > brand.
// Cap 6–8 chips. Scenario membership comes from the MATERIALISED map
// (collection_products, built by the D8 publish step) — no rule runs per request.

import { supabase } from '@/lib/supabase';

const MAX_LINKS = 8;

// Brand pages use the legacy slug convention (see Nav.jsx legacySlug)
function brandSlug(name) {
  return (name || '').toLowerCase()
    .replace(/ & /g, '-and-')
    .replace(/&/g, 'and')
    .replace(/ /g, '-');
}

export async function getAlsoFoundIn(product) {
  if (!product?.id) return [];
  const links = [];
  const seen = new Set();
  const push = (label, href) => {
    if (!href || !label || seen.has(href) || links.length >= MAX_LINKS) return;
    seen.add(href);
    links.push({ label, href });
  };

  try {
    // 1) Scenario collections (published smart collections containing this product).
    //    Published collections are guaranteed ≥4 products (publish gate).
    const { data: colRows } = await supabase
      .from('collection_products')
      .select('smart_collections!inner(name, slug, status)')
      .eq('product_id', product.id)
      .eq('smart_collections.status', 'published')
      .limit(10);
    (colRows || []).forEach(r => {
      const c = r.smart_collections;
      if (c?.slug) push(c.name || c.slug, `/${c.slug}`);
    });

    // 2–4) url_pages in this product's category: colour collections, its
    //      subcategory page, and the eco compound page. One query, classified here.
    if (product.category) {
      const { data: pages } = await supabase
        .from('url_pages')
        .select('slug, canonical_url, nav_label, h1, product_filter, noindex')
        .eq('status', 'live')
        .eq('product_filter->>category', product.category)
        .or('noindex.is.null,noindex.eq.false')
        .limit(200);

      const rows = pages || [];
      const label = (p) => p.nav_label || p.h1 || p.slug;
      const href = (p) => p.canonical_url || `/${p.slug}`;
      const colourSlugs = Array.isArray(product.colour_slugs) ? product.colour_slugs : [];

      // colour collection pages this product's colours hit
      rows
        .filter(p => p.product_filter?.type === 'colour_category'
          && colourSlugs.includes(p.product_filter.colour_slug)
          && (!p.product_filter.subcategory || p.product_filter.subcategory === product.subcategory))
        .slice(0, 3)
        .forEach(p => push(label(p), href(p)));

      // its subcategory page
      rows
        .filter(p => p.product_filter?.type === 'subcategory'
          && p.product_filter.subcategory === product.subcategory)
        .slice(0, 1)
        .forEach(p => push(label(p), href(p)));

      // eco page for this category (compound is_eco), else the global eco range
      if (product.is_eco) {
        const eco = rows.find(p => p.product_filter?.type === 'compound' && p.product_filter.is_eco === true);
        if (eco) push(label(eco), href(eco));
        else push('Eco Range', '/sustainability');
      }
    }

    // 5) brand page (auto-generated from products, always resolvable when brand set)
    if (product.brand) push(product.brand, `/brands/${brandSlug(product.brand)}`);
  } catch (e) {
    console.error('[alsoFoundIn] failed for product', product?.slug, e);
  }

  return links;
}

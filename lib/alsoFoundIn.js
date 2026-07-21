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
    // 1) Published smart collections containing this product, bucketed by ctype.
    //    IA 六型优先级:scenario > colour > material > 子类目页 > brand > attribute
    //    (colour/material/brand/attribute 集合与同名 url_pages 来源在各自档位合流)。
    const { data: colRows } = await supabase
      .from('collection_products')
      .select('smart_collections!inner(name, slug, status, ctype)')
      .eq('product_id', product.id)
      .eq('smart_collections.status', 'published')
      .limit(20);
    const byType = { scenario: [], colour: [], material: [], industry: [], brand: [], attribute: [] };
    (colRows || []).forEach(r => {
      const c = r.smart_collections;
      if (c?.slug) (byType[c.ctype] || byType.attribute).push({ label: c.name || c.slug, href: `/${c.slug}` });
    });
    byType.scenario.forEach(l => push(l.label, l.href));
    byType.industry.forEach(l => push(l.label, l.href));
    byType.colour.forEach(l => push(l.label, l.href));

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

      // material collections (after colour, before subcategory — IA priority)
      byType.material.forEach(l => push(l.label, l.href));

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

    // 5) brand collections + brand page, then attribute collections (lowest priority)
    byType.brand.forEach(l => push(l.label, l.href));
    if (product.brand) push(product.brand, `/brands/${brandSlug(product.brand)}`);
    byType.attribute.forEach(l => push(l.label, l.href));
  } catch (e) {
    console.error('[alsoFoundIn] failed for product', product?.slug, e);
  }

  return links;
}

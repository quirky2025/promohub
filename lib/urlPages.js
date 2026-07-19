import { cache } from 'react';
import { supabase } from '@/lib/supabase';
import { resolveCollectionProducts } from '@/lib/smartCollections';

export const RESERVED_TOP_LEVEL_SLUGS = new Set([
  'about',
  'account',
  'admin',
  'api',
  'artwork',
  'best-sellers',
  'blog',
  'brands',
  'cart',
  'catalog',
  'category',
  'collections',
  'contact',
  'eco',
  'faq',
  'indent',
  'new-arrivals',
  'order-confirmation',
  'place-order',
  'privacy',
  'products',
  'refund-return',
  'resources',
  'reviews',
  'sale',
  'sales-terms',
  'search',
  'services',
  'supply-chain',
  'sustainability',
  'testimonials',
  'track-order',
  'upload',
  'website-terms',
]);

export const PRODUCT_SELECT = `
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

const CHILD_PAGE_ORDER = {
  'custom-drinkware-australia': [
    'custom-drink-bottles-australia',
    'custom-coffee-cups-australia',
    'custom-travel-mugs-australia',
    'custom-tumblers-australia',
    'custom-mugs-australia',
    'branded-glassware-australia',
    'custom-flasks-australia',
    'custom-teaware-australia',
  ],
  'branded-barware-australia': [
    'custom-coasters-australia',
    'custom-bottle-openers-australia',
    'custom-stubby-holders-australia',
    'custom-bar-mats-australia',
    'branded-wine-accessories-australia',
    'bar-accessories-australia',
  ],
  'branded-pens-australia': [
    'custom-ballpoint-pens-australia',
    'custom-metal-pens-australia',
    'custom-plastic-pens-australia',
    'custom-stylus-pens-australia',
    'custom-highlighters-australia',
    'custom-markers-australia',
    'eco-pens-australia',
    'custom-pencils-australia',
    'pen-presentation-australia',
  ],
  'custom-bags-australia': [
    'custom-tote-bags-australia',
    'custom-cotton-tote-bags-australia',
    'custom-cooler-bags-australia',
    'custom-backpacks-australia',
    'custom-paper-bags-australia',
    'custom-drawstring-bags-australia',
    'custom-duffle-bags-australia',
    'custom-toiletry-bags-australia',
    'jute-bags-australia',
    'custom-laptop-bags-australia',
    'wine-carriers-australia',
    'crossbody-bags-australia',
    'satchel-bags-australia',
    'dry-bags-australia',
  ],
  'branded-travel-accessories-australia': [
    'custom-luggage-tags-australia',
    'passport-holders-australia',
    'travel-wallets-australia',
    'travel-pillows-australia',
    'travel-accessories-australia',
  ],
  'custom-branded-apparel-australia': [
    'custom-t-shirts-australia',
    'custom-polo-shirts-australia',
    'custom-hoodies-australia',
    'custom-sweatshirts-australia',
    'custom-jackets-australia',
    'custom-shirts-australia',
    'custom-vests-australia',
    'workwear-pants-and-shorts-australia',
    'branded-workwear-australia',
    'custom-teamwear-australia',
    'custom-aprons-australia',
    'custom-socks-australia',
    'branded-scarves-and-accessories-australia',
    'branded-apparel-accessories-australia',
  ],
  'custom-headwear-australia': [
    'custom-caps-australia',
    'custom-beanies-australia',
    'custom-bucket-hats-australia',
    'custom-wide-brim-hats-australia',
    'straw-hats-australia',
    'custom-visors-australia',
    'novelty-headwear-australia',
  ],
  'corporate-tech-gifts-australia': [
    'custom-power-banks-australia',
    'custom-bluetooth-speakers-australia',
    'custom-earbuds-australia',
    'custom-charging-cables-australia',
    'wireless-chargers-australia',
    'custom-phone-accessories-australia',
    'custom-usb-drives-australia',
    'tech-accessories-australia',
  ],
  'branded-tools-and-car-accessories-australia': [
    'custom-multi-tools-australia',
    'custom-tape-measures-australia',
    'custom-torches-australia',
    'tool-sets-australia',
    'car-accessories-australia',
  ],
  'branded-office-supplies-australia': [
    'branded-notebooks-australia',
    'custom-note-pads-australia',
    'custom-planners-australia',
    'custom-sticky-notes-australia',
    'custom-stationery-australia',
    'desk-accessories-australia',
    'custom-compendiums-australia',
    'custom-pencil-cases-australia',
    'custom-rulers-australia',
  ],
  'custom-packaging-australia': [
    'custom-gift-boxes-australia',
    'custom-gift-bags-australia',
    'gift-tubes-australia',
    'custom-pouches-australia',
    'custom-tissue-paper-australia',
    'ribbons-and-gift-tags-australia',
    'greeting-cards-australia',
  ],
  'branded-homewares-australia': [
    'custom-kitchenware-australia',
    'cheese-boards-australia',
    'promotional-home-decor-australia',
    'candles-and-diffusers-australia',
  ],
  'outdoor-promotional-products-australia': [
    'promotional-sports-products-australia',
    'custom-golf-products-australia',
    'custom-umbrellas-australia',
    'custom-towels-australia',
    'camping-gear-australia',
    'picnic-and-bbq-australia',
    'custom-sunglasses-australia',
    'picnic-blankets-australia',
    'custom-supporter-gear-australia',
  ],
  'branded-personal-care-products-australia': [
    'custom-lip-balm-australia',
    'custom-hand-sanitiser-australia',
    'custom-face-masks-australia',
    'sunscreen-australia',
    'first-aid-kits-australia',
    'manicure-sets-australia',
    'compact-mirrors-australia',
    'bath-and-body-gifts-australia',
    'grooming-products-australia',
  ],
  'custom-keyrings-australia': [
    'custom-metal-keyrings-australia',
    'leather-keyrings-australia',
    'silicone-keyrings-australia',
    'eco-keyrings-australia',
    'functional-keyrings-australia',
    'novelty-keyrings-australia',
  ],
};

export function isReservedSlug(slug) {
  return RESERVED_TOP_LEVEL_SLUGS.has(slug);
}

async function _getLiveUrlPageRaw(slug) {
  if (!slug || slug.includes('/') || isReservedSlug(slug)) return null;

  const { data, error } = await supabase
    .from('url_pages')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'live')
    .maybeSingle();

  if (error) {
    console.error('[url_pages] failed to load slug:', slug, error);
    return null;
  }

  return data || null;
}

export async function getLiveChildUrlPages(parentSlug) {
  if (!parentSlug) return [];

  const { data, error } = await supabase
    .from('url_pages')
    .select('*')
    .eq('breadcrumb_parent', parentSlug)
    .eq('status', 'live')
    .order('priority', { ascending: true })
    .order('nav_label', { ascending: true });

  if (error) {
    console.error('[url_pages] failed to load children for:', parentSlug, error);
    return [];
  }

  return sortChildPages(parentSlug, data || []);
}

export async function getProductsForUrlPage(urlPage, limit = 96) {
  const productFilter = urlPage?.product_filter || {};

  // D8 smart collections: membership resolved LIVE from the collection's rules
  // (+pinned −excluded), so newly imported products that match appear with no
  // manual step. Pinned products come first.
  if (productFilter.type === 'smart_collection') {
    const { data: col, error } = await supabase
      .from('smart_collections')
      .select('*')
      .eq('slug', productFilter.collection_slug || urlPage.slug)
      .eq('status', 'published')
      .maybeSingle();
    if (error) {
      console.error('[url_pages] smart collection load failed:', urlPage?.slug, error);
      return { products: [], count: 0, error, unsupported: false };
    }
    if (!col) return { products: [], count: 0, error: null, unsupported: true };
    const { products, count } = await resolveCollectionProducts(supabase, col, { limit: 1000 });
    return { products: products.slice(0, limit), count, error: null, unsupported: false };
  }

  let query = supabase
    .from('products')
    .select(PRODUCT_SELECT, { count: 'exact' })
    .eq('is_published', true)
    .order('name')
    .limit(limit);

  query = applyProductFilter(query, productFilter);
  if (!query) return { products: [], count: 0, error: null, unsupported: true };

  const { data, error, count } = await query;

  if (error) {
    console.error('[url_pages] product filter failed:', urlPage?.slug, error);
    return { products: [], count: 0, error, unsupported: false };
  }

  return { products: data || [], count: count ?? 0, error: null, unsupported: false };
}

export function applyProductFilter(query, productFilter) {
  const type = productFilter?.type;

  if (type === 'category') {
    return query.eq('category', productFilter.category);
  }

  // 跨分类集合页:纯靠 extra_subcategories 标签匹配(产品主户口在别处也能在此货架出现)。
  // 复用于 Pen Gift Sets、Trade Show 等 collection。
  if (type === 'collection') {
    if (!productFilter.tag) return null;
    return query.contains('extra_subcategories', JSON.stringify([productFilter.tag]));
  }

  if (type === 'subcategory') {
    return query
      .eq('category', productFilter.category)
      .eq('subcategory', productFilter.subcategory);
  }

  // #5 colour collection pages: products in a category (optional subcategory)
  // that are available in a given colour. colour_slug must match the SSOT token
  // stored in products.colour_slugs (slugify(cleanColour(name).name)).
  if (type === 'colour_category') {
    query = query.eq('category', productFilter.category);
    if (productFilter.subcategory) {
      query = query.eq('subcategory', productFilter.subcategory);
    }
    if (!productFilter.colour_slug) return null;
    return query.contains('colour_slugs', [productFilter.colour_slug]);
  }

  if (type === 'compound') {
    query = query.eq('category', productFilter.category);

    if (productFilter.subcategory) {
      query = query.eq('subcategory', productFilter.subcategory);
    }

    if (productFilter.material) {
      return query.contains('material_tags', [String(productFilter.material).toLowerCase()]);
    }

    if (Array.isArray(productFilter.tags) && productFilter.tags.length > 0) {
      return query.overlaps('tags', productFilter.tags.map((tag) => String(tag).toLowerCase()));
    }

    if (productFilter.is_eco === true) {
      return query.eq('is_eco', true);
    }

    return null;
  }

  if (type === 'kit_collection') {
    query = query.in('offer_type', productFilter.offer_types || []);
    if (productFilter.include_all_kit_candidates) return query;
    return query.overlaps('kit_themes', productFilter.kit_themes || []);
  }

  if (type === 'kit_template') {
    return query
      .in('offer_type', productFilter.offer_types || [])
      .overlaps('kit_themes', productFilter.kit_themes || []);
  }

  if (type === 'australian_made') {
    query = query.eq('is_australian_made', true);
    if (productFilter.category) query = query.eq('category', productFilter.category);
    return query;
  }

  return null;
}

function sortChildPages(parentSlug, childPages) {
  const order = CHILD_PAGE_ORDER[parentSlug];
  if (!order) return childPages;

  const rank = new Map(order.map((slug, index) => [slug, index]));
  return [...childPages].sort((a, b) => {
    const aRank = rank.has(a.slug) ? rank.get(a.slug) : 999;
    const bRank = rank.has(b.slug) ? rank.get(b.slug) : 999;
    if (aRank !== bRank) return aRank - bRank;
    return (a.nav_label || a.slug).localeCompare(b.nav_label || b.slug);
  });
}

export function getLowestPrice(product, margin = 1.4) {
  if (!product?.pricing_tiers?.length) return 0;
  const values = product.pricing_tiers
    .map((tier) => Number.parseFloat(tier.base_price))
    .filter((value) => Number.isFinite(value));
  if (!values.length) return 0;
  return Math.min(...values) * margin;
}

export function getFirstImage(product) {
  const colours = [...(product?.product_colours || [])].sort(
    (a, b) => (a.sort_order || 0) - (b.sort_order || 0)
  );
  const images = colours[0]?.images;
  if (Array.isArray(images)) return images[0] || null;
  if (images && typeof images === 'object') return Object.values(images)[0] || null;
  if (typeof images === 'string') return images;
  return null;
}

export function getColourSwatches(product, max = 8) {
  return [...(product?.product_colours || [])]
    .filter((colour) => colour.hex && colour.name !== 'Default')
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
    .slice(0, max);
}

// --- Promo Kits + /promotional-products hub helpers (additive) ---

// One-query category tree for the /promotional-products hub.
// Top-level = live product_category pages with no breadcrumb_parent and not noindex.
// Children = live pages whose breadcrumb_parent points at the top, excluding
// colour 'collection' pages (those are SEO colour pages, not subcategories).
export async function getCategoryTree(maxChildren = 6) {
  const { data, error } = await supabase
    .from('url_pages')
    .select('slug, canonical_url, nav_label, h1, breadcrumb_parent, page_type, priority, show_in_home, noindex')
    .eq('status', 'live')
    .order('priority', { ascending: true })
    .order('nav_label', { ascending: true });

  if (error) {
    console.error('[url_pages] getCategoryTree failed', error);
    return [];
  }

  const rows = data || [];
  const isIndexable = (p) => !p.noindex;
  const tops = rows.filter(
    (p) => p.page_type === 'product_category' && !p.breadcrumb_parent && isIndexable(p),
  );

  return tops.map((top) => {
    const children = rows
      .filter((p) => p.breadcrumb_parent === top.slug && p.page_type !== 'collection' && isIndexable(p))
      .slice(0, maxChildren);
    return { ...top, children };
  });
}

// Validate a list of slugs against live url_pages. Returns Map<slug, {canonical_url, nav_label}>.
// Used so kit slot links only ever point at a real, live canonical page.
export async function getLiveCanonicalMap(slugs) {
  const unique = [...new Set((slugs || []).filter(Boolean))];
  if (unique.length === 0) return new Map();

  const { data, error } = await supabase
    .from('url_pages')
    .select('slug, canonical_url, nav_label, noindex')
    .in('slug', unique)
    .eq('status', 'live');

  if (error) {
    console.error('[url_pages] getLiveCanonicalMap failed', error);
    return new Map();
  }

  const map = new Map();
  for (const p of data || []) {
    map.set(p.slug, { canonical_url: p.canonical_url || `/${p.slug}`, nav_label: p.nav_label });
  }
  return map;
}

// Colored category cards for /promotional-products: top-level categories +
// up to N representative product images pulled from each category's products.
// One query for url_pages + one product query per category (parallel). SEO-safe (live only).
export async function getCategoryHubCards(maxChildren = 4, imgPerCard = 3) {
  const { data, error } = await supabase
    .from('url_pages')
    .select('slug, canonical_url, nav_label, h1, breadcrumb_parent, page_type, priority, noindex, product_filter')
    .eq('status', 'live')
    .order('priority', { ascending: true })
    .order('nav_label', { ascending: true });

  if (error) {
    console.error('[url_pages] getCategoryHubCards failed', error);
    return [];
  }

  const rows = data || [];
  const tops = rows.filter(
    (p) => p.page_type === 'product_category' && !p.breadcrumb_parent && !p.noindex,
  );
  tops.sort((a, b) => (a.nav_label || a.h1 || a.slug).localeCompare(b.nav_label || b.h1 || b.slug));

  return Promise.all(
    tops.map(async (top) => {
      const children = rows
        .filter((p) => p.breadcrumb_parent === top.slug && p.page_type !== 'collection' && !p.noindex)
        .slice(0, maxChildren);

      const catName = top.product_filter?.category;
      const images = [];
      if (catName) {
        const { data: prods } = await supabase
          .from('products')
          .select('product_colours(images, sort_order)')
          .eq('is_published', true)
          .eq('category', catName)
          .limit(12);
        for (const pr of prods || []) {
          const img = getFirstImage(pr);
          if (img && !images.includes(img)) images.push(img);
          if (images.length >= imgPerCard) break;
        }
      }
      return { ...top, children, images };
    }),
  );
}

// Hero collage for the homepage: one representative product image per canonical slug.
export async function getHeroProductImages(slugs) {
  const out = [];
  for (const slug of slugs || []) {
    const urlPage = await getLiveUrlPage(slug);
    if (!urlPage) continue;
    const { products } = await getProductsForUrlPage(urlPage, 1);
    const p = (products || [])[0];
    const img = p ? getFirstImage(p) : null;
    if (img) out.push({ image: img, href: urlPage.canonical_url || `/${slug}`, label: urlPage.nav_label || urlPage.h1 || slug });
  }
  return out;
}

// 请求内去重,避免同一次渲染重复查 url_pages
export const getLiveUrlPage = cache(_getLiveUrlPageRaw);

// 列出所有已上线、可作为扁平 URL 的 slug —— 供 generateStaticParams 预渲染
export async function getAllLivePageSlugs() {
  const { data, error } = await supabase.from("url_pages").select("slug").eq("status", "live");
  if (error) { console.error("[url_pages] list slugs failed", error); return []; }
  return (data || []).map((r) => r.slug).filter((sg) => sg && !sg.includes("/") && !isReservedSlug(sg));
}

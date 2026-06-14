import { supabase } from '@/lib/supabase';

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
  pricing_tiers ( min_qty, base_price )
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

export async function getLiveUrlPage(slug) {
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

  if (type === 'subcategory') {
    return query
      .eq('category', productFilter.category)
      .eq('subcategory', productFilter.subcategory);
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

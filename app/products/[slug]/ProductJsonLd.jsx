// Server component — emits Product/ProductGroup + BreadcrumbList JSON-LD
// (Rulebook §10, #4A + #4B-4). Real data only: omit description/sku/offers when
// absent; never fabricate price/availability/rating. Breadcrumb uses flat
// canonical category URLs from url_pages (decision A), falling back to
// /category/... only when no flat page exists. url == canonical (§5).
//
// 4B-4: when the product has >= 2 ready colour variants (product_variants,
// status='variant_ready'), the top-level type becomes ProductGroup with
// hasVariant[] (each a Product: color/image/variant-url, offers INHERITED from
// the product's pricing tiers — no per-colour price, no per-colour SKU). Fewer
// than 2 ready variants -> unchanged plain Product (4A behaviour).
import { supabase } from '@/lib/supabase';
import { MARGIN } from '@/lib/pricing';
import { absoluteUrl } from '@/lib/siteUrl';
import { slugify } from '@/lib/slug';

const BRAND_FALLBACK = 'QuirkyPromo';

// Resolve a category/subcategory to its flat canonical URL via url_pages.
async function resolveCategoryUrl(type, category, subcategory) {
  let q = supabase
    .from('url_pages')
    .select('slug, canonical_url')
    .eq('status', 'live')
    .eq('product_filter->>type', type)
    .eq('product_filter->>category', category);
  if (type === 'subcategory') q = q.eq('product_filter->>subcategory', subcategory);

  const { data } = await q.limit(1).maybeSingle();
  if (data) return { url: absoluteUrl(data.canonical_url || `/${data.slug}`), fallback: false };

  const path = type === 'subcategory'
    ? `/category/${slugify(category)}/${slugify(subcategory)}`
    : `/category/${slugify(category)}`;
  return { url: absoluteUrl(path), fallback: true };
}

export default async function ProductJsonLd({ product, images = [], pricingTiers = [], offerPrice = null }) {
  // Data-quality gate (§D): need a published product with a name and an image.
  if (!product?.name) return null;
  const imgs = (images || []).filter(Boolean);
  if (imgs.length === 0) return null;

  const canonical = absoluteUrl(`/products/${product.slug}`);
  const description = (product.meta_description || product.seo_description || '').trim() || null;
  const brand = (product.brand || '').trim() || BRAND_FALLBACK;

  // offers: only when real prices exist (AggregateOffer, AUD, ex-GST). Returns
  // the offer object for a given url, or null. Variants inherit the SAME tiers
  // (no per-colour price), so each variant reuses this with its own url.
  const prices = (pricingTiers || [])
    .map((t) => Number(t.base_price))
    .filter((p) => Number.isFinite(p) && p > 0)
    .map((p) => +(p * MARGIN).toFixed(2));
  const lowPrice = prices.length ? Math.min(...prices).toFixed(2) : null;
  const highPrice = prices.length ? Math.max(...prices).toFixed(2) : null;
  // 计算器产品:用传入的真实起步价发单价 Offer(与 PDP "from $X" 同源)
  const overrideOffer = (Number.isFinite(offerPrice) && offerPrice > 0)
    ? Number(offerPrice).toFixed(2) : null;
  const offerFor = (url) => {
    if (overrideOffer) return {
      '@type': 'Offer',
      priceCurrency: 'AUD',
      price: overrideOffer,
      availability: 'https://schema.org/InStock',
      url,
    };
    return prices.length ? {
      '@type': 'AggregateOffer',
      priceCurrency: 'AUD',
      lowPrice,
      highPrice,
      offerCount: prices.length,
      url,
    } : null;
  };

  // ── base Product fields (shared by Product and ProductGroup) ──
  const base = {
    '@context': 'https://schema.org',
    name: product.name,
    ...(description ? { description } : {}),
    ...(product.supplier_sku ? { sku: String(product.supplier_sku) } : {}),
    brand: { '@type': 'Brand', name: brand },
    image: imgs,
    url: canonical,
  };

  // ── 4B-4: ready colour variants → ProductGroup + hasVariant ──
  // RLS allows anon to read variant_ready variants of published products.
  const { data: variants } = await supabase
    .from('product_variants')
    .select('colour_name, colour_slug, image_url')
    .eq('product_id', product.id)
    .eq('status', 'variant_ready')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  const ready = (variants || []).filter(
    (v) => v.colour_name && v.colour_slug && v.image_url
  );

  let mainLd;
  if (ready.length >= 2) {
    const groupId = String(product.supplier_sku || product.slug);
    mainLd = {
      ...base,
      '@type': 'ProductGroup',
      productGroupID: groupId,
      variesBy: ['https://schema.org/color'],
      hasVariant: ready.map((v) => {
        const vUrl = `${canonical}?colour=${v.colour_slug}`;
        const offer = offerFor(vUrl);
        return {
          '@type': 'Product',
          name: `${product.name} - ${v.colour_name}`,
          color: v.colour_name,
          image: v.image_url,
          url: vUrl,
          inProductGroupID: groupId,
          brand: { '@type': 'Brand', name: brand },
          ...(offer ? { offers: offer } : {}),
        };
      }),
    };
  } else {
    // 4A unchanged: plain Product (single colour / no ready variants).
    const offer = offerFor(canonical);
    mainLd = {
      ...base,
      '@type': 'Product',
      ...(offer ? { offers: offer } : {}),
    };
  }

  // ── BreadcrumbList ──
  const items = [{ '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') }];
  let pos = 2;
  if (product.category) {
    const c = await resolveCategoryUrl('category', product.category);
    items.push({ '@type': 'ListItem', position: pos++, name: product.category, item: c.url });
    if (product.subcategory) {
      const s = await resolveCategoryUrl('subcategory', product.category, product.subcategory);
      items.push({ '@type': 'ListItem', position: pos++, name: product.subcategory, item: s.url });
    }
  }
  items.push({ '@type': 'ListItem', position: pos, name: product.name, item: canonical });

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(mainLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
    </>
  );
}

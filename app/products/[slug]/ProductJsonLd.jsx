// Server component — emits Product + BreadcrumbList JSON-LD (Rulebook §10, #4A).
// Real data only: omit description/sku/offers when absent; never fabricate
// price/availability/rating. Breadcrumb uses flat canonical category URLs from
// url_pages (decision A), falling back to /category/... only when no flat page
// exists. url == canonical (§5); last breadcrumb item == product canonical.
import { supabase } from '@/lib/supabase';
import { absoluteUrl } from '@/lib/siteUrl';
import { slugify } from '@/lib/slug';

const MARGIN = 1.4;            // displayed price = base_price * margin (matches PDP, ex-GST)
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

export default async function ProductJsonLd({ product, images = [], pricingTiers = [] }) {
  // Data-quality gate (§D): need a published product with a name and an image.
  if (!product?.name) return null;
  const imgs = (images || []).filter(Boolean);
  if (imgs.length === 0) return null;

  const canonical = absoluteUrl(`/products/${product.slug}`);
  const description = (product.meta_description || product.seo_description || '').trim() || null;
  const brand = (product.brand || '').trim() || BRAND_FALLBACK;

  // ── Product ──
  const productLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    ...(description ? { description } : {}),
    ...(product.supplier_sku ? { sku: String(product.supplier_sku) } : {}),
    brand: { '@type': 'Brand', name: brand },
    image: imgs,
    url: canonical,
  };

  // offers: only when real prices exist (AggregateOffer, AUD, ex-GST)
  const prices = (pricingTiers || [])
    .map((t) => Number(t.base_price))
    .filter((p) => Number.isFinite(p) && p > 0)
    .map((p) => +(p * MARGIN).toFixed(2));
  if (prices.length) {
    productLd.offers = {
      '@type': 'AggregateOffer',
      priceCurrency: 'AUD',
      lowPrice: Math.min(...prices).toFixed(2),
      highPrice: Math.max(...prices).toFixed(2),
      offerCount: prices.length,
      url: canonical,
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
    </>
  );
}

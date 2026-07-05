import { supabase } from '@/lib/supabase';
import { absoluteUrl } from '@/lib/siteUrl';

// ISR:每小时最多重新生成一次,平时走缓存。
// 之前用 force-dynamic 每次请求都现查 ~5000 产品,导致生成极慢、
// Google 抓取超时只拿到旧副本(GSC 卡在 2,827)。改缓存后又快又能反映新品。
export const revalidate = 3600;

const STATIC_ROUTES = [
  '/',
  '/about',
  '/best-sellers',
  '/catalog',
  '/contact',
  '/faq',
  '/new-arrivals',
  '/promotional-products',
  '/resources/portfolio',
  '/sale',
  '/services/decoration-methods',
  '/services/logistics',
  '/services/merch-store',
  '/services/sourcing',
  '/services/warehousing',
  '/supply-chain',
  '/sustainability',
];

function staticEntry(path) {
  return {
    url: absoluteUrl(path),
    lastModified: new Date(),
    changeFrequency: path === '/' ? 'daily' : 'weekly',
    priority: path === '/' ? 1 : 0.7,
  };
}

function pagePriority(page) {
  if (page.show_in_home) return 0.9;
  if (!page.breadcrumb_parent && page.page_type === 'product_category') return 0.8;
  if (page.breadcrumb_parent) return 0.7;
  return 0.6;
}

function dateOrNow(value) {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.valueOf()) ? date : new Date();
}

function hasNonEmptyImages(images) {
  if (!images) return false;
  try {
    const arr = Array.isArray(images)
      ? images
      : typeof images === 'string'
        ? JSON.parse(images)
        : Object.values(images);
    return Array.isArray(arr) && arr.length > 0;
  } catch {
    return false;
  }
}

// PostgREST caps each request at 1000 rows; page through to get all products.
async function fetchAllProducts() {
  const PAGE = 1000;
  let from = 0;
  const all = [];
  for (;;) {
    const { data, error } = await supabase
      .from('products')
      .select('id, slug, name, product_colours(images)')
      .eq('is_published', true)
      .order('slug', { ascending: true })
      .range(from, from + PAGE - 1);
    if (error) {
      console.error('[sitemap] product page fetch failed', error);
      break;
    }
    if (!data || data.length === 0) break;
    all.push(...data);
    if (data.length < PAGE) break;
    from += PAGE;
  }
  return all;
}

export default async function sitemap() {
  const staticEntries = STATIC_ROUTES.map(staticEntry);

  // url_pages (categories / flat pages)
  const { data: urlPagesData, error: urlPagesError } = await supabase
    .from('url_pages')
    .select('slug, canonical_url, updated_at, created_at, breadcrumb_parent, page_type, show_in_home')
    .eq('status', 'live')
    .or('noindex.is.null,noindex.eq.false')
    .order('priority', { ascending: true })
    .order('slug', { ascending: true });

  if (urlPagesError) console.error('[sitemap] failed to load url_pages', urlPagesError);

  const urlPageEntries = (urlPagesData || []).map((page) => ({
    url: absoluteUrl(page.canonical_url || `/${page.slug}`),
    lastModified: dateOrNow(page.updated_at || page.created_at),
    changeFrequency: 'weekly',
    priority: pagePriority(page),
  }));

  // products: published + name + slug + has image; canonical /products/[slug].
  // products has no reliable updated_at, so we omit lastModified (no fake dates).
  const productRows = await fetchAllProducts();
  const seen = new Set();
  const productEntries = [];
  for (const p of productRows) {
    const slug = (p.slug || '').trim();
    const name = (p.name || '').trim();
    if (!slug || !name) continue;
    const hasImage = Array.isArray(p.product_colours)
      && p.product_colours.some((pc) => hasNonEmptyImages(pc.images));
    if (!hasImage) continue;
    if (seen.has(slug)) continue;
    seen.add(slug);
    productEntries.push({
      url: absoluteUrl(`/products/${slug}`),
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  }

  return [...staticEntries, ...urlPageEntries, ...productEntries];
}

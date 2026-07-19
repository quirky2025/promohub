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

// PostgREST caps each request at 1000 rows; page through to get all products.
// IMPORTANT: keep this select lightweight (slug, name only). Embedding
// product_colours(images) bloats each row so much that a full 1000-row page can
// exceed PostgREST's response-size cap and come back short — the loop then sees
// "< PAGE" and stops early, silently dropping every product later in the sort
// order (this is what hid all the AS Colour "womens-*" URLs). Order by the unique
// id so range() pagination is stable.
async function fetchAllProducts() {
  const PAGE = 1000;

  // Expected total first, so the self-check at the end can detect silent
  // truncation (the exact failure that once hid ~1,900 product URLs).
  const { count: expected, error: countError } = await supabase
    .from('products')
    .select('id', { count: 'exact', head: true })
    .eq('is_published', true);
  if (countError) console.error('[sitemap] published count failed', countError);

  let from = 0;
  const all = [];
  for (;;) {
    const { data, error } = await supabase
      .from('products')
      .select('slug, name')
      .eq('is_published', true)
      .order('id', { ascending: true })
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

  // Self-check: if we fetched materially fewer than the DB says exist, the
  // pagination truncated. Shout in the logs instead of silently shipping a
  // short sitemap that would de-index the missing product pages.
  if (typeof expected === 'number' && all.length < expected) {
    console.error(
      `[sitemap] TRUNCATED — fetched ${all.length} of ${expected} published ` +
      `products; missing ${expected - all.length} product URLs. Investigate pagination.`
    );
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

  // blog posts (published only)
  const { data: blogRows } = await supabase
    .from('blog_posts')
    .select('slug, updated_at, published_at')
    .eq('status', 'published')
    .limit(500);
  const blogEntries = [
    ...(blogRows && blogRows.length ? [staticEntry('/blog')] : []),
    ...(blogRows || []).map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: dateOrNow(post.updated_at || post.published_at),
      changeFrequency: 'monthly',
      priority: 0.6,
    })),
  ];

  // products: published + non-empty slug + non-empty name; canonical /products/[slug].
  // No image gate: every published product currently has imagery, and the old
  // gate required a heavy product_colours join that broke pagination (see above).
  // products has no reliable updated_at, so we omit lastModified (no fake dates).
  const productRows = await fetchAllProducts();
  const seen = new Set();
  const productEntries = [];
  for (const p of productRows) {
    const slug = (p.slug || '').trim();
    const name = (p.name || '').trim();
    if (!slug || !name) continue;
    if (seen.has(slug)) continue;
    seen.add(slug);
    productEntries.push({
      url: absoluteUrl(`/products/${slug}`),
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  }

  return [...staticEntries, ...urlPageEntries, ...blogEntries, ...productEntries];
}

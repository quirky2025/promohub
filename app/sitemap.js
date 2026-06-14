import { supabase } from '@/lib/supabase';
import { absoluteUrl } from '@/lib/siteUrl';

export const dynamic = 'force-dynamic';

const STATIC_ROUTES = [
  '/',
  '/about',
  '/best-sellers',
  '/catalog',
  '/contact',
  '/faq',
  '/new-arrivals',
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

export default async function sitemap() {
  const staticEntries = STATIC_ROUTES.map(staticEntry);

  const { data, error } = await supabase
    .from('url_pages')
    .select('slug, canonical_url, updated_at, created_at, breadcrumb_parent, page_type, show_in_home')
    .eq('status', 'live')
    .or('noindex.is.null,noindex.eq.false')
    .order('priority', { ascending: true })
    .order('slug', { ascending: true });

  if (error) {
    console.error('[sitemap] failed to load url_pages', error);
    return staticEntries;
  }

  const urlPageEntries = (data || []).map((page) => ({
    url: absoluteUrl(page.canonical_url || `/${page.slug}`),
    lastModified: dateOrNow(page.updated_at || page.created_at),
    changeFrequency: 'weekly',
    priority: pagePriority(page),
  }));

  return [...staticEntries, ...urlPageEntries];
}

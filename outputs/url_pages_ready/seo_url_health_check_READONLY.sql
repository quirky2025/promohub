-- SEO / URL health check for QuirkyPromo flat category rollout.
-- READ ONLY. Do not run as an UPDATE.
-- Purpose:
--   1) catch live url_pages using reserved top-level slugs
--   2) catch missing or mismatched canonical_url values
--   3) catch duplicate canonicals among live indexable pages
--   4) summarize sitemap-eligible live indexable pages

with reserved_slugs(slug) as (
  values
    ('about'),
    ('account'),
    ('admin'),
    ('api'),
    ('artwork'),
    ('best-sellers'),
    ('blog'),
    ('brands'),
    ('cart'),
    ('catalog'),
    ('category'),
    ('collections'),
    ('contact'),
    ('eco'),
    ('faq'),
    ('indent'),
    ('new-arrivals'),
    ('order-confirmation'),
    ('place-order'),
    ('privacy'),
    ('products'),
    ('refund-return'),
    ('resources'),
    ('reviews'),
    ('sale'),
    ('sales-terms'),
    ('search'),
    ('services'),
    ('supply-chain'),
    ('sustainability'),
    ('testimonials'),
    ('track-order'),
    ('upload'),
    ('website-terms')
),
live_pages as (
  select
    slug,
    status,
    page_type,
    canonical_url,
    coalesce(noindex, false) as noindex,
    show_in_nav,
    show_in_home,
    breadcrumb_parent
  from public.url_pages
  where status = 'live'
),
reserved_issues as (
  select lp.slug
  from live_pages lp
  join reserved_slugs rs on rs.slug = split_part(lp.slug, '/', 1)
),
canonical_issues as (
  select
    slug,
    canonical_url,
    '/' || slug as expected_canonical
  from live_pages
  where coalesce(canonical_url, '') <> '/' || slug
),
canonical_duplicates as (
  select
    canonical_url,
    count(*) as page_count,
    jsonb_agg(slug order by slug) as slugs
  from live_pages
  where not noindex
  group by canonical_url
  having count(*) > 1
),
sitemap_pages as (
  select *
  from live_pages
  where not noindex
),
live_noindex_pages as (
  select slug, canonical_url
  from live_pages
  where noindex
)
select
  'reserved_slug_collision' as check_name,
  case when count(*) = 0 then 'ok' else 'issue' end as health_status,
  count(*)::int as issue_count,
  coalesce(jsonb_agg(slug order by slug) filter (where slug is not null), '[]'::jsonb) as details
from reserved_issues

union all

select
  'canonical_missing_or_mismatch' as check_name,
  case when count(*) = 0 then 'ok' else 'issue' end as health_status,
  count(*)::int as issue_count,
  coalesce(
    jsonb_agg(
      jsonb_build_object(
        'slug', slug,
        'canonical_url', canonical_url,
        'expected_canonical', expected_canonical
      )
      order by slug
    ) filter (where slug is not null),
    '[]'::jsonb
  ) as details
from canonical_issues

union all

select
  'canonical_duplicate_live_indexable' as check_name,
  case when count(*) = 0 then 'ok' else 'issue' end as health_status,
  count(*)::int as issue_count,
  coalesce(
    jsonb_agg(
      jsonb_build_object(
        'canonical_url', canonical_url,
        'page_count', page_count,
        'slugs', slugs
      )
      order by canonical_url
    ) filter (where canonical_url is not null),
    '[]'::jsonb
  ) as details
from canonical_duplicates

union all

select
  'sitemap_live_indexable_count' as check_name,
  'ok' as health_status,
  count(*)::int as issue_count,
  jsonb_build_object(
    'live_indexable_url_pages', count(*),
    'top_level_pages', count(*) filter (where breadcrumb_parent is null),
    'child_pages', count(*) filter (where breadcrumb_parent is not null),
    'nav_pages', count(*) filter (where show_in_nav),
    'home_pages', count(*) filter (where show_in_home)
  ) as details
from sitemap_pages

union all

select
  'live_noindex_pages' as check_name,
  case when count(*) = 0 then 'ok' else 'warning' end as health_status,
  count(*)::int as issue_count,
  coalesce(
    jsonb_agg(
      jsonb_build_object('slug', slug, 'canonical_url', canonical_url)
      order by slug
    ) filter (where slug is not null),
    '[]'::jsonb
  ) as details
from live_noindex_pages;

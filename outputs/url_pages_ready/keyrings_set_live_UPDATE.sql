-- Set Key Rings flat URL pages live
-- Run only after keyrings_live_preflight_READONLY.sql has acceptable product counts.
-- This updates only Key Rings url_pages rows with non-zero product counts.

begin;

with target_pages as (
  select *
  from public.url_pages
  where slug in (
    'custom-keyrings-australia',
    'custom-metal-keyrings-australia',
    'leather-keyrings-australia',
    'silicone-keyrings-australia',
    'eco-keyrings-australia',
    'functional-keyrings-australia',
    'novelty-keyrings-australia'
  )
),
page_counts as (
  select
    up.slug,
    (
      select count(*)
      from public.products p
      where p.is_published = true
        and (
          (
            up.product_filter->>'type' = 'category'
            and p.category = up.product_filter->>'category'
          )
          or (
            up.product_filter->>'type' = 'subcategory'
            and p.category = up.product_filter->>'category'
            and p.subcategory = up.product_filter->>'subcategory'
          )
        )
    ) as product_count
  from target_pages up
),
updated as (
  update public.url_pages u
  set
    status = 'live',
    noindex = false,
    updated_at = now()
  from page_counts pc
  where u.slug = pc.slug
    and pc.product_count > 0
  returning u.slug, u.status
)
select
  pc.slug,
  coalesce(updated.status, 'draft') as status,
  pc.product_count,
  case
    when pc.product_count = 0 then 'left draft: no products'
    when updated.status = 'live' then 'live'
    else 'check status'
  end as result
from page_counts pc
left join updated on updated.slug = pc.slug
order by
  case pc.slug
    when 'custom-keyrings-australia' then 0
    when 'custom-metal-keyrings-australia' then 1
    when 'leather-keyrings-australia' then 2
    when 'silicone-keyrings-australia' then 3
    when 'eco-keyrings-australia' then 4
    when 'functional-keyrings-australia' then 5
    when 'novelty-keyrings-australia' then 6
    else 99
  end;

commit;

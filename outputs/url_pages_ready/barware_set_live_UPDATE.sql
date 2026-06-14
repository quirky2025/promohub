-- Set Barware & Accessories flat URL pages live
-- Run only after barware_live_preflight_READONLY.sql has acceptable product counts.
-- This updates only Barware url_pages rows with non-zero product counts.

begin;

with target_pages as (
  select *
  from public.url_pages
  where slug in (
    'branded-barware-australia',
    'custom-coasters-australia',
    'custom-bottle-openers-australia',
    'custom-stubby-holders-australia',
    'custom-bar-mats-australia',
    'branded-wine-accessories-australia',
    'bar-accessories-australia'
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
    when 'branded-barware-australia' then 0
    when 'custom-coasters-australia' then 1
    when 'custom-bottle-openers-australia' then 2
    when 'custom-stubby-holders-australia' then 3
    when 'custom-bar-mats-australia' then 4
    when 'branded-wine-accessories-australia' then 5
    when 'bar-accessories-australia' then 6
    else 99
  end;

commit;

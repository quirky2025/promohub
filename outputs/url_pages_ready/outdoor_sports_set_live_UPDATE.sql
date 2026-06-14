-- Set Outdoor & Sports flat URL pages live
-- Run only after outdoor_sports_live_preflight_READONLY.sql has acceptable product counts.
-- This updates only Outdoor & Sports url_pages rows with non-zero product counts.

begin;

with target_pages as (
  select *
  from public.url_pages
  where slug in (
    'outdoor-promotional-products-australia',
    'promotional-sports-products-australia',
    'custom-golf-products-australia',
    'custom-umbrellas-australia',
    'custom-towels-australia',
    'camping-gear-australia',
    'picnic-and-bbq-australia',
    'custom-sunglasses-australia',
    'picnic-blankets-australia',
    'custom-supporter-gear-australia'
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
    when 'outdoor-promotional-products-australia' then 0
    when 'promotional-sports-products-australia' then 1
    when 'custom-golf-products-australia' then 2
    when 'custom-umbrellas-australia' then 3
    when 'custom-towels-australia' then 4
    when 'camping-gear-australia' then 5
    when 'picnic-and-bbq-australia' then 6
    when 'custom-sunglasses-australia' then 7
    when 'picnic-blankets-australia' then 8
    when 'custom-supporter-gear-australia' then 9
    else 99
  end;

commit;

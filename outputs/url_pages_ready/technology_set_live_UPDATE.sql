-- Set Technology flat URL pages live
-- Run only after technology_live_preflight_READONLY.sql has acceptable product counts.
-- This updates only Technology url_pages rows with non-zero product counts.

begin;

with target_pages as (
  select *
  from public.url_pages
  where slug in (
    'corporate-tech-gifts-australia',
    'custom-power-banks-australia',
    'custom-bluetooth-speakers-australia',
    'custom-earbuds-australia',
    'custom-charging-cables-australia',
    'wireless-chargers-australia',
    'custom-phone-accessories-australia',
    'custom-usb-drives-australia',
    'tech-accessories-australia'
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
    when 'corporate-tech-gifts-australia' then 0
    when 'custom-power-banks-australia' then 1
    when 'custom-bluetooth-speakers-australia' then 2
    when 'custom-earbuds-australia' then 3
    when 'custom-charging-cables-australia' then 4
    when 'wireless-chargers-australia' then 5
    when 'custom-phone-accessories-australia' then 6
    when 'custom-usb-drives-australia' then 7
    when 'tech-accessories-australia' then 8
    else 99
  end;

commit;

-- Technology live status check
-- READ ONLY. Run after technology_set_live_UPDATE.sql.

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
)
select
  up.slug,
  up.status,
  up.noindex,
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
  ) as product_count,
  up.product_filter
from target_pages up
order by
  case up.slug
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

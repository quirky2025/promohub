-- Outdoor & Sports live status check
-- READ ONLY. Run after outdoor_sports_set_live_UPDATE.sql if you want a clean confirmation.

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
    up.status,
    up.noindex,
    up.product_filter,
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
)
select
  slug,
  status,
  noindex,
  product_count,
  product_filter
from page_counts
order by
  case slug
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

-- Personal Care flat URL preflight
-- READ ONLY. Run after personal_care_normalization_apply_UPDATE.sql and before personal_care_set_live_UPDATE.sql.
-- Goal: check whether each Personal Care URL page can match published products.

with target_pages as (
  select *
  from public.url_pages
  where slug in (
    'branded-personal-care-products-australia',
    'custom-lip-balm-australia',
    'custom-hand-sanitiser-australia',
    'custom-face-masks-australia',
    'sunscreen-australia',
    'first-aid-kits-australia',
    'manicure-sets-australia',
    'compact-mirrors-australia',
    'bath-and-body-gifts-australia',
    'grooming-products-australia'
  )
),
page_counts as (
  select
    up.slug,
    up.status,
    up.nav_label,
    up.product_filter,
    coalesce(up.product_filter->>'type', '') as filter_type,
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
  nav_label,
  filter_type,
  product_count,
  case
    when product_count = 0 then 'CHECK BEFORE LIVE'
    else 'ok'
  end as validation_note,
  product_filter
from page_counts
order by
  case slug
    when 'branded-personal-care-products-australia' then 0
    when 'custom-lip-balm-australia' then 1
    when 'custom-hand-sanitiser-australia' then 2
    when 'custom-face-masks-australia' then 3
    when 'sunscreen-australia' then 4
    when 'first-aid-kits-australia' then 5
    when 'manicure-sets-australia' then 6
    when 'compact-mirrors-australia' then 7
    when 'bath-and-body-gifts-australia' then 8
    when 'grooming-products-australia' then 9
    else 99
  end;

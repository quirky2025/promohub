-- Tools & Auto flat URL preflight
-- READ ONLY. Run after tools_auto_normalization_apply_UPDATE.sql and before tools_auto_set_live_UPDATE.sql.
-- Goal: check whether each Tools & Auto URL page can match published products.

with target_pages as (
  select *
  from public.url_pages
  where slug in (
    'branded-tools-and-car-accessories-australia',
    'custom-multi-tools-australia',
    'custom-tape-measures-australia',
    'custom-torches-australia',
    'tool-sets-australia',
    'car-accessories-australia'
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
    when 'branded-tools-and-car-accessories-australia' then 0
    when 'custom-multi-tools-australia' then 1
    when 'custom-tape-measures-australia' then 2
    when 'custom-torches-australia' then 3
    when 'tool-sets-australia' then 4
    when 'car-accessories-australia' then 5
    else 99
  end;

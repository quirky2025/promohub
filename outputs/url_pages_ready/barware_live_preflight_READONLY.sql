-- Barware & Accessories flat URL preflight
-- READ ONLY. Run after barware_normalization_apply_UPDATE.sql and before barware_set_live_UPDATE.sql.
-- Goal: check whether each Barware URL page can match published products.

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
    when 'branded-barware-australia' then 0
    when 'custom-coasters-australia' then 1
    when 'custom-bottle-openers-australia' then 2
    when 'custom-stubby-holders-australia' then 3
    when 'custom-bar-mats-australia' then 4
    when 'branded-wine-accessories-australia' then 5
    when 'bar-accessories-australia' then 6
    else 99
  end;

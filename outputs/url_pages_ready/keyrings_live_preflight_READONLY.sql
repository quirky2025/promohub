-- Key Rings flat URL preflight
-- READ ONLY. Run after keyrings_normalization_apply_UPDATE.sql and before keyrings_set_live_UPDATE.sql.
-- Goal: check whether each Key Rings URL page can match published products.

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
    when 'custom-keyrings-australia' then 0
    when 'custom-metal-keyrings-australia' then 1
    when 'leather-keyrings-australia' then 2
    when 'silicone-keyrings-australia' then 3
    when 'eco-keyrings-australia' then 4
    when 'functional-keyrings-australia' then 5
    when 'novelty-keyrings-australia' then 6
    else 99
  end;

-- Packaging flat URL preflight
-- READ ONLY. Run after packaging_normalization_apply_UPDATE.sql and before packaging_set_live_UPDATE.sql.
-- Goal: check whether each Packaging URL page can match published products.

with target_pages as (
  select *
  from public.url_pages
  where slug in (
    'custom-packaging-australia',
    'custom-gift-boxes-australia',
    'custom-gift-bags-australia',
    'gift-tubes-australia',
    'custom-pouches-australia',
    'custom-tissue-paper-australia',
    'ribbons-and-gift-tags-australia',
    'greeting-cards-australia'
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
    when 'custom-packaging-australia' then 0
    when 'custom-gift-boxes-australia' then 1
    when 'custom-gift-bags-australia' then 2
    when 'gift-tubes-australia' then 3
    when 'custom-pouches-australia' then 4
    when 'custom-tissue-paper-australia' then 5
    when 'ribbons-and-gift-tags-australia' then 6
    when 'greeting-cards-australia' then 7
    else 99
  end;

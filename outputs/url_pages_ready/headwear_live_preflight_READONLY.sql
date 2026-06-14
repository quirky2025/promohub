-- Headwear flat URL preflight
-- READ ONLY. Run after headwear_normalization_apply_UPDATE.sql and before headwear_set_live_UPDATE.sql.
-- Goal: check whether each Headwear URL page can match published products.

with target_pages as (
  select *
  from public.url_pages
  where slug in (
    'custom-headwear-australia',
    'custom-caps-australia',
    'custom-beanies-australia',
    'custom-bucket-hats-australia',
    'custom-wide-brim-hats-australia',
    'straw-hats-australia',
    'custom-visors-australia',
    'novelty-headwear-australia'
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
    when 'custom-headwear-australia' then 0
    when 'custom-caps-australia' then 1
    when 'custom-beanies-australia' then 2
    when 'custom-bucket-hats-australia' then 3
    when 'custom-wide-brim-hats-australia' then 4
    when 'straw-hats-australia' then 5
    when 'custom-visors-australia' then 6
    when 'novelty-headwear-australia' then 7
    else 99
  end;

-- Home & Living flat URL preflight
-- READ ONLY. Run after home_living_normalization_apply_UPDATE.sql and before home_living_set_live_UPDATE.sql.
-- Goal: check whether each Home & Living URL page can match published products.

with target_pages as (
  select *
  from public.url_pages
  where slug in (
    'branded-homewares-australia',
    'custom-kitchenware-australia',
    'cheese-boards-australia',
    'promotional-home-decor-australia',
    'candles-and-diffusers-australia'
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
    when 'branded-homewares-australia' then 0
    when 'custom-kitchenware-australia' then 1
    when 'cheese-boards-australia' then 2
    when 'promotional-home-decor-australia' then 3
    when 'candles-and-diffusers-australia' then 4
    else 99
  end;

-- Drinkware flat URL preflight
-- READ ONLY. Run before setting Drinkware url_pages to live.
-- Goal: check whether each Drinkware URL page can match published products.

with target_pages as (
  select *
  from public.url_pages
  where slug in (
    'custom-drinkware-australia',
    'custom-drink-bottles-australia',
    'custom-coffee-cups-australia',
    'custom-travel-mugs-australia',
    'custom-tumblers-australia',
    'custom-mugs-australia',
    'branded-glassware-australia',
    'custom-flasks-australia',
    'custom-teaware-australia'
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
  case when slug = 'custom-drinkware-australia' then 0 else 1 end,
  slug;


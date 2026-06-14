-- Office & Desk flat URL preflight
-- READ ONLY. Run after office_desk_normalization_apply_UPDATE.sql and before office_desk_set_live_UPDATE.sql.
-- Goal: check whether each Office & Desk URL page can match published products.

with target_pages as (
  select *
  from public.url_pages
  where slug in (
    'branded-office-supplies-australia',
    'branded-notebooks-australia',
    'custom-note-pads-australia',
    'custom-planners-australia',
    'custom-sticky-notes-australia',
    'custom-stationery-australia',
    'desk-accessories-australia',
    'custom-compendiums-australia',
    'custom-pencil-cases-australia',
    'custom-rulers-australia'
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
    when 'branded-office-supplies-australia' then 0
    when 'branded-notebooks-australia' then 1
    when 'custom-note-pads-australia' then 2
    when 'custom-planners-australia' then 3
    when 'custom-sticky-notes-australia' then 4
    when 'custom-stationery-australia' then 5
    when 'desk-accessories-australia' then 6
    when 'custom-compendiums-australia' then 7
    when 'custom-pencil-cases-australia' then 8
    when 'custom-rulers-australia' then 9
    else 99
  end;

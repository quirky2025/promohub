-- Office & Desk live status check
-- READ ONLY. Run after office_desk_set_live_UPDATE.sql.

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
)
select
  up.slug,
  up.status,
  up.noindex,
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
  ) as product_count,
  up.product_filter
from target_pages up
order by
  case up.slug
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

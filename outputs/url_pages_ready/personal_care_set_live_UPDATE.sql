-- Set Personal Care flat URL pages live
-- Run only after personal_care_live_preflight_READONLY.sql has acceptable product counts.
-- This updates only Personal Care url_pages rows with non-zero product counts.

begin;

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
),
updated as (
  update public.url_pages u
  set
    status = 'live',
    noindex = false,
    updated_at = now()
  from page_counts pc
  where u.slug = pc.slug
    and pc.product_count > 0
  returning u.slug, u.status
)
select
  pc.slug,
  coalesce(updated.status, 'draft') as status,
  pc.product_count,
  case
    when pc.product_count = 0 then 'left draft: no products'
    when updated.status = 'live' then 'live'
    else 'check status'
  end as result
from page_counts pc
left join updated on updated.slug = pc.slug
order by
  case pc.slug
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

commit;

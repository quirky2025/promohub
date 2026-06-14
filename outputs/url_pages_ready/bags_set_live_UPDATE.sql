-- Set Bags flat URL pages live
-- Run only after bags_live_preflight_READONLY.sql has acceptable product counts.
-- This updates only Bags url_pages rows with non-zero product counts.
-- Cotton Tote Bags product_filter is patched to Bags + Tote Bags + material=cotton.

begin;

update public.url_pages
set
  product_filter = '{"type":"compound","category":"Bags","subcategory":"Tote Bags","material":"Cotton"}'::jsonb,
  updated_at = now()
where slug = 'custom-cotton-tote-bags-australia';

with target_pages as (
  select *
  from public.url_pages
  where slug in (
    'custom-bags-australia',
    'custom-tote-bags-australia',
    'custom-cotton-tote-bags-australia',
    'custom-cooler-bags-australia',
    'custom-backpacks-australia',
    'custom-paper-bags-australia',
    'custom-drawstring-bags-australia',
    'custom-duffle-bags-australia',
    'custom-toiletry-bags-australia',
    'jute-bags-australia',
    'custom-laptop-bags-australia',
    'wine-carriers-australia',
    'crossbody-bags-australia',
    'satchel-bags-australia',
    'dry-bags-australia'
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
          or (
            up.product_filter->>'type' = 'compound'
            and p.category = up.product_filter->>'category'
            and (
              not (up.product_filter ? 'subcategory')
              or p.subcategory = up.product_filter->>'subcategory'
            )
            and (
              up.product_filter ? 'material'
              and coalesce(p.material_tags, '{}'::text[]) @> array[lower(up.product_filter->>'material')]
            )
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
    when 'custom-bags-australia' then 0
    when 'custom-tote-bags-australia' then 1
    when 'custom-cotton-tote-bags-australia' then 2
    when 'custom-cooler-bags-australia' then 3
    when 'custom-backpacks-australia' then 4
    when 'custom-paper-bags-australia' then 5
    when 'custom-drawstring-bags-australia' then 6
    when 'custom-duffle-bags-australia' then 7
    when 'custom-toiletry-bags-australia' then 8
    when 'jute-bags-australia' then 9
    when 'custom-laptop-bags-australia' then 10
    when 'wine-carriers-australia' then 11
    when 'crossbody-bags-australia' then 12
    when 'satchel-bags-australia' then 13
    when 'dry-bags-australia' then 14
    else 99
  end;

commit;

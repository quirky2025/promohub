-- Set Headwear flat URL pages live
-- Run only after headwear_live_preflight_READONLY.sql has acceptable product counts.
-- This updates only Headwear url_pages rows with non-zero product counts.

begin;

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

commit;

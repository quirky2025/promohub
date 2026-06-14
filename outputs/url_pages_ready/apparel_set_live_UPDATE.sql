-- Set Apparel flat URL pages live
-- Run only after apparel_live_preflight_READONLY.sql has acceptable product counts.
-- This updates only Apparel url_pages rows with non-zero product counts.
-- Workwear and Teamwear are tag-based compound pages.

begin;

update public.url_pages
set
  product_filter = '{"type":"compound","category":"Apparel","tags":["workwear"]}'::jsonb,
  updated_at = now()
where slug = 'branded-workwear-australia';

update public.url_pages
set
  product_filter = '{"type":"compound","category":"Apparel","tags":["teamwear"]}'::jsonb,
  updated_at = now()
where slug = 'custom-teamwear-australia';

with target_pages as (
  select *
  from public.url_pages
  where slug in (
    'custom-branded-apparel-australia',
    'custom-t-shirts-australia',
    'custom-polo-shirts-australia',
    'custom-hoodies-australia',
    'custom-sweatshirts-australia',
    'custom-jackets-australia',
    'custom-shirts-australia',
    'custom-vests-australia',
    'workwear-pants-and-shorts-australia',
    'branded-workwear-australia',
    'custom-teamwear-australia',
    'custom-aprons-australia',
    'custom-socks-australia',
    'branded-scarves-and-accessories-australia',
    'branded-apparel-accessories-australia'
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
              up.product_filter ? 'tags'
              and coalesce(p.tags, '{}'::text[]) && (
                select array_agg(lower(value))
                from jsonb_array_elements_text(up.product_filter->'tags') as value
              )
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
    when 'custom-branded-apparel-australia' then 0
    when 'custom-t-shirts-australia' then 1
    when 'custom-polo-shirts-australia' then 2
    when 'custom-hoodies-australia' then 3
    when 'custom-sweatshirts-australia' then 4
    when 'custom-jackets-australia' then 5
    when 'custom-shirts-australia' then 6
    when 'custom-vests-australia' then 7
    when 'workwear-pants-and-shorts-australia' then 8
    when 'branded-workwear-australia' then 9
    when 'custom-teamwear-australia' then 10
    when 'custom-aprons-australia' then 11
    when 'custom-socks-australia' then 12
    when 'branded-scarves-and-accessories-australia' then 13
    when 'branded-apparel-accessories-australia' then 14
    else 99
  end;

commit;

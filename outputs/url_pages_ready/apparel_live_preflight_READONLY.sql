-- Apparel flat URL preflight
-- READ ONLY. Run after apparel_normalization_apply_UPDATE.sql and before apparel_set_live_UPDATE.sql.
-- Goal: check whether each Apparel URL page can match published products.

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

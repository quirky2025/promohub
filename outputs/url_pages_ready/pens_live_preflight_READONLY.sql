-- Pens flat URL preflight
-- READ ONLY. Run after pens_normalization_apply_UPDATE.sql and before pens_set_live_UPDATE.sql.
-- Goal: check whether each Pens URL page can match published products.

with target_pages as (
  select *
  from public.url_pages
  where slug in (
    'branded-pens-australia',
    'custom-ballpoint-pens-australia',
    'custom-metal-pens-australia',
    'custom-plastic-pens-australia',
    'custom-stylus-pens-australia',
    'custom-highlighters-australia',
    'custom-markers-australia',
    'eco-pens-australia',
    'custom-pencils-australia'
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
              (
                up.product_filter ? 'material'
                and coalesce(p.material_tags, '{}'::text[]) @> array[lower(up.product_filter->>'material')]
              )
              or (
                up.product_filter ? 'tags'
                and coalesce(p.tags, '{}'::text[]) && (
                  select array_agg(lower(value))
                  from jsonb_array_elements_text(up.product_filter->'tags') as value
                )
              )
              or (
                up.product_filter ? 'is_eco'
                and coalesce(p.is_eco, false) = (up.product_filter->>'is_eco')::boolean
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
    when 'branded-pens-australia' then 0
    when 'custom-ballpoint-pens-australia' then 1
    when 'custom-metal-pens-australia' then 2
    when 'custom-plastic-pens-australia' then 3
    when 'custom-stylus-pens-australia' then 4
    when 'custom-highlighters-australia' then 5
    when 'custom-markers-australia' then 6
    when 'eco-pens-australia' then 7
    when 'custom-pencils-australia' then 8
    else 99
  end;

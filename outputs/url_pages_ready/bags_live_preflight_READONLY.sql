-- Bags flat URL preflight
-- READ ONLY. Run after bags_normalization_apply_UPDATE.sql and before bags_set_live_UPDATE.sql.
-- Goal: check whether each Bags URL page can match published products.
-- Note: Cotton Tote Bags is checked as Bags + Tote Bags + material=cotton.

with target_pages as (
  select
    *,
    case
      when slug = 'custom-cotton-tote-bags-australia'
        then '{"type":"compound","category":"Bags","subcategory":"Tote Bags","material":"Cotton"}'::jsonb
      else product_filter
    end as effective_product_filter
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
    up.status,
    up.nav_label,
    up.product_filter,
    up.effective_product_filter,
    coalesce(up.effective_product_filter->>'type', '') as filter_type,
    (
      select count(*)
      from public.products p
      where p.is_published = true
        and (
          (
            up.effective_product_filter->>'type' = 'category'
            and p.category = up.effective_product_filter->>'category'
          )
          or (
            up.effective_product_filter->>'type' = 'subcategory'
            and p.category = up.effective_product_filter->>'category'
            and p.subcategory = up.effective_product_filter->>'subcategory'
          )
          or (
            up.effective_product_filter->>'type' = 'compound'
            and p.category = up.effective_product_filter->>'category'
            and (
              not (up.effective_product_filter ? 'subcategory')
              or p.subcategory = up.effective_product_filter->>'subcategory'
            )
            and (
              up.effective_product_filter ? 'material'
              and coalesce(p.material_tags, '{}'::text[]) @> array[lower(up.effective_product_filter->>'material')]
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
  effective_product_filter
from page_counts
order by
  case slug
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

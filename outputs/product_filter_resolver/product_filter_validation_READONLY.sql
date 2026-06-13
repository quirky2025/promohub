-- Product filter resolver validation
-- READ ONLY. Run after url_pages + products filter fields exist.
-- Purpose: count products matched by each live url_pages.product_filter.

with page_counts as (
  select
    up.slug,
    up.page_type,
    up.source_type,
    up.status,
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
              (up.product_filter ? 'material' and coalesce(p.material_tags, array[]::text[]) @> array[lower(up.product_filter->>'material')])
              or (up.product_filter ? 'tags' and coalesce(p.tags, array[]::text[]) && (
                select array_agg(lower(value))
                from jsonb_array_elements_text(up.product_filter->'tags') as value
              ))
              or (up.product_filter ? 'is_eco' and coalesce(p.is_eco, false) = (up.product_filter->>'is_eco')::boolean)
            )
          )
          or (
            up.product_filter->>'type' = 'kit_collection'
            and coalesce(p.offer_type, 'single_product') in (
              select value from jsonb_array_elements_text(up.product_filter->'offer_types') as value
            )
            and (
              coalesce((up.product_filter->>'include_all_kit_candidates')::boolean, false) = true
              or coalesce(p.kit_themes, array[]::text[]) && (
                select array_agg(value)
                from jsonb_array_elements_text(up.product_filter->'kit_themes') as value
              )
            )
          )
          or (
            up.product_filter->>'type' = 'kit_template'
            and coalesce(p.offer_type, 'single_product') in (
              select value from jsonb_array_elements_text(up.product_filter->'offer_types') as value
            )
            and coalesce(p.kit_themes, array[]::text[]) && (
              select array_agg(value)
              from jsonb_array_elements_text(up.product_filter->'kit_themes') as value
            )
          )
        )
    ) as product_count
  from public.url_pages up
  where up.status = 'live'
)
select
  slug,
  filter_type,
  product_count,
  case
    when filter_type = 'kit_template' then 'manual/template page: zero direct products can be ok if component rails render'
    when product_count = 0 then 'CHECK: empty live page'
    else 'ok'
  end as validation_note,
  product_filter
from page_counts
order by
  case when product_count = 0 and filter_type <> 'kit_template' then 0 else 1 end,
  filter_type,
  slug;

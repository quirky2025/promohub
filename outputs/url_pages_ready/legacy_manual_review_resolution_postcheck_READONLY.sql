-- Legacy manual-review residue postcheck
-- READ ONLY. Run after legacy_manual_review_resolution_apply_UPDATE.sql.
-- Expected after this manual-review batch: no rows.

with legacy_products as (
  select
    p.category as current_category,
    coalesce(nullif(p.subcategory, ''), '(blank)') as current_subcategory,
    p.is_published,
    p.supplier_sku,
    p.name
  from public.products p
  where lower(coalesce(p.category, '')) in (
    'business',
    'print',
    'promotion',
    'promotional',
    'leisure',
    'personal'
  )
),
summary as (
  select
    current_category,
    current_subcategory,
    count(*) as total_products,
    count(*) filter (where is_published = true) as published_products,
    array_agg(coalesce(supplier_sku, '(no sku)') || ' | ' || name order by name) as product_names
  from legacy_products
  group by current_category, current_subcategory
)
select
  current_category,
  current_subcategory,
  total_products,
  published_products,
  product_names as remaining_products
from summary
order by
  published_products desc,
  total_products desc,
  current_category,
  current_subcategory;

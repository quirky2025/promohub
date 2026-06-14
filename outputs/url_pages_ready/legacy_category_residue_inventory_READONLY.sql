-- QuirkyPromo legacy category residue inventory
-- READONLY. This does not change data.
-- Purpose: find products still sitting in old hidden categories after category cleanup.

with legacy_products as (
  select
    p.category as current_category,
    coalesce(nullif(p.subcategory, ''), '(blank)') as current_subcategory,
    p.is_published,
    p.name
  from public.products p
  where p.category in (
    'Business',
    'Print',
    'Personal',
    'Promotion',
    'Promotional',
    'Leisure'
  )
),
summary as (
  select
    current_category,
    current_subcategory,
    count(*) as total_products,
    count(*) filter (where is_published = true) as published_products,
    array_agg(name order by name) filter (where name is not null) as product_names
  from legacy_products
  group by current_category, current_subcategory
)
select
  current_category,
  current_subcategory,
  total_products,
  published_products,
  product_names[1:8] as example_products
from summary
order by
  published_products desc,
  total_products desc,
  current_category,
  current_subcategory;

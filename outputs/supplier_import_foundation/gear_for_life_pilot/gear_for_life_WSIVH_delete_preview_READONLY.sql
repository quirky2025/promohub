-- Gear For Life: PREVIEW what will be removed when deleting product WSIVH (discontinued).
-- READ ONLY. Run this first; confirm the numbers before running the delete DRAFT.

with
params as (
  select 'Gear For Life'::text as target_supplier,
         'WSIVH'::text         as target_sku
),
prod as (
  select id, supplier_sku, name, slug, is_published, status, fulfillment
  from public.products
  where supplier = (select target_supplier from params)
    and supplier_sku = (select target_sku from params)
)
select 'product_row'      as object, count(*)::int as rows,
       coalesce(jsonb_agg(to_jsonb(prod)), '[]'::jsonb) as details
from prod
union all
select 'pricing_tiers', count(*)::int, '{}'::jsonb
from public.pricing_tiers where product_id in (select id from prod)
union all
select 'product_colours', count(*)::int, '{}'::jsonb
from public.product_colours where product_id in (select id from prod)
union all
select 'product_images', count(*)::int, '{}'::jsonb
from public.product_images where product_id in (select id from prod);

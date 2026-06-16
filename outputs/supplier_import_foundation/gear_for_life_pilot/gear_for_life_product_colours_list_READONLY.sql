-- Gear For Life: list every product_colours row (to drive the images backfill).
-- READ ONLY. Export the result to CSV so the colour-image arrays can be built and
-- written to product_colours.images (single-colour -> product images; multi-colour ->
-- colour-specific images).

with
params as (
  select 'Gear For Life'::text as target_supplier
),
gfl_products as (
  select id, supplier_sku, name
  from public.products
  where supplier = (select target_supplier from params)
),
colour_counts as (
  select product_id, count(*)::int as colour_count
  from public.product_colours
  group by product_id
)
select
  p.supplier_sku,
  pc.name                         as colour_name,
  pc.sort_order,
  cc.colour_count,
  (cc.colour_count = 1)           as is_single_colour,
  (pc.images is null
     or jsonb_array_length(pc.images) = 0) as images_empty
from gfl_products p
join public.product_colours pc on pc.product_id = p.id
join colour_counts cc          on cc.product_id = p.id
order by p.supplier_sku, pc.sort_order, pc.name;

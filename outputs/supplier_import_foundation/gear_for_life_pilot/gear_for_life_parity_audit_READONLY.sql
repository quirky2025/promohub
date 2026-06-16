-- Gear For Life: parity audit vs existing live products.
-- READ ONLY. Purpose: see, field by field, what a published product has that a GFL
-- draft product is missing (description, material, sizes, specs, price, etc.).

-- A) all columns of products (so we know every field the detail page can use)
select 'A_products_columns' as section,
       jsonb_agg(jsonb_build_object('pos',ordinal_position,'column',column_name,'type',data_type)
                 order by ordinal_position) as details
from information_schema.columns
where table_schema='public' and table_name='products'

union all
-- B) 2 published (live) products - full row as jsonb (reference for what "complete" looks like)
select 'B_live_published_samples',
       (select jsonb_agg(to_jsonb(t)) from (
          select * from public.products
          where is_published is true
          order by created_at desc nulls last
          limit 2
       ) t)

union all
-- C) 2 GFL draft products - full row as jsonb (to compare against B)
select 'C_gfl_draft_samples',
       (select jsonb_agg(to_jsonb(t)) from (
          select * from public.products
          where supplier = 'Gear For Life'
          order by supplier_sku
          limit 2
       ) t)

union all
-- D) GFL fill-rate of common detail-page fields (how many of the 434 have each populated)
select 'D_gfl_fill_rates',
       jsonb_build_object(
         'gfl_total', (select count(*) from public.products where supplier='Gear For Life'),
         'has_description', (select count(*) from public.products where supplier='Gear For Life' and nullif(trim(coalesce(description,'')),'') is not null),
         'has_colours', (select count(*) from public.products where supplier='Gear For Life' and colours is not null and jsonb_array_length(colours)>0),
         'has_price_tiers', (select count(distinct p.id) from public.products p join public.pricing_tiers pt on pt.product_id=p.id where p.supplier='Gear For Life'),
         'is_published', (select count(*) from public.products where supplier='Gear For Life' and is_published is true)
       );

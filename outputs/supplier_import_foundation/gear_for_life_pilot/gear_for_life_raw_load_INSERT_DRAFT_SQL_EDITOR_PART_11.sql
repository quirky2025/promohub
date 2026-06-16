-- Gear For Life raw load SQL Editor split part 11
-- insert 773 rows into public.supplier_price_rows; expected count 0 -> 773
-- Run manually in Supabase SQL Editor, in numeric order only.
-- Stop immediately on any error and do not run later parts.

begin;

do $$
declare
  gfl_batch_id uuid;
begin
  select id into gfl_batch_id
  from public.supplier_import_batches
  where supplier = 'Gear For Life'
    and source_file_hash = 'f20ede9ac24d944fcb4c3c646d8ae2cbc41d2c63580200db27f2e86a96bf739c'
  order by created_at desc
  limit 1;

  if gfl_batch_id is null then
    raise exception 'Gear For Life batch row was not created. Run part 01 first.';
  end if;

  if (select count(*) from public.supplier_price_rows where batch_id = gfl_batch_id) <> 0 then
    raise exception 'part 11 expected 0 existing rows in public.supplier_price_rows. Stop: run parts in order and do not rerun completed parts.';
  end if;
end $$;

with gfl_batch as (
  select id as batch_id
  from public.supplier_import_batches
  where supplier = 'Gear For Life'
    and source_file_hash = 'f20ede9ac24d944fcb4c3c646d8ae2cbc41d2c63580200db27f2e86a96bf739c'
  order by created_at desc
  limit 1
)
insert into public.supplier_price_rows (
  batch_id, supplier, supplier_sku, currency, min_qty, max_qty, unit_cost, setup_cost, price_label, raw_json
)
select
  gfl_batch.batch_id,
  v.supplier::text, v.supplier_sku::text, v.currency::text, v.min_qty::int, v.max_qty::int, v.unit_cost::numeric, v.setup_cost::numeric, v.price_label::text, v.raw_json::jsonb
from gfl_batch
cross join (
  values
    ('Gear For Life', 'AN(C)', 'AUD', 1, null, 57, null, 'Undecorated | XS-3XL', '{"source_row_number":2,"tier_index":1,"qty":1,"unit_cost":"57","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'AN(C)', 'AUD', 100, null, 55, null, 'Undecorated | XS-3XL', '{"source_row_number":2,"tier_index":2,"qty":100,"unit_cost":"55","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'AN(P)', 'AUD', 1, null, 57, null, 'Undecorated | 4XS-5XL', '{"source_row_number":3,"tier_index":1,"qty":1,"unit_cost":"57","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'AN(P)', 'AUD', 100, null, 55, null, 'Undecorated | 4XS-5XL', '{"source_row_number":3,"tier_index":2,"qty":100,"unit_cost":"55","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'AN(Y)', 'AUD', 1, null, 57, null, 'Undecorated | 4XS-XXS', '{"source_row_number":4,"tier_index":1,"qty":1,"unit_cost":"57","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'AN(Y)', 'AUD', 100, null, 55, null, 'Undecorated | 4XS-XXS', '{"source_row_number":4,"tier_index":2,"qty":100,"unit_cost":"55","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'ASBJ', 'AUD', 1, null, 61, null, 'Undecorated | XS-5XL', '{"source_row_number":5,"tier_index":1,"qty":1,"unit_cost":"61","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'ASBJ', 'AUD', 100, null, 59, null, 'Undecorated | XS-5XL', '{"source_row_number":5,"tier_index":2,"qty":100,"unit_cost":"59","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'ASROV', 'AUD', 1, null, 79, null, 'Undecorated | XXS-5XL', '{"source_row_number":6,"tier_index":1,"qty":1,"unit_cost":"79","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'ASROV', 'AUD', 100, null, 77, null, 'Undecorated | XXS-5XL', '{"source_row_number":6,"tier_index":2,"qty":100,"unit_cost":"77","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BT', 'AUD', 1, null, 23, null, 'Undecorated | XS-5XL', '{"source_row_number":7,"tier_index":1,"qty":1,"unit_cost":"23","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BT', 'AUD', 100, null, 21, null, 'Undecorated | XS-5XL', '{"source_row_number":7,"tier_index":2,"qty":100,"unit_cost":"21","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'CWJ', 'AUD', 1, null, 55, null, 'Undecorated | XS-5XL', '{"source_row_number":8,"tier_index":1,"qty":1,"unit_cost":"55","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'CWJ', 'AUD', 100, null, 53, null, 'Undecorated | XS-5XL', '{"source_row_number":8,"tier_index":2,"qty":100,"unit_cost":"53","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DET', 'AUD', 1, null, 37, null, 'Undecorated | 3XS-3XL', '{"source_row_number":9,"tier_index":1,"qty":1,"unit_cost":"37","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DET', 'AUD', 100, null, 35, null, 'Undecorated | 3XS-3XL', '{"source_row_number":9,"tier_index":2,"qty":100,"unit_cost":"35","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DET(Y)', 'AUD', 1, null, 37, null, 'Undecorated | 3XS-XS', '{"source_row_number":10,"tier_index":1,"qty":1,"unit_cost":"37","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DET(Y)', 'AUD', 100, null, 35, null, 'Undecorated | 3XS-XS', '{"source_row_number":10,"tier_index":2,"qty":100,"unit_cost":"35","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGAXP', 'AUD', 1, null, 21, null, 'Undecorated | S-5XL', '{"source_row_number":11,"tier_index":1,"qty":1,"unit_cost":"21","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGAXP', 'AUD', 100, null, 20.5, null, 'Undecorated | S-5XL', '{"source_row_number":11,"tier_index":2,"qty":100,"unit_cost":"20.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGCHP', 'AUD', 1, null, 21, null, 'Undecorated | 4XS-5XL', '{"source_row_number":12,"tier_index":1,"qty":1,"unit_cost":"21","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGCHP', 'AUD', 100, null, 20.5, null, 'Undecorated | 4XS-5XL', '{"source_row_number":12,"tier_index":2,"qty":100,"unit_cost":"20.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGCHP(Y)', 'AUD', 1, null, 21, null, 'Undecorated | 4XS-XXS', '{"source_row_number":13,"tier_index":1,"qty":1,"unit_cost":"21","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGCHP(Y)', 'AUD', 100, null, 20.5, null, 'Undecorated | 4XS-XXS', '{"source_row_number":13,"tier_index":2,"qty":100,"unit_cost":"20.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGCP', 'AUD', 1, null, 24, null, 'Undecorated | S-5XL', '{"source_row_number":14,"tier_index":1,"qty":1,"unit_cost":"24","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGCP', 'AUD', 100, null, 23, null, 'Undecorated | S-5XL', '{"source_row_number":14,"tier_index":2,"qty":100,"unit_cost":"23","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGDP', 'AUD', 1, null, 24, null, 'Undecorated | S-5XL', '{"source_row_number":15,"tier_index":1,"qty":1,"unit_cost":"24","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGDP', 'AUD', 100, null, 23, null, 'Undecorated | S-5XL', '{"source_row_number":15,"tier_index":2,"qty":100,"unit_cost":"23","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGHP', 'AUD', 1, null, 21, null, 'Undecorated | S-5XL', '{"source_row_number":16,"tier_index":1,"qty":1,"unit_cost":"21","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGHP', 'AUD', 100, null, 20.5, null, 'Undecorated | S-5XL', '{"source_row_number":16,"tier_index":2,"qty":100,"unit_cost":"20.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGIP', 'AUD', 1, null, 24, null, 'Undecorated | S-5XL', '{"source_row_number":17,"tier_index":1,"qty":1,"unit_cost":"24","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGIP', 'AUD', 100, null, 23, null, 'Undecorated | S-5XL', '{"source_row_number":17,"tier_index":2,"qty":100,"unit_cost":"23","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGLHP', 'AUD', 1, null, 26, null, 'Undecorated | XS-3XL', '{"source_row_number":18,"tier_index":1,"qty":1,"unit_cost":"26","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGLHP', 'AUD', 100, null, 25, null, 'Undecorated | XS-3XL', '{"source_row_number":18,"tier_index":2,"qty":100,"unit_cost":"25","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGLS', 'AUD', 1, null, 22, null, 'Undecorated | S-3XL', '{"source_row_number":19,"tier_index":1,"qty":1,"unit_cost":"22","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGLS', 'AUD', 100, null, 21, null, 'Undecorated | S-3XL', '{"source_row_number":19,"tier_index":2,"qty":100,"unit_cost":"21","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGMLP', 'AUD', 1, null, 24, null, 'Undecorated | S-5XL', '{"source_row_number":20,"tier_index":1,"qty":1,"unit_cost":"24","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGMLP', 'AUD', 100, null, 23, null, 'Undecorated | S-5XL', '{"source_row_number":20,"tier_index":2,"qty":100,"unit_cost":"23","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGMP', 'AUD', 1, null, 21, null, 'Undecorated | XS-5XL', '{"source_row_number":21,"tier_index":1,"qty":1,"unit_cost":"21","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGMP', 'AUD', 100, null, 20.5, null, 'Undecorated | XS-5XL', '{"source_row_number":21,"tier_index":2,"qty":100,"unit_cost":"20.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGOL', 'AUD', 1, null, 22, null, 'Undecorated | S-5XL', '{"source_row_number":22,"tier_index":1,"qty":1,"unit_cost":"22","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGOL', 'AUD', 100, null, 21.5, null, 'Undecorated | S-5XL', '{"source_row_number":22,"tier_index":2,"qty":100,"unit_cost":"21.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGPO', 'AUD', 1, null, 24, null, 'Undecorated | XXS-5XL', '{"source_row_number":23,"tier_index":1,"qty":1,"unit_cost":"24","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGPO', 'AUD', 100, null, 23, null, 'Undecorated | XXS-5XL', '{"source_row_number":23,"tier_index":2,"qty":100,"unit_cost":"23","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGR', 'AUD', 1, null, 12, null, 'Undecorated | S-5XL', '{"source_row_number":24,"tier_index":1,"qty":1,"unit_cost":"12","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGR', 'AUD', 100, null, 11.5, null, 'Undecorated | S-5XL', '{"source_row_number":24,"tier_index":2,"qty":100,"unit_cost":"11.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGRFP', 'AUD', 1, null, 21, null, 'Undecorated | 4XS-5XL', '{"source_row_number":25,"tier_index":1,"qty":1,"unit_cost":"21","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGRFP', 'AUD', 100, null, 20.5, null, 'Undecorated | 4XS-5XL', '{"source_row_number":25,"tier_index":2,"qty":100,"unit_cost":"20.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGRFP(Y)', 'AUD', 1, null, 21, null, 'Undecorated | 4XS-XXS', '{"source_row_number":26,"tier_index":1,"qty":1,"unit_cost":"21","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGRFP(Y)', 'AUD', 100, null, 20.5, null, 'Undecorated | 4XS-XXS', '{"source_row_number":26,"tier_index":2,"qty":100,"unit_cost":"20.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGRFZ', 'AUD', 1, null, 41, null, 'Undecorated | 4XS-5XL', '{"source_row_number":27,"tier_index":1,"qty":1,"unit_cost":"41","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGRFZ', 'AUD', 100, null, 39, null, 'Undecorated | 4XS-5XL', '{"source_row_number":27,"tier_index":2,"qty":100,"unit_cost":"39","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGRFZ(Y)', 'AUD', 1, null, 41, null, 'Undecorated | 4XS-XXS', '{"source_row_number":28,"tier_index":1,"qty":1,"unit_cost":"41","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGRFZ(Y)', 'AUD', 100, null, 39, null, 'Undecorated | 4XS-XXS', '{"source_row_number":28,"tier_index":2,"qty":100,"unit_cost":"39","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGXS', 'AUD', 1, null, 21, null, 'Undecorated | L-5XL', '{"source_row_number":29,"tier_index":1,"qty":1,"unit_cost":"21","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGXS', 'AUD', 100, null, 20, null, 'Undecorated | L-5XL', '{"source_row_number":29,"tier_index":2,"qty":100,"unit_cost":"20","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WDGXS', 'AUD', 1, null, 21, null, 'Undecorated | 12-18', '{"source_row_number":30,"tier_index":1,"qty":1,"unit_cost":"21","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WDGXS', 'AUD', 100, null, 20, null, 'Undecorated | 12-18', '{"source_row_number":30,"tier_index":2,"qty":100,"unit_cost":"20","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGSH', 'AUD', 1, null, 17, null, 'Undecorated | S-5XL', '{"source_row_number":31,"tier_index":1,"qty":1,"unit_cost":"17","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGSH', 'AUD', 100, null, 16, null, 'Undecorated | S-5XL', '{"source_row_number":31,"tier_index":2,"qty":100,"unit_cost":"16","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGSP(I)', 'AUD', 1, null, 21, null, 'Undecorated | WXS-5XL', '{"source_row_number":32,"tier_index":1,"qty":1,"unit_cost":"21","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGSP(I)', 'AUD', 100, null, 20.5, null, 'Undecorated | WXS-5XL', '{"source_row_number":32,"tier_index":2,"qty":100,"unit_cost":"20.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGST(I)', 'AUD', 1, null, 18.5, null, 'Undecorated | WXS-5XL', '{"source_row_number":33,"tier_index":1,"qty":1,"unit_cost":"18.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGST(I)', 'AUD', 100, null, 18, null, 'Undecorated | WXS-5XL', '{"source_row_number":33,"tier_index":2,"qty":100,"unit_cost":"18","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGSUP', 'AUD', 1, null, 31.5, null, 'Undecorated | XS-3XL', '{"source_row_number":34,"tier_index":1,"qty":1,"unit_cost":"31.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGSUP', 'AUD', 100, null, 29.5, null, 'Undecorated | XS-3XL', '{"source_row_number":34,"tier_index":2,"qty":100,"unit_cost":"29.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGTP', 'AUD', 1, null, 24, null, 'Undecorated | S-3XL', '{"source_row_number":35,"tier_index":1,"qty":1,"unit_cost":"24","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGTP', 'AUD', 100, null, 23, null, 'Undecorated | S-3XL', '{"source_row_number":35,"tier_index":2,"qty":100,"unit_cost":"23","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGVPP', 'AUD', 1, null, 24, null, 'Undecorated | S-5XL', '{"source_row_number":36,"tier_index":1,"qty":1,"unit_cost":"24","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGVPP', 'AUD', 100, null, 23, null, 'Undecorated | S-5XL', '{"source_row_number":36,"tier_index":2,"qty":100,"unit_cost":"23","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGZP', 'AUD', 1, null, 21, null, 'Undecorated | 4XS-5XL', '{"source_row_number":37,"tier_index":1,"qty":1,"unit_cost":"21","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGZP', 'AUD', 100, null, 20.5, null, 'Undecorated | 4XS-5XL', '{"source_row_number":37,"tier_index":2,"qty":100,"unit_cost":"20.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGZP(Y)', 'AUD', 1, null, 21, null, 'Undecorated | 4XS-XXS', '{"source_row_number":38,"tier_index":1,"qty":1,"unit_cost":"21","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGZP(Y)', 'AUD', 100, null, 20.5, null, 'Undecorated | 4XS-XXS', '{"source_row_number":38,"tier_index":2,"qty":100,"unit_cost":"20.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGZT', 'AUD', 1, null, 18.5, null, 'Undecorated | 4XS-5XL', '{"source_row_number":39,"tier_index":1,"qty":1,"unit_cost":"18.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGZT', 'AUD', 100, null, 18, null, 'Undecorated | 4XS-5XL', '{"source_row_number":39,"tier_index":2,"qty":100,"unit_cost":"18","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGZT(Y)', 'AUD', 1, null, 18.5, null, 'Undecorated | 4XS-XXS', '{"source_row_number":40,"tier_index":1,"qty":1,"unit_cost":"18.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGZT(Y)', 'AUD', 100, null, 18, null, 'Undecorated | 4XS-XXS', '{"source_row_number":40,"tier_index":2,"qty":100,"unit_cost":"18","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DJ', 'AUD', 1, null, 77, null, 'Undecorated | S-5XL', '{"source_row_number":41,"tier_index":1,"qty":1,"unit_cost":"77","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DJ', 'AUD', 100, null, 75, null, 'Undecorated | S-5XL', '{"source_row_number":41,"tier_index":2,"qty":100,"unit_cost":"75","price_product_code":null,"price_notes":null}'::jsonb)
) as v(supplier, supplier_sku, currency, min_qty, max_qty, unit_cost, setup_cost, price_label, raw_json);

with gfl_batch as (
  select id as batch_id
  from public.supplier_import_batches
  where supplier = 'Gear For Life'
    and source_file_hash = 'f20ede9ac24d944fcb4c3c646d8ae2cbc41d2c63580200db27f2e86a96bf739c'
  order by created_at desc
  limit 1
)
insert into public.supplier_price_rows (
  batch_id, supplier, supplier_sku, currency, min_qty, max_qty, unit_cost, setup_cost, price_label, raw_json
)
select
  gfl_batch.batch_id,
  v.supplier::text, v.supplier_sku::text, v.currency::text, v.min_qty::int, v.max_qty::int, v.unit_cost::numeric, v.setup_cost::numeric, v.price_label::text, v.raw_json::jsonb
from gfl_batch
cross join (
  values
    ('Gear For Life', 'EGMDP', 'AUD', 1, null, 78, null, 'Undecorated | S-5XL', '{"source_row_number":42,"tier_index":1,"qty":1,"unit_cost":"78","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'EGMDP', 'AUD', 100, null, 76, null, 'Undecorated | S-5XL', '{"source_row_number":42,"tier_index":2,"qty":100,"unit_cost":"76","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'EGMFV', 'AUD', 1, null, 54, null, 'Undecorated | S-5XL', '{"source_row_number":43,"tier_index":1,"qty":1,"unit_cost":"54","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'EGMFV', 'AUD', 100, null, 52, null, 'Undecorated | S-5XL', '{"source_row_number":43,"tier_index":2,"qty":100,"unit_cost":"52","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'EGMSP', 'AUD', 1, null, 56, null, 'Undecorated | S-5XL', '{"source_row_number":44,"tier_index":1,"qty":1,"unit_cost":"56","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'EGMSP', 'AUD', 100, null, 54, null, 'Undecorated | S-5XL', '{"source_row_number":44,"tier_index":2,"qty":100,"unit_cost":"54","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'EGMZ', 'AUD', 1, null, 71.5, null, 'Undecorated | S-5XL', '{"source_row_number":45,"tier_index":1,"qty":1,"unit_cost":"71.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'EGMZ', 'AUD', 100, null, 69.5, null, 'Undecorated | S-5XL', '{"source_row_number":45,"tier_index":2,"qty":100,"unit_cost":"69.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'EJ', 'AUD', 1, null, 66, null, 'Undecorated | S-5XL', '{"source_row_number":46,"tier_index":1,"qty":1,"unit_cost":"66","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'EJ', 'AUD', 100, null, 64, null, 'Undecorated | S-5XL', '{"source_row_number":46,"tier_index":2,"qty":100,"unit_cost":"64","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'EMJ', 'AUD', 1, null, 43, null, 'Undecorated | XS-5XL', '{"source_row_number":47,"tier_index":1,"qty":1,"unit_cost":"43","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'EMJ', 'AUD', 100, null, 41, null, 'Undecorated | XS-5XL', '{"source_row_number":47,"tier_index":2,"qty":100,"unit_cost":"41","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'FP', 'AUD', 1, null, 24, null, 'Undecorated | S-5XL', '{"source_row_number":48,"tier_index":1,"qty":1,"unit_cost":"24","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'FP', 'AUD', 100, null, 23, null, 'Undecorated | S-5XL', '{"source_row_number":48,"tier_index":2,"qty":100,"unit_cost":"23","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'FPV', 'AUD', 1, null, 54.5, null, 'Undecorated | XXS-5XL', '{"source_row_number":49,"tier_index":1,"qty":1,"unit_cost":"54.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'FPV', 'AUD', 100, null, 52.5, null, 'Undecorated | XXS-5XL', '{"source_row_number":49,"tier_index":2,"qty":100,"unit_cost":"52.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'GPJ', 'AUD', 1, null, 65.5, null, 'Undecorated | XXS-5XL', '{"source_row_number":50,"tier_index":1,"qty":1,"unit_cost":"65.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'GPJ', 'AUD', 100, null, 63.5, null, 'Undecorated | XXS-5XL', '{"source_row_number":50,"tier_index":2,"qty":100,"unit_cost":"63.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'GV', 'AUD', 1, null, 31, null, 'Undecorated | XXS-5XL', '{"source_row_number":51,"tier_index":1,"qty":1,"unit_cost":"31","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'GV', 'AUD', 100, null, 29, null, 'Undecorated | XXS-5XL', '{"source_row_number":51,"tier_index":2,"qty":100,"unit_cost":"29","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'HJ', 'AUD', 1, null, 83, null, 'Undecorated | XXS-5XL', '{"source_row_number":52,"tier_index":1,"qty":1,"unit_cost":"83","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'HJ', 'AUD', 100, null, 81, null, 'Undecorated | XXS-5XL', '{"source_row_number":52,"tier_index":2,"qty":100,"unit_cost":"81","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'IPJ', 'AUD', 1, null, 28, null, 'Undecorated | S-5XL', '{"source_row_number":53,"tier_index":1,"qty":1,"unit_cost":"28","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'IPJ', 'AUD', 100, null, 26, null, 'Undecorated | S-5XL', '{"source_row_number":53,"tier_index":2,"qty":100,"unit_cost":"26","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'JO', 'AUD', 1, null, 22, null, 'Undecorated | S-3XL', '{"source_row_number":54,"tier_index":1,"qty":1,"unit_cost":"22","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'JO', 'AUD', 100, null, 21, null, 'Undecorated | S-3XL', '{"source_row_number":54,"tier_index":2,"qty":100,"unit_cost":"21","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'JP', 'AUD', 1, null, 26, null, 'Undecorated | 4XS-5XL', '{"source_row_number":55,"tier_index":1,"qty":1,"unit_cost":"26","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'JP', 'AUD', 100, null, 24, null, 'Undecorated | 4XS-5XL', '{"source_row_number":55,"tier_index":2,"qty":100,"unit_cost":"24","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'JP(Y)', 'AUD', 1, null, 26, null, 'Undecorated | 4XS-XXS', '{"source_row_number":56,"tier_index":1,"qty":1,"unit_cost":"26","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'JP(Y)', 'AUD', 100, null, 24, null, 'Undecorated | 4XS-XXS', '{"source_row_number":56,"tier_index":2,"qty":100,"unit_cost":"24","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'LV', 'AUD', 1, null, 41, null, 'Undecorated | S-3XL', '{"source_row_number":57,"tier_index":1,"qty":1,"unit_cost":"41","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'LV', 'AUD', 100, null, 39, null, 'Undecorated | S-3XL', '{"source_row_number":57,"tier_index":2,"qty":100,"unit_cost":"39","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'MJ', 'AUD', 1, null, 47.5, null, 'Undecorated | XS-5XL', '{"source_row_number":58,"tier_index":1,"qty":1,"unit_cost":"47.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'MJ', 'AUD', 100, null, 45.5, null, 'Undecorated | XS-5XL', '{"source_row_number":58,"tier_index":2,"qty":100,"unit_cost":"45.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'MWJ', 'AUD', 1, null, 95, null, 'Undecorated | S-5XL', '{"source_row_number":59,"tier_index":1,"qty":1,"unit_cost":"95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'MWJ', 'AUD', 100, null, 93, null, 'Undecorated | S-5XL', '{"source_row_number":59,"tier_index":2,"qty":100,"unit_cost":"93","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'NJ', 'AUD', 1, null, 71.5, null, 'Undecorated | XXS-5XL', '{"source_row_number":60,"tier_index":1,"qty":1,"unit_cost":"71.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'NJ', 'AUD', 100, null, 69.5, null, 'Undecorated | XXS-5XL', '{"source_row_number":60,"tier_index":2,"qty":100,"unit_cost":"69.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'NV', 'AUD', 1, null, 37.5, null, 'Undecorated | XS-3XL', '{"source_row_number":61,"tier_index":1,"qty":1,"unit_cost":"37.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'NV', 'AUD', 100, null, 35.5, null, 'Undecorated | XS-3XL', '{"source_row_number":61,"tier_index":2,"qty":100,"unit_cost":"35.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'PLJ1', 'AUD', 1, null, 79.5, null, 'Undecorated | S-5XL', '{"source_row_number":62,"tier_index":1,"qty":1,"unit_cost":"79.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'PLJ1', 'AUD', 100, null, 77.5, null, 'Undecorated | S-5XL', '{"source_row_number":62,"tier_index":2,"qty":100,"unit_cost":"77.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'RWP', 'AUD', 1, null, 17, null, 'Undecorated | S-5XL', '{"source_row_number":63,"tier_index":1,"qty":1,"unit_cost":"17","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'RWP', 'AUD', 100, null, 16, null, 'Undecorated | S-5XL', '{"source_row_number":63,"tier_index":2,"qty":100,"unit_cost":"16","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'SJ', 'AUD', 1, null, 37, null, 'Undecorated | 4XS-5XL', '{"source_row_number":64,"tier_index":1,"qty":1,"unit_cost":"37","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'SJ', 'AUD', 100, null, 35, null, 'Undecorated | 4XS-5XL', '{"source_row_number":64,"tier_index":2,"qty":100,"unit_cost":"35","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'SJ(Y)', 'AUD', 1, null, 37, null, 'Undecorated | 4XS-XXS', '{"source_row_number":65,"tier_index":1,"qty":1,"unit_cost":"37","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'SJ(Y)', 'AUD', 100, null, 35, null, 'Undecorated | 4XS-XXS', '{"source_row_number":65,"tier_index":2,"qty":100,"unit_cost":"35","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'SMJ', 'AUD', 1, null, 71, null, 'Undecorated | XXS-5XL', '{"source_row_number":66,"tier_index":1,"qty":1,"unit_cost":"71","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'SMJ', 'AUD', 100, null, 69, null, 'Undecorated | XXS-5XL', '{"source_row_number":66,"tier_index":2,"qty":100,"unit_cost":"69","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'SMV', 'AUD', 1, null, 55, null, 'Undecorated | XXS-5XL', '{"source_row_number":67,"tier_index":1,"qty":1,"unit_cost":"55","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'SMV', 'AUD', 100, null, 53, null, 'Undecorated | XXS-5XL', '{"source_row_number":67,"tier_index":2,"qty":100,"unit_cost":"53","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'TNT', 'AUD', 1, null, 41.5, null, 'Undecorated | XS-5XL', '{"source_row_number":68,"tier_index":1,"qty":1,"unit_cost":"41.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'TNT', 'AUD', 100, null, 39.5, null, 'Undecorated | XS-5XL', '{"source_row_number":68,"tier_index":2,"qty":100,"unit_cost":"39.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'TRJ', 'AUD', 1, null, 75, null, 'Undecorated | XXS-7XL', '{"source_row_number":69,"tier_index":1,"qty":1,"unit_cost":"75","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'TRJ', 'AUD', 100, null, 73, null, 'Undecorated | XXS-7XL', '{"source_row_number":69,"tier_index":2,"qty":100,"unit_cost":"73","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WDGAXP', 'AUD', 1, null, 21, null, 'Undecorated | 8-26', '{"source_row_number":70,"tier_index":1,"qty":1,"unit_cost":"21","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WDGAXP', 'AUD', 100, null, 20.5, null, 'Undecorated | 8-26', '{"source_row_number":70,"tier_index":2,"qty":100,"unit_cost":"20.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WDGCP', 'AUD', 1, null, 24, null, 'Undecorated | 8-18', '{"source_row_number":71,"tier_index":1,"qty":1,"unit_cost":"24","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WDGCP', 'AUD', 100, null, 23, null, 'Undecorated | 8-18', '{"source_row_number":71,"tier_index":2,"qty":100,"unit_cost":"23","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WDGDP', 'AUD', 1, null, 24, null, 'Undecorated | 8-22', '{"source_row_number":72,"tier_index":1,"qty":1,"unit_cost":"24","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WDGDP', 'AUD', 100, null, 23, null, 'Undecorated | 8-22', '{"source_row_number":72,"tier_index":2,"qty":100,"unit_cost":"23","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WDGHP', 'AUD', 1, null, 21, null, 'Undecorated | 8-20', '{"source_row_number":73,"tier_index":1,"qty":1,"unit_cost":"21","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WDGHP', 'AUD', 100, null, 20.5, null, 'Undecorated | 8-20', '{"source_row_number":73,"tier_index":2,"qty":100,"unit_cost":"20.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WDGMLP', 'AUD', 1, null, 24, null, 'Undecorated | 8-22', '{"source_row_number":74,"tier_index":1,"qty":1,"unit_cost":"24","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WDGMLP', 'AUD', 100, null, 23, null, 'Undecorated | 8-22', '{"source_row_number":74,"tier_index":2,"qty":100,"unit_cost":"23","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WDGMP', 'AUD', 1, null, 21, null, 'Undecorated | 8-22', '{"source_row_number":75,"tier_index":1,"qty":1,"unit_cost":"21","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WDGMP', 'AUD', 100, null, 20.5, null, 'Undecorated | 8-22', '{"source_row_number":75,"tier_index":2,"qty":100,"unit_cost":"20.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WDGOL', 'AUD', 1, null, 22, null, 'Undecorated | 8-22', '{"source_row_number":76,"tier_index":1,"qty":1,"unit_cost":"22","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WDGOL', 'AUD', 100, null, 21.5, null, 'Undecorated | 8-22', '{"source_row_number":76,"tier_index":2,"qty":100,"unit_cost":"21.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WDGP', 'AUD', 1, null, 21, null, 'Undecorated | 8-22', '{"source_row_number":77,"tier_index":1,"qty":1,"unit_cost":"21","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WDGP', 'AUD', 100, null, 20.5, null, 'Undecorated | 8-22', '{"source_row_number":77,"tier_index":2,"qty":100,"unit_cost":"20.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WDGVPP', 'AUD', 1, null, 24, null, 'Undecorated | 8-22', '{"source_row_number":78,"tier_index":1,"qty":1,"unit_cost":"24","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WDGVPP', 'AUD', 100, null, 23, null, 'Undecorated | 8-22', '{"source_row_number":78,"tier_index":2,"qty":100,"unit_cost":"23","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WDJ', 'AUD', 1, null, 77, null, 'Undecorated | 8-22', '{"source_row_number":79,"tier_index":1,"qty":1,"unit_cost":"77","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WDJ', 'AUD', 100, null, 75, null, 'Undecorated | 8-22', '{"source_row_number":79,"tier_index":2,"qty":100,"unit_cost":"75","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WEGMCD', 'AUD', 1, null, 76, null, 'Undecorated | 8-22', '{"source_row_number":80,"tier_index":1,"qty":1,"unit_cost":"76","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WEGMCD', 'AUD', 100, null, 74, null, 'Undecorated | 8-22', '{"source_row_number":80,"tier_index":2,"qty":100,"unit_cost":"74","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WEGMDP', 'AUD', 1, null, 75, null, 'Undecorated | 8-22', '{"source_row_number":81,"tier_index":1,"qty":1,"unit_cost":"75","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WEGMDP', 'AUD', 100, null, 73, null, 'Undecorated | 8-22', '{"source_row_number":81,"tier_index":2,"qty":100,"unit_cost":"73","price_product_code":null,"price_notes":null}'::jsonb)
) as v(supplier, supplier_sku, currency, min_qty, max_qty, unit_cost, setup_cost, price_label, raw_json);

with gfl_batch as (
  select id as batch_id
  from public.supplier_import_batches
  where supplier = 'Gear For Life'
    and source_file_hash = 'f20ede9ac24d944fcb4c3c646d8ae2cbc41d2c63580200db27f2e86a96bf739c'
  order by created_at desc
  limit 1
)
insert into public.supplier_price_rows (
  batch_id, supplier, supplier_sku, currency, min_qty, max_qty, unit_cost, setup_cost, price_label, raw_json
)
select
  gfl_batch.batch_id,
  v.supplier::text, v.supplier_sku::text, v.currency::text, v.min_qty::int, v.max_qty::int, v.unit_cost::numeric, v.setup_cost::numeric, v.price_label::text, v.raw_json::jsonb
from gfl_batch
cross join (
  values
    ('Gear For Life', 'WEGMFV', 'AUD', 1, null, 51, null, 'Undecorated | 8-22', '{"source_row_number":82,"tier_index":1,"qty":1,"unit_cost":"51","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WEGMFV', 'AUD', 100, null, 49, null, 'Undecorated | 8-22', '{"source_row_number":82,"tier_index":2,"qty":100,"unit_cost":"49","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WEGMSP', 'AUD', 1, null, 56, null, 'Undecorated | 8-22', '{"source_row_number":83,"tier_index":1,"qty":1,"unit_cost":"56","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WEGMSP', 'AUD', 100, null, 54, null, 'Undecorated | 8-22', '{"source_row_number":83,"tier_index":2,"qty":100,"unit_cost":"54","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WEGMZ', 'AUD', 1, null, 71.5, null, 'Undecorated | 8-18', '{"source_row_number":84,"tier_index":1,"qty":1,"unit_cost":"71.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WEGMZ', 'AUD', 100, null, 69.5, null, 'Undecorated | 8-18', '{"source_row_number":84,"tier_index":2,"qty":100,"unit_cost":"69.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WEJ', 'AUD', 1, null, 66, null, 'Undecorated | 8-18', '{"source_row_number":85,"tier_index":1,"qty":1,"unit_cost":"66","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WEJ', 'AUD', 100, null, 64, null, 'Undecorated | 8-18', '{"source_row_number":85,"tier_index":2,"qty":100,"unit_cost":"64","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WFP', 'AUD', 1, null, 24, null, 'Undecorated | 8-22', '{"source_row_number":86,"tier_index":1,"qty":1,"unit_cost":"24","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WFP', 'AUD', 100, null, 23, null, 'Undecorated | 8-22', '{"source_row_number":86,"tier_index":2,"qty":100,"unit_cost":"23","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WJO', 'AUD', 1, null, 22, null, 'Undecorated | 8-22', '{"source_row_number":87,"tier_index":1,"qty":1,"unit_cost":"22","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WJO', 'AUD', 100, null, 21, null, 'Undecorated | 8-22', '{"source_row_number":87,"tier_index":2,"qty":100,"unit_cost":"21","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WMHP', 'AUD', 1, null, 20, null, 'Undecorated | 10-18', '{"source_row_number":88,"tier_index":1,"qty":1,"unit_cost":"20","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WMHP', 'AUD', 100, null, 19, null, 'Undecorated | 10-18', '{"source_row_number":88,"tier_index":2,"qty":100,"unit_cost":"19","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WPLJ1', 'AUD', 1, null, 79.5, null, 'Undecorated | 8-22', '{"source_row_number":89,"tier_index":1,"qty":1,"unit_cost":"79.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WPLJ1', 'AUD', 100, null, 77.5, null, 'Undecorated | 8-22', '{"source_row_number":89,"tier_index":2,"qty":100,"unit_cost":"77.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WXTJ', 'AUD', 1, null, 64, null, 'Undecorated | 8-18', '{"source_row_number":90,"tier_index":1,"qty":1,"unit_cost":"64","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WXTJ', 'AUD', 100, null, 62, null, 'Undecorated | 8-18', '{"source_row_number":90,"tier_index":2,"qty":100,"unit_cost":"62","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGLAXP', 'AUD', 1, null, 26, null, 'Undecorated | XXS-5XL', '{"source_row_number":91,"tier_index":1,"qty":1,"unit_cost":"26","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGLAXP', 'AUD', 100, null, 25, null, 'Undecorated | XXS-5XL', '{"source_row_number":91,"tier_index":2,"qty":100,"unit_cost":"25","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'EOE', 'AUD', 1, null, 25, null, 'Undecorated | S-5XL', '{"source_row_number":92,"tier_index":1,"qty":1,"unit_cost":"25","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'EOE', 'AUD', 100, null, 24, null, 'Undecorated | S-5XL', '{"source_row_number":92,"tier_index":2,"qty":100,"unit_cost":"24","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'ES', 'AUD', 1, null, 21.5, null, 'Undecorated | S-4XL', '{"source_row_number":93,"tier_index":1,"qty":1,"unit_cost":"21.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'ES', 'AUD', 100, null, 19.5, null, 'Undecorated | S-4XL', '{"source_row_number":93,"tier_index":2,"qty":100,"unit_cost":"19.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'TBC', 'AUD', 1, null, 39, null, 'Undecorated | S-5XL', '{"source_row_number":94,"tier_index":1,"qty":1,"unit_cost":"39","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'TBC', 'AUD', 100, null, 37, null, 'Undecorated | S-5XL', '{"source_row_number":94,"tier_index":2,"qty":100,"unit_cost":"37","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'TBT', 'AUD', 1, null, 39, null, 'Undecorated | S-5XL', '{"source_row_number":95,"tier_index":1,"qty":1,"unit_cost":"39","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'TBT', 'AUD', 100, null, 37, null, 'Undecorated | S-5XL', '{"source_row_number":95,"tier_index":2,"qty":100,"unit_cost":"37","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'TCDH', 'AUD', 1, null, 41, null, 'Undecorated | S-5XL', '{"source_row_number":96,"tier_index":1,"qty":1,"unit_cost":"41","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'TCDH', 'AUD', 100, null, 39, null, 'Undecorated | S-5XL', '{"source_row_number":96,"tier_index":2,"qty":100,"unit_cost":"39","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'TF', 'AUD', 1, null, 40, null, 'Undecorated | S-5XL', '{"source_row_number":97,"tier_index":1,"qty":1,"unit_cost":"40","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'TF', 'AUD', 100, null, 38, null, 'Undecorated | S-5XL', '{"source_row_number":97,"tier_index":2,"qty":100,"unit_cost":"38","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'TG', 'AUD', 1, null, 38, null, 'Undecorated | S-5XL', '{"source_row_number":98,"tier_index":1,"qty":1,"unit_cost":"38","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'TG', 'AUD', 100, null, 36, null, 'Undecorated | S-5XL', '{"source_row_number":98,"tier_index":2,"qty":100,"unit_cost":"36","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'THC', 'AUD', 1, null, 40, null, 'Undecorated | S-5XL', '{"source_row_number":99,"tier_index":1,"qty":1,"unit_cost":"40","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'THC', 'AUD', 100, null, 38, null, 'Undecorated | S-5XL', '{"source_row_number":99,"tier_index":2,"qty":100,"unit_cost":"38","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'TIC', 'AUD', 1, null, 48, null, 'Undecorated | S-5XL', '{"source_row_number":100,"tier_index":1,"qty":1,"unit_cost":"48","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'TIC', 'AUD', 100, null, 46, null, 'Undecorated | S-5XL', '{"source_row_number":100,"tier_index":2,"qty":100,"unit_cost":"46","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'TKC', 'AUD', 1, null, 44, null, 'Undecorated | S-5XL', '{"source_row_number":101,"tier_index":1,"qty":1,"unit_cost":"44","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'TKC', 'AUD', 100, null, 42, null, 'Undecorated | S-5XL', '{"source_row_number":101,"tier_index":2,"qty":100,"unit_cost":"42","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'TL', 'AUD', 1, null, 27, null, 'Undecorated | S-5XL', '{"source_row_number":102,"tier_index":1,"qty":1,"unit_cost":"27","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'TL', 'AUD', 100, null, 25, null, 'Undecorated | S-5XL', '{"source_row_number":102,"tier_index":2,"qty":100,"unit_cost":"25","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'TNP', 'AUD', 1, null, 47, null, 'Undecorated | S-5XL', '{"source_row_number":103,"tier_index":1,"qty":1,"unit_cost":"47","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'TNP', 'AUD', 100, null, 45, null, 'Undecorated | S-5XL', '{"source_row_number":103,"tier_index":2,"qty":100,"unit_cost":"45","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'TOSS', 'AUD', 1, null, 23.5, null, 'Undecorated | S-2XL', '{"source_row_number":104,"tier_index":1,"qty":1,"unit_cost":"23.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'TOSS', 'AUD', 100, null, 21.5, null, 'Undecorated | S-2XL', '{"source_row_number":104,"tier_index":2,"qty":100,"unit_cost":"21.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'TPL', 'AUD', 1, null, 39, null, 'Undecorated | S-5XL', '{"source_row_number":105,"tier_index":1,"qty":1,"unit_cost":"39","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'TPL', 'AUD', 100, null, 37, null, 'Undecorated | S-5XL', '{"source_row_number":105,"tier_index":2,"qty":100,"unit_cost":"37","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'TRLS', 'AUD', 1, null, 38, null, 'Undecorated | S-5XL', '{"source_row_number":106,"tier_index":1,"qty":1,"unit_cost":"38","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'TRLS', 'AUD', 100, null, 36, null, 'Undecorated | S-5XL', '{"source_row_number":106,"tier_index":2,"qty":100,"unit_cost":"36","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'TRSS', 'AUD', 1, null, 34, null, 'Undecorated | S-5XL', '{"source_row_number":107,"tier_index":1,"qty":1,"unit_cost":"34","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'TRSS', 'AUD', 100, null, 32, null, 'Undecorated | S-5XL', '{"source_row_number":107,"tier_index":2,"qty":100,"unit_cost":"32","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'TU', 'AUD', 1, null, 25.5, null, 'Undecorated | S-5XL', '{"source_row_number":108,"tier_index":1,"qty":1,"unit_cost":"25.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'TU', 'AUD', 100, null, 23.5, null, 'Undecorated | S-5XL', '{"source_row_number":108,"tier_index":2,"qty":100,"unit_cost":"23.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'TWS', 'AUD', 1, null, 41, null, 'Undecorated | S-5XL', '{"source_row_number":109,"tier_index":1,"qty":1,"unit_cost":"41","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'TWS', 'AUD', 100, null, 39, null, 'Undecorated | S-5XL', '{"source_row_number":109,"tier_index":2,"qty":100,"unit_cost":"39","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WTCDH', 'AUD', 1, null, 39, null, 'Undecorated | 8-26', '{"source_row_number":110,"tier_index":1,"qty":1,"unit_cost":"39","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WTCDH', 'AUD', 100, null, 37, null, 'Undecorated | 8-26', '{"source_row_number":110,"tier_index":2,"qty":100,"unit_cost":"37","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WEOE', 'AUD', 1, null, 23, null, 'Undecorated | 8-22', '{"source_row_number":111,"tier_index":1,"qty":1,"unit_cost":"23","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WEOE', 'AUD', 100, null, 21, null, 'Undecorated | 8-22', '{"source_row_number":111,"tier_index":2,"qty":100,"unit_cost":"21","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WES', 'AUD', 1, null, 20.5, null, 'Undecorated | 8-22', '{"source_row_number":112,"tier_index":1,"qty":1,"unit_cost":"20.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WES', 'AUD', 100, null, 18.5, null, 'Undecorated | 8-22', '{"source_row_number":112,"tier_index":2,"qty":100,"unit_cost":"18.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WTHC', 'AUD', 1, null, 38, null, 'Undecorated | 8-26', '{"source_row_number":113,"tier_index":1,"qty":1,"unit_cost":"38","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WTHC', 'AUD', 100, null, 36, null, 'Undecorated | 8-26', '{"source_row_number":113,"tier_index":2,"qty":100,"unit_cost":"36","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WTBC', 'AUD', 1, null, 37, null, 'Undecorated | 8-26', '{"source_row_number":114,"tier_index":1,"qty":1,"unit_cost":"37","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WTBC', 'AUD', 100, null, 35, null, 'Undecorated | 8-26', '{"source_row_number":114,"tier_index":2,"qty":100,"unit_cost":"35","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WTE', 'AUD', 1, null, 27, null, 'Undecorated | 8-22', '{"source_row_number":115,"tier_index":1,"qty":1,"unit_cost":"27","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WTE', 'AUD', 100, null, 25, null, 'Undecorated | 8-22', '{"source_row_number":115,"tier_index":2,"qty":100,"unit_cost":"25","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WTEL', 'AUD', 1, null, 23, null, 'Undecorated | 8-22', '{"source_row_number":116,"tier_index":1,"qty":1,"unit_cost":"23","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WTEL', 'AUD', 100, null, 21, null, 'Undecorated | 8-22', '{"source_row_number":116,"tier_index":2,"qty":100,"unit_cost":"21","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WTF', 'AUD', 1, null, 38, null, 'Undecorated | 8-26', '{"source_row_number":117,"tier_index":1,"qty":1,"unit_cost":"38","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WTF', 'AUD', 100, null, 36, null, 'Undecorated | 8-26', '{"source_row_number":117,"tier_index":2,"qty":100,"unit_cost":"36","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WTG', 'AUD', 1, null, 36, null, 'Undecorated | 8-22', '{"source_row_number":118,"tier_index":1,"qty":1,"unit_cost":"36","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WTG', 'AUD', 100, null, 34, null, 'Undecorated | 8-22', '{"source_row_number":118,"tier_index":2,"qty":100,"unit_cost":"34","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WTIC', 'AUD', 1, null, 46, null, 'Undecorated | 8-18', '{"source_row_number":119,"tier_index":1,"qty":1,"unit_cost":"46","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WTIC', 'AUD', 100, null, 44, null, 'Undecorated | 8-18', '{"source_row_number":119,"tier_index":2,"qty":100,"unit_cost":"44","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WTKC', 'AUD', 1, null, 41, null, 'Undecorated | 8-26', '{"source_row_number":120,"tier_index":1,"qty":1,"unit_cost":"41","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WTKC', 'AUD', 100, null, 39, null, 'Undecorated | 8-26', '{"source_row_number":120,"tier_index":2,"qty":100,"unit_cost":"39","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WTL', 'AUD', 1, null, 25, null, 'Undecorated | 8-22', '{"source_row_number":121,"tier_index":1,"qty":1,"unit_cost":"25","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WTL', 'AUD', 100, null, 23, null, 'Undecorated | 8-22', '{"source_row_number":121,"tier_index":2,"qty":100,"unit_cost":"23","price_product_code":null,"price_notes":null}'::jsonb)
) as v(supplier, supplier_sku, currency, min_qty, max_qty, unit_cost, setup_cost, price_label, raw_json);

with gfl_batch as (
  select id as batch_id
  from public.supplier_import_batches
  where supplier = 'Gear For Life'
    and source_file_hash = 'f20ede9ac24d944fcb4c3c646d8ae2cbc41d2c63580200db27f2e86a96bf739c'
  order by created_at desc
  limit 1
)
insert into public.supplier_price_rows (
  batch_id, supplier, supplier_sku, currency, min_qty, max_qty, unit_cost, setup_cost, price_label, raw_json
)
select
  gfl_batch.batch_id,
  v.supplier::text, v.supplier_sku::text, v.currency::text, v.min_qty::int, v.max_qty::int, v.unit_cost::numeric, v.setup_cost::numeric, v.price_label::text, v.raw_json::jsonb
from gfl_batch
cross join (
  values
    ('Gear For Life', 'WTMC', 'AUD', 1, null, 35, null, 'Undecorated | 8-24', '{"source_row_number":122,"tier_index":1,"qty":1,"unit_cost":"35","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WTMC', 'AUD', 100, null, 33, null, 'Undecorated | 8-24', '{"source_row_number":122,"tier_index":2,"qty":100,"unit_cost":"33","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WTMO', 'AUD', 1, null, 17.5, null, 'Undecorated | 8-22', '{"source_row_number":123,"tier_index":1,"qty":1,"unit_cost":"17.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WTMO', 'AUD', 100, null, 16.5, null, 'Undecorated | 8-22', '{"source_row_number":123,"tier_index":2,"qty":100,"unit_cost":"16.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WTMT', 'AUD', 1, null, 21, null, 'Undecorated | 8-22', '{"source_row_number":124,"tier_index":1,"qty":1,"unit_cost":"21","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WTMT', 'AUD', 100, null, 19, null, 'Undecorated | 8-22', '{"source_row_number":124,"tier_index":2,"qty":100,"unit_cost":"19","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WTNP', 'AUD', 1, null, 45, null, 'Undecorated | 8-26', '{"source_row_number":125,"tier_index":1,"qty":1,"unit_cost":"45","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WTNP', 'AUD', 100, null, 43, null, 'Undecorated | 8-26', '{"source_row_number":125,"tier_index":2,"qty":100,"unit_cost":"43","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WTPL', 'AUD', 1, null, 37, null, 'Undecorated | 8-22', '{"source_row_number":126,"tier_index":1,"qty":1,"unit_cost":"37","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WTPL', 'AUD', 100, null, 35, null, 'Undecorated | 8-22', '{"source_row_number":126,"tier_index":2,"qty":100,"unit_cost":"35","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WTRLS', 'AUD', 1, null, 36, null, 'Undecorated | 8-22', '{"source_row_number":127,"tier_index":1,"qty":1,"unit_cost":"36","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WTRLS', 'AUD', 100, null, 34, null, 'Undecorated | 8-22', '{"source_row_number":127,"tier_index":2,"qty":100,"unit_cost":"34","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WTRSS', 'AUD', 1, null, 32, null, 'Undecorated | 8-22', '{"source_row_number":128,"tier_index":1,"qty":1,"unit_cost":"32","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WTRSS', 'AUD', 100, null, 30, null, 'Undecorated | 8-22', '{"source_row_number":128,"tier_index":2,"qty":100,"unit_cost":"30","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WTU', 'AUD', 1, null, 23.5, null, 'Undecorated | 8-22', '{"source_row_number":129,"tier_index":1,"qty":1,"unit_cost":"23.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WTU', 'AUD', 100, null, 21.5, null, 'Undecorated | 8-22', '{"source_row_number":129,"tier_index":2,"qty":100,"unit_cost":"21.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WTV', 'AUD', 1, null, 24, null, 'Undecorated | 8-22', '{"source_row_number":130,"tier_index":1,"qty":1,"unit_cost":"24","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WTV', 'AUD', 100, null, 22, null, 'Undecorated | 8-22', '{"source_row_number":130,"tier_index":2,"qty":100,"unit_cost":"22","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WTWS', 'AUD', 1, null, 39, null, 'Undecorated | 8-22', '{"source_row_number":131,"tier_index":1,"qty":1,"unit_cost":"39","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WTWS', 'AUD', 100, null, 37, null, 'Undecorated | 8-22', '{"source_row_number":131,"tier_index":2,"qty":100,"unit_cost":"37","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BBB', 'AUD', 1, null, 27, null, 'Undecorated', '{"source_row_number":132,"tier_index":1,"qty":1,"unit_cost":"27","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BBB', 'AUD', 100, null, 25, null, 'Undecorated', '{"source_row_number":132,"tier_index":2,"qty":100,"unit_cost":"25","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BBCC', 'AUD', 1, null, 18.5, null, 'Undecorated', '{"source_row_number":133,"tier_index":1,"qty":1,"unit_cost":"18.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BBCC', 'AUD', 100, null, 17.5, null, 'Undecorated', '{"source_row_number":133,"tier_index":2,"qty":100,"unit_cost":"17.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BBISC', 'AUD', 1, null, 18, null, 'Undecorated', '{"source_row_number":134,"tier_index":1,"qty":1,"unit_cost":"18","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BBISC', 'AUD', 100, null, 17, null, 'Undecorated', '{"source_row_number":134,"tier_index":2,"qty":100,"unit_cost":"17","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BBT', 'AUD', 1, null, 81, null, 'Undecorated', '{"source_row_number":135,"tier_index":1,"qty":1,"unit_cost":"81","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BBT', 'AUD', 100, null, 78, null, 'Undecorated', '{"source_row_number":135,"tier_index":2,"qty":100,"unit_cost":"78","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BBYCS', 'AUD', 1, null, 51, null, 'Undecorated', '{"source_row_number":136,"tier_index":1,"qty":1,"unit_cost":"51","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BBYCS', 'AUD', 100, null, 49, null, 'Undecorated', '{"source_row_number":136,"tier_index":2,"qty":100,"unit_cost":"49","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BCOS', 'AUD', 1, null, 17, null, 'Undecorated', '{"source_row_number":137,"tier_index":1,"qty":1,"unit_cost":"17","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BCOS', 'AUD', 100, null, 16, null, 'Undecorated', '{"source_row_number":137,"tier_index":2,"qty":100,"unit_cost":"16","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BCR', 'AUD', 1, null, 27, null, 'Undecorated', '{"source_row_number":138,"tier_index":1,"qty":1,"unit_cost":"27","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BCR', 'AUD', 100, null, 25, null, 'Undecorated', '{"source_row_number":138,"tier_index":2,"qty":100,"unit_cost":"25","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BCTS', 'AUD', 1, null, 28, null, 'Undecorated', '{"source_row_number":139,"tier_index":1,"qty":1,"unit_cost":"28","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BCTS', 'AUD', 100, null, 26, null, 'Undecorated', '{"source_row_number":139,"tier_index":2,"qty":100,"unit_cost":"26","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BDUC', 'AUD', 1, null, 28, null, 'Undecorated', '{"source_row_number":140,"tier_index":1,"qty":1,"unit_cost":"28","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BDUC', 'AUD', 100, null, 26, null, 'Undecorated', '{"source_row_number":140,"tier_index":2,"qty":100,"unit_cost":"26","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BEC', 'AUD', 1, null, 26.5, null, 'Undecorated', '{"source_row_number":141,"tier_index":1,"qty":1,"unit_cost":"26.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BEC', 'AUD', 100, null, 24.5, null, 'Undecorated', '{"source_row_number":141,"tier_index":2,"qty":100,"unit_cost":"24.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BES', 'AUD', 1, null, 15, null, 'Undecorated', '{"source_row_number":142,"tier_index":1,"qty":1,"unit_cost":"15","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BES', 'AUD', 100, null, 14, null, 'Undecorated', '{"source_row_number":142,"tier_index":2,"qty":100,"unit_cost":"14","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BFGB', 'AUD', 1, null, 24, null, 'Undecorated', '{"source_row_number":143,"tier_index":1,"qty":1,"unit_cost":"24","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BFGB', 'AUD', 100, null, 22, null, 'Undecorated', '{"source_row_number":143,"tier_index":2,"qty":100,"unit_cost":"22","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BFLB', 'AUD', 1, null, 22.5, null, 'Undecorated', '{"source_row_number":144,"tier_index":1,"qty":1,"unit_cost":"22.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BFLB', 'AUD', 100, null, 20.5, null, 'Undecorated', '{"source_row_number":144,"tier_index":2,"qty":100,"unit_cost":"20.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BFMC', 'AUD', 1, null, 30, null, 'Undecorated', '{"source_row_number":145,"tier_index":1,"qty":1,"unit_cost":"30","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BFMC', 'AUD', 100, null, 28, null, 'Undecorated', '{"source_row_number":145,"tier_index":2,"qty":100,"unit_cost":"28","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BGMB', 'AUD', 1, null, 33, null, 'Undecorated', '{"source_row_number":146,"tier_index":1,"qty":1,"unit_cost":"33","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BGMB', 'AUD', 100, null, 31, null, 'Undecorated', '{"source_row_number":146,"tier_index":2,"qty":100,"unit_cost":"31","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BHVS', 'AUD', 1, null, 24, null, 'Undecorated', '{"source_row_number":147,"tier_index":1,"qty":1,"unit_cost":"24","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BHVS', 'AUD', 100, null, 22, null, 'Undecorated', '{"source_row_number":147,"tier_index":2,"qty":100,"unit_cost":"22","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BIB', 'AUD', 1, null, 46, null, 'Undecorated', '{"source_row_number":148,"tier_index":1,"qty":1,"unit_cost":"46","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BIB', 'AUD', 100, null, 44, null, 'Undecorated', '{"source_row_number":148,"tier_index":2,"qty":100,"unit_cost":"44","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BICB', 'AUD', 1, null, 57, null, 'Undecorated', '{"source_row_number":149,"tier_index":1,"qty":1,"unit_cost":"57","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BICB', 'AUD', 100, null, 55, null, 'Undecorated', '{"source_row_number":149,"tier_index":2,"qty":100,"unit_cost":"55","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BKDS', 'AUD', 1, null, 42.5, null, 'Undecorated', '{"source_row_number":150,"tier_index":1,"qty":1,"unit_cost":"42.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BKDS', 'AUD', 100, null, 40.5, null, 'Undecorated', '{"source_row_number":150,"tier_index":2,"qty":100,"unit_cost":"40.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BKKS', 'AUD', 1, null, 26, null, 'Undecorated', '{"source_row_number":151,"tier_index":1,"qty":1,"unit_cost":"26","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BKKS', 'AUD', 100, null, 24, null, 'Undecorated', '{"source_row_number":151,"tier_index":2,"qty":100,"unit_cost":"24","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BLD', 'AUD', 1, null, 39, null, 'Undecorated', '{"source_row_number":152,"tier_index":1,"qty":1,"unit_cost":"39","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BLD', 'AUD', 100, null, 37, null, 'Undecorated', '{"source_row_number":152,"tier_index":2,"qty":100,"unit_cost":"37","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BMO', 'AUD', 1, null, 40, null, 'Undecorated', '{"source_row_number":153,"tier_index":1,"qty":1,"unit_cost":"40","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BMO', 'AUD', 100, null, 38, null, 'Undecorated', '{"source_row_number":153,"tier_index":2,"qty":100,"unit_cost":"38","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BMS', 'AUD', 1, null, 45, null, 'Undecorated', '{"source_row_number":154,"tier_index":1,"qty":1,"unit_cost":"45","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BMS', 'AUD', 100, null, 43, null, 'Undecorated', '{"source_row_number":154,"tier_index":2,"qty":100,"unit_cost":"43","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BNC', 'AUD', 1, null, 51, null, 'Undecorated', '{"source_row_number":155,"tier_index":1,"qty":1,"unit_cost":"51","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BNC', 'AUD', 100, null, 49, null, 'Undecorated', '{"source_row_number":155,"tier_index":2,"qty":100,"unit_cost":"49","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BGLB', 'AUD', 1, null, 48, null, 'Undecorated', '{"source_row_number":156,"tier_index":1,"qty":1,"unit_cost":"48","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BGLB', 'AUD', 100, null, 46, null, 'Undecorated', '{"source_row_number":156,"tier_index":2,"qty":100,"unit_cost":"46","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BNWB', 'AUD', 1, null, 40, null, 'Undecorated', '{"source_row_number":157,"tier_index":1,"qty":1,"unit_cost":"40","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BNWB', 'AUD', 100, null, 38, null, 'Undecorated', '{"source_row_number":157,"tier_index":2,"qty":100,"unit_cost":"38","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BPOB', 'AUD', 1, null, 43, null, 'Undecorated', '{"source_row_number":158,"tier_index":1,"qty":1,"unit_cost":"43","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BPOB', 'AUD', 100, null, 41, null, 'Undecorated', '{"source_row_number":158,"tier_index":2,"qty":100,"unit_cost":"41","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BPOCB', 'AUD', 1, null, 49, null, 'Undecorated', '{"source_row_number":159,"tier_index":1,"qty":1,"unit_cost":"49","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BPOCB', 'AUD', 100, null, 47, null, 'Undecorated', '{"source_row_number":159,"tier_index":2,"qty":100,"unit_cost":"47","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BPS', 'AUD', 1, null, 27, null, 'Undecorated', '{"source_row_number":160,"tier_index":1,"qty":1,"unit_cost":"27","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BPS', 'AUD', 100, null, 25, null, 'Undecorated', '{"source_row_number":160,"tier_index":2,"qty":100,"unit_cost":"25","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BRCS', 'AUD', 1, null, 35, null, 'Undecorated', '{"source_row_number":161,"tier_index":1,"qty":1,"unit_cost":"35","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BRCS', 'AUD', 100, null, 33, null, 'Undecorated', '{"source_row_number":161,"tier_index":2,"qty":100,"unit_cost":"33","price_product_code":null,"price_notes":null}'::jsonb)
) as v(supplier, supplier_sku, currency, min_qty, max_qty, unit_cost, setup_cost, price_label, raw_json);

with gfl_batch as (
  select id as batch_id
  from public.supplier_import_batches
  where supplier = 'Gear For Life'
    and source_file_hash = 'f20ede9ac24d944fcb4c3c646d8ae2cbc41d2c63580200db27f2e86a96bf739c'
  order by created_at desc
  limit 1
)
insert into public.supplier_price_rows (
  batch_id, supplier, supplier_sku, currency, min_qty, max_qty, unit_cost, setup_cost, price_label, raw_json
)
select
  gfl_batch.batch_id,
  v.supplier::text, v.supplier_sku::text, v.currency::text, v.min_qty::int, v.max_qty::int, v.unit_cost::numeric, v.setup_cost::numeric, v.price_label::text, v.raw_json::jsonb
from gfl_batch
cross join (
  values
    ('Gear For Life', 'BRFB', 'AUD', 1, null, 27, null, 'Undecorated', '{"source_row_number":162,"tier_index":1,"qty":1,"unit_cost":"27","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BRFB', 'AUD', 100, null, 25, null, 'Undecorated', '{"source_row_number":162,"tier_index":2,"qty":100,"unit_cost":"25","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BRFS', 'AUD', 1, null, 30, null, 'Undecorated', '{"source_row_number":163,"tier_index":1,"qty":1,"unit_cost":"30","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BRFS', 'AUD', 100, null, 28, null, 'Undecorated', '{"source_row_number":163,"tier_index":2,"qty":100,"unit_cost":"28","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BRS', 'AUD', 1, null, 23, null, 'Undecorated', '{"source_row_number":164,"tier_index":1,"qty":1,"unit_cost":"23","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BRS', 'AUD', 100, null, 21, null, 'Undecorated', '{"source_row_number":164,"tier_index":2,"qty":100,"unit_cost":"21","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BRTS', 'AUD', 1, null, 25, null, 'Undecorated', '{"source_row_number":165,"tier_index":1,"qty":1,"unit_cost":"25","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BRTS', 'AUD', 100, null, 23, null, 'Undecorated', '{"source_row_number":165,"tier_index":2,"qty":100,"unit_cost":"23","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BSB', 'AUD', 1, null, 29, null, 'Undecorated', '{"source_row_number":166,"tier_index":1,"qty":1,"unit_cost":"29","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BSB', 'AUD', 100, null, 27, null, 'Undecorated', '{"source_row_number":166,"tier_index":2,"qty":100,"unit_cost":"27","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BSLB', 'AUD', 1, null, 26, null, 'Undecorated', '{"source_row_number":167,"tier_index":1,"qty":1,"unit_cost":"26","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BSLB', 'AUD', 100, null, 24, null, 'Undecorated', '{"source_row_number":167,"tier_index":2,"qty":100,"unit_cost":"24","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BSM', 'AUD', 1, null, 12, null, 'Undecorated', '{"source_row_number":168,"tier_index":1,"qty":1,"unit_cost":"12","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BSM', 'AUD', 100, null, 11, null, 'Undecorated', '{"source_row_number":168,"tier_index":2,"qty":100,"unit_cost":"11","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BSPB', 'AUD', 1, null, 27, null, 'Undecorated', '{"source_row_number":169,"tier_index":1,"qty":1,"unit_cost":"27","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BSPB', 'AUD', 100, null, 25, null, 'Undecorated', '{"source_row_number":169,"tier_index":2,"qty":100,"unit_cost":"25","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BSPS', 'AUD', 1, null, 30, null, 'Undecorated', '{"source_row_number":170,"tier_index":1,"qty":1,"unit_cost":"30","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BSPS', 'AUD', 100, null, 28, null, 'Undecorated', '{"source_row_number":170,"tier_index":2,"qty":100,"unit_cost":"28","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BST', 'AUD', 1, null, 74, null, 'Undecorated', '{"source_row_number":171,"tier_index":1,"qty":1,"unit_cost":"74","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BST', 'AUD', 100, null, 71, null, 'Undecorated', '{"source_row_number":171,"tier_index":2,"qty":100,"unit_cost":"71","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BTGB', 'AUD', 1, null, 45, null, 'Undecorated', '{"source_row_number":172,"tier_index":1,"qty":1,"unit_cost":"45","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BTGB', 'AUD', 100, null, 43, null, 'Undecorated', '{"source_row_number":172,"tier_index":2,"qty":100,"unit_cost":"43","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BTLT', 'AUD', 1, null, 54, null, 'Undecorated', '{"source_row_number":173,"tier_index":1,"qty":1,"unit_cost":"54","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BTLT', 'AUD', 100, null, 52, null, 'Undecorated', '{"source_row_number":173,"tier_index":2,"qty":100,"unit_cost":"52","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BTNT', 'AUD', 1, null, 78, null, 'Undecorated', '{"source_row_number":174,"tier_index":1,"qty":1,"unit_cost":"78","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BTNT', 'AUD', 100, null, 75, null, 'Undecorated', '{"source_row_number":174,"tier_index":2,"qty":100,"unit_cost":"75","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BTS', 'AUD', 1, null, 18.5, null, 'Undecorated', '{"source_row_number":175,"tier_index":1,"qty":1,"unit_cost":"18.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BTS', 'AUD', 100, null, 16.5, null, 'Undecorated', '{"source_row_number":175,"tier_index":2,"qty":100,"unit_cost":"16.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BTT', 'AUD', 1, null, 89, null, 'Undecorated', '{"source_row_number":176,"tier_index":1,"qty":1,"unit_cost":"89","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BTT', 'AUD', 100, null, 86, null, 'Undecorated', '{"source_row_number":176,"tier_index":2,"qty":100,"unit_cost":"86","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BUCB', 'AUD', 1, null, 36, null, 'Undecorated', '{"source_row_number":177,"tier_index":1,"qty":1,"unit_cost":"36","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BUCB', 'AUD', 100, null, 34, null, 'Undecorated', '{"source_row_number":177,"tier_index":2,"qty":100,"unit_cost":"34","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BWIB', 'AUD', 1, null, 40, null, 'Undecorated', '{"source_row_number":178,"tier_index":1,"qty":1,"unit_cost":"40","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BWIB', 'AUD', 100, null, 38, null, 'Undecorated', '{"source_row_number":178,"tier_index":2,"qty":100,"unit_cost":"38","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BWICB', 'AUD', 1, null, 44, null, 'Undecorated', '{"source_row_number":179,"tier_index":1,"qty":1,"unit_cost":"44","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BWICB', 'AUD', 100, null, 42, null, 'Undecorated', '{"source_row_number":179,"tier_index":2,"qty":100,"unit_cost":"42","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BYB', 'AUD', 1, null, 28, null, 'Undecorated', '{"source_row_number":180,"tier_index":1,"qty":1,"unit_cost":"28","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BYB', 'AUD', 100, null, 26, null, 'Undecorated', '{"source_row_number":180,"tier_index":2,"qty":100,"unit_cost":"26","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POAGC', 'AUD', 1, null, 24, null, 'Undecorated', '{"source_row_number":181,"tier_index":1,"qty":1,"unit_cost":"24","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POAGC', 'AUD', 100, null, 22, null, 'Undecorated', '{"source_row_number":181,"tier_index":2,"qty":100,"unit_cost":"22","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BBPTS', 'AUD', 1, null, 49, null, 'Undecorated', '{"source_row_number":182,"tier_index":1,"qty":1,"unit_cost":"49","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BBPTS', 'AUD', 100, null, 47, null, 'Undecorated', '{"source_row_number":182,"tier_index":2,"qty":100,"unit_cost":"47","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POBT', 'AUD', 1, null, 26, null, 'Undecorated', '{"source_row_number":183,"tier_index":1,"qty":1,"unit_cost":"26","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POBT', 'AUD', 100, null, 24, null, 'Undecorated', '{"source_row_number":183,"tier_index":2,"qty":100,"unit_cost":"24","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POBCS', 'AUD', 1, null, 22, null, 'Undecorated', '{"source_row_number":184,"tier_index":1,"qty":1,"unit_cost":"22","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POBCS', 'AUD', 100, null, 20, null, 'Undecorated', '{"source_row_number":184,"tier_index":2,"qty":100,"unit_cost":"20","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POBCK', 'AUD', 1, null, 30, null, 'Undecorated', '{"source_row_number":185,"tier_index":1,"qty":1,"unit_cost":"30","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POBCK', 'AUD', 100, null, 28, null, 'Undecorated', '{"source_row_number":185,"tier_index":2,"qty":100,"unit_cost":"28","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POCS', 'AUD', 1, null, 29, null, 'Undecorated', '{"source_row_number":186,"tier_index":1,"qty":1,"unit_cost":"29","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POCS', 'AUD', 100, null, 27, null, 'Undecorated', '{"source_row_number":186,"tier_index":2,"qty":100,"unit_cost":"27","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POCHB', 'AUD', 1, null, 21.5, null, 'Undecorated', '{"source_row_number":187,"tier_index":1,"qty":1,"unit_cost":"21.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POCHB', 'AUD', 100, null, 19.5, null, 'Undecorated', '{"source_row_number":187,"tier_index":2,"qty":100,"unit_cost":"19.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POCCB', 'AUD', 1, null, 29.5, null, 'Undecorated', '{"source_row_number":188,"tier_index":1,"qty":1,"unit_cost":"29.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POCCB', 'AUD', 100, null, 27.5, null, 'Undecorated', '{"source_row_number":188,"tier_index":2,"qty":100,"unit_cost":"27.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POCBGS', 'AUD', 1, null, 34, null, 'Undecorated', '{"source_row_number":189,"tier_index":1,"qty":1,"unit_cost":"34","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POCBGS', 'AUD', 100, null, 32, null, 'Undecorated', '{"source_row_number":189,"tier_index":2,"qty":100,"unit_cost":"32","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'PODCS', 'AUD', 1, null, 32, null, 'Undecorated', '{"source_row_number":190,"tier_index":1,"qty":1,"unit_cost":"32","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'PODCS', 'AUD', 100, null, 30, null, 'Undecorated', '{"source_row_number":190,"tier_index":2,"qty":100,"unit_cost":"30","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'PODIGB', 'AUD', 1, null, 43.5, null, 'Undecorated', '{"source_row_number":191,"tier_index":1,"qty":1,"unit_cost":"43.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'PODIGB', 'AUD', 100, null, 41.5, null, 'Undecorated', '{"source_row_number":191,"tier_index":2,"qty":100,"unit_cost":"41.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POEGB', 'AUD', 1, null, 15, null, 'Undecorated', '{"source_row_number":192,"tier_index":1,"qty":1,"unit_cost":"15","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POEGB', 'AUD', 100, null, 14, null, 'Undecorated', '{"source_row_number":192,"tier_index":2,"qty":100,"unit_cost":"14","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POEB', 'AUD', 1, null, 29, null, 'Undecorated', '{"source_row_number":193,"tier_index":1,"qty":1,"unit_cost":"29","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POEB', 'AUD', 100, null, 27, null, 'Undecorated', '{"source_row_number":193,"tier_index":2,"qty":100,"unit_cost":"27","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POFCK', 'AUD', 1, null, 8, null, 'Undecorated', '{"source_row_number":194,"tier_index":1,"qty":1,"unit_cost":"8","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POFCK', 'AUD', 100, null, 7, null, 'Undecorated', '{"source_row_number":194,"tier_index":2,"qty":100,"unit_cost":"7","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POFCKS', 'AUD', 1, null, 21.5, null, 'Undecorated', '{"source_row_number":195,"tier_index":1,"qty":1,"unit_cost":"21.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POFCKS', 'AUD', 100, null, 19.5, null, 'Undecorated', '{"source_row_number":195,"tier_index":2,"qty":100,"unit_cost":"19.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POGGS', 'AUD', 1, null, 30, null, 'Undecorated', '{"source_row_number":196,"tier_index":1,"qty":1,"unit_cost":"30","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POGGS', 'AUD', 100, null, 28, null, 'Undecorated', '{"source_row_number":196,"tier_index":2,"qty":100,"unit_cost":"28","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POCB', 'AUD', 1, null, 35, null, 'Undecorated', '{"source_row_number":197,"tier_index":1,"qty":1,"unit_cost":"35","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POCB', 'AUD', 100, null, 33, null, 'Undecorated', '{"source_row_number":197,"tier_index":2,"qty":100,"unit_cost":"33","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POGTT', 'AUD', 1, null, 42.5, null, 'Undecorated', '{"source_row_number":198,"tier_index":1,"qty":1,"unit_cost":"42.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POGTT', 'AUD', 100, null, 40, null, 'Undecorated', '{"source_row_number":198,"tier_index":2,"qty":100,"unit_cost":"40","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POHC', 'AUD', 1, null, 55, null, 'Undecorated', '{"source_row_number":199,"tier_index":1,"qty":1,"unit_cost":"55","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POHC', 'AUD', 100, null, 53, null, 'Undecorated', '{"source_row_number":199,"tier_index":2,"qty":100,"unit_cost":"53","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POLDBS', 'AUD', 1, null, 42, null, 'Undecorated', '{"source_row_number":200,"tier_index":1,"qty":1,"unit_cost":"42","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POLDBS', 'AUD', 100, null, 40, null, 'Undecorated', '{"source_row_number":200,"tier_index":2,"qty":100,"unit_cost":"40","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'PONSB', 'AUD', 1, null, 25.5, null, 'Undecorated', '{"source_row_number":201,"tier_index":1,"qty":1,"unit_cost":"25.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'PONSB', 'AUD', 100, null, 23.5, null, 'Undecorated', '{"source_row_number":201,"tier_index":2,"qty":100,"unit_cost":"23.5","price_product_code":null,"price_notes":null}'::jsonb)
) as v(supplier, supplier_sku, currency, min_qty, max_qty, unit_cost, setup_cost, price_label, raw_json);

with gfl_batch as (
  select id as batch_id
  from public.supplier_import_batches
  where supplier = 'Gear For Life'
    and source_file_hash = 'f20ede9ac24d944fcb4c3c646d8ae2cbc41d2c63580200db27f2e86a96bf739c'
  order by created_at desc
  limit 1
)
insert into public.supplier_price_rows (
  batch_id, supplier, supplier_sku, currency, min_qty, max_qty, unit_cost, setup_cost, price_label, raw_json
)
select
  gfl_batch.batch_id,
  v.supplier::text, v.supplier_sku::text, v.currency::text, v.min_qty::int, v.max_qty::int, v.unit_cost::numeric, v.setup_cost::numeric, v.price_label::text, v.raw_json::jsonb
from gfl_batch
cross join (
  values
    ('Gear For Life', 'POOC', 'AUD', 1, null, 16, null, 'Undecorated', '{"source_row_number":202,"tier_index":1,"qty":1,"unit_cost":"16","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POOC', 'AUD', 100, null, 15, null, 'Undecorated', '{"source_row_number":202,"tier_index":2,"qty":100,"unit_cost":"15","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POOT', 'AUD', 1, null, 17, null, 'Undecorated', '{"source_row_number":203,"tier_index":1,"qty":1,"unit_cost":"17","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POOT', 'AUD', 100, null, 16, null, 'Undecorated', '{"source_row_number":203,"tier_index":2,"qty":100,"unit_cost":"16","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POOFP', 'AUD', 1, null, 47, null, 'Undecorated', '{"source_row_number":204,"tier_index":1,"qty":1,"unit_cost":"47","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POOFP', 'AUD', 100, null, 45, null, 'Undecorated', '{"source_row_number":204,"tier_index":2,"qty":100,"unit_cost":"45","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POOB', 'AUD', 1, null, 26, null, 'Undecorated', '{"source_row_number":205,"tier_index":1,"qty":1,"unit_cost":"26","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POOB', 'AUD', 100, null, 24, null, 'Undecorated', '{"source_row_number":205,"tier_index":2,"qty":100,"unit_cost":"24","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POGB', 'AUD', 1, null, 13.5, null, 'Undecorated', '{"source_row_number":206,"tier_index":1,"qty":1,"unit_cost":"13.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POGB', 'AUD', 100, null, 12.5, null, 'Undecorated', '{"source_row_number":206,"tier_index":2,"qty":100,"unit_cost":"12.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POPPS', 'AUD', 1, null, 37, null, 'Undecorated', '{"source_row_number":207,"tier_index":1,"qty":1,"unit_cost":"37","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POPPS', 'AUD', 100, null, 35, null, 'Undecorated', '{"source_row_number":207,"tier_index":2,"qty":100,"unit_cost":"35","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POQES', 'AUD', 1, null, 18, null, 'Undecorated', '{"source_row_number":208,"tier_index":1,"qty":1,"unit_cost":"18","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POQES', 'AUD', 100, null, 17, null, 'Undecorated', '{"source_row_number":208,"tier_index":2,"qty":100,"unit_cost":"17","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'PORC', 'AUD', 1, null, 76, null, 'Undecorated', '{"source_row_number":209,"tier_index":1,"qty":1,"unit_cost":"76","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'PORC', 'AUD', 100, null, 74, null, 'Undecorated', '{"source_row_number":209,"tier_index":2,"qty":100,"unit_cost":"74","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POSB', 'AUD', 1, null, 35, null, 'Undecorated', '{"source_row_number":210,"tier_index":1,"qty":1,"unit_cost":"35","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POSB', 'AUD', 100, null, 33, null, 'Undecorated', '{"source_row_number":210,"tier_index":2,"qty":100,"unit_cost":"33","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POSLS', 'AUD', 1, null, 49, null, 'Undecorated', '{"source_row_number":211,"tier_index":1,"qty":1,"unit_cost":"49","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POSLS', 'AUD', 100, null, 47, null, 'Undecorated', '{"source_row_number":211,"tier_index":2,"qty":100,"unit_cost":"47","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POSK', 'AUD', 1, null, 25, null, 'Undecorated', '{"source_row_number":212,"tier_index":1,"qty":1,"unit_cost":"25","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POSK', 'AUD', 100, null, 23, null, 'Undecorated', '{"source_row_number":212,"tier_index":2,"qty":100,"unit_cost":"23","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POSCF', 'AUD', 1, null, 26, null, 'Undecorated', '{"source_row_number":213,"tier_index":1,"qty":1,"unit_cost":"26","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POSCF', 'AUD', 100, null, 24, null, 'Undecorated', '{"source_row_number":213,"tier_index":2,"qty":100,"unit_cost":"24","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POSSWG', 'AUD', 1, null, 23, null, 'Undecorated', '{"source_row_number":214,"tier_index":1,"qty":1,"unit_cost":"23","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POSSWG', 'AUD', 100, null, 21, null, 'Undecorated', '{"source_row_number":214,"tier_index":2,"qty":100,"unit_cost":"21","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POTSB', 'AUD', 1, null, 36, null, 'Undecorated', '{"source_row_number":215,"tier_index":1,"qty":1,"unit_cost":"36","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POTSB', 'AUD', 100, null, 34, null, 'Undecorated', '{"source_row_number":215,"tier_index":2,"qty":100,"unit_cost":"34","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POTT', 'AUD', 1, null, 44, null, 'Undecorated', '{"source_row_number":216,"tier_index":1,"qty":1,"unit_cost":"44","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POTT', 'AUD', 100, null, 42, null, 'Undecorated', '{"source_row_number":216,"tier_index":2,"qty":100,"unit_cost":"42","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POTFI', 'AUD', 1, null, 17, null, 'Undecorated', '{"source_row_number":217,"tier_index":1,"qty":1,"unit_cost":"17","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POTFI', 'AUD', 100, null, 16, null, 'Undecorated', '{"source_row_number":217,"tier_index":2,"qty":100,"unit_cost":"16","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POVMC', 'AUD', 1, null, 37, null, 'Undecorated', '{"source_row_number":218,"tier_index":1,"qty":1,"unit_cost":"37","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POVMC', 'AUD', 100, null, 35, null, 'Undecorated', '{"source_row_number":218,"tier_index":2,"qty":100,"unit_cost":"35","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'SIAPV', 'AUD', 1, null, 59, null, 'Undecorated | XXS-5XL', '{"source_row_number":219,"tier_index":1,"qty":1,"unit_cost":"59","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'SIAPV', 'AUD', 100, null, 57, null, 'Undecorated | XXS-5XL', '{"source_row_number":219,"tier_index":2,"qty":100,"unit_cost":"57","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'SIBPV', 'AUD', 1, null, 57, null, 'Undecorated | XXS-5XL', '{"source_row_number":220,"tier_index":1,"qty":1,"unit_cost":"57","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'SIBPV', 'AUD', 100, null, 55, null, 'Undecorated | XXS-5XL', '{"source_row_number":220,"tier_index":2,"qty":100,"unit_cost":"55","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'SICM', 'AUD', 1, null, 30, null, 'Undecorated', '{"source_row_number":221,"tier_index":1,"qty":1,"unit_cost":"30","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'SICM', 'AUD', 100, null, 28, null, 'Undecorated', '{"source_row_number":221,"tier_index":2,"qty":100,"unit_cost":"28","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'SIDJ', 'AUD', 1, null, 47, null, 'Undecorated | S-5XL', '{"source_row_number":222,"tier_index":1,"qty":1,"unit_cost":"47","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'SIDJ', 'AUD', 100, null, 45, null, 'Undecorated | S-5XL', '{"source_row_number":222,"tier_index":2,"qty":100,"unit_cost":"45","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'SITPJ', 'AUD', 1, null, 69, null, 'Undecorated | XXS-5XL', '{"source_row_number":223,"tier_index":1,"qty":1,"unit_cost":"69","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'SITPJ', 'AUD', 100, null, 67, null, 'Undecorated | XXS-5XL', '{"source_row_number":223,"tier_index":2,"qty":100,"unit_cost":"67","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'SIEPJ', 'AUD', 1, null, 69, null, 'Undecorated | XXS-5XL', '{"source_row_number":224,"tier_index":1,"qty":1,"unit_cost":"69","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'SIEPJ', 'AUD', 100, null, 67, null, 'Undecorated | XXS-5XL', '{"source_row_number":224,"tier_index":2,"qty":100,"unit_cost":"67","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'SIBRTB', 'AUD', 1, null, 27, null, 'Undecorated', '{"source_row_number":225,"tier_index":1,"qty":1,"unit_cost":"27","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'SIBRTB', 'AUD', 100, null, 25, null, 'Undecorated', '{"source_row_number":225,"tier_index":2,"qty":100,"unit_cost":"25","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'SIFB', 'AUD', 1, null, 39.5, null, 'Undecorated', '{"source_row_number":226,"tier_index":1,"qty":1,"unit_cost":"39.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'SIFB', 'AUD', 100, null, 37.5, null, 'Undecorated', '{"source_row_number":226,"tier_index":2,"qty":100,"unit_cost":"37.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'SIHTJ', 'AUD', 1, null, 50, null, 'Undecorated | XXS-5XL', '{"source_row_number":227,"tier_index":1,"qty":1,"unit_cost":"50","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'SIHTJ', 'AUD', 100, null, 48, null, 'Undecorated | XXS-5XL', '{"source_row_number":227,"tier_index":2,"qty":100,"unit_cost":"48","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'SIJPV', 'AUD', 1, null, 57, null, 'Undecorated | XXS-5XL', '{"source_row_number":228,"tier_index":1,"qty":1,"unit_cost":"57","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'SIJPV', 'AUD', 100, null, 55, null, 'Undecorated | XXS-5XL', '{"source_row_number":228,"tier_index":2,"qty":100,"unit_cost":"55","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'SIIPJ', 'AUD', 1, null, 68, null, 'Undecorated | XXS-5XL', '{"source_row_number":229,"tier_index":1,"qty":1,"unit_cost":"68","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'SIIPJ', 'AUD', 100, null, 66, null, 'Undecorated | XXS-5XL', '{"source_row_number":229,"tier_index":2,"qty":100,"unit_cost":"66","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'SIKD', 'AUD', 1, null, 38, null, 'Undecorated', '{"source_row_number":230,"tier_index":1,"qty":1,"unit_cost":"38","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'SIKD', 'AUD', 100, null, 36, null, 'Undecorated', '{"source_row_number":230,"tier_index":2,"qty":100,"unit_cost":"36","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'SIL', 'AUD', 1, null, 58, null, 'Undecorated | S-5XL', '{"source_row_number":231,"tier_index":1,"qty":1,"unit_cost":"58","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'SIL', 'AUD', 100, null, 56, null, 'Undecorated | S-5XL', '{"source_row_number":231,"tier_index":2,"qty":100,"unit_cost":"56","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'SIMPJ', 'AUD', 1, null, 83, null, 'Undecorated | XXS-5XL', '{"source_row_number":232,"tier_index":1,"qty":1,"unit_cost":"83","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'SIMPJ', 'AUD', 100, null, 81, null, 'Undecorated | XXS-5XL', '{"source_row_number":232,"tier_index":2,"qty":100,"unit_cost":"81","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'SIOJ', 'AUD', 1, null, 39.5, null, 'Undecorated | XXS-5XL', '{"source_row_number":233,"tier_index":1,"qty":1,"unit_cost":"39.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'SIOJ', 'AUD', 100, null, 37.5, null, 'Undecorated | XXS-5XL', '{"source_row_number":233,"tier_index":2,"qty":100,"unit_cost":"37.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'SIR', 'AUD', 1, null, 36, null, 'Undecorated | S-5XL', '{"source_row_number":234,"tier_index":1,"qty":1,"unit_cost":"36","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'SIR', 'AUD', 100, null, 34, null, 'Undecorated | S-5XL', '{"source_row_number":234,"tier_index":2,"qty":100,"unit_cost":"34","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'SISB', 'AUD', 1, null, 34, null, 'Undecorated', '{"source_row_number":235,"tier_index":1,"qty":1,"unit_cost":"34","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'SISB', 'AUD', 100, null, 32, null, 'Undecorated', '{"source_row_number":235,"tier_index":2,"qty":100,"unit_cost":"32","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'SISP', 'AUD', 1, null, 30, null, 'Undecorated | S-5XL', '{"source_row_number":236,"tier_index":1,"qty":1,"unit_cost":"30","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'SISP', 'AUD', 100, null, 28, null, 'Undecorated | S-5XL', '{"source_row_number":236,"tier_index":2,"qty":100,"unit_cost":"28","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'SIVH', 'AUD', 1, null, 24, null, 'Undecorated | M-5XL', '{"source_row_number":237,"tier_index":1,"qty":1,"unit_cost":"24","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'SIWWK', 'AUD', 1, null, 11.5, null, 'Undecorated', '{"source_row_number":238,"tier_index":1,"qty":1,"unit_cost":"11.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'SIWWK', 'AUD', 100, null, 10.5, null, 'Undecorated', '{"source_row_number":238,"tier_index":2,"qty":100,"unit_cost":"10.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WSIL', 'AUD', 1, null, 54, null, 'Undecorated | 8-26', '{"source_row_number":239,"tier_index":1,"qty":1,"unit_cost":"54","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WSIL', 'AUD', 100, null, 52, null, 'Undecorated | 8-26', '{"source_row_number":239,"tier_index":2,"qty":100,"unit_cost":"52","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WSIR', 'AUD', 1, null, 34, null, 'Undecorated | 8-26', '{"source_row_number":240,"tier_index":1,"qty":1,"unit_cost":"34","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WSIR', 'AUD', 100, null, 32, null, 'Undecorated | 8-26', '{"source_row_number":240,"tier_index":2,"qty":100,"unit_cost":"32","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WSISP', 'AUD', 1, null, 30, null, 'Undecorated | 8-18', '{"source_row_number":241,"tier_index":1,"qty":1,"unit_cost":"30","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WSISP', 'AUD', 100, null, 28, null, 'Undecorated | 8-18', '{"source_row_number":241,"tier_index":2,"qty":100,"unit_cost":"28","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WSIVH', 'AUD', 1, null, 24, null, 'Undecorated | 10-18', '{"source_row_number":242,"tier_index":1,"qty":1,"unit_cost":"24","price_product_code":null,"price_notes":null}'::jsonb)
) as v(supplier, supplier_sku, currency, min_qty, max_qty, unit_cost, setup_cost, price_label, raw_json);

with gfl_batch as (
  select id as batch_id
  from public.supplier_import_batches
  where supplier = 'Gear For Life'
    and source_file_hash = 'f20ede9ac24d944fcb4c3c646d8ae2cbc41d2c63580200db27f2e86a96bf739c'
  order by created_at desc
  limit 1
)
insert into public.supplier_price_rows (
  batch_id, supplier, supplier_sku, currency, min_qty, max_qty, unit_cost, setup_cost, price_label, raw_json
)
select
  gfl_batch.batch_id,
  v.supplier::text, v.supplier_sku::text, v.currency::text, v.min_qty::int, v.max_qty::int, v.unit_cost::numeric, v.setup_cost::numeric, v.price_label::text, v.raw_json::jsonb
from gfl_batch
cross join (
  values
    ('Gear For Life', 'BOR', 'AUD', 1, null, 51.5, null, 'Undecorated | S-5XL', '{"source_row_number":243,"tier_index":1,"qty":1,"unit_cost":"51.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BOR', 'AUD', 100, null, 49.5, null, 'Undecorated | S-5XL', '{"source_row_number":243,"tier_index":2,"qty":100,"unit_cost":"49.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WBOR', 'AUD', 1, null, 51.5, null, 'Undecorated | 8-20', '{"source_row_number":244,"tier_index":1,"qty":1,"unit_cost":"51.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WBOR', 'AUD', 100, null, 49.5, null, 'Undecorated | 8-20', '{"source_row_number":244,"tier_index":2,"qty":100,"unit_cost":"49.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BTY', 'AUD', 1, null, 51.5, null, 'Undecorated | S-5XL', '{"source_row_number":245,"tier_index":1,"qty":1,"unit_cost":"51.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BTY', 'AUD', 100, null, 49.5, null, 'Undecorated | S-5XL', '{"source_row_number":245,"tier_index":2,"qty":100,"unit_cost":"49.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WBTY', 'AUD', 1, null, 51.5, null, 'Undecorated | 8-20', '{"source_row_number":246,"tier_index":1,"qty":1,"unit_cost":"51.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WBTY', 'AUD', 100, null, 49.5, null, 'Undecorated | 8-20', '{"source_row_number":246,"tier_index":2,"qty":100,"unit_cost":"49.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BNO', 'AUD', 1, null, 48.5, null, 'Undecorated | S-5XL', '{"source_row_number":247,"tier_index":1,"qty":1,"unit_cost":"48.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BNO', 'AUD', 100, null, 46.5, null, 'Undecorated | S-5XL', '{"source_row_number":247,"tier_index":2,"qty":100,"unit_cost":"46.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WBNO', 'AUD', 1, null, 48.5, null, 'Undecorated | 8-20', '{"source_row_number":248,"tier_index":1,"qty":1,"unit_cost":"48.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WBNO', 'AUD', 100, null, 46.5, null, 'Undecorated | 8-20', '{"source_row_number":248,"tier_index":2,"qty":100,"unit_cost":"46.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BCL', 'AUD', 1, null, 56.5, null, 'Undecorated | S-5XL', '{"source_row_number":249,"tier_index":1,"qty":1,"unit_cost":"56.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BCL', 'AUD', 100, null, 54.5, null, 'Undecorated | S-5XL', '{"source_row_number":249,"tier_index":2,"qty":100,"unit_cost":"54.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WBCL', 'AUD', 1, null, 56.5, null, 'Undecorated | 8-20', '{"source_row_number":250,"tier_index":1,"qty":1,"unit_cost":"56.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WBCL', 'AUD', 100, null, 54.5, null, 'Undecorated | 8-20', '{"source_row_number":250,"tier_index":2,"qty":100,"unit_cost":"54.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BLC', 'AUD', 1, null, 56.5, null, 'Undecorated | S-5XL', '{"source_row_number":251,"tier_index":1,"qty":1,"unit_cost":"56.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BLC', 'AUD', 100, null, 54.5, null, 'Undecorated | S-5XL', '{"source_row_number":251,"tier_index":2,"qty":100,"unit_cost":"54.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WBLC', 'AUD', 1, null, 56.5, null, 'Undecorated | 8-20', '{"source_row_number":252,"tier_index":1,"qty":1,"unit_cost":"56.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WBLC', 'AUD', 100, null, 54.5, null, 'Undecorated | 8-20', '{"source_row_number":252,"tier_index":2,"qty":100,"unit_cost":"54.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BQU', 'AUD', 1, null, 48.5, null, 'Undecorated | S-5XL', '{"source_row_number":253,"tier_index":1,"qty":1,"unit_cost":"48.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BQU', 'AUD', 100, null, 46.5, null, 'Undecorated | S-5XL', '{"source_row_number":253,"tier_index":2,"qty":100,"unit_cost":"46.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WBQU', 'AUD', 1, null, 48.5, null, 'Undecorated | 8-20', '{"source_row_number":254,"tier_index":1,"qty":1,"unit_cost":"48.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WBQU', 'AUD', 100, null, 46.5, null, 'Undecorated | 8-20', '{"source_row_number":254,"tier_index":2,"qty":100,"unit_cost":"46.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BSC', 'AUD', 1, null, 48.5, null, 'Undecorated | S-5XL', '{"source_row_number":255,"tier_index":1,"qty":1,"unit_cost":"48.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BSC', 'AUD', 100, null, 46.5, null, 'Undecorated | S-5XL', '{"source_row_number":255,"tier_index":2,"qty":100,"unit_cost":"46.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WBSC', 'AUD', 1, null, 48.5, null, 'Undecorated | 8-20', '{"source_row_number":256,"tier_index":1,"qty":1,"unit_cost":"48.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WBSC', 'AUD', 100, null, 46.5, null, 'Undecorated | 8-20', '{"source_row_number":256,"tier_index":2,"qty":100,"unit_cost":"46.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BHC', 'AUD', 1, null, 48.5, null, 'Undecorated | S-5XL', '{"source_row_number":257,"tier_index":1,"qty":1,"unit_cost":"48.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BHC', 'AUD', 100, null, 46.5, null, 'Undecorated | S-5XL', '{"source_row_number":257,"tier_index":2,"qty":100,"unit_cost":"46.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WBHC', 'AUD', 1, null, 48.5, null, 'Undecorated | 8-20', '{"source_row_number":258,"tier_index":1,"qty":1,"unit_cost":"48.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WBHC', 'AUD', 100, null, 46.5, null, 'Undecorated | 8-20', '{"source_row_number":258,"tier_index":2,"qty":100,"unit_cost":"46.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BBYCQS', 'AUD', 1, null, 99, null, 'Undecorated', '{"source_row_number":259,"tier_index":1,"qty":1,"unit_cost":"99","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BBYCQS', 'AUD', 100, null, 96, null, 'Undecorated', '{"source_row_number":259,"tier_index":2,"qty":100,"unit_cost":"96","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POBMS', 'AUD', 1, null, 47, null, 'Undecorated', '{"source_row_number":260,"tier_index":1,"qty":1,"unit_cost":"47","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POBMS', 'AUD', 100, null, 45, null, 'Undecorated', '{"source_row_number":260,"tier_index":2,"qty":100,"unit_cost":"45","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POMLMB', 'AUD', 1, null, 85.00, null, 'Undecorated', '{"source_row_number":261,"tier_index":1,"qty":1,"unit_cost":"85.00","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POMLMB', 'AUD', 100, null, 83.00, null, 'Undecorated', '{"source_row_number":261,"tier_index":2,"qty":100,"unit_cost":"83.00","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POLTT', 'AUD', 1, null, 71, null, 'Undecorated', '{"source_row_number":262,"tier_index":1,"qty":1,"unit_cost":"71","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POLTT', 'AUD', 100, null, 69, null, 'Undecorated', '{"source_row_number":262,"tier_index":2,"qty":100,"unit_cost":"69","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POTSL', 'AUD', 1, null, 65, null, 'Undecorated', '{"source_row_number":263,"tier_index":1,"qty":1,"unit_cost":"65","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POTSL', 'AUD', 100, null, 63, null, 'Undecorated', '{"source_row_number":263,"tier_index":2,"qty":100,"unit_cost":"63","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POFWC', 'AUD', 1, null, 33, null, 'Undecorated', '{"source_row_number":264,"tier_index":1,"qty":1,"unit_cost":"33","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POFWC', 'AUD', 100, null, 31, null, 'Undecorated', '{"source_row_number":264,"tier_index":2,"qty":100,"unit_cost":"31","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POMGS', 'AUD', 1, null, 49.5, null, 'Undecorated', '{"source_row_number":265,"tier_index":1,"qty":1,"unit_cost":"49.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POMGS', 'AUD', 100, null, 47.5, null, 'Undecorated', '{"source_row_number":265,"tier_index":2,"qty":100,"unit_cost":"47.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'PORHBT', 'AUD', 1, null, 28, null, 'Undecorated', '{"source_row_number":266,"tier_index":1,"qty":1,"unit_cost":"28","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'PORHBT', 'AUD', 100, null, 26, null, 'Undecorated', '{"source_row_number":266,"tier_index":2,"qty":100,"unit_cost":"26","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POHWGS', 'AUD', 1, null, 20.5, null, 'Undecorated', '{"source_row_number":267,"tier_index":1,"qty":1,"unit_cost":"20.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POHWGS', 'AUD', 100, null, 19.5, null, 'Undecorated', '{"source_row_number":267,"tier_index":2,"qty":100,"unit_cost":"19.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POTF2S', 'AUD', 1, null, 54, null, 'Undecorated', '{"source_row_number":268,"tier_index":1,"qty":1,"unit_cost":"54","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POTF2S', 'AUD', 100, null, 52, null, 'Undecorated', '{"source_row_number":268,"tier_index":2,"qty":100,"unit_cost":"52","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POAB', 'AUD', 1, null, 33.5, null, 'Undecorated', '{"source_row_number":269,"tier_index":1,"qty":1,"unit_cost":"33.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POAB', 'AUD', 100, null, 31.5, null, 'Undecorated', '{"source_row_number":269,"tier_index":2,"qty":100,"unit_cost":"31.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BEBCC', 'AUD', 1, null, 29, null, 'Undecorated', '{"source_row_number":270,"tier_index":1,"qty":1,"unit_cost":"29","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BEBCC', 'AUD', 100, null, 27, null, 'Undecorated', '{"source_row_number":270,"tier_index":2,"qty":100,"unit_cost":"27","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'ODGOL', 'AUD', 1, null, 9.95, null, 'Undecorated | S-5XL', '{"source_row_number":271,"tier_index":1,"qty":1,"unit_cost":"9.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'OWDGOL', 'AUD', 1, null, 9.95, null, 'Undecorated | 8-22', '{"source_row_number":272,"tier_index":1,"qty":1,"unit_cost":"9.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'ODGVQP', 'AUD', 1, null, 9.95, null, 'Undecorated | S-5XL', '{"source_row_number":273,"tier_index":1,"qty":1,"unit_cost":"9.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'OWDGVQP', 'AUD', 1, null, 9.95, null, 'Undecorated | 8-22', '{"source_row_number":274,"tier_index":1,"qty":1,"unit_cost":"9.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'ODGPO', 'AUD', 1, null, 9.95, null, 'Undecorated | XXS-5XL', '{"source_row_number":275,"tier_index":1,"qty":1,"unit_cost":"9.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'ODGSP(I)', 'AUD', 1, null, 9.95, null, 'Undecorated | WXS-5XL', '{"source_row_number":276,"tier_index":1,"qty":1,"unit_cost":"9.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'ODGZP', 'AUD', 1, null, 9.95, null, 'Undecorated | 4XS-5XL', '{"source_row_number":277,"tier_index":1,"qty":1,"unit_cost":"9.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'ODGMP', 'AUD', 1, null, 9.95, null, 'Undecorated | XS-5XL', '{"source_row_number":278,"tier_index":1,"qty":1,"unit_cost":"9.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'ODGCHP', 'AUD', 1, null, 9.95, null, 'Undecorated | 4XS-5XL', '{"source_row_number":279,"tier_index":1,"qty":1,"unit_cost":"9.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'OWDGHP', 'AUD', 1, null, 9.95, null, 'Undecorated | 8-20', '{"source_row_number":280,"tier_index":1,"qty":1,"unit_cost":"9.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'ODGP', 'AUD', 1, null, 8.95, null, 'Undecorated | S-5XL', '{"source_row_number":281,"tier_index":1,"qty":1,"unit_cost":"8.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'OWDGP', 'AUD', 1, null, 8.95, null, 'Undecorated | 8-20', '{"source_row_number":282,"tier_index":1,"qty":1,"unit_cost":"8.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'OWDGFP', 'AUD', 1, null, 9.95, null, 'Undecorated | 8-22', '{"source_row_number":283,"tier_index":1,"qty":1,"unit_cost":"9.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'OWDGKP', 'AUD', 1, null, 9.95, null, 'Undecorated | 8-22', '{"source_row_number":284,"tier_index":1,"qty":1,"unit_cost":"9.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'OWPCP', 'AUD', 1, null, 9.95, null, 'Undecorated | 8-20', '{"source_row_number":285,"tier_index":1,"qty":1,"unit_cost":"9.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'ORWP', 'AUD', 1, null, 8.95, null, 'Undecorated | S-5XL', '{"source_row_number":286,"tier_index":1,"qty":1,"unit_cost":"8.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'OWRWP', 'AUD', 1, null, 8.95, null, 'Undecorated | 8-22', '{"source_row_number":287,"tier_index":1,"qty":1,"unit_cost":"8.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'OMHP', 'AUD', 1, null, 9.95, null, 'Undecorated | S-3XL', '{"source_row_number":288,"tier_index":1,"qty":1,"unit_cost":"9.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'OWMHP', 'AUD', 1, null, 9.95, null, 'Undecorated | 8-18', '{"source_row_number":289,"tier_index":1,"qty":1,"unit_cost":"9.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'OWJO', 'AUD', 1, null, 9.95, null, 'Undecorated | 8-22', '{"source_row_number":290,"tier_index":1,"qty":1,"unit_cost":"9.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'OWQDP', 'AUD', 1, null, 9.95, null, 'Undecorated | 8-22', '{"source_row_number":291,"tier_index":1,"qty":1,"unit_cost":"9.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'OWEP', 'AUD', 1, null, 9.95, null, 'Undecorated | 8-22', '{"source_row_number":292,"tier_index":1,"qty":1,"unit_cost":"9.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'ORBJ', 'AUD', 1, null, 15.95, null, 'Undecorated | XS-5XL', '{"source_row_number":293,"tier_index":1,"qty":1,"unit_cost":"15.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'ODGZT', 'AUD', 1, null, 7.95, null, 'Undecorated | 4XS-5XL', '{"source_row_number":294,"tier_index":1,"qty":1,"unit_cost":"7.95","price_product_code":null,"price_notes":null}'::jsonb)
) as v(supplier, supplier_sku, currency, min_qty, max_qty, unit_cost, setup_cost, price_label, raw_json);

with gfl_batch as (
  select id as batch_id
  from public.supplier_import_batches
  where supplier = 'Gear For Life'
    and source_file_hash = 'f20ede9ac24d944fcb4c3c646d8ae2cbc41d2c63580200db27f2e86a96bf739c'
  order by created_at desc
  limit 1
)
insert into public.supplier_price_rows (
  batch_id, supplier, supplier_sku, currency, min_qty, max_qty, unit_cost, setup_cost, price_label, raw_json
)
select
  gfl_batch.batch_id,
  v.supplier::text, v.supplier_sku::text, v.currency::text, v.min_qty::int, v.max_qty::int, v.unit_cost::numeric, v.setup_cost::numeric, v.price_label::text, v.raw_json::jsonb
from gfl_batch
cross join (
  values
    ('Gear For Life', 'ODGT', 'AUD', 1, null, 6.95, null, 'Undecorated | XS-5XL', '{"source_row_number":295,"tier_index":1,"qty":1,"unit_cost":"6.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'OWDGT', 'AUD', 1, null, 6.95, null, 'Undecorated | 8-20', '{"source_row_number":296,"tier_index":1,"qty":1,"unit_cost":"6.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'OWDGR', 'AUD', 1, null, 6.95, null, 'Undecorated | 8-22', '{"source_row_number":297,"tier_index":1,"qty":1,"unit_cost":"6.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'ODGTT', 'AUD', 1, null, 7.95, null, 'Undecorated | XS-5XL', '{"source_row_number":298,"tier_index":1,"qty":1,"unit_cost":"7.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'ODGST(I)', 'AUD', 1, null, 7.95, null, 'Undecorated | WXS-5XL', '{"source_row_number":299,"tier_index":1,"qty":1,"unit_cost":"7.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'ODGSS', 'AUD', 1, null, 6.95, null, 'Undecorated | S-5XL', '{"source_row_number":300,"tier_index":1,"qty":1,"unit_cost":"6.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'OWDGSS', 'AUD', 1, null, 6.95, null, 'Undecorated | 10-16', '{"source_row_number":301,"tier_index":1,"qty":1,"unit_cost":"6.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'OYDGSS', 'AUD', 1, null, 6.95, null, 'Undecorated | 4XS-XXS', '{"source_row_number":302,"tier_index":1,"qty":1,"unit_cost":"6.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'ODGS(P)', 'AUD', 1, null, 6.95, null, 'Undecorated | S-5XL', '{"source_row_number":303,"tier_index":1,"qty":1,"unit_cost":"6.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'OWDGS(P)', 'AUD', 1, null, 6.95, null, 'Undecorated | 8-18', '{"source_row_number":304,"tier_index":1,"qty":1,"unit_cost":"6.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'ODGS(C)', 'AUD', 1, null, 6.95, null, 'Undecorated | S-5XL', '{"source_row_number":305,"tier_index":1,"qty":1,"unit_cost":"6.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'OWDGS(C)', 'AUD', 1, null, 6.95, null, 'Undecorated | 8-18', '{"source_row_number":306,"tier_index":1,"qty":1,"unit_cost":"6.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'ODGSH', 'AUD', 1, null, 9.95, null, 'Undecorated | S-5XL', '{"source_row_number":307,"tier_index":1,"qty":1,"unit_cost":"9.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'OWDGSH', 'AUD', 1, null, 9.95, null, 'Undecorated | 8-18', '{"source_row_number":308,"tier_index":1,"qty":1,"unit_cost":"9.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'OMTS', 'AUD', 1, null, 9.95, null, 'Undecorated | S-5XL', '{"source_row_number":309,"tier_index":1,"qty":1,"unit_cost":"9.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'OAS', 'AUD', 1, null, 6.95, null, 'Undecorated | S-5XL', '{"source_row_number":310,"tier_index":1,"qty":1,"unit_cost":"6.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'OWAS', 'AUD', 1, null, 9.95, null, 'Undecorated | 8-16', '{"source_row_number":311,"tier_index":1,"qty":1,"unit_cost":"9.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'OYRBS', 'AUD', 1, null, 9.95, null, 'Undecorated | 10-12', '{"source_row_number":312,"tier_index":1,"qty":1,"unit_cost":"9.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'OTSTP', 'AUD', 1, null, 10.95, null, 'Undecorated | 4XS-5XL', '{"source_row_number":313,"tier_index":1,"qty":1,"unit_cost":"10.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'OMFP', 'AUD', 1, null, 10.95, null, 'Undecorated | 3XS-5XL', '{"source_row_number":314,"tier_index":1,"qty":1,"unit_cost":"10.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'OZP', 'AUD', 1, null, 10.95, null, 'Undecorated | 4XS-5XL', '{"source_row_number":315,"tier_index":1,"qty":1,"unit_cost":"10.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'ONTP', 'AUD', 1, null, 10.95, null, 'Undecorated | 4XS-5XL', '{"source_row_number":316,"tier_index":1,"qty":1,"unit_cost":"10.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'ORSP', 'AUD', 1, null, 10.95, null, 'Undecorated | 3XS-5XL', '{"source_row_number":317,"tier_index":1,"qty":1,"unit_cost":"10.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'OTSWH', 'AUD', 1, null, 8.95, null, 'Undecorated | 8-20', '{"source_row_number":318,"tier_index":1,"qty":1,"unit_cost":"8.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'ODGRFZ', 'AUD', 1, null, 18.95, null, 'Undecorated | 4XS-5XL', '{"source_row_number":319,"tier_index":1,"qty":1,"unit_cost":"18.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'OIPV', 'AUD', 1, null, 8.95, null, 'Undecorated | S-5XL', '{"source_row_number":320,"tier_index":1,"qty":1,"unit_cost":"8.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'OMWJ', 'AUD', 1, null, 49.95, null, 'Undecorated | S-3XL', '{"source_row_number":321,"tier_index":1,"qty":1,"unit_cost":"49.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'OWMWJ', 'AUD', 1, null, 49.95, null, 'Undecorated | 8-18', '{"source_row_number":322,"tier_index":1,"qty":1,"unit_cost":"49.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'OJP', 'AUD', 1, null, 8.95, null, 'Undecorated | 4XS-5XL', '{"source_row_number":323,"tier_index":1,"qty":1,"unit_cost":"8.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'OSJ', 'AUD', 1, null, 14.95, null, 'Undecorated | S-5XL', '{"source_row_number":324,"tier_index":1,"qty":1,"unit_cost":"14.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'OWEGMCI', 'AUD', 1, null, 19.95, null, 'Undecorated | 8-18', '{"source_row_number":325,"tier_index":1,"qty":1,"unit_cost":"19.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'OEGMC', 'AUD', 1, null, 19.95, null, 'Undecorated | S-5XL', '{"source_row_number":326,"tier_index":1,"qty":1,"unit_cost":"19.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'OWEGMV', 'AUD', 1, null, 19.95, null, 'Undecorated | 8-22', '{"source_row_number":327,"tier_index":1,"qty":1,"unit_cost":"19.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'OTV', 'AUD', 1, null, 7.95, null, 'Undecorated | S-4XL', '{"source_row_number":328,"tier_index":1,"qty":1,"unit_cost":"7.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'OWTV', 'AUD', 1, null, 7.95, null, 'Undecorated | 8-22', '{"source_row_number":329,"tier_index":1,"qty":1,"unit_cost":"7.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'OTRLS', 'AUD', 1, null, 7.95, null, 'Undecorated | S-5XL', '{"source_row_number":330,"tier_index":1,"qty":1,"unit_cost":"7.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'OWTRLS', 'AUD', 1, null, 7.95, null, 'Undecorated | 8-22', '{"source_row_number":331,"tier_index":1,"qty":1,"unit_cost":"7.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'OWCS', 'AUD', 1, null, 7.95, null, 'Undecorated | 8-18', '{"source_row_number":332,"tier_index":1,"qty":1,"unit_cost":"7.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'OWTM', 'AUD', 1, null, 7.95, null, 'Undecorated | 8-22', '{"source_row_number":333,"tier_index":1,"qty":1,"unit_cost":"7.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'OWTMO', 'AUD', 1, null, 7.95, null, 'Undecorated | 8-22', '{"source_row_number":334,"tier_index":1,"qty":1,"unit_cost":"7.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'OWTE', 'AUD', 1, null, 7.95, null, 'Undecorated | 8-22', '{"source_row_number":335,"tier_index":1,"qty":1,"unit_cost":"7.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'OWLCS', 'AUD', 1, null, 7.95, null, 'Undecorated | S/8-4XL/20', '{"source_row_number":336,"tier_index":1,"qty":1,"unit_cost":"7.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'OWSB', 'AUD', 1, null, 7.95, null, 'Undecorated | S/10-XL/16', '{"source_row_number":337,"tier_index":1,"qty":1,"unit_cost":"7.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'OWTDN', 'AUD', 1, null, 7.95, null, 'Undecorated | 8-22', '{"source_row_number":338,"tier_index":1,"qty":1,"unit_cost":"7.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'OWTMT', 'AUD', 1, null, 7.95, null, 'Undecorated | 8-22', '{"source_row_number":339,"tier_index":1,"qty":1,"unit_cost":"7.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'OWTRSS', 'AUD', 1, null, 7.95, null, 'Undecorated | 8-22', '{"source_row_number":340,"tier_index":1,"qty":1,"unit_cost":"7.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'OWTL', 'AUD', 1, null, 7.95, null, 'Undecorated | 8-22', '{"source_row_number":341,"tier_index":1,"qty":1,"unit_cost":"7.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'PODCB', 'AUD', 1, null, 103, null, 'Undecorated', '{"source_row_number":342,"tier_index":1,"qty":1,"unit_cost":"103","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'PODCB', 'AUD', 100, null, 98, null, 'Undecorated', '{"source_row_number":342,"tier_index":2,"qty":100,"unit_cost":"98","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BBQS', 'AUD', 1, null, 45, null, 'Undecorated', '{"source_row_number":343,"tier_index":1,"qty":1,"unit_cost":"45","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BBQS', 'AUD', 100, null, 43, null, 'Undecorated', '{"source_row_number":343,"tier_index":2,"qty":100,"unit_cost":"43","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POOMTT', 'AUD', 1, null, 70, null, 'Undecorated', '{"source_row_number":344,"tier_index":1,"qty":1,"unit_cost":"70","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POOMTT', 'AUD', 100, null, 68, null, 'Undecorated', '{"source_row_number":344,"tier_index":2,"qty":100,"unit_cost":"68","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POOPB', 'AUD', 1, null, 69, null, 'Undecorated', '{"source_row_number":345,"tier_index":1,"qty":1,"unit_cost":"69","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POOPB', 'AUD', 100, null, 67, null, 'Undecorated', '{"source_row_number":345,"tier_index":2,"qty":100,"unit_cost":"67","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POPTT', 'AUD', 1, null, 29, null, 'Undecorated', '{"source_row_number":346,"tier_index":1,"qty":1,"unit_cost":"29","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POPTT', 'AUD', 100, null, 27, null, 'Undecorated', '{"source_row_number":346,"tier_index":2,"qty":100,"unit_cost":"27","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POAFS', 'AUD', 1, null, 38.5, null, 'Undecorated', '{"source_row_number":347,"tier_index":1,"qty":1,"unit_cost":"38.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POAFS', 'AUD', 100, null, 36.5, null, 'Undecorated', '{"source_row_number":347,"tier_index":2,"qty":100,"unit_cost":"36.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POE6KS', 'AUD', 1, null, 25.5, null, 'Undecorated', '{"source_row_number":348,"tier_index":1,"qty":1,"unit_cost":"25.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POE6KS', 'AUD', 100, null, 23.5, null, 'Undecorated', '{"source_row_number":348,"tier_index":2,"qty":100,"unit_cost":"23.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POBWD', 'AUD', 1, null, 63, null, 'Undecorated', '{"source_row_number":349,"tier_index":1,"qty":1,"unit_cost":"63","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POBWD', 'AUD', 100, null, 61, null, 'Undecorated', '{"source_row_number":349,"tier_index":2,"qty":100,"unit_cost":"61","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POIWDS', 'AUD', 1, null, 59, null, 'Undecorated', '{"source_row_number":350,"tier_index":1,"qty":1,"unit_cost":"59","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POIWDS', 'AUD', 100, null, 57, null, 'Undecorated', '{"source_row_number":350,"tier_index":2,"qty":100,"unit_cost":"57","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'OHJ', 'AUD', 1, null, 29.95, null, 'Undecorated | XXS-5XL', '{"source_row_number":351,"tier_index":1,"qty":1,"unit_cost":"29.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'OTNT', 'AUD', 1, null, 18.95, null, 'Undecorated | XS-5XL', '{"source_row_number":352,"tier_index":1,"qty":1,"unit_cost":"18.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'ODGIP', 'AUD', 1, null, 9.95, null, 'Undecorated | S-5XL', '{"source_row_number":353,"tier_index":1,"qty":1,"unit_cost":"9.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'OGV', 'AUD', 1, null, 19.95, null, 'Undecorated | XXS-5XL', '{"source_row_number":354,"tier_index":1,"qty":1,"unit_cost":"19.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'OTYS', 'AUD', 1, null, 7.95, null, 'Undecorated | S-5XL', '{"source_row_number":355,"tier_index":1,"qty":1,"unit_cost":"7.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'OWTYS', 'AUD', 1, null, 7.95, null, 'Undecorated | 8-22', '{"source_row_number":356,"tier_index":1,"qty":1,"unit_cost":"7.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'OEGMFV', 'AUD', 1, null, 19.95, null, 'Undecorated | S-5XL', '{"source_row_number":357,"tier_index":1,"qty":1,"unit_cost":"19.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'OWEGMFV', 'AUD', 1, null, 19.95, null, 'Undecorated | 8-22', '{"source_row_number":358,"tier_index":1,"qty":1,"unit_cost":"19.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'OES', 'AUD', 1, null, 7.95, null, 'Undecorated | S-4XL', '{"source_row_number":359,"tier_index":1,"qty":1,"unit_cost":"7.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'OTEL', 'AUD', 1, null, 7.95, null, 'Undecorated | S-3XL', '{"source_row_number":360,"tier_index":1,"qty":1,"unit_cost":"7.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BHZQM', 'AUD', 1, null, 120, null, 'Undecorated | S-5XL', '{"source_row_number":361,"tier_index":1,"qty":1,"unit_cost":"120","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BHZQM', 'AUD', 100, null, 115, null, 'Undecorated | S-5XL', '{"source_row_number":361,"tier_index":2,"qty":100,"unit_cost":"115","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BFCS', 'AUD', 1, null, 48.5, null, 'Undecorated | S-5XL', '{"source_row_number":362,"tier_index":1,"qty":1,"unit_cost":"48.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BFCS', 'AUD', 100, null, 46.5, null, 'Undecorated | S-5XL', '{"source_row_number":362,"tier_index":2,"qty":100,"unit_cost":"46.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WBFCS', 'AUD', 1, null, 48.5, null, 'Undecorated | 8-22', '{"source_row_number":363,"tier_index":1,"qty":1,"unit_cost":"48.5","price_product_code":null,"price_notes":null}'::jsonb)
) as v(supplier, supplier_sku, currency, min_qty, max_qty, unit_cost, setup_cost, price_label, raw_json);

with gfl_batch as (
  select id as batch_id
  from public.supplier_import_batches
  where supplier = 'Gear For Life'
    and source_file_hash = 'f20ede9ac24d944fcb4c3c646d8ae2cbc41d2c63580200db27f2e86a96bf739c'
  order by created_at desc
  limit 1
)
insert into public.supplier_price_rows (
  batch_id, supplier, supplier_sku, currency, min_qty, max_qty, unit_cost, setup_cost, price_label, raw_json
)
select
  gfl_batch.batch_id,
  v.supplier::text, v.supplier_sku::text, v.currency::text, v.min_qty::int, v.max_qty::int, v.unit_cost::numeric, v.setup_cost::numeric, v.price_label::text, v.raw_json::jsonb
from gfl_batch
cross join (
  values
    ('Gear For Life', 'WBFCS', 'AUD', 100, null, 46.5, null, 'Undecorated | 8-22', '{"source_row_number":363,"tier_index":2,"qty":100,"unit_cost":"46.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'SIGBV', 'AUD', 1, null, 59, null, 'Undecorated | XXS-5XL', '{"source_row_number":364,"tier_index":1,"qty":1,"unit_cost":"59","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'SIGBV', 'AUD', 100, null, 57, null, 'Undecorated | XXS-5XL', '{"source_row_number":364,"tier_index":2,"qty":100,"unit_cost":"57","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'SIXTPJ', 'AUD', 1, null, 85, null, 'Undecorated | XXS-5XL', '{"source_row_number":365,"tier_index":1,"qty":1,"unit_cost":"85","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'SIXTPJ', 'AUD', 100, null, 83, null, 'Undecorated | XXS-5XL', '{"source_row_number":365,"tier_index":2,"qty":100,"unit_cost":"83","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'OTMC', 'AUD', 1, null, 7.95, null, 'Undecorated | S-5XL', '{"source_row_number":366,"tier_index":1,"qty":1,"unit_cost":"7.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BBYCHS', 'AUD', 1, null, 83, null, 'Undecorated', '{"source_row_number":367,"tier_index":1,"qty":1,"unit_cost":"83","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BBYCHS', 'AUD', 100, null, 79, null, 'Undecorated', '{"source_row_number":367,"tier_index":2,"qty":100,"unit_cost":"79","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'PONS', 'AUD', 1, null, 28.5, null, 'Undecorated', '{"source_row_number":368,"tier_index":1,"qty":1,"unit_cost":"28.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'PONS', 'AUD', 100, null, 26.5, null, 'Undecorated', '{"source_row_number":368,"tier_index":2,"qty":100,"unit_cost":"26.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POWBC', 'AUD', 1, null, 51.5, null, 'Undecorated', '{"source_row_number":369,"tier_index":1,"qty":1,"unit_cost":"51.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POWBC', 'AUD', 100, null, 49.5, null, 'Undecorated', '{"source_row_number":369,"tier_index":2,"qty":100,"unit_cost":"49.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'PODCPB', 'AUD', 1, null, 56, null, 'Undecorated', '{"source_row_number":370,"tier_index":1,"qty":1,"unit_cost":"56","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'PODCPB', 'AUD', 100, null, 54, null, 'Undecorated', '{"source_row_number":370,"tier_index":2,"qty":100,"unit_cost":"54","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POHWC', 'AUD', 1, null, 50, null, 'Undecorated', '{"source_row_number":371,"tier_index":1,"qty":1,"unit_cost":"50","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POHWC', 'AUD', 100, null, 48, null, 'Undecorated', '{"source_row_number":371,"tier_index":2,"qty":100,"unit_cost":"48","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POEPS', 'AUD', 1, null, 41.5, null, 'Undecorated', '{"source_row_number":372,"tier_index":1,"qty":1,"unit_cost":"41.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POEPS', 'AUD', 100, null, 39.5, null, 'Undecorated', '{"source_row_number":372,"tier_index":2,"qty":100,"unit_cost":"39.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POATB', 'AUD', 1, null, 32, null, 'Undecorated', '{"source_row_number":373,"tier_index":1,"qty":1,"unit_cost":"32","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POATB', 'AUD', 100, null, 30, null, 'Undecorated', '{"source_row_number":373,"tier_index":2,"qty":100,"unit_cost":"30","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POWCKB', 'AUD', 1, null, 31.5, null, 'Undecorated', '{"source_row_number":374,"tier_index":1,"qty":1,"unit_cost":"31.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POWCKB', 'AUD', 100, null, 29.5, null, 'Undecorated', '{"source_row_number":374,"tier_index":2,"qty":100,"unit_cost":"29.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POSWTS', 'AUD', 1, null, 41.5, null, 'Undecorated', '{"source_row_number":375,"tier_index":1,"qty":1,"unit_cost":"41.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POSWTS', 'AUD', 100, null, 39.5, null, 'Undecorated', '{"source_row_number":375,"tier_index":2,"qty":100,"unit_cost":"39.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POBCGS', 'AUD', 1, null, 28, null, 'Undecorated', '{"source_row_number":376,"tier_index":1,"qty":1,"unit_cost":"28","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POBCGS', 'AUD', 100, null, 26, null, 'Undecorated', '{"source_row_number":376,"tier_index":2,"qty":100,"unit_cost":"26","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'ODGTP', 'AUD', 1, null, 9.95, null, 'Undecorated | S-3XL', '{"source_row_number":377,"tier_index":1,"qty":1,"unit_cost":"9.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'ODGRFP', 'AUD', 1, null, 9.95, null, 'Undecorated | 4XS-5XL', '{"source_row_number":378,"tier_index":1,"qty":1,"unit_cost":"9.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGREP', 'AUD', 1, null, 23, null, 'Undecorated | S-5XL', '{"source_row_number":379,"tier_index":1,"qty":1,"unit_cost":"23","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGREP', 'AUD', 100, null, 22, null, 'Undecorated | S-5XL', '{"source_row_number":379,"tier_index":2,"qty":100,"unit_cost":"22","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WDGREP', 'AUD', 1, null, 23, null, 'Undecorated | 8-24', '{"source_row_number":380,"tier_index":1,"qty":1,"unit_cost":"23","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WDGREP', 'AUD', 100, null, 22, null, 'Undecorated | 8-24', '{"source_row_number":380,"tier_index":2,"qty":100,"unit_cost":"22","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'SIASJ', 'AUD', 1, null, 84, null, 'Undecorated | XXS-7XL', '{"source_row_number":381,"tier_index":1,"qty":1,"unit_cost":"84","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'SIASJ', 'AUD', 100, null, 82, null, 'Undecorated | XXS-7XL', '{"source_row_number":381,"tier_index":2,"qty":100,"unit_cost":"82","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BMA', 'AUD', 1, null, 48.5, null, 'Undecorated | S-5XL', '{"source_row_number":382,"tier_index":1,"qty":1,"unit_cost":"48.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BMA', 'AUD', 100, null, 46.5, null, 'Undecorated | S-5XL', '{"source_row_number":382,"tier_index":2,"qty":100,"unit_cost":"46.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WBMA', 'AUD', 1, null, 48.5, null, 'Undecorated | 8-20', '{"source_row_number":383,"tier_index":1,"qty":1,"unit_cost":"48.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WBMA', 'AUD', 100, null, 46.5, null, 'Undecorated | 8-20', '{"source_row_number":383,"tier_index":2,"qty":100,"unit_cost":"46.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'OWTFL', 'AUD', 1, null, 7.95, null, 'Undecorated | 8-26', '{"source_row_number":384,"tier_index":1,"qty":1,"unit_cost":"7.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'IGTTF', 'AUD', 1, null, 31.5, null, 'Undecorated', '{"source_row_number":385,"tier_index":1,"qty":1,"unit_cost":"31.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'IGTTF', 'AUD', 100, null, 29.5, null, 'Undecorated', '{"source_row_number":385,"tier_index":2,"qty":100,"unit_cost":"29.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'IGWFFJ', 'AUD', 1, null, 18.5, null, 'Undecorated', '{"source_row_number":386,"tier_index":1,"qty":1,"unit_cost":"18.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'IGWFFJ', 'AUD', 100, null, 17.5, null, 'Undecorated', '{"source_row_number":386,"tier_index":2,"qty":100,"unit_cost":"17.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'IGHSMB', 'AUD', 1, null, 35.5, null, 'Undecorated', '{"source_row_number":387,"tier_index":1,"qty":1,"unit_cost":"35.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'IGHSMB', 'AUD', 100, null, 33.5, null, 'Undecorated', '{"source_row_number":387,"tier_index":2,"qty":100,"unit_cost":"33.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'IGHHC', 'AUD', 1, null, 24.5, null, 'Undecorated', '{"source_row_number":388,"tier_index":1,"qty":1,"unit_cost":"24.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'IGHHC', 'AUD', 100, null, 22.5, null, 'Undecorated', '{"source_row_number":388,"tier_index":2,"qty":100,"unit_cost":"22.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'IGSCFAK', 'AUD', 1, null, 27.5, null, 'Undecorated', '{"source_row_number":389,"tier_index":1,"qty":1,"unit_cost":"27.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'IGSCFAK', 'AUD', 100, null, 25.5, null, 'Undecorated', '{"source_row_number":389,"tier_index":2,"qty":100,"unit_cost":"25.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'IGVGMT', 'AUD', 1, null, 24.5, null, 'Undecorated', '{"source_row_number":390,"tier_index":1,"qty":1,"unit_cost":"24.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'IGVGMT', 'AUD', 100, null, 22.5, null, 'Undecorated', '{"source_row_number":390,"tier_index":2,"qty":100,"unit_cost":"22.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'IGBCPK', 'AUD', 1, null, 19.5, null, 'Undecorated', '{"source_row_number":391,"tier_index":1,"qty":1,"unit_cost":"19.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'IGBCPK', 'AUD', 100, null, 18.5, null, 'Undecorated', '{"source_row_number":391,"tier_index":2,"qty":100,"unit_cost":"18.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'IGLPT', 'AUD', 1, null, 34.5, null, 'Undecorated', '{"source_row_number":392,"tier_index":1,"qty":1,"unit_cost":"34.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'IGLPT', 'AUD', 100, null, 32.5, null, 'Undecorated', '{"source_row_number":392,"tier_index":2,"qty":100,"unit_cost":"32.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'IGGGBO', 'AUD', 1, null, 43, null, 'Undecorated', '{"source_row_number":393,"tier_index":1,"qty":1,"unit_cost":"43","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'IGGGBO', 'AUD', 100, null, 41, null, 'Undecorated', '{"source_row_number":393,"tier_index":2,"qty":100,"unit_cost":"41","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BOC', 'AUD', 1, null, 48.5, null, 'Undecorated | S-5XL', '{"source_row_number":394,"tier_index":1,"qty":1,"unit_cost":"48.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BOC', 'AUD', 100, null, 46.5, null, 'Undecorated | S-5XL', '{"source_row_number":394,"tier_index":2,"qty":100,"unit_cost":"46.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WBOC', 'AUD', 1, null, 48.5, null, 'Undecorated | 8-20', '{"source_row_number":395,"tier_index":1,"qty":1,"unit_cost":"48.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WBOC', 'AUD', 100, null, 46.5, null, 'Undecorated | 8-20', '{"source_row_number":395,"tier_index":2,"qty":100,"unit_cost":"46.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BBR', 'AUD', 1, null, 48.5, null, 'Undecorated | S-5XL', '{"source_row_number":396,"tier_index":1,"qty":1,"unit_cost":"48.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BBR', 'AUD', 100, null, 46.5, null, 'Undecorated | S-5XL', '{"source_row_number":396,"tier_index":2,"qty":100,"unit_cost":"46.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WBBR', 'AUD', 1, null, 48.5, null, 'Undecorated | 8-20', '{"source_row_number":397,"tier_index":1,"qty":1,"unit_cost":"48.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WBBR', 'AUD', 100, null, 46.5, null, 'Undecorated | 8-20', '{"source_row_number":397,"tier_index":2,"qty":100,"unit_cost":"46.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'OTAX', 'AUD', 1, null, 7.95, null, 'Undecorated | S-5XL', '{"source_row_number":398,"tier_index":1,"qty":1,"unit_cost":"7.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'OTTBL', 'AUD', 1, null, 7.95, null, 'Undecorated | S-4XL', '{"source_row_number":399,"tier_index":1,"qty":1,"unit_cost":"7.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'ONV', 'AUD', 1, null, 19.95, null, 'Undecorated | XS-3XL', '{"source_row_number":400,"tier_index":1,"qty":1,"unit_cost":"19.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POKC', 'AUD', 1, null, 19.5, null, 'Undecorated', '{"source_row_number":401,"tier_index":1,"qty":1,"unit_cost":"19.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POKC', 'AUD', 100, null, 18.5, null, 'Undecorated', '{"source_row_number":401,"tier_index":2,"qty":100,"unit_cost":"18.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POPIB', 'AUD', 1, null, 65, null, 'Undecorated', '{"source_row_number":402,"tier_index":1,"qty":1,"unit_cost":"65","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POPIB', 'AUD', 100, null, 63, null, 'Undecorated', '{"source_row_number":402,"tier_index":2,"qty":100,"unit_cost":"63","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'PORRS', 'AUD', 1, null, 85, null, 'Undecorated', '{"source_row_number":403,"tier_index":1,"qty":1,"unit_cost":"85","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'PORRS', 'AUD', 100, null, 82, null, 'Undecorated', '{"source_row_number":403,"tier_index":2,"qty":100,"unit_cost":"82","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POGPS', 'AUD', 1, null, 59, null, 'Undecorated', '{"source_row_number":404,"tier_index":1,"qty":1,"unit_cost":"59","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POGPS', 'AUD', 100, null, 57, null, 'Undecorated', '{"source_row_number":404,"tier_index":2,"qty":100,"unit_cost":"57","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POVCB', 'AUD', 1, null, 60, null, 'Undecorated', '{"source_row_number":405,"tier_index":1,"qty":1,"unit_cost":"60","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'POVCB', 'AUD', 100, null, 58, null, 'Undecorated', '{"source_row_number":405,"tier_index":2,"qty":100,"unit_cost":"58","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'IGFLT', 'AUD', 1, null, 30, null, 'Undecorated', '{"source_row_number":406,"tier_index":1,"qty":1,"unit_cost":"30","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'IGFLT', 'AUD', 100, null, 28, null, 'Undecorated', '{"source_row_number":406,"tier_index":2,"qty":100,"unit_cost":"28","price_product_code":null,"price_notes":null}'::jsonb)
) as v(supplier, supplier_sku, currency, min_qty, max_qty, unit_cost, setup_cost, price_label, raw_json);

with gfl_batch as (
  select id as batch_id
  from public.supplier_import_batches
  where supplier = 'Gear For Life'
    and source_file_hash = 'f20ede9ac24d944fcb4c3c646d8ae2cbc41d2c63580200db27f2e86a96bf739c'
  order by created_at desc
  limit 1
)
insert into public.supplier_price_rows (
  batch_id, supplier, supplier_sku, currency, min_qty, max_qty, unit_cost, setup_cost, price_label, raw_json
)
select
  gfl_batch.batch_id,
  v.supplier::text, v.supplier_sku::text, v.currency::text, v.min_qty::int, v.max_qty::int, v.unit_cost::numeric, v.setup_cost::numeric, v.price_label::text, v.raw_json::jsonb
from gfl_batch
cross join (
  values
    ('Gear For Life', 'IGOBT', 'AUD', 1, null, 63, null, 'Undecorated', '{"source_row_number":407,"tier_index":1,"qty":1,"unit_cost":"63","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'IGOBT', 'AUD', 100, null, 61, null, 'Undecorated', '{"source_row_number":407,"tier_index":2,"qty":100,"unit_cost":"61","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'IGOISB', 'AUD', 1, null, 108, null, 'Undecorated', '{"source_row_number":408,"tier_index":1,"qty":1,"unit_cost":"108","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'IGOISB', 'AUD', 100, null, 103, null, 'Undecorated', '{"source_row_number":408,"tier_index":2,"qty":100,"unit_cost":"103","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'IGCGB', 'AUD', 1, null, 27, null, 'Undecorated', '{"source_row_number":409,"tier_index":1,"qty":1,"unit_cost":"27","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'IGCGB', 'AUD', 100, null, 25, null, 'Undecorated', '{"source_row_number":409,"tier_index":2,"qty":100,"unit_cost":"25","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'IGDVC', 'AUD', 1, null, 39, null, 'Undecorated', '{"source_row_number":410,"tier_index":1,"qty":1,"unit_cost":"39","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'IGDVC', 'AUD', 100, null, 37, null, 'Undecorated', '{"source_row_number":410,"tier_index":2,"qty":100,"unit_cost":"37","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WTBT', 'AUD', 1, null, 37, null, 'Undecorated | 10-26', '{"source_row_number":411,"tier_index":1,"qty":1,"unit_cost":"37","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WTBT', 'AUD', 100, null, 35, null, 'Undecorated | 10-26', '{"source_row_number":411,"tier_index":2,"qty":100,"unit_cost":"35","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGEP', 'AUD', 1, null, 21, null, 'Undecorated | S-3XL', '{"source_row_number":412,"tier_index":1,"qty":1,"unit_cost":"21","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGEP', 'AUD', 100, null, 20.5, null, 'Undecorated | S-3XL', '{"source_row_number":412,"tier_index":2,"qty":100,"unit_cost":"20.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGP', 'AUD', 1, null, 21, null, 'Undecorated | S-5XL', '{"source_row_number":413,"tier_index":1,"qty":1,"unit_cost":"21","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGP', 'AUD', 100, null, 20.5, null, 'Undecorated | S-5XL', '{"source_row_number":413,"tier_index":2,"qty":100,"unit_cost":"20.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGSP', 'AUD', 1, null, 21, null, 'Undecorated | 4XS-5XL', '{"source_row_number":414,"tier_index":1,"qty":1,"unit_cost":"21","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGSP', 'AUD', 100, null, 20.5, null, 'Undecorated | 4XS-5XL', '{"source_row_number":414,"tier_index":2,"qty":100,"unit_cost":"20.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGSP(Y)', 'AUD', 1, null, 21, null, 'Undecorated | 4XS-XXS', '{"source_row_number":415,"tier_index":1,"qty":1,"unit_cost":"21","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGSP(Y)', 'AUD', 100, null, 20.5, null, 'Undecorated | 4XS-XXS', '{"source_row_number":415,"tier_index":2,"qty":100,"unit_cost":"20.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGST', 'AUD', 1, null, 18.5, null, 'Undecorated | 4XS-5XL', '{"source_row_number":416,"tier_index":1,"qty":1,"unit_cost":"18.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGST', 'AUD', 100, null, 18, null, 'Undecorated | 4XS-5XL', '{"source_row_number":416,"tier_index":2,"qty":100,"unit_cost":"18","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGST(Y)', 'AUD', 1, null, 18.5, null, 'Undecorated | 4XS-XXS', '{"source_row_number":417,"tier_index":1,"qty":1,"unit_cost":"18.5","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'DGST(Y)', 'AUD', 100, null, 18, null, 'Undecorated | 4XS-XXS', '{"source_row_number":417,"tier_index":2,"qty":100,"unit_cost":"18","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WLV', 'AUD', 1, null, 41, null, 'Undecorated | 8-18', '{"source_row_number":418,"tier_index":1,"qty":1,"unit_cost":"41","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WLV', 'AUD', 100, null, 39, null, 'Undecorated | 8-18', '{"source_row_number":418,"tier_index":2,"qty":100,"unit_cost":"39","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'TMT', 'AUD', 1, null, 22, null, 'Undecorated | S-5XL', '{"source_row_number":419,"tier_index":1,"qty":1,"unit_cost":"22","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'TMT', 'AUD', 100, null, 20, null, 'Undecorated | S-5XL', '{"source_row_number":419,"tier_index":2,"qty":100,"unit_cost":"20","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'TE', 'AUD', 1, null, 29, null, 'Undecorated | S-5XL', '{"source_row_number":420,"tier_index":1,"qty":1,"unit_cost":"29","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'TE', 'AUD', 100, null, 27, null, 'Undecorated | S-5XL', '{"source_row_number":420,"tier_index":2,"qty":100,"unit_cost":"27","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'EGAB', 'AUD', 1, null, 20, null, 'Undecorated | One size', '{"source_row_number":421,"tier_index":1,"qty":1,"unit_cost":"20","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'EGAB', 'AUD', 100, null, 19, null, 'Undecorated | One size', '{"source_row_number":421,"tier_index":2,"qty":100,"unit_cost":"19","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'OTSC', 'AUD', 1, null, 7.95, null, 'Undecorated | S-5XL', '{"source_row_number":422,"tier_index":1,"qty":1,"unit_cost":"7.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'OTMT', 'AUD', 1, null, 7.95, null, 'Undecorated | S-5XL', '{"source_row_number":423,"tier_index":1,"qty":1,"unit_cost":"7.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'OGJ', 'AUD', 1, null, 24.95, null, 'Undecorated | XS-5XL', '{"source_row_number":424,"tier_index":1,"qty":1,"unit_cost":"24.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'OWLV', 'AUD', 1, null, 19.95, null, 'Undecorated | 8-18', '{"source_row_number":425,"tier_index":1,"qty":1,"unit_cost":"19.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'OVT', 'AUD', 1, null, 18.95, null, 'Undecorated | XS-5XL', '{"source_row_number":426,"tier_index":1,"qty":1,"unit_cost":"18.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'ODGP', 'AUD', 1, null, 8.95, null, 'Undecorated | S-5XL', '{"source_row_number":427,"tier_index":1,"qty":1,"unit_cost":"8.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'ODGEP', 'AUD', 1, null, 9.95, null, 'Undecorated | S-3XL', '{"source_row_number":428,"tier_index":1,"qty":1,"unit_cost":"9.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'ODGSP', 'AUD', 1, null, 9.95, null, 'Undecorated | 4XS-5XL', '{"source_row_number":429,"tier_index":1,"qty":1,"unit_cost":"9.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'ODGST', 'AUD', 1, null, 9.95, null, 'Undecorated | 4XS-5XL', '{"source_row_number":430,"tier_index":1,"qty":1,"unit_cost":"9.95","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BOTH', 'AUD', 1, null, 97, null, 'Undecorated', '{"source_row_number":431,"tier_index":1,"qty":1,"unit_cost":"97","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BOTH', 'AUD', 100, null, 94, null, 'Undecorated', '{"source_row_number":431,"tier_index":2,"qty":100,"unit_cost":"94","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BVTB', 'AUD', 1, null, 89, null, 'Undecorated', '{"source_row_number":432,"tier_index":1,"qty":1,"unit_cost":"89","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BVTB', 'AUD', 100, null, 86, null, 'Undecorated', '{"source_row_number":432,"tier_index":2,"qty":100,"unit_cost":"86","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BHPD', 'AUD', 1, null, 53, null, 'Undecorated', '{"source_row_number":433,"tier_index":1,"qty":1,"unit_cost":"53","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BHPD', 'AUD', 100, null, 51, null, 'Undecorated', '{"source_row_number":433,"tier_index":2,"qty":100,"unit_cost":"51","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BMLB', 'AUD', 1, null, 48, null, 'Undecorated', '{"source_row_number":434,"tier_index":1,"qty":1,"unit_cost":"48","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BMLB', 'AUD', 100, null, 46, null, 'Undecorated', '{"source_row_number":434,"tier_index":2,"qty":100,"unit_cost":"46","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BCWJ', 'AUD', 1, null, 165, null, 'Undecorated | XXS-7XL', '{"source_row_number":435,"tier_index":1,"qty":1,"unit_cost":"165","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BCWJ', 'AUD', 100, null, 160, null, 'Undecorated | XXS-7XL', '{"source_row_number":435,"tier_index":2,"qty":100,"unit_cost":"160","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BEP', 'AUD', 1, null, 33, null, 'Undecorated | S-5XL', '{"source_row_number":436,"tier_index":1,"qty":1,"unit_cost":"33","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'BEP', 'AUD', 100, null, 31, null, 'Undecorated | S-5XL', '{"source_row_number":436,"tier_index":2,"qty":100,"unit_cost":"31","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WBEP', 'AUD', 1, null, 33, null, 'Undecorated | 8-20', '{"source_row_number":437,"tier_index":1,"qty":1,"unit_cost":"33","price_product_code":null,"price_notes":null}'::jsonb),
    ('Gear For Life', 'WBEP', 'AUD', 100, null, 31, null, 'Undecorated | 8-20', '{"source_row_number":437,"tier_index":2,"qty":100,"unit_cost":"31","price_product_code":null,"price_notes":null}'::jsonb)
) as v(supplier, supplier_sku, currency, min_qty, max_qty, unit_cost, setup_cost, price_label, raw_json);

do $$
declare
  gfl_batch_id uuid;
begin
  select id into gfl_batch_id
  from public.supplier_import_batches
  where supplier = 'Gear For Life'
    and source_file_hash = 'f20ede9ac24d944fcb4c3c646d8ae2cbc41d2c63580200db27f2e86a96bf739c'
  order by created_at desc
  limit 1;

  if gfl_batch_id is null then
    raise exception 'Gear For Life batch row was not created. Run part 01 first.';
  end if;

  if (select count(*) from public.supplier_price_rows where batch_id = gfl_batch_id) <> 773 then
    raise exception 'part 11 expected 773 rows in public.supplier_price_rows after insert.';
  end if;
end $$;

commit;

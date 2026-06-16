-- Gear For Life raw load SQL Editor split part 08
-- insert 892 rows into public.supplier_raw_colour_options; expected count 0 -> 892
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

  if (select count(*) from public.supplier_raw_colour_options where batch_id = gfl_batch_id) <> 0 then
    raise exception 'part 08 expected 0 existing rows in public.supplier_raw_colour_options. Stop: run parts in order and do not rerun completed parts.';
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
insert into public.supplier_raw_colour_options (
  batch_id, supplier, supplier_sku, colour_key, colour_name, colour_code, hex, sort_order, raw_json
)
select
  gfl_batch.batch_id,
  v.supplier::text, v.supplier_sku::text, v.colour_key::text, v.colour_name::text, v.colour_code::text, v.hex::text, v.sort_order::text, v.raw_json::jsonb
from gfl_batch
cross join (
  values
    ('Gear For Life', 'AN(C)', 'black-gold-1', 'black/gold', null, null, 1, '{"supplier_colour":"black/gold","appa_colour":"Black/Yellow","colour_product_code":null,"source_row_number":2}'::jsonb),
    ('Gear For Life', 'AN(C)', 'black-red-2', 'black/red', null, null, 2, '{"supplier_colour":"black/red","appa_colour":"Black/Red","colour_product_code":null,"source_row_number":2}'::jsonb),
    ('Gear For Life', 'AN(C)', 'navy-sky-3', 'navy/sky', null, null, 3, '{"supplier_colour":"navy/sky","appa_colour":"Dark Blue/Light Blue","colour_product_code":null,"source_row_number":2}'::jsonb),
    ('Gear For Life', 'AN(C)', 'navy-red-4', 'navy/red', null, null, 4, '{"supplier_colour":"navy/red","appa_colour":"Dark Blue/Red","colour_product_code":null,"source_row_number":2}'::jsonb),
    ('Gear For Life', 'AN(P)', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":3}'::jsonb),
    ('Gear For Life', 'AN(P)', 'navy-2', 'navy', null, null, 2, '{"supplier_colour":"navy","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":3}'::jsonb),
    ('Gear For Life', 'AN(Y)', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":4}'::jsonb),
    ('Gear For Life', 'AN(Y)', 'navy-2', 'navy', null, null, 2, '{"supplier_colour":"navy","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":4}'::jsonb),
    ('Gear For Life', 'ASBJ', 'navy-1', 'navy', null, null, 1, '{"supplier_colour":"navy","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":5}'::jsonb),
    ('Gear For Life', 'ASROV', 'brown-1', 'brown', null, null, 1, '{"supplier_colour":"brown","appa_colour":"Brown","colour_product_code":null,"source_row_number":6}'::jsonb),
    ('Gear For Life', 'BT', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":7}'::jsonb),
    ('Gear For Life', 'CWJ', 'navy-charcoal-1', 'navy/charcoal', null, null, 1, '{"supplier_colour":"navy/charcoal","appa_colour":"Dark Blue/Dark Grey","colour_product_code":null,"source_row_number":8}'::jsonb),
    ('Gear For Life', 'DET', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":9}'::jsonb),
    ('Gear For Life', 'DET(Y)', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":10}'::jsonb),
    ('Gear For Life', 'DGAXP', 'grey-storm-1', 'grey storm', null, null, 1, '{"supplier_colour":"grey storm","appa_colour":"Dark Grey","colour_product_code":null,"source_row_number":11}'::jsonb),
    ('Gear For Life', 'DGAXP', 'aluminium-2', 'aluminium', null, null, 2, '{"supplier_colour":"aluminium","appa_colour":"Grey","colour_product_code":null,"source_row_number":11}'::jsonb),
    ('Gear For Life', 'DGAXP', 'black-3', 'black', null, null, 3, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":11}'::jsonb),
    ('Gear For Life', 'DGAXP', 'navy-4', 'navy', null, null, 4, '{"supplier_colour":"navy","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":11}'::jsonb),
    ('Gear For Life', 'DGAXP', 'white-5', 'white', null, null, 5, '{"supplier_colour":"white","appa_colour":"White","colour_product_code":null,"source_row_number":11}'::jsonb),
    ('Gear For Life', 'DGCHP', 'black-charcoal-white-1', 'black/charcoal/white', null, null, 1, '{"supplier_colour":"black/charcoal/white","appa_colour":"Black/Dark Grey/White","colour_product_code":null,"source_row_number":12}'::jsonb),
    ('Gear For Life', 'DGCHP', 'black-gold-white-2', 'black/gold/white', null, null, 2, '{"supplier_colour":"black/gold/white","appa_colour":"Black/Yellow/White","colour_product_code":null,"source_row_number":12}'::jsonb),
    ('Gear For Life', 'DGCHP', 'black-white-black-3', 'black/white/black', null, null, 3, '{"supplier_colour":"black/white/black","appa_colour":"Black/White/Black","colour_product_code":null,"source_row_number":12}'::jsonb),
    ('Gear For Life', 'DGCHP', 'navy-gold-white-4', 'navy/gold/white', null, null, 4, '{"supplier_colour":"navy/gold/white","appa_colour":"Dark Blue/Yellow/White","colour_product_code":null,"source_row_number":12}'::jsonb),
    ('Gear For Life', 'DGCHP', 'royal-white-royal-5', 'royal/white/royal', null, null, 5, '{"supplier_colour":"royal/white/royal","appa_colour":"Blue/White/Blue","colour_product_code":null,"source_row_number":12}'::jsonb),
    ('Gear For Life', 'DGCHP', 'white-navy-white-6', 'white/navy/white', null, null, 6, '{"supplier_colour":"white/navy/white","appa_colour":"White/Dark Blue/White","colour_product_code":null,"source_row_number":12}'::jsonb),
    ('Gear For Life', 'DGCHP', 'white-black-white-7', 'white/black/white', null, null, 7, '{"supplier_colour":"white/black/white","appa_colour":"White/Black/White","colour_product_code":null,"source_row_number":12}'::jsonb),
    ('Gear For Life', 'DGCHP(Y)', 'black-charcoal-white-1', 'black/charcoal/white', null, null, 1, '{"supplier_colour":"black/charcoal/white","appa_colour":"Black/Dark Grey/White","colour_product_code":null,"source_row_number":13}'::jsonb),
    ('Gear For Life', 'DGCHP(Y)', 'black-gold-white-2', 'black/gold/white', null, null, 2, '{"supplier_colour":"black/gold/white","appa_colour":"Black/Yellow/White","colour_product_code":null,"source_row_number":13}'::jsonb),
    ('Gear For Life', 'DGCHP(Y)', 'black-white-black-3', 'black/white/black', null, null, 3, '{"supplier_colour":"black/white/black","appa_colour":"Black/White/Black","colour_product_code":null,"source_row_number":13}'::jsonb),
    ('Gear For Life', 'DGCHP(Y)', 'navy-gold-white-4', 'navy/gold/white', null, null, 4, '{"supplier_colour":"navy/gold/white","appa_colour":"Dark Blue/Yellow/White","colour_product_code":null,"source_row_number":13}'::jsonb),
    ('Gear For Life', 'DGCHP(Y)', 'royal-white-royal-5', 'royal/white/royal', null, null, 5, '{"supplier_colour":"royal/white/royal","appa_colour":"Blue/White/Blue","colour_product_code":null,"source_row_number":13}'::jsonb),
    ('Gear For Life', 'DGCHP(Y)', 'white-navy-white-6', 'white/navy/white', null, null, 6, '{"supplier_colour":"white/navy/white","appa_colour":"White/Dark Blue/White","colour_product_code":null,"source_row_number":13}'::jsonb),
    ('Gear For Life', 'DGCHP(Y)', 'white-black-white-7', 'white/black/white', null, null, 7, '{"supplier_colour":"white/black/white","appa_colour":"White/Black/White","colour_product_code":null,"source_row_number":13}'::jsonb),
    ('Gear For Life', 'DGCP', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":14}'::jsonb),
    ('Gear For Life', 'DGCP', 'navy-2', 'navy', null, null, 2, '{"supplier_colour":"navy","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":14}'::jsonb),
    ('Gear For Life', 'DGDP', 'black-aluminium-1', 'black/aluminium', null, null, 1, '{"supplier_colour":"black/aluminium","appa_colour":"Black/Grey","colour_product_code":null,"source_row_number":15}'::jsonb),
    ('Gear For Life', 'DGDP', 'cyber-blue-black-2', 'cyber blue/black', null, null, 2, '{"supplier_colour":"cyber blue/black","appa_colour":"Blue/Black","colour_product_code":null,"source_row_number":15}'::jsonb),
    ('Gear For Life', 'DGDP', 'navy-aluminium-3', 'navy/aluminium', null, null, 3, '{"supplier_colour":"navy/aluminium","appa_colour":"Dark Blue/Grey","colour_product_code":null,"source_row_number":15}'::jsonb),
    ('Gear For Life', 'DGHP', 'black-white-1', 'black/white', null, null, 1, '{"supplier_colour":"black/white","appa_colour":"Black/White","colour_product_code":null,"source_row_number":16}'::jsonb),
    ('Gear For Life', 'DGHP', 'blueberry-navy-2', 'blueberry/navy', null, null, 2, '{"supplier_colour":"blueberry/navy","appa_colour":"Blue/Dark Blue","colour_product_code":null,"source_row_number":16}'::jsonb),
    ('Gear For Life', 'DGHP', 'navy-white-3', 'navy/white', null, null, 3, '{"supplier_colour":"navy/white","appa_colour":"Dark Blue/White","colour_product_code":null,"source_row_number":16}'::jsonb),
    ('Gear For Life', 'DGHP', 'white-navy-4', 'white/navy', null, null, 4, '{"supplier_colour":"white/navy","appa_colour":"White/Dark Blue","colour_product_code":null,"source_row_number":16}'::jsonb),
    ('Gear For Life', 'DGIP', 'black-charcoal-1', 'black/charcoal', null, null, 1, '{"supplier_colour":"black/charcoal","appa_colour":"Black/Dark Grey","colour_product_code":null,"source_row_number":17}'::jsonb),
    ('Gear For Life', 'DGIP', 'royal-white-2', 'Royal/white', null, null, 2, '{"supplier_colour":"Royal/white","appa_colour":"Blue/White","colour_product_code":null,"source_row_number":17}'::jsonb),
    ('Gear For Life', 'DGLHP', 'black-white-1', 'black/white', null, null, 1, '{"supplier_colour":"black/white","appa_colour":"Black/White","colour_product_code":null,"source_row_number":18}'::jsonb),
    ('Gear For Life', 'DGLHP', 'navy-white-2', 'navy/white', null, null, 2, '{"supplier_colour":"navy/white","appa_colour":"Dark Blue/White","colour_product_code":null,"source_row_number":18}'::jsonb),
    ('Gear For Life', 'DGLHP', 'white-navy-3', 'white/navy', null, null, 3, '{"supplier_colour":"white/navy","appa_colour":"White/Dark Blue","colour_product_code":null,"source_row_number":18}'::jsonb),
    ('Gear For Life', 'DGLS', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":19}'::jsonb),
    ('Gear For Life', 'DGMLP', 'graphite-melange-1', 'graphite melange', null, null, 1, '{"supplier_colour":"graphite melange","appa_colour":"Grey","colour_product_code":null,"source_row_number":20}'::jsonb),
    ('Gear For Life', 'DGMP', 'black-aluminium-1', 'black/aluminium', null, null, 1, '{"supplier_colour":"black/aluminium","appa_colour":"Black/Grey","colour_product_code":null,"source_row_number":21}'::jsonb),
    ('Gear For Life', 'DGOL', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":22}'::jsonb),
    ('Gear For Life', 'DGOL', 'navy-2', 'navy', null, null, 2, '{"supplier_colour":"navy","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":22}'::jsonb),
    ('Gear For Life', 'DGOL', 'white-3', 'white', null, null, 3, '{"supplier_colour":"white","appa_colour":"White","colour_product_code":null,"source_row_number":22}'::jsonb),
    ('Gear For Life', 'DGPO', 'black-red-1', 'black/red', null, null, 1, '{"supplier_colour":"black/red","appa_colour":"Black/Red","colour_product_code":null,"source_row_number":23}'::jsonb),
    ('Gear For Life', 'DGPO', 'black-white-2', 'black/white', null, null, 2, '{"supplier_colour":"black/white","appa_colour":"Black/White","colour_product_code":null,"source_row_number":23}'::jsonb),
    ('Gear For Life', 'DGPO', 'bluestone-white-3', 'bluestone/white', null, null, 3, '{"supplier_colour":"bluestone/white","appa_colour":"Blue/White","colour_product_code":null,"source_row_number":23}'::jsonb),
    ('Gear For Life', 'DGPO', 'navy-white-4', 'navy/white', null, null, 4, '{"supplier_colour":"navy/white","appa_colour":"Dark Blue/White","colour_product_code":null,"source_row_number":23}'::jsonb),
    ('Gear For Life', 'DGR', 'navy-1', 'navy', null, null, 1, '{"supplier_colour":"navy","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":24}'::jsonb),
    ('Gear For Life', 'DGR', 'red-2', 'red', null, null, 2, '{"supplier_colour":"red","appa_colour":"Red","colour_product_code":null,"source_row_number":24}'::jsonb),
    ('Gear For Life', 'DGR', 'royal-3', 'royal', null, null, 3, '{"supplier_colour":"royal","appa_colour":"Blue","colour_product_code":null,"source_row_number":24}'::jsonb),
    ('Gear For Life', 'DGRFP', 'black-charcoal-1', 'black/charcoal', null, null, 1, '{"supplier_colour":"black/charcoal","appa_colour":"Black/Dark Grey","colour_product_code":null,"source_row_number":25}'::jsonb),
    ('Gear For Life', 'DGRFP', 'black-red-2', 'black/red', null, null, 2, '{"supplier_colour":"black/red","appa_colour":"Black/Red","colour_product_code":null,"source_row_number":25}'::jsonb),
    ('Gear For Life', 'DGRFP', 'black-royal-3', 'black/royal', null, null, 3, '{"supplier_colour":"black/royal","appa_colour":"Black/Blue","colour_product_code":null,"source_row_number":25}'::jsonb),
    ('Gear For Life', 'DGRFP', 'black-white-4', 'black/white', null, null, 4, '{"supplier_colour":"black/white","appa_colour":"Black/White","colour_product_code":null,"source_row_number":25}'::jsonb),
    ('Gear For Life', 'DGRFP', 'navy-red-5', 'navy/red', null, null, 5, '{"supplier_colour":"navy/red","appa_colour":"Dark Blue/Red","colour_product_code":null,"source_row_number":25}'::jsonb),
    ('Gear For Life', 'DGRFP', 'navy-white-6', 'navy/white', null, null, 6, '{"supplier_colour":"navy/white","appa_colour":"Dark Blue/White","colour_product_code":null,"source_row_number":25}'::jsonb),
    ('Gear For Life', 'DGRFP', 'white-navy-7', 'white/navy', null, null, 7, '{"supplier_colour":"white/navy","appa_colour":"White/Dark Blue","colour_product_code":null,"source_row_number":25}'::jsonb),
    ('Gear For Life', 'DGRFP(Y)', 'black-charcoal-1', 'black/charcoal', null, null, 1, '{"supplier_colour":"black/charcoal","appa_colour":"Black/Dark Grey","colour_product_code":null,"source_row_number":26}'::jsonb),
    ('Gear For Life', 'DGRFP(Y)', 'black-red-2', 'black/red', null, null, 2, '{"supplier_colour":"black/red","appa_colour":"Black/Red","colour_product_code":null,"source_row_number":26}'::jsonb),
    ('Gear For Life', 'DGRFP(Y)', 'black-royal-3', 'black/royal', null, null, 3, '{"supplier_colour":"black/royal","appa_colour":"Black/Blue","colour_product_code":null,"source_row_number":26}'::jsonb),
    ('Gear For Life', 'DGRFP(Y)', 'black-white-4', 'black/white', null, null, 4, '{"supplier_colour":"black/white","appa_colour":"Black/White","colour_product_code":null,"source_row_number":26}'::jsonb),
    ('Gear For Life', 'DGRFP(Y)', 'navy-red-5', 'navy/red', null, null, 5, '{"supplier_colour":"navy/red","appa_colour":"Dark Blue/Red","colour_product_code":null,"source_row_number":26}'::jsonb),
    ('Gear For Life', 'DGRFP(Y)', 'navy-white-6', 'navy/white', null, null, 6, '{"supplier_colour":"navy/white","appa_colour":"Dark Blue/White","colour_product_code":null,"source_row_number":26}'::jsonb),
    ('Gear For Life', 'DGRFP(Y)', 'white-navy-7', 'white/navy', null, null, 7, '{"supplier_colour":"white/navy","appa_colour":"White/Dark Blue","colour_product_code":null,"source_row_number":26}'::jsonb),
    ('Gear For Life', 'DGRFZ', 'black-royal-1', 'black/royal', null, null, 1, '{"supplier_colour":"black/royal","appa_colour":"Black/Blue","colour_product_code":null,"source_row_number":27}'::jsonb),
    ('Gear For Life', 'DGRFZ', 'black-white-2', 'black/white', null, null, 2, '{"supplier_colour":"black/white","appa_colour":"Black/White","colour_product_code":null,"source_row_number":27}'::jsonb),
    ('Gear For Life', 'DGRFZ(Y)', 'black-royal-1', 'black/royal', null, null, 1, '{"supplier_colour":"black/royal","appa_colour":"Black/Blue","colour_product_code":null,"source_row_number":28}'::jsonb),
    ('Gear For Life', 'DGRFZ(Y)', 'black-white-2', 'black/white', null, null, 2, '{"supplier_colour":"black/white","appa_colour":"Black/White","colour_product_code":null,"source_row_number":28}'::jsonb),
    ('Gear For Life', 'DGXS', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":29}'::jsonb),
    ('Gear For Life', 'DGXS', 'navy-2', 'navy', null, null, 2, '{"supplier_colour":"navy","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":29}'::jsonb)
) as v(supplier, supplier_sku, colour_key, colour_name, colour_code, hex, sort_order, raw_json);

with gfl_batch as (
  select id as batch_id
  from public.supplier_import_batches
  where supplier = 'Gear For Life'
    and source_file_hash = 'f20ede9ac24d944fcb4c3c646d8ae2cbc41d2c63580200db27f2e86a96bf739c'
  order by created_at desc
  limit 1
)
insert into public.supplier_raw_colour_options (
  batch_id, supplier, supplier_sku, colour_key, colour_name, colour_code, hex, sort_order, raw_json
)
select
  gfl_batch.batch_id,
  v.supplier::text, v.supplier_sku::text, v.colour_key::text, v.colour_name::text, v.colour_code::text, v.hex::text, v.sort_order::text, v.raw_json::jsonb
from gfl_batch
cross join (
  values
    ('Gear For Life', 'WDGXS', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":30}'::jsonb),
    ('Gear For Life', 'WDGXS', 'navy-2', 'navy', null, null, 2, '{"supplier_colour":"navy","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":30}'::jsonb),
    ('Gear For Life', 'DGSH', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":31}'::jsonb),
    ('Gear For Life', 'DGSP(I)', 'black-aluminium-1', 'black/aluminium', null, null, 1, '{"supplier_colour":"black/aluminium","appa_colour":"Black/Grey","colour_product_code":null,"source_row_number":32}'::jsonb),
    ('Gear For Life', 'DGST(I)', 'cool-lime-navy-1', 'cool lime/navy', null, null, 1, '{"supplier_colour":"cool lime/navy","appa_colour":"Light Green/Dark Blue","colour_product_code":null,"source_row_number":33}'::jsonb),
    ('Gear For Life', 'DGST(I)', 'navy-aluminium-2', 'navy/aluminium', null, null, 2, '{"supplier_colour":"navy/aluminium","appa_colour":"Dark Blue/Grey","colour_product_code":null,"source_row_number":33}'::jsonb),
    ('Gear For Life', 'DGST(I)', 'black-aluminium-3', 'black/aluminium', null, null, 3, '{"supplier_colour":"black/aluminium","appa_colour":"Black/Grey","colour_product_code":null,"source_row_number":33}'::jsonb),
    ('Gear For Life', 'DGSUP', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":34}'::jsonb),
    ('Gear For Life', 'DGSUP', 'navy-2', 'navy', null, null, 2, '{"supplier_colour":"navy","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":34}'::jsonb),
    ('Gear For Life', 'DGTP', 'white-aluminium-1', 'white/aluminium', null, null, 1, '{"supplier_colour":"white/aluminium","appa_colour":"White/Grey","colour_product_code":null,"source_row_number":35}'::jsonb),
    ('Gear For Life', 'DGVPP', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":36}'::jsonb),
    ('Gear For Life', 'DGZP', 'black-red-1', 'black/red', null, null, 1, '{"supplier_colour":"black/red","appa_colour":"Black/Red","colour_product_code":null,"source_row_number":37}'::jsonb),
    ('Gear For Life', 'DGZP', 'navy-red-2', 'navy/red', null, null, 2, '{"supplier_colour":"navy/red","appa_colour":"Dark Blue/Red","colour_product_code":null,"source_row_number":37}'::jsonb),
    ('Gear For Life', 'DGZP', 'navy-white-3', 'navy/white', null, null, 3, '{"supplier_colour":"navy/white","appa_colour":"Dark Blue/White","colour_product_code":null,"source_row_number":37}'::jsonb),
    ('Gear For Life', 'DGZP', 'sky-navy-4', 'sky/navy', null, null, 4, '{"supplier_colour":"sky/navy","appa_colour":"Light Blue/Dark Blue","colour_product_code":null,"source_row_number":37}'::jsonb),
    ('Gear For Life', 'DGZP', 'white-black-5', 'white/black', null, null, 5, '{"supplier_colour":"white/black","appa_colour":"White/Black","colour_product_code":null,"source_row_number":37}'::jsonb),
    ('Gear For Life', 'DGZP', 'white-navy-6', 'white/navy', null, null, 6, '{"supplier_colour":"white/navy","appa_colour":"White/Dark Blue","colour_product_code":null,"source_row_number":37}'::jsonb),
    ('Gear For Life', 'DGZP(Y)', 'black-red-1', 'black/red', null, null, 1, '{"supplier_colour":"black/red","appa_colour":"Black/Red","colour_product_code":null,"source_row_number":38}'::jsonb),
    ('Gear For Life', 'DGZP(Y)', 'navy-red-2', 'navy/red', null, null, 2, '{"supplier_colour":"navy/red","appa_colour":"Dark Blue/Red","colour_product_code":null,"source_row_number":38}'::jsonb),
    ('Gear For Life', 'DGZP(Y)', 'navy-white-3', 'navy/white', null, null, 3, '{"supplier_colour":"navy/white","appa_colour":"Dark Blue/White","colour_product_code":null,"source_row_number":38}'::jsonb),
    ('Gear For Life', 'DGZP(Y)', 'sky-navy-4', 'sky/navy', null, null, 4, '{"supplier_colour":"sky/navy","appa_colour":"Light Blue/Dark Blue","colour_product_code":null,"source_row_number":38}'::jsonb),
    ('Gear For Life', 'DGZP(Y)', 'white-black-5', 'white/black', null, null, 5, '{"supplier_colour":"white/black","appa_colour":"White/Black","colour_product_code":null,"source_row_number":38}'::jsonb),
    ('Gear For Life', 'DGZP(Y)', 'white-navy-6', 'white/navy', null, null, 6, '{"supplier_colour":"white/navy","appa_colour":"White/Dark Blue","colour_product_code":null,"source_row_number":38}'::jsonb),
    ('Gear For Life', 'DGZT', 'navy-red-1', 'navy/red', null, null, 1, '{"supplier_colour":"navy/red","appa_colour":"Dark Blue/Red","colour_product_code":null,"source_row_number":39}'::jsonb),
    ('Gear For Life', 'DGZT', 'silver-black-2', 'silver/black', null, null, 2, '{"supplier_colour":"silver/black","appa_colour":"Light Grey/Black","colour_product_code":null,"source_row_number":39}'::jsonb),
    ('Gear For Life', 'DGZT', 'sky-navy-3', 'sky/navy', null, null, 3, '{"supplier_colour":"sky/navy","appa_colour":"Light Blue/Dark Blue","colour_product_code":null,"source_row_number":39}'::jsonb),
    ('Gear For Life', 'DGZT', 'white-black-4', 'white/black', null, null, 4, '{"supplier_colour":"white/black","appa_colour":"White/Black","colour_product_code":null,"source_row_number":39}'::jsonb),
    ('Gear For Life', 'DGZT(Y)', 'navy-red-1', 'navy/red', null, null, 1, '{"supplier_colour":"navy/red","appa_colour":"Dark Blue/Red","colour_product_code":null,"source_row_number":40}'::jsonb),
    ('Gear For Life', 'DGZT(Y)', 'silver-black-2', 'silver/black', null, null, 2, '{"supplier_colour":"silver/black","appa_colour":"Light Grey/Black","colour_product_code":null,"source_row_number":40}'::jsonb),
    ('Gear For Life', 'DGZT(Y)', 'sky-navy-3', 'sky/navy', null, null, 3, '{"supplier_colour":"sky/navy","appa_colour":"Light Blue/Dark Blue","colour_product_code":null,"source_row_number":40}'::jsonb),
    ('Gear For Life', 'DGZT(Y)', 'white-black-4', 'white/black', null, null, 4, '{"supplier_colour":"white/black","appa_colour":"White/Black","colour_product_code":null,"source_row_number":40}'::jsonb),
    ('Gear For Life', 'DJ', 'charcoal-1', 'charcoal', null, null, 1, '{"supplier_colour":"charcoal","appa_colour":"Dark Grey","colour_product_code":null,"source_row_number":41}'::jsonb),
    ('Gear For Life', 'EGMDP', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":42}'::jsonb),
    ('Gear For Life', 'EGMDP', 'navy-2', 'navy', null, null, 2, '{"supplier_colour":"navy","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":42}'::jsonb),
    ('Gear For Life', 'EGMFV', 'navy-1', 'navy', null, null, 1, '{"supplier_colour":"navy","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":43}'::jsonb),
    ('Gear For Life', 'EGMSP', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":44}'::jsonb),
    ('Gear For Life', 'EGMZ', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":45}'::jsonb),
    ('Gear For Life', 'EGMZ', 'navy-2', 'navy', null, null, 2, '{"supplier_colour":"navy","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":45}'::jsonb),
    ('Gear For Life', 'EGMZ', 'grey-marle-3', 'grey marle', null, null, 3, '{"supplier_colour":"grey marle","appa_colour":"Grey","colour_product_code":null,"source_row_number":45}'::jsonb),
    ('Gear For Life', 'EJ', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":46}'::jsonb),
    ('Gear For Life', 'EMJ', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":47}'::jsonb),
    ('Gear For Life', 'FP', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":48}'::jsonb),
    ('Gear For Life', 'FPV', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":49}'::jsonb),
    ('Gear For Life', 'GPJ', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":50}'::jsonb),
    ('Gear For Life', 'GV', 'navy-charcoal-1', 'navy/charcoal', null, null, 1, '{"supplier_colour":"navy/charcoal","appa_colour":"Dark Blue/Dark Grey","colour_product_code":null,"source_row_number":51}'::jsonb),
    ('Gear For Life', 'HJ', 'black-heather-1', 'black heather', null, null, 1, '{"supplier_colour":"black heather","appa_colour":"Black","colour_product_code":null,"source_row_number":52}'::jsonb),
    ('Gear For Life', 'IPJ', 'navy-navy-1', 'navy/navy', null, null, 1, '{"supplier_colour":"navy/navy","appa_colour":"Dark Blue/Dark Blue","colour_product_code":null,"source_row_number":53}'::jsonb),
    ('Gear For Life', 'JO', 'navy-1', 'navy', null, null, 1, '{"supplier_colour":"navy","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":54}'::jsonb),
    ('Gear For Life', 'JO', 'royal-2', 'royal', null, null, 2, '{"supplier_colour":"royal","appa_colour":"Blue","colour_product_code":null,"source_row_number":54}'::jsonb),
    ('Gear For Life', 'JO', 'white-3', 'white', null, null, 3, '{"supplier_colour":"white","appa_colour":"White","colour_product_code":null,"source_row_number":54}'::jsonb),
    ('Gear For Life', 'JP', 'black-black-white-1', 'black/black/white', null, null, 1, '{"supplier_colour":"black/black/white","appa_colour":"Black/Black/White","colour_product_code":null,"source_row_number":55}'::jsonb),
    ('Gear For Life', 'JP', 'black-gold-white-2', 'black/gold/white', null, null, 2, '{"supplier_colour":"black/gold/white","appa_colour":"Black/Yellow/White","colour_product_code":null,"source_row_number":55}'::jsonb),
    ('Gear For Life', 'JP', 'black-green-white-3', 'black/green/white', null, null, 3, '{"supplier_colour":"black/green/white","appa_colour":"Black/Green/White","colour_product_code":null,"source_row_number":55}'::jsonb),
    ('Gear For Life', 'JP', 'black-maroon-white-4', 'black/maroon/white', null, null, 4, '{"supplier_colour":"black/maroon/white","appa_colour":"Black/Dark Red/White","colour_product_code":null,"source_row_number":55}'::jsonb),
    ('Gear For Life', 'JP', 'navy-gold-white-5', 'navy/gold/white', null, null, 5, '{"supplier_colour":"navy/gold/white","appa_colour":"Dark Blue/Yellow/White","colour_product_code":null,"source_row_number":55}'::jsonb),
    ('Gear For Life', 'JP', 'navy-navy-white-6', 'navy/navy/white', null, null, 6, '{"supplier_colour":"navy/navy/white","appa_colour":"Dark Blue/Dark Blue/White","colour_product_code":null,"source_row_number":55}'::jsonb),
    ('Gear For Life', 'JP', 'royal-red-white-7', 'royal/red/white', null, null, 7, '{"supplier_colour":"royal/red/white","appa_colour":"Blue/Red/White","colour_product_code":null,"source_row_number":55}'::jsonb),
    ('Gear For Life', 'JP(Y)', 'black-black-white-1', 'black/black/white', null, null, 1, '{"supplier_colour":"black/black/white","appa_colour":"Black/Black/White","colour_product_code":null,"source_row_number":56}'::jsonb),
    ('Gear For Life', 'JP(Y)', 'black-gold-white-2', 'black/gold/white', null, null, 2, '{"supplier_colour":"black/gold/white","appa_colour":"Black/Yellow/White","colour_product_code":null,"source_row_number":56}'::jsonb),
    ('Gear For Life', 'JP(Y)', 'black-green-white-3', 'black/green/white', null, null, 3, '{"supplier_colour":"black/green/white","appa_colour":"Black/Green/White","colour_product_code":null,"source_row_number":56}'::jsonb),
    ('Gear For Life', 'JP(Y)', 'black-maroon-white-4', 'black/maroon/white', null, null, 4, '{"supplier_colour":"black/maroon/white","appa_colour":"Black/Dark Red/White","colour_product_code":null,"source_row_number":56}'::jsonb),
    ('Gear For Life', 'JP(Y)', 'navy-gold-white-5', 'navy/gold/white', null, null, 5, '{"supplier_colour":"navy/gold/white","appa_colour":"Dark Blue/Yellow/White","colour_product_code":null,"source_row_number":56}'::jsonb),
    ('Gear For Life', 'JP(Y)', 'navy-navy-white-6', 'navy/navy/white', null, null, 6, '{"supplier_colour":"navy/navy/white","appa_colour":"Dark Blue/Dark Blue/White","colour_product_code":null,"source_row_number":56}'::jsonb),
    ('Gear For Life', 'JP(Y)', 'royal-red-white-7', 'royal/red/white', null, null, 7, '{"supplier_colour":"royal/red/white","appa_colour":"Blue/Red/White","colour_product_code":null,"source_row_number":56}'::jsonb),
    ('Gear For Life', 'LV', 'navy-navy-1', 'navy/navy', null, null, 1, '{"supplier_colour":"navy/navy","appa_colour":"Dark Blue/Dark Blue","colour_product_code":null,"source_row_number":57}'::jsonb),
    ('Gear For Life', 'LV', 'black-black-2', 'black/black', null, null, 2, '{"supplier_colour":"black/black","appa_colour":"Black/Black","colour_product_code":null,"source_row_number":57}'::jsonb),
    ('Gear For Life', 'MJ', 'navy-1', 'navy', null, null, 1, '{"supplier_colour":"navy","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":58}'::jsonb),
    ('Gear For Life', 'MJ', 'black-2', 'black', null, null, 2, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":58}'::jsonb),
    ('Gear For Life', 'MWJ', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":59}'::jsonb),
    ('Gear For Life', 'NJ', 'navy-aluminium-1', 'navy/aluminium', null, null, 1, '{"supplier_colour":"navy/aluminium","appa_colour":"Dark Blue/Grey","colour_product_code":null,"source_row_number":60}'::jsonb),
    ('Gear For Life', 'NJ', 'aluminium-cyber-blue-2', 'aluminium/cyber blue', null, null, 2, '{"supplier_colour":"aluminium/cyber blue","appa_colour":"Grey/Blue","colour_product_code":null,"source_row_number":60}'::jsonb),
    ('Gear For Life', 'NJ', 'black-aluminium-3', 'black/aluminium', null, null, 3, '{"supplier_colour":"black/aluminium","appa_colour":"Black/Grey","colour_product_code":null,"source_row_number":60}'::jsonb),
    ('Gear For Life', 'NV', 'navy-1', 'navy', null, null, 1, '{"supplier_colour":"navy","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":61}'::jsonb),
    ('Gear For Life', 'PLJ1', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":62}'::jsonb),
    ('Gear For Life', 'RWP', 'black-red-1', 'black/red', null, null, 1, '{"supplier_colour":"black/red","appa_colour":"Black/Red","colour_product_code":null,"source_row_number":63}'::jsonb),
    ('Gear For Life', 'RWP', 'black-white-2', 'black/white', null, null, 2, '{"supplier_colour":"black/white","appa_colour":"Black/White","colour_product_code":null,"source_row_number":63}'::jsonb),
    ('Gear For Life', 'RWP', 'cool-lime-navy-3', 'cool lime/navy', null, null, 3, '{"supplier_colour":"cool lime/navy","appa_colour":"Light Green/Dark Blue","colour_product_code":null,"source_row_number":63}'::jsonb),
    ('Gear For Life', 'RWP', 'navy-pumpkin-4', 'navy/pumpkin', null, null, 4, '{"supplier_colour":"navy/pumpkin","appa_colour":"Dark Blue/Orange","colour_product_code":null,"source_row_number":63}'::jsonb),
    ('Gear For Life', 'RWP', 'navy-white-5', 'navy/white', null, null, 5, '{"supplier_colour":"navy/white","appa_colour":"Dark Blue/White","colour_product_code":null,"source_row_number":63}'::jsonb),
    ('Gear For Life', 'RWP', 'ocean-navy-6', 'ocean/navy', null, null, 6, '{"supplier_colour":"ocean/navy","appa_colour":"Blue/Dark Blue","colour_product_code":null,"source_row_number":63}'::jsonb)
) as v(supplier, supplier_sku, colour_key, colour_name, colour_code, hex, sort_order, raw_json);

with gfl_batch as (
  select id as batch_id
  from public.supplier_import_batches
  where supplier = 'Gear For Life'
    and source_file_hash = 'f20ede9ac24d944fcb4c3c646d8ae2cbc41d2c63580200db27f2e86a96bf739c'
  order by created_at desc
  limit 1
)
insert into public.supplier_raw_colour_options (
  batch_id, supplier, supplier_sku, colour_key, colour_name, colour_code, hex, sort_order, raw_json
)
select
  gfl_batch.batch_id,
  v.supplier::text, v.supplier_sku::text, v.colour_key::text, v.colour_name::text, v.colour_code::text, v.hex::text, v.sort_order::text, v.raw_json::jsonb
from gfl_batch
cross join (
  values
    ('Gear For Life', 'RWP', 'royal-black-7', 'royal/black', null, null, 7, '{"supplier_colour":"royal/black","appa_colour":"Blue/Black","colour_product_code":null,"source_row_number":63}'::jsonb),
    ('Gear For Life', 'SJ', 'black-charcoal-1', 'black/charcoal', null, null, 1, '{"supplier_colour":"black/charcoal","appa_colour":"Black/Dark Grey","colour_product_code":null,"source_row_number":64}'::jsonb),
    ('Gear For Life', 'SJ', 'black-red-2', 'black/red', null, null, 2, '{"supplier_colour":"black/red","appa_colour":"Black/Red","colour_product_code":null,"source_row_number":64}'::jsonb),
    ('Gear For Life', 'SJ', 'black-royal-3', 'black/royal', null, null, 3, '{"supplier_colour":"black/royal","appa_colour":"Black/Blue","colour_product_code":null,"source_row_number":64}'::jsonb),
    ('Gear For Life', 'SJ', 'maroon-white-4', 'Maroon/white', null, null, 4, '{"supplier_colour":"Maroon/white","appa_colour":"Dark Red/White","colour_product_code":null,"source_row_number":64}'::jsonb),
    ('Gear For Life', 'SJ', 'navy-sky-5', 'navy/sky', null, null, 5, '{"supplier_colour":"navy/sky","appa_colour":"Dark Blue/Light Blue","colour_product_code":null,"source_row_number":64}'::jsonb),
    ('Gear For Life', 'SJ(Y)', 'black-charcoal-1', 'black/charcoal', null, null, 1, '{"supplier_colour":"black/charcoal","appa_colour":"Black/Dark Grey","colour_product_code":null,"source_row_number":65}'::jsonb),
    ('Gear For Life', 'SJ(Y)', 'black-red-2', 'black/red', null, null, 2, '{"supplier_colour":"black/red","appa_colour":"Black/Red","colour_product_code":null,"source_row_number":65}'::jsonb),
    ('Gear For Life', 'SJ(Y)', 'black-royal-3', 'black/royal', null, null, 3, '{"supplier_colour":"black/royal","appa_colour":"Black/Blue","colour_product_code":null,"source_row_number":65}'::jsonb),
    ('Gear For Life', 'SJ(Y)', 'maroon-white-4', 'Maroon/white', null, null, 4, '{"supplier_colour":"Maroon/white","appa_colour":"Dark Red/White","colour_product_code":null,"source_row_number":65}'::jsonb),
    ('Gear For Life', 'SJ(Y)', 'navy-sky-5', 'navy/sky', null, null, 5, '{"supplier_colour":"navy/sky","appa_colour":"Dark Blue/Light Blue","colour_product_code":null,"source_row_number":65}'::jsonb),
    ('Gear For Life', 'SMJ', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":66}'::jsonb),
    ('Gear For Life', 'SMJ', 'navy-2', 'navy', null, null, 2, '{"supplier_colour":"navy","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":66}'::jsonb),
    ('Gear For Life', 'SMV', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":67}'::jsonb),
    ('Gear For Life', 'TNT', 'black-black-1', 'black/black', null, null, 1, '{"supplier_colour":"black/black","appa_colour":"Black/Black","colour_product_code":null,"source_row_number":68}'::jsonb),
    ('Gear For Life', 'TRJ', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":69}'::jsonb),
    ('Gear For Life', 'WDGAXP', 'aluminium-1', 'aluminium', null, null, 1, '{"supplier_colour":"aluminium","appa_colour":"Grey","colour_product_code":null,"source_row_number":70}'::jsonb),
    ('Gear For Life', 'WDGAXP', 'black-2', 'black', null, null, 2, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":70}'::jsonb),
    ('Gear For Life', 'WDGAXP', 'navy-3', 'navy', null, null, 3, '{"supplier_colour":"navy","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":70}'::jsonb),
    ('Gear For Life', 'WDGAXP', 'white-4', 'white', null, null, 4, '{"supplier_colour":"white","appa_colour":"White","colour_product_code":null,"source_row_number":70}'::jsonb),
    ('Gear For Life', 'WDGAXP', 'grey-storm-5', 'grey storm', null, null, 5, '{"supplier_colour":"grey storm","appa_colour":"Dark Grey","colour_product_code":null,"source_row_number":70}'::jsonb),
    ('Gear For Life', 'WDGCP', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":71}'::jsonb),
    ('Gear For Life', 'WDGCP', 'navy-2', 'navy', null, null, 2, '{"supplier_colour":"navy","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":71}'::jsonb),
    ('Gear For Life', 'WDGDP', 'black-aluminium-1', 'black/aluminium', null, null, 1, '{"supplier_colour":"black/aluminium","appa_colour":"Black/Grey","colour_product_code":null,"source_row_number":72}'::jsonb),
    ('Gear For Life', 'WDGDP', 'cyber-blue-black-2', 'cyber blue/black', null, null, 2, '{"supplier_colour":"cyber blue/black","appa_colour":"Blue/Black","colour_product_code":null,"source_row_number":72}'::jsonb),
    ('Gear For Life', 'WDGDP', 'navy-aluminium-3', 'navy/aluminium', null, null, 3, '{"supplier_colour":"navy/aluminium","appa_colour":"Dark Blue/Grey","colour_product_code":null,"source_row_number":72}'::jsonb),
    ('Gear For Life', 'WDGHP', 'aluminium-black-1', 'aluminium/black', null, null, 1, '{"supplier_colour":"aluminium/black","appa_colour":"Grey/Black","colour_product_code":null,"source_row_number":73}'::jsonb),
    ('Gear For Life', 'WDGHP', 'black-white-2', 'black/white', null, null, 2, '{"supplier_colour":"black/white","appa_colour":"Black/White","colour_product_code":null,"source_row_number":73}'::jsonb),
    ('Gear For Life', 'WDGHP', 'navy-white-3', 'navy/white', null, null, 3, '{"supplier_colour":"navy/white","appa_colour":"Dark Blue/White","colour_product_code":null,"source_row_number":73}'::jsonb),
    ('Gear For Life', 'WDGHP', 'white-navy-4', 'white/navy', null, null, 4, '{"supplier_colour":"white/navy","appa_colour":"White/Dark Blue","colour_product_code":null,"source_row_number":73}'::jsonb),
    ('Gear For Life', 'WDGMLP', 'graphite-melange-1', 'graphite melange', null, null, 1, '{"supplier_colour":"graphite melange","appa_colour":"Grey","colour_product_code":null,"source_row_number":74}'::jsonb),
    ('Gear For Life', 'WDGMP', 'black-aluminium-1', 'black/aluminium', null, null, 1, '{"supplier_colour":"black/aluminium","appa_colour":"Black/Grey","colour_product_code":null,"source_row_number":75}'::jsonb),
    ('Gear For Life', 'WDGMP', 'black-pumpkin-2', 'black/pumpkin', null, null, 2, '{"supplier_colour":"black/pumpkin","appa_colour":"Black/Orange","colour_product_code":null,"source_row_number":75}'::jsonb),
    ('Gear For Life', 'WDGMP', 'cool-lime-navy-3', 'cool lime/navy', null, null, 3, '{"supplier_colour":"cool lime/navy","appa_colour":"Light Green/Dark Blue","colour_product_code":null,"source_row_number":75}'::jsonb),
    ('Gear For Life', 'WDGMP', 'navy-aluminium-4', 'navy/aluminium', null, null, 4, '{"supplier_colour":"navy/aluminium","appa_colour":"Dark Blue/Grey","colour_product_code":null,"source_row_number":75}'::jsonb),
    ('Gear For Life', 'WDGOL', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":76}'::jsonb),
    ('Gear For Life', 'WDGOL', 'cool-lime-2', 'cool lime', null, null, 2, '{"supplier_colour":"cool lime","appa_colour":"Light Green","colour_product_code":null,"source_row_number":76}'::jsonb),
    ('Gear For Life', 'WDGOL', 'navy-3', 'navy', null, null, 3, '{"supplier_colour":"navy","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":76}'::jsonb),
    ('Gear For Life', 'WDGOL', 'storm-4', 'storm', null, null, 4, '{"supplier_colour":"storm","appa_colour":"Light Grey","colour_product_code":null,"source_row_number":76}'::jsonb),
    ('Gear For Life', 'WDGOL', 'white-5', 'white', null, null, 5, '{"supplier_colour":"white","appa_colour":"White","colour_product_code":null,"source_row_number":76}'::jsonb),
    ('Gear For Life', 'WDGP', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":77}'::jsonb),
    ('Gear For Life', 'WDGVPP', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":78}'::jsonb),
    ('Gear For Life', 'WDJ', 'charcoal-1', 'charcoal', null, null, 1, '{"supplier_colour":"charcoal","appa_colour":"Dark Grey","colour_product_code":null,"source_row_number":79}'::jsonb),
    ('Gear For Life', 'WEGMCD', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":80}'::jsonb),
    ('Gear For Life', 'WEGMDP', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":81}'::jsonb),
    ('Gear For Life', 'WEGMDP', 'navy-2', 'navy', null, null, 2, '{"supplier_colour":"navy","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":81}'::jsonb),
    ('Gear For Life', 'WEGMFV', 'navy-1', 'navy', null, null, 1, '{"supplier_colour":"navy","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":82}'::jsonb),
    ('Gear For Life', 'WEGMSP', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":83}'::jsonb),
    ('Gear For Life', 'WEGMZ', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":84}'::jsonb),
    ('Gear For Life', 'WEGMZ', 'navy-2', 'navy', null, null, 2, '{"supplier_colour":"navy","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":84}'::jsonb),
    ('Gear For Life', 'WEGMZ', 'grey-marle-3', 'grey marle', null, null, 3, '{"supplier_colour":"grey marle","appa_colour":"Grey","colour_product_code":null,"source_row_number":84}'::jsonb),
    ('Gear For Life', 'WEJ', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":85}'::jsonb),
    ('Gear For Life', 'WFP', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":86}'::jsonb),
    ('Gear For Life', 'WJO', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":87}'::jsonb),
    ('Gear For Life', 'WJO', 'royal-2', 'royal', null, null, 2, '{"supplier_colour":"royal","appa_colour":"Blue","colour_product_code":null,"source_row_number":87}'::jsonb),
    ('Gear For Life', 'WMHP', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":88}'::jsonb),
    ('Gear For Life', 'WPLJ1', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":89}'::jsonb),
    ('Gear For Life', 'WXTJ', 'black-aluminium-1', 'black/aluminium', null, null, 1, '{"supplier_colour":"black/aluminium","appa_colour":"Black/Grey","colour_product_code":null,"source_row_number":90}'::jsonb),
    ('Gear For Life', 'DGLAXP', 'aluminium-1', 'aluminium', null, null, 1, '{"supplier_colour":"aluminium","appa_colour":"Grey","colour_product_code":null,"source_row_number":91}'::jsonb),
    ('Gear For Life', 'DGLAXP', 'black-2', 'black', null, null, 2, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":91}'::jsonb),
    ('Gear For Life', 'DGLAXP', 'navy-3', 'navy', null, null, 3, '{"supplier_colour":"navy","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":91}'::jsonb),
    ('Gear For Life', 'EOE', 'charcoal-1', 'charcoal', null, null, 1, '{"supplier_colour":"charcoal","appa_colour":"Dark Grey","colour_product_code":null,"source_row_number":92}'::jsonb),
    ('Gear For Life', 'EOE', 'french-blue-2', 'french blue', null, null, 2, '{"supplier_colour":"french blue","appa_colour":"Blue","colour_product_code":null,"source_row_number":92}'::jsonb),
    ('Gear For Life', 'ES', 'grey-white-1', 'grey/white', null, null, 1, '{"supplier_colour":"grey/white","appa_colour":"Grey/White","colour_product_code":null,"source_row_number":93}'::jsonb),
    ('Gear For Life', 'TBC', 'sky-white-1', 'sky/white', null, null, 1, '{"supplier_colour":"sky/white","appa_colour":"Light Blue/White","colour_product_code":null,"source_row_number":94}'::jsonb),
    ('Gear For Life', 'TBT', 'steel-navy-1', 'steel navy', null, null, 1, '{"supplier_colour":"steel navy","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":95}'::jsonb),
    ('Gear For Life', 'TCDH', 'white-navy-brown-1', 'white/navy/brown', null, null, 1, '{"supplier_colour":"white/navy/brown","appa_colour":"White/Dark Blue/Brown","colour_product_code":null,"source_row_number":96}'::jsonb),
    ('Gear For Life', 'TF', 'white-black-1', 'white/black', null, null, 1, '{"supplier_colour":"white/black","appa_colour":"White/Black","colour_product_code":null,"source_row_number":97}'::jsonb),
    ('Gear For Life', 'TF', 'white-navy-2', 'white/navy', null, null, 2, '{"supplier_colour":"white/navy","appa_colour":"White/Dark Blue","colour_product_code":null,"source_row_number":97}'::jsonb),
    ('Gear For Life', 'TG', 'indigo-1', 'indigo', null, null, 1, '{"supplier_colour":"indigo","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":98}'::jsonb),
    ('Gear For Life', 'THC', 'black-white-1', 'black/white', null, null, 1, '{"supplier_colour":"black/white","appa_colour":"Black/White","colour_product_code":null,"source_row_number":99}'::jsonb),
    ('Gear For Life', 'THC', 'navy-white-2', 'navy/white', null, null, 2, '{"supplier_colour":"navy/white","appa_colour":"Dark Blue/White","colour_product_code":null,"source_row_number":99}'::jsonb),
    ('Gear For Life', 'TIC', 'french-blue-white-1', 'french blue/white', null, null, 1, '{"supplier_colour":"french blue/white","appa_colour":"Blue/White","colour_product_code":null,"source_row_number":100}'::jsonb),
    ('Gear For Life', 'TKC', 'black-white-1', 'black/white', null, null, 1, '{"supplier_colour":"black/white","appa_colour":"Black/White","colour_product_code":null,"source_row_number":101}'::jsonb),
    ('Gear For Life', 'TKC', 'green-white-2', 'green/white', null, null, 2, '{"supplier_colour":"green/white","appa_colour":"Green/White","colour_product_code":null,"source_row_number":101}'::jsonb),
    ('Gear For Life', 'TKC', 'red-white-3', 'red/white', null, null, 3, '{"supplier_colour":"red/white","appa_colour":"Red/White","colour_product_code":null,"source_row_number":101}'::jsonb),
    ('Gear For Life', 'TKC', 'navy-white-4', 'navy/white', null, null, 4, '{"supplier_colour":"navy/white","appa_colour":"Dark Blue/White","colour_product_code":null,"source_row_number":101}'::jsonb),
    ('Gear For Life', 'TL', 'white-1', 'white', null, null, 1, '{"supplier_colour":"white","appa_colour":"White","colour_product_code":null,"source_row_number":102}'::jsonb),
    ('Gear For Life', 'TNP', 'blue-white-1', 'blue/white', null, null, 1, '{"supplier_colour":"blue/white","appa_colour":"Blue/White","colour_product_code":null,"source_row_number":103}'::jsonb),
    ('Gear For Life', 'TOSS', 'black-white-charcoal-1', 'black/white/charcoal', null, null, 1, '{"supplier_colour":"black/white/charcoal","appa_colour":"Black/White/Dark Grey","colour_product_code":null,"source_row_number":104}'::jsonb)
) as v(supplier, supplier_sku, colour_key, colour_name, colour_code, hex, sort_order, raw_json);

with gfl_batch as (
  select id as batch_id
  from public.supplier_import_batches
  where supplier = 'Gear For Life'
    and source_file_hash = 'f20ede9ac24d944fcb4c3c646d8ae2cbc41d2c63580200db27f2e86a96bf739c'
  order by created_at desc
  limit 1
)
insert into public.supplier_raw_colour_options (
  batch_id, supplier, supplier_sku, colour_key, colour_name, colour_code, hex, sort_order, raw_json
)
select
  gfl_batch.batch_id,
  v.supplier::text, v.supplier_sku::text, v.colour_key::text, v.colour_name::text, v.colour_code::text, v.hex::text, v.sort_order::text, v.raw_json::jsonb
from gfl_batch
cross join (
  values
    ('Gear For Life', 'TPL', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":105}'::jsonb),
    ('Gear For Life', 'TRLS', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":106}'::jsonb),
    ('Gear For Life', 'TRLS', 'white-2', 'white', null, null, 2, '{"supplier_colour":"white","appa_colour":"White","colour_product_code":null,"source_row_number":106}'::jsonb),
    ('Gear For Life', 'TRSS', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":107}'::jsonb),
    ('Gear For Life', 'TU', 'blue-white-1', 'blue/white', null, null, 1, '{"supplier_colour":"blue/white","appa_colour":"Blue/White","colour_product_code":null,"source_row_number":108}'::jsonb),
    ('Gear For Life', 'TU', 'silver-white-2', 'Silver/white', null, null, 2, '{"supplier_colour":"Silver/white","appa_colour":"Light Grey/White","colour_product_code":null,"source_row_number":108}'::jsonb),
    ('Gear For Life', 'TWS', 'black-white-1', 'black/white', null, null, 1, '{"supplier_colour":"black/white","appa_colour":"Black/White","colour_product_code":null,"source_row_number":109}'::jsonb),
    ('Gear For Life', 'WTCDH', 'white-navy-brown-1', 'white/navy/brown', null, null, 1, '{"supplier_colour":"white/navy/brown","appa_colour":"White/Dark Blue/Brown","colour_product_code":null,"source_row_number":110}'::jsonb),
    ('Gear For Life', 'WEOE', 'charcoal-1', 'charcoal', null, null, 1, '{"supplier_colour":"charcoal","appa_colour":"Dark Grey","colour_product_code":null,"source_row_number":111}'::jsonb),
    ('Gear For Life', 'WEOE', 'french-blue-2', 'french blue', null, null, 2, '{"supplier_colour":"french blue","appa_colour":"Blue","colour_product_code":null,"source_row_number":111}'::jsonb),
    ('Gear For Life', 'WES', 'blue-white-1', 'blue/white', null, null, 1, '{"supplier_colour":"blue/white","appa_colour":"Blue/White","colour_product_code":null,"source_row_number":112}'::jsonb),
    ('Gear For Life', 'WES', 'grey-white-2', 'grey/white', null, null, 2, '{"supplier_colour":"grey/white","appa_colour":"Grey/White","colour_product_code":null,"source_row_number":112}'::jsonb),
    ('Gear For Life', 'WTHC', 'black-white-1', 'black/white', null, null, 1, '{"supplier_colour":"black/white","appa_colour":"Black/White","colour_product_code":null,"source_row_number":113}'::jsonb),
    ('Gear For Life', 'WTHC', 'navy-white-2', 'navy/white', null, null, 2, '{"supplier_colour":"navy/white","appa_colour":"Dark Blue/White","colour_product_code":null,"source_row_number":113}'::jsonb),
    ('Gear For Life', 'WTBC', 'sky-white-1', 'sky/white', null, null, 1, '{"supplier_colour":"sky/white","appa_colour":"Light Blue/White","colour_product_code":null,"source_row_number":114}'::jsonb),
    ('Gear For Life', 'WTE', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":115}'::jsonb),
    ('Gear For Life', 'WTE', 'white-2', 'white', null, null, 2, '{"supplier_colour":"white","appa_colour":"White","colour_product_code":null,"source_row_number":115}'::jsonb),
    ('Gear For Life', 'WTEL', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":116}'::jsonb),
    ('Gear For Life', 'WTEL', 'white-2', 'white', null, null, 2, '{"supplier_colour":"white","appa_colour":"White","colour_product_code":null,"source_row_number":116}'::jsonb),
    ('Gear For Life', 'WTF', 'white-navy-1', 'white/navy', null, null, 1, '{"supplier_colour":"white/navy","appa_colour":"White/Dark Blue","colour_product_code":null,"source_row_number":117}'::jsonb),
    ('Gear For Life', 'WTF', 'white-black-2', 'white/black', null, null, 2, '{"supplier_colour":"white/black","appa_colour":"White/Black","colour_product_code":null,"source_row_number":117}'::jsonb),
    ('Gear For Life', 'WTG', 'indigo-1', 'indigo', null, null, 1, '{"supplier_colour":"indigo","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":118}'::jsonb),
    ('Gear For Life', 'WTIC', 'french-blue-white-1', 'french blue/white', null, null, 1, '{"supplier_colour":"french blue/white","appa_colour":"Blue/White","colour_product_code":null,"source_row_number":119}'::jsonb),
    ('Gear For Life', 'WTKC', 'black-white-1', 'black/white', null, null, 1, '{"supplier_colour":"black/white","appa_colour":"Black/White","colour_product_code":null,"source_row_number":120}'::jsonb),
    ('Gear For Life', 'WTKC', 'green-white-2', 'green/white', null, null, 2, '{"supplier_colour":"green/white","appa_colour":"Green/White","colour_product_code":null,"source_row_number":120}'::jsonb),
    ('Gear For Life', 'WTKC', 'red-white-3', 'red/white', null, null, 3, '{"supplier_colour":"red/white","appa_colour":"Red/White","colour_product_code":null,"source_row_number":120}'::jsonb),
    ('Gear For Life', 'WTKC', 'navy-white-4', 'navy/white', null, null, 4, '{"supplier_colour":"navy/white","appa_colour":"Dark Blue/White","colour_product_code":null,"source_row_number":120}'::jsonb),
    ('Gear For Life', 'WTL', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":121}'::jsonb),
    ('Gear For Life', 'WTL', 'white-2', 'white', null, null, 2, '{"supplier_colour":"white","appa_colour":"White","colour_product_code":null,"source_row_number":121}'::jsonb),
    ('Gear For Life', 'WTMC', 'charcoal-1', 'Charcoal', null, null, 1, '{"supplier_colour":"Charcoal","appa_colour":"Dark Grey","colour_product_code":null,"source_row_number":122}'::jsonb),
    ('Gear For Life', 'WTMO', 'eggshell-1', 'eggshell', null, null, 1, '{"supplier_colour":"eggshell","appa_colour":"Light Blue\\Light Pink","colour_product_code":null,"source_row_number":123}'::jsonb),
    ('Gear For Life', 'WTMO', 'pink-blush-2', 'pink blush', null, null, 2, '{"supplier_colour":"pink blush","appa_colour":null,"colour_product_code":null,"source_row_number":123}'::jsonb),
    ('Gear For Life', 'WTMT', 'black-white-1', 'black/white', null, null, 1, '{"supplier_colour":"black/white","appa_colour":"Black/White","colour_product_code":null,"source_row_number":124}'::jsonb),
    ('Gear For Life', 'WTMT', 'navy-white-2', 'navy/white', null, null, 2, '{"supplier_colour":"navy/white","appa_colour":"Dark Blue/White","colour_product_code":null,"source_row_number":124}'::jsonb),
    ('Gear For Life', 'WTMT', 'ocean-navy-3', 'ocean/navy', null, null, 3, '{"supplier_colour":"ocean/navy","appa_colour":"Blue/Dark Blue","colour_product_code":null,"source_row_number":124}'::jsonb),
    ('Gear For Life', 'WTNP', 'blue-white-1', 'blue/white', null, null, 1, '{"supplier_colour":"blue/white","appa_colour":"Blue/White","colour_product_code":null,"source_row_number":125}'::jsonb),
    ('Gear For Life', 'WTPL', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":126}'::jsonb),
    ('Gear For Life', 'WTRLS', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":127}'::jsonb),
    ('Gear For Life', 'WTRLS', 'charcoal-2', 'charcoal', null, null, 2, '{"supplier_colour":"charcoal","appa_colour":"Dark Grey","colour_product_code":null,"source_row_number":127}'::jsonb),
    ('Gear For Life', 'WTRLS', 'white-3', 'white', null, null, 3, '{"supplier_colour":"white","appa_colour":"White","colour_product_code":null,"source_row_number":127}'::jsonb),
    ('Gear For Life', 'WTRSS', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":128}'::jsonb),
    ('Gear For Life', 'WTU', 'blue-white-1', 'blue/white', null, null, 1, '{"supplier_colour":"blue/white","appa_colour":"Blue/White","colour_product_code":null,"source_row_number":129}'::jsonb),
    ('Gear For Life', 'WTU', 'silver-white-2', 'Silver/white', null, null, 2, '{"supplier_colour":"Silver/white","appa_colour":"Light Grey/White","colour_product_code":null,"source_row_number":129}'::jsonb),
    ('Gear For Life', 'WTV', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":130}'::jsonb),
    ('Gear For Life', 'WTWS', 'black-white-1', 'black/white', null, null, 1, '{"supplier_colour":"black/white","appa_colour":"Black/White","colour_product_code":null,"source_row_number":131}'::jsonb),
    ('Gear For Life', 'BBB', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":132}'::jsonb),
    ('Gear For Life', 'BBCC', 'black-tan-1', 'black/tan', null, null, 1, '{"supplier_colour":"black/tan","appa_colour":"Black/Brown","colour_product_code":null,"source_row_number":133}'::jsonb),
    ('Gear For Life', 'BBISC', 'black-black-grey-1', 'black/black/grey', null, null, 1, '{"supplier_colour":"black/black/grey","appa_colour":"Black/Black/Grey","colour_product_code":null,"source_row_number":134}'::jsonb),
    ('Gear For Life', 'BBISC', 'lime-black-grey-2', 'lime/black/grey', null, null, 2, '{"supplier_colour":"lime/black/grey","appa_colour":"Light Green/Black/Grey","colour_product_code":null,"source_row_number":134}'::jsonb),
    ('Gear For Life', 'BBISC', 'navy-black-grey-3', 'navy/black/grey', null, null, 3, '{"supplier_colour":"navy/black/grey","appa_colour":"Dark Blue/Black/Grey","colour_product_code":null,"source_row_number":134}'::jsonb),
    ('Gear For Life', 'BBISC', 'red-black-grey-4', 'red/black/grey', null, null, 4, '{"supplier_colour":"red/black/grey","appa_colour":"Red/Black/Grey","colour_product_code":null,"source_row_number":134}'::jsonb),
    ('Gear For Life', 'BBT', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":135}'::jsonb),
    ('Gear For Life', 'BBYCS', 'antique-natural-wood-grain-1', 'Antique Natural Wood Grain', null, null, 1, '{"supplier_colour":"Antique Natural Wood Grain","appa_colour":null,"colour_product_code":null,"source_row_number":136}'::jsonb),
    ('Gear For Life', 'BCOS', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":137}'::jsonb),
    ('Gear For Life', 'BCOS', 'charcoal-2', 'charcoal', null, null, 2, '{"supplier_colour":"charcoal","appa_colour":"Dark Grey","colour_product_code":null,"source_row_number":137}'::jsonb),
    ('Gear For Life', 'BCOS', 'cyber-blue-3', 'cyber blue', null, null, 3, '{"supplier_colour":"cyber blue","appa_colour":"Blue","colour_product_code":null,"source_row_number":137}'::jsonb),
    ('Gear For Life', 'BCOS', 'gold-4', 'gold', null, null, 4, '{"supplier_colour":"gold","appa_colour":"Yellow","colour_product_code":null,"source_row_number":137}'::jsonb),
    ('Gear For Life', 'BCOS', 'lime-5', 'lime', null, null, 5, '{"supplier_colour":"lime","appa_colour":"Light Green","colour_product_code":null,"source_row_number":137}'::jsonb),
    ('Gear For Life', 'BCOS', 'navy-6', 'navy', null, null, 6, '{"supplier_colour":"navy","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":137}'::jsonb),
    ('Gear For Life', 'BCOS', 'orange-7', 'orange', null, null, 7, '{"supplier_colour":"orange","appa_colour":"Orange","colour_product_code":null,"source_row_number":137}'::jsonb),
    ('Gear For Life', 'BCOS', 'purple-8', 'purple', null, null, 8, '{"supplier_colour":"purple","appa_colour":"Purple","colour_product_code":null,"source_row_number":137}'::jsonb),
    ('Gear For Life', 'BCOS', 'pink-9', 'pink', null, null, 9, '{"supplier_colour":"pink","appa_colour":"Pink","colour_product_code":null,"source_row_number":137}'::jsonb),
    ('Gear For Life', 'BCOS', 'red-10', 'red', null, null, 10, '{"supplier_colour":"red","appa_colour":"Red","colour_product_code":null,"source_row_number":137}'::jsonb),
    ('Gear For Life', 'BCOS', 'royal-11', 'royal', null, null, 11, '{"supplier_colour":"royal","appa_colour":"Blue","colour_product_code":null,"source_row_number":137}'::jsonb),
    ('Gear For Life', 'BCR', 'black-black-1', 'black/black', null, null, 1, '{"supplier_colour":"black/black","appa_colour":"Black/Black","colour_product_code":null,"source_row_number":138}'::jsonb),
    ('Gear For Life', 'BCTS', 'black-charcoal-white-1', 'black/charcoal/white', 'BCTS-contast-sports-bag-black-charcoal-white-front-front.jpg', null, 1, '{"supplier_colour":"black/charcoal/white","appa_colour":"Black/Dark Grey/White","colour_product_code":"BCTS-contast-sports-bag-black-charcoal-white-front-front.jpg","source_row_number":139}'::jsonb),
    ('Gear For Life', 'BCTS', 'black-gold-white-2', 'black/gold/white', 'BCTS-contast-sports-bag-black-gold-white-front.jpg', null, 2, '{"supplier_colour":"black/gold/white","appa_colour":"Black/Yellow/White","colour_product_code":"BCTS-contast-sports-bag-black-gold-white-front.jpg","source_row_number":139}'::jsonb),
    ('Gear For Life', 'BDUC', 'red-charcoal-1', 'red/charcoal', null, null, 1, '{"supplier_colour":"red/charcoal","appa_colour":"Red/Dark Grey","colour_product_code":null,"source_row_number":140}'::jsonb),
    ('Gear For Life', 'BEC', 'black-black-1', 'black/black', null, null, 1, '{"supplier_colour":"black/black","appa_colour":"Black/Black","colour_product_code":null,"source_row_number":141}'::jsonb),
    ('Gear For Life', 'BEC', 'lime-black-2', 'lime/black', null, null, 2, '{"supplier_colour":"lime/black","appa_colour":"Light Green/Black","colour_product_code":null,"source_row_number":141}'::jsonb),
    ('Gear For Life', 'BEC', 'navy-black-3', 'navy/black', null, null, 3, '{"supplier_colour":"navy/black","appa_colour":"Dark Blue/Black","colour_product_code":null,"source_row_number":141}'::jsonb),
    ('Gear For Life', 'BEC', 'red-black-4', 'red/black', null, null, 4, '{"supplier_colour":"red/black","appa_colour":"Red/Black","colour_product_code":null,"source_row_number":141}'::jsonb),
    ('Gear For Life', 'BES', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":142}'::jsonb),
    ('Gear For Life', 'BFGB', 'black-black-1', 'black/black', null, null, 1, '{"supplier_colour":"black/black","appa_colour":"Black/Black","colour_product_code":null,"source_row_number":143}'::jsonb),
    ('Gear For Life', 'BFGB', 'navy-black-2', 'navy/black', null, null, 2, '{"supplier_colour":"navy/black","appa_colour":"Dark Blue/Black","colour_product_code":null,"source_row_number":143}'::jsonb),
    ('Gear For Life', 'BFLB', 'black-black-1', 'black/black', null, null, 1, '{"supplier_colour":"black/black","appa_colour":"Black/Black","colour_product_code":null,"source_row_number":144}'::jsonb),
    ('Gear For Life', 'BFLB', 'black-charcoal-2', 'black/charcoal', null, null, 2, '{"supplier_colour":"black/charcoal","appa_colour":"Black/Dark Grey","colour_product_code":null,"source_row_number":144}'::jsonb),
    ('Gear For Life', 'BFLB', 'black-navy-3', 'black/navy', null, null, 3, '{"supplier_colour":"black/navy","appa_colour":"Black/Dark Blue","colour_product_code":null,"source_row_number":144}'::jsonb),
    ('Gear For Life', 'BFLB', 'black-red-4', 'black/red', null, null, 4, '{"supplier_colour":"black/red","appa_colour":"Black/Red","colour_product_code":null,"source_row_number":144}'::jsonb),
    ('Gear For Life', 'BFMC', 'black-charcoal-1', 'black/charcoal', null, null, 1, '{"supplier_colour":"black/charcoal","appa_colour":"Black/Dark Grey","colour_product_code":null,"source_row_number":145}'::jsonb)
) as v(supplier, supplier_sku, colour_key, colour_name, colour_code, hex, sort_order, raw_json);

with gfl_batch as (
  select id as batch_id
  from public.supplier_import_batches
  where supplier = 'Gear For Life'
    and source_file_hash = 'f20ede9ac24d944fcb4c3c646d8ae2cbc41d2c63580200db27f2e86a96bf739c'
  order by created_at desc
  limit 1
)
insert into public.supplier_raw_colour_options (
  batch_id, supplier, supplier_sku, colour_key, colour_name, colour_code, hex, sort_order, raw_json
)
select
  gfl_batch.batch_id,
  v.supplier::text, v.supplier_sku::text, v.colour_key::text, v.colour_name::text, v.colour_code::text, v.hex::text, v.sort_order::text, v.raw_json::jsonb
from gfl_batch
cross join (
  values
    ('Gear For Life', 'BGMB', 'black-cyber-blue-1', 'black/cyber blue', null, null, 1, '{"supplier_colour":"black/cyber blue","appa_colour":"Black/Blue","colour_product_code":null,"source_row_number":146}'::jsonb),
    ('Gear For Life', 'BGMB', 'black-lime-2', 'black/lime', null, null, 2, '{"supplier_colour":"black/lime","appa_colour":"Black/Light Green","colour_product_code":null,"source_row_number":146}'::jsonb),
    ('Gear For Life', 'BGMB', 'black-red-3', 'black/red', null, null, 3, '{"supplier_colour":"black/red","appa_colour":"Black/Red","colour_product_code":null,"source_row_number":146}'::jsonb),
    ('Gear For Life', 'BHVS', 'royal-black-1', 'royal/black', null, null, 1, '{"supplier_colour":"royal/black","appa_colour":"Blue/Black","colour_product_code":null,"source_row_number":147}'::jsonb),
    ('Gear For Life', 'BIB', 'charcoal-1', 'charcoal', null, null, 1, '{"supplier_colour":"charcoal","appa_colour":"Dark Grey","colour_product_code":null,"source_row_number":148}'::jsonb),
    ('Gear For Life', 'BICB', 'charcoal-1', 'charcoal', null, null, 1, '{"supplier_colour":"charcoal","appa_colour":"Dark Grey","colour_product_code":null,"source_row_number":149}'::jsonb),
    ('Gear For Life', 'BKDS', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":150}'::jsonb),
    ('Gear For Life', 'BKKS', 'black-black-1', 'black/black', null, null, 1, '{"supplier_colour":"black/black","appa_colour":"Black/Black","colour_product_code":null,"source_row_number":151}'::jsonb),
    ('Gear For Life', 'BLD', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":152}'::jsonb),
    ('Gear For Life', 'BLD', 'navy-2', 'navy', null, null, 2, '{"supplier_colour":"navy","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":152}'::jsonb),
    ('Gear For Life', 'BMO', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":153}'::jsonb),
    ('Gear For Life', 'BMS', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":154}'::jsonb),
    ('Gear For Life', 'BNC', 'silver-1', 'silver', null, null, 1, '{"supplier_colour":"silver","appa_colour":"Light Grey","colour_product_code":null,"source_row_number":155}'::jsonb),
    ('Gear For Life', 'BGLB', 'black-black-1', 'black/black', null, null, 1, '{"supplier_colour":"black/black","appa_colour":"Black/Black","colour_product_code":null,"source_row_number":156}'::jsonb),
    ('Gear For Life', 'BNWB', 'black-black-1', 'black/black', null, null, 1, '{"supplier_colour":"black/black","appa_colour":"Black/Black","colour_product_code":null,"source_row_number":157}'::jsonb),
    ('Gear For Life', 'BNWB', 'navy-black-2', 'navy/black', null, null, 2, '{"supplier_colour":"navy/black","appa_colour":"Dark Blue/Black","colour_product_code":null,"source_row_number":157}'::jsonb),
    ('Gear For Life', 'BPOB', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":158}'::jsonb),
    ('Gear For Life', 'BPOCB', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":159}'::jsonb),
    ('Gear For Life', 'BPS', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":160}'::jsonb),
    ('Gear For Life', 'BPS', 'navy-2', 'navy', null, null, 2, '{"supplier_colour":"navy","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":160}'::jsonb),
    ('Gear For Life', 'BRCS', 'black-black-red-1', 'black/black/red', null, null, 1, '{"supplier_colour":"black/black/red","appa_colour":"Black/Black/Red","colour_product_code":null,"source_row_number":161}'::jsonb),
    ('Gear For Life', 'BRCS', 'black-black-reflective-2', 'black/black/reflective', null, null, 2, '{"supplier_colour":"black/black/reflective","appa_colour":"Black/Black","colour_product_code":null,"source_row_number":161}'::jsonb),
    ('Gear For Life', 'BRCS', 'charcoal-black-reflective-3', 'charcoal/black/reflective', null, null, 3, '{"supplier_colour":"charcoal/black/reflective","appa_colour":"Dark Grey/Black","colour_product_code":null,"source_row_number":161}'::jsonb),
    ('Gear For Life', 'BRCS', 'navy-black-reflective-4', 'navy/black/reflective', null, null, 4, '{"supplier_colour":"navy/black/reflective","appa_colour":"Dark Blue/Black","colour_product_code":null,"source_row_number":161}'::jsonb),
    ('Gear For Life', 'BRCS', 'royal-black-reflective-5', 'royal/black/reflective', null, null, 5, '{"supplier_colour":"royal/black/reflective","appa_colour":"Blue/Black","colour_product_code":null,"source_row_number":161}'::jsonb),
    ('Gear For Life', 'BRFB', 'black-charcoal-1', 'black/charcoal', null, null, 1, '{"supplier_colour":"black/charcoal","appa_colour":"Black/Dark Grey","colour_product_code":null,"source_row_number":162}'::jsonb),
    ('Gear For Life', 'BRFB', 'black-gold-2', 'black/gold', null, null, 2, '{"supplier_colour":"black/gold","appa_colour":"Black/Yellow","colour_product_code":null,"source_row_number":162}'::jsonb),
    ('Gear For Life', 'BRFB', 'black-red-3', 'black/red', null, null, 3, '{"supplier_colour":"black/red","appa_colour":"Black/Red","colour_product_code":null,"source_row_number":162}'::jsonb),
    ('Gear For Life', 'BRFB', 'black-royal-4', 'black/royal', null, null, 4, '{"supplier_colour":"black/royal","appa_colour":"Black/Blue","colour_product_code":null,"source_row_number":162}'::jsonb),
    ('Gear For Life', 'BRFB', 'black-white-5', 'black/white', null, null, 5, '{"supplier_colour":"black/white","appa_colour":"Black/White","colour_product_code":null,"source_row_number":162}'::jsonb),
    ('Gear For Life', 'BRFB', 'navy-gold-6', 'navy/gold', null, null, 6, '{"supplier_colour":"navy/gold","appa_colour":"Dark Blue/Yellow","colour_product_code":null,"source_row_number":162}'::jsonb),
    ('Gear For Life', 'BRFB', 'navy-red-7', 'navy/red', null, null, 7, '{"supplier_colour":"navy/red","appa_colour":"Dark Blue/Red","colour_product_code":null,"source_row_number":162}'::jsonb),
    ('Gear For Life', 'BRFB', 'navy-sky-8', 'navy/sky', null, null, 8, '{"supplier_colour":"navy/sky","appa_colour":"Dark Blue/Light Blue","colour_product_code":null,"source_row_number":162}'::jsonb),
    ('Gear For Life', 'BRFB', 'navy-white-9', 'navy/white', null, null, 9, '{"supplier_colour":"navy/white","appa_colour":"Dark Blue/White","colour_product_code":null,"source_row_number":162}'::jsonb),
    ('Gear For Life', 'BRFS', 'black-charcoal-1', 'black/charcoal', null, null, 1, '{"supplier_colour":"black/charcoal","appa_colour":"Black/Dark Grey","colour_product_code":null,"source_row_number":163}'::jsonb),
    ('Gear For Life', 'BRFS', 'black-gold-2', 'black/gold', null, null, 2, '{"supplier_colour":"black/gold","appa_colour":"Black/Yellow","colour_product_code":null,"source_row_number":163}'::jsonb),
    ('Gear For Life', 'BRFS', 'black-red-3', 'black/red', null, null, 3, '{"supplier_colour":"black/red","appa_colour":"Black/Red","colour_product_code":null,"source_row_number":163}'::jsonb),
    ('Gear For Life', 'BRFS', 'black-white-4', 'black/white', null, null, 4, '{"supplier_colour":"black/white","appa_colour":"Black/White","colour_product_code":null,"source_row_number":163}'::jsonb),
    ('Gear For Life', 'BRFS', 'navy-red-5', 'navy/red', null, null, 5, '{"supplier_colour":"navy/red","appa_colour":"Dark Blue/Red","colour_product_code":null,"source_row_number":163}'::jsonb),
    ('Gear For Life', 'BRFS', 'navy-sky-6', 'navy/sky', null, null, 6, '{"supplier_colour":"navy/sky","appa_colour":"Dark Blue/Light Blue","colour_product_code":null,"source_row_number":163}'::jsonb),
    ('Gear For Life', 'BRFS', 'navy-white-7', 'navy/white', null, null, 7, '{"supplier_colour":"navy/white","appa_colour":"Dark Blue/White","colour_product_code":null,"source_row_number":163}'::jsonb),
    ('Gear For Life', 'BRS', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":164}'::jsonb),
    ('Gear For Life', 'BRS', 'navy-2', 'navy', null, null, 2, '{"supplier_colour":"navy","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":164}'::jsonb),
    ('Gear For Life', 'BRTS', 'charcoal-black-1', 'charcoal/black', null, null, 1, '{"supplier_colour":"charcoal/black","appa_colour":"Dark Grey/Black","colour_product_code":null,"source_row_number":165}'::jsonb),
    ('Gear For Life', 'BSB', 'black-1', 'Black', null, null, 1, '{"supplier_colour":"Black","appa_colour":"Black","colour_product_code":null,"source_row_number":166}'::jsonb),
    ('Gear For Life', 'BSLB', 'charcoal-black-1', 'charcoal/black', null, null, 1, '{"supplier_colour":"charcoal/black","appa_colour":"Dark Grey/Black","colour_product_code":null,"source_row_number":167}'::jsonb),
    ('Gear For Life', 'BSLB', 'navy-charcoal-2', 'navy/charcoal', null, null, 2, '{"supplier_colour":"navy/charcoal","appa_colour":"Dark Blue/Dark Grey","colour_product_code":null,"source_row_number":167}'::jsonb),
    ('Gear For Life', 'BSLB', 'sky-navy-3', 'sky/navy', null, null, 3, '{"supplier_colour":"sky/navy","appa_colour":"Light Blue/Dark Blue","colour_product_code":null,"source_row_number":167}'::jsonb),
    ('Gear For Life', 'BSLB', 'red-black-4', 'red/black', null, null, 4, '{"supplier_colour":"red/black","appa_colour":"Red/Black","colour_product_code":null,"source_row_number":167}'::jsonb),
    ('Gear For Life', 'BSLB', 'yellow-black-5', 'yellow/black', null, null, 5, '{"supplier_colour":"yellow/black","appa_colour":"Yellow/Black","colour_product_code":null,"source_row_number":167}'::jsonb),
    ('Gear For Life', 'BSM', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":168}'::jsonb),
    ('Gear For Life', 'BSM', 'charcoal-2', 'charcoal', null, null, 2, '{"supplier_colour":"charcoal","appa_colour":"Dark Grey","colour_product_code":null,"source_row_number":168}'::jsonb),
    ('Gear For Life', 'BSPB', 'black-charcoal-1', 'black/charcoal', null, null, 1, '{"supplier_colour":"black/charcoal","appa_colour":"Black/Dark Grey","colour_product_code":null,"source_row_number":169}'::jsonb),
    ('Gear For Life', 'BSPB', 'black-gold-2', 'black/gold', null, null, 2, '{"supplier_colour":"black/gold","appa_colour":"Black/Yellow","colour_product_code":null,"source_row_number":169}'::jsonb),
    ('Gear For Life', 'BSPB', 'black-red-3', 'black/red', null, null, 3, '{"supplier_colour":"black/red","appa_colour":"Black/Red","colour_product_code":null,"source_row_number":169}'::jsonb),
    ('Gear For Life', 'BSPB', 'black-royal-4', 'black/royal', null, null, 4, '{"supplier_colour":"black/royal","appa_colour":"Black/Blue","colour_product_code":null,"source_row_number":169}'::jsonb),
    ('Gear For Life', 'BSPB', 'black-white-5', 'black/white', null, null, 5, '{"supplier_colour":"black/white","appa_colour":"Black/White","colour_product_code":null,"source_row_number":169}'::jsonb),
    ('Gear For Life', 'BSPB', 'maroon-white-6', 'maroon/white', null, null, 6, '{"supplier_colour":"maroon/white","appa_colour":"Dark Red/White","colour_product_code":null,"source_row_number":169}'::jsonb),
    ('Gear For Life', 'BSPB', 'navy-gold-7', 'navy/gold', null, null, 7, '{"supplier_colour":"navy/gold","appa_colour":"Dark Blue/Yellow","colour_product_code":null,"source_row_number":169}'::jsonb),
    ('Gear For Life', 'BSPB', 'navy-red-8', 'navy/red', null, null, 8, '{"supplier_colour":"navy/red","appa_colour":"Dark Blue/Red","colour_product_code":null,"source_row_number":169}'::jsonb),
    ('Gear For Life', 'BSPB', 'navy-white-9', 'navy/white', null, null, 9, '{"supplier_colour":"navy/white","appa_colour":"Dark Blue/White","colour_product_code":null,"source_row_number":169}'::jsonb),
    ('Gear For Life', 'BSPB', 'navy-sky-10', 'navy/sky', null, null, 10, '{"supplier_colour":"navy/sky","appa_colour":"Dark Blue/Light Blue","colour_product_code":null,"source_row_number":169}'::jsonb),
    ('Gear For Life', 'BSPB', 'red-white-11', 'red/white', null, null, 11, '{"supplier_colour":"red/white","appa_colour":"Red/White","colour_product_code":null,"source_row_number":169}'::jsonb),
    ('Gear For Life', 'BSPB', 'royal-gold-12', 'royal/gold', null, null, 12, '{"supplier_colour":"royal/gold","appa_colour":"Blue/Yellow","colour_product_code":null,"source_row_number":169}'::jsonb),
    ('Gear For Life', 'BSPB', 'royal-red-13', 'royal/red', null, null, 13, '{"supplier_colour":"royal/red","appa_colour":"Blue/Red","colour_product_code":null,"source_row_number":169}'::jsonb),
    ('Gear For Life', 'BSPB', 'royal-white-14', 'royal/white', null, null, 14, '{"supplier_colour":"royal/white","appa_colour":"Blue/White","colour_product_code":null,"source_row_number":169}'::jsonb),
    ('Gear For Life', 'BSPS', 'black-charcoal-1', 'black/charcoal', null, null, 1, '{"supplier_colour":"black/charcoal","appa_colour":"Black/Dark Grey","colour_product_code":null,"source_row_number":170}'::jsonb),
    ('Gear For Life', 'BSPS', 'black-gold-2', 'black/gold', null, null, 2, '{"supplier_colour":"black/gold","appa_colour":"Black/Yellow","colour_product_code":null,"source_row_number":170}'::jsonb),
    ('Gear For Life', 'BSPS', 'black-green-3', 'black/green', null, null, 3, '{"supplier_colour":"black/green","appa_colour":"Black/Green","colour_product_code":null,"source_row_number":170}'::jsonb),
    ('Gear For Life', 'BSPS', 'black-maroon-4', 'black/maroon', null, null, 4, '{"supplier_colour":"black/maroon","appa_colour":"Black/Dark Red","colour_product_code":null,"source_row_number":170}'::jsonb),
    ('Gear For Life', 'BSPS', 'black-red-5', 'black/red', null, null, 5, '{"supplier_colour":"black/red","appa_colour":"Black/Red","colour_product_code":null,"source_row_number":170}'::jsonb),
    ('Gear For Life', 'BSPS', 'black-royal-6', 'black/royal', null, null, 6, '{"supplier_colour":"black/royal","appa_colour":"Black/Blue","colour_product_code":null,"source_row_number":170}'::jsonb),
    ('Gear For Life', 'BSPS', 'black-white-7', 'black/white', null, null, 7, '{"supplier_colour":"black/white","appa_colour":"Black/White","colour_product_code":null,"source_row_number":170}'::jsonb),
    ('Gear For Life', 'BSPS', 'maroon-white-8', 'maroon/white', null, null, 8, '{"supplier_colour":"maroon/white","appa_colour":"Dark Red/White","colour_product_code":null,"source_row_number":170}'::jsonb),
    ('Gear For Life', 'BSPS', 'navy-gold-9', 'navy/gold', null, null, 9, '{"supplier_colour":"navy/gold","appa_colour":"Dark Blue/Yellow","colour_product_code":null,"source_row_number":170}'::jsonb),
    ('Gear For Life', 'BSPS', 'navy-red-10', 'navy/red', null, null, 10, '{"supplier_colour":"navy/red","appa_colour":"Dark Blue/Red","colour_product_code":null,"source_row_number":170}'::jsonb),
    ('Gear For Life', 'BSPS', 'navy-sky-11', 'navy/sky', null, null, 11, '{"supplier_colour":"navy/sky","appa_colour":"Dark Blue/Light Blue","colour_product_code":null,"source_row_number":170}'::jsonb),
    ('Gear For Life', 'BSPS', 'navy-white-12', 'navy/white', null, null, 12, '{"supplier_colour":"navy/white","appa_colour":"Dark Blue/White","colour_product_code":null,"source_row_number":170}'::jsonb),
    ('Gear For Life', 'BSPS', 'red-white-13', 'red/white', null, null, 13, '{"supplier_colour":"red/white","appa_colour":"Red/White","colour_product_code":null,"source_row_number":170}'::jsonb),
    ('Gear For Life', 'BSPS', 'royal-gold-14', 'royal/gold', null, null, 14, '{"supplier_colour":"royal/gold","appa_colour":"Blue/Yellow","colour_product_code":null,"source_row_number":170}'::jsonb)
) as v(supplier, supplier_sku, colour_key, colour_name, colour_code, hex, sort_order, raw_json);

with gfl_batch as (
  select id as batch_id
  from public.supplier_import_batches
  where supplier = 'Gear For Life'
    and source_file_hash = 'f20ede9ac24d944fcb4c3c646d8ae2cbc41d2c63580200db27f2e86a96bf739c'
  order by created_at desc
  limit 1
)
insert into public.supplier_raw_colour_options (
  batch_id, supplier, supplier_sku, colour_key, colour_name, colour_code, hex, sort_order, raw_json
)
select
  gfl_batch.batch_id,
  v.supplier::text, v.supplier_sku::text, v.colour_key::text, v.colour_name::text, v.colour_code::text, v.hex::text, v.sort_order::text, v.raw_json::jsonb
from gfl_batch
cross join (
  values
    ('Gear For Life', 'BSPS', 'royal-red-15', 'royal/red', null, null, 15, '{"supplier_colour":"royal/red","appa_colour":"Blue/Red","colour_product_code":null,"source_row_number":170}'::jsonb),
    ('Gear For Life', 'BST', 'black-charcoal-1', 'black/charcoal', null, null, 1, '{"supplier_colour":"black/charcoal","appa_colour":"Black/Dark Grey","colour_product_code":null,"source_row_number":171}'::jsonb),
    ('Gear For Life', 'BTGB', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":172}'::jsonb),
    ('Gear For Life', 'BTLT', 'black-charcoal-1', 'black/charcoal', null, null, 1, '{"supplier_colour":"black/charcoal","appa_colour":"Black/Dark Grey","colour_product_code":null,"source_row_number":173}'::jsonb),
    ('Gear For Life', 'BTNT', 'black-charcoal-1', 'black/charcoal', null, null, 1, '{"supplier_colour":"black/charcoal","appa_colour":"Black/Dark Grey","colour_product_code":null,"source_row_number":174}'::jsonb),
    ('Gear For Life', 'BTS', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":175}'::jsonb),
    ('Gear For Life', 'BTS', 'navy-2', 'navy', null, null, 2, '{"supplier_colour":"navy","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":175}'::jsonb),
    ('Gear For Life', 'BTT', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":176}'::jsonb),
    ('Gear For Life', 'BUCB', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":177}'::jsonb),
    ('Gear For Life', 'BWIB', 'grey-melange-black-1', 'grey melange/black', null, null, 1, '{"supplier_colour":"grey melange/black","appa_colour":"Grey/Black","colour_product_code":null,"source_row_number":178}'::jsonb),
    ('Gear For Life', 'BWICB', 'grey-melange-black-1', 'grey melange/black', null, null, 1, '{"supplier_colour":"grey melange/black","appa_colour":"Grey/Black","colour_product_code":null,"source_row_number":179}'::jsonb),
    ('Gear For Life', 'BYB', 'charcoal-black-1', 'charcoal/black', null, null, 1, '{"supplier_colour":"charcoal/black","appa_colour":"Dark Grey/Black","colour_product_code":null,"source_row_number":180}'::jsonb),
    ('Gear For Life', 'BYB', 'navy-black-2', 'navy/black', null, null, 2, '{"supplier_colour":"navy/black","appa_colour":"Dark Blue/Black","colour_product_code":null,"source_row_number":180}'::jsonb),
    ('Gear For Life', 'POBT', 'black-1', 'Black', null, null, 1, '{"supplier_colour":"Black","appa_colour":"Black","colour_product_code":null,"source_row_number":183}'::jsonb),
    ('Gear For Life', 'POCHB', 'matt-black-1', 'Matt black', null, null, 1, '{"supplier_colour":"Matt black","appa_colour":"Black","colour_product_code":null,"source_row_number":187}'::jsonb),
    ('Gear For Life', 'POCCB', 'acacia-wood-1', 'Acacia Wood', null, null, 1, '{"supplier_colour":"Acacia Wood","appa_colour":null,"colour_product_code":null,"source_row_number":188}'::jsonb),
    ('Gear For Life', 'PODIGB', 'wood-1', 'Wood', null, null, 1, '{"supplier_colour":"Wood","appa_colour":null,"colour_product_code":null,"source_row_number":191}'::jsonb),
    ('Gear For Life', 'POEGB', 'black-1', 'Black', null, null, 1, '{"supplier_colour":"Black","appa_colour":"Black","colour_product_code":null,"source_row_number":192}'::jsonb),
    ('Gear For Life', 'POEGB', 'white-2', 'White', null, null, 2, '{"supplier_colour":"White","appa_colour":"White","colour_product_code":null,"source_row_number":192}'::jsonb),
    ('Gear For Life', 'POEB', 'white-black-1', 'White/Black', null, null, 1, '{"supplier_colour":"White/Black","appa_colour":"White/Black","colour_product_code":null,"source_row_number":193}'::jsonb),
    ('Gear For Life', 'POFCK', 'black-1', 'Black', null, null, 1, '{"supplier_colour":"Black","appa_colour":"Black","colour_product_code":null,"source_row_number":194}'::jsonb),
    ('Gear For Life', 'POCB', 'bamboo-1', 'Bamboo', null, null, 1, '{"supplier_colour":"Bamboo","appa_colour":null,"colour_product_code":null,"source_row_number":197}'::jsonb),
    ('Gear For Life', 'POGTT', 'black-1', 'Black', null, null, 1, '{"supplier_colour":"Black","appa_colour":"Black","colour_product_code":null,"source_row_number":198}'::jsonb),
    ('Gear For Life', 'POHC', 'black-1', 'Black', null, null, 1, '{"supplier_colour":"Black","appa_colour":"Black","colour_product_code":null,"source_row_number":199}'::jsonb),
    ('Gear For Life', 'POHC', 'khaki-2', 'Khaki', null, null, 2, '{"supplier_colour":"Khaki","appa_colour":"Khaki","colour_product_code":null,"source_row_number":199}'::jsonb),
    ('Gear For Life', 'POHC', 'navy-3', 'Navy', null, null, 3, '{"supplier_colour":"Navy","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":199}'::jsonb),
    ('Gear For Life', 'POLDBS', 'wood-grain-beige-heather-1', 'Wood grain / beige heather', null, null, 1, '{"supplier_colour":"Wood grain / beige heather","appa_colour":null,"colour_product_code":null,"source_row_number":200}'::jsonb),
    ('Gear For Life', 'PONSB', 'matt-black-1', 'Matt black', null, null, 1, '{"supplier_colour":"Matt black","appa_colour":"Black","colour_product_code":null,"source_row_number":201}'::jsonb),
    ('Gear For Life', 'POOC', 'black-white-1', 'Black/White', null, null, 1, '{"supplier_colour":"Black/White","appa_colour":"Black/White","colour_product_code":null,"source_row_number":202}'::jsonb),
    ('Gear For Life', 'POOC', 'navy-white-2', 'Navy/White', null, null, 2, '{"supplier_colour":"Navy/White","appa_colour":"Dark Blue/White","colour_product_code":null,"source_row_number":202}'::jsonb),
    ('Gear For Life', 'POOT', 'black-white-1', 'Black/White', null, null, 1, '{"supplier_colour":"Black/White","appa_colour":"Black/White","colour_product_code":null,"source_row_number":203}'::jsonb),
    ('Gear For Life', 'POOT', 'navy-white-2', 'Navy/White', null, null, 2, '{"supplier_colour":"Navy/White","appa_colour":"Dark Blue/White","colour_product_code":null,"source_row_number":203}'::jsonb),
    ('Gear For Life', 'POOFP', 'black-white-1', 'Black/White', null, null, 1, '{"supplier_colour":"Black/White","appa_colour":"Black/White","colour_product_code":null,"source_row_number":204}'::jsonb),
    ('Gear For Life', 'POOB', 'navy-white-1', 'Navy/White', null, null, 1, '{"supplier_colour":"Navy/White","appa_colour":"Dark Blue/White","colour_product_code":null,"source_row_number":205}'::jsonb),
    ('Gear For Life', 'POGB', 'black-1', 'Black', null, null, 1, '{"supplier_colour":"Black","appa_colour":"Black","colour_product_code":null,"source_row_number":206}'::jsonb),
    ('Gear For Life', 'POGB', 'cyber-blue-2', 'Cyber Blue', null, null, 2, '{"supplier_colour":"Cyber Blue","appa_colour":"Blue","colour_product_code":null,"source_row_number":206}'::jsonb),
    ('Gear For Life', 'POGB', 'grey-3', 'Grey', null, null, 3, '{"supplier_colour":"Grey","appa_colour":"Grey","colour_product_code":null,"source_row_number":206}'::jsonb),
    ('Gear For Life', 'POGB', 'lime-green-4', 'Lime Green', null, null, 4, '{"supplier_colour":"Lime Green","appa_colour":"Light Green","colour_product_code":null,"source_row_number":206}'::jsonb),
    ('Gear For Life', 'POGB', 'navy-5', 'Navy', null, null, 5, '{"supplier_colour":"Navy","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":206}'::jsonb),
    ('Gear For Life', 'POGB', 'red-6', 'Red', null, null, 6, '{"supplier_colour":"Red","appa_colour":"Red","colour_product_code":null,"source_row_number":206}'::jsonb),
    ('Gear For Life', 'POGB', 'white-7', 'White', null, null, 7, '{"supplier_colour":"White","appa_colour":"White","colour_product_code":null,"source_row_number":206}'::jsonb),
    ('Gear For Life', 'POPPS', 'acacia-wood-1', 'Acacia wood', null, null, 1, '{"supplier_colour":"Acacia wood","appa_colour":"0","colour_product_code":null,"source_row_number":207}'::jsonb),
    ('Gear For Life', 'POQES', 'matt-black-1', 'Matt black', null, null, 1, '{"supplier_colour":"Matt black","appa_colour":"Black","colour_product_code":null,"source_row_number":208}'::jsonb),
    ('Gear For Life', 'PORC', 'black-1', 'Black', null, null, 1, '{"supplier_colour":"Black","appa_colour":"Black","colour_product_code":null,"source_row_number":209}'::jsonb),
    ('Gear For Life', 'POSB', 'acacia-wood-1', 'Acacia wood', null, null, 1, '{"supplier_colour":"Acacia wood","appa_colour":null,"colour_product_code":null,"source_row_number":210}'::jsonb),
    ('Gear For Life', 'POSLS', 'acacia-wood-1', 'Acacia wood', null, null, 1, '{"supplier_colour":"Acacia wood","appa_colour":null,"colour_product_code":null,"source_row_number":211}'::jsonb),
    ('Gear For Life', 'POSSWG', 'silver-1', 'Silver', null, null, 1, '{"supplier_colour":"Silver","appa_colour":"Light Grey","colour_product_code":null,"source_row_number":214}'::jsonb),
    ('Gear For Life', 'POTSB', 'acacia-wood-1', 'Acacia wood', null, null, 1, '{"supplier_colour":"Acacia wood","appa_colour":null,"colour_product_code":null,"source_row_number":215}'::jsonb),
    ('Gear For Life', 'POTT', 'bamboo-1', 'Bamboo', null, null, 1, '{"supplier_colour":"Bamboo","appa_colour":null,"colour_product_code":null,"source_row_number":216}'::jsonb),
    ('Gear For Life', 'POVMC', 'white-with-grey-veining-1', 'White (with grey veining)', null, null, 1, '{"supplier_colour":"White (with grey veining)","appa_colour":"White/Grey","colour_product_code":null,"source_row_number":218}'::jsonb),
    ('Gear For Life', 'SIAPV', 'grey-melange-black-1', 'grey melange/black', null, null, 1, '{"supplier_colour":"grey melange/black","appa_colour":"Grey/Black","colour_product_code":null,"source_row_number":219}'::jsonb),
    ('Gear For Life', 'SIBPV', 'grey-melange-1', 'grey melange', null, null, 1, '{"supplier_colour":"grey melange","appa_colour":"Grey/Black","colour_product_code":null,"source_row_number":220}'::jsonb),
    ('Gear For Life', 'SICM', 'grey-melange-1', 'grey melange', null, null, 1, '{"supplier_colour":"grey melange","appa_colour":"Grey/Black","colour_product_code":null,"source_row_number":221}'::jsonb),
    ('Gear For Life', 'SICM', 'black-2', 'black', null, null, 2, '{"supplier_colour":"black","appa_colour":null,"colour_product_code":null,"source_row_number":221}'::jsonb),
    ('Gear For Life', 'SIDJ', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":222}'::jsonb),
    ('Gear For Life', 'SITPJ', 'navy-1', 'navy', null, null, 1, '{"supplier_colour":"navy","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":223}'::jsonb),
    ('Gear For Life', 'SIEPJ', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":224}'::jsonb),
    ('Gear For Life', 'SIBRTB', 'grey-melange-1', 'grey melange', null, null, 1, '{"supplier_colour":"grey melange","appa_colour":"Grey","colour_product_code":null,"source_row_number":225}'::jsonb),
    ('Gear For Life', 'SIFB', 'grey-melange-1', 'grey melange', null, null, 1, '{"supplier_colour":"grey melange","appa_colour":"Grey","colour_product_code":null,"source_row_number":226}'::jsonb),
    ('Gear For Life', 'SIHTJ', 'navy-1', 'navy', null, null, 1, '{"supplier_colour":"navy","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":227}'::jsonb),
    ('Gear For Life', 'SIHTJ', 'black-2', 'black', null, null, 2, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":227}'::jsonb),
    ('Gear For Life', 'SIJPV', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":228}'::jsonb),
    ('Gear For Life', 'SIJPV', 'navy-2', 'navy', null, null, 2, '{"supplier_colour":"navy","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":228}'::jsonb),
    ('Gear For Life', 'SIIPJ', 'grey-melange-1', 'grey melange', null, null, 1, '{"supplier_colour":"grey melange","appa_colour":"Grey","colour_product_code":null,"source_row_number":229}'::jsonb),
    ('Gear For Life', 'SIKD', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":230}'::jsonb),
    ('Gear For Life', 'SIKD', 'grey-melange-2', 'grey melange', null, null, 2, '{"supplier_colour":"grey melange","appa_colour":"Grey","colour_product_code":null,"source_row_number":230}'::jsonb),
    ('Gear For Life', 'SIL', 'white-1', 'white', null, null, 1, '{"supplier_colour":"white","appa_colour":"White","colour_product_code":null,"source_row_number":231}'::jsonb),
    ('Gear For Life', 'SIMPJ', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":232}'::jsonb),
    ('Gear For Life', 'SIOJ', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":233}'::jsonb),
    ('Gear For Life', 'SIOJ', 'grey-2', 'grey', null, null, 2, '{"supplier_colour":"grey","appa_colour":"Grey","colour_product_code":null,"source_row_number":233}'::jsonb),
    ('Gear For Life', 'SIR', 'navy-1', 'navy', null, null, 1, '{"supplier_colour":"navy","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":234}'::jsonb),
    ('Gear For Life', 'SIR', 'black-2', 'black', null, null, 2, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":234}'::jsonb),
    ('Gear For Life', 'SIR', 'white-3', 'white', null, null, 3, '{"supplier_colour":"white","appa_colour":"White","colour_product_code":null,"source_row_number":234}'::jsonb),
    ('Gear For Life', 'SISB', 'grey-melange-1', 'grey melange', null, null, 1, '{"supplier_colour":"grey melange","appa_colour":"Grey","colour_product_code":null,"source_row_number":235}'::jsonb),
    ('Gear For Life', 'SISP', 'black-white-1', 'black/white', null, null, 1, '{"supplier_colour":"black/white","appa_colour":"Black/White","colour_product_code":null,"source_row_number":236}'::jsonb),
    ('Gear For Life', 'SISP', 'grey-marle-black-2', 'grey marle/black', null, null, 2, '{"supplier_colour":"grey marle/black","appa_colour":"Grey/Black","colour_product_code":null,"source_row_number":236}'::jsonb),
    ('Gear For Life', 'SISP', 'navy-white-3', 'navy/white', null, null, 3, '{"supplier_colour":"navy/white","appa_colour":"Dark Blue/White","colour_product_code":null,"source_row_number":236}'::jsonb),
    ('Gear For Life', 'SISP', 'sky-navy-4', 'sky/navy', null, null, 4, '{"supplier_colour":"sky/navy","appa_colour":"Light Blue/Dark Blue","colour_product_code":null,"source_row_number":236}'::jsonb),
    ('Gear For Life', 'SIVH', 'grey-marle-1', 'grey marle', null, null, 1, '{"supplier_colour":"grey marle","appa_colour":"Grey","colour_product_code":null,"source_row_number":237}'::jsonb),
    ('Gear For Life', 'SIWWK', 'grey-melange-1', 'grey melange', null, null, 1, '{"supplier_colour":"grey melange","appa_colour":"Grey","colour_product_code":null,"source_row_number":238}'::jsonb)
) as v(supplier, supplier_sku, colour_key, colour_name, colour_code, hex, sort_order, raw_json);

with gfl_batch as (
  select id as batch_id
  from public.supplier_import_batches
  where supplier = 'Gear For Life'
    and source_file_hash = 'f20ede9ac24d944fcb4c3c646d8ae2cbc41d2c63580200db27f2e86a96bf739c'
  order by created_at desc
  limit 1
)
insert into public.supplier_raw_colour_options (
  batch_id, supplier, supplier_sku, colour_key, colour_name, colour_code, hex, sort_order, raw_json
)
select
  gfl_batch.batch_id,
  v.supplier::text, v.supplier_sku::text, v.colour_key::text, v.colour_name::text, v.colour_code::text, v.hex::text, v.sort_order::text, v.raw_json::jsonb
from gfl_batch
cross join (
  values
    ('Gear For Life', 'WSIL', 'white-1', 'white', null, null, 1, '{"supplier_colour":"white","appa_colour":"White","colour_product_code":null,"source_row_number":239}'::jsonb),
    ('Gear For Life', 'WSIR', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":240}'::jsonb),
    ('Gear For Life', 'WSIR', 'navy-2', 'navy', null, null, 2, '{"supplier_colour":"navy","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":240}'::jsonb),
    ('Gear For Life', 'WSIR', 'white-3', 'white', null, null, 3, '{"supplier_colour":"white","appa_colour":"White","colour_product_code":null,"source_row_number":240}'::jsonb),
    ('Gear For Life', 'WSISP', 'black-white-1', 'black/white', null, null, 1, '{"supplier_colour":"black/white","appa_colour":"Black/White","colour_product_code":null,"source_row_number":241}'::jsonb),
    ('Gear For Life', 'WSISP', 'grey-marle-black-2', 'grey marle/black', null, null, 2, '{"supplier_colour":"grey marle/black","appa_colour":"Grey/Black","colour_product_code":null,"source_row_number":241}'::jsonb),
    ('Gear For Life', 'WSISP', 'navy-white-3', 'navy/white', null, null, 3, '{"supplier_colour":"navy/white","appa_colour":"Dark Blue/White","colour_product_code":null,"source_row_number":241}'::jsonb),
    ('Gear For Life', 'WSISP', 'sky-navy-4', 'sky/navy', null, null, 4, '{"supplier_colour":"sky/navy","appa_colour":"Light Blue/Dark Blue","colour_product_code":null,"source_row_number":241}'::jsonb),
    ('Gear For Life', 'WSIVH', 'grey-marle-1', 'grey marle', null, null, 1, '{"supplier_colour":"grey marle","appa_colour":"Grey","colour_product_code":null,"source_row_number":242}'::jsonb),
    ('Gear For Life', 'BOR', 'white-1', 'white', null, null, 1, '{"supplier_colour":"white","appa_colour":"White","colour_product_code":null,"source_row_number":243}'::jsonb),
    ('Gear For Life', 'WBOR', 'white-1', 'white', null, null, 1, '{"supplier_colour":"white","appa_colour":"White","colour_product_code":null,"source_row_number":244}'::jsonb),
    ('Gear For Life', 'BTY', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":245}'::jsonb),
    ('Gear For Life', 'WBTY', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":246}'::jsonb),
    ('Gear For Life', 'BNO', 'grey-1', 'grey', null, null, 1, '{"supplier_colour":"grey","appa_colour":"Grey","colour_product_code":null,"source_row_number":247}'::jsonb),
    ('Gear For Life', 'WBNO', 'grey-1', 'grey', null, null, 1, '{"supplier_colour":"grey","appa_colour":"Grey","colour_product_code":null,"source_row_number":248}'::jsonb),
    ('Gear For Life', 'BCL', 'french-blue-1', 'French Blue', null, null, 1, '{"supplier_colour":"French Blue","appa_colour":"Blue","colour_product_code":null,"source_row_number":249}'::jsonb),
    ('Gear For Life', 'WBCL', 'french-blue-1', 'French Blue', null, null, 1, '{"supplier_colour":"French Blue","appa_colour":"Blue","colour_product_code":null,"source_row_number":250}'::jsonb),
    ('Gear For Life', 'BLC', 'white-blue-1', 'White/Blue', null, null, 1, '{"supplier_colour":"White/Blue","appa_colour":"White/Blue","colour_product_code":null,"source_row_number":251}'::jsonb),
    ('Gear For Life', 'WBLC', 'white-blue-1', 'White/Blue', null, null, 1, '{"supplier_colour":"White/Blue","appa_colour":"White/Blue","colour_product_code":null,"source_row_number":252}'::jsonb),
    ('Gear For Life', 'BQU', 'cobalt-blue-1', 'Cobalt Blue', null, null, 1, '{"supplier_colour":"Cobalt Blue","appa_colour":"Blue","colour_product_code":null,"source_row_number":253}'::jsonb),
    ('Gear For Life', 'WBQU', 'cobalt-blue-1', 'Cobalt Blue', null, null, 1, '{"supplier_colour":"Cobalt Blue","appa_colour":"Blue","colour_product_code":null,"source_row_number":254}'::jsonb),
    ('Gear For Life', 'BSC', 'navy-blue-white-1', 'Navy/Blue/White', null, null, 1, '{"supplier_colour":"Navy/Blue/White","appa_colour":"Dark Blue/Blue/White","colour_product_code":null,"source_row_number":255}'::jsonb),
    ('Gear For Life', 'WBSC', 'navy-blue-white-1', 'Navy/Blue/White', null, null, 1, '{"supplier_colour":"Navy/Blue/White","appa_colour":"Dark Blue/Blue/White","colour_product_code":null,"source_row_number":256}'::jsonb),
    ('Gear For Life', 'BHC', 'sky-blue-white-1', 'Sky Blue/White', null, null, 1, '{"supplier_colour":"Sky Blue/White","appa_colour":"Light Blue Blue/White","colour_product_code":null,"source_row_number":257}'::jsonb),
    ('Gear For Life', 'WBHC', 'sky-blue-white-1', 'Sky Blue/White', null, null, 1, '{"supplier_colour":"Sky Blue/White","appa_colour":"Light Blue Blue/White","colour_product_code":null,"source_row_number":258}'::jsonb),
    ('Gear For Life', 'POBMS', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":260}'::jsonb),
    ('Gear For Life', 'POMLMB', 'charcoal-navy-1', 'Charcoal, Navy', null, null, 1, '{"supplier_colour":"Charcoal, Navy","appa_colour":"Dark Grey, Dark Blue","colour_product_code":null,"source_row_number":261}'::jsonb),
    ('Gear For Life', 'POLTT', 'bamboo-1', 'Bamboo', null, null, 1, '{"supplier_colour":"Bamboo","appa_colour":null,"colour_product_code":null,"source_row_number":262}'::jsonb),
    ('Gear For Life', 'POFWC', 'matt-black-1', 'Matt black', null, null, 1, '{"supplier_colour":"Matt black","appa_colour":"Black","colour_product_code":null,"source_row_number":264}'::jsonb),
    ('Gear For Life', 'POFWC', 'matt-white-2', 'Matt White', null, null, 2, '{"supplier_colour":"Matt White","appa_colour":"White","colour_product_code":null,"source_row_number":264}'::jsonb),
    ('Gear For Life', 'POAB', 'matt-black-1', 'Matt black', null, null, 1, '{"supplier_colour":"Matt black","appa_colour":"Black","colour_product_code":null,"source_row_number":269}'::jsonb),
    ('Gear For Life', 'BEBCC', 'black-charcoal-1', 'Black/Charcoal', null, null, 1, '{"supplier_colour":"Black/Charcoal","appa_colour":"Black/Dark Grey","colour_product_code":null,"source_row_number":270}'::jsonb),
    ('Gear For Life', 'BEBCC', 'red-charcoal-2', 'Red/Charcoal', null, null, 2, '{"supplier_colour":"Red/Charcoal","appa_colour":"Red/Dark Grey","colour_product_code":null,"source_row_number":270}'::jsonb),
    ('Gear For Life', 'BEBCC', 'navy-charcoal-3', 'Navy/Charcoal', null, null, 3, '{"supplier_colour":"Navy/Charcoal","appa_colour":"Dark Blue/Dark Grey","colour_product_code":null,"source_row_number":270}'::jsonb),
    ('Gear For Life', 'ODGOL', 'ocean-1', 'ocean', null, null, 1, '{"supplier_colour":"ocean","appa_colour":"Blue","colour_product_code":null,"source_row_number":271}'::jsonb),
    ('Gear For Life', 'ODGOL', 'cool-lime-2', 'cool lime', null, null, 2, '{"supplier_colour":"cool lime","appa_colour":"Light Green","colour_product_code":null,"source_row_number":271}'::jsonb),
    ('Gear For Life', 'ODGOL', 'aluminium-3', 'aluminium', null, null, 3, '{"supplier_colour":"aluminium","appa_colour":"Grey","colour_product_code":null,"source_row_number":271}'::jsonb),
    ('Gear For Life', 'OWDGOL', 'ocean-1', 'ocean', null, null, 1, '{"supplier_colour":"ocean","appa_colour":"Blue","colour_product_code":null,"source_row_number":272}'::jsonb),
    ('Gear For Life', 'OWDGOL', 'stone-2', 'stone', null, null, 2, '{"supplier_colour":"stone","appa_colour":"Cream","colour_product_code":null,"source_row_number":272}'::jsonb),
    ('Gear For Life', 'OWDGOL', 'olive-3', 'olive', null, null, 3, '{"supplier_colour":"olive","appa_colour":"Light Green","colour_product_code":null,"source_row_number":272}'::jsonb),
    ('Gear For Life', 'OWDGOL', 'aluminium-4', 'aluminium', null, null, 4, '{"supplier_colour":"aluminium","appa_colour":"Grey","colour_product_code":null,"source_row_number":272}'::jsonb),
    ('Gear For Life', 'ODGVQP', 'cornflower-1', 'cornflower', null, null, 1, '{"supplier_colour":"cornflower","appa_colour":"Blue","colour_product_code":null,"source_row_number":273}'::jsonb),
    ('Gear For Life', 'OWDGVQP', 'navy-1', 'navy', null, null, 1, '{"supplier_colour":"navy","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":274}'::jsonb),
    ('Gear For Life', 'OWDGVQP', 'black-2', 'black', null, null, 2, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":274}'::jsonb),
    ('Gear For Life', 'OWDGVQP', 'apple-3', 'apple', null, null, 3, '{"supplier_colour":"apple","appa_colour":"Light Green","colour_product_code":null,"source_row_number":274}'::jsonb),
    ('Gear For Life', 'ODGPO', 'navy-sky-1', 'navy/sky', null, null, 1, '{"supplier_colour":"navy/sky","appa_colour":"Dark Blue/Light Blue","colour_product_code":null,"source_row_number":275}'::jsonb),
    ('Gear For Life', 'ODGPO', 'white-navy-2', 'white/navy', null, null, 2, '{"supplier_colour":"white/navy","appa_colour":"White/Dark Blue","colour_product_code":null,"source_row_number":275}'::jsonb),
    ('Gear For Life', 'ODGPO', 'charcoal-navy-3', 'charcoal/navy', null, null, 3, '{"supplier_colour":"charcoal/navy","appa_colour":"Dark Grey/Dark Blue","colour_product_code":null,"source_row_number":275}'::jsonb),
    ('Gear For Life', 'ODGPO', 'navy-apple-4', 'navy/apple', null, null, 4, '{"supplier_colour":"navy/apple","appa_colour":"Dark Blue/Light Green","colour_product_code":null,"source_row_number":275}'::jsonb),
    ('Gear For Life', 'ODGPO', 'navy-red-5', 'navy/red', null, null, 5, '{"supplier_colour":"navy/red","appa_colour":"Dark Blue/Red","colour_product_code":null,"source_row_number":275}'::jsonb),
    ('Gear For Life', 'ODGPO', 'black-gold-6', 'black/gold', null, null, 6, '{"supplier_colour":"black/gold","appa_colour":"Black/Yellow","colour_product_code":null,"source_row_number":275}'::jsonb),
    ('Gear For Life', 'ODGSP(I)', 'navy-aluminium-1', 'navy/aluminium', null, null, 1, '{"supplier_colour":"navy/aluminium","appa_colour":"Dark Blue/Grey","colour_product_code":null,"source_row_number":276}'::jsonb),
    ('Gear For Life', 'ODGSP(I)', 'black-pumpkin-2', 'black/pumpkin', null, null, 2, '{"supplier_colour":"black/pumpkin","appa_colour":"Black/Orange","colour_product_code":null,"source_row_number":276}'::jsonb),
    ('Gear For Life', 'ODGZP', 'silver-black-1', 'silver/black', null, null, 1, '{"supplier_colour":"silver/black","appa_colour":"Light Grey/Black","colour_product_code":null,"source_row_number":277}'::jsonb),
    ('Gear For Life', 'ODGZP', 'black-gold-2', 'black/gold', null, null, 2, '{"supplier_colour":"black/gold","appa_colour":"Black/Yellow","colour_product_code":null,"source_row_number":277}'::jsonb),
    ('Gear For Life', 'ODGZP', 'black-royal-3', 'black/royal', null, null, 3, '{"supplier_colour":"black/royal","appa_colour":"Black/Blue","colour_product_code":null,"source_row_number":277}'::jsonb),
    ('Gear For Life', 'ODGZP', 'black-white-4', 'black/white', null, null, 4, '{"supplier_colour":"black/white","appa_colour":"Black/White","colour_product_code":null,"source_row_number":277}'::jsonb),
    ('Gear For Life', 'ODGZP', 'navy-gold-5', 'navy/gold', null, null, 5, '{"supplier_colour":"navy/gold","appa_colour":"Dark Blue/Yellow","colour_product_code":null,"source_row_number":277}'::jsonb),
    ('Gear For Life', 'ODGMP', 'black-pumpkin-1', 'black/pumpkin', null, null, 1, '{"supplier_colour":"black/pumpkin","appa_colour":"Black/Orange","colour_product_code":null,"source_row_number":278}'::jsonb),
    ('Gear For Life', 'ODGMP', 'cool-lime-navy-2', 'cool lime/navy', null, null, 2, '{"supplier_colour":"cool lime/navy","appa_colour":"Light Green/Dark Blue","colour_product_code":null,"source_row_number":278}'::jsonb),
    ('Gear For Life', 'ODGCHP', 'silver-black-silver-1', 'silver/black/silver', null, null, 1, '{"supplier_colour":"silver/black/silver","appa_colour":"Light Grey/Black/Light Grey","colour_product_code":null,"source_row_number":279}'::jsonb),
    ('Gear For Life', 'ODGCHP', 'black-royal-white-2', 'black/royal/white', null, null, 2, '{"supplier_colour":"black/royal/white","appa_colour":"Black/Blue/White","colour_product_code":null,"source_row_number":279}'::jsonb),
    ('Gear For Life', 'ODGCHP', 'black-red-white-3', 'black/red/white', null, null, 3, '{"supplier_colour":"black/red/white","appa_colour":"Black/Red/White","colour_product_code":null,"source_row_number":279}'::jsonb),
    ('Gear For Life', 'ODGCHP', 'navy-red-white-4', 'navy/red/white', null, null, 4, '{"supplier_colour":"navy/red/white","appa_colour":"Dark Blue/Red/White","colour_product_code":null,"source_row_number":279}'::jsonb),
    ('Gear For Life', 'ODGCHP', 'navy-white-navy-5', 'navy/white/navy', null, null, 5, '{"supplier_colour":"navy/white/navy","appa_colour":"Dark Blue/White/Dark Blue","colour_product_code":null,"source_row_number":279}'::jsonb),
    ('Gear For Life', 'OWDGHP', 'stone-black-1', 'stone/black', null, null, 1, '{"supplier_colour":"stone/black","appa_colour":"Cream/Black","colour_product_code":null,"source_row_number":280}'::jsonb),
    ('Gear For Life', 'ODGP', 'black-white-1', 'black/white', null, null, 1, '{"supplier_colour":"black/white","appa_colour":"Black/White","colour_product_code":null,"source_row_number":281}'::jsonb),
    ('Gear For Life', 'OWDGP', 'navy-white-1', 'navy/white', null, null, 1, '{"supplier_colour":"navy/white","appa_colour":"Dark Blue/White","colour_product_code":null,"source_row_number":282}'::jsonb),
    ('Gear For Life', 'OWDGP', 'navy-sky-2', 'navy/sky', null, null, 2, '{"supplier_colour":"navy/sky","appa_colour":"Dark Blue/Light Blue","colour_product_code":null,"source_row_number":282}'::jsonb),
    ('Gear For Life', 'OWDGP', 'black-white-3', 'black/white', null, null, 3, '{"supplier_colour":"black/white","appa_colour":"Black/White","colour_product_code":null,"source_row_number":282}'::jsonb),
    ('Gear For Life', 'OWDGFP', 'sky-navy-1', 'sky/navy', null, null, 1, '{"supplier_colour":"sky/navy","appa_colour":"Light Blue/Dark Blue","colour_product_code":null,"source_row_number":283}'::jsonb),
    ('Gear For Life', 'OWDGFP', 'aluminium-white-2', 'aluminium/white', null, null, 2, '{"supplier_colour":"aluminium/white","appa_colour":"Grey/White","colour_product_code":null,"source_row_number":283}'::jsonb),
    ('Gear For Life', 'OWDGFP', 'black-stone-3', 'black/stone', null, null, 3, '{"supplier_colour":"black/stone","appa_colour":"Black/Cream","colour_product_code":null,"source_row_number":283}'::jsonb),
    ('Gear For Life', 'OWDGFP', 'maroon-white-4', 'maroon/white', null, null, 4, '{"supplier_colour":"maroon/white","appa_colour":"Dark Red/White","colour_product_code":null,"source_row_number":283}'::jsonb),
    ('Gear For Life', 'OWDGFP', 'navy-white-5', 'navy/white', null, null, 5, '{"supplier_colour":"navy/white","appa_colour":"Dark Blue/White","colour_product_code":null,"source_row_number":283}'::jsonb),
    ('Gear For Life', 'OWDGFP', 'royal-white-6', 'royal/white', null, null, 6, '{"supplier_colour":"royal/white","appa_colour":"Blue/White","colour_product_code":null,"source_row_number":283}'::jsonb),
    ('Gear For Life', 'OWDGFP', 'red-white-7', 'red/white', null, null, 7, '{"supplier_colour":"red/white","appa_colour":"Red/White","colour_product_code":null,"source_row_number":283}'::jsonb),
    ('Gear For Life', 'OWDGKP', 'navy-red-white-1', 'navy/red/white', null, null, 1, '{"supplier_colour":"navy/red/white","appa_colour":"Dark Blue/Red/White","colour_product_code":null,"source_row_number":284}'::jsonb),
    ('Gear For Life', 'OWDGKP', 'apple-navy-white-2', 'apple/navy/white', null, null, 2, '{"supplier_colour":"apple/navy/white","appa_colour":"Light Green/Dark Blue/White","colour_product_code":null,"source_row_number":284}'::jsonb),
    ('Gear For Life', 'OWDGKP', 'white-navy-sky-3', 'white/navy/sky', null, null, 3, '{"supplier_colour":"white/navy/sky","appa_colour":"White/Dark Blue/Light Blue","colour_product_code":null,"source_row_number":284}'::jsonb)
) as v(supplier, supplier_sku, colour_key, colour_name, colour_code, hex, sort_order, raw_json);

with gfl_batch as (
  select id as batch_id
  from public.supplier_import_batches
  where supplier = 'Gear For Life'
    and source_file_hash = 'f20ede9ac24d944fcb4c3c646d8ae2cbc41d2c63580200db27f2e86a96bf739c'
  order by created_at desc
  limit 1
)
insert into public.supplier_raw_colour_options (
  batch_id, supplier, supplier_sku, colour_key, colour_name, colour_code, hex, sort_order, raw_json
)
select
  gfl_batch.batch_id,
  v.supplier::text, v.supplier_sku::text, v.colour_key::text, v.colour_name::text, v.colour_code::text, v.hex::text, v.sort_order::text, v.raw_json::jsonb
from gfl_batch
cross join (
  values
    ('Gear For Life', 'OWPCP', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":285}'::jsonb),
    ('Gear For Life', 'OWPCP', 'white-2', 'white', null, null, 2, '{"supplier_colour":"white","appa_colour":"White","colour_product_code":null,"source_row_number":285}'::jsonb),
    ('Gear For Life', 'OWPCP', 'navy-3', 'navy', null, null, 3, '{"supplier_colour":"navy","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":285}'::jsonb),
    ('Gear For Life', 'OWPCP', 'cool-lime-4', 'cool lime', null, null, 4, '{"supplier_colour":"cool lime","appa_colour":"Light Green","colour_product_code":null,"source_row_number":285}'::jsonb),
    ('Gear For Life', 'OWPCP', 'turquoise-5', 'turquoise', null, null, 5, '{"supplier_colour":"turquoise","appa_colour":"Blue","colour_product_code":null,"source_row_number":285}'::jsonb),
    ('Gear For Life', 'ORWP', 'red-white-1', 'red/white', null, null, 1, '{"supplier_colour":"red/white","appa_colour":"Red/White","colour_product_code":null,"source_row_number":286}'::jsonb),
    ('Gear For Life', 'OWRWP', 'ocean-navy-1', 'ocean/navy', null, null, 1, '{"supplier_colour":"ocean/navy","appa_colour":"Blue/Dark Blue","colour_product_code":null,"source_row_number":287}'::jsonb),
    ('Gear For Life', 'OWRWP', 'navy-gold-2', 'navy/gold', null, null, 2, '{"supplier_colour":"navy/gold","appa_colour":"Dark Blue/Yellow","colour_product_code":null,"source_row_number":287}'::jsonb),
    ('Gear For Life', 'OWRWP', 'khaki-navy-3', 'khaki/navy', null, null, 3, '{"supplier_colour":"khaki/navy","appa_colour":"Khaki/Dark Blue","colour_product_code":null,"source_row_number":287}'::jsonb),
    ('Gear For Life', 'OWRWP', 'black-gold-4', 'black/gold', null, null, 4, '{"supplier_colour":"black/gold","appa_colour":"Black/Yellow","colour_product_code":null,"source_row_number":287}'::jsonb),
    ('Gear For Life', 'OWRWP', 'black-red-5', 'black/red', null, null, 5, '{"supplier_colour":"black/red","appa_colour":"Black/Red","colour_product_code":null,"source_row_number":287}'::jsonb),
    ('Gear For Life', 'OWRWP', 'pink-grey-6', 'pink/grey', null, null, 6, '{"supplier_colour":"pink/grey","appa_colour":"Pink/Grey","colour_product_code":null,"source_row_number":287}'::jsonb),
    ('Gear For Life', 'OWRWP', 'white-navy-7', 'white/navy', null, null, 7, '{"supplier_colour":"white/navy","appa_colour":"White/Dark Blue","colour_product_code":null,"source_row_number":287}'::jsonb),
    ('Gear For Life', 'OWRWP', 'sand-black-8', 'sand/black', null, null, 8, '{"supplier_colour":"sand/black","appa_colour":"Cream/Black","colour_product_code":null,"source_row_number":287}'::jsonb),
    ('Gear For Life', 'OWRWP', 'sky-chocolate-9', 'sky/chocolate', null, null, 9, '{"supplier_colour":"sky/chocolate","appa_colour":"Light Blue/Dark Brown","colour_product_code":null,"source_row_number":287}'::jsonb),
    ('Gear For Life', 'OMHP', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":288}'::jsonb),
    ('Gear For Life', 'OWMHP', 'navy-1', 'navy', null, null, 1, '{"supplier_colour":"navy","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":289}'::jsonb),
    ('Gear For Life', 'OWJO', 'ocean-1', 'ocean', null, null, 1, '{"supplier_colour":"ocean","appa_colour":"Blue","colour_product_code":null,"source_row_number":290}'::jsonb),
    ('Gear For Life', 'OWJO', 'storm-2', 'storm', null, null, 2, '{"supplier_colour":"storm","appa_colour":"Light Grey","colour_product_code":null,"source_row_number":290}'::jsonb),
    ('Gear For Life', 'OWJO', 'cappuccino-3', 'cappuccino', null, null, 3, '{"supplier_colour":"cappuccino","appa_colour":"Light Brown","colour_product_code":null,"source_row_number":290}'::jsonb),
    ('Gear For Life', 'OWJO', 'stone-4', 'stone', null, null, 4, '{"supplier_colour":"stone","appa_colour":"Cream","colour_product_code":null,"source_row_number":290}'::jsonb),
    ('Gear For Life', 'OWJO', 'olive-5', 'olive', null, null, 5, '{"supplier_colour":"olive","appa_colour":"Light Green","colour_product_code":null,"source_row_number":290}'::jsonb),
    ('Gear For Life', 'OWJO', 'apple-6', 'apple', null, null, 6, '{"supplier_colour":"apple","appa_colour":"Light Green","colour_product_code":null,"source_row_number":290}'::jsonb),
    ('Gear For Life', 'OWJO', 'chilli-7', 'chilli', null, null, 7, '{"supplier_colour":"chilli","appa_colour":"Dark Red","colour_product_code":null,"source_row_number":290}'::jsonb),
    ('Gear For Life', 'OWJO', 'teal-8', 'teal', null, null, 8, '{"supplier_colour":"teal","appa_colour":"Aqua","colour_product_code":null,"source_row_number":290}'::jsonb),
    ('Gear For Life', 'OWJO', 'navy-9', 'navy', null, null, 9, '{"supplier_colour":"navy","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":290}'::jsonb),
    ('Gear For Life', 'OWQDP', 'cool-lime-navy-1', 'cool lime/navy', null, null, 1, '{"supplier_colour":"cool lime/navy","appa_colour":"Light Green/Dark Blue","colour_product_code":null,"source_row_number":291}'::jsonb),
    ('Gear For Life', 'OWQDP', 'black-aluminium-2', 'black/aluminium', null, null, 2, '{"supplier_colour":"black/aluminium","appa_colour":"Black/Grey","colour_product_code":null,"source_row_number":291}'::jsonb),
    ('Gear For Life', 'OWEP', 'navy-red-1', 'navy/red', null, null, 1, '{"supplier_colour":"navy/red","appa_colour":"Dark Blue/Red","colour_product_code":null,"source_row_number":292}'::jsonb),
    ('Gear For Life', 'OWEP', 'black-red-2', 'black/red', null, null, 2, '{"supplier_colour":"black/red","appa_colour":"Black/Red","colour_product_code":null,"source_row_number":292}'::jsonb),
    ('Gear For Life', 'OWEP', 'navy-gold-3', 'navy/gold', null, null, 3, '{"supplier_colour":"navy/gold","appa_colour":"Dark Blue/Yellow","colour_product_code":null,"source_row_number":292}'::jsonb),
    ('Gear For Life', 'OWEP', 'black-gold-4', 'black/gold', null, null, 4, '{"supplier_colour":"black/gold","appa_colour":"Black/Yellow","colour_product_code":null,"source_row_number":292}'::jsonb),
    ('Gear For Life', 'ORBJ', 'black-white-1', 'black/white', null, null, 1, '{"supplier_colour":"black/white","appa_colour":"Black/White","colour_product_code":null,"source_row_number":293}'::jsonb),
    ('Gear For Life', 'ORBJ', 'navy-white-2', 'navy/white', null, null, 2, '{"supplier_colour":"navy/white","appa_colour":"Dark Blue/White","colour_product_code":null,"source_row_number":293}'::jsonb),
    ('Gear For Life', 'ODGZT', 'black-gold-1', 'black/gold', null, null, 1, '{"supplier_colour":"black/gold","appa_colour":"Black/Yellow","colour_product_code":null,"source_row_number":294}'::jsonb),
    ('Gear For Life', 'ODGZT', 'black-red-2', 'black/red', null, null, 2, '{"supplier_colour":"black/red","appa_colour":"Black/Red","colour_product_code":null,"source_row_number":294}'::jsonb),
    ('Gear For Life', 'ODGZT', 'black-royal-3', 'black/royal', null, null, 3, '{"supplier_colour":"black/royal","appa_colour":"Black/Blue","colour_product_code":null,"source_row_number":294}'::jsonb),
    ('Gear For Life', 'ODGZT', 'black-white-4', 'black/white', null, null, 4, '{"supplier_colour":"black/white","appa_colour":"Black/White","colour_product_code":null,"source_row_number":294}'::jsonb),
    ('Gear For Life', 'ODGZT', 'navy-gold-5', 'navy/gold', null, null, 5, '{"supplier_colour":"navy/gold","appa_colour":"Dark Blue/Yellow","colour_product_code":null,"source_row_number":294}'::jsonb),
    ('Gear For Life', 'ODGZT', 'navy-white-6', 'navy/white', null, null, 6, '{"supplier_colour":"navy/white","appa_colour":"Dark Blue/White","colour_product_code":null,"source_row_number":294}'::jsonb),
    ('Gear For Life', 'ODGZT', 'white-navy-7', 'white/navy', null, null, 7, '{"supplier_colour":"white/navy","appa_colour":"White/Dark Blue","colour_product_code":null,"source_row_number":294}'::jsonb),
    ('Gear For Life', 'ODGT', 'navy-white-1', 'navy/white', null, null, 1, '{"supplier_colour":"navy/white","appa_colour":"Dark Blue/White","colour_product_code":null,"source_row_number":295}'::jsonb),
    ('Gear For Life', 'ODGT', 'black-white-2', 'black/white', null, null, 2, '{"supplier_colour":"black/white","appa_colour":"Black/White","colour_product_code":null,"source_row_number":295}'::jsonb),
    ('Gear For Life', 'ODGT', 'navy-sky-3', 'navy/sky', null, null, 3, '{"supplier_colour":"navy/sky","appa_colour":"Dark Blue/Light Blue","colour_product_code":null,"source_row_number":295}'::jsonb),
    ('Gear For Life', 'OWDGT', 'navy-white-1', 'navy/white', null, null, 1, '{"supplier_colour":"navy/white","appa_colour":"Dark Blue/White","colour_product_code":null,"source_row_number":296}'::jsonb),
    ('Gear For Life', 'OWDGT', 'navy-sky-2', 'navy/sky', null, null, 2, '{"supplier_colour":"navy/sky","appa_colour":"Dark Blue/Light Blue","colour_product_code":null,"source_row_number":296}'::jsonb),
    ('Gear For Life', 'OWDGR', 'royal-1', 'royal', null, null, 1, '{"supplier_colour":"royal","appa_colour":"Blue","colour_product_code":null,"source_row_number":297}'::jsonb),
    ('Gear For Life', 'OWDGR', 'white-2', 'white', null, null, 2, '{"supplier_colour":"white","appa_colour":"White","colour_product_code":null,"source_row_number":297}'::jsonb),
    ('Gear For Life', 'OWDGR', 'black-3', 'black', null, null, 3, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":297}'::jsonb),
    ('Gear For Life', 'OWDGR', 'navy-4', 'navy', null, null, 4, '{"supplier_colour":"navy","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":297}'::jsonb),
    ('Gear For Life', 'OWDGR', 'red-5', 'red', null, null, 5, '{"supplier_colour":"red","appa_colour":"Red","colour_product_code":null,"source_row_number":297}'::jsonb),
    ('Gear For Life', 'ODGTT', 'red-white-navy-1', 'red/white/navy', null, null, 1, '{"supplier_colour":"red/white/navy","appa_colour":"Red/White/Dark Blue","colour_product_code":null,"source_row_number":298}'::jsonb),
    ('Gear For Life', 'ODGTT', 'black-white-charcoal-2', 'black/white/charcoal', null, null, 2, '{"supplier_colour":"black/white/charcoal","appa_colour":"Black/White/Dark Grey","colour_product_code":null,"source_row_number":298}'::jsonb),
    ('Gear For Life', 'ODGTT', 'silver-white-black-3', 'silver/white/black', null, null, 3, '{"supplier_colour":"silver/white/black","appa_colour":"Light Grey/White/Black","colour_product_code":null,"source_row_number":298}'::jsonb),
    ('Gear For Life', 'ODGST(I)', 'black-pumpkin-1', 'black/pumpkin', null, null, 1, '{"supplier_colour":"black/pumpkin","appa_colour":"Black/Orange","colour_product_code":null,"source_row_number":299}'::jsonb),
    ('Gear For Life', 'ODGSS', 'black-red-1', 'black/red', null, null, 1, '{"supplier_colour":"black/red","appa_colour":"Black/Red","colour_product_code":null,"source_row_number":300}'::jsonb),
    ('Gear For Life', 'ODGSS', 'black-royal-2', 'black/royal', null, null, 2, '{"supplier_colour":"black/royal","appa_colour":"Black/Blue","colour_product_code":null,"source_row_number":300}'::jsonb),
    ('Gear For Life', 'ODGSS', 'navy-sky-3', 'navy/sky', null, null, 3, '{"supplier_colour":"navy/sky","appa_colour":"Dark Blue/Light Blue","colour_product_code":null,"source_row_number":300}'::jsonb),
    ('Gear For Life', 'ODGSS', 'navy-white-4', 'navy/white', null, null, 4, '{"supplier_colour":"navy/white","appa_colour":"Dark Blue/White","colour_product_code":null,"source_row_number":300}'::jsonb),
    ('Gear For Life', 'ODGSS', 'red-white-5', 'red/white', null, null, 5, '{"supplier_colour":"red/white","appa_colour":"Red/White","colour_product_code":null,"source_row_number":300}'::jsonb),
    ('Gear For Life', 'ODGSS', 'royal-gold-6', 'royal/gold', null, null, 6, '{"supplier_colour":"royal/gold","appa_colour":"Blue/Yellow","colour_product_code":null,"source_row_number":300}'::jsonb),
    ('Gear For Life', 'ODGSS', 'royal-red-7', 'royal/red', null, null, 7, '{"supplier_colour":"royal/red","appa_colour":"Blue/Red","colour_product_code":null,"source_row_number":300}'::jsonb),
    ('Gear For Life', 'ODGSS', 'royal-white-8', 'royal/white', null, null, 8, '{"supplier_colour":"royal/white","appa_colour":"Blue/White","colour_product_code":null,"source_row_number":300}'::jsonb),
    ('Gear For Life', 'ODGSS', 'white-navy-9', 'white/navy', null, null, 9, '{"supplier_colour":"white/navy","appa_colour":"White/Dark Blue","colour_product_code":null,"source_row_number":300}'::jsonb),
    ('Gear For Life', 'ODGSS', 'navy-gold-10', 'navy/gold', null, null, 10, '{"supplier_colour":"navy/gold","appa_colour":"Dark Blue/Yellow","colour_product_code":null,"source_row_number":300}'::jsonb),
    ('Gear For Life', 'ODGSS', 'black-white-11', 'black/white', null, null, 11, '{"supplier_colour":"black/white","appa_colour":"Black/White","colour_product_code":null,"source_row_number":300}'::jsonb),
    ('Gear For Life', 'ODGSS', 'navy-red-12', 'navy/red', null, null, 12, '{"supplier_colour":"navy/red","appa_colour":"Dark Blue/Red","colour_product_code":null,"source_row_number":300}'::jsonb),
    ('Gear For Life', 'ODGSS', 'black-gold-13', 'black/gold', null, null, 13, '{"supplier_colour":"black/gold","appa_colour":"Black/Yellow","colour_product_code":null,"source_row_number":300}'::jsonb),
    ('Gear For Life', 'OWDGSS', 'black-red-1', 'black/red', null, null, 1, '{"supplier_colour":"black/red","appa_colour":"Black/Red","colour_product_code":null,"source_row_number":301}'::jsonb),
    ('Gear For Life', 'OWDGSS', 'black-gold-2', 'black/gold', null, null, 2, '{"supplier_colour":"black/gold","appa_colour":"Black/Yellow","colour_product_code":null,"source_row_number":301}'::jsonb),
    ('Gear For Life', 'OWDGSS', 'black-royal-3', 'black/royal', null, null, 3, '{"supplier_colour":"black/royal","appa_colour":"Black/Blue","colour_product_code":null,"source_row_number":301}'::jsonb),
    ('Gear For Life', 'OWDGSS', 'navy-gold-4', 'navy/gold', null, null, 4, '{"supplier_colour":"navy/gold","appa_colour":"Dark Blue/Yellow","colour_product_code":null,"source_row_number":301}'::jsonb),
    ('Gear For Life', 'OWDGSS', 'navy-red-5', 'navy/red', null, null, 5, '{"supplier_colour":"navy/red","appa_colour":"Dark Blue/Red","colour_product_code":null,"source_row_number":301}'::jsonb),
    ('Gear For Life', 'OWDGSS', 'navy-sky-6', 'navy/sky', null, null, 6, '{"supplier_colour":"navy/sky","appa_colour":"Dark Blue/Light Blue","colour_product_code":null,"source_row_number":301}'::jsonb),
    ('Gear For Life', 'OWDGSS', 'royal-gold-7', 'royal/gold', null, null, 7, '{"supplier_colour":"royal/gold","appa_colour":"Blue/Yellow","colour_product_code":null,"source_row_number":301}'::jsonb),
    ('Gear For Life', 'OWDGSS', 'royal-red-8', 'royal/red', null, null, 8, '{"supplier_colour":"royal/red","appa_colour":"Blue/Red","colour_product_code":null,"source_row_number":301}'::jsonb),
    ('Gear For Life', 'OWDGSS', 'royal-white-9', 'royal/white', null, null, 9, '{"supplier_colour":"royal/white","appa_colour":"Blue/White","colour_product_code":null,"source_row_number":301}'::jsonb),
    ('Gear For Life', 'OWDGSS', 'black-white-10', 'black/white', null, null, 10, '{"supplier_colour":"black/white","appa_colour":"Black/White","colour_product_code":null,"source_row_number":301}'::jsonb),
    ('Gear For Life', 'OYDGSS', 'royal-gold-1', 'royal/gold', null, null, 1, '{"supplier_colour":"royal/gold","appa_colour":"Blue/Yellow","colour_product_code":null,"source_row_number":302}'::jsonb),
    ('Gear For Life', 'OYDGSS', 'black-gold-2', 'black/gold', null, null, 2, '{"supplier_colour":"black/gold","appa_colour":"Black/Yellow","colour_product_code":null,"source_row_number":302}'::jsonb)
) as v(supplier, supplier_sku, colour_key, colour_name, colour_code, hex, sort_order, raw_json);

with gfl_batch as (
  select id as batch_id
  from public.supplier_import_batches
  where supplier = 'Gear For Life'
    and source_file_hash = 'f20ede9ac24d944fcb4c3c646d8ae2cbc41d2c63580200db27f2e86a96bf739c'
  order by created_at desc
  limit 1
)
insert into public.supplier_raw_colour_options (
  batch_id, supplier, supplier_sku, colour_key, colour_name, colour_code, hex, sort_order, raw_json
)
select
  gfl_batch.batch_id,
  v.supplier::text, v.supplier_sku::text, v.colour_key::text, v.colour_name::text, v.colour_code::text, v.hex::text, v.sort_order::text, v.raw_json::jsonb
from gfl_batch
cross join (
  values
    ('Gear For Life', 'OYDGSS', 'black-red-3', 'black/red', null, null, 3, '{"supplier_colour":"black/red","appa_colour":"Black/Red","colour_product_code":null,"source_row_number":302}'::jsonb),
    ('Gear For Life', 'OYDGSS', 'black-royal-4', 'black/royal', null, null, 4, '{"supplier_colour":"black/royal","appa_colour":"Black/Blue","colour_product_code":null,"source_row_number":302}'::jsonb),
    ('Gear For Life', 'OYDGSS', 'black-white-5', 'black/white', null, null, 5, '{"supplier_colour":"black/white","appa_colour":"Black/White","colour_product_code":null,"source_row_number":302}'::jsonb),
    ('Gear For Life', 'OYDGSS', 'maroon-white-6', 'maroon/white', null, null, 6, '{"supplier_colour":"maroon/white","appa_colour":"Dark Red/White","colour_product_code":null,"source_row_number":302}'::jsonb),
    ('Gear For Life', 'OYDGSS', 'navy-gold-7', 'navy/gold', null, null, 7, '{"supplier_colour":"navy/gold","appa_colour":"Dark Blue/Yellow","colour_product_code":null,"source_row_number":302}'::jsonb),
    ('Gear For Life', 'OYDGSS', 'navy-red-8', 'navy/red', null, null, 8, '{"supplier_colour":"navy/red","appa_colour":"Dark Blue/Red","colour_product_code":null,"source_row_number":302}'::jsonb),
    ('Gear For Life', 'OYDGSS', 'navy-sky-9', 'navy/sky', null, null, 9, '{"supplier_colour":"navy/sky","appa_colour":"Dark Blue/Light Blue","colour_product_code":null,"source_row_number":302}'::jsonb),
    ('Gear For Life', 'OYDGSS', 'navy-white-10', 'navy/white', null, null, 10, '{"supplier_colour":"navy/white","appa_colour":"Dark Blue/White","colour_product_code":null,"source_row_number":302}'::jsonb),
    ('Gear For Life', 'OYDGSS', 'red-white-11', 'red/white', null, null, 11, '{"supplier_colour":"red/white","appa_colour":"Red/White","colour_product_code":null,"source_row_number":302}'::jsonb),
    ('Gear For Life', 'OYDGSS', 'royal-red-12', 'royal/red', null, null, 12, '{"supplier_colour":"royal/red","appa_colour":"Blue/Red","colour_product_code":null,"source_row_number":302}'::jsonb),
    ('Gear For Life', 'OYDGSS', 'white-navy-13', 'white/navy', null, null, 13, '{"supplier_colour":"white/navy","appa_colour":"White/Dark Blue","colour_product_code":null,"source_row_number":302}'::jsonb),
    ('Gear For Life', 'ODGS(P)', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":303}'::jsonb),
    ('Gear For Life', 'ODGS(P)', 'white-2', 'white', null, null, 2, '{"supplier_colour":"white","appa_colour":"White","colour_product_code":null,"source_row_number":303}'::jsonb),
    ('Gear For Life', 'ODGS(P)', 'navy-3', 'navy', null, null, 3, '{"supplier_colour":"navy","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":303}'::jsonb),
    ('Gear For Life', 'OWDGS(P)', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":304}'::jsonb),
    ('Gear For Life', 'OWDGS(P)', 'white-2', 'white', null, null, 2, '{"supplier_colour":"white","appa_colour":"White","colour_product_code":null,"source_row_number":304}'::jsonb),
    ('Gear For Life', 'ODGS(C)', 'navy-sky-1', 'navy/sky', null, null, 1, '{"supplier_colour":"navy/sky","appa_colour":"Dark Blue/Light Blue","colour_product_code":null,"source_row_number":305}'::jsonb),
    ('Gear For Life', 'ODGS(C)', 'black-white-2', 'black/white', null, null, 2, '{"supplier_colour":"black/white","appa_colour":"Black/White","colour_product_code":null,"source_row_number":305}'::jsonb),
    ('Gear For Life', 'ODGS(C)', 'navy-white-3', 'navy/white', null, null, 3, '{"supplier_colour":"navy/white","appa_colour":"Dark Blue/White","colour_product_code":null,"source_row_number":305}'::jsonb),
    ('Gear For Life', 'OWDGS(C)', 'navy-sky-1', 'navy/sky', null, null, 1, '{"supplier_colour":"navy/sky","appa_colour":"Dark Blue/Light Blue","colour_product_code":null,"source_row_number":306}'::jsonb),
    ('Gear For Life', 'OWDGS(C)', 'navy-white-2', 'navy/white', null, null, 2, '{"supplier_colour":"navy/white","appa_colour":"Dark Blue/White","colour_product_code":null,"source_row_number":306}'::jsonb),
    ('Gear For Life', 'ODGSH', 'navy-1', 'navy', null, null, 1, '{"supplier_colour":"navy","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":307}'::jsonb),
    ('Gear For Life', 'OWDGSH', 'navy-1', 'navy', null, null, 1, '{"supplier_colour":"navy","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":308}'::jsonb),
    ('Gear For Life', 'OWDGSH', 'black-2', 'black', null, null, 2, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":308}'::jsonb),
    ('Gear For Life', 'OMTS', 'black-white-1', 'black/white', null, null, 1, '{"supplier_colour":"black/white","appa_colour":"Black/White","colour_product_code":null,"source_row_number":309}'::jsonb),
    ('Gear For Life', 'OMTS', 'navy-white-2', 'navy/white', null, null, 2, '{"supplier_colour":"navy/white","appa_colour":"Dark Blue/White","colour_product_code":null,"source_row_number":309}'::jsonb),
    ('Gear For Life', 'OAS', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":310}'::jsonb),
    ('Gear For Life', 'OAS', 'navy-2', 'navy', null, null, 2, '{"supplier_colour":"navy","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":310}'::jsonb),
    ('Gear For Life', 'OWAS', 'navy-1', 'navy', null, null, 1, '{"supplier_colour":"navy","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":311}'::jsonb),
    ('Gear For Life', 'OYRBS', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":312}'::jsonb),
    ('Gear For Life', 'OTSTP', 'black-white-1', 'black/white', null, null, 1, '{"supplier_colour":"black/white","appa_colour":"Black/White","colour_product_code":null,"source_row_number":313}'::jsonb),
    ('Gear For Life', 'OTSTP', 'navy-white-2', 'navy/white', null, null, 2, '{"supplier_colour":"navy/white","appa_colour":"Dark Blue/White","colour_product_code":null,"source_row_number":313}'::jsonb),
    ('Gear For Life', 'OMFP', 'navy-white-1', 'navy/white', null, null, 1, '{"supplier_colour":"navy/white","appa_colour":"Dark Blue/White","colour_product_code":null,"source_row_number":314}'::jsonb),
    ('Gear For Life', 'OMFP', 'black-white-2', 'black/white', null, null, 2, '{"supplier_colour":"black/white","appa_colour":"Black/White","colour_product_code":null,"source_row_number":314}'::jsonb),
    ('Gear For Life', 'OZP', 'black-white-1', 'black/white', null, null, 1, '{"supplier_colour":"black/white","appa_colour":"Black/White","colour_product_code":null,"source_row_number":315}'::jsonb),
    ('Gear For Life', 'OZP', 'navy-white-2', 'navy/white', null, null, 2, '{"supplier_colour":"navy/white","appa_colour":"Dark Blue/White","colour_product_code":null,"source_row_number":315}'::jsonb),
    ('Gear For Life', 'ONTP', 'navy-1', 'navy', null, null, 1, '{"supplier_colour":"navy","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":316}'::jsonb),
    ('Gear For Life', 'ONTP', 'black-2', 'black', null, null, 2, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":316}'::jsonb),
    ('Gear For Life', 'ORSP', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":317}'::jsonb),
    ('Gear For Life', 'ORSP', 'navy-2', 'navy', null, null, 2, '{"supplier_colour":"navy","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":317}'::jsonb),
    ('Gear For Life', 'OTSWH', 'navy-1', 'navy', null, null, 1, '{"supplier_colour":"navy","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":318}'::jsonb),
    ('Gear For Life', 'ODGRFZ', 'navy-gold-1', 'navy/gold', null, null, 1, '{"supplier_colour":"navy/gold","appa_colour":"Dark Blue/Yellow","colour_product_code":null,"source_row_number":319}'::jsonb),
    ('Gear For Life', 'ODGRFZ', 'black-charcoal-2', 'black/charcoal', null, null, 2, '{"supplier_colour":"black/charcoal","appa_colour":"Black/Dark Grey","colour_product_code":null,"source_row_number":319}'::jsonb),
    ('Gear For Life', 'ODGRFZ', 'navy-white-3', 'navy/white', null, null, 3, '{"supplier_colour":"navy/white","appa_colour":"Dark Blue/White","colour_product_code":null,"source_row_number":319}'::jsonb),
    ('Gear For Life', 'OIPV', 'black-charcoal-1', 'black/charcoal', null, null, 1, '{"supplier_colour":"black/charcoal","appa_colour":"Black/Dark Grey","colour_product_code":null,"source_row_number":320}'::jsonb),
    ('Gear For Life', 'OMWJ', 'navy-1', 'navy', null, null, 1, '{"supplier_colour":"navy","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":321}'::jsonb),
    ('Gear For Life', 'OWMWJ', 'navy-1', 'navy', null, null, 1, '{"supplier_colour":"navy","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":322}'::jsonb),
    ('Gear For Life', 'OWMWJ', 'black-2', 'black', null, null, 2, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":322}'::jsonb),
    ('Gear For Life', 'OJP', 'navy-red-white-1', 'navy/red/white', null, null, 1, '{"supplier_colour":"navy/red/white","appa_colour":"Dark Blue/Red/White","colour_product_code":null,"source_row_number":323}'::jsonb),
    ('Gear For Life', 'OJP', 'black-charcoal-white-2', 'black/charcoal/white', null, null, 2, '{"supplier_colour":"black/charcoal/white","appa_colour":"Black/Dark Grey/White","colour_product_code":null,"source_row_number":323}'::jsonb),
    ('Gear For Life', 'OJP', 'black-red-white-3', 'black/red/white', null, null, 3, '{"supplier_colour":"black/red/white","appa_colour":"Black/Red/White","colour_product_code":null,"source_row_number":323}'::jsonb),
    ('Gear For Life', 'OSJ', 'navy-white-1', 'navy/white', null, null, 1, '{"supplier_colour":"navy/white","appa_colour":"Dark Blue/White","colour_product_code":null,"source_row_number":324}'::jsonb),
    ('Gear For Life', 'OSJ', 'black-gold-2', 'black/gold', null, null, 2, '{"supplier_colour":"black/gold","appa_colour":"Black/Yellow","colour_product_code":null,"source_row_number":324}'::jsonb),
    ('Gear For Life', 'OSJ', 'red-white-3', 'red/white', null, null, 3, '{"supplier_colour":"red/white","appa_colour":"Red/White","colour_product_code":null,"source_row_number":324}'::jsonb),
    ('Gear For Life', 'OSJ', 'navy-gold-4', 'navy/gold', null, null, 4, '{"supplier_colour":"navy/gold","appa_colour":"Dark Blue/Yellow","colour_product_code":null,"source_row_number":324}'::jsonb),
    ('Gear For Life', 'OSJ', 'royal-white-5', 'royal/white', null, null, 5, '{"supplier_colour":"royal/white","appa_colour":"Blue/White","colour_product_code":null,"source_row_number":324}'::jsonb),
    ('Gear For Life', 'OSJ', 'navy-red-6', 'navy/red', null, null, 6, '{"supplier_colour":"navy/red","appa_colour":"Dark Blue/Red","colour_product_code":null,"source_row_number":324}'::jsonb),
    ('Gear For Life', 'OSJ', 'royal-red-7', 'royal/Red', null, null, 7, '{"supplier_colour":"royal/Red","appa_colour":"Blue/Red","colour_product_code":null,"source_row_number":324}'::jsonb),
    ('Gear For Life', 'OWEGMCI', 'charcoal-black-1', 'charcoal/black', null, null, 1, '{"supplier_colour":"charcoal/black","appa_colour":"Dark Grey/Black","colour_product_code":null,"source_row_number":325}'::jsonb),
    ('Gear For Life', 'OEGMC', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":326}'::jsonb),
    ('Gear For Life', 'OWEGMV', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":327}'::jsonb),
    ('Gear For Life', 'OWEGMV', 'navy-2', 'navy', null, null, 2, '{"supplier_colour":"navy","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":327}'::jsonb),
    ('Gear For Life', 'OTV', 'white-1', 'white', null, null, 1, '{"supplier_colour":"white","appa_colour":"White","colour_product_code":null,"source_row_number":328}'::jsonb),
    ('Gear For Life', 'OTV', 'black-2', 'black', null, null, 2, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":328}'::jsonb),
    ('Gear For Life', 'OWTV', 'white-1', 'white', null, null, 1, '{"supplier_colour":"white","appa_colour":"White","colour_product_code":null,"source_row_number":329}'::jsonb),
    ('Gear For Life', 'OWTV', 'espresso-2', 'espresso', null, null, 2, '{"supplier_colour":"espresso","appa_colour":"Dark Brown","colour_product_code":null,"source_row_number":329}'::jsonb),
    ('Gear For Life', 'OWTV', 'sand-3', 'sand', null, null, 3, '{"supplier_colour":"sand","appa_colour":"Cream","colour_product_code":null,"source_row_number":329}'::jsonb),
    ('Gear For Life', 'OTRLS', 'navy-1', 'navy', null, null, 1, '{"supplier_colour":"navy","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":330}'::jsonb),
    ('Gear For Life', 'OTRLS', 'charcoal-2', 'charcoal', null, null, 2, '{"supplier_colour":"charcoal","appa_colour":"Dark grey","colour_product_code":null,"source_row_number":330}'::jsonb),
    ('Gear For Life', 'OWTRLS', 'navy-1', 'navy', null, null, 1, '{"supplier_colour":"navy","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":331}'::jsonb),
    ('Gear For Life', 'OWCS', 'silver-white-1', 'silver/white', null, null, 1, '{"supplier_colour":"silver/white","appa_colour":"Light Grey/White","colour_product_code":null,"source_row_number":332}'::jsonb),
    ('Gear For Life', 'OWTM', 'silver-1', 'silver', null, null, 1, '{"supplier_colour":"silver","appa_colour":"Light Grey","colour_product_code":null,"source_row_number":333}'::jsonb),
    ('Gear For Life', 'OWTM', 'white-2', 'white', null, null, 2, '{"supplier_colour":"white","appa_colour":"White","colour_product_code":null,"source_row_number":333}'::jsonb),
    ('Gear For Life', 'OWTMO', 'white-1', 'white', null, null, 1, '{"supplier_colour":"white","appa_colour":"White","colour_product_code":null,"source_row_number":334}'::jsonb),
    ('Gear For Life', 'OWTMO', 'black-2', 'black', null, null, 2, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":334}'::jsonb),
    ('Gear For Life', 'OWTE', 'navy-1', 'navy', null, null, 1, '{"supplier_colour":"navy","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":335}'::jsonb),
    ('Gear For Life', 'OWTE', 'chilli-2', 'chilli', null, null, 2, '{"supplier_colour":"chilli","appa_colour":"Dark Red","colour_product_code":null,"source_row_number":335}'::jsonb),
    ('Gear For Life', 'OWTE', 'french-blue-3', 'french blue', null, null, 3, '{"supplier_colour":"french blue","appa_colour":"Blue","colour_product_code":null,"source_row_number":335}'::jsonb),
    ('Gear For Life', 'OWTE', 'chocolate-4', 'chocolate', null, null, 4, '{"supplier_colour":"chocolate","appa_colour":"Dark Brown","colour_product_code":null,"source_row_number":335}'::jsonb),
    ('Gear For Life', 'OWTE', 'pumpkin-5', 'pumpkin', null, null, 5, '{"supplier_colour":"pumpkin","appa_colour":"Orange","colour_product_code":null,"source_row_number":335}'::jsonb)
) as v(supplier, supplier_sku, colour_key, colour_name, colour_code, hex, sort_order, raw_json);

with gfl_batch as (
  select id as batch_id
  from public.supplier_import_batches
  where supplier = 'Gear For Life'
    and source_file_hash = 'f20ede9ac24d944fcb4c3c646d8ae2cbc41d2c63580200db27f2e86a96bf739c'
  order by created_at desc
  limit 1
)
insert into public.supplier_raw_colour_options (
  batch_id, supplier, supplier_sku, colour_key, colour_name, colour_code, hex, sort_order, raw_json
)
select
  gfl_batch.batch_id,
  v.supplier::text, v.supplier_sku::text, v.colour_key::text, v.colour_name::text, v.colour_code::text, v.hex::text, v.sort_order::text, v.raw_json::jsonb
from gfl_batch
cross join (
  values
    ('Gear For Life', 'OWLCS', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":336}'::jsonb),
    ('Gear For Life', 'OWSB', 'french-blue-1', 'french blue', null, null, 1, '{"supplier_colour":"french blue","appa_colour":"Blue","colour_product_code":null,"source_row_number":337}'::jsonb),
    ('Gear For Life', 'OWTDN', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":338}'::jsonb),
    ('Gear For Life', 'OWTDN', 'white-2', 'white', null, null, 2, '{"supplier_colour":"white","appa_colour":"White","colour_product_code":null,"source_row_number":338}'::jsonb),
    ('Gear For Life', 'OWTMT', 'black-red-1', 'black/red', null, null, 1, '{"supplier_colour":"black/red","appa_colour":"Black/Red","colour_product_code":null,"source_row_number":339}'::jsonb),
    ('Gear For Life', 'OWTMT', 'silver-black-2', 'silver/black', null, null, 2, '{"supplier_colour":"silver/black","appa_colour":"Light Grey/Black","colour_product_code":null,"source_row_number":339}'::jsonb),
    ('Gear For Life', 'OWTRSS', 'white-1', 'white', null, null, 1, '{"supplier_colour":"white","appa_colour":"White","colour_product_code":null,"source_row_number":340}'::jsonb),
    ('Gear For Life', 'OWTRSS', 'charcoal-2', 'charcoal', null, null, 2, '{"supplier_colour":"charcoal","appa_colour":"Dark Grey","colour_product_code":null,"source_row_number":340}'::jsonb),
    ('Gear For Life', 'OWTRSS', 'navy-3', 'navy', null, null, 3, '{"supplier_colour":"navy","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":340}'::jsonb),
    ('Gear For Life', 'OWTL', 'pistachio-1', 'pistachio', null, null, 1, '{"supplier_colour":"pistachio","appa_colour":"Light Green","colour_product_code":null,"source_row_number":341}'::jsonb),
    ('Gear For Life', 'OWTL', 'chilli-2', 'chilli', null, null, 2, '{"supplier_colour":"chilli","appa_colour":"Dark Red","colour_product_code":null,"source_row_number":341}'::jsonb),
    ('Gear For Life', 'OWTL', 'chocolate-3', 'chocolate', null, null, 3, '{"supplier_colour":"chocolate","appa_colour":"Dark Brown","colour_product_code":null,"source_row_number":341}'::jsonb),
    ('Gear For Life', 'OWTL', 'french-blue-4', 'french blue', null, null, 4, '{"supplier_colour":"french blue","appa_colour":"Blue","colour_product_code":null,"source_row_number":341}'::jsonb),
    ('Gear For Life', 'OWTL', 'navy-5', 'navy', null, null, 5, '{"supplier_colour":"navy","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":341}'::jsonb),
    ('Gear For Life', 'OWTL', 'pumpkin-6', 'pumpkin', null, null, 6, '{"supplier_colour":"pumpkin","appa_colour":"Orange","colour_product_code":null,"source_row_number":341}'::jsonb),
    ('Gear For Life', 'PODCB', 'white-1', 'White', null, null, 1, '{"supplier_colour":"White","appa_colour":"White","colour_product_code":null,"source_row_number":342}'::jsonb),
    ('Gear For Life', 'POOMTT', 'bamboo-1', 'Bamboo', null, null, 1, '{"supplier_colour":"Bamboo","appa_colour":null,"colour_product_code":null,"source_row_number":344}'::jsonb),
    ('Gear For Life', 'POOPB', 'charcoal-1', 'Charcoal', null, null, 1, '{"supplier_colour":"Charcoal","appa_colour":"Dark Grey","colour_product_code":null,"source_row_number":345}'::jsonb),
    ('Gear For Life', 'POPTT', 'black-white-1', 'Black/White', null, null, 1, '{"supplier_colour":"Black/White","appa_colour":"Black/White","colour_product_code":null,"source_row_number":346}'::jsonb),
    ('Gear For Life', 'POE6KS', 'black-1', 'Black', null, null, 1, '{"supplier_colour":"Black","appa_colour":"Black","colour_product_code":null,"source_row_number":348}'::jsonb),
    ('Gear For Life', 'OHJ', 'navy-heather-1', 'navy heather', null, null, 1, '{"supplier_colour":"navy heather","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":351}'::jsonb),
    ('Gear For Life', 'OTNT', 'black-aluminium-1', 'black/aluminium', null, null, 1, '{"supplier_colour":"black/aluminium","appa_colour":"Black/Grey","colour_product_code":null,"source_row_number":352}'::jsonb),
    ('Gear For Life', 'ODGIP', 'apple-navy-1', 'apple/navy', null, null, 1, '{"supplier_colour":"apple/navy","appa_colour":"Light Green/Dark Blue","colour_product_code":null,"source_row_number":353}'::jsonb),
    ('Gear For Life', 'ODGIP', 'black-white-2', 'black/white', null, null, 2, '{"supplier_colour":"black/white","appa_colour":"Black/White","colour_product_code":null,"source_row_number":353}'::jsonb),
    ('Gear For Life', 'OGV', 'black-black-1', 'black/black', null, null, 1, '{"supplier_colour":"black/black","appa_colour":"Black/Black","colour_product_code":null,"source_row_number":354}'::jsonb),
    ('Gear For Life', 'OTYS', 'blue-white-1', 'blue/white', null, null, 1, '{"supplier_colour":"blue/white","appa_colour":"Blue/White","colour_product_code":null,"source_row_number":355}'::jsonb),
    ('Gear For Life', 'OWTYS', 'blue-white-1', 'blue/white', null, null, 1, '{"supplier_colour":"blue/white","appa_colour":"Blue/White","colour_product_code":null,"source_row_number":356}'::jsonb),
    ('Gear For Life', 'OEGMFV', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":357}'::jsonb),
    ('Gear For Life', 'OWEGMFV', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":358}'::jsonb),
    ('Gear For Life', 'OES', 'blue-white-1', 'blue/white', null, null, 1, '{"supplier_colour":"blue/white","appa_colour":"Blue/White","colour_product_code":null,"source_row_number":359}'::jsonb),
    ('Gear For Life', 'OTEL', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":360}'::jsonb),
    ('Gear For Life', 'BHZQM', 'black-1', 'Black', null, null, 1, '{"supplier_colour":"Black","appa_colour":"Black","colour_product_code":null,"source_row_number":361}'::jsonb),
    ('Gear For Life', 'BFCS', 'navy-white-1', 'Navy/White', null, null, 1, '{"supplier_colour":"Navy/White","appa_colour":"Dark Blue/White","colour_product_code":null,"source_row_number":362}'::jsonb),
    ('Gear For Life', 'WBFCS', 'navy-white-1', 'Navy/White', null, null, 1, '{"supplier_colour":"Navy/White","appa_colour":"Dark Blue/White","colour_product_code":null,"source_row_number":363}'::jsonb),
    ('Gear For Life', 'SIGBV', 'black-1', 'Black', null, null, 1, '{"supplier_colour":"Black","appa_colour":"Black","colour_product_code":null,"source_row_number":364}'::jsonb),
    ('Gear For Life', 'SIXTPJ', 'black-grey-check-1', 'Black/Grey Check', null, null, 1, '{"supplier_colour":"Black/Grey Check","appa_colour":"Black/Grey","colour_product_code":null,"source_row_number":365}'::jsonb),
    ('Gear For Life', 'OTMC', 'charcoal-1', 'Charcoal', null, null, 1, '{"supplier_colour":"Charcoal","appa_colour":"Dark Grey","colour_product_code":null,"source_row_number":366}'::jsonb),
    ('Gear For Life', 'POWBC', 'black-1', 'Black', null, null, 1, '{"supplier_colour":"Black","appa_colour":"Black","colour_product_code":null,"source_row_number":369}'::jsonb),
    ('Gear For Life', 'POHWC', 'navy-1', 'Navy', null, null, 1, '{"supplier_colour":"Navy","appa_colour":"Dark blue","colour_product_code":null,"source_row_number":371}'::jsonb),
    ('Gear For Life', 'POATB', 'acacia-wood-1', 'Acacia wood', null, null, 1, '{"supplier_colour":"Acacia wood","appa_colour":null,"colour_product_code":null,"source_row_number":373}'::jsonb),
    ('Gear For Life', 'POWCKB', 'acacia-wood-1', 'Acacia wood', null, null, 1, '{"supplier_colour":"Acacia wood","appa_colour":null,"colour_product_code":null,"source_row_number":374}'::jsonb),
    ('Gear For Life', 'ODGTP', 'black-charcoal-1', 'black/charcoal', null, null, 1, '{"supplier_colour":"black/charcoal","appa_colour":"Black/Dark Grey","colour_product_code":null,"source_row_number":377}'::jsonb),
    ('Gear For Life', 'ODGRFP', 'navy-gold-1', 'navy/gold', null, null, 1, '{"supplier_colour":"navy/gold","appa_colour":"Dark Blue/Yellow","colour_product_code":null,"source_row_number":378}'::jsonb),
    ('Gear For Life', 'ODGRFP', 'navy-sky-2', 'navy/sky', null, null, 2, '{"supplier_colour":"navy/sky","appa_colour":"Dark Blue/Light Blue","colour_product_code":null,"source_row_number":378}'::jsonb),
    ('Gear For Life', 'ODGRFP', 'black-gold-3', 'black/gold', null, null, 3, '{"supplier_colour":"black/gold","appa_colour":"Black/Yellow","colour_product_code":null,"source_row_number":378}'::jsonb),
    ('Gear For Life', 'DGREP', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":379}'::jsonb),
    ('Gear For Life', 'DGREP', 'navy-2', 'navy', null, null, 2, '{"supplier_colour":"navy","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":379}'::jsonb),
    ('Gear For Life', 'WDGREP', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":380}'::jsonb),
    ('Gear For Life', 'WDGREP', 'navy-2', 'navy', null, null, 2, '{"supplier_colour":"navy","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":380}'::jsonb),
    ('Gear For Life', 'SIASJ', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":381}'::jsonb),
    ('Gear For Life', 'SIASJ', 'navy-2', 'navy', null, null, 2, '{"supplier_colour":"navy","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":381}'::jsonb),
    ('Gear For Life', 'BMA', 'light-blue-1', 'light blue', null, null, 1, '{"supplier_colour":"light blue","appa_colour":"Light Blue","colour_product_code":null,"source_row_number":382}'::jsonb),
    ('Gear For Life', 'WBMA', 'light-blue-1', 'light blue', null, null, 1, '{"supplier_colour":"light blue","appa_colour":"Light Blue","colour_product_code":null,"source_row_number":383}'::jsonb),
    ('Gear For Life', 'OWTFL', 'navy-white-1', 'navy/white', null, null, 1, '{"supplier_colour":"navy/white","appa_colour":"Dark Blue/White","colour_product_code":null,"source_row_number":384}'::jsonb),
    ('Gear For Life', 'IGTTF', 'steel-grey-black-1', 'steel grey/black', null, null, 1, '{"supplier_colour":"steel grey/black","appa_colour":"Grey/Black","colour_product_code":null,"source_row_number":385}'::jsonb),
    ('Gear For Life', 'IGWFFJ', 'matt-black-1', 'matt black', null, null, 1, '{"supplier_colour":"matt black","appa_colour":"Black","colour_product_code":null,"source_row_number":386}'::jsonb),
    ('Gear For Life', 'IGHSMB', 'matt-black-1', 'matt black', null, null, 1, '{"supplier_colour":"matt black","appa_colour":"Black","colour_product_code":null,"source_row_number":387}'::jsonb),
    ('Gear For Life', 'IGHHC', 'steel-grey-black-1', 'steel grey/black', null, null, 1, '{"supplier_colour":"steel grey/black","appa_colour":"Grey/Black","colour_product_code":null,"source_row_number":388}'::jsonb),
    ('Gear For Life', 'IGSCFAK', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":389}'::jsonb),
    ('Gear For Life', 'IGVGMT', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":390}'::jsonb),
    ('Gear For Life', 'IGBCPK', 'wood-1', 'wood', null, null, 1, '{"supplier_colour":"wood","appa_colour":null,"colour_product_code":null,"source_row_number":391}'::jsonb),
    ('Gear For Life', 'IGLPT', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":392}'::jsonb),
    ('Gear For Life', 'IGGGBO', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":393}'::jsonb),
    ('Gear For Life', 'BOC', 'tan-black-ivory-1', 'tan/black/ivory', null, null, 1, '{"supplier_colour":"tan/black/ivory","appa_colour":"Brown/black/Cream","colour_product_code":null,"source_row_number":394}'::jsonb),
    ('Gear For Life', 'WBOC', 'tan-black-ivory-1', 'tan/black/ivory', null, null, 1, '{"supplier_colour":"tan/black/ivory","appa_colour":"Brown/black/Cream","colour_product_code":null,"source_row_number":395}'::jsonb),
    ('Gear For Life', 'BBR', 'denim-marl-1', 'denim marl', null, null, 1, '{"supplier_colour":"denim marl","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":396}'::jsonb),
    ('Gear For Life', 'WBBR', 'denim-marl-1', 'denim marl', null, null, 1, '{"supplier_colour":"denim marl","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":397}'::jsonb),
    ('Gear For Life', 'OTAX', 'white-mid-blue-1', 'white/mid blue', null, null, 1, '{"supplier_colour":"white/mid blue","appa_colour":"White/Blue","colour_product_code":null,"source_row_number":398}'::jsonb),
    ('Gear For Life', 'OTTBL', 'blue-white-1', 'blue/white', null, null, 1, '{"supplier_colour":"blue/white","appa_colour":"Blue/White","colour_product_code":null,"source_row_number":399}'::jsonb),
    ('Gear For Life', 'ONV', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":400}'::jsonb),
    ('Gear For Life', 'POKC', 'matt-black-1', 'matt black', null, null, 1, '{"supplier_colour":"matt black","appa_colour":"Black","colour_product_code":null,"source_row_number":401}'::jsonb),
    ('Gear For Life', 'POPIB', 'matt-black-1', 'matt black', null, null, 1, '{"supplier_colour":"matt black","appa_colour":"Black","colour_product_code":null,"source_row_number":402}'::jsonb),
    ('Gear For Life', 'PORRS', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":403}'::jsonb),
    ('Gear For Life', 'POGPS', 'acacia-black-1', 'acacia/black', null, null, 1, '{"supplier_colour":"acacia/black","appa_colour":null,"colour_product_code":null,"source_row_number":404}'::jsonb),
    ('Gear For Life', 'POVCB', 'navy-1', 'Navy', null, null, 1, '{"supplier_colour":"Navy","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":405}'::jsonb),
    ('Gear For Life', 'POVCB', 'green-2', 'Green', null, null, 2, '{"supplier_colour":"Green","appa_colour":"Green","colour_product_code":null,"source_row_number":405}'::jsonb),
    ('Gear For Life', 'POVCB', 'black-3', 'Black', null, null, 3, '{"supplier_colour":"Black","appa_colour":"Black","colour_product_code":null,"source_row_number":405}'::jsonb),
    ('Gear For Life', 'POVCB', 'red-4', 'Red', null, null, 4, '{"supplier_colour":"Red","appa_colour":"Red","colour_product_code":null,"source_row_number":405}'::jsonb),
    ('Gear For Life', 'POVCB', 'white-5', 'White', null, null, 5, '{"supplier_colour":"White","appa_colour":"White","colour_product_code":null,"source_row_number":405}'::jsonb),
    ('Gear For Life', 'POVCB', 'pink-6', 'Pink', null, null, 6, '{"supplier_colour":"Pink","appa_colour":"Pink","colour_product_code":null,"source_row_number":405}'::jsonb)
) as v(supplier, supplier_sku, colour_key, colour_name, colour_code, hex, sort_order, raw_json);

with gfl_batch as (
  select id as batch_id
  from public.supplier_import_batches
  where supplier = 'Gear For Life'
    and source_file_hash = 'f20ede9ac24d944fcb4c3c646d8ae2cbc41d2c63580200db27f2e86a96bf739c'
  order by created_at desc
  limit 1
)
insert into public.supplier_raw_colour_options (
  batch_id, supplier, supplier_sku, colour_key, colour_name, colour_code, hex, sort_order, raw_json
)
select
  gfl_batch.batch_id,
  v.supplier::text, v.supplier_sku::text, v.colour_key::text, v.colour_name::text, v.colour_code::text, v.hex::text, v.sort_order::text, v.raw_json::jsonb
from gfl_batch
cross join (
  values
    ('Gear For Life', 'IGFLT', 'black-1', 'Black', null, null, 1, '{"supplier_colour":"Black","appa_colour":"Black","colour_product_code":null,"source_row_number":406}'::jsonb),
    ('Gear For Life', 'IGOBT', 'black-steel-grey-1', 'black/steel grey', null, null, 1, '{"supplier_colour":"black/steel grey","appa_colour":"Black/Grey","colour_product_code":null,"source_row_number":407}'::jsonb),
    ('Gear For Life', 'IGOISB', 'black-steel-grey-1', 'black/steel grey', null, null, 1, '{"supplier_colour":"black/steel grey","appa_colour":"Black/Grey","colour_product_code":null,"source_row_number":408}'::jsonb),
    ('Gear For Life', 'IGCGB', 'matt-black-1', 'matt black', null, null, 1, '{"supplier_colour":"matt black","appa_colour":"Black","colour_product_code":null,"source_row_number":409}'::jsonb),
    ('Gear For Life', 'IGDVC', 'steel-grey-black-1', 'steel grey/black', null, null, 1, '{"supplier_colour":"steel grey/black","appa_colour":"Grey/Black","colour_product_code":null,"source_row_number":410}'::jsonb),
    ('Gear For Life', 'WTBT', 'steel-navy-1', 'steel navy', null, null, 1, '{"supplier_colour":"steel navy","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":411}'::jsonb),
    ('Gear For Life', 'DGEP', 'white-white-1', 'white/white', null, null, 1, '{"supplier_colour":"white/white","appa_colour":"White/White","colour_product_code":null,"source_row_number":412}'::jsonb),
    ('Gear For Life', 'DGP', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":413}'::jsonb),
    ('Gear For Life', 'DGP', 'white-2', 'white', null, null, 2, '{"supplier_colour":"white","appa_colour":"White","colour_product_code":null,"source_row_number":413}'::jsonb),
    ('Gear For Life', 'DGSP', 'black-charcoal-1', 'black/charcoal', null, null, 1, '{"supplier_colour":"black/charcoal","appa_colour":"Black/Dark Grey","colour_product_code":null,"source_row_number":414}'::jsonb),
    ('Gear For Life', 'DGSP', 'black-gold-2', 'black/gold', null, null, 2, '{"supplier_colour":"black/gold","appa_colour":"Black/Yellow","colour_product_code":null,"source_row_number":414}'::jsonb),
    ('Gear For Life', 'DGSP', 'black-green-3', 'black/green', null, null, 3, '{"supplier_colour":"black/green","appa_colour":"Black/Green","colour_product_code":null,"source_row_number":414}'::jsonb),
    ('Gear For Life', 'DGSP', 'black-red-4', 'black/red', null, null, 4, '{"supplier_colour":"black/red","appa_colour":"Black/Red","colour_product_code":null,"source_row_number":414}'::jsonb),
    ('Gear For Life', 'DGSP', 'black-royal-5', 'black/royal', null, null, 5, '{"supplier_colour":"black/royal","appa_colour":"Black/Blue","colour_product_code":null,"source_row_number":414}'::jsonb),
    ('Gear For Life', 'DGSP', 'black-white-6', 'black/white', null, null, 6, '{"supplier_colour":"black/white","appa_colour":"Black/White","colour_product_code":null,"source_row_number":414}'::jsonb),
    ('Gear For Life', 'DGSP', 'navy-red-7', 'navy/red', null, null, 7, '{"supplier_colour":"navy/red","appa_colour":"Dark Blue/Red","colour_product_code":null,"source_row_number":414}'::jsonb),
    ('Gear For Life', 'DGSP', 'navy-sky-8', 'navy/sky', null, null, 8, '{"supplier_colour":"navy/sky","appa_colour":"Dark Blue/Light Blue","colour_product_code":null,"source_row_number":414}'::jsonb),
    ('Gear For Life', 'DGSP', 'royal-gold-9', 'royal/gold', null, null, 9, '{"supplier_colour":"royal/gold","appa_colour":"Blue/Yellow","colour_product_code":null,"source_row_number":414}'::jsonb),
    ('Gear For Life', 'DGSP', 'royal-white-10', 'royal/white', null, null, 10, '{"supplier_colour":"royal/white","appa_colour":"Blue/White","colour_product_code":null,"source_row_number":414}'::jsonb),
    ('Gear For Life', 'DGSP', 'white-black-11', 'white/black', null, null, 11, '{"supplier_colour":"white/black","appa_colour":"White/Black","colour_product_code":null,"source_row_number":414}'::jsonb),
    ('Gear For Life', 'DGSP(Y)', 'black-charcoal-1', 'black/charcoal', null, null, 1, '{"supplier_colour":"black/charcoal","appa_colour":"Black/Dark Grey","colour_product_code":null,"source_row_number":415}'::jsonb),
    ('Gear For Life', 'DGSP(Y)', 'black-gold-2', 'black/gold', null, null, 2, '{"supplier_colour":"black/gold","appa_colour":"Black/Yellow","colour_product_code":null,"source_row_number":415}'::jsonb),
    ('Gear For Life', 'DGSP(Y)', 'black-green-3', 'black/green', null, null, 3, '{"supplier_colour":"black/green","appa_colour":"Black/Green","colour_product_code":null,"source_row_number":415}'::jsonb),
    ('Gear For Life', 'DGSP(Y)', 'black-red-4', 'black/red', null, null, 4, '{"supplier_colour":"black/red","appa_colour":"Black/Red","colour_product_code":null,"source_row_number":415}'::jsonb),
    ('Gear For Life', 'DGSP(Y)', 'black-royal-5', 'black/royal', null, null, 5, '{"supplier_colour":"black/royal","appa_colour":"Black/Blue","colour_product_code":null,"source_row_number":415}'::jsonb),
    ('Gear For Life', 'DGSP(Y)', 'black-white-6', 'black/white', null, null, 6, '{"supplier_colour":"black/white","appa_colour":"Black/White","colour_product_code":null,"source_row_number":415}'::jsonb),
    ('Gear For Life', 'DGSP(Y)', 'navy-red-7', 'navy/red', null, null, 7, '{"supplier_colour":"navy/red","appa_colour":"Dark Blue/Red","colour_product_code":null,"source_row_number":415}'::jsonb),
    ('Gear For Life', 'DGSP(Y)', 'navy-sky-8', 'navy/sky', null, null, 8, '{"supplier_colour":"navy/sky","appa_colour":"Dark Blue/Light Blue","colour_product_code":null,"source_row_number":415}'::jsonb),
    ('Gear For Life', 'DGSP(Y)', 'royal-gold-9', 'royal/gold', null, null, 9, '{"supplier_colour":"royal/gold","appa_colour":"Blue/Yellow","colour_product_code":null,"source_row_number":415}'::jsonb),
    ('Gear For Life', 'DGSP(Y)', 'royal-white-10', 'royal/white', null, null, 10, '{"supplier_colour":"royal/white","appa_colour":"Blue/White","colour_product_code":null,"source_row_number":415}'::jsonb),
    ('Gear For Life', 'DGSP(Y)', 'white-black-11', 'white/black', null, null, 11, '{"supplier_colour":"white/black","appa_colour":"White/Black","colour_product_code":null,"source_row_number":415}'::jsonb),
    ('Gear For Life', 'DGST', 'black-charcoal-1', 'black/charcoal', null, null, 1, '{"supplier_colour":"black/charcoal","appa_colour":"Black/Dark Grey","colour_product_code":null,"source_row_number":416}'::jsonb),
    ('Gear For Life', 'DGST', 'black-gold-2', 'black/gold', null, null, 2, '{"supplier_colour":"black/gold","appa_colour":"Black/Yellow","colour_product_code":null,"source_row_number":416}'::jsonb),
    ('Gear For Life', 'DGST', 'black-green-3', 'black/green', null, null, 3, '{"supplier_colour":"black/green","appa_colour":"Black/Green","colour_product_code":null,"source_row_number":416}'::jsonb),
    ('Gear For Life', 'DGST', 'black-red-4', 'black/red', null, null, 4, '{"supplier_colour":"black/red","appa_colour":"Black/Red","colour_product_code":null,"source_row_number":416}'::jsonb),
    ('Gear For Life', 'DGST', 'black-white-5', 'black/white', null, null, 5, '{"supplier_colour":"black/white","appa_colour":"Black/White","colour_product_code":null,"source_row_number":416}'::jsonb),
    ('Gear For Life', 'DGST', 'maroon-white-6', 'maroon/white', null, null, 6, '{"supplier_colour":"maroon/white","appa_colour":"Dark Red/White","colour_product_code":null,"source_row_number":416}'::jsonb),
    ('Gear For Life', 'DGST', 'navy-gold-7', 'navy/gold', null, null, 7, '{"supplier_colour":"navy/gold","appa_colour":"Dark Blue/Yellow","colour_product_code":null,"source_row_number":416}'::jsonb),
    ('Gear For Life', 'DGST', 'navy-red-8', 'navy/red', null, null, 8, '{"supplier_colour":"navy/red","appa_colour":"Dark Blue/Red","colour_product_code":null,"source_row_number":416}'::jsonb),
    ('Gear For Life', 'DGST', 'navy-sky-9', 'navy/sky', null, null, 9, '{"supplier_colour":"navy/sky","appa_colour":"Dark Blue/Light Blue","colour_product_code":null,"source_row_number":416}'::jsonb),
    ('Gear For Life', 'DGST', 'navy-white-10', 'navy/white', null, null, 10, '{"supplier_colour":"navy/white","appa_colour":"Dark Blue/White","colour_product_code":null,"source_row_number":416}'::jsonb),
    ('Gear For Life', 'DGST', 'royal-red-11', 'royal/red', null, null, 11, '{"supplier_colour":"royal/red","appa_colour":"Blue/Red","colour_product_code":null,"source_row_number":416}'::jsonb),
    ('Gear For Life', 'DGST', 'royal-gold-12', 'royal/gold', null, null, 12, '{"supplier_colour":"royal/gold","appa_colour":"Blue/Yellow","colour_product_code":null,"source_row_number":416}'::jsonb),
    ('Gear For Life', 'DGST', 'royal-white-13', 'royal/white', null, null, 13, '{"supplier_colour":"royal/white","appa_colour":"Blue/White","colour_product_code":null,"source_row_number":416}'::jsonb),
    ('Gear For Life', 'DGST', 'red-white-14', 'red/white', null, null, 14, '{"supplier_colour":"red/white","appa_colour":"Red/White","colour_product_code":null,"source_row_number":416}'::jsonb),
    ('Gear For Life', 'DGST', 'white-black-15', 'white/black', null, null, 15, '{"supplier_colour":"white/black","appa_colour":"White/Black","colour_product_code":null,"source_row_number":416}'::jsonb),
    ('Gear For Life', 'DGST', 'white-navy-16', 'white/navy', null, null, 16, '{"supplier_colour":"white/navy","appa_colour":"White/Dark Blue","colour_product_code":null,"source_row_number":416}'::jsonb),
    ('Gear For Life', 'DGST(Y)', 'black-charcoal-1', 'black/charcoal', null, null, 1, '{"supplier_colour":"black/charcoal","appa_colour":"Black/Dark Grey","colour_product_code":null,"source_row_number":417}'::jsonb),
    ('Gear For Life', 'DGST(Y)', 'black-gold-2', 'black/gold', null, null, 2, '{"supplier_colour":"black/gold","appa_colour":"Black/Yellow","colour_product_code":null,"source_row_number":417}'::jsonb),
    ('Gear For Life', 'DGST(Y)', 'black-green-3', 'black/green', null, null, 3, '{"supplier_colour":"black/green","appa_colour":"Black/Green","colour_product_code":null,"source_row_number":417}'::jsonb),
    ('Gear For Life', 'DGST(Y)', 'black-red-4', 'black/red', null, null, 4, '{"supplier_colour":"black/red","appa_colour":"Black/Red","colour_product_code":null,"source_row_number":417}'::jsonb),
    ('Gear For Life', 'DGST(Y)', 'black-white-5', 'black/white', null, null, 5, '{"supplier_colour":"black/white","appa_colour":"Black/White","colour_product_code":null,"source_row_number":417}'::jsonb),
    ('Gear For Life', 'DGST(Y)', 'maroon-white-6', 'maroon/white', null, null, 6, '{"supplier_colour":"maroon/white","appa_colour":"Dark Red/White","colour_product_code":null,"source_row_number":417}'::jsonb),
    ('Gear For Life', 'DGST(Y)', 'navy-gold-7', 'navy/gold', null, null, 7, '{"supplier_colour":"navy/gold","appa_colour":"Dark Blue/Yellow","colour_product_code":null,"source_row_number":417}'::jsonb),
    ('Gear For Life', 'DGST(Y)', 'navy-red-8', 'navy/red', null, null, 8, '{"supplier_colour":"navy/red","appa_colour":"Dark Blue/Red","colour_product_code":null,"source_row_number":417}'::jsonb),
    ('Gear For Life', 'DGST(Y)', 'navy-sky-9', 'navy/sky', null, null, 9, '{"supplier_colour":"navy/sky","appa_colour":"Dark Blue/Light Blue","colour_product_code":null,"source_row_number":417}'::jsonb),
    ('Gear For Life', 'DGST(Y)', 'navy-white-10', 'navy/white', null, null, 10, '{"supplier_colour":"navy/white","appa_colour":"Dark Blue/White","colour_product_code":null,"source_row_number":417}'::jsonb),
    ('Gear For Life', 'DGST(Y)', 'royal-red-11', 'royal/red', null, null, 11, '{"supplier_colour":"royal/red","appa_colour":"Blue/Red","colour_product_code":null,"source_row_number":417}'::jsonb),
    ('Gear For Life', 'DGST(Y)', 'royal-gold-12', 'royal/gold', null, null, 12, '{"supplier_colour":"royal/gold","appa_colour":"Blue/Yellow","colour_product_code":null,"source_row_number":417}'::jsonb),
    ('Gear For Life', 'DGST(Y)', 'royal-white-13', 'royal/white', null, null, 13, '{"supplier_colour":"royal/white","appa_colour":"Blue/White","colour_product_code":null,"source_row_number":417}'::jsonb),
    ('Gear For Life', 'DGST(Y)', 'red-white-14', 'red/white', null, null, 14, '{"supplier_colour":"red/white","appa_colour":"Red/White","colour_product_code":null,"source_row_number":417}'::jsonb),
    ('Gear For Life', 'DGST(Y)', 'white-black-15', 'white/black', null, null, 15, '{"supplier_colour":"white/black","appa_colour":"White/Black","colour_product_code":null,"source_row_number":417}'::jsonb),
    ('Gear For Life', 'DGST(Y)', 'white-navy-16', 'white/navy', null, null, 16, '{"supplier_colour":"white/navy","appa_colour":"White/Dark Blue","colour_product_code":null,"source_row_number":417}'::jsonb),
    ('Gear For Life', 'WLV', 'black-black-1', 'black/black', null, null, 1, '{"supplier_colour":"black/black","appa_colour":"Black/Black","colour_product_code":null,"source_row_number":418}'::jsonb),
    ('Gear For Life', 'TMT', 'black-white-1', 'black/white', null, null, 1, '{"supplier_colour":"black/white","appa_colour":"Black/White","colour_product_code":null,"source_row_number":419}'::jsonb),
    ('Gear For Life', 'TMT', 'ocean-navy-2', 'ocean/navy', null, null, 2, '{"supplier_colour":"ocean/navy","appa_colour":"Blue/Dark Blue","colour_product_code":null,"source_row_number":419}'::jsonb),
    ('Gear For Life', 'TE', 'black-1', 'black', null, null, 1, '{"supplier_colour":"black","appa_colour":"Black","colour_product_code":null,"source_row_number":420}'::jsonb),
    ('Gear For Life', 'EGAB', 'black-charcoal-1', 'black/charcoal', null, null, 1, '{"supplier_colour":"black/charcoal","appa_colour":"Black/Dark Grey","colour_product_code":null,"source_row_number":421}'::jsonb),
    ('Gear For Life', 'OTSC', 'navy-white-1', 'navy/white', null, null, 1, '{"supplier_colour":"navy/white","appa_colour":"Dark Blue/White","colour_product_code":null,"source_row_number":422}'::jsonb),
    ('Gear For Life', 'OTMT', 'navy-white-1', 'navy/white', null, null, 1, '{"supplier_colour":"navy/white","appa_colour":"Dark Blue/White","colour_product_code":null,"source_row_number":423}'::jsonb),
    ('Gear For Life', 'OGJ', 'charcoal-black-1', 'charcoal/black', null, null, 1, '{"supplier_colour":"charcoal/black","appa_colour":"Dark Grey/Black","colour_product_code":null,"source_row_number":424}'::jsonb),
    ('Gear For Life', 'OWLV', 'silver-black-1', 'silver/black', null, null, 1, '{"supplier_colour":"silver/black","appa_colour":"Light Grey/Black","colour_product_code":null,"source_row_number":425}'::jsonb),
    ('Gear For Life', 'OWLV', 'navy-navy-2', 'navy/navy', null, null, 2, '{"supplier_colour":"navy/navy","appa_colour":"Dark Blue/Dark Blue","colour_product_code":null,"source_row_number":425}'::jsonb),
    ('Gear For Life', 'OVT', 'black-aluminium-1', 'black/aluminium', null, null, 1, '{"supplier_colour":"black/aluminium","appa_colour":"Black/Grey","colour_product_code":null,"source_row_number":426}'::jsonb),
    ('Gear For Life', 'ODGP', 'navy-1', 'navy', null, null, 1, '{"supplier_colour":"navy","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":427}'::jsonb),
    ('Gear For Life', 'ODGEP', 'navy-white-1', 'navy/white', null, null, 1, '{"supplier_colour":"navy/white","appa_colour":"Dark Blue/White","colour_product_code":null,"source_row_number":428}'::jsonb),
    ('Gear For Life', 'ODGSP', 'royal-red-1', 'royal/red', null, null, 1, '{"supplier_colour":"royal/red","appa_colour":"Blue/Red","colour_product_code":null,"source_row_number":429}'::jsonb),
    ('Gear For Life', 'ODGSP', 'black-maroon-2', 'black/maroon', null, null, 2, '{"supplier_colour":"black/maroon","appa_colour":"Black/Dark Red","colour_product_code":null,"source_row_number":429}'::jsonb),
    ('Gear For Life', 'ODGSP', 'navy-gold-3', 'navy/gold', null, null, 3, '{"supplier_colour":"navy/gold","appa_colour":"Dark Blue/Yellow","colour_product_code":null,"source_row_number":429}'::jsonb),
    ('Gear For Life', 'ODGSP', 'red-white-4', 'red/white', null, null, 4, '{"supplier_colour":"red/white","appa_colour":"Red/White","colour_product_code":null,"source_row_number":429}'::jsonb)
) as v(supplier, supplier_sku, colour_key, colour_name, colour_code, hex, sort_order, raw_json);

with gfl_batch as (
  select id as batch_id
  from public.supplier_import_batches
  where supplier = 'Gear For Life'
    and source_file_hash = 'f20ede9ac24d944fcb4c3c646d8ae2cbc41d2c63580200db27f2e86a96bf739c'
  order by created_at desc
  limit 1
)
insert into public.supplier_raw_colour_options (
  batch_id, supplier, supplier_sku, colour_key, colour_name, colour_code, hex, sort_order, raw_json
)
select
  gfl_batch.batch_id,
  v.supplier::text, v.supplier_sku::text, v.colour_key::text, v.colour_name::text, v.colour_code::text, v.hex::text, v.sort_order::text, v.raw_json::jsonb
from gfl_batch
cross join (
  values
    ('Gear For Life', 'ODGSP', 'maroon-white-5', 'maroon/white', null, null, 5, '{"supplier_colour":"maroon/white","appa_colour":"Dark Red/White","colour_product_code":null,"source_row_number":429}'::jsonb),
    ('Gear For Life', 'ODGSP', 'white-navy-6', 'white/navy', null, null, 6, '{"supplier_colour":"white/navy","appa_colour":"White/Dark Blue","colour_product_code":null,"source_row_number":429}'::jsonb),
    ('Gear For Life', 'ODGSP', 'navy-white-7', 'navy/white', null, null, 7, '{"supplier_colour":"navy/white","appa_colour":"Dark Blue/White","colour_product_code":null,"source_row_number":429}'::jsonb),
    ('Gear For Life', 'ODGST', 'black-maroon-1', 'black/maroon', null, null, 1, '{"supplier_colour":"black/maroon","appa_colour":"Black/Dark Red","colour_product_code":null,"source_row_number":430}'::jsonb),
    ('Gear For Life', 'ODGST', 'black-royal-2', 'black/royal', null, null, 2, '{"supplier_colour":"black/royal","appa_colour":"Black/Blue","colour_product_code":null,"source_row_number":430}'::jsonb),
    ('Gear For Life', 'BOTH', 'black-1', 'Black', null, null, 1, '{"supplier_colour":"Black","appa_colour":"Black","colour_product_code":null,"source_row_number":431}'::jsonb),
    ('Gear For Life', 'BVTB', 'black-1', 'Black', null, null, 1, '{"supplier_colour":"Black","appa_colour":"Black","colour_product_code":null,"source_row_number":432}'::jsonb),
    ('Gear For Life', 'BHPD', 'black-1', 'Black', null, null, 1, '{"supplier_colour":"Black","appa_colour":"Black","colour_product_code":null,"source_row_number":433}'::jsonb),
    ('Gear For Life', 'BMLB', 'navy-1', 'Navy', null, null, 1, '{"supplier_colour":"Navy","appa_colour":"Dark Blue","colour_product_code":null,"source_row_number":434}'::jsonb),
    ('Gear For Life', 'BCWJ', 'black-1', 'Black', null, null, 1, '{"supplier_colour":"Black","appa_colour":"Black","colour_product_code":null,"source_row_number":435}'::jsonb),
    ('Gear For Life', 'BEP', 'black-grey-storm-navy-olive-1', 'black, grey storm, navy, olive', null, null, 1, '{"supplier_colour":"black, grey storm, navy, olive","appa_colour":"Black","colour_product_code":null,"source_row_number":436}'::jsonb),
    ('Gear For Life', 'WBEP', 'black-grey-storm-navy-olive-1', 'black, grey storm, navy, olive', null, null, 1, '{"supplier_colour":"black, grey storm, navy, olive","appa_colour":"Black","colour_product_code":null,"source_row_number":437}'::jsonb)
) as v(supplier, supplier_sku, colour_key, colour_name, colour_code, hex, sort_order, raw_json);

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

  if (select count(*) from public.supplier_raw_colour_options where batch_id = gfl_batch_id) <> 892 then
    raise exception 'part 08 expected 892 rows in public.supplier_raw_colour_options after insert.';
  end if;
end $$;

commit;

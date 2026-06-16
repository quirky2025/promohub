-- Gear For Life raw load SQL Editor split part 01
-- initial duplicate guard, batch row, and GFL commercial defaults
-- Run manually in Supabase SQL Editor, in numeric order only.
-- Stop immediately on any error and do not run later parts.

begin;

do $$
begin
  if exists (select 1 from public.supplier_import_batches where supplier = 'Gear For Life')
     or exists (select 1 from public.supplier_raw_product_rows where supplier = 'Gear For Life')
     or exists (select 1 from public.supplier_raw_colour_options where supplier = 'Gear For Life')
     or exists (select 1 from public.supplier_raw_images where supplier = 'Gear For Life')
     or exists (select 1 from public.supplier_price_rows where supplier = 'Gear For Life')
     or exists (select 1 from public.supplier_decoration_options where supplier = 'Gear For Life')
     or exists (select 1 from public.supplier_decoration_price_rows where supplier = 'Gear For Life')
     or exists (select 1 from public.supplier_decoration_rate_cards where supplier = 'Gear For Life')
     or exists (select 1 from public.supplier_decoration_rate_card_rows where supplier = 'Gear For Life')
     or exists (select 1 from public.supplier_commercial_defaults where supplier = 'Gear For Life')
  then
    raise exception 'Gear For Life staging rows already exist. Stop: do not run this load twice.';
  end if;
end $$;

insert into public.supplier_import_batches (
  supplier,
  source_file_name,
  source_file_hash,
  source_row_count,
  unique_sku_count,
  import_status,
  notes
) values (
  'Gear For Life',
  'The Source - 1st June 2026 APPA Data file - for Customers.csv',
  'f20ede9ac24d944fcb4c3c646d8ae2cbc41d2c63580200db27f2e86a96bf739c',
  472,
  470,
  'loaded_raw',
  'Generated from GFL raw product CSV plus The Source Branding Price List - Combined.xlsx previews. Supplier-specific defaults only.'
);

insert into public.supplier_commercial_defaults (
  supplier,
  fulfillment,
  lead_time_min_days,
  lead_time_max_days,
  lead_time_unit,
  lead_time_basis,
  lead_time_note,
  source_note,
  raw_json
) values (
  'Gear For Life',
  'local_stock',
  10,
  12,
  'business_days',
  'decorated',
  '10-12 business days after artwork approval',
  '10-12 business days after artwork approval',
  '{"source":"supplier confirmed","product_csv_sha256":"3313c751736f5f3d4284416e92bdb54a09e9c8abf75d3824f1c4d9102169fcdd","supplier_specific":true}'::jsonb
);

commit;

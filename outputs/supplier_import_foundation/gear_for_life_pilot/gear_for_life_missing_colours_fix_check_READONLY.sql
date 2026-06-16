-- ON HOLD - companion to the name-only insert, which is superseded by the
-- combined name+images step (run after Cloudinary upload). Kept for reference.
-- Gear For Life: check colours after the missing-colours fix.
-- READ ONLY. Run after gear_for_life_missing_colours_fix_INSERT_DRAFT.sql.

with
params as (
  select 'Gear For Life'::text as target_supplier
),
expected(supplier_sku, colour_name) as (
  values
  ('BBPTS', 'Natural'),
  ('BBQS', 'Natural'),
  ('BBYCHS', 'Natural'),
  ('BBYCQS', 'Natural'),
  ('POAFS', 'Natural'),
  ('POAGC', 'Clear'),
  ('POBCGS', 'Clear'),
  ('POBCK', 'Natural'),
  ('POBCS', 'Natural'),
  ('POBWD', 'Clear'),
  ('POCBGS', 'Clear'),
  ('POCS', 'Natural'),
  ('PODCPB', 'Natural'),
  ('PODCS', 'Silver'),
  ('POEPS', 'Natural'),
  ('POFCKS', 'Silver'),
  ('POGGS', 'Clear'),
  ('POHWGS', 'Clear'),
  ('POIWDS', 'Clear'),
  ('POMGS', 'Natural'),
  ('PONS', 'Silver'),
  ('PORHBT', 'Silver'),
  ('POSCF', 'Clear'),
  ('POSK', 'Natural'),
  ('POSWTS', 'Clear'),
  ('POTF2S', 'Clear'),
  ('POTFI', 'Clear'),
  ('POTSL', 'White')
),
gfl_products as (
  select id, supplier_sku, name
  from public.products
  where supplier = (select target_supplier from params)
),
colour_counts as (
  select p.id, p.supplier_sku,
         count(pc.id)::int as colour_count
  from gfl_products p
  left join public.product_colours pc on pc.product_id = p.id
  group by p.id, p.supplier_sku
),
target_now as (
  select e.supplier_sku, e.colour_name as expected_colour,
         cc.colour_count,
         pc.name as actual_colour, pc.hex as actual_hex
  from expected e
  join gfl_products p on p.supplier_sku = e.supplier_sku
  join colour_counts cc on cc.id = p.id
  left join public.product_colours pc on pc.product_id = p.id
),
mismatches as (
  select * from target_now
  where colour_count <> 1
     or actual_colour is distinct from expected_colour
),
checks as (
  select 'expected_target_products' as check_name,
         (select count(*) from expected)::int as actual_value,
         28::int as expected_value, '{}'::jsonb as details
  union all select 'products_with_exactly_one_colour',
         (select count(*) from target_now where colour_count = 1)::int, 28,
         '{}'::jsonb
  union all select 'colour_name_mismatches',
         (select count(*) from mismatches)::int, 0,
         coalesce((select jsonb_agg(to_jsonb(mismatches) order by supplier_sku) from mismatches), '[]'::jsonb)
  union all select 'gfl_products_still_missing_colours',
         (select count(*) from colour_counts where colour_count = 0)::int, 0,
         coalesce((select jsonb_agg(jsonb_build_object('supplier_sku', supplier_sku) order by supplier_sku)
                   from colour_counts where colour_count = 0), '[]'::jsonb)
)
select
  check_name,
  case when actual_value = expected_value then 'ok' else 'issue' end as status,
  actual_value,
  expected_value,
  details
from checks
order by case when actual_value = expected_value then 2 else 1 end, check_name;

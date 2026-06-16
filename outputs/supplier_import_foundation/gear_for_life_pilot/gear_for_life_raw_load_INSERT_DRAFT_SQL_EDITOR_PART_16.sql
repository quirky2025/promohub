-- Gear For Life raw load SQL Editor split part 16
-- insert 2 rows into public.supplier_decoration_rate_cards; expected count 0 -> 2
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

  if (select count(*) from public.supplier_decoration_rate_cards where batch_id = gfl_batch_id) <> 0 then
    raise exception 'part 16 expected 0 existing rows in public.supplier_decoration_rate_cards. Stop: run parts in order and do not rerun completed parts.';
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
insert into public.supplier_decoration_rate_cards (
  batch_id, supplier, rate_card_key, decoration_method, applies_to, applies_to_category, applies_to_subcategory, is_default_for_scope, fallback_policy, pricing_model, frontend_pricing_model, supplier_formula_base_stitches, supplier_formula_stitch_increment, supplier_formula_increment_unit_cost, supplier_formula_note, setup_cost, repeat_setup_cost, surcharge_cost, surcharge_label, notes, raw_json
)
select
  gfl_batch.batch_id,
  v.supplier::text, v.rate_card_key::text, v.decoration_method::text, v.applies_to::text, v.applies_to_category::text, v.applies_to_subcategory::text, v.is_default_for_scope::boolean, v.fallback_policy::text, v.pricing_model::text, v.frontend_pricing_model::text, v.supplier_formula_base_stitches::int, v.supplier_formula_stitch_increment::int, v.supplier_formula_increment_unit_cost::numeric, v.supplier_formula_note::text, v.setup_cost::numeric, v.repeat_setup_cost::numeric, v.surcharge_cost::numeric, v.surcharge_label::text, v.notes::text, v.raw_json::jsonb
from gfl_batch
cross join (
  values
    ('Gear For Life', 'transfer_printing_bags', 'Transfer Printing', 'Bags', 'Bags', null, true, 'when_no_product_specific_option', 'size_qty_matrix', 'source_rate_card', null, null, null, null, 55.00, null, null, null, 'Transfer Printing - Bags (Full Colour Transfer, priced by size). Default for bag products when no product-specific decoration method is supplied.', '{"supplier":"Gear For Life","rate_card_key":"transfer_printing_bags","decoration_method":"Transfer Printing","applies_to":"Bags","applies_to_category":"Bags","applies_to_subcategory":"","is_default_for_scope":"true","fallback_policy":"when_no_product_specific_option","pricing_model":"size_qty_matrix","frontend_pricing_model":"source_rate_card","supplier_formula_base_stitches":"","supplier_formula_stitch_increment":"","supplier_formula_increment_unit_cost":"","supplier_formula_note":"","setup_cost":"55.00","repeat_setup_cost":"","surcharge_cost":"","surcharge_label":"","notes":"Transfer Printing - Bags (Full Colour Transfer, priced by size). Default for bag products when no product-specific decoration method is supplied."}'::jsonb),
    ('Gear For Life', 'embroidery_apparel_selected_bags', 'Embroidery', 'Apparel and selected bags', null, null, false, 'manual_review', 'stitch_count_qty', 'supplier_embroidery_formula', 5000, 1000, 0.50, 'Gear For Life embroidery rule only: start from 5,000 stitches; each additional 1,000 stitches adds $0.50 per unit. Supplier matrix retained for audit.', 75.00, null, 1.90, 'Some items +$1.90/unit', 'Embroidery by stitch count and quantity. Logo setup $75/logo.', '{"supplier":"Gear For Life","rate_card_key":"embroidery_apparel_selected_bags","decoration_method":"Embroidery","applies_to":"Apparel and selected bags","applies_to_category":"","applies_to_subcategory":"","is_default_for_scope":"false","fallback_policy":"manual_review","pricing_model":"stitch_count_qty","frontend_pricing_model":"supplier_embroidery_formula","supplier_formula_base_stitches":"5000","supplier_formula_stitch_increment":"1000","supplier_formula_increment_unit_cost":"0.50","supplier_formula_note":"Gear For Life embroidery rule only: start from 5,000 stitches; each additional 1,000 stitches adds $0.50 per unit. Supplier matrix retained for audit.","setup_cost":"75.00","repeat_setup_cost":"","surcharge_cost":"1.90","surcharge_label":"Some items +$1.90/unit","notes":"Embroidery by stitch count and quantity. Logo setup $75/logo."}'::jsonb)
) as v(supplier, rate_card_key, decoration_method, applies_to, applies_to_category, applies_to_subcategory, is_default_for_scope, fallback_policy, pricing_model, frontend_pricing_model, supplier_formula_base_stitches, supplier_formula_stitch_increment, supplier_formula_increment_unit_cost, supplier_formula_note, setup_cost, repeat_setup_cost, surcharge_cost, surcharge_label, notes, raw_json);

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

  if (select count(*) from public.supplier_decoration_rate_cards where batch_id = gfl_batch_id) <> 2 then
    raise exception 'part 16 expected 2 rows in public.supplier_decoration_rate_cards after insert.';
  end if;
end $$;

commit;

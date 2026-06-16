-- ============================================================================
-- ON HOLD - DO NOT RUN (decision 2026-06-15).
-- Colours will be inserted TOGETHER WITH images once the GFL product images are
-- uploaded to Cloudinary and real image URLs exist. This name-only insert is
-- superseded by that combined step. Kept for reference only.
-- ============================================================================
-- Gear For Life: ADD missing product_colours (one per product) -- DRAFT, WRITE OPERATION.
-- Generated from: gear for life assigned_colour_name.csv
-- Purpose: give each of the 28 GFL draft products that had NO product_colours rows
--          a single reviewed colour name (Natural / Clear / Silver / White).
--          hex is intentionally left NULL (use the product's own colour, no swatch hex).
--
-- SAFETY:
--   * Scoped to supplier = 'Gear For Life'.
--   * Idempotent: only inserts where the product currently has ZERO product_colours rows,
--     so re-running will not create duplicates.
--   * One statement, INSERT ... SELECT only. No UPDATE / DELETE / DDL.
--
-- Run inside a transaction so you can BEGIN; ...; verify; COMMIT/ROLLBACK.

insert into public.product_colours (
  product_id,
  name,
  hex,
  sort_order
)
select
  p.id,
  v.colour_name,
  null::text as hex,
  1 as sort_order
from (values
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
) as v(supplier_sku, colour_name)
join public.products p
  on p.supplier_sku = v.supplier_sku
 and p.supplier = 'Gear For Life'
where not exists (
  select 1
  from public.product_colours pc
  where pc.product_id = p.id
);

-- Re-sync the 3 sample products with the FIXED data (decoration_model=null, features, specs, indent_sea).
-- Run this whole block, THEN re-run the 3 decoration segments from intex_decoration_options.sql.

-- ── STEP 0: remove the old sample rows (children first, no FK-cascade assumption) ──
delete from pricing_tiers      where product_id in (select id from products where supplier ilike 'intexglobal%' and supplier_sku in ('PS2012','5001','ASSN01'));
delete from product_colours    where product_id in (select id from products where supplier ilike 'intexglobal%' and supplier_sku in ('PS2012','5001','ASSN01'));
delete from decoration_options where product_id in (select id from products where supplier ilike 'intexglobal%' and supplier_sku in ('PS2012','5001','ASSN01'));
delete from products           where supplier ilike 'intexglobal%' and supplier_sku in ('PS2012','5001','ASSN01');

-- ── STEP 1: make sure the setup_fee column exists (idempotent) ──
alter table decoration_options add column if not exists setup_fee numeric;

-- ── STEP 2: now run intex_import_SAMPLE.sql (products + pricing_tiers + product_colours) ──
-- ── STEP 3: then run the -- PS2012 / -- 5001 / -- ASSN01 segments from intex_decoration_options.sql ──

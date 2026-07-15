-- Remove "Production Sample / Pre-Production Sample per Artwork" one-off fees from the
-- per-unit BRANDING & DECORATION calculator. These are NOT decoration methods — they are a
-- pre-order sampling step (covered by the Sample Policy tab / quote). Stored as per_unit
-- they get x order-qty on the calculator (e.g. $85 -> $119 sell x 250 = overcharge).
-- All 332 matching options contain the word "Sample" in d.name, so one predicate is exact & safe.

-- ── STEP 1: PREVIEW — exactly what will be removed (expect 332 rows; ~24 have per_unit>0) ──
select p.supplier, p.supplier_sku, p.name as product, d.name as option, d.per_unit
from decoration_options d
join products p on p.id = d.product_id
where lower(d.name) like '%sample%'
order by d.per_unit desc, p.supplier_sku;

-- ── STEP 2: BACKUP (run once; drop first if it already exists) ──
create table decoration_options_bak_samples_0710 as
select d.* from decoration_options d
where lower(d.name) like '%sample%';

-- ── STEP 3: DELETE ──
delete from decoration_options d
where lower(d.name) like '%sample%';

-- ── VERIFY (should return 0) ──
select count(*) as remaining_sample_options
from decoration_options d
where lower(d.name) like '%sample%';

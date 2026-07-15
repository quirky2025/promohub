-- Per-decoration setup fee (used by Intex: Metal Badge $100, PU Badge $80).
-- NULL => frontend falls back to the flat SETUP_FEE ($60). Existing rows unaffected.
alter table decoration_options add column if not exists setup_fee numeric;

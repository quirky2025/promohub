-- Add a product code/number to factory quotes (e.g. JH21001).
-- Run in Supabase SQL editor.
alter table public.factory_quotes
  add column if not exists product_code text;

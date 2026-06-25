-- Add product code/number (e.g. JH21001) and available colours to factory quotes.
-- Run in Supabase SQL editor.
alter table public.factory_quotes
  add column if not exists product_code text,
  add column if not exists available_colours text;

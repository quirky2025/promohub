-- Some orders (e.g. INDENT / China items with no print) need NO artwork at all.
-- This flag lets the production gate skip the artwork requirement and hides the
-- artwork steps for that order. Default true = normal (artwork required).
alter table public.orders
  add column if not exists artwork_required boolean default true;

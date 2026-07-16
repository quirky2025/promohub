-- Track what the customer actually paid, so when a line's final spec changes the
-- price we can compute the difference (credit due to them, or balance they owe).
-- Captured automatically the first time a paid order's line is revised.
alter table public.orders
  add column if not exists amount_paid numeric;

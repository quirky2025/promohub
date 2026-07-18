-- Customer's REQUIRED-BY date (hard deadline) on the order, shown prominently
-- next to the estimated dispatch date. If estimated dispatch is later than the
-- required date, the order is at risk of being late.
alter table public.orders
  add column if not exists required_date date;

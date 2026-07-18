-- Estimated dispatch / delivery date on the order (esp. China/INDENT orders,
-- factory gives a lead time). Shown at the top of the order; turns amber as it
-- approaches and red when overdue (until dispatched/delivered).
alter table public.orders
  add column if not exists estimated_dispatch_date date;

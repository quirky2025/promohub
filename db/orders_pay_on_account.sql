-- Monthly-account customers (e.g. Parcelle) can go into production before paying.
-- When true, the production gate no longer requires "Payment received".
alter table public.orders
  add column if not exists pay_on_account boolean default false;

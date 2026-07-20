-- Tag orders as local vs indent (China-sourced), so the /admin/orders board can
-- badge them and the procurement (factory PO / RMB payment) side links up.
alter table public.orders
  add column if not exists order_type      text default 'local',   -- 'local' | 'indent'
  add column if not exists sourcing_quote_ref text;                -- the Q… quote it came from

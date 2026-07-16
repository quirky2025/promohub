-- Make sure the order lifecycle columns exist (per-product artwork approval +
-- production gate write to these). Idempotent — safe if they already exist.
alter table public.orders
  add column if not exists artwork_status         text,
  add column if not exists artwork_approved_at    timestamptz,
  add column if not exists production_started_at   timestamptz,
  add column if not exists dispatched_at           timestamptz;

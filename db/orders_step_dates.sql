-- Timestamps for every order step so the timeline shows a date at each stage.
-- artwork_approved_at / production_started_at / dispatched_at already exist
-- (orders_artwork_columns.sql). Add the two that were missing.
alter table public.orders
  add column if not exists artwork_sent_at timestamptz,
  add column if not exists delivered_at    timestamptz;

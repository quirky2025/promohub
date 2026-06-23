-- Dispatch / Delivered / Feedback timestamps on orders. Run in Supabase. Idempotent.
alter table orders add column if not exists dispatched_at         timestamptz;
alter table orders add column if not exists delivered_at          timestamptz;
alter table orders add column if not exists feedback_requested_at timestamptz;

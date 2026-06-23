-- INVOICE / PAYMENTS schema (deposit + balance, Job Name)
-- Run in Supabase SQL editor. Safe to re-run (idempotent).

-- 1) Job Name on each order/project (default "customer + product", editable)
alter table orders add column if not exists job_name text;

-- 2) Convenience payment fields on orders (maintained by the app)
alter table orders add column if not exists amount_paid    numeric(12,2) default 0;
alter table orders add column if not exists payment_state  text default 'awaiting';  -- awaiting | deposit | paid
alter table orders add column if not exists paid_in_full_at timestamptz;

-- 3) Payments ledger — one row per payment (deposit, balance, etc.)
create table if not exists order_payments (
  id           uuid primary key default gen_random_uuid(),
  order_id     uuid references orders(id) on delete cascade,
  order_number text,
  amount       numeric(12,2) not null,
  method       text,                 -- eft | card | cash | other
  paid_at      timestamptz default now(),
  note         text,
  recorded_by  text,
  created_at   timestamptz default now()
);
create index if not exists idx_order_payments_order on order_payments(order_id);

-- 4) Keep orders.amount_paid / payment_state / paid_in_full_at in sync with the ledger.
--    (Trigger so the totals are always correct even if a payment is added/removed.)
create or replace function recompute_order_payment()
returns trigger language plpgsql as $$
declare
  oid uuid := coalesce(new.order_id, old.order_id);
  paid numeric(12,2);
  gross numeric(12,2);
begin
  select coalesce(sum(amount),0) into paid from order_payments where order_id = oid;
  select coalesce(nullif(total_gross, 0), total, 0) into gross from orders where id = oid;
  update orders set
    amount_paid = paid,
    payment_state = case
      when paid <= 0 then 'awaiting'
      when gross > 0 and paid >= gross then 'paid'
      else 'deposit' end,
    paid_in_full_at = case when gross > 0 and paid >= gross then now() else null end
  where id = oid;
  return null;
end $$;

drop trigger if exists trg_recompute_order_payment on order_payments;
create trigger trg_recompute_order_payment
  after insert or update or delete on order_payments
  for each row execute function recompute_order_payment();

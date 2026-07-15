-- ============================================================
-- QuirkyPromo — multi-shipment / split-delivery support
-- One ORDER can now have MANY shipments (batches), each with its own
-- carrier, tracking number, delivery address, ship date and contents.
-- This is what Ian's Kintsugi order (INV-260707) needs:
--   parcels going to 2+ addresses, shipped across several days.
-- CREATE / ALTER ONLY. Idempotent — safe to run more than once.
-- Run in Supabase SQL editor.
-- ============================================================

create extension if not exists pgcrypto;

create table if not exists public.order_shipments (
  id              uuid primary key default gen_random_uuid(),
  order_id        uuid not null references public.orders(id) on delete cascade,
  seq             integer,                 -- batch number shown in UI (1, 2, 3…)
  carrier         text,                    -- 'FedEx' | 'Australia Post' | 'StarTrack' | 'Direct Freight Express' | 'Courier'
  tracking_number text,
  tracking_url    text,
  ship_date       date,
  recipient_name  text,                    -- who receives THIS parcel
  recipient_email text,                    -- email for THIS parcel's recipient (tracking goes here; falls back to the order's buyer email)
  address         text,                    -- delivery address for THIS parcel (free text)
  contents        text,                    -- what's inside, e.g. 'Badges ×4, Shirts ×2'
  status          text not null default 'pending'
                    check (status in ('pending', 'shipped', 'delivered')),
  notified_at     timestamptz,             -- when the customer was emailed about this parcel
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- idempotent: add recipient_email if the table was created before this column existed
alter table public.order_shipments add column if not exists recipient_email text;

create index if not exists order_shipments_order_id_idx on public.order_shipments(order_id);
create index if not exists order_shipments_status_idx   on public.order_shipments(status);

-- keep updated_at fresh (reuses the touch_updated_at() fn from order_to_dispatch schema)
do $$
begin
  if exists (select 1 from pg_proc where proname = 'touch_updated_at') then
    drop trigger if exists order_shipments_touch_updated_at on public.order_shipments;
    create trigger order_shipments_touch_updated_at
      before update on public.order_shipments
      for each row execute function public.touch_updated_at();
  end if;
end $$;

-- RLS: admin writes go through service-role server routes (which bypass RLS).
-- Authenticated customers may READ shipments belonging to their own orders.
alter table public.order_shipments enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'order_shipments'
      and policyname = 'customers can read own shipments'
  ) then
    create policy "customers can read own shipments"
      on public.order_shipments
      for select
      to authenticated
      using (
        exists (
          select 1 from public.orders o
          where o.id = order_shipments.order_id
            and lower(coalesce(o.customer_email, '')) =
                lower(coalesce(auth.jwt() ->> 'email', ''))
        )
      );
  end if;
end $$;

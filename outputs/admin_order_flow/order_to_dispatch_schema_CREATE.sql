-- QuirkyPromo order-to-dispatch schema
-- CREATE / ALTER ONLY. Review first, then run manually in Supabase.
-- This evolves the existing orders table without changing legacy columns that
-- the current storefront still uses.

create extension if not exists pgcrypto;

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  email text,
  name text,
  company text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists customers_email_key
  on public.customers (lower(email))
  where email is not null and email <> '';

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text,
  customer_id uuid references public.customers(id) on delete set null,
  customer_name text,
  customer_email text,
  customer_phone text,
  customer_company text,
  po_number text,
  status text not null default 'quote',
  payment_terms text not null default 'prepaid',
  payment_status text not null default 'unpaid',
  supplier text,
  delivery_address_json jsonb not null default '{}'::jsonb,
  ship_date date,
  tracking_number text,
  total_net numeric(12,2) not null default 0,
  gst_total numeric(12,2) not null default 0,
  total_gross numeric(12,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.orders add column if not exists order_number text;
alter table public.orders add column if not exists customer_id uuid references public.customers(id) on delete set null;
alter table public.orders add column if not exists customer_name text;
alter table public.orders add column if not exists customer_email text;
alter table public.orders add column if not exists customer_phone text;
alter table public.orders add column if not exists customer_company text;
alter table public.orders add column if not exists po_number text;
alter table public.orders add column if not exists payment_terms text not null default 'prepaid';
alter table public.orders add column if not exists supplier text;
alter table public.orders add column if not exists delivery_address_json jsonb not null default '{}'::jsonb;
alter table public.orders add column if not exists ship_date date;
alter table public.orders add column if not exists tracking_number text;
alter table public.orders add column if not exists tracking_url text;
alter table public.orders add column if not exists internal_notes text;
alter table public.orders add column if not exists total_net numeric(12,2) not null default 0;
alter table public.orders add column if not exists gst_total numeric(12,2) not null default 0;
alter table public.orders add column if not exists total_gross numeric(12,2) not null default 0;
alter table public.orders add column if not exists updated_at timestamptz not null default now();

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'orders'
      and column_name = 'invoice_number'
  ) then
    update public.orders
    set order_number = invoice_number
    where order_number is null
      and invoice_number is not null;
  end if;
end $$;

create unique index if not exists orders_order_number_key
  on public.orders (order_number)
  where order_number is not null and order_number <> '';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'orders_status_flow_check'
      and conrelid = 'public.orders'::regclass
  ) then
    alter table public.orders
      add constraint orders_status_flow_check
      check (
        status in (
          'quote',
          'confirmed',
          'proof_sent',
          'approved',
          'in_production',
          'dispatched',
          'completed',
          'cancelled',
          -- legacy storefront/admin status values retained during migration
          'pending',
          'artwork_sent',
          'artwork_approved',
          'delivered'
        )
      );
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'orders_payment_terms_check'
      and conrelid = 'public.orders'::regclass
  ) then
    alter table public.orders
      add constraint orders_payment_terms_check
      check (payment_terms in ('prepaid', 'monthly'));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'orders_payment_status_check'
      and conrelid = 'public.orders'::regclass
  ) then
    alter table public.orders
      add constraint orders_payment_status_check
      check (payment_status in ('unpaid', 'pending', 'partial', 'paid', 'refunded'));
  end if;
end $$;

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  stock_code text,
  product_description text not null,
  product_id uuid,
  supplier_sku text,
  colour text,
  quantity integer not null default 1 check (quantity > 0),
  unit_price numeric(12,2) not null default 0 check (unit_price >= 0),
  decoration_method text,
  setup_cost numeric(12,2) not null default 0 check (setup_cost >= 0),
  line_total numeric(12,2) generated always as
    ((quantity::numeric * unit_price) + setup_cost) stored,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists order_items_order_id_idx on public.order_items(order_id);
create index if not exists order_items_stock_code_idx on public.order_items(stock_code);
create index if not exists order_items_supplier_sku_idx on public.order_items(supplier_sku);

create table if not exists public.artwork_proofs (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  version integer not null check (version > 0),
  logo_file_url text,
  print_position text,
  print_size text,
  print_method text,
  proof_pdf_url text,
  status text not null default 'draft'
    check (status in ('draft', 'sent', 'approved', 'superseded')),
  comment text,
  created_by uuid,
  sent_at timestamptz,
  approved_at timestamptz,
  created_at timestamptz not null default now()
);

create unique index if not exists artwork_proofs_order_version_key
  on public.artwork_proofs(order_id, version);
create index if not exists artwork_proofs_order_id_idx on public.artwork_proofs(order_id);
create index if not exists artwork_proofs_status_idx on public.artwork_proofs(status);

create table if not exists public.order_status_log (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  status text not null,
  note text,
  actor_type text not null default 'system'
    check (actor_type in ('system', 'admin', 'customer', 'supplier')),
  actor_email text,
  created_at timestamptz not null default now()
);

create index if not exists order_status_log_order_created_idx
  on public.order_status_log(order_id, created_at desc);

create table if not exists public.order_approvals (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  proof_id uuid references public.artwork_proofs(id) on delete set null,
  method text not null
    check (method in ('self_online', 'pandadoc', 'signnow', 'email')),
  signer_name text,
  signer_email text,
  signed_at timestamptz not null default now(),
  ip inet,
  user_agent text,
  certificate_url text,
  created_at timestamptz not null default now()
);

create index if not exists order_approvals_order_id_idx on public.order_approvals(order_id);
create index if not exists order_approvals_proof_id_idx on public.order_approvals(proof_id);

create table if not exists public.admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_email text,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz not null default now()
);

create index if not exists admin_audit_log_entity_idx
  on public.admin_audit_log(entity_type, entity_id, created_at desc);
create index if not exists admin_audit_log_actor_idx
  on public.admin_audit_log(actor_email, created_at desc);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists customers_touch_updated_at on public.customers;
create trigger customers_touch_updated_at
before update on public.customers
for each row execute function public.touch_updated_at();

drop trigger if exists orders_touch_updated_at on public.orders;
create trigger orders_touch_updated_at
before update on public.orders
for each row execute function public.touch_updated_at();

drop trigger if exists order_items_touch_updated_at on public.order_items;
create trigger order_items_touch_updated_at
before update on public.order_items
for each row execute function public.touch_updated_at();

create or replace function public.recalculate_order_totals(target_order_id uuid)
returns void
language plpgsql
as $$
declare
  net_total numeric(12,2);
  gst_amount numeric(12,2);
  gross_amount numeric(12,2);
begin
  select coalesce(sum(line_total), 0)
  into net_total
  from public.order_items
  where order_id = target_order_id;

  gst_amount := round(net_total * 0.10, 2);
  gross_amount := net_total + gst_amount;

  update public.orders
  set
    total_net = net_total,
    gst_total = gst_amount,
    total_gross = gross_amount
  where id = target_order_id;
end;
$$;

create or replace function public.order_items_recalculate_order()
returns trigger
language plpgsql
as $$
begin
  perform public.recalculate_order_totals(coalesce(new.order_id, old.order_id));
  return coalesce(new, old);
end;
$$;

drop trigger if exists order_items_recalculate_order_after_change on public.order_items;
create trigger order_items_recalculate_order_after_change
after insert or update or delete on public.order_items
for each row execute function public.order_items_recalculate_order();

create or replace function public.orders_status_log_after_change()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'INSERT' or new.status is distinct from old.status then
    insert into public.order_status_log(order_id, status, note, actor_type)
    values (new.id, new.status, case when tg_op = 'INSERT' then 'Order created' else 'Status changed' end, 'system');
  end if;
  return new;
end;
$$;

drop trigger if exists orders_status_log_after_change on public.orders;
create trigger orders_status_log_after_change
after insert or update of status on public.orders
for each row execute function public.orders_status_log_after_change();

-- RLS: admin writes go through service-role server routes. Browser clients should
-- not receive broad admin table access. Authenticated customers may only read
-- their own rows where legacy customer_email columns exist.
alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.artwork_proofs enable row level security;
alter table public.order_status_log enable row level security;
alter table public.order_approvals enable row level security;
alter table public.admin_audit_log enable row level security;
alter table if exists public.quotes enable row level security;
alter table if exists public.artworks enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'orders'
      and policyname = 'customers can read own orders'
  ) then
    create policy "customers can read own orders"
      on public.orders
      for select
      to authenticated
      using (
        lower(coalesce(customer_email, '')) =
        lower(coalesce(auth.jwt() ->> 'email', ''))
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'order_items'
      and policyname = 'customers can read own order items'
  ) then
    create policy "customers can read own order items"
      on public.order_items
      for select
      to authenticated
      using (
        exists (
          select 1
          from public.orders o
          where o.id = order_items.order_id
            and lower(coalesce(o.customer_email, '')) =
              lower(coalesce(auth.jwt() ->> 'email', ''))
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'artwork_proofs'
      and policyname = 'customers can read own proofs'
  ) then
    create policy "customers can read own proofs"
      on public.artwork_proofs
      for select
      to authenticated
      using (
        exists (
          select 1
          from public.orders o
          where o.id = artwork_proofs.order_id
            and lower(coalesce(o.customer_email, '')) =
              lower(coalesce(auth.jwt() ->> 'email', ''))
        )
      );
  end if;
end $$;

do $$
begin
  if to_regclass('public.quotes') is not null and not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'quotes'
      and policyname = 'customers can read own quotes'
  ) then
    create policy "customers can read own quotes"
      on public.quotes
      for select
      to authenticated
      using (
        lower(coalesce(customer_email, '')) =
        lower(coalesce(auth.jwt() ->> 'email', ''))
      );
  end if;

  if to_regclass('public.artworks') is not null and not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'artworks'
      and policyname = 'customers can read own artworks'
  ) then
    create policy "customers can read own artworks"
      on public.artworks
      for select
      to authenticated
      using (
        lower(coalesce(customer_email, '')) =
        lower(coalesce(auth.jwt() ->> 'email', ''))
      );
  end if;
end $$;

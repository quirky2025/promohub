-- Sourcing Step 4 — Factory PO (procurement) linked to the customer INDENT order,
-- RMB payments to the factory (Dad's WeChat, multi-leg deposit + balance), and a
-- Dad-loan ledger (AUD repaid to Dad). FX convention: ¥ per A$1 (e.g. 4.5),
-- so AUD = RMB / fx_rate. Everything has full CRUD (create/read/edit/delete).

-- One factory PO = one procurement against a customer order (order_number = OC…).
create table if not exists public.factory_pos (
  id                     uuid primary key default gen_random_uuid(),
  po_number              text unique,            -- SPO27xxxx (sourcing factory PO)
  order_number           text,                   -- customer order OC… in /admin/orders
  factory_id             uuid references public.factories(id),
  product_sku            text,
  product_name           text,
  quantity               numeric,
  unit_price_rmb         numeric,                -- factory EXW unit (RMB)
  extra_rmb              numeric default 0,      -- setup/tooling/sample lumped (RMB)
  total_rmb              numeric,                -- factory PO total = what we owe the factory (RMB)
  fx_rate                numeric,                -- planning FX (¥ per A$1)
  factory_invoice_number text,
  factory_invoice_rmb    numeric,
  factory_invoice_date   date,
  factory_invoice_url    text,
  status                 text default 'draft',   -- draft | sent | deposit_paid | paid | shipped | closed
  notes                  text,
  created_by             text,
  created_at             timestamptz default now(),
  updated_at             timestamptz default now()
);

-- RMB payments to the factory (Dad's WeChat). Each leg = deposit / balance / full.
-- amount_aud = amount_rmb / fx_rate at that day's rate = what QP owes Dad for this leg.
create table if not exists public.factory_po_payments (
  id             uuid primary key default gen_random_uuid(),
  factory_po_id  uuid references public.factory_pos(id) on delete cascade,
  kind           text default 'deposit',        -- deposit | balance | full | other
  amount_rmb     numeric not null,
  fx_rate        numeric,                        -- ¥ per A$1 on the day paid
  amount_aud     numeric,                        -- amount_rmb / fx_rate
  paid_date      date,
  proof_url      text,                           -- WeChat screenshot (R2)
  note           text,
  created_by     text,
  created_at     timestamptz default now()
);

-- AUD repayments from QuirkyPromo to Dad's Australian account.
create table if not exists public.dad_repayments (
  id                 uuid primary key default gen_random_uuid(),
  amount_aud         numeric not null,
  paid_date          date,
  method             text,                       -- bank transfer etc.
  ref_order_number   text,                       -- optional link to a customer order
  ref_factory_po_id  uuid references public.factory_pos(id) on delete set null,
  note               text,
  proof_url          text,
  created_by         text,
  created_at         timestamptz default now()
);

create index if not exists idx_factory_pos_order  on public.factory_pos(order_number);
create index if not exists idx_fpo_pay_po          on public.factory_po_payments(factory_po_id);
create index if not exists idx_dad_repay_order      on public.dad_repayments(ref_order_number);

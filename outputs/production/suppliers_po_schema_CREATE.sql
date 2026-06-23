-- SUPPLIERS & PRODUCTION schema (local-stock suppliers + purchase orders)
-- Run in Supabase SQL editor. Idempotent.

-- 1) Local-stock suppliers (separate from Sourcing factories)
create table if not exists suppliers (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  contact_name  text,
  email         text,
  phone         text,
  payment_terms text default 'prepaid',   -- prepaid | account (monthly)
  notes         text,
  created_at    timestamptz default now()
);

-- 2) Purchase orders to suppliers (independent PO number, links to customer order)
create table if not exists purchase_orders (
  id                      uuid primary key default gen_random_uuid(),
  po_number               text unique,                 -- supplier PO, e.g. SP260001 (never on customer docs)
  order_id                uuid references orders(id) on delete set null,
  order_number            text,                        -- customer order/project, denormalised
  supplier_id             uuid references suppliers(id) on delete set null,
  status                  text default 'draft',        -- draft | sent | confirmed | in_production | received | cancelled
  -- financial closed-loop: COGS + freight kept separate
  cost_subtotal           numeric(12,2) default 0,     -- product cost
  freight_cost            numeric(12,2) default 0,     -- supplier / freight cost (separate line)
  cost_total              numeric(12,2) default 0,     -- subtotal + freight
  -- supplier billing (accounts payable)
  supplier_invoice_number text,
  supplier_invoice_at     timestamptz,
  supplier_payment_status text default 'unpaid',       -- unpaid | paid
  supplier_paid_at        timestamptz,
  items                   jsonb,                       -- optional line items
  notes                   text,
  created_at              timestamptz default now(),
  updated_at              timestamptz default now()
);
create index if not exists idx_po_order on purchase_orders(order_id);
create index if not exists idx_po_supplier on purchase_orders(supplier_id);

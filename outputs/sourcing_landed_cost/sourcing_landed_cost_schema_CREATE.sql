-- QuirkyPromo sourcing landed-cost foundation
-- Generated for manual Supabase execution only. Codex did not run this SQL.
--
-- Purpose:
-- 1) Extend factory management with practical sourcing fields.
-- 2) Extend factory quotes with EXW/FOB, carton, weight, lead-time, and document-fee data.
-- 3) Add cost sheets that keep ESTIMATE and ACTUAL numbers separately.
-- 4) Add freight options, cost line items, and reconciliation events.

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Existing factories table extension.
alter table public.factories
  add column if not exists status text not null default 'active'
    check (status in ('active', 'trial', 'preferred', 'blocked', 'archived')),
  add column if not exists country text not null default 'China',
  add column if not exists province text,
  add column if not exists city text,
  add column if not exists address text,
  add column if not exists payment_terms text,
  add column if not exists currency text not null default 'RMB',
  add column if not exists documents_supported text[] not null default '{}',
  add column if not exists compliance_notes text,
  add column if not exists quality_rating numeric(3,1),
  add column if not exists on_time_rating numeric(3,1),
  add column if not exists defect_notes text,
  add column if not exists bank_details jsonb not null default '{}'::jsonb,
  add column if not exists blocked_reason text,
  add column if not exists updated_at timestamptz not null default now();

drop trigger if exists set_factories_updated_at on public.factories;
create trigger set_factories_updated_at
before update on public.factories
for each row execute function public.set_updated_at();

-- Existing factory quote extension.
alter table public.factory_quotes
  add column if not exists incoterm text not null default 'EXW'
    check (incoterm in ('EXW', 'FOB', 'CIF', 'DDP')),
  add column if not exists fob_unit_price_rmb numeric(12,4),
  add column if not exists moq integer,
  add column if not exists sample_cost_rmb numeric(12,2),
  add column if not exists setup_cost_rmb numeric(12,2),
  add column if not exists tooling_cost_rmb numeric(12,2),
  add column if not exists china_local_freight_rmb numeric(12,2),
  add column if not exists document_fee_rmb numeric(12,2),
  add column if not exists document_fee_notes text,
  add column if not exists production_lead_time_days integer,
  add column if not exists quote_valid_until date,
  add column if not exists units_per_carton integer,
  add column if not exists carton_length_cm numeric(10,2),
  add column if not exists carton_width_cm numeric(10,2),
  add column if not exists carton_height_cm numeric(10,2),
  add column if not exists gross_weight_kg_per_carton numeric(10,3),
  add column if not exists net_weight_kg_per_carton numeric(10,3),
  add column if not exists packing_notes text,
  add column if not exists updated_at timestamptz not null default now();

drop trigger if exists set_factory_quotes_updated_at on public.factory_quotes;
create trigger set_factory_quotes_updated_at
before update on public.factory_quotes
for each row execute function public.set_updated_at();

alter table public.quote_tiers
  add column if not exists fob_unit_price_rmb numeric(12,4),
  add column if not exists customer_total_aud numeric(12,2),
  add column if not exists selected_for_quote boolean not null default false;

-- Landed cost sheet. One sheet can come from a sourcing request, a factory quote,
-- or be created manually while estimating.
create table if not exists public.sourcing_cost_sheets (
  id uuid primary key default gen_random_uuid(),
  sheet_number text unique,
  sourcing_request_id uuid references public.sourcing_requests(id) on delete set null,
  factory_id uuid references public.factories(id) on delete set null,
  factory_quote_id uuid references public.factory_quotes(id) on delete set null,
  status text not null default 'draft'
    check (status in (
      'draft',
      'quote_sent',
      'customer_accepted',
      'invoice_sent',
      'payment_received',
      'factory_po_sent',
      'in_production',
      'ready_to_ship',
      'in_transit',
      'customs_clearance',
      'local_delivery',
      'delivered',
      'reconciled',
      'archived'
    )),
  product_name text not null,
  product_spec text,
  quantity integer not null check (quantity > 0),
  incoterm text not null default 'EXW'
    check (incoterm in ('EXW', 'FOB', 'CIF', 'DDP')),
  selected_freight_mode text
    check (selected_freight_mode in ('express', 'air', 'sea') or selected_freight_mode is null),
  exchange_rate_est numeric(12,6) not null,
  exchange_rate_actual numeric(12,6),
  fx_buffer_pct numeric(6,3) not null default 0,
  cost_buffer_pct numeric(6,3) not null default 0,
  target_margin_pct numeric(6,3) not null default 35,
  exw_unit_rmb numeric(12,4),
  fob_unit_rmb numeric(12,4),
  setup_cost_rmb numeric(12,2) not null default 0,
  sample_cost_rmb numeric(12,2) not null default 0,
  tooling_cost_rmb numeric(12,2) not null default 0,
  china_local_freight_rmb numeric(12,2) not null default 0,
  china_document_fees_rmb numeric(12,2) not null default 0,
  china_other_fees_rmb numeric(12,2) not null default 0,
  production_lead_time_days integer,
  units_per_carton integer,
  carton_count integer,
  carton_length_cm numeric(10,2),
  carton_width_cm numeric(10,2),
  carton_height_cm numeric(10,2),
  gross_weight_kg_per_carton numeric(10,3),
  total_gross_weight_kg numeric(12,3),
  total_cbm numeric(12,4),
  local_charges_aud_est numeric(12,2) not null default 0,
  clearance_aud_est numeric(12,2) not null default 0,
  duty_rate_pct_est numeric(6,3) not null default 0,
  duty_aud_est numeric(12,2) not null default 0,
  local_delivery_aud_est numeric(12,2) not null default 0,
  freight_cost_aud_est numeric(12,2) not null default 0,
  landed_cost_ex_gst_aud_est numeric(12,2) not null default 0,
  quote_ex_gst_aud numeric(12,2) not null default 0,
  quote_gst_aud numeric(12,2) not null default 0,
  quote_inc_gst_aud numeric(12,2) not null default 0,
  quote_unit_ex_gst_aud numeric(12,4) not null default 0,
  estimated_profit_aud numeric(12,2) not null default 0,
  actual_factory_cost_aud numeric(12,2),
  actual_china_cost_aud numeric(12,2),
  actual_freight_aud numeric(12,2),
  actual_local_charges_aud numeric(12,2),
  actual_duty_aud numeric(12,2),
  actual_landed_cost_ex_gst_aud numeric(12,2),
  customer_invoice_ex_gst_aud numeric(12,2),
  customer_invoice_gst_aud numeric(12,2),
  customer_invoice_inc_gst_aud numeric(12,2),
  payment_received_aud numeric(12,2),
  actual_profit_aud numeric(12,2),
  profit_variance_aud numeric(12,2),
  estimate_inputs jsonb not null default '{}'::jsonb,
  estimate_summary jsonb not null default '{}'::jsonb,
  actual_inputs jsonb not null default '{}'::jsonb,
  actual_summary jsonb not null default '{}'::jsonb,
  internal_notes text,
  customer_notes text,
  created_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_sourcing_cost_sheets_updated_at on public.sourcing_cost_sheets;
create trigger set_sourcing_cost_sheets_updated_at
before update on public.sourcing_cost_sheets
for each row execute function public.set_updated_at();

create index if not exists sourcing_cost_sheets_status_idx on public.sourcing_cost_sheets(status);
create index if not exists sourcing_cost_sheets_factory_idx on public.sourcing_cost_sheets(factory_id);
create index if not exists sourcing_cost_sheets_request_idx on public.sourcing_cost_sheets(sourcing_request_id);
create index if not exists sourcing_cost_sheets_created_idx on public.sourcing_cost_sheets(created_at desc);

create table if not exists public.sourcing_freight_options (
  id uuid primary key default gen_random_uuid(),
  cost_sheet_id uuid not null references public.sourcing_cost_sheets(id) on delete cascade,
  mode text not null check (mode in ('express', 'air', 'sea')),
  provider text,
  rate_type text not null default 'per_kg'
    check (rate_type in ('per_kg', 'per_cbm', 'fixed')),
  currency text not null default 'RMB' check (currency in ('RMB', 'AUD', 'USD')),
  rate_amount numeric(12,4) not null default 0,
  min_charge numeric(12,4) not null default 0,
  chargeable_weight_kg numeric(12,3),
  cbm numeric(12,4),
  transit_days text,
  origin_charge_aud numeric(12,2) not null default 0,
  destination_charge_aud numeric(12,2) not null default 0,
  estimated_cost_aud numeric(12,2) not null default 0,
  actual_cost_aud numeric(12,2),
  selected boolean not null default false,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists sourcing_freight_options_sheet_idx on public.sourcing_freight_options(cost_sheet_id);

create table if not exists public.sourcing_cost_lines (
  id uuid primary key default gen_random_uuid(),
  cost_sheet_id uuid not null references public.sourcing_cost_sheets(id) on delete cascade,
  phase text not null default 'estimate' check (phase in ('estimate', 'actual')),
  category text not null check (category in (
    'factory',
    'china_local_freight',
    'china_document_fee',
    'china_other_fee',
    'international_freight',
    'local_charge',
    'clearance',
    'duty',
    'local_delivery',
    'inspection',
    'other'
  )),
  label text not null,
  currency text not null default 'AUD' check (currency in ('RMB', 'AUD', 'USD')),
  amount numeric(12,2) not null default 0,
  exchange_rate numeric(12,6),
  amount_aud numeric(12,2) not null default 0,
  taxable boolean not null default false,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists sourcing_cost_lines_sheet_phase_idx
  on public.sourcing_cost_lines(cost_sheet_id, phase);

create table if not exists public.sourcing_reconciliation_events (
  id uuid primary key default gen_random_uuid(),
  cost_sheet_id uuid not null references public.sourcing_cost_sheets(id) on delete cascade,
  event_type text not null,
  note text,
  snapshot jsonb not null default '{}'::jsonb,
  created_by text,
  created_at timestamptz not null default now()
);

create index if not exists sourcing_reconciliation_events_sheet_idx
  on public.sourcing_reconciliation_events(cost_sheet_id, created_at desc);

-- Basic RLS posture. Admin APIs use service role, but these policies keep direct
-- anon/client access closed unless you add explicit authenticated policies later.
alter table public.sourcing_cost_sheets enable row level security;
alter table public.sourcing_freight_options enable row level security;
alter table public.sourcing_cost_lines enable row level security;
alter table public.sourcing_reconciliation_events enable row level security;

drop policy if exists "deny anon sourcing cost sheets" on public.sourcing_cost_sheets;
create policy "deny anon sourcing cost sheets"
on public.sourcing_cost_sheets for all
to anon
using (false)
with check (false);

drop policy if exists "deny anon sourcing freight options" on public.sourcing_freight_options;
create policy "deny anon sourcing freight options"
on public.sourcing_freight_options for all
to anon
using (false)
with check (false);

drop policy if exists "deny anon sourcing cost lines" on public.sourcing_cost_lines;
create policy "deny anon sourcing cost lines"
on public.sourcing_cost_lines for all
to anon
using (false)
with check (false);

drop policy if exists "deny anon sourcing reconciliation events" on public.sourcing_reconciliation_events;
create policy "deny anon sourcing reconciliation events"
on public.sourcing_reconciliation_events for all
to anon
using (false)
with check (false);

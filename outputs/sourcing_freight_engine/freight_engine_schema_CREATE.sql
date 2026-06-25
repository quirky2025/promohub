-- QuirkyPromo — Freight Rate Engine schema
-- Generated for MANUAL Supabase execution. Claude did NOT run this SQL.
-- Replaces the simple `freight_rates` table with a proper rate-sheet engine that
-- models the forwarder's real sheet: origin+carrier+service, weight bands, two
-- pricing models, goods-class surcharges, fee rules, blacklist postcodes, versioning,
-- and write-once quote snapshots. The old `freight_rates` table is left untouched
-- (deprecate once the new admin UI is live).
--
-- Design principles (from freight_plan spec):
--  * Append-only versioning: a price change = a NEW sheet version; old versions kept.
--  * 3-D identity: origin + carrier + service uniquely identify a price system.
--  * Frozen snapshots: each quote copies the full calc into an immutable record.

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

-- ============================================================
-- 1) freight_rate_sheets — one version of one origin+carrier+service price list
-- ============================================================
create table if not exists public.freight_rate_sheets (
  id                 uuid primary key default gen_random_uuid(),
  name               text not null,                       -- "Hong Kong DHL Express"
  forwarder          text,
  channel            text not null check (channel in ('express','air','sea')),
  origin             text not null check (origin in ('hongkong','mainland','yiwu')),
  carrier            text not null,                        -- dhl | ups | fedex | air | sea
  service            text,                                 -- ip | ie | express | general | battery | sea
  version            int  not null default 1,
  supersedes_id      uuid references public.freight_rate_sheets(id),
  effective_from     date not null default current_date,
  valid_until        date,
  status             text not null default 'active' check (status in ('draft','active','expired')),
  currency           text not null default 'RMB',
  tax_inclusive      boolean not null default false,       -- air/sea sheets = true (含税); express = false
  volumetric_divisor int  not null default 6000,           -- 抛货比 1:167
  min_chargeable_kg  numeric(8,2),                         -- e.g. AU Post 22kg minimum (>100cm single side)
  notes              text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- At most ONE active sheet per (origin, carrier, service) → "latest active" is deterministic.
create unique index if not exists freight_sheet_active_uniq
  on public.freight_rate_sheets (origin, carrier, coalesce(service, ''))
  where status = 'active';

drop trigger if exists set_freight_rate_sheets_updated_at on public.freight_rate_sheets;
create trigger set_freight_rate_sheets_updated_at
before update on public.freight_rate_sheets
for each row execute function public.set_updated_at();

-- ============================================================
-- 2) freight_rate_rows — weight-band price rows belonging to a sheet
-- ============================================================
-- pricing_model:
--   'first_additional' → first_weight_price + ceil((kg - first_weight_unit)/additional_weight_unit) * additional_weight_price
--   'flat_per_kg'      → kg * kg_rate
--   'lookup_total'     → round kg up to weight_to, charge flat_price for the whole shipment (UPS)
-- Weight bands are LEFT-CLOSED, RIGHT-OPEN:  weight_from <= kg < weight_to.
create table if not exists public.freight_rate_rows (
  id                      uuid primary key default gen_random_uuid(),
  rate_sheet_id           uuid not null references public.freight_rate_sheets(id) on delete cascade,
  destination_zone        text,                 -- port name for sea (Sydney/Melbourne/...), else null
  postcode_from           int,                  -- null = applies to all postcodes
  postcode_to             int,
  pricing_model           text not null check (pricing_model in ('first_additional','flat_per_kg','lookup_total')),
  weight_from             numeric(8,2) not null default 0,    -- left-closed
  weight_to               numeric(8,2),                       -- right-open; null = no upper bound
  first_weight_unit       numeric(6,2),
  first_weight_price      numeric(12,4),
  additional_weight_unit  numeric(6,2),
  additional_weight_price numeric(12,4),
  kg_rate                 numeric(12,4),                      -- flat_per_kg
  flat_price              numeric(12,4),                      -- lookup_total (per shipment)
  min_charge              numeric(12,2),
  transit_time            text,
  created_at              timestamptz not null default now(),
  check (weight_to is null or weight_from < weight_to)
);
create index if not exists freight_rate_rows_sheet on public.freight_rate_rows (rate_sheet_id);

-- ============================================================
-- 3) freight_surcharge_rules — product-class surcharges (per kg / per pcs)
-- rate_sheet_id NULL = global default (the class table is the same across channels).
-- ============================================================
create table if not exists public.freight_surcharge_rules (
  id            uuid primary key default gen_random_uuid(),
  rate_sheet_id uuid references public.freight_rate_sheets(id) on delete cascade,
  goods_class   text not null check (goods_class in ('class1','class2','class3','special','high_value')),
  basis         text not null check (basis in ('per_kg','per_pcs','quote_required')),
  rate          numeric(10,2),                              -- null when quote_required
  currency      text not null default 'RMB',
  description   text
);

-- ============================================================
-- 4) freight_fee_rules — oversize/overweight/customs/duty/insurance/actual-cost
-- rate_sheet_id NULL = global default.
-- ============================================================
create table if not exists public.freight_fee_rules (
  id                uuid primary key default gen_random_uuid(),
  rate_sheet_id     uuid references public.freight_rate_sheets(id) on delete cascade,
  fee_type          text not null,            -- oversize|overweight|customs|duty|insurance|customs_declaration|magnetic_test|fumigation|actual_cost|...
  trigger_condition jsonb,                    -- {"metric":"billable_kg","gte":30} etc.
  amount            numeric(12,2),
  amount_basis      text check (amount_basis in ('per_piece','per_shipment','percent_of_value','per_unit','per_line','actual_cost')),
  currency          text not null default 'RMB',
  stacks            boolean not null default false,   -- oversize+overweight both apply
  notes             text
);

-- ============================================================
-- 5) freight_unserviceable_postcodes — island / no-delivery / quote-only blacklist
-- ============================================================
create table if not exists public.freight_unserviceable_postcodes (
  id            uuid primary key default gen_random_uuid(),
  postcode_from int not null,
  postcode_to   int not null,
  reason        text
);

-- ============================================================
-- 6) freight_quote_snapshots — frozen record of a calculation (WRITE-ONCE)
-- ============================================================
create table if not exists public.freight_quote_snapshots (
  id                    uuid primary key default gen_random_uuid(),
  cost_sheet_id         uuid,            -- optional link to sourcing_cost_sheets
  sourcing_request_id   uuid,
  origin                text,            -- copied (frozen) — most critical to freeze
  carrier               text,            -- copied
  service               text,            -- copied
  rate_sheet_id         uuid,
  rate_sheet_version    int,             -- redundant copy; survives if sheet changes
  quote_date            timestamptz not null default now(),
  valid_until           date,
  destination_postcode  int,
  actual_weight_kg      numeric(10,2),
  volumetric_weight_kg  numeric(10,2),
  chargeable_kg         numeric(10,2),
  goods_class           text,
  freight_base_rmb      numeric(12,2),
  surcharge_rmb         numeric(12,2),
  additional_fees_rmb   numeric(12,2),
  freight_total_rmb     numeric(12,2),
  fx_rate_used          numeric(10,5),
  fx_rate_source        text,
  freight_total_aud     numeric(12,2),
  calculation_breakdown jsonb,           -- full itemised trace
  estimate_flag         boolean not null default true,
  created_at            timestamptz not null default now()
);
create index if not exists freight_snapshots_cost_sheet on public.freight_quote_snapshots (cost_sheet_id);

-- ============================================================
-- 7) Global settings row (single source of truth for FX + default margin)
-- ============================================================
create table if not exists public.sourcing_settings (
  id                 int primary key default 1 check (id = 1),
  fx_rate_rmb_to_aud numeric(10,5) not null default 0.21,
  fx_rate_updated_at timestamptz not null default now(),
  fx_rate_source     text,
  default_margin     numeric(6,3) not null default 1.40,
  updated_at         timestamptz not null default now()
);
insert into public.sourcing_settings (id) values (1) on conflict (id) do nothing;

drop trigger if exists set_sourcing_settings_updated_at on public.sourcing_settings;
create trigger set_sourcing_settings_updated_at
before update on public.sourcing_settings
for each row execute function public.set_updated_at();

-- End of freight engine schema.

-- QuirkyPromo — Freight rate-row change history (price trail per weight band)
-- Run in Supabase SQL editor. Lets Lily update just ONE weight band's price and
-- keep a dated record of every change (old → new), so price trends are visible.
-- Reproducibility of past QUOTES is preserved by freight_quote_snapshots (frozen at
-- quote time); this table is the human-facing "how did this band's price move" trail.

create extension if not exists "pgcrypto";

create table if not exists public.freight_rate_row_history (
  id            uuid primary key default gen_random_uuid(),
  rate_row_id   uuid references public.freight_rate_rows(id) on delete set null,
  rate_sheet_id uuid,
  carrier       text,
  service       text,
  channel       text,
  destination_zone text,
  weight_from   numeric(8,2),
  weight_to     numeric(8,2),
  field         text,             -- which price field changed: kg_rate | first_weight_price | additional_weight_price | flat_price
  old_value     numeric(12,4),
  new_value     numeric(12,4),
  changed_at    timestamptz not null default now(),
  changed_by    text,
  note          text
);

create index if not exists freight_rate_hist_row on public.freight_rate_row_history (rate_row_id, changed_at desc);
create index if not exists freight_rate_hist_carrier on public.freight_rate_row_history (carrier, service, changed_at desc);

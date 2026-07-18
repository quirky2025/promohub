-- Generic banner system — ONE table for every page's banner(s).
-- Replaces the earlier category_banners idea so brand / collection / home /
-- future pages all work the same way and never need another table.
--
--   page_type = 'category' | 'brand' | 'collection' | 'home' | 'page'
--   page_key  = the slug ('drinkware', 'trends', 'eco-range')
--               for the homepage: 'hero' (single) or 'carousel' (many rows)
--   sort_order = order within a carousel (0,1,2…); single banners just use 0
create table if not exists public.page_banners (
  id           uuid primary key default gen_random_uuid(),
  page_type    text not null,
  page_key     text not null,
  sort_order   integer default 0,
  image_url    text,
  headline     text,
  subheadline  text,
  cta_label    text,                 -- button text, e.g. 'Shop new arrivals'
  cta_href     text,                 -- where the button goes, e.g. '/new-arrivals'
  overlay_pct  integer default 45,   -- dark overlay so white text stays readable
  is_active    boolean default true,
  updated_at   timestamptz default now(),
  created_at   timestamptz default now()
);

create index if not exists idx_page_banners_lookup on public.page_banners(page_type, page_key, sort_order);

-- One banner per (type,key,slot) — lets us upsert cleanly.
create unique index if not exists uq_page_banners_slot on public.page_banners(page_type, page_key, sort_order);

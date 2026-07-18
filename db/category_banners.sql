-- Category page banners — lets Lily change the hero image on each category page
-- herself (admin → Catalog → Banners), instead of the flat navy block.
-- No row / no image = the page falls back to the original navy hero.
create table if not exists public.category_banners (
  id             uuid primary key default gen_random_uuid(),
  category_slug  text unique not null,   -- e.g. 'drinkware' (from the URL)
  category_name  text,                   -- display name, for the admin list
  image_url      text,                   -- R2 URL (already compressed on upload)
  headline       text,                   -- optional: override the H1
  subheadline    text,                   -- optional: override the small line
  overlay_pct    integer default 45,     -- dark overlay strength so white text stays readable
  updated_at     timestamptz default now(),
  created_at     timestamptz default now()
);
create index if not exists idx_category_banners_slug on public.category_banners(category_slug);

-- QuirkyPromo URL infrastructure tables
-- Run this before:
--   outputs/url_pages_ready/url_pages_seed_READY_dry_run.sql
-- Safe intent: additive only. Creates url_pages / brands / url_redirects if missing.

begin;

create extension if not exists pgcrypto;

create table if not exists public.url_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  page_type text not null default 'product_category',
  source_type text not null default 'manual',
  source_label text,
  primary_keyword text,
  title text,
  h1 text,
  nav_label text,
  home_label text,
  meta_description text,
  canonical_url text,
  product_filter jsonb not null default '{}'::jsonb,
  seo_content text,
  faq jsonb not null default '[]'::jsonb,
  hero_image text,
  status text not null default 'draft',
  priority int not null default 100,
  show_in_home boolean not null default false,
  show_in_nav boolean not null default false,
  show_in_footer boolean not null default false,
  breadcrumb_parent text,
  related_urls jsonb not null default '[]'::jsonb,
  redirect_from jsonb not null default '[]'::jsonb,
  noindex boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.url_pages add column if not exists id uuid default gen_random_uuid();
alter table public.url_pages add column if not exists slug text;
alter table public.url_pages add column if not exists page_type text default 'product_category';
alter table public.url_pages add column if not exists source_type text default 'manual';
alter table public.url_pages add column if not exists source_label text;
alter table public.url_pages add column if not exists primary_keyword text;
alter table public.url_pages add column if not exists title text;
alter table public.url_pages add column if not exists h1 text;
alter table public.url_pages add column if not exists nav_label text;
alter table public.url_pages add column if not exists home_label text;
alter table public.url_pages add column if not exists meta_description text;
alter table public.url_pages add column if not exists canonical_url text;
alter table public.url_pages add column if not exists product_filter jsonb default '{}'::jsonb;
alter table public.url_pages add column if not exists seo_content text;
alter table public.url_pages add column if not exists faq jsonb default '[]'::jsonb;
alter table public.url_pages add column if not exists hero_image text;
alter table public.url_pages add column if not exists status text default 'draft';
alter table public.url_pages add column if not exists priority int default 100;
alter table public.url_pages add column if not exists show_in_home boolean default false;
alter table public.url_pages add column if not exists show_in_nav boolean default false;
alter table public.url_pages add column if not exists show_in_footer boolean default false;
alter table public.url_pages add column if not exists breadcrumb_parent text;
alter table public.url_pages add column if not exists related_urls jsonb default '[]'::jsonb;
alter table public.url_pages add column if not exists redirect_from jsonb default '[]'::jsonb;
alter table public.url_pages add column if not exists noindex boolean default false;
alter table public.url_pages add column if not exists created_at timestamptz default now();
alter table public.url_pages add column if not exists updated_at timestamptz default now();

update public.url_pages
set
  product_filter = coalesce(product_filter, '{}'::jsonb),
  faq = coalesce(faq, '[]'::jsonb),
  related_urls = coalesce(related_urls, '[]'::jsonb),
  redirect_from = coalesce(redirect_from, '[]'::jsonb),
  status = coalesce(status, 'draft'),
  page_type = coalesce(page_type, 'product_category'),
  source_type = coalesce(source_type, 'manual'),
  priority = coalesce(priority, 100),
  show_in_home = coalesce(show_in_home, false),
  show_in_nav = coalesce(show_in_nav, false),
  show_in_footer = coalesce(show_in_footer, false),
  noindex = coalesce(noindex, false),
  created_at = coalesce(created_at, now()),
  updated_at = coalesce(updated_at, now());

alter table public.url_pages alter column slug set not null;
alter table public.url_pages alter column page_type set not null;
alter table public.url_pages alter column source_type set not null;
alter table public.url_pages alter column product_filter set not null;
alter table public.url_pages alter column faq set not null;
alter table public.url_pages alter column status set not null;
alter table public.url_pages alter column priority set not null;
alter table public.url_pages alter column show_in_home set not null;
alter table public.url_pages alter column show_in_nav set not null;
alter table public.url_pages alter column show_in_footer set not null;
alter table public.url_pages alter column related_urls set not null;
alter table public.url_pages alter column redirect_from set not null;
alter table public.url_pages alter column noindex set not null;
alter table public.url_pages alter column created_at set not null;
alter table public.url_pages alter column updated_at set not null;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'url_pages_slug_unique'
      and conrelid = 'public.url_pages'::regclass
  ) then
    alter table public.url_pages add constraint url_pages_slug_unique unique (slug);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'url_pages_page_type_check'
      and conrelid = 'public.url_pages'::regclass
  ) then
    alter table public.url_pages add constraint url_pages_page_type_check
      check (page_type in ('product_category', 'collection', 'landing', 'brand', 'service'));
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'url_pages_source_type_check'
      and conrelid = 'public.url_pages'::regclass
  ) then
    alter table public.url_pages add constraint url_pages_source_type_check
      check (source_type in ('category', 'subcategory', 'collection', 'brand', 'manual'));
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'url_pages_status_check'
      and conrelid = 'public.url_pages'::regclass
  ) then
    alter table public.url_pages add constraint url_pages_status_check
      check (status in ('draft', 'live', 'redirected'));
  end if;
end $$;

create index if not exists idx_url_pages_status on public.url_pages(status);
create index if not exists idx_url_pages_page_type on public.url_pages(page_type);
create index if not exists idx_url_pages_source_type on public.url_pages(source_type);
create index if not exists idx_url_pages_nav on public.url_pages(show_in_nav, priority) where status = 'live';
create index if not exists idx_url_pages_home on public.url_pages(show_in_home, priority) where status = 'live';
create index if not exists idx_url_pages_footer on public.url_pages(show_in_footer, priority) where status = 'live';
create index if not exists idx_url_pages_product_filter on public.url_pages using gin(product_filter);

create table if not exists public.brands (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  name text not null,
  aliases text[] not null default array[]::text[],
  logo_url text,
  description text,
  website_url text,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'brands_status_check'
      and conrelid = 'public.brands'::regclass
  ) then
    alter table public.brands add constraint brands_status_check
      check (status in ('draft', 'live', 'archived'));
  end if;
end $$;

create index if not exists idx_brands_status on public.brands(status);
create index if not exists idx_brands_aliases on public.brands using gin(aliases);

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'brands_slug_unique'
      and conrelid = 'public.brands'::regclass
  ) then
    alter table public.brands add constraint brands_slug_unique unique (slug);
  end if;
end $$;

create table if not exists public.url_redirects (
  id uuid primary key default gen_random_uuid(),
  from_path text not null,
  to_path text not null,
  status_code int not null default 301,
  is_active boolean not null default true,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'url_redirects_status_code_check'
      and conrelid = 'public.url_redirects'::regclass
  ) then
    alter table public.url_redirects add constraint url_redirects_status_code_check
      check (status_code in (301, 302, 307, 308));
  end if;
end $$;

create index if not exists idx_url_redirects_active_from_path
  on public.url_redirects(from_path)
  where is_active = true;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'url_redirects_from_path_unique'
      and conrelid = 'public.url_redirects'::regclass
  ) then
    alter table public.url_redirects add constraint url_redirects_from_path_unique unique (from_path);
  end if;
end $$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_url_pages_updated_at on public.url_pages;
create trigger set_url_pages_updated_at
before update on public.url_pages
for each row execute function public.set_updated_at();

drop trigger if exists set_brands_updated_at on public.brands;
create trigger set_brands_updated_at
before update on public.brands
for each row execute function public.set_updated_at();

drop trigger if exists set_url_redirects_updated_at on public.url_redirects;
create trigger set_url_redirects_updated_at
before update on public.url_redirects
for each row execute function public.set_updated_at();

alter table public.url_pages enable row level security;
alter table public.brands enable row level security;
alter table public.url_redirects enable row level security;

drop policy if exists "Public can read live url pages" on public.url_pages;
create policy "Public can read live url pages"
on public.url_pages
for select
to anon, authenticated
using (status = 'live');

drop policy if exists "Public can read live brands" on public.brands;
create policy "Public can read live brands"
on public.brands
for select
to anon, authenticated
using (status = 'live');

drop policy if exists "Public can read active redirects" on public.url_redirects;
create policy "Public can read active redirects"
on public.url_redirects
for select
to anon, authenticated
using (is_active = true);

commit;

select
  'url_infrastructure_ready' as check_name,
  exists(select 1 from information_schema.tables where table_schema = 'public' and table_name = 'url_pages') as url_pages_exists,
  exists(select 1 from information_schema.tables where table_schema = 'public' and table_name = 'brands') as brands_exists,
  exists(select 1 from information_schema.tables where table_schema = 'public' and table_name = 'url_redirects') as url_redirects_exists;

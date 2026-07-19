-- CMS Phase 2 · Blog (CMS_CONTENT_EDITOR_SPEC.md Phase 2). Idempotent.
-- blocks jsonb = same structured guide blocks as the page editor
--   [{ level:'h2'|'h3'|'raw', heading, html, image_url, image_alt }]
-- content_html = compiled at publish (front end renders this string).
-- related_products = [{ id, name, slug }] · related_pages = [{ slug, label }]

create table if not exists public.blog_posts (
  id               uuid primary key default gen_random_uuid(),
  title            text not null,
  slug             text not null unique,
  status           text not null default 'draft',      -- draft | published
  author           text not null default 'QuirkyPromo Team',
  cover_image_url  text,
  cover_image_alt  text,
  meta_description text,
  target_keyword   text,                               -- internal only, never rendered
  show_toc         boolean not null default true,
  blocks           jsonb not null default '[]',
  content_html     text,
  related_products jsonb not null default '[]',
  related_pages    jsonb not null default '[]',
  published_at     timestamptz,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

create index if not exists idx_blog_posts_status_published
  on public.blog_posts (status, published_at desc);

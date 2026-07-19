-- CMS Phase 1 (CMS_CONTENT_EDITOR_SPEC.md): draft/publish + version history for url_pages content.
-- Idempotent — safe to run more than once. Run in Supabase SQL Editor.
--
-- One row per saved version of a page's editable content slots.
--   status 'draft'     — the single working draft for a slug (at most one per slug)
--   status 'published' — snapshot taken every time the page is published (history for rollback)
-- payload jsonb shape:
--   { title, meta_description, seo_intro,
--     guide_blocks: [ { level: 'h2'|'h3'|'raw', heading, html, image_url, image_alt } ],
--     faq: [ { question, answer } ] }

create table if not exists public.url_page_revisions (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null,
  version      integer not null default 0,
  status       text not null default 'draft',     -- 'draft' | 'published'
  payload      jsonb not null,
  created_by   text,                              -- admin email (operation log)
  created_at   timestamptz default now(),
  published_at timestamptz
);

create index if not exists idx_upr_slug_version
  on public.url_page_revisions (slug, version desc);

-- At most ONE draft per slug (published rows are unlimited history)
create unique index if not exists uq_upr_one_draft_per_slug
  on public.url_page_revisions (slug)
  where status = 'draft';

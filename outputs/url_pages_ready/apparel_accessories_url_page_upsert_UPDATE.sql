-- Apparel Accessories url_pages patch
-- Run once before apparel_live_preflight_READONLY.sql.
-- Adds the new Apparel Accessories flat URL page as draft.

begin;

insert into public.url_pages (
  slug,
  page_type,
  source_type,
  source_label,
  primary_keyword,
  title,
  h1,
  nav_label,
  home_label,
  meta_description,
  canonical_url,
  product_filter,
  seo_content,
  faq,
  hero_image,
  status,
  priority,
  show_in_home,
  show_in_nav,
  show_in_footer,
  breadcrumb_parent,
  related_urls,
  noindex
)
values (
  'branded-apparel-accessories-australia',
  'product_category',
  'subcategory',
  'Apparel > Apparel Accessories',
  'branded apparel accessories australia',
  'Branded Apparel Accessories Australia | QuirkyPromo',
  'Branded Apparel Accessories Australia',
  'Apparel Accessories',
  'Apparel Accessories',
  'Explore branded apparel accessories in Australia, with custom options for uniforms, teamwear, events and promotional campaigns.',
  '/branded-apparel-accessories-australia',
  '{"type":"subcategory","category":"Apparel","subcategory":"Apparel Accessories"}'::jsonb,
  '',
  '[]'::jsonb,
  '',
  'draft',
  5,
  false,
  true,
  false,
  'custom-branded-apparel-australia',
  '[]'::jsonb,
  false
)
on conflict (slug) do update set
  page_type = excluded.page_type,
  source_type = excluded.source_type,
  source_label = excluded.source_label,
  primary_keyword = excluded.primary_keyword,
  title = excluded.title,
  h1 = excluded.h1,
  nav_label = excluded.nav_label,
  home_label = excluded.home_label,
  meta_description = excluded.meta_description,
  canonical_url = excluded.canonical_url,
  product_filter = excluded.product_filter,
  seo_content = excluded.seo_content,
  faq = excluded.faq,
  hero_image = excluded.hero_image,
  status = excluded.status,
  priority = excluded.priority,
  show_in_home = excluded.show_in_home,
  show_in_nav = excluded.show_in_nav,
  show_in_footer = excluded.show_in_footer,
  breadcrumb_parent = excluded.breadcrumb_parent,
  related_urls = excluded.related_urls,
  noindex = excluded.noindex,
  updated_at = now()
returning slug, status, product_filter;

commit;

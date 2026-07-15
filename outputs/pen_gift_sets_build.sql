-- Pen Gift Sets 子分类(交叉挂 · type=collection)。整块跑一次。
-- 机制:给 33 个产品的 extra_subcategories 加标签 "Pen Gift Sets"(主户口不动,同时出现在本集合页)。

-- STEP 0: 确保字段存在(幂等)
alter table products add column if not exists extra_subcategories jsonb default '[]'::jsonb;

-- STEP 1: 打标签(去重:已含则跳过)
update products
set extra_subcategories = coalesce(extra_subcategories,'[]'::jsonb) || '["Pen Gift Sets"]'::jsonb
where supplier_sku in ('108792','113803','113797','116495','126829','P188','116691','116690','129681','129680','129679','129676','119355','129675','129682','129677','122401','122400','129678','JT125','EC221','116303','LL8337','LL2705','108827','110461','110463','LL2655','120861','LL8334','117838','D430','LL5104')
  and not coalesce(extra_subcategories,'[]'::jsonb) @> '["Pen Gift Sets"]'::jsonb;

-- STEP 2: 建 url_pages 入口(collection 页,挂在 Pens 下)
insert into url_pages
  (slug, page_type, source_type, source_label, primary_keyword, title, h1, nav_label, home_label,
   meta_description, seo_intro, canonical_url, product_filter, faq, status, priority,
   show_in_home, show_in_nav, show_in_footer, breadcrumb_parent, related_urls, noindex)
values
  ('pen-gift-sets-australia','product_category','collection','Pens > Pen Gift Sets',
   'pen gift sets australia','Custom Pen Gift Sets Australia — Branded Pen & Notebook Sets | QuirkyPromo','Pen Gift Sets Australia','Pen Gift Sets','Pen Gift Sets',
   'Branded pen gift sets and notebook & pen sets — premium boxed corporate gifts with your logo. Free digital proof, fast Australia-wide delivery.','Pen gift sets turn a simple pen into a proper corporate gift — a branded pen (often paired with a notebook) presented in a gift box, ready to hand to clients, staff or event VIPs. Browse our boxed pen sets and notebook & pen sets, add your logo, approve your free digital proof, and we''ll take care of the rest.','/pen-gift-sets-australia',
   '{"type":"collection","tag":"Pen Gift Sets"}',
   '[]','live',5, false, true, false, 'branded-pens-australia', '[]', false)
on conflict (slug) do update set
   product_filter = excluded.product_filter,
   title = excluded.title, h1 = excluded.h1, nav_label = excluded.nav_label,
   meta_description = excluded.meta_description, seo_intro = excluded.seo_intro,
   breadcrumb_parent = excluded.breadcrumb_parent, status = 'live';

-- STEP 3: 核对
select count(*) as tagged from products where extra_subcategories @> '["Pen Gift Sets"]'::jsonb;
select slug, status, product_filter from url_pages where slug='pen-gift-sets-australia';

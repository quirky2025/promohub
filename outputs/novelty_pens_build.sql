-- Novelty Pens 子分类(类型子类 · 主分类移动)。整块跑一次。
-- 14 个造型/趣味笔归入 Pens / Novelty Pens(含把 P730 从 Toys & Games 收回)。

-- STEP 0: 备份
create table if not exists products_bak_novelty_pens as
select id, supplier_sku, name, category, subcategory from products where supplier_sku in ('LN6619','LL3311','101638','P737','LL1724','LL4604','LL4602','LL4600','112977','P733','LL3296','P741','129397','P730');

-- STEP 1: 移动到 Pens / Novelty Pens
update products set category='Pens', subcategory='Novelty Pens'
where supplier_sku in ('LN6619','LL3311','101638','P737','LL1724','LL4604','LL4602','LL4600','112977','P733','LL3296','P741','129397','P730');

-- STEP 2: 建 url_pages 入口
insert into url_pages
  (slug, page_type, source_type, source_label, primary_keyword, title, h1, nav_label, home_label,
   meta_description, seo_intro, canonical_url, product_filter, faq, status, priority,
   show_in_home, show_in_nav, show_in_footer, breadcrumb_parent, related_urls, noindex)
values
  ('novelty-pens-australia','product_category','subcategory','Pens > Novelty Pens',
   'novelty pens australia','Novelty Pens Australia — Custom Fun & Shaped Pens | QuirkyPromo','Novelty Pens Australia','Novelty Pens','Novelty Pens',
   'Custom novelty pens — spinner pens, Mop Top pens, banner pens and fun shaped designs branded with your logo. Great giveaways. Free digital proof, fast Australia-wide delivery.','Novelty pens turn a giveaway into a talking point — spinner pens, Mop Top characters, pull-out banner pens and fun shaped designs that people actually keep and play with. Branded with your logo, they''re perfect for expos, kids'' campaigns and grabbing attention on the counter. Upload your logo, approve your free digital proof, and we''ll do the rest.','/novelty-pens-australia',
   '{"type":"subcategory","category":"Pens","subcategory":"Novelty Pens"}',
   '[]','live',5, false, true, false, 'branded-pens-australia', '[]', false)
on conflict (slug) do update set
   product_filter=excluded.product_filter, title=excluded.title, h1=excluded.h1,
   nav_label=excluded.nav_label, meta_description=excluded.meta_description,
   seo_intro=excluded.seo_intro, breadcrumb_parent=excluded.breadcrumb_parent, status='live';

-- STEP 3: 核对
select subcategory, count(*) n from products where category='Pens' and subcategory='Novelty Pens' group by 1;

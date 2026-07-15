-- New subcategory: Pens / Pen Presentation  (pen boxes, sleeves, pouches, presentation cases)
-- Move 11 existing products here (currently scattered in Ballpoint Pens / Packaging-Gift Boxes).
-- Pencil Cases are NOT touched. "Notebook and Pen Gift Set" items are NOT touched (gift-set task).
-- Intex PS1600-1604 will be imported straight into this subcategory.

-- ── STEP 0: BACKUP ──
create table products_bak_pen_presentation_0712 as
select id, supplier_sku, name, category, subcategory
from products
where supplier_sku in ('LL0501','GB02','LL0512','126243','129257','108478','125660','104540','F302','103851','104542');

-- ── STEP 1: PREVIEW ──
select supplier_sku, name, category as old_cat, subcategory as old_sub
from products
where supplier_sku in ('LL0501','GB02','LL0512','126243','129257','108478','125660','104540','F302','103851','104542')
order by name;

-- ── STEP 2: APPLY ──
update products
set category = 'Pens', subcategory = 'Pen Presentation'
where supplier_sku in ('LL0501','GB02','LL0512','126243','129257','108478','125660','104540','F302','103851','104542');

-- ── STEP 3: VERIFY (expect 11 in Pens / Pen Presentation; Intex adds 5 more at import) ──
select category, subcategory, count(*) n
from products where subcategory = 'Pen Presentation'
group by category, subcategory;

-- ── STEP 4: register the new subcategory PAGE (slug -> category resolver + SEO) ──
insert into url_pages
  (slug, page_type, source_type, source_label, primary_keyword, title, h1, nav_label, home_label,
   meta_description, canonical_url, product_filter, faq, status, priority,
   show_in_home, show_in_nav, show_in_footer, breadcrumb_parent, related_urls, noindex)
values
  ('pen-presentation-australia','product_category','subcategory','Pens > Pen Presentation',
   'pen presentation boxes australia','Pen Presentation Boxes Australia | QuirkyPromo',
   'Pen Presentation Boxes Australia','Pen Presentation','Pen Presentation',
   'Explore pen presentation boxes, sleeves and cases in Australia, with branded and custom options for corporate gifts, events and promotional campaigns.',
   '/pen-presentation-australia',
   '{"type":"subcategory","category":"Pens","subcategory":"Pen Presentation"}',
   '[]','draft',5, false, true, false, 'branded-pens-australia', '[]', false)
on conflict (slug) do nothing;

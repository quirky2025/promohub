-- Packaging manual review list
-- READ ONLY. Run if packaging_normalization_summary_READONLY.sql shows manual_review_products > 0.

with classified as (
  select
    p.id,
    p.supplier_sku,
    p.name,
    p.category as current_category,
    p.subcategory as current_subcategory,
    p.brand,
    p.is_published,
    lower(p.name) as name_lower,
    lower(coalesce(p.subcategory, '')) as subcategory_lower,
    lower(concat_ws(' ', p.name, p.subcategory, p.materials, p.description)) as haystack_lower
  from public.products p
  where p.category = 'Packaging'
),
suggested as (
  select
    *,
    case
      when haystack_lower ~ '(business card|loyalty card|membership card)'
        then 'Marketing Materials'
      when haystack_lower ~ '(wine carrier|wine carry|wine bag|wine crate|wine gift box|wine pack)'
        then 'Bags'
      when subcategory_lower in ('gift boxes', 'gift boxes & packaging')
        or haystack_lower ~ '(gift box|cardboard box|magnetic box|pen box|presentation box|noodle box|container|rectangular tin|round tin|pillow pack)'
        then 'Packaging'
      when subcategory_lower = 'gift bags'
        or haystack_lower ~ '(gift bag|carry bag|paper gift bag)'
        then 'Packaging'
      when subcategory_lower = 'gift tubes'
        or haystack_lower ~ '(gift tube|tube)'
        then 'Packaging'
      when subcategory_lower = 'pouches'
        or haystack_lower ~ '(pouch|sleeve|drawstring pouch)'
        then 'Packaging'
      when haystack_lower ~ '(tissue paper|wrapping paper|gift wrapping|wrap paper)'
        then 'Packaging'
      when subcategory_lower = 'ribbons'
        or haystack_lower ~ '(ribbon|bow|gift tag|swing tag|hang tag)'
        then 'Packaging'
      when haystack_lower ~ '(greeting card|message card|gift card|thank you card|card a[0-9]|a[0-9] card)'
        then 'Packaging'
      else null
    end as suggested_category,
    case
      when haystack_lower ~ '(business card|loyalty card|membership card)'
        then 'Business Cards'
      when haystack_lower ~ '(wine carrier|wine carry|wine bag|wine crate|wine gift box|wine pack)'
        then 'Wine Carriers'
      when subcategory_lower in ('gift boxes', 'gift boxes & packaging')
        or haystack_lower ~ '(gift box|cardboard box|magnetic box|pen box|presentation box|noodle box|container|rectangular tin|round tin|pillow pack)'
        then 'Gift Boxes'
      when subcategory_lower = 'gift bags'
        or haystack_lower ~ '(gift bag|carry bag|paper gift bag)'
        then 'Gift Bags'
      when subcategory_lower = 'gift tubes'
        or haystack_lower ~ '(gift tube|tube)'
        then 'Gift Tubes'
      when subcategory_lower = 'pouches'
        or haystack_lower ~ '(pouch|sleeve|drawstring pouch)'
        then 'Pouches'
      when haystack_lower ~ '(tissue paper|wrapping paper|gift wrapping|wrap paper)'
        then 'Tissue & Wrapping'
      when subcategory_lower = 'ribbons'
        or haystack_lower ~ '(ribbon|bow|gift tag|swing tag|hang tag)'
        then 'Ribbons & Gift Tags'
      when haystack_lower ~ '(greeting card|message card|gift card|thank you card|card a[0-9]|a[0-9] card)'
        then 'Greeting & Gift Cards'
      else null
    end as suggested_subcategory
  from classified
)
select
  current_category,
  current_subcategory,
  supplier_sku,
  name,
  brand,
  is_published
from suggested
where suggested_category is null
   or suggested_subcategory is null
order by
  current_category,
  current_subcategory,
  name;

-- Packaging normalization APPLY
-- Run only after reviewing packaging_normalization_summary_READONLY.sql.
-- Updates only products with a clear target.
-- Leaves manual-review rows untouched.

begin;

with classified as (
  select
    p.id,
    p.name,
    p.category as current_category,
    p.subcategory as current_subcategory,
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
),
updated as (
  update public.products p
  set
    category = s.suggested_category,
    subcategory = s.suggested_subcategory
  from suggested s
  where p.id = s.id
    and s.suggested_category is not null
    and s.suggested_subcategory is not null
    and (
      p.category is distinct from s.suggested_category
      or p.subcategory is distinct from s.suggested_subcategory
    )
  returning
    p.id,
    p.name,
    s.current_category,
    s.current_subcategory,
    p.category as new_category,
    p.subcategory as new_subcategory,
    p.is_published
)
select
  count(*) as updated_rows,
  count(*) filter (where is_published = true) as updated_published_rows,
  count(*) filter (where new_category = 'Packaging') as updated_to_packaging,
  count(*) filter (where new_category = 'Bags') as updated_to_bags,
  count(*) filter (where new_category = 'Marketing Materials') as updated_to_marketing_materials
from updated;

commit;

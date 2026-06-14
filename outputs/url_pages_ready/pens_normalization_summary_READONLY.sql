-- Pens normalization summary
-- READ ONLY. Run before pens_normalization_apply_UPDATE.sql.
-- Goal:
--   Preview how current Pens / writing products will be normalized for the flat URL pilot.
--   Primary subcategories stay product-type based:
--     Ballpoint Pens, Stylus Pens, Highlighters, Markers, Pencils
--   Metal / Plastic / Eco Pens are SEO filter pages driven by material_tags / is_eco.

with classified as (
  select
    p.id,
    p.name,
    p.category as current_category,
    p.subcategory as current_subcategory,
    p.is_published,
    coalesce(p.is_eco, false) as current_is_eco,
    coalesce(p.material_tags, '{}'::text[]) as current_material_tags,
    concat_ws(' ', p.name, p.subcategory, p.materials) as haystack,
    lower(concat_ws(' ', p.name, p.subcategory, p.materials)) as haystack_lower
  from public.products p
  where p.category = 'Pens'
     or (
      p.category in ('Business', 'Office & Desk')
      and (
        p.name ilike any (array['%highlighter%', '%marker%', '%pencil%'])
        or p.subcategory ilike any (array['%highlighter%', '%marker%', '%pencil%'])
      )
    )
),
suggested as (
  select
    *,
    case
      when haystack_lower ilike any (array['%pencil case%', '%pen holder%', '%pencil pouch%']) then null
      when haystack_lower ilike any (array['%highlighter%']) then 'Pens'
      when haystack_lower ilike any (array['%marker%', '%whiteboard marker%', '%permanent marker%']) then 'Pens'
      when haystack_lower ilike any (array['%pencil%']) then 'Pens'
      when haystack_lower ilike any (array['%stylus%']) then 'Pens'
      when current_category = 'Pens' then 'Pens'
      else null
    end as suggested_category,
    case
      when haystack_lower ilike any (array['%pencil case%', '%pen holder%', '%pencil pouch%']) then null
      when haystack_lower ilike any (array['%highlighter%']) then 'Highlighters'
      when haystack_lower ilike any (array['%marker%', '%whiteboard marker%', '%permanent marker%']) then 'Markers'
      when haystack_lower ilike any (array['%pencil%']) then 'Pencils'
      when haystack_lower ilike any (array['%stylus%']) then 'Stylus Pens'
      when current_category = 'Pens' then 'Ballpoint Pens'
      else null
    end as suggested_subcategory,
    (
      current_subcategory = 'Metal'
      or (
        current_subcategory = 'Deluxe'
        and not (haystack_lower ilike any (array['%highlighter%', '%marker%', '%pencil%']))
      )
      or (
        current_subcategory not in ('Highlighters', 'Bamboo', 'Paper', 'Wood', 'Plastic')
        and not (haystack_lower ilike any (array['%highlighter%', '%marker%', '%pencil%']))
        and haystack_lower ~ '(aluminium|aluminum|stainless steel|brass|metal|chrome)'
      )
    ) as has_metal_signal,
    (
      current_subcategory = 'Plastic'
      or (
        current_subcategory = 'Stylus'
        and haystack_lower ~ '(^|[^a-z])(abs|pp|pet|rpet)([^a-z]|$)|(plastic|polypropylene|polycarbonate|recycled pet|recycled plastic)'
      )
    ) as has_plastic_signal,
    (
      current_is_eco = true
      or current_subcategory in ('Bamboo', 'Paper', 'Wood')
      or haystack_lower ~ '(bamboo|cork|recycled|rpet|recycled pet|wheat straw|paper|cardboard|wood|wooden)'
    ) as has_eco_signal
  from classified
)
select
  coalesce(current_category, '(blank)') as current_category,
  coalesce(current_subcategory, '(blank)') as current_subcategory,
  coalesce(suggested_category, '(manual review)') as suggested_category,
  coalesce(suggested_subcategory, '(manual review)') as suggested_subcategory,
  count(*) as total_products,
  count(*) filter (where is_published = true) as published_products,
  count(*) filter (where suggested_subcategory is null) as manual_review_products,
  count(*) filter (where has_metal_signal and not current_material_tags @> array['metal']) as will_add_metal_tag,
  count(*) filter (where has_plastic_signal and not current_material_tags @> array['plastic']) as will_add_plastic_tag,
  count(*) filter (where has_eco_signal and current_is_eco = false) as will_set_eco_true,
  (array_agg(name order by name))[1:5] as example_products
from suggested
group by
  current_category,
  current_subcategory,
  suggested_category,
  suggested_subcategory
order by
  manual_review_products desc,
  published_products desc,
  total_products desc,
  current_category,
  current_subcategory;

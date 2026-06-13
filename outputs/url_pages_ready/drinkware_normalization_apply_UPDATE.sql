-- Drinkware normalization APPLY
-- Run only after reviewing drinkware_normalization_corrected_summary_READONLY.sql.
-- Updates products.subcategory for Drinkware only.
-- Leaves manual_review rows untouched:
--   - Drinkware Presentation
--   - food container products

begin;

with classified as (
  select
    id,
    subcategory as current_subcategory,
    case
      when subcategory = 'Drinkware Presentation' then null
      when name ilike any (array['%food container%']) then null

      when name ilike any (array['%teapot%', '%tea pot%', '%tea box%', '%tea infuser%', '%coffee plunger%', '%plunger%']) then 'Teaware'

      when subcategory = 'Ceramic Mugs' then 'Mugs'
      when subcategory = 'Sports Shakers' then 'Drink Bottles'

      when subcategory ilike 'Drink Bottles%' and name ilike any (array['%tumbler%']) then 'Tumblers'
      when subcategory ilike 'Drink Bottles%' then 'Drink Bottles'

      when subcategory = 'Coffee Cups' then 'Coffee Cups'
      when subcategory = 'Travel Mugs' then 'Travel Mugs'
      when subcategory = 'Flasks' then 'Flasks'
      when subcategory = 'Glassware' then 'Glassware'
      when subcategory = 'Teaware' then 'Teaware'

      when subcategory = 'Cups & Tumblers'
        and name ilike any (array[
          '%wine glass%', '%beer glass%', '%cocktail glass%', '%whiskey glass%',
          '%whisky glass%', '%flute%', '%hiball%', '%hi ball%', '%low ball%',
          '%glass set%', '%glass cup%', '%carafe%', '%bormioli%', '%bordeaux%',
          '%chardonnay%', '%cognac%'
        ])
        then 'Glassware'

      when subcategory = 'Cups & Tumblers'
        and name ilike any (array['%mug%'])
        and name not ilike any (array['%vacuum mug%', '%travel mug%'])
        then 'Mugs'

      when subcategory = 'Cups & Tumblers'
        and name ilike any (array['%coffee cup%', '%keep cup%', '%keepcup%', '%reusable cup%'])
        then 'Coffee Cups'

      when subcategory = 'Cups & Tumblers'
        and name ilike any (array['%vacuum mug%', '%travel mug%'])
        then 'Travel Mugs'

      when subcategory = 'Cups & Tumblers'
        and name ilike any (array['%tumbler%', '%vacuum cup%', '%double wall cup%', '%colour changing cup%', '%color changing cup%'])
        then 'Tumblers'

      when subcategory = 'Cups & Tumblers'
        and name ilike any (array['%cup%'])
        then 'Coffee Cups'

      else subcategory
    end as suggested_subcategory
  from public.products
  where category = 'Drinkware'
),
updated as (
  update public.products p
  set subcategory = c.suggested_subcategory
  from classified c
  where p.id = c.id
    and c.suggested_subcategory is not null
    and p.subcategory is distinct from c.suggested_subcategory
  returning
    p.id,
    p.name,
    c.current_subcategory,
    p.subcategory as new_subcategory,
    p.is_published
)
select
  count(*) as updated_rows,
  count(*) filter (where is_published = true) as updated_published_rows
from updated;

commit;


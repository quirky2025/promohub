-- Headwear normalization summary
-- READ ONLY. Run before headwear_normalization_apply_UPDATE.sql.
-- Goal:
--   Preview Headwear cleanup for the flat URL rollout.
--   Headwear should only contain true headwear products.
--   Old "Headwear Accessories" rows are split by product nature:
--     scarves / gloves / ties / scrunchies -> Apparel > Scarves & Accessories
--     headlamps / torches -> Tools & Auto > Torches & Lights

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
  where p.category = 'Headwear'
),
suggested as (
  select
    *,
    case
      when name_lower ~ 'sherpa headwear'
        then 'Headwear'
      when subcategory_lower = 'scarves'
        or haystack_lower ~ '(scarf|glove|scrunchie|hair)'
        or (
          haystack_lower ~ '(^|[^a-z])(tie|ties)([^a-z]|$)'
          and haystack_lower !~ 'tie[- ]?dye'
        )
        then 'Apparel'
      when haystack_lower ~ '(headlamp|head lamp|torch|flashlight)'
        and name_lower !~ 'beanie'
        then 'Tools & Auto'
      when subcategory_lower in (
        'caps',
        'headwear express',
        'sports',
        'school headwear',
        'beanies',
        'bucket hats',
        'wide brim hats',
        'straw hats',
        'visors',
        'novelty headwear'
      )
        or haystack_lower ~ '(cap|caps|trucker|snapback|baseball|5[- ]?panel|6[- ]?panel|sandwich peak|beanie|pom pom|bucket hat|wide brim|broad brim|legionnaire|school hat|straw hat|visor|santa hat|bandana|headband)'
        then 'Headwear'
      else null
    end as suggested_category,
    case
      when name_lower ~ 'sherpa headwear'
        then 'Beanies'
      when subcategory_lower = 'scarves'
        or haystack_lower ~ '(scarf|glove|scrunchie|hair)'
        or (
          haystack_lower ~ '(^|[^a-z])(tie|ties)([^a-z]|$)'
          and haystack_lower !~ 'tie[- ]?dye'
        )
        then 'Scarves & Accessories'
      when haystack_lower ~ '(headlamp|head lamp|torch|flashlight)'
        and name_lower !~ 'beanie'
        then 'Torches & Lights'
      when subcategory_lower = 'visors' or haystack_lower ~ '(^|[^a-z])visors?([^a-z]|$)'
        then 'Visors'
      when subcategory_lower = 'beanies' or haystack_lower ~ '(beanie|pom pom)'
        then 'Beanies'
      when subcategory_lower = 'bucket hats' or haystack_lower ~ 'bucket hat'
        then 'Bucket Hats'
      when subcategory_lower = 'wide brim hats' or haystack_lower ~ '(wide brim|broad brim|legionnaire|school hat)'
        then 'Wide Brim Hats'
      when subcategory_lower = 'straw hats' or haystack_lower ~ 'straw hat'
        then 'Straw Hats'
      when subcategory_lower = 'novelty headwear' or haystack_lower ~ '(santa hat|bandana|headband|novelty)'
        then 'Novelty Headwear'
      when subcategory_lower in ('caps', 'headwear express', 'sports')
        or haystack_lower ~ '(^|[^a-z])caps?([^a-z]|$)'
        or haystack_lower ~ '(trucker|snapback|baseball|5[- ]?panel|6[- ]?panel|sandwich peak)'
        then 'Caps'
      else null
    end as suggested_subcategory
  from classified
)
select
  coalesce(current_category, '(blank)') as current_category,
  coalesce(current_subcategory, '(blank)') as current_subcategory,
  coalesce(suggested_category, '(manual review)') as suggested_category,
  coalesce(suggested_subcategory, '(manual review)') as suggested_subcategory,
  count(*) as total_products,
  count(*) filter (where is_published = true) as published_products,
  count(*) filter (where suggested_category is null or suggested_subcategory is null) as manual_review_products,
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

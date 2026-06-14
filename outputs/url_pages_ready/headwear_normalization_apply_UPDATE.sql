-- Headwear normalization APPLY
-- Run only after reviewing headwear_normalization_summary_READONLY.sql.
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
  count(*) filter (where new_category = 'Headwear') as updated_to_headwear,
  count(*) filter (where new_category = 'Apparel') as updated_to_apparel,
  count(*) filter (where new_category = 'Tools & Auto') as updated_to_tools_auto
from updated;

commit;

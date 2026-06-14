-- Tools & Auto normalization summary
-- READ ONLY. Run before tools_auto_normalization_apply_UPDATE.sql.
-- Goal:
--   Preview Tools & Auto cleanup for the flat URL rollout.
--   Tools & Auto keeps:
--     Multi-Tools / Tape Measures / Torches & Lights / Tool Sets & Screwdrivers / Car Accessories.
--   Boundaries:
--     car chargers and phone mounts -> Technology
--     ordinary carabiners / gear clips -> Outdoor & Sports
--     carabiner keyrings -> Key Rings

with base as (
  select
    p.id,
    p.supplier_sku,
    p.name,
    p.category as current_category,
    p.subcategory as current_subcategory,
    p.is_published,
    lower(p.name) as name_lower,
    lower(coalesce(p.category, '')) as category_lower,
    lower(coalesce(p.subcategory, '')) as subcategory_lower,
    lower(concat_ws(' ', p.name, p.category, p.subcategory, p.materials, p.description)) as haystack_lower
  from public.products p
),
classified as (
  select *
  from base
  where category_lower = 'tools & auto'
    or (
      category_lower = 'leisure'
      and subcategory_lower = 'tools'
    )
    or (
      category_lower in (
        'outdoor & sports',
        'home & living',
        'barware & accessories',
        'headwear',
        'technology',
        'promotion'
      )
      and name_lower ~ '(multi[-\s]?tool|multi\s+tool|tool\s+card|pocket\s+knife|utility\s+knife|screwdriver|tool\s+set|tool\s+kit|repair\s+kit|tape\s+measure|measure\s+tape|measuring\s+tape|vernier|caliper|torch|flashlight|headlamp|cob\s+lantern|cob\s+light|work\s+light|inspection\s+light|car\s+sunshade|sunshade\s+set|car\s+shade|air\s+freshener|ice\s+scraper|car\s+organiser|car\s+organizer|car\s+safety|vehicle\s+safety|tyre\s+gauge|tire\s+gauge|car\s+charger|car\s+usb|phone\s+(holder|mount|stand)|carabiner)'
    )
),
suggested as (
  select
    *,
    case
      when category_lower = 'barware & accessories'
        and name_lower ~ 'bottle\s+opener'
        then 'Barware & Accessories'
      when category_lower = 'headwear'
        and name_lower = 'headlamp beanie'
        then 'Headwear'
      when name_lower ~ '(wireless.*charg|charg.*wireless|qi\s+charg|magsafe)'
        then 'Technology'
      when name_lower ~ '(car\s+charger|car\s+usb|usb\s+car|charging|charger)'
        then 'Technology'
      when name_lower ~ 'phone\s+(holder|mount|stand|grip)'
        then 'Technology'
      when name_lower ~ '(carabiner\s+key|key\s*ring|keyring|keychain)'
        then 'Key Rings'
      when name_lower ~ '(carabiner|gear\s+clip)'
        and name_lower !~ '(multi[-\s]?tool|multi\s+tool|tool)'
        then 'Outdoor & Sports'
      when name_lower ~ '(multi[-\s]?tool|multi\s+tool|tool\s+card|pocket\s+knife|utility\s+knife)'
        then 'Tools & Auto'
      when name_lower ~ '(tape\s+measure|measure\s+tape|measuring\s+tape|vernier|caliper)'
        then 'Tools & Auto'
      when name_lower ~ '(torch|flashlight|headlamp|cob\s+lantern|cob\s+light|work\s+light|inspection\s+light)'
        then 'Tools & Auto'
      when name_lower ~ '(screwdriver|tool\s+set|tool\s+kit|repair\s+kit|driver\s+set|bit\s+set)'
        then 'Tools & Auto'
      when name_lower ~ '(car\s+sunshade|sunshade\s+set|car\s+shade|air\s+freshener|ice\s+scraper|car\s+organiser|car\s+organizer|car\s+safety|vehicle\s+safety|tyre\s+gauge|tire\s+gauge)'
        then 'Tools & Auto'
      when subcategory_lower in ('multi-tools', 'tape measures', 'torches & lights', 'tool sets & screwdrivers', 'car accessories')
        then 'Tools & Auto'
      else null
    end as suggested_category,
    case
      when category_lower = 'barware & accessories'
        and name_lower ~ 'bottle\s+opener'
        then 'Bottle Openers'
      when category_lower = 'headwear'
        and name_lower = 'headlamp beanie'
        then 'Beanies'
      when name_lower ~ '(wireless.*charg|charg.*wireless|qi\s+charg|magsafe)'
        then 'Wireless Chargers'
      when name_lower ~ '(car\s+charger|car\s+usb|usb\s+car|charging|charger)'
        then 'Charging Cables & Chargers'
      when name_lower ~ 'phone\s+(holder|mount|stand|grip)'
        then 'Phone Accessories'
      when name_lower ~ '(carabiner\s+key|key\s*ring|keyring|keychain)'
        then 'Functional Key Rings'
      when name_lower ~ '(carabiner|gear\s+clip)'
        and name_lower !~ '(multi[-\s]?tool|multi\s+tool|tool)'
        then 'Camping & Outdoors'
      when name_lower ~ '(multi[-\s]?tool|multi\s+tool|tool\s+card|pocket\s+knife|utility\s+knife)'
        then 'Multi-Tools'
      when name_lower ~ '(tape\s+measure|measure\s+tape|measuring\s+tape|vernier|caliper)'
        then 'Tape Measures'
      when name_lower ~ '(torch|flashlight|headlamp|cob\s+lantern|cob\s+light|work\s+light|inspection\s+light)'
        then 'Torches & Lights'
      when name_lower ~ '(screwdriver|tool\s+set|tool\s+kit|repair\s+kit|driver\s+set|bit\s+set)'
        then 'Tool Sets & Screwdrivers'
      when name_lower ~ '(car\s+sunshade|sunshade\s+set|car\s+shade|air\s+freshener|ice\s+scraper|car\s+organiser|car\s+organizer|car\s+safety|vehicle\s+safety|tyre\s+gauge|tire\s+gauge)'
        then 'Car Accessories'
      when subcategory_lower = 'multi-tools'
        then 'Multi-Tools'
      when subcategory_lower = 'tape measures'
        then 'Tape Measures'
      when subcategory_lower = 'torches & lights'
        then 'Torches & Lights'
      when subcategory_lower = 'tool sets & screwdrivers'
        then 'Tool Sets & Screwdrivers'
      when subcategory_lower = 'car accessories'
        then 'Car Accessories'
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

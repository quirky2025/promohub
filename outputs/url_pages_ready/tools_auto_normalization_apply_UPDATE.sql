-- Tools & Auto normalization APPLY
-- Run only after reviewing tools_auto_normalization_summary_READONLY.sql.
-- Updates only products with a clear target.
-- Leaves manual-review rows untouched.

begin;

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
    lower(coalesce(p.subcategory, '')) as subcategory_lower
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
  count(*) filter (where new_category = 'Tools & Auto') as updated_to_tools_auto,
  count(*) filter (where new_category = 'Technology') as updated_to_technology,
  count(*) filter (where new_category = 'Outdoor & Sports') as updated_to_outdoor_sports,
  count(*) filter (where new_category = 'Key Rings') as updated_to_key_rings
from updated;

commit;

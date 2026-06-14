-- Technology normalization summary
-- READ ONLY. Run before technology_normalization_apply_UPDATE.sql.
-- Goal:
--   Preview Technology cleanup for the flat URL pilot.
--   Keeps one primary subcategory per product.
--   Tech Accessories is white-list only; unclear items stay manual review.

with classified as (
  select
    p.id,
    p.name,
    p.category as current_category,
    p.subcategory as current_subcategory,
    p.is_published,
    lower(p.name) as name_lower,
    lower(concat_ws(' ', p.name, p.subcategory, p.materials, p.description)) as haystack_lower
  from public.products p
  where p.category = 'Technology'
     or (
      p.category in ('Business', 'Office', 'Office & Desk')
      and lower(concat_ws(' ', p.name, p.subcategory)) ~
        '(power ?bank|powerbank|portable charger|wireless charger|qi charger|magsafe|charging pad|bluetooth speaker|portable speaker|wireless speaker|earbud|earphone|headphone|airpod|usb flash|flash drive|memory stick|thumb drive|charging cable|usb cable|wall charger|car charger|multi cable|3[- ]?in[- ]?1|phone stand|phone holder|phone grip|phone wallet|phone mount|popsocket|ring holder|webcam cover|screen clean|microfibre|mouse ?(pad|mat)|usb hub|cable (tidy|organiser))'
    )
),
signals as (
  select
    *,
    (
      name_lower ~ '(gift set|tech kit|bundle|hamper|welcome kit)'
    ) as has_kit_signal,
    (
      name_lower ~ '(stylus)'
      and name_lower ~ '(^|[^a-z])pen([^a-z]|$)'
    ) as has_stylus_pen_signal,
    (
      name_lower ~ '(^|[^a-z])car([^a-z]|$)'
      and not (name_lower ~ '(car charger|car phone|car mount|vehicle phone|phone mount|air vent)')
    ) as has_unclear_car_signal,
    (
      name_lower ~ '(torch|flashlight|headlamp|inspection light|work light)'
    ) as has_tool_light_signal,
    (
      lower(coalesce(current_subcategory, '')) like '%power bank%'
      or name_lower ~ '(power ?bank|powerbank|portable charger)'
    ) as is_power_bank,
    (
      lower(coalesce(current_subcategory, '')) like '%wireless charger%'
      or name_lower ~ '(wireless charger|qi charger|magsafe|charging pad|wireless charging (pad|stand|phone holder|phone stand|phone mount|dock|station))'
    ) as is_wireless_charger,
    (
      lower(coalesce(current_subcategory, '')) like '%speaker%'
      or name_lower like '%speaker%'
      or name_lower ~ '(bluetooth speaker|portable speaker|wireless speaker)'
    ) as is_speaker,
    (
      lower(coalesce(current_subcategory, '')) like '%earbud%'
      or lower(coalesce(current_subcategory, '')) like '%headphone%'
      or name_lower ~ '(earbud|earphone|headphone|tws|airpod)'
    ) as is_audio,
    (
      lower(coalesce(current_subcategory, '')) like '%flash drive%'
      or name_lower ~ '(usb flash|usb drive|flash drive|memory stick|thumb drive|rotate usb)'
    ) as is_usb_flash,
    (
      lower(coalesce(current_subcategory, '')) like '%charging cable%'
      or lower(coalesce(current_subcategory, '')) like '%car usb%'
      or lower(coalesce(current_subcategory, '')) = 'chargers'
      or (
        name_lower ~ '(charging cable|usb cable|data cable|multi cable|[3-6][ -]?in[ -]?1 (charging )?cable|wall charger|car charger|adapter)'
        and not (name_lower ~ '(wireless charger|qi charger|magsafe|charging pad)')
      )
    ) as is_cable_or_charger,
    (
      lower(coalesce(current_subcategory, '')) like '%phone wallet%'
      or lower(coalesce(current_subcategory, '')) like '%stand%'
      or lower(coalesce(current_subcategory, '')) like '%holder%'
      or lower(coalesce(current_subcategory, '')) like '%phone accessories%'
      or name_lower ~ '((phone|tablet).*(stand|holder|grip|wallet|mount|pouch)|(stand|holder|grip|wallet|mount|pouch).*(phone|tablet)|popsocket|ring holder|card holder.*phone|air vent.*phone)'
    ) as is_phone_accessory,
    (
      lower(coalesce(current_subcategory, '')) like '%mouse mat%'
      or lower(coalesce(current_subcategory, '')) like '%screen clean%'
      or lower(coalesce(current_subcategory, '')) like '%usb hub%'
      or lower(coalesce(current_subcategory, '')) like '%tech access%'
      or lower(coalesce(current_subcategory, '')) like '%sleeve%'
      or lower(coalesce(current_subcategory, '')) like '%case%'
      or name_lower ~ '(webcam cover|screen clean|microfibre|mouse ?(pad|mat)|usb hub|cable (tidy|organiser)|cable pouch|cable bag|laptop sleeve|laptop case|tablet case|carry case|tech pouch|accessory pouch)'
    ) as is_known_tech_accessory
  from classified
),
suggested as (
  select
    *,
    case
      when has_kit_signal or has_stylus_pen_signal or has_unclear_car_signal or has_tool_light_signal then null
      when is_wireless_charger then 'Wireless Chargers'
      when is_phone_accessory then 'Phone Accessories'
      when is_speaker then 'Bluetooth Speakers'
      when is_audio then 'Earbuds & Headphones'
      when is_power_bank then 'Power Banks'
      when is_usb_flash then 'USB Flash Drives'
      when is_cable_or_charger then 'Charging Cables & Chargers'
      when is_known_tech_accessory then 'Tech Accessories'
      else null
    end as suggested_subcategory
  from signals
)
select
  coalesce(current_category, '(blank)') as current_category,
  coalesce(current_subcategory, '(blank)') as current_subcategory,
  'Technology' as suggested_category,
  coalesce(suggested_subcategory, '(manual review)') as suggested_subcategory,
  count(*) as total_products,
  count(*) filter (where is_published = true) as published_products,
  count(*) filter (where suggested_subcategory is null) as manual_review_products,
  (array_agg(name order by name))[1:5] as example_products
from suggested
group by
  current_category,
  current_subcategory,
  suggested_subcategory
order by
  manual_review_products desc,
  published_products desc,
  total_products desc,
  current_category,
  current_subcategory;

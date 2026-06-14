-- Technology manual review list
-- READ ONLY. Run after technology_normalization_summary_READONLY.sql if manual review rows appear.

with classified as (
  select
    p.id,
    p.supplier_sku,
    p.name,
    p.brand,
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
suggested as (
  select
    *,
    case
      when lower(name) ~ '(gift set|tech kit|bundle|hamper|welcome kit)' then null
      when name_lower ~ '(stylus)' and name_lower ~ '(^|[^a-z])pen([^a-z]|$)' then null
      when name_lower ~ '(^|[^a-z])car([^a-z]|$)'
        and not (name_lower ~ '(car charger|car phone|car mount|vehicle phone|phone mount|air vent)')
        then null
      when name_lower ~ '(torch|flashlight|headlamp|inspection light|work light)' then null
      when lower(coalesce(current_subcategory, '')) like '%wireless charger%'
        or name_lower ~ '(wireless charger|qi charger|magsafe|charging pad|wireless charging (pad|stand|phone holder|phone stand|phone mount|dock|station))'
        then 'Wireless Chargers'
      when lower(coalesce(current_subcategory, '')) like '%phone wallet%'
        or lower(coalesce(current_subcategory, '')) like '%stand%'
        or lower(coalesce(current_subcategory, '')) like '%holder%'
        or lower(coalesce(current_subcategory, '')) like '%phone accessories%'
        or name_lower ~ '((phone|tablet).*(stand|holder|grip|wallet|mount|pouch)|(stand|holder|grip|wallet|mount|pouch).*(phone|tablet)|popsocket|ring holder|card holder.*phone|air vent.*phone)'
        then 'Phone Accessories'
      when lower(coalesce(current_subcategory, '')) like '%speaker%'
        or lower(name) like '%speaker%'
        or name_lower ~ '(bluetooth speaker|portable speaker|wireless speaker)'
        then 'Bluetooth Speakers'
      when lower(coalesce(current_subcategory, '')) like '%earbud%'
        or lower(coalesce(current_subcategory, '')) like '%headphone%'
        or name_lower ~ '(earbud|earphone|headphone|tws|airpod)'
        then 'Earbuds & Headphones'
      when lower(coalesce(current_subcategory, '')) like '%power bank%'
        or name_lower ~ '(power ?bank|powerbank|portable charger)'
        then 'Power Banks'
      when lower(coalesce(current_subcategory, '')) like '%flash drive%'
        or name_lower ~ '(usb flash|usb drive|flash drive|memory stick|thumb drive|rotate usb)'
        then 'USB Flash Drives'
      when lower(coalesce(current_subcategory, '')) like '%charging cable%'
        or lower(coalesce(current_subcategory, '')) like '%car usb%'
        or lower(coalesce(current_subcategory, '')) = 'chargers'
        or (
          name_lower ~ '(charging cable|usb cable|data cable|multi cable|[3-6][ -]?in[ -]?1 (charging )?cable|wall charger|car charger|adapter)'
          and not (name_lower ~ '(wireless charger|qi charger|magsafe|charging pad)')
        )
        then 'Charging Cables & Chargers'
      when lower(coalesce(current_subcategory, '')) like '%mouse mat%'
        or lower(coalesce(current_subcategory, '')) like '%screen clean%'
        or lower(coalesce(current_subcategory, '')) like '%usb hub%'
        or lower(coalesce(current_subcategory, '')) like '%tech access%'
        or lower(coalesce(current_subcategory, '')) like '%sleeve%'
        or lower(coalesce(current_subcategory, '')) like '%case%'
        or name_lower ~ '(webcam cover|screen clean|microfibre|mouse ?(pad|mat)|usb hub|cable (tidy|organiser)|cable pouch|cable bag|laptop sleeve|laptop case|tablet case|carry case|tech pouch|accessory pouch)'
        then 'Tech Accessories'
      else null
    end as suggested_subcategory,
    case
      when lower(name) ~ '(gift set|tech kit|bundle|hamper|welcome kit)' then 'kit_or_bundle'
      when name_lower ~ '(stylus)' and name_lower ~ '(^|[^a-z])pen([^a-z]|$)' then 'stylus_pen_check_pens'
      when name_lower ~ '(^|[^a-z])car([^a-z]|$)'
        and not (name_lower ~ '(car charger|car phone|car mount|vehicle phone|phone mount|air vent)')
        then 'unclear_car_item'
      when name_lower ~ '(torch|flashlight|headlamp|inspection light|work light)' then 'tool_light_check_tools_auto'
      else 'no_clear_technology_rule'
    end as review_reason
  from classified
)
select
  concat_ws(
    ' | ',
    current_category || ' / ' || coalesce(current_subcategory, '(blank)'),
    coalesce(supplier_sku, '(no sku)'),
    name,
    'reason=' || review_reason
  ) as manual_review_item
from suggested
where suggested_subcategory is null
order by current_category, current_subcategory, name;

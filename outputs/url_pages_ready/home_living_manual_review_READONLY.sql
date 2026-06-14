-- Home & Living manual review list
-- READ ONLY. Run only if home_living_normalization_summary_READONLY.sql shows manual_review_products > 0.

with classified as (
  select
    p.id,
    p.supplier_sku,
    p.name,
    p.category as current_category,
    p.subcategory as current_subcategory,
    p.is_published,
    lower(p.name) as name_lower,
    lower(coalesce(p.subcategory, '')) as subcategory_lower,
    lower(concat_ws(' ', p.name, p.subcategory, p.materials, p.description)) as haystack_lower
  from public.products p
  where p.category = 'Home & Living'
    or (
      p.category = 'Leisure'
      and lower(coalesce(p.subcategory, '')) in (
        'home & living',
        'kitchen & home',
        'kitchen & dining',
        'candles',
        'cheese boards'
      )
    )
    or (
      p.category = 'Personal Care'
      and lower(coalesce(p.subcategory, '')) = 'candles & diffusers'
    )
),
suggested as (
  select
    *,
    case
      when supplier_sku in (
        '124699', '122319', '122320', '124805', '122438', '122437', '122436',
        '120339', '122271', '122272', '122279', '126521', '120847', '126685',
        '126686', '118120', '118121', '118122', '126682', '122317', '120901',
        '129574', '124417', '110518', '109062', '117757', '123704', '123703',
        '120240', '116799', '116039'
      )
        then 'mapped'
      when haystack_lower ~ '(toiletry\s+bag|cosmetic\s+bag|makeup\s+bag|wash\s+bag|cooler\s+bag|lunch\s+bag)'
        then 'mapped'
      when haystack_lower ~ '(car\s+sunshade|sunshade\s+set|car\s+shade|soap\s+holder|bath\s+caddy)'
        then 'mapped'
      when haystack_lower ~ '(^|[^a-z])(pet|dog|cat|leash)([^a-z]|$)|pet\s+bandana|pet\s+bowl'
        then 'mapped'
      when haystack_lower ~ '(coaster|bottle\s+opener|corkscrew|waiter''?s\s+knife|bar\s+mat|stubby|can\s+holder|koozie|wine\s+cooler|wine\s+rack|wine\s+table|wine\s+accessor|whisk(e)?y|hip\s+flask|ice\s+bucket|drinking\s+straw|reusable\s+straw|cocktail\s+straw|straw\s+set|cocktail|swizzle)'
        then 'mapped'
      when haystack_lower ~ '(beach\s+towel|sports?\s+towel|gym\s+towel|sand\s+free|towel|puffer\s+blanket|picnic\s+blanket|outdoor\s+blanket|beach\s+blanket|travel\s+blanket|yoga\s+mat|exercise\s+mat|picnic|bbq|barbecue)'
        then 'mapped'
      when subcategory_lower in ('candles & diffusers', 'candles', 'cheese & serving boards', 'cheese boards', 'kitchen & dining', 'kitchen & home', 'home decor')
        then 'mapped'
      when haystack_lower ~ '(candle|diffuser|aroma|scented|cheese\s+board|serving\s+board|serveware|charcuterie|tasting\s+board|pizza\s+peel|lazy\s+susan|fromage|tapas|cheese\s+knife|carving\s+set|kitchen|cutting\s+board|chopping\s+board|knife\s+set|cutlery|utensil|lunch\s+box|bento|food\s+container|placemat|tea\s+towel|dish\s+cloth|ice\s+tray|coffee\s+plunger|coffee\s+press|french\s+press|oven\s+mitt|sponge|place\s*mat|lamp|lantern|night\s+light|photo\s+frame|picture\s+frame|cushion|pillow|home\s+decor|decorative|valet\s+tray|sewing\s+kit|weather\s+station)'
        then 'mapped'
      else null
    end as mapped_status
  from classified
)
select
  concat(
    current_category,
    ' / ',
    coalesce(current_subcategory, '(blank)'),
    ' | ',
    coalesce(supplier_sku, '(no sku)'),
    ' | ',
    name
  ) as manual_review_item
from suggested
where mapped_status is null
order by current_category, current_subcategory, name;

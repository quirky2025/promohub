-- Legacy category residue manual review
-- READ ONLY. Run if legacy_residue_normalization_summary_READONLY.sql shows manual_review_products > 0.
-- These rows are intentionally NOT updated by legacy_residue_normalization_apply_UPDATE.sql.

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
    lower(concat_ws(' ', p.name, p.category, p.subcategory, p.materials, p.description)) as haystack_lower,
    lower(concat_ws(' ', p.name, p.materials, p.description)) as product_text_lower
  from public.products p
  where lower(coalesce(p.category, '')) in (
    'business',
    'print',
    'promotion',
    'promotional',
    'leisure',
    'personal'
  )
),
suggested as (
  select
    *,
    case
      when category_lower = 'print' and subcategory_lower = 'signage' and name_lower ~ '(feather|tear\s*drop|teardrop|flag)' then 'Flags & Displays'
      when category_lower = 'print' and subcategory_lower = 'signage' and name_lower ~ '(pull\s*up|banner)' then 'Flags & Displays'
      when category_lower = 'print' and subcategory_lower = 'signage' and name_lower ~ '(media\s*wall|backdrop|background\s*wall)' then 'Flags & Displays'
      when category_lower = 'print' and subcategory_lower = 'signage' and name_lower ~ '(table\s*cover|table\s*cloth|table\s*runner)' then 'Flags & Displays'
      when category_lower = 'print' and subcategory_lower = 'signage' and name_lower ~ '(a[-\s]?frame|core\s*flute|corflute|signage|\msign\M)' then 'Flags & Displays'
      when category_lower = 'print' and subcategory_lower = 'signage' and name_lower ~ '(marquee|tent|canopy)' then 'Flags & Displays'
      when category_lower = 'print' and subcategory_lower in ('ad labels', 'labels', 'stickers') then 'Marketing Materials'
      when category_lower = 'print' and subcategory_lower in ('resin labels', 'resin label') then 'Marketing Materials'
      when category_lower = 'print' and subcategory_lower in ('business cards', 'business card') and name_lower ~ '(business\s+card|loyalty\s+card)' then 'Marketing Materials'
      when category_lower = 'promotion' and subcategory_lower in ('stress items', 'stress toys', 'stress balls') then 'Toys & Games'
      when category_lower = 'promotion' and subcategory_lower in ('plush toys', 'plush') then 'Toys & Games'
      when category_lower = 'leisure' and subcategory_lower in ('wooden models', 'wooden toys') then 'Toys & Games'
      when category_lower = 'leisure' and subcategory_lower in ('games & puzzles', 'games and puzzles', 'games') then 'Toys & Games'
      when category_lower = 'leisure' and subcategory_lower in ('beach balls', 'beach ball') then 'Toys & Games'
      when category_lower = 'leisure' and subcategory_lower like 'fidget%' then 'Toys & Games'
      when category_lower in ('promotion', 'promotional') and subcategory_lower in ('promotion', 'promotional') and haystack_lower ~ '(flyer|frisbee|flying\s*disc|beach\s*ball)' then 'Toys & Games'
      when category_lower in ('promotion', 'promotional') and subcategory_lower in ('promotion', 'promotional') and haystack_lower ~ '(fidget|puzzle|popper)' then 'Toys & Games'
      when category_lower = 'promotion' and subcategory_lower in ('magnets', 'magnet') then 'Giveaways & Event Accessories'
      when category_lower = 'promotion' and subcategory_lower in ('wristbands', 'wrist bands', 'wristband') then 'Giveaways & Event Accessories'
      when category_lower = 'promotion' and subcategory_lower in ('badges', 'badge') then 'Giveaways & Event Accessories'
      when category_lower = 'promotion' and subcategory_lower in ('temporary tattoos', 'temporary tattoo') then 'Giveaways & Event Accessories'
      when category_lower in ('promotion', 'promotional') and subcategory_lower in ('promotion', 'promotional') and haystack_lower ~ '(balloon)' then 'Giveaways & Event Accessories'
      when category_lower in ('promotion', 'promotional') and subcategory_lower in ('promotion', 'promotional') and haystack_lower ~ '(woven\s+patch|patch|sticker|decal)' then 'Giveaways & Event Accessories'
      when category_lower in ('promotion', 'promotional') and subcategory_lower in ('promotion', 'promotional') and haystack_lower ~ '(bookmark|magnifier|piggy|money\s*box|stocking)' then 'Giveaways & Event Accessories'
      when category_lower = 'leisure' and subcategory_lower in ('pet accessories', 'pet accessory', 'pet') then 'Pet'
      when category_lower = 'leisure' and subcategory_lower in ('candles & diffusers', 'candles and diffusers', 'candles') then 'Home & Living'
      when category_lower = 'leisure' and subcategory_lower in ('cheese & serving boards', 'cheese and serving boards', 'cheese boards') then 'Home & Living'
      else null
    end as suggested_category,
    case
      when category_lower = 'print' and subcategory_lower in ('business cards', 'business card') and name_lower !~ '(business\s+card|loyalty\s+card)' then 'manual: print/card item is not clearly a business card'
      when category_lower in ('promotion', 'promotional') and subcategory_lower in ('promotion', 'promotional') then 'manual: mixed promotion bucket'
      when category_lower = 'print' and subcategory_lower = 'signage' then 'manual: signage product did not match display rules'
      else 'manual: old hidden category residue'
    end as review_reason
  from base
)
select
  coalesce(current_category, '(blank)') as current_category,
  coalesce(current_subcategory, '(blank)') as current_subcategory,
  supplier_sku,
  name,
  is_published,
  review_reason,
  coalesce(current_category, '(blank)') || ' / ' || coalesce(current_subcategory, '(blank)') || ' | ' ||
    coalesce(supplier_sku, '(no sku)') || ' | ' || name as manual_review_item
from suggested
where suggested_category is null
order by
  current_category,
  current_subcategory,
  name;

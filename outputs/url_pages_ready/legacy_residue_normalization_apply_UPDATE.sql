-- Legacy category residue normalization APPLY
-- Run only after reviewing legacy_residue_normalization_summary_READONLY.sql.
-- This drains clear old hidden category rows into the LOCKED category tree.
-- Manual review rows are intentionally left untouched.
-- NOTE: public.products has no updated_at column in this project, so this does not set updated_at.

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
      when category_lower = 'print' and subcategory_lower = 'signage' and name_lower ~ '(feather|tear\s*drop|teardrop|flag)' then 'Feather & Teardrop Flags'
      when category_lower = 'print' and subcategory_lower = 'signage' and name_lower ~ '(pull\s*up|banner)' then 'Pull Up Banners'
      when category_lower = 'print' and subcategory_lower = 'signage' and name_lower ~ '(media\s*wall|backdrop|background\s*wall)' then 'Media Walls'
      when category_lower = 'print' and subcategory_lower = 'signage' and name_lower ~ '(table\s*cover|table\s*cloth|table\s*runner)' then 'Table Covers'
      when category_lower = 'print' and subcategory_lower = 'signage' and name_lower ~ '(a[-\s]?frame|core\s*flute|corflute|signage|\msign\M)' then 'A-Frames & Signage'
      when category_lower = 'print' and subcategory_lower = 'signage' and name_lower ~ '(marquee|tent|canopy)' then 'Marquees'
      when category_lower = 'print' and subcategory_lower in ('ad labels', 'labels', 'stickers') then 'Labels & Stickers'
      when category_lower = 'print' and subcategory_lower in ('resin labels', 'resin label') then 'Resin Labels'
      when category_lower = 'print' and subcategory_lower in ('business cards', 'business card') and name_lower ~ '(business\s+card|loyalty\s+card)' then 'Business Cards'
      when category_lower = 'promotion' and subcategory_lower in ('stress items', 'stress toys', 'stress balls') then 'Stress Balls & Toys'
      when category_lower = 'promotion' and subcategory_lower in ('plush toys', 'plush') then 'Plush Toys'
      when category_lower = 'leisure' and subcategory_lower in ('wooden models', 'wooden toys') then 'Wooden Toys & Models'
      when category_lower = 'leisure' and subcategory_lower in ('games & puzzles', 'games and puzzles', 'games') then 'Games & Puzzles'
      when category_lower = 'leisure' and subcategory_lower in ('beach balls', 'beach ball') then 'Outdoor Toys'
      when category_lower = 'leisure' and subcategory_lower like 'fidget%' then 'Novelty Toys'
      when category_lower in ('promotion', 'promotional') and subcategory_lower in ('promotion', 'promotional') and haystack_lower ~ '(flyer|frisbee|flying\s*disc|beach\s*ball)' then 'Outdoor Toys'
      when category_lower in ('promotion', 'promotional') and subcategory_lower in ('promotion', 'promotional') and haystack_lower ~ '(fidget|puzzle|popper)' then 'Novelty Toys'
      when category_lower = 'promotion' and subcategory_lower in ('magnets', 'magnet') then 'Magnets'
      when category_lower = 'promotion' and subcategory_lower in ('wristbands', 'wrist bands', 'wristband') then 'Wristbands'
      when category_lower = 'promotion' and subcategory_lower in ('badges', 'badge') then 'Badges'
      when category_lower = 'promotion' and subcategory_lower in ('temporary tattoos', 'temporary tattoo') then 'Temporary Tattoos'
      when category_lower in ('promotion', 'promotional') and subcategory_lower in ('promotion', 'promotional') and haystack_lower ~ '(balloon)' then 'Balloons'
      when category_lower in ('promotion', 'promotional') and subcategory_lower in ('promotion', 'promotional') and haystack_lower ~ '(woven\s+patch|patch|sticker|decal)' then 'Stickers & Patches'
      when category_lower in ('promotion', 'promotional') and subcategory_lower in ('promotion', 'promotional') and haystack_lower ~ '(bookmark|magnifier|piggy|money\s*box|stocking)' then 'Novelty Giveaways'
      when category_lower = 'leisure' and subcategory_lower in ('pet accessories', 'pet accessory', 'pet') then 'Pet Accessories'
      when category_lower = 'leisure' and subcategory_lower in ('candles & diffusers', 'candles and diffusers', 'candles') then 'Candles & Diffusers'
      when category_lower = 'leisure' and subcategory_lower in ('cheese & serving boards', 'cheese and serving boards', 'cheese boards') then 'Cheese & Serving Boards'
      else null
    end as suggested_subcategory
  from base
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
  count(*) filter (where new_category = 'Flags & Displays') as updated_to_flags_displays,
  count(*) filter (where new_category = 'Giveaways & Event Accessories') as updated_to_giveaways,
  count(*) filter (where new_category = 'Marketing Materials') as updated_to_marketing_materials,
  count(*) filter (where new_category = 'Toys & Games') as updated_to_toys_games,
  count(*) filter (where new_category = 'Pet') as updated_to_pet,
  count(*) filter (where new_category = 'Home & Living') as updated_to_home_living
from updated;

commit;

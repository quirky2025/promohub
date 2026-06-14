-- Office & Desk normalization summary
-- READ ONLY. Run before office_desk_normalization_apply_UPDATE.sql.
-- Goal:
--   Preview Business -> Office & Desk cleanup for the flat URL pilot.
--   Keeps one primary subcategory per product.
--   Also routes obvious old-Business misplacements:
--     Lanyards / ID Holders -> Giveaways & Event Accessories
--     Highlighters / Markers / Pencils -> Pens
--     Colouring sets -> Toys & Games

with classified as (
  select
    p.id,
    p.name,
    p.category as current_category,
    p.subcategory as current_subcategory,
    p.is_published,
    lower(p.name) as name_lower,
    lower(coalesce(p.subcategory, '')) as subcategory_lower
  from public.products p
  where p.category in ('Business', 'Office & Desk')
     or (
      p.category = 'Print'
      and lower(coalesce(p.subcategory, '')) in ('pads & planners', 'pads and planners')
    )
),
suggested as (
  select
    *,
    case
      when subcategory_lower like '%lanyard%' or name_lower like '%lanyard%' then 'Giveaways & Event Accessories'
      when subcategory_lower like '%id holder%' or name_lower ~ '(id holder|id card|badge holder|card holder)' then 'Giveaways & Event Accessories'
      when name_lower like '%highlighter%' then 'Pens'
      when name_lower ~ '(whiteboard marker|permanent marker|marker pen|marker)' then 'Pens'
      when name_lower ~ '(^|[^a-z])pencil([^a-z]|$)' and name_lower !~ '(pencil case|pencil pouch)' then 'Pens'
      when name_lower ~ '(colouring|coloring|crayon)' then 'Toys & Games'
      when subcategory_lower in ('notebooks') or name_lower ~ '(notebook|journal)' then 'Office & Desk'
      when subcategory_lower in ('pads & planners', 'pads and planners') or name_lower ~ '(planner|diary|calendar)' then 'Office & Desk'
      when subcategory_lower in ('sticky notes') or name_lower ~ '(sticky note|adhesive note)' then 'Office & Desk'
      when subcategory_lower in ('note pads', 'notepads') or name_lower ~ '(note pad|notepad|memo pad|jotter)' then 'Office & Desk'
      when subcategory_lower in ('portfolios', 'portfolios & compendiums', 'portfolios and compendiums') or name_lower ~ '(portfolio|compendium|conference folder|document folder)' then 'Office & Desk'
      when subcategory_lower in ('pencil cases') or name_lower ~ '(pencil case|pencil pouch)' then 'Office & Desk'
      when subcategory_lower in ('rulers') or name_lower ~ '(^|[^a-z])ruler([^a-z]|$)' then 'Office & Desk'
      when subcategory_lower in ('desk items') or name_lower ~ '(desk|desktop|paperweight|letter opener)' then 'Office & Desk'
      when subcategory_lower in ('stationery') then 'Office & Desk'
      else null
    end as suggested_category,
    case
      when subcategory_lower like '%lanyard%' or name_lower like '%lanyard%' then 'Lanyards'
      when subcategory_lower like '%id holder%' or name_lower ~ '(id holder|id card|badge holder|card holder)' then 'ID Holders'
      when name_lower like '%highlighter%' then 'Highlighters'
      when name_lower ~ '(whiteboard marker|permanent marker|marker pen|marker)' then 'Markers'
      when name_lower ~ '(^|[^a-z])pencil([^a-z]|$)' and name_lower !~ '(pencil case|pencil pouch)' then 'Pencils'
      when name_lower ~ '(colouring|coloring|crayon)' then 'Colouring & Kids Sets'
      when subcategory_lower in ('notebooks') or name_lower ~ '(notebook|journal)' then 'Notebooks'
      when subcategory_lower in ('pads & planners', 'pads and planners') or name_lower ~ '(planner|diary|calendar)' then 'Pads & Planners'
      when subcategory_lower in ('sticky notes') or name_lower ~ '(sticky note|adhesive note)' then 'Sticky Notes'
      when subcategory_lower in ('note pads', 'notepads') or name_lower ~ '(note pad|notepad|memo pad|jotter)' then 'Note Pads'
      when subcategory_lower in ('portfolios', 'portfolios & compendiums', 'portfolios and compendiums') or name_lower ~ '(portfolio|compendium|conference folder|document folder)' then 'Portfolios & Compendiums'
      when subcategory_lower in ('pencil cases') or name_lower ~ '(pencil case|pencil pouch)' then 'Pencil Cases'
      when subcategory_lower in ('rulers') or name_lower ~ '(^|[^a-z])ruler([^a-z]|$)' then 'Rulers'
      when subcategory_lower in ('desk items') or name_lower ~ '(desk|desktop|paperweight|letter opener)' then 'Desk Items'
      when subcategory_lower in ('stationery') then 'Stationery'
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

-- Legacy residue flat URL preflight
-- READ ONLY. Run after legacy_residue_normalization_apply_UPDATE.sql.
-- Checks URL pages that should become useful once the old buckets are drained.

with target_slugs(slug, ord) as (
  values
    -- Giveaways & Event Accessories
    ('promotional-giveaways-australia', 10),
    ('custom-lanyards-australia', 11),
    ('id-card-holders-australia', 12),
    ('custom-wristbands-australia', 13),
    ('custom-badges-australia', 14),
    ('custom-fridge-magnets-australia', 15),
    ('temporary-tattoos-australia', 16),
    ('custom-balloons-australia', 17),
    ('promotional-stickers-and-patches-australia', 18),
    ('novelty-giveaways-australia', 19),

    -- Flags & Displays
    ('trade-show-displays-australia', 30),
    ('custom-feather-flags-australia', 31),
    ('pull-up-banners-australia', 32),
    ('media-walls-australia', 33),
    ('custom-marquees-australia', 34),
    ('custom-table-covers-australia', 35),
    ('a-frame-signage-australia', 36),

    -- Marketing Materials
    ('printed-marketing-materials-australia', 50),
    ('custom-stickers-australia', 51),
    ('resin-labels-australia', 52),
    ('business-cards-australia', 53),

    -- Pet
    ('branded-pet-products-australia', 70),
    ('custom-pet-accessories-australia', 71),

    -- Toys & Games
    ('promotional-toys-and-games-australia', 90),
    ('custom-stress-balls-australia', 91),
    ('custom-plush-toys-australia', 92),
    ('wooden-toys-and-models-australia', 93),
    ('custom-games-and-puzzles-australia', 94),
    ('outdoor-toys-australia', 95),
    ('colouring-sets-australia', 96),
    ('novelty-toys-australia', 97)
),
target_pages as (
  select
    ts.slug as target_slug,
    ts.ord,
    up.*
  from target_slugs ts
  left join public.url_pages up on up.slug = ts.slug
),
page_counts as (
  select
    tp.target_slug,
    tp.ord,
    tp.id,
    tp.status,
    tp.nav_label,
    tp.product_filter,
    coalesce(tp.product_filter->>'type', '') as filter_type,
    (
      select count(*)
      from public.products p
      where p.is_published = true
        and (
          (
            tp.product_filter->>'type' = 'category'
            and p.category = tp.product_filter->>'category'
          )
          or (
            tp.product_filter->>'type' = 'subcategory'
            and p.category = tp.product_filter->>'category'
            and p.subcategory = tp.product_filter->>'subcategory'
          )
        )
    ) as product_count
  from target_pages tp
)
select
  target_slug as slug,
  coalesce(status, 'MISSING') as status,
  nav_label,
  filter_type,
  product_count,
  case
    when id is null then 'MISSING url_pages row'
    when product_count = 0 then 'CHECK BEFORE LIVE'
    else 'ok'
  end as validation_note,
  product_filter
from page_counts
order by ord;

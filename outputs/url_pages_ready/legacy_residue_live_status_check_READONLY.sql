-- Legacy residue flat URL live status check
-- READ ONLY. Run after legacy_residue_set_live_UPDATE.sql.

with target_slugs(slug, ord) as (
  values
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
    ('trade-show-displays-australia', 30),
    ('custom-feather-flags-australia', 31),
    ('pull-up-banners-australia', 32),
    ('media-walls-australia', 33),
    ('custom-marquees-australia', 34),
    ('custom-table-covers-australia', 35),
    ('a-frame-signage-australia', 36),
    ('printed-marketing-materials-australia', 50),
    ('custom-stickers-australia', 51),
    ('resin-labels-australia', 52),
    ('business-cards-australia', 53),
    ('branded-pet-products-australia', 70),
    ('custom-pet-accessories-australia', 71),
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
    tp.status,
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
  product_count,
  case
    when status = 'live' and product_count > 0 then 'live'
    when product_count = 0 then 'no products'
    else 'check status'
  end as result
from page_counts
order by ord;

-- Final category / url_pages health check
-- READ ONLY. Run after all category normalization, manual review, and set-live SQL.
-- Goal:
--   1) old hidden categories have no products left
--   2) frontend navigation categories are present and have published products
--   3) live product_category url_pages match at least one published product
--   4) expected homepage category pages are live and matching products

with hidden_legacy_categories(category) as (
  values
    ('Business'),
    ('Print'),
    ('Personal'),
    ('Promotion'),
    ('Promotional'),
    ('Leisure')
),
expected_nav_categories(category, slug, display_order) as (
  values
    ('Apparel', 'custom-branded-apparel-australia', 10),
    ('Bags', 'custom-bags-australia', 20),
    ('Barware & Accessories', 'branded-barware-australia', 30),
    ('Drinkware', 'custom-drinkware-australia', 40),
    ('Flags & Displays', 'trade-show-displays-australia', 50),
    ('Giveaways & Event Accessories', 'promotional-giveaways-australia', 60),
    ('Headwear', 'custom-headwear-australia', 70),
    ('Home & Living', 'branded-homewares-australia', 80),
    ('Key Rings', 'custom-keyrings-australia', 90),
    ('Marketing Materials', 'printed-marketing-materials-australia', 100),
    ('Office & Desk', 'branded-office-supplies-australia', 110),
    ('Outdoor & Sports', 'outdoor-promotional-products-australia', 120),
    ('Packaging', 'custom-packaging-australia', 130),
    ('Pens', 'branded-pens-australia', 140),
    ('Personal Care', 'branded-personal-care-products-australia', 150),
    ('Pet', 'branded-pet-products-australia', 160),
    ('Technology', 'corporate-tech-gifts-australia', 170),
    ('Tools & Auto', 'branded-tools-and-car-accessories-australia', 180),
    ('Toys & Games', 'promotional-toys-and-games-australia', 190),
    ('Travel', 'branded-travel-accessories-australia', 200)
),
allowed_non_nav_categories(category) as (
  values
    ('Confectionery')
),
legacy_residue as (
  select
    p.category,
    coalesce(nullif(p.subcategory, ''), '(blank)') as subcategory,
    count(*) as total_products,
    count(*) filter (where p.is_published = true) as published_products,
    array_agg(coalesce(p.supplier_sku, '(no sku)') || ' | ' || p.name order by p.name) as examples
  from public.products p
  join hidden_legacy_categories h
    on lower(coalesce(p.category, '')) = lower(h.category)
  group by p.category, coalesce(nullif(p.subcategory, ''), '(blank)')
),
product_category_inventory as (
  select
    p.category,
    count(*) as total_products,
    count(*) filter (where p.is_published = true) as published_products
  from public.products p
  where coalesce(p.category, '') <> ''
  group by p.category
),
nav_inventory as (
  select
    ns.category,
    count(distinct ns.subcategory) as nav_subcategory_count
  from public.nav_subcategories ns
  group by ns.category
),
expected_category_health as (
  select
    e.category,
    e.slug,
    e.display_order,
    coalesce(pci.total_products, 0) as total_products,
    coalesce(pci.published_products, 0) as published_products,
    coalesce(ni.nav_subcategory_count, 0) as nav_subcategory_count
  from expected_nav_categories e
  left join product_category_inventory pci on pci.category = e.category
  left join nav_inventory ni on ni.category = e.category
),
hidden_nav_residue as (
  select
    ni.category,
    ni.nav_subcategory_count
  from nav_inventory ni
  join hidden_legacy_categories h
    on lower(ni.category) = lower(h.category)
),
unexpected_published_product_categories as (
  select
    pci.category,
    pci.published_products
  from product_category_inventory pci
  left join expected_nav_categories e on e.category = pci.category
  left join allowed_non_nav_categories a on a.category = pci.category
  left join hidden_legacy_categories h on h.category = pci.category
  where pci.published_products > 0
    and e.category is null
    and a.category is null
    and h.category is null
),
product_category_pages as (
  select
    up.*,
    case
      when up.slug = 'custom-cotton-tote-bags-australia'
        then '{"type":"compound","category":"Bags","subcategory":"Tote Bags","material":"Cotton"}'::jsonb
      else up.product_filter
    end as effective_product_filter
  from public.url_pages up
  where up.page_type = 'product_category'
),
page_counts as (
  select
    up.id,
    up.slug,
    up.status,
    up.nav_label,
    up.show_in_home,
    up.show_in_nav,
    up.product_filter,
    up.effective_product_filter,
    coalesce(up.effective_product_filter->>'type', '') as filter_type,
    up.effective_product_filter->>'category' as filter_category,
    up.effective_product_filter->>'subcategory' as filter_subcategory,
    case
      when coalesce(up.effective_product_filter->>'type', '') in ('category', 'subcategory', 'compound') then (
        select count(*)
        from public.products p
        where p.is_published = true
          and (
            (
              up.effective_product_filter->>'type' = 'category'
              and p.category = up.effective_product_filter->>'category'
            )
            or (
              up.effective_product_filter->>'type' = 'subcategory'
              and p.category = up.effective_product_filter->>'category'
              and p.subcategory = up.effective_product_filter->>'subcategory'
            )
            or (
              up.effective_product_filter->>'type' = 'compound'
              and p.category = up.effective_product_filter->>'category'
              and (
                not (up.effective_product_filter ? 'subcategory')
                or p.subcategory = up.effective_product_filter->>'subcategory'
              )
              and (
                not (up.effective_product_filter ? 'material')
                or coalesce(p.material_tags, '{}'::text[]) @> array[lower(up.effective_product_filter->>'material')]
              )
              and (
                not (up.effective_product_filter ? 'tags')
                or coalesce(p.tags, '{}'::text[]) && coalesce(
                  (
                    select array_agg(lower(value))
                    from jsonb_array_elements_text(up.effective_product_filter->'tags') as value
                  ),
                  '{}'::text[]
                )
              )
              and (
                not (up.effective_product_filter ? 'is_eco')
                or p.is_eco = (up.effective_product_filter->>'is_eco')::boolean
              )
            )
          )
      )
      else null
    end as product_count
  from product_category_pages up
),
expected_top_page_health as (
  select
    e.category,
    e.slug,
    e.display_order,
    pc.status,
    pc.nav_label,
    pc.filter_type,
    pc.product_count,
    pc.product_filter,
    case
      when pc.id is null then 'missing_url_page'
      when pc.status <> 'live' then 'not_live'
      when coalesce(pc.product_count, 0) = 0 then 'zero_products'
      else 'ok'
    end as issue
  from expected_nav_categories e
  left join page_counts pc on pc.slug = e.slug
),
live_supported_page_issues as (
  select
    pc.slug,
    pc.status,
    pc.nav_label,
    pc.filter_type,
    pc.product_count,
    pc.effective_product_filter,
    'zero_products' as issue
  from page_counts pc
  where pc.status = 'live'
    and pc.filter_type in ('category', 'subcategory', 'compound')
    and coalesce(pc.product_count, 0) = 0
),
live_unsupported_product_filters as (
  select
    pc.slug,
    pc.status,
    pc.nav_label,
    pc.filter_type,
    pc.effective_product_filter
  from page_counts pc
  where pc.status = 'live'
    and pc.filter_type not in ('category', 'subcategory', 'compound')
),
non_live_expected_category_pages_with_products as (
  select
    pc.slug,
    pc.status,
    pc.nav_label,
    pc.filter_type,
    pc.filter_category,
    pc.filter_subcategory,
    pc.product_count
  from page_counts pc
  join expected_nav_categories e on e.category = pc.filter_category
  where pc.status <> 'live'
    and pc.filter_type in ('category', 'subcategory', 'compound')
    and coalesce(pc.product_count, 0) > 0
),
duplicate_slugs as (
  select
    slug,
    count(*) as slug_count
  from public.url_pages
  group by slug
  having count(*) > 1
),
confectionery_inventory as (
  select
    coalesce(sum(published_products), 0) as published_products
  from product_category_inventory
  where category = 'Confectionery'
),
checks as (
  select
    10 as sort_order,
    'legacy' as section,
    'old_hidden_category_product_residue' as check_name,
    case when coalesce(sum(total_products), 0) = 0 then 'ok' else 'fail' end as health_status,
    coalesce(sum(total_products), 0)::bigint as issue_count,
    coalesce(
      jsonb_agg(
        jsonb_build_object(
          'category', category,
          'subcategory', subcategory,
          'total_products', total_products,
          'published_products', published_products,
          'examples', examples
        )
        order by category, subcategory
      ),
      '[]'::jsonb
    ) as details
  from legacy_residue

  union all

  select
    20,
    'navigation',
    'hidden_categories_absent_from_nav_subcategories',
    case when count(*) = 0 then 'ok' else 'fail' end,
    count(*)::bigint,
    coalesce(
      jsonb_agg(
        jsonb_build_object(
          'category', category,
          'nav_subcategory_count', nav_subcategory_count
        )
        order by category
      ),
      '[]'::jsonb
    )
  from hidden_nav_residue

  union all

  select
    30,
    'navigation',
    'expected_nav_category_product_counts',
    case
      when count(*) filter (where published_products = 0 or nav_subcategory_count = 0) = 0 then 'ok'
      else 'fail'
    end,
    (count(*) filter (where published_products = 0 or nav_subcategory_count = 0))::bigint,
    jsonb_agg(
      jsonb_build_object(
        'category', category,
        'published_products', published_products,
        'nav_subcategory_count', nav_subcategory_count
      )
      order by category
    )
  from expected_category_health

  union all

  select
    40,
    'navigation',
    'unexpected_published_product_categories',
    case when count(*) = 0 then 'ok' else 'warn' end,
    count(*)::bigint,
    coalesce(
      jsonb_agg(
        jsonb_build_object(
          'category', category,
          'published_products', published_products
        )
        order by category
      ),
      '[]'::jsonb
    )
  from unexpected_published_product_categories

  union all

  select
    50,
    'navigation',
    'confectionery_product_count',
    case when published_products = 0 then 'ok' else 'warn' end,
    published_products::bigint,
    jsonb_build_object(
      'published_products', published_products,
      'note', 'Confectionery is intentionally not in nav until products exist.'
    )
  from confectionery_inventory

  union all

  select
    60,
    'url_pages',
    'expected_top_category_pages_live_and_matching',
    case when count(*) filter (where issue <> 'ok') = 0 then 'ok' else 'fail' end,
    (count(*) filter (where issue <> 'ok'))::bigint,
    coalesce(
      jsonb_agg(
        jsonb_build_object(
          'category', category,
          'slug', slug,
          'status', status,
          'nav_label', nav_label,
          'filter_type', filter_type,
          'product_count', product_count,
          'issue', issue,
          'product_filter', product_filter
        )
        order by display_order
      ) filter (where issue <> 'ok'),
      '[]'::jsonb
    )
  from expected_top_page_health

  union all

  select
    70,
    'url_pages',
    'live_supported_product_category_pages_have_products',
    case when count(*) = 0 then 'ok' else 'fail' end,
    count(*)::bigint,
    coalesce(
      jsonb_agg(
        jsonb_build_object(
          'slug', slug,
          'status', status,
          'nav_label', nav_label,
          'filter_type', filter_type,
          'product_count', product_count,
          'issue', issue,
          'effective_product_filter', effective_product_filter
        )
        order by slug
      ),
      '[]'::jsonb
    )
  from live_supported_page_issues

  union all

  select
    80,
    'url_pages',
    'live_unsupported_product_filters',
    case when count(*) = 0 then 'ok' else 'warn' end,
    count(*)::bigint,
    coalesce(
      jsonb_agg(
        jsonb_build_object(
          'slug', slug,
          'status', status,
          'nav_label', nav_label,
          'filter_type', filter_type,
          'effective_product_filter', effective_product_filter
        )
        order by slug
      ),
      '[]'::jsonb
    )
  from live_unsupported_product_filters

  union all

  select
    90,
    'url_pages',
    'non_live_expected_category_pages_with_products',
    case when count(*) = 0 then 'ok' else 'warn' end,
    count(*)::bigint,
    coalesce(
      jsonb_agg(
        jsonb_build_object(
          'slug', slug,
          'status', status,
          'nav_label', nav_label,
          'filter_type', filter_type,
          'category', filter_category,
          'subcategory', filter_subcategory,
          'product_count', product_count
        )
        order by filter_category, filter_subcategory, slug
      ),
      '[]'::jsonb
    )
  from non_live_expected_category_pages_with_products

  union all

  select
    100,
    'url_pages',
    'duplicate_url_page_slugs',
    case when count(*) = 0 then 'ok' else 'fail' end,
    count(*)::bigint,
    coalesce(
      jsonb_agg(
        jsonb_build_object(
          'slug', slug,
          'slug_count', slug_count
        )
        order by slug
      ),
      '[]'::jsonb
    )
  from duplicate_slugs

  union all

  select
    110,
    'frontend_reference',
    'expected_home_category_alphabetical_order',
    'ok',
    0::bigint,
    jsonb_agg(category order by category)
  from expected_nav_categories
)
select
  section,
  check_name,
  health_status,
  issue_count,
  details
from checks
order by sort_order;

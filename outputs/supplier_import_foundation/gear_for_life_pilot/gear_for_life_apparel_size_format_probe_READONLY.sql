-- Inspect how live apparel products store sizes + size chart (to match GFL).
-- READ ONLY.

select 'live_apparel_samples' as section,
       (select jsonb_agg(to_jsonb(t)) from (
          select supplier_sku, name, category, subcategory,
                 size_chart, specs, features, dimensions, short_desc, materials, packing,
                 colours
          from public.products
          where is_published is true
            and size_chart is not null
          order by created_at desc nulls last
          limit 3
       ) t) as details

union all
-- fallback: any published product in an apparel-like category, even if size_chart null
select 'live_apparel_by_category',
       (select jsonb_agg(to_jsonb(t)) from (
          select supplier_sku, name, category, subcategory, size_chart, specs, features
          from public.products
          where is_published is true
            and (category ilike '%apparel%' or category ilike '%wear%'
                 or subcategory ilike '%polo%' or subcategory ilike '%shirt%'
                 or subcategory ilike '%jacket%' or subcategory ilike '%tee%')
          order by created_at desc nulls last
          limit 3
       ) t);

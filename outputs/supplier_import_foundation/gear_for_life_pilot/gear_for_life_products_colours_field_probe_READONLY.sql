-- Find where the new singular-"image" colour format lives.
-- READ ONLY.

-- 1) all columns of products (look for a jsonb 'colours'/'colors'/'variants'/'images' field)
select 'A_products_columns' as section,
       jsonb_agg(jsonb_build_object('pos',ordinal_position,'column',column_name,'type',data_type)
                 order by ordinal_position) as details
from information_schema.columns
where table_schema='public' and table_name='products'

union all
-- 2) sample one LIVE/published product that has colour variants: dump jsonb of likely colour fields.
--    Adjust column name in the SELECT below if the colours live under a different field.
select 'B_sample_product_jsonb',
       (select jsonb_agg(to_jsonb(t)) from (
          select id, name,
                 to_jsonb(p.*) - 'description' as full_row_without_description
          from public.products p
          where p.is_published is true
          order by p.updated_at desc nulls last
          limit 2
       ) t);

-- RE-CHECK product_colours format after the site-wide change to singular "image".
-- READ ONLY. Confirms current columns + shows real sample rows (new format).

-- 1) current columns of product_colours
select 'A_columns' as section,
       jsonb_agg(jsonb_build_object(
         'pos', ordinal_position, 'column', column_name,
         'type', data_type, 'nullable', is_nullable, 'default', column_default
       ) order by ordinal_position) as details
from information_schema.columns
where table_schema='public' and table_name='product_colours'

union all
-- 2) sample colour rows that have a photo (image populated) - non-GFL, recently changed
select 'B_sample_image_rows',
       (select jsonb_agg(to_jsonb(t)) from (
          select pc.*
          from public.product_colours pc
          join public.products p on p.id = pc.product_id
          where coalesce(p.supplier,'') <> 'Gear For Life'
          order by pc.id desc
          limit 8
       ) t)

union all
-- 3) sample colour rows that are swatch-only (hex) if any
select 'C_sample_hex_rows',
       (select jsonb_agg(to_jsonb(t)) from (
          select pc.*
          from public.product_colours pc
          where pc.hex is not null
          order by pc.id desc
          limit 5
       ) t);

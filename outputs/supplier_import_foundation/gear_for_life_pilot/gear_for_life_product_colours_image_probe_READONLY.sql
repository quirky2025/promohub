-- Gear For Life: PROBE product_colours image format + target product images.
-- READ ONLY. Purpose: discover how product_colours stores colour images (exact column
-- name/type) and what image each of the 28 target products has, so the colour-image
-- fix can be generated correctly. No writes.

with
target_skus(supplier_sku) as (values ('BBPTS'),('BBQS'),('BBYCHS'),('BBYCQS'),('POAFS'),('POAGC'),('POBCGS'),('POBCK'),('POBCS'),('POBWD'),('POCBGS'),('POCS'),('PODCPB'),('PODCS'),('POEPS'),('POFCKS'),('POGGS'),('POHWGS'),('POIWDS'),('POMGS'),('PONS'),('PORHBT'),('POSCF'),('POSK'),('POSWTS'),('POTF2S'),('POTFI'),('POTSL')),
cols as (
  select jsonb_agg(jsonb_build_object(
           'pos', ordinal_position, 'column', column_name,
           'type', data_type, 'nullable', is_nullable, 'default', column_default
         ) order by ordinal_position) as d
  from information_schema.columns
  where table_schema = 'public' and table_name = 'product_colours'
),
sample_nongfl as (
  select jsonb_agg(to_jsonb(t)) as d
  from (
    select pc.*
    from public.product_colours pc
    join public.products p on p.id = pc.product_id
    where coalesce(p.supplier,'') <> 'Gear For Life'
    order by pc.id desc
    limit 8
  ) t
),
sample_any as (
  select jsonb_agg(to_jsonb(t)) as d
  from (
    select pc.* from public.product_colours pc order by pc.id desc limit 5
  ) t
),
target_images as (
  select jsonb_agg(jsonb_build_object(
           'supplier_sku', pi.supplier_sku,
           'image_role', pi.image_role,
           'image_url', pi.image_url,
           'sort_order', pi.sort_order
         ) order by pi.supplier_sku, pi.sort_order) as d
  from public.product_images pi
  join public.products p on p.id = pi.product_id and p.supplier = 'Gear For Life'
  join target_skus ts on ts.supplier_sku = p.supplier_sku
)
select 'A_product_colours_columns'           as section, (select d from cols)           as details
union all select 'B_sample_nonGFL_colour_rows', (select d from sample_nongfl)
union all select 'C_sample_recent_colour_rows', (select d from sample_any)
union all select 'D_target_product_images',     (select d from target_images);

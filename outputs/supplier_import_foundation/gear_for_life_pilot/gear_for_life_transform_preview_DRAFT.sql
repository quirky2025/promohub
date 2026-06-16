-- Gear For Life TRANSFORM PREVIEW - DRAFT
-- Purpose: populate supplier_transform_preview for manual approval.
-- Scope: staging preview table only. Does not write products, url_pages, navigation, redirects, or storefront data.
-- Run manually in Supabase only after reviewing this file.

begin;

do $$
declare
  gfl_batch_id uuid;
begin
  select id into gfl_batch_id
  from public.supplier_import_batches
  where supplier = 'Gear For Life'
    and source_file_hash = 'f20ede9ac24d944fcb4c3c646d8ae2cbc41d2c63580200db27f2e86a96bf739c'
  order by created_at desc
  limit 1;

  if gfl_batch_id is null then
    raise exception 'Gear For Life batch not found. Stop: run raw load first.';
  end if;

  if exists (
    select 1 from public.supplier_transform_preview
    where supplier = 'Gear For Life'
      and batch_id = gfl_batch_id
  ) then
    raise exception 'Gear For Life transform preview already exists for this batch. Stop: do not run twice.';
  end if;

  if (select count(*) from public.supplier_raw_product_rows where batch_id = gfl_batch_id) <> 472 then
    raise exception 'Expected 472 raw product rows before transform preview.';
  end if;

  if (select count(*) from public.supplier_decoration_options where batch_id = gfl_batch_id) <> 277 then
    raise exception 'Expected 277 corrected decoration options before transform preview.';
  end if;

  if (select count(*) from public.supplier_decoration_price_rows where batch_id = gfl_batch_id) <> 1118 then
    raise exception 'Expected 1118 corrected decoration price rows before transform preview.';
  end if;

  if (select count(*) from public.supplier_decoration_rate_cards where batch_id = gfl_batch_id) <> 2 then
    raise exception 'Expected 2 GFL rate cards before transform preview.';
  end if;

  if (select count(*) from public.supplier_decoration_rate_card_rows where batch_id = gfl_batch_id) <> 160 then
    raise exception 'Expected 160 GFL rate card rows before transform preview.';
  end if;
end $$;

with
params as (
  select 'Gear For Life'::text as target_supplier,
         'f20ede9ac24d944fcb4c3c646d8ae2cbc41d2c63580200db27f2e86a96bf739c'::text as target_source_file_hash
),
gfl_batch as (
  select id as batch_id
  from public.supplier_import_batches
  where supplier = (select target_supplier from params)
    and source_file_hash = (select target_source_file_hash from params)
  order by created_at desc
  limit 1
),
manual_overrides as (
  select *
  from (values
    ('POPIB', 'Outdoor & Sports', 'Picnic & BBQ', '0.95', 'gfl_manual_confirmed_category', 'User confirmed outdoor/beach ice bucket.'),
    ('OVT', 'Apparel', 'Sweatshirts', '0.95', 'gfl_manual_confirmed_category', 'User confirmed proposed mapping.'),
    ('BHZQM', 'Apparel', 'Sweatshirts', '0.95', 'gfl_manual_confirmed_category', 'User confirmed proposed mapping.'),
    ('WEGMCD', 'Apparel', 'Sweatshirts', '0.95', 'gfl_manual_confirmed_category', 'User confirmed proposed mapping.'),
    ('BT', 'Apparel', 'Sweatshirts', '0.95', 'gfl_manual_confirmed_category', 'User confirmed proposed mapping.'),
    ('OTNT', 'Apparel', 'Sweatshirts', '0.95', 'gfl_manual_confirmed_category', 'User confirmed proposed mapping.'),
    ('TNT', 'Apparel', 'Sweatshirts', '0.95', 'gfl_manual_confirmed_category', 'User confirmed proposed mapping.'),
    ('PODCS', 'Barware & Accessories', 'Bar Accessories', '0.95', 'gfl_manual_confirmed_category', 'User confirmed proposed mapping.'),
    ('PONS', 'Tools & Auto', 'Tool Sets & Screwdrivers', '0.95', 'gfl_manual_confirmed_category', 'User confirmed proposed mapping.')
  ) as v(raw_supplier_sku, target_category, target_subcategory, confidence, mapping_rule_id, review_note)
),
category_mappings as (
  select *
  from (values
    ('Clothing / Shirts', 'Apparel', 'Shirts', '0.9', 'category_mapping_v4:Clothing / Shirts', null, null, null),
    ('Clothing / Polo Shirts', 'Apparel', 'Polo Shirts', '0.9', 'category_mapping_v4:Clothing / Polo Shirts', null, null, null),
    ('Clothing / Jackets', 'Apparel', 'Jackets', '0.9', 'category_mapping_v4:Clothing / Jackets', null, null, null),
    ('Bags / Cooler Bags', 'Bags', 'Cooler Bags', '0.9', 'category_mapping_v4:Bags / Cooler Bags', null, null, null),
    ('Bags / Backpacks', 'Bags', 'Backpacks', '0.9', 'category_mapping_v4:Bags / Backpacks', null, null, null),
    ('Clothing / T Shirts', 'Apparel', 'T-Shirts', '0.9', 'category_mapping_v4:Clothing / T Shirts', null, null, null),
    ('Clothing / Vests', 'Apparel', 'Vests', '0.9', 'category_mapping_v4:Clothing / Vests', null, null, null),
    ('Bags / Duffle/Sports Bags', 'Bags', 'Travel & Duffle Bags', '0.9', 'category_mapping_v4:Bags / Duffle/Sports Bags', null, null, null),
    ('Home & Living / Cheese Boards', 'Home & Living', 'Cheese & Serving Boards', '0.9', 'category_mapping_v4:Home & Living / Cheese Boards', null, null, null),
    ('Bags / Travel Bags', 'Bags', 'Travel & Duffle Bags', '0.9', 'category_mapping_v4:Bags / Travel Bags', null, null, null),
    ('Bags / Laptops', 'Bags', 'Laptop Bags', '0.9', 'category_mapping_v4:Bags / Laptops', null, null, null),
    ('Drinkware / Drink Bottles', 'Drinkware', 'Drink Bottles', '0.9', 'category_mapping_v4:Drinkware / Drink Bottles', null, null, null),
    ('Drinkware / Glassware', 'Drinkware', 'Glassware', '0.9', 'category_mapping_v4:Drinkware / Glassware', null, null, null),
    ('Clothing / Shorts', 'Apparel', 'Pants & Shorts', '0.9', 'category_mapping_v4:Clothing / Shorts', null, null, null),
    ('Clothing / Singlets', 'Apparel', 'T-Shirts', '0.86', 'category_mapping_v4:Clothing / Singlets', 'All 7 products matched one high-confidence target by product keywords: Apparel > T-Shirts.', null, null),
    ('Home & Living / Kitchenware', 'Home & Living', 'Kitchen & Dining', '0.9', 'category_mapping_v4:Home & Living / Kitchenware', null, null, null),
    ('Clothing / Pants', 'Apparel', 'Pants & Shorts', '0.9', 'category_mapping_v4:Clothing / Pants', null, null, null),
    ('Fun & Games / Games', 'Toys & Games', 'Games & Puzzles', '0.9', 'category_mapping_v4:Fun & Games / Games', null, null, null),
    ('clothing / Shirts', 'Apparel', 'Shirts', '0.9', 'category_mapping_v4:clothing / Shirts', null, null, null),
    ('Keyrings & Tools / Torches', 'Tools & Auto', 'Torches & Lights', '0.9', 'category_mapping_v4:Keyrings & Tools / Torches', null, null, null),
    ('USB & Tech / Bluetooth Speakers', 'Technology', 'Bluetooth Speakers', '0.9', 'category_mapping_v4:USB & Tech / Bluetooth Speakers', null, null, null),
    ('Clothing', 'Apparel', 'Pants & Shorts', '0.86', 'category_mapping_v4:Clothing', 'All 2 products matched one high-confidence target by product keywords: Apparel > Pants & Shorts.', null, null),
    ('Clothing / Hoodies', 'Apparel', 'Hoodies', '0.9', 'category_mapping_v4:Clothing / Hoodies', null, null, null),
    ('Drinkware / Wine Glasses', 'Drinkware', 'Glassware', '0.9', 'category_mapping_v4:Drinkware / Wine Glasses', null, null, null),
    ('Home & Living / Bottle Coolers', 'Drinkware', 'Drink Bottles', '0.9', 'category_mapping_v4:Home & Living / Bottle Coolers', null, null, null),
    ('Leisure & outdoors / BBQ Sets', 'Outdoor & Sports', 'Picnic & BBQ', '0.9', 'category_mapping_v4:Leisure & outdoors / BBQ Sets', null, null, null),
    ('Leisure & outdoors / Blanket', 'Outdoor & Sports', 'Blankets', '0.9', 'category_mapping_v4:Leisure & outdoors / Blanket', null, null, null),
    ('Leisure & outdoors / Picnic Rugs', 'Outdoor & Sports', 'Picnic & BBQ', '0.9', 'category_mapping_v4:Leisure & outdoors / Picnic Rugs', null, null, null),
    ('Bags / Coolers', 'Bags', 'Cooler Bags', '0.9', 'category_mapping_v4:Bags / Coolers', null, null, null),
    ('Bags / Sports Bags', 'Bags', 'Travel & Duffle Bags', '0.9', 'category_mapping_v4:Bags / Sports Bags', null, null, null),
    ('Bags / Toiletry Bags', 'Bags', 'Toiletry Bags', '0.9', 'category_mapping_v4:Bags / Toiletry Bags', null, null, null),
    ('clothing / Scarf', 'Apparel', 'Scarves & Accessories', '0.9', 'category_mapping_v4:clothing / Scarf', null, null, null),
    ('Clothing / vests', 'Apparel', 'Vests', '0.9', 'category_mapping_v4:Clothing / vests', null, null, null),
    ('Drinkware / Beer Glasses', 'Drinkware', 'Glassware', '0.9', 'category_mapping_v4:Drinkware / Beer Glasses', null, null, null),
    ('Drinkware / Mugs', 'Drinkware', 'Mugs', '0.9', 'category_mapping_v4:Drinkware / Mugs', null, null, null),
    ('Health & Personal / First Aid Kits', 'Personal Care', 'First Aid', '0.9', 'category_mapping_v4:Health & Personal / First Aid Kits', null, null, null),
    ('Health & Personal / Towels', 'Outdoor & Sports', 'Towels', '0.9', 'category_mapping_v4:Health & Personal / Towels', null, null, null),
    ('Home & Living / Cooler Bags', 'Bags', 'Cooler Bags', '0.9', 'category_mapping_v4:Home & Living / Cooler Bags', null, null, null),
    ('Keyrings & Tools / General Tools', 'Tools & Auto', 'Multi-Tools', '0.9', 'category_mapping_v4:Keyrings & Tools / General Tools', null, null, null),
    ('Keyrings & Tools / Multi Tools', 'Tools & Auto', 'Multi-Tools', '0.9', 'category_mapping_v4:Keyrings & Tools / Multi Tools', null, null, null),
    ('Keyrings & Tools / Tool Sets', 'Tools & Auto', 'Tool Sets & Screwdrivers', '0.9', 'category_mapping_v4:Keyrings & Tools / Tool Sets', null, null, null),
    ('Leisure & outdoors / Picnic Sets', 'Outdoor & Sports', 'Picnic & BBQ', '0.9', 'category_mapping_v4:Leisure & outdoors / Picnic Sets', null, null, null)
  ) as v(raw_category_path, target_category, target_subcategory, confidence, mapping_rule_id, review_note, suggested_material, suggested_tags)
),
cleanup_mappings as (
  select *
  from (values
    ('DGXS', 'Clothing', 'Apparel', 'Pants & Shorts', '0.9', 'product_keyword_cleanup:APP-080', null, null, null),
    ('WDGXS', 'Clothing', 'Apparel', 'Pants & Shorts', '0.9', 'product_keyword_cleanup:APP-080', null, null, null),
    ('DET', 'Clothing / Fleece', 'Apparel', 'Sweatshirts', '0.84', 'product_keyword_cleanup:APP-040', null, null, null),
    ('DET(Y)', 'Clothing / Fleece', 'Apparel', 'Sweatshirts', '0.84', 'product_keyword_cleanup:APP-040', null, null, null),
    ('EMJ', 'Clothing / Fleece', 'Apparel', 'Jackets', '0.88', 'product_keyword_cleanup:APP-050', null, null, null),
    ('IPJ', 'Clothing / Fleece', 'Apparel', 'Jackets', '0.88', 'product_keyword_cleanup:APP-050', null, null, null),
    ('OIPV', 'Clothing / Fleece', 'Apparel', 'Vests', '0.9', 'product_keyword_cleanup:APP-070', null, null, null),
    ('EGAB', 'Clothing / Merino', 'Headwear', 'Beanies', '0.95', 'product_keyword_cleanup:HEAD-040', null, null, null),
    ('EGMDP', 'Clothing / Merino', 'Apparel', 'Sweatshirts', '0.84', 'product_keyword_cleanup:APP-040', null, null, null),
    ('EGMFV', 'Clothing / Merino', 'Apparel', 'Vests', '0.9', 'product_keyword_cleanup:APP-070', null, null, null),
    ('EGMSP', 'Clothing / Merino', 'Apparel', 'Polo Shirts', '0.94', 'product_keyword_cleanup:APP-020', null, null, null),
    ('EGMZ', 'Clothing / Merino', 'Apparel', 'Sweatshirts', '0.84', 'product_keyword_cleanup:APP-040', null, null, null),
    ('OEGMFV', 'Clothing / Merino', 'Apparel', 'Vests', '0.9', 'product_keyword_cleanup:APP-070', null, null, null),
    ('OWEGMFV', 'Clothing / Merino', 'Apparel', 'Vests', '0.9', 'product_keyword_cleanup:APP-070', null, null, null),
    ('WEGMDP', 'Clothing / Merino', 'Apparel', 'Sweatshirts', '0.84', 'product_keyword_cleanup:APP-040', null, null, null),
    ('WEGMFV', 'Clothing / Merino', 'Apparel', 'Vests', '0.9', 'product_keyword_cleanup:APP-070', null, null, null),
    ('WEGMSP', 'Clothing / Merino', 'Apparel', 'Polo Shirts', '0.94', 'product_keyword_cleanup:APP-020', null, null, null),
    ('WEGMZ', 'Clothing / Merino', 'Apparel', 'Sweatshirts', '0.84', 'product_keyword_cleanup:APP-040', null, null, null),
    ('ASBJ', 'Clothing / Pullovers', 'Apparel', 'Sweatshirts', '0.84', 'product_keyword_cleanup:APP-040', null, null, null),
    ('DGRFZ', 'Clothing / Pullovers', 'Apparel', 'Sweatshirts', '0.84', 'product_keyword_cleanup:APP-040', null, null, null),
    ('DGRFZ(Y)', 'Clothing / Pullovers', 'Apparel', 'Sweatshirts', '0.84', 'product_keyword_cleanup:APP-040', null, null, null),
    ('ODGRFZ', 'Clothing / Pullovers', 'Apparel', 'Sweatshirts', '0.84', 'product_keyword_cleanup:APP-040', null, null, null),
    ('OTSWH', 'Clothing / Pullovers', 'Apparel', 'Hoodies', '0.94', 'product_keyword_cleanup:APP-030', null, null, null),
    ('ODGS(C)', 'Clothing / Singlets', 'Apparel', 'T-Shirts', '0.9', 'product_keyword_cleanup:APP-010', null, null, null),
    ('ODGS(P)', 'Clothing / Singlets', 'Apparel', 'T-Shirts', '0.9', 'product_keyword_cleanup:APP-010', null, null, null),
    ('ODGSS', 'Clothing / Singlets', 'Apparel', 'T-Shirts', '0.9', 'product_keyword_cleanup:APP-010', null, null, null),
    ('OWDGS(C)', 'Clothing / Singlets', 'Apparel', 'T-Shirts', '0.9', 'product_keyword_cleanup:APP-010', null, null, null),
    ('OWDGS(P)', 'Clothing / Singlets', 'Apparel', 'T-Shirts', '0.9', 'product_keyword_cleanup:APP-010', null, null, null),
    ('OWDGSS', 'Clothing / Singlets', 'Apparel', 'T-Shirts', '0.9', 'product_keyword_cleanup:APP-010', null, null, null),
    ('OYDGSS', 'Clothing / Singlets', 'Apparel', 'T-Shirts', '0.9', 'product_keyword_cleanup:APP-010', null, null, null),
    ('OEGMC', 'Clothing / Wool', 'Apparel', 'Sweatshirts', '0.84', 'product_keyword_cleanup:APP-040', null, null, null),
    ('OWEGMCI', 'Clothing / Wool', 'Apparel', 'Sweatshirts', '0.84', 'product_keyword_cleanup:APP-040', null, null, null),
    ('OWEGMV', 'Clothing / Wool', 'Apparel', 'Vests', '0.9', 'product_keyword_cleanup:APP-070', null, null, null),
    ('POATB', 'Home & Living / Miscaneous homeware', 'Home & Living', 'Cheese & Serving Boards', '0.88', 'product_keyword_cleanup:HOME-010', null, null, null),
    ('POEPS', 'Home & Living / Miscaneous homeware', 'Home & Living', 'Kitchen & Dining', '0.84', 'product_keyword_cleanup:HOME-020', null, null, null),
    ('POEB', 'Home & Living / Miscellaneous Homeware', 'Barware & Accessories', 'Bar Accessories', '0.86', 'product_keyword_cleanup:BAR-060', null, null, null),
    ('POGTT', 'Home & Living / Miscellaneous Homeware', 'Home & Living', 'Kitchen & Dining', '0.84', 'product_keyword_cleanup:HOME-020', null, null, null),
    ('PORC', 'Home & Living / Miscellaneous Homeware', 'Packaging', 'Gift Boxes', '0.84', 'product_keyword_cleanup:PKG-010', null, null, null),
    ('PODIGB', 'Leisure & Outdoors', 'Packaging', 'Gift Boxes', '0.84', 'product_keyword_cleanup:PKG-010', null, null, null),
    ('POLTT', 'Leisure & Outdoors', 'Home & Living', 'Kitchen & Dining', '0.84', 'product_keyword_cleanup:HOME-020', null, null, null),
    ('POOMTT', 'Leisure & Outdoors', 'Home & Living', 'Kitchen & Dining', '0.84', 'product_keyword_cleanup:HOME-020', null, null, null),
    ('POTT', 'Leisure & Outdoors', 'Home & Living', 'Kitchen & Dining', '0.84', 'product_keyword_cleanup:HOME-020', null, null, null),
    ('POWBC', 'Leisure & Outdoors', 'Outdoor & Sports', 'Camping & Outdoors', '0.84', 'product_keyword_cleanup:OUT-080', null, null, null),
    ('IGOISB', 'Leisure & Outdoors / Coolers', 'Packaging', 'Gift Boxes', '0.84', 'product_keyword_cleanup:PKG-010', null, null, null),
    ('POVCB', 'Leisure & Outdoors / Coolers', 'Packaging', 'Gift Boxes', '0.84', 'product_keyword_cleanup:PKG-010', null, null, null)
  ) as v(raw_supplier_sku, raw_category_path, target_category, target_subcategory, confidence, mapping_rule_id, review_note, suggested_material, suggested_tags)
),
mixed_keyword_review as (
  select *
  from (values
    ('PODIGB', 'Keyword suggestion is risky: Garden Box from Leisure & Outdoors was mapped to Packaging.'),
    ('POLTT', 'Keyword suggestion is risky: outdoor Tavolo Table may not be Home & Living.'),
    ('POOMTT', 'Keyword suggestion is risky: outdoor Tavolo Table may not be Home & Living.'),
    ('POTT', 'Keyword suggestion is risky: Tavolo Table from Leisure & Outdoors may not be Home & Living.'),
    ('IGOISB', 'Keyword suggestion is risky: On-Ice Sound Box was mapped to Packaging.'),
    ('POVCB', 'Keyword suggestion is risky: Vintage Cooler Box was mapped to Packaging.'),
    ('PORC', 'Keyword suggestion is risky: Retro Cooler Box was mapped to Packaging.'),
    ('POGTT', 'Keyword suggestion is risky: Grande Tavolo Table may not be Home & Living.')
  ) as v(raw_supplier_sku, review_note)
),
brand_aliases as (
  select *
  from (values
    ('Dri Gear', 'Dri Gear', 'keep', '0.85'),
    ('Agri Station', 'Agri Station', 'keep', '0.8'),
    ('Barkers', 'Barkers', 'keep', '0.8')
  ) as v(raw_brand_or_signal, normalized_brand, action, confidence)
),
raw_rows as (
  select r.*
  from public.supplier_raw_product_rows r
  join gfl_batch b on b.batch_id = r.batch_id
  where r.supplier = 'Gear For Life'
),
excluded_rows as (
  select *
  from raw_rows
  where nullif(trim(coalesce(supplier_sku, '')), '') is null
     or upper(trim(coalesce(raw_name, ''))) = 'DELETIONS'
),
eligible_rows as (
  select *
  from raw_rows r
  where not exists (
    select 1
    from excluded_rows e
    where e.batch_id = r.batch_id
      and e.source_row_number = r.source_row_number
  )
),
price_counts as (
  select
    p.batch_id,
    p.supplier_sku,
    p.raw_json ->> 'source_row_number' as source_row_number,
    count(*)::int as price_row_count
  from public.supplier_price_rows p
  join gfl_batch b on b.batch_id = p.batch_id
  where p.supplier = 'Gear For Life'
  group by p.batch_id, p.supplier_sku, p.raw_json ->> 'source_row_number'
),
colour_counts as (
  select batch_id, supplier_sku, count(*)::int as colour_count
  from public.supplier_raw_colour_options
  where supplier = 'Gear For Life'
  group by batch_id, supplier_sku
),
image_counts as (
  select
    batch_id,
    supplier_sku,
    count(*)::int as image_count,
    count(*) filter (where colour_key is null)::int as gallery_fallback_image_count
  from public.supplier_raw_images
  where supplier = 'Gear For Life'
  group by batch_id, supplier_sku
),
decoration_counts as (
  select
    d.batch_id,
    d.supplier_sku,
    count(distinct d.id)::int as decoration_option_count,
    count(p.id)::int as decoration_price_row_count
  from public.supplier_decoration_options d
  left join public.supplier_decoration_price_rows p
    on p.supplier_decoration_option_id = d.id
  where d.supplier = 'Gear For Life'
  group by d.batch_id, d.supplier_sku
),
resolved as (
  select
    r.*,
    case
      when r.source_row_number = 427
       and r.supplier_sku = 'ODGP'
       and trim(coalesce(r.raw_name, '')) = 'Dri Gear Active Polo - Mens'
      then 'ODGP(P)'
      else r.supplier_sku
    end as preview_supplier_sku,
    coalesce(pc.price_row_count, 0) as price_row_count,
    coalesce(cc.colour_count, 0) as colour_count,
    coalesce(ic.image_count, 0) as image_count,
    coalesce(ic.gallery_fallback_image_count, 0) as gallery_fallback_image_count,
    coalesce(dc.decoration_option_count, 0) as decoration_option_count,
    coalesce(dc.decoration_price_row_count, 0) as decoration_price_row_count,
    mo.target_category as manual_target_category,
    mo.target_subcategory as manual_target_subcategory,
    mo.confidence as manual_confidence,
    mo.mapping_rule_id as manual_rule_id,
    mo.review_note as manual_review_note,
    cm.target_category as cleanup_target_category,
    cm.target_subcategory as cleanup_target_subcategory,
    cm.confidence as cleanup_confidence,
    cm.mapping_rule_id as cleanup_rule_id,
    cm.review_note as cleanup_review_note,
    cm.suggested_material as cleanup_suggested_material,
    cm.suggested_tags as cleanup_suggested_tags,
    cat.target_category as category_target_category,
    cat.target_subcategory as category_target_subcategory,
    cat.confidence as category_confidence,
    cat.mapping_rule_id as category_rule_id,
    cat.review_note as category_review_note,
    cat.suggested_material as category_suggested_material,
    cat.suggested_tags as category_suggested_tags,
    mkr.review_note as mixed_review_note,
    ba.normalized_brand,
    ba.action as brand_alias_action
  from eligible_rows r
  left join price_counts pc
    on pc.batch_id = r.batch_id
   and pc.supplier_sku = r.supplier_sku
   and pc.source_row_number = r.source_row_number::text
  left join colour_counts cc
    on cc.batch_id = r.batch_id
   and cc.supplier_sku = r.supplier_sku
  left join image_counts ic
    on ic.batch_id = r.batch_id
   and ic.supplier_sku = r.supplier_sku
  left join decoration_counts dc
    on dc.batch_id = r.batch_id
   and dc.supplier_sku = r.supplier_sku
  left join manual_overrides mo
    on mo.raw_supplier_sku = r.supplier_sku
  left join cleanup_mappings cm
    on cm.raw_supplier_sku = r.supplier_sku
   and cm.raw_category_path = r.raw_category_path
  left join category_mappings cat
    on cat.raw_category_path = r.raw_category_path
  left join mixed_keyword_review mkr
    on mkr.raw_supplier_sku = r.supplier_sku
  left join brand_aliases ba
    on ba.raw_brand_or_signal = r.raw_brand
),
preview_rows as (
  select
    r.*,
    case
      when nullif(trim(coalesce(r.raw_category_path, '')), '') is null
        or r.price_row_count = 0
      then 'blocked'
      when r.manual_target_category is not null then 'ready'
      when r.cleanup_target_category is not null and r.mixed_review_note is not null then 'needs_review'
      when r.cleanup_target_category is not null then 'ready'
      when r.category_target_category is not null then 'ready'
      else 'needs_review'
    end as resolved_mapping_status,
    case
      when nullif(trim(coalesce(r.raw_category_path, '')), '') is null
        or r.price_row_count = 0
      then null
      else coalesce(r.manual_target_category, r.cleanup_target_category, r.category_target_category)
    end as resolved_target_category,
    case
      when nullif(trim(coalesce(r.raw_category_path, '')), '') is null
        or r.price_row_count = 0
      then null
      else coalesce(r.manual_target_subcategory, r.cleanup_target_subcategory, r.category_target_subcategory)
    end as resolved_target_subcategory,
    case
      when nullif(trim(coalesce(r.raw_category_path, '')), '') is null
        or r.price_row_count = 0
      then 'gfl_blocked_blank_category_or_missing_price'
      else coalesce(r.manual_rule_id, r.cleanup_rule_id, r.category_rule_id, 'gfl_needs_review')
    end as resolved_mapping_rule_id,
    case
      when nullif(trim(coalesce(r.raw_category_path, '')), '') is null
        or r.price_row_count = 0
      then null::numeric
      else coalesce(r.manual_confidence, r.cleanup_confidence, r.category_confidence)::numeric
    end as resolved_confidence,
    case
      when nullif(trim(coalesce(r.raw_category_path, '')), '') is null
        or r.price_row_count = 0
      then 'Blocked: missing category and/or product price rows. Do not publish without manual product data.'
      when r.manual_target_category is not null then r.manual_review_note
      when r.cleanup_target_category is not null and r.mixed_review_note is not null then r.mixed_review_note
      when r.cleanup_target_category is not null then coalesce(nullif(r.cleanup_review_note, ''), 'Product keyword cleanup mapping.')
      when r.category_target_category is not null then coalesce(nullif(r.category_review_note, ''), 'Category mapping v4.')
      else 'No confident category mapping. Manual review required.'
    end as resolved_review_notes,
    coalesce(nullif(r.cleanup_suggested_material, ''), nullif(r.category_suggested_material, '')) as resolved_suggested_material,
    coalesce(nullif(r.cleanup_suggested_tags, ''), nullif(r.category_suggested_tags, '')) as resolved_suggested_tags
  from resolved r
)
insert into public.supplier_transform_preview (
  batch_id, supplier, supplier_sku, raw_name, normalized_name, slug, page_role, target_category, target_subcategory, mapping_status, mapping_rule_id, confidence, brand, brand_alias_status, material_tags, tags, fulfillment, lead_time_min_days, lead_time_max_days, lead_time_unit, lead_time_basis, lead_time_note, offer_type, kit_themes, warning_flags, review_notes, preview_json
)
select
  r.batch_id,
  'Gear For Life' as supplier,
  r.preview_supplier_sku as supplier_sku,
  r.raw_name,
  trim(coalesce(r.raw_name, '')) as normalized_name,
  trim(both '-' from regexp_replace(lower(trim(coalesce(r.raw_name, '') || '-' || r.preview_supplier_sku)), '[^a-z0-9]+', '-', 'g')) as slug,
  case when r.resolved_mapping_status = 'ready' then 'P' else 'manual_review' end as page_role,
  r.resolved_target_category as target_category,
  r.resolved_target_subcategory as target_subcategory,
  r.resolved_mapping_status as mapping_status,
  r.resolved_mapping_rule_id as mapping_rule_id,
  r.resolved_confidence as confidence,
  case
    when r.brand_alias_action in ('normalize', 'keep') then nullif(r.normalized_brand, '')
    else nullif(r.raw_brand, '')
  end as brand,
  case
    when r.brand_alias_action in ('normalize', 'keep') then 'matched_' || r.brand_alias_action
    when nullif(trim(coalesce(r.raw_brand, '')), '') is not null then 'raw_unmatched'
    else 'none'
  end as brand_alias_status,
  array_remove(array[nullif(r.resolved_suggested_material, '')]::text[], null) as material_tags,
  '{}'::text[] as tags,
  'local_stock' as fulfillment,
  10 as lead_time_min_days,
  12 as lead_time_max_days,
  'business_days' as lead_time_unit,
  'decorated' as lead_time_basis,
  '10-12 business days after artwork approval' as lead_time_note,
  null::text as offer_type,
  '{}'::text[] as kit_themes,
  array_remove(array[
    case when r.source_row_number = 427 and r.preview_supplier_sku = 'ODGP(P)' then 'sku_conflict_resolved' end,
    case when nullif(trim(coalesce(r.raw_category_path, '')), '') is null then 'missing_category' end,
    case when r.price_row_count = 0 then 'missing_product_price' end,
    case when r.resolved_mapping_status = 'blocked' then 'blocked_manual_review' end,
    case when r.resolved_mapping_status = 'needs_review' then 'needs_review' end,
    case when r.gallery_fallback_image_count > 0 then 'gallery_fallback_images_preserved' end
  ]::text[], null) as warning_flags,
  r.resolved_review_notes as review_notes,
  jsonb_build_object(
    'source', 'gfl_transform_preview_draft',
    'source_row_number', r.source_row_number,
    'raw_supplier_sku', r.supplier_sku,
    'preview_supplier_sku', r.preview_supplier_sku,
    'raw_name', r.raw_name,
    'raw_brand', r.raw_brand,
    'raw_category_path', r.raw_category_path,
    'mapping_source',
      case
        when r.resolved_mapping_rule_id = 'gfl_manual_confirmed_category' then 'manual_confirmed_category'
        when r.resolved_mapping_rule_id like 'product_keyword_cleanup:%' then 'product_keyword_cleanup'
        when r.resolved_mapping_rule_id like 'category_mapping_v4:%' then 'category_mapping_v4'
        when r.resolved_mapping_rule_id = 'gfl_blocked_blank_category_or_missing_price' then 'blocked_blank_category_or_missing_price'
        else 'needs_review'
      end,
    'price_row_count', r.price_row_count,
    'colour_count', r.colour_count,
    'image_count', r.image_count,
    'gallery_fallback_image_count', r.gallery_fallback_image_count,
    'decoration_option_count', r.decoration_option_count,
    'decoration_price_row_count', r.decoration_price_row_count,
    'lead_time', jsonb_build_object(
      'min_days', 10,
      'max_days', 12,
      'unit', 'business_days',
      'basis', 'decorated',
      'note', '10-12 business days after artwork approval'
    ),
    'raw_product_json', r.raw_json
  ) as preview_json
from preview_rows r
order by r.source_row_number;

do $$
declare
  gfl_batch_id uuid;
begin
  select id into gfl_batch_id
  from public.supplier_import_batches
  where supplier = 'Gear For Life'
    and source_file_hash = 'f20ede9ac24d944fcb4c3c646d8ae2cbc41d2c63580200db27f2e86a96bf739c'
  order by created_at desc
  limit 1;

  if (select count(*) from public.supplier_transform_preview where batch_id = gfl_batch_id and supplier = 'Gear For Life') <> 471 then
    raise exception 'GFL transform preview row count mismatch.';
  end if;

  if (select count(*) from public.supplier_transform_preview where batch_id = gfl_batch_id and supplier = 'Gear For Life' and mapping_status = 'ready') <> 428 then
    raise exception 'GFL transform preview ready row count mismatch.';
  end if;

  if (select count(*) from public.supplier_transform_preview where batch_id = gfl_batch_id and supplier = 'Gear For Life' and mapping_status = 'needs_review') <> 8 then
    raise exception 'GFL transform preview needs_review row count mismatch.';
  end if;

  if (select count(*) from public.supplier_transform_preview where batch_id = gfl_batch_id and supplier = 'Gear For Life' and mapping_status = 'blocked') <> 35 then
    raise exception 'GFL transform preview blocked row count mismatch.';
  end if;

  if exists (
    select 1
    from public.supplier_transform_preview
    where batch_id = gfl_batch_id
      and supplier = 'Gear For Life'
      and (fulfillment <> 'local_stock'
        or lead_time_min_days <> 10
        or lead_time_max_days <> 12
        or lead_time_unit <> 'business_days'
        or lead_time_basis <> 'decorated')
  ) then
    raise exception 'GFL transform preview defaults are not supplier-specific local_stock / 10-12 business_days / decorated.';
  end if;

  if exists (
    select 1
    from public.supplier_transform_preview
    where batch_id = gfl_batch_id
      and supplier = 'Gear For Life'
    group by supplier_sku
    having count(*) > 1
  ) then
    raise exception 'GFL transform preview supplier_sku values must be unique after ODGP normalization.';
  end if;
end $$;

commit;

-- After this succeeds, run:
-- outputs/supplier_import_foundation/gear_for_life_pilot/gear_for_life_transform_preview_check_READONLY.sql
-- Then review needs_review / blocked rows before any product INSERT draft.

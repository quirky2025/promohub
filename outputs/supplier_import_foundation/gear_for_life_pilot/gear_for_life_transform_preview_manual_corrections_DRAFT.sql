-- Gear For Life TRANSFORM PREVIEW MANUAL CORRECTIONS - DRAFT
-- Purpose: apply user-confirmed review decisions to supplier_transform_preview only.
-- Scope: GFL transform preview rows only. Does not write products, url_pages, navigation, redirects, or storefront data.
-- Decisions:
--   - 8 previous needs_review rows are confirmed ready with category targets.
--   - 35 blocked rows are supplier-confirmed discontinued and remain blocked.
-- Run manually in Supabase only after reviewing this file.

begin;

do $$
declare
  gfl_batch_id uuid;
  confirmed_ready_skus text[] := array['PODIGB', 'POGTT', 'PORC', 'POTT', 'POLTT', 'POOMTT', 'POVCB', 'IGOISB']::text[];
  discontinued_skus text[] := array['EGAS', 'POFWGS', 'VT', 'GJ', 'TSC', 'OAN(C)', 'OASTOJ', 'BBYBS', 'OEGCP', 'OEGMCI', 'OWEGCP', 'OWEGMX', 'PORHFP', 'TAX', 'TTBL', 'BIO', 'PORT', 'POAFP', 'WTFL', 'TFL', 'TV', 'WMWJ', 'BMB', 'BMW', 'BINB', 'ODGHP', 'OTSZH', 'BPMC', 'POHF', 'POKGS', 'POMA', 'TEL', 'TMC', 'TYS', 'WTYS']::text[];
begin
  select id into gfl_batch_id
  from public.supplier_import_batches
  where supplier = 'Gear For Life'
    and source_file_hash = 'f20ede9ac24d944fcb4c3c646d8ae2cbc41d2c63580200db27f2e86a96bf739c'
  order by created_at desc
  limit 1;

  if gfl_batch_id is null then
    raise exception 'Gear For Life batch not found. Stop: run transform preview first.';
  end if;

  if (select count(*) from public.supplier_transform_preview where batch_id = gfl_batch_id and supplier = 'Gear For Life') <> 471 then
    raise exception 'Expected 471 GFL transform preview rows before manual correction.';
  end if;

  if (select count(*) from public.supplier_transform_preview where batch_id = gfl_batch_id and supplier = 'Gear For Life' and mapping_status = 'ready') <> 428 then
    raise exception 'Expected 428 ready rows before manual correction.';
  end if;

  if (select count(*) from public.supplier_transform_preview where batch_id = gfl_batch_id and supplier = 'Gear For Life' and mapping_status = 'needs_review') <> 8 then
    raise exception 'Expected 8 needs_review rows before manual correction.';
  end if;

  if (select count(*) from public.supplier_transform_preview where batch_id = gfl_batch_id and supplier = 'Gear For Life' and mapping_status = 'blocked') <> 35 then
    raise exception 'Expected 35 blocked rows before manual correction.';
  end if;

  if (
    select count(*)
    from public.supplier_transform_preview
    where batch_id = gfl_batch_id
      and supplier = 'Gear For Life'
      and supplier_sku = any(confirmed_ready_skus)
      and mapping_status = 'needs_review'
  ) <> 8 then
    raise exception 'Expected all 8 confirmed SKUs to currently be needs_review.';
  end if;

  if (
    select count(*)
    from public.supplier_transform_preview
    where batch_id = gfl_batch_id
      and supplier = 'Gear For Life'
      and supplier_sku = any(discontinued_skus)
      and mapping_status = 'blocked'
  ) <> 35 then
    raise exception 'Expected all 35 discontinued SKUs to currently be blocked.';
  end if;
end $$;

with gfl_batch as (
  select id as batch_id
  from public.supplier_import_batches
  where supplier = 'Gear For Life'
    and source_file_hash = 'f20ede9ac24d944fcb4c3c646d8ae2cbc41d2c63580200db27f2e86a96bf739c'
  order by created_at desc
  limit 1
),
confirmed_ready as (
  select *
  from (values
    ('PODIGB', 'Tools & Auto', 'Tool Sets & Screwdrivers', 'User confirmed product is a garden tool; closest existing target is Tools & Auto / Tool Sets & Screwdrivers.'),
    ('POGTT', 'Outdoor & Sports', 'Picnic & BBQ', 'User confirmed foldable table with four wine glass holders; outdoor/picnic use.'),
    ('PORC', 'Outdoor & Sports', 'Picnic & BBQ', 'User confirmed cooler box for drinks; no cooler-box category exists, use picnic/outdoor.'),
    ('POTT', 'Outdoor & Sports', 'Picnic & BBQ', 'User confirmed alfresco table with dual integrated wine glass holders.'),
    ('POLTT', 'Outdoor & Sports', 'Picnic & BBQ', 'User confirmed beach/outdoor use with eight stemmed glasses and two bottles.'),
    ('POOMTT', 'Outdoor & Sports', 'Picnic & BBQ', 'User confirmed outdoor table with four wine glass holders and centre umbrella hole.'),
    ('POVCB', 'Outdoor & Sports', 'Picnic & BBQ', 'User confirmed cooler box for drinks; no cooler-box category exists, use picnic/outdoor.'),
    ('IGOISB', 'Outdoor & Sports', 'Picnic & BBQ', 'User confirmed cooler box with speaker; primary use is outdoor drinks/cooler.')
  ) as v(supplier_sku, target_category, target_subcategory, confirmation_note)
)
update public.supplier_transform_preview p
set
  page_role = 'P',
  target_category = v.target_category,
  target_subcategory = v.target_subcategory,
  mapping_status = 'ready',
  mapping_rule_id = 'gfl_manual_confirmed_category',
  confidence = 0.95,
  warning_flags = coalesce((
    select array_agg(flag order by flag)
    from (
      select distinct flag
      from unnest(p.warning_flags) as u(flag)
      where flag <> 'needs_review'
    ) x
  ), '{}'::text[]),
  review_notes = v.confirmation_note,
  preview_json = p.preview_json || jsonb_build_object(
    'mapping_source', 'manual_confirmed_category',
    'manual_review_confirmed', true,
    'manual_review_confirmed_at', '2026-06-15',
    'manual_review_note', v.confirmation_note,
    'target_category', v.target_category,
    'target_subcategory', v.target_subcategory
  )
from gfl_batch b, confirmed_ready v
where p.batch_id = b.batch_id
  and p.supplier = 'Gear For Life'
  and p.supplier_sku = v.supplier_sku;

with gfl_batch as (
  select id as batch_id
  from public.supplier_import_batches
  where supplier = 'Gear For Life'
    and source_file_hash = 'f20ede9ac24d944fcb4c3c646d8ae2cbc41d2c63580200db27f2e86a96bf739c'
  order by created_at desc
  limit 1
),
discontinued as (
  select unnest(array['EGAS', 'POFWGS', 'VT', 'GJ', 'TSC', 'OAN(C)', 'OASTOJ', 'BBYBS', 'OEGCP', 'OEGMCI', 'OWEGCP', 'OWEGMX', 'PORHFP', 'TAX', 'TTBL', 'BIO', 'PORT', 'POAFP', 'WTFL', 'TFL', 'TV', 'WMWJ', 'BMB', 'BMW', 'BINB', 'ODGHP', 'OTSZH', 'BPMC', 'POHF', 'POKGS', 'POMA', 'TEL', 'TMC', 'TYS', 'WTYS']::text[]) as supplier_sku
)
update public.supplier_transform_preview p
set
  mapping_status = 'blocked',
  page_role = 'manual_review',
  target_category = null,
  target_subcategory = null,
  mapping_rule_id = 'gfl_supplier_confirmed_discontinued',
  confidence = null,
  warning_flags = coalesce((
    select array_agg(flag order by flag)
    from (
      select distinct flag
      from unnest(p.warning_flags || array['supplier_discontinued']::text[]) as u(flag)
    ) x
  ), '{supplier_discontinued}'::text[]),
  review_notes = 'Supplier confirmed discontinued; keep blocked and do not publish.',
  preview_json = p.preview_json || jsonb_build_object(
    'supplier_confirmed_discontinued', true,
    'manual_review_confirmed_at', '2026-06-15',
    'manual_review_note', 'Supplier confirmed discontinued; keep blocked and do not publish.'
  )
from gfl_batch b, discontinued d
where p.batch_id = b.batch_id
  and p.supplier = 'Gear For Life'
  and p.supplier_sku = d.supplier_sku;

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
    raise exception 'GFL transform preview row count changed unexpectedly.';
  end if;

  if (select count(*) from public.supplier_transform_preview where batch_id = gfl_batch_id and supplier = 'Gear For Life' and mapping_status = 'ready') <> 436 then
    raise exception 'Post-correction ready count mismatch.';
  end if;

  if (select count(*) from public.supplier_transform_preview where batch_id = gfl_batch_id and supplier = 'Gear For Life' and mapping_status = 'needs_review') <> 0 then
    raise exception 'Post-correction needs_review count mismatch.';
  end if;

  if (select count(*) from public.supplier_transform_preview where batch_id = gfl_batch_id and supplier = 'Gear For Life' and mapping_status = 'blocked') <> 35 then
    raise exception 'Post-correction blocked count mismatch.';
  end if;

  if (select count(*) from public.supplier_transform_preview where batch_id = gfl_batch_id and supplier = 'Gear For Life' and mapping_rule_id = 'gfl_manual_confirmed_category') <> 17 then
    raise exception 'Post-correction manual confirmed category count mismatch.';
  end if;

  if (
    select count(*)
    from public.supplier_transform_preview
    where batch_id = gfl_batch_id
      and supplier = 'Gear For Life'
      and mapping_rule_id = 'gfl_supplier_confirmed_discontinued'
      and 'supplier_discontinued' = any(warning_flags)
  ) <> 35 then
    raise exception 'Post-correction discontinued blocked count mismatch.';
  end if;
end $$;

commit;

-- After this succeeds, run:
-- outputs/supplier_import_foundation/gear_for_life_pilot/gear_for_life_transform_preview_manual_corrections_check_READONLY.sql

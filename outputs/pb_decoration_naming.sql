-- ================================================================
-- PB (PromoBrands) decoration naming normalisation
-- Rules (confirmed with Lily):
--   * Pad Print / Screen Print            -> "X Per Colour/Position"
--   * everything else (incl Wrap Screen)  -> "X Per Position"
--   * merge typos/variants (Laser Engraving/Engrave/Enrgaving, Screen Printing,
--     Wrap Laser/Laser Wrap, Sublimation*, Direct Digital/Digital Direct...)
--   * move (position) + trailing desc from name -> detail
--   * strip "- NN Day Service Time" from method name
--   * size: strip W/H/L markers ("45mm W x 45mm H" -> "45mm x 45mm")
--   * "Screen / Pad Print" -> SPLIT into two rows (handled in STEP 3)
-- Only touches supplier PromoBrands, type='branding'. per_unit / prices untouched.
-- ================================================================

-- ---------- STEP 0: BACKUP ----------
create table decoration_options_bak_pb_naming as
select d.* from decoration_options d
join products p on p.id = d.product_id
where p.supplier ilike '%promobrand%' and d.type = 'branding';

-- ---------- STEP 1: PREVIEW (run this SELECT first, eyeball before/after) ----------
with base as (
  select d.id, p.supplier_sku, d.name as old_name, d.detail as old_detail,
    trim(regexp_replace(regexp_replace(d.name, '\s*\(.*$',''), '\s*[-–]\s*\d+\s*[Dd]ay.*$','')) as m1,
    case when position('(' in d.name) > 0
      then nullif(trim(both ' -–—' from regexp_replace(substr(d.name, position('(' in d.name)), '[()]','','g')), '')
      else null end as paren
  from decoration_options d join products p on p.id = d.product_id
  where p.supplier ilike '%promobrand%' and d.type='branding'
    and d.name !~* '^\s*screen\s*/\s*pad'
),
sz as (
  select *, (regexp_match(m1,'^(Large|Medium|Small)\s','i'))[1] as size_word,
            trim(regexp_replace(m1,'^(Large|Medium|Small)\s','','i')) as m2
  from base
),
canon as (
  select *, (case
    when lower(m2) like 'wrap screen%' or lower(m2)='screen wrap' then 'Wrap Screen Print'
    when lower(m2) like 'pad print%' then 'Pad Print'
    when lower(m2) in ('screen print','screen printing') then 'Screen Print'
    when lower(m2) like 'wrap laser%' or lower(m2) like 'laser wrap%' or lower(m2) like 'laser engraving wrap%' then 'Wrap Laser Engrave'
    when lower(m2) like 'variable data laser%' then 'Variable Data Laser Engrave'
    when lower(m2) like 'mirror laser%' then 'Mirror Laser Engrave'
    when lower(m2) like '%blacken%' then 'Laser Engrave & Blacken'
    when lower(m2) like 'laser%' or lower(m2) in ('engraving','laser','laser enrgaving') then 'Laser Engrave'
    when lower(m2) like 'direct digital%' or lower(m2)='digital direct print' then 'Direct Digital Print'
    when lower(m2) like 'digital transfer%' then 'Digital Transfer'
    when lower(m2) like 'digital label%' then 'Digital Label'
    when lower(m2) like 'digital print%' then 'Digital Print'
    when lower(m2) like '4 colour%' then '4 Colour Process'
    when lower(m2) like '%sublimation%' then 'Full Colour Sublimation'
    when lower(m2) like 'metallic transfer%' then 'Metallic Transfer'
    else m2 end) as method
  from sz
),
fin as (
  select id, supplier_sku, old_name, old_detail,
    method || case when method in ('Pad Print','Screen Print') then ' Per Colour/Position' else ' Per Position' end as new_name,
    nullif(trim(both ' -' from concat_ws(' ', size_word, paren)), '') as qual,
    trim(regexp_replace(regexp_replace(regexp_replace(coalesce(old_detail,''),
      '\s*mm\s*[LWHlwh]','mm','g'), '(\d)\s+[LWHlwh]($|\s|,|-)','\1mm\2','g'), '\s+',' ','g')) as size_clean
  from canon
)
select supplier_sku, old_name, old_detail, new_name,
  case when qual is not null and size_clean <> '' then qual || ' - ' || size_clean
       when qual is not null then qual else size_clean end as new_detail
from fin
order by supplier_sku;

-- ---------- STEP 2: APPLY (same logic as preview; run after preview looks right) ----------
with base as (
  select d.id,
    trim(regexp_replace(regexp_replace(d.name, '\s*\(.*$',''), '\s*[-–]\s*\d+\s*[Dd]ay.*$','')) as m1,
    case when position('(' in d.name) > 0
      then nullif(trim(both ' -–—' from regexp_replace(substr(d.name, position('(' in d.name)), '[()]','','g')), '')
      else null end as paren,
    d.detail as old_detail
  from decoration_options d join products p on p.id = d.product_id
  where p.supplier ilike '%promobrand%' and d.type='branding'
    and d.name !~* '^\s*screen\s*/\s*pad'
),
sz as (
  select *, (regexp_match(m1,'^(Large|Medium|Small)\s','i'))[1] as size_word,
            trim(regexp_replace(m1,'^(Large|Medium|Small)\s','','i')) as m2
  from base
),
canon as (
  select *, (case
    when lower(m2) like 'wrap screen%' or lower(m2)='screen wrap' then 'Wrap Screen Print'
    when lower(m2) like 'pad print%' then 'Pad Print'
    when lower(m2) in ('screen print','screen printing') then 'Screen Print'
    when lower(m2) like 'wrap laser%' or lower(m2) like 'laser wrap%' or lower(m2) like 'laser engraving wrap%' then 'Wrap Laser Engrave'
    when lower(m2) like 'variable data laser%' then 'Variable Data Laser Engrave'
    when lower(m2) like 'mirror laser%' then 'Mirror Laser Engrave'
    when lower(m2) like '%blacken%' then 'Laser Engrave & Blacken'
    when lower(m2) like 'laser%' or lower(m2) in ('engraving','laser','laser enrgaving') then 'Laser Engrave'
    when lower(m2) like 'direct digital%' or lower(m2)='digital direct print' then 'Direct Digital Print'
    when lower(m2) like 'digital transfer%' then 'Digital Transfer'
    when lower(m2) like 'digital label%' then 'Digital Label'
    when lower(m2) like 'digital print%' then 'Digital Print'
    when lower(m2) like '4 colour%' then '4 Colour Process'
    when lower(m2) like '%sublimation%' then 'Full Colour Sublimation'
    when lower(m2) like 'metallic transfer%' then 'Metallic Transfer'
    else m2 end) as method
  from sz
),
fin as (
  select id,
    method || case when method in ('Pad Print','Screen Print') then ' Per Colour/Position' else ' Per Position' end as new_name,
    nullif(trim(both ' -' from concat_ws(' ', size_word, paren)), '') as qual,
    trim(regexp_replace(regexp_replace(regexp_replace(coalesce(old_detail,''),
      '\s*mm\s*[LWHlwh]','mm','g'), '(\d)\s+[LWHlwh]($|\s|,|-)','\1mm\2','g'), '\s+',' ','g')) as size_clean
  from canon
)
update decoration_options d
set name = fin.new_name,
    detail = case when fin.qual is not null and fin.size_clean <> '' then fin.qual || ' - ' || fin.size_clean
                  when fin.qual is not null then fin.qual else fin.size_clean end
from fin
where fin.id = d.id;

-- ---------- STEP 3: "Screen / Pad Print" -> split into 2 rows ----------
insert into decoration_options (product_id, name, detail, per_unit, has_setup, setup_qty_editable, default_setup_qty, sort_order, type)
select d.product_id, m.nm,
  trim(regexp_replace(regexp_replace(regexp_replace(coalesce(d.detail,''),
    '\s*mm\s*[LWHlwh]','mm','g'), '(\d)\s+[LWHlwh]($|\s|,|-)','\1mm\2','g'), '\s+',' ','g')),
  d.per_unit, d.has_setup, true, d.default_setup_qty, d.sort_order, d.type
from decoration_options d join products p on p.id = d.product_id
cross join (values ('Screen Print Per Colour/Position'),('Pad Print Per Colour/Position')) m(nm)
where p.supplier ilike '%promobrand%' and d.type='branding' and d.name ~* '^\s*screen\s*/\s*pad';

delete from decoration_options d using products p
where d.product_id = p.id and p.supplier ilike '%promobrand%' and d.type='branding'
  and d.name ~* '^\s*screen\s*/\s*pad';

-- ---------- STEP 3.5: add the 3 missing add-ons (accessory/packaging) from source ----------
-- M418 marker+clip accessory; S003/S010 paper sleeve card. type='addon', run once.
insert into decoration_options (product_id, name, detail, per_unit, has_setup, setup_qty_editable, default_setup_qty, sort_order, type)
select p.id, v.nm, v.dt, v.pu, false, false, 1, 90, 'addon'
from (values
  ('M418','Marker and Clip','Add a marker and clip to complete this product', 0.45),
  ('S003','Paper Sleeve Card','50mm x 80mm', 2.0),
  ('S010','Paper Sleeve Card','50mm x 80mm', 2.0)
) as v(sku, nm, dt, pu)
join products p on p.supplier_sku = v.sku and p.supplier ilike '%promobrand%'
where not exists (
  select 1 from decoration_options d where d.product_id = p.id and d.name = v.nm
);

-- ---------- STEP 4: VERIFY (all PB branding names should now end in a suffix) ----------
select
  count(*) filter (where name not ilike '% per colour/position' and name not ilike '% per position') as unsuffixed,
  count(*) filter (where detail ~ '[WHwh]\s*$' or detail ~ 'mm\s*[LWHlwh]\b') as detail_with_WH,
  count(*) as total
from decoration_options d join products p on p.id = d.product_id
where p.supplier ilike '%promobrand%' and d.type='branding';

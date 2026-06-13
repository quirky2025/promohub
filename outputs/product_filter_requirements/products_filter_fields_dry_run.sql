-- Products filter fields dry run
-- Safe to run. This file does not write data.
-- Purpose: check current products table readiness for url_pages product_filter.

with required_columns(column_name) as (
  values
    ('material_tags'),
    ('tags'),
    ('fulfillment'),
    ('is_australian_made'),
    ('offer_type'),
    ('kit_themes'),
    ('kit_components'),
    ('related_categories'),
    ('pack_size'),
    ('supplier'),
    ('supplier_raw_category_path')
),
column_status as (
  select
    r.column_name,
    case when c.column_name is null then false else true end as exists_now,
    c.data_type,
    c.udt_name,
    c.is_nullable,
    c.column_default
  from required_columns r
  left join information_schema.columns c
    on c.table_schema = 'public'
   and c.table_name = 'products'
   and c.column_name = r.column_name
),
required_constraints(constraint_name) as (
  values
    ('products_fulfillment_check'),
    ('products_offer_type_check'),
    ('products_pack_size_check')
),
constraint_status as (
  select
    r.constraint_name,
    case when tc.constraint_name is null then false else true end as exists_now
  from required_constraints r
  left join information_schema.table_constraints tc
    on tc.table_schema = 'public'
   and tc.table_name = 'products'
   and tc.constraint_name = r.constraint_name
),
required_indexes(indexname) as (
  values
    ('idx_products_category_published'),
    ('idx_products_subcategory_published'),
    ('idx_products_material_tags'),
    ('idx_products_tags'),
    ('idx_products_kit_themes'),
    ('idx_products_offer_type'),
    ('idx_products_fulfillment')
),
index_status as (
  select
    r.indexname,
    case when i.indexname is null then false else true end as exists_now
  from required_indexes r
  left join pg_indexes i
    on i.schemaname = 'public'
   and i.tablename = 'products'
   and i.indexname = r.indexname
)
select 'missing_columns' as check_name, count(*)::text as result
from column_status where exists_now = false
union all
select 'missing_constraints', count(*)::text
from constraint_status where exists_now = false
union all
select 'missing_indexes', count(*)::text
from index_status where exists_now = false
union all
select 'products_table_exists',
  case when to_regclass('public.products') is null then 'false' else 'true' end;

-- Detail: missing columns/constraints/indexes.
with required_columns(column_name) as (
  values
    ('material_tags'), ('tags'), ('fulfillment'), ('is_australian_made'),
    ('offer_type'), ('kit_themes'), ('kit_components'), ('related_categories'),
    ('pack_size'), ('supplier'), ('supplier_raw_category_path')
),
column_status as (
  select r.column_name, c.column_name is not null as exists_now
  from required_columns r
  left join information_schema.columns c
    on c.table_schema = 'public'
   and c.table_name = 'products'
   and c.column_name = r.column_name
),
required_constraints(constraint_name) as (
  values ('products_fulfillment_check'), ('products_offer_type_check'), ('products_pack_size_check')
),
constraint_status as (
  select r.constraint_name, tc.constraint_name is not null as exists_now
  from required_constraints r
  left join information_schema.table_constraints tc
    on tc.table_schema = 'public'
   and tc.table_name = 'products'
   and tc.constraint_name = r.constraint_name
),
required_indexes(indexname) as (
  values
    ('idx_products_category_published'), ('idx_products_subcategory_published'),
    ('idx_products_material_tags'), ('idx_products_tags'), ('idx_products_kit_themes'),
    ('idx_products_offer_type'), ('idx_products_fulfillment')
),
index_status as (
  select r.indexname, i.indexname is not null as exists_now
  from required_indexes r
  left join pg_indexes i
    on i.schemaname = 'public'
   and i.tablename = 'products'
   and i.indexname = r.indexname
)
select 'missing_column' as issue, column_name as name from column_status where exists_now = false
union all
select 'missing_constraint', constraint_name from constraint_status where exists_now = false
union all
select 'missing_index', indexname from index_status where exists_now = false
order by issue, name;

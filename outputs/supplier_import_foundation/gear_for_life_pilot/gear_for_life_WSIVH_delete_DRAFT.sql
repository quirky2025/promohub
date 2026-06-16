-- Gear For Life: DELETE discontinued product WSIVH -- DRAFT, WRITE OPERATION.
-- Run gear_for_life_WSIVH_delete_preview_READONLY.sql FIRST and confirm the counts.
--
-- SAFETY:
--   * Scoped strictly to supplier = 'Gear For Life' AND supplier_sku = 'WSIVH'.
--   * Deletes child rows (images, pricing_tiers, colours) before the product row.
--   * Wrapped in a transaction: review the verify counts, then COMMIT or ROLLBACK.
--   * Touches only this one product.

begin;

with target as (
  select id from public.products
  where supplier = 'Gear For Life' and supplier_sku = 'WSIVH'
)
delete from public.product_images where product_id in (select id from target);

with target as (
  select id from public.products
  where supplier = 'Gear For Life' and supplier_sku = 'WSIVH'
)
delete from public.pricing_tiers where product_id in (select id from target);

with target as (
  select id from public.products
  where supplier = 'Gear For Life' and supplier_sku = 'WSIVH'
)
delete from public.product_colours where product_id in (select id from target);

delete from public.products
where supplier = 'Gear For Life' and supplier_sku = 'WSIVH';

-- VERIFY (all should be 0 before you COMMIT):
select 'remaining_product'  as object, count(*)::int as rows
from public.products where supplier='Gear For Life' and supplier_sku='WSIVH'
union all select 'remaining_images', count(*)::int
from public.product_images pi
  join public.products p on p.id=pi.product_id
where p.supplier='Gear For Life' and p.supplier_sku='WSIVH'
union all select 'remaining_tiers', count(*)::int
from public.pricing_tiers pt
  join public.products p on p.id=pt.product_id
where p.supplier='Gear For Life' and p.supplier_sku='WSIVH'
union all select 'remaining_colours', count(*)::int
from public.product_colours pc
  join public.products p on p.id=pc.product_id
where p.supplier='Gear For Life' and p.supplier_sku='WSIVH';

-- If counts look right (product removed): COMMIT;
-- If anything looks wrong:               ROLLBACK;
commit;

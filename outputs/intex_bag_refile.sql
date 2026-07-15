-- INTEX 袋类子分类归位修正。只改 category/subcategory(+5个背包的错误命名)。整块跑一次。
-- FOLB10(购物车袋)按决定暂留 Tote Bags,不动。

-- ── Backpacks(背包)+ 去掉名字里多余的 "Tote Bag" ──
update products set subcategory='Backpacks', name='Colorado Backpack'   where supplier_sku='5101' and supplier ilike 'intexglobal%';
update products set subcategory='Backpacks', name='Fitzroy Backpack'    where supplier_sku='5102' and supplier ilike 'intexglobal%';
update products set subcategory='Backpacks', name='Eiger Backpack'      where supplier_sku='5103' and supplier ilike 'intexglobal%';
update products set subcategory='Backpacks', name='Blackburn Backpack'  where supplier_sku='5104' and supplier ilike 'intexglobal%';
update products set subcategory='Backpacks', name='Fairweather Backpack' where supplier_sku='5105' and supplier ilike 'intexglobal%';

-- ── Dry Bags(干袋)──
update products set subcategory='Dry Bags' where supplier_sku='PS4811' and supplier ilike 'intexglobal%';

-- ── Travel & Duffle Bags(旅行/行李袋)──
update products set subcategory='Travel & Duffle Bags' where supplier_sku in ('PS4211','OCHCD01','OCBSB104','OCBAB105','DUFB33') and supplier ilike 'intexglobal%';

-- ── Crossbody & Belt Bags(Sling 单肩)──
update products set subcategory='Crossbody & Belt Bags' where supplier_sku in ('NWTB20','PS4105') and supplier ilike 'intexglobal%';

-- ── Garment 西装袋 → Apparel / Apparel Accessories ──
update products set category='Apparel', subcategory='Apparel Accessories' where supplier_sku='NWTB3035' and supplier ilike 'intexglobal%';

-- ── 核对 ──
select supplier_sku, category, subcategory, name
from products
where supplier ilike 'intexglobal%'
  and supplier_sku in ('5101','5102','5103','5104','5105','PS4811','PS4211','OCHCD01','OCBSB104','OCBAB105','DUFB33','NWTB20','PS4105','NWTB3035')
order by category, subcategory, supplier_sku;

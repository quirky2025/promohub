-- LL (Logoline) decoration full rebuild — auto-generated from Logoline pricelist
-- 634 clean products, 2070 rows. Backup: decoration_options_bak_ll_0710.
-- per_unit = supplier COST (frontend applies x1.4 + round-up). Only touches supplier ilike logoline%.

-- LL0007 Monza Car Charger
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0007' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Front - 25 x 15mm',0.25,true,true,1,1,'branding' from products p where p.supplier_sku='LL0007' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front - 25 x 15mm',0.4,true,false,1,2,'branding' from products p where p.supplier_sku='LL0007' and p.supplier ilike 'logoline%';

-- LL001 Monte Carlo Luggage Tag
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL001' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Front - 80 x 50mm',0.25,true,true,1,1,'branding' from products p where p.supplier_sku='LL001' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front - 110 x 60mm',0.75,true,false,1,2,'branding' from products p where p.supplier_sku='LL001' and p.supplier ilike 'logoline%';

-- LL0024 Dominator Set
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0024' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Case Lid - 150 x 45mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL0024' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Case Lid - 150 x 45mm',0.8,true,false,1,2,'branding' from products p where p.supplier_sku='LL0024' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Case Lid - 100 x 45mm',1.0,true,false,1,3,'branding' from products p where p.supplier_sku='LL0024' and p.supplier ilike 'logoline%';

-- LL0030 Chase Recycled Playing Cards
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0030' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Box - 50 x 50mm, 40 x 70mm',0.19,true,false,1,1,'branding' from products p where p.supplier_sku='LL0030' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Box - 40 x 50mm',0.25,true,true,1,2,'branding' from products p where p.supplier_sku='LL0030' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Box - 40 x 70mm',0.5,true,false,1,3,'branding' from products p where p.supplier_sku='LL0030' and p.supplier ilike 'logoline%';

-- LL005 Handy Highlighter
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL005' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Front/Back - 38 x 22mm',0.2,true,true,1,1,'branding' from products p where p.supplier_sku='LL005' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front/Back - 53 x 36mm',0.4,true,false,1,2,'branding' from products p where p.supplier_sku='LL005' and p.supplier ilike 'logoline%';

-- LL0100 Thump Earbud Set
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0100' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','50mm Dia.',0.25,true,false,1,1,'branding' from products p where p.supplier_sku='LL0100' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','48mm Dia.',0.25,true,true,1,2,'branding' from products p where p.supplier_sku='LL0100' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','50mm Dia.',0.2,true,false,1,3,'branding' from products p where p.supplier_sku='LL0100' and p.supplier ilike 'logoline%';

-- LL012 Quack PVC Bath Duck
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL012' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Chest - 25 x 13mm',0.25,true,true,1,1,'branding' from products p where p.supplier_sku='LL012' and p.supplier ilike 'logoline%';

-- LL0208 Arc Round Wireless Charger
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0208' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Standard Charger - 50mm Dia',0.5,true,false,1,1,'branding' from products p where p.supplier_sku='LL0208' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Edge to Edge Charger - 70mm Dia',0.7,true,false,1,2,'branding' from products p where p.supplier_sku='LL0208' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Box Sleeve - 219mm x 74mm',1.25,true,false,1,3,'branding' from products p where p.supplier_sku='LL0208' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Charger - 50mm Dia',0.25,true,true,1,4,'branding' from products p where p.supplier_sku='LL0208' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Box - 50 x 50mm',0.25,true,false,1,5,'branding' from products p where p.supplier_sku='LL0208' and p.supplier ilike 'logoline%';

-- LL0210 Arc Square Wireless Charger
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0210' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Standard - 50 x 50mm',0.5,true,false,1,1,'branding' from products p where p.supplier_sku='LL0210' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Edge to Edge - 62 x 62mm',0.7,true,false,1,2,'branding' from products p where p.supplier_sku='LL0210' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Box Sleeve - 219 x 74mm',1.25,true,false,1,3,'branding' from products p where p.supplier_sku='LL0210' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','50 x 50mm',0.25,true,true,1,4,'branding' from products p where p.supplier_sku='LL0210' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Box - 50 x 50mm',0.25,true,false,1,5,'branding' from products p where p.supplier_sku='LL0210' and p.supplier ilike 'logoline%';

-- LL0215 Proton Wireless Charger
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0215' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','60 x 50mm',0.3,true,true,1,1,'branding' from products p where p.supplier_sku='LL0215' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Box - 50 x 50mm',0.25,true,false,1,2,'branding' from products p where p.supplier_sku='LL0215' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Standard - 60 x 55mm',0.7,true,false,1,3,'branding' from products p where p.supplier_sku='LL0215' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Edge to Edge - 95 x 75mm, Digital Sleeve - full coverage',0.9,true,false,1,4,'branding' from products p where p.supplier_sku='LL0215' and p.supplier ilike 'logoline%';

-- LL0217 Hover Wireless Charger / Mouse Pad
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0217' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','150 x 145mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL0217' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Small - 180 x 180mm',1.0,true,false,1,2,'branding' from products p where p.supplier_sku='LL0217' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Large - 270 x 189mm',1.5,true,false,1,3,'branding' from products p where p.supplier_sku='LL0217' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sleeve - 365 x 308mm',4.0,true,false,1,4,'branding' from products p where p.supplier_sku='LL0217' and p.supplier ilike 'logoline%';

-- LL0219 Boost Wireless Power Bank  / Charging Station
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0219' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Power Bank - 130 x 55mm, Sleeve - 395 x 180',1.25,true,false,1,1,'branding' from products p where p.supplier_sku='LL0219' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Base - 40 x 20mm',0.25,true,true,1,2,'branding' from products p where p.supplier_sku='LL0219' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Power Bank - 60 x 45mm',0.8,true,true,1,3,'branding' from products p where p.supplier_sku='LL0219' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Box - 70 x 40mm',0.25,true,false,1,4,'branding' from products p where p.supplier_sku='LL0219' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Power Bank - 70 x 50mm',0.8,true,true,1,5,'branding' from products p where p.supplier_sku='LL0219' and p.supplier ilike 'logoline%';

-- LL0220 Arc Round Bamboo Wireless Charger
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0220' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Standard Charger - 50mm Dia',0.5,true,false,1,1,'branding' from products p where p.supplier_sku='LL0220' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Edge to Edge Charger - 70mm Dia',0.7,true,false,1,2,'branding' from products p where p.supplier_sku='LL0220' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sleeve - 219 x 74mm',1.25,true,false,1,3,'branding' from products p where p.supplier_sku='LL0220' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Charger - 50mm Dia',0.25,true,true,1,4,'branding' from products p where p.supplier_sku='LL0220' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Charger - 50mm Dia',1.0,true,false,1,5,'branding' from products p where p.supplier_sku='LL0220' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Box - 50 x 50mm',0.25,true,false,1,6,'branding' from products p where p.supplier_sku='LL0220' and p.supplier ilike 'logoline%';

-- LL0221 Proton Eco Wireless Charger
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0221' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','50 x 50mm',0.3,true,true,1,1,'branding' from products p where p.supplier_sku='LL0221' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Standard - 60 x 55mm',0.7,true,false,1,2,'branding' from products p where p.supplier_sku='LL0221' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Edge to Edge - 95 x 75mm, Sleeve - Full coverage',0.9,true,false,1,3,'branding' from products p where p.supplier_sku='LL0221' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Box - 50 x 50mm',0.25,true,false,1,4,'branding' from products p where p.supplier_sku='LL0221' and p.supplier ilike 'logoline%';

-- LL0222 Arc Eco Round Wireless Charger
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0222' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Standard Charger - 50mm Dia',0.5,true,false,1,1,'branding' from products p where p.supplier_sku='LL0222' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Edge to Edge Charger - 70mm Dia',0.7,true,false,1,2,'branding' from products p where p.supplier_sku='LL0222' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Box Sleeve - 219 x 74mm',1.25,true,false,1,3,'branding' from products p where p.supplier_sku='LL0222' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Charger - 50mm Dia',0.25,true,true,1,4,'branding' from products p where p.supplier_sku='LL0222' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Box - 50 x 50mm',0.25,true,false,1,5,'branding' from products p where p.supplier_sku='LL0222' and p.supplier ilike 'logoline%';

-- LL0224 Arc Square Bamboo Wireless Charger
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0224' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Standard Charger - 50 x 50mm',0.5,true,false,1,1,'branding' from products p where p.supplier_sku='LL0224' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Edge to Edge Charger - 62 x 62mm',0.7,true,false,1,2,'branding' from products p where p.supplier_sku='LL0224' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sleeve - 219 x 74mm',1.25,true,false,1,3,'branding' from products p where p.supplier_sku='LL0224' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Charger - 50 x 50mm',0.25,true,true,1,4,'branding' from products p where p.supplier_sku='LL0224' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Charger - 50 x 50mm',1.0,true,false,1,5,'branding' from products p where p.supplier_sku='LL0224' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Box - 50 x 50mm',0.25,true,false,1,6,'branding' from products p where p.supplier_sku='LL0224' and p.supplier ilike 'logoline%';

-- LL0225 Target Wireless Charger
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0225' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Front slide panel - 55 x 55mm',0.25,true,true,1,1,'branding' from products p where p.supplier_sku='LL0225' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front slide panel - 60 x 60mm, Sleeve - Full coverage',0.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL0225' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Box - 99.1 x 93.1mm, Variable Data - Label (Full name applied to each box for easy identification)',0.25,true,false,1,3,'branding' from products p where p.supplier_sku='LL0225' and p.supplier ilike 'logoline%';

-- LL0226 Arc Eco Square Wireless Charger
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0226' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Standard Charger - 50 x 50mm',0.5,true,false,1,1,'branding' from products p where p.supplier_sku='LL0226' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Edge to Edge Charger - 62 x 62mm',0.7,true,false,1,2,'branding' from products p where p.supplier_sku='LL0226' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Box Sleeve - 219 x 74mm',1.25,true,false,1,3,'branding' from products p where p.supplier_sku='LL0226' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Charger - 50 x 50mm',0.25,true,true,1,4,'branding' from products p where p.supplier_sku='LL0226' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Box - 50 x 50mm',0.25,true,false,1,5,'branding' from products p where p.supplier_sku='LL0226' and p.supplier ilike 'logoline%';

-- LL0230 Dune Fast Wireless Charger
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0230' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front Panel - 55 x 85mm',0.9,true,false,1,1,'branding' from products p where p.supplier_sku='LL0230' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Front Panel - 55 x 55mm',0.3,true,true,1,2,'branding' from products p where p.supplier_sku='LL0230' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Box - 50 x 50mm',0.25,true,false,1,3,'branding' from products p where p.supplier_sku='LL0230' and p.supplier ilike 'logoline%';

-- LL0240 Talon Magnetic Fast Wireless Charger
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0240' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Standard Charger - 40mmDia',0.5,true,false,1,1,'branding' from products p where p.supplier_sku='LL0240' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Edge to Edge Charger - 60mmDia',0.7,true,false,1,2,'branding' from products p where p.supplier_sku='LL0240' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Box Sleeve - 214 x 72mm',1.25,true,false,1,3,'branding' from products p where p.supplier_sku='LL0240' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Charger - 40mmDia',0.25,true,true,1,4,'branding' from products p where p.supplier_sku='LL0240' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Box - 50 x 50mm, Variable Data - Label (Full name applied to each box for easy identification)',0.25,true,false,1,5,'branding' from products p where p.supplier_sku='LL0240' and p.supplier ilike 'logoline%';

-- LL0271 Bamboo Ranger Fast Wireless Charger
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0271' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Charger - 50mmDia',0.25,true,true,1,1,'branding' from products p where p.supplier_sku='LL0271' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Charger - 86mmDia',0.7,true,false,1,2,'branding' from products p where p.supplier_sku='LL0271' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sleeve - 326mm x 132mm',1.5,true,false,1,3,'branding' from products p where p.supplier_sku='LL0271' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Box - 50 x 50mm',0.25,true,false,1,4,'branding' from products p where p.supplier_sku='LL0271' and p.supplier ilike 'logoline%';

-- LL0272 Cork Ranger Fast Wireless Charger
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0272' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Charger - 50mmDia',0.25,true,true,1,1,'branding' from products p where p.supplier_sku='LL0272' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Charger - 86mmDia',0.7,true,false,1,2,'branding' from products p where p.supplier_sku='LL0272' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sleeve - 326mm x 132mm',1.5,true,false,1,3,'branding' from products p where p.supplier_sku='LL0272' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Box - 50 x 50mm',0.25,true,false,1,4,'branding' from products p where p.supplier_sku='LL0272' and p.supplier ilike 'logoline%';

-- LL0273 Wood Ranger Fast Wireless Charger
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0273' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Charger - 50mmDia',0.25,true,true,1,1,'branding' from products p where p.supplier_sku='LL0273' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Charger - 86mm Dia',0.7,true,false,1,2,'branding' from products p where p.supplier_sku='LL0273' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sleeve - 326mm x 132mm',1.5,true,false,1,3,'branding' from products p where p.supplier_sku='LL0273' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Box - 50 x 50mm',0.25,true,false,1,4,'branding' from products p where p.supplier_sku='LL0273' and p.supplier ilike 'logoline%';

-- LL0275 Aluminium Ranger Fast Wireless Charger
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0275' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Charger - 50mmDia',0.25,true,true,1,1,'branding' from products p where p.supplier_sku='LL0275' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Charger - 86mmDia',0.7,true,false,1,2,'branding' from products p where p.supplier_sku='LL0275' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sleeve - 326mm x 132mm',1.5,true,false,1,3,'branding' from products p where p.supplier_sku='LL0275' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Box - 50 x 50mm',0.25,true,false,1,4,'branding' from products p where p.supplier_sku='LL0275' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Charger - 7mm x 260mm',0.8,true,false,1,5,'branding' from products p where p.supplier_sku='LL0275' and p.supplier ilike 'logoline%';

-- LL0276 Crystal Wireless Charger
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0276' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Charger - 60 x 20mm, Digital Sleeve - 312 x 112',0.5,true,false,1,1,'branding' from products p where p.supplier_sku='LL0276' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Charger - 60 x 20mm',0.7,true,false,1,2,'branding' from products p where p.supplier_sku='LL0276' and p.supplier ilike 'logoline%';

-- LL0277 Spartan 3-in-1 Wireless Charger
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0277' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','55mm Diameter',0.4,true,false,1,1,'branding' from products p where p.supplier_sku='LL0277' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','36mm Diameter',0.25,true,true,1,2,'branding' from products p where p.supplier_sku='LL0277' and p.supplier ilike 'logoline%';

-- LL0280 Spectre Eco Wireless Charger Hub
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0280' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Charger - 50 x 50mm',0.25,true,true,1,1,'branding' from products p where p.supplier_sku='LL0280' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Charger - 90 x 90mm, Digital Sleeve - Full coverage',0.7,true,false,1,2,'branding' from products p where p.supplier_sku='LL0280' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Box - 50 x 50mm',0.25,true,false,1,3,'branding' from products p where p.supplier_sku='LL0280' and p.supplier ilike 'logoline%';

-- LL0282 Solstice Eco Wireless Charger
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0282' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','50mmDia',0.25,true,true,1,1,'branding' from products p where p.supplier_sku='LL0282' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','80mmDia,  Box Sleeve - Full coverage',1.25,true,false,1,2,'branding' from products p where p.supplier_sku='LL0282' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Box - 50 x 50mm',0.25,true,false,1,3,'branding' from products p where p.supplier_sku='LL0282' and p.supplier ilike 'logoline%';

-- LL0283 Club 3 in 1 Charger
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0283' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Charger - 56mm Diameter',0.4,true,false,1,1,'branding' from products p where p.supplier_sku='LL0283' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Below the light indicator - 50 x 15mm',0.6,true,false,1,2,'branding' from products p where p.supplier_sku='LL0283' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Below the light indicator - 40 x 20mm',0.3,true,true,1,3,'branding' from products p where p.supplier_sku='LL0283' and p.supplier ilike 'logoline%';

-- LL0284 Whisper USB Hub
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0284' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','50 x 20mm',0.6,true,false,1,1,'branding' from products p where p.supplier_sku='LL0284' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','50 x 20mm',0.3,true,true,1,2,'branding' from products p where p.supplier_sku='LL0284' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','50 x 20mm',0.4,true,false,1,3,'branding' from products p where p.supplier_sku='LL0284' and p.supplier ilike 'logoline%';

-- LL03 Trio Highlighter
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL03' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Front/Back - 40mm Dia',0.2,true,true,1,1,'branding' from products p where p.supplier_sku='LL03' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front/Back - 60 x 51mm',0.4,true,false,1,2,'branding' from products p where p.supplier_sku='LL03' and p.supplier ilike 'logoline%';

-- LL0326 Supra 4 Colour Pen
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0326' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Barrel - 40 x 7mm',0.12,true,true,1,1,'branding' from products p where p.supplier_sku='LL0326' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen Sleeve - 55 x 20mm',0.12,true,true,1,2,'branding' from products p where p.supplier_sku='LL0326' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','40 x 7mm',0.25,true,false,1,3,'branding' from products p where p.supplier_sku='LL0326' and p.supplier ilike 'logoline%';

-- LL0329 Supra 4 Colour White Pen
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0329' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Barrel - 40 x 7mm',0.12,true,true,1,1,'branding' from products p where p.supplier_sku='LL0329' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen Sleeve - 55 x 20mm',0.12,true,true,1,2,'branding' from products p where p.supplier_sku='LL0329' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Barrel - 40 x 7mm',0.25,true,false,1,3,'branding' from products p where p.supplier_sku='LL0329' and p.supplier ilike 'logoline%';

-- LL0331 Mammoth Pen
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0331' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','60 x 10mm',0.25,true,false,1,1,'branding' from products p where p.supplier_sku='LL0331' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','45mm x 10mm',0.12,true,true,1,2,'branding' from products p where p.supplier_sku='LL0331' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','55 x 8mm',0.15,true,false,1,3,'branding' from products p where p.supplier_sku='LL0331' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','35 x 40mm',0.12,true,true,1,4,'branding' from products p where p.supplier_sku='LL0331' and p.supplier ilike 'logoline%';

-- LL0335 Bamboo Toothbrush
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0335' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','40 x 10mm',0.25,true,false,1,1,'branding' from products p where p.supplier_sku='LL0335' and p.supplier ilike 'logoline%';

-- LL0336 Refresh Travel Pack
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0336' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Pouch - 45 x 140mm',0.4,true,true,1,1,'branding' from products p where p.supplier_sku='LL0336' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Toothbrush - 40 x 10mm',0.25,true,false,1,2,'branding' from products p where p.supplier_sku='LL0336' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Pouch - 45 x 140mm',1.5,true,false,1,3,'branding' from products p where p.supplier_sku='LL0336' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Comb - 55 x 10mm',0.15,true,true,1,4,'branding' from products p where p.supplier_sku='LL0336' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Comb - 55 x 10mm',0.25,true,false,1,5,'branding' from products p where p.supplier_sku='LL0336' and p.supplier ilike 'logoline%';

-- LL0400 Sierra 350ml Double Wall Glass Cup
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0400' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Glass - 35mmDia, 22 x 40mm',0.4,true,true,1,1,'branding' from products p where p.supplier_sku='LL0400' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Imitation Etch Per Position','Glass - 35mmDia, 22 x 40mm',0.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL0400' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Bamboo Lid - 70mmDia',0.7,true,false,1,3,'branding' from products p where p.supplier_sku='LL0400' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Bamboo Lid - 70mmDia',0.7,true,false,1,4,'branding' from products p where p.supplier_sku='LL0400' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Colour Fusion Per Position','Glass - 40 x 20mm',0.75,true,false,1,5,'branding' from products p where p.supplier_sku='LL0400' and p.supplier ilike 'logoline%';

-- LL0402 Sierra 450ml Double Wall Glass Cup
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0402' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Glass - 35mmDia, 22 x 40mm',0.4,true,true,1,1,'branding' from products p where p.supplier_sku='LL0402' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Imitation Etch Per Position','Glass - 35mmDia, 22 x 40mm',0.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL0402' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Bamboo Lid - 70mmDia',0.7,true,false,1,3,'branding' from products p where p.supplier_sku='LL0402' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Bamboo Lid - 70mmDia',0.7,true,false,1,4,'branding' from products p where p.supplier_sku='LL0402' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Colour Fusion Per Position','Glass - 40 x 20mm',0.75,true,false,1,5,'branding' from products p where p.supplier_sku='LL0402' and p.supplier ilike 'logoline%';

-- LL0413 Vienna Eco Coffee Cup / Silicone Band
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0413' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Silicone Sleeve - 75 x 38mm',0.6,true,true,1,1,'branding' from products p where p.supplier_sku='LL0413' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Silicone Sleeve Wrap Print - 220 x 38mm',0.6,true,true,1,2,'branding' from products p where p.supplier_sku='LL0413' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sleeve - 398mm x 139mm',2.0,true,false,1,3,'branding' from products p where p.supplier_sku='LL0413' and p.supplier ilike 'logoline%';

-- LL0414 Vienna Eco Coffee Cup /  Cork Band
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0414' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Cork Band - 75 x 38mm',0.3,true,true,1,1,'branding' from products p where p.supplier_sku='LL0414' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Cork Band Wrap Print - 220 x 38mm',0.3,true,true,1,2,'branding' from products p where p.supplier_sku='LL0414' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sleeve - 398mm x 139mm',2.0,true,false,1,3,'branding' from products p where p.supplier_sku='LL0414' and p.supplier ilike 'logoline%';

-- LL0415 Vienna Coffee Cup / Cork Band
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0415' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Cork Band - 75 x 38mm',0.3,true,true,1,1,'branding' from products p where p.supplier_sku='LL0415' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Cork Band Wrap Print - 220 x 38mm',0.3,true,true,1,2,'branding' from products p where p.supplier_sku='LL0415' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sleeve - 398m x 139mm',2.0,true,false,1,3,'branding' from products p where p.supplier_sku='LL0415' and p.supplier ilike 'logoline%';

-- LL0418 Aroma Eco Cup / Comfort Lid
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0418' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Roll Print Per Position','220 x 55mm',0.5,true,false,1,1,'branding' from products p where p.supplier_sku='LL0418' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','32 x 100mm',1.8,true,false,1,2,'branding' from products p where p.supplier_sku='LL0418' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Rotary Digital Print Per Position','Full Wrap - 270.81 x 100mm',3.0,true,false,1,3,'branding' from products p where p.supplier_sku='LL0418' and p.supplier ilike 'logoline%';

-- LL0419 Aroma Eco Cup / Handle Lid
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0419' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Roll Print Per Position','220 x 55mm',0.5,true,false,1,1,'branding' from products p where p.supplier_sku='LL0419' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','32 x 100mm',1.8,true,false,1,2,'branding' from products p where p.supplier_sku='LL0419' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Rotary Digital Print Per Position','Full Wrap - 270.81 x 100mm',3.0,true,false,1,3,'branding' from products p where p.supplier_sku='LL0419' and p.supplier ilike 'logoline%';

-- LL0422 Aroma Coffee Cup / Comfort Lid
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0422' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Roll Print Per Position','220 x 55mm',0.5,true,false,1,1,'branding' from products p where p.supplier_sku='LL0422' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','32 x 100mm',1.8,true,false,1,2,'branding' from products p where p.supplier_sku='LL0422' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Rotary Digital Print Per Position','Full Wrap - 270.81 x 100mm',3.0,true,false,1,3,'branding' from products p where p.supplier_sku='LL0422' and p.supplier ilike 'logoline%';

-- LL0423 Aroma Coffee Cup / Handle Lid
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0423' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','32 x 100mm',1.8,true,false,1,1,'branding' from products p where p.supplier_sku='LL0423' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Roll Print Per Position','220 x 55mm',0.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL0423' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Rotary Digital Print Per Position','Full Wrap - 270.81 x 100mm',3.0,true,false,1,3,'branding' from products p where p.supplier_sku='LL0423' and p.supplier ilike 'logoline%';

-- LL0426 Aroma Eco Cup / Eco Comfort Lid
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0426' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Roll Print Per Position','220 x 55mm',0.5,true,false,1,1,'branding' from products p where p.supplier_sku='LL0426' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','32 x 100mm',1.8,true,false,1,2,'branding' from products p where p.supplier_sku='LL0426' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Rotary Digital Print Per Position','Full Wrap - 270.81 x 100mm',3.0,true,false,1,3,'branding' from products p where p.supplier_sku='LL0426' and p.supplier ilike 'logoline%';

-- LL0427 Vienna Coffee Cup / Silicone Lid
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0427' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Silicone Sleeve - 75 x 38mm',0.6,true,true,1,1,'branding' from products p where p.supplier_sku='LL0427' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Silicone Sleeve Wrap Print - 220 x 38mm',0.6,true,true,1,2,'branding' from products p where p.supplier_sku='LL0427' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sleeve - 398 x 139mm',2.0,true,false,1,3,'branding' from products p where p.supplier_sku='LL0427' and p.supplier ilike 'logoline%';

-- LL0432 Vienna Coffee Cup / Flip Lid
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0432' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Silicone sleeve - 75 x 38mm',0.6,true,true,1,1,'branding' from products p where p.supplier_sku='LL0432' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Silicone sleeve wrap print - 220 x 38mm',0.6,true,true,1,2,'branding' from products p where p.supplier_sku='LL0432' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sleeve - 398mm x 139mm',2.0,true,false,1,3,'branding' from products p where p.supplier_sku='LL0432' and p.supplier ilike 'logoline%';

-- LL0433 Vienna Coffee Cup with M&M's
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0433' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Front - 50 x 50mm, 55 x 30mm, 45mm Dia',0.19,true,false,1,1,'branding' from products p where p.supplier_sku='LL0433' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Silicone Sleeve - 75 x 38mm',0.6,true,true,1,2,'branding' from products p where p.supplier_sku='LL0433' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Silicone Sleeve Wrap Print - 220 x 38mm',0.6,true,true,1,3,'branding' from products p where p.supplier_sku='LL0433' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sleeve - 398 x 139mm',2.0,true,false,1,4,'branding' from products p where p.supplier_sku='LL0433' and p.supplier ilike 'logoline%';

-- LL0437 Vienna Coffee Cup / Snap Lid
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0437' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Silicone sleeve - 75 x 38mm',0.6,true,true,1,1,'branding' from products p where p.supplier_sku='LL0437' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Silicone sleeve wrap print - 220 x 38mm',0.6,true,true,1,2,'branding' from products p where p.supplier_sku='LL0437' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sleeve - 398mm x 139mm',2.0,true,false,1,3,'branding' from products p where p.supplier_sku='LL0437' and p.supplier ilike 'logoline%';

-- LL0440 Ninja Coffee Cup
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0440' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','32  x 90mm',1.0,true,false,1,1,'branding' from products p where p.supplier_sku='LL0440' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','200 x 120mm',0.5,true,true,1,2,'branding' from products p where p.supplier_sku='LL0440' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','30  x 150mm (LxH),  Sleeve - Full coverage',2.5,true,false,1,3,'branding' from products p where p.supplier_sku='LL0440' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Rotary Digital Print Per Position','Full Wrap - 216.77 x 140mm',3.0,true,false,1,4,'branding' from products p where p.supplier_sku='LL0440' and p.supplier ilike 'logoline%';

-- LL0441 Cascade Coffee Cup
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0441' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','30 x 40mm',1.0,true,false,1,1,'branding' from products p where p.supplier_sku='LL0441' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','40 x 40mm',0.5,true,true,1,2,'branding' from products p where p.supplier_sku='LL0441' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Box Sleeve - 388 x 129mm',2.0,true,false,1,3,'branding' from products p where p.supplier_sku='LL0441' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Rotary Digital Print Per Position','Full Wrap - 268.92 x 60mm',3.0,true,false,1,4,'branding' from products p where p.supplier_sku='LL0441' and p.supplier ilike 'logoline%';

-- LL0446 Flair Stainless Steel Coffee Cup
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0446' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','30  x 100mm',1.2,true,false,1,1,'branding' from products p where p.supplier_sku='LL0446' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','220 x 80mm',0.5,true,true,1,2,'branding' from products p where p.supplier_sku='LL0446' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Cup - 30  x 105mm',1.8,true,false,1,3,'branding' from products p where p.supplier_sku='LL0446' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Box Sleeve - 364 x 184mm',2.5,true,false,1,4,'branding' from products p where p.supplier_sku='LL0446' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Rotary Digital Print Per Position','Full Wrap - 245.04 x 105mm',3.0,true,false,1,5,'branding' from products p where p.supplier_sku='LL0446' and p.supplier ilike 'logoline%';

-- LL0448 Vienna Eco Coffee Cup / RPET Band
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0448' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Band - 55 x 38 mm',1.1,true,false,1,1,'branding' from products p where p.supplier_sku='LL0448' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sleeve - 398mm x 139mm',2.0,true,false,1,2,'branding' from products p where p.supplier_sku='LL0448' and p.supplier ilike 'logoline%';

-- LL0449 Vienna Coffee Cup / Flip Lid / RPET Band
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0449' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Band - 55 x 38mm',1.1,true,false,1,1,'branding' from products p where p.supplier_sku='LL0449' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sleeve - 398 x 139mm',1.1,true,false,1,2,'branding' from products p where p.supplier_sku='LL0449' and p.supplier ilike 'logoline%';

-- LL0450 Vienna Coffee Cup / Silicone Lid / RPET Band
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0450' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Band - 55 x 38mm',1.1,true,false,1,1,'branding' from products p where p.supplier_sku='LL0450' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sleeve - 398 x 139mm',2.0,true,false,1,2,'branding' from products p where p.supplier_sku='LL0450' and p.supplier ilike 'logoline%';

-- LL0451 Vienna Coffee Cup / Snap Lid / RPET Band
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0451' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Band - 55 x 38mm',1.1,true,false,1,1,'branding' from products p where p.supplier_sku='LL0451' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sleeve - 480 x 210mm',2.0,true,false,1,2,'branding' from products p where p.supplier_sku='LL0451' and p.supplier ilike 'logoline%';

-- LL0461 Vienna Coffee Cup / Snap Lid / Cork Band
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0461' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Cork Band - 50 x 38mm',0.3,true,true,1,1,'branding' from products p where p.supplier_sku='LL0461' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Cork Band Wrap Print - 220 x 38mm',0.3,true,true,1,2,'branding' from products p where p.supplier_sku='LL0461' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sleeve - 398m x 139mm',2.0,true,false,1,3,'branding' from products p where p.supplier_sku='LL0461' and p.supplier ilike 'logoline%';

-- LL0463 Vulcan Wheat Fibre Mug
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0463' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','30 x 45mm',1.8,true,false,1,1,'branding' from products p where p.supplier_sku='LL0463' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','45 x 45mm',0.4,true,true,1,2,'branding' from products p where p.supplier_sku='LL0463' and p.supplier ilike 'logoline%';

-- LL0466 Octave Pen
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0466' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Barrel - 50 x 6mm',0.12,true,true,1,1,'branding' from products p where p.supplier_sku='LL0466' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen Sleeve - 55 x 20mm',0.12,true,true,1,2,'branding' from products p where p.supplier_sku='LL0466' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Barrel - 50 x 6.5mm',0.25,true,false,1,3,'branding' from products p where p.supplier_sku='LL0466' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Roll Print Per Position','Barrel - 45 x 30mm',0.12,true,false,1,4,'branding' from products p where p.supplier_sku='LL0466' and p.supplier ilike 'logoline%';

-- LL0468 Gemini Pen
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0468' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Barrel - 40 x 8mm',0.12,true,true,1,1,'branding' from products p where p.supplier_sku='LL0468' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen Sleeve - 55 x 20mm',0.12,true,true,1,2,'branding' from products p where p.supplier_sku='LL0468' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Barrel - 40 x 8mm',0.25,true,false,1,3,'branding' from products p where p.supplier_sku='LL0468' and p.supplier ilike 'logoline%';

-- LL0469 Gemini Metallic Pen
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0469' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Barrel - 40 x 8mm',0.12,true,true,1,1,'branding' from products p where p.supplier_sku='LL0469' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen Sleeve - 55 x 20mm',0.12,true,true,1,2,'branding' from products p where p.supplier_sku='LL0469' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Barrel - 40 x 8mm',0.25,true,false,1,3,'branding' from products p where p.supplier_sku='LL0469' and p.supplier ilike 'logoline%';

-- LL0474 Javelin Pen
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0474' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','50 x 6mm',0.12,true,true,1,1,'branding' from products p where p.supplier_sku='LL0474' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','80 x 5.8mm',0.25,true,false,1,2,'branding' from products p where p.supplier_sku='LL0474' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Roll Print Per Position','40 x 28mm',0.12,true,false,1,3,'branding' from products p where p.supplier_sku='LL0474' and p.supplier ilike 'logoline%';

-- LL0512 Cardboard Pen Sleeve
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0512' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','55 x 20mm',0.12,true,true,1,1,'branding' from products p where p.supplier_sku='LL0512' and p.supplier ilike 'logoline%';

-- LL0596 Viper 5,000mAh Bamboo Power Bank
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0596' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Power Bank - 45 x 55mm',1.0,true,false,1,1,'branding' from products p where p.supplier_sku='LL0596' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Power Bank - 45 x 55mm',0.55,true,false,1,2,'branding' from products p where p.supplier_sku='LL0596' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sleeve - 275 x 120mm',0.55,true,false,1,3,'branding' from products p where p.supplier_sku='LL0596' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Power Bank - 45 x 55mm',0.25,true,true,1,4,'branding' from products p where p.supplier_sku='LL0596' and p.supplier ilike 'logoline%';

-- LL0599 Primo Power Bank
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0599' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','62 x 102mm (WxH) - Full Coverage',1.25,true,false,1,1,'branding' from products p where p.supplier_sku='LL0599' and p.supplier ilike 'logoline%';

-- LL062 Egg Shape Sugar Free Breath Mints
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL062' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Front - 32mm Diameter',0.16,true,false,1,1,'branding' from products p where p.supplier_sku='LL062' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Front - 39 x 29mm',0.16,true,false,1,2,'branding' from products p where p.supplier_sku='LL062' and p.supplier ilike 'logoline%';

-- LL0726 Element Stationery Set
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0726' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','140 x 33mm',0.25,true,true,1,1,'branding' from products p where p.supplier_sku='LL0726' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','140 x 33mm',0.6,true,false,1,2,'branding' from products p where p.supplier_sku='LL0726' and p.supplier ilike 'logoline%';

-- LL0728 Script Stationery Set
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0728' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Wrap Label - 99.1 x 93.1mm',0.3,true,false,1,1,'branding' from products p where p.supplier_sku='LL0728' and p.supplier ilike 'logoline%';

-- LL073 Click It Mint Tins
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL073' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Lid - 40mm Diameter',0.25,true,true,1,1,'branding' from products p where p.supplier_sku='LL073' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Lid - 45mm Diameter',0.17,true,false,1,2,'branding' from products p where p.supplier_sku='LL073' and p.supplier ilike 'logoline%';

-- LL077 Rectangular Sugar Free Breath Mints
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL077' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Front - 70 x 40mm',0.16,true,false,1,1,'branding' from products p where p.supplier_sku='LL077' and p.supplier ilike 'logoline%';

-- LL0850 Magnum Ceramic Mug / Cork Base
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0850' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','45 x 45mm',0.4,true,true,1,1,'branding' from products p where p.supplier_sku='LL0850' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sleeve - 457 x 120',2.0,true,false,1,2,'branding' from products p where p.supplier_sku='LL0850' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Colour Fusion Per Position','50 x 50mm',0.75,true,false,1,3,'branding' from products p where p.supplier_sku='LL0850' and p.supplier ilike 'logoline%';

-- LL0853 Manta Vacuum Cup
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0853' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Top - 35mm x 30mm, Sleeve - 360 x 200',1.8,true,false,1,1,'branding' from products p where p.supplier_sku='LL0853' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Top - 35 x 30mm',1.0,true,false,1,2,'branding' from products p where p.supplier_sku='LL0853' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Lower - 32 x 80mm',1.0,true,false,1,3,'branding' from products p where p.supplier_sku='LL0853' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Top - 45 x 25mm',0.4,true,true,1,4,'branding' from products p where p.supplier_sku='LL0853' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Lower - 30 x 60mm',0.4,true,true,1,5,'branding' from products p where p.supplier_sku='LL0853' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Rotary Digital Print Per Position','Band Wrap Top - 251.33 x 45mm',3.0,true,false,1,6,'branding' from products p where p.supplier_sku='LL0853' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Rotary Digital Print Per Position','Full Wrap - 251.3mm x 164mm',3.0,true,false,1,7,'branding' from products p where p.supplier_sku='LL0853' and p.supplier ilike 'logoline%';

-- LL0863 Milano Vacuum Cup
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0863' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Box Sleeve - 420 x 160mm',2.0,true,false,1,1,'branding' from products p where p.supplier_sku='LL0863' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','30 x 80mm',0.6,true,false,1,2,'branding' from products p where p.supplier_sku='LL0863' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','200 x 55mm',0.5,true,true,1,3,'branding' from products p where p.supplier_sku='LL0863' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Rotary Digital Print Per Position','Full Wrap - 267.04 x 90mm',3.0,true,false,1,4,'branding' from products p where p.supplier_sku='LL0863' and p.supplier ilike 'logoline%';

-- LL0877 Aztec Coffee Cup
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0877' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Top - 40 x 25mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL0877' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Top - 35 x 28mm',1.0,true,false,1,2,'branding' from products p where p.supplier_sku='LL0877' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Top - 35 x 28mm, Sleeve - 373 x 140',1.5,true,false,1,3,'branding' from products p where p.supplier_sku='LL0877' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Rotary Digital Print Per Position','Band Wrap Top - 260.75 x 35mm',3.0,true,false,1,4,'branding' from products p where p.supplier_sku='LL0877' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Rotary Digital Print Per Position','Full Wrap - 260.75 x 80mm',3.0,true,false,1,5,'branding' from products p where p.supplier_sku='LL0877' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Colour Fusion Per Position','Top - 35mm x 30mm',0.75,true,false,1,6,'branding' from products p where p.supplier_sku='LL0877' and p.supplier ilike 'logoline%';

-- LL0941 Andean Notebook
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0941' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','100 x 178mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL0941' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','71mm Diameter',0.3,true,false,1,2,'branding' from products p where p.supplier_sku='LL0941' and p.supplier ilike 'logoline%';

-- LL0946 Trek Notebook
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0946' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Notebook - 60mm Dia, 50 x 50mm',0.19,true,false,1,1,'branding' from products p where p.supplier_sku='LL0946' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Front of Notebook - 60 x 60mm',0.25,true,true,1,2,'branding' from products p where p.supplier_sku='LL0946' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Back of Notebook - 60 x 100mm',0.25,true,true,1,3,'branding' from products p where p.supplier_sku='LL0946' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen Barrel - 50 x 6mm',0.18,true,true,1,4,'branding' from products p where p.supplier_sku='LL0946' and p.supplier ilike 'logoline%';

-- LL0951 Savannah Notebook / Matador Pen
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0951' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Front of Notebook - 80 x 110mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL0951' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Back of Notebook - 60 x 100mm',0.5,true,true,1,2,'branding' from products p where p.supplier_sku='LL0951' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Pen - 35 x 25mm',0.12,true,true,1,3,'branding' from products p where p.supplier_sku='LL0951' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Front of Notebook - 45mm Dia',0.19,true,false,1,4,'branding' from products p where p.supplier_sku='LL0951' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Inside Front Cover - 65 x 95mm',0.65,true,false,1,5,'branding' from products p where p.supplier_sku='LL0951' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front of Notebook - 70 x 80mm',0.8,true,false,1,6,'branding' from products p where p.supplier_sku='LL0951' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Back of Notebook - 90 x 140mm',0.8,true,false,1,7,'branding' from products p where p.supplier_sku='LL0951' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Pen - 90 x 6mm',0.25,true,false,1,8,'branding' from products p where p.supplier_sku='LL0951' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen - 55 x 7mm',0.12,true,true,1,9,'branding' from products p where p.supplier_sku='LL0951' and p.supplier ilike 'logoline%';

-- LL0952 Savannah Notebook / Eco Matador Pen
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0952' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Front of Notebook - 80 x 110mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL0952' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Back of Notebook - 60 x 100mm',0.5,true,true,1,2,'branding' from products p where p.supplier_sku='LL0952' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Front of Notebook - 45mm Dia, 50 x 50mm',0.19,true,false,1,3,'branding' from products p where p.supplier_sku='LL0952' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Inside front Cover - 65 x 95mm',0.65,true,false,1,4,'branding' from products p where p.supplier_sku='LL0952' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front of Notebook - 70 x 80mm',0.8,true,false,1,5,'branding' from products p where p.supplier_sku='LL0952' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Back of Notebook - 90 x 140mm',0.8,true,false,1,6,'branding' from products p where p.supplier_sku='LL0952' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Pen - 90 x 6mm',0.25,true,false,1,7,'branding' from products p where p.supplier_sku='LL0952' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen - 55 x 7mm',0.12,true,true,1,8,'branding' from products p where p.supplier_sku='LL0952' and p.supplier ilike 'logoline%';

-- LL0953 Daily Note Planner
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0953' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Front - 100 x 150mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL0953' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Back - 60 x 100mm',0.5,true,true,1,2,'branding' from products p where p.supplier_sku='LL0953' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front - 100 x 150mm',1.5,true,false,1,3,'branding' from products p where p.supplier_sku='LL0953' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Back - 90 x 140mm',1.5,true,false,1,4,'branding' from products p where p.supplier_sku='LL0953' and p.supplier ilike 'logoline%';

-- LL0976 Taurus Coffee Cup
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0976' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Vertical - 30 x 100mm',1.2,true,false,1,1,'branding' from products p where p.supplier_sku='LL0976' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Box Sleeve - 388 x 170mm',2.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL0976' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Rotary Digital Print Per Position','276.46 x 102mm',3.0,true,false,1,3,'branding' from products p where p.supplier_sku='LL0976' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen 1 Colour Per Position','250 x 90mm',0.5,true,false,1,4,'branding' from products p where p.supplier_sku='LL0976' and p.supplier ilike 'logoline%';

-- LL0980 Cosy Stainless Steel Drink Cooler
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL0980' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','30 x 75mm',1.0,true,false,1,1,'branding' from products p where p.supplier_sku='LL0980' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','200 x 60mm',0.5,true,true,1,2,'branding' from products p where p.supplier_sku='LL0980' and p.supplier ilike 'logoline%';

-- LL10 Sharpened Timber Pencil
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL10' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Roll Print Per Position','Barrel Wrap - 110 x 20mm',0.12,true,false,1,1,'branding' from products p where p.supplier_sku='LL10' and p.supplier ilike 'logoline%';

-- LL1002 Water Saving Shower Timer
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL1002' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Top/Bottom - 20mm Dia',0.2,true,true,1,1,'branding' from products p where p.supplier_sku='LL1002' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Barrel - 8 x 38mm',0.2,true,true,1,2,'branding' from products p where p.supplier_sku='LL1002' and p.supplier ilike 'logoline%';

-- LL1007 Recycled Newspaper Pencil
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL1007' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Roll Print Per Position','Barrel Wrap - 110 x 20mm',0.12,true,false,1,1,'branding' from products p where p.supplier_sku='LL1007' and p.supplier ilike 'logoline%';

-- LL102 Condo Keytag
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL102' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Front/Back - 51 x 30mm',0.2,true,true,1,1,'branding' from products p where p.supplier_sku='LL102' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front/Back - 53 x 33mm',0.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL102' and p.supplier ilike 'logoline%';

-- LL1025 Heron Double Wall Coffee Cup
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL1025' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Cup - 30mm x 80mm',1.8,true,false,1,1,'branding' from products p where p.supplier_sku='LL1025' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sleeve - 394mm x 154mm',2.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL1025' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Cup - 180mm x 100mm',0.5,true,true,1,3,'branding' from products p where p.supplier_sku='LL1025' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Rotary Digital Print Per Position','Cup - 276.5mm x 95mm',3.0,true,false,1,4,'branding' from products p where p.supplier_sku='LL1025' and p.supplier ilike 'logoline%';

-- LL1026 Slipstream Double Wall Coffee Cup
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL1026' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','220mm x 70mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL1026' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','100mm x 30mm',0.8,true,false,1,2,'branding' from products p where p.supplier_sku='LL1026' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','100mm x 30mm',1.8,true,false,1,3,'branding' from products p where p.supplier_sku='LL1026' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Rotary Digital Print Per Position','Full Wrap - 216mm x 120mm',3.0,true,false,1,4,'branding' from products p where p.supplier_sku='LL1026' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Sleeve Per Position','300mm x 180mm',1.8,true,false,1,5,'branding' from products p where p.supplier_sku='LL1026' and p.supplier ilike 'logoline%';

-- LL1047 Spa Bamboo Hair Brush
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL1047' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','50 x 50mm,  50mmDia',0.25,true,true,1,1,'branding' from products p where p.supplier_sku='LL1047' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','50 x 50mm,  50mmDia',0.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL1047' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','50 x 50mm,  50mmDia',0.4,true,false,1,3,'branding' from products p where p.supplier_sku='LL1047' and p.supplier ilike 'logoline%';

-- LL1062 Line Four Wheatstraw Game
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL1062' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','130 x 35mm',0.4,true,true,1,1,'branding' from products p where p.supplier_sku='LL1062' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Box Sleeve - 337 x 184mm',2.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL1062' and p.supplier ilike 'logoline%';

-- LL11 Transparent 30cm Ruler
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL11' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front - 290 x 14mm',0.6,true,false,1,1,'branding' from products p where p.supplier_sku='LL11' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Front - 295 x 23mm',0.2,true,true,1,2,'branding' from products p where p.supplier_sku='LL11' and p.supplier ilike 'logoline%';

-- LL11009 Laser Torch
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL11009' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Torch Barrel - 20 x 14mm',0.25,true,true,1,1,'branding' from products p where p.supplier_sku='LL11009' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Box Lid - 60 x 60mm',0.8,true,true,1,2,'branding' from products p where p.supplier_sku='LL11009' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Torch Barrel - 20 x 14mm',0.4,true,false,1,3,'branding' from products p where p.supplier_sku='LL11009' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Torch Barrel - 20 x 14mm',0.4,true,false,1,4,'branding' from products p where p.supplier_sku='LL11009' and p.supplier ilike 'logoline%';

-- LL112 Brain Stress Reliever
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL112' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Top - 30mm Diameter',0.3,true,true,1,1,'branding' from products p where p.supplier_sku='LL112' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Side/s - 30 x 20mm',0.3,true,true,1,2,'branding' from products p where p.supplier_sku='LL112' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','30mm Diameter',0.5,true,false,1,3,'branding' from products p where p.supplier_sku='LL112' and p.supplier ilike 'logoline%';

-- LL12 30cm Ruler
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL12' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Front - 295 x 23mm',0.2,true,true,1,1,'branding' from products p where p.supplier_sku='LL12' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front - 290 x 14mm',0.6,true,false,1,2,'branding' from products p where p.supplier_sku='LL12' and p.supplier ilike 'logoline%';

-- LL1219 Drone Wax Highlighters
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL1219' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','60 x 30mm',0.25,true,true,1,1,'branding' from products p where p.supplier_sku='LL1219' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','70 x 40mm',0.2,true,false,1,2,'branding' from products p where p.supplier_sku='LL1219' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Case - 60 x 30mm',0.5,true,false,1,3,'branding' from products p where p.supplier_sku='LL1219' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Highlighters - 20 x 10mm',0.5,true,false,1,4,'branding' from products p where p.supplier_sku='LL1219' and p.supplier ilike 'logoline%';

-- LL1295 Doodle 12 Pencils in Tin
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL1295' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','50 x 50mm,  71mmDia',0.3,true,false,1,1,'branding' from products p where p.supplier_sku='LL1295' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','50 x 50mm',0.35,true,true,1,2,'branding' from products p where p.supplier_sku='LL1295' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','70 x 70mm',0.7,true,false,1,3,'branding' from products p where p.supplier_sku='LL1295' and p.supplier ilike 'logoline%';

-- LL13 Recycled Plastic Ruler 30cm
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL13' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','300 x 20mm (Excluding Calibrations)',0.2,true,true,1,1,'branding' from products p where p.supplier_sku='LL13' and p.supplier ilike 'logoline%';

-- LL134 Happy Klapper
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL134' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Front/Back - 30mm Diameter',0.25,true,true,1,1,'branding' from products p where p.supplier_sku='LL134' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Front/Back - 32mm Diameter',0.16,true,false,1,2,'branding' from products p where p.supplier_sku='LL134' and p.supplier ilike 'logoline%';

-- LL1385 Hike Bottle
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL1385' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Roll Print Per Position','200 x 150mm',0.5,true,false,1,1,'branding' from products p where p.supplier_sku='LL1385' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','32 x 90mm',1.0,true,false,1,2,'branding' from products p where p.supplier_sku='LL1385' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','30 x 150mm (LxH),  Sleeve - 320.6 x 289',2.5,true,false,1,3,'branding' from products p where p.supplier_sku='LL1385' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Rotary Digital Print Per Position','Full Wrap - 227.77 x 150mm',3.0,true,false,1,4,'branding' from products p where p.supplier_sku='LL1385' and p.supplier ilike 'logoline%';

-- LL1390 Tahiti Bottle
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL1390' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Roll Print Per Position','190 x 65mm',0.5,true,false,1,1,'branding' from products p where p.supplier_sku='LL1390' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Box Sleeve - 355 x 240mm',2.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL1390' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Rotary Digital Print Per Position','Full Wrap - 232.50 x 75mm',3.0,true,false,1,3,'branding' from products p where p.supplier_sku='LL1390' and p.supplier ilike 'logoline%';

-- LL1394 Capri Glass Bottle
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL1394' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Bottle - 190 x 120mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL1394' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Lid - 35mm Dia',0.4,true,false,1,2,'branding' from products p where p.supplier_sku='LL1394' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Imitation Etch Per Position','Bottle - 190 x 120mm',0.5,true,false,1,3,'branding' from products p where p.supplier_sku='LL1394' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Bottle - 34 x 140mm, Box Sleeve - Full coverage',1.8,true,false,1,4,'branding' from products p where p.supplier_sku='LL1394' and p.supplier ilike 'logoline%';

-- LL1397 Capri Glass Bottle / Silicone Sleeve
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL1397' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Bottle - 190 x 120mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL1397' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Lid - 35mm Dia',0.4,true,false,1,2,'branding' from products p where p.supplier_sku='LL1397' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Imitation Etch Per Position','Bottle - 190 x 120mm',0.5,true,false,1,3,'branding' from products p where p.supplier_sku='LL1397' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Sleeve Per Position','Box Sleeve - 322 x 251',2.5,true,false,1,4,'branding' from products p where p.supplier_sku='LL1397' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Bottle - 34 x 140mm',1.8,true,false,1,5,'branding' from products p where p.supplier_sku='LL1397' and p.supplier ilike 'logoline%';

-- LL1398 Capri Glass Bottle / Neoprene Sleeve
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL1398' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Bottle - 70 x 100mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL1398' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Lid - 35mm Dia',0.4,true,false,1,2,'branding' from products p where p.supplier_sku='LL1398' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Neoprene Sleeve - 80 x 80mm',1.5,true,false,1,3,'branding' from products p where p.supplier_sku='LL1398' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Box Sleeve - 322 x 251',2.5,true,false,1,4,'branding' from products p where p.supplier_sku='LL1398' and p.supplier ilike 'logoline%';

-- LL14 15cm Ruler
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL14' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Front - 145 x 13mm',0.15,true,true,1,1,'branding' from products p where p.supplier_sku='LL14' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front - 145 x 13mm',0.4,true,false,1,2,'branding' from products p where p.supplier_sku='LL14' and p.supplier ilike 'logoline%';

-- LL1402 Contractor Tape Measure
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL1402' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Front - 40 x 40mm',0.2,true,true,1,1,'branding' from products p where p.supplier_sku='LL1402' and p.supplier ilike 'logoline%';

-- LL1408 Exocet 5m Retracting Tape Measure
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL1408' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Tape Measure - 30 x 30mm, Digital Sleeve - 262 x 83',0.35,true,false,1,1,'branding' from products p where p.supplier_sku='LL1408' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','30 x 30mm',0.3,true,true,1,2,'branding' from products p where p.supplier_sku='LL1408' and p.supplier ilike 'logoline%';

-- LL1461 Vespa Pen
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL1461' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen - 50 x 7mm',0.12,true,true,1,1,'branding' from products p where p.supplier_sku='LL1461' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen Sleeve - 55 x 20mm',0.12,true,true,1,2,'branding' from products p where p.supplier_sku='LL1461' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','50 x 6mm',0.25,true,false,1,3,'branding' from products p where p.supplier_sku='LL1461' and p.supplier ilike 'logoline%';

-- LL1472 Stingray Pen
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL1472' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','50 x 7mm',0.12,true,true,1,1,'branding' from products p where p.supplier_sku='LL1472' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','50 x 7mm',0.25,true,false,1,2,'branding' from products p where p.supplier_sku='LL1472' and p.supplier ilike 'logoline%';

-- LL15 30cm Wheatstraw Ruler
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL15' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Front - 295 x 23mm',0.2,true,true,1,1,'branding' from products p where p.supplier_sku='LL15' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front - 290 x 14mm',0.6,true,false,1,2,'branding' from products p where p.supplier_sku='LL15' and p.supplier ilike 'logoline%';

-- LL1634 Compact Pop Up Brush / Mirror Set
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL1634' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Front - 35mm Diameter',0.25,true,true,1,1,'branding' from products p where p.supplier_sku='LL1634' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Direct Per Position','Front - 25mm Diameter',0.55,true,false,1,2,'branding' from products p where p.supplier_sku='LL1634' and p.supplier ilike 'logoline%';

-- LL1637 LED Compact Mirror
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL1637' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','45 x 60mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL1637' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Box Sleeve - 221 x 88mm',1.25,true,false,1,2,'branding' from products p where p.supplier_sku='LL1637' and p.supplier ilike 'logoline%';

-- LL1638 Finesse Compact Mirror
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL1638' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front/Back - 65mm Diameter',0.5,true,false,1,1,'branding' from products p where p.supplier_sku='LL1638' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Front/Back - 45mm Diameter',0.25,true,true,1,2,'branding' from products p where p.supplier_sku='LL1638' and p.supplier ilike 'logoline%';

-- LL1724 Medical Mop Top Pen / Stylus
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL1724' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Barrel Front - 35mm x 7mm',0.12,true,true,1,1,'branding' from products p where p.supplier_sku='LL1724' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Barrel Back - 50mm x 7mm',0.12,true,true,1,2,'branding' from products p where p.supplier_sku='LL1724' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen Sleeve - 55 x 20mm',0.12,true,true,1,3,'branding' from products p where p.supplier_sku='LL1724' and p.supplier ilike 'logoline%';

-- LL1799 Hurricane Poncho
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL1799' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Polybag - 138mm x 50mm',0.32,false,false,1,1,'addon' from products p where p.supplier_sku='LL1799' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Polybag - 90mm Dia',0.32,false,false,1,2,'addon' from products p where p.supplier_sku='LL1799' and p.supplier ilike 'logoline%';

-- LL1822 Sizzle Foam Visor
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL1822' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Brim - 130 x 50mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL1822' and p.supplier ilike 'logoline%';

-- LL19 Recycled Eco 30cm Ruler
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL19' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','315 x 41mm',0.7,true,false,1,1,'branding' from products p where p.supplier_sku='LL19' and p.supplier ilike 'logoline%';

-- LL1904 Tourer Pencil Set
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL1904' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Front - 35 x 35mm',0.2,true,true,1,1,'branding' from products p where p.supplier_sku='LL1904' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Front - 41 x 41mm',0.17,true,false,1,2,'branding' from products p where p.supplier_sku='LL1904' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front - 35 x 35mm',0.4,true,false,1,3,'branding' from products p where p.supplier_sku='LL1904' and p.supplier ilike 'logoline%';

-- LL1907 Mighty Pencil Set
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL1907' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Front - 50 x 50mm',0.2,true,true,1,1,'branding' from products p where p.supplier_sku='LL1907' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Front - 65 x 95mm, 41 x 41mm',0.23,true,false,1,2,'branding' from products p where p.supplier_sku='LL1907' and p.supplier ilike 'logoline%';

-- LL1909 Panorama Coloured Pencil Set
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL1909' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Lid - 170 x 25mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL1909' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Lid - 170 x 25mm',0.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL1909' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Lid - 170 x 25mm',0.5,true,false,1,3,'branding' from products p where p.supplier_sku='LL1909' and p.supplier ilike 'logoline%';

-- LL1911 Mural Pencil / Crayon Set
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL1911' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','50 x 50mm',0.19,true,false,1,1,'branding' from products p where p.supplier_sku='LL1911' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','50 x 50mm',0.2,true,true,1,2,'branding' from products p where p.supplier_sku='LL1911' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','55 x 55mm',0.4,true,false,1,3,'branding' from products p where p.supplier_sku='LL1911' and p.supplier ilike 'logoline%';

-- LL1914 Pablo Pencil Set
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL1914' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Box - 45 x 20mm',0.2,true,true,1,1,'branding' from products p where p.supplier_sku='LL1914' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Lid - 25 x 20mm',0.2,true,true,1,2,'branding' from products p where p.supplier_sku='LL1914' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Box - 50 x 20mm',0.4,true,false,1,3,'branding' from products p where p.supplier_sku='LL1914' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Lid - 25 x 20mm',0.4,true,false,1,4,'branding' from products p where p.supplier_sku='LL1914' and p.supplier ilike 'logoline%';

-- LL1916 Aspen Plastic Pen
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL1916' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','50 x 7mm',0.12,true,true,1,1,'branding' from products p where p.supplier_sku='LL1916' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','50 x 6.5mm',0.25,true,false,1,2,'branding' from products p where p.supplier_sku='LL1916' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Roll Print Per Position','45 x 25mm',0.12,true,false,1,3,'branding' from products p where p.supplier_sku='LL1916' and p.supplier ilike 'logoline%';

-- LL192 Monet Pencil Set
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL192' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Base - 40 x 40mm',0.2,true,true,1,1,'branding' from products p where p.supplier_sku='LL192' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Lid - 40 x 20mm',0.2,true,true,1,2,'branding' from products p where p.supplier_sku='LL192' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Base - 41 x 41mm',0.17,true,false,1,3,'branding' from products p where p.supplier_sku='LL192' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Base - 40 x 40mm',0.4,true,false,1,4,'branding' from products p where p.supplier_sku='LL192' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Lid - 40 x 20mm',0.4,true,false,1,5,'branding' from products p where p.supplier_sku='LL192' and p.supplier ilike 'logoline%';

-- LL193 Rembrandt Pencils in Tube
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL193' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Base - 45mm Diameter',0.17,true,false,1,1,'branding' from products p where p.supplier_sku='LL193' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Wrap Label Per Position','Base - 110 x 55mm',0.17,true,false,1,2,'branding' from products p where p.supplier_sku='LL193' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Base - 25 x 40mm',0.2,true,true,1,3,'branding' from products p where p.supplier_sku='LL193' and p.supplier ilike 'logoline%';

-- LL1950 Colouroo Long Pencils in Tube
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL1950' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Label Per Position','45mm Diameter,  30 x 55mm or 50 x 50mm',0.17,true,false,1,1,'branding' from products p where p.supplier_sku='LL1950' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','25 x 50mm',0.35,true,true,1,2,'branding' from products p where p.supplier_sku='LL1950' and p.supplier ilike 'logoline%';

-- LL196 Dali Crayon Set
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL196' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Front - 50 x 50mm',0.19,true,false,1,1,'branding' from products p where p.supplier_sku='LL196' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front - 50 x 50mm',0.7,true,false,1,2,'branding' from products p where p.supplier_sku='LL196' and p.supplier ilike 'logoline%';

-- LL198 Louvre Crayons in PVC Zipper Pouch
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL198' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Front/Back - 45mm Diameter',0.17,true,false,1,1,'branding' from products p where p.supplier_sku='LL198' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Front/Back - 55 x 55mm',0.3,true,true,1,2,'branding' from products p where p.supplier_sku='LL198' and p.supplier ilike 'logoline%';

-- LL200 Matador Cardboard Pen
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL200' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Barrel - 55 x 7mm',0.12,true,true,1,1,'branding' from products p where p.supplier_sku='LL200' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen Sleeve - 55 x 20mm',0.12,true,true,1,2,'branding' from products p where p.supplier_sku='LL200' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Barrel - 90 x 6mm',0.25,true,false,1,3,'branding' from products p where p.supplier_sku='LL200' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Roll Print Per Position','Barrel - 35 x 25mm',0.12,true,false,1,4,'branding' from products p where p.supplier_sku='LL200' and p.supplier ilike 'logoline%';

-- LL2006 New Vogue Nail File
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL2006' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Back - 80 x 13mm',0.15,true,true,1,1,'branding' from products p where p.supplier_sku='LL2006' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Back - 160 x 20mm, Artwork needs to be supplied with a 3mm bleed.',0.4,true,false,1,2,'branding' from products p where p.supplier_sku='LL2006' and p.supplier ilike 'logoline%';

-- LL2014 Evergreen Straw Set
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL2014' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','20 x 50mm',0.2,true,true,1,1,'branding' from products p where p.supplier_sku='LL2014' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Wrap Label - 90  x 150mm',0.3,true,false,1,2,'branding' from products p where p.supplier_sku='LL2014' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Top of Straw/s - 3 x 35mm',0.1,true,false,1,3,'branding' from products p where p.supplier_sku='LL2014' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Bottom of Straw/s - 3 x 50mm',0.1,true,false,1,4,'branding' from products p where p.supplier_sku='LL2014' and p.supplier ilike 'logoline%';

-- LL2015 Lip Balm Stick
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL2015' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','42 x 8mm',0.2,true,false,1,1,'branding' from products p where p.supplier_sku='LL2015' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','63.5 x 38.1mm',0.2,true,false,1,2,'branding' from products p where p.supplier_sku='LL2015' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Roll Print Per Position','38 x 54mm',0.2,true,false,1,3,'branding' from products p where p.supplier_sku='LL2015' and p.supplier ilike 'logoline%';

-- LL2017 Cube Lip Balm
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL2017' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','20 x 20mm',0.15,true,true,1,1,'branding' from products p where p.supplier_sku='LL2017' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','20 x 20mm',0.2,true,false,1,2,'branding' from products p where p.supplier_sku='LL2017' and p.supplier ilike 'logoline%';

-- LL2018 Ritz Cube Lip Balm
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL2018' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','20 x 20mm',0.15,true,true,1,1,'branding' from products p where p.supplier_sku='LL2018' and p.supplier ilike 'logoline%';

-- LL202 Matador Eco Pen
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL202' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Barrel - 55 x 7mm',0.12,true,true,1,1,'branding' from products p where p.supplier_sku='LL202' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen Sleeve - 55 x 20mm',0.12,true,true,1,2,'branding' from products p where p.supplier_sku='LL202' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Barrel - 90 x 6mm',0.25,true,false,1,3,'branding' from products p where p.supplier_sku='LL202' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Roll Print Per Position','Barrel - 35 x 25mm',0.12,true,false,1,4,'branding' from products p where p.supplier_sku='LL202' and p.supplier ilike 'logoline%';

-- LL2021 Bamboo Pen
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL2021' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Barrel - 45 x 8mm',0.12,true,true,1,1,'branding' from products p where p.supplier_sku='LL2021' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen Sleeve - 55 x 20mm',0.12,true,true,1,2,'branding' from products p where p.supplier_sku='LL2021' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Barrel - 45 x 10mm',0.2,true,false,1,3,'branding' from products p where p.supplier_sku='LL2021' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Barrel - 45 x 10mm',0.25,true,false,1,4,'branding' from products p where p.supplier_sku='LL2021' and p.supplier ilike 'logoline%';

-- LL2033 Aspen Bamboo Pen
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL2033' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen - 60 x 7mm',0.12,true,true,1,1,'branding' from products p where p.supplier_sku='LL2033' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen Sleeve - 55 x 20mm',0.18,true,true,1,2,'branding' from products p where p.supplier_sku='LL2033' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','70 x 6.5mm',0.25,true,false,1,3,'branding' from products p where p.supplier_sku='LL2033' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','60 x 6.5mm',0.2,true,false,1,4,'branding' from products p where p.supplier_sku='LL2033' and p.supplier ilike 'logoline%';

-- LL2035 Aspen Bamboo Pen / Stylus
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL2035' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen - 60 x 7mm',0.12,true,true,1,1,'branding' from products p where p.supplier_sku='LL2035' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen Sleeve - 55 x 20mm',0.15,true,true,1,2,'branding' from products p where p.supplier_sku='LL2035' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','70 x 6.5mm',0.25,true,false,1,3,'branding' from products p where p.supplier_sku='LL2035' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','70 x 6.5mm',0.2,true,false,1,4,'branding' from products p where p.supplier_sku='LL2035' and p.supplier ilike 'logoline%';

-- LL2037 Hornet Bamboo Pen
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL2037' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen - 50 x 7mm',0.12,true,true,1,1,'branding' from products p where p.supplier_sku='LL2037' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen Sleeve - 55 x 20mm',0.12,true,true,1,2,'branding' from products p where p.supplier_sku='LL2037' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','50 x 6.5mm',0.2,true,false,1,3,'branding' from products p where p.supplier_sku='LL2037' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','50 x 6.5mm',0.25,true,false,1,4,'branding' from products p where p.supplier_sku='LL2037' and p.supplier ilike 'logoline%';

-- LL2039 Aspen Paper Pen
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL2039' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen - 60 x 7mm',0.12,true,true,1,1,'branding' from products p where p.supplier_sku='LL2039' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen Sleeve - 55 x 20mm',0.12,true,true,1,2,'branding' from products p where p.supplier_sku='LL2039' and p.supplier ilike 'logoline%';

-- LL2044 Raptor RPET Pen
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL2044' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Barrel - 45 x 7mm',0.12,true,true,1,1,'branding' from products p where p.supplier_sku='LL2044' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen Sleeve - 55 x 20mm',0.12,true,true,1,2,'branding' from products p where p.supplier_sku='LL2044' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Barrel - 45 x 6.5mm',0.25,true,false,1,3,'branding' from products p where p.supplier_sku='LL2044' and p.supplier ilike 'logoline%';

-- LL208 Casino Tri Highlighter
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL208' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Front/Back - 40mm Dia',0.2,true,true,1,1,'branding' from products p where p.supplier_sku='LL208' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front/Back - 40mm Dia',0.6,true,false,1,2,'branding' from products p where p.supplier_sku='LL208' and p.supplier ilike 'logoline%';

-- LL209 Matador Cork Pen
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL209' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Barrel - 60 x 7mm',0.12,true,true,1,1,'branding' from products p where p.supplier_sku='LL209' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen Sleeve - 55 x 20mm',0.12,true,true,1,2,'branding' from products p where p.supplier_sku='LL209' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','90 x 6mm',0.25,true,false,1,3,'branding' from products p where p.supplier_sku='LL209' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Roll Print Per Position','50 x 25mm',0.12,true,false,1,4,'branding' from products p where p.supplier_sku='LL209' and p.supplier ilike 'logoline%';

-- LL210 Daisy Highlighter
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL210' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Front - 50mm Diameter',0.25,true,true,1,1,'branding' from products p where p.supplier_sku='LL210' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Back - 50mm x 38mm',0.25,true,true,1,2,'branding' from products p where p.supplier_sku='LL210' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front - 53mm Diameter',0.3,true,false,1,3,'branding' from products p where p.supplier_sku='LL210' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Back - 53mm x 40mm',0.3,true,false,1,4,'branding' from products p where p.supplier_sku='LL210' and p.supplier ilike 'logoline%';

-- LL2111 Austin Pen / Stylus
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL2111' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen - 50 x 7mm',0.12,true,true,1,1,'branding' from products p where p.supplier_sku='LL2111' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen Sleeve - 55 x 20mm',0.12,true,true,1,2,'branding' from products p where p.supplier_sku='LL2111' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','50 x 6mm',0.25,true,false,1,3,'branding' from products p where p.supplier_sku='LL2111' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','50 x 6mm',0.5,true,false,1,4,'branding' from products p where p.supplier_sku='LL2111' and p.supplier ilike 'logoline%';

-- LL2113 Aspen Aluminium Pen
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL2113' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen - 50 x 7mm',0.12,true,true,1,1,'branding' from products p where p.supplier_sku='LL2113' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen Sleeve - 55 x 20mm',0.15,true,true,1,2,'branding' from products p where p.supplier_sku='LL2113' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','50 x 6.5mm',0.25,true,false,1,3,'branding' from products p where p.supplier_sku='LL2113' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','50 x 6mm',0.5,true,false,1,4,'branding' from products p where p.supplier_sku='LL2113' and p.supplier ilike 'logoline%';

-- LL2115 Octave Gel Ink Pen
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL2115' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Barrel - 50 x 6mm',0.12,true,true,1,1,'branding' from products p where p.supplier_sku='LL2115' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen Sleeve - 55 x 20mm',0.12,true,true,1,2,'branding' from products p where p.supplier_sku='LL2115' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Barrel - 50 x 6.5mm',0.25,true,false,1,3,'branding' from products p where p.supplier_sku='LL2115' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Roll Print Per Position','Barrel - 45 x 30mm',0.12,true,false,1,4,'branding' from products p where p.supplier_sku='LL2115' and p.supplier ilike 'logoline%';

-- LL2131 Matador Bamboo Pen
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL2131' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Barrel - 55 x 7mm',0.12,true,true,1,1,'branding' from products p where p.supplier_sku='LL2131' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen Sleeve - 55 x 20mm',0.12,true,true,1,2,'branding' from products p where p.supplier_sku='LL2131' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Barrel - 90 x 6.5mm',0.25,true,false,1,3,'branding' from products p where p.supplier_sku='LL2131' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Barrel - 60 x 6mm',0.2,true,false,1,4,'branding' from products p where p.supplier_sku='LL2131' and p.supplier ilike 'logoline%';

-- LL2134 Yale Stationery Set
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL2134' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Cello Bag - 45mm Dia, 70 x 40mm, 50 x 50mm',0.22,true,false,1,1,'branding' from products p where p.supplier_sku='LL2134' and p.supplier ilike 'logoline%';

-- LL21341 Stanford Stationery Set
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL21341' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Pencil Case - 180 x 60mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL21341' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Pencil Case - 71mm Diameter',0.32,true,false,1,2,'branding' from products p where p.supplier_sku='LL21341' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Pencil Case - 138 x 50mm',0.32,true,false,1,3,'branding' from products p where p.supplier_sku='LL21341' and p.supplier ilike 'logoline%';

-- LL2230 Elite Gift Set with Hip Flask
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL2230' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Gift Box - 276.6 x 368mm',1.0,true,false,1,1,'branding' from products p where p.supplier_sku='LL2230' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Gift Box Insert - 160.1 x 168mm',1.0,true,false,1,2,'branding' from products p where p.supplier_sku='LL2230' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Hip Flask - 70 x 80mm',1.5,true,false,1,3,'branding' from products p where p.supplier_sku='LL2230' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Hip Flask - 50 x 50mm',0.5,true,true,1,4,'branding' from products p where p.supplier_sku='LL2230' and p.supplier ilike 'logoline%';

-- LL2295 Surf Stubby Cooler
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL2295' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','70 x 70mm',0.25,true,true,1,1,'branding' from products p where p.supplier_sku='LL2295' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','50 x 50mm',1.0,true,false,1,2,'branding' from products p where p.supplier_sku='LL2295' and p.supplier ilike 'logoline%';

-- LL2299 Cooler Brick
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL2299' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','70 x 60mm',0.3,true,true,1,1,'branding' from products p where p.supplier_sku='LL2299' and p.supplier ilike 'logoline%';

-- LL2315 Sumo Cooler Lunch Bag
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL2315' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Bag - 110 x 100mm',0.4,true,true,1,1,'branding' from products p where p.supplier_sku='LL2315' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','110 x 100mm',1.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL2315' and p.supplier ilike 'logoline%';

-- LL2320 Alpine Cooler Bag
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL2320' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Front - 130 x 70mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL2320' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Lid - 130 x 80mm',0.5,true,true,1,2,'branding' from products p where p.supplier_sku='LL2320' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Front - 100 x 70mm',1.5,true,false,1,3,'branding' from products p where p.supplier_sku='LL2320' and p.supplier ilike 'logoline%';

-- LL2328 Bamboo 30cm Ruler
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL2328' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','250 x 13mm',0.15,true,true,1,1,'branding' from products p where p.supplier_sku='LL2328' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','250 x 13mm',0.6,true,false,1,2,'branding' from products p where p.supplier_sku='LL2328' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','90 x 13mm',0.3,true,false,1,3,'branding' from products p where p.supplier_sku='LL2328' and p.supplier ilike 'logoline%';

-- LL2330 Subzero Cooler Bag
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL2330' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Front - 130 x 80mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL2330' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Lid - 150 x 80mm',0.5,true,true,1,2,'branding' from products p where p.supplier_sku='LL2330' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Front - 130 x 140mm',2.1,true,false,1,3,'branding' from products p where p.supplier_sku='LL2330' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Lid - 160 x 90mm',2.1,true,false,1,4,'branding' from products p where p.supplier_sku='LL2330' and p.supplier ilike 'logoline%';

-- LL2333 Apex Cooler Bag
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL2333' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Front Pocket - 120 x 100mm',1.7,true,false,1,1,'branding' from products p where p.supplier_sku='LL2333' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Front Pocket - 150 x 100mm',0.5,true,true,1,2,'branding' from products p where p.supplier_sku='LL2333' and p.supplier ilike 'logoline%';

-- LL2347 Stainless Steel Hip Flask
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL2347' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','70 x 80mm',1.5,true,false,1,1,'branding' from products p where p.supplier_sku='LL2347' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','50 x 50mm',0.5,true,true,1,2,'branding' from products p where p.supplier_sku='LL2347' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sleeve - 259 x 116',1.5,true,false,1,3,'branding' from products p where p.supplier_sku='LL2347' and p.supplier ilike 'logoline%';

-- LL2361 Ariel Canvas Tote Bag
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL2361' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Bag - 290 x 200mm, Pouch - 100 x 50',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL2361' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Bag - 297 x 210mm',2.0,true,false,1,2,'branding' from products p where p.supplier_sku='LL2361' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Bag - 200 x 250mm',2.0,true,false,1,3,'branding' from products p where p.supplier_sku='LL2361' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Pouch - 120 x 50mm',1.5,true,false,1,4,'branding' from products p where p.supplier_sku='LL2361' and p.supplier ilike 'logoline%';

-- LL240 Priscilla / Patrick Pig Coin Bank
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL240' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Side/s - 48mm Diameter',0.25,true,true,1,1,'branding' from products p where p.supplier_sku='LL240' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Top (Behind Coin Slot) - 35mm Diameter',0.25,true,true,1,2,'branding' from products p where p.supplier_sku='LL240' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Side/s - 35mm Diameter',2.0,true,false,1,3,'branding' from products p where p.supplier_sku='LL240' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Top (Behind Coin Slot) - 35mm Diameter',2.0,true,false,1,4,'branding' from products p where p.supplier_sku='LL240' and p.supplier ilike 'logoline%';

-- LL2408 Micro Piglet Coin Bank
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL2408' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Top (Above Coin Slot) - 23mm Diameter',0.25,true,true,1,1,'branding' from products p where p.supplier_sku='LL2408' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Top (Above Coin Slot) - 28 x 12mm',0.25,true,true,1,2,'branding' from products p where p.supplier_sku='LL2408' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Side/s - 22mm Diameter',0.25,true,true,1,3,'branding' from products p where p.supplier_sku='LL2408' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Side/s - 33 x 15mm',0.25,true,true,1,4,'branding' from products p where p.supplier_sku='LL2408' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Side/s - 33 x 15mm or 22mm Diameter',0.3,true,false,1,5,'branding' from products p where p.supplier_sku='LL2408' and p.supplier ilike 'logoline%';

-- LL2655 Scribe Spiral Notebook with Pen
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL2655' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Front of Notebook - 65 x 125mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL2655' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Back of Notebook - 60 x 125mm',0.5,true,true,1,2,'branding' from products p where p.supplier_sku='LL2655' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen Barrel - 40 x 8mm',0.18,true,true,1,3,'branding' from products p where p.supplier_sku='LL2655' and p.supplier ilike 'logoline%';

-- LL2659 Nitro Keytag
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL2659' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Top - 42 x 9mm',0.15,true,true,1,1,'branding' from products p where p.supplier_sku='LL2659' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Top - 42 x 9mm',0.3,true,false,1,2,'branding' from products p where p.supplier_sku='LL2659' and p.supplier ilike 'logoline%';

-- LL2698 Crest Magnetic Clip
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL2698' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','50 x 25mm',0.3,true,true,1,1,'branding' from products p where p.supplier_sku='LL2698' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','55 x 35mm',0.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL2698' and p.supplier ilike 'logoline%';

-- LL2705 Odyssey Pocket Notebook with Pen
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL2705' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Front/Back Cover - 50 x 50mm',0.25,true,true,1,1,'branding' from products p where p.supplier_sku='LL2705' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front/Back Cover - 65 x 103mm',0.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL2705' and p.supplier ilike 'logoline%';

-- LL2709 Sparky Pocket Notebook
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL2709' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Front/Back - 70 x 80mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL2709' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front/Back - 60 x 60mm',1.0,true,false,1,2,'branding' from products p where p.supplier_sku='LL2709' and p.supplier ilike 'logoline%';

-- LL2759 Fling Thing
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL2759' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Flyer - 180mm Diameter',0.3,true,true,1,1,'branding' from products p where p.supplier_sku='LL2759' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Pouch - 50mm Diameter',0.5,true,true,1,2,'branding' from products p where p.supplier_sku='LL2759' and p.supplier ilike 'logoline%';

-- LL2779 Croc Magnetic Clip
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL2779' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','40 x 35mm',0.25,true,true,1,1,'branding' from products p where p.supplier_sku='LL2779' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','40 x 35mm',0.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL2779' and p.supplier ilike 'logoline%';

-- LL2809 Fjord Eco Ice Scraper
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL2809' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','50 x 40mm',0.25,true,true,1,1,'branding' from products p where p.supplier_sku='LL2809' and p.supplier ilike 'logoline%';

-- LL2885 Zippy Wooden Yo Yo
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL2885' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','35mmDia',0.2,true,true,1,1,'branding' from products p where p.supplier_sku='LL2885' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','35mmDia',0.4,true,false,1,2,'branding' from products p where p.supplier_sku='LL2885' and p.supplier ilike 'logoline%';

-- LL2912 Felt Tip Pens
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL2912' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','50 x 50mm',0.35,true,true,1,1,'branding' from products p where p.supplier_sku='LL2912' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','70 x 70mm',0.7,true,false,1,2,'branding' from products p where p.supplier_sku='LL2912' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','50 x 50mm or 71mm Diameter',0.3,true,false,1,3,'branding' from products p where p.supplier_sku='LL2912' and p.supplier ilike 'logoline%';

-- LL297 House Stress Reliever
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL297' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Front (Non Chimney Side) - 60 x 25mm',0.3,true,true,1,1,'branding' from products p where p.supplier_sku='LL297' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Back (Chimney Side) - 40 x 25mm',0.3,true,true,1,2,'branding' from products p where p.supplier_sku='LL297' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front (Non Chimney Side) - 60 x 25mm',0.6,true,false,1,3,'branding' from products p where p.supplier_sku='LL297' and p.supplier ilike 'logoline%';

-- LL3011 Hi Bounce Tennis Ball
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3011' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Top/Bottom - 30mm Diameter',0.25,true,true,1,1,'branding' from products p where p.supplier_sku='LL3011' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Top/Bottom - 25mm Diameter',0.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL3011' and p.supplier ilike 'logoline%';

-- LL3012 Hi Bounce Soccer Ball
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3012' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Front - 30mm Diameter, Black panel omitted to maximise print area on white background',0.25,true,true,1,1,'branding' from products p where p.supplier_sku='LL3012' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front - 25mm Diameter, Black panel omitted to maximise print area on white background',0.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL3012' and p.supplier ilike 'logoline%';

-- LL3014 Hi Bounce Ball
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3014' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Top/Bottom - 30mm Diameter',0.4,true,true,1,1,'branding' from products p where p.supplier_sku='LL3014' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Top/Bottom - 25mm Diameter',0.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL3014' and p.supplier ilike 'logoline%';

-- LL3015 Ace Hacky Sacks
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3015' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','27mmDiameter',0.25,true,true,1,1,'branding' from products p where p.supplier_sku='LL3015' and p.supplier ilike 'logoline%';

-- LL3018 Popper Ball
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3018' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Panel - 35 x 10mm',0.2,true,true,1,1,'branding' from products p where p.supplier_sku='LL3018' and p.supplier ilike 'logoline%';

-- LL3024 Venezia Luggage Tag
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3024' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Front - 40 x 35mm',0.25,true,true,1,1,'branding' from products p where p.supplier_sku='LL3024' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Back - 40 x 50mm',0.25,true,true,1,2,'branding' from products p where p.supplier_sku='LL3024' and p.supplier ilike 'logoline%';

-- LL3027 H2O Wet Wipes
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3027' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Front - 55 x 30mm',0.17,true,false,1,1,'branding' from products p where p.supplier_sku='LL3027' and p.supplier ilike 'logoline%';

-- LL3031 Petite Candle in Tin
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3031' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Lid - 40mm Diameter',0.25,true,true,1,1,'branding' from products p where p.supplier_sku='LL3031' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Lid - 40mm Diameter',0.4,true,false,1,2,'branding' from products p where p.supplier_sku='LL3031' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Label Per Position','Lid - 35mm Diameter',0.2,true,false,1,3,'branding' from products p where p.supplier_sku='LL3031' and p.supplier ilike 'logoline%';

-- LL3033 Gleam Glass Candle - Medium
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3033' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Box (Standard) - 50mm x 50mm',0.2,true,false,1,1,'branding' from products p where p.supplier_sku='LL3033' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Box (Deluxe Arch) - 60mm x 70mm',0.2,true,false,1,2,'branding' from products p where p.supplier_sku='LL3033' and p.supplier ilike 'logoline%';

-- LL3035 Gleam Glass Candle - Large
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3035' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Lid - 55mm Diameter',0.8,true,false,1,1,'branding' from products p where p.supplier_sku='LL3035' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Lid - 50mm Diameter',0.3,true,true,1,2,'branding' from products p where p.supplier_sku='LL3035' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Front of Candle - 50 x 50mm',0.5,true,true,1,3,'branding' from products p where p.supplier_sku='LL3035' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Lid - 55mm Diameter',0.45,true,false,1,4,'branding' from products p where p.supplier_sku='LL3035' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Label Per Position','Box (Standard) - 50 x 50mm',0.2,true,false,1,5,'branding' from products p where p.supplier_sku='LL3035' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Label Per Position','Box (Deluxe Arch) - 60mm x 70mm',0.2,true,false,1,6,'branding' from products p where p.supplier_sku='LL3035' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Label Per Position','Box Sleeve - 406 x 109mm',0.2,true,false,1,7,'branding' from products p where p.supplier_sku='LL3035' and p.supplier ilike 'logoline%';

-- LL3062 Codex Cork Sticky Notes
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3062' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Front/Back - 40 x 50mm',0.35,true,true,1,1,'branding' from products p where p.supplier_sku='LL3062' and p.supplier ilike 'logoline%';

-- LL3065 Safari Bamboo Notebook
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3065' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Front/Back of Notebook - 60 x 60mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL3065' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Front of Notebook - 60 x 30mm',0.8,true,false,1,2,'branding' from products p where p.supplier_sku='LL3065' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front of Notebook - 100 x 150mm',1.25,true,false,1,3,'branding' from products p where p.supplier_sku='LL3065' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Digital Sleeve - 45 x 439mm',1.25,true,false,1,4,'branding' from products p where p.supplier_sku='LL3065' and p.supplier ilike 'logoline%';

-- LL3068 Twiggy Bamboo Notebook
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3068' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Front/Back - 60 x 60mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL3068' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Front - 60 x 30mm',0.8,true,false,1,2,'branding' from products p where p.supplier_sku='LL3068' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front/Back - 60 x 60mm',0.8,true,false,1,3,'branding' from products p where p.supplier_sku='LL3068' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Front/Back - 50 x 50mm',0.19,true,false,1,4,'branding' from products p where p.supplier_sku='LL3068' and p.supplier ilike 'logoline%';

-- LL3073 Lumix Bamboo Sticky Notes
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3073' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Front/Back - 50 x 50mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL3073' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Front - 50 x 80mm',0.8,true,false,1,2,'branding' from products p where p.supplier_sku='LL3073' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front/Back - 50 x 80mm',0.8,true,false,1,3,'branding' from products p where p.supplier_sku='LL3073' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Front/Back - 50 x 50mm',0.25,true,false,1,4,'branding' from products p where p.supplier_sku='LL3073' and p.supplier ilike 'logoline%';

-- LL3074 Noughts & Crosses Coaster
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3074' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Large - 75 x 75mm',1.0,true,false,1,1,'branding' from products p where p.supplier_sku='LL3074' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Small - 50 x 25mm',0.4,true,false,1,2,'branding' from products p where p.supplier_sku='LL3074' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','50 x 50mm',0.3,true,true,1,3,'branding' from products p where p.supplier_sku='LL3074' and p.supplier ilike 'logoline%';

-- LL3076 Jumping Frog Game
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3076' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Label Per Position','Lid - 60mm Diameter',0.19,true,false,1,1,'branding' from products p where p.supplier_sku='LL3076' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Label Per Position','Tub - 60mm Diameter',0.19,true,false,1,2,'branding' from products p where p.supplier_sku='LL3076' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Lid - 90mm Diameter',1.25,true,false,1,3,'branding' from products p where p.supplier_sku='LL3076' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Tub - 30mm x 60mm',1.25,true,false,1,4,'branding' from products p where p.supplier_sku='LL3076' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Lid - 50mm Diameter',0.4,true,true,1,5,'branding' from products p where p.supplier_sku='LL3076' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Tub - 40 x 40mm',0.4,true,true,1,6,'branding' from products p where p.supplier_sku='LL3076' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Lid - 75mm Diameter',0.4,true,true,1,7,'branding' from products p where p.supplier_sku='LL3076' and p.supplier ilike 'logoline%';

-- LL3079 Crazy Bouncing Putty
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3079' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Lid - 45mm Diameter',0.23,true,false,1,1,'branding' from products p where p.supplier_sku='LL3079' and p.supplier ilike 'logoline%';

-- LL3081 Bling Pen
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3081' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Barrel - 50 x 7mm',0.12,true,true,1,1,'branding' from products p where p.supplier_sku='LL3081' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen Sleeve - 55 x 20mm',0.12,true,true,1,2,'branding' from products p where p.supplier_sku='LL3081' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Barrel - 50 x 7mm',0.25,true,false,1,3,'branding' from products p where p.supplier_sku='LL3081' and p.supplier ilike 'logoline%';

-- LL3111 Pickleball Set
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3111' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Bat - 140 x 130mm',1.0,true,true,1,1,'branding' from products p where p.supplier_sku='LL3111' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Pouch - 150 x 150mm',0.5,true,true,1,2,'branding' from products p where p.supplier_sku='LL3111' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Label Per Position','Bat - 150mm Diameter',1.9,true,false,1,3,'branding' from products p where p.supplier_sku='LL3111' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Pouch - 150 x 150mm',2.1,true,false,1,4,'branding' from products p where p.supplier_sku='LL3111' and p.supplier ilike 'logoline%';

-- LL31450 Corporate Colour Mini Jelly Beans in 50 Gram Cello Bag
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL31450' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Front - 50 x 50mm, 45mm Diameter, 55 x 30mm',0.19,true,false,1,1,'branding' from products p where p.supplier_sku='LL31450' and p.supplier ilike 'logoline%';

-- LL3146 Assorted Colour Mini Jelly Beans in Container
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3146' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','39mm Diameter',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL3146' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Lid/Side - 45mm Diameter',0.21,true,false,1,2,'branding' from products p where p.supplier_sku='LL3146' and p.supplier ilike 'logoline%';

-- LL31470 Assorted Colour Mini Jelly Beans in 50 Gram Cello Bag
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL31470' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Front - 50 x 50mm, 45mm Dia, 55 x 30mm',0.19,true,false,1,1,'branding' from products p where p.supplier_sku='LL31470' and p.supplier ilike 'logoline%';

-- LL3148 Plastic Container
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3148' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pad - 39mm DIa',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL3148' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Lid/Side - 45mm Dia',0.21,true,false,1,2,'branding' from products p where p.supplier_sku='LL3148' and p.supplier ilike 'logoline%';

-- LL3149 Corporate Colour Mini Jelly Beans in Container
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3149' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Lid - 39mm Dia',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL3149' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Lid/Side - 45mm Dia',0.21,true,false,1,2,'branding' from products p where p.supplier_sku='LL3149' and p.supplier ilike 'logoline%';

-- LL321 Silver Rectangular Tin
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL321' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Lid - 60 x 45mm',0.4,true,true,1,1,'branding' from products p where p.supplier_sku='LL321' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Lid - 60 x 45mm',0.8,true,false,1,2,'branding' from products p where p.supplier_sku='LL321' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Lid - 70 x 40mm',0.2,true,false,1,3,'branding' from products p where p.supplier_sku='LL321' and p.supplier ilike 'logoline%';

-- LL326 Clear Pillow Pack
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL326' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Front - 50 x 50mm, 55 x 30mm, 45mm Diameter',0.21,true,false,1,1,'branding' from products p where p.supplier_sku='LL326' and p.supplier ilike 'logoline%';

-- LL3260 Santa Fe Pen / Stylus
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3260' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Barrel - 32 x 7mm',0.12,true,true,1,1,'branding' from products p where p.supplier_sku='LL3260' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen Sleeve - 55 x 20mm',0.12,true,true,1,2,'branding' from products p where p.supplier_sku='LL3260' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','32 x 7mm,  50 x 5mm',0.25,true,false,1,3,'branding' from products p where p.supplier_sku='LL3260' and p.supplier ilike 'logoline%';

-- LL3270 Napier Deluxe Pen
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3270' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Barrel - 50 x 7mm',0.12,true,true,1,1,'branding' from products p where p.supplier_sku='LL3270' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen Sleeve - 55 x 20mm',0.12,true,true,1,2,'branding' from products p where p.supplier_sku='LL3270' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Barrel - 50 x 6mm',0.25,true,false,1,3,'branding' from products p where p.supplier_sku='LL3270' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Barrel - 50 x 6mm',0.5,true,false,1,4,'branding' from products p where p.supplier_sku='LL3270' and p.supplier ilike 'logoline%';

-- LL3271 Napier Pen
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3271' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Barrel - 50 x 6mm',0.15,true,false,1,1,'branding' from products p where p.supplier_sku='LL3271' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Barrel - 50 x 7mm',0.12,true,true,1,2,'branding' from products p where p.supplier_sku='LL3271' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen Sleeve - 55 x 20mm',0.12,true,true,1,3,'branding' from products p where p.supplier_sku='LL3271' and p.supplier ilike 'logoline%';

-- LL3272 Napier Pen (Black Edition)
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3272' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Barrel - 50 x 6mm',0.12,true,false,1,1,'branding' from products p where p.supplier_sku='LL3272' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Barrel - 50 x 7mm',0.12,true,true,1,2,'branding' from products p where p.supplier_sku='LL3272' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen Sleeve - 55 x 20mm',0.12,true,true,1,3,'branding' from products p where p.supplier_sku='LL3272' and p.supplier ilike 'logoline%';

-- LL3274 Napier Bamboo Pen
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3274' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Barrel - 50 x 7mm',0.12,true,true,1,1,'branding' from products p where p.supplier_sku='LL3274' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen Sleeve - 55 x 20mm',0.12,true,true,1,2,'branding' from products p where p.supplier_sku='LL3274' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Barrel - 50 x 6mm',0.25,true,false,1,3,'branding' from products p where p.supplier_sku='LL3274' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Barrel - 50 x 6mm',0.2,true,false,1,4,'branding' from products p where p.supplier_sku='LL3274' and p.supplier ilike 'logoline%';

-- LL3275 Miami Aluminium Pen
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3275' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Barrel - 40 x 6mm',0.12,true,false,1,1,'branding' from products p where p.supplier_sku='LL3275' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Barrel - 40 x 6mm',0.12,true,true,1,2,'branding' from products p where p.supplier_sku='LL3275' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen Sleeve - 55 x 20mm',0.12,true,true,1,3,'branding' from products p where p.supplier_sku='LL3275' and p.supplier ilike 'logoline%';

-- LL3276 Hamilton Pen
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3276' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','45 x 5mm',0.1,true,false,1,1,'branding' from products p where p.supplier_sku='LL3276' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','45 x 6mm',0.25,true,false,1,2,'branding' from products p where p.supplier_sku='LL3276' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Barrel - 45 x 7mm',0.12,true,true,1,3,'branding' from products p where p.supplier_sku='LL3276' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen Sleeve - 55 x 20mm',0.12,true,true,1,4,'branding' from products p where p.supplier_sku='LL3276' and p.supplier ilike 'logoline%';

-- LL3278 Orlando Mirror Pen
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3278' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Mirror Laser Engrave Per Position','Barrel - 50 x 6mm',0.5,true,false,1,1,'branding' from products p where p.supplier_sku='LL3278' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Barrel - 50 x 7mm',0.12,true,true,1,2,'branding' from products p where p.supplier_sku='LL3278' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen Sleeve - 55 x 20mm',0.12,true,true,1,3,'branding' from products p where p.supplier_sku='LL3278' and p.supplier ilike 'logoline%';

-- LL3279 Napier Pen (Gold Edition)
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3279' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Barrel - 50 x 7mm',0.12,true,true,1,1,'branding' from products p where p.supplier_sku='LL3279' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen Sleeve - 55 x 20mm',0.12,true,true,1,2,'branding' from products p where p.supplier_sku='LL3279' and p.supplier ilike 'logoline%';

-- LL3280 Opal Pen / Stylus
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3280' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Barrel - 50 x 7mm',0.12,true,true,1,1,'branding' from products p where p.supplier_sku='LL3280' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen Sleeve - 55 x 20mm',0.12,true,true,1,2,'branding' from products p where p.supplier_sku='LL3280' and p.supplier ilike 'logoline%';

-- LL3282 Helix Pen / Stylus
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3282' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Barrel - 52 x 6.5mm',0.25,true,false,1,1,'branding' from products p where p.supplier_sku='LL3282' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Barrel - 52 x 6.5mm',0.12,true,true,1,2,'branding' from products p where p.supplier_sku='LL3282' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen Sleeve - 55 x 20mm',0.12,true,true,1,3,'branding' from products p where p.supplier_sku='LL3282' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','52 x 6mm',0.5,true,false,1,4,'branding' from products p where p.supplier_sku='LL3282' and p.supplier ilike 'logoline%';

-- LL3283 Napier Eco Pen
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3283' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Barrel - 50 x 7mm',0.12,true,true,1,1,'branding' from products p where p.supplier_sku='LL3283' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen Sleeve - 55 x 20mm',0.12,true,true,1,2,'branding' from products p where p.supplier_sku='LL3283' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Barrel - 50 x 6mm',0.25,true,false,1,3,'branding' from products p where p.supplier_sku='LL3283' and p.supplier ilike 'logoline%';

-- LL3285 Chameleon Pen / Stylus
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3285' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Barrel - 70 x 6.5mm',0.25,true,false,1,1,'branding' from products p where p.supplier_sku='LL3285' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Barrel - 50 x 8mm',0.12,true,true,1,2,'branding' from products p where p.supplier_sku='LL3285' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Clip - 30 x 6mm',0.12,true,true,1,3,'branding' from products p where p.supplier_sku='LL3285' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen Sleeve - 55 x 20mm',0.12,true,true,1,4,'branding' from products p where p.supplier_sku='LL3285' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Roll Print Per Position','Barrel - 45 x 30mm',0.12,true,false,1,5,'branding' from products p where p.supplier_sku='LL3285' and p.supplier ilike 'logoline%';

-- LL3289 Starion Pen
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3289' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Mirror Laser Engrave Per Position','Upper Barrel - 35 x 6mm',0.5,true,false,1,1,'branding' from products p where p.supplier_sku='LL3289' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Upper barrel - 35 x 6mm',0.12,true,true,1,2,'branding' from products p where p.supplier_sku='LL3289' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Lower barrel - 35 x 6mm',0.12,true,true,1,3,'branding' from products p where p.supplier_sku='LL3289' and p.supplier ilike 'logoline%';

-- LL3292 Napier Paper Pen
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3292' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Barrel - 50 x 70mm',0.12,true,true,1,1,'branding' from products p where p.supplier_sku='LL3292' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen Sleeve - 55 x 20mm',0.12,true,true,1,2,'branding' from products p where p.supplier_sku='LL3292' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Barrel - 50 x 6mm',0.25,true,false,1,3,'branding' from products p where p.supplier_sku='LL3292' and p.supplier ilike 'logoline%';

-- LL3293 Miami Bamboo Pen
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3293' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','60mm x 6mm',0.12,true,true,1,1,'branding' from products p where p.supplier_sku='LL3293' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','80mm x 6.5mm',0.25,true,false,1,2,'branding' from products p where p.supplier_sku='LL3293' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','50mm x 6.5mm',0.2,true,false,1,3,'branding' from products p where p.supplier_sku='LL3293' and p.supplier ilike 'logoline%';

-- LL3294 Titan Pen
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3294' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Barrel - 60 x 7mm',0.12,true,true,1,1,'branding' from products p where p.supplier_sku='LL3294' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen Sleeve - 55 x 20mm',0.12,true,true,1,2,'branding' from products p where p.supplier_sku='LL3294' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Barrel - 60 x 7mm',0.25,true,false,1,3,'branding' from products p where p.supplier_sku='LL3294' and p.supplier ilike 'logoline%';

-- LL3295 Hook Pen
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3295' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Barrel - 42 x 8mm',0.12,true,true,1,1,'branding' from products p where p.supplier_sku='LL3295' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Clip - 28 x 5mm',0.12,true,true,1,2,'branding' from products p where p.supplier_sku='LL3295' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen Sleeve - 55 x 20mm',0.12,true,true,1,3,'branding' from products p where p.supplier_sku='LL3295' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Roll Print Per Position','38 x 20mm',0.12,true,false,1,4,'branding' from products p where p.supplier_sku='LL3295' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Barrel - 42 x 7.5mm',0.25,true,false,1,5,'branding' from products p where p.supplier_sku='LL3295' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Clip - 28 x 5mm',0.25,true,false,1,6,'branding' from products p where p.supplier_sku='LL3295' and p.supplier ilike 'logoline%';

-- LL3296 Shark Spinner Pen
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3296' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen Sleeve - 55 x 20mm',0.12,true,true,1,1,'branding' from products p where p.supplier_sku='LL3296' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','70 x 6.5mm',0.25,true,false,1,2,'branding' from products p where p.supplier_sku='LL3296' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','60 x 6.5mm',0.2,true,false,1,3,'branding' from products p where p.supplier_sku='LL3296' and p.supplier ilike 'logoline%';

-- LL3298 Serenity Aluminium Pen
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3298' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen - 50 x 7mm',0.12,true,true,1,1,'branding' from products p where p.supplier_sku='LL3298' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen Sleeve - 55 x 20mm',0.12,true,true,1,2,'branding' from products p where p.supplier_sku='LL3298' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','50 x 6mm',0.25,true,false,1,3,'branding' from products p where p.supplier_sku='LL3298' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','50 x 6mm',0.5,true,false,1,4,'branding' from products p where p.supplier_sku='LL3298' and p.supplier ilike 'logoline%';

-- LL3299 Napier Recycled ABS Pen
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3299' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Barrel - 50mm x 6mm',0.25,true,false,1,1,'branding' from products p where p.supplier_sku='LL3299' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Barrel - 50mm x 7mm',0.12,true,true,1,2,'branding' from products p where p.supplier_sku='LL3299' and p.supplier ilike 'logoline%';

-- LL33001 M&M's in Dispenser
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL33001' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Front - 55 x 30mm',0.21,true,false,1,1,'branding' from products p where p.supplier_sku='LL33001' and p.supplier ilike 'logoline%';

-- LL33004 M&M's in Container
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL33004' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Lid - 39mm Diameter',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL33004' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Lid/Side - 45mm Diameter',0.21,true,false,1,2,'branding' from products p where p.supplier_sku='LL33004' and p.supplier ilike 'logoline%';

-- LL33012 M&M's in 50 Gram Cello Bag
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL33012' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Front - 50 x 50mm, 55 x 30mm, 45mm Dia',0.19,true,false,1,1,'branding' from products p where p.supplier_sku='LL33012' and p.supplier ilike 'logoline%';

-- LL33016 M&M's in Silver Rectangular Tin
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL33016' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Lid - 60 x 45mm',0.4,true,true,1,1,'branding' from products p where p.supplier_sku='LL33016' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Lid - 60 x 45mm',0.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL33016' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Lid - 60 x 45mm',0.8,true,false,1,3,'branding' from products p where p.supplier_sku='LL33016' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Lid - 70 x 40mm',0.2,true,false,1,4,'branding' from products p where p.supplier_sku='LL33016' and p.supplier ilike 'logoline%';

-- LL3311 Elara Spinner Pen
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3311' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen Sleeve - 55 x 20mm',0.15,true,true,1,1,'branding' from products p where p.supplier_sku='LL3311' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','40 x 6mm',0.15,true,false,1,2,'branding' from products p where p.supplier_sku='LL3311' and p.supplier ilike 'logoline%';

-- LL3314 Saturn Aluminium Pen
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3314' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Barrel - 50 x 6mm',0.12,true,false,1,1,'branding' from products p where p.supplier_sku='LL3314' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen Barrel - 50 x 7mm',0.12,true,true,1,2,'branding' from products p where p.supplier_sku='LL3314' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen Sleeve - 55 x 20mm',0.12,true,true,1,3,'branding' from products p where p.supplier_sku='LL3314' and p.supplier ilike 'logoline%';

-- LL3316 Maddie Gel Ink Pen
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3316' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Barrel - 50 x 6mm',0.5,true,false,1,1,'branding' from products p where p.supplier_sku='LL3316' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Barrel - 50 x 6mm',0.12,true,true,1,2,'branding' from products p where p.supplier_sku='LL3316' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen Sleeve - 55 x 20mm',0.12,true,true,1,3,'branding' from products p where p.supplier_sku='LL3316' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Barrel - 60 x 6mm',0.25,true,false,1,4,'branding' from products p where p.supplier_sku='LL3316' and p.supplier ilike 'logoline%';

-- LL3317 Napier Gel Ink Pen
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3317' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Barrel - 50 x 6mm',0.15,true,false,1,1,'branding' from products p where p.supplier_sku='LL3317' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Barrel - 50 x 7mm',0.12,true,true,1,2,'branding' from products p where p.supplier_sku='LL3317' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen Sleeve - 55 x 20mm',0.12,true,true,1,3,'branding' from products p where p.supplier_sku='LL3317' and p.supplier ilike 'logoline%';

-- LL334 Assorted Colour Mini Jelly Beans in Silver Rectangular Tin
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL334' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Lid - 60 x 45mm',0.4,true,true,1,1,'branding' from products p where p.supplier_sku='LL334' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Lid - 60 x 45mm',0.8,true,false,1,2,'branding' from products p where p.supplier_sku='LL334' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Lid - 70 x 40mm',0.2,true,false,1,3,'branding' from products p where p.supplier_sku='LL334' and p.supplier ilike 'logoline%';

-- LL335 Corporate Colour Mini Jelly Beans in Silver Rectangular Tin
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL335' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Lid - 60 x 45mm',0.4,true,true,1,1,'branding' from products p where p.supplier_sku='LL335' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Lid - 60 x 45mm',0.8,true,false,1,2,'branding' from products p where p.supplier_sku='LL335' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Lid - 70 x 40mm',0.2,true,false,1,3,'branding' from products p where p.supplier_sku='LL335' and p.supplier ilike 'logoline%';

-- LL340 Silver Round Tin
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL340' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Lid - 60mm Dia',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL340' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Lid - 60mm Dia',0.21,true,false,1,2,'branding' from products p where p.supplier_sku='LL340' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Lid - 60mm Dia',0.7,true,false,1,3,'branding' from products p where p.supplier_sku='LL340' and p.supplier ilike 'logoline%';

-- LL3401 M&M's in Silver Round Tin
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3401' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Lid - 60mm Dia',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL3401' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Lid - 60mm Dia',0.21,true,false,1,2,'branding' from products p where p.supplier_sku='LL3401' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Lid - 60mm Dia',0.7,true,false,1,3,'branding' from products p where p.supplier_sku='LL3401' and p.supplier ilike 'logoline%';

-- LL3402 Assorted Colour Mini Jelly Beans in Silver Round Tin
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3402' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Lid - 60mm Diameter',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL3402' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Lid - 60mm Diameter',0.21,true,false,1,2,'branding' from products p where p.supplier_sku='LL3402' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Lid - 60mm Diameter',0.7,true,false,1,3,'branding' from products p where p.supplier_sku='LL3402' and p.supplier ilike 'logoline%';

-- LL3403 Corporate Colour Mini Jelly Beans in Silver Round Tin
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3403' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Lid - 60mm Diameter',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL3403' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Lid - 60mm Diameter',0.21,true,false,1,2,'branding' from products p where p.supplier_sku='LL3403' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Lid - 60mm Diameter',0.7,true,false,1,3,'branding' from products p where p.supplier_sku='LL3403' and p.supplier ilike 'logoline%';

-- LL3431 Pisa Glass Tumbler
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3431' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','60 x 100mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL3431' and p.supplier ilike 'logoline%';

-- LL3436 Phone Grip
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3436' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Phone Grip - 35mm Diameter',0.15,true,true,1,1,'branding' from products p where p.supplier_sku='LL3436' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Phone Grip - 40mm Diameter',0.2,true,false,1,2,'branding' from products p where p.supplier_sku='LL3436' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','A6 Card - 148.5 x 105mm',1.6,true,false,1,3,'branding' from products p where p.supplier_sku='LL3436' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Card - 100 x 75mm',1.6,true,false,1,4,'branding' from products p where p.supplier_sku='LL3436' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Dash Mount - 24mm Diameter',0.45,true,false,1,5,'branding' from products p where p.supplier_sku='LL3436' and p.supplier ilike 'logoline%';

-- LL3449 Stealth Kraft Inkless Pen
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3449' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','60mm x 5mm',0.15,true,true,1,1,'branding' from products p where p.supplier_sku='LL3449' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Roll Print Per Position','65mm x 12mm',0.15,true,false,1,2,'branding' from products p where p.supplier_sku='LL3449' and p.supplier ilike 'logoline%';

-- LL3451 Mirage Aluminium Inkless Pen
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3451' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','60mm x 7mm',0.15,true,true,1,1,'branding' from products p where p.supplier_sku='LL3451' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Roll Print Per Position','60mm x 12mm',0.15,true,false,1,2,'branding' from products p where p.supplier_sku='LL3451' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','60mm x 6mm (LxH) - Engraves to Approx. Warm Grey 2C',0.15,true,false,1,3,'branding' from products p where p.supplier_sku='LL3451' and p.supplier ilike 'logoline%';

-- LL3456 Columbia Aluminium Pen
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3456' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','38 x 7mm',0.15,true,true,1,1,'branding' from products p where p.supplier_sku='LL3456' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Roll Print Per Position','30 x 20mm',0.15,true,false,1,2,'branding' from products p where p.supplier_sku='LL3456' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','42 x 6mm',0.15,true,false,1,3,'branding' from products p where p.supplier_sku='LL3456' and p.supplier ilike 'logoline%';

-- LL3483 Villa Cork Round Coaster
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3483' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','80mmDia',0.25,true,true,1,1,'branding' from products p where p.supplier_sku='LL3483' and p.supplier ilike 'logoline%';

-- LL3484 Villa Cork Square Coaster
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3484' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','80 x 80mm',0.25,true,true,1,1,'branding' from products p where p.supplier_sku='LL3484' and p.supplier ilike 'logoline%';

-- LL350 Transit Van Stress Reliever
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL350' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Roof - 55 x 25mm',0.3,true,true,1,1,'branding' from products p where p.supplier_sku='LL350' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Side/s - 40 x 16mm',0.3,true,true,1,2,'branding' from products p where p.supplier_sku='LL350' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Roof - 55 x 25mm',0.6,true,false,1,3,'branding' from products p where p.supplier_sku='LL350' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Side/s - 40 x 16mm',0.6,true,false,1,4,'branding' from products p where p.supplier_sku='LL350' and p.supplier ilike 'logoline%';

-- LL3513 Mini Lint Roller
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3513' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Back (Bigger Side) - 35 x 12mm',0.3,true,false,1,1,'branding' from products p where p.supplier_sku='LL3513' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Back (Smaller Side) - 25 x 12mm',0.3,true,false,1,2,'branding' from products p where p.supplier_sku='LL3513' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Front - 50 x 15mm',0.2,true,true,1,3,'branding' from products p where p.supplier_sku='LL3513' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Back (Bigger Side) - 30 x 10mm',0.2,true,true,1,4,'branding' from products p where p.supplier_sku='LL3513' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Back (Smaller Side) - 20 x 10mm',0.2,true,true,1,5,'branding' from products p where p.supplier_sku='LL3513' and p.supplier ilike 'logoline%';

-- LL3515 Lynx Wheat Fibre Comb
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3515' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','55 x 10mm',0.15,true,true,1,1,'branding' from products p where p.supplier_sku='LL3515' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','55 x 10mm',0.25,true,false,1,2,'branding' from products p where p.supplier_sku='LL3515' and p.supplier ilike 'logoline%';

-- LL3519 Arvo Bottle Opener
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3519' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','20 x 12mm',0.2,true,true,1,1,'branding' from products p where p.supplier_sku='LL3519' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','20 x 12mm',0.25,true,false,1,2,'branding' from products p where p.supplier_sku='LL3519' and p.supplier ilike 'logoline%';

-- LL3520 Summer Keytag Bottle Opener
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3520' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Front - 25 x 20mm',0.3,true,true,1,1,'branding' from products p where p.supplier_sku='LL3520' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front - 25 x 20mm',0.3,true,false,1,2,'branding' from products p where p.supplier_sku='LL3520' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Front & Back - 25 x 20mm',0.5,true,false,1,3,'branding' from products p where p.supplier_sku='LL3520' and p.supplier ilike 'logoline%';

-- LL3522 House Bamboo Zinc Keytag
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3522' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','20 x 20mm',0.3,true,true,1,1,'branding' from products p where p.supplier_sku='LL3522' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','20 x 20mm',0.4,true,false,1,2,'branding' from products p where p.supplier_sku='LL3522' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','20 x 20mm',0.35,true,false,1,3,'branding' from products p where p.supplier_sku='LL3522' and p.supplier ilike 'logoline%';

-- LL3524 Circle Bamboo Zinc Keytag
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3524' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','22 x 22mm,  25mmDia',0.3,true,true,1,1,'branding' from products p where p.supplier_sku='LL3524' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','22 x 22mm,  25mmDia',0.4,true,false,1,2,'branding' from products p where p.supplier_sku='LL3524' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','22 x 22mm,  25mmDia',0.35,true,false,1,3,'branding' from products p where p.supplier_sku='LL3524' and p.supplier ilike 'logoline%';

-- LL3526 Rectangle Bamboo Zinc Keytag
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3526' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','38 x 22mm,  25mmDia',0.3,true,true,1,1,'branding' from products p where p.supplier_sku='LL3526' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','38 x 22mm,  25mmDia',0.4,true,false,1,2,'branding' from products p where p.supplier_sku='LL3526' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','38 x 22mm,  25mmDia',0.35,true,false,1,3,'branding' from products p where p.supplier_sku='LL3526' and p.supplier ilike 'logoline%';

-- LL3527 House Stainless Steel Keytag
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3527' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','20mm x 15mm',0.4,true,false,1,1,'branding' from products p where p.supplier_sku='LL3527' and p.supplier ilike 'logoline%';

-- LL3529 Circle Stainless Steel Keytag
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3529' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','24mm x 20mm',0.4,true,false,1,1,'branding' from products p where p.supplier_sku='LL3529' and p.supplier ilike 'logoline%';

-- LL3531 Rectangle Stainless Steel Keytag
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3531' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','25mm x 20mm',0.4,true,false,1,1,'branding' from products p where p.supplier_sku='LL3531' and p.supplier ilike 'logoline%';

-- LL3533 Dog Bone Keytag
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3533' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Front (Paw on left) - 20 x 10mm',0.25,true,false,1,1,'branding' from products p where p.supplier_sku='LL3533' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Back (Paw on right) - 20 x 10mm',0.25,true,false,1,2,'branding' from products p where p.supplier_sku='LL3533' and p.supplier ilike 'logoline%';

-- LL3535 Luxeloop Keytag
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3535' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','20mm Diameter',0.15,true,true,1,1,'branding' from products p where p.supplier_sku='LL3535' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','20mm Diameter',0.25,true,false,1,2,'branding' from products p where p.supplier_sku='LL3535' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','22mm Diameter',0.3,true,false,1,3,'branding' from products p where p.supplier_sku='LL3535' and p.supplier ilike 'logoline%';

-- LL3598 World's Smallest Pig Coin Bank
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3598' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Side/s - 35mm Diameter',0.25,true,true,1,1,'branding' from products p where p.supplier_sku='LL3598' and p.supplier ilike 'logoline%';

-- LL3600 World's Smallest Pig Eco Coin Bank
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3600' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Side/s - 35mm Diameter',0.25,true,true,1,1,'branding' from products p where p.supplier_sku='LL3600' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Side/s - 30 x 30mm',0.3,true,false,1,2,'branding' from products p where p.supplier_sku='LL3600' and p.supplier ilike 'logoline%';

-- LL3611 Bionic Multi Tool in Pouch
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3611' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Tool - 25 x 5mm',0.25,true,false,1,1,'branding' from products p where p.supplier_sku='LL3611' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Tool - 20 x - 10 x 15mm (LxHxD)',0.25,true,false,1,2,'branding' from products p where p.supplier_sku='LL3611' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Pouch - 50 x 30mm',0.5,true,false,1,3,'branding' from products p where p.supplier_sku='LL3611' and p.supplier ilike 'logoline%';

-- LL3790 Arctic Bottle Opener
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3790' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Handle - 55 x 25mm',0.25,true,true,1,1,'branding' from products p where p.supplier_sku='LL3790' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Full coverage - see line drawing',0.35,true,false,1,2,'branding' from products p where p.supplier_sku='LL3790' and p.supplier ilike 'logoline%';

-- LL3792 Chillax Bottle Opener
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3792' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','50 x 25mm',0.15,true,true,1,1,'branding' from products p where p.supplier_sku='LL3792' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Small - 40 x 25mm',0.2,true,false,1,2,'branding' from products p where p.supplier_sku='LL3792' and p.supplier ilike 'logoline%';

-- LL3842 Groove Phone Stand
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3842' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','50 x 35mm',0.35,true,true,1,1,'branding' from products p where p.supplier_sku='LL3842' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','50 x 35mm',0.8,true,false,1,2,'branding' from products p where p.supplier_sku='LL3842' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','50 x 35mm',0.5,true,false,1,3,'branding' from products p where p.supplier_sku='LL3842' and p.supplier ilike 'logoline%';

-- LL3854 Mako Magnetic Clip
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3854' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','35mm x 50mm',0.5,true,false,1,1,'branding' from products p where p.supplier_sku='LL3854' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','30mm x 45mm',0.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL3854' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','35mm x 50mm',0.25,true,true,1,3,'branding' from products p where p.supplier_sku='LL3854' and p.supplier ilike 'logoline%';

-- LL3873 Weekly Pill Box
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3873' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','150 x 15mm',0.15,true,true,1,1,'branding' from products p where p.supplier_sku='LL3873' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','180 x 17mm',0.6,true,false,1,2,'branding' from products p where p.supplier_sku='LL3873' and p.supplier ilike 'logoline%';

-- LL3875 Compact Pill Organiser
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3875' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','50 x 30mm',0.35,true,true,1,1,'branding' from products p where p.supplier_sku='LL3875' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','90 x 35mm',0.6,true,false,1,2,'branding' from products p where p.supplier_sku='LL3875' and p.supplier ilike 'logoline%';

-- LL3879 Sparkle Toothbrush Case
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL3879' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Front/Back - 50 x 7mm',0.15,true,true,1,1,'branding' from products p where p.supplier_sku='LL3879' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front/Back - 55 x 9mm',0.25,true,false,1,2,'branding' from products p where p.supplier_sku='LL3879' and p.supplier ilike 'logoline%';

-- LL404 Supa Cham Chamois in Tube
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL404' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Flat Side - 80 x 23mm',1.0,true,true,1,1,'branding' from products p where p.supplier_sku='LL404' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Curved Side - 80 x 20mm',1.0,true,true,1,2,'branding' from products p where p.supplier_sku='LL404' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Curved Side - 125 x 60mm',0.65,true,false,1,3,'branding' from products p where p.supplier_sku='LL404' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Flat Side - 120 x 30mm',1.0,true,true,1,4,'branding' from products p where p.supplier_sku='LL404' and p.supplier ilike 'logoline%';

-- LL405 Supa Cham Chamois in Pouch
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL405' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Side/s - 180 x 130mm',0.6,true,true,1,1,'branding' from products p where p.supplier_sku='LL405' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Side/s - 90mm Dia',0.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL405' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Side/s - 120 x 42mm',0.5,true,false,1,3,'branding' from products p where p.supplier_sku='LL405' and p.supplier ilike 'logoline%';

-- LL406 Delight Pencil Case
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL406' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Front/Back - 180 x 130mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL406' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Front/Back - 90mm Dia',0.59,true,false,1,2,'branding' from products p where p.supplier_sku='LL406' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Front/Back - 138 x 50mm',0.59,true,false,1,3,'branding' from products p where p.supplier_sku='LL406' and p.supplier ilike 'logoline%';

-- LL40883 Frosty Plush Teddy Bear
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL40883' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','TShirt - 40 x 30mm',0.9,true,true,1,1,'branding' from products p where p.supplier_sku='LL40883' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','TShirt - 40 x 30mm',1.0,true,false,1,2,'branding' from products p where p.supplier_sku='LL40883' and p.supplier ilike 'logoline%';

-- LL420 Assorted Jelly Party Mix in 50 Gram Cello Bag
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL420' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Front - 50 x 50mm, 45mm Dia, 55 x 30mm',0.19,true,false,1,1,'branding' from products p where p.supplier_sku='LL420' and p.supplier ilike 'logoline%';

-- LL422 Assorted Jelly Party Mix in 180g Cello Bag
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL422' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Small - 50 x 50mm',0.19,true,false,1,1,'branding' from products p where p.supplier_sku='LL422' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Large - 71mm Diameter',0.25,true,false,1,2,'branding' from products p where p.supplier_sku='LL422' and p.supplier ilike 'logoline%';

-- LL4245 Recycled Highlighter
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL4245' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Side/s - 55 x 14mm',0.2,true,true,1,1,'branding' from products p where p.supplier_sku='LL4245' and p.supplier ilike 'logoline%';

-- LL429 Rainbow Spring Thingz
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL429' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Front/Back - 45 x 47mm',0.25,true,true,1,1,'branding' from products p where p.supplier_sku='LL429' and p.supplier ilike 'logoline%';

-- LL432 Concorde Pen
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL432' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Barrel - 50 x 6mm',0.12,true,true,1,1,'branding' from products p where p.supplier_sku='LL432' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Barrel - 32 x 8mm',0.12,true,true,1,2,'branding' from products p where p.supplier_sku='LL432' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen Sleeve - 55 x 20mm',0.12,true,true,1,3,'branding' from products p where p.supplier_sku='LL432' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Barrel - 50 x 5mm',0.25,true,false,1,4,'branding' from products p where p.supplier_sku='LL432' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Barrel - 32 x 7mm',0.25,true,false,1,5,'branding' from products p where p.supplier_sku='LL432' and p.supplier ilike 'logoline%';

-- LL4324 Blaze Torch
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL4324' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','50 x 18mm',0.2,true,true,1,1,'branding' from products p where p.supplier_sku='LL4324' and p.supplier ilike 'logoline%';

-- LL433 Viva Transparent Pen
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL433' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen Sleeve - 55 x 20mm',0.12,true,true,1,1,'branding' from products p where p.supplier_sku='LL433' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','50 x 5mm,  32 x 7mm',0.25,true,false,1,2,'branding' from products p where p.supplier_sku='LL433' and p.supplier ilike 'logoline%';

-- LL434 Viva Pen - White Barrel
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL434' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Barrel - 50 x 6mm',0.12,true,true,1,1,'branding' from products p where p.supplier_sku='LL434' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Barrel - 32 x 8mm',0.12,true,true,1,2,'branding' from products p where p.supplier_sku='LL434' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen Sleeve - 55 x 20mm',0.12,true,true,1,3,'branding' from products p where p.supplier_sku='LL434' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Barrel - 50 x 5mm',0.25,true,false,1,4,'branding' from products p where p.supplier_sku='LL434' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Barrel - 32 x 7mm',0.25,true,false,1,5,'branding' from products p where p.supplier_sku='LL434' and p.supplier ilike 'logoline%';

-- LL435 Viva Bamboo Pen
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL435' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Barrel - 50 x 5mm, 32 x 7mm',0.2,true,false,1,1,'branding' from products p where p.supplier_sku='LL435' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Barrel - 50 x 6mm, 32 x 8mm',0.12,true,true,1,2,'branding' from products p where p.supplier_sku='LL435' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen Sleeve - 55 x 20mm',0.12,true,true,1,3,'branding' from products p where p.supplier_sku='LL435' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Barrel - 50 x 5mm, 32 x 7mm',0.25,true,false,1,4,'branding' from products p where p.supplier_sku='LL435' and p.supplier ilike 'logoline%';

-- LL436 Viva Eco Pen
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL436' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen Sleeve - 55 x 20mm',0.12,true,true,1,1,'branding' from products p where p.supplier_sku='LL436' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','50 x 5mm  ,  32 x 7mm',0.25,true,false,1,2,'branding' from products p where p.supplier_sku='LL436' and p.supplier ilike 'logoline%';

-- LL4383 Signal Torch
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL4383' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','28 x 19mm',0.25,true,true,1,1,'branding' from products p where p.supplier_sku='LL4383' and p.supplier ilike 'logoline%';

-- LL4385 Foldable Camp Light
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL4385' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Green Side - 200 x 25mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL4385' and p.supplier ilike 'logoline%';

-- LL4408 Heatwave Fan
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL4408' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Centre - 20mm Diameter',0.2,true,false,1,1,'branding' from products p where p.supplier_sku='LL4408' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Handle - 20 x 45mm',0.2,true,false,1,2,'branding' from products p where p.supplier_sku='LL4408' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Centre - 22mm Diameter',0.25,true,true,1,3,'branding' from products p where p.supplier_sku='LL4408' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Handle - 15 x 45mm',0.25,true,true,1,4,'branding' from products p where p.supplier_sku='LL4408' and p.supplier ilike 'logoline%';

-- LL4409 Sirocco Fan
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL4409' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','50 x 35mm',0.25,true,true,1,1,'branding' from products p where p.supplier_sku='LL4409' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Box - 90 x 43mm',0.25,true,false,1,2,'branding' from products p where p.supplier_sku='LL4409' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Sleeve Per Position','Box - Full coverage',1.5,true,false,1,3,'branding' from products p where p.supplier_sku='LL4409' and p.supplier ilike 'logoline%';

-- LL444 Admire Pencil Case
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL444' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Front - 180 x 60mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL444' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Front - 71mm Dia',0.32,true,false,1,2,'branding' from products p where p.supplier_sku='LL444' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Front - 138 x 50mm',0.32,true,false,1,3,'branding' from products p where p.supplier_sku='LL444' and p.supplier ilike 'logoline%';

-- LL4442 Vibe Stationery Set
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL4442' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Pencil Case - 180 x 60mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL4442' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Ruler - 145 x 13mm',0.15,true,true,1,2,'branding' from products p where p.supplier_sku='LL4442' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Pen - 45 x 30mm',0.5,true,true,1,3,'branding' from products p where p.supplier_sku='LL4442' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Pencil Case - Front - 71mm Dia',0.32,true,false,1,4,'branding' from products p where p.supplier_sku='LL4442' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Pencil Set - 41 x 41mm',0.17,true,false,1,5,'branding' from products p where p.supplier_sku='LL4442' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pencil Set - 35 x 35mm',0.2,true,true,1,6,'branding' from products p where p.supplier_sku='LL4442' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Eraser - 40 x 27mm',0.2,true,true,1,7,'branding' from products p where p.supplier_sku='LL4442' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen - 50 x 6mm',0.5,true,true,1,8,'branding' from products p where p.supplier_sku='LL4442' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Eraser - 42 x 29mm',0.25,true,false,1,9,'branding' from products p where p.supplier_sku='LL4442' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Pen - 50 x 6mm',0.25,true,false,1,10,'branding' from products p where p.supplier_sku='LL4442' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Ruler - 145 x 13mm',0.4,true,false,1,11,'branding' from products p where p.supplier_sku='LL4442' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Pencil Set - 35 x 35mm',0.4,true,false,1,12,'branding' from products p where p.supplier_sku='LL4442' and p.supplier ilike 'logoline%';

-- LL446 Viva Stylus Pen
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL446' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Barrel - 50 x 6mm',0.12,true,true,1,1,'branding' from products p where p.supplier_sku='LL446' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Barrel - 32 x 8mm',0.12,true,true,1,2,'branding' from products p where p.supplier_sku='LL446' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen Sleeve - 55 x 20mm',0.1,true,true,1,3,'branding' from products p where p.supplier_sku='LL446' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Barrel - 50 x 5mm',0.25,true,false,1,4,'branding' from products p where p.supplier_sku='LL446' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Barrel - 32 x 7mm',0.25,true,false,1,5,'branding' from products p where p.supplier_sku='LL446' and p.supplier ilike 'logoline%';

-- LL447 Viva Stylus Pen & Highlighter
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL447' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Barrel - 50 x 6mm',0.12,true,true,1,1,'branding' from products p where p.supplier_sku='LL447' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Barrel - 32 x 8mm',0.12,true,true,1,2,'branding' from products p where p.supplier_sku='LL447' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen Sleeve - 55 x 20mm',0.12,true,true,1,3,'branding' from products p where p.supplier_sku='LL447' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Barrel - 50 x 5mm',0.25,true,false,1,4,'branding' from products p where p.supplier_sku='LL447' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Barrel - 32 x 7mm',0.25,true,false,1,5,'branding' from products p where p.supplier_sku='LL447' and p.supplier ilike 'logoline%';

-- LL448 Viva Solid Pen
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL448' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','50 x 6mm,  32 x 8mm',0.12,true,true,1,1,'branding' from products p where p.supplier_sku='LL448' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','50 x 5mm,  32 x 7mm',0.25,true,false,1,2,'branding' from products p where p.supplier_sku='LL448' and p.supplier ilike 'logoline%';

-- LL45 White Eraser
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL45' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Front/Back - 40 x 27mm',0.2,true,true,1,1,'branding' from products p where p.supplier_sku='LL45' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front/Back - 42 x 29mm',0.25,true,false,1,2,'branding' from products p where p.supplier_sku='LL45' and p.supplier ilike 'logoline%';

-- LL451 Corfu Retractable Name Badge Holder
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL451' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Front - 25mm Diameter',0.15,true,true,1,1,'branding' from products p where p.supplier_sku='LL451' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front - 25mm Diameter',0.35,true,false,1,2,'branding' from products p where p.supplier_sku='LL451' and p.supplier ilike 'logoline%';

-- LL452 Retractable Badge Holder Wheat Straw
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL452' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Front - 25mm Diameter',0.15,true,true,1,1,'branding' from products p where p.supplier_sku='LL452' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front - 25mm Diameter',0.35,true,false,1,2,'branding' from products p where p.supplier_sku='LL452' and p.supplier ilike 'logoline%';

-- LL454 Premium Retractable ID Badge Holder
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL454' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','25 x 30mm',0.15,true,true,1,1,'branding' from products p where p.supplier_sku='LL454' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','25 x 30mm',0.4,true,false,1,2,'branding' from products p where p.supplier_sku='LL454' and p.supplier ilike 'logoline%';

-- LL4559 Montana RPET Felt Sunglass Pouch
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL4559' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','120 x 55mm',0.45,true,true,1,1,'branding' from products p where p.supplier_sku='LL4559' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','140 x 45mm',1.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL4559' and p.supplier ilike 'logoline%';

-- LL4560 Horizon Sunglasses
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL4560' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Arm/s - 45 x 8mm',0.2,true,true,1,1,'branding' from products p where p.supplier_sku='LL4560' and p.supplier ilike 'logoline%';

-- LL4562 Bamboo Sunglasses
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL4562' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Arm/s - 45 x 8mm',0.15,true,true,1,1,'branding' from products p where p.supplier_sku='LL4562' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Arm/s - 45 x 8mm',0.3,true,false,1,2,'branding' from products p where p.supplier_sku='LL4562' and p.supplier ilike 'logoline%';

-- LL4563 Sunglasses Pack
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL4563' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Pouch - 120 x 55mm',0.45,true,true,1,1,'branding' from products p where p.supplier_sku='LL4563' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Arm/s - 45 x 8mm',0.15,true,true,1,2,'branding' from products p where p.supplier_sku='LL4563' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','45 x 8mm',0.3,true,false,1,3,'branding' from products p where p.supplier_sku='LL4563' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Pouch - 140 x 45mm',1.5,true,false,1,4,'branding' from products p where p.supplier_sku='LL4563' and p.supplier ilike 'logoline%';

-- LL4564 Lux Sunglasses Pack
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL4564' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Pouch - 120 x 55mm',0.45,true,true,1,1,'branding' from products p where p.supplier_sku='LL4564' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Arm/s - 45 x 8mm',0.2,true,true,1,2,'branding' from products p where p.supplier_sku='LL4564' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Pouch - 140 x 45mm',1.5,true,false,1,3,'branding' from products p where p.supplier_sku='LL4564' and p.supplier ilike 'logoline%';

-- LL4600 Mop Top Pen / Stylus
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL4600' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Front (Beneath Clip) - 40 x 7mm',0.12,true,true,1,1,'branding' from products p where p.supplier_sku='LL4600' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Back/Sides - 50 x 7mm',0.12,true,true,1,2,'branding' from products p where p.supplier_sku='LL4600' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen Sleeve - 55 x 20mm',0.12,true,true,1,3,'branding' from products p where p.supplier_sku='LL4600' and p.supplier ilike 'logoline%';

-- LL4602 Mop Top Jazz Pen / Stylus
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL4602' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Barrel - 50 x 7mm',0.12,true,true,1,1,'branding' from products p where p.supplier_sku='LL4602' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen Sleeve - 55 x 20mm',0.12,true,true,1,2,'branding' from products p where p.supplier_sku='LL4602' and p.supplier ilike 'logoline%';

-- LL4604 Mop Top Eco Pen
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL4604' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Barrel - 50 x 7mm',0.12,true,true,1,1,'branding' from products p where p.supplier_sku='LL4604' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen Sleeve - 55 x 20mm',0.12,true,true,1,2,'branding' from products p where p.supplier_sku='LL4604' and p.supplier ilike 'logoline%';

-- LL4630 Frenzy Pencil Case
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL4630' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Front/Back - 120 x 40mm',0.45,true,true,1,1,'branding' from products p where p.supplier_sku='LL4630' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Front/Back - 120 x 40mm',1.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL4630' and p.supplier ilike 'logoline%';

-- LL4632 Corsica Calico / Cork Utility Case
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL4632' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','160 x 60mm',0.75,true,true,1,1,'branding' from products p where p.supplier_sku='LL4632' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','150 x 40mm',1.7,true,false,1,2,'branding' from products p where p.supplier_sku='LL4632' and p.supplier ilike 'logoline%';

-- LL4634 Avalon Cork Utility / Pencil Case
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL4634' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','140 x 70mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL4634' and p.supplier ilike 'logoline%';

-- LL4651 Lancer Liquid Hand Sanitiser Stick
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL4651' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','55 x 10mm',0.15,true,true,1,1,'branding' from products p where p.supplier_sku='LL4651' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','75 x 7mm',0.2,true,false,1,2,'branding' from products p where p.supplier_sku='LL4651' and p.supplier ilike 'logoline%';

-- LL4652 Visor Glasses Holder
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL4652' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','22 x 42mm',0.5,true,false,1,1,'branding' from products p where p.supplier_sku='LL4652' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','25 x 45mm',0.3,true,true,1,2,'branding' from products p where p.supplier_sku='LL4652' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','30 x 50mm',0.45,true,false,1,3,'branding' from products p where p.supplier_sku='LL4652' and p.supplier ilike 'logoline%';

-- LL4659 Aqua Wet Wipes
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL4659' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Lid - 70 x 40mm',0.2,true,false,1,1,'branding' from products p where p.supplier_sku='LL4659' and p.supplier ilike 'logoline%';

-- LL4673 Breezy Gel Hand Sanitiser
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL4673' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Front Label - 33 x 33mm',0.16,true,false,1,1,'branding' from products p where p.supplier_sku='LL4673' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Front Label - 32mm Dia',0.16,true,false,1,2,'branding' from products p where p.supplier_sku='LL4673' and p.supplier ilike 'logoline%';

-- LL4675 Polar Hand Sanitiser
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL4675' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Front - 30 x 55mm',0.17,true,false,1,1,'branding' from products p where p.supplier_sku='LL4675' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front - 30 x 55mm',0.4,true,false,1,2,'branding' from products p where p.supplier_sku='LL4675' and p.supplier ilike 'logoline%';

-- LL4680 Pocket Tissues - 10 Pack
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL4680' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Front - 45 x 90mm',0.19,true,false,1,1,'branding' from products p where p.supplier_sku='LL4680' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Back - 30 x 55mm',0.19,true,false,1,2,'branding' from products p where p.supplier_sku='LL4680' and p.supplier ilike 'logoline%';

-- LL4683 Bamboo Tissues
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL4683' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Label Per Position','50 x 50mm,  45mm Diameter',0.19,true,false,1,1,'branding' from products p where p.supplier_sku='LL4683' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','50mm x 50mm',0.2,true,false,1,2,'branding' from products p where p.supplier_sku='LL4683' and p.supplier ilike 'logoline%';

-- LL4808 Orion Torch
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL4808' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','40 x 7mm',0.2,true,false,1,1,'branding' from products p where p.supplier_sku='LL4808' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','40 x 7mm',0.2,true,false,1,2,'branding' from products p where p.supplier_sku='LL4808' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','40 x 8mm',0.1,true,true,1,3,'branding' from products p where p.supplier_sku='LL4808' and p.supplier ilike 'logoline%';

-- LL4836 Transit Bamboo Luggage Tag
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL4836' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','89 x 59mm',0.75,true,false,1,1,'branding' from products p where p.supplier_sku='LL4836' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','65 x 13mm',1.0,true,false,1,2,'branding' from products p where p.supplier_sku='LL4836' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','60 x 40mm',0.25,true,true,1,3,'branding' from products p where p.supplier_sku='LL4836' and p.supplier ilike 'logoline%';

-- LL4838 Pamper Bamboo Nail File
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL4838' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','50 x 13mm',0.15,true,true,1,1,'branding' from products p where p.supplier_sku='LL4838' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','110 x 20mm',0.4,true,false,1,2,'branding' from products p where p.supplier_sku='LL4838' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','75 x 13mm',0.3,true,false,1,3,'branding' from products p where p.supplier_sku='LL4838' and p.supplier ilike 'logoline%';

-- LL4839 Luggage Strap
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL4839' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Sublimation Per Position','245  x 50mm',1.0,true,false,1,1,'branding' from products p where p.supplier_sku='LL4839' and p.supplier ilike 'logoline%';

-- LL4840 Travel Adaptor
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL4840' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Front & USB Side - 20 x 20mm',0.2,true,true,1,1,'branding' from products p where p.supplier_sku='LL4840' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Base (Opposite to USBs) - 20 x 30mm',0.2,true,true,1,2,'branding' from products p where p.supplier_sku='LL4840' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front & USB Side - 20 x 20mm',0.35,true,false,1,3,'branding' from products p where p.supplier_sku='LL4840' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Base (Opposite to USBs) - 20 x 30mm',0.35,true,false,1,4,'branding' from products p where p.supplier_sku='LL4840' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Digital Sleeve - 240 x 70mm',1.25,true,false,1,5,'branding' from products p where p.supplier_sku='LL4840' and p.supplier ilike 'logoline%';

-- LL4870 Clear Dispenser with Scoop
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL4870' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Front - 55 x 30mm',0.21,true,false,1,1,'branding' from products p where p.supplier_sku='LL4870' and p.supplier ilike 'logoline%';

-- LL4871 Assorted Colour Mini Jelly Beans in Dispenser
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL4871' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Front - 55 x 30mm',0.21,true,false,1,1,'branding' from products p where p.supplier_sku='LL4871' and p.supplier ilike 'logoline%';

-- LL4872 Corporate Colour Mini Jelly Beans in Dispenser
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL4872' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digitial Label Per Position','Front - 55 x 30mm',0.21,true,false,1,1,'branding' from products p where p.supplier_sku='LL4872' and p.supplier ilike 'logoline%';

-- LL488 Beat Pen
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL488' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Barrel - 45 x 7mm, 32 x 8mm',0.12,true,true,1,1,'branding' from products p where p.supplier_sku='LL488' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen Sleeve - 55 x 20mm',0.12,true,true,1,2,'branding' from products p where p.supplier_sku='LL488' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Barrel - 45 x 6mm, 32 x 7mm',0.25,true,false,1,3,'branding' from products p where p.supplier_sku='LL488' and p.supplier ilike 'logoline%';

-- LL4924 Enamel Mug
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL4924' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Side - 50mm x 50mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL4924' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Bottom of Mug - 50mm Dia',0.5,true,true,1,2,'branding' from products p where p.supplier_sku='LL4924' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Colour Fusion Per Position','Side - 50mm x 50mm',0.75,true,false,1,3,'branding' from products p where p.supplier_sku='LL4924' and p.supplier ilike 'logoline%';

-- LL4958 Cork Manicure Set
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL4958' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','45 x 35mm',0.35,true,true,1,1,'branding' from products p where p.supplier_sku='LL4958' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','45 x 35mm',1.1,true,false,1,2,'branding' from products p where p.supplier_sku='LL4958' and p.supplier ilike 'logoline%';

-- LL4959 Rhino Travel Towel
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL4959' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Velcro Strap - 25mm x 12mm',0.25,true,true,1,1,'branding' from products p where p.supplier_sku='LL4959' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Towel - 50 x 50mm',1.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL4959' and p.supplier ilike 'logoline%';

-- LL496 Tornado Tape Measure
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL496' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Front - 36mm Diameter',0.2,true,true,1,1,'branding' from products p where p.supplier_sku='LL496' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front - 38mm Diameter',0.3,true,false,1,2,'branding' from products p where p.supplier_sku='LL496' and p.supplier ilike 'logoline%';

-- LL4961 Vision Sports Towel
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL4961' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Front of Case (Mesh Side) - 110 x 45mm',1.5,true,false,1,1,'branding' from products p where p.supplier_sku='LL4961' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Back of Case - 110 x 70mm',1.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL4961' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Towel - 110 x 70mm',2.5,true,false,1,3,'branding' from products p where p.supplier_sku='LL4961' and p.supplier ilike 'logoline%';

-- LL499 Apple Stress Reliever
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL499' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Side/s - 30mm Diameter, 32mm x 13mm',0.3,true,true,1,1,'branding' from products p where p.supplier_sku='LL499' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Top/Bottom - 22mm Diameter',0.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL499' and p.supplier ilike 'logoline%';

-- LL4998 Discus Bamboo Bottle Opener Coaster
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL4998' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','50mmDia',0.6,true,false,1,1,'branding' from products p where p.supplier_sku='LL4998' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','70mmDia',0.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL4998' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','50mmDia',0.5,true,true,1,3,'branding' from products p where p.supplier_sku='LL4998' and p.supplier ilike 'logoline%';

-- LL5033 Tornado Wheat Fibre Tape Measure
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL5033' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','36mmDia',0.2,true,true,1,1,'branding' from products p where p.supplier_sku='LL5033' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','38mmDia',0.3,true,false,1,2,'branding' from products p where p.supplier_sku='LL5033' and p.supplier ilike 'logoline%';

-- LL5079 Capella A4 Notebook
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL5079' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front of Notebook - 190 x 270mm',2.0,true,false,1,1,'branding' from products p where p.supplier_sku='LL5079' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Back of Notebook - 160 x 230mm, Sleeve - See Line Drawing (Horizontal)',2.0,true,false,1,2,'branding' from products p where p.supplier_sku='LL5079' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Front/Back of Notebook - 140 x 240mm',0.5,true,true,1,3,'branding' from products p where p.supplier_sku='LL5079' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Inside Front Cover - 93.1 x 99.1mm',0.65,true,false,1,4,'branding' from products p where p.supplier_sku='LL5079' and p.supplier ilike 'logoline%';

-- LL5081 Venture Bondi A5 Notebook
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL5081' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Front Lower - 110 x 40mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL5081' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Back Lower - 80 x 40mm',0.5,true,true,1,2,'branding' from products p where p.supplier_sku='LL5081' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front Lower - 110 x 40mm',1.5,true,false,1,3,'branding' from products p where p.supplier_sku='LL5081' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Back Lower - 100 x 33mm',1.5,true,false,1,4,'branding' from products p where p.supplier_sku='LL5081' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sleeve - 45 x 439mm',1.25,true,false,1,5,'branding' from products p where p.supplier_sku='LL5081' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Inside Front Cover - 93.1 x 99.1mm',0.65,true,false,1,6,'branding' from products p where p.supplier_sku='LL5081' and p.supplier ilike 'logoline%';

-- LL5087 Venture A5 Notebook
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL5087' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Front of Notebook - 110 x 180mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL5087' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Back of Notebook - 80 x 180mm',0.5,true,true,1,2,'branding' from products p where p.supplier_sku='LL5087' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front of Notebook - 100 x 150mm',1.25,true,false,1,3,'branding' from products p where p.supplier_sku='LL5087' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Back of Notebook - 100 x 140mm',1.25,true,false,1,4,'branding' from products p where p.supplier_sku='LL5087' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sleeve - 45 x 440mm',1.25,true,false,1,5,'branding' from products p where p.supplier_sku='LL5087' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Inside Front Cover - 93.1 x 99.1mm',0.65,true,false,1,6,'branding' from products p where p.supplier_sku='LL5087' and p.supplier ilike 'logoline%';

-- LL5089 Venture Supreme A5 Notebook
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL5089' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Front of Notebook - 110 x 180mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL5089' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Back of Notebook - 80 x 180mm',0.5,true,true,1,2,'branding' from products p where p.supplier_sku='LL5089' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front of Notebook - 100 x 150mm',1.25,true,false,1,3,'branding' from products p where p.supplier_sku='LL5089' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Back of Notebook - 100 x 140mm',1.25,true,false,1,4,'branding' from products p where p.supplier_sku='LL5089' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sleeve - 45 x 440mm',1.25,true,false,1,5,'branding' from products p where p.supplier_sku='LL5089' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Inside Front Cover - 93.1 x 99.1mm',0.65,true,false,1,6,'branding' from products p where p.supplier_sku='LL5089' and p.supplier ilike 'logoline%';

-- LL5091 Venture A5 Natura Notebook
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL5091' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Front of Notebook - 110 x 180mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL5091' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Back of Notebook - 80 x 180mm',0.5,true,true,1,2,'branding' from products p where p.supplier_sku='LL5091' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front of Notebook - 100 x 150mm',1.25,true,false,1,3,'branding' from products p where p.supplier_sku='LL5091' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Back of Notebook - 100 x 150mm',1.25,true,false,1,4,'branding' from products p where p.supplier_sku='LL5091' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sleeve - 45 x 439mm',1.25,true,false,1,5,'branding' from products p where p.supplier_sku='LL5091' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Inside Front Cover - 93.1 x 99.1mm',0.65,true,false,1,6,'branding' from products p where p.supplier_sku='LL5091' and p.supplier ilike 'logoline%';

-- LL5092 Venture A5 Natura Notebook / Matador Pen
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL5092' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Notebook - 110 x 180mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL5092' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Notebook - 100 x 150mm',1.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL5092' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Pen - 90 x 6mm',0.25,true,false,1,3,'branding' from products p where p.supplier_sku='LL5092' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sleeve - 45 x 439mm',1.25,true,false,1,4,'branding' from products p where p.supplier_sku='LL5092' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen - 55 x 7mm',0.12,true,true,1,5,'branding' from products p where p.supplier_sku='LL5092' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Roll Print Per Position','Barrel - 35 x 25mm',0.12,true,false,1,6,'branding' from products p where p.supplier_sku='LL5092' and p.supplier ilike 'logoline%';

-- LL5094 Venture Supreme Notebook / Napier Pen
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL5094' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Notebook - 110 x 80mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL5094' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Notebook - 100 x 150mm',1.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL5094' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sleeve - 45 x 439mm',1.25,true,false,1,3,'branding' from products p where p.supplier_sku='LL5094' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Barrel - 50 x 7mm',0.12,true,true,1,4,'branding' from products p where p.supplier_sku='LL5094' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Pen - 50 x 6mm',0.15,true,false,1,5,'branding' from products p where p.supplier_sku='LL5094' and p.supplier ilike 'logoline%';

-- LL5095 Astro Hard Cover Recycled Leather Notebook
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL5095' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Front/Back of Notebook - 110 x 180mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL5095' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front/Back of Notebook - 100 x 150mm',1.25,true,false,1,2,'branding' from products p where p.supplier_sku='LL5095' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sleeve - 45 x 439mm',1.25,true,false,1,3,'branding' from products p where p.supplier_sku='LL5095' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Inside Front Cover - 93.1 x 99.1mm',0.65,true,false,1,4,'branding' from products p where p.supplier_sku='LL5095' and p.supplier ilike 'logoline%';

-- LL5096 Venture Snowy A5 Notebook
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL5096' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Front of Notebook - 110 x 180mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL5096' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Back of Notebook - 80 x 120mm',0.5,true,true,1,2,'branding' from products p where p.supplier_sku='LL5096' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front of Notebook - 100 x 150mm',1.25,true,false,1,3,'branding' from products p where p.supplier_sku='LL5096' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Back of Notebook - 100 x 120mm',1.25,true,false,1,4,'branding' from products p where p.supplier_sku='LL5096' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sleeve - 45 x 439mm',1.25,true,false,1,5,'branding' from products p where p.supplier_sku='LL5096' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Inside Front Cover - 93.1 x 99.1mm',0.65,true,false,1,6,'branding' from products p where p.supplier_sku='LL5096' and p.supplier ilike 'logoline%';

-- LL5098 Venture Sugarcane A5 Notebook
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL5098' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Front of Notebook - 110 x 180mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL5098' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Back of Notebook - 80 x 180mm',0.5,true,true,1,2,'branding' from products p where p.supplier_sku='LL5098' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front of Notebook - 100 x 150mm',1.25,true,false,1,3,'branding' from products p where p.supplier_sku='LL5098' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Back of Notebook - 100 x 120mm',1.25,true,false,1,4,'branding' from products p where p.supplier_sku='LL5098' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sleeve - 45 x 439mm',1.25,true,false,1,5,'branding' from products p where p.supplier_sku='LL5098' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Inside Front Cover - 93.1 x 99.1mm',0.65,true,false,1,6,'branding' from products p where p.supplier_sku='LL5098' and p.supplier ilike 'logoline%';

-- LL5099 Illusion Pocket Notebook
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL5099' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Front of Notebook - 65 x 110mm',0.3,true,true,1,1,'branding' from products p where p.supplier_sku='LL5099' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Back of Notebook - 60 x 60mm',0.3,true,true,1,2,'branding' from products p where p.supplier_sku='LL5099' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front of Notebook - 80 x 120mm',0.8,true,false,1,3,'branding' from products p where p.supplier_sku='LL5099' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Back of Notebook - 60 x 80mm',0.8,true,false,1,4,'branding' from products p where p.supplier_sku='LL5099' and p.supplier ilike 'logoline%';

-- LL5102 Venture RPET A5 Notebook
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL5102' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Front - 80 x 70mm',1.7,true,false,1,1,'branding' from products p where p.supplier_sku='LL5102' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Back - 80 x 70mm',1.7,true,false,1,2,'branding' from products p where p.supplier_sku='LL5102' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Label Per Position','Inside Front Cover - 93.1 x 99.1mm',0.65,true,false,1,3,'branding' from products p where p.supplier_sku='LL5102' and p.supplier ilike 'logoline%';

-- LL5104 Pacifica Notebook & Serenity Pen Set
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL5104' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Notebook: Front/Back - 60 x 160mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL5104' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Notebook Front - 60 x 150mm',1.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL5104' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Notebook Back - 60 x 140mm',1.5,true,false,1,3,'branding' from products p where p.supplier_sku='LL5104' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Pen - 50 x 6mm',0.25,true,false,1,4,'branding' from products p where p.supplier_sku='LL5104' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Notebook - Front/Back - 60 x 60mm',1.0,true,false,1,5,'branding' from products p where p.supplier_sku='LL5104' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Pen - 50 x 6mm',0.5,true,false,1,6,'branding' from products p where p.supplier_sku='LL5104' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen - 50 x 7mm',0.12,true,true,1,7,'branding' from products p where p.supplier_sku='LL5104' and p.supplier ilike 'logoline%';

-- LL511 Chrystalis Pen
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL511' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Barrel - 45 x 9mm',0.12,true,true,1,1,'branding' from products p where p.supplier_sku='LL511' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen Sleeve - 55 x 20mm',0.12,true,true,1,2,'branding' from products p where p.supplier_sku='LL511' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Barrel - 45 x 8mm',0.25,true,false,1,3,'branding' from products p where p.supplier_sku='LL511' and p.supplier ilike 'logoline%';

-- LL518 Sprint Folding Shopping Bag
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL518' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Bag - 180 x 200mm',0.4,true,true,1,1,'branding' from products p where p.supplier_sku='LL518' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Pouch - 50 x 50mm (Triangle)',0.4,true,true,1,2,'branding' from products p where p.supplier_sku='LL518' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Front/Back - 180 x 250mm',2.0,true,false,1,3,'branding' from products p where p.supplier_sku='LL518' and p.supplier ilike 'logoline%';

-- LL521 Tundra Cooler / Shopping Bag
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL521' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Lid - 130 x 130mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL521' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Front - 130 x 90mm',0.5,true,true,1,2,'branding' from products p where p.supplier_sku='LL521' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Front - 130 x 130mm',1.5,true,false,1,3,'branding' from products p where p.supplier_sku='LL521' and p.supplier ilike 'logoline%';

-- LL524 Byron Mesh Produce Bag
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL524' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Patch - 100 x 100mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL524' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Patch - 100 x 100mm',1.2,true,false,1,2,'branding' from products p where p.supplier_sku='LL524' and p.supplier ilike 'logoline%';

-- LL528 Scoot Calico / Mesh Tote Bag
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL528' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','290 x 110mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL528' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','290 x 110mm',2.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL528' and p.supplier ilike 'logoline%';

-- LL531 Get Crafty Folding Calico Bag and Crayons
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL531' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Bag - 290 x 320 mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL531' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Pouch - 100 x 100mm',0.5,true,true,1,2,'branding' from products p where p.supplier_sku='LL531' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Crayons - 50 x 50mm',0.19,true,false,1,3,'branding' from products p where p.supplier_sku='LL531' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Crayons - 50 x 50mm',0.7,true,false,1,4,'branding' from products p where p.supplier_sku='LL531' and p.supplier ilike 'logoline%';

-- LL545 Malibu Handy Utility  Pouch
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL545' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Front of Pouch - 80 x 80mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL545' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Back of Pouch - 180 x 90mm',0.5,true,true,1,2,'branding' from products p where p.supplier_sku='LL545' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Front of Pouch - 80 x 80mm',1.5,true,false,1,3,'branding' from products p where p.supplier_sku='LL545' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Back of Pouch - 180 x 90mm',1.5,true,false,1,4,'branding' from products p where p.supplier_sku='LL545' and p.supplier ilike 'logoline%';

-- LL547 Express Paper Bag Small
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL547' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','100 x 120mm',0.4,true,true,1,1,'branding' from products p where p.supplier_sku='LL547' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','110 x 60mm,  71mm Dia',0.4,true,false,1,2,'branding' from products p where p.supplier_sku='LL547' and p.supplier ilike 'logoline%';

-- LL548 Express Paper Bag Medium
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL548' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','150 x 150mm',0.4,true,true,1,1,'branding' from products p where p.supplier_sku='LL548' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','170 x 60mm,  71mm Diameter',0.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL548' and p.supplier ilike 'logoline%';

-- LL549 Express Paper Bag Large
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL549' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','200 x 200mm',0.4,true,true,1,1,'branding' from products p where p.supplier_sku='LL549' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','120 x 120mm',0.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL549' and p.supplier ilike 'logoline%';

-- LL5520 Colouring Short Handle Cotton Bag & Crayons
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL5520' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Crayons - 50 x 50mm',0.19,true,false,1,1,'branding' from products p where p.supplier_sku='LL5520' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Crayons - 50 x 50mm',0.7,true,false,1,2,'branding' from products p where p.supplier_sku='LL5520' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Bag - 250 x 320mm',0.5,true,true,1,3,'branding' from products p where p.supplier_sku='LL5520' and p.supplier ilike 'logoline%';

-- LL5521 Colouring Long Handle Cotton Bag & Crayons
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL5521' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Crayons - 50 x 50mm',0.19,true,false,1,1,'branding' from products p where p.supplier_sku='LL5521' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Bag - 250 x 320mm',0.5,true,true,1,2,'branding' from products p where p.supplier_sku='LL5521' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Crayons - 50 x 50mm',0.7,true,false,1,3,'branding' from products p where p.supplier_sku='LL5521' and p.supplier ilike 'logoline%';

-- LL5522 Colouring Short Handle Calico Bag & Crayons
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL5522' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Bag - 290 x 320mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL5522' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Crayons - 50 x 50mm',0.19,true,false,1,2,'branding' from products p where p.supplier_sku='LL5522' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Crayons - 50 x 50mm',0.7,true,false,1,3,'branding' from products p where p.supplier_sku='LL5522' and p.supplier ilike 'logoline%';

-- LL5523 Colouring Short Handle Cotton Bag & Pencils
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL5523' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Bag - 290 x 320mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL5523' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Pencils - 41 x 41mm',0.17,true,false,1,2,'branding' from products p where p.supplier_sku='LL5523' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pencils - 35 x 35mm',0.2,true,true,1,3,'branding' from products p where p.supplier_sku='LL5523' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Pencils - 35 x 35mm',0.4,true,false,1,4,'branding' from products p where p.supplier_sku='LL5523' and p.supplier ilike 'logoline%';

-- LL5524 Colouring Long Handle Cotton Bag & Pencils
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL5524' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Bag - 250 x 320mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL5524' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Pencils - 41 x 41mm',0.17,true,false,1,2,'branding' from products p where p.supplier_sku='LL5524' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Pencils - 35 x 35mm',0.4,true,false,1,3,'branding' from products p where p.supplier_sku='LL5524' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pencils - 35 x 35mm',0.2,true,true,1,4,'branding' from products p where p.supplier_sku='LL5524' and p.supplier ilike 'logoline%';

-- LL5525 Kids Fun Pack
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL5525' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Crayons - 50 x 50mm',0.19,true,false,1,1,'branding' from products p where p.supplier_sku='LL5525' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Crayons - 50 x 50mm',0.7,true,false,1,2,'branding' from products p where p.supplier_sku='LL5525' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Pouch - 120 x 60mm',0.5,true,true,1,3,'branding' from products p where p.supplier_sku='LL5525' and p.supplier ilike 'logoline%';

-- LL562 Express Paper Bag Extra Large
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL562' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','300 x 200mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL562' and p.supplier ilike 'logoline%';

-- LL600 Round Stress Balls
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL600' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Top/Bottom - 30mm Diameter',0.3,true,true,1,1,'branding' from products p where p.supplier_sku='LL600' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Top/Bottom - 25mm Diameter',0.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL600' and p.supplier ilike 'logoline%';

-- LL6002 Back To School Pack
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL6002' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Notebook - 100 x 150mm',1.5,true,false,1,1,'branding' from products p where p.supplier_sku='LL6002' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Pen - 50 x 6mm',0.25,true,false,1,2,'branding' from products p where p.supplier_sku='LL6002' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Ruler - 145 x 13mm',0.4,true,false,1,3,'branding' from products p where p.supplier_sku='LL6002' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen - 50 x 6mm',0.12,true,true,1,4,'branding' from products p where p.supplier_sku='LL6002' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pencil Set - 50 x 50mm',0.2,true,true,1,5,'branding' from products p where p.supplier_sku='LL6002' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','65 x 95mm, 41 x 41mm',0.23,true,false,1,6,'branding' from products p where p.supplier_sku='LL6002' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Pouch - Front - 80 x 80mm',0.5,true,true,1,7,'branding' from products p where p.supplier_sku='LL6002' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Notebook - 110 x 180mm',0.5,true,true,1,8,'branding' from products p where p.supplier_sku='LL6002' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Pen - Roll Print - 45 x 30mm',0.12,true,true,1,9,'branding' from products p where p.supplier_sku='LL6002' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Ruler - 145 x 13mm',0.15,true,true,1,10,'branding' from products p where p.supplier_sku='LL6002' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Pouch - Front - 80 x 80mm',1.5,true,false,1,11,'branding' from products p where p.supplier_sku='LL6002' and p.supplier ilike 'logoline%';

-- LL601 White Microfibre Lens Cloth
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL601' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print (Pouch Only) Per Colour/Position','Front - 60 x 30mm',0.25,true,true,1,1,'branding' from products p where p.supplier_sku='LL601' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print (Pouch Only) Per Colour/Position','Back - 60 x 50mm',0.25,true,true,1,2,'branding' from products p where p.supplier_sku='LL601' and p.supplier ilike 'logoline%';

-- LL6010 Conference Pack
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL6010' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Notebook - 100 x 150mm',1.5,true,false,1,1,'branding' from products p where p.supplier_sku='LL6010' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Pen - 50 x 7mm',0.25,true,false,1,2,'branding' from products p where p.supplier_sku='LL6010' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Drink Bottle - 90 x 150mm',1.8,true,false,1,3,'branding' from products p where p.supplier_sku='LL6010' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Front of Pouch - 80 x 80mm',1.5,true,false,1,4,'branding' from products p where p.supplier_sku='LL6010' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Notebook - 110 x 180mm',0.5,true,true,1,5,'branding' from products p where p.supplier_sku='LL6010' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Drink Bottle - 90 x 150mm',0.5,true,true,1,6,'branding' from products p where p.supplier_sku='LL6010' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Pouch - Front of Pouch - 80 x 80mm',0.5,true,true,1,7,'branding' from products p where p.supplier_sku='LL6010' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen - Barrel - 50 x 7mm',0.12,true,true,1,8,'branding' from products p where p.supplier_sku='LL6010' and p.supplier ilike 'logoline%';

-- LL6013 Wellness Pack
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL6013' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Gel Bead Pack - 50 x 50mm',0.3,true,true,1,1,'branding' from products p where p.supplier_sku='LL6013' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Header Card - 165 x 100mm',0.2,true,false,1,2,'branding' from products p where p.supplier_sku='LL6013' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Lip Balm - 42 x 8mm',0.2,true,false,1,3,'branding' from products p where p.supplier_sku='LL6013' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Lip Balm - 63 x 38mm',0.2,true,false,1,4,'branding' from products p where p.supplier_sku='LL6013' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Roll Print Per Position','Lip Balm - 54 x 38mm',0.2,true,false,1,5,'branding' from products p where p.supplier_sku='LL6013' and p.supplier ilike 'logoline%';

-- LL6014 Encore Office Pack
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL6014' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Sticky Notes - 45mm Dia',0.2,true,true,1,1,'branding' from products p where p.supplier_sku='LL6014' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Notebook - 50 x 50mm',0.3,true,true,1,2,'branding' from products p where p.supplier_sku='LL6014' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen - 50 x 6mm',0.12,true,true,1,3,'branding' from products p where p.supplier_sku='LL6014' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sticky Notes - 45mm Dia',0.4,true,false,1,4,'branding' from products p where p.supplier_sku='LL6014' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Pen - 50 x 5mm',0.25,true,false,1,5,'branding' from products p where p.supplier_sku='LL6014' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Header Card - 165 x 100mm',0.2,true,false,1,6,'branding' from products p where p.supplier_sku='LL6014' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Sticky Notes - 45mm Dia',0.17,true,false,1,7,'branding' from products p where p.supplier_sku='LL6014' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Notebook - 50 x 50mm',0.19,true,false,1,8,'branding' from products p where p.supplier_sku='LL6014' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Jelly Beans - 50 x 50mm',0.19,true,false,1,9,'branding' from products p where p.supplier_sku='LL6014' and p.supplier ilike 'logoline%';

-- LL6015 Elevate School Pack
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL6015' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Highlighter - 38 x 22mm',0.2,true,true,1,1,'branding' from products p where p.supplier_sku='LL6015' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Highlighter - 53 x 36mm',0.4,true,false,1,2,'branding' from products p where p.supplier_sku='LL6015' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Header Card - 165 x 100mm',0.2,true,false,1,3,'branding' from products p where p.supplier_sku='LL6015' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Stationery Set Wrap Label - 99.1 x 93.1mm',0.3,true,false,1,4,'branding' from products p where p.supplier_sku='LL6015' and p.supplier ilike 'logoline%';

-- LL6016 Intro Pack
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL6016' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen - 50 x 7mm',0.12,true,true,1,1,'branding' from products p where p.supplier_sku='LL6016' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Lip Balm - 42 x 8mm',0.2,true,false,1,2,'branding' from products p where p.supplier_sku='LL6016' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Jelly Beans - 50 x 50mm',0.19,true,false,1,3,'branding' from products p where p.supplier_sku='LL6016' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Pencil  Case - 90mm Dia',0.28,true,false,1,4,'branding' from products p where p.supplier_sku='LL6016' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Lip Balm - 63.1 x 38.5mm',0.2,true,false,1,5,'branding' from products p where p.supplier_sku='LL6016' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Roll Print Per Position','Lip Balm - 54 x 38mm',0.2,true,false,1,6,'branding' from products p where p.supplier_sku='LL6016' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Dye Sublimation Per Position','Lens Cloth - 150 x 150mm',0.7,true,false,1,7,'branding' from products p where p.supplier_sku='LL6016' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Pencil Case - 180 x 130mm',0.5,true,true,1,8,'branding' from products p where p.supplier_sku='LL6016' and p.supplier ilike 'logoline%';

-- LL6018 Merit School Pack
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL6018' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Notebook - 100 x 178mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL6018' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Pouch - 180 x 130mm',0.5,true,true,1,2,'branding' from products p where p.supplier_sku='LL6018' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Pouch - 71mm Dia',0.59,true,false,1,3,'branding' from products p where p.supplier_sku='LL6018' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Jelly Beans - 50 x 50mm',0.19,true,false,1,4,'branding' from products p where p.supplier_sku='LL6018' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Notebook - 71mmDia',0.3,true,false,1,5,'branding' from products p where p.supplier_sku='LL6018' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen - 50 x 6mm',0.12,true,true,1,6,'branding' from products p where p.supplier_sku='LL6018' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Hi Bounce Ball - 30mmDiameter',0.4,true,true,1,7,'branding' from products p where p.supplier_sku='LL6018' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Pen - 50 x 5mm',0.25,true,false,1,8,'branding' from products p where p.supplier_sku='LL6018' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Hi Bounce Ball - 25mmDiameter',0.5,true,false,1,9,'branding' from products p where p.supplier_sku='LL6018' and p.supplier ilike 'logoline%';

-- LL603 Microfibre Lens Cloth with Screen Cleaner
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL603' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Screen Cleaner - 30 x 55mm',0.17,true,false,1,1,'branding' from products p where p.supplier_sku='LL603' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Pouch - 45mm Diameter',0.17,true,false,1,2,'branding' from products p where p.supplier_sku='LL603' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Dye Sublimation Per Position','Lens Cloth - 150 x 150mm',0.7,true,false,1,3,'branding' from products p where p.supplier_sku='LL603' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Pouch - 55 x 55mm',0.3,true,true,1,4,'branding' from products p where p.supplier_sku='LL603' and p.supplier ilike 'logoline%';

-- LL6032 Smarty Pants Pack
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL6032' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Pencil Case - 230 x 140mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL6032' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Notebook - Front or Back - 100 x 178mm',0.5,true,true,1,2,'branding' from products p where p.supplier_sku='LL6032' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Label Per Position','Stationery Set - 99.1 x 93.1mm',0.3,true,false,1,3,'branding' from products p where p.supplier_sku='LL6032' and p.supplier ilike 'logoline%';

-- LL6033 The Little Learners Pack
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL6033' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Pencil Case: Below Zipper - 120 x 20mm',0.4,true,true,1,1,'branding' from products p where p.supplier_sku='LL6033' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Pencil Case: Below Zipper - 120 x 20mm',1.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL6033' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Highlighter - 38 x 22mm',0.2,true,true,1,3,'branding' from products p where p.supplier_sku='LL6033' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Highlighter - 53 x 36mm',0.4,true,false,1,4,'branding' from products p where p.supplier_sku='LL6033' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Label Per Position','Stationery Set: Wrap Label - 99.1 x 93.1mm',0.3,true,false,1,5,'branding' from products p where p.supplier_sku='LL6033' and p.supplier ilike 'logoline%';

-- LL610 Emoji Stress Balls
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL610' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','30mm Diameter (1 side only)',0.3,true,true,1,1,'branding' from products p where p.supplier_sku='LL610' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','25mm Diameter',0.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL610' and p.supplier ilike 'logoline%';

-- LL6140 Soda Grande Vacuum Bottle
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL6140' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Roll Print Per Position','Body Wrap - 225 x 120mm',0.5,true,false,1,1,'branding' from products p where p.supplier_sku='LL6140' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Drink Bottle - 35 x 105mm, Box Sleeve - Full coverage',1.8,true,false,1,2,'branding' from products p where p.supplier_sku='LL6140' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Drink Bottle - 35 x 90mm',1.0,true,false,1,3,'branding' from products p where p.supplier_sku='LL6140' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Rotary Digital Print Per Position','Full Wrap - 251.33 x 140mm',3.0,true,false,1,4,'branding' from products p where p.supplier_sku='LL6140' and p.supplier ilike 'logoline%';

-- LL6150 Forte Earbud Set
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL6150' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','EVA Case - 50mm Dia',0.25,true,true,1,1,'branding' from products p where p.supplier_sku='LL6150' and p.supplier ilike 'logoline%';

-- LL6158 Tempest TWS Earbuds
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL6158' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Case - 35 x 15mm',0.3,true,true,1,1,'branding' from products p where p.supplier_sku='LL6158' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Case - 35 x 15mm',0.4,true,false,1,2,'branding' from products p where p.supplier_sku='LL6158' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sleeve - 202 x 76mm',1.5,true,false,1,3,'branding' from products p where p.supplier_sku='LL6158' and p.supplier ilike 'logoline%';

-- LL6161 Twista Earbuds
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL6161' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Front of Case - 25mm x 15mm',0.3,true,true,1,1,'branding' from products p where p.supplier_sku='LL6161' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Back of Case - 25mm x 10mm',0.3,true,true,1,2,'branding' from products p where p.supplier_sku='LL6161' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front of Case - 25mm x 15mm',0.5,true,false,1,3,'branding' from products p where p.supplier_sku='LL6161' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Back of Case - 25mm x 10mm',0.5,true,false,1,4,'branding' from products p where p.supplier_sku='LL6161' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Box Sleeve - 207mm x 66mm',1.0,true,false,1,5,'branding' from products p where p.supplier_sku='LL6161' and p.supplier ilike 'logoline%';

-- LL6162 Loop Earbuds
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL6162' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Case - 40 x 25mm',0.25,true,true,1,1,'branding' from products p where p.supplier_sku='LL6162' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Case - 50 x 35mm',0.4,true,false,1,2,'branding' from products p where p.supplier_sku='LL6162' and p.supplier ilike 'logoline%';

-- LL617 Water Drop Stress Reliever
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL617' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Front (between Hands) - 19 x 12mm',0.3,true,true,1,1,'branding' from products p where p.supplier_sku='LL617' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Back - 30mm Dia',0.3,true,true,1,2,'branding' from products p where p.supplier_sku='LL617' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Back - 22mm Dia',0.9,true,false,1,3,'branding' from products p where p.supplier_sku='LL617' and p.supplier ilike 'logoline%';

-- LL6185 Zest Lunch Box / Food Container
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL6185' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','110 x 120mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL6185' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','150 x 145mm',1.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL6185' and p.supplier ilike 'logoline%';

-- LL6201 Zippy Yo-Yo
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL6201' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Side/s - 38mm Diameter',0.25,true,true,1,1,'branding' from products p where p.supplier_sku='LL6201' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Side/s - 38mm Diameter',0.3,true,false,1,2,'branding' from products p where p.supplier_sku='LL6201' and p.supplier ilike 'logoline%';

-- LL625 Constellation Pen
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL625' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Barrel - 50 x 6mm',0.12,true,true,1,1,'branding' from products p where p.supplier_sku='LL625' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Barrel - 32 x 8mm',0.12,true,true,1,2,'branding' from products p where p.supplier_sku='LL625' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen Sleeve - 55 x 20mm',0.12,true,true,1,3,'branding' from products p where p.supplier_sku='LL625' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Barrel - 50 x 6mm',0.1,true,false,1,4,'branding' from products p where p.supplier_sku='LL625' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Barrel - 32 x 8mm',0.1,true,false,1,5,'branding' from products p where p.supplier_sku='LL625' and p.supplier ilike 'logoline%';

-- LL630 2 Colour World Globe Stress Reliever
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL630' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pacific Ocean (above seam line) - 27mm Diameter',0.3,true,true,1,1,'branding' from products p where p.supplier_sku='LL630' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Pacific Ocean (above seam line) - 19mm Diameter',0.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL630' and p.supplier ilike 'logoline%';

-- LL6362 Stax Eco Lunch Box with Phone Holder Lid
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL6362' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Lid - 100 x 30mm',0.8,true,false,1,1,'branding' from products p where p.supplier_sku='LL6362' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sleeve - 412 x 182mm',2.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL6362' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Lid - 50 x 30mm',0.8,true,false,1,3,'branding' from products p where p.supplier_sku='LL6362' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Lid - 70 x 30mm',0.5,true,true,1,4,'branding' from products p where p.supplier_sku='LL6362' and p.supplier ilike 'logoline%';

-- LL6366 Stax Eco Lunch Box
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL6366' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','140 x 70mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL6366' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Lunch Box - 140 x 70mm',2.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL6366' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sleeve - 412 x 182mm',2.5,true,false,1,3,'branding' from products p where p.supplier_sku='LL6366' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','50 x 40mm',1.0,true,false,1,4,'branding' from products p where p.supplier_sku='LL6366' and p.supplier ilike 'logoline%';

-- LL6369 Bermuda Lunch Box
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL6369' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','50 x 40mm',0.4,true,true,1,1,'branding' from products p where p.supplier_sku='LL6369' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','50 x 40mm',1.0,true,false,1,2,'branding' from products p where p.supplier_sku='LL6369' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Small - 50 x 40mm',0.8,true,false,1,3,'branding' from products p where p.supplier_sku='LL6369' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Large - 140 x 70mm',1.5,true,false,1,4,'branding' from products p where p.supplier_sku='LL6369' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Digital Sleeve - 397 x 185mm',2.5,true,false,1,5,'branding' from products p where p.supplier_sku='LL6369' and p.supplier ilike 'logoline%';

-- LL6370 Hercules Kitchen Scales
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL6370' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','100 x 100mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL6370' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','80  x 80mm',0.8,true,false,1,2,'branding' from products p where p.supplier_sku='LL6370' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','50 x 50mm',1.0,true,false,1,3,'branding' from products p where p.supplier_sku='LL6370' and p.supplier ilike 'logoline%';

-- LL6376 Weather Station
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL6376' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','50 x 15mm',0.6,true,false,1,1,'branding' from products p where p.supplier_sku='LL6376' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','50 x 15mm',0.3,true,true,1,2,'branding' from products p where p.supplier_sku='LL6376' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Box Sleeve - 268 x 130mm',1.5,true,false,1,3,'branding' from products p where p.supplier_sku='LL6376' and p.supplier ilike 'logoline%';

-- LL6378 Sturdee Dual-Compartment Lunch Box
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL6378' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Lid - 150 x 90mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL6378' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Side/s - 120 x 40mm',0.5,true,true,1,2,'branding' from products p where p.supplier_sku='LL6378' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Lid - 170 x 100mm',1.0,true,false,1,3,'branding' from products p where p.supplier_sku='LL6378' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Lid - 170 x 110mm',1.5,true,false,1,4,'branding' from products p where p.supplier_sku='LL6378' and p.supplier ilike 'logoline%';

-- LL645 Football Stress Reliever
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL645' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Panel/s - 50 x 20mm',0.3,true,true,1,1,'branding' from products p where p.supplier_sku='LL645' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Panel/s - 50 x 20mm',0.7,true,false,1,2,'branding' from products p where p.supplier_sku='LL645' and p.supplier ilike 'logoline%';

-- LL6483 Avenue Wheat Fibre Cup and Spoon
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL6483' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','40mmDia,  40 x 40mm',0.4,true,true,1,1,'branding' from products p where p.supplier_sku='LL6483' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','40mmDia,  40 x 40mm',1.8,true,false,1,2,'branding' from products p where p.supplier_sku='LL6483' and p.supplier ilike 'logoline%';

-- LL6495 Spray On Screen Cleaner
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL6495' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','14 x 55mm',0.3,true,true,1,1,'branding' from products p where p.supplier_sku='LL6495' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','14 x 55mm',0.4,true,false,1,2,'branding' from products p where p.supplier_sku='LL6495' and p.supplier ilike 'logoline%';

-- LL6514 Barossa Vacuum Bottle
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL6514' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Roll Print - 200 x 100mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL6514' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Drink Bottle - 30 x 85mm, Sleeve - 324 x 263',1.8,true,false,1,2,'branding' from products p where p.supplier_sku='LL6514' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','32 x 90mm',1.0,true,false,1,3,'branding' from products p where p.supplier_sku='LL6514' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Rotary Digital Print Per Position','Full Wrap - 248.19 x 110mm',3.0,true,false,1,4,'branding' from products p where p.supplier_sku='LL6514' and p.supplier ilike 'logoline%';

-- LL653 Bubbles in Bottles
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL653' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Label - 138 x 50mm',0.4,true,false,1,1,'branding' from products p where p.supplier_sku='LL653' and p.supplier ilike 'logoline%';

-- LL6654 Midas Sticky Notes / Notepad
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL6654' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Front Cover - 60 x 60mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL6654' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Back Cover - 60 x 40mm',0.5,true,true,1,2,'branding' from products p where p.supplier_sku='LL6654' and p.supplier ilike 'logoline%';

-- LL6673 Small EVA Zipper Case
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL6673' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Front/Back - 60 x 35mm',0.45,true,true,1,1,'branding' from products p where p.supplier_sku='LL6673' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front/Back - 60 x 35mm',1.25,true,false,1,2,'branding' from products p where p.supplier_sku='LL6673' and p.supplier ilike 'logoline%';

-- LL6674 Medium EVA Zipper Case
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL6674' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Front/Back - 100 x 50mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL6674' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front/Back - 60 x 50mm',1.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL6674' and p.supplier ilike 'logoline%';

-- LL6708 Wedge Bottle Opener
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL6708' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','35 x 30mm',0.5,true,false,1,1,'branding' from products p where p.supplier_sku='LL6708' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','35 x 30mm',0.3,true,false,1,2,'branding' from products p where p.supplier_sku='LL6708' and p.supplier ilike 'logoline%';

-- LL6712 Mosaic Bamboo Slate Cheese Board
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL6712' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Slate - 70 x 40mm',2.0,true,false,1,1,'branding' from products p where p.supplier_sku='LL6712' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Per Position','Sleeve - 550 x 100mm',3.0,true,false,1,2,'branding' from products p where p.supplier_sku='LL6712' and p.supplier ilike 'logoline%';

-- LL6715 Gala Bamboo Slate Cheese Board
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL6715' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Slate - 70 x 40mm',2.0,true,false,1,1,'branding' from products p where p.supplier_sku='LL6715' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Per Position','Sleeve - 717 x 100mm',2.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL6715' and p.supplier ilike 'logoline%';

-- LL6716 Solero Bamboo Serving Board
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL6716' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Handle - 60 x 20mm',2.0,true,false,1,1,'branding' from products p where p.supplier_sku='LL6716' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Board - 70 x 40mm',2.0,true,false,1,2,'branding' from products p where p.supplier_sku='LL6716' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Per Position','Sleeve - 100 x 426mm',2.0,true,false,1,3,'branding' from products p where p.supplier_sku='LL6716' and p.supplier ilike 'logoline%';

-- LL6760 Soltero Lunch Box
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL6760' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Lid - 140 x 70mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL6760' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Lid - 140 x 70mm',1.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL6760' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Digital Sleeve - 380mm x 193mm',2.5,true,false,1,3,'branding' from products p where p.supplier_sku='LL6760' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Lid - 60 x 40mm',1.0,true,false,1,4,'branding' from products p where p.supplier_sku='LL6760' and p.supplier ilike 'logoline%';

-- LL6801 Falcon Pen
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL6801' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Barrel - 50 x 7mm',0.12,true,true,1,1,'branding' from products p where p.supplier_sku='LL6801' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Clip - 35 x 7.5mm',0.12,true,true,1,2,'branding' from products p where p.supplier_sku='LL6801' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen Sleeve - 55 x 20mm',0.12,true,true,1,3,'branding' from products p where p.supplier_sku='LL6801' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Barrel - 50 x 6.5mm',0.25,true,false,1,4,'branding' from products p where p.supplier_sku='LL6801' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Clip - 35 x 7.5mm',0.25,true,false,1,5,'branding' from products p where p.supplier_sku='LL6801' and p.supplier ilike 'logoline%';

-- LL683 Reflections Round Folding Mirror
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL683' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Top of Lid - 50mm Diameter',0.25,true,true,1,1,'branding' from products p where p.supplier_sku='LL683' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Top of Lid - 50mm Diameter',0.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL683' and p.supplier ilike 'logoline%';

-- LL6831 Horse Stress Reliever
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL6831' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Side/s - 25 x 12mm',0.3,true,true,1,1,'branding' from products p where p.supplier_sku='LL6831' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Top (Horseback) - 18mm Diameter',0.3,true,true,1,2,'branding' from products p where p.supplier_sku='LL6831' and p.supplier ilike 'logoline%';

-- LL6843 Mansfield Utility Case
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL6843' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Lid - 120 x 25mm',0.4,true,true,1,1,'branding' from products p where p.supplier_sku='LL6843' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Lid - 100 x 25mm',1.0,true,false,1,2,'branding' from products p where p.supplier_sku='LL6843' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Lid - 120 x 25mm',0.7,true,false,1,3,'branding' from products p where p.supplier_sku='LL6843' and p.supplier ilike 'logoline%';

-- LL6905 Bali Bottle
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL6905' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Drink Bottle - 30 x 150mm',1.8,true,false,1,1,'branding' from products p where p.supplier_sku='LL6905' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Rotary Digital Print Per Position','Full Wrap - 221.48 x 160mm',3.0,true,false,1,2,'branding' from products p where p.supplier_sku='LL6905' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','170 x 140mm',0.5,true,true,1,3,'branding' from products p where p.supplier_sku='LL6905' and p.supplier ilike 'logoline%';

-- LL6918 Lager Bottle Opener Phone Stand
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL6918' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','20mmDia',0.25,true,false,1,1,'branding' from products p where p.supplier_sku='LL6918' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','18mmDia',0.2,true,false,1,2,'branding' from products p where p.supplier_sku='LL6918' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','18mmDia',0.2,true,true,1,3,'branding' from products p where p.supplier_sku='LL6918' and p.supplier ilike 'logoline%';

-- LL6944 Faith Steel Tumbler
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL6944' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Top Portion of Tumbler - 40 x 40mm',1.0,true,false,1,1,'branding' from products p where p.supplier_sku='LL6944' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Bottom Portion of Tumbler - 40 x 30mm',1.0,true,false,1,2,'branding' from products p where p.supplier_sku='LL6944' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Top Portion of Tumbler - 40 x 40mm',1.8,true,false,1,3,'branding' from products p where p.supplier_sku='LL6944' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Box Sleeve - 435 x 217mm',2.5,true,false,1,4,'branding' from products p where p.supplier_sku='LL6944' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Rotary Digital Print Per Position','Top Portion of Tumbler - 280.3 x 40mm',3.0,true,false,1,5,'branding' from products p where p.supplier_sku='LL6944' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Top Portion of Tumbler - 45 x 25mm',0.4,true,true,1,6,'branding' from products p where p.supplier_sku='LL6944' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Bottom Portion of Tumbler - 30 x 60mm',0.4,true,true,1,7,'branding' from products p where p.supplier_sku='LL6944' and p.supplier ilike 'logoline%';

-- LL6947 Zara 600ml Steel Bottle
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL6947' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Rotary Screen Print Per Colour/Position','200mm x 140mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL6947' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','30mm x 90mm',1.0,true,false,1,2,'branding' from products p where p.supplier_sku='LL6947' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sleeve - 364mm x 241mm',2.5,true,false,1,3,'branding' from products p where p.supplier_sku='LL6947' and p.supplier ilike 'logoline%';

-- LL6949 Zara 1 Litre Steel Bottle
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL6949' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Rotary Screen Print Per Colour/Position','280mm x 120mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL6949' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','40mm x 90mm',1.0,true,false,1,2,'branding' from products p where p.supplier_sku='LL6949' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Box Sleeve - 412mm x 241mm',2.5,true,false,1,3,'branding' from products p where p.supplier_sku='LL6949' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Colour Fusion Per Position','35 x 100mm',1.25,true,false,1,4,'branding' from products p where p.supplier_sku='LL6949' and p.supplier ilike 'logoline%';

-- LL6960 Mystique 650ml Stainless Steel Vacuum Bottle
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL6960' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Roll Print Per Position','200 x 150mm',0.5,true,false,1,1,'branding' from products p where p.supplier_sku='LL6960' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','32 x 90mm',1.0,true,false,1,2,'branding' from products p where p.supplier_sku='LL6960' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Box Sleeve - 320mm x 265mm',1.8,true,false,1,3,'branding' from products p where p.supplier_sku='LL6960' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Rotary Digital Print Per Position','Full Wrap - 229.43 x 150',3.0,true,false,1,4,'branding' from products p where p.supplier_sku='LL6960' and p.supplier ilike 'logoline%';

-- LL6964 Spritz 700ml Collapsible Bottle
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL6964' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','95 x 85mm',0.35,true,true,1,1,'branding' from products p where p.supplier_sku='LL6964' and p.supplier ilike 'logoline%';

-- LL6968 Thirst Bottle
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL6968' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Front & Back - 90 x 150mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL6968' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','90 x 150mm (LxH),  Box Sleeve - Full coverage',2.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL6968' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Sleeve Per Position','Full coverage - see line drawing',1.8,true,false,1,3,'branding' from products p where p.supplier_sku='LL6968' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Box - 90mmDia, 90 x 43mm',0.3,true,false,1,4,'branding' from products p where p.supplier_sku='LL6968' and p.supplier ilike 'logoline%';

-- LL6971 Soda Bottle
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL6971' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Roll Print Per Position','Body Wrap - 200 x 100mm',0.5,true,false,1,1,'branding' from products p where p.supplier_sku='LL6971' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','30 x 85mm (LxH),  Box Sleeve - Full coverage',2.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL6971' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Rotary Digital Print Per Position','Full Wrap - 223.5 x 125mm',3.0,true,false,1,3,'branding' from products p where p.supplier_sku='LL6971' and p.supplier ilike 'logoline%';

-- LL6974 Soda Stainless Steel Bottle
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL6974' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Roll Print Per Position','Body Wrap - 200 x 100mm',0.5,true,false,1,1,'branding' from products p where p.supplier_sku='LL6974' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','30 x 85mm (LxH),  Box Sleeve - Full coverage',2.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL6974' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','32 x 90mm',1.0,true,false,1,3,'branding' from products p where p.supplier_sku='LL6974' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Rotary Digital Print Per Position','Full Wrap - 223.5 x 125mm',3.0,true,false,1,4,'branding' from products p where p.supplier_sku='LL6974' and p.supplier ilike 'logoline%';

-- LL6976 Soda Vacuum Bottle
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL6976' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','30 x 85mm (LxH),  Box Sleeve - Full coverage',2.5,true,false,1,1,'branding' from products p where p.supplier_sku='LL6976' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Roll Print Per Position','Body wrap - 200 x 100mm',0.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL6976' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','32 x 90mm',1.0,true,false,1,3,'branding' from products p where p.supplier_sku='LL6976' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Rotary Digital Print Per Position','Full Wrap - 223.5 x 125mm',3.0,true,false,1,4,'branding' from products p where p.supplier_sku='LL6976' and p.supplier ilike 'logoline%';

-- LL6978 Soda Vacuum Bottle with Hanger Lid
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL6978' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Roll Print Per Position','Body wrap - 200 x 100mm',0.5,true,false,1,1,'branding' from products p where p.supplier_sku='LL6978' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','30 x 85mm (LxH),  Box Sleeve - Full coverage',2.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL6978' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','32 x 90mm',1.0,true,false,1,3,'branding' from products p where p.supplier_sku='LL6978' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Rotary Digital Print Per Position','Full Wrap - 223.5 x 125mm',3.0,true,false,1,4,'branding' from products p where p.supplier_sku='LL6978' and p.supplier ilike 'logoline%';

-- LL6982 Soda Bottle with Hanger Lid
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL6982' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Roll Print Per Position','Body wrap - 200 x 100mm',0.5,true,false,1,1,'branding' from products p where p.supplier_sku='LL6982' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','30 x 85mm (LxH),  Box Sleeve - Full coverage',2.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL6982' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','32 x 90mm',1.0,true,false,1,3,'branding' from products p where p.supplier_sku='LL6982' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Rotary Digital Print Per Position','Full Wrap - 223.5 x 125mm',3.0,true,false,1,4,'branding' from products p where p.supplier_sku='LL6982' and p.supplier ilike 'logoline%';

-- LL6984 Soda Elegant Vacuum Bottle
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL6984' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Roll Print Per Position','Body wrap - 200 x 100mm',0.5,true,false,1,1,'branding' from products p where p.supplier_sku='LL6984' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Box Sleeve - 319 x 253mm',2.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL6984' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','32 x 90mm',1.0,true,false,1,3,'branding' from products p where p.supplier_sku='LL6984' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Rotary Digital Print Per Position','Full Wrap - 223.5 x 125mm',3.0,true,false,1,4,'branding' from products p where p.supplier_sku='LL6984' and p.supplier ilike 'logoline%';

-- LL6986 Vibe Bottle
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL6986' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Box Sleeve - 370 x 271mm',1.25,true,false,1,1,'branding' from products p where p.supplier_sku='LL6986' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Rotary Digital Print Per Position','262 x 185mm',3.0,true,false,1,2,'branding' from products p where p.supplier_sku='LL6986' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','30 x 90mm',1.0,true,false,1,3,'branding' from products p where p.supplier_sku='LL6986' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','230 x 110mm',0.5,true,true,1,4,'branding' from products p where p.supplier_sku='LL6986' and p.supplier ilike 'logoline%';

-- LL6989 Soda Aluminium Bottle
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL6989' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Roll Print Per Position','Body Wrap - 200 x 100mm',0.5,true,false,1,1,'branding' from products p where p.supplier_sku='LL6989' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Drink Bottle - 30 x 85mm, Box Sleeve - 320 x 252',1.8,true,false,1,2,'branding' from products p where p.supplier_sku='LL6989' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','32 x 90mm',1.0,true,false,1,3,'branding' from products p where p.supplier_sku='LL6989' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Rotary Digital Print Per Position','Full Wrap - 229.34 x 140mm',3.0,true,false,1,4,'branding' from products p where p.supplier_sku='LL6989' and p.supplier ilike 'logoline%';

-- LL6991 Chat Recycled Aluminium Bottle
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL6991' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Roll Print Per Position','Bottle - 200 x 150mm',0.5,true,false,1,1,'branding' from products p where p.supplier_sku='LL6991' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Bottle - 32 x 90mm',1.0,true,false,1,2,'branding' from products p where p.supplier_sku='LL6991' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Lid - 40mm Diameter',0.6,true,false,1,3,'branding' from products p where p.supplier_sku='LL6991' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sleeve - 322 x 255mm',3.0,true,false,1,4,'branding' from products p where p.supplier_sku='LL6991' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Rotary Digital Print Per Position','Bottle: Full Wrap - 227.77 x 150mm',3.0,true,false,1,5,'branding' from products p where p.supplier_sku='LL6991' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Lid - 40mm Diameter',0.2,true,true,1,6,'branding' from products p where p.supplier_sku='LL6991' and p.supplier ilike 'logoline%';

-- LL6996 Gelato Aluminium Bottle
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL6996' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Roll Print Per Position','Body Wrap - 200 x 100mm',0.5,true,false,1,1,'branding' from products p where p.supplier_sku='LL6996' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Box Sleeve - 318mm x 252mm',2.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL6996' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','32 x 90mm',1.0,true,false,1,3,'branding' from products p where p.supplier_sku='LL6996' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Rotary Digital Print Per Position','Full Wrap - 229.64 x 155mm',3.0,true,false,1,4,'branding' from products p where p.supplier_sku='LL6996' and p.supplier ilike 'logoline%';

-- LL6997 Gelato Aluminium Bottle with Bamboo Lid
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL6997' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Roll Print Per Position','Body Wrap - 200 x 100mm',0.5,true,false,1,1,'branding' from products p where p.supplier_sku='LL6997' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Box Sleeve - 318mm x 252mm',2.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL6997' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Per Position','32 x 90mm',1.0,true,false,1,3,'branding' from products p where p.supplier_sku='LL6997' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Rotary Digital Print Per Position','Full Wrap - 229.64 x 155mm',3.0,true,false,1,4,'branding' from products p where p.supplier_sku='LL6997' and p.supplier ilike 'logoline%';

-- LL7002 Cargo Storage Organiser
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL7002' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','240 x 100mm',0.6,true,true,1,1,'branding' from products p where p.supplier_sku='LL7002' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','225 x 75mm',2.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL7002' and p.supplier ilike 'logoline%';

-- LL7014 Echo Kraft Pouch
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL7014' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','120 x 60mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL7014' and p.supplier ilike 'logoline%';

-- LL7023 Cherish Pencil Case
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL7023' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','180 x 65mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL7023' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','71mm Dia,  147 x 52mm',0.32,true,false,1,2,'branding' from products p where p.supplier_sku='LL7023' and p.supplier ilike 'logoline%';

-- LL7025 Esprit PVC Pouch
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL7025' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','230 x 140mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL7025' and p.supplier ilike 'logoline%';

-- LL7026 Kit Drawstring Pouch
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL7026' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','130 x 140mm',0.4,true,true,1,1,'branding' from products p where p.supplier_sku='LL7026' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','130 x 140mm',2.1,true,false,1,2,'branding' from products p where p.supplier_sku='LL7026' and p.supplier ilike 'logoline%';

-- LL7027 Montana RPET Felt Satchel
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL7027' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','250 x 150mm',0.45,true,true,1,1,'branding' from products p where p.supplier_sku='LL7027' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Small - 140 x 45mm',1.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL7027' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Large - 297 x 150mm',2.5,true,false,1,3,'branding' from products p where p.supplier_sku='LL7027' and p.supplier ilike 'logoline%';

-- LL7029 Montana RPET Felt Utility Case
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL7029' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','140 x 50mm',0.45,true,true,1,1,'branding' from products p where p.supplier_sku='LL7029' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','140 x 45mm',1.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL7029' and p.supplier ilike 'logoline%';

-- LL7031 Montana RPET Felt Pouch
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL7031' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','140 x 90mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL7031' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','140 x 45mm',1.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL7031' and p.supplier ilike 'logoline%';

-- LL7032 Chic Cosmetic Pack
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL7032' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Bag - 140 x 45mm',1.5,true,false,1,1,'branding' from products p where p.supplier_sku='LL7032' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Bag - 140 x 90mm',0.5,true,true,1,2,'branding' from products p where p.supplier_sku='LL7032' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Lip Balm - 20 x 20mm',0.15,true,true,1,3,'branding' from products p where p.supplier_sku='LL7032' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Comb - 55 x 10mm',0.15,true,true,1,4,'branding' from products p where p.supplier_sku='LL7032' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Nail File - 50 x 13mm',0.15,true,true,1,5,'branding' from products p where p.supplier_sku='LL7032' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Comb - 55 x 10mm',0.25,true,false,1,6,'branding' from products p where p.supplier_sku='LL7032' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Nail File - 110 x 20mm',0.4,true,false,1,7,'branding' from products p where p.supplier_sku='LL7032' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Nail File - 75 x 13mm',0.3,true,false,1,8,'branding' from products p where p.supplier_sku='LL7032' and p.supplier ilike 'logoline%';

-- LL7034 Daphne Utility Case
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL7034' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Below Zipper - 120 x 20mm',0.4,true,true,1,1,'branding' from products p where p.supplier_sku='LL7034' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Back - 80 x 40mm',0.4,true,true,1,2,'branding' from products p where p.supplier_sku='LL7034' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Below Zipper - 120 x 20mm',1.5,true,false,1,3,'branding' from products p where p.supplier_sku='LL7034' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Back - 150 x 50mm',1.5,true,false,1,4,'branding' from products p where p.supplier_sku='LL7034' and p.supplier ilike 'logoline%';

-- LL7037 Montana RPET Felt Tote Bag
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL7037' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','290 x 320mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL7037' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Small - 140 x 45mm',1.7,true,false,1,2,'branding' from products p where p.supplier_sku='LL7037' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Large - 210 x 297mm',2.5,true,false,1,3,'branding' from products p where p.supplier_sku='LL7037' and p.supplier ilike 'logoline%';

-- LL7043 Wallaby Neck Pouch
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL7043' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','70 x 60mm',0.3,true,true,1,1,'branding' from products p where p.supplier_sku='LL7043' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','70 x 60mm',1.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL7043' and p.supplier ilike 'logoline%';

-- LL7045 Trinity Recycled Cotton Apron
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL7045' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Pocket - 210 x 150mm',2.1,true,false,1,1,'branding' from products p where p.supplier_sku='LL7045' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Top - 210 x 150mm',2.1,true,false,1,2,'branding' from products p where p.supplier_sku='LL7045' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Pocket - 210 x 165mm',0.5,true,true,1,3,'branding' from products p where p.supplier_sku='LL7045' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Top - 200 x 200mm',0.5,true,true,1,4,'branding' from products p where p.supplier_sku='LL7045' and p.supplier ilike 'logoline%';

-- LL7047 Sling RPET Travel Bag
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL7047' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Below Zipper - 100mm x 40mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL7047' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Above Zipper - 50mm x 50mm',1.1,true,false,1,2,'branding' from products p where p.supplier_sku='LL7047' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Below Zipper - 100mm x 40mm',1.5,true,false,1,3,'branding' from products p where p.supplier_sku='LL7047' and p.supplier ilike 'logoline%';

-- LL7053 Verona Essentials Bag
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL7053' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Location - 120 x 45mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL7053' and p.supplier ilike 'logoline%';

-- LL7064 Monsoon Poncho
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL7064' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Front - 60 x 90mm',0.32,true,false,1,1,'branding' from products p where p.supplier_sku='LL7064' and p.supplier ilike 'logoline%';

-- LL707 Heart Stress Reliever
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL707' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Front/Back - 30mm Diameter',0.3,true,true,1,1,'branding' from products p where p.supplier_sku='LL707' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front/Back - 25mm Diameter',0.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL707' and p.supplier ilike 'logoline%';

-- LL72 Rectangular Pencil Sharpener
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL72' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Front/Back - 40 x 30mm',0.2,true,true,1,1,'branding' from products p where p.supplier_sku='LL72' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front/Back - 47 x 37mm',0.25,true,false,1,2,'branding' from products p where p.supplier_sku='LL72' and p.supplier ilike 'logoline%';

-- LL726 Splash Gel Hand Sanitiser
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL726' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Front - 30 x 55mm',0.19,true,false,1,1,'branding' from products p where p.supplier_sku='LL726' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Front - 27 x 50mm',0.2,true,true,1,2,'branding' from products p where p.supplier_sku='LL726' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front - 30 x 55mm',0.35,true,false,1,3,'branding' from products p where p.supplier_sku='LL726' and p.supplier ilike 'logoline%';

-- LL727 Fresh Gel Hand Sanitiser
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL727' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Front - 35mm Dia',0.19,true,false,1,1,'branding' from products p where p.supplier_sku='LL727' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front - 30mmDia',0.4,true,false,1,2,'branding' from products p where p.supplier_sku='LL727' and p.supplier ilike 'logoline%';

-- LL7347 Scenic Cotton Cork Utility Pouch
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL7347' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','150 x 30mm',0.75,true,true,1,1,'branding' from products p where p.supplier_sku='LL7347' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','140 x 45mm',1.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL7347' and p.supplier ilike 'logoline%';

-- LL7381 Everest Duo Cooler Bag
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL7381' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Pouch - 110mm x 70mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL7381' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Lid/Top of Cooler - 180mm x 120mm',0.5,true,true,1,2,'branding' from products p where p.supplier_sku='LL7381' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Pouch - 110mm x 70mm',1.5,true,false,1,3,'branding' from products p where p.supplier_sku='LL7381' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Lid/Top of Cooler - 180mm x 120mm',2.0,true,false,1,4,'branding' from products p where p.supplier_sku='LL7381' and p.supplier ilike 'logoline%';

-- LL747 Plane Stress Reliever
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL747' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Roof - 25 x 20mm',0.3,true,true,1,1,'branding' from products p where p.supplier_sku='LL747' and p.supplier ilike 'logoline%';

-- LL7499 Cosi Wet Bag
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL7499' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','230 x 180mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL7499' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Small - 140 x 45mm',1.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL7499' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Large - 285 x 210mm',2.5,true,false,1,3,'branding' from products p where p.supplier_sku='LL7499' and p.supplier ilike 'logoline%';

-- LL7505 Ocean 10 Litre Waterproof Bag
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL7505' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','170 x 120mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL7505' and p.supplier ilike 'logoline%';

-- LL7507 Gather Duffle Bag
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL7507' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Pouch (Front/Back) - 60 x 60mm',1.5,true,false,1,1,'branding' from products p where p.supplier_sku='LL7507' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Pouch (Front/Back) - 70 x 60mm',0.5,true,true,1,2,'branding' from products p where p.supplier_sku='LL7507' and p.supplier ilike 'logoline%';

-- LL7601 Pet Water Dispenser Bottle
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL7601' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Inside of Bowl - 15 x 40mm',0.6,true,false,1,1,'branding' from products p where p.supplier_sku='LL7601' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Bottle - 30 x 50mm',0.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL7601' and p.supplier ilike 'logoline%';

-- LL7603 Buddy Collapsible Bowl
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL7603' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Back of the Bowl - 70mm Diameter',0.3,true,true,1,1,'branding' from products p where p.supplier_sku='LL7603' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave (White Bowl Only) Per Position','Inside the bowl/Back - 50mm Diameter',0.8,true,false,1,2,'branding' from products p where p.supplier_sku='LL7603' and p.supplier ilike 'logoline%';

-- LL7605 Pet Food Scoop
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL7605' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Handle - 80 x 20mm',0.55,true,false,1,1,'branding' from products p where p.supplier_sku='LL7605' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Handle - 80 x 20mm',1.0,true,false,1,2,'branding' from products p where p.supplier_sku='LL7605' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Inside the scoop - 40 x 20mm',0.6,true,false,1,3,'branding' from products p where p.supplier_sku='LL7605' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Handle - 50 x 15mm',0.3,true,true,1,4,'branding' from products p where p.supplier_sku='LL7605' and p.supplier ilike 'logoline%';

-- LL7607 Zoomy Dog Toy
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL7607' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Front/Back - 70 x 70mm',1.5,true,false,1,1,'branding' from products p where p.supplier_sku='LL7607' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Front/Back - 70 x 70mm',0.4,true,true,1,2,'branding' from products p where p.supplier_sku='LL7607' and p.supplier ilike 'logoline%';

-- LL7609 Bone Dog Waste Bag Dispenser
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL7609' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','25 x 20mm',0.25,true,true,1,1,'branding' from products p where p.supplier_sku='LL7609' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','25 x 20mm',0.3,true,false,1,2,'branding' from products p where p.supplier_sku='LL7609' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','25 x 20mm',0.5,true,false,1,3,'branding' from products p where p.supplier_sku='LL7609' and p.supplier ilike 'logoline%';

-- LL7611 Pet Grooming Brush
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL7611' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Bristles Side/Pins Side - 55 x 14mm',0.3,true,false,1,1,'branding' from products p where p.supplier_sku='LL7611' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Bristles Side/Pins Side - 50 x 10mm',0.3,true,true,1,2,'branding' from products p where p.supplier_sku='LL7611' and p.supplier ilike 'logoline%';

-- LL7613 Pupski Retractable Lead
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL7613' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Side 1/Side 2 - 35 x 30mm',0.4,true,true,1,1,'branding' from products p where p.supplier_sku='LL7613' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Side 1/Side 2 - 50mm Diameter',0.45,true,false,1,2,'branding' from products p where p.supplier_sku='LL7613' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Side 1/Side 2 - 50mm Diameter',0.8,true,false,1,3,'branding' from products p where p.supplier_sku='LL7613' and p.supplier ilike 'logoline%';

-- LL7614 Sip n Fly Pet Bowl
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL7614' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Back of Bowl - 70mm Diameter',0.45,true,true,1,1,'branding' from products p where p.supplier_sku='LL7614' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave (White Bowl Only) Per Position','Back/Inside of Bowl - 60mm Diameter',0.9,true,false,1,2,'branding' from products p where p.supplier_sku='LL7614' and p.supplier ilike 'logoline%';

-- LL773 Hard Hat Stress Reliever
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL773' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Front - 15mm Dia',0.3,true,true,1,1,'branding' from products p where p.supplier_sku='LL773' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Side/s - 25mm Dia',0.3,true,true,1,2,'branding' from products p where p.supplier_sku='LL773' and p.supplier ilike 'logoline%';

-- LL785 Soccer Ball Stress Reliever
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL785' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Front - 30mm Diameter, Black panel omitted to maximise print area on white background',0.3,true,true,1,1,'branding' from products p where p.supplier_sku='LL785' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front - 25mm Diameter',0.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL785' and p.supplier ilike 'logoline%';

-- LL7948 Smiley Phone Chair Stress Reliever
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL7948' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Back of chair - 25 x 25mm',0.3,true,true,1,1,'branding' from products p where p.supplier_sku='LL7948' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Back of chair - 15 x 40mm',0.3,true,true,1,2,'branding' from products p where p.supplier_sku='LL7948' and p.supplier ilike 'logoline%';

-- LL7970 Whyalla Phone Stand
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL7970' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Phone Holder - 45mm x 60mm',0.7,true,false,1,1,'branding' from products p where p.supplier_sku='LL7970' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Phone Holder - 45 x 60mm',0.45,true,true,1,2,'branding' from products p where p.supplier_sku='LL7970' and p.supplier ilike 'logoline%';

-- LL8018 Mac Pen
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8018' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Barrel Top - 32 x 8mm',0.12,true,true,1,1,'branding' from products p where p.supplier_sku='LL8018' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Full Barrel - 50 x 6mm',0.12,true,true,1,2,'branding' from products p where p.supplier_sku='LL8018' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen Sleeve - 55 x 20mm',0.12,true,true,1,3,'branding' from products p where p.supplier_sku='LL8018' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Barrel Top - 30 x 7mm',0.25,true,false,1,4,'branding' from products p where p.supplier_sku='LL8018' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Full Barrel - 50 x 5mm',0.25,true,false,1,5,'branding' from products p where p.supplier_sku='LL8018' and p.supplier ilike 'logoline%';

-- LL804 Sugar Free Breath Mints in Silver Tin
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL804' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Lid - 45 x 35mm',0.25,true,true,1,1,'branding' from products p where p.supplier_sku='LL804' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Lid - 57 x 44mm',0.45,true,false,1,2,'branding' from products p where p.supplier_sku='LL804' and p.supplier ilike 'logoline%';

-- LL805 Spearmints in Flip Top Tin 25g
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL805' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Front - 30 x 45mm',0.19,true,false,1,1,'branding' from products p where p.supplier_sku='LL805' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front - 30 x 45mm',0.4,true,false,1,2,'branding' from products p where p.supplier_sku='LL805' and p.supplier ilike 'logoline%';

-- LL8064 Koolio Drawing Set
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8064' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','120 x 85mm',0.85,true,false,1,1,'branding' from products p where p.supplier_sku='LL8064' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','135 x 90mm',0.65,true,false,1,2,'branding' from products p where p.supplier_sku='LL8064' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','60 x 60mm',0.5,true,true,1,3,'branding' from products p where p.supplier_sku='LL8064' and p.supplier ilike 'logoline%';

-- LL807 Sugar Free Breath Mints in Slider Tin
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL807' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Lid - 45 x 20mm',0.2,true,true,1,1,'branding' from products p where p.supplier_sku='LL807' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Lid - 45 x 20mm',0.35,true,false,1,2,'branding' from products p where p.supplier_sku='LL807' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Lid - 45 x 20mm',0.19,true,false,1,3,'branding' from products p where p.supplier_sku='LL807' and p.supplier ilike 'logoline%';

-- LL808 Mystify Sliding Tile Puzzle
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL808' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Tiles - 49 x 49mm',0.25,true,true,1,1,'branding' from products p where p.supplier_sku='LL808' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Base - 60 x 15mm',0.25,true,true,1,2,'branding' from products p where p.supplier_sku='LL808' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front - 65 x 80mm',0.85,true,false,1,3,'branding' from products p where p.supplier_sku='LL808' and p.supplier ilike 'logoline%';

-- LL809 Chewy Peppermint Mints
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL809' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Front - 30 x 45mm',0.19,true,false,1,1,'branding' from products p where p.supplier_sku='LL809' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front - 30 x 45mm',0.4,true,false,1,2,'branding' from products p where p.supplier_sku='LL809' and p.supplier ilike 'logoline%';

-- LL8131 Notebrick Memo Pad
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8131' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Box - 40 x 70mm',0.25,true,false,1,1,'branding' from products p where p.supplier_sku='LL8131' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Notebrick Top - 70 x 27mm',0.5,true,true,1,2,'branding' from products p where p.supplier_sku='LL8131' and p.supplier ilike 'logoline%';

-- LL8152 Activity Pencil Set
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8152' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Front - 41 x 41mm',0.17,true,false,1,1,'branding' from products p where p.supplier_sku='LL8152' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front - 40 x 40mm',0.45,true,false,1,2,'branding' from products p where p.supplier_sku='LL8152' and p.supplier ilike 'logoline%';

-- LL8200 Bamboo Pen Tidy Phone Stand
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8200' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Front of Phone Stand - 45mm x 15mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL8200' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Front of Phone Stand - 55mm x 15mm',0.6,true,false,1,2,'branding' from products p where p.supplier_sku='LL8200' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front of Phone Stand - 55mm x 15mm',0.45,true,false,1,3,'branding' from products p where p.supplier_sku='LL8200' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Digital Sleeve - 448mm x 170mm',2.5,true,false,1,4,'branding' from products p where p.supplier_sku='LL8200' and p.supplier ilike 'logoline%';

-- LL821 Style Gift Box
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL821' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Box Lid - 60 x 60mm',1.0,true,true,1,1,'branding' from products p where p.supplier_sku='LL821' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sleeve - 243 x 167',2.0,true,false,1,2,'branding' from products p where p.supplier_sku='LL821' and p.supplier ilike 'logoline%';

-- LL8214 Alliance Gift Set
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8214' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Pen - 40 x 6mm',0.12,true,false,1,1,'branding' from products p where p.supplier_sku='LL8214' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Flash Drive - 27 x 14mm',0.15,true,false,1,2,'branding' from products p where p.supplier_sku='LL8214' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen - 40 x 6mm',0.12,true,true,1,3,'branding' from products p where p.supplier_sku='LL8214' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Box Lid - 60 x 60mm',1.0,true,true,1,4,'branding' from products p where p.supplier_sku='LL8214' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Flash Drive - 27 x 14mm',0.2,true,false,1,5,'branding' from products p where p.supplier_sku='LL8214' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sleeve - 231.1 x 168mm',2.0,true,false,1,6,'branding' from products p where p.supplier_sku='LL8214' and p.supplier ilike 'logoline%';

-- LL8215 Bellman Gift Set
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8215' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Pen - 50 x 7mm',0.15,true,false,1,1,'branding' from products p where p.supplier_sku='LL8215' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Flash Drive - 27 x 14mm',0.15,true,false,1,2,'branding' from products p where p.supplier_sku='LL8215' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen - 50 x 7mm',0.12,true,true,1,3,'branding' from products p where p.supplier_sku='LL8215' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Box Lid - 60 x 60mm',1.0,true,true,1,4,'branding' from products p where p.supplier_sku='LL8215' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Flash Drive - 27 x 14mm',0.2,true,false,1,5,'branding' from products p where p.supplier_sku='LL8215' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sleeve - 231.1 x 168mm',2.0,true,false,1,6,'branding' from products p where p.supplier_sku='LL8215' and p.supplier ilike 'logoline%';

-- LL8220 Kyoto Gift Set
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8220' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Pen - 50 x 6mm',0.2,true,false,1,1,'branding' from products p where p.supplier_sku='LL8220' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Flash Drive - 25 x 11mm',0.25,true,false,1,2,'branding' from products p where p.supplier_sku='LL8220' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Pen - 50 x 7mm',0.25,true,false,1,3,'branding' from products p where p.supplier_sku='LL8220' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Flash Drive - 35 x 11mm',0.2,true,false,1,4,'branding' from products p where p.supplier_sku='LL8220' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sleeve - 231.1 x 168mm',2.0,true,false,1,5,'branding' from products p where p.supplier_sku='LL8220' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen - 50 x 7mm',0.12,true,true,1,6,'branding' from products p where p.supplier_sku='LL8220' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Flash Drive - 25 x 11mm',0.15,true,true,1,7,'branding' from products p where p.supplier_sku='LL8220' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Box Lid - 60 x 60mm',1.0,true,true,1,8,'branding' from products p where p.supplier_sku='LL8220' and p.supplier ilike 'logoline%';

-- LL8221 Cove Gift Set
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8221' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Pen - 50 x 7mm',0.15,true,false,1,1,'branding' from products p where p.supplier_sku='LL8221' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Flash Drive - 27 x 14mm',0.15,true,false,1,2,'branding' from products p where p.supplier_sku='LL8221' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Flash Drive - 27 x 14mm',0.2,true,false,1,3,'branding' from products p where p.supplier_sku='LL8221' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sleeve - 231.1 x 168mm',2.0,true,false,1,4,'branding' from products p where p.supplier_sku='LL8221' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen - 50 x 7mm',0.12,true,true,1,5,'branding' from products p where p.supplier_sku='LL8221' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Gift Box Lid - 60 x 60mm',1.0,true,true,1,6,'branding' from products p where p.supplier_sku='LL8221' and p.supplier ilike 'logoline%';

-- LL824 Ambassador Gift Box
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL824' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Box Lid - 180 x 130mm',1.0,true,true,1,1,'branding' from products p where p.supplier_sku='LL824' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sleeve - 489 x 80mm',1.75,true,false,1,2,'branding' from products p where p.supplier_sku='LL824' and p.supplier ilike 'logoline%';

-- LL8241 Harmony Gift Set
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8241' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Notebook - 110 x 180mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL8241' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Box - 180 x 130mm',1.0,true,true,1,2,'branding' from products p where p.supplier_sku='LL8241' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Notebook - 100 x 150mm',1.5,true,false,1,3,'branding' from products p where p.supplier_sku='LL8241' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sleeve - 487 x 80mm',1.75,true,false,1,4,'branding' from products p where p.supplier_sku='LL8241' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Pen - 50 x 6mm',0.15,true,false,1,5,'branding' from products p where p.supplier_sku='LL8241' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen - 50 x 7mm',0.12,true,true,1,6,'branding' from products p where p.supplier_sku='LL8241' and p.supplier ilike 'logoline%';

-- LL8247 Anthem Gift Set
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8247' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Notebook Lower - 110 x 40mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL8247' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Notebook Upper - 110 x 110mm',0.5,true,true,1,2,'branding' from products p where p.supplier_sku='LL8247' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen - 50 x 7mm',0.12,true,true,1,3,'branding' from products p where p.supplier_sku='LL8247' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Notebook Lower - 110 x 40mm',1.5,true,false,1,4,'branding' from products p where p.supplier_sku='LL8247' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Notebook Upper - 110 x 110mm',1.5,true,false,1,5,'branding' from products p where p.supplier_sku='LL8247' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Pen - 50 x 6mm',0.25,true,false,1,6,'branding' from products p where p.supplier_sku='LL8247' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sleeve - 487 x 80mm',1.75,true,false,1,7,'branding' from products p where p.supplier_sku='LL8247' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Pen - 50 x 6mm',0.5,true,false,1,8,'branding' from products p where p.supplier_sku='LL8247' and p.supplier ilike 'logoline%';

-- LL8248 Quay Gift Set
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8248' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Power Bank - 60 x 40mm',0.8,true,true,1,1,'branding' from products p where p.supplier_sku='LL8248' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen - 50 x 7mm',0.12,true,true,1,2,'branding' from products p where p.supplier_sku='LL8248' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Box Lid - 60 x 60mm',1.0,true,true,1,3,'branding' from products p where p.supplier_sku='LL8248' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Power Bank - 80 x 40mm',0.8,true,false,1,4,'branding' from products p where p.supplier_sku='LL8248' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sleeve - 396 x 170mm',2.5,true,false,1,5,'branding' from products p where p.supplier_sku='LL8248' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Flash Drive - 27 x 14mm',0.2,true,false,1,6,'branding' from products p where p.supplier_sku='LL8248' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Power Bank - 80 x 40mm',1.0,true,false,1,7,'branding' from products p where p.supplier_sku='LL8248' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Pen - 50 x 7mm',0.15,true,false,1,8,'branding' from products p where p.supplier_sku='LL8248' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Flash Drive - 27 x 14mm',0.15,true,false,1,9,'branding' from products p where p.supplier_sku='LL8248' and p.supplier ilike 'logoline%';

-- LL826 Superior Gift Box
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL826' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Box Lid - 60 x 60mm',1.0,true,true,1,1,'branding' from products p where p.supplier_sku='LL826' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sleeve - 391.5 x 176mm',2.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL826' and p.supplier ilike 'logoline%';

-- LL8261 Carnival Gift Set
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8261' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Pen - 50 x 7mm',0.25,true,false,1,1,'branding' from products p where p.supplier_sku='LL8261' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Power Bank - 80 x 13mm',0.4,true,false,1,2,'branding' from products p where p.supplier_sku='LL8261' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Flash Drive - 27 x 14mm',0.2,true,false,1,3,'branding' from products p where p.supplier_sku='LL8261' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sleeve - 391.5 x 176mm',2.5,true,false,1,4,'branding' from products p where p.supplier_sku='LL8261' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen - 50 x 7mm',0.12,true,true,1,5,'branding' from products p where p.supplier_sku='LL8261' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Box Lid - 60 x 60mm',1.0,true,true,1,6,'branding' from products p where p.supplier_sku='LL8261' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Power Bank - 60 x 13mm',0.25,true,true,1,7,'branding' from products p where p.supplier_sku='LL8261' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Flash Drive - 27 x 14mm',0.15,true,false,1,8,'branding' from products p where p.supplier_sku='LL8261' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Power Bank - 60 x 13mm',0.4,true,false,1,9,'branding' from products p where p.supplier_sku='LL8261' and p.supplier ilike 'logoline%';

-- LL8270 Osaka Gift Set
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8270' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Speaker - Grill - 60mmDia',1.0,true,false,1,1,'branding' from products p where p.supplier_sku='LL8270' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Flash Drive - 35 x 11mm',0.2,true,false,1,2,'branding' from products p where p.supplier_sku='LL8270' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sleeve - 396 x 170mm',2.5,true,false,1,3,'branding' from products p where p.supplier_sku='LL8270' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Speaker - Side - 35 x 20mm',0.4,true,true,1,4,'branding' from products p where p.supplier_sku='LL8270' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Box Lid - 60 x 60mm',1.0,true,true,1,5,'branding' from products p where p.supplier_sku='LL8270' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Flash Drive - 25 x 11mm',0.15,true,true,1,6,'branding' from products p where p.supplier_sku='LL8270' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Flash Drive - 35 x 11mm',0.25,true,false,1,7,'branding' from products p where p.supplier_sku='LL8270' and p.supplier ilike 'logoline%';

-- LL8271 Sephora Gift Set
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8271' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Notebook - 60 x 60mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL8271' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Flash Drive - 25 x 12mm',0.15,true,true,1,2,'branding' from products p where p.supplier_sku='LL8271' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Notebook Pen - 45 x 8mm',0.5,true,true,1,3,'branding' from products p where p.supplier_sku='LL8271' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Notebook - 50 x 30mm',1.85,true,false,1,4,'branding' from products p where p.supplier_sku='LL8271' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Flash Drive - 40 x 15mm',0.25,true,false,1,5,'branding' from products p where p.supplier_sku='LL8271' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Pen - 45 x 7mm',0.2,true,false,1,6,'branding' from products p where p.supplier_sku='LL8271' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Box - 180 x 130mm',1.0,true,true,1,7,'branding' from products p where p.supplier_sku='LL8271' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Flash Drive - Top - 35 x 11mm',0.2,true,false,1,8,'branding' from products p where p.supplier_sku='LL8271' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sleeve - 487 x 80mm',1.75,true,false,1,9,'branding' from products p where p.supplier_sku='LL8271' and p.supplier ilike 'logoline%';

-- LL8272 Sass Gift Set
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8272' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Power Bank - 60 x 13mm',0.4,true,false,1,1,'branding' from products p where p.supplier_sku='LL8272' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Flash Drive - 27 x 14mm',0.15,true,false,1,2,'branding' from products p where p.supplier_sku='LL8272' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Pen - 40 x 5mm',0.12,true,false,1,3,'branding' from products p where p.supplier_sku='LL8272' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Power Bank - 60 x 13mm',0.25,true,true,1,4,'branding' from products p where p.supplier_sku='LL8272' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen - 40 x 6mm',0.12,true,true,1,5,'branding' from products p where p.supplier_sku='LL8272' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Gift Box Lid - 60 x 60mm',1.0,true,true,1,6,'branding' from products p where p.supplier_sku='LL8272' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Power Bank - 80 x 13mm',0.4,true,false,1,7,'branding' from products p where p.supplier_sku='LL8272' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Flash Drive - 27 x 14mm',0.2,true,false,1,8,'branding' from products p where p.supplier_sku='LL8272' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sleeve - 396 x 170mm',2.5,true,false,1,9,'branding' from products p where p.supplier_sku='LL8272' and p.supplier ilike 'logoline%';

-- LL8292 Eco Pack
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8292' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Produce Bag - 100 x 100mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL8292' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Lunch Box - 140 x 70mm',0.5,true,true,1,2,'branding' from products p where p.supplier_sku='LL8292' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Produce Bag - 100 x 100mm',1.2,true,false,1,3,'branding' from products p where p.supplier_sku='LL8292' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Lunch Box - 140 x 70mm',1.5,true,false,1,4,'branding' from products p where p.supplier_sku='LL8292' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Lunch Box - 100 x 60mm',1.0,true,false,1,5,'branding' from products p where p.supplier_sku='LL8292' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Mug - 45 x 45mm',0.4,true,true,1,6,'branding' from products p where p.supplier_sku='LL8292' and p.supplier ilike 'logoline%';

-- LL8296 Bondi Beach Pack
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8296' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Bag Front - 130 x 80mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL8296' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Bag Lid - 150 x 80mm',0.5,true,true,1,2,'branding' from products p where p.supplier_sku='LL8296' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Flyer - 140mmDiameter',0.5,true,true,1,3,'branding' from products p where p.supplier_sku='LL8296' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Drink Bottle - 190 x 65mm',0.5,true,true,1,4,'branding' from products p where p.supplier_sku='LL8296' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Bag - Front - 130 x 140mm',2.1,true,false,1,5,'branding' from products p where p.supplier_sku='LL8296' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Hi Bounce Ball - 30mm Diameter',0.4,true,true,1,6,'branding' from products p where p.supplier_sku='LL8296' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Sunglasses - Arm/s - 45 x 8mm',0.2,true,true,1,7,'branding' from products p where p.supplier_sku='LL8296' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Hi Bounce Ball - 25mm Diameter',0.5,true,false,1,8,'branding' from products p where p.supplier_sku='LL8296' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Flyer - 140mm Diameter',1.5,true,false,1,9,'branding' from products p where p.supplier_sku='LL8296' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Water Bottle - 30 x 70mm',1.8,true,false,1,10,'branding' from products p where p.supplier_sku='LL8296' and p.supplier ilike 'logoline%';

-- LL8299 Office Pack
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8299' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Lunch Bag - 110 x 100mm',0.4,true,true,1,1,'branding' from products p where p.supplier_sku='LL8299' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Drink Bottle - 90 x 150mm',0.5,true,true,1,2,'branding' from products p where p.supplier_sku='LL8299' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Notebook - 100 x 150mm',0.5,true,true,1,3,'branding' from products p where p.supplier_sku='LL8299' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Lunch Cooler - 110 x 100mm',1.5,true,false,1,4,'branding' from products p where p.supplier_sku='LL8299' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Drink Bottle - 90 x 150mm',1.8,true,false,1,5,'branding' from products p where p.supplier_sku='LL8299' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Notebook - 100 x 150mm',1.5,true,false,1,6,'branding' from products p where p.supplier_sku='LL8299' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Pen - 50 x 6mm',0.15,true,false,1,7,'branding' from products p where p.supplier_sku='LL8299' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen - 50 x 7mm',0.12,true,true,1,8,'branding' from products p where p.supplier_sku='LL8299' and p.supplier ilike 'logoline%';

-- LL8300 Picnic Pack
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8300' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Cooler - 110 x 100mm',0.4,true,true,1,1,'branding' from products p where p.supplier_sku='LL8300' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Cutlery Set - 140 x 33mm',0.25,true,true,1,2,'branding' from products p where p.supplier_sku='LL8300' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Drink Bottle - 90 x 150mm',0.5,true,true,1,3,'branding' from products p where p.supplier_sku='LL8300' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Kick Cup - 220 x 38mm',0.6,true,true,1,4,'branding' from products p where p.supplier_sku='LL8300' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Cooler Bag - 110 x 100mm',1.5,true,false,1,5,'branding' from products p where p.supplier_sku='LL8300' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Cutlery Set - 140 x 33mm',0.6,true,false,1,6,'branding' from products p where p.supplier_sku='LL8300' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Drink Bottle - 90 x 150mm',1.8,true,false,1,7,'branding' from products p where p.supplier_sku='LL8300' and p.supplier ilike 'logoline%';

-- LL8317 The Carry-On Graze
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8317' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Cooler Bag - 130 x 140mm',0.01,true,false,1,1,'branding' from products p where p.supplier_sku='LL8317' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Cheeseboard - 45 x 10mm',1.0,true,false,1,2,'branding' from products p where p.supplier_sku='LL8317' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Cup - 100mm x 30mm',1.8,true,false,1,3,'branding' from products p where p.supplier_sku='LL8317' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Label Per Position','Mailing Carton - 120mm Diameter',0.8,false,false,1,4,'addon' from products p where p.supplier_sku='LL8317' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Label Per Position','Customisable Card - 138 x 95mm',0.8,false,false,1,5,'addon' from products p where p.supplier_sku='LL8317' and p.supplier ilike 'logoline%';

-- LL8321 Bubbles & Beachdays
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8321' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Cooler Bag Pouch - 110mm x 70mm',0.01,true,false,1,1,'branding' from products p where p.supplier_sku='LL8321' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Glass - 30mm x 10mm',2.0,true,false,1,2,'branding' from products p where p.supplier_sku='LL8321' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Customisable Card - 138 x 95mm',0.01,false,false,1,3,'addon' from products p where p.supplier_sku='LL8321' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Label Per Position','Mailing Carton - 120mm Diameter',0.8,false,false,1,4,'addon' from products p where p.supplier_sku='LL8321' and p.supplier ilike 'logoline%';

-- LL8323 The Daily Setup
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8323' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Sleeve Per Position','190.5 x 730mm',1.0,true,false,1,1,'branding' from products p where p.supplier_sku='LL8323' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Drink Bottle - 30mm x 90mm',0.01,true,false,1,2,'branding' from products p where p.supplier_sku='LL8323' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Pen - 42 x 6mm',0.15,true,false,1,3,'branding' from products p where p.supplier_sku='LL8323' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Notebook - 100 x 150mm',1.5,true,false,1,4,'branding' from products p where p.supplier_sku='LL8323' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front of Speaker - 54mm Diameter',1.0,true,false,1,5,'branding' from products p where p.supplier_sku='LL8323' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Customisable Card - 138 x 95mm',1.0,false,false,1,6,'addon' from products p where p.supplier_sku='LL8323' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Mailing Box - 120mm Diameter',0.8,true,false,1,7,'branding' from products p where p.supplier_sku='LL8323' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Gift Box - 290 x 150mm',0.5,true,true,1,8,'branding' from products p where p.supplier_sku='LL8323' and p.supplier ilike 'logoline%';

-- LL8325 The Brew & Bite
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8325' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Cooler Bag - 130 x 140mm',0.01,true,false,1,1,'branding' from products p where p.supplier_sku='LL8325' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Vacuum Flask - 60 x 30mm',1.0,true,false,1,2,'branding' from products p where p.supplier_sku='LL8325' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Customisable Card - 138 x 95mm',0.01,false,false,1,3,'addon' from products p where p.supplier_sku='LL8325' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Label Per Position','Mailing Carton - 120mm Diameter',0.8,false,false,1,4,'addon' from products p where p.supplier_sku='LL8325' and p.supplier ilike 'logoline%';

-- LL8334 Tradie Cardboard Notebook with Pen
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8334' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Notebook - 50 x 50mm, Pen - 50 x 6',0.25,true,true,1,1,'branding' from products p where p.supplier_sku='LL8334' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','50 x 50mm',0.19,true,false,1,2,'branding' from products p where p.supplier_sku='LL8334' and p.supplier ilike 'logoline%';

-- LL8335 The Winter Warmer Pack
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8335' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Cooler Bag Pouch - 110mm x 70mm',0.01,true,false,1,1,'branding' from products p where p.supplier_sku='LL8335' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Flask - 30mm x 60mm',1.8,true,false,1,2,'branding' from products p where p.supplier_sku='LL8335' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Mug - 50mm x 50mm',1.0,true,true,1,3,'branding' from products p where p.supplier_sku='LL8335' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Blanket - 100 x 100mm',2.0,true,false,1,4,'branding' from products p where p.supplier_sku='LL8335' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Label Per Position','Mailing Carton - 120mm Diameter',0.8,false,false,1,5,'addon' from products p where p.supplier_sku='LL8335' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Label Per Position','Customisable Card - 138 x 95mm',0.8,false,false,1,6,'addon' from products p where p.supplier_sku='LL8335' and p.supplier ilike 'logoline%';

-- LL8337 Milko Notepad With Pen
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8337' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Notebook - 50 x 50mm',0.35,true,true,1,1,'branding' from products p where p.supplier_sku='LL8337' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen - 50 x 6mm',0.18,true,true,1,2,'branding' from products p where p.supplier_sku='LL8337' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Notebook - 50 x 50mm',0.19,true,false,1,3,'branding' from products p where p.supplier_sku='LL8337' and p.supplier ilike 'logoline%';

-- LL8343 RPET Lens Cloth Set with Pouch
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8343' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Sublimation Per Position','Lens Cloth - 150 x 150mm',0.7,true,false,1,1,'branding' from products p where p.supplier_sku='LL8343' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pouch - 40 x 20mm',0.25,true,true,1,2,'branding' from products p where p.supplier_sku='LL8343' and p.supplier ilike 'logoline%';

-- LL8347 Lunch & Latte Kit
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8347' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Cooler Bag: Front Pocket - 120 x 100mm',1.7,true,false,1,1,'branding' from products p where p.supplier_sku='LL8347' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Cooler Bag: Front Pocket - 150 x 100mm',0.5,true,true,1,2,'branding' from products p where p.supplier_sku='LL8347' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Cup - 180mm x 100mm',0.5,true,true,1,3,'branding' from products p where p.supplier_sku='LL8347' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Lunch Box Lid - 150 x 90mm',0.5,true,true,1,4,'branding' from products p where p.supplier_sku='LL8347' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Cup - 30mm x 80mm',1.8,true,false,1,5,'branding' from products p where p.supplier_sku='LL8347' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Lunch Box Lid - 170 x 110mm',1.5,true,false,1,6,'branding' from products p where p.supplier_sku='LL8347' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Rotary Digital Print Per Position','Cup - 276.5mm x 95mm',3.0,true,false,1,7,'branding' from products p where p.supplier_sku='LL8347' and p.supplier ilike 'logoline%';

-- LL8349 The Courtside Carry
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8349' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Bag - 297 x 210mm',2.5,true,false,1,1,'branding' from products p where p.supplier_sku='LL8349' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Bag Pouch - 120 x 50mm',2.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL8349' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Pickleball Pouch - 150 x 150mm',2.1,true,false,1,3,'branding' from products p where p.supplier_sku='LL8349' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Bat - 150mm Diameter',1.9,true,false,1,4,'branding' from products p where p.supplier_sku='LL8349' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Bat - 140 x 130mm',1.0,true,true,1,5,'branding' from products p where p.supplier_sku='LL8349' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Pickleball Pouch - 150 x 150mm',0.5,true,true,1,6,'branding' from products p where p.supplier_sku='LL8349' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Tote Bag - 290 x 200mm, Tote Pouch - 100 x 50',0.5,true,true,1,7,'branding' from products p where p.supplier_sku='LL8349' and p.supplier ilike 'logoline%';

-- LL8356 Marlin Folding Chair
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8356' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Pouch (Front/Top) - 260mm x 80mm',2.5,true,false,1,1,'branding' from products p where p.supplier_sku='LL8356' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Chair - 100mm x 150mm',2.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL8356' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Chair - 240mm x 70mm',1.0,true,true,1,3,'branding' from products p where p.supplier_sku='LL8356' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Pouch (Front/Top) - 240mm x 70mm',1.0,true,true,1,4,'branding' from products p where p.supplier_sku='LL8356' and p.supplier ilike 'logoline%';

-- LL8357 The Ultimate Welcome - Hot Chocolate Edition
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8357' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Sleeve Per Position','190.5 x 730mm',0.01,true,false,1,1,'branding' from products p where p.supplier_sku='LL8357' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Coffee Cup - 30 x 105mm',0.01,true,false,1,2,'branding' from products p where p.supplier_sku='LL8357' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Notebook - Front - 100 x 150mm',1.5,true,false,1,3,'branding' from products p where p.supplier_sku='LL8357' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Cable Set - 55mm Diameter',0.55,true,false,1,4,'branding' from products p where p.supplier_sku='LL8357' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Pen - 50 x 6mm',0.12,true,false,1,5,'branding' from products p where p.supplier_sku='LL8357' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Label Per Position','Mailing Box - 120mm Diameter',0.8,true,false,1,6,'branding' from products p where p.supplier_sku='LL8357' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Label Per Position','Customisable Card - 138 x 95mm',0.8,false,false,1,7,'addon' from products p where p.supplier_sku='LL8357' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Gift Box - 290 x 150mm',0.5,true,true,1,8,'branding' from products p where p.supplier_sku='LL8357' and p.supplier ilike 'logoline%';

-- LL8358 Wilson Fishing Tackle Kit
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8358' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','40 x 40mm',0.3,true,true,1,1,'branding' from products p where p.supplier_sku='LL8358' and p.supplier ilike 'logoline%';

-- LL8359 The Ultimate Welcome - Tea Edition
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8359' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Sleeve Per Position','190.5 x 730mm',0.01,true,false,1,1,'branding' from products p where p.supplier_sku='LL8359' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Coffee Cup - 30 x 105mm',0.01,true,false,1,2,'branding' from products p where p.supplier_sku='LL8359' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Notebook - Front - 100 x 150mm',1.5,true,false,1,3,'branding' from products p where p.supplier_sku='LL8359' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Cable Set - 55mm Diameter',0.55,true,false,1,4,'branding' from products p where p.supplier_sku='LL8359' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Pen - 50 x 6mm',0.12,true,false,1,5,'branding' from products p where p.supplier_sku='LL8359' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Label Per Position','Mailing Box - 120mm Diameter',0.8,true,false,1,6,'branding' from products p where p.supplier_sku='LL8359' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Label Per Position','Customisable Card - 138 x 95mm',0.8,false,false,1,7,'addon' from products p where p.supplier_sku='LL8359' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Gift Box - 290 x 150mm',0.5,true,true,1,8,'branding' from products p where p.supplier_sku='LL8359' and p.supplier ilike 'logoline%';

-- LL8361 The Sunset Pour
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8361' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Cooler Bag Pouch - 110mm x 70mm',0.01,true,false,1,1,'branding' from products p where p.supplier_sku='LL8361' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Cheeseboard - 45 x 10mm',1.0,true,false,1,2,'branding' from products p where p.supplier_sku='LL8361' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Customisable Card - 138 x 95mm',0.01,false,false,1,3,'addon' from products p where p.supplier_sku='LL8361' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Label Per Position','Mailing Carton - 120mm Diameter',0.8,false,false,1,4,'addon' from products p where p.supplier_sku='LL8361' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Label Per Position','Customisable Card - 138 x 95mm',0.8,false,false,1,5,'addon' from products p where p.supplier_sku='LL8361' and p.supplier ilike 'logoline%';

-- LL8365 Leisure Picnic Blanket
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8365' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','200 x 100mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL8365' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','150  x 100mm',1.7,true,false,1,2,'branding' from products p where p.supplier_sku='LL8365' and p.supplier ilike 'logoline%';

-- LL8367 The Sweet Setup
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8367' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Sleeve Per Position','190.5 x 730mm',1.0,true,false,1,1,'branding' from products p where p.supplier_sku='LL8367' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Drink Bottle - 30mm x 90mm',0.01,true,false,1,2,'branding' from products p where p.supplier_sku='LL8367' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Pen - 42 x 6mm',0.15,true,false,1,3,'branding' from products p where p.supplier_sku='LL8367' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Notebook - 100 x 150mm',1.5,true,false,1,4,'branding' from products p where p.supplier_sku='LL8367' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front of Speaker - 54mm Diameter',1.0,true,false,1,5,'branding' from products p where p.supplier_sku='LL8367' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Customisable Card - 138 x 95mm',1.0,false,false,1,6,'addon' from products p where p.supplier_sku='LL8367' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Mailing Box - 120mm Diameter',0.8,true,false,1,7,'branding' from products p where p.supplier_sku='LL8367' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Gift Box - 290 x 150mm',0.5,true,true,1,8,'branding' from products p where p.supplier_sku='LL8367' and p.supplier ilike 'logoline%';

-- LL8368 Polar Blanket
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8368' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Pouch - 100 x 180mm',0.6,true,true,1,1,'branding' from products p where p.supplier_sku='LL8368' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Pouch - 80 x 220mm',2.1,true,false,1,2,'branding' from products p where p.supplier_sku='LL8368' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Blanket - 150 x 100mm',2.1,true,false,1,3,'branding' from products p where p.supplier_sku='LL8368' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Blanket - 100 x 100mm',2.0,true,false,1,4,'branding' from products p where p.supplier_sku='LL8368' and p.supplier ilike 'logoline%';

-- LL8369 Tech Pack Executive
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8369' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Case (Below Zipper) - 120 x 20mm',0.4,true,true,1,1,'branding' from products p where p.supplier_sku='LL8369' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Case - (Below Zipper) - 120 x 20mm',1.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL8369' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Charger - 35mm x 25mm',0.25,true,true,1,3,'branding' from products p where p.supplier_sku='LL8369' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Travel Adaptor - Front & USB Side - 20 x 20mm',0.2,true,true,1,4,'branding' from products p where p.supplier_sku='LL8369' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Power Bank - 60 x 40mm',0.8,true,true,1,5,'branding' from products p where p.supplier_sku='LL8369' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Charger - 35mm x 25mm',0.4,true,false,1,6,'branding' from products p where p.supplier_sku='LL8369' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Travel Adaptor - Front & USB Side - 20 x 20mm',0.35,true,false,1,7,'branding' from products p where p.supplier_sku='LL8369' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Power Bank - 80 x 40mm',1.25,true,false,1,8,'branding' from products p where p.supplier_sku='LL8369' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Cable - 20mm x 13mm',0.4,true,false,1,9,'branding' from products p where p.supplier_sku='LL8369' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Power Bank - 80 x 40mm',1.0,true,false,1,10,'branding' from products p where p.supplier_sku='LL8369' and p.supplier ilike 'logoline%';

-- LL8370 Chill Cooling Towel in Pouch
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8370' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print - Towel only Per Colour/Position','100 x 100mm (LxH) - refer line drawing,  250 x 80mm - refer line drawing',0.3,true,true,1,1,'branding' from products p where p.supplier_sku='LL8370' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label - Pouch only Per Position','Front - 90mm Diameter',0.59,true,false,1,2,'branding' from products p where p.supplier_sku='LL8370' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label - Pouch only Per Position','Front - 138 x 50mm',0.59,true,false,1,3,'branding' from products p where p.supplier_sku='LL8370' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Dye Sublimation Per Position','1000 x 300mm + 35mm Bleed (min 150DPI)',6.34,true,false,1,4,'branding' from products p where p.supplier_sku='LL8370' and p.supplier ilike 'logoline%';

-- LL8371 Tech Pack Essential
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8371' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Case (Below Zipper) - 120 x 20mm',0.4,true,true,1,1,'branding' from products p where p.supplier_sku='LL8371' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Case - (Below Zipper) - 120 x 20mm',1.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL8371' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Phone Grip & Stand - 30mm Diameter',0.25,true,true,1,3,'branding' from products p where p.supplier_sku='LL8371' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen - 50 x 7mm',0.12,true,true,1,4,'branding' from products p where p.supplier_sku='LL8371' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Lens Cloth Pouch - 40 x 20mm',0.25,true,true,1,5,'branding' from products p where p.supplier_sku='LL8371' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Phone Grip & Stand - 34mm Diameter',0.4,true,false,1,6,'branding' from products p where p.supplier_sku='LL8371' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Cable - 20mm x 13mm',0.4,true,false,1,7,'branding' from products p where p.supplier_sku='LL8371' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Pen - 50 x 6mm',0.12,true,false,1,8,'branding' from products p where p.supplier_sku='LL8371' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Sublimation Per Position','Lens Cloth - 150 x 150mm',0.7,true,false,1,9,'branding' from products p where p.supplier_sku='LL8371' and p.supplier ilike 'logoline%';

-- LL8372 Survey Spiral Pocket Notebook
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8372' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Front/Back - 50 x 50mm',0.3,true,true,1,1,'branding' from products p where p.supplier_sku='LL8372' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Front/Back - 50 x 50mm',0.19,true,false,1,2,'branding' from products p where p.supplier_sku='LL8372' and p.supplier ilike 'logoline%';

-- LL8373 Tech Pack Travel
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8373' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Case - 120 x 45mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL8373' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Scale - 45 x 20mm',0.25,true,true,1,2,'branding' from products p where p.supplier_sku='LL8373' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen - 50 x 7mm',0.12,true,true,1,3,'branding' from products p where p.supplier_sku='LL8373' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Cable - 50 x 50mm',0.4,true,true,1,4,'branding' from products p where p.supplier_sku='LL8373' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Travel Adaptor - Front & USB Side - 20 x 20mm',0.2,true,true,1,5,'branding' from products p where p.supplier_sku='LL8373' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Scale - 45 x 20mm',0.5,true,false,1,6,'branding' from products p where p.supplier_sku='LL8373' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Cable - 55 x 55mm',0.55,true,false,1,7,'branding' from products p where p.supplier_sku='LL8373' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Travel Adaptor - Front & USB Side - 20 x 20mm',0.35,true,false,1,8,'branding' from products p where p.supplier_sku='LL8373' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Pen - 50 x 7mm',0.12,true,false,1,9,'branding' from products p where p.supplier_sku='LL8373' and p.supplier ilike 'logoline%';

-- LL8377 Tech Pack Power
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8377' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Case (Below Zipper) - 120 x 20mm',0.4,true,true,1,1,'branding' from products p where p.supplier_sku='LL8377' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Case - (Below Zipper) - 120 x 20mm',1.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL8377' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Charger - 35mm x 25mm',0.25,true,true,1,3,'branding' from products p where p.supplier_sku='LL8377' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Travel Adaptor - Front & USB Side - 20 x 20mm',0.2,true,true,1,4,'branding' from products p where p.supplier_sku='LL8377' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen - 50 x 7mm',0.12,true,true,1,5,'branding' from products p where p.supplier_sku='LL8377' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Charger - 35mm x 25mm',0.4,true,false,1,6,'branding' from products p where p.supplier_sku='LL8377' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Travel Adaptor - Front & USB Side - 20 x 20mm',0.35,true,false,1,7,'branding' from products p where p.supplier_sku='LL8377' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Cable - 20mm x 13mm',0.4,true,false,1,8,'branding' from products p where p.supplier_sku='LL8377' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Pen - 50 x 7mm',0.12,true,false,1,9,'branding' from products p where p.supplier_sku='LL8377' and p.supplier ilike 'logoline%';

-- LL8379 The Little Luxuries
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8379' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Cosmetics Bag - 120 x 45mm',0.01,true,true,1,1,'branding' from products p where p.supplier_sku='LL8379' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Mirror - 45 x 60mm',0.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL8379' and p.supplier ilike 'logoline%';

-- LL8381 The Mindful Moment
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8381' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Gift Box - 290 x 150mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL8381' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sleeve on Gift Box - 190.5 x 730mm',0.01,true,false,1,2,'branding' from products p where p.supplier_sku='LL8381' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Planner - 100 x 150mm',0.01,true,false,1,3,'branding' from products p where p.supplier_sku='LL8381' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Customisable Card - 138 x 95mm',0.01,false,false,1,4,'addon' from products p where p.supplier_sku='LL8381' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Label Per Position','Mailing Box - 120mm Diameter',0.8,true,false,1,5,'branding' from products p where p.supplier_sku='LL8381' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Pen - 40 x 6mm',0.15,true,false,1,6,'branding' from products p where p.supplier_sku='LL8381' and p.supplier ilike 'logoline%';

-- LL8385 The Cosy Indulgence
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8385' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Sleeve Per Position','Gift Box - 190.5 x 730mm',0.01,true,false,1,1,'branding' from products p where p.supplier_sku='LL8385' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Gift Box - 290 x 150mm',0.5,true,true,1,2,'branding' from products p where p.supplier_sku='LL8385' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Label Per Position','Mailing Box - 120mm Diameter',0.8,true,false,1,3,'branding' from products p where p.supplier_sku='LL8385' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Label Per Position','Customisable Card - 138 x 95mm',0.8,false,false,1,4,'addon' from products p where p.supplier_sku='LL8385' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Mug - 45 x 45mm',0.4,true,true,1,5,'branding' from products p where p.supplier_sku='LL8385' and p.supplier ilike 'logoline%';

-- LL8387 Daily Grind Pack
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8387' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Drink Bottle - 32 x 90mm',1.0,true,false,1,1,'branding' from products p where p.supplier_sku='LL8387' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Drink Bottle - 260mm x 130mm',0.5,true,true,1,2,'branding' from products p where p.supplier_sku='LL8387' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Cooler Bag Front - 130 x 80mm',0.5,true,true,1,3,'branding' from products p where p.supplier_sku='LL8387' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Cup - 180mm x 100mm',0.5,true,true,1,4,'branding' from products p where p.supplier_sku='LL8387' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Cup - 30mm x 80mm',1.8,true,false,1,5,'branding' from products p where p.supplier_sku='LL8387' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Drink Bottle - 30 x 155mm',2.5,true,false,1,6,'branding' from products p where p.supplier_sku='LL8387' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Cooler Bag Front - 130 x 140mm',2.1,true,false,1,7,'branding' from products p where p.supplier_sku='LL8387' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Rotary Digital Print Per Position','Cup - 276.5mm x 95mm',3.0,true,false,1,8,'branding' from products p where p.supplier_sku='LL8387' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Rotary Digital Print Per Position','Drink Bottle - 285mm x 160mm',3.0,true,false,1,9,'branding' from products p where p.supplier_sku='LL8387' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Party Mix - 50 x 50mm, 45mm Dia, 55 x 30mm',0.19,true,false,1,10,'branding' from products p where p.supplier_sku='LL8387' and p.supplier ilike 'logoline%';

-- LL8389 Expo Essentials Pack
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8389' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Front of Notebook - 110 x 180mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL8389' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Back of Notebook - 80 x 180mm',0.5,true,true,1,2,'branding' from products p where p.supplier_sku='LL8389' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Tote Bag - 300mm x 250mm',0.5,true,true,1,3,'branding' from products p where p.supplier_sku='LL8389' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front of Notebook - 100 x 150mm',1.5,true,false,1,4,'branding' from products p where p.supplier_sku='LL8389' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Back of Notebook - 100 x 140mm',1.5,true,false,1,5,'branding' from products p where p.supplier_sku='LL8389' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Pen - 50 x 6.5mm',0.25,true,false,1,6,'branding' from products p where p.supplier_sku='LL8389' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sanitiser - 30mmDia',0.4,true,false,1,7,'branding' from products p where p.supplier_sku='LL8389' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Sanitiser - 35mm Dia',0.19,true,false,1,8,'branding' from products p where p.supplier_sku='LL8389' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Fruit Rings - Label Size - 80 x 80mm (Actual Print Size - 80 x 60mm',0.19,true,false,1,9,'branding' from products p where p.supplier_sku='LL8389' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen - 50 x 7mm',0.12,true,true,1,10,'branding' from products p where p.supplier_sku='LL8389' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Pen - 50 x 6mm',0.5,true,false,1,11,'branding' from products p where p.supplier_sku='LL8389' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Tote Bag - Front/Back - 210 x 297mm',2.0,true,false,1,12,'branding' from products p where p.supplier_sku='LL8389' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Tote Bag - Front/Back - 200 x 250mm',2.0,true,false,1,13,'branding' from products p where p.supplier_sku='LL8389' and p.supplier ilike 'logoline%';

-- LL8393 Collage 12 Pencil Drawing Set
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8393' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','95 x 65mm',0.65,true,false,1,1,'branding' from products p where p.supplier_sku='LL8393' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','60 x 60mm',0.5,true,true,1,2,'branding' from products p where p.supplier_sku='LL8393' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','100 x 90mm',0.5,true,true,1,3,'branding' from products p where p.supplier_sku='LL8393' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','100 x 90mm',0.8,true,false,1,4,'branding' from products p where p.supplier_sku='LL8393' and p.supplier ilike 'logoline%';

-- LL8397 The Warm Escape
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8397' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Cooler Bag Pouch - 110mm x 70mm',0.01,true,false,1,1,'branding' from products p where p.supplier_sku='LL8397' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Flask - 30mm x 60mm',1.8,true,false,1,2,'branding' from products p where p.supplier_sku='LL8397' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Mug - 50mm x 50mm',1.0,true,true,1,3,'branding' from products p where p.supplier_sku='LL8397' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Blanket - 100 x 100mm',2.0,true,false,1,4,'branding' from products p where p.supplier_sku='LL8397' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Serving Board - 45 x 10mm',2.0,true,false,1,5,'branding' from products p where p.supplier_sku='LL8397' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Label Per Position','Mailing Carton - 120mm Diameter',0.8,false,false,1,6,'addon' from products p where p.supplier_sku='LL8397' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Label Per Position','Customisable Card - 138 x 95mm',0.8,false,false,1,7,'addon' from products p where p.supplier_sku='LL8397' and p.supplier ilike 'logoline%';

-- LL8407 The Big Indulge
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8407' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Sleeve Per Position','Gift Box - 190.5 x 730mm',0.01,true,false,1,1,'branding' from products p where p.supplier_sku='LL8407' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Gift Box - 290 x 150mm',0.5,true,true,1,2,'branding' from products p where p.supplier_sku='LL8407' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Label Per Position','Mailing Box - 120mm Diameter',0.8,true,false,1,3,'branding' from products p where p.supplier_sku='LL8407' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Label Per Position','Customisable Card - 138 x 95mm',0.8,false,false,1,4,'addon' from products p where p.supplier_sku='LL8407' and p.supplier ilike 'logoline%';

-- LL8409 The Treat Kit
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8409' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Front Pocket on Cooler - 120 x 100mm',0.01,true,false,1,1,'branding' from products p where p.supplier_sku='LL8409' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Front Pocket on Cooler - 150 x 100mm',0.5,true,true,1,2,'branding' from products p where p.supplier_sku='LL8409' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Customisable Card - 138 x 95mm',0.01,false,false,1,3,'addon' from products p where p.supplier_sku='LL8409' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Label Per Position','Mailing Carton - 120mm Diameter',0.8,false,false,1,4,'addon' from products p where p.supplier_sku='LL8409' and p.supplier ilike 'logoline%';

-- LL8425 The Good Things
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8425' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Cooler Bag Pouch - 110mm x 70mm',0.01,true,false,1,1,'branding' from products p where p.supplier_sku='LL8425' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Customisable Card - 138 x 95mm',0.01,false,false,1,2,'addon' from products p where p.supplier_sku='LL8425' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Label Per Position','Mailing Carton - 120mm Diameter',0.8,false,false,1,3,'addon' from products p where p.supplier_sku='LL8425' and p.supplier ilike 'logoline%';

-- LL8427 The Wine & Unwind
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8427' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Cooler Bag Pouch - 110mm x 70mm',0.01,true,false,1,1,'branding' from products p where p.supplier_sku='LL8427' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Glass - 28mm x 8mm',2.0,true,false,1,2,'branding' from products p where p.supplier_sku='LL8427' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Customisable Card - 138 x 95mm',0.01,false,false,1,3,'addon' from products p where p.supplier_sku='LL8427' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Label Per Position','Mailing Carton - 120mm Diameter',0.8,false,false,1,4,'addon' from products p where p.supplier_sku='LL8427' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Imitation Etch Per Position','Glass - 28mm x 10mm',1.0,true,false,1,5,'branding' from products p where p.supplier_sku='LL8427' and p.supplier ilike 'logoline%';

-- LL843 Gift Box Large Natural
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL843' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Box - 60 x 60mm',1.0,true,true,1,1,'branding' from products p where p.supplier_sku='LL843' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Sleeve on Box Per Position','Sleeve - 391.5 x 176mm',2.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL843' and p.supplier ilike 'logoline%';

-- LL8433 Sephora Cardboard Gift Set
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8433' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Notebook - 60 x 60mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL8433' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Flash Drive - 25 x 12mm',0.15,true,true,1,2,'branding' from products p where p.supplier_sku='LL8433' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Notebook Pen - 45 x 8mm',0.5,true,true,1,3,'branding' from products p where p.supplier_sku='LL8433' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Notebook - 50 x 30mm',1.85,true,false,1,4,'branding' from products p where p.supplier_sku='LL8433' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Flash Drive - 40 x 15mm',0.25,true,false,1,5,'branding' from products p where p.supplier_sku='LL8433' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Pen - 45 x 7mm',0.2,true,false,1,6,'branding' from products p where p.supplier_sku='LL8433' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Box - 180 x 130mm',1.0,true,true,1,7,'branding' from products p where p.supplier_sku='LL8433' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Flash Drive - Top - 35 x 11mm',0.2,true,false,1,8,'branding' from products p where p.supplier_sku='LL8433' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sleeve - 487 x 80mm',1.75,true,false,1,9,'branding' from products p where p.supplier_sku='LL8433' and p.supplier ilike 'logoline%';

-- LL844 Gift Box Ambassador Natural
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL844' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Box - 180 x 130mm',1.0,true,true,1,1,'branding' from products p where p.supplier_sku='LL844' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sleeve - 487 x 80mm',1.75,true,false,1,2,'branding' from products p where p.supplier_sku='LL844' and p.supplier ilike 'logoline%';

-- LL8441 Harmony Cardboard Gift Set
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8441' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Notebook - 110 x 180mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL8441' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Box - 180 x 130mm',1.0,true,true,1,2,'branding' from products p where p.supplier_sku='LL8441' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Pen - 50 x 6mm',0.15,true,false,1,3,'branding' from products p where p.supplier_sku='LL8441' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen - 50 x 7mm',0.12,true,true,1,4,'branding' from products p where p.supplier_sku='LL8441' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Notebook - 100 x 150mm',1.5,true,false,1,5,'branding' from products p where p.supplier_sku='LL8441' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sleeve - 45 x 439mm',1.75,true,false,1,6,'branding' from products p where p.supplier_sku='LL8441' and p.supplier ilike 'logoline%';

-- LL8443 Carnival Cardboard Gift Set
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8443' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Pen - 50 x 7mm',0.25,true,false,1,1,'branding' from products p where p.supplier_sku='LL8443' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Power Bank - 80 x 13mm',0.4,true,false,1,2,'branding' from products p where p.supplier_sku='LL8443' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Flash Drive - 27 x 14mm',0.2,true,false,1,3,'branding' from products p where p.supplier_sku='LL8443' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sleeve - 396 x 170mm',2.5,true,false,1,4,'branding' from products p where p.supplier_sku='LL8443' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen - 50 x 7mm',0.12,true,true,1,5,'branding' from products p where p.supplier_sku='LL8443' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Box Lid - 60 x 60mm',1.0,true,true,1,6,'branding' from products p where p.supplier_sku='LL8443' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Power Bank - 60 x 13mm',0.25,true,true,1,7,'branding' from products p where p.supplier_sku='LL8443' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Flash Drive - 27 x 14mm',0.15,true,false,1,8,'branding' from products p where p.supplier_sku='LL8443' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Power Bank - 60 x 13mm',0.4,true,false,1,9,'branding' from products p where p.supplier_sku='LL8443' and p.supplier ilike 'logoline%';

-- LL8448 Spinner Highlighter
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8448' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','30mm Dia',0.15,true,false,1,1,'branding' from products p where p.supplier_sku='LL8448' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','26mm Dia',0.15,true,true,1,2,'branding' from products p where p.supplier_sku='LL8448' and p.supplier ilike 'logoline%';

-- LL8449 Sass Cardboard Gift Box
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8449' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Power Bank - 60 x 13mm',0.4,true,false,1,1,'branding' from products p where p.supplier_sku='LL8449' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Flash Drive - 27 x 14mm',0.15,true,false,1,2,'branding' from products p where p.supplier_sku='LL8449' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Pen - 40 x 5mm',0.12,true,false,1,3,'branding' from products p where p.supplier_sku='LL8449' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Power Bank - 60 x 13mm',0.25,true,true,1,4,'branding' from products p where p.supplier_sku='LL8449' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen - 40 x 6mm',0.12,true,true,1,5,'branding' from products p where p.supplier_sku='LL8449' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Box Lid - 60 x 60mm',1.0,true,true,1,6,'branding' from products p where p.supplier_sku='LL8449' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Power Bank - 80 x 13mm',0.4,true,false,1,7,'branding' from products p where p.supplier_sku='LL8449' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Flash Drive - 27 x 14mm',0.2,true,false,1,8,'branding' from products p where p.supplier_sku='LL8449' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sleeve - 487 x 80mm',2.5,true,false,1,9,'branding' from products p where p.supplier_sku='LL8449' and p.supplier ilike 'logoline%';

-- LL845 Gift Box Extra Large Natural
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL845' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Box Lid - 180 x 130mm',1.0,true,true,1,1,'branding' from products p where p.supplier_sku='LL845' and p.supplier ilike 'logoline%';

-- LL8451 Pura Cardboard Gift Set
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8451' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Drink Bottle - 32 x 90mm',1.0,true,false,1,1,'branding' from products p where p.supplier_sku='LL8451' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Cup - 30 x 40mm',1.0,true,false,1,2,'branding' from products p where p.supplier_sku='LL8451' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Drink Bottle - 30 x 85mm',1.8,true,false,1,3,'branding' from products p where p.supplier_sku='LL8451' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Cup - 30 x 45mm',1.8,true,false,1,4,'branding' from products p where p.supplier_sku='LL8451' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Cup - 40 x 40mm',0.5,true,true,1,5,'branding' from products p where p.supplier_sku='LL8451' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Roll Print Per Position','Body Wrap - 200 x 100mm',0.5,true,false,1,6,'branding' from products p where p.supplier_sku='LL8451' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Box Lid - 180 x 130mm',1.0,true,true,1,7,'branding' from products p where p.supplier_sku='LL8451' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Rotary Digital Print Per Position','Drink Bottle - Full Wrap - 223.5 x 125mm',3.0,true,false,1,8,'branding' from products p where p.supplier_sku='LL8451' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Rotary Digital Print Per Position','Cup - Full Wrap - 268.92 x 60mm',3.0,true,false,1,9,'branding' from products p where p.supplier_sku='LL8451' and p.supplier ilike 'logoline%';

-- LL8453 Anthem Cardboard Gift Set
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8453' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Notebook - Lower - 110 x 40mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL8453' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Notebook - Lower - 110 x 40mm',1.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL8453' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Pen - 50 x 6mm',0.25,true,false,1,3,'branding' from products p where p.supplier_sku='LL8453' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sleeve - 487 x 80mm',1.75,true,false,1,4,'branding' from products p where p.supplier_sku='LL8453' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen - 50 x 7mm',0.12,true,true,1,5,'branding' from products p where p.supplier_sku='LL8453' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Pen - 50 x 6mm',0.5,true,false,1,6,'branding' from products p where p.supplier_sku='LL8453' and p.supplier ilike 'logoline%';

-- LL8454 Quay Cardboard Gift Set
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8454' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Power Bank - 60 x 40mm',0.8,true,true,1,1,'branding' from products p where p.supplier_sku='LL8454' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen - 50 x 7mm',0.12,true,true,1,2,'branding' from products p where p.supplier_sku='LL8454' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Box Lid - 60 x 60mm',1.0,true,true,1,3,'branding' from products p where p.supplier_sku='LL8454' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Power Bank - 80 x 40mm',0.8,true,false,1,4,'branding' from products p where p.supplier_sku='LL8454' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sleeve - 396 x 170mm',2.5,true,false,1,5,'branding' from products p where p.supplier_sku='LL8454' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Flash Drive - 27 x 14mm',0.2,true,false,1,6,'branding' from products p where p.supplier_sku='LL8454' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Power Bank - 80 x 40mm',1.0,true,false,1,7,'branding' from products p where p.supplier_sku='LL8454' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Pen - 50 x 7mm',0.15,true,false,1,8,'branding' from products p where p.supplier_sku='LL8454' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Flash Drive - 27 x 14mm',0.15,true,false,1,9,'branding' from products p where p.supplier_sku='LL8454' and p.supplier ilike 'logoline%';

-- LL8493 2 in 1 Pencil Sharpener / Eraser
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8493' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Side/s - 28 x 21mm',0.2,true,true,1,1,'branding' from products p where p.supplier_sku='LL8493' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Side/s - 28 x 21mm',0.4,true,false,1,2,'branding' from products p where p.supplier_sku='LL8493' and p.supplier ilike 'logoline%';

-- LL8506 Onboarding Bundle
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8506' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Bag - 290 x 320mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL8506' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Notebook - 110 x 180mm',0.5,true,true,1,2,'branding' from products p where p.supplier_sku='LL8506' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Drink Bottle - 200mm x 140mm',0.5,true,true,1,3,'branding' from products p where p.supplier_sku='LL8506' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Pen - 30 x 20mm',0.15,true,true,1,4,'branding' from products p where p.supplier_sku='LL8506' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Label Per Position','M&M''s - 50 x 50mm',0.19,true,false,1,5,'branding' from products p where p.supplier_sku='LL8506' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Bag (Small) - 140 x 45mm',1.7,true,false,1,6,'branding' from products p where p.supplier_sku='LL8506' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Bag (Large) - 210 x 297mm',2.5,true,false,1,7,'branding' from products p where p.supplier_sku='LL8506' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front/Back of Notebook - 100 x 150mm',1.5,true,false,1,8,'branding' from products p where p.supplier_sku='LL8506' and p.supplier ilike 'logoline%';

-- LL8507 Little Legends Pack
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8507' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Bag - Front/Back - 210 x 260mm',0.4,true,true,1,1,'branding' from products p where p.supplier_sku='LL8507' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Bag Pouch - 100 x 100mm',0.4,true,true,1,2,'branding' from products p where p.supplier_sku='LL8507' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Bottle - 200 x 100mm',0.5,true,true,1,3,'branding' from products p where p.supplier_sku='LL8507' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Sunglasses - 45 x 8mm',0.2,true,true,1,4,'branding' from products p where p.supplier_sku='LL8507' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Ball - 30mm Diameter',0.4,true,true,1,5,'branding' from products p where p.supplier_sku='LL8507' and p.supplier ilike 'logoline%';

-- LL8509 NoteMaster
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8509' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','444.5 x 127mm',3.0,true,false,1,1,'branding' from products p where p.supplier_sku='LL8509' and p.supplier ilike 'logoline%';

-- LL8510 NoteMaster Mini
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8510' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','217.25 x 145mm',2.0,true,false,1,1,'branding' from products p where p.supplier_sku='LL8510' and p.supplier ilike 'logoline%';

-- LL8511 On-the-Go Emergency Pack
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8511' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Bag - 180 x 230mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL8511' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','First Aid Kit - 70 x 40mm',0.5,true,true,1,2,'branding' from products p where p.supplier_sku='LL8511' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Power Bank - 60 x 16mm',0.25,true,true,1,3,'branding' from products p where p.supplier_sku='LL8511' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Torch - 50 x 18mm',0.2,true,true,1,4,'branding' from products p where p.supplier_sku='LL8511' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Wipes - 55 x 30mm',0.17,true,false,1,5,'branding' from products p where p.supplier_sku='LL8511' and p.supplier ilike 'logoline%';

-- LL8539 Genesis A5 Notebook
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8539' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front/Back of Notebook - 100 x 150mm',1.25,true,false,1,1,'branding' from products p where p.supplier_sku='LL8539' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sleeve - 45 x 434mm',1.25,true,false,1,2,'branding' from products p where p.supplier_sku='LL8539' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Front/Back of Notebook - 110 x 180mm',0.5,true,true,1,3,'branding' from products p where p.supplier_sku='LL8539' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Inside Front Cover - 93.1 x 99.1mm',0.65,true,false,1,4,'branding' from products p where p.supplier_sku='LL8539' and p.supplier ilike 'logoline%';

-- LL8541 Astro Soft Cover Recycled Leather Notebook
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8541' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front/Back of Notebook - 100 x 150mm',1.25,true,false,1,1,'branding' from products p where p.supplier_sku='LL8541' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sleeve - 1/3 coverage - 45 x 434mm',1.25,true,false,1,2,'branding' from products p where p.supplier_sku='LL8541' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Front/Back of Notebook - 110 x 180mm',0.5,true,true,1,3,'branding' from products p where p.supplier_sku='LL8541' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Inside Front Cover - 93.1 x 99.1mm',0.65,true,false,1,4,'branding' from products p where p.supplier_sku='LL8541' and p.supplier ilike 'logoline%';

-- LL8563 Queen Wax Highlighters
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8563' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Case - 60 x 30mm',0.25,true,true,1,1,'branding' from products p where p.supplier_sku='LL8563' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Case - 70 x 40mm',0.2,true,false,1,2,'branding' from products p where p.supplier_sku='LL8563' and p.supplier ilike 'logoline%';

-- LL857 Stitch-In-Time Sewing Kit
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL857' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Front - 55 x 40mm',0.25,true,true,1,1,'branding' from products p where p.supplier_sku='LL857' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front - 72 x 45mm, following curve of product (refer line drawing)',0.4,true,false,1,2,'branding' from products p where p.supplier_sku='LL857' and p.supplier ilike 'logoline%';

-- LL862 Java Mug
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL862' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Front/Back - 30 x 30mm',0.6,true,false,1,1,'branding' from products p where p.supplier_sku='LL862' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sleeve - Request Sleeve',1.75,true,false,1,2,'branding' from products p where p.supplier_sku='LL862' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Colour Fusion Per Position','Front/Back - 50 x 50mm',0.75,true,false,1,3,'branding' from products p where p.supplier_sku='LL862' and p.supplier ilike 'logoline%';

-- LL8621 M&M's in Java Mug
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8621' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Front/Back - 30 x 30mm',0.6,true,false,1,1,'branding' from products p where p.supplier_sku='LL8621' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sleeve - full coverage',1.75,true,false,1,2,'branding' from products p where p.supplier_sku='LL8621' and p.supplier ilike 'logoline%';

-- LL8623 Assorted Colour Mini Jelly Beans in Java Mug
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8623' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Front/Back - 30 x 30mm',0.6,true,false,1,1,'branding' from products p where p.supplier_sku='LL8623' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sleeve - see line drawing',1.75,true,false,1,2,'branding' from products p where p.supplier_sku='LL8623' and p.supplier ilike 'logoline%';

-- LL8625 Corporate Colour Mini Jelly Beans in Java Mug
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8625' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Front/Back - 30 x 30mm',0.6,true,false,1,1,'branding' from products p where p.supplier_sku='LL8625' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sleeve - see line drawing',1.75,true,false,1,2,'branding' from products p where p.supplier_sku='LL8625' and p.supplier ilike 'logoline%';

-- LL8779 Sippy Telescopic Straw
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8779' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Tube - 60 x 9mm',0.15,true,true,1,1,'branding' from products p where p.supplier_sku='LL8779' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Roll Print Per Position','Tube - 55 x 40',0.15,true,false,1,2,'branding' from products p where p.supplier_sku='LL8779' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Wrap Label - 37 x 44mm',0.2,true,false,1,3,'branding' from products p where p.supplier_sku='LL8779' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Straw - 5  x 50mm',0.1,true,false,1,4,'branding' from products p where p.supplier_sku='LL8779' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Tube - 60 x 9mm',0.2,true,false,1,5,'branding' from products p where p.supplier_sku='LL8779' and p.supplier ilike 'logoline%';

-- LL8781 Fizz Straw Set
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8781' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Pouch Front/Back - 45 x 140mm',0.4,true,true,1,1,'branding' from products p where p.supplier_sku='LL8781' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Top of Straw/s - 3 x 50mm',0.2,true,false,1,2,'branding' from products p where p.supplier_sku='LL8781' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Bottom of Straw/s - 3 x 35mm',0.2,true,false,1,3,'branding' from products p where p.supplier_sku='LL8781' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Pouch Front/Back - 45 x 140mm',1.5,true,false,1,4,'branding' from products p where p.supplier_sku='LL8781' and p.supplier ilike 'logoline%';

-- LL8782 Mojito Straw Set
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8782' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Pouch Front/Back - 140 x 45mm',0.4,true,true,1,1,'branding' from products p where p.supplier_sku='LL8782' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Bottom of Straw/s - 50 x 3mm',0.2,true,false,1,2,'branding' from products p where p.supplier_sku='LL8782' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Top of Straw/s - 35 x 3mm',0.2,true,false,1,3,'branding' from products p where p.supplier_sku='LL8782' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Pouch Front/Back - 140 x 45mm',1.5,true,false,1,4,'branding' from products p where p.supplier_sku='LL8782' and p.supplier ilike 'logoline%';

-- LL8783 Microfibre Drawstring Pouch
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8783' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Pouch Front/Back - 45 x 140mm',0.4,true,true,1,1,'branding' from products p where p.supplier_sku='LL8783' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Pouch Front/Back - 45 x 140mm',1.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL8783' and p.supplier ilike 'logoline%';

-- LL8784 Calico Drawstring Pouch
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8784' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Pouch Front/Back - 45 x 140mm',0.4,true,true,1,1,'branding' from products p where p.supplier_sku='LL8784' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Pouch Front/Back - 45 x 140mm',1.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL8784' and p.supplier ilike 'logoline%';

-- LL8785 Silicone Straw in Case
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8785' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','49mm Diameter',0.25,true,true,1,1,'branding' from products p where p.supplier_sku='LL8785' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','49mm Diameter',0.25,true,false,1,2,'branding' from products p where p.supplier_sku='LL8785' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','50mm Diameter',0.21,true,false,1,3,'branding' from products p where p.supplier_sku='LL8785' and p.supplier ilike 'logoline%';

-- LL8787 Delish Eco Cutlery Set
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8787' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','140 x 33mm',0.25,true,true,1,1,'branding' from products p where p.supplier_sku='LL8787' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','140 x 33mm',0.6,true,false,1,2,'branding' from products p where p.supplier_sku='LL8787' and p.supplier ilike 'logoline%';

-- LL8790 Delish Eco Cutlery Set in Calico Pouch
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8790' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Pouch - 45 x 140mm',0.4,true,true,1,1,'branding' from products p where p.supplier_sku='LL8790' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Pouch - 45 x 140mm',1.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL8790' and p.supplier ilike 'logoline%';

-- LL8794 Miso Bamboo Cutlery Set in Calico Pouch
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8794' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Pouch - 45 x 140mm',0.4,true,true,1,1,'branding' from products p where p.supplier_sku='LL8794' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Pouch - 45 x 140mm',1.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL8794' and p.supplier ilike 'logoline%';

-- LL8801 Juniper Cutlery Set
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8801' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Bowl - 55 x 35mm',0.5,true,false,1,1,'branding' from products p where p.supplier_sku='LL8801' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Handle - 90 x 10mm',0.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL8801' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Bowl - 40 x 20mm',0.3,true,true,1,3,'branding' from products p where p.supplier_sku='LL8801' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Handle - 50 x 8mm',0.3,true,true,1,4,'branding' from products p where p.supplier_sku='LL8801' and p.supplier ilike 'logoline%';

-- LL8803 Guru Wheat Fibre Multi Utensil
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8803' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','25 x 6mm',0.2,true,true,1,1,'branding' from products p where p.supplier_sku='LL8803' and p.supplier ilike 'logoline%';

-- LL8806 Ramen Cutlery Set
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8806' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','120 x 35mm',0.25,true,true,1,1,'branding' from products p where p.supplier_sku='LL8806' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','120 x 35mm',0.7,true,false,1,2,'branding' from products p where p.supplier_sku='LL8806' and p.supplier ilike 'logoline%';

-- LL8821 Jersey Sticky Notes
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8821' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Front - 50 x 50mm',0.35,true,true,1,1,'branding' from products p where p.supplier_sku='LL8821' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Back - 40 x 40mm',0.35,true,true,1,2,'branding' from products p where p.supplier_sku='LL8821' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front - 50 x 70mm',0.7,true,false,1,3,'branding' from products p where p.supplier_sku='LL8821' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Back - 40 x 40mm',0.7,true,false,1,4,'branding' from products p where p.supplier_sku='LL8821' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','50 x 50mm or 45mm Diameter',0.21,true,false,1,5,'branding' from products p where p.supplier_sku='LL8821' and p.supplier ilike 'logoline%';

-- LL8823 Finch Sticky Notes
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8823' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','40mm Diameter',0.2,true,true,1,1,'branding' from products p where p.supplier_sku='LL8823' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','63 x 53mm',0.4,true,false,1,2,'branding' from products p where p.supplier_sku='LL8823' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','45mm Diameter',0.17,true,false,1,3,'branding' from products p where p.supplier_sku='LL8823' and p.supplier ilike 'logoline%';

-- LL8825 Daisy Sticky Notes
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8825' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','45mm Dia.',0.2,true,true,1,1,'branding' from products p where p.supplier_sku='LL8825' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','45mm Dia.',0.17,true,false,1,2,'branding' from products p where p.supplier_sku='LL8825' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print - White Cover Only Per Position','Front/Back - 45mm Dia',0.4,true,false,1,3,'branding' from products p where p.supplier_sku='LL8825' and p.supplier ilike 'logoline%';

-- LL8827 Spirit Sticky Note Booklet
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8827' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Label Per Position','50 x 50mm,  45mm Diameter',0.21,true,false,1,1,'branding' from products p where p.supplier_sku='LL8827' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','50 x 35mm',0.35,true,true,1,2,'branding' from products p where p.supplier_sku='LL8827' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','50 x 50mm',0.7,true,false,1,3,'branding' from products p where p.supplier_sku='LL8827' and p.supplier ilike 'logoline%';

-- LL8829 Codex Spiral Sticky Notes
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8829' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','30 x 55mm, 45mm Diameter, 50 x 50mm',0.19,true,false,1,1,'branding' from products p where p.supplier_sku='LL8829' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Front/Back - 40 x 50mm',0.35,true,true,1,2,'branding' from products p where p.supplier_sku='LL8829' and p.supplier ilike 'logoline%';

-- LL8831 Tower Note Block
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8831' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Front - 50 x 50mm',0.4,true,true,1,1,'branding' from products p where p.supplier_sku='LL8831' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Back - 50 x 15mm',0.4,true,true,1,2,'branding' from products p where p.supplier_sku='LL8831' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front - 60 x 60mm',0.7,true,false,1,3,'branding' from products p where p.supplier_sku='LL8831' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Back - 60 x 20mm',0.7,true,false,1,4,'branding' from products p where p.supplier_sku='LL8831' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Front - 50 x 50mm or 45mm Diameter',0.21,true,false,1,5,'branding' from products p where p.supplier_sku='LL8831' and p.supplier ilike 'logoline%';

-- LL8833 Storm Poncho
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8833' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Lid - 48mmDiameter',0.25,true,true,1,1,'branding' from products p where p.supplier_sku='LL8833' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Lid - 48mmDiameter',0.35,true,false,1,2,'branding' from products p where p.supplier_sku='LL8833' and p.supplier ilike 'logoline%';

-- LL8837 Trip Daily Planner
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8837' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front - 60mm x 60mm',0.8,true,false,1,1,'branding' from products p where p.supplier_sku='LL8837' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Back - 60mm x 50mm',0.8,true,false,1,2,'branding' from products p where p.supplier_sku='LL8837' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Front/Back - 50mm x 50mm',0.4,true,true,1,3,'branding' from products p where p.supplier_sku='LL8837' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Front/Back - 50mm x 50mm or 45mm Diameter',0.21,true,false,1,4,'branding' from products p where p.supplier_sku='LL8837' and p.supplier ilike 'logoline%';

-- LL8842 Stamina Resistance Bands
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8842' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Bag - 80 x 100mm',0.6,true,true,1,1,'branding' from products p where p.supplier_sku='LL8842' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Pouch - 80 x 120mm',1.7,true,false,1,2,'branding' from products p where p.supplier_sku='LL8842' and p.supplier ilike 'logoline%';

-- LL8847 Circle Milk Carton Bookmark
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8847' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Label Per Position','60mm Diameter',0.17,true,false,1,1,'branding' from products p where p.supplier_sku='LL8847' and p.supplier ilike 'logoline%';

-- LL8848 Rectangle Milk Carton Bookmark
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8848' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Label Per Position','55 x 30mm,  41 x 41mm',0.17,true,false,1,1,'branding' from products p where p.supplier_sku='LL8848' and p.supplier ilike 'logoline%';

-- LL8858 Circle Bamboo Bookmark
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8858' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','45mmDia',0.2,true,true,1,1,'branding' from products p where p.supplier_sku='LL8858' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','45mmDia',0.4,true,false,1,2,'branding' from products p where p.supplier_sku='LL8858' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','45mmDia',0.17,true,false,1,3,'branding' from products p where p.supplier_sku='LL8858' and p.supplier ilike 'logoline%';

-- LL8860 Circle Bookmark / Noteflag Ruler
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8860' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','45mm Diameter',0.17,true,false,1,1,'branding' from products p where p.supplier_sku='LL8860' and p.supplier ilike 'logoline%';

-- LL8868 Business Card Bookmark / Noteflag Ruler
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8868' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','63.5 x 38.1mm',0.17,true,false,1,1,'branding' from products p where p.supplier_sku='LL8868' and p.supplier ilike 'logoline%';

-- LL8905 Da Vinci Crayon Set
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8905' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Tube - 55 x 30mm, 45mm Diameter',0.19,true,false,1,1,'branding' from products p where p.supplier_sku='LL8905' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Lid - 45mm Diameter',0.19,true,false,1,2,'branding' from products p where p.supplier_sku='LL8905' and p.supplier ilike 'logoline%';

-- LL8909 Sketch Pavement Chalk
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8909' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','95 x 65mm',0.3,true,false,1,1,'branding' from products p where p.supplier_sku='LL8909' and p.supplier ilike 'logoline%';

-- LL891 Amaze Tile Ruler Puzzle
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL891' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Front Left - 80 x 39mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL891' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Front Right - 52 x 39mm',0.5,true,true,1,2,'branding' from products p where p.supplier_sku='LL891' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front - 141 x 44mm, incorporating position of missing tile (refer line drawing)',1.0,true,false,1,3,'branding' from products p where p.supplier_sku='LL891' and p.supplier ilike 'logoline%';

-- LL8995 Yoga Gel Bead Hot & Cold Pack
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL8995' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','50 x 50mm',0.3,true,true,1,1,'branding' from products p where p.supplier_sku='LL8995' and p.supplier ilike 'logoline%';

-- LL9023 Pocket First Aid Kit
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL9023' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Front - 70 x 40mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL9023' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Front - 80 x 40mm',1.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL9023' and p.supplier ilike 'logoline%';

-- LL9061 Vectra Phone Stand
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL9061' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Stand - 35 x 60mm',0.3,true,true,1,1,'branding' from products p where p.supplier_sku='LL9061' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Stand - 66 x 110mm',1.0,true,false,1,2,'branding' from products p where p.supplier_sku='LL9061' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Box - 90 x 45mm',0.25,true,false,1,3,'branding' from products p where p.supplier_sku='LL9061' and p.supplier ilike 'logoline%';

-- LL9079 Apollo Bamboo Phone Stand
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL9079' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','50 x 50mm',0.4,true,true,1,1,'branding' from products p where p.supplier_sku='LL9079' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','55 x 70mm',1.0,true,false,1,2,'branding' from products p where p.supplier_sku='LL9079' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Stand - 55 x 70mm, Box Sleeve - Full coverage',0.7,true,false,1,3,'branding' from products p where p.supplier_sku='LL9079' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Box - 50 x 50mm',0.25,true,false,1,4,'branding' from products p where p.supplier_sku='LL9079' and p.supplier ilike 'logoline%';

-- LL9083 Cradle Phone Holder
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL9083' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Front - 40 x 13mm',0.25,true,true,1,1,'branding' from products p where p.supplier_sku='LL9083' and p.supplier ilike 'logoline%';

-- LL9084 Smart Phone Holder
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL9084' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Front Base - 45 x 15mm',0.25,true,true,1,1,'branding' from products p where p.supplier_sku='LL9084' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front Base - 55 x 15mm',0.95,true,false,1,2,'branding' from products p where p.supplier_sku='LL9084' and p.supplier ilike 'logoline%';

-- LL9087 Grip Clip Phone Stand
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL9087' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','60 x 25mm',0.25,true,false,1,1,'branding' from products p where p.supplier_sku='LL9087' and p.supplier ilike 'logoline%';

-- LL9089 Shadow Phone Neck Lanyard
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL9089' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Bamboo Disc - 22mm Diameter',0.15,true,true,1,1,'branding' from products p where p.supplier_sku='LL9089' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Bamboo Disc - 22mm Diameter',0.25,true,false,1,2,'branding' from products p where p.supplier_sku='LL9089' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Bamboo Disc - 22mm Diameter',0.2,true,false,1,3,'branding' from products p where p.supplier_sku='LL9089' and p.supplier ilike 'logoline%';

-- LL9092 Glide Phone Stand
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL9092' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','50 x 25mm',0.3,true,true,1,1,'branding' from products p where p.supplier_sku='LL9092' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','55 x 40mm',0.8,true,false,1,2,'branding' from products p where p.supplier_sku='LL9092' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','55 x 40mm',0.45,true,false,1,3,'branding' from products p where p.supplier_sku='LL9092' and p.supplier ilike 'logoline%';

-- LL9096 Altona Retractable Cable
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL9096' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','55 x 55mm',0.55,true,false,1,1,'branding' from products p where p.supplier_sku='LL9096' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','50 x 50mm',0.4,true,true,1,2,'branding' from products p where p.supplier_sku='LL9096' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Location - 0 x 0mm',0.7,true,false,1,3,'branding' from products p where p.supplier_sku='LL9096' and p.supplier ilike 'logoline%';

-- LL9098 Pop Phone Stand
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL9098' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','1 Colour - 20 x 25mm',0.25,true,true,1,1,'branding' from products p where p.supplier_sku='LL9098' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','20 x 25mm',0.3,true,false,1,2,'branding' from products p where p.supplier_sku='LL9098' and p.supplier ilike 'logoline%';

-- LL9099 Reveal Recycled ABS Cable Set
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL9099' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','55mm Diameter',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL9099' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','55mm Diameter',0.55,true,false,1,2,'branding' from products p where p.supplier_sku='LL9099' and p.supplier ilike 'logoline%';

-- LL9113 Cosmos Phone Wallet
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL9113' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Pouch - 45 x 45mm',0.3,true,true,1,1,'branding' from products p where p.supplier_sku='LL9113' and p.supplier ilike 'logoline%';

-- LL9117 Cozy Phone Wallet
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL9117' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','30 x 50mm',0.35,true,true,1,1,'branding' from products p where p.supplier_sku='LL9117' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','45 x 60mm',0.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL9117' and p.supplier ilike 'logoline%';

-- LL9120 Starz LED Selfie Light
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL9120' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','30mmDia',0.2,true,false,1,1,'branding' from products p where p.supplier_sku='LL9120' and p.supplier ilike 'logoline%';

-- LL9140 Donut Flyer
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL9140' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Ring - Refer Line Drawing',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL9140' and p.supplier ilike 'logoline%';

-- LL9144 Wrist Disc Silicone Flyer
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL9144' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','80mm x 85mm Diameter',0.6,true,true,1,1,'branding' from products p where p.supplier_sku='LL9144' and p.supplier ilike 'logoline%';

-- LL917 Star Stress Reliever
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL917' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Front/Back - 31mm Diameter',0.3,true,true,1,1,'branding' from products p where p.supplier_sku='LL917' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front/Back - 30mm Diameter',0.6,true,false,1,2,'branding' from products p where p.supplier_sku='LL917' and p.supplier ilike 'logoline%';

-- LL9212 Octavius 4,000mAh Power Bank
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL9212' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','60 x 40mm',0.8,true,true,1,1,'branding' from products p where p.supplier_sku='LL9212' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Box Sleeve - 253 x 114mm',1.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL9212' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','80 x 40mm',1.0,true,false,1,3,'branding' from products p where p.supplier_sku='LL9212' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Label Per Position','Box - 90 x 45mm',0.25,true,false,1,4,'branding' from products p where p.supplier_sku='LL9212' and p.supplier ilike 'logoline%';

-- LL9218 Arya 10,000mAh Power Bank
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL9218' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','60 x 50mm',0.8,true,true,1,1,'branding' from products p where p.supplier_sku='LL9218' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Box Sleeve - 202 x 113mm',1.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL9218' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Label Per Position','Box - 70 x 50mm',0.25,true,false,1,3,'branding' from products p where p.supplier_sku='LL9218' and p.supplier ilike 'logoline%';

-- LL9219 Axial 5,000mAh Solid State Power Bank by Nomis
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL9219' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','55 x 95mm',1.25,true,false,1,1,'branding' from products p where p.supplier_sku='LL9219' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','40 x 80mm',1.0,true,false,1,2,'branding' from products p where p.supplier_sku='LL9219' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','50 x 50mm',0.8,true,true,1,3,'branding' from products p where p.supplier_sku='LL9219' and p.supplier ilike 'logoline%';

-- LL9220 Dynamo Solid State Power Bank
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL9220' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','50 x 70mm',1.0,true,false,1,1,'branding' from products p where p.supplier_sku='LL9220' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','55 x 95mm',1.25,true,false,1,2,'branding' from products p where p.supplier_sku='LL9220' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','50 x 50mm',0.8,true,true,1,3,'branding' from products p where p.supplier_sku='LL9220' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Sleeve Per Position','206 x 117mm',1.25,true,false,1,4,'branding' from products p where p.supplier_sku='LL9220' and p.supplier ilike 'logoline%';

-- LL9244 Equinox ANC Headphones In Case
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL9244' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Headphone Caps - Maximum Print Area - 38 x 50mm',1.0,true,false,1,1,'branding' from products p where p.supplier_sku='LL9244' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Case - 80 x 60mm',1.25,true,false,1,2,'branding' from products p where p.supplier_sku='LL9244' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Case - 100 x 50mm',0.5,true,true,1,3,'branding' from products p where p.supplier_sku='LL9244' and p.supplier ilike 'logoline%';

-- LL9264 Rush Car Vent Phone Holder
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL9264' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','19mm Dia.',0.2,true,true,1,1,'branding' from products p where p.supplier_sku='LL9264' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','19mm Dia.',0.3,true,false,1,2,'branding' from products p where p.supplier_sku='LL9264' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','20mm Dia.',0.17,true,false,1,3,'branding' from products p where p.supplier_sku='LL9264' and p.supplier ilike 'logoline%';

-- LL9267 Orbyt Phone Grip & Stand
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL9267' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','34mm Diameter (edge-to-edge printing not available)',0.4,true,false,1,1,'branding' from products p where p.supplier_sku='LL9267' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pouch - 35mm x 35mm',0.25,true,true,1,2,'branding' from products p where p.supplier_sku='LL9267' and p.supplier ilike 'logoline%';

-- LL9353 Fury 3 in 1 Cable
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL9353' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','32mm Dia.',0.2,true,true,1,1,'branding' from products p where p.supplier_sku='LL9353' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','32mm Dia.',0.3,true,false,1,2,'branding' from products p where p.supplier_sku='LL9353' and p.supplier ilike 'logoline%';

-- LL9360 Quench Bottle Opener / Coaster
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL9360' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','40 x 40mm',0.25,true,true,1,1,'branding' from products p where p.supplier_sku='LL9360' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Full coverage - 82 x 82mm, 3mm bleed for full reversal artwork',0.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL9360' and p.supplier ilike 'logoline%';

-- LL9370 Volt Combo Cable
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL9370' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','USB A End - 20 x 6mm',0.2,true,true,1,1,'branding' from products p where p.supplier_sku='LL9370' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','8 Pin End - 30 x 5mm',0.2,true,true,1,2,'branding' from products p where p.supplier_sku='LL9370' and p.supplier ilike 'logoline%';

-- LL9371 Swing 4 in 1 Combo Cable
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL9371' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Type A Side - 15mm x 5mm',0.15,true,false,1,1,'branding' from products p where p.supplier_sku='LL9371' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Lightning Side - 10mm x 5mm',0.15,true,false,1,2,'branding' from products p where p.supplier_sku='LL9371' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Type A Side - 15mm x 5mm',0.15,true,true,1,3,'branding' from products p where p.supplier_sku='LL9371' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Lightning Side - 10mm x 5mm',0.15,true,true,1,4,'branding' from products p where p.supplier_sku='LL9371' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Label Per Position','Box - 30 x 55mm',0.19,true,false,1,5,'branding' from products p where p.supplier_sku='LL9371' and p.supplier ilike 'logoline%';

-- LL9374 ClipIt Carabiner Cable
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL9374' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Front/Back - 17 x 15mm',0.15,true,false,1,1,'branding' from products p where p.supplier_sku='LL9374' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Front/Back - 15 x 12mm',0.15,true,true,1,2,'branding' from products p where p.supplier_sku='LL9374' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Label Per Position','Gift Box - 55 x 30mm',0.19,true,false,1,3,'branding' from products p where p.supplier_sku='LL9374' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front/Back - 12 x 12mm',0.15,true,false,1,4,'branding' from products p where p.supplier_sku='LL9374' and p.supplier ilike 'logoline%';

-- LL9428 Reveal Circle Wireless Charger Set
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL9428' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','50mm Diameter',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL9428' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','50mm Diameter',1.0,true,false,1,2,'branding' from products p where p.supplier_sku='LL9428' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','75mm Diameter',0.55,true,false,1,3,'branding' from products p where p.supplier_sku='LL9428' and p.supplier ilike 'logoline%';

-- LL9429 Reveal Square Wireless Charger Set
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL9429' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','50 x 40mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL9429' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','50 x 50mm',1.0,true,false,1,2,'branding' from products p where p.supplier_sku='LL9429' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','65 x 65mm',0.55,true,false,1,3,'branding' from products p where p.supplier_sku='LL9429' and p.supplier ilike 'logoline%';

-- LL9436 Sprite Round Bamboo Charging Cable
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL9436' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Per Position','Cable Base - 20mm Diameter',0.15,true,false,1,1,'branding' from products p where p.supplier_sku='LL9436' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Per Position','Cable Base - 20mm Diameter',0.15,true,false,1,2,'branding' from products p where p.supplier_sku='LL9436' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Per Position','Cable Base - 20mm Diameter',0.3,true,false,1,3,'branding' from products p where p.supplier_sku='LL9436' and p.supplier ilike 'logoline%';

-- LL9437 Sprite Square Bamboo Charging Cable
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL9437' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Cable Base - 20 x 32mm',0.3,true,false,1,1,'branding' from products p where p.supplier_sku='LL9437' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Cable Base - 20 x 32mm',0.15,true,true,1,2,'branding' from products p where p.supplier_sku='LL9437' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Cable Base - 20 x 32mm',0.15,true,false,1,3,'branding' from products p where p.supplier_sku='LL9437' and p.supplier ilike 'logoline%';

-- LL9439 Raven Cable
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL9439' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','20mm x 13mm',0.4,true,false,1,1,'branding' from products p where p.supplier_sku='LL9439' and p.supplier ilike 'logoline%';

-- LL9441 Reveal Circle Cable Set
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL9441' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Top of Lid - 50mm Dia',1.0,true,false,1,1,'branding' from products p where p.supplier_sku='LL9441' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Top of Lid - 50mm Dia',0.55,true,false,1,2,'branding' from products p where p.supplier_sku='LL9441' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Top of Lid - 50mm Dia',0.5,true,true,1,3,'branding' from products p where p.supplier_sku='LL9441' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Tuck Box - 50 x 50mm or 45mm Diameter',0.19,true,false,1,4,'branding' from products p where p.supplier_sku='LL9441' and p.supplier ilike 'logoline%';

-- LL9442 Reveal Square Cable Set
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL9442' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','50mm x 50mm',1.0,true,false,1,1,'branding' from products p where p.supplier_sku='LL9442' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','50mm x 50mm',0.5,true,true,1,2,'branding' from products p where p.supplier_sku='LL9442' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','50mm x 50mm',0.55,true,false,1,3,'branding' from products p where p.supplier_sku='LL9442' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Label Per Position','Tuck Box - 50 x 50mm or 45mm Diameter',0.19,true,false,1,4,'branding' from products p where p.supplier_sku='LL9442' and p.supplier ilike 'logoline%';

-- LL9443 Boston Charger Cable
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL9443' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Front/Back - 25 x 30mm',0.15,true,true,1,1,'branding' from products p where p.supplier_sku='LL9443' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front/Back - 25 x 30mm',0.4,true,false,1,2,'branding' from products p where p.supplier_sku='LL9443' and p.supplier ilike 'logoline%';

-- LL9446 Jive Speaker
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL9446' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Grill - 101 x 63mm',1.0,true,false,1,1,'branding' from products p where p.supplier_sku='LL9446' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sleeve - 384 x 85.5mm',1.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL9446' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Box - 70 x 40mm',0.25,true,false,1,3,'branding' from products p where p.supplier_sku='LL9446' and p.supplier ilike 'logoline%';

-- LL9452 Tango Bluetooth Speaker
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL9452' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Grill - 70mmDia',1.0,true,false,1,1,'branding' from products p where p.supplier_sku='LL9452' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Box Sleeve - 94 x 335mm',1.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL9452' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Side - 20mmDia',1.0,true,false,1,3,'branding' from products p where p.supplier_sku='LL9452' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Box - 71mmDia, Variable Data - Label (Full name applied to each box for easy identification)',0.25,true,false,1,4,'branding' from products p where p.supplier_sku='LL9452' and p.supplier ilike 'logoline%';

-- LL9456 Havoc Water Resistant Speaker
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL9456' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Grill - 145 x 55mm, Sleeve - 553 x 86',1.75,true,false,1,1,'branding' from products p where p.supplier_sku='LL9456' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Box - 70 x 40mm',0.25,true,false,1,2,'branding' from products p where p.supplier_sku='LL9456' and p.supplier ilike 'logoline%';

-- LL9458 Shogun Speaker & Inductive Charger
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL9458' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Grill - 196 x 63mm, Sleeve - Full coverage',1.75,true,false,1,1,'branding' from products p where p.supplier_sku='LL9458' and p.supplier ilike 'logoline%';

-- LL9460 Freedom Bamboo Bluetooth Speaker
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL9460' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Grill - 50mmDia',1.0,true,false,1,1,'branding' from products p where p.supplier_sku='LL9460' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sleeve - 286 x 75mm',1.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL9460' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Side - 35 x 20mm',0.4,true,true,1,3,'branding' from products p where p.supplier_sku='LL9460' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Box - 60mmDia',0.25,true,false,1,4,'branding' from products p where p.supplier_sku='LL9460' and p.supplier ilike 'logoline%';

-- LL9462 Gig Bamboo Bluetooth Speaker
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL9462' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','30 x 20mm',0.8,true,false,1,1,'branding' from products p where p.supplier_sku='LL9462' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Side - 30 x 20mm',1.0,true,false,1,2,'branding' from products p where p.supplier_sku='LL9462' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Grill - 50 x 50mm',1.0,true,false,1,3,'branding' from products p where p.supplier_sku='LL9462' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Sleeve - 270 x 70mm',1.5,true,false,1,4,'branding' from products p where p.supplier_sku='LL9462' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Box - 60mmDia',0.25,true,false,1,5,'branding' from products p where p.supplier_sku='LL9462' and p.supplier ilike 'logoline%';

-- LL9465 Fresco Speaker & Wireless Charger
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL9465' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Speaker - 50 x 50mm',0.4,true,true,1,1,'branding' from products p where p.supplier_sku='LL9465' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Speaker - 100 x 123mm, Sleeve - 451 x 133',1.0,true,false,1,2,'branding' from products p where p.supplier_sku='LL9465' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Box - 60mm Dia',0.25,true,false,1,3,'branding' from products p where p.supplier_sku='LL9465' and p.supplier ilike 'logoline%';

-- LL9467 Typhoon Speaker & Wireless Charger
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL9467' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','50 x 50mm',0.4,true,true,1,1,'branding' from products p where p.supplier_sku='LL9467' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','99mmDia,  Sleeve - Full coverage',1.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL9467' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Box - 60mm Dia',0.25,true,false,1,3,'branding' from products p where p.supplier_sku='LL9467' and p.supplier ilike 'logoline%';

-- LL9469 Neon Bluetooth Speaker
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL9469' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Per Position','End Caps - 39mm Diameter',0.35,true,false,1,1,'branding' from products p where p.supplier_sku='LL9469' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Per Position','End Caps - 35mm Diameter',0.35,true,false,1,2,'branding' from products p where p.supplier_sku='LL9469' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Per Position','Box Sleeve - 174mm x 360mm',2.5,true,false,1,3,'branding' from products p where p.supplier_sku='LL9469' and p.supplier ilike 'logoline%';

-- LL9471 Boombox Mini Speaker
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL9471' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Top of Speaker - 45 x 15mm',0.3,true,true,1,1,'branding' from products p where p.supplier_sku='LL9471' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Grill - 55 x 45mm',1.0,true,false,1,2,'branding' from products p where p.supplier_sku='LL9471' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Box Sleeve - 368 x 88mm',1.5,true,false,1,3,'branding' from products p where p.supplier_sku='LL9471' and p.supplier ilike 'logoline%';

-- LL9473 Pep Mini Speaker
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL9473' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front of Speaker - 54mm Diameter',1.0,true,false,1,1,'branding' from products p where p.supplier_sku='LL9473' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Back of Speaker - 55mm x 25mm',1.0,true,false,1,2,'branding' from products p where p.supplier_sku='LL9473' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Digital Sleeve - 258mm x 100mm',1.5,true,false,1,3,'branding' from products p where p.supplier_sku='LL9473' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Side of Speaker - 50 x 20mm',1.0,true,false,1,4,'branding' from products p where p.supplier_sku='LL9473' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Back of Speaker - 50 x 25mm',0.3,true,true,1,5,'branding' from products p where p.supplier_sku='LL9473' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Side of Speaker - 40 x 25mm, Available Print colours for Pad Print: Black, White, Metallic Gold & Metallic Silver',0.3,true,true,1,6,'branding' from products p where p.supplier_sku='LL9473' and p.supplier ilike 'logoline%';

-- LL9475 Lightriot Speaker
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL9475' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Top Panel (Large) - 100 x 25mm',2.0,true,false,1,1,'branding' from products p where p.supplier_sku='LL9475' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Clear Back Panel (Small) - 50 x 50mm',1.0,true,false,1,2,'branding' from products p where p.supplier_sku='LL9475' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Clear Back Panel (Large) - 80 x 80mm',2.0,true,false,1,3,'branding' from products p where p.supplier_sku='LL9475' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Top Panel - 200 x 50mm',1.75,true,false,1,4,'branding' from products p where p.supplier_sku='LL9475' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Sleeve Per Position','Digital Sleeve on Box - 654 x 194mm',1.5,true,false,1,5,'branding' from products p where p.supplier_sku='LL9475' and p.supplier ilike 'logoline%';

-- LL9476 Dazzle RGB Speaker
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL9476' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Base - 30 x 10mm',0.4,true,false,1,1,'branding' from products p where p.supplier_sku='LL9476' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Transparent Cover - 35 x 35mm',0.3,true,true,1,2,'branding' from products p where p.supplier_sku='LL9476' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Grill - 60mm Diameter',0.5,true,false,1,3,'branding' from products p where p.supplier_sku='LL9476' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Transparent Cover - 30 x 30mm',0.5,true,false,1,4,'branding' from products p where p.supplier_sku='LL9476' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Base Front - 30 x 15mm',0.5,true,false,1,5,'branding' from products p where p.supplier_sku='LL9476' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Digital Sleeve - 410 x 92mm',1.0,true,false,1,6,'branding' from products p where p.supplier_sku='LL9476' and p.supplier ilike 'logoline%';

-- LL9481 Aura by Nomis Cable
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL9481' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','20mm Diameter',0.4,true,false,1,1,'branding' from products p where p.supplier_sku='LL9481' and p.supplier ilike 'logoline%';

-- LL9483 Ultra Power Cable
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL9483' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','20 x 7mm',0.15,true,true,1,1,'branding' from products p where p.supplier_sku='LL9483' and p.supplier ilike 'logoline%';

-- LL9736 Rascal Bamboo Tablet & Phone Stand
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL9736' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','40 x 30mm,  40 x 10mm',0.4,true,true,1,1,'branding' from products p where p.supplier_sku='LL9736' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','40 x 30mm,  40 x 10mm',0.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL9736' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','40 x 30mm,  40 x 10mm',0.6,true,false,1,3,'branding' from products p where p.supplier_sku='LL9736' and p.supplier ilike 'logoline%';

-- LL9751 Windsor Sticky Notes
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL9751' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Front Cover - 45mm Dia, 34mm  x 65mm, 50mm x 50mm',0.21,true,false,1,1,'branding' from products p where p.supplier_sku='LL9751' and p.supplier ilike 'logoline%';

-- LL9753 Stone Paper Notebook
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL9753' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Front/Back - 80 x 110mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL9753' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Front of Notebook - 45mm Dia, 50 x 50mm, 70 x 40mm',0.19,true,false,1,2,'branding' from products p where p.supplier_sku='LL9753' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Inside of Front Cover - 65 x 95mm',0.65,true,false,1,3,'branding' from products p where p.supplier_sku='LL9753' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','60 x 60mm',0.5,true,true,1,4,'branding' from products p where p.supplier_sku='LL9753' and p.supplier ilike 'logoline%';

-- LL9757 Amazon Bamboo Notebook
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL9757' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Notebook - 50 x 30mm',1.85,true,false,1,1,'branding' from products p where p.supplier_sku='LL9757' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Pen - 45 x 7mm',0.2,true,false,1,2,'branding' from products p where p.supplier_sku='LL9757' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Front of Notebook - 60 x 60mm',0.5,true,true,1,3,'branding' from products p where p.supplier_sku='LL9757' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Back of Notebook - 50 x 50mm',0.5,true,true,1,4,'branding' from products p where p.supplier_sku='LL9757' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','Pen - 45 x 8mm',0.18,true,true,1,5,'branding' from products p where p.supplier_sku='LL9757' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','Inside Front Cover - 65 x 95mm',0.65,true,false,1,6,'branding' from products p where p.supplier_sku='LL9757' and p.supplier ilike 'logoline%';

-- LL9759 Pacifica Spiral A5 Notebook
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL9759' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Front and Back - 60 x 160mm',0.5,true,true,1,1,'branding' from products p where p.supplier_sku='LL9759' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Front - 60 x 150mm',1.5,true,false,1,2,'branding' from products p where p.supplier_sku='LL9759' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Back - 60 x 140mm',1.5,true,false,1,3,'branding' from products p where p.supplier_sku='LL9759' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','Front and Back - 60 x 60mm',1.0,true,false,1,4,'branding' from products p where p.supplier_sku='LL9759' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Label Per Position','Inside Front Cover - 93.1 x 99.1mm',0.65,true,false,1,5,'branding' from products p where p.supplier_sku='LL9759' and p.supplier ilike 'logoline%';

-- LL9998 Epic Fidget Spinner
delete from decoration_options d using products p where d.product_id=p.id and p.supplier_sku='LL9998' and p.supplier ilike 'logoline%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','25mm Diameter',0.2,true,false,1,1,'branding' from products p where p.supplier_sku='LL9998' and p.supplier ilike 'logoline%';


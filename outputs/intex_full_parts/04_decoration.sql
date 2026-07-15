-- INTEX 04/04: decoration_options
-- Intex decoration_options — run AFTER Intex products imported. Keyed on supplier_sku + supplier ilike 'intexglobal%'.
-- per_unit=Intex COST (frontend x1.4 + round-up). setup_fee only for badges (100/80); NULL => frontend flat $60.

-- 5001
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5001' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Embroidery Per Position','Upto 10k Stitches and 6 Colours',3.0,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5001' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'PU Badge Per Position','5cm x 5cm',3.5,true,80,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5001' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Metal Badge Per Position','5cm x 5cm',4.0,true,100,false,1,3,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5001' and p.supplier ilike 'intexglobal%';

-- 5002
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5002' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Embroidery Per Position','Upto 10k Stitches and 6 Colours',3.0,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5002' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'PU Badge Per Position','5cm x 5cm',3.5,true,80,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5002' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Metal Badge Per Position','5cm x 5cm',4.0,true,100,false,1,3,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5002' and p.supplier ilike 'intexglobal%';

-- 5003
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5003' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Embroidery Per Position','Upto 10k Stitches and 6 Colours',3.0,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5003' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'PU Badge Per Position','5cm x 5cm',3.5,true,80,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5003' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Metal Badge Per Position','5cm x 5cm',4.0,true,100,false,1,3,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5003' and p.supplier ilike 'intexglobal%';

-- 5004
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5004' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Embroidery Per Position','Upto 10k Stitches and 6 Colours',3.0,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5004' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'PU Badge Per Position','5cm x 5cm',3.5,true,80,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5004' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Metal Badge Per Position','5cm x 5cm',4.0,true,100,false,1,3,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5004' and p.supplier ilike 'intexglobal%';

-- 5005
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5005' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Embroidery Per Position','Upto 10k Stitches and 6 Colours',3.0,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5005' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'PU Badge Per Position','5cm x 5cm',3.5,true,80,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5005' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Metal Badge Per Position','5cm x 5cm',4.0,true,100,false,1,3,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5005' and p.supplier ilike 'intexglobal%';

-- 5006
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5006' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Embroidery Per Position','Upto 10k Stitches and 6 Colours',3.0,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5006' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'PU Badge Per Position','5cm x 5cm',3.5,true,80,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5006' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Metal Badge Per Position','5cm x 5cm',4.0,true,100,false,1,3,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5006' and p.supplier ilike 'intexglobal%';

-- 5007
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5007' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Embroidery Per Position','Upto 10k Stitches and 6 Colours',3.0,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5007' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'PU Badge Per Position','5cm x 5cm',3.5,true,80,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5007' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Metal Badge Per Position','5cm x 5cm',4.0,true,100,false,1,3,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5007' and p.supplier ilike 'intexglobal%';

-- 5008
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5008' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Embroidery Per Position','Upto 10k Stitches and 6 Colours',3.0,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5008' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'PU Badge Per Position','5cm x 5cm',3.5,true,80,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5008' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Metal Badge Per Position','5cm x 5cm',4.0,true,100,false,1,3,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5008' and p.supplier ilike 'intexglobal%';

-- 5009
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5009' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Embroidery Per Position','Upto 10k Stitches and 6 Colours',3.0,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5009' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'PU Badge Per Position','5cm x 5cm',3.5,true,80,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5009' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Metal Badge Per Position','5cm x 5cm',4.0,true,100,false,1,3,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5009' and p.supplier ilike 'intexglobal%';

-- 5010
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5010' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Embroidery Per Position','Upto 10k Stitches and 6 Colours',3.0,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5010' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'PU Badge Per Position','5cm x 5cm',3.5,true,80,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5010' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Metal Badge Per Position','5cm x 5cm',4.0,true,100,false,1,3,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5010' and p.supplier ilike 'intexglobal%';

-- 5011
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5011' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Embroidery Per Position','Upto 10k Stitches and 6 Colours',3.0,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5011' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'PU Badge Per Position','5cm x 5cm',3.5,true,80,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5011' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Metal Badge Per Position','5cm x 5cm',4.0,true,100,false,1,3,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5011' and p.supplier ilike 'intexglobal%';

-- 5012
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5012' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Embroidery Per Position','Upto 10k Stitches and 6 Colours',3.0,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5012' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'PU Badge Per Position','5cm x 5cm',3.5,true,80,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5012' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Metal Badge Per Position','5cm x 5cm',4.0,true,100,false,1,3,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5012' and p.supplier ilike 'intexglobal%';

-- 5013
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5013' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Embroidery Per Position','Upto 10k Stitches and 6 Colours',3.0,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5013' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'PU Badge Per Position','5cm x 5cm',3.5,true,80,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5013' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Metal Badge Per Position','5cm x 5cm',4.0,true,100,false,1,3,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5013' and p.supplier ilike 'intexglobal%';

-- 5014
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5014' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Embroidery Per Position','Upto 10k Stitches and 6 Colours',3.0,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5014' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'PU Badge Per Position','5cm x 5cm',3.5,true,80,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5014' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Metal Badge Per Position','5cm x 5cm',4.0,true,100,false,1,3,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5014' and p.supplier ilike 'intexglobal%';

-- 5015
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5015' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Embroidery Per Position','Upto 10k Stitches and 6 Colours',3.0,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5015' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'PU Badge Per Position','5cm x 5cm',3.5,true,80,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5015' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Metal Badge Per Position','5cm x 5cm',4.0,true,100,false,1,3,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5015' and p.supplier ilike 'intexglobal%';

-- 5016
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5016' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Embroidery Per Position','Upto 10k Stitches and 6 Colours',3.0,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5016' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'PU Badge Per Position','5cm x 5cm',3.5,true,80,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5016' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Metal Badge Per Position','5cm x 5cm',4.0,true,100,false,1,3,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5016' and p.supplier ilike 'intexglobal%';

-- 5017
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5017' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Embroidery Per Position','Upto 10k Stitches and 6 Colours',3.0,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5017' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'PU Badge Per Position','5cm x 5cm',3.5,true,80,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5017' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Metal Badge Per Position','5cm x 5cm',4.0,true,100,false,1,3,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5017' and p.supplier ilike 'intexglobal%';

-- 5018
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5018' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Embroidery Per Position','Upto 10k Stitches and 6 Colours',3.0,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5018' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'PU Badge Per Position','5cm x 5cm',3.5,true,80,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5018' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Metal Badge Per Position','5cm x 5cm',4.0,true,100,false,1,3,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5018' and p.supplier ilike 'intexglobal%';

-- 5019
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5019' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Embroidery Per Position','Upto 10k Stitches',3.0,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5019' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'PU Badge Per Position','5cm x 5cm',3.5,true,80,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5019' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Metal Badge Per Position','5cm x 5cm',4.0,true,100,false,1,3,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5019' and p.supplier ilike 'intexglobal%';

-- 5020
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5020' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Embroidery Per Position','Upto 10k Stitches and 6 Colours',3.0,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5020' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'PU Badge Per Position','5cm x 5cm',3.5,true,80,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5020' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Metal Badge Per Position','5cm x 5cm',4.0,true,100,false,1,3,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5020' and p.supplier ilike 'intexglobal%';

-- 5021
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5021' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Embroidery Per Position','Upto 10k Stitches and 6 Colours',3.0,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5021' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'PU Badge Per Position','5cm x 5cm',3.5,true,80,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5021' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Metal Badge Per Position','5cm x 5cm',4.0,true,100,false,1,3,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5021' and p.supplier ilike 'intexglobal%';

-- 5022
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5022' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Embroidery Per Position','Upto 10k Stitches and 6 Colours',3.0,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5022' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'PU Badge Per Position','5cm x 5cm',3.5,true,80,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5022' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Metal Badge Per Position','5cm x 5cm',4.0,true,100,false,1,3,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5022' and p.supplier ilike 'intexglobal%';

-- 5101
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5101' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'DTF Per Position','Front - Up to 15cm x 10cm',2.4,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5101' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Embroidery Per Position','Front - Up to 15cm x 10cm',5.5,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5101' and p.supplier ilike 'intexglobal%';

-- 5102
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5102' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Embroidery Per Position','Front - Up to 8cm x 5cm',5.5,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5102' and p.supplier ilike 'intexglobal%';

-- 5103
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5103' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Embroidery/DTF Top Per Position','Up to 8cm x 5cm',5.5,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5103' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Embroidery/DTF Bottom Per Position','Up to 5cm x 15cm',5.5,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5103' and p.supplier ilike 'intexglobal%';

-- 5104
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5104' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'DTF Per Position','Front - Up to 10cm x 10cm',2.4,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5104' and p.supplier ilike 'intexglobal%';

-- 5105
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5105' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'DTF Per Position','Front - Up to 7cm x 10cm',2.4,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='5105' and p.supplier ilike 'intexglobal%';

-- ASSN01
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='ASSN01' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','2.5cm',1.2,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='ASSN01' and p.supplier ilike 'intexglobal%';

-- ASSN10
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='ASSN10' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','1 x 89cm',1.2,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='ASSN10' and p.supplier ilike 'intexglobal%';

-- AUTO03
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='AUTO03' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','50 x 40cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='AUTO03' and p.supplier ilike 'intexglobal%';

-- AUTO06
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='AUTO06' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','40 x 80cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='AUTO06' and p.supplier ilike 'intexglobal%';

-- AUTO21
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='AUTO21' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','24 x 28cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='AUTO21' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','24 x 28cm',2.3,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='AUTO21' and p.supplier ilike 'intexglobal%';

-- BB5001
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='BB5001' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Rotary Print Per Position','23.55 x 14.5 cm',3.25,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='BB5001' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','3.5 x 4cm',1.2,true,null,true,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='BB5001' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','3 x 8cm',1.0,true,null,false,1,3,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='BB5001' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','3 x 9cm',1.2,true,null,false,1,4,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='BB5001' and p.supplier ilike 'intexglobal%';

-- BB5002
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='BB5002' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Rotary Print Per Position','23.55 x 14.5 cm',3.25,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='BB5002' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','3.5 x 4cm',1.2,true,null,true,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='BB5002' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','3 x 8cm',1.0,true,null,false,1,3,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='BB5002' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','3 x 9cm',1.2,true,null,false,1,4,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='BB5002' and p.supplier ilike 'intexglobal%';

-- BB5003
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='BB5003' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Rotary Print Per Position','24.87 x 16.5 cm',3.25,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='BB5003' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','3.5 x 4cm',1.2,true,null,true,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='BB5003' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','3 x 8cm',1.0,true,null,false,1,3,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='BB5003' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','3 x 9cm',1.2,true,null,false,1,4,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='BB5003' and p.supplier ilike 'intexglobal%';

-- BB5004
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='BB5004' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Rotary Print Per Position','24.87 x 16.5 cm',3.25,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='BB5004' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','3.5 x 4cm',1.2,true,null,true,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='BB5004' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','3 x 8cm',1.0,true,null,false,1,3,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='BB5004' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','3 x 9cm',1.2,true,null,false,1,4,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='BB5004' and p.supplier ilike 'intexglobal%';

-- BB5005
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='BB5005' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Rotary Print Per Position','28.27cm x 18cm',5.2,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='BB5005' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','3.5 x 4cm',1.2,true,null,true,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='BB5005' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','3 x 8cm',1.0,true,null,false,1,3,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='BB5005' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','3 x 9cm',1.2,true,null,false,1,4,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='BB5005' and p.supplier ilike 'intexglobal%';

-- BMTD01
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='BMTD01' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Custom Print Per Position','full size',1.5,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='BMTD01' and p.supplier ilike 'intexglobal%';

-- BMTD02
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='BMTD02' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Sublimation Print Per Position','45 x 10cm',1.5,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='BMTD02' and p.supplier ilike 'intexglobal%';

-- CALB20
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='CALB20' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','25 x 25cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='CALB20' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','25 x 25cm',2.3,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='CALB20' and p.supplier ilike 'intexglobal%';

-- COLB01
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='COLB01' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Front 15 x 12, Lid 12 x 10cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='COLB01' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Front 15 x 12, Lid 12 x 10cm',2.3,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='COLB01' and p.supplier ilike 'intexglobal%';

-- COLB03
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='COLB03' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Front 15 x 12, Lid 12 x 10cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='COLB03' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','Front 15 x 12, Lid 12 x 10cm',2.3,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='COLB03' and p.supplier ilike 'intexglobal%';

-- COLB16
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='COLB16' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','7 x 13cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='COLB16' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','7 x 13cm',2.3,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='COLB16' and p.supplier ilike 'intexglobal%';

-- COSD05
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='COSD05' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engraving Per Position','7cm',1.0,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='COSD05' and p.supplier ilike 'intexglobal%';

-- DUFB33
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='DUFB33' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','25 x 25cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='DUFB33' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','25 x 25cm',2.3,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='DUFB33' and p.supplier ilike 'intexglobal%';

-- DUFB34
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='DUFB34' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','16 x 13cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='DUFB34' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','16 x 13cm',2.3,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='DUFB34' and p.supplier ilike 'intexglobal%';

-- EYE01
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='EYE01' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','10 x 5cm',1.2,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='EYE01' and p.supplier ilike 'intexglobal%';

-- FAN001
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='FAN001' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','22 x 33cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='FAN001' and p.supplier ilike 'intexglobal%';

-- FOLB01
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='FOLB01' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','25 x 25cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='FOLB01' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','25 x 25cm',2.3,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='FOLB01' and p.supplier ilike 'intexglobal%';

-- FOLB05
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='FOLB05' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','28cm x 28cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='FOLB05' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','28cm x 28cm',2.3,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='FOLB05' and p.supplier ilike 'intexglobal%';

-- FOLB10
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='FOLB10' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','20 x 20cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='FOLB10' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','20 x 20cm',2.3,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='FOLB10' and p.supplier ilike 'intexglobal%';

-- FRBN03
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='FRBN03' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','18cm',1.2,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='FRBN03' and p.supplier ilike 'intexglobal%';

-- JUTB03
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='JUTB03' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','25 x 25cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='JUTB03' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','25 x 25cm',2.3,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='JUTB03' and p.supplier ilike 'intexglobal%';

-- JUTB04
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='JUTB04' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','25 x 25cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='JUTB04' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','25 x 25cm',2.3,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='JUTB04' and p.supplier ilike 'intexglobal%';

-- JUTB10
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='JUTB10' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','12 x 10cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='JUTB10' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','12 x 10cm',2.3,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='JUTB10' and p.supplier ilike 'intexglobal%';

-- JUTB11
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='JUTB11' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','25 x 25cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='JUTB11' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','25 x 25cm',2.3,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='JUTB11' and p.supplier ilike 'intexglobal%';

-- JUTB23
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='JUTB23' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','25 x 25cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='JUTB23' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','25 x 25cm',2.3,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='JUTB23' and p.supplier ilike 'intexglobal%';

-- LANY14
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='LANY14' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Custom (no size) Per Position','',1.5,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='LANY14' and p.supplier ilike 'intexglobal%';

-- LANY14A
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='LANY14A' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','25cm x 1.5cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='LANY14A' and p.supplier ilike 'intexglobal%';

-- LIFE110
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='LIFE110' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','6 x 2cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='LIFE110' and p.supplier ilike 'intexglobal%';

-- LIFE32
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='LIFE32' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','2.5cm x 2.5cm',1.2,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='LIFE32' and p.supplier ilike 'intexglobal%';

-- MEKR03
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='MEKR03' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','4 x 1cm',1.0,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='MEKR03' and p.supplier ilike 'intexglobal%';

-- MUGD05
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='MUGD05' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','7 x 7cm',0.8,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='MUGD05' and p.supplier ilike 'intexglobal%';

-- MUGD7125
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='MUGD7125' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','8 x 7cm',0.8,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='MUGD7125' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Wrap Around Per Position','19 x 7cm',1.5,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='MUGD7125' and p.supplier ilike 'intexglobal%';

-- NEOP52
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='NEOP52' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Sublimation Per Position','All Over',1.5,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='NEOP52' and p.supplier ilike 'intexglobal%';

-- NWTB09
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='NWTB09' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','25 x 25cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='NWTB09' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','25 x 25cm',2.3,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='NWTB09' and p.supplier ilike 'intexglobal%';

-- NWTB14
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='NWTB14' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','10 x 10cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='NWTB14' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','10 x 10cm',2.3,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='NWTB14' and p.supplier ilike 'intexglobal%';

-- NWTB15
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='NWTB15' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','14 x 14cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='NWTB15' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','14 x 14cm',2.3,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='NWTB15' and p.supplier ilike 'intexglobal%';

-- NWTB20
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='NWTB20' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','16 x 16cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='NWTB20' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','16 x 16cm',2.3,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='NWTB20' and p.supplier ilike 'intexglobal%';

-- NWTB30
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='NWTB30' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','12 x 14cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='NWTB30' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','12 x 14cm',2.3,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='NWTB30' and p.supplier ilike 'intexglobal%';

-- NWTB3035
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='NWTB3035' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','Front chest 6 x 6cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='NWTB3035' and p.supplier ilike 'intexglobal%';

-- NWTB3391
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='NWTB3391' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','15 x 15cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='NWTB3391' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','15 x 15cm',2.3,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='NWTB3391' and p.supplier ilike 'intexglobal%';

-- OC0441
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OC0441' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','4 x 4cm',0.8,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OC0441' and p.supplier ilike 'intexglobal%';

-- OC104193
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OC104193' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','5cm x 5cm',0.8,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OC104193' and p.supplier ilike 'intexglobal%';

-- OC2016B
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OC2016B' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','4cm x 5cm',0.8,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OC2016B' and p.supplier ilike 'intexglobal%';

-- OC2402
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OC2402' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','14cm x 17cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OC2402' and p.supplier ilike 'intexglobal%';

-- OC24X141
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OC24X141' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','10 x 8cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OC24X141' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','10 x 8cm',2.3,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OC24X141' and p.supplier ilike 'intexglobal%';

-- OC24X148
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OC24X148' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','10 x 8cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OC24X148' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','10 x 8cm',2.3,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OC24X148' and p.supplier ilike 'intexglobal%';

-- OC30X168
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OC30X168' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','35cm x 70cm',0.8,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OC30X168' and p.supplier ilike 'intexglobal%';

-- OC31X293
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OC31X293' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','2.5cm x 2cm',1.2,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OC31X293' and p.supplier ilike 'intexglobal%';

-- OC35X230
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OC35X230' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','15 x 15cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OC35X230' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','15 x 15cm',2.3,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OC35X230' and p.supplier ilike 'intexglobal%';

-- OC514
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OC514' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','29 x 32cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OC514' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','29 x 32cm',2.3,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OC514' and p.supplier ilike 'intexglobal%';

-- OC5601
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OC5601' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','15cm x 10cm',0.8,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OC5601' and p.supplier ilike 'intexglobal%';

-- OC721908
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OC721908' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','5.5cm x 0.6cm',0.8,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OC721908' and p.supplier ilike 'intexglobal%';

-- OC9390
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OC9390' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','7 x 6cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OC9390' and p.supplier ilike 'intexglobal%';

-- OCA100
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCA100' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','25cm x 15cm',1.2,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCA100' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','15cm x 15cm',1.2,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCA100' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Embroidery Per Position','10 x 10cm',5.0,true,null,false,1,3,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCA100' and p.supplier ilike 'intexglobal%';

-- OCA810395
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCA810395' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','4cm x 0.6cm',0.8,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCA810395' and p.supplier ilike 'intexglobal%';

-- OCAEM101
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCAEM101' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','23 x 17cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCAEM101' and p.supplier ilike 'intexglobal%';

-- OCBAB101
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCBAB101' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','16 x 16cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCBAB101' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','16 x 16cm',2.3,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCBAB101' and p.supplier ilike 'intexglobal%';

-- OCBAB104
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCBAB104' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','31 x 25cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCBAB104' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','31 x 25cm',2.3,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCBAB104' and p.supplier ilike 'intexglobal%';

-- OCBAB105
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCBAB105' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','27 x 36cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCBAB105' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','27 x 36cm',2.3,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCBAB105' and p.supplier ilike 'intexglobal%';

-- OCBAB109
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCBAB109' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','18 x 13cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCBAB109' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','18 x 13cm',2.3,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCBAB109' and p.supplier ilike 'intexglobal%';

-- OCBAB112
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCBAB112' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','11 x 18cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCBAB112' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','11 x 18cm',2.3,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCBAB112' and p.supplier ilike 'intexglobal%';

-- OCBB01
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCBB01' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','20 x 20cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCBB01' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','20 x 20cm',2.3,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCBB01' and p.supplier ilike 'intexglobal%';

-- OCBB11
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCBB11' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','25 x 25cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCBB11' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','25 x 25cm',2.3,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCBB11' and p.supplier ilike 'intexglobal%';

-- OCBBC108
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCBBC108' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','4 x 16cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCBBC108' and p.supplier ilike 'intexglobal%';

-- OCBBP1010
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCBBP1010' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','18 x 20cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCBBP1010' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','18 x 20cm',2.3,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCBBP1010' and p.supplier ilike 'intexglobal%';

-- OCBBP1011
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCBBP1011' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','23cm x 15cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCBBP1011' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','23cm x 15cm',2.3,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCBBP1011' and p.supplier ilike 'intexglobal%';

-- OCBMS115
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCBMS115' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Sublimation Per Position','All Over',1.5,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCBMS115' and p.supplier ilike 'intexglobal%';

-- OCBMS118
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCBMS118' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Full Colour Imprint Per Position','Front & Back 8 x 30cm',1.2,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCBMS118' and p.supplier ilike 'intexglobal%';

-- OCBMS121
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCBMS121' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Sublimation Per Position','All Over',1.5,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCBMS121' and p.supplier ilike 'intexglobal%';

-- OCBMS130
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCBMS130' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','15 x 25cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCBMS130' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','15 x 25cm',2.3,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCBMS130' and p.supplier ilike 'intexglobal%';

-- OCBMS152
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCBMS152' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','14 x 13cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCBMS152' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','14 x 13cm',2.3,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCBMS152' and p.supplier ilike 'intexglobal%';

-- OCBMS158
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCBMS158' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','6 x 6cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCBMS158' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','6 x 6cm',2.3,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCBMS158' and p.supplier ilike 'intexglobal%';

-- OCBMS423
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCBMS423' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','10 x 18cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCBMS423' and p.supplier ilike 'intexglobal%';

-- OCBOPEN11
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCBOPEN11' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','4 x 4cm',0.8,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCBOPEN11' and p.supplier ilike 'intexglobal%';

-- OCBOPEN8A
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCBOPEN8A' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','3 x 2cm',0.8,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCBOPEN8A' and p.supplier ilike 'intexglobal%';

-- OCBOPEN8C
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCBOPEN8C' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','3 x 2cm',0.8,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCBOPEN8C' and p.supplier ilike 'intexglobal%';

-- OCBSB104
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCBSB104' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','8 x 8cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCBSB104' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','8 x 8cm',2.3,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCBSB104' and p.supplier ilike 'intexglobal%';

-- OCC0014
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCC0014' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','4.5cm x 4.5cm',0.8,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCC0014' and p.supplier ilike 'intexglobal%';

-- OCC018
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCC018' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','20cm x 20cm',0.8,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCC018' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','20cm x 20cm',1.2,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCC018' and p.supplier ilike 'intexglobal%';

-- OCC109
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCC109' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','3 x 0.9cm',0.8,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCC109' and p.supplier ilike 'intexglobal%';

-- OCDR10
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCDR10' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','3.5 x 6cm',1.2,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCDR10' and p.supplier ilike 'intexglobal%';

-- OCHCD01
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCHCD01' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','15cm x 13cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCHCD01' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','15cm x 13cm',2.3,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCHCD01' and p.supplier ilike 'intexglobal%';

-- OCLS117
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCLS117' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','3.81cm x 2.54cm',0.8,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCLS117' and p.supplier ilike 'intexglobal%';

-- OCNRPC01
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCNRPC01' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','Case 5 x 8cm',1.2,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCNRPC01' and p.supplier ilike 'intexglobal%';

-- OCP721707
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCP721707' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','3cm x 3cm',0.8,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCP721707' and p.supplier ilike 'intexglobal%';

-- OCP721953
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCP721953' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','3cm x 3cm',0.8,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCP721953' and p.supplier ilike 'intexglobal%';

-- OCP781796
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCP781796' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Engraving Per Position','2.5cm x 2.5cm',1.0,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCP781796' and p.supplier ilike 'intexglobal%';

-- OCPB800
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCPB800' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','21 x 13cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCPB800' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','21 x 13cm',2.3,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCPB800' and p.supplier ilike 'intexglobal%';

-- OCWINETOTE4
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCWINETOTE4' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','11 x 16cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCWINETOTE4' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','11 x 16cm',2.3,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OCWINETOTE4' and p.supplier ilike 'intexglobal%';

-- OH2080
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OH2080' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','2cm x 2cm',2.3,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OH2080' and p.supplier ilike 'intexglobal%';

-- OH4888
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OH4888' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','10cm x 7.5cm',0.8,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OH4888' and p.supplier ilike 'intexglobal%';

-- OH59
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OH59' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','3cm x 6cm',1.2,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OH59' and p.supplier ilike 'intexglobal%';

-- OH9752
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OH9752' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','7.5cm x 5cm',0.8,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='OH9752' and p.supplier ilike 'intexglobal%';

-- PAPB01GLL
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PAPB01GLL' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','30 x 30cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PAPB01GLL' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','30 x 30cm',2.3,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PAPB01GLL' and p.supplier ilike 'intexglobal%';

-- PAPB01GLM
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PAPB01GLM' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','25 x 25cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PAPB01GLM' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','25 x 25cm',2.3,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PAPB01GLM' and p.supplier ilike 'intexglobal%';

-- PAPB01GLS
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PAPB01GLS' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','15 x 18cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PAPB01GLS' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','15 x 18cm',2.3,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PAPB01GLS' and p.supplier ilike 'intexglobal%';

-- PAPB01GLXL
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PAPB01GLXL' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','30 x 30cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PAPB01GLXL' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','30 x 30cm',2.3,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PAPB01GLXL' and p.supplier ilike 'intexglobal%';

-- PAPB01KCL
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PAPB01KCL' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','30 x 30cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PAPB01KCL' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','30 x 30cm',2.3,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PAPB01KCL' and p.supplier ilike 'intexglobal%';

-- PAPB01KCS
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PAPB01KCS' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','15 x 18cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PAPB01KCS' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','15 x 18cm',2.3,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PAPB01KCS' and p.supplier ilike 'intexglobal%';

-- PAPB01KCXL
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PAPB01KCXL' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','25 x 25cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PAPB01KCXL' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','25 x 25cm',2.3,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PAPB01KCXL' and p.supplier ilike 'intexglobal%';

-- PAPB01KWXL
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PAPB01KWXL' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','30 x 30cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PAPB01KWXL' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','30 x 30cm',2.3,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PAPB01KWXL' and p.supplier ilike 'intexglobal%';

-- PAT200
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PAT200' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','2.5cm x 1.3cm',1.2,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PAT200' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Epoxy Dome Per Position','2.5cm x 1.3cm',1.4,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PAT200' and p.supplier ilike 'intexglobal%';

-- PAT201
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PAT201' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','2.5cm x 1.3cm',1.2,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PAT201' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Epoxy Dome Per Position','2.5cm x 1.3cm',1.4,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PAT201' and p.supplier ilike 'intexglobal%';

-- PAT222
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PAT222' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','2.5cm x 1cm',1.2,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PAT222' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Epoxy Dome Per Position','2.5cm x 1cm',1.4,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PAT222' and p.supplier ilike 'intexglobal%';

-- PLAD01
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PLAD01' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','6 x 6cm',0.8,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PLAD01' and p.supplier ilike 'intexglobal%';

-- PP731436
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PP731436' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Sublimation Per Position','All Over',1.5,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PP731436' and p.supplier ilike 'intexglobal%';

-- PS0088
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS0088' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Sublimation Print Per Position','All over',1.5,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS0088' and p.supplier ilike 'intexglobal%';

-- PS1003
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS1003' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','5cm x 0.8cm',0.1,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS1003' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','5cm x 0.8cm',0.3,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS1003' and p.supplier ilike 'intexglobal%';

-- PS1005
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS1005' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','5cm x 0.8cm',0.1,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS1005' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','5cm x 0.8cm',0.3,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS1005' and p.supplier ilike 'intexglobal%';

-- PS1008
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS1008' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','5cm x 0.8cm',0.1,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS1008' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','5cm x 0.8cm',0.3,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS1008' and p.supplier ilike 'intexglobal%';

-- PS1101
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS1101' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','5cm x 0.6cm',0.25,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS1101' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','5cm x 0.6cm',1.2,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS1101' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','5cm x 0.6cm',0.65,true,null,false,1,3,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS1101' and p.supplier ilike 'intexglobal%';

-- PS1103
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS1103' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','5cm x 0.6cm',0.25,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS1103' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','5cm x 0.6cm',1.2,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS1103' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','5cm x 0.6cm',0.65,true,null,false,1,3,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS1103' and p.supplier ilike 'intexglobal%';

-- PS1112
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS1112' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','4cm x 0.7cm',0.25,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS1112' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','4cm x 0.7cm',1.2,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS1112' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','4cm x 0.7cm',0.65,true,null,false,1,3,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS1112' and p.supplier ilike 'intexglobal%';

-- PS1115
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS1115' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','4.5cm x 0.7cm',0.25,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS1115' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','4.5cm x 0.7cm',1.2,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS1115' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','4.5cm x 0.7cm',0.65,true,null,false,1,3,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS1115' and p.supplier ilike 'intexglobal%';

-- PS1120
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS1120' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','4.5cm x 0.7cm',0.25,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS1120' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','4.5cm x 0.7cm',1.2,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS1120' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','4.5cm x 0.7cm',0.65,true,null,false,1,3,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS1120' and p.supplier ilike 'intexglobal%';

-- PS1121
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS1121' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','4.5cm x 0.7cm',0.25,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS1121' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','4.5cm x 0.7cm',1.2,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS1121' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','4.5cm x 0.7cm',0.65,true,null,false,1,3,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS1121' and p.supplier ilike 'intexglobal%';

-- PS1157
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS1157' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','4cm x 0.7cm',0.25,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS1157' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','4cm x 0.7cm',1.2,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS1157' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','4cm x 0.7cm',0.65,true,null,false,1,3,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS1157' and p.supplier ilike 'intexglobal%';

-- PS1188
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS1188' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Sublimation Print Per Position','32cm x 15cm',1.5,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS1188' and p.supplier ilike 'intexglobal%';

-- PS1201
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS1201' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','5cm x 0.8cm',0.1,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS1201' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','5cm x 0.8cm',0.3,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS1201' and p.supplier ilike 'intexglobal%';

-- PS1204
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS1204' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','5cm x 0.5cm',0.1,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS1204' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','5cm x 0.5cm',0.3,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS1204' and p.supplier ilike 'intexglobal%';

-- PS1208
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS1208' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','5.5cm x 0.5cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS1208' and p.supplier ilike 'intexglobal%';

-- PS1301
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS1301' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','2.5cm x 4cm',0.5,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS1301' and p.supplier ilike 'intexglobal%';

-- PS1341
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS1341' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','5cm x 4cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS1341' and p.supplier ilike 'intexglobal%';

-- PS1404
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS1404' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','6cm x 3cm',0.5,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS1404' and p.supplier ilike 'intexglobal%';

-- PS1603
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS1603' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','4.5cm x 1.5cm',0.8,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS1603' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','4.5cm x 1.5cm',1.2,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS1603' and p.supplier ilike 'intexglobal%';

-- PS1604
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS1604' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','4.5cm x 1.5cm',0.8,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS1604' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','4.5cm x 1.5cm',1.2,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS1604' and p.supplier ilike 'intexglobal%';

-- PS2002
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2002' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','3.5cm x 4.5cm',1.2,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2002' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Rotary Print Per Position','22cm x 11.3cm',4.2,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2002' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Rotary Print Per Position','22cm x 3cm',4.2,true,null,false,1,3,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2002' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','3cm x 9cm',1.2,true,null,false,1,4,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2002' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','3cm x 3cm',1.2,true,null,false,1,5,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2002' and p.supplier ilike 'intexglobal%';

-- PS2003
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2003' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','3.5cm x 4.5cm',1.2,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2003' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Rotary Print Per Position','22.62cm x 18cm',4.2,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2003' and p.supplier ilike 'intexglobal%';

-- PS2006
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2006' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','4cm x 4cm',1.2,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2006' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Rotary Print Per Position','22.93 cm x 20.5 cm',4.2,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2006' and p.supplier ilike 'intexglobal%';

-- PS2007
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2007' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','4.5cm x 4.5cm',1.2,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2007' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Rotary Print Per Position','13cm x 21.36cm',4.2,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2007' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','3.5cm x 9cm',1.0,true,null,false,1,3,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2007' and p.supplier ilike 'intexglobal%';

-- PS2010
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2010' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','4.5cm x 4.5cm',1.2,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2010' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Rotary Print Per Position','22.9cm x 5.5cm',4.2,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2010' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Rotary Print Per Position','22.9cm x 6cm',4.2,true,null,false,1,3,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2010' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engraving Per Position','3.5cm x 4.5cm',1.0,true,null,false,1,4,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2010' and p.supplier ilike 'intexglobal%';

-- PS2011
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2011' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','4.5cm x 4.5cm',1.2,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2011' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Rotary Print Per Position','12cm x 21.36cm',4.2,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2011' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','3.5cm x 9cm',1.0,true,null,false,1,3,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2011' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','3cm x 9cm',1.2,true,null,false,1,4,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2011' and p.supplier ilike 'intexglobal%';

-- PS2012
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2012' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Rotary Print Per Position','22.93cm x 15cm',4.2,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2012' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','3.5 x 4cm',1.2,true,null,true,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2012' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','3 x 8cm',1.0,true,null,false,1,3,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2012' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','3 x 9cm',1.2,true,null,false,1,4,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2012' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','18 x 10cm',1.2,true,null,true,1,5,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2012' and p.supplier ilike 'intexglobal%';

-- PS2013
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2013' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Rotary Print Per Position','18.85cm x 13cm',4.2,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2013' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','4 x 6cm',1.2,true,null,true,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2013' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','3 x 8cm',1.0,true,null,false,1,3,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2013' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','3 x 9cm',1.2,true,null,false,1,4,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2013' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','18 x 10cm',1.2,true,null,true,1,5,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2013' and p.supplier ilike 'intexglobal%';

-- PS2018
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2018' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Rotary Print Per Position','22.93cm x 15cm',4.2,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2018' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','3.5 x 4cm',1.2,true,null,true,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2018' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','3 x 8cm',1.0,true,null,false,1,3,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2018' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','3 x 9cm',1.2,true,null,false,1,4,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2018' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','18 x 10cm',1.2,true,null,true,1,5,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2018' and p.supplier ilike 'intexglobal%';

-- PS2019
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2019' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Rotary Print Per Position','24.4cm x 18.5cm',5.2,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2019' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','3.5 x 4cm',1.2,true,null,true,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2019' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','3 x 8cm',1.0,true,null,false,1,3,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2019' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','3 x 9cm',1.2,true,null,false,1,4,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2019' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','18 x 10cm',1.2,true,null,true,1,5,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2019' and p.supplier ilike 'intexglobal%';

-- PS2020
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2020' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Rotary Print Per Position','24.4cm x 18.5cm',5.2,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2020' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','3.5 x 4cm',1.2,true,null,true,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2020' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','3 x 8cm',1.0,true,null,false,1,3,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2020' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','3 x 9cm',1.2,true,null,false,1,4,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2020' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','18 x 10cm',1.2,true,null,true,1,5,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2020' and p.supplier ilike 'intexglobal%';

-- PS2021
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2021' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Rotary Print Per Position','26.39cm x 21.5cm',5.2,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2021' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','3.5 x 4cm',1.2,true,null,true,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2021' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','3 x 8cm',1.0,true,null,false,1,3,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2021' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','3 x 9cm',1.2,true,null,false,1,4,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2021' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','18 x 10cm',1.2,true,null,true,1,5,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2021' and p.supplier ilike 'intexglobal%';

-- PS2022
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2022' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Rotary Print Per Position','27cm x 3.5cm',4.2,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2022' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','3cm x 4cm',1.0,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2022' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','3cm x 3.5cm',1.2,true,null,false,1,3,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2022' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','3.5cm x 4cm',1.2,true,null,true,1,4,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2022' and p.supplier ilike 'intexglobal%';

-- PS2028
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2028' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Full Digital Rotary Print Per Position','29.85 x 16.5 cm',5.2,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2028' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','3.5 x 4cm',1.2,true,null,true,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2028' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','3 x 8cm',1.0,true,null,false,1,3,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2028' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','3 x 9cm',1.2,true,null,false,1,4,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2028' and p.supplier ilike 'intexglobal%';

-- PS2031
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2031' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Wrap Print Per Position','21cm x 11cm',1.5,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2031' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','3.5 x 4cm',1.2,true,null,true,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2031' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','3 x 8cm',1.0,true,null,false,1,3,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2031' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','3 x 9cm',1.2,true,null,false,1,4,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2031' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','18 x 10cm',1.2,true,null,true,1,5,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2031' and p.supplier ilike 'intexglobal%';

-- PS2223M
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2223M' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Full Colour Digital Print Per Position','7cm x 5cm',1.0,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2223M' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','7cm x 5cm',0.8,true,null,true,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2223M' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Debossing Per Position','7cm x 5cm',0.8,true,null,false,1,3,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2223M' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Additional Colour','per extra colour',0.1,false,null,false,1,4,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2223M' and p.supplier ilike 'intexglobal%';

-- PS2225
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2225' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','4cm x 4cm',1.2,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2225' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','3cm x 4cm',1.0,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2225' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Rotary Print Per Position','23.56 x 5 cm',4.2,true,null,false,1,3,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2225' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','18cm x 5cm',1.2,true,null,true,1,4,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2225' and p.supplier ilike 'intexglobal%';

-- PS2228M
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2228M' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Full Colour Digital Print Per Position','7cm x 5cm',1.0,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2228M' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','7cm x 5cm',0.8,true,null,true,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2228M' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Debossing Per Position','7cm x 5cm',0.8,true,null,false,1,3,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2228M' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Additional Colour','per extra colour',0.1,false,null,false,1,4,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2228M' and p.supplier ilike 'intexglobal%';

-- PS2228S
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2228S' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Full Colour Digital Print Per Position','7cm x 3cm',1.0,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2228S' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','7cm x 3cm',0.8,true,null,true,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2228S' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Debossing Per Position','7cm x 3cm',0.8,true,null,false,1,3,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2228S' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Additional Colour','per extra colour',0.1,false,null,false,1,4,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2228S' and p.supplier ilike 'intexglobal%';

-- PS2232
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2232' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','7cm Diameter',1.2,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2232' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Super Print Per Position','7cm Diameter',0.75,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2232' and p.supplier ilike 'intexglobal%';

-- PS2301
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2301' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','4cm x 4cm',1.2,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2301' and p.supplier ilike 'intexglobal%';

-- PS2401LB
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2401LB' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','4 x 4cm',1.2,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2401LB' and p.supplier ilike 'intexglobal%';

-- PS2501
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2501' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Sublimation Print Per Position','19cm x 7cm',1.5,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2501' and p.supplier ilike 'intexglobal%';

-- PS2502
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2502' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Sublimation Print Per Position','19cm x 7cm',1.5,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2502' and p.supplier ilike 'intexglobal%';

-- PS2810
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2810' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','4cm x 4.5cm',1.0,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2810' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Super Print Sticker Per Position','6cm x 4.5cm',0.75,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS2810' and p.supplier ilike 'intexglobal%';

-- PS3101
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS3101' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','7.5cm x 0.8cm',0.8,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS3101' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Debossing Per Position','7.5cm x 0.8cm',0.8,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS3101' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Inkfill Per Position','7.5cm x 0.8cm',1.5,true,null,false,1,3,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS3101' and p.supplier ilike 'intexglobal%';

-- PS3109
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS3109' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','7.5cm x 0.8cm',0.8,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS3109' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Debossing Per Position','7.5cm x 0.8cm',0.8,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS3109' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Inkfill Per Position','7.5cm x 0.8cm',1.5,true,null,false,1,3,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS3109' and p.supplier ilike 'intexglobal%';

-- PS3121
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS3121' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','10cm x 2cm',0.8,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS3121' and p.supplier ilike 'intexglobal%';

-- PS3304
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS3304' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','15cm Diameter',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS3304' and p.supplier ilike 'intexglobal%';

-- PS3306
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS3306' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','All Over',1.2,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS3306' and p.supplier ilike 'intexglobal%';

-- PS3310
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS3310' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','All Over',1.2,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS3310' and p.supplier ilike 'intexglobal%';

-- PS4001
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4001' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','20cm x 20cm',2.3,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4001' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','20cm x 20cm',0.4,true,null,true,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4001' and p.supplier ilike 'intexglobal%';

-- PS4001L
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4001L' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Full Colour Sublimation Per Position','All Over',1.5,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4001L' and p.supplier ilike 'intexglobal%';

-- PS4002
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4002' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','25cm x 25cm',2.3,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4002' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','25cm x 25cm',0.4,true,null,true,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4002' and p.supplier ilike 'intexglobal%';

-- PS4003
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4003' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','25cm x 25cm',2.3,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4003' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','25cm x 25cm',0.4,true,null,true,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4003' and p.supplier ilike 'intexglobal%';

-- PS4004
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4004' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','10cm x 20cm',2.3,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4004' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','10cm x 20cm',0.4,true,null,true,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4004' and p.supplier ilike 'intexglobal%';

-- PS4004L
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4004L' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Full Colour Sublimation Per Position','All Over',1.5,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4004L' and p.supplier ilike 'intexglobal%';

-- PS4010
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4010' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','20cm x 20cm',2.3,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4010' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','20cm x 20cm',0.4,true,null,true,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4010' and p.supplier ilike 'intexglobal%';

-- PS4010L
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4010L' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Full Colour Sublimation Per Position','All Over',1.5,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4010L' and p.supplier ilike 'intexglobal%';

-- PS4011
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4011' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','25cm x 20cm',2.3,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4011' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','25cm x 20cm',0.4,true,null,true,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4011' and p.supplier ilike 'intexglobal%';

-- PS4011L
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4011L' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Full Colour Sublimation Per Position','All Over',1.5,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4011L' and p.supplier ilike 'intexglobal%';

-- PS4012
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4012' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','25cm x 25cm',2.3,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4012' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','25cm x 25cm',0.4,true,null,true,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4012' and p.supplier ilike 'intexglobal%';

-- PS4026
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4026' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','13cm x 17cm',2.3,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4026' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','13cm x 17cm',0.4,true,null,true,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4026' and p.supplier ilike 'intexglobal%';

-- PS4031
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4031' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','24cm x 23cm',2.3,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4031' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','24cm x 23cm',0.4,true,null,true,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4031' and p.supplier ilike 'intexglobal%';

-- PS4101
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4101' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','25cm x 25cm',2.3,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4101' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','25cm x 25cm',0.7,true,null,true,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4101' and p.supplier ilike 'intexglobal%';

-- PS4102
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4102' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','25cm x 25cm',2.3,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4102' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','25cm x 25cm',0.7,true,null,true,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4102' and p.supplier ilike 'intexglobal%';

-- PS4103
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4103' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','25cm x 25cm',2.3,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4103' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','25cm x 25cm',0.7,true,null,true,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4103' and p.supplier ilike 'intexglobal%';

-- PS4104
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4104' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','25cm x 25cm',2.3,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4104' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','25cm x 25cm',0.7,true,null,true,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4104' and p.supplier ilike 'intexglobal%';

-- PS4105
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4105' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','25cm x 25cm',2.3,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4105' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','25cm x 25cm',0.7,true,null,true,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4105' and p.supplier ilike 'intexglobal%';

-- PS4106
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4106' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','25cm x 25cm',2.3,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4106' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','25cm x 25cm',0.7,true,null,true,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4106' and p.supplier ilike 'intexglobal%';

-- PS4107
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4107' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','25cm x 25cm',2.3,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4107' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','25cm x 25cm',0.7,true,null,true,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4107' and p.supplier ilike 'intexglobal%';

-- PS4108
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4108' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','25cm x 25cm',2.3,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4108' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','25cm x 25cm',0.7,true,null,true,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4108' and p.supplier ilike 'intexglobal%';

-- PS4111
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4111' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','25cm x 25cm',2.3,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4111' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','25cm x 25cm',0.7,true,null,true,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4111' and p.supplier ilike 'intexglobal%';

-- PS4112
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4112' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','25cm x 25cm',2.3,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4112' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','25cm x 25cm',0.7,true,null,true,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4112' and p.supplier ilike 'intexglobal%';

-- PS4113
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4113' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','25cm x 25cm',2.3,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4113' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','25cm x 25cm',0.7,true,null,true,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4113' and p.supplier ilike 'intexglobal%';

-- PS4202
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4202' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','25cm x 25cm',2.3,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4202' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','25cm x 25cm',0.7,true,null,true,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4202' and p.supplier ilike 'intexglobal%';

-- PS4202C
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4202C' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','25cm x 25cm',2.3,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4202C' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','25cm x 25cm',0.7,true,null,true,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4202C' and p.supplier ilike 'intexglobal%';

-- PS4203
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4203' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','25cm x 25cm',2.3,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4203' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','25cm x 25cm',0.7,true,null,true,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4203' and p.supplier ilike 'intexglobal%';

-- PS4204
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4204' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','10cm x 10cm',2.3,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4204' and p.supplier ilike 'intexglobal%';

-- PS4205
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4205' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','25cm x 25cm',2.3,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4205' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','25cm x 25cm',0.7,true,null,true,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4205' and p.supplier ilike 'intexglobal%';

-- PS4205C
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4205C' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','25cm x 25cm',2.3,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4205C' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','25cm x 25cm',0.7,true,null,true,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4205C' and p.supplier ilike 'intexglobal%';

-- PS4206
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4206' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','25cm x 25cm',2.3,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4206' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','25cm x 25cm',0.7,true,null,true,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4206' and p.supplier ilike 'intexglobal%';

-- PS4206C
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4206C' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','25cm x 25cm',2.3,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4206C' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','25cm x 25cm',0.7,true,null,true,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4206C' and p.supplier ilike 'intexglobal%';

-- PS4207
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4207' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','25cm x 25cm',2.3,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4207' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','25cm x 25cm',0.7,true,null,true,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4207' and p.supplier ilike 'intexglobal%';

-- PS4209
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4209' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','25cm x 25cm',2.3,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4209' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','25cm x 25cm',0.7,true,null,true,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4209' and p.supplier ilike 'intexglobal%';

-- PS4210
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4210' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','25cm x 25cm',2.3,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4210' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','25cm x 25cm',0.7,true,null,true,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4210' and p.supplier ilike 'intexglobal%';

-- PS4211
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4211' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','16cm x 24cm',2.3,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4211' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','16cm x 24cm',0.7,true,null,true,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4211' and p.supplier ilike 'intexglobal%';

-- PS4305
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4305' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','14cm x 14cm',2.3,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4305' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','14cm x 14cm',0.4,true,null,true,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4305' and p.supplier ilike 'intexglobal%';

-- PS4306
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4306' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','12cm x 6cm',2.3,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4306' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','12cm x 6cm',0.7,true,null,true,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4306' and p.supplier ilike 'intexglobal%';

-- PS4310
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4310' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','10cm x 7.5cm',2.3,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4310' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','10cm x 7.5cm',0.4,true,null,true,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4310' and p.supplier ilike 'intexglobal%';

-- PS4350
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4350' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Vinyl Label Per Position','15cm x 15cm',10.0,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4350' and p.supplier ilike 'intexglobal%';

-- PS4351
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4351' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Vinyl Label Per Position','15cm x 9.5cm',10.0,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4351' and p.supplier ilike 'intexglobal%';

-- PS4352
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4352' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Vinyl Label Per Position','11cm x 7cm',10.0,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4352' and p.supplier ilike 'intexglobal%';

-- PS4353
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4353' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Vinyl Label Per Position','15cm x 9.5cm',10.0,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4353' and p.supplier ilike 'intexglobal%';

-- PS4355
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4355' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Vinyl Label Per Position','15cm x 9.5cm',10.0,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4355' and p.supplier ilike 'intexglobal%';

-- PS4356
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4356' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Vinyl Label Per Position','13cm x 8cm',10.0,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4356' and p.supplier ilike 'intexglobal%';

-- PS4401
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4401' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','18cm x 18cm',2.3,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4401' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','18cm x 18cm',0.7,true,null,true,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4401' and p.supplier ilike 'intexglobal%';

-- PS4402
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4402' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','20cm x 20cm',2.3,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4402' and p.supplier ilike 'intexglobal%';

-- PS4506
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4506' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','25cm x 18cm',2.3,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4506' and p.supplier ilike 'intexglobal%';

-- PS4507
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4507' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','25cm x 18cm',2.3,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4507' and p.supplier ilike 'intexglobal%';

-- PS4510
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4510' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','25cm x 15cm',2.3,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4510' and p.supplier ilike 'intexglobal%';

-- PS4512
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4512' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','25cm x 25cm',2.3,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4512' and p.supplier ilike 'intexglobal%';

-- PS4513
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4513' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','25cm x 25cm',2.3,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4513' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','25cm x 25cm',0.7,true,null,true,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4513' and p.supplier ilike 'intexglobal%';

-- PS4514
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4514' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','25cm x 25cm',2.3,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4514' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','25cm x 25cm',0.7,true,null,true,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4514' and p.supplier ilike 'intexglobal%';

-- PS4601L
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4601L' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','20cm x 20cm',2.3,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4601L' and p.supplier ilike 'intexglobal%';

-- PS4601LS
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4601LS' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','20cm x 20cm',2.3,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4601LS' and p.supplier ilike 'intexglobal%';

-- PS4601M
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4601M' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','20cm x 20cm',2.3,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4601M' and p.supplier ilike 'intexglobal%';

-- PS4601S
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4601S' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','15cm x 15cm',2.3,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4601S' and p.supplier ilike 'intexglobal%';

-- PS4602L
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4602L' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','20cm x 20cm',2.3,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4602L' and p.supplier ilike 'intexglobal%';

-- PS4602LS
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4602LS' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','20cm x 20cm',2.3,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4602LS' and p.supplier ilike 'intexglobal%';

-- PS4602S
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4602S' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','20cm x 20cm',2.3,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4602S' and p.supplier ilike 'intexglobal%';

-- PS4701
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4701' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','28cm x 28cm',0.4,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4701' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','28cm x 28cm',2.3,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4701' and p.supplier ilike 'intexglobal%';

-- PS4811
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4811' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','17cm x 15cm',2.3,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4811' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','15cm x 15cm',0.7,true,null,true,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS4811' and p.supplier ilike 'intexglobal%';

-- PS5002
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS5002' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Front Per Position','3cm x 1.5cm',1.2,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS5002' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Back Per Position','3.5cm x 1.5cm',1.2,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS5002' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Epoxy Dome Per Position','3.5cm x 1.5cm',1.4,true,null,false,1,3,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS5002' and p.supplier ilike 'intexglobal%';

-- PS5004
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS5004' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Front Per Position','3.5cm x 1.3cm',1.2,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS5004' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Back Per Position','4cm x 1.3cm',1.2,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS5004' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Epoxy Dome Per Position','3.5cm x 1.3cm',1.4,true,null,false,1,3,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS5004' and p.supplier ilike 'intexglobal%';

-- PS500X18
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS500X18' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','4cm x 4cm',1.2,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS500X18' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','2.5cm x 7cm',1.5,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS500X18' and p.supplier ilike 'intexglobal%';

-- PS500X249
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS500X249' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Embroidery Per Position','3cm x 7.5cm',3.0,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS500X249' and p.supplier ilike 'intexglobal%';

-- PS500X54
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS500X54' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Full Colour Print Per Position','19.5cm x 30.5cm',1.2,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS500X54' and p.supplier ilike 'intexglobal%';

-- PS500X55
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS500X55' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Full Colour Print Per Position','9cm x 18cm',1.2,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS500X55' and p.supplier ilike 'intexglobal%';

-- PS5010
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS5010' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','2.5cm x 1.3cm',1.2,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS5010' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Epoxy Dome Per Position','2.5cm x 1.3cm',1.4,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS5010' and p.supplier ilike 'intexglobal%';

-- PS5023
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS5023' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','3.5cm x 1.2cm',1.2,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS5023' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Epoxy Dome Per Position','3.5cm x 1.2cm',1.4,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS5023' and p.supplier ilike 'intexglobal%';

-- PS5051
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS5051' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Custom Woven Label Per Position','Upto 10cm x 4cm',1.2,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS5051' and p.supplier ilike 'intexglobal%';

-- PS5052
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS5052' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Custom Woven Label Per Position','Upto 10cm x 4cm',1.2,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS5052' and p.supplier ilike 'intexglobal%';

-- PS5053
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS5053' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Custom Woven Label Per Position','Upto 10cm x 4cm',1.2,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS5053' and p.supplier ilike 'intexglobal%';

-- PS5054
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS5054' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Custom Woven Label Per Position','Upto 10cm x 4cm',1.2,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS5054' and p.supplier ilike 'intexglobal%';

-- PS5071
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS5071' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','1.5cm x 1cm',1.2,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS5071' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Epoxy Dome Per Position','1.5cm x 1cm',1.4,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS5071' and p.supplier ilike 'intexglobal%';

-- PS5092
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS5092' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Front Per Position','2.5cm x 1.5cm',1.2,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS5092' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Back Per Position','3.5cm x 1.5cm',1.2,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS5092' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Epoxy Dome Per Position','2.5cm x 1.5cm',1.4,true,null,false,1,3,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS5092' and p.supplier ilike 'intexglobal%';

-- PS5100
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS5100' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'All over Jacquard (no size) Per Position','',1.5,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS5100' and p.supplier ilike 'intexglobal%';

-- PS5102
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS5102' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Custom Jacquard Per Position','All over',1.5,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS5102' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Custom Gripper Per Position','19 x 6 cm',1.5,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS5102' and p.supplier ilike 'intexglobal%';

-- PS5103
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS5103' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Custom Jacquard Design Per Position','',1.5,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS5103' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Custom Silicone Grip Per Position','',1.5,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS5103' and p.supplier ilike 'intexglobal%';

-- PS5110
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS5110' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'All over Jacquard Per Position','',1.5,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS5110' and p.supplier ilike 'intexglobal%';

-- PS5111
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS5111' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'All over Jacquard Per Position','',1.5,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS5111' and p.supplier ilike 'intexglobal%';

-- PS5112
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS5112' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'All over Sublimation Per Position','',1.5,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS5112' and p.supplier ilike 'intexglobal%';

-- PS5115
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS5115' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Full Colour Print Per Position','All over One Side',1.2,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS5115' and p.supplier ilike 'intexglobal%';

-- PS5302
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS5302' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','3.5cm x 1cm',1.2,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS5302' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Epoxy Dome Per Position','3.5cm x 1cm',1.4,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS5302' and p.supplier ilike 'intexglobal%';

-- PS5303
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS5303' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Front Per Position','3.2cm x 1.3cm',1.2,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS5303' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Epoxy Dome Per Position','3.2cm x 1.3cm',1.4,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS5303' and p.supplier ilike 'intexglobal%';

-- PS60011
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS60011' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','40 x 0.7cm (One Side)',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS60011' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Print Per Position','40 x 0.7cm (One Side)',2.3,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS60011' and p.supplier ilike 'intexglobal%';

-- PS60031
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS60031' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','40 x 2.1cm (One Side)',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS60031' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Print Per Position','40 x 2.1cm (One Side)',2.3,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS60031' and p.supplier ilike 'intexglobal%';

-- PS60051
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS60051' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Sublimation Per Position','All Over',1.5,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS60051' and p.supplier ilike 'intexglobal%';

-- PS60052
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS60052' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Sublimation Per Position','All Over',1.5,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS60052' and p.supplier ilike 'intexglobal%';

-- PS6010
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS6010' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','1.4cm x 37cm',2.3,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS6010' and p.supplier ilike 'intexglobal%';

-- PS6011
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS6011' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','9.2cm x 6cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS6011' and p.supplier ilike 'intexglobal%';

-- PS6012
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS6012' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','6cm x 10cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS6012' and p.supplier ilike 'intexglobal%';

-- PS7001
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS7001' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','6cm x 4cm',0.8,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS7001' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Debossing Per Position','6cm x 4cm',1.5,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS7001' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','10cm x 17cm',1.5,true,null,false,1,3,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS7001' and p.supplier ilike 'intexglobal%';

-- PS7005
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS7005' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','6cm x 4cm',0.8,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS7005' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Debossing Per Position','6cm x 4cm',0.8,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS7005' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','10cm x 17cm',1.5,true,null,false,1,3,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS7005' and p.supplier ilike 'intexglobal%';

-- PS7006
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS7006' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','6cm x 4cm',0.8,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS7006' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Debossing Per Position','6cm x 4cm',1.5,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS7006' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','10cm x 17cm',1.2,true,null,false,1,3,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS7006' and p.supplier ilike 'intexglobal%';

-- PS7009
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS7009' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','4cm x 6cm',0.8,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS7009' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Debossing Per Position','4cm x 6cm',0.8,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS7009' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','10cm x 17cm',1.5,true,null,false,1,3,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS7009' and p.supplier ilike 'intexglobal%';

-- PS7011
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS7011' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','6cm x 4cm',0.8,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS7011' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Debossing Per Position','6cm x 4cm',1.5,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS7011' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','10cm x 17cm',1.5,true,null,false,1,3,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS7011' and p.supplier ilike 'intexglobal%';

-- PS7013
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS7013' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','10cm x 17cm',1.5,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS7013' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Debossing Per Position','6cm x 4cm',0.8,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS7013' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','6cm x 4cm',0.8,true,null,true,1,3,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS7013' and p.supplier ilike 'intexglobal%';

-- PS7015
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS7015' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','6cm x 4cm',0.8,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS7015' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Silver Foil Debossing Per Position','6cm x 4cm',1.5,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS7015' and p.supplier ilike 'intexglobal%';

-- PS7020
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS7020' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','6cm x 4cm',0.8,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS7020' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','6cm x 4cm',1.0,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS7020' and p.supplier ilike 'intexglobal%';

-- PS7105
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS7105' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Print Size only Per Position','17cm x 9cm (method not named - artwork template)',1.5,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS7105' and p.supplier ilike 'intexglobal%';

-- PS8001
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS8001' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','8cm x 4cm',1.0,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS8001' and p.supplier ilike 'intexglobal%';

-- PS8002
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS8002' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','8cm x 4cm',1.0,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS8002' and p.supplier ilike 'intexglobal%';

-- PS8015
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS8015' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','10cm x 7cm',0.8,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS8015' and p.supplier ilike 'intexglobal%';

-- PS8016
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS8016' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','32cm x 7cm',0.8,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS8016' and p.supplier ilike 'intexglobal%';

-- PS8017
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS8017' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','65cm x 20cm',0.8,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS8017' and p.supplier ilike 'intexglobal%';

-- PS8102
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS8102' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Sublimation Print Per Position','22.8cm x 13.1cm',1.5,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS8102' and p.supplier ilike 'intexglobal%';

-- PS8103
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS8103' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Full Colour Rotary Print Per Position','24.5cm x 8cm',3.25,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS8103' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','3cm x 7cm',1.0,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS8103' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','3.5cm x 4cm',1.2,true,null,true,1,3,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS8103' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','3cm x 8cm',1.2,true,null,false,1,4,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS8103' and p.supplier ilike 'intexglobal%';

-- PS8113
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS8113' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Sublimation Print Per Position','17.5cm x 11cm',1.5,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS8113' and p.supplier ilike 'intexglobal%';

-- PS8115
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS8115' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Sublimation Print Per Position','22.8cm x 13.1cm',1.5,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS8115' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Print Additional Colour','per extra colour',0.1,false,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS8115' and p.supplier ilike 'intexglobal%';

-- PS8116
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS8116' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','9cm x 6cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS8116' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Print Additional Colour','per extra colour',0.1,false,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS8116' and p.supplier ilike 'intexglobal%';

-- PS8117
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS8117' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Sublimation Print Per Position','22.8cm x 13.1cm',1.5,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS8117' and p.supplier ilike 'intexglobal%';

-- PS8118
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS8118' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','6cm x 9cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS8118' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Print Additional Colour','per extra colour',0.1,false,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS8118' and p.supplier ilike 'intexglobal%';

-- PS8119
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS8119' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Sublimation Print Per Position','All over',1.5,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS8119' and p.supplier ilike 'intexglobal%';

-- PS8120
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS8120' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Sublimation Print Per Position','All Over',1.5,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS8120' and p.supplier ilike 'intexglobal%';

-- PS8121
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS8121' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Sublimation Print Per Position','All over',1.5,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS8121' and p.supplier ilike 'intexglobal%';

-- PS8122
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS8122' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Sublimation Print Per Position','All over',1.5,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS8122' and p.supplier ilike 'intexglobal%';

-- PS8312
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS8312' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','1cm x 5cm',0.5,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS8312' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','1cm x 5cm',1.0,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS8312' and p.supplier ilike 'intexglobal%';

-- PS8322
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS8322' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','0.8 x 4cm',0.5,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS8322' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','0.8 x 4cm',0.65,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS8322' and p.supplier ilike 'intexglobal%';

-- PS8330
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS8330' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','6.5cm x 3cm',1.2,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS8330' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','6.5cm x 3cm',0.6,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS8330' and p.supplier ilike 'intexglobal%';

-- PS8340
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS8340' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Front Per Colour/Position','3cm x 2.5cm',0.5,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS8340' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Front Per Position','3cm x 2.5cm',1.2,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS8340' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Back Per Position','3cm x 2.5cm',0.65,true,null,false,1,3,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS8340' and p.supplier ilike 'intexglobal%';

-- PS8401
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS8401' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','4cm x 4cm',0.3,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS8401' and p.supplier ilike 'intexglobal%';

-- PS8402
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS8402' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','2.2cm x 4cm',0.3,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS8402' and p.supplier ilike 'intexglobal%';

-- PS8501
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS8501' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','100cm x 30cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS8501' and p.supplier ilike 'intexglobal%';

-- PS8503
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS8503' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','80cm x 30cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS8503' and p.supplier ilike 'intexglobal%';

-- PS8510
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS8510' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Embroidery Per Position','15cm x 7cm',4.0,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS8510' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','29cm x 8cm',2.3,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS8510' and p.supplier ilike 'intexglobal%';

-- PS8511
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS8511' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Embroidery Per Position','15cm x 7cm',4.0,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS8511' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','15cm x 20cm',2.3,true,null,false,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS8511' and p.supplier ilike 'intexglobal%';

-- PS8774
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS8774' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Sublimation Per Position','All Over',1.5,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS8774' and p.supplier ilike 'intexglobal%';

-- PS9003
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS9003' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','3.5cm x 3.5cm',0.8,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS9003' and p.supplier ilike 'intexglobal%';

-- PS9004
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS9004' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','1.5cm x 7cm',0.8,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS9004' and p.supplier ilike 'intexglobal%';

-- PS9107
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS9107' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Full Colour Print Per Position','All over One Side',1.2,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS9107' and p.supplier ilike 'intexglobal%';

-- PS9111
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS9111' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Sublimation Per Position','All Over',1.5,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS9111' and p.supplier ilike 'intexglobal%';

-- PS9120
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS9120' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Label Per Position','6 x 9cm',0.35,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS9120' and p.supplier ilike 'intexglobal%';

-- PS9122
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS9122' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','14cm x 4.5cm',2.3,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS9122' and p.supplier ilike 'intexglobal%';

-- PS9127
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS9127' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Full Colour Print Per Position','All over One Side',1.2,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS9127' and p.supplier ilike 'intexglobal%';

-- PS9202
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS9202' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','10 x 10cm',1.5,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS9202' and p.supplier ilike 'intexglobal%';

-- PS9204
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS9204' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','2.5 x 1.2cm',0.65,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS9204' and p.supplier ilike 'intexglobal%';

-- PS9211
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS9211' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','4 x 1.5cm',1.2,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS9211' and p.supplier ilike 'intexglobal%';

-- PS9212
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS9212' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Full Colour Label Per Position','6.5 x 1.7cm',1.2,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS9212' and p.supplier ilike 'intexglobal%';

-- PS9220
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS9220' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','15cm x 6cm',0.8,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS9220' and p.supplier ilike 'intexglobal%';

-- PS9301
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS9301' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Laser Engrave Per Position','5.5cm Diameter',1.1,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS9301' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','5.5cm Diameter',0.5,true,null,true,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS9301' and p.supplier ilike 'intexglobal%';

-- PS9403
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS9403' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','2cm x 4.5cm',1.2,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS9403' and p.supplier ilike 'intexglobal%';

-- PS9449
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS9449' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','2.5cm x 1.5cm',0.5,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS9449' and p.supplier ilike 'intexglobal%';

-- PS9451
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS9451' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','5.5cm Diameter',1.2,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PS9451' and p.supplier ilike 'intexglobal%';

-- PSBB03
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PSBB03' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','25cm x 25cm',2.3,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PSBB03' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','25cm x 25cm',0.4,true,null,true,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PSBB03' and p.supplier ilike 'intexglobal%';

-- PSBB04
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PSBB04' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Transfer Per Position','10cm x 20cm',2.3,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PSBB04' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','10cm x 20cm',0.4,true,null,true,1,2,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PSBB04' and p.supplier ilike 'intexglobal%';

-- PSSUN01
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PSSUN01' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Full Colour Label Per Position','2.1cm x 4.4cm',0.1,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PSSUN01' and p.supplier ilike 'intexglobal%';

-- PSSUN02
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PSSUN02' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Full Colour Label Per Position','2.1cm x 4.4cm',0.1,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PSSUN02' and p.supplier ilike 'intexglobal%';

-- PSSUN03
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PSSUN03' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Full Colour Label Per Position','2.7cm x 5cm',0.1,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PSSUN03' and p.supplier ilike 'intexglobal%';

-- PSSUN04
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PSSUN04' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Full Colour Label Per Position','2.7cm x 5cm',0.1,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PSSUN04' and p.supplier ilike 'intexglobal%';

-- PSSUN05
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PSSUN05' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Full Colour Label Per Position','2.1cm x 4.4cm',0.1,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PSSUN05' and p.supplier ilike 'intexglobal%';

-- PSSUN06
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PSSUN06' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Full Colour Label Per Position','2.7cm x 5cm',0.1,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PSSUN06' and p.supplier ilike 'intexglobal%';

-- PSSUN07
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PSSUN07' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Full Colour Label Per Position','2.7cm x 5cm',0.1,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PSSUN07' and p.supplier ilike 'intexglobal%';

-- PSSUN08
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PSSUN08' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Full Colour Label Per Position','6cm x 8cm',0.1,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='PSSUN08' and p.supplier ilike 'intexglobal%';

-- RUKY01
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='RUKY01' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Custom (no size) Per Position','',1.5,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='RUKY01' and p.supplier ilike 'intexglobal%';

-- SCSE04
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='SCSE04' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','20 x 20cm',0.8,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='SCSE04' and p.supplier ilike 'intexglobal%';

-- SPBD31
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='SPBD31' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','14 x 4cm',0.8,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='SPBD31' and p.supplier ilike 'intexglobal%';

-- STRS02
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='STRS02' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','3cm',1.2,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='STRS02' and p.supplier ilike 'intexglobal%';

-- STRS03
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='STRS03' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','4 x 2cm',1.2,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='STRS03' and p.supplier ilike 'intexglobal%';

-- STRS04
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='STRS04' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','3cm',1.2,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='STRS04' and p.supplier ilike 'intexglobal%';

-- STRS14
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='STRS14' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','5 x 2cm',1.2,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='STRS14' and p.supplier ilike 'intexglobal%';

-- STRS29
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='STRS29' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','2cm front 1cm',0.8,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='STRS29' and p.supplier ilike 'intexglobal%';

-- STRS34
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='STRS34' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','4 x 2cm',0.8,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='STRS34' and p.supplier ilike 'intexglobal%';

-- STRS41
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='STRS41' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','3cm',0.8,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='STRS41' and p.supplier ilike 'intexglobal%';

-- SUNG03
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='SUNG03' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Pad Print Per Colour/Position','1 x 0.6cm',0.8,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='SUNG03' and p.supplier ilike 'intexglobal%';

-- TRAV07
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='TRAV07' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Debossing Per Position','3 x 5cm',0.8,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='TRAV07' and p.supplier ilike 'intexglobal%';

-- UMBB01
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='UMBB01' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','30cm x 30cm',1.2,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='UMBB01' and p.supplier ilike 'intexglobal%';

-- UMBR01
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='UMBR01' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','20 x 20cm',1.2,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='UMBR01' and p.supplier ilike 'intexglobal%';

-- UMBR03
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='UMBR03' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','20 x 12cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='UMBR03' and p.supplier ilike 'intexglobal%';

-- UMBR04
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='UMBR04' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','20 x 20cm',1.2,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='UMBR04' and p.supplier ilike 'intexglobal%';

-- UMBR07
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='UMBR07' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Screen Print Per Colour/Position','20cm x 20cm',0.7,true,null,true,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='UMBR07' and p.supplier ilike 'intexglobal%';

-- UMBR10
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='UMBR10' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Digital Print Per Position','20cm x 20cm',1.2,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='UMBR10' and p.supplier ilike 'intexglobal%';

-- WPPB01
delete from decoration_options d using products p where d.product_id=p.id and upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='WPPB01' and p.supplier ilike 'intexglobal%';
insert into decoration_options (product_id,name,detail,per_unit,has_setup,setup_fee,setup_qty_editable,default_setup_qty,sort_order,type) select p.id,'Sublimation Per Position','All Over',1.5,true,null,false,1,1,'branding' from products p where upper(regexp_replace(p.supplier_sku,'[^A-Za-z0-9]','','g'))='WPPB01' and p.supplier ilike 'intexglobal%';


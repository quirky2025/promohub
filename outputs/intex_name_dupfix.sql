-- INTEX 重复词命名修正(30个)。只改 name。整块跑一次。
update products set name='Helios Foldable Car Sun Visor' where supplier_sku='AUTO03' and supplier ilike 'intexglobal%';
update products set name='Shadex Foldable Car Sunshade' where supplier_sku='AUTO06' and supplier ilike 'intexglobal%';
update products set name='Astro Side Window Car Sunshade' where supplier_sku='AUTO21' and supplier ilike 'intexglobal%';
update products set name='Coloured Cotton Tote Bag' where supplier_sku='CALB20' and supplier ilike 'intexglobal%';
update products set name='Chill Wine Bag With Gel' where supplier_sku='LIFE110' and supplier ilike 'intexglobal%';
update products set name='Heat Sealed Non-Woven Exhibition Tote Bag' where supplier_sku='NWTB3391' and supplier ilike 'intexglobal%';
update products set name='Frostbite Jumbo 30-Can Cooler Bag' where supplier_sku='OC24X148' and supplier ilike 'intexglobal%';
update products set name='AMG Folding Car Sunshade' where supplier_sku='OC30X168' and supplier ilike 'intexglobal%';
update products set name='Big Drawstring Shoe Pouch' where supplier_sku='OC35X230' and supplier ilike 'intexglobal%';
update products set name='Bamboo Tote Bag' where supplier_sku='OC514' and supplier ilike 'intexglobal%';
update products set name='Non-Woven Essential Briefcase Tote With Zipper Closure' where supplier_sku='OCBAB104' and supplier ilike 'intexglobal%';
update products set name='1 Bottle White Kraft Paper Wine Tote' where supplier_sku='OCBAB112' and supplier ilike 'intexglobal%';
update products set name='Cotton Wine Bottle Gift Tote' where supplier_sku='OCBBC108' and supplier ilike 'intexglobal%';
update products set name='Full Colour Printed Drawstring Backpack' where supplier_sku='OCBMS115' and supplier ilike 'intexglobal%';
update products set name='Single Bottle Wine Bag' where supplier_sku='OCBMS118' and supplier ilike 'intexglobal%';
update products set name='Drawstring Cooler Pack' where supplier_sku='OCBMS152' and supplier ilike 'intexglobal%';
update products set name='Canvas Drawstring Wine Gift Bag' where supplier_sku='OCBMS158' and supplier ilike 'intexglobal%';
update products set name='Non-Woven Polypropylene 4-Bottle Wine Tote Bag' where supplier_sku='OCWINETOTE4' and supplier ilike 'intexglobal%';
update products set name='Sticky Note Book' where supplier_sku='PS1341' and supplier ilike 'intexglobal%';
update products set name='Pom Pom Beanie' where supplier_sku='PS5053' and supplier ilike 'intexglobal%';
update products set name='Dye Sublimation Stubby Cooler Standard' where supplier_sku='PS8102' and supplier ilike 'intexglobal%';
update products set name='Sublimated Stubby With Magnets' where supplier_sku='PS8113' and supplier ilike 'intexglobal%';
update products set name='Stubby Cooler Without Base' where supplier_sku='PS8115' and supplier ilike 'intexglobal%';
update products set name='Neoprene Stubby Cooler Premium' where supplier_sku='PS8116' and supplier ilike 'intexglobal%';
update products set name='Neoprene Stubby Cooler Collapsible' where supplier_sku='PS8118' and supplier ilike 'intexglobal%';
update products set name='Collapsible Sublimation Stubby Cooler' where supplier_sku='PS8119' and supplier ilike 'intexglobal%';
update products set name='Slap Can Stubby Coolers' where supplier_sku='PS8120' and supplier ilike 'intexglobal%';
update products set name='Wavy Silicone Phone Wallet' where supplier_sku='PS9003' and supplier ilike 'intexglobal%';
update products set name='Phone Wallet Standard No Earbud' where supplier_sku='PS9004' and supplier ilike 'intexglobal%';
update products set name='Silicone Collapsible Pet Bowl' where supplier_sku='PS9451' and supplier ilike 'intexglobal%';

-- 核对
select supplier_sku, name from products where supplier ilike 'intexglobal%' and supplier_sku in ('AUTO03','AUTO06','AUTO21','CALB20','LIFE110','NWTB3391','OC24X148','OC30X168','OC35X230','OC514','OCBAB104','OCBAB112','OCBBC108','OCBMS115','OCBMS118','OCBMS152','OCBMS158','OCWINETOTE4','PS1341','PS5053','PS8102','PS8113','PS8115','PS8116','PS8118','PS8119','PS8120','PS9003','PS9004','PS9451') order by supplier_sku;

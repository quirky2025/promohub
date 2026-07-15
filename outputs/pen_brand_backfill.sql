-- 品牌回填:从名字认品牌写进 brand 列(BRAND filter 需要它;也是"Shop by Brand"品牌落地页的基础)。
-- ⚠️ 已移除 Parker —— "TRENDSWEAR Parker ...Shirt" 是衬衫款式名,不是 Parker 笔品牌(库里无真 Parker 笔)。
-- 这些品牌跨品类(Swiss Peak 有包/杯/服装等),回填不限类目 = 正确。

-- ── STEP 1: 预览 ──
select
  case
    when name ilike '%pierre cardin%' then 'Pierre Cardin'
    when name ilike '%moleskine%'     then 'Moleskine'
    when name ilike '%swiss peak%'    then 'Swiss Peak'
    when name ~* '\mlamy\M'           then 'LAMY'
  end as new_brand,
  supplier_sku, name, brand as current_brand, category
from products
where is_published = true
  and ( name ilike '%pierre cardin%' or name ilike '%moleskine%'
        or name ilike '%swiss peak%' or name ~* '\mlamy\M' )
order by new_brand, name;

-- ── STEP 2: 回填(只在与现值不同才写)──
update products set brand='Pierre Cardin' where name ilike '%pierre cardin%' and coalesce(brand,'') <> 'Pierre Cardin';
update products set brand='Moleskine'     where name ilike '%moleskine%'     and coalesce(brand,'') <> 'Moleskine';
update products set brand='Swiss Peak'    where name ilike '%swiss peak%'    and coalesce(brand,'') <> 'Swiss Peak';
update products set brand='LAMY'          where name ~* '\mlamy\M'           and coalesce(brand,'') <> 'LAMY';

-- ── STEP 3: Cross 品牌【单独人工审阅】(名字含 cross 的大多是 crossbody 包,不是 Cross 笔)──
select supplier_sku, name, brand, category, subcategory
from products
where is_published = true and name ~* '\mcross\M'
order by category, name;

-- ── STEP 4: 核对 ──
select brand, count(*) n from products
where brand in ('Pierre Cardin','Moleskine','Swiss Peak','LAMY','Bic')
group by brand order by n desc;

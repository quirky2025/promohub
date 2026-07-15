-- READONLY:统计笔类型分布(为"拆 Ballpoint、按类型分子类"做依据)。不改数据。
-- 只按名字判类型;认不出的落进 Unclassified(需查描述或手动)。

-- ① 类型分布(group by 1 = 按第一列/CASE 分组)
select
  case
    when name ~* '\mgel\M' then 'Gel'
    when name ~* 'roller ?ball|rolling ball' then 'Rollerball'
    when name ~* 'ball ?point|ball pen' then 'Ballpoint'
    when name ~* '\mstylus\M' then 'Stylus'
    when name ~* 'highlighter' then 'Highlighter'
    when name ~* '\mpencil' then 'Pencil'
    when name ~* 'fountain' then 'Fountain'
    when name ~* 'fineliner|fine liner|felt tip|marker' then 'Fineliner/Marker'
    else 'Unclassified'
  end as pen_type,
  count(*) n
from products
where is_published = true and (category = 'Pens' or subcategory ilike '%pen%')
group by 1
order by n desc;

-- ② 材料分布(material_tags):为"材料落地页"选值
-- select unnest(coalesce(material_tags,'{}')) as material, count(*) n
-- from products where is_published=true and (category='Pens' or subcategory ilike '%pen%')
-- group by 1 order by n desc;

-- ③ 机制分布(pen_mechanism):为"Retractable 落地页"
-- select unnest(coalesce(pen_mechanism,'{}')) as mechanism, count(*) n
-- from products where is_published=true and (category='Pens' or subcategory ilike '%pen%')
-- group by 1 order by n desc;

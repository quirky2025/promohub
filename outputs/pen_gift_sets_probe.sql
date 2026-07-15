-- READONLY:找出"笔类"里属于 gift set / 组合套装的产品(不改任何数据)。
-- 目的:清点数量,做 Pens 类目精修时顺手归类/处理。
-- 判定:笔类范畴 + 名字/描述显示是"成套/组合/礼盒装",排除单支笔和空的 presentation 盒。

with pen_scope as (
  select id, supplier, supplier_sku, name, category, subcategory, description
  from products
  where is_published = true
    and (
      category = 'Pens'
      or subcategory ilike '%pen%'
      or name ilike '%pen%'
    )
),
flagged as (
  select *,
    case
      when name ilike '%gift set%'                              then 'gift set'
      when name ilike '%stationery set%'                        then 'stationery set'
      when name ilike '%notebook with pen%'
        or name ilike '%notebook and pen%'
        or name ilike '%pen and notebook%'
        or name ilike '%with pen%'                              then 'notebook + pen'
      when name ilike '% set%' and name not ilike '%offset%'    then 'set (需人工确认)'
      when name ~* '\m(\d+)\s*(piece|pc|pcs|pack)\M'            then 'multi-piece set'
      else null
    end as gift_set_reason
  from pen_scope
)
-- ① 数量汇总
select gift_set_reason, count(*) as n
from flagged
where gift_set_reason is not null
group by gift_set_reason
order by n desc;

-- ② 明细清单(把上面这段注释掉、跑下面这段看逐条)
-- select supplier, supplier_sku, name, category, subcategory
-- from flagged
-- where gift_set_reason is not null
-- order by gift_set_reason, name;

-- 排除项参考(这些是"空盒/包装",不是 gift set,单独归 Pen Presentation):
-- name ilike '%presentation box%' / '%pen box%' / '%gift box%' / '%pouch%' / '%sleeve%'

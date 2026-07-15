-- READONLY:按【名字 + 描述】认笔类型(名字里没写,描述里通常有,如 "twist action ballpoint pen")。
-- 顺序:Gel/Rollerball 先判(免得被 ballpoint 抢),Ballpoint 兜底。

select
  case
    when (name||' '||coalesce(description,'')) ~* '\mgel\M'                     then 'Gel'
    when (name||' '||coalesce(description,'')) ~* 'roller ?ball|rolling ball'   then 'Rollerball'
    when (name||' '||coalesce(description,'')) ~* 'fountain'                    then 'Fountain'
    when (name||' '||coalesce(description,'')) ~* 'fineliner|fine liner|felt tip|marker' then 'Fineliner/Marker'
    when (name||' '||coalesce(description,'')) ~* '\mstylus\M'                  then 'Stylus'
    when (name||' '||coalesce(description,'')) ~* 'highlighter'                 then 'Highlighter'
    when (name||' '||coalesce(description,'')) ~* '\mpencil'                    then 'Pencil'
    when (name||' '||coalesce(description,'')) ~* 'ball ?point|ballpoint|ball pen' then 'Ballpoint'
    else 'Unclassified'
  end as pen_type,
  count(*) n
from products
where is_published = true and (category = 'Pens' or subcategory ilike '%pen%')
group by 1
order by n desc;

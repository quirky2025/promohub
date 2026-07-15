-- READONLY:找 Novelty(造型/趣味)笔候选,为建 Novelty Pens 子类做准备。不改数据。
-- 逐条看名字,确认哪些算 novelty(排除普通笔)。

select supplier, supplier_sku, name, category, subcategory
from products
where is_published = true
  and (category = 'Pens' or subcategory ilike '%pen%' or name ilike '%pen%')
  and (
       name ilike '%mop top%' or name ilike '%banner%' or name ilike '%flag pen%'
    or name ~* 'light[- ]?up|\mled\M|glow'
    or name ilike '%floating%' or name ~* '\mbend(y|able)?\M'
    or name ilike '%giant%' or name ilike '%jumbo%' or name ilike '%spinner%'
    or name ilike '%wobble%' or name ilike '%antenna%' or name ilike '%syringe%'
    or name ilike '%feather%' or name ilike '%test tube%' or name ilike '%shaped%'
    or name ilike '%novelty%' or name ilike '%fun %'
  )
order by name;

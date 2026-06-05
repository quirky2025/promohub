// lib/slug.js — 全站统一的 slug 工具(保存为 lib/slug.js)
// 原则:链接生成与 URL 匹配永远走同一套函数,从名字反推名字的 fromSlug 一律废弃。

// 标准 slug 化:小写,任何非字母数字的连续串折成单个 "-",去首尾 "-"
// "Drink Bottles - Metal" -> "drink-bottles-metal"
// "Cups & Tumblers"       -> "cups-tumblers"
// "Headwear Express"      -> "headwear-express"
export function slugify(name) {
  return (name || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// 归一化 URL 段:兼容历史链接的两种旧形态
//  1) 旧 toSlug 把 " & " 转成 "-and-"  -> 折回 "-"
//  2) 旧 toSlug 把 " - " 转成 "---"    -> 连续 "-" 折成一个
// "cups-and-tumblers"      -> "cups-tumblers"
// "drink-bottles---metal"  -> "drink-bottles-metal"
export function normalizeSlug(segment) {
  return decodeURIComponent(segment || '')
    .toLowerCase()
    .replace(/-and-/g, '-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// 在一组库内原名中,找出与 URL 段对应的那个原名(用于子类列表页查询)
// names: ['Drink Bottles - Metal', 'Ceramic Mugs', ...]
// segment: 'drink-bottles-metal' 或旧链接 'drink-bottles---metal'
// 返回库内原名,查询时直接 .eq('subcategory', 原名);没命中返回 null
export function findNameBySlug(names, segment) {
  const target = normalizeSlug(segment);
  return (names || []).find(n => slugify(n) === target) || null;
}

// 类目显示名:仅用于单词类目段还原标题(drinkware -> Drinkware)
export function titleFromSlug(segment) {
  return decodeURIComponent(segment || '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

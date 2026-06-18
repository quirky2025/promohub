// lib/filterFacets.js  - compute facet options (with counts) + apply selections.
import { facetsFor } from './filterConfig.js';

export const THIN_HIDE = 5; // §6: hide a facet value with fewer than this many products

// products -> [{ key, label, isType, values:[{value,count}] }] (empty facets dropped)
export function computeFacets(products, category, { includeType = true, thin = THIN_HIDE } = {}) {
  const facets = facetsFor(category, { includeType });
  return facets.map(f => {
    const counts = new Map();
    for (const p of products) for (const v of f.get(p)) {
      if (v == null || v === '') continue;
      counts.set(v, (counts.get(v) || 0) + 1);
    }
    const values = [...counts.entries()]
      .map(([value, count]) => ({ value, count }))
      .filter(x => x.count >= thin)
      .sort((a, b) => b.count - a.count || String(a.value).localeCompare(String(b.value)));
    return { key: f.key, label: f.label, isType: !!f.isType, values };
  }).filter(f => f.values.length > 0);
}

// selected = { facetKey: Set(values) }. OR within a facet, AND across facets.
// Unselected facets never exclude. Missing field excludes only once that facet is selected.
export function applyFilters(products, category, selected, { includeType = true } = {}) {
  const facets = facetsFor(category, { includeType });
  return products.filter(p => {
    for (const f of facets) {
      const sel = selected[f.key];
      if (!sel || sel.size === 0) continue;
      if (!f.get(p).some(v => sel.has(v))) return false;
    }
    return true;
  });
}

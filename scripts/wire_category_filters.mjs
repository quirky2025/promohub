#!/usr/bin/env node
// Wire the new FILTER system into app/category/[category]/page.js (idempotent).
// Run from a FRESH clone of main (after copying lib/filterAttributes.js,
// lib/filterConfig.js, lib/filterFacets.js, components/FilterSidebar.jsx).
import fs from 'node:fs';
const FILE = process.argv[2] || 'app/category/[category]/page.js';
let t = fs.readFileSync(FILE, 'utf8');
const __crlf = t.includes('\r\n'); t = t.replace(/\r\n/g, '\n'); // normalize EOL
let ok = 0, miss = 0;
function rep(oldS, newS, tag) {
  if (t.includes(newS.split('\n')[0]) && !t.includes(oldS)) { console.log('SKIP (done?) ' + tag); return; }
  if (t.includes(oldS)) { t = t.replace(oldS, newS); ok++; console.log('OK   ' + tag); }
  else { miss++; console.log('MISS ' + tag); }
}

rep(
  "import { useEffect, useState, useCallback } from 'react';",
  "import { useEffect, useState, useCallback, useMemo } from 'react';",
  'react import');

rep(
  "import { slugify, titleFromSlug } from '@/lib/slug';",
  "import { slugify, titleFromSlug } from '@/lib/slug';\nimport FilterSidebar from '@/components/FilterSidebar';\nimport { computeFacets, applyFilters } from '@/lib/filterFacets';",
  'new imports');

rep(
  "  const [minQtyFilter, setMinQtyFilter] = useState('');",
  "  const [selected, setSelected] = useState({});",
  'state');

rep(
  ".select('id, name, slug, subcategory, extra_subcategories, is_eco, min_qty, is_published, product_colours(images, sort_order), pricing_tiers(base_price)')",
  ".select('id, name, slug, subcategory, extra_subcategories, is_eco, min_qty, brand, fulfillment, capacity, pen_mechanism, pen_ink_colour, material_tags, colour_slugs, is_published, product_colours(images, sort_order), pricing_tiers(base_price), decoration_options(name, type)')",
  'select fields');

rep(
  "        setAllProducts(allData);",
  "        const enriched = allData.map(p => ({\n          ...p,\n          _price: getLowestPrice(p),\n          _decorationNames: (p.decoration_options || []).filter(d => d.type !== 'addon').map(d => d.name),\n        }));\n        setAllProducts(enriched);",
  'precompute');

rep(
`  // Apply filters + sort
  const getFiltered = useCallback(() => {
    let result = [...allProducts];
    if (isEco) result = result.filter(p => p.is_eco === true);
    if (minQtyFilter) result = result.filter(p => p.min_qty <= parseInt(minQtyFilter));
    if (sortBy === 'name') result.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === 'price') result.sort((a, b) => getLowestPrice(a) - getLowestPrice(b));
    if (sortBy === 'min_qty') result.sort((a, b) => a.min_qty - b.min_qty);
    return result;
  }, [allProducts, isEco, minQtyFilter, sortBy]);`,
`  // Facet options from the full category set (stable counts)
  const facets = useMemo(() => computeFacets(allProducts, categoryName), [allProducts, categoryName]);

  // Apply selected facets + eco + sort
  const getFiltered = useCallback(() => {
    let result = applyFilters(allProducts, categoryName, selected);
    if (isEco) result = result.filter(p => p.is_eco === true);
    result = [...result];
    if (sortBy === 'name') result.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === 'price') result.sort((a, b) => (a._price || 0) - (b._price || 0));
    else if (sortBy === 'min_qty') result.sort((a, b) => a.min_qty - b.min_qty);
    return result;
  }, [allProducts, categoryName, selected, isEco, sortBy]);`,
  'getFiltered');

rep(
`  function clearFilters() {
    setIsEco(false);
    setMinQtyFilter('');
    setSortBy('name');
  }`,
`  function onToggle(key, value) {
    setSelected(prev => {
      const next = { ...prev };
      const s = new Set(next[key] || []);
      if (s.has(value)) s.delete(value); else s.add(value);
      next[key] = s;
      return next;
    });
  }

  function clearFilters() {
    setSelected({});
    setIsEco(false);
    setSortBy('name');
  }`,
  'handlers');

// E8: replace the whole filter sidebar region (ASCII anchors, regex avoids non-ASCII inside)
{
  const re = /\{\/\* FILTER SIDEBAR \*\/\}[\s\S]*?\{\/\* PRODUCT GRID \*\/\}/;
  if (re.test(t)) { t = t.replace(re, "{/* FILTER SIDEBAR */}\n        <div className=\"qp-cat-sidebar\" style={{ width: '220px', flexShrink: 0, position: 'sticky', top: '72px' }}>\n          <div style={{ background: '#fff', borderRadius: '12px', padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,.06)', marginBottom: '16px' }}>\n            <div style={{ marginBottom: '14px' }}>\n              <div style={labelStyle}>Sort By</div>\n              <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={selectStyle}>\n                <option value=\"name\">Name A-Z</option>\n                <option value=\"price\">Price: Low to High</option>\n                <option value=\"min_qty\">Min Quantity</option>\n              </select>\n            </div>\n            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>\n              <input type=\"checkbox\" checked={isEco} onChange={e => setIsEco(e.target.checked)} style={{ width: '16px', height: '16px', accentColor: GOLD }} />\n              <span style={{ fontSize: '14px', color: '#1a1a1a' }}>Eco-Friendly only</span>\n            </label>\n          </div>\n\n          <FilterSidebar facets={facets} selected={selected} onToggle={onToggle} onClear={clearFilters} resultCount={filtered.length} />\n        </div>\n\n        {/* PRODUCT GRID */}"); ok++; console.log('OK   sidebar JSX'); }
  else { miss++; console.log('MISS sidebar JSX'); }
}

if (__crlf) t = t.replace(/\n/g, '\r\n'); // restore EOL
fs.writeFileSync(FILE, t);
console.log('\n' + ok + ' applied, ' + miss + ' missing');
process.exit(miss ? 1 : 0);

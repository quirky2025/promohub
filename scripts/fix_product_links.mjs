#!/usr/bin/env node
// fix_product_links.mjs
// Fix: product detail links 404 for names containing " - ".
// Root cause: 5 pages build href via local toSlug(product.name) that turns
// " - " into "---", not matching the single-hyphen DB slug. Fix: use
// product.slug and add slug to the select. Also remove the now-dead toSlug in
// the 3 link-only pages (brands/collections keep toSlug: still used for name
// matching, paired with Nav's legacySlug).
// Run from a FRESH clone of main:  node scripts/fix_product_links.mjs
// Idempotent.

import fs from 'node:fs';

const LINK_FILES = [
  'app/collections/[slug]/page.js',
  'app/sustainability/page.js',
  'app/sale/page.js',
  'app/new-arrivals/page.js',
  'app/brands/[slug]/page.js',
];

const DEAD_FILES = [
  'app/sustainability/page.js',
  'app/sale/page.js',
  'app/new-arrivals/page.js',
];

const SELECT_OLD = "'id, name, category";
const SELECT_NEW = "'id, name, slug, category";
const LINK_OLD = '/products/${toSlug(product.name)}';
const LINK_NEW = '/products/${product.slug}';

const TOSLUG_BLOCK = [
  'function toSlug(name) {',
  "  return (name || '').toLowerCase()",
  "    .replace(/ & /g, '-and-')",
  "    .replace(/&/g, 'and')",
  "    .replace(/ /g, '-');",
  '}',
  '',
].join('\n');

console.log('1) links -> product.slug, select += slug');
for (const file of LINK_FILES) {
  if (!fs.existsSync(file)) { console.log('SKIP missing: ' + file); continue; }
  let t = fs.readFileSync(file, 'utf8');
  let n = 0;
  if (t.includes(SELECT_OLD)) { t = t.split(SELECT_OLD).join(SELECT_NEW); n++; }
  if (t.includes(LINK_OLD)) { t = t.split(LINK_OLD).join(LINK_NEW); n++; }
  fs.writeFileSync(file, t);
  console.log((n === 2 ? 'OK   ' : 'WARN ') + file + '  (' + n + '/2)');
}

console.log('2) remove dead toSlug (3 link-only files)');
for (const file of DEAD_FILES) {
  if (!fs.existsSync(file)) { console.log('SKIP missing: ' + file); continue; }
  let t = fs.readFileSync(file, 'utf8');
  const calls = (t.match(/toSlug\(/g) || []).length;
  const defs = (t.match(/function toSlug\(/g) || []).length;
  if (calls - defs > 0) { console.log('KEEP ' + file + '  (toSlug still called)'); continue; }
  if (t.includes(TOSLUG_BLOCK)) {
    t = t.replace(TOSLUG_BLOCK, '');
    fs.writeFileSync(file, t);
    console.log('DEL  ' + file + '  (toSlug removed)');
  } else {
    console.log('WARN ' + file + '  (toSlug shape differs, not removed)');
  }
}

console.log('done. git diff to review.');

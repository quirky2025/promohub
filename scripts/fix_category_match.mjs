#!/usr/bin/env node
// fix_category_match.mjs
// Bug 1: category "&" pages empty. /category/[category] and its /[subcategory]
//   match category via titleFromSlug + ilike('category', name), which loses
//   "&" (Office & Desk -> "Office Desk") and matches nothing. Fix: turn spaces
//   into "%" so ILIKE bridges the lost " & " (Office%Desk matches "Office & Desk").
//   No-space categories are unaffected (no "%").
// Bug 2: similar-products query gates on status='active' instead of the
//   site-standard is_published=true -> may show unpublished / miss published.
//   Fix: use is_published=true.
// Run from a FRESH clone of main:  node scripts/fix_category_match.mjs
// Idempotent.

import fs from 'node:fs';

const A_OLD = ".ilike('category', categoryName)";
const A_NEW = ".ilike('category', categoryName.split(' ').join('%'))";
const B_OLD = ".eq('status', 'active')";
const B_NEW = ".eq('is_published', true)";

const EDITS = [
  { file: 'app/category/[category]/page.js', from: A_OLD, to: A_NEW, expect: 1 },
  { file: 'app/category/[category]/[subcategory]/page.js', from: A_OLD, to: A_NEW, expect: 2 },
  { file: 'app/products/[slug]/ProductClient.jsx', from: B_OLD, to: B_NEW, expect: 1 },
];

for (const e of EDITS) {
  if (!fs.existsSync(e.file)) { console.log('SKIP missing: ' + e.file); continue; }
  let t = fs.readFileSync(e.file, 'utf8');
  const n = t.split(e.from).length - 1;
  if (n === 0) { console.log('--   ' + e.file + '  (0 found; maybe already fixed)'); continue; }
  t = t.split(e.from).join(e.to);
  fs.writeFileSync(e.file, t);
  console.log((n === e.expect ? 'OK   ' : 'WARN ') + e.file + '  (' + n + '/' + e.expect + ')');
}
console.log('done. git diff to review.');

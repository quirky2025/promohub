#!/usr/bin/env node
// Exclude colour collection pages (page_type='collection') from the flat category
// page's "Browse by Subcategory" grid. Run from a FRESH clone of main.
// Idempotent. Single-line replace -> CRLF-safe.
import fs from 'node:fs';
const FILE = process.argv[2] || 'app/[slug]/page.js';
let t = fs.readFileSync(FILE, 'utf8');
const OLD = "const childPages = await getLiveChildUrlPages(urlPage.slug);";
const NEW = "const childPages = (await getLiveChildUrlPages(urlPage.slug)).filter((c) => c.page_type !== 'collection');";
if (t.includes(NEW)) { console.log('SKIP (already done)'); process.exit(0); }
if (t.includes(OLD)) { t = t.replace(OLD, NEW); fs.writeFileSync(FILE, t); console.log('OK applied'); process.exit(0); }
console.log('MISS - target line not found'); process.exit(1);

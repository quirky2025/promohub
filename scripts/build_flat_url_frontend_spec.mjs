import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const APP_DIR = path.join(ROOT, 'app');
const READY_JSON = path.join(ROOT, 'outputs', 'url_pages_ready', 'url_pages_seed_READY.json');
const OUT_DIR = path.join(ROOT, 'outputs', 'frontend_transition');

function csvEscape(value) {
  const s = String(value ?? '');
  return /[",\n\r]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
}

function writeCsv(filePath, rows) {
  const headers = Object.keys(rows[0] || {});
  const lines = [
    headers.map(csvEscape).join(','),
    ...rows.map((row) => headers.map((h) => csvEscape(row[h])).join(',')),
  ];
  fs.writeFileSync(filePath, `\uFEFF${lines.join('\n')}\n`, 'utf8');
}

function topLevelAppRoutes() {
  return fs
    .readdirSync(APP_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => !name.startsWith('(') && !name.startsWith('_'))
    .sort();
}

function firstSegment(slug) {
  return String(slug || '').split('/')[0];
}

function buildSpec({ reservedRows, conflicts, slashRows }) {
  const reservedList = reservedRows.map((row) => `\`${row.slug}\``).join(', ');
  const conflictText = conflicts.length
    ? conflicts.map((row) => `- \`${row.slug}\` conflicts with app top-level route \`${row.first_segment}\`.`).join('\n')
    : '- None.';
  const slashText = slashRows.length
    ? slashRows.map((row) => `- \`${row.slug}\` (${row.page_type})`).join('\n')
    : '- None in the current READY seed.';

  return `# QuirkyPromo Flat URL Frontend Transition Spec

> Generated after checking local Next.js docs and current \`app/\` routes. This is a frontend implementation spec only; no app code has been changed.

## Next 16 Notes From Local Docs

- Dynamic route \`params\` is a Promise in this version. In \`page.js\` and \`generateMetadata\`, use \`const { slug } = await params\`.
- \`generateMetadata\` is server-side. Use it to read \`url_pages.title\`, \`meta_description\`, and \`canonical_url\`.
- \`middleware.js\` is deprecated. This repo already has \`proxy.js\`; admin/auth/redirect work should stay in \`proxy.js\`.

## Recommended First Implementation

Build only a single-segment flat route first:

\`app/[slug]/page.js\`

Do not start with \`app/[...slug]/page.js\`. A catch-all route would touch every nested path and raise collision risk with existing routes like \`/products/[slug]\`, \`/brands/[slug]\`, \`/category/...\`, \`/collections/...\`, and \`/supply-chain/...\`.

## Route Guard

The route should:

1. Await \`params\`.
2. Reject reserved slugs before querying \`url_pages\`.
3. Query \`url_pages\` by exact \`slug\`.
4. Require \`status = live\`.
5. Apply the resolver from \`outputs/product_filter_resolver/product_filter_resolver_spec.md\`.
6. Return \`notFound()\` when no live page exists.

## Current Reserved Top-Level Slugs

${reservedList}

## READY Seed Route Conflicts

${conflictText}

## Slugs With Internal Slash

${slashText}

Current READY seed can be handled by \`app/[slug]/page.js\`. Future internal-slash pages should use their specific existing route family first, for example \`/brands/[slug]\`, rather than making the root route catch all paths too early.

## Files To Add Later

- \`lib/urlPages.js\`: fetch \`url_pages\`, reserved slug helper, product filter resolver.
- \`app/[slug]/page.js\`: server route shell, metadata, product query, render.
- Optional \`components/UrlPageProductGrid.jsx\`: shared listing UI if old category pages remain client-heavy.

## Files To Touch Later

- \`components/Nav.jsx\`: switch nav/footer/home links from \`url_pages\` after counts validate.
- \`app/category/[category]/page.js\`: old route canonical should point to new page where a redirect mapping exists.
- \`app/category/[category]/[subcategory]/page.js\`: same canonical/transition handling.
- \`app/products/[slug]/ProductClient.jsx\`: breadcrumb links should use new flat URL once \`url_pages\` is live.

## Must Verify Before Switching Navigation

- Product counts from \`product_filter_validation_READONLY.sql\`.
- No empty live category/subcategory/compound/kit_collection pages.
- Static routes still open: \`/cart\`, \`/admin\`, \`/products/example\`, \`/brands/example\`, \`/collections/example\`.
- A flat page opens, e.g. \`/custom-drink-bottles-australia\`.
- Unknown slug returns 404.
- Canonical for new page equals \`url_pages.canonical_url\`.
`;
}

fs.mkdirSync(OUT_DIR, { recursive: true });

const readyRows = JSON.parse(fs.readFileSync(READY_JSON, 'utf8'));
const appRoutes = topLevelAppRoutes();
const reservedRows = appRoutes.map((slug) => ({ slug, source: 'app_top_level_directory' }));
const reservedSet = new Set(appRoutes);
const conflicts = readyRows
  .map((row) => ({ slug: row.slug, first_segment: firstSegment(row.slug), page_type: row.page_type }))
  .filter((row) => reservedSet.has(row.first_segment));
const slashRows = readyRows
  .filter((row) => String(row.slug).includes('/'))
  .map((row) => ({ slug: row.slug, page_type: row.page_type, source_type: row.source_type }));

const reservedPath = path.join(OUT_DIR, 'reserved_slugs_from_app.csv');
const conflictPath = path.join(OUT_DIR, 'flat_url_ready_conflicts.csv');
const specPath = path.join(OUT_DIR, 'Flat_URL_Frontend_Transition_Spec.md');
const validationPath = path.join(OUT_DIR, 'flat_url_frontend_spec_validation.json');

writeCsv(reservedPath, reservedRows);
writeCsv(conflictPath, conflicts.length ? conflicts : [{ slug: '', first_segment: '', page_type: '' }]);
fs.writeFileSync(specPath, buildSpec({ reservedRows, conflicts, slashRows }), 'utf8');

const validation = {
  app_top_level_reserved_count: reservedRows.length,
  ready_rows: readyRows.length,
  ready_conflicts_with_app_top_level_routes: conflicts.length,
  ready_slugs_with_internal_slash: slashRows.length,
  recommended_initial_route: 'app/[slug]/page.js',
  avoid_initial_route: 'app/[...slug]/page.js',
  outputs: {
    spec: specPath,
    reserved_slugs: reservedPath,
    conflicts: conflictPath,
  },
};

fs.writeFileSync(validationPath, JSON.stringify(validation, null, 2), 'utf8');
console.log(JSON.stringify(validation, null, 2));

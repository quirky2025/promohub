import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const READY_JSON = path.join(ROOT, 'outputs', 'url_pages_ready', 'url_pages_seed_READY.json');
const OUT_DIR = path.join(ROOT, 'outputs', 'product_filter_resolver');

const FILTER_RULES = {
  category: {
    requiredFields: ['category', 'is_published'],
    queryShape: 'category exact match + is_published=true',
    emptyPolicy: 'Should not be empty after migration. Empty means products were not moved or category spelling differs.',
  },
  subcategory: {
    requiredFields: ['category', 'subcategory', 'is_published'],
    queryShape: 'category exact match + subcategory exact match + is_published=true',
    emptyPolicy: 'Should not be empty after migration unless the page is intentionally draft.',
  },
  compound: {
    requiredFields: ['category', 'is_published', 'material_tags/tags/is_eco'],
    queryShape: 'category exact match + one normalized attribute filter',
    emptyPolicy: 'Allowed during tagging cleanup only. Before live, each compound SEO page needs products or status=draft.',
  },
  kit_collection: {
    requiredFields: ['offer_type', 'kit_themes', 'is_published'],
    queryShape: 'offer_type in allowed kit offer types + kit_themes overlap',
    emptyPolicy: 'Hub/theme pages should not be empty after kit tagging. Empty child pages should stay draft.',
  },
  kit_template: {
    requiredFields: ['kit_components', 'related_categories', 'is_published'],
    queryShape: 'manual/template page; show curated component rails rather than one product list',
    emptyPolicy: 'Can have zero direct kit products if it renders component/category rails and quote CTA.',
  },
  brand: {
    requiredFields: ['brand', 'is_published'],
    queryShape: 'brand exact/normalized match + is_published=true',
    emptyPolicy: 'Brand page should be draft until products exist.',
  },
  collection: {
    requiredFields: ['collection', 'is_published'],
    queryShape: 'collection jsonb contains value + is_published=true',
    emptyPolicy: 'Collection page should be draft until products exist.',
  },
  manual: {
    requiredFields: ['id', 'is_published'],
    queryShape: 'explicit product_ids list + is_published=true',
    emptyPolicy: 'Manual page must be checked by hand.',
  },
};

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

function keysWithoutType(productFilter) {
  return Object.keys(productFilter || {}).filter((k) => k !== 'type').sort();
}

function makeMatrix(rows) {
  return rows.map((row) => {
    const pf = row.product_filter || {};
    const rule = FILTER_RULES[pf.type] || {};
    return {
      slug: row.slug,
      page_type: row.page_type || '',
      source_type: row.source_type || '',
      page_role: row.page_role || '',
      filter_type: pf.type || '',
      filter_keys: keysWithoutType(pf).join(','),
      category: pf.category || '',
      subcategory: pf.subcategory || '',
      material: pf.material || '',
      tags: Array.isArray(pf.tags) ? pf.tags.join('|') : '',
      kit_themes: Array.isArray(pf.kit_themes) ? pf.kit_themes.join('|') : '',
      offer_types: Array.isArray(pf.offer_types) ? pf.offer_types.join('|') : '',
      required_product_fields: (rule.requiredFields || []).join('|'),
      query_shape: rule.queryShape || 'UNHANDLED',
      empty_page_policy: rule.emptyPolicy || 'UNHANDLED',
    };
  });
}

function countBy(rows, key) {
  return rows.reduce((acc, row) => {
    acc[row[key]] = (acc[row[key]] || 0) + 1;
    return acc;
  }, {});
}

function buildReadOnlySql() {
  return `-- Product filter resolver validation
-- READ ONLY. Run after url_pages + products filter fields exist.
-- Purpose: count products matched by each live url_pages.product_filter.

with page_counts as (
  select
    up.slug,
    up.page_type,
    up.source_type,
    up.status,
    up.product_filter,
    coalesce(up.product_filter->>'type', '') as filter_type,
    (
      select count(*)
      from public.products p
      where p.is_published = true
        and (
          (
            up.product_filter->>'type' = 'category'
            and p.category = up.product_filter->>'category'
          )
          or (
            up.product_filter->>'type' = 'subcategory'
            and p.category = up.product_filter->>'category'
            and p.subcategory = up.product_filter->>'subcategory'
          )
          or (
            up.product_filter->>'type' = 'compound'
            and p.category = up.product_filter->>'category'
            and (
              (up.product_filter ? 'material' and coalesce(p.material_tags, array[]::text[]) @> array[lower(up.product_filter->>'material')])
              or (up.product_filter ? 'tags' and coalesce(p.tags, array[]::text[]) && (
                select array_agg(lower(value))
                from jsonb_array_elements_text(up.product_filter->'tags') as value
              ))
              or (up.product_filter ? 'is_eco' and coalesce(p.is_eco, false) = (up.product_filter->>'is_eco')::boolean)
            )
          )
          or (
            up.product_filter->>'type' = 'kit_collection'
            and coalesce(p.offer_type, 'single_product') in (
              select value from jsonb_array_elements_text(up.product_filter->'offer_types') as value
            )
            and (
              coalesce((up.product_filter->>'include_all_kit_candidates')::boolean, false) = true
              or coalesce(p.kit_themes, array[]::text[]) && (
                select array_agg(value)
                from jsonb_array_elements_text(up.product_filter->'kit_themes') as value
              )
            )
          )
          or (
            up.product_filter->>'type' = 'kit_template'
            and coalesce(p.offer_type, 'single_product') in (
              select value from jsonb_array_elements_text(up.product_filter->'offer_types') as value
            )
            and coalesce(p.kit_themes, array[]::text[]) && (
              select array_agg(value)
              from jsonb_array_elements_text(up.product_filter->'kit_themes') as value
            )
          )
        )
    ) as product_count
  from public.url_pages up
  where up.status = 'live'
)
select
  slug,
  filter_type,
  product_count,
  case
    when filter_type = 'kit_template' then 'manual/template page: zero direct products can be ok if component rails render'
    when product_count = 0 then 'CHECK: empty live page'
    else 'ok'
  end as validation_note,
  product_filter
from page_counts
order by
  case when product_count = 0 and filter_type <> 'kit_template' then 0 else 1 end,
  filter_type,
  slug;
`;
}

function buildPseudocode() {
  return `// Pseudocode only. Do not paste directly without adapting to the app query layer.

export function applyProductFilter(query, productFilter) {
  const type = productFilter?.type;
  query = query.eq('is_published', true);

  if (type === 'category') {
    return query.eq('category', productFilter.category);
  }

  if (type === 'subcategory') {
    return query
      .eq('category', productFilter.category)
      .eq('subcategory', productFilter.subcategory);
  }

  if (type === 'compound') {
    query = query.eq('category', productFilter.category);

    if (productFilter.material) {
      return query.contains('material_tags', [productFilter.material.toLowerCase()]);
    }
    if (Array.isArray(productFilter.tags) && productFilter.tags.length) {
      return query.overlaps('tags', productFilter.tags.map((tag) => tag.toLowerCase()));
    }
    if (productFilter.is_eco === true) {
      return query.eq('is_eco', true);
    }
  }

  if (type === 'kit_collection') {
    query = query.in('offer_type', productFilter.offer_types || []);
    if (productFilter.include_all_kit_candidates) return query;
    return query.overlaps('kit_themes', productFilter.kit_themes || []);
  }

  if (type === 'kit_template') {
    // Template pages should render curated component/category rails and quote CTA.
    // A direct product query is optional, not the main content.
    return query
      .in('offer_type', productFilter.offer_types || [])
      .overlaps('kit_themes', productFilter.kit_themes || []);
  }

  throw new Error(\`Unsupported product_filter.type: \${type}\`);
}
`;
}

function buildSpec(rows, matrix) {
  const typeCounts = countBy(matrix, 'filter_type');
  const examples = {};
  const keyCounts = {};

  for (const row of rows) {
    const pf = row.product_filter || {};
    examples[pf.type] ||= { slug: row.slug, product_filter: pf };
    keyCounts[pf.type] ||= {};
    for (const key of Object.keys(pf)) {
      if (key === 'type') continue;
      keyCounts[pf.type][key] = (keyCounts[pf.type][key] || 0) + 1;
    }
  }

  const lines = [
    '# QuirkyPromo product_filter Resolver Spec',
    '',
    '> Generated from `outputs/url_pages_ready/url_pages_seed_READY.json`. This is a build/spec artifact only; it does not modify the database.',
    '',
    '## Core Rule',
    '',
    'Every public URL page reads `url_pages.product_filter` and converts it into one product query. Category/subcategory pages use the product primary home only. Do not use one product in multiple subcategories to fake extra pages; use collections, tags, kit themes, brand pages, and compound filter pages for secondary appearances.',
    '',
    '## Type Counts',
    '',
    '| product_filter.type | pages |',
    '|---|---:|',
  ];

  for (const [type, count] of Object.entries(typeCounts).sort()) {
    lines.push(`| ${type} | ${count} |`);
  }

  lines.push(
    '',
    '## Resolver Rules',
    '',
    '| type | required product fields | query shape | empty-page policy |',
    '|---|---|---|---|',
  );
  for (const type of Object.keys(typeCounts).sort()) {
    const rule = FILTER_RULES[type] || {};
    lines.push(`| ${type} | ${(rule.requiredFields || []).join(', ')} | ${rule.queryShape || 'UNHANDLED'} | ${rule.emptyPolicy || 'UNHANDLED'} |`);
  }

  lines.push(
    '',
    '## Filter Keys In Seed',
    '',
    '| type | keys seen | example slug | example product_filter |',
    '|---|---|---|---|',
  );
  for (const type of Object.keys(typeCounts).sort()) {
    const keys = Object.keys(keyCounts[type] || {}).sort().join(', ');
    const example = examples[type];
    lines.push(`| ${type} | ${keys} | \`${example.slug}\` | \`${JSON.stringify(example.product_filter)}\` |`);
  }

  lines.push(
    '',
    '## Important Implementation Notes',
    '',
    '- `category` and `subcategory` matching should be exact after migration. If counts are wrong, fix the product data or mapping, not the URL.',
    '- `material_tags` and `tags` should be normalized lowercase arrays during import/cleanup. Example: `Cotton` in URL seed becomes `cotton` in `material_tags`.',
    '- `kit_collection` pages only show products/offers with kit-style `offer_type`, not normal single products.',
    '- `kit_template` pages such as New Home Kits can be useful even with zero direct kit products, but they must render component/category rails and a quote CTA.',
    '- Empty live pages are not acceptable for normal category/subcategory/compound/kit_collection pages. Keep them `draft` until product counts are ready.',
    '- Legacy `extra_subcategories` can remain as a transition helper, but it should not drive the new canonical flat URL pages.',
    '',
    '## Generated Files',
    '',
    '- `product_filter_type_matrix.csv`',
    '- `product_filter_validation_READONLY.sql`',
    '- `product_filter_resolver_pseudocode.js`',
    '- `product_filter_resolver_validation.json`',
    '',
  );

  return `${lines.join('\n')}`;
}

fs.mkdirSync(OUT_DIR, { recursive: true });

const rows = JSON.parse(fs.readFileSync(READY_JSON, 'utf8'));
const matrix = makeMatrix(rows);
const typeCounts = countBy(matrix, 'filter_type');
const unhandledTypes = Object.keys(typeCounts).filter((type) => !(type in FILTER_RULES)).sort();
const handledTypes = Object.keys(typeCounts).filter((type) => type in FILTER_RULES).sort();

const matrixPath = path.join(OUT_DIR, 'product_filter_type_matrix.csv');
const specPath = path.join(OUT_DIR, 'product_filter_resolver_spec.md');
const sqlPath = path.join(OUT_DIR, 'product_filter_validation_READONLY.sql');
const pseudoPath = path.join(OUT_DIR, 'product_filter_resolver_pseudocode.js');
const validationPath = path.join(OUT_DIR, 'product_filter_resolver_validation.json');

writeCsv(matrixPath, matrix);
fs.writeFileSync(specPath, buildSpec(rows, matrix), 'utf8');
fs.writeFileSync(sqlPath, buildReadOnlySql(), 'utf8');
fs.writeFileSync(pseudoPath, buildPseudocode(), 'utf8');

const validation = {
  ready_rows: rows.length,
  matrix_rows: matrix.length,
  filter_type_counts: Object.fromEntries(Object.entries(typeCounts).sort()),
  handled_types: handledTypes,
  unhandled_types: unhandledTypes,
  empty_page_policy_defined_for_all_seed_types: unhandledTypes.length === 0,
  outputs: {
    spec: specPath,
    matrix: matrixPath,
    readonly_sql: sqlPath,
    pseudocode: pseudoPath,
  },
};

fs.writeFileSync(validationPath, JSON.stringify(validation, null, 2), 'utf8');
console.log(JSON.stringify(validation, null, 2));

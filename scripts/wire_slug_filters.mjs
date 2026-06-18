#!/usr/bin/env node
// Wire CategoryFilter into the flat url_pages renderer (app/[slug]/page.js) +
// extend PRODUCT_SELECT (lib/urlPages.js). Filters only on category/subcategory
// pages; colour collection pages keep the plain SSR grid. Run from a fresh clone.
// EOL-safe (normalize LF, restore) + idempotent (doneMarker).
import fs from 'node:fs';
let OK = 0, MISS = 0;
function editFile(file, edits) {
  if (!fs.existsSync(file)) { console.log('SKIP missing ' + file); MISS++; return; }
  let t = fs.readFileSync(file, 'utf8');
  const crlf = t.includes('\r\n'); t = t.replace(/\r\n/g, '\n');
  for (const [oldS, newS, tag, done] of edits) {
    if (t.includes(done)) { console.log('SKIP ' + tag + ' (done)'); continue; }
    if (t.includes(oldS)) { t = t.replace(oldS, newS); OK++; console.log('OK   ' + tag); }
    else { MISS++; console.log('MISS ' + tag); }
  }
  if (crlf) t = t.replace(/\n/g, '\r\n');
  fs.writeFileSync(file, t);
}

editFile('app/[slug]/page.js', [
  [
    "import { absoluteUrl } from '@/lib/siteUrl';",
    "import { absoluteUrl } from '@/lib/siteUrl';\nimport CategoryFilter from '@/components/CategoryFilter';",
    'import', "import CategoryFilter from '@/components/CategoryFilter'"
  ],
  [
`  const { products, count, error, unsupported } = await getProductsForUrlPage(urlPage);
  const childPages = urlPage.product_filter?.type === 'category'`,
`  const filterable = urlPage.product_filter?.type === 'category' || urlPage.product_filter?.type === 'subcategory';
  const { products, count, error, unsupported } = await getProductsForUrlPage(urlPage, filterable ? 1000 : 96);
  const filterProducts = filterable
    ? products.map((p) => ({
        ...p,
        _image: getFirstImage(p),
        _price: getLowestPrice(p),
        _swatches: getColourSwatches(p),
        _decorationNames: (p.decoration_options || []).filter((d) => d.type !== 'addon').map((d) => d.name),
      }))
    : null;
  const childPages = urlPage.product_filter?.type === 'category'`,
    'fetch+enrich', 'const filterable ='
  ],
  [
`            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(214px, 1fr))', gap: '20px' }}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>`,
`            {filterable ? (
              <CategoryFilter products={filterProducts} category={urlPage.product_filter?.category} includeType={urlPage.product_filter?.type === 'category'} />
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(214px, 1fr))', gap: '20px' }}>
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}`,
    'render', '<CategoryFilter products={filterProducts}'
  ],
]);

editFile('lib/urlPages.js', [
  // Edit B (fresh clone): full filter-field injection, incl. materials. Run first so a
  // fresh clone gets "material_tags, materials" and Edit A then no-ops via its done-marker.
  [
    "  pricing_tiers ( min_qty, base_price )",
    "  colour_slugs, fulfillment, capacity, pen_mechanism, pen_ink_colour, material_tags, materials, pricing_tiers ( min_qty, base_price ), decoration_options ( name, type )",
    'PRODUCT_SELECT', 'decoration_options ( name, type )'
  ],
  // Edit A (already-patched clone w/o materials): add materials next to material_tags.
  [
    "material_tags, pricing_tiers ( min_qty, base_price )",
    "material_tags, materials, pricing_tiers ( min_qty, base_price )",
    'PRODUCT_SELECT+materials', 'material_tags, materials'
  ],
]);

console.log('\n' + OK + ' applied, ' + MISS + ' missing');
process.exit(MISS ? 1 : 0);

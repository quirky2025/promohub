import { isAdmin, unauthorized } from '@/lib/adminAuth';
import { sourcingDb } from '@/lib/sourcingDb';
import { penPrimaryMaterial } from '@/lib/filterAttributes';

// PRODUCT_TITLE_ENRICHMENT_SPEC — preview CSV generator (Pens pilot).
// GET /api/admin/product-titles?category=Pens → downloads a CSV:
//   supplier_sku, name, display_title, material, mechanism, type
// Formula: {name minus trailing type noun} + Material + Mechanism + Type(singular),
// deduped word-level, ≤55 chars (drop Mechanism first, then Material), no padding —
// all empty → display_title = name. Data-driven from OUR fields only.

const MAX_LEN = 55;

const PEN_BARREL = ['Metal','Aluminium','Stainless Steel','Recycled Aluminium','Plastic','Bamboo','Wood','Paper','Cork','Wheat Straw','RPET','Polypropylene'];

const TYPE_SINGULAR = {
  'Ballpoint Pens': 'Ballpoint Pen',
  'Stylus Pens': 'Stylus Pen',
  'Highlighters': 'Highlighter',
  'Pencils': 'Pencil',
  'Novelty Pens': 'Novelty Pen',
  // Presentation boxes / gift sets: not pens — keep original names
  'Pen Presentation': null,
  'Pen Gift Sets': null,
};

const TYPE_NOUNS = /\s+(pens?|highlighters?|pencils?)$/i;

const words = (s) => String(s || '').toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);

function buildTitle(p) {
  const name = String(p.name || '').trim();
  const typeSingular = TYPE_SINGULAR[p.subcategory];
  if (!typeSingular) {
    // presentation boxes / gift sets / unknown subcategory → keep original name
    return { display: name, material: '', mechanism: '', type: '' };
  }

  // strip trailing type noun ("… Pen" / "… Highlighter") — re-appended at the end
  const base = name.replace(TYPE_NOUNS, '').trim();
  const used = new Set(words(base));

  let material = (penPrimaryMaterial(p.materials, p.name, PEN_BARREL)[0] || '')
    .replace('Polypropylene', 'Plastic');
  if (material && words(material).some(w => used.has(w))) material = ''; // dedupe

  let mechanism = String(p.pen_mechanism || '').trim()
    .replace(/^Twist Action$/i, 'Twist-Action')
    .replace(/^Swivel Action$/i, 'Swivel-Action');
  if (mechanism && words(mechanism).some(w => used.has(w))) mechanism = '';

  // type: skip the qualifier when already in the base name (e.g. "… Stylus")
  let type = typeSingular;
  const typeHead = words(type).filter(w => w !== 'pen');
  if (typeHead.some(w => used.has(w))) type = name.match(TYPE_NOUNS) ? name.match(TYPE_NOUNS)[0].trim() : type.split(' ').pop();

  const assemble = (mat, mech) => [base, mat, mech, type].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();

  let display = assemble(material, mechanism);
  if (display.length > MAX_LEN) { mechanism = ''; display = assemble(material, mechanism); } // drop Mechanism first
  if (display.length > MAX_LEN) { material = ''; display = assemble(material, mechanism); }  // then Material
  if (display.length > MAX_LEN) return { display: name, material: '', mechanism: '', type: '' }; // still too long → keep original
  if (!material && !mechanism && display.toLowerCase() === name.toLowerCase()) {
    return { display: name, material: '', mechanism: '', type: '' }; // nothing added → no padding
  }
  return { display, material, mechanism, type };
}

const csvCell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;

export async function GET(request) {
  if (!(await isAdmin(request))) return unauthorized();
  const category = new URL(request.url).searchParams.get('category') || 'Pens';
  const db = sourcingDb();

  const rows = [];
  const PAGE = 1000;
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await db
      .from('products')
      .select('supplier_sku, name, display_title, subcategory, materials, dimensions, pen_mechanism, features, is_eco, colours, specs, seo_description')
      .eq('category', category)
      .eq('is_published', true)
      .order('name')
      .range(from, from + PAGE - 1);
    if (error) return new Response(`error: ${error.message}`, { status: 500 });
    (data || []).forEach(p => rows.push(p));
    if (!data || data.length < PAGE) break;
  }

  // Rich context so title writing can describe what the product actually IS
  // (contents, packaging, accessories) — not just re-assemble the name.
  const flatFeatures = (f) => Array.isArray(f) ? f.filter(Boolean).join(' | ') : '';
  const flatColours = (c) => {
    const arr = Array.isArray(c) ? c : (typeof c === 'string' ? (() => { try { return JSON.parse(c); } catch { return []; } })() : []);
    return Array.isArray(arr) ? arr.map(x => x?.name).filter(Boolean).join(' / ') : '';
  };
  const flatSpecs = (s) => Array.isArray(s)
    ? s.filter(x => x?.name && x?.value).map(x => `${x.name}: ${x.value}`).join(' | ')
    : '';

  const lines = ['supplier_sku,name,current_display_title,draft_title,material,mechanism,type,eco,features,materials_text,dimensions,colours,specs,seo_description'];
  for (const p of rows) {
    const t = buildTitle(p);
    lines.push([
      p.supplier_sku, p.name, p.display_title || '', t.display, t.material, t.mechanism, t.type,
      p.is_eco ? 'ECO' : '',
      flatFeatures(p.features), p.materials || '', p.dimensions || '',
      flatColours(p.colours), flatSpecs(p.specs),
      String(p.seo_description || '').slice(0, 300),
    ].map(csvCell).join(','));
  }

  return new Response('﻿' + lines.join('\r\n'), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="product_titles_${category.toLowerCase()}_preview.csv"`,
    },
  });
}

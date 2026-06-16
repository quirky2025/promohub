// app/api/admin/sourcing/products/route.js
// Made-to-Order Product master API. Backed by sourcing_products + child tables.
// Speaks the frontend camelCase product shape in/out; maps to snake_case at the DB boundary.
// Guarded by proxy.js (/api/admin/*) and re-checked with isAdmin().
import { NextResponse } from 'next/server';
import { sourcingDb } from '@/lib/sourcingDb';
import { isAdmin, unauthorized } from '@/lib/adminAuth';

function asTrimmed(value) {
  return typeof value === 'string' ? value.trim() : value == null ? '' : String(value).trim();
}
function textOrNull(value) {
  const t = asTrimmed(value);
  return t === '' ? null : t;
}
function intOrNull(value) {
  if (value === '' || value === null || value === undefined) return null;
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) ? n : null;
}
function numOrNull(value) {
  if (value === '' || value === null || value === undefined) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}
function isUuid(value) {
  return typeof value === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

// ---- mapping: DB row -> frontend product shape (camelCase) ----
function rowToProduct(row, colours, branding, specs) {
  return {
    id: row.id,
    status: row.status || 'active',
    sku: row.internal_sku || '',
    name: row.name || '',
    category: row.category || '',
    subcategory: row.subcategory || '',
    factoryId: row.factory_id || '',
    factoryName: row.factory_name || '',
    factorySku: row.factory_sku || '',
    moq: row.moq ?? '',
    targetUse: row.target_use || '',
    specs: row.specs_summary || '',
    material: row.material || '',
    dimensions: row.dimensions || '',
    colours: row.colour_summary || '',
    packaging: row.packaging || '',
    decorationOptions: row.decoration_options || '',
    logoRequirements: row.logo_requirements || '',
    unitsPerCarton: row.units_per_carton ?? '',
    cartonLengthCm: row.carton_length_cm ?? '',
    cartonWidthCm: row.carton_width_cm ?? '',
    cartonHeightCm: row.carton_height_cm ?? '',
    grossWeightKgPerCarton: row.gross_weight_kg_per_carton ?? '',
    productionLeadTime: row.production_lead_time || '',
    sampleInfo: row.sample_info || '',
    documentsSupported: row.documents_supported || '',
    complianceNotes: row.compliance_notes || '',
    publicPositioning: row.public_positioning || '',
    frontEndTags: row.front_end_tags || '',
    internalNotes: row.internal_notes || '',
    availableColours: (colours || []).map((c) => ({
      name: c.colour_name || '',
      supplierColour: c.supplier_colour || '',
      pms: c.pms_code || '',
      hex: c.hex || '',
      notes: c.notes || '',
    })),
    brandingOptions: (branding || []).map((b) => ({
      method: b.method || '',
      maxSize: b.max_size || '',
      position: b.position || '',
      colourLimit: b.colour_limit || '',
      templateUrl: b.template_url || '',
      notes: b.notes || '',
    })),
    specRows: (specs || []).map((s) => ({
      name: s.spec_name || '',
      description: s.description || '',
    })),
    createdAt: row.created_at || '',
    updatedAt: row.updated_at || '',
  };
}

// ---- mapping: frontend product shape -> DB main payload (snake_case) ----
function productToMainPayload(body) {
  const payload = {
    status: asTrimmed(body.status) || 'active',
    internal_sku: textOrNull(body.sku),
    name: asTrimmed(body.name),
    category: textOrNull(body.category),
    subcategory: textOrNull(body.subcategory),
    factory_id: isUuid(asTrimmed(body.factoryId)) ? asTrimmed(body.factoryId) : null,
    factory_name: textOrNull(body.factoryName),
    factory_sku: textOrNull(body.factorySku),
    moq: intOrNull(body.moq),
    target_use: textOrNull(body.targetUse),
    specs_summary: textOrNull(body.specs),
    material: textOrNull(body.material),
    dimensions: textOrNull(body.dimensions),
    colour_summary: textOrNull(body.colours),
    packaging: textOrNull(body.packaging),
    decoration_options: textOrNull(body.decorationOptions),
    logo_requirements: textOrNull(body.logoRequirements),
    units_per_carton: intOrNull(body.unitsPerCarton),
    carton_length_cm: numOrNull(body.cartonLengthCm),
    carton_width_cm: numOrNull(body.cartonWidthCm),
    carton_height_cm: numOrNull(body.cartonHeightCm),
    gross_weight_kg_per_carton: numOrNull(body.grossWeightKgPerCarton),
    production_lead_time: textOrNull(body.productionLeadTime),
    sample_info: textOrNull(body.sampleInfo),
    documents_supported: textOrNull(body.documentsSupported),
    compliance_notes: textOrNull(body.complianceNotes),
    public_positioning: textOrNull(body.publicPositioning),
    front_end_tags: textOrNull(body.frontEndTags),
    internal_notes: textOrNull(body.internalNotes),
    updated_at: new Date().toISOString(),
  };
  if (isUuid(asTrimmed(body.id))) payload.id = asTrimmed(body.id);
  return payload;
}

function colourRows(productId, list) {
  return (Array.isArray(list) ? list : [])
    .filter((c) => asTrimmed(c?.name) || asTrimmed(c?.pms) || asTrimmed(c?.supplierColour) || asTrimmed(c?.hex) || asTrimmed(c?.notes))
    .map((c, i) => ({
      product_id: productId,
      sort_order: i,
      colour_name: textOrNull(c.name),
      supplier_colour: textOrNull(c.supplierColour),
      pms_code: textOrNull(c.pms),
      hex: textOrNull(c.hex),
      notes: textOrNull(c.notes),
    }));
}
function brandingRows(productId, list) {
  return (Array.isArray(list) ? list : [])
    .filter((b) => asTrimmed(b?.method) || asTrimmed(b?.position) || asTrimmed(b?.maxSize) || asTrimmed(b?.notes))
    .map((b, i) => ({
      product_id: productId,
      sort_order: i,
      method: textOrNull(b.method),
      max_size: textOrNull(b.maxSize),
      position: textOrNull(b.position),
      colour_limit: textOrNull(b.colourLimit),
      template_url: textOrNull(b.templateUrl),
      notes: textOrNull(b.notes),
    }));
}
function specRows(productId, list) {
  return (Array.isArray(list) ? list : [])
    .filter((s) => asTrimmed(s?.name) || asTrimmed(s?.description))
    .map((s, i) => ({
      product_id: productId,
      sort_order: i,
      spec_name: textOrNull(s.name),
      description: textOrNull(s.description),
    }));
}

async function loadChildren(db, productIds) {
  const ids = Array.from(new Set(productIds)).filter(Boolean);
  if (!ids.length) return { colours: {}, branding: {}, specs: {} };
  const [{ data: colours }, { data: branding }, { data: specs }] = await Promise.all([
    db.from('sourcing_product_colours').select('*').in('product_id', ids).order('sort_order'),
    db.from('sourcing_product_branding').select('*').in('product_id', ids).order('sort_order'),
    db.from('sourcing_product_specs').select('*').in('product_id', ids).order('sort_order'),
  ]);
  const group = (rows) => {
    const out = {};
    (rows || []).forEach((r) => { (out[r.product_id] = out[r.product_id] || []).push(r); });
    return out;
  };
  return { colours: group(colours), branding: group(branding), specs: group(specs) };
}

export async function GET(request) {
  if (!(await isAdmin(request))) return unauthorized();
  const db = sourcingDb();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const q = (searchParams.get('q') || '').trim();

  if (id) {
    const { data: row, error } = await db.from('sourcing_products').select('*').eq('id', id).single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    const children = await loadChildren(db, [id]);
    return NextResponse.json({
      product: rowToProduct(row, children.colours[id], children.branding[id], children.specs[id]),
    });
  }

  let query = db.from('sourcing_products').select('*').order('updated_at', { ascending: false });
  if (q) query = query.or(`name.ilike.%${q}%,internal_sku.ilike.%${q}%,category.ilike.%${q}%`);
  const { data: rows, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const children = await loadChildren(db, (rows || []).map((r) => r.id));
  return NextResponse.json({
    products: (rows || []).map((r) =>
      rowToProduct(r, children.colours[r.id], children.branding[r.id], children.specs[r.id])
    ),
  });
}

export async function POST(request) {
  if (!(await isAdmin(request))) return unauthorized();
  const body = await request.json();
  if (!asTrimmed(body.name)) {
    return NextResponse.json({ error: 'Product name is required.' }, { status: 400 });
  }

  const db = sourcingDb();
  const payload = productToMainPayload(body);

  // Upsert main row by id (or insert new).
  let saved;
  if (payload.id) {
    const res = await db.from('sourcing_products').upsert(payload, { onConflict: 'id' }).select().single();
    saved = res;
  } else {
    const res = await db.from('sourcing_products').insert(payload).select().single();
    saved = res;
  }
  if (saved.error) return NextResponse.json({ error: saved.error.message }, { status: 500 });

  const productId = saved.data.id;

  // Replace child rows for this product.
  await Promise.all([
    db.from('sourcing_product_colours').delete().eq('product_id', productId),
    db.from('sourcing_product_branding').delete().eq('product_id', productId),
    db.from('sourcing_product_specs').delete().eq('product_id', productId),
  ]);
  const colours = colourRows(productId, body.availableColours);
  const branding = brandingRows(productId, body.brandingOptions);
  const specs = specRows(productId, body.specRows);
  if (colours.length) await db.from('sourcing_product_colours').insert(colours);
  if (branding.length) await db.from('sourcing_product_branding').insert(branding);
  if (specs.length) await db.from('sourcing_product_specs').insert(specs);

  const children = await loadChildren(db, [productId]);
  return NextResponse.json({
    product: rowToProduct(saved.data, children.colours[productId], children.branding[productId], children.specs[productId]),
  });
}

export async function DELETE(request) {
  if (!(await isAdmin(request))) return unauthorized();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id is required.' }, { status: 400 });
  // Child rows are removed via ON DELETE CASCADE.
  const { error } = await sourcingDb().from('sourcing_products').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

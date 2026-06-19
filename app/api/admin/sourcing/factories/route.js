// app/api/admin/sourcing/factories/route.js
import { NextResponse } from 'next/server';
import { sourcingDb } from '@/lib/sourcingDb';
import { isAdmin, unauthorized } from '@/lib/adminAuth';

function asTrimmed(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function asNumberOrNull(value) {
  if (value === '' || value === null || value === undefined) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function documentList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => asTrimmed(item)).filter(Boolean);
  }
  return asTrimmed(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function buildFullPayload(body) {
  return {
    name: asTrimmed(body.name),
    contact_person: asTrimmed(body.contact_person) || null,
    wechat: asTrimmed(body.wechat) || null,
    phone: asTrimmed(body.phone) || null,
    email: asTrimmed(body.email) || null,
    main_categories: asTrimmed(body.main_categories) || null,
    notes: asTrimmed(body.notes) || null,
    status: body.status || 'active',
    country: asTrimmed(body.country) || 'China',
    province: asTrimmed(body.province) || null,
    city: asTrimmed(body.city) || null,
    address: asTrimmed(body.address) || null,
    payment_terms: asTrimmed(body.payment_terms) || null,
    currency: asTrimmed(body.currency) || 'RMB',
    documents_supported: documentList(body.documents_supported),
    compliance_notes: asTrimmed(body.compliance_notes) || null,
    quality_rating: asNumberOrNull(body.quality_rating),
    on_time_rating: asNumberOrNull(body.on_time_rating),
    defect_notes: asTrimmed(body.defect_notes) || null,
    blocked_reason: asTrimmed(body.blocked_reason) || null,
  };
}

function extraLine(label, value) {
  if (Array.isArray(value)) {
    return value.length ? `${label}: ${value.join(', ')}` : '';
  }
  return value === null || value === undefined || value === '' ? '' : `${label}: ${value}`;
}

function hasAdvancedFactoryInput(body) {
  return Boolean(
    asTrimmed(body.province) ||
      asTrimmed(body.city) ||
      asTrimmed(body.address) ||
      asTrimmed(body.payment_terms) ||
      asTrimmed(body.documents_supported) ||
      asTrimmed(body.compliance_notes) ||
      asTrimmed(body.quality_rating) ||
      asTrimmed(body.on_time_rating) ||
      asTrimmed(body.defect_notes) ||
      asTrimmed(body.blocked_reason) ||
      (body.status && body.status !== 'active') ||
      (asTrimmed(body.country) && asTrimmed(body.country) !== 'China') ||
      (asTrimmed(body.currency) && asTrimmed(body.currency) !== 'RMB')
  );
}

function buildLegacyNotes(body, fullPayload) {
  const marker = 'Factory profile extras:';
  const notes = asTrimmed(body.notes);
  if (notes.includes(marker) && !hasAdvancedFactoryInput(body)) return notes;

  const baseNotes = notes.includes(marker)
    ? notes.slice(0, notes.indexOf(marker)).trim()
    : notes;
  const extras = [
    extraLine('Status', fullPayload.status),
    extraLine('Country', fullPayload.country),
    extraLine('Province', fullPayload.province),
    extraLine('City', fullPayload.city),
    extraLine('Address', fullPayload.address),
    extraLine('Payment terms', fullPayload.payment_terms),
    extraLine('Currency', fullPayload.currency),
    extraLine('Supported documents', fullPayload.documents_supported),
    extraLine('Quality rating', fullPayload.quality_rating),
    extraLine('On-time rating', fullPayload.on_time_rating),
    extraLine('Compliance notes', fullPayload.compliance_notes),
    extraLine('Defect history / risk notes', fullPayload.defect_notes),
    extraLine('Blocked reason', fullPayload.blocked_reason),
  ].filter(Boolean);

  if (!extras.length) return baseNotes || null;
  return [baseNotes, [marker, ...extras].join('\n')].filter(Boolean).join('\n\n');
}

function buildLegacyPayload(body, fullPayload) {
  return {
    name: fullPayload.name,
    contact_person: fullPayload.contact_person,
    wechat: fullPayload.wechat,
    phone: fullPayload.phone,
    email: fullPayload.email,
    main_categories: fullPayload.main_categories,
    notes: buildLegacyNotes(body, fullPayload),
  };
}

function isSchemaColumnError(error) {
  const text = `${error?.code || ''} ${error?.message || ''} ${error?.details || ''}`.toLowerCase();
  return (
    text.includes('pgrst204') ||
    (text.includes('schema cache') && text.includes('column')) ||
    (text.includes('could not find') && text.includes('column'))
  );
}

async function saveFactory(db, payload, id) {
  if (id) {
    return db.from('factories').update(payload).eq('id', id).select().single();
  }
  return db.from('factories').insert(payload).select().single();
}

export async function GET(request) {
  if (!(await isAdmin(request))) return unauthorized();
  const db = sourcingDb();
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') || '').trim();
  const id = searchParams.get('id');

  if (id) {
    const { data, error } = await db.from('factories').select('*').eq('id', id).single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ factory: data });
  }

  let query = db.from('factories').select('*').order('name');
  if (q) query = query.or(`name.ilike.%${q}%,main_categories.ilike.%${q}%`);
  const { data: factories, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: quotes } = await db
    .from('factory_quotes')
    .select('factory_id, quote_date');
  const stats = {};
  (quotes || []).forEach((row) => {
    if (!stats[row.factory_id]) stats[row.factory_id] = { count: 0, last: null };
    stats[row.factory_id].count += 1;
    if (!stats[row.factory_id].last || row.quote_date > stats[row.factory_id].last) {
      stats[row.factory_id].last = row.quote_date;
    }
  });

  return NextResponse.json({
    factories: (factories || []).map((factory) => ({
      ...factory,
      quote_count: stats[factory.id]?.count || 0,
      last_quote_date: stats[factory.id]?.last || null,
    })),
  });
}

export async function POST(request) {
  if (!(await isAdmin(request))) return unauthorized();
  const body = await request.json();
  if (!body.name?.trim()) {
    return NextResponse.json({ error: 'Factory name is required.' }, { status: 400 });
  }

  const fullPayload = buildFullPayload(body);
  const db = sourcingDb();

  let { data, error } = await saveFactory(db, fullPayload, body.id);
  if (error && isSchemaColumnError(error)) {
    const fallback = await saveFactory(db, buildLegacyPayload(body, fullPayload), body.id);
    data = fallback.data;
    error = fallback.error;
    if (!error) {
      return NextResponse.json({
        factory: data,
        warning:
          'Saved using basic factory fields. Run the sourcing schema extension later to store advanced factory fields separately.',
      });
    }
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ factory: data });
}

export async function DELETE(request) {
  if (!(await isAdmin(request))) return unauthorized();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id is required.' }, { status: 400 });
  const { error } = await sourcingDb().from('factories').delete().eq('id', id);
  if (error) {
    return NextResponse.json(
      { error: 'This factory already has quote records and cannot be deleted.' },
      { status: 400 }
    );
  }
  return NextResponse.json({ ok: true });
}

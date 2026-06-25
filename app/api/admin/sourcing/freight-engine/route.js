// app/api/admin/sourcing/freight-engine/route.js
// Serves the freight rate-engine data + runs the comparison calculator + edits global settings.
import { NextResponse } from 'next/server';
import { sourcingDb } from '@/lib/sourcingDb';
import { isAdmin, unauthorized } from '@/lib/adminAuth';
import { compareCarriers, isBlacklisted } from '@/lib/freightEngine';

async function loadAll(db) {
  const [sheets, rows, surcharges, fees, blacklist, settings] = await Promise.all([
    db.from('freight_rate_sheets').select('*').eq('status', 'active').order('channel'),
    db.from('freight_rate_rows').select('*'),
    db.from('freight_surcharge_rules').select('*'),
    db.from('freight_fee_rules').select('*'),
    db.from('freight_unserviceable_postcodes').select('*'),
    db.from('sourcing_settings').select('*').eq('id', 1).maybeSingle(),
  ]);
  return {
    sheets: sheets.data || [], rows: rows.data || [], surcharges: surcharges.data || [],
    fees: fees.data || [], blacklist: blacklist.data || [], settings: settings.data || null,
  };
}

export async function GET(request) {
  if (!(await isAdmin(request))) return unauthorized();
  const db = sourcingDb();
  const { searchParams } = new URL(request.url);
  const histRow = searchParams.get('history');
  if (histRow) {
    const { data } = await db.from('freight_rate_row_history').select('*').eq('rate_row_id', histRow).order('changed_at', { ascending: false });
    return NextResponse.json({ history: data || [] });
  }
  const data = await loadAll(db);
  return NextResponse.json(data);
}

// Update ONE price field on ONE weight-band row, and log the change to history.
export async function PATCH(request) {
  if (!(await isAdmin(request))) return unauthorized();
  const db = sourcingDb();
  const { rowId, field, value, note } = await request.json();
  const ALLOWED = ['kg_rate', 'first_weight_price', 'additional_weight_price', 'flat_price', 'min_charge'];
  if (!rowId || !ALLOWED.includes(field)) return NextResponse.json({ error: 'bad field' }, { status: 400 });

  const { data: row, error: e1 } = await db.from('freight_rate_rows').select('*').eq('id', rowId).maybeSingle();
  if (e1 || !row) return NextResponse.json({ error: 'row not found' }, { status: 404 });
  const oldVal = row[field];
  const newVal = value === '' || value == null ? null : Number(value);

  const { error: e2 } = await db.from('freight_rate_rows').update({ [field]: newVal }).eq('id', rowId);
  if (e2) return NextResponse.json({ error: e2.message }, { status: 500 });

  const { data: sheet } = await db.from('freight_rate_sheets').select('carrier,service,channel').eq('id', row.rate_sheet_id).maybeSingle();
  await db.from('freight_rate_row_history').insert({
    rate_row_id: rowId, rate_sheet_id: row.rate_sheet_id,
    carrier: sheet?.carrier, service: sheet?.service, channel: sheet?.channel,
    destination_zone: row.destination_zone, weight_from: row.weight_from, weight_to: row.weight_to,
    field, old_value: oldVal, new_value: newVal, note: note || null,
  });
  return NextResponse.json({ ok: true, rowId, field, oldVal, newVal });
}

export async function POST(request) {
  if (!(await isAdmin(request))) return unauthorized();
  const db = sourcingDb();
  const body = await request.json();

  if (body.action === 'settings') {
    const patch = {};
    if (body.fx_rate_rmb_to_aud != null) {
      patch.fx_rate_rmb_to_aud = Number(body.fx_rate_rmb_to_aud);
      patch.fx_rate_updated_at = new Date().toISOString();
    }
    if (body.default_margin != null) patch.default_margin = Number(body.default_margin);
    if (body.fx_rate_source !== undefined) patch.fx_rate_source = body.fx_rate_source || null;
    const { data, error } = await db.from('sourcing_settings').update(patch).eq('id', 1).select().maybeSingle();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ settings: data });
  }

  if (body.action === 'calc') {
    const input = body.input || {};
    const { sheets, rows, surcharges, fees, blacklist, settings } = await loadAll(db);
    if (isBlacklisted(input.postcode, blacklist)) {
      return NextResponse.json({ blacklisted: true, postcode: input.postcode });
    }
    const fx = Number(input.fxRate) || Number(settings?.fx_rate_rmb_to_aud) || null;
    const rowsBySheet = {};
    for (const r of rows) (rowsBySheet[r.rate_sheet_id] ||= []).push(r);
    const globalSur = surcharges.filter((s) => s.rate_sheet_id == null);
    const globalFees = fees.filter((f) => f.rate_sheet_id == null);
    let datasets = sheets.map((s) => ({ sheet: s, rows: rowsBySheet[s.id] || [], surcharges: globalSur, fees: globalFees }));
    if (input.channel) datasets = datasets.filter((d) => d.sheet.channel === input.channel);
    const result = compareCarriers(datasets, { ...input, fxRate: fx });
    const cheapestIn = (ch) => result.valid.filter((r) => r.channel === ch).sort((a, b) => a.freightAud - b.freightAud)[0] || null;
    return NextResponse.json({
      fx,
      cheapest: result.cheapest,
      valid: result.valid,
      invalid: result.invalid,
      byChannel: { express: cheapestIn('express'), air: cheapestIn('air'), sea: cheapestIn('sea') },
    });
  }

  return NextResponse.json({ error: 'unknown action' }, { status: 400 });
}

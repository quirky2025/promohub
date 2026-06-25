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
  const data = await loadAll(sourcingDb());
  return NextResponse.json(data);
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

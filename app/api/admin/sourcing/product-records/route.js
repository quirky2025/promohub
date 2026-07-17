import { NextResponse } from 'next/server';
import { getAdminUser, isAdmin, unauthorized } from '@/lib/adminAuth';
import { sourcingDb } from '@/lib/sourcingDb';

const num = (v) => {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};
const text = (v) => (typeof v === 'string' && v.trim() ? v.trim() : null);

// Compute the derived cost/quote figures from the raw inputs.
function derive(b) {
  const qty = num(b.quantity) || 0;
  // factoryCostRmb is the EXW UNIT price (¥/个) → ×qty for the order total.
  const totalRmb = (num(b.factoryCostRmb) || 0) * qty + (num(b.cnLocalRmb) || 0) + (num(b.intlFreightRmb) || 0);
  const fx = num(b.fxRate); // ¥ per A$1
  const totalAud = fx ? Number((totalRmb / fx).toFixed(2)) : null;
  const landedUnit = (totalAud != null && qty) ? Number((totalAud / qty).toFixed(4)) : null;
  let marginPct = num(b.marginPct);
  let quoteUnit = num(b.quoteUnitAud);
  const manual = !!b.quoteManual;
  if (manual) {
    // quote typed → back-calc margin from landed
    if (quoteUnit != null && landedUnit != null && quoteUnit > 0) marginPct = Number(((1 - landedUnit / quoteUnit) * 100).toFixed(2));
  } else {
    // margin given → compute quote
    if (marginPct != null && landedUnit != null && marginPct < 100) quoteUnit = Number((landedUnit / (1 - marginPct / 100)).toFixed(2));
  }
  return { totalAud, landedUnit, marginPct, quoteUnit };
}

export async function GET(request) {
  if (!(await isAdmin(request))) return unauthorized();
  const { searchParams } = new URL(request.url);
  const quoteId = searchParams.get('quoteId');
  const sku = searchParams.get('sku');
  const db = sourcingDb();
  let query = db.from('product_cost_records').select('*').order('record_date', { ascending: false }).order('created_at', { ascending: false });
  if (quoteId) query = query.eq('factory_quote_id', quoteId);
  else if (sku) query = query.eq('sku', sku);
  else return NextResponse.json({ records: [] });
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ records: data || [] });
}

export async function POST(request) {
  const user = await getAdminUser(request);
  if (!user) return unauthorized();
  try {
    const b = await request.json();
    const db = sourcingDb();
    const d = derive(b);
    const row = {
      factory_quote_id: text(b.quoteId),
      sku: text(b.sku),
      record_date: text(b.recordDate) || new Date().toISOString().slice(0, 10),
      quantity: num(b.quantity),
      factory_cost_rmb: num(b.factoryCostRmb),
      cn_local_rmb: num(b.cnLocalRmb),
      intl_freight_rmb: num(b.intlFreightRmb),
      carrier: text(b.carrier),
      fx_rate: num(b.fxRate),
      total_cost_aud: d.totalAud,
      landed_unit_aud: d.landedUnit,
      margin_pct: d.marginPct,
      quote_unit_aud: d.quoteUnit,
      quote_manual: !!b.quoteManual,
      note: text(b.note),
    };
    if (b.id) {
      const { data, error } = await db.from('product_cost_records').update(row).eq('id', b.id).select('*').single();
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ record: data });
    }
    row.created_by = user.email;
    const { data, error } = await db.from('product_cost_records').insert(row).select('*').single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ record: data });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  if (!(await isAdmin(request))) return unauthorized();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  const { error } = await sourcingDb().from('product_cost_records').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

import { NextResponse } from 'next/server';
import { getAdminUser, isAdmin, unauthorized } from '@/lib/adminAuth';
import { sourcingDb } from '@/lib/sourcingDb';

function text(v) { return typeof v === 'string' && v.trim() ? v.trim() : null; }
function money(v) { const n = Number(v); return Number.isFinite(n) ? Math.round(n * 100) / 100 : 0; }

export async function GET(request) {
  if (!(await isAdmin(request))) return unauthorized();
  const db = sourcingDb();
  try {
    const { data, error } = await db
      .from('bank_transactions')
      .select('*')
      .order('txn_date', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(500);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    const txns = data || [];

    // running balance + a quick BAS-style summary by business line
    let balance = 0;
    const byLine = {};
    let gstCollected = 0, gstPaid = 0;
    for (const t of txns) {
      const amt = Number(t.amount_aud) || 0;
      const sign = t.direction === 'in' ? 1 : -1;
      balance += sign * amt;
      const line = t.business_line || 'overhead';
      byLine[line] = byLine[line] || { in: 0, out: 0, gstCollected: 0, gstPaid: 0 };
      if (t.direction === 'in') { byLine[line].in += amt; byLine[line].gstCollected += Number(t.gst_aud) || 0; gstCollected += Number(t.gst_aud) || 0; }
      else { byLine[line].out += amt; byLine[line].gstPaid += Number(t.gst_aud) || 0; gstPaid += Number(t.gst_aud) || 0; }
    }
    return NextResponse.json({
      transactions: txns,
      summary: { balance: money(balance), byLine, gstCollected: money(gstCollected), gstPaid: money(gstPaid), gstNet: money(gstCollected - gstPaid) },
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  const user = await getAdminUser(request);
  if (!user) return unauthorized();
  try {
    const b = await request.json();
    if (!b.direction || !['in', 'out'].includes(b.direction)) {
      return NextResponse.json({ error: 'direction (in/out) is required' }, { status: 400 });
    }
    const row = {
      txn_date: text(b.txnDate) || new Date().toISOString().slice(0, 10),
      direction: b.direction,
      amount_aud: money(b.amountAud),
      gst_aud: money(b.gstAud),
      business_line: ['local_stock', 'sourcing', 'overhead'].includes(b.businessLine) ? b.businessLine : 'overhead',
      category: text(b.category),
      counterparty: text(b.counterparty),
      description: text(b.description),
      reference: text(b.reference),
      reconciled: b.reconciled !== false,
      source: 'manual',
      created_by: user.email,
    };
    const db = sourcingDb();
    const { data, error } = await db.from('bank_transactions').insert(row).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ transaction: data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  const user = await getAdminUser(request);
  if (!user) return unauthorized();
  try {
    const b = await request.json();
    if (!b.id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
    const update = {};
    if (b.txnDate !== undefined) update.txn_date = text(b.txnDate);
    if (b.direction !== undefined) update.direction = b.direction;
    if (b.amountAud !== undefined) update.amount_aud = money(b.amountAud);
    if (b.gstAud !== undefined) update.gst_aud = money(b.gstAud);
    if (b.businessLine !== undefined) update.business_line = b.businessLine;
    if (b.category !== undefined) update.category = text(b.category);
    if (b.counterparty !== undefined) update.counterparty = text(b.counterparty);
    if (b.description !== undefined) update.description = text(b.description);
    if (b.reference !== undefined) update.reference = text(b.reference);
    if (b.reconciled !== undefined) update.reconciled = !!b.reconciled;
    if (!Object.keys(update).length) return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    const db = sourcingDb();
    const { data, error } = await db.from('bank_transactions').update(update).eq('id', b.id).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ transaction: data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  if (!(await isAdmin(request))) return unauthorized();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
  const { error } = await sourcingDb().from('bank_transactions').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

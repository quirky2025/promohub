// app/api/admin/sourcing/freight/route.js
import { NextResponse } from 'next/server';
import { sourcingDb } from '@/lib/sourcingDb';
import { isAdmin, unauthorized } from '@/lib/adminAuth';

export async function GET(request) {
  if (!(await isAdmin(request))) return unauthorized();
  const db = sourcingDb();
  const { data, error } = await db
    .from('freight_rates')
    .select('*')
    .order('effective_date', { ascending: false })
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // 每个渠道最新一条 = 当前价
  const current = {};
  for (const r of data || []) {
    if (!current[r.channel]) current[r.channel] = r;
  }
  return NextResponse.json({ rates: data || [], current });
}

export async function POST(request) {
  if (!(await isAdmin(request))) return unauthorized();
  const body = await request.json();
  if (!body.channel) return NextResponse.json({ error: '缺少渠道' }, { status: 400 });
  if (!body.rate_per_kg)
    return NextResponse.json({ error: '每kg单价必填' }, { status: 400 });

  const { data, error } = await sourcingDb()
    .from('freight_rates')
    .insert({
      channel: body.channel,
      forwarder: body.forwarder?.trim() || null,
      rate_per_kg: Number(body.rate_per_kg),
      currency: body.currency === 'AUD' ? 'AUD' : 'RMB',
      min_charge_kg: body.min_charge_kg ? Number(body.min_charge_kg) : null,
      transit_days: body.transit_days?.trim() || null,
      effective_date: body.effective_date || new Date().toISOString().slice(0, 10),
      notes: body.notes?.trim() || null,
    })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ rate: data });
}

export async function DELETE(request) {
  if (!(await isAdmin(request))) return unauthorized();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: '缺少 id' }, { status: 400 });
  const { error } = await sourcingDb().from('freight_rates').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

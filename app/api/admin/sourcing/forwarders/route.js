import { NextResponse } from 'next/server';
import { isAdmin, unauthorized } from '@/lib/adminAuth';
import { sourcingDb } from '@/lib/sourcingDb';

const t = (v) => (typeof v === 'string' && v.trim() ? v.trim() : null);

export async function GET(request) {
  if (!(await isAdmin(request))) return unauthorized();
  const db = sourcingDb();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (id) {
    const { data, error } = await db.from('forwarders').select('*').eq('id', id).single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ forwarder: data });
  }
  const { data, error } = await db.from('forwarders').select('*').order('name');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ forwarders: data || [] });
}

export async function POST(request) {
  if (!(await isAdmin(request))) return unauthorized();
  const body = await request.json();
  if (!body.name?.trim()) return NextResponse.json({ error: '货代名称必填' }, { status: 400 });
  const payload = {
    name: body.name.trim(),
    short_code: t(body.short_code)?.toUpperCase() || null,
    contact_person: t(body.contact_person),
    wechat: t(body.wechat),
    phone: t(body.phone),
    email: t(body.email),
    bank_name: t(body.bank_name),
    bank_branch: t(body.bank_branch),
    bank_address: t(body.bank_address),
    swift: t(body.swift),
    account_number: t(body.account_number),
    account_currency: t(body.account_currency) || 'AUD',
    payment_terms: t(body.payment_terms),
    remark: t(body.remark),
    notes: t(body.notes),
    updated_at: new Date().toISOString(),
  };
  const db = sourcingDb();
  const { data, error } = body.id
    ? await db.from('forwarders').update(payload).eq('id', body.id).select().single()
    : await db.from('forwarders').insert(payload).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ forwarder: data });
}

export async function DELETE(request) {
  if (!(await isAdmin(request))) return unauthorized();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: '缺少 id' }, { status: 400 });
  const { error } = await sourcingDb().from('forwarders').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}

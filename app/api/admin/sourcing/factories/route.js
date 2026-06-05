// app/api/admin/sourcing/factories/route.js
import { NextResponse } from 'next/server';
import { sourcingDb, isAdmin, unauthorized } from '@/lib/sourcingDb';

export async function GET(request) {
  if (!isAdmin(request)) return unauthorized();
  const db = sourcingDb();
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') || '').trim();
  const id = searchParams.get('id');

  // 单个工厂(详情页用)
  if (id) {
    const { data, error } = await db.from('factories').select('*').eq('id', id).single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ factory: data });
  }

  let query = db.from('factories').select('*').order('name');
  if (q) query = query.or(`name.ilike.%${q}%,main_categories.ilike.%${q}%`);
  const { data: factories, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // 每家厂的报价统计(数量 + 最近日期)
  const { data: quotes } = await db
    .from('factory_quotes')
    .select('factory_id, quote_date');
  const stats = {};
  (quotes || []).forEach((r) => {
    if (!stats[r.factory_id]) stats[r.factory_id] = { count: 0, last: null };
    stats[r.factory_id].count += 1;
    if (!stats[r.factory_id].last || r.quote_date > stats[r.factory_id].last) {
      stats[r.factory_id].last = r.quote_date;
    }
  });

  return NextResponse.json({
    factories: (factories || []).map((f) => ({
      ...f,
      quote_count: stats[f.id]?.count || 0,
      last_quote_date: stats[f.id]?.last || null,
    })),
  });
}

export async function POST(request) {
  if (!isAdmin(request)) return unauthorized();
  const body = await request.json();
  if (!body.name?.trim()) {
    return NextResponse.json({ error: '工厂名称必填' }, { status: 400 });
  }
  const payload = {
    name: body.name.trim(),
    contact_person: body.contact_person?.trim() || null,
    wechat: body.wechat?.trim() || null,
    phone: body.phone?.trim() || null,
    email: body.email?.trim() || null,
    main_categories: body.main_categories?.trim() || null,
    notes: body.notes?.trim() || null,
  };
  const db = sourcingDb();
  const { data, error } = body.id
    ? await db.from('factories').update(payload).eq('id', body.id).select().single()
    : await db.from('factories').insert(payload).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ factory: data });
}

export async function DELETE(request) {
  if (!isAdmin(request)) return unauthorized();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: '缺少 id' }, { status: 400 });
  const { error } = await sourcingDb().from('factories').delete().eq('id', id);
  if (error) {
    // 已有报价记录时外键阻止删除(有意为之)
    return NextResponse.json(
      { error: '该工厂已有报价记录,不能删除' },
      { status: 400 }
    );
  }
  return NextResponse.json({ ok: true });
}

// app/api/admin/sourcing/quotes/route.js
import { NextResponse } from 'next/server';
import { sourcingDb } from '@/lib/sourcingDb';
import { isAdmin, unauthorized } from '@/lib/adminAuth';

export async function GET(request) {
  if (!(await isAdmin(request))) return unauthorized();
  const db = sourcingDb();
  const { searchParams } = new URL(request.url);
  const factoryId = searchParams.get('factory_id');
  const product = (searchParams.get('product') || '').trim();
  const exactProduct = (searchParams.get('product_exact') || '').trim();
  const namesOnly = searchParams.get('names') === '1';

  // 产品名自动提示(全库去重)
  if (namesOnly) {
    const { data } = await db.from('factory_quotes').select('product_name');
    const names = [...new Set((data || []).map((r) => r.product_name))].sort();
    return NextResponse.json({ names });
  }

  let query = db
    .from('factory_quotes')
    .select('*, factories(id, name), quote_tiers(*)')
    .order('quote_date', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(300);

  if (factoryId) query = query.eq('factory_id', factoryId);
  if (exactProduct) query = query.eq('product_name', exactProduct);
  else if (product) query = query.ilike('product_name', `%${product}%`);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const quotes = (data || []).map((q) => ({
    ...q,
    quote_tiers: [...(q.quote_tiers || [])].sort((a, b) => a.quantity - b.quantity),
  }));
  return NextResponse.json({ quotes });
}

export async function POST(request) {
  if (!(await isAdmin(request))) return unauthorized();
  const body = await request.json();

  if (!body.factory_id) return NextResponse.json({ error: '缺少工厂' }, { status: 400 });
  if (!body.product_name?.trim())
    return NextResponse.json({ error: '产品名称必填' }, { status: 400 });
  if (!body.exchange_rate)
    return NextResponse.json({ error: '汇率必填' }, { status: 400 });
  const tiers = (body.tiers || []).filter((t) => t.quantity && t.exw_unit_price_rmb);
  if (!tiers.length)
    return NextResponse.json({ error: '至少填一档数量报价' }, { status: 400 });

  const db = sourcingDb();
  const { data: quote, error } = await db
    .from('factory_quotes')
    .insert({
      factory_id: body.factory_id,
      quote_date: body.quote_date || new Date().toISOString().slice(0, 10),
      product_name: body.product_name.trim(),
      product_spec: body.product_spec?.trim() || null,
      printing_method: body.printing_method?.trim() || null,
      lead_time_days: body.lead_time_days ? Number(body.lead_time_days) : null,
      exchange_rate: Number(body.exchange_rate),
      est_unit_weight_g: body.est_unit_weight_g ? Number(body.est_unit_weight_g) : null,
      domestic_freight_rmb: body.domestic_freight_rmb ? Number(body.domestic_freight_rmb) : null,
      notes: body.notes?.trim() || null,
    })
    .select('id')
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const rows = tiers.map((t, i) => ({
    quote_id: quote.id,
    quantity: Number(t.quantity),
    exw_unit_price_rmb: Number(t.exw_unit_price_rmb),
    customer_unit_price_aud: t.customer_unit_price_aud
      ? Number(t.customer_unit_price_aud)
      : null,
    sort_order: i,
  }));
  const { error: e2 } = await db.from('quote_tiers').insert(rows);
  if (e2) return NextResponse.json({ error: e2.message }, { status: 500 });

  return NextResponse.json({ ok: true, id: quote.id });
}

export async function DELETE(request) {
  if (!(await isAdmin(request))) return unauthorized();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: '缺少 id' }, { status: 400 });
  const { error } = await sourcingDb().from('factory_quotes').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

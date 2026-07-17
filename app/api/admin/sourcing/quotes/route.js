// app/api/admin/sourcing/quotes/route.js
import { NextResponse } from 'next/server';
import { sourcingDb } from '@/lib/sourcingDb';
import { isAdmin, unauthorized } from '@/lib/adminAuth';

const isUuid = (v) => typeof v === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);

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
  else if (product) query = query.or(`product_name.ilike.%${product}%,product_code.ilike.%${product}%`);

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
  const editing = isUuid(body.id);

  const payload = {
    factory_id: body.factory_id,
    quote_date: body.quote_date || new Date().toISOString().slice(0, 10),
    product_code: body.product_code?.trim() || null,
    product_name: body.product_name.trim(),
    product_spec: body.product_spec?.trim() || null,
    material: body.material?.trim() || null,
    product_size: body.product_size?.trim() || null,
    craft: body.craft?.trim() || null,
    packaging: body.packaging?.trim() || null,
    printing_method: body.printing_method?.trim() || null,
    lead_time_days: body.lead_time_days ? Number(body.lead_time_days) : null,
    exchange_rate: Number(body.exchange_rate),
    est_unit_weight_g: body.est_unit_weight_g ? Number(body.est_unit_weight_g) : null,
    domestic_freight_rmb: body.domestic_freight_rmb ? Number(body.domestic_freight_rmb) : null,
    units_per_carton: body.units_per_carton ? Number(body.units_per_carton) : null,
    carton_length_cm: body.carton_length_cm ? Number(body.carton_length_cm) : null,
    carton_width_cm: body.carton_width_cm ? Number(body.carton_width_cm) : null,
    carton_height_cm: body.carton_height_cm ? Number(body.carton_height_cm) : null,
    available_colours: body.available_colours?.trim() || null,
    image_url: body.image_url?.trim() || null,
    group_id: isUuid(body.group_id) ? body.group_id : null,
    status: body.status?.trim() || 'active',
    setup_cost_rmb: body.setup_cost_rmb ? Number(body.setup_cost_rmb) : null,
    tooling_cost_rmb: body.tooling_cost_rmb ? Number(body.tooling_cost_rmb) : null,
    sample_cost_rmb: body.sample_cost_rmb ? Number(body.sample_cost_rmb) : null,
    notes: body.notes?.trim() || null,
  };

  let quote, error;
  if (editing) {
    // Edit existing product — keep its SKU (only set if caller supplied one).
    if (body.sku?.trim()) payload.sku = body.sku.trim();
    ({ data: quote, error } = await db.from('factory_quotes').update(payload).eq('id', body.id).select('id, sku').single());
  } else {
    // New product — auto-generate SKU = {factory short_code}-{seq}.
    let sku = body.sku?.trim() || null;
    if (!sku) {
      const { data: fac } = await db.from('factories').select('short_code, name').eq('id', body.factory_id).single();
      let code = (fac?.short_code || '').trim().toUpperCase();
      if (!code) code = (fac?.name || 'F').replace(/[^A-Za-z0-9]/g, '').slice(0, 4).toUpperCase() || 'F';
      const { data: ctr } = await db.from('factory_sku_counters').select('next_seq').eq('factory_id', body.factory_id).single();
      const seq = ctr?.next_seq || 1;
      if (ctr) await db.from('factory_sku_counters').update({ next_seq: seq + 1 }).eq('factory_id', body.factory_id);
      else await db.from('factory_sku_counters').insert({ factory_id: body.factory_id, next_seq: 2 });
      sku = `${code}-${String(seq).padStart(3, '0')}`;
    }
    payload.sku = sku;
    ({ data: quote, error } = await db.from('factory_quotes').insert(payload).select('id, sku').single());
  }
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Replace tiers (delete existing then insert — covers both new + edit).
  await db.from('quote_tiers').delete().eq('quote_id', quote.id);
  const rows = tiers.map((t, i) => ({
    quote_id: quote.id,
    quantity: Number(t.quantity),
    exw_unit_price_rmb: Number(t.exw_unit_price_rmb),
    customer_unit_price_aud: t.customer_unit_price_aud ? Number(t.customer_unit_price_aud) : null,
    sort_order: i,
  }));
  const { error: e2 } = await db.from('quote_tiers').insert(rows);
  if (e2) return NextResponse.json({ error: e2.message }, { status: 500 });

  return NextResponse.json({ ok: true, id: quote.id, sku: quote.sku });
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

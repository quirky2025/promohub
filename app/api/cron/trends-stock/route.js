import { sourcingDb } from '@/lib/sourcingDb';

// D11-3 · Trends 库存定时同步(确定性版)
// 数据源:GET https://au.api.trends.nz/api/v1/stock/{code}.json(Bearer TRENDS_API_TOKEN)
// 返回 data[]: { stock_code, description(品名+颜色), quantity, next_shipment(在途数量), due_date }
// 写入:product_stock(当前,覆盖式)+ product_stock_history(每日留痕,算热销用)
// 触发:Vercel Cron(每日)或手动 GET ?key=<TRENDS_PROBE_KEY>
// 策略:单次调用内循环处理,时间预算 BUDGET_MS 用完即返回并报告剩余;
//       排序 = 最久未同步的产品优先(自平衡:多次触发/隔天 cron 必然覆盖全量)。
// Indent 定制货无现货库存,跳过(Lily 2026-07-21)。

export const maxDuration = 300;

const BASE = process.env.TRENDS_API_BASE || 'https://au.api.trends.nz';
const CHUNK = 120;
const CONCURRENCY = 6;
const BUDGET_MS = 240000; // 4 分钟预算,给写库和响应留余量

function authorised(request) {
  const url = new URL(request.url);
  const key = url.searchParams.get('key');
  const probeKey = process.env.PROBE_KEY || process.env.TRENDS_PROBE_KEY;
  if (probeKey && key === probeKey) return true;
  const authHeader = request.headers.get('authorization') || '';
  if (process.env.CRON_SECRET && authHeader === `Bearer ${process.env.CRON_SECRET}`) return true;
  if ((request.headers.get('user-agent') || '').includes('vercel-cron')) return true;
  return false;
}

// 颜色名 = 库存行 description 去掉品名前缀;剥不掉则整串保底
function colourFromDescription(desc, productName) {
  const d = String(desc || '').trim();
  const n = String(productName || '').trim();
  if (n && d.toLowerCase().startsWith(n.toLowerCase())) {
    const rest = d.slice(n.length).replace(/^[\s\-–—:]+/, '').trim();
    return rest;
  }
  return d === n ? '' : d;
}

async function fetchStock(sku, token) {
  const res = await fetch(`${BASE}/api/v1/stock/${sku}.json`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    cache: 'no-store',
  });
  if (!res.ok) return { sku, error: res.status };
  const json = await res.json().catch(() => null);
  if (!json || !Array.isArray(json.data)) return { sku, error: 'bad_body' };
  return { sku, items: json.data };
}

async function processChunk(db, slice, token) {
  const bySku = new Map(slice.map(p => [p.supplier_sku, p]));
  const results = [];
  const queue = [...slice];
  await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
    for (;;) {
      const p = queue.shift();
      if (!p) return;
      results.push(await fetchStock(p.supplier_sku, token));
    }
  }));

  const now = new Date().toISOString();
  // 同产品多变体可能折叠到同一颜色名(如多尺码)→ 按 (product, colour) 聚合防撞唯一键
  const agg = new Map();
  let okCount = 0, errCount = 0;
  for (const r of results) {
    if (r.error) { errCount++; continue; }
    okCount++;
    const p = bySku.get(r.sku);
    for (const it of r.items) {
      const colour = colourFromDescription(it.description, p.name);
      const qty = Number.isFinite(it.quantity) ? it.quantity : 0;
      const incoming = Number(it.next_shipment) || 0;
      const due = (it.due_date && it.due_date !== '-') ? String(it.due_date) : null;
      const key = `${p.id}||${colour.toLowerCase()}`;
      const prev = agg.get(key);
      if (prev) {
        prev.qty += qty;
        if (!prev.next_shipment && due) prev.next_shipment = incoming > 0 ? `${due} (+${incoming})` : due;
      } else {
        agg.set(key, {
          product_id: p.id,
          colour_name: colour,
          qty,
          next_shipment: due ? (incoming > 0 ? `${due} (+${incoming})` : due) : null,
          supplier: 'Trends',
          synced_at: now,
          _sku: r.sku,
        });
      }
    }
  }
  const stockRows = [...agg.values()].map(({ _sku, ...row }) => row);
  const historyRows = [...agg.values()].map(r => ({
    supplier_sku: r._sku, colour_name: r.colour_name, qty: r.qty, supplier: 'Trends',
  }));

  let writeError = null;
  const ids = slice.map(p => p.id);
  const del = await db.from('product_stock').delete().in('product_id', ids);
  if (del.error) writeError = `delete: ${del.error.message}`;
  if (!writeError && stockRows.length) {
    const ins = await db.from('product_stock').insert(stockRows);
    if (ins.error) writeError = `insert: ${ins.error.message}`;
  }
  if (historyRows.length) {
    await db.from('product_stock_history')
      .upsert(historyRows, { onConflict: 'supplier_sku,colour_name,captured_at', ignoreDuplicates: true });
  }
  return { okCount, errCount, rows: writeError ? 0 : stockRows.length, writeError };
}

export async function GET(request) {
  if (!authorised(request)) return Response.json({ error: 'unauthorized' }, { status: 401 });
  const token = process.env.TRENDS_API_TOKEN;
  if (!token) return Response.json({ error: 'Missing TRENDS_API_TOKEN' }, { status: 500 });

  const started = Date.now();
  const db = sourcingDb();

  // 全部 Trends 产品(6 位纯数字货号,非 Indent)
  const all = [];
  const PAGE = 1000;
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await db
      .from('products')
      .select('id, supplier_sku, name, indent_type')
      .eq('is_published', true)
      .order('supplier_sku')
      .range(from, from + PAGE - 1);
    if (error) return Response.json({ error: error.message }, { status: 500 });
    (data || []).forEach(p => { if (/^\d{6}$/.test(p.supplier_sku || '') && !p.indent_type) all.push(p); });
    if (!data || data.length < PAGE) break;
  }

  // 最久未同步优先:查每个产品最近一次 synced_at,没有记录的排最前
  const lastSynced = new Map();
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await db
      .from('product_stock')
      .select('product_id, synced_at')
      .range(from, from + PAGE - 1);
    if (error) break;
    (data || []).forEach(r => {
      const cur = lastSynced.get(r.product_id);
      if (!cur || r.synced_at > cur) lastSynced.set(r.product_id, r.synced_at);
    });
    if (!data || data.length < PAGE) break;
  }
  all.sort((a, b) => (lastSynced.get(a.id) || '').localeCompare(lastSynced.get(b.id) || ''));

  // 时间预算内循环处理
  let processed = 0, ok = 0, err = 0, rows = 0;
  const writeErrors = [];
  let cursor = 0;
  while (cursor < all.length && Date.now() - started < BUDGET_MS) {
    const slice = all.slice(cursor, cursor + CHUNK);
    const r = await processChunk(db, slice, token);
    processed += slice.length; ok += r.okCount; err += r.errCount; rows += r.rows;
    if (r.writeError) writeErrors.push(r.writeError);
    cursor += slice.length;
  }

  return Response.json({
    total_trends_products: all.length,
    processed,
    products_ok: ok,
    products_err: err,
    rows_written: rows,
    write_errors: writeErrors.length ? writeErrors : null,
    remaining: all.length - processed,
    elapsed_s: Math.round((Date.now() - started) / 1000),
    hint: all.length - processed > 0 ? 'Trigger again to continue (oldest-first, safe to repeat)' : 'All synced',
  });
}

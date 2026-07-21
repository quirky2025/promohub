import { after } from 'next/server';
import { sourcingDb } from '@/lib/sourcingDb';

// D11-3 · Trends 库存定时同步
// 数据源:GET https://au.api.trends.nz/api/v1/stock/{code}.json(Bearer TRENDS_API_TOKEN)
// 返回 data[]: { stock_code, description(品名+颜色), quantity, next_shipment(在途数量), due_date }
// 写入:product_stock(当前,覆盖式)+ product_stock_history(每日留痕,算热销用)
// 触发:Vercel Cron(每日)或手动 GET ?key=<TRENDS_PROBE_KEY>
// 大目录分片:每次处理 CHUNK 个 SKU,处理完自动 after() 续跑下一片,直到全量完成。

export const maxDuration = 300;

const BASE = process.env.TRENDS_API_BASE || 'https://au.api.trends.nz';
const CHUNK = 120;
const CONCURRENCY = 6;

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

export async function GET(request) {
  if (!authorised(request)) return Response.json({ error: 'unauthorized' }, { status: 401 });
  const token = process.env.TRENDS_API_TOKEN;
  if (!token) return Response.json({ error: 'Missing TRENDS_API_TOKEN' }, { status: 500 });

  const url = new URL(request.url);
  const offset = Math.max(0, parseInt(url.searchParams.get('offset') || '0', 10) || 0);
  const db = sourcingDb();

  // 全部 Trends 产品(6 位纯数字货号),稳定排序保证分片不重不漏
  const all = [];
  const PAGE = 1000;
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await db
      .from('products')
      .select('id, supplier_sku, name')
      .eq('is_published', true)
      .order('supplier_sku')
      .range(from, from + PAGE - 1);
    if (error) return Response.json({ error: error.message }, { status: 500 });
    (data || []).forEach(p => { if (/^\d{6}$/.test(p.supplier_sku || '')) all.push(p); });
    if (!data || data.length < PAGE) break;
  }

  const slice = all.slice(offset, offset + CHUNK);
  if (slice.length === 0) {
    return Response.json({ done: true, total: all.length, offset });
  }

  // 并发拉库存(限速礼貌:CONCURRENCY 路并行)
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
  const stockRows = [];
  const historyRows = [];
  let okCount = 0, errCount = 0;
  for (const r of results) {
    if (r.error) { errCount++; continue; }
    okCount++;
    const p = bySku.get(r.sku);
    for (const it of r.items) {
      const colour = colourFromDescription(it.description, p.name);
      const qty = Number.isFinite(it.quantity) ? it.quantity : null;
      const incoming = Number(it.next_shipment) || 0;
      const due = (it.due_date && it.due_date !== '-') ? String(it.due_date) : null;
      stockRows.push({
        product_id: p.id,
        colour_name: colour,
        qty,
        next_shipment: due ? (incoming > 0 ? `${due} (+${incoming})` : due) : null,
        supplier: 'Trends',
        synced_at: now,
      });
      historyRows.push({ supplier_sku: r.sku, colour_name: colour, qty, supplier: 'Trends' });
    }
  }

  // 覆盖式写入:先删本片产品的旧行,再插新行
  const ids = slice.map(p => p.id);
  const del = await db.from('product_stock').delete().in('product_id', ids);
  if (del.error) return Response.json({ error: `delete: ${del.error.message}` }, { status: 500 });
  if (stockRows.length) {
    const ins = await db.from('product_stock').insert(stockRows);
    if (ins.error) return Response.json({ error: `insert: ${ins.error.message}` }, { status: 500 });
  }
  if (historyRows.length) {
    await db.from('product_stock_history')
      .upsert(historyRows, { onConflict: 'supplier_sku,colour_name,captured_at', ignoreDuplicates: true });
  }

  // 还有剩余 → 响应后自动续跑下一片
  const nextOffset = offset + slice.length;
  const hasMore = nextOffset < all.length;
  if (hasMore) {
    const probeKey = process.env.PROBE_KEY || process.env.TRENDS_PROBE_KEY;
    const selfUrl = `${url.origin}${url.pathname}?key=${encodeURIComponent(probeKey || '')}&offset=${nextOffset}`;
    after(async () => { try { await fetch(selfUrl); } catch {} });
  }

  return Response.json({
    offset,
    processed: slice.length,
    products_ok: okCount,
    products_err: errCount,
    rows_written: stockRows.length,
    total_trends_products: all.length,
    continues: hasMore,
  });
}

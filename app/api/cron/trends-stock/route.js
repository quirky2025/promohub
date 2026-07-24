import { sourcingDb } from '@/lib/sourcingDb';

// D11-3/5 · 供应商库存定时同步(确定性版):先 Trends,后 PromoBrands,同一预算内跑完。
// (Hobby 计划 cron 上限 2 个,故两家共用本路由;路径名沿用 trends-stock。)
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
const CONCURRENCY = 3;        // 温柔敲门,防限流
const BUDGET_MS = 240000;     // 4 分钟预算,给写库和响应留余量
const RETRY_WAIT_MS = 1500;   // 429/5xx 重试等待

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

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// Lily 2026-07-24 踩坑:supabase-js 的查询本身没有内置超时,数据库那端一旦卡住,
// await 会无限期挂着,跟外部 fetch 卡死是一模一样的表现,但之前只顾着给 fetch 加超时,
// 漏了这里。用 Promise.race 包一层,卡住就当错误处理,不再无限期挂起。
function withTimeout(promiseLike, ms, label) {
  return Promise.race([
    promiseLike,
    new Promise((resolve) => setTimeout(() => resolve({ data: null, error: { message: `timeout after ${ms}ms: ${label}` } }), ms)),
  ]);
}

async function fetchStock(sku, token) {
  for (let attempt = 0; attempt < 3; attempt++) {
    let res;
    try {
      res = await fetch(`${BASE}/api/v1/stock/${sku}.json`, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        cache: 'no-store',
      });
    } catch {
      await sleep(RETRY_WAIT_MS);
      continue;
    }
    if (res.ok) {
      const json = await res.json().catch(() => null);
      if (!json || !Array.isArray(json.data)) return { sku, error: 'bad_body' };
      return { sku, items: json.data };
    }
    if (res.status === 429 || res.status >= 500) {
      await sleep(RETRY_WAIT_MS * (attempt + 1));
      continue;
    }
    return { sku, error: res.status }; // 404 等硬错误不重试
  }
  return { sku, error: 'retries_exhausted' };
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
  // 只清除本次成功拉到数据的产品的旧行;拉取失败的保留旧数据(宁可旧,不可丢)
  const ids = results.filter(r => !r.error).map(r => bySku.get(r.sku).id);
  const del = ids.length
    ? await db.from('product_stock').delete().in('product_id', ids)
    : { error: null };
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

// ── D11-5 · PromoBrands(Cognito 认证;/product 分页返回体自带 Inventory)──
const PB_TOKEN_URL = 'https://promobrandrestapi.auth.ap-southeast-2.amazoncognito.com/oauth2/token';
const PB_BASE = process.env.PROMOBRANDS_API_BASE || 'https://api.promobrands.com.au';

async function pbIdToken() {
  const clientId = String(process.env.PROMOBRANDS_CLIENT_ID || '').replace(/\s+/g, '');
  const refreshToken = String(process.env.PROMOBRANDS_REFRESH_TOKEN || '').replace(/\s+/g, '');
  if (!clientId || !refreshToken) return null;
  const res = await fetch(PB_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'refresh_token', client_id: clientId, refresh_token: refreshToken }),
    cache: 'no-store',
    signal: AbortSignal.timeout(15000),
  });
  const data = await res.json().catch(() => ({}));
  return data.id_token || null;
}

function pbColour(c) {
  const v = String(c || '').trim();
  return /^misc$/i.test(v) ? '' : v;
}

// 同步 PromoBrands:翻遍 PB 目录页,命中我们库里的 PB SKU 就写库存。
async function syncPromoBrands(db, started, deadlineMs) {
  const out = { supplier: 'PromoBrands', products_ok: 0, rows_written: 0, pages: 0, skipped: false, error: null };
  try {
    const token = await pbIdToken();
    if (!token) { out.skipped = true; out.error = 'no credentials'; return out; }

    // 我们库里的 PB 产品
    const ours = new Map(); // Product_Code(upper) -> {id, name}
    const PAGE = 1000;
    for (let from = 0; ; from += PAGE) {
      const { data, error } = await db
        .from('products')
        .select('id, supplier_sku, name, indent_type')
        .eq('is_published', true)
        .eq('supplier', 'PromoBrands')
        .range(from, from + PAGE - 1);
      if (error) { out.error = error.message; return out; }
      // Lily 2026-07-24 踩坑:这里之前没有 .trim(),supplier_sku 带空格的(比如 "B118 "、"M452 ")
      // 永远匹配不上 PB 干净的 Product_Code,库存永远补不上——跟今天一整天遇到的 trim 坑是同一个模式。
      (data || []).forEach(p => { if (!p.indent_type && p.supplier_sku) ours.set(String(p.supplier_sku).trim().toUpperCase(), p); });
      if (!data || data.length < PAGE) break;
    }
    if (ours.size === 0) { out.skipped = true; out.error = 'no PromoBrands products in DB'; return out; }

    const now = new Date().toISOString();
    const stockRows = [];
    const historyRows = [];
    const okIds = [];
    let after = 0;
    for (;;) {
      if (Date.now() - started > deadlineMs) { out.error = 'budget exhausted (resume next run)'; break; }
      // PB 规矩:首页不能带 After(After=0 会回 "Invalid Query Parameter"),翻页才带
      const qs = after > 0 ? `PageSize=100&Order=ASC&After=${after}` : 'PageSize=100&Order=ASC';
      let res;
      try {
        // Lily 2026-07-24 踩坑:之前这个 fetch 没设超时,PB 那边一旦某次请求卡住不响应,
        // 整个函数会一直挂着(比 Vercel maxDuration 表现得还诡异,客户端连接一直不断),
        // 前端轮询几分钟都拿不到结果。加 15s 超时,卡住就直接判定这页失败、跳出循环报错,
        // 而不是无限期挂起。
        res = await fetch(`${PB_BASE}/product?${qs}`, {
          headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
          cache: 'no-store',
          signal: AbortSignal.timeout(15000),
        });
      } catch (e) {
        out.error = `PB /product fetch failed/timeout: ${String(e?.message || e)}`;
        break;
      }
      if (!res.ok) { out.error = `PB /product ${res.status}`; break; }
      const list = await res.json().catch(() => null);
      if (!Array.isArray(list)) { out.error = typeof list === 'string' ? `PB said: ${list}` : 'PB bad body'; break; }
      if (list.length === 0) break;
      out.pages++;
      let foundAll = false;
      for (const prod of list) {
        after = Math.max(after, Number(prod.Product_ID) || after);
        const pcode = String(prod.Product_Code || '').trim().toUpperCase();
        const mine = ours.get(pcode);
        if (!mine) continue;
        ours.delete(pcode);
        if (ours.size === 0) foundAll = true;
        const inv = Array.isArray(prod.Inventory) ? prod.Inventory : [];
        const agg = new Map();
        for (const row of inv) {
          const d = row?.InventoryDetails || {};
          const colour = pbColour(d.colour);
          const qty = parseInt(d.onHand, 10) || 0;
          let next = null;
          const eta = Array.isArray(d.etaStock) ? d.etaStock[0] : null;
          if (eta && typeof eta === 'object') {
            const date = eta.eta || eta.date || eta.etaDate || '';
            const q = eta.qty || eta.quantity || '';
            next = [date, q ? `(+${q})` : ''].filter(Boolean).join(' ') || null;
          }
          const key = colour.toLowerCase();
          const prev = agg.get(key);
          if (prev) { prev.qty += qty; if (!prev.next_shipment && next) prev.next_shipment = next; }
          else agg.set(key, { product_id: mine.id, colour_name: colour, qty, next_shipment: next, supplier: 'PromoBrands', synced_at: now });
        }
        if (agg.size) {
          okIds.push(mine.id);
          out.products_ok++;
          for (const r of agg.values()) {
            stockRows.push(r);
            historyRows.push({ supplier_sku: String(prod.Product_Code), colour_name: r.colour_name, qty: r.qty, supplier: 'PromoBrands' });
          }
        }
      }
      if (foundAll || list.length < 100) break;
    }

    // 诊断:扫完/预算用完之后,ours 里还剩多少个没在 PB 目录页里遇到过(帮排查"明明有货但同步
    // 不上"是扫描没覆盖到,还是 PB 目录本身没有这个码)。剩太多不代表全错,PB 目录本身有分页深度。
    out.unmatched_count = ours.size;
    if (ours.size > 0 && ours.size <= 20) out.unmatched_sample = [...ours.keys()];

    if (okIds.length) {
      for (let i = 0; i < okIds.length; i += 300) {
        const del = await db.from('product_stock').delete().in('product_id', okIds.slice(i, i + 300));
        if (del.error) { out.error = `delete: ${del.error.message}`; return out; }
      }
      for (let i = 0; i < stockRows.length; i += 500) {
        const ins = await db.from('product_stock').insert(stockRows.slice(i, i + 500));
        if (ins.error) { out.error = `insert: ${ins.error.message}`; return out; }
      }
      out.rows_written = stockRows.length;
      if (historyRows.length) {
        await db.from('product_stock_history')
          .upsert(historyRows, { onConflict: 'supplier_sku,colour_name,captured_at', ignoreDuplicates: true });
      }
    }
  } catch (e) {
    out.error = String(e?.message || e);
  }
  return out;
}

export async function GET(request) {
  if (!authorised(request)) return Response.json({ error: 'unauthorized' }, { status: 401 });
  const token = process.env.TRENDS_API_TOKEN;
  if (!token) return Response.json({ error: 'Missing TRENDS_API_TOKEN' }, { status: 500 });

  const started = Date.now();
  const db = sourcingDb();

  // PB 专列:?only=pb → 全部预算给 PromoBrands(手动补跑用)
  const only = new URL(request.url).searchParams.get('only');
  if (only === 'pb') {
    // Lily 2026-07-24 踩坑:光给 PB 官方接口的 fetch 加超时还不够——今天实测发现,加了之后
    // 还是整个卡住不返回,说明还有别的地方会卡死(比如查我们自己数据库那段循环,没有超时保护)。
    // 与其一个个找卡点补超时,不如在最外层加个总看门狗:不管卡在哪一步,到点强制返回诊断信息,
    // 不再让客户端无限期等下去。
    const WATCHDOG_MS = 270000;
    const pb = await Promise.race([
      syncPromoBrands(db, started, BUDGET_MS),
      new Promise((resolve) => setTimeout(() => resolve({
        supplier: 'PromoBrands', products_ok: 0, rows_written: 0, pages: 0, skipped: false,
        error: 'watchdog: 270s 内没有返回,卡在 syncPromoBrands 内部某一步(数据库查询或 PB 接口调用),具体位置需要看 Vercel 函数日志',
      }), WATCHDOG_MS)),
    ]);
    return Response.json({ promobrands: pb, elapsed_s: Math.round((Date.now() - started) / 1000) });
  }

  // 全部 Trends 产品,非 Indent。
  // Lily 2026-07-23 踩坑记录:这里以前用 /^\d{6}$/ 猜"是不是 Trends 产品",D15 批量导入的
  // Trends 新品里有一批是短字母数字码(T874/D436/S850 这种,不是 6 位纯数字),被这条正则
  // 永久排除在库存同步之外,不管触发多少次都不会补上。现在直接认 supplier 字段,不再猜。
  const all = [];
  const PAGE = 1000;
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await db
      .from('products')
      .select('id, supplier_sku, name, indent_type')
      .eq('is_published', true)
      .eq('supplier', 'Trends')
      .order('supplier_sku')
      .range(from, from + PAGE - 1);
    if (error) return Response.json({ error: error.message }, { status: 500 });
    (data || []).forEach(p => { if (!p.indent_type) all.push(p); });
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

  // Trends 跑完(或预算用尽)后,剩余预算给 PromoBrands
  const pb = await syncPromoBrands(db, started, BUDGET_MS + 30000);

  return Response.json({
    trends: {
      total_products: all.length,
      processed,
      products_ok: ok,
      products_err: err,
      rows_written: rows,
      write_errors: writeErrors.length ? writeErrors : null,
      remaining: all.length - processed,
    },
    promobrands: pb,
    elapsed_s: Math.round((Date.now() - started) / 1000),
    hint: (all.length - processed > 0 || (pb.error && !pb.skipped)) ? 'Trigger again to continue (safe to repeat)' : 'All synced',
  });
}

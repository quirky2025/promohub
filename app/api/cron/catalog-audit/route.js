import { sourcingDb } from '@/lib/sourcingDb';

// D14 · 供应商目录对账报告(报告制,不自动改库)
// GET /api/cron/catalog-audit?key=<TRENDS_PROBE_KEY> → HTML 报告:
//   ① 供应商有、我们没有的新品(名称/链接/最低价)
//   ② 我们在售、供应商已下架/停售的产品(附现成下线 SQL,Lily 审核后自己跑)
// 覆盖:Trends(products.json,含 discontinued 标记)+ PromoBrands(/product 全目录翻页)。

export const maxDuration = 300;

const TRENDS_BASE = process.env.TRENDS_API_BASE || 'https://au.api.trends.nz';
const PB_TOKEN_URL = 'https://promobrandrestapi.auth.ap-southeast-2.amazoncognito.com/oauth2/token';
const PB_BASE = process.env.PROMOBRANDS_API_BASE || 'https://api.promobrands.com.au';

function authorised(request) {
  const key = new URL(request.url).searchParams.get('key');
  const probeKey = process.env.PROBE_KEY || process.env.TRENDS_PROBE_KEY;
  return !!probeKey && key === probeKey;
}

async function pbIdToken() {
  const clientId = String(process.env.PROMOBRANDS_CLIENT_ID || '').replace(/\s+/g, '');
  const refreshToken = String(process.env.PROMOBRANDS_REFRESH_TOKEN || '').replace(/\s+/g, '');
  if (!clientId || !refreshToken) return null;
  const res = await fetch(PB_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'refresh_token', client_id: clientId, refresh_token: refreshToken }),
    cache: 'no-store',
  });
  const data = await res.json().catch(() => ({}));
  return data.id_token || null;
}

// 我们库里某供应商的全部产品(含未发布,便于识别"其实已下过线"的)
async function ourProducts(db, supplierFilter) {
  const map = new Map();
  const PAGE = 1000;
  for (let from = 0; ; from += PAGE) {
    let q = db.from('products')
      .select('supplier_sku, name, is_published, supplier')
      .range(from, from + PAGE - 1);
    const { data, error } = await q;
    if (error || !data) break;
    data.forEach(p => {
      if (supplierFilter(p) && p.supplier_sku) map.set(String(p.supplier_sku).toUpperCase(), p);
    });
    if (data.length < PAGE) break;
  }
  return map;
}

async function auditTrends(db) {
  const token = process.env.TRENDS_API_TOKEN;
  const out = { supplier: 'Trends', newAtSupplier: [], goneAtSupplier: [], supplierTotal: 0, error: null };
  if (!token) { out.error = 'no TRENDS_API_TOKEN'; return out; }
  const ours = await ourProducts(db, p => /^\d{6}$/.test(p.supplier_sku || ''));

  const seen = new Map(); // code -> {name, active}
  for (let page = 1; page < 40; page++) {
    const res = await fetch(`${TRENDS_BASE}/api/v1/products.json?page_size=250&page_no=${page}&inc_discontinued=1&inc_inactive=1`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      cache: 'no-store',
    });
    if (!res.ok) { out.error = `products.json ${res.status}`; break; }
    const json = await res.json().catch(() => null);
    const items = json?.data || [];
    items.forEach(it => {
      const code = String(it.code || '');
      // Lily 规则(2026-07-22):Trends 挂 Sale 的都是清仓待下线货,不进新品候选
      const isSale = /\bsale\b/i.test(JSON.stringify(it.categories || '')) || /\bsale\b/i.test(String(it.status || ''));
      if (code) seen.set(code, { name: it.name || '', active: String(it.active || ''), status: String(it.status || ''), isSale });
    });
    out.supplierTotal = json?.total_items || seen.size;
    if (!items.length || page >= (json?.page_count || 1)) break;
  }

  // ① Trends 有(活跃、非 Sale)我们没有 —— Sale 货按 Lily 规则剔除
  for (const [code, info] of seen) {
    if (/^active$/i.test(info.active) && !info.isSale && !ours.has(code)) {
      out.newAtSupplier.push({ code, name: info.name, link: `https://trends.com.au/product/${info.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}` });
    }
  }
  // ② 我们在售,Trends 已停售/消失
  for (const [code, p] of ours) {
    if (!p.is_published) continue;
    const info = seen.get(code);
    if (!info || !/^active$/i.test(info.active)) {
      out.goneAtSupplier.push({ code, name: p.name, reason: info ? `active=${info.active}/${info.status}` : 'API 目录中不存在' });
    }
  }
  return out;
}

async function auditPB(db, started) {
  const out = { supplier: 'PromoBrands', newAtSupplier: [], goneAtSupplier: [], supplierTotal: 0, error: null };
  const token = await pbIdToken();
  if (!token) { out.error = 'no PB credentials'; return out; }
  const ours = await ourProducts(db, p => p.supplier === 'PromoBrands');

  const seen = new Map(); // code -> {name, link, price}
  let after = 0;
  for (;;) {
    if (Date.now() - started > 240000) { out.error = 'budget exhausted(报告不全,重开一次)'; break; }
    const qs = after > 0 ? `PageSize=100&Order=ASC&After=${after}` : 'PageSize=100&Order=ASC';
    const res = await fetch(`${PB_BASE}/product?${qs}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      cache: 'no-store',
    });
    if (!res.ok) { out.error = `PB /product ${res.status}`; break; }
    const list = await res.json().catch(() => null);
    if (!Array.isArray(list)) { out.error = typeof list === 'string' ? `PB said: ${list}` : 'bad body'; break; }
    if (!list.length) break;
    list.forEach(prod => {
      after = Math.max(after, Number(prod.Product_ID) || after);
      const code = String(prod.Product_Code || '').toUpperCase();
      if (code) seen.set(code, { name: prod.Name || '', link: prod.Product_Link || '', price: prod.Lowest_Price ?? '' });
    });
    if (list.length < 100) break;
  }
  out.supplierTotal = seen.size;

  for (const [code, info] of seen) {
    if (!ours.has(code)) out.newAtSupplier.push({ code, name: info.name, link: info.link, price: info.price });
  }
  for (const [code, p] of ours) {
    if (!p.is_published) continue;
    if (!seen.has(code)) out.goneAtSupplier.push({ code, name: p.name, reason: 'PB 目录中不存在' });
  }
  return out;
}

function esc(s) { return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

function section(a) {
  const newRows = a.newAtSupplier.map(n => `<tr><td style="font-family:monospace">${esc(n.code)}</td><td>${n.link ? `<a href="${esc(n.link)}" target="_blank">${esc(n.name)}</a>` : esc(n.name)}</td><td>${n.price !== undefined && n.price !== '' ? '$' + esc(n.price) : ''}</td></tr>`).join('');
  const goneRows = a.goneAtSupplier.map(g => `<tr><td style="font-family:monospace">${esc(g.code)}</td><td>${esc(g.name)}</td><td>${esc(g.reason)}</td></tr>`).join('');
  const goneSkus = a.goneAtSupplier.map(g => `'${String(g.code).replace(/'/g, "''")}'`).join(',');
  const sql = a.goneAtSupplier.length
    ? `<h3>下线 SQL(审核上面清单确认后,整段贴 Supabase 跑)</h3><pre style="background:#F6F4EF;padding:12px;border-radius:8px;white-space:pre-wrap">update products set is_published = false where supplier_sku in (${goneSkus});</pre>`
    : '';
  return `
  <h2 style="color:#1B2A4A">${esc(a.supplier)} <span style="font-weight:400;font-size:14px">(供应商目录 ${a.supplierTotal} 条${a.error ? ` · ⚠ ${esc(a.error)}` : ''})</span></h2>
  <h3>① 供应商有、我们还没有的(${a.newAtSupplier.length})</h3>
  ${a.newAtSupplier.length ? `<table border="0" cellpadding="6" style="border-collapse:collapse;width:100%;font-size:13px"><tr style="background:#1B2A4A;color:#fff"><th align="left">SKU</th><th align="left">名称(点开看供应商页)</th><th align="left">最低价</th></tr>${newRows}</table>` : '<p>无 🎉</p>'}
  <h3>② 我们在售、供应商已下架的(${a.goneAtSupplier.length})</h3>
  ${a.goneAtSupplier.length ? `<table border="0" cellpadding="6" style="border-collapse:collapse;width:100%;font-size:13px"><tr style="background:#991B1B;color:#fff"><th align="left">SKU</th><th align="left">名称</th><th align="left">原因</th></tr>${goneRows}</table>` : '<p>无 🎉</p>'}
  ${sql}
  <hr style="margin:24px 0;border:none;border-top:1px solid #E0DDD7" />`;
}

export async function GET(request) {
  if (!authorised(request)) return Response.json({ error: 'unauthorized' }, { status: 401 });
  const started = Date.now();
  const db = sourcingDb();

  const trends = await auditTrends(db);
  const pb = await auditPB(db, started);

  const html = `<!doctype html><html><head><meta charset="utf-8"><title>供应商目录对账 · QuirkyPromo</title></head>
  <body style="font-family:Arial,'DM Sans',sans-serif;color:#1a1a1a;max-width:960px;margin:24px auto;padding:0 16px">
  <h1 style="color:#1B2A4A">供应商目录对账报告</h1>
  <p style="font-size:13px">生成于 ${new Date().toLocaleString('en-AU', { timeZone: 'Australia/Sydney' })}(悉尼)· 报告制:所有动作需你确认,下线 SQL 附在各段末尾 · 用时 ${Math.round((Date.now() - started) / 1000)}s</p>
  ${section(trends)}
  ${section(pb)}
  <p style="font-size:12px">新品导入仍走现有流程(告诉 Claude 要哪些 SKU,批量抓数据建品);此报告只看差异,不动任何数据。</p>
  </body></html>`;

  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

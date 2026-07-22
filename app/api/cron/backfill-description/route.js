import { sourcingDb } from '@/lib/sourcingDb';

// D15 补漏 · 一次性回填 description(Lily 2026-07-23:导入器早期版本只填了 seo_description,
// PDP "Description" tab 正文块读的是 product.description,之前一直是空的)。
// 只处理这一批已导入但 description 还是 null 的 supplier_sku——不影响其它产品,跑完可删。
// 用法:GET /api/cron/backfill-description?key=<PROBE_KEY>
//   自动识别每个 SKU 属于 Trends 还是 PromoBrands,重新拉一次原始 description,清洗后写回。

export const maxDuration = 120;

const TRENDS_BASE = process.env.TRENDS_API_BASE || 'https://au.api.trends.nz';
const PB_TOKEN_URL = 'https://promobrandrestapi.auth.ap-southeast-2.amazoncognito.com/oauth2/token';
const PB_BASE = process.env.PROMOBRANDS_API_BASE || 'https://api.promobrands.com.au';

// 这一批就是今天导入器测试期间进来的、description 还是空的 SKU。
const TARGET_SKUS = [
  'FD400.MTO', 'FD78S.MTO', 'FD76S.MTO', 'FD78XLS.MTO', 'FD71S.MTO', 'FD75S.MTO',
  '103204', '103225', '103244', '104077', '104104',
];

function authorised(request) {
  const key = new URL(request.url).searchParams.get('key');
  const probeKey = process.env.PROBE_KEY || process.env.TRENDS_PROBE_KEY;
  return !!probeKey && key === probeKey;
}

function cleanText(raw, maxLen) {
  const s = String(raw || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return s ? s.slice(0, maxLen) : null;
}

async function pbIdToken() {
  const clientId = String(process.env.PROMOBRANDS_CLIENT_ID || '').replace(/\s+/g, '');
  const refreshToken = String(process.env.PROMOBRANDS_REFRESH_TOKEN || '').replace(/\s+/g, '');
  const res = await fetch(PB_TOKEN_URL, {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'refresh_token', client_id: clientId, refresh_token: refreshToken }),
    cache: 'no-store',
  });
  const data = await res.json().catch(() => ({}));
  if (!data.id_token) throw new Error('PB token exchange failed');
  return data.id_token;
}

async function trendsDescription(code) {
  const token = process.env.TRENDS_API_TOKEN;
  const res = await fetch(`${TRENDS_BASE}/api/v1/products/${code}.json`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }, cache: 'no-store',
  });
  if (!res.ok) throw new Error(`trends ${code}: ${res.status}`);
  const json = await res.json().catch(() => null);
  return cleanText(json?.data?.description || json?.description, 2000);
}

// PB 没有单条查询接口,只能翻页找——目标 SKU 少(几个),找齐就提前收工。
async function pbDescriptions(codes, started) {
  const token = await pbIdToken();
  const need = new Set(codes.map((c) => c.toUpperCase()));
  const found = new Map();
  let after = 0;
  for (;;) {
    if (!need.size || Date.now() - started > 90000) break;
    const qs = after > 0 ? `PageSize=100&Order=ASC&After=${after}` : 'PageSize=100&Order=ASC';
    const res = await fetch(`${PB_BASE}/product?${qs}`, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }, cache: 'no-store' });
    if (!res.ok) break;
    const list = await res.json().catch(() => null);
    if (!Array.isArray(list) || !list.length) break;
    for (const prod of list) {
      after = Math.max(after, Number(prod.Product_ID) || after);
      const code = String(prod.Product_Code || '').toUpperCase();
      if (need.has(code)) { found.set(code, cleanText(prod.Description, 2000)); need.delete(code); }
    }
    if (list.length < 100) break;
  }
  return found;
}

export async function GET(request) {
  if (!authorised(request)) return Response.json({ error: 'unauthorized' }, { status: 401 });
  const started = Date.now();
  const db = sourcingDb();
  const results = [];

  try {
    const { data: rows, error } = await db.from('products').select('id, supplier, supplier_sku, description')
      .in('supplier_sku', TARGET_SKUS);
    if (error) throw new Error(error.message);

    const trendsCodes = (rows || []).filter((r) => r.supplier === 'Trends' && !r.description).map((r) => r.supplier_sku);
    const pbCodes = (rows || []).filter((r) => r.supplier === 'PromoBrands' && !r.description).map((r) => r.supplier_sku);

    for (const code of trendsCodes) {
      try {
        const desc = await trendsDescription(code);
        if (desc) {
          const { error: uErr } = await db.from('products').update({ description: desc }).eq('supplier_sku', code);
          results.push({ code, result: uErr ? `error: ${uErr.message}` : 'updated', len: desc.length });
        } else {
          results.push({ code, result: 'no description in source' });
        }
      } catch (e) {
        results.push({ code, result: `error: ${String(e?.message || e).slice(0, 160)}` });
      }
    }

    if (pbCodes.length) {
      const found = await pbDescriptions(pbCodes, started);
      for (const code of pbCodes) {
        const desc = found.get(code.toUpperCase());
        if (desc) {
          const { error: uErr } = await db.from('products').update({ description: desc }).eq('supplier_sku', code);
          results.push({ code, result: uErr ? `error: ${uErr.message}` : 'updated', len: desc.length });
        } else {
          results.push({ code, result: 'not found in PB catalog scan (time budget or gone)' });
        }
      }
    }

    const already = (rows || []).filter((r) => r.description).map((r) => r.supplier_sku);
    return Response.json({ already_had_description: already, results, elapsed_s: Math.round((Date.now() - started) / 1000) });
  } catch (e) {
    return Response.json({ error: String(e?.message || e) }, { status: 500 });
  }
}

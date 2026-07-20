import { isAdmin, unauthorized } from '@/lib/adminAuth';

// D11 · Trends API 探测代理(临时工具,管道调通后可删)
// GET /api/admin/trends-probe?path=/api/v1/health
// GET /api/admin/trends-probe?path=/api/v1/stock&query=page=1
// 认证二选一:管理员会话,或 ?key= 与 TRENDS_PROBE_KEY 环境变量一致(供开发排查)。
// 上游认证:优先 TRENDS_API_TOKEN(Bearer),否则 TRENDS_API_USER + TRENDS_API_PASS(legacy Basic)。

const BASE = process.env.TRENDS_API_BASE || 'https://au.api.trends.nz';

function upstreamAuth() {
  if (process.env.TRENDS_API_TOKEN) return `Bearer ${process.env.TRENDS_API_TOKEN}`;
  if (process.env.TRENDS_API_USER && process.env.TRENDS_API_PASS) {
    const b64 = Buffer.from(`${process.env.TRENDS_API_USER}:${process.env.TRENDS_API_PASS}`).toString('base64');
    return `Basic ${b64}`;
  }
  return null;
}

export async function GET(request) {
  const url = new URL(request.url);
  const probeKey = url.searchParams.get('key');
  const keyOk = process.env.TRENDS_PROBE_KEY && probeKey === process.env.TRENDS_PROBE_KEY;
  if (!keyOk && !(await isAdmin(request))) return unauthorized();

  const path = url.searchParams.get('path') || '/api/v1/health';
  if (!path.startsWith('/api/')) {
    return Response.json({ error: 'path must start with /api/' }, { status: 400 });
  }
  const query = url.searchParams.get('query') || '';
  const auth = upstreamAuth();
  if (!auth) {
    return Response.json({ error: 'Missing TRENDS_API_TOKEN (or TRENDS_API_USER/TRENDS_API_PASS) env vars' }, { status: 500 });
  }

  const target = `${BASE}${path}${query ? (path.includes('?') ? '&' : '?') + query : ''}`;
  try {
    const res = await fetch(target, {
      headers: { Authorization: auth, Accept: 'application/json' },
      cache: 'no-store',
    });
    const text = await res.text();
    let body;
    try { body = JSON.parse(text); } catch { body = text.slice(0, 4000); }
    return Response.json({ target, status: res.status, body });
  } catch (e) {
    return Response.json({ target, error: String(e) }, { status: 502 });
  }
}

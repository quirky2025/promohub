// D11 · Trends API 探测代理(key 保护版,供开发期从外部排查;调通后可删)
// 与 /api/admin/trends-probe 相同,但不走管理员会话——必须带 ?key= 且与
// TRENDS_PROBE_KEY 环境变量完全一致。TRENDS_PROBE_KEY 不设置则本路由整体禁用。
// 用法:
//   GET /api/cron/trends-probe?key=<TRENDS_PROBE_KEY>&path=/api/v1/health
//   GET /api/cron/trends-probe?key=<TRENDS_PROBE_KEY>&path=/api/v1/stock&query=page=1

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
  const key = url.searchParams.get('key');
  if (!process.env.TRENDS_PROBE_KEY || key !== process.env.TRENDS_PROBE_KEY) {
    return Response.json({ error: 'unauthorized' }, { status: 401 });
  }

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

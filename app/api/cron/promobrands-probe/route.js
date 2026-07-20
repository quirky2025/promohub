// D11 · PromoBrands API 探测代理(key 保护;调通后可删)v2
// 认证:AWS Cognito refresh_token 流 —— 用 PROMOBRANDS_CLIENT_ID + PROMOBRANDS_REFRESH_TOKEN
// 换 id_token(60 分钟有效,模块级缓存 55 分钟),再以 Bearer id_token 调 api.promobrands.com.au。
// 用法:
//   GET /api/cron/promobrands-probe?key=<TRENDS_PROBE_KEY>&path=/category
//   GET /api/cron/promobrands-probe?key=<TRENDS_PROBE_KEY>&path=/product&query=PageSize=5

const TOKEN_URL = 'https://promobrandrestapi.auth.ap-southeast-2.amazoncognito.com/oauth2/token';
const BASE = process.env.PROMOBRANDS_API_BASE || 'https://api.promobrands.com.au';

let cached = { token: null, exp: 0 };

async function idToken() {
  if (cached.token && Date.now() < cached.exp) return cached.token;
  const clientId = process.env.PROMOBRANDS_CLIENT_ID;
  const refreshToken = process.env.PROMOBRANDS_REFRESH_TOKEN;
  if (!clientId || !refreshToken) throw new Error('Missing PROMOBRANDS_CLIENT_ID / PROMOBRANDS_REFRESH_TOKEN env vars');
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: clientId,
      refresh_token: refreshToken,
    }),
    cache: 'no-store',
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.id_token) {
    throw new Error(`Cognito token exchange failed (${res.status}): ${JSON.stringify(data).slice(0, 300)}`);
  }
  cached = { token: data.id_token, exp: Date.now() + 55 * 60 * 1000 };
  return cached.token;
}

export async function GET(request) {
  const url = new URL(request.url);
  const key = url.searchParams.get('key');
  const probeKey = process.env.PROBE_KEY || process.env.TRENDS_PROBE_KEY;
  if (!probeKey || key !== probeKey) {
    const env = (probeKey || '').trim();
    const got = (key || '').trim();
    return Response.json({
      error: 'unauthorized',
      debug: {
        env_configured: !!probeKey,
        env_len: probeKey ? probeKey.length : 0,
        env_head: env ? env.slice(0, 4) : null,
        got_len: key ? key.length : 0,
        got_head: got ? got.slice(0, 4) : null,
        would_match_after_trim: !!env && env === got,
        env_keys_seen: Object.keys(process.env).filter(k => /PROBE|TRENDS|PROMOB/i.test(k)),
      },
    }, { status: 401 });
  }

  const path = url.searchParams.get('path') || '/category';
  if (!path.startsWith('/')) {
    return Response.json({ error: 'path must start with /' }, { status: 400 });
  }
  const query = url.searchParams.get('query') || '';

  try {
    const token = await idToken();
    const target = `${BASE}${path}${query ? (path.includes('?') ? '&' : '?') + query : ''}`;
    const res = await fetch(target, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      cache: 'no-store',
    });
    const text = await res.text();
    let body;
    try { body = JSON.parse(text); } catch { body = text.slice(0, 4000); }
    return Response.json({ target, status: res.status, body });
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 502 });
  }
}

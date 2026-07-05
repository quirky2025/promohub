// proxy.js —— 整体替换(升级:强制两步验证)
// 放行条件:① Supabase 登录有效 ② 邮箱 === ADMIN_EMAIL
//          ③ 若账号已绑定验证器,本次会话必须完成 6 位码验证(AAL2)
// 例外:/admin/mfa-setup 允许 ①+② 即可进入(否则第一次没法绑定)。
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// ── Legacy 404 handling (301/410 for old URLs; see outputs/REDIRECT_404_FIX_REQUEST.md) ──
const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPA_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function gone() {
  return new NextResponse('Gone — this page has been permanently removed.', {
    status: 410,
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}

async function supaGet(pathAndQuery) {
  if (!SUPA_URL || !SUPA_KEY) return null;
  try {
    const res = await fetch(`${SUPA_URL}/rest/v1/${pathAndQuery}`, {
      headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function publishedProductSlug(slug) {
  const rows = await supaGet(
    `products?slug=eq.${encodeURIComponent(slug)}&is_published=eq.true&select=slug&limit=1`
  );
  return Array.isArray(rows) && rows.length > 0 ? rows[0].slug : null;
}

async function liveCategoryUrl(slug) {
  const rows = await supaGet(
    `url_pages?slug=eq.${encodeURIComponent(slug)}&status=eq.live&select=canonical_url&limit=1`
  );
  return (Array.isArray(rows) && rows[0] && rows[0].canonical_url) || null;
}

// Returns a Response to short-circuit legacy 404 URLs, or null to continue normally.
async function handleLegacy404(pathname, request) {
  // B. Ancient PHP URLs -> 410
  if (pathname.startsWith('/promo/') || pathname.endsWith('.php')) return gone();
  // C. /site -> 410
  if (pathname === '/site') return gone();
  // A. Deep legacy /category/<...>/<slug> (3+ inner segments; shallow /category/<x>
  //    and /category/<x>/<y> are left to next.config's existing static redirects).
  if (pathname.startsWith('/category/')) {
    const inner = pathname.split('/').filter(Boolean).slice(1); // drop 'category'
    if (inner.length >= 3) {
      // 1. last segment = published product -> 301 to PDP
      const last = inner[inner.length - 1];
      if (last) {
        const slug = await publishedProductSlug(last);
        if (slug) return NextResponse.redirect(new URL(`/products/${slug}`, request.url), 301);
      }
      // 2. any segment maps to a live category -> 301 to canonical flat URL
      for (const seg of inner) {
        const canonical = await liveCategoryUrl(seg);
        if (canonical) return NextResponse.redirect(new URL(canonical, request.url), 301);
      }
      // 3. nothing matched -> 410
      return gone();
    }
    return NextResponse.next(); // shallow: leave to next.config / normal routing
  }
  return null;
}

export default async function proxy(request) {
  const { pathname } = request.nextUrl;

  // Legacy 404 URLs are handled first and never reach the admin-auth logic below.
  const legacy = await handleLegacy404(pathname, request);
  if (legacy) return legacy;

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const adminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const isAdminUser =
    !!user && !!adminEmail && (user.email || '').toLowerCase() === adminEmail;

  // 两步验证状态:nextLevel=aal2 表示账号绑了验证器;current 不到 aal2 = 还没输码
  let mfaPending = false;
  if (isAdminUser) {
    const { data: aal } =
      await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    mfaPending =
      !!aal && aal.nextLevel === 'aal2' && aal.currentLevel !== 'aal2';
  }

  const isLoginPage = pathname.startsWith('/admin/login');
  const isLogoutApi = pathname.startsWith('/api/admin/logout');
  const isAdminApi = pathname.startsWith('/api/admin');

  // 完整管理员 = 白名单 + (没绑验证器,或已输码)
  // 说明:第一次绑定不需要例外——还没绑验证器时 mfaPending 为 false,
  // 管理员可正常进入 /admin/mfa-setup 完成绑定;
  // 绑定之后,密码对了但没输码(mfaPending=true)则任何后台页都进不去。
  const fullyAuthed = isAdminUser && !mfaPending;

  if (!fullyAuthed && !isLoginPage && !isLogoutApi) {
    if (isAdminApi) {
      return new Response(JSON.stringify({ error: 'unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  if (fullyAuthed && isLoginPage) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/category/:path*',
    '/promo/:path*',
    '/site',
  ],
};

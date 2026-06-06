// proxy.js —— 整体替换根目录现有文件(升级:加管理员身份校验)
// 规则:进 /admin 和 /api/admin 必须满足两个条件——
//   ① 已通过 Supabase 登录(session 真实有效)
//   ② 登录邮箱 === 环境变量 ADMIN_EMAIL(管理员白名单,只有你)
// 以后客户注册的任何账号,即使登录了也进不了后台。
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export default async function proxy(request) {
  const { pathname } = request.nextUrl;

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

  // 管理员判定:已登录 且 邮箱在白名单
  const adminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const isAdminUser =
    !!user && !!adminEmail && (user.email || '').toLowerCase() === adminEmail;

  const isLoginPage = pathname.startsWith('/admin/login');
  const isLogoutApi = pathname.startsWith('/api/admin/logout');
  const isAdminApi = pathname.startsWith('/api/admin');

  // 不是管理员(未登录,或登录的是普通客户账号):API 给 401,页面送去登录页
  if (!isAdminUser && !isLoginPage && !isLogoutApi) {
    if (isAdminApi) {
      return new Response(JSON.stringify({ error: 'unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // 管理员已登录还访问登录页:直接送进后台
  if (isAdminUser && isLoginPage) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};

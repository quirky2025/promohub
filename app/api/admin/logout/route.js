// app/api/admin/logout/route.js —— 整体替换旧文件
// 旧版:删 admin_auth cookie。新版:注销 Supabase session 并清除其 cookie。
// 同时支持 POST(fetch 调用)和 GET(链接跳转),兼容后台现有的登出按钮。
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

async function doLogout(request) {
  const response = NextResponse.redirect(new URL('/admin/login', request.url));

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  await supabase.auth.signOut();

  // 顺手清掉历史遗留的旧 cookie(如果某些浏览器里还存着)
  response.cookies.set('admin_auth', '', { maxAge: 0, path: '/' });

  return response;
}

export async function POST(request) {
  return doLogout(request);
}

export async function GET(request) {
  return doLogout(request);
}

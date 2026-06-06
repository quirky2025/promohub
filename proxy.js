// proxy.js —— 整体替换(升级:强制两步验证)
// 放行条件:① Supabase 登录有效 ② 邮箱 === ADMIN_EMAIL
//          ③ 若账号已绑定验证器,本次会话必须完成 6 位码验证(AAL2)
// 例外:/admin/mfa-setup 允许 ①+② 即可进入(否则第一次没法绑定)。
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
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};

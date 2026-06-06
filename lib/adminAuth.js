// lib/adminAuth.js —— 整体替换(升级:加管理员邮箱校验)
// API 路由内部的第二道防线:已登录 且 邮箱是 ADMIN_EMAIL 才算管理员。
import { createServerClient } from '@supabase/ssr';

export async function isAdmin(request) {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll() {
            // 只读校验,不回写 cookie
          },
        },
      }
    );
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const adminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
    return (
      !!user && !!adminEmail && (user.email || '').toLowerCase() === adminEmail
    );
  } catch {
    return false;
  }
}

export function unauthorized() {
  return new Response(JSON.stringify({ error: 'unauthorized' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });
}

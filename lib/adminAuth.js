// lib/adminAuth.js —— 整体替换(升级:API 也要求两步验证完成)
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
          setAll() {},
        },
      }
    );
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const adminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
    const isAdminUser =
      !!user && !!adminEmail && (user.email || '').toLowerCase() === adminEmail;
    if (!isAdminUser) return false;

    // 绑了验证器但本次会话没输码 → 不算完整登录
    const { data: aal } =
      await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (aal && aal.nextLevel === 'aal2' && aal.currentLevel !== 'aal2') {
      return false;
    }
    return true;
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

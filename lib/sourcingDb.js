// lib/sourcingDb.js
// 只在服务端(API 路由)使用。用 service key,绕过 RLS。
// 表已开 RLS 且没有 policy,所以浏览器端 anon key 读不到采购数据。
import { createClient } from '@supabase/supabase-js';

export function sourcingDb() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY || // 标准名字
    process.env.SUPABASE_SERVICE_KEY;        // 你 .env.local 里实际用的名字

  if (!url || !key) {
    throw new Error(
      'Supabase 环境变量缺失:需要 NEXT_PUBLIC_SUPABASE_URL 和 SUPABASE_SERVICE_KEY'
    );
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

// 和你 middleware.js 用同一个 cookie(admin_auth=true)。
// middleware 只保护 /admin 页面,API 路由要自己查一次。
export function isAdmin(request) {
  return request.cookies.get('admin_auth')?.value === 'true';
}

export function unauthorized() {
  return new Response(JSON.stringify({ error: 'unauthorized' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });
}

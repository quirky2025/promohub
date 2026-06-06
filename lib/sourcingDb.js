// lib/sourcingDb.js —— 整体替换旧文件
// 只在服务端(API 路由)使用。用 service key,绕过 RLS。
// 鉴权逻辑已迁出到 lib/adminAuth.js(Supabase session 校验),
// 旧的 admin_auth cookie 检查已废弃删除。
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

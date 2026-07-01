// app/api/admin/artworks/set-logo/route.js
// 后台替客户上传 logo(客户邮件发来的场景):把已存好的 R2 URL 写到 artworks 记录。
// service key 绕过 RLS。实际文件上传+转换走 /api/artwork/rasterize-upload。
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(req) {
  try {
    const { token, logoUrl, logoPngUrl } = await req.json();
    if (!token || !logoUrl) return Response.json({ error: 'missing token/logo' }, { status: 400 });
    const { error } = await supabase.from('artworks')
      .update({ logo_url: logoUrl, logo_png_url: logoPngUrl || null, status: 'logo_received' })
      .eq('token', token);
    if (error) throw error;
    return Response.json({ success: true });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

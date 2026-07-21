import { sourcingDb } from '@/lib/sourcingDb';

// D13 · 公开评价提交(token 鉴权,一次性)。写库走 service key(表开着 RLS)。
// POST { token, rating(1-5), name?, body? } → status invited→pending(待审核)

export async function POST(request) {
  try {
    const { token, rating, name, body } = await request.json();
    const r = Number(rating);
    if (!token || !r || r < 1 || r > 5) {
      return Response.json({ error: 'A star rating (1–5) is required.' }, { status: 400 });
    }

    const db = sourcingDb();
    const { data: invite, error: readErr } = await db
      .from('product_reviews')
      .select('id, status')
      .eq('token', token)
      .maybeSingle();
    if (readErr || !invite) return Response.json({ error: 'Invalid review link.' }, { status: 404 });
    if (invite.status !== 'invited') {
      return Response.json({ error: 'This review has already been submitted — thank you!' }, { status: 409 });
    }

    const { error: upErr } = await db.from('product_reviews').update({
      rating: r,
      customer_name: String(name || '').trim().slice(0, 80) || null,
      body: String(body || '').trim().slice(0, 2000) || null,
      status: 'pending',
      submitted_at: new Date().toISOString(),
    }).eq('id', invite.id);
    if (upErr) return Response.json({ error: upErr.message }, { status: 500 });

    return Response.json({ success: true });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

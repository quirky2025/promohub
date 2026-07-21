import { isAdmin, unauthorized } from '@/lib/adminAuth';
import { sourcingDb } from '@/lib/sourcingDb';

// D13 · 评价审核 API
// GET ?status=pending|approved|rejected|invited|all → 列表(带产品名)
// PATCH { id, status: approved|rejected|pending } → 审核动作

export async function GET(request) {
  if (!(await isAdmin(request))) return unauthorized();
  const status = new URL(request.url).searchParams.get('status') || 'pending';
  const db = sourcingDb();

  let q = db.from('product_reviews')
    .select('id, product_id, order_id, customer_name, customer_email, rating, body, status, source, invited_at, submitted_at, moderated_at')
    .order('submitted_at', { ascending: false, nullsFirst: false })
    .limit(300);
  if (status !== 'all') q = q.eq('status', status);
  const { data: rows, error } = await q;
  if (error) return Response.json({ error: error.message }, { status: 500 });

  const ids = [...new Set((rows || []).map(r => r.product_id).filter(Boolean))];
  const prodById = {};
  for (let i = 0; i < ids.length; i += 200) {
    const { data: prods } = await db.from('products')
      .select('id, name, display_title, slug')
      .in('id', ids.slice(i, i + 200));
    (prods || []).forEach(p => { prodById[p.id] = p; });
  }

  return Response.json({
    reviews: (rows || []).map(r => ({
      ...r,
      product_name: prodById[r.product_id]?.display_title || prodById[r.product_id]?.name || '—',
      product_slug: prodById[r.product_id]?.slug || null,
    })),
  });
}

export async function PATCH(request) {
  if (!(await isAdmin(request))) return unauthorized();
  try {
    const { id, status } = await request.json();
    if (!id || !['approved', 'rejected', 'pending'].includes(status)) {
      return Response.json({ error: 'id + status(approved/rejected/pending) required' }, { status: 400 });
    }
    const db = sourcingDb();
    const { error } = await db.from('product_reviews')
      .update({ status, moderated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ success: true });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

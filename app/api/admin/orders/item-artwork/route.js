import { getAdminUser, unauthorized } from '@/lib/adminAuth';
import { sourcingDb } from '@/lib/sourcingDb';

// Per-line-item artwork approval. Each product in an order has its own artwork
// that must be approved. Updates items[index].artwork_approved (+ optional file
// url/name), writes back, and rolls the ORDER-level artwork_status up to
// 'approved' ONLY when EVERY item is approved — that's what unlocks the
// production gate (together with payment received).
export async function POST(request) {
  const user = await getAdminUser(request);
  if (!user) return unauthorized();

  try {
    const { orderId, index, approved, fileUrl, fileName } = await request.json();
    if (!orderId || index == null) {
      return Response.json({ error: 'Missing fields' }, { status: 400 });
    }

    const db = sourcingDb();
    const { data: order, error: readErr } = await db
      .from('orders').select('items, artwork_status, artwork_approved_at').eq('id', orderId).single();
    if (readErr || !order || !Array.isArray(order.items)) {
      return Response.json({ error: 'Order or items not found' }, { status: 404 });
    }

    const idx = Number(index);
    const items = order.items.map((it, i) => {
      if (i !== idx) return it;
      const next = { ...it, artwork_approved: !!approved };
      if (fileUrl) next.artwork_url = fileUrl;
      if (fileName) next.artwork_file = fileName;
      return next;
    });

    const allApproved = items.length > 0 && items.every((it) => it.artwork_approved);
    const someApproved = items.some((it) => it.artwork_approved);

    const updates = { items };
    updates.artwork_status = allApproved ? 'approved' : (someApproved ? 'mockup_sent' : null);
    updates.artwork_approved_at = allApproved
      ? (order.artwork_approved_at || new Date().toISOString())
      : null;

    const { error: upErr } = await db.from('orders').update(updates).eq('id', orderId);
    if (upErr) return Response.json({ error: upErr.message }, { status: 500 });

    return Response.json({
      success: true,
      items,
      artwork_status: updates.artwork_status,
      artwork_approved_at: updates.artwork_approved_at,
      allApproved,
    });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

import { getAdminUser, unauthorized } from '@/lib/adminAuth';
import { sourcingDb } from '@/lib/sourcingDb';

// Per-line-item status: each product in an order can be at a different stage
// (in_production / dispatched / delivered). Reads the RAW stored items jsonb
// server-side (so product name/price fields are never lost), flips one item's
// status, writes back, and auto-summarises the overall order status.

const STAGES = ['in_production', 'dispatched', 'delivered'];

export async function POST(request) {
  const user = await getAdminUser(request);
  if (!user) return unauthorized();

  try {
    const body = await request.json();
    const { orderId, index, status, dateOnly, stage, date } = body;
    if (!orderId || index == null) return Response.json({ error: 'Missing fields' }, { status: 400 });
    if (dateOnly) { if (!STAGES.includes(stage)) return Response.json({ error: 'Invalid stage' }, { status: 400 }); }
    else if (!STAGES.includes(status)) return Response.json({ error: 'Invalid status' }, { status: 400 });

    const db = sourcingDb();
    const { data: order, error: readErr } = await db
      .from('orders').select('items, status').eq('id', orderId).single();
    if (readErr || !order || !Array.isArray(order.items)) {
      return Response.json({ error: 'Order or items not found' }, { status: 404 });
    }

    const idx = Number(index);
    const now = new Date().toISOString();
    const items = order.items.map((it, i) => {
      if (i !== idx) return it;
      if (dateOnly) {
        const stage_dates = { ...(it.stage_dates || {}), [stage]: date || null };
        return { ...it, stage_dates };
      }
      const stage_dates = { ...(it.stage_dates || {}), [status]: now };
      return { ...it, status, stage_dates };
    });

    if (dateOnly) {
      const { error: upErr } = await db.from('orders').update({ items }).eq('id', orderId);
      if (upErr) return Response.json({ error: upErr.message }, { status: 500 });
      return Response.json({ success: true, items });
    }

    const { error: upErr } = await db.from('orders').update({ items }).eq('id', orderId);
    if (upErr) return Response.json({ error: upErr.message }, { status: 500 });

    // Auto-summarise the whole order (only move forward, never downgrade)
    const all = items.map((it) => it.status || 'in_production');
    let overall = null;
    if (all.every((s) => s === 'delivered')) overall = 'completed';
    else if (all.some((s) => s === 'dispatched' || s === 'delivered')) overall = 'dispatched';
    if (overall && overall !== order.status) {
      await db.from('orders').update({ status: overall }).eq('id', orderId);
    }

    return Response.json({ success: true, items, overall });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

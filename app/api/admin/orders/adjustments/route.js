import { getAdminUser, unauthorized } from '@/lib/adminAuth';
import { sourcingDb } from '@/lib/sourcingDb';

const round2 = (n) => Math.round((Number(n) || 0) * 100) / 100;

// POST { orderId, adjustments:[{desc, amount}] } → save credit-note / balance
// adjustment lines against an order. amount is EX-GST and signed (− credit / + charge).
export async function POST(request) {
  const user = await getAdminUser(request);
  if (!user) return unauthorized();
  try {
    const { orderId, adjustments } = await request.json();
    if (!orderId) return Response.json({ error: 'Missing orderId' }, { status: 400 });

    const clean = Array.isArray(adjustments)
      ? adjustments
          .map((a) => ({ desc: String(a.desc || '').trim(), amount: round2(a.amount) }))
          .filter((a) => a.desc || a.amount)
      : [];

    const db = sourcingDb();
    const { data: order, error } = await db
      .from('orders').update({ adjustments: clean }).eq('id', orderId).select('*').single();
    if (error) return Response.json({ error: error.message }, { status: 500 });

    return Response.json({ success: true, order });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

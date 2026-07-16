import { getAdminUser, unauthorized } from '@/lib/adminAuth';
import { sourcingDb } from '@/lib/sourcingDb';
import { createArtworkCards } from '@/lib/artworkCards';

// POST { orderId } → create per-product artwork cards for an existing order
// (e.g. an old / offline order entered manually), so each product appears on
// the Artwork Management board with its own proof + approval link.
export async function POST(request) {
  const user = await getAdminUser(request);
  if (!user) return unauthorized();
  try {
    const { orderId } = await request.json();
    if (!orderId) return Response.json({ error: 'Missing orderId' }, { status: 400 });

    const db = sourcingDb();
    const { data: order } = await db.from('orders').select('*').eq('id', orderId).single();
    if (!order) return Response.json({ error: 'Order not found' }, { status: 404 });

    const res = await createArtworkCards(db, order);
    return Response.json({ success: true, ...res });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

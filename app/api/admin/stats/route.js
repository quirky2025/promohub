import { isAdmin, unauthorized } from '@/lib/adminAuth';
import { sourcingDb } from '@/lib/sourcingDb';

export async function GET(request) {
  if (!(await isAdmin(request))) return unauthorized();

  const supabase = sourcingDb();
  const [ordersRes, artworksRes, quotesRes, recentRes] = await Promise.all([
    supabase.from('orders').select('*', { count: 'exact' }),
    supabase.from('artworks').select('status', { count: 'exact' }).eq('status', 'logo_received'),
    supabase.from('quotes').select('status', { count: 'exact' }).in('status', ['pending', 'new']),
    supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5),
  ]);

  if (ordersRes.error) {
    return Response.json({ error: ordersRes.error.message }, { status: 500 });
  }

  const revenue = ordersRes.data
    ?.filter((order) => order.payment_status === 'paid')
    .reduce((sum, order) => sum + Number(order.total_gross || order.total || 0), 0) || 0;

  return Response.json({
    orders: ordersRes.count || 0,
    artworks_pending: artworksRes.count || 0,
    quotes_pending: quotesRes.count || 0,
    revenue: Math.round(revenue / 1.1),
    recent_orders: recentRes.data || [],
  });
}

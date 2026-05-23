import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET() {
  const [ordersRes, artworksRes, quotesRes, recentRes] = await Promise.all([
    supabase.from('orders').select('total, payment_status', { count: 'exact' }),
    supabase.from('artworks').select('status', { count: 'exact' }).eq('status', 'logo_received'),
    supabase.from('quotes').select('status', { count: 'exact' }).eq('status', 'pending'),
    supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5),
  ]);

  const revenue = ordersRes.data?.filter(o => o.payment_status === 'paid').reduce((sum, o) => sum + (o.total || 0), 0) || 0;

  return Response.json({
    orders: ordersRes.count || 0,
    artworks_pending: artworksRes.count || 0,
    quotes_pending: quotesRes.count || 0,
    revenue: Math.round(revenue / 1.1), // excl GST
    recent_orders: recentRes.data || [],
  });
}

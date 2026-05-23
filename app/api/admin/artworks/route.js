import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    console.log('Admin artworks API called, status:', status);
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('Has service key:', !!process.env.SUPABASE_SERVICE_KEY);

    let query = supabase.from('artworks').select('*').order('created_at', { ascending: false });
    if (status) query = query.eq('status', status);

    const { data, error } = await query;
    console.log('Result:', data?.length, 'Error:', error?.message);
    
    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json(data || []);
  } catch (err) {
    console.error('Admin artworks error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

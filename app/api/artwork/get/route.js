import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');
  if (!token) return Response.json({ error: 'Missing token' }, { status: 400 });

  const { data, error } = await supabase
    .from('artworks')
    .select('*')
    .eq('token', token)
    .single();

  if (error || !data) return Response.json({ error: 'Artwork not found' }, { status: 404 });
  return Response.json(data);
}

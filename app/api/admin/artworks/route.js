import { isAdmin, unauthorized } from '@/lib/adminAuth';
import { sourcingDb } from '@/lib/sourcingDb';

export async function GET(req) {
  if (!(await isAdmin(req))) return unauthorized();

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    let query = sourcingDb()
      .from('artworks')
      .select('*')
      .order('created_at', { ascending: false });
    if (status) query = query.eq('status', status);

    const { data, error } = await query;

    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json(data || []);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

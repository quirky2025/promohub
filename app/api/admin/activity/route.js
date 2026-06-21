import { getAdminUser, unauthorized } from '@/lib/adminAuth';
import { sourcingDb } from '@/lib/sourcingDb';

const TYPES = ['note', 'email_out', 'email_in', 'call', 'followup', 'stage'];

export async function POST(request) {
  const user = await getAdminUser(request);
  if (!user) return unauthorized();
  try {
    const { company_id, type, body } = await request.json();
    if (!company_id || !(body && body.trim())) return Response.json({ error: 'Missing company_id or body' }, { status: 400 });
    const db = sourcingDb();
    const { data, error } = await db.from('company_activity').insert({
      company_id,
      type: TYPES.includes(type) ? type : 'note',
      body: body.trim(),
      author: user.email || null,
    }).select('*').single();
    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ entry: data });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

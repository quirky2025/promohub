import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Resolve the logged-in user's B2B contact + company.
// If their contact exists (by email) but isn't linked yet, link auth_user_id here
// (service role). This is the interim auto-link until front-b2b-auth automates it.
export async function POST(req) {
  try {
    const token = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
    if (!token) return Response.json({ error: 'No token' }, { status: 401 });

    const userClient = createClient(url, anonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false },
    });
    const { data: { user }, error: uErr } = await userClient.auth.getUser();
    if (uErr || !user) return Response.json({ error: 'Invalid session' }, { status: 401 });

    const admin = createClient(url, serviceKey, { auth: { persistSession: false } });

    let { data: contact } = await admin
      .from('contacts').select('*').eq('auth_user_id', user.id).maybeSingle();

    if (!contact && user.email) {
      const { data: byEmail } = await admin
        .from('contacts').select('*').ilike('email', user.email).maybeSingle();
      if (byEmail) {
        if (!byEmail.auth_user_id) {
          const { data: upd } = await admin
            .from('contacts').update({ auth_user_id: user.id })
            .eq('id', byEmail.id).select('*').single();
          contact = upd || byEmail;
        } else {
          contact = byEmail;
        }
      }
    }

    if (!contact) return Response.json({ contact: null, company: null });

    const { data: company } = await admin
      .from('companies').select('*').eq('id', contact.company_id).maybeSingle();

    return Response.json({ contact, company });
  } catch (e) {
    return Response.json({ error: e.message || 'resolve failed' }, { status: 500 });
  }
}

import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// From a request's Bearer token, resolve the logged-in customer's B2B company + contact.
// Returns { company_id, placed_by_contact_id } when resolvable, else {} (guest / not logged in).
// Auto-links contact.auth_user_id by email if not yet linked (interim, mirrors /api/account/resolve).
// Always fails safe ({}) so quote/order submission never breaks.
export async function resolveB2BFromRequest(req) {
  try {
    const token = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
    if (!token) return {};
    const userClient = createClient(url, anonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false },
    });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return {};

    const admin = createClient(url, serviceKey, { auth: { persistSession: false } });
    let { data: contact } = await admin
      .from('contacts').select('id, company_id, auth_user_id').eq('auth_user_id', user.id).maybeSingle();
    if (!contact && user.email) {
      const { data: byEmail } = await admin
        .from('contacts').select('id, company_id, auth_user_id').ilike('email', user.email).maybeSingle();
      if (byEmail) {
        if (!byEmail.auth_user_id) {
          await admin.from('contacts').update({ auth_user_id: user.id }).eq('id', byEmail.id);
        }
        contact = byEmail;
      }
    }
    if (!contact) return {};
    return { company_id: contact.company_id, placed_by_contact_id: contact.id };
  } catch {
    return {};
  }
}

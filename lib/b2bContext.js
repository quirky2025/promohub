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

// Guest enquiry → resolve or auto-create a LEAD account by email.
// Same email reuses its company (dedup). New email → create company (lifecycle_stage='lead',
// needs_review=true since company name is free-text/dirty) + contact. Fails safe ({}).
export async function resolveOrCreateLeadFromQuote({ email, name, company, phone, industry } = {}) {
  try {
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail) return {};
    const admin = createClient(url, serviceKey, { auth: { persistSession: false } });

    // existing contact by email → reuse its company (no stage change)
    const { data: existing } = await admin
      .from('contacts').select('id, company_id').ilike('email', cleanEmail).maybeSingle();
    if (existing) return { company_id: existing.company_id, placed_by_contact_id: existing.id };

    // resolve / create company by company_key
    const compName = (company || '').trim().replace(/\s+/g, ' ');
    const companyKey = compName ? `name:${compName.toLowerCase()}` : `solo:${cleanEmail}`;
    let companyId = null;
    const { data: existingCo } = await admin
      .from('companies').select('id').eq('company_key', companyKey).maybeSingle();
    if (existingCo) {
      companyId = existingCo.id;
    } else {
      const { data: newCo, error: coErr } = await admin
        .from('companies').insert({
          name: compName || `Lead: ${cleanEmail}`,
          company_key: companyKey,
          industry: industry || null,
          lifecycle_stage: 'lead',
          needs_review: true,
        }).select('id').single();
      if (coErr) {
        const { data: again } = await admin.from('companies').select('id').eq('company_key', companyKey).maybeSingle();
        companyId = again?.id || null;
      } else {
        companyId = newCo.id;
      }
    }
    if (!companyId) return {};

    // create contact for this lead
    const { data: newContact, error: ctErr } = await admin
      .from('contacts').insert({
        company_id: companyId, email: cleanEmail, first_name: name || null,
        phone: phone || null, role: 'member',
      }).select('id').single();
    if (ctErr) {
      const { data: again } = await admin.from('contacts').select('id, company_id').ilike('email', cleanEmail).maybeSingle();
      if (again) return { company_id: again.company_id, placed_by_contact_id: again.id };
      return { company_id: companyId };
    }
    return { company_id: companyId, placed_by_contact_id: newContact.id };
  } catch {
    return {};
  }
}

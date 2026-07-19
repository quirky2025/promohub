import { createClient } from '@supabase/supabase-js';
import { upsertBrevoContact } from '@/lib/brevo';

// Footer "Subscribe" → newsletter opt-in.
// Supabase is the master list: upsert a contact with explicit marketing consent,
// then mirror to Brevo (no-op until BREVO_API_KEY is set). Always fails safe.

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(req) {
  try {
    const { email } = await req.json();
    const clean = (email || '').trim().toLowerCase();
    if (!clean || !clean.includes('@') || !clean.includes('.')) {
      return Response.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    const admin = createClient(url, serviceKey, { auth: { persistSession: false } });
    const now = new Date().toISOString();

    // Existing contact by email → flip on consent (don't duplicate the person)
    const { data: existing } = await admin
      .from('contacts').select('id, company_id, marketing_consent').ilike('email', clean).maybeSingle();

    if (existing) {
      await admin.from('contacts').update({
        marketing_consent: true,
        consent_source: 'footer',
        subscribed_at: now,
        unsubscribed_at: null,
      }).eq('id', existing.id);
    } else {
      // New subscriber with only an email → create a solo company + contact (lead)
      const companyKey = `solo:${clean}`;
      let companyId = null;
      const { data: existingCo } = await admin
        .from('companies').select('id').eq('company_key', companyKey).maybeSingle();
      if (existingCo) {
        companyId = existingCo.id;
      } else {
        const { data: newCo } = await admin.from('companies').insert({
          name: `Subscriber: ${clean}`,
          company_key: companyKey,
          lifecycle_stage: 'lead',
          needs_review: true,
        }).select('id').single();
        companyId = newCo?.id || null;
      }
      if (companyId) {
        await admin.from('contacts').insert({
          company_id: companyId,
          email: clean,
          role: 'member',
          marketing_consent: true,
          consent_source: 'footer',
          subscribed_at: now,
        });
      }
    }

    // Mirror to Brevo (safe no-op if not configured). Don't block the response on it.
    // 需求口径 2026-07-18:进 Newsletter 列表(brevo.js 按名称解析),属性 SOURCE=footer
    const brevo = await upsertBrevoContact({ email: clean, attributes: { SOURCE: 'footer' } });
    if (brevo.ok && !brevo.skipped) {
      await admin.from('contacts').update({ brevo_synced_at: now }).ilike('email', clean);
    }

    return Response.json({ success: true });
  } catch (e) {
    return Response.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}

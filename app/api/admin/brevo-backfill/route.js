import { createClient } from '@supabase/supabase-js';
import { isAdmin, unauthorized } from '@/lib/adminAuth';
import { brevoEnabled, upsertBrevoContact, getListIdByName } from '@/lib/brevo';

// One-time (re-runnable) backfill: push every consented Supabase contact into
// Brevo's Newsletter list. Safe to run repeatedly — only picks contacts not yet
// synced (brevo_synced_at is null), and Brevo upserts by email (no duplicates).
// Usage: log in to /admin, then open /api/admin/brevo-backfill in the browser.

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

export async function GET(request) {
  if (!(await isAdmin(request))) return unauthorized();
  if (!brevoEnabled()) {
    return Response.json({ error: 'BREVO_API_KEY is not set in Vercel yet.' }, { status: 400 });
  }

  const { data: contacts, error } = await admin
    .from('contacts')
    .select('id, email, first_name, last_name, consent_source')
    .eq('marketing_consent', true)
    .is('unsubscribed_at', null)   // opted out → never push
    .is('brevo_synced_at', null)
    .not('email', 'is', null)
    .limit(500); // batch; re-open the URL if it reports there may be more

  if (error) return Response.json({ error: error.message }, { status: 500 });

  // Resolve the Newsletter list ONCE and pass it explicitly, so the result is visible below.
  const listId = await getListIdByName('Newsletter');

  const now = new Date().toISOString();
  let synced = 0;
  const failed = [];
  const detail = [];

  for (const c of contacts || []) {
    const res = await upsertBrevoContact({
      email: c.email,
      firstName: c.first_name || undefined,
      lastName: c.last_name || undefined,
      attributes: { SOURCE: c.consent_source || 'backfill' },
      listIds: listId ? [listId] : undefined,
    });
    detail.push({ email: c.email, brevo_status: res.status ?? res.error ?? res.skipped });
    if (res.ok && !res.skipped) {
      await admin.from('contacts').update({ brevo_synced_at: now }).eq('id', c.id);
      synced++;
    } else {
      failed.push({ email: c.email, error: res.error || res.skipped || 'unknown' });
    }
  }

  return Response.json({
    newsletter_list_id: listId ?? 'NOT FOUND — no list named "Newsletter" visible to this API key',
    env_list_override: process.env.BREVO_LIST_ID || null,
    picked_up: (contacts || []).length,
    synced,
    failed,
    detail,
    note: (contacts || []).length === 500
      ? 'Batch limit hit — open this URL again to sync the rest.'
      : 'All pending contacts processed.',
  });
}

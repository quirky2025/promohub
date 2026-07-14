// lib/brevo.js
// ── Marketing-email sync (Brevo) ────────────────────────────────────────────
// Supabase is the MASTER customer list. Brevo is the marketing OUTPUT only.
// This module pushes a single contact into Brevo. It is a SAFE NO-OP when
// BREVO_API_KEY is not set — so the site works perfectly before Brevo exists,
// and starts syncing the moment Lily adds the key in Vercel.
//
// SET IN VERCEL (never paste the key into chat — it's a secret):
//   BREVO_API_KEY   = your Brevo v3 API key
//   BREVO_LIST_ID   = (optional) numeric id of the marketing list to add to
//
// Brevo v3 "Create/Update contact": POST https://api.brevo.com/v3/contacts
// Header: api-key: <key>   Body: { email, attributes, listIds, updateEnabled }

const BREVO_API = 'https://api.brevo.com/v3/contacts';

export function brevoEnabled() {
  return !!process.env.BREVO_API_KEY;
}

// Upsert one contact into Brevo. Returns { ok, skipped?, status?, error? }.
// NEVER throws — callers can await it without a try/catch and it won't break
// the quote/order/subscribe flow if Brevo is down or unconfigured.
export async function upsertBrevoContact({ email, firstName, lastName, phone, attributes = {}, listIds } = {}) {
  const key = process.env.BREVO_API_KEY;
  if (!key) return { ok: true, skipped: 'no-key' };

  const clean = (email || '').trim().toLowerCase();
  if (!clean || !clean.includes('@')) return { ok: false, error: 'invalid-email' };

  const lists = Array.isArray(listIds)
    ? listIds
    : (process.env.BREVO_LIST_ID ? [Number(process.env.BREVO_LIST_ID)] : undefined);

  const body = {
    email: clean,
    updateEnabled: true, // upsert: create if new, update if exists
    attributes: {
      ...(firstName ? { FIRSTNAME: firstName } : {}),
      ...(lastName ? { LASTNAME: lastName } : {}),
      ...(phone ? { SMS: phone } : {}),
      ...attributes,
    },
    ...(lists && lists.length ? { listIds: lists } : {}),
  };

  try {
    const res = await fetch(BREVO_API, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': key,
      },
      body: JSON.stringify(body),
    });
    // 201 = created, 204 = updated. Both are success.
    if (res.status === 201 || res.status === 204 || res.ok) return { ok: true, status: res.status };
    let detail = '';
    try { detail = (await res.json())?.message || ''; } catch {}
    return { ok: false, status: res.status, error: detail || `HTTP ${res.status}` };
  } catch (e) {
    return { ok: false, error: String(e?.message || e) };
  }
}

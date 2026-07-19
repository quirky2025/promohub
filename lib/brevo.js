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
const BREVO_LISTS_API = 'https://api.brevo.com/v3/contacts/lists';

export function brevoEnabled() {
  return !!process.env.BREVO_API_KEY;
}

// Resolve a Brevo list id by its name (e.g. 'Newsletter'), cached per server instance.
// Lets ops rename/configure lists in Brevo without touching env vars.
// Returns null when key missing / list not found — callers treat that as "no list".
let _listIdCache = {};
export async function getListIdByName(name) {
  const key = process.env.BREVO_API_KEY;
  if (!key || !name) return null;
  const cacheKey = name.toLowerCase();
  if (_listIdCache[cacheKey]) return _listIdCache[cacheKey];
  try {
    for (let offset = 0; offset < 200; offset += 50) {
      const res = await fetch(`${BREVO_LISTS_API}?limit=50&offset=${offset}`, {
        headers: { 'accept': 'application/json', 'api-key': key },
      });
      if (!res.ok) return null;
      const data = await res.json();
      const lists = data?.lists || [];
      const hit = lists.find(l => (l.name || '').trim().toLowerCase() === cacheKey);
      if (hit) { _listIdCache[cacheKey] = hit.id; return hit.id; }
      if (lists.length < 50) break; // no more pages
    }
    return null;
  } catch {
    return null;
  }
}

// Upsert one contact into Brevo. Returns { ok, skipped?, status?, error? }.
// NEVER throws — callers can await it without a try/catch and it won't break
// the quote/order/subscribe flow if Brevo is down or unconfigured.
export async function upsertBrevoContact({ email, firstName, lastName, phone, attributes = {}, listIds } = {}) {
  const key = process.env.BREVO_API_KEY;
  if (!key) return { ok: true, skipped: 'no-key' };

  const clean = (email || '').trim().toLowerCase();
  if (!clean || !clean.includes('@')) return { ok: false, error: 'invalid-email' };

  // List priority: explicit listIds arg → BREVO_LIST_ID env → the 'Newsletter' list by name.
  let lists = Array.isArray(listIds)
    ? listIds
    : (process.env.BREVO_LIST_ID ? [Number(process.env.BREVO_LIST_ID)] : undefined);
  if (!lists || !lists.length) {
    const newsletterId = await getListIdByName('Newsletter');
    if (newsletterId) lists = [newsletterId];
  }

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

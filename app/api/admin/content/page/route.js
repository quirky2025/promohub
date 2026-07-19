import { NextResponse } from 'next/server';
import { getAdminUser, unauthorized } from '@/lib/adminAuth';
import { sourcingDb } from '@/lib/sourcingDb';

// CMS Phase 1 — one page's content: read, save draft, publish, rollback.
//
// GET  ?slug=…                → { page, draft, revisions }
// POST { slug, action: 'save_draft', payload }
// POST { slug, action: 'publish',   payload }   → compiles payload → url_pages + snapshot revision
// POST { slug, action: 'discard_draft' }
// POST { slug, action: 'rollback', revision_id } → re-publishes that revision's payload
//
// payload: { title, meta_description, seo_intro,
//            guide_blocks: [{ level:'h2'|'h3'|'raw', heading, html, image_url, image_alt }],
//            faq: [{ question, answer }] }

const KEEP_PUBLISHED_VERSIONS = 10; // spec asks ≥5

// ---- minimal server-side sanitiser (single trusted admin, belt & braces) ----
function sanitizeHtml(html) {
  let s = String(html || '');
  s = s.replace(/<\/(?:script|style|iframe|object|embed)>/gi, '');
  s = s.replace(/<(?:script|style|iframe|object|embed)[^>]*>/gi, '');
  s = s.replace(/\son\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, ''); // onload= etc.
  s = s.replace(/\sstyle\s*=\s*(?:"[^"]*"|'[^']*')/gi, '');          // inline styles
  s = s.replace(/javascript\s*:/gi, '');
  return s;
}

function esc(text) {
  return String(text || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Compile structured guide blocks → the single seo_content HTML string the
// front end already renders (components/SeoContent.jsx). Front end unchanged.
function compileSeoContent(guideBlocks) {
  const parts = [];
  for (const b of guideBlocks || []) {
    if (!b) continue;
    if (b.level === 'raw') {
      if (b.html && String(b.html).trim()) parts.push(sanitizeHtml(b.html));
      continue;
    }
    const tag = b.level === 'h3' ? 'h3' : 'h2';
    if (b.heading && String(b.heading).trim()) parts.push(`<${tag}>${esc(b.heading)}</${tag}>`);
    if (b.image_url) parts.push(`<p><img src="${esc(b.image_url)}" alt="${esc(b.image_alt || '')}" style="max-width:100%;border-radius:8px" /></p>`);
    if (b.html && String(b.html).trim()) parts.push(sanitizeHtml(b.html));
  }
  return parts.join('\n');
}

function cleanFaq(faq) {
  return (Array.isArray(faq) ? faq : [])
    .map(f => ({ question: String(f?.question || '').trim(), answer: sanitizeHtml(f?.answer || '').trim() }))
    .filter(f => f.question && f.answer);
}

async function nextVersion(db, slug) {
  const { data } = await db
    .from('url_page_revisions')
    .select('version')
    .eq('slug', slug)
    .order('version', { ascending: false })
    .limit(1);
  return ((data && data[0]?.version) || 0) + 1;
}

export async function GET(request) {
  const user = await getAdminUser(request);
  if (!user) return unauthorized();
  const slug = new URL(request.url).searchParams.get('slug');
  if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 });

  const db = sourcingDb();
  const { data: page, error } = await db.from('url_pages').select('*').eq('slug', slug).maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!page) return NextResponse.json({ error: 'page not found' }, { status: 404 });

  const { data: draftRows } = await db
    .from('url_page_revisions').select('*').eq('slug', slug).eq('status', 'draft').limit(1);
  const { data: revisions } = await db
    .from('url_page_revisions')
    .select('id, version, status, created_by, created_at, published_at')
    .eq('slug', slug).eq('status', 'published')
    .order('version', { ascending: false })
    .limit(KEEP_PUBLISHED_VERSIONS);

  return NextResponse.json({ page, draft: draftRows?.[0] || null, revisions: revisions || [] });
}

export async function POST(request) {
  const user = await getAdminUser(request);
  if (!user) return unauthorized();

  try {
    const body = await request.json();
    const { slug, action } = body || {};
    if (!slug || !action) return NextResponse.json({ error: 'slug + action required' }, { status: 400 });

    const db = sourcingDb();
    const now = new Date().toISOString();
    const by = user.email || 'admin';

    if (action === 'save_draft') {
      if (!body.payload) return NextResponse.json({ error: 'payload required' }, { status: 400 });
      // one draft per slug — update in place or insert
      const { data: existing } = await db
        .from('url_page_revisions').select('id').eq('slug', slug).eq('status', 'draft').limit(1);
      if (existing?.[0]) {
        const { error } = await db.from('url_page_revisions')
          .update({ payload: body.payload, created_by: by, created_at: now })
          .eq('id', existing[0].id);
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      } else {
        const { error } = await db.from('url_page_revisions')
          .insert({ slug, status: 'draft', version: 0, payload: body.payload, created_by: by });
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ ok: true, saved_at: now });
    }

    if (action === 'discard_draft') {
      const { error } = await db.from('url_page_revisions').delete().eq('slug', slug).eq('status', 'draft');
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ ok: true });
    }

    if (action === 'publish' || action === 'rollback') {
      let payload = body.payload;
      if (action === 'rollback') {
        if (!body.revision_id) return NextResponse.json({ error: 'revision_id required' }, { status: 400 });
        const { data: rev, error: rErr } = await db
          .from('url_page_revisions').select('payload').eq('id', body.revision_id).maybeSingle();
        if (rErr || !rev) return NextResponse.json({ error: rErr?.message || 'revision not found' }, { status: 404 });
        payload = rev.payload;
      }
      if (!payload) return NextResponse.json({ error: 'payload required' }, { status: 400 });

      const update = {
        title: String(payload.title || '').trim() || null,
        meta_description: String(payload.meta_description || '').trim() || null,
        seo_intro: String(payload.seo_intro || '').trim() || null,
        seo_content: compileSeoContent(payload.guide_blocks) || null,
        faq: cleanFaq(payload.faq),
        updated_at: now, // sitemap lastmod picks this up automatically
      };

      const { error: uErr } = await db.from('url_pages').update(update).eq('slug', slug);
      if (uErr) return NextResponse.json({ error: uErr.message }, { status: 500 });

      // history snapshot + clear draft + prune old versions
      const version = await nextVersion(db, slug);
      await db.from('url_page_revisions').insert({
        slug, status: 'published', version, payload, created_by: by, published_at: now,
      });
      await db.from('url_page_revisions').delete().eq('slug', slug).eq('status', 'draft');

      const { data: old } = await db
        .from('url_page_revisions').select('id, version')
        .eq('slug', slug).eq('status', 'published')
        .order('version', { ascending: false });
      const prune = (old || []).slice(KEEP_PUBLISHED_VERSIONS).map(r => r.id);
      if (prune.length) await db.from('url_page_revisions').delete().in('id', prune);

      return NextResponse.json({ ok: true, version, published_at: now });
    }

    return NextResponse.json({ error: `unknown action: ${action}` }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

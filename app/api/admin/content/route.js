import { NextResponse } from 'next/server';
import { isAdmin, unauthorized } from '@/lib/adminAuth';
import { sourcingDb } from '@/lib/sourcingDb';

// CMS Phase 1 — page list for /admin/content.
// GET ?search= → url_pages (live + any status) with a has_draft flag.
export async function GET(request) {
  if (!(await isAdmin(request))) return unauthorized();
  const search = (new URL(request.url).searchParams.get('search') || '').trim();

  const db = sourcingDb();
  let q = db
    .from('url_pages')
    .select('slug, h1, nav_label, title, page_type, status, breadcrumb_parent, updated_at, noindex')
    .order('page_type')
    .order('slug')
    .limit(1000);
  if (search) q = q.or(`slug.ilike.%${search}%,h1.ilike.%${search}%,nav_label.ilike.%${search}%,title.ilike.%${search}%`);

  const { data: pages, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: drafts, error: dErr } = await db
    .from('url_page_revisions')
    .select('slug')
    .eq('status', 'draft');
  if (dErr && !/does not exist/i.test(dErr.message || '')) {
    return NextResponse.json({ error: dErr.message }, { status: 500 });
  }
  const draftSet = new Set((drafts || []).map(d => d.slug));

  return NextResponse.json({
    pages: (pages || []).map(p => ({ ...p, has_draft: draftSet.has(p.slug) })),
  });
}

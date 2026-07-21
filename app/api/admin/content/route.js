import { NextResponse } from 'next/server';
import { isAdmin, unauthorized } from '@/lib/adminAuth';
import { sourcingDb } from '@/lib/sourcingDb';

// CMS — page list for /admin/content.
// GET ?search= → url_pages with has_draft + 内容健康五点 + 品类(IA·B)
export async function GET(request) {
  if (!(await isAdmin(request))) return unauthorized();
  const search = (new URL(request.url).searchParams.get('search') || '').trim();

  const db = sourcingDb();
  let q = db
    .from('url_pages')
    .select('slug, h1, nav_label, title, meta_description, seo_intro, seo_content, faq, product_filter, page_type, status, breadcrumb_parent, updated_at, noindex')
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

  // 集合页的品类来自 smart_collections.categories(IA 品类标签)
  const { data: cols } = await db
    .from('smart_collections')
    .select('slug, ctype, categories');
  const colBySlug = {};
  (cols || []).forEach(c => { colBySlug[c.slug] = c; });

  const out = (pages || []).map(p => {
    const pf = p.product_filter || {};
    const col = pf.type === 'smart_collection' ? colBySlug[pf.collection_slug || p.slug] : null;
    const category = pf.category
      || (col && Array.isArray(col.categories) && col.categories[0])
      || null;
    return {
      slug: p.slug,
      h1: p.h1,
      nav_label: p.nav_label,
      title: p.title,
      page_type: p.page_type,
      status: p.status,
      breadcrumb_parent: p.breadcrumb_parent,
      updated_at: p.updated_at,
      noindex: p.noindex,
      has_draft: draftSet.has(p.slug),
      category,
      categories: col && Array.isArray(col.categories) ? col.categories : (pf.category ? [pf.category] : []),
      ctype: col?.ctype || null,
      filter_type: pf.type || null,
      // 内容健康五点:title / meta / intro / 指南 / FAQ
      health: {
        title: !!(p.title && String(p.title).trim()),
        meta: !!(p.meta_description && String(p.meta_description).trim()),
        intro: !!(p.seo_intro && String(p.seo_intro).trim()),
        guide: !!(p.seo_content && String(p.seo_content).trim()),
        faq: Array.isArray(p.faq) && p.faq.length > 0,
      },
    };
  });

  return NextResponse.json({ pages: out });
}

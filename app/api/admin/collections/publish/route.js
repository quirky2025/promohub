import { NextResponse } from 'next/server';
import { isAdmin, unauthorized } from '@/lib/adminAuth';
import { sourcingDb } from '@/lib/sourcingDb';
import { resolveCollectionProducts, membershipRows } from '@/lib/smartCollections';

// D8 — publish / unpublish / refresh a smart collection.
// publish:   membership materialised into collection_products (feeds PDP "Also
//            Found In" without per-request rule runs) + url_pages row upserted
//            (status live → flat URL /{slug}, sitemap, CMS Content editor).
// unpublish: url_pages → draft (page 404s per [slug] status='live' gate,
//            drops out of sitemap), materialised rows cleared.
// refresh:   re-materialise a published collection (e.g. after product imports).

export async function POST(request) {
  if (!(await isAdmin(request))) return unauthorized();
  try {
    const { id, action } = await request.json();
    if (!id || !action) return NextResponse.json({ error: 'id + action required' }, { status: 400 });
    const db = sourcingDb();
    const now = new Date().toISOString();

    const { data: col, error } = await db.from('smart_collections').select('*').eq('id', id).maybeSingle();
    if (error || !col) return NextResponse.json({ error: error?.message || 'collection not found' }, { status: 404 });

    if (action === 'unpublish') {
      await db.from('smart_collections').update({ status: 'draft', updated_at: now }).eq('id', id);
      await db.from('url_pages').update({ status: 'draft', updated_at: now })
        .eq('slug', col.slug).eq('product_filter->>type', 'smart_collection');
      await db.from('collection_products').delete().eq('collection_id', id);
      return NextResponse.json({ ok: true, status: 'draft' });
    }

    if (action !== 'publish' && action !== 'refresh') {
      return NextResponse.json({ error: `unknown action: ${action}` }, { status: 400 });
    }

    const { products, count } = await resolveCollectionProducts(db, col);
    if (action === 'publish' && count < 4) {
      return NextResponse.json({ error: `Only ${count} products match — a collection needs at least 4 to publish.` }, { status: 400 });
    }

    // materialise membership
    await db.from('collection_products').delete().eq('collection_id', id);
    const rows = membershipRows(id, products, col.pinned || []);
    for (let i = 0; i < rows.length; i += 500) {
      const { error: insErr } = await db.from('collection_products').insert(rows.slice(i, i + 500));
      if (insErr) return NextResponse.json({ error: insErr.message }, { status: 500 });
    }

    if (action === 'publish') {
      // url_pages row — the flat URL /{slug}; content slots editable in admin → Content
      const { data: existing } = await db.from('url_pages').select('slug, title, meta_description').eq('slug', col.slug).maybeSingle();
      const pageRow = {
        slug: col.slug,
        status: 'live',
        page_type: 'collection',
        h1: existing?.title ? undefined : col.name,          // don't clobber CMS-edited fields
        nav_label: col.name,
        canonical_url: `/${col.slug}`,
        product_filter: { type: 'smart_collection', collection_slug: col.slug },
        noindex: false,
        updated_at: now,
      };
      if (!existing) {
        pageRow.h1 = col.name;
        pageRow.title = `${col.name} | QuirkyPromo`;
        const { error: pErr } = await db.from('url_pages').insert(pageRow);
        if (pErr) return NextResponse.json({ error: pErr.message }, { status: 500 });
      } else {
        delete pageRow.h1; // keep whatever CMS/ops set
        const { error: pErr } = await db.from('url_pages').update(pageRow).eq('slug', col.slug);
        if (pErr) return NextResponse.json({ error: pErr.message }, { status: 500 });
      }
      await db.from('smart_collections').update({ status: 'published', updated_at: now }).eq('id', id);
    }

    return NextResponse.json({ ok: true, status: action === 'publish' ? 'published' : col.status, count });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

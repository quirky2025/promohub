import { NextResponse } from 'next/server';
import { isAdmin, unauthorized } from '@/lib/adminAuth';
import { sourcingDb } from '@/lib/sourcingDb';
import { slugify } from '@/lib/slug';
import { isReservedSlug } from '@/lib/urlPages';

// D8 Collections Manager — CRUD.
// GET → list. POST { id?, name, slug, ctype, rules, pinned, excluded } → save.
// DELETE ?id= → delete collection (+ its url_pages row + materialised map via FK cascade).

export async function GET(request) {
  if (!(await isAdmin(request))) return unauthorized();
  const db = sourcingDb();
  const { data, error } = await db
    .from('smart_collections')
    .select('id, name, slug, ctype, categories, status, rules, pinned, excluded, updated_at')
    .order('status', { ascending: false })
    .order('name');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ collections: data || [] });
}

export async function POST(request) {
  if (!(await isAdmin(request))) return unauthorized();
  try {
    const b = await request.json();
    const db = sourcingDb();

    const name = String(b.name || '').trim();
    if (!name) return NextResponse.json({ error: 'name required' }, { status: 400 });
    const slug = slugify(b.slug || name);
    if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 });
    if (isReservedSlug(slug)) return NextResponse.json({ error: `"${slug}" is a reserved URL — pick another slug` }, { status: 400 });

    // slug clash with an existing url_pages row that isn't ours:
    // blocked by default, but an explicit takeover is allowed (TAXONOMY_V2:
    // converting a subcategory/compound page to collection supply — the URL,
    // title/meta and copy stay, only the product grid source changes).
    const { data: clash } = await db
      .from('url_pages').select('slug, product_filter, page_type').eq('slug', slug).maybeSingle();
    if (clash && clash.product_filter?.type !== 'smart_collection' && !b.allow_takeover) {
      return NextResponse.json({
        error: `/${slug} already exists as another page`,
        code: 'slug_taken',
        existing_type: clash.product_filter?.type || clash.page_type || 'page',
      }, { status: 409 });
    }

    const row = {
      name,
      slug,
      ctype: String(b.ctype || 'scenario'),
      categories: Array.isArray(b.categories) ? b.categories : [],   // IA 六型分类学:所属品类标签(可多选)
      rules: b.rules || {},
      pinned: Array.isArray(b.pinned) ? b.pinned : [],
      excluded: Array.isArray(b.excluded) ? b.excluded : [],
      updated_at: new Date().toISOString(),
    };

    let saved;
    if (b.id) {
      const { data, error } = await db.from('smart_collections').update(row).eq('id', b.id).select('*').single();
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      saved = data;
    } else {
      const { data, error } = await db.from('smart_collections').insert(row).select('*').single();
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      saved = data;
    }
    return NextResponse.json({ collection: saved });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  if (!(await isAdmin(request))) return unauthorized();
  const id = new URL(request.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  const db = sourcingDb();

  const { data: col } = await db.from('smart_collections').select('slug').eq('id', id).maybeSingle();
  const { error } = await db.from('smart_collections').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (col?.slug) {
    // NEVER hard-delete the url_pages row — taken-over pages carry SEO copy.
    // Draft = off the site + out of the sitemap, content preserved.
    await db.from('url_pages').update({ status: 'draft', updated_at: new Date().toISOString() })
      .eq('slug', col.slug)
      .eq('product_filter->>type', 'smart_collection');
  }
  return NextResponse.json({ ok: true });
}

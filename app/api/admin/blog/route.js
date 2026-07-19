import { NextResponse } from 'next/server';
import { isAdmin, unauthorized } from '@/lib/adminAuth';
import { sourcingDb } from '@/lib/sourcingDb';
import { slugify } from '@/lib/slug';
import { compileBlocks } from '@/lib/cmsHtml';

// CMS Phase 2 · Blog admin API.
// GET            → list posts
// GET ?id=…      → one post
// POST { id?, …fields, action?: 'save'|'publish'|'unpublish' }
// DELETE ?id=…

export async function GET(request) {
  if (!(await isAdmin(request))) return unauthorized();
  const id = new URL(request.url).searchParams.get('id');
  const db = sourcingDb();
  if (id) {
    const { data, error } = await db.from('blog_posts').select('*').eq('id', id).maybeSingle();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!data) return NextResponse.json({ error: 'post not found' }, { status: 404 });
    return NextResponse.json({ post: data });
  }
  const { data, error } = await db
    .from('blog_posts')
    .select('id, title, slug, status, author, published_at, updated_at')
    .order('status', { ascending: false })
    .order('updated_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ posts: data || [] });
}

export async function POST(request) {
  if (!(await isAdmin(request))) return unauthorized();
  try {
    const b = await request.json();
    const db = sourcingDb();
    const now = new Date().toISOString();
    const action = b.action || 'save';

    const title = String(b.title || '').trim();
    if (!title) return NextResponse.json({ error: 'title required' }, { status: 400 });

    // slug editable while draft, locked once published (spec)
    let existing = null;
    if (b.id) {
      const { data } = await db.from('blog_posts').select('id, slug, status, published_at').eq('id', b.id).maybeSingle();
      existing = data;
    }
    const slug = existing?.status === 'published' ? existing.slug : (slugify(b.slug || title) || slugify(title));
    if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 });

    const row = {
      title,
      slug,
      author: String(b.author || '').trim() || 'QuirkyPromo Team',
      cover_image_url: b.cover_image_url || null,
      cover_image_alt: b.cover_image_alt || null,
      meta_description: String(b.meta_description || '').trim() || null,
      target_keyword: String(b.target_keyword || '').trim() || null,
      show_toc: b.show_toc !== false,
      blocks: Array.isArray(b.blocks) ? b.blocks : [],
      related_products: Array.isArray(b.related_products) ? b.related_products : [],
      related_pages: Array.isArray(b.related_pages) ? b.related_pages : [],
      updated_at: now,
    };

    if (row.cover_image_url && !String(row.cover_image_alt || '').trim()) {
      return NextResponse.json({ error: 'Cover image needs alt text.' }, { status: 400 });
    }

    if (action === 'publish') {
      row.content_html = compileBlocks(row.blocks);
      if (!row.content_html.trim()) return NextResponse.json({ error: 'Post body is empty — nothing to publish.' }, { status: 400 });
      row.status = 'published';
      row.published_at = existing?.published_at || now;
    } else if (action === 'unpublish') {
      row.status = 'draft';
    }

    let saved;
    if (b.id) {
      const { data, error } = await db.from('blog_posts').update(row).eq('id', b.id).select('*').single();
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      saved = data;
    } else {
      const { data, error } = await db.from('blog_posts').insert(row).select('*').single();
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      saved = data;
    }
    return NextResponse.json({ post: saved });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  if (!(await isAdmin(request))) return unauthorized();
  const id = new URL(request.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  const { error } = await sourcingDb().from('blog_posts').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

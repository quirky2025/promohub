import { NextResponse } from 'next/server';
import { getAdminUser, isAdmin, unauthorized } from '@/lib/adminAuth';
import { sourcingDb } from '@/lib/sourcingDb';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY },
});
const BUCKET = process.env.R2_BUCKET;
const PUBLIC = process.env.R2_PUBLIC_BASE;

const t = (v) => (typeof v === 'string' && v.trim() ? v.trim() : null);
const safe = (s) => String(s || '').trim().replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-+|-+$/g, '') || 'x';

// GET → all banners (admin list). Public pages read this table directly.
export async function GET(request) {
  if (!(await isAdmin(request))) return unauthorized();
  const { data, error } = await sourcingDb().from('category_banners').select('*').order('category_slug');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ banners: data || [] });
}

// POST multipart { file, categorySlug, categoryName } → upload image to R2 + upsert row.
// POST json { categorySlug, headline, subheadline, overlayPct } → text-only update.
export async function POST(request) {
  const user = await getAdminUser(request);
  if (!user) return unauthorized();
  try {
    const db = sourcingDb();
    const ct = request.headers.get('content-type') || '';

    if (ct.includes('multipart/form-data')) {
      const form = await request.formData();
      const file = form.get('file');
      const categorySlug = t(form.get('categorySlug'));
      const categoryName = t(form.get('categoryName'));
      if (!file || typeof file === 'string') return NextResponse.json({ error: 'no file' }, { status: 400 });
      if (!categorySlug) return NextResponse.json({ error: 'categorySlug required' }, { status: 400 });

      const bytes = Buffer.from(await file.arrayBuffer());
      const ext = (file.name?.split('.').pop() || 'webp').toLowerCase();
      const key = `banners/${safe(categorySlug)}/${Date.now()}.${ext}`;
      await r2.send(new PutObjectCommand({ Bucket: BUCKET, Key: key, Body: bytes, ContentType: file.type || 'image/webp' }));
      const image_url = `${PUBLIC}/${key}`;

      const { data, error } = await db.from('category_banners')
        .upsert({ category_slug: categorySlug, category_name: categoryName, image_url, updated_at: new Date().toISOString() }, { onConflict: 'category_slug' })
        .select('*').single();
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ banner: data, bytes: bytes.length });
    }

    const b = await request.json();
    const categorySlug = t(b.categorySlug);
    if (!categorySlug) return NextResponse.json({ error: 'categorySlug required' }, { status: 400 });
    const row = {
      category_slug: categorySlug,
      category_name: t(b.categoryName),
      headline: t(b.headline),
      subheadline: t(b.subheadline),
      updated_at: new Date().toISOString(),
    };
    if (b.overlayPct !== undefined) row.overlay_pct = Number(b.overlayPct) || 45;
    const { data, error } = await db.from('category_banners')
      .upsert(row, { onConflict: 'category_slug' }).select('*').single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ banner: data });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// DELETE ?slug=… → remove the banner image (page falls back to navy).
export async function DELETE(request) {
  if (!(await isAdmin(request))) return unauthorized();
  const slug = new URL(request.url).searchParams.get('slug');
  if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 });
  const { error } = await sourcingDb().from('category_banners').delete().eq('category_slug', slug);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

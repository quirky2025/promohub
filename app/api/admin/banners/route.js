import { NextResponse } from 'next/server';
import { getAdminUser, isAdmin, unauthorized } from '@/lib/adminAuth';
import { sourcingDb } from '@/lib/sourcingDb';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Generic banner API — one endpoint for category / brand / collection / home banners.
const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY },
});
const BUCKET = process.env.R2_BUCKET;
const PUBLIC = process.env.R2_PUBLIC_BASE;

const t = (v) => (typeof v === 'string' && v.trim() ? v.trim() : null);
const safe = (s) => String(s || '').trim().replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-+|-+$/g, '') || 'x';
const n = (v, d = 0) => (v === undefined || v === null || v === '' ? d : (Number(v) || 0));

// GET ?type=category → all banners of that type (admin list). No type → everything.
export async function GET(request) {
  if (!(await isAdmin(request))) return unauthorized();
  const type = new URL(request.url).searchParams.get('type');
  let q = sourcingDb().from('page_banners').select('*').order('page_type').order('page_key').order('sort_order');
  if (type) q = q.eq('page_type', type);
  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ banners: data || [] });
}

// POST multipart { file, pageType, pageKey, sortOrder } → upload image + upsert slot
// POST json { pageType, pageKey, sortOrder, headline, subheadline, ctaLabel, ctaHref, overlayPct, isActive }
export async function POST(request) {
  const user = await getAdminUser(request);
  if (!user) return unauthorized();
  try {
    const db = sourcingDb();
    const ct = request.headers.get('content-type') || '';

    if (ct.includes('multipart/form-data')) {
      const form = await request.formData();
      const file = form.get('file');
      const pageType = t(form.get('pageType'));
      const pageKey = t(form.get('pageKey'));
      const sortOrder = n(form.get('sortOrder'), 0);
      if (!file || typeof file === 'string') return NextResponse.json({ error: 'no file' }, { status: 400 });
      if (!pageType || !pageKey) return NextResponse.json({ error: 'pageType + pageKey required' }, { status: 400 });

      const bytes = Buffer.from(await file.arrayBuffer());
      const key = `banners/${safe(pageType)}/${safe(pageKey)}-${sortOrder}-${Date.now()}.webp`;
      await r2.send(new PutObjectCommand({ Bucket: BUCKET, Key: key, Body: bytes, ContentType: file.type || 'image/webp' }));
      const image_url = `${PUBLIC}/${key}`;

      const { data, error } = await db.from('page_banners')
        .upsert({ page_type: pageType, page_key: pageKey, sort_order: sortOrder, image_url, updated_at: new Date().toISOString() },
          { onConflict: 'page_type,page_key,sort_order' })
        .select('*').single();
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ banner: data, bytes: bytes.length });
    }

    const b = await request.json();
    const pageType = t(b.pageType), pageKey = t(b.pageKey);
    if (!pageType || !pageKey) return NextResponse.json({ error: 'pageType + pageKey required' }, { status: 400 });
    const row = {
      page_type: pageType,
      page_key: pageKey,
      sort_order: n(b.sortOrder, 0),
      updated_at: new Date().toISOString(),
    };
    if (b.headline !== undefined) row.headline = t(b.headline);
    if (b.subheadline !== undefined) row.subheadline = t(b.subheadline);
    if (b.ctaLabel !== undefined) row.cta_label = t(b.ctaLabel);
    if (b.ctaHref !== undefined) row.cta_href = t(b.ctaHref);
    if (b.overlayPct !== undefined) row.overlay_pct = n(b.overlayPct, 45);
    if (b.isActive !== undefined) row.is_active = !!b.isActive;

    const { data, error } = await db.from('page_banners')
      .upsert(row, { onConflict: 'page_type,page_key,sort_order' }).select('*').single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ banner: data });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// DELETE ?id=…  (a specific banner/slide)
export async function DELETE(request) {
  if (!(await isAdmin(request))) return unauthorized();
  const id = new URL(request.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  const { error } = await sourcingDb().from('page_banners').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

import { NextResponse } from 'next/server';
import { getAdminUser, unauthorized } from '@/lib/adminAuth';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// CMS Phase 1 — content image upload (guide-block images).
// Same R2 pipeline as banners; browser compresses to webp before upload.
// POST multipart { file, slug } → { image_url }
const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY },
});
const BUCKET = process.env.R2_BUCKET;
const PUBLIC = process.env.R2_PUBLIC_BASE;

const safe = (s) => String(s || '').trim().replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-+|-+$/g, '') || 'x';

export async function POST(request) {
  const user = await getAdminUser(request);
  if (!user) return unauthorized();
  try {
    const form = await request.formData();
    const file = form.get('file');
    const slug = safe(form.get('slug'));
    if (!file || typeof file === 'string') return NextResponse.json({ error: 'no file' }, { status: 400 });

    const bytes = Buffer.from(await file.arrayBuffer());
    const key = `content/${slug}/${Date.now()}.webp`;
    await r2.send(new PutObjectCommand({ Bucket: BUCKET, Key: key, Body: bytes, ContentType: file.type || 'image/webp' }));
    return NextResponse.json({ image_url: `${PUBLIC}/${key}`, bytes: bytes.length });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

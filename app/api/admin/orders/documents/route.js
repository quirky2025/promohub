import { getAdminUser, unauthorized } from '@/lib/adminAuth';
import { sourcingDb } from '@/lib/sourcingDb';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});
const BUCKET = process.env.R2_BUCKET;
const PUBLIC = process.env.R2_PUBLIC_BASE;

const TYPES = ['factory_po', 'factory_invoice', 'payment_proof', 'product_image', 'customer_invoice', 'other'];
const safeSeg = (s) => String(s || '').trim().replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-+|-+$/g, '') || 'x';

// GET ?orderNumber=… → list docs
export async function GET(request) {
  const user = await getAdminUser(request);
  if (!user) return unauthorized();
  const { searchParams } = new URL(request.url);
  const orderNumber = searchParams.get('orderNumber');
  if (!orderNumber) return Response.json({ error: 'orderNumber required' }, { status: 400 });
  const db = sourcingDb();
  const { data, error } = await db
    .from('order_documents').select('*').eq('order_number', orderNumber)
    .order('created_at', { ascending: false });
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ documents: data || [] });
}

// POST multipart { file, orderNumber, docType, title } → upload to R2 + record
export async function POST(request) {
  const user = await getAdminUser(request);
  if (!user) return unauthorized();
  try {
    const form = await request.formData();
    const file = form.get('file');
    const orderNumber = form.get('orderNumber');
    const docType = TYPES.includes(form.get('docType')) ? form.get('docType') : 'other';
    const title = form.get('title') || '';
    if (!file || typeof file === 'string') return Response.json({ error: 'no file' }, { status: 400 });
    if (!orderNumber) return Response.json({ error: 'orderNumber required' }, { status: 400 });

    const bytes = Buffer.from(await file.arrayBuffer());
    const name = file.name || 'file';
    const ext = (name.split('.').pop() || 'bin').toLowerCase();
    const baseNoExt = name.replace(/\.[^.]+$/, '');
    const key = `order-docs/${safeSeg(orderNumber)}/${docType}/${Date.now()}-${safeSeg(baseNoExt).slice(0, 50)}.${ext}`;

    await r2.send(new PutObjectCommand({
      Bucket: BUCKET, Key: key, Body: bytes, ContentType: file.type || 'application/octet-stream',
    }));
    const file_url = `${PUBLIC}/${key}`;

    const db = sourcingDb();
    const { data, error } = await db.from('order_documents').insert({
      order_number: orderNumber, doc_type: docType, title: title || name,
      file_url, file_name: name, mime: file.type || null,
    }).select('*').single();
    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ document: data });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

// DELETE ?id=… → remove the record (R2 object left in place, harmless)
export async function DELETE(request) {
  const user = await getAdminUser(request);
  if (!user) return unauthorized();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return Response.json({ error: 'id required' }, { status: 400 });
  const db = sourcingDb();
  const { error } = await db.from('order_documents').delete().eq('id', id);
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ success: true });
}

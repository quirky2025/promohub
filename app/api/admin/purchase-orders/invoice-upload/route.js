import { getAdminUser, unauthorized } from '@/lib/adminAuth';
import { sourcingDb } from '@/lib/sourcingDb';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY },
});
const BUCKET = process.env.R2_BUCKET;
const PUBLIC = process.env.R2_PUBLIC_BASE;
const safe = (s) => String(s || '').trim().replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-+|-+$/g, '') || 'x';

// POST multipart { file, poId } → upload the supplier invoice to R2, save URL on the PO.
export async function POST(request) {
  const user = await getAdminUser(request);
  if (!user) return unauthorized();
  try {
    const form = await request.formData();
    const file = form.get('file');
    const poId = form.get('poId');
    if (!file || typeof file === 'string') return Response.json({ error: 'no file' }, { status: 400 });
    if (!poId) return Response.json({ error: 'poId required' }, { status: 400 });

    const db = sourcingDb();
    const { data: po } = await db.from('purchase_orders').select('po_number').eq('id', poId).single();

    const bytes = Buffer.from(await file.arrayBuffer());
    const name = file.name || 'invoice';
    const ext = (name.split('.').pop() || 'bin').toLowerCase();
    const key = `supplier-invoices/${safe(po?.po_number || poId)}/${Date.now()}-${safe(name.replace(/\.[^.]+$/, '')).slice(0, 40)}.${ext}`;

    await r2.send(new PutObjectCommand({ Bucket: BUCKET, Key: key, Body: bytes, ContentType: file.type || 'application/octet-stream' }));
    const url = `${PUBLIC}/${key}`;

    const { error } = await db.from('purchase_orders').update({ supplier_invoice_url: url }).eq('id', poId);
    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ success: true, url });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

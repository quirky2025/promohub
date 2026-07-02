// app/api/artwork/rasterize-upload/route.js
// 客户 logo/mockup 上传:原文件 -> R2,调自建转换服务 -> PNG -> R2。返回两个 URL。
// 命名:artwork/<订单号>/<kind>/<原文件名>.<后缀>  +  <原文件名>.png
// 同一订单同一 kind 再传 = 先清旧文件再传(覆盖,不重复)。无订单号则用随机文件夹(不互相覆盖)。
import { S3Client, PutObjectCommand, ListObjectsV2Command, DeleteObjectsCommand } from '@aws-sdk/client-s3';
import crypto from 'crypto';

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});
const BUCKET    = process.env.R2_BUCKET;
const PUBLIC    = process.env.R2_PUBLIC_BASE;
const CONVERTER = process.env.CONVERTER_URL;
const SECRET    = process.env.CONVERT_SECRET;

// 清理成安全的文件名/路径段(去空格/中文/奇怪符号)
function safeSeg(s) {
  return String(s || '').trim().replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-+|-+$/g, '') || 'x';
}
function safeBase(name) {
  const noExt = String(name || 'logo').replace(/\.[^.]+$/, '');
  return safeSeg(noExt).slice(0, 60) || 'logo';
}

async function putR2(key, bytes, contentType) {
  await r2.send(new PutObjectCommand({ Bucket: BUCKET, Key: key, Body: bytes, ContentType: contentType }));
  return `${PUBLIC}/${key}`;
}
async function clearPrefix(prefix) {
  const list = await r2.send(new ListObjectsV2Command({ Bucket: BUCKET, Prefix: prefix }));
  const objs = (list.Contents || []).map(o => ({ Key: o.Key }));
  if (objs.length) await r2.send(new DeleteObjectsCommand({ Bucket: BUCKET, Delete: { Objects: objs } }));
}

export async function POST(req) {
  try {
    const form = await req.formData();
    const file = form.get('file');
    if (!file || typeof file === 'string') return Response.json({ error: 'no file' }, { status: 400 });

    const orderNumber = form.get('orderNumber');
    const kind = form.get('kind') === 'mockup' ? 'mockup' : 'logo';

    const orig = Buffer.from(await file.arrayBuffer());
    const name = file.name || (kind + '.bin');
    const ext  = (name.split('.').pop() || 'bin').toLowerCase();
    const base = safeBase(name);

    // 有订单号 = 覆盖式(先清旧);无订单号 = 随机文件夹(不互相覆盖)
    let prefix;
    if (orderNumber) {
      prefix = `artwork/${safeSeg(orderNumber)}/${kind}/`;
      await clearPrefix(prefix);
    } else {
      prefix = `artwork/misc/${crypto.randomBytes(8).toString('hex')}/`;
    }

    // 1) 原文件
    const logo_url = await putR2(`${prefix}${base}.${ext}`, orig, file.type || 'application/octet-stream');

    // 2) 转 PNG
    const cf = new FormData();
    cf.append('file', new Blob([orig], { type: file.type || 'application/octet-stream' }), name);
    const r = await fetch(`${CONVERTER}/rasterize`, { method: 'POST', headers: { 'x-convert-secret': SECRET }, body: cf });
    if (!r.ok) throw new Error('convert failed: ' + (await r.text()).slice(0, 200));
    const png = Buffer.from(await r.arrayBuffer());

    // 3) PNG(若原件本身是 png,key 相同即同一文件,无害)
    const logo_png_url = await putR2(`${prefix}${base}.png`, png, 'image/png');

    return Response.json({ logo_url, logo_png_url });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

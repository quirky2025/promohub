// app/api/artwork/rasterize-upload/route.js
// 客户 logo 上传:原文件 -> R2,调自建转换服务(Ghostscript/IM/rsvg)-> PNG -> R2。
// 返回 { logo_url(原件), logo_png_url(PNG) }。取代 Cloudinary。
// R2 密钥只在这里(Vercel env),转换服务不碰。
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import crypto from 'crypto';

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});
const BUCKET    = process.env.R2_BUCKET;               // quirkypromo-public-images
const PUBLIC    = process.env.R2_PUBLIC_BASE;          // https://pub-fbec7c9199f04af8ab95a413a4620d37.r2.dev
const CONVERTER = process.env.CONVERTER_URL;           // https://artwork-converter.onrender.com
const SECRET    = process.env.CONVERT_SECRET;

async function putR2(key, bytes, contentType) {
  await r2.send(new PutObjectCommand({ Bucket: BUCKET, Key: key, Body: bytes, ContentType: contentType }));
  return `${PUBLIC}/${key}`;
}

export async function POST(req) {
  try {
    const form = await req.formData();
    const file = form.get('file');
    if (!file || typeof file === 'string') return Response.json({ error: 'no file' }, { status: 400 });

    const orig = Buffer.from(await file.arrayBuffer());
    const name = file.name || 'logo';
    const ext  = (name.split('.').pop() || 'bin').toLowerCase();
    const id   = crypto.randomBytes(8).toString('hex');

    // 1) 原文件存 R2(留底,印刷用原矢量)
    const logo_url = await putR2(`artwork/originals/${id}.${ext}`, orig, file.type || 'application/octet-stream');

    // 2) 调转换服务拿 PNG
    const cf = new FormData();
    cf.append('file', new Blob([orig], { type: file.type || 'application/octet-stream' }), name);
    const r = await fetch(`${CONVERTER}/rasterize`, { method: 'POST', headers: { 'x-convert-secret': SECRET }, body: cf });
    if (!r.ok) throw new Error('convert failed: ' + (await r.text()).slice(0, 200));
    const png = Buffer.from(await r.arrayBuffer());

    // 3) PNG 存 R2
    const logo_png_url = await putR2(`artwork/previews/${id}.png`, png, 'image/png');

    return Response.json({ logo_url, logo_png_url });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

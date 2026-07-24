import sharp from 'sharp';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { sourcingDb } from '@/lib/sourcingDb';

// 一次性脚本 · S777 Byron 1L Drink Bottle 颜色配图修正。
// Lily 2026-07-24 直接给了 PB 官网产品页(https://www.promobrands.com.au/products/byron-drink-bottle/),
// 人工核对图片说明文字(caption)之后确认每个颜色真正对应哪张干净的 unbranded 单色图——
// PB 官方 REST API(api.promobrands.com.au)那批图片的 colour 字段/文件名不可靠(这个产品尤其乱,
// 比如真正的 Navy 图文件叫 "unbranded-10.png",caption 却写着泛用词"Unbranded"),所以这次直接从
// PB 公开官网页面(media.promobrands.com.au)按人工核对结果取图,不再依赖 REST API 的字段猜测。
// 跑完之后这个文件不需要再用,可以留着不用管(仓库里已有先例,比如 merge-d15-dupes 等一次性脚本)。
// 用法:GET /api/cron/fix-s777-colours?key=<PROBE_KEY>&dry=1   先看不写库

export const maxDuration = 60;

const R2_PUBLIC = process.env.R2_PUBLIC_BASE || 'https://pub-fbec7c9199f04af8ab95a413a4620d37.r2.dev';
const VARIANTS = [160, 400, 900];

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY },
});

// 人工核对结果(位置对位置比对 PB 官网页面里"图片顺序"和"caption 顺序"两个列表得出):
const MAP = [
  { name: 'Black', file: 'S777_UB_14-scaled.jpg' },
  { name: 'Light Green', file: 'S777_UB_8-scaled.jpg' },
  { name: 'Stone', file: 'S777_UB_1-scaled.jpg' },
  { name: 'White', file: 'white-byron-1.png' },
  { name: 'Navy', file: 'unbranded-10.png' },
  { name: 'Olive', file: 'S777_UB_18-scaled.jpg' },
];
const SRC_BASE = 'https://media.promobrands.com.au/app/uploads/';

function authorised(request) {
  const key = new URL(request.url).searchParams.get('key');
  const probeKey = process.env.PROBE_KEY || process.env.TRENDS_PROBE_KEY;
  return !!probeKey && key === probeKey;
}

async function imageToR2(srcUrl, keyStem) {
  const res = await fetch(srcUrl, { cache: 'no-store' });
  if (!res.ok) throw new Error(`fetch ${res.status}: ${srcUrl}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 100) throw new Error(`image too small: ${srcUrl}`);
  for (const w of VARIANTS) {
    const webp = await sharp(buf).resize({ width: w, withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
    const key = keyStem.replace('{w}', String(w));
    await r2.send(new PutObjectCommand({ Bucket: process.env.R2_BUCKET, Key: key, Body: webp, ContentType: 'image/webp' }));
  }
  return `${R2_PUBLIC}/${keyStem.replace('{w}', '400')}`;
}

export async function GET(request) {
  if (!authorised(request)) return Response.json({ error: 'unauthorized' }, { status: 401 });
  const dry = new URL(request.url).searchParams.get('dry') === '1';
  const db = sourcingDb();

  try {
    const { data: row, error } = await db.from('products')
      .select('id, colours').eq('supplier_sku', 'S777').eq('supplier', 'PromoBrands').maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) return Response.json({ error: 'S777 not found' }, { status: 404 });

    const results = [];
    const byName = new Map();
    for (const m of MAP) {
      const url = await imageToR2(SRC_BASE + m.file, `suppliers/promobrands/products/_variants/w{w}/unbranded/s777/${m.name.toLowerCase().replace(/\s+/g, '-')}.webp`);
      byName.set(m.name.toLowerCase(), url);
      results.push({ name: m.name, src: SRC_BASE + m.file, url });
    }

    const existing = Array.isArray(row.colours) ? row.colours : [];
    const updated = existing.map(c => {
      const hit = byName.get(String(c.name || '').toLowerCase());
      return hit ? { ...c, image: hit } : c;
    });

    if (!dry) {
      const { error: uErr } = await db.from('products').update({ colours: updated }).eq('id', row.id);
      if (uErr) throw new Error(uErr.message);
    }
    return Response.json({ dry, before: existing, after: updated, fetched: results });
  } catch (e) {
    return Response.json({ error: String(e?.message || e) }, { status: 500 });
  }
}

import sharp from 'sharp';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { sourcingDb } from '@/lib/sourcingDb';
import { colourSlug, cleanColour } from '@/lib/colourName';

const R2_PUBLIC = process.env.R2_PUBLIC_BASE || 'https://pub-fbec7c9199f04af8ab95a413a4620d37.r2.dev';
const VARIANTS = [160, 400, 900];
const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY },
});
async function imageToR2(srcUrl, keyStem) {
  try {
    const res = await fetch(srcUrl, { cache: 'no-store' });
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 100) return null;
    for (const w of VARIANTS) {
      const webp = await sharp(buf).resize({ width: w, withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
      const key = keyStem.replace('{w}', String(w));
      await r2.send(new PutObjectCommand({ Bucket: process.env.R2_BUCKET, Key: key, Body: webp, ContentType: 'image/webp' }));
    }
    return `${R2_PUBLIC}/${keyStem.replace('{w}', '400')}`;
  } catch { return null; }
}

// D15 补漏 · 批量回填 Trends 产品的颜色 + description(Lily 2026-07-23 用 107039 实测坐实的
// 两个 bug,import-products/route.js 里已经修好解析逻辑,但只对以后的导入生效——这批已经
// 进库的 Trends 产品需要重新拉一次原始数据,重建 colours/colour_slugs,description 补 features 兜底):
// ① item.colours 是逗号分隔字符串(如 "Clear, Yellow...Black."),之前按数组解析,颜色永远是空的,
//   导致 PDP"选择颜色"那一步整个消失。
// ② 有些产品 description 源头就是空字符串,但 features 数组有内容,应该用 features 拼一段兜底。
// 用法:GET /api/cron/backfill-trends-colours?key=<PROBE_KEY>&dry=1  先看不写库
//      GET /api/cron/backfill-trends-colours?key=<PROBE_KEY>        正式写库

export const maxDuration = 280;

const TRENDS_BASE = process.env.TRENDS_API_BASE || 'https://au.api.trends.nz';
const BATCH_SINCE = '2026-07-22 00:00:00';

function authorised(request) {
  const key = new URL(request.url).searchParams.get('key');
  const probeKey = process.env.PROBE_KEY || process.env.TRENDS_PROBE_KEY;
  return !!probeKey && key === probeKey;
}

function cleanText(raw, maxLen) {
  const s = String(raw || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return s ? s.slice(0, maxLen) : null;
}

function displayColourName(raw) {
  const { name, mode } = cleanColour(raw);
  const isCustom = !((mode === 'solid' || mode === 'compound') && name);
  return { name: isCustom ? 'Custom' : name, isCustom };
}

export async function GET(request) {
  if (!authorised(request)) return Response.json({ error: 'unauthorized' }, { status: 401 });
  const started = Date.now();
  const url = new URL(request.url);
  const dry = url.searchParams.get('dry') === '1';
  // Lily 2026-07-23:这次要给每个产品重新下载/处理/上传真实颜色照片,比第一版单纯拉 JSON 重
  // 很多,86 个一次跑爆了 Vercel 时间限额(504)。改成跟主导入器一样分批跑:每次处理有限数量,
  // 已经有真实照片的自动跳过(不用你记哪些跑过了),再开同一个 URL 继续处理剩下的。
  const limit = Math.max(1, parseInt(url.searchParams.get('limit') || '10', 10) || 10);
  const db = sourcingDb();
  const token = process.env.TRENDS_API_TOKEN;
  const results = [];

  try {
    const { data: allRows, error } = await db.from('products')
      .select('id, supplier_sku, colours, description')
      .eq('supplier', 'Trends').gte('created_at', BATCH_SINCE);
    if (error) throw new Error(error.message);

    // 已经有真实颜色照片的(至少一个 colour 的 image 非空)算处理过,跳过,不重复下载上传
    const todo = (allRows || []).filter(r => !(Array.isArray(r.colours) && r.colours.some(c => c?.image)));
    const rows = todo.slice(0, limit);

    for (const row of rows) {
      if (Date.now() - started > 200000) { results.push({ code: row.supplier_sku, result: 'skipped: 时间用完,再开一次同样的 URL 继续' }); continue; }
      const code = row.supplier_sku;
      try {
        const res = await fetch(`${TRENDS_BASE}/api/v1/products/${code}.json`, {
          headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }, cache: 'no-store',
        });
        if (!res.ok) { results.push({ code, result: `error: trends ${res.status}` }); continue; }
        const json = await res.json().catch(() => null);
        const item = json?.data?.[0] || json?.data;
        if (!item) { results.push({ code, result: 'error: 原始数据取不到' }); continue; }

        const colourNames = String(item.colours || '').replace(/\.\s*$/, '')
          .split(',').map(s => s.trim()).filter(Boolean).slice(0, 24);

        // 用 caption(跟 colours 字符串精确对应)配真实颜色照片,不用粗粒度的 colour 字段
        const rawImages = Array.isArray(item.images) ? item.images : [];
        const imgByColour = new Map();
        let n = 0;
        for (const im of rawImages.slice(0, 12)) {
          const link = String(im?.link || im?.url || '').trim().replace(/^\/\//, 'https://');
          if (!link) continue;
          n += 1;
          const url = await imageToR2(link, `suppliers/trends/products/_variants/w{w}/${code}-${n}.webp`);
          if (!url) continue;
          const captionTag = String(im?.caption || '').trim().toLowerCase();
          if (captionTag && !imgByColour.has(captionTag)) imgByColour.set(captionTag, url);
        }

        const colours = colourNames.map(cn => {
          const { name: label, isCustom } = displayColourName(cn);
          if (isCustom) return { name: label, hex: '', image: '' };
          const hit = imgByColour.get(cn.toLowerCase());
          return { name: label, hex: '', image: hit || '' };
        });
        const colour_slugs = colourNames.map(cn => colourSlug(cn));

        const featuresJoined = (Array.isArray(item.features) ? item.features : []).filter(Boolean).join('. ');
        const description = row.description || cleanText(item.description, 2000) || cleanText(featuresJoined, 2000);
        const seo_description = cleanText(item.description, 400) || cleanText(featuresJoined, 400);

        // 2026-07-23:第二轮跑这个要能把第一轮"只有颜色名字、没有真实照片"的颜色升级成真实照片,
        // 所以只要新算出来的颜色列表非空就覆盖(幂等,不会丢数据,顶多重复写入同样内容)。
        const changed = { colours_added: colours.length > 0, description_added: !row.description && !!description };

        if (!dry && (changed.colours_added || changed.description_added)) {
          const update = {};
          if (changed.colours_added) { update.colours = colours; update.colour_slugs = colour_slugs; }
          if (changed.description_added) { update.description = description; if (!row.description) update.seo_description = seo_description; }
          const { error: uErr } = await db.from('products').update(update).eq('id', row.id);
          if (uErr) throw new Error(uErr.message);
        }

        results.push({ code, colours: colours.length, ...changed });
      } catch (e) {
        results.push({ code, result: `error: ${String(e?.message || e).slice(0, 160)}` });
      }
    }

    const remaining = todo.length - rows.length;
    const hint = remaining > 0 ? `还有 ${remaining} 个待处理,再开一次同样的 URL 继续` : '这批全部处理完了';
    return Response.json({ dry, total_todo: todo.length, processed: rows.length, remaining, hint, results, elapsed_s: Math.round((Date.now() - started) / 1000) });
  } catch (e) {
    return Response.json({ error: String(e?.message || e) }, { status: 500 });
  }
}

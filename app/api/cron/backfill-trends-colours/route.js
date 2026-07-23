import { sourcingDb } from '@/lib/sourcingDb';
import { colourSlug, cleanColour } from '@/lib/colourName';

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
  const db = sourcingDb();
  const token = process.env.TRENDS_API_TOKEN;
  const results = [];

  try {
    const { data: rows, error } = await db.from('products')
      .select('id, supplier_sku, colours, description')
      .eq('supplier', 'Trends').gte('created_at', BATCH_SINCE);
    if (error) throw new Error(error.message);

    for (const row of (rows || [])) {
      if (Date.now() - started > 250000) { results.push({ code: row.supplier_sku, result: 'skipped: 时间用完,再开一次同样的 URL 继续' }); continue; }
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
        const colours = colourNames.map(n => ({ name: displayColourName(n).name, hex: '', image: '' }));
        const colour_slugs = colourNames.map(n => colourSlug(n));

        const featuresJoined = (Array.isArray(item.features) ? item.features : []).filter(Boolean).join('. ');
        const description = row.description || cleanText(item.description, 2000) || cleanText(featuresJoined, 2000);
        const seo_description = cleanText(item.description, 400) || cleanText(featuresJoined, 400);

        const hadColours = Array.isArray(row.colours) && row.colours.length > 0;
        const changed = { colours_added: !hadColours && colours.length > 0, description_added: !row.description && !!description };

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

    return Response.json({ dry, scanned: (rows || []).length, results, elapsed_s: Math.round((Date.now() - started) / 1000) });
  } catch (e) {
    return Response.json({ error: String(e?.message || e) }, { status: 500 });
  }
}

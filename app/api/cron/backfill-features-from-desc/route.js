import { sourcingDb } from '@/lib/sourcingDb';

// D15 补漏 · Features 是空的但 Description 有内容的产品,从 Description 里提取几条短句当 Features。
// (Lily 2026-07-23:"FEATURES EMPTY等一下可以直接从DESCRIPTION里面来提取简短的几条")
// 只处理 features 为空数组/null、且 description 非空的产品;不覆盖已有 Features。
// 用法:GET /api/cron/backfill-features-from-desc?key=<PROBE_KEY>&offset=0&limit=30

export const maxDuration = 60;

const BATCH_SINCE = '2026-07-22 00:00:00';

function authorised(request) {
  const key = new URL(request.url).searchParams.get('key');
  const probeKey = process.env.PROBE_KEY || process.env.TRENDS_PROBE_KEY;
  return !!probeKey && key === probeKey;
}

// 把一段 description 拆成几条简短的 Feature 短句。
// 策略:按句号/感叹号/问号切句 → 去掉太短的碎片(<8字符)→ 每条去掉多余空白 →
// 最多取 4 条;如果切出来还不足 2 条,再退回按分号/逗号切一次做补充。
function extractFeatures(desc) {
  const text = String(desc || '').trim();
  if (!text) return [];

  const bySentence = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 8);

  let bullets = bySentence.slice(0, 4);

  if (bullets.length < 2) {
    const byClause = text
      .split(/[;,]\s*/)
      .map((s) => s.trim())
      .filter((s) => s.length >= 8);
    bullets = byClause.slice(0, 4);
  }

  // 句尾没有标点的补个句号,读起来像正经的 Feature 条目
  return bullets.map((b) => (/[.!?]$/.test(b) ? b : `${b}.`));
}

export async function GET(request) {
  if (!authorised(request)) return Response.json({ error: 'unauthorized' }, { status: 401 });
  const db = sourcingDb();
  const url = new URL(request.url);
  const offset = Math.max(0, parseInt(url.searchParams.get('offset') || '0', 10) || 0);
  const limit = Math.max(1, parseInt(url.searchParams.get('limit') || '30', 10) || 30);
  const dry = url.searchParams.get('dry') === '1';

  try {
    const { data: rows, error } = await db
      .from('products')
      .select('id, supplier_sku, name, description, features')
      .in('supplier', ['Trends', 'PromoBrands'])
      .gte('created_at', BATCH_SINCE)
      .order('id', { ascending: true });
    if (error) throw new Error(`products: ${error.message}`);

    const todo = (rows || []).filter((p) => (!Array.isArray(p.features) || p.features.length === 0) && p.description);
    const page = todo.slice(offset, offset + limit);

    const results = [];
    for (const p of page) {
      const features = extractFeatures(p.description);
      if (!features.length) { results.push({ code: p.supplier_sku, name: p.name, skipped: 'no_usable_sentences' }); continue; }
      if (!dry) {
        const { error: upErr } = await db.from('products').update({ features }).eq('id', p.id);
        if (upErr) { results.push({ code: p.supplier_sku, name: p.name, error: upErr.message }); continue; }
      }
      results.push({ code: p.supplier_sku, name: p.name, features });
    }

    const nextOffset = offset + page.length;
    const remaining = Math.max(0, todo.length - nextOffset);
    const url2 = new URL(request.url);
    const nextUrl = `${url2.origin}${url2.pathname}?key=${url2.searchParams.get('key')}${dry ? '&dry=1' : ''}&offset=${nextOffset}`;

    return Response.json({
      dry,
      total_todo: todo.length,
      offset,
      processed: page.length,
      next_offset: nextOffset,
      remaining,
      next_url: remaining ? nextUrl : null,
      hint: remaining ? `还有 ${remaining} 个待处理,再开一次同样的 URL 继续` : '这批全部处理完了',
      results,
    });
  } catch (e) {
    return Response.json({ error: String(e?.message || e) }, { status: 500 });
  }
}

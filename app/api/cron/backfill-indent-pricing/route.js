import { sourcingDb } from '@/lib/sourcingDb';
import { SETUP_FEE } from '@/lib/pricing';

// D15 补漏 · 一次性回填 Trends Indent 产品的真实价格表/印刷方式/indent_type。
// 根因(Lily 2026-07-23 用 127014/107039 两个例子发现):import-products/route.js 里
// trendsTiers() 之前只认扁平 pricing 结构 [{qty,price}],但 Indent 类产品(Screen Print/
// Pad Print 那种有真实价格表的)实际结构是 [{type,prices:[{quantity,price}],additional_costs:[...]}],
// 多包了一层,导致这些产品全被误判成 quote_only(前台整个降级成"Get a Quote",颜色选择器/
// 印刷方式/数量计算器全部消失)。import-products/route.js 那边已经修好解析逻辑,但只对
// **以后**的导入生效——这一批已经进库、被误判成 quote_only 的 Trends 产品,需要重新拉一次
// 原始数据、重建 pricing_tiers/decoration_options,这个路由就是干这个的。
// 用法:GET /api/cron/backfill-indent-pricing?key=<PROBE_KEY>
//   自动扫这批(created_at>=2026-07-22)quote_only=true 的 Trends 产品,逐个重新拉原始数据,
//   有真实 Indent 价格表的就重建 tiers/decos/indent_type,没有的原样跳过(quote_only 是对的,不动)。

export const maxDuration = 280;

const TRENDS_BASE = process.env.TRENDS_API_BASE || 'https://au.api.trends.nz';
const BATCH_SINCE = '2026-07-22 00:00:00';

function authorised(request) {
  const key = new URL(request.url).searchParams.get('key');
  const probeKey = process.env.PROBE_KEY || process.env.TRENDS_PROBE_KEY;
  return !!probeKey && key === probeKey;
}

// ── 跟 import-products/route.js 里同款逻辑,保持一致 ──
function trendsTiers(item) {
  const out = [];
  const p = item.pricing;
  if (Array.isArray(p)) {
    for (const block of p) {
      if (Array.isArray(block?.prices)) {
        for (const t of block.prices) {
          const q = Number(t.quantity ?? t.qty); const pr = Number(t.price ?? t.unit_price);
          if (q > 0 && pr > 0) out.push({ q, cost: pr });
        }
      } else {
        const q = Number(block.qty ?? block.min_qty ?? block.quantity); const pr = Number(block.price ?? block.unit_price);
        if (q > 0 && pr > 0) out.push({ q, cost: pr });
      }
    }
  } else if (p && typeof p === 'object') {
    for (let i = 1; i <= 8; i++) {
      const q = Number(p[`qty${i}`]); const pr = Number(p[`price${i}`]);
      if (q > 0 && pr > 0) out.push({ q, cost: pr });
    }
  }
  out.sort((a, b) => a.q - b.q);
  return out;
}

function trendsBrandingCosts(item) {
  const p = Array.isArray(item.pricing) ? item.pricing : [];
  return p.flatMap(block => (Array.isArray(block?.additional_costs) ? block.additional_costs : []))
    .filter(ac => ac?.type === 'DO' && ac?.description);
}

function trendsIndentInfo(item) {
  const first = Array.isArray(item.pricing) ? item.pricing[0] : null;
  const type = String(first?.type || '').toLowerCase();
  const indentType = /sea/.test(type) ? 'indent_sea' : /air/.test(type) ? 'indent_air' : null;
  const leadSpec = (Array.isArray(item.additional_specifications) ? item.additional_specifications : [])
    .find(s => /lead time/i.test(s?.specification || ''));
  return { indentType, indentLeadTime: leadSpec?.description || null };
}

function moqFromText(text) {
  const m = String(text || '').match(/MOQ[^\d]{0,10}([\d,]{2,7})/i);
  if (!m) return null;
  const n = parseInt(m[1].replace(/,/g, ''), 10);
  return n > 0 ? n : null;
}

export async function GET(request) {
  if (!authorised(request)) return Response.json({ error: 'unauthorized' }, { status: 401 });
  const started = Date.now();
  const db = sourcingDb();
  const token = process.env.TRENDS_API_TOKEN;
  const results = [];

  try {
    const { data: rows, error } = await db.from('products')
      .select('id, supplier_sku, description, min_qty')
      .eq('supplier', 'Trends').eq('quote_only', true).gte('created_at', BATCH_SINCE);
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

        const costTiers = trendsTiers(item);
        if (!costTiers.length) { results.push({ code, result: 'skipped: 确实没有真实价格表,quote_only 是对的' }); continue; }

        const tiers = costTiers.map((t, i, arr) => ({
          product_id: row.id, sort_order: i,
          min_qty: t.q,
          max_qty: arr[i + 1] ? arr[i + 1].q - 1 : null,
          // 存进货成本(raw cost)。加价(tierMargin)由前台显示时做,别在这里乘,否则加价两遍。见 PRICING-RULES §1.1。
          base_price: Number(Number(t.cost).toFixed(2)),
        }));

        const brandingCosts = trendsBrandingCosts(item);
        const decos = brandingCosts.length
          ? brandingCosts.map((ac, i) => ({
              product_id: row.id, sort_order: i,
              name: ac.description,
              detail: ac.branding_area || null,
              per_unit: Number(ac.unit_price) || 0, // 存印刷进货成本(raw),加价前台做

              has_setup: Number(ac.setup_price ?? ac.setup) > 0,
              setup_fee: SETUP_FEE,
              default_setup_qty: 1, setup_qty_editable: true, type: 'print',
            }))
          : null; // null = 不动原有的通用占位 decos,只有真找到真实印刷方式才替换

        const { indentType, indentLeadTime } = trendsIndentInfo(item);
        const minQty = costTiers[0]?.q || moqFromText(row.description) || row.min_qty;

        const { error: pErr } = await db.from('products').update({
          quote_only: false, min_qty: minQty, indent_type: indentType, indent_lead_time: indentLeadTime,
        }).eq('id', row.id);
        if (pErr) throw new Error(`products update: ${pErr.message}`);

        const { error: delTErr } = await db.from('pricing_tiers').delete().eq('product_id', row.id);
        if (delTErr) throw new Error(`pricing_tiers delete: ${delTErr.message}`);
        const { error: insTErr } = await db.from('pricing_tiers').insert(tiers);
        if (insTErr) throw new Error(`pricing_tiers insert: ${insTErr.message}`);

        if (decos) {
          const { error: delDErr } = await db.from('decoration_options').delete().eq('product_id', row.id);
          if (delDErr) throw new Error(`decoration_options delete: ${delDErr.message}`);
          const { error: insDErr } = await db.from('decoration_options').insert(decos);
          if (insDErr) throw new Error(`decoration_options insert: ${insDErr.message}`);
        }

        results.push({ code, result: 'updated', tiers: tiers.length, decos: decos ? decos.length : 'unchanged', indent_type: indentType, min_qty: minQty });
      } catch (e) {
        results.push({ code, result: `error: ${String(e?.message || e).slice(0, 160)}` });
      }
    }

    return Response.json({ scanned: (rows || []).length, results, elapsed_s: Math.round((Date.now() - started) / 1000) });
  } catch (e) {
    return Response.json({ error: String(e?.message || e) }, { status: 500 });
  }
}

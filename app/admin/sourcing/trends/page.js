// app/admin/sourcing/trends/page.js
'use client';

import { useEffect, useMemo, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

const fmt = (v, d = 4) =>
  v == null || Number.isNaN(Number(v))
    ? '—'
    : Number(v).toLocaleString('en-AU', { minimumFractionDigits: d, maximumFractionDigits: d });

export default function TrendsPage() {
  return (
    <Suspense fallback={<p className="srcx-muted">加载中…</p>}>
      <TrendsInner />
    </Suspense>
  );
}

function TrendsInner() {
  const sp = useSearchParams();
  const [factories, setFactories] = useState([]);
  const [factoryId, setFactoryId] = useState(sp.get('factory') || '');
  const [product, setProduct] = useState(sp.get('product') || '');
  const [products, setProducts] = useState([]);
  const [quotes, setQuotes] = useState([]);

  useEffect(() => {
    fetch('/api/admin/sourcing/factories')
      .then((r) => r.json())
      .then((d) => setFactories(d.factories || []));
  }, []);

  // 选了工厂 → 取该厂报过的产品列表
  useEffect(() => {
    if (!factoryId) { setProducts([]); return; }
    fetch(`/api/admin/sourcing/quotes?factory_id=${factoryId}`)
      .then((r) => r.json())
      .then((d) => {
        const names = [...new Set((d.quotes || []).map((q) => q.product_name))].sort();
        setProducts(names);
      });
  }, [factoryId]);

  // 工厂+产品都齐 → 取数据
  useEffect(() => {
    if (!factoryId || !product) { setQuotes([]); return; }
    fetch(
      `/api/admin/sourcing/quotes?factory_id=${factoryId}&product_exact=${encodeURIComponent(product)}`
    )
      .then((r) => r.json())
      .then((d) => setQuotes(d.quotes || []));
  }, [factoryId, product]);

  // 展平成行:日期 × 数量档 × 价格
  const rows = useMemo(() => {
    const out = [];
    for (const q of quotes) {
      for (const t of q.quote_tiers || []) {
        out.push({
          date: q.quote_date,
          fx: Number(q.exchange_rate),
          quantity: Number(t.quantity),
          rmb: Number(t.exw_unit_price_rmb),
          aud: t.customer_unit_price_aud != null ? Number(t.customer_unit_price_aud) : null,
        });
      }
    }
    return out.sort((a, b) => a.date.localeCompare(b.date) || a.quantity - b.quantity);
  }, [quotes]);

  return (
    <div>
      <h1 className="srcx-h1">价格趋势</h1>
      <div className="srcx-card">
        <div className="srcx-row">
          <div className="srcx-field" style={{ minWidth: 220 }}>
            <label>工厂</label>
            <select value={factoryId} onChange={(e) => { setFactoryId(e.target.value); setProduct(''); }}>
              <option value="">请选择工厂</option>
              {factories.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </div>
          <div className="srcx-field" style={{ minWidth: 220 }}>
            <label>产品</label>
            <select value={product} onChange={(e) => setProduct(e.target.value)} disabled={!factoryId}>
              <option value="">{factoryId ? '请选择产品' : '先选工厂'}</option>
              {products.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>
      </div>

      {factoryId && product && (
        <div className="srcx-card">
          <h2>{product} — EXW 单价走势 (RMB)</h2>
          <p className="srcx-muted" style={{ marginTop: -6 }}>每条线一个数量档,每个点一次报价。</p>
          {rows.length ? <LineChart rows={rows} /> : <div className="srcx-empty">暂无数据</div>}

          {rows.length > 0 && (
            <table className="srcx-table" style={{ marginTop: 16 }}>
              <thead>
                <tr>
                  <th>报价日期</th><th>数量档</th><th>EXW (RMB)</th>
                  <th>汇率</th><th>折算 (AUD)</th><th>对客报价 (AUD)</th>
                </tr>
              </thead>
              <tbody className="srcx-num">
                {rows.map((r, i) => (
                  <tr key={i}>
                    <td>{r.date}</td>
                    <td>{r.quantity.toLocaleString()}</td>
                    <td>¥{fmt(r.rmb)}</td>
                    <td className="srcx-muted">{r.fx}</td>
                    <td className="srcx-muted">${fmt(r.rmb * r.fx)}</td>
                    <td>{r.aud != null ? `$${fmt(r.aud)}` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------- 轻量 SVG 折线图,零依赖 ---------- */

const COLORS = ['#c9a45c', '#1b2a4a', '#2e7d52', '#b4413e', '#5b6abf', '#9a6db0'];

function LineChart({ rows }) {
  const W = 760, H = 300, PAD = { l: 56, r: 20, t: 16, b: 40 };

  const dates = [...new Set(rows.map((r) => r.date))].sort();
  const qtys = [...new Set(rows.map((r) => r.quantity))].sort((a, b) => a - b);
  const prices = rows.map((r) => r.rmb);
  let min = Math.min(...prices), max = Math.max(...prices);
  if (min === max) { min -= 1; max += 1; }
  const padY = (max - min) * 0.12;
  min -= padY; max += padY;

  const x = (date) =>
    dates.length === 1
      ? PAD.l + (W - PAD.l - PAD.r) / 2
      : PAD.l + (dates.indexOf(date) / (dates.length - 1)) * (W - PAD.l - PAD.r);
  const y = (p) => PAD.t + (1 - (p - min) / (max - min)) * (H - PAD.t - PAD.b);

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => min + f * (max - min));

  return (
    <div style={{ overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', minWidth: 560 }}>
        {yTicks.map((t, i) => (
          <g key={i}>
            <line x1={PAD.l} x2={W - PAD.r} y1={y(t)} y2={y(t)} stroke="#eee8dd" />
            <text x={PAD.l - 8} y={y(t) + 4} textAnchor="end" fontSize="11" fill="#8a8577">
              ¥{t.toFixed(2)}
            </text>
          </g>
        ))}
        {dates.map((d) => (
          <text key={d} x={x(d)} y={H - PAD.b + 18} textAnchor="middle" fontSize="11" fill="#8a8577">
            {d.slice(5)}
          </text>
        ))}
        {qtys.map((q, qi) => {
          const pts = dates
            .map((d) => {
              const row = rows.find((r) => r.date === d && r.quantity === q);
              return row ? { cx: x(d), cy: y(row.rmb), price: row.rmb } : null;
            })
            .filter(Boolean);
          const color = COLORS[qi % COLORS.length];
          return (
            <g key={q}>
              {pts.length > 1 && (
                <polyline
                  fill="none" stroke={color} strokeWidth="2"
                  points={pts.map((p) => `${p.cx},${p.cy}`).join(' ')}
                />
              )}
              {pts.map((p, i) => (
                <circle key={i} cx={p.cx} cy={p.cy} r="4" fill={color}>
                  <title>{q.toLocaleString()} 个:¥{p.price}</title>
                </circle>
              ))}
            </g>
          );
        })}
        {qtys.map((q, qi) => (
          <g key={`lg-${q}`}>
            <rect x={PAD.l + qi * 120} y={H - 14} width="10" height="10"
              fill={COLORS[qi % COLORS.length]} rx="2" />
            <text x={PAD.l + qi * 120 + 15} y={H - 5} fontSize="11" fill="#2b2b2b">
              {q.toLocaleString()} 个
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

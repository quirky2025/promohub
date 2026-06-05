// app/admin/sourcing/quotes/page.js
'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

const fmt = (v, d = 4) =>
  v == null || Number.isNaN(Number(v))
    ? '—'
    : Number(v).toLocaleString('en-AU', { minimumFractionDigits: d, maximumFractionDigits: d });

export default function QuoteSearchPage() {
  const [product, setProduct] = useState('');
  const [names, setNames] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/admin/sourcing/quotes?names=1')
      .then((r) => r.json())
      .then((d) => setNames(d.names || []));
  }, []);

  async function search() {
    if (!product.trim()) return;
    setLoading(true);
    const res = await fetch(
      `/api/admin/sourcing/quotes?product=${encodeURIComponent(product.trim())}`
    );
    const data = await res.json();
    setQuotes(data.quotes || []);
    setSearched(true);
    setLoading(false);
  }

  // 按工厂分组,每家厂取最新一条做比价,历史折叠
  const byFactory = useMemo(() => {
    const map = new Map();
    for (const q of quotes) {
      const key = q.factories?.id || q.factory_id;
      if (!map.has(key)) map.set(key, { factory: q.factories, list: [] });
      map.get(key).list.push(q);
    }
    return [...map.values()];
  }, [quotes]);

  // 全部出现过的数量档,用于"最低价"高亮
  const bestByQty = useMemo(() => {
    const best = {};
    for (const g of byFactory) {
      const latest = g.list[0];
      for (const t of latest?.quote_tiers || []) {
        const p = Number(t.exw_unit_price_rmb);
        if (best[t.quantity] == null || p < best[t.quantity]) best[t.quantity] = p;
      }
    }
    return best;
  }, [byFactory]);

  return (
    <div>
      <h1 className="srcx-h1">报价检索 · 比价</h1>
      <div className="srcx-card">
        <div className="srcx-row">
          <div className="srcx-field" style={{ flex: 1, minWidth: 240 }}>
            <label>产品名称(回车搜索;哪些厂报过这个产品、各报多少)</label>
            <input
              list="srcx-search-names"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && search()}
              placeholder="如:linen notebook"
            />
            <datalist id="srcx-search-names">
              {names.map((n) => <option key={n} value={n} />)}
            </datalist>
          </div>
          <button className="srcx-btn" onClick={search} disabled={loading}>
            {loading ? '搜索中…' : '搜索'}
          </button>
        </div>
      </div>

      {searched && !byFactory.length && (
        <div className="srcx-empty">没有工厂报过「{product}」</div>
      )}

      {byFactory.map((g) => {
        const latest = g.list[0];
        const history = g.list.slice(1);
        return (
          <div key={g.factory?.id || Math.random()} className="srcx-card">
            <div className="srcx-row" style={{ justifyContent: 'space-between' }}>
              <h2 style={{ margin: 0 }}>
                <Link href={`/admin/sourcing/factories/${g.factory?.id}`} className="srcx-link" style={{ fontSize: 16 }}>
                  {g.factory?.name || '未知工厂'}
                </Link>{' '}
                <span className="srcx-muted">
                  最新报价 {latest.quote_date}
                  {latest.lead_time_days != null && ` · 交期 ${latest.lead_time_days} 天`}
                  {latest.printing_method && ` · ${latest.printing_method}`}
                </span>
              </h2>
              {g.list.length > 1 && (
                <Link
                  className="srcx-link"
                  href={`/admin/sourcing/trends?factory=${g.factory?.id}&product=${encodeURIComponent(latest.product_name)}`}
                >
                  趋势 →
                </Link>
              )}
            </div>

            <table className="srcx-table" style={{ marginTop: 8 }}>
              <thead>
                <tr>
                  <th>数量</th>
                  <th>EXW (RMB)</th>
                  <th>折算 (AUD)</th>
                  <th>对客报价 (AUD)</th>
                </tr>
              </thead>
              <tbody className="srcx-num">
                {(latest.quote_tiers || []).map((t) => {
                  const isBest =
                    bestByQty[t.quantity] != null &&
                    Number(t.exw_unit_price_rmb) === bestByQty[t.quantity] &&
                    byFactory.length > 1;
                  return (
                    <tr key={t.id}>
                      <td className={isBest ? 'srcx-best' : ''}>
                        {Number(t.quantity).toLocaleString()}
                        {isBest && ' ★最低'}
                      </td>
                      <td className={isBest ? 'srcx-best' : ''}>¥{fmt(t.exw_unit_price_rmb)}</td>
                      <td className="srcx-muted">
                        ${fmt(Number(t.exw_unit_price_rmb) * Number(latest.exchange_rate))}
                      </td>
                      <td>
                        {t.customer_unit_price_aud != null ? `$${fmt(t.customer_unit_price_aud)}` : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {history.length > 0 && (
              <details style={{ marginTop: 8 }}>
                <summary className="srcx-link" style={{ cursor: 'pointer' }}>
                  历史报价({history.length} 条)
                </summary>
                {history.map((q) => (
                  <div key={q.id} style={{ marginTop: 8, paddingLeft: 10, borderLeft: '3px solid #e6e1d8' }}>
                    <span className="srcx-muted">{q.quote_date} · 汇率 {q.exchange_rate}</span>
                    <div className="srcx-muted srcx-num" style={{ fontSize: 13 }}>
                      {(q.quote_tiers || [])
                        .map((t) => `${Number(t.quantity).toLocaleString()}个 ¥${fmt(t.exw_unit_price_rmb)}`)
                        .join(' / ')}
                    </div>
                  </div>
                ))}
              </details>
            )}
          </div>
        );
      })}
    </div>
  );
}

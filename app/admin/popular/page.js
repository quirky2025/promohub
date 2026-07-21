'use client';
import { useEffect, useState } from 'react';

// D12 · 热销榜(Popular):Trends 全市场库存消耗排行
// 数据来自每日库存快照的下降量 —— 反映的是全澳所有 distributor 的真实动销,不只我们自己的订单。

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';

export default function PopularPage() {
  const [days, setDays] = useState(7);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let alive = true;
    setLoading(true); setErr(null);
    fetch(`/api/admin/popular?days=${days}`)
      .then(r => r.json())
      .then(j => { if (!alive) return; if (j.error) setErr(j.error); else setData(j); })
      .catch(e => alive && setErr(String(e)))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [days]);

  const items = data?.items || [];

  return (
    <div style={{ padding: '28px 32px', fontFamily: '"DM Sans", sans-serif', color: '#1a1a1a' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '6px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: NAVY, margin: 0 }}>Popular · 市场热销榜</h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[7, 14, 30].map(d => (
            <button key={d} onClick={() => setDays(d)}
              style={{ padding: '7px 16px', borderRadius: '8px', border: days === d ? `2px solid ${GOLD}` : '1px solid #C8C4BC', background: days === d ? '#FBF7EF' : '#fff', color: NAVY, fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
              {d} 天
            </button>
          ))}
        </div>
      </div>
      <p style={{ fontSize: '13px', color: '#1a1a1a', margin: '0 0 18px', lineHeight: 1.6 }}>
        按供应商库存每日快照的<strong>下降量</strong>排序(忽略补货上涨)= 全澳 distributor 的真实消耗速度。快照从 2026-07-21 开始积累,天数越久越准。
      </p>

      {loading && <div style={{ padding: '40px 0', color: NAVY, fontWeight: 600 }}>加载中…</div>}
      {err && <div style={{ padding: '16px', background: '#FDF0EF', border: '1px solid #E8C4C0', borderRadius: '8px', color: '#8C2F28', fontSize: '13px' }}>{err}(如果是 function 不存在,先在 Supabase 跑 db/popular_products.sql)</div>}
      {!loading && !err && items.length === 0 && (
        <div style={{ padding: '28px', background: '#FBF7EF', border: `1px solid ${GOLD}`, borderRadius: '10px', fontSize: '14px', color: '#1a1a1a', lineHeight: 1.7 }}>
          还没有可对比的快照——库存同步至少要跑满两天才有第一批消耗数据。明天再来看,这里就会开始冒数字了。
        </div>
      )}

      {items.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px', background: '#fff', border: '1px solid #E0DDD7', borderRadius: '10px', overflow: 'hidden' }}>
          <thead>
            <tr style={{ background: NAVY }}>
              {['#', '产品', '颜色', '类目', `消耗(${data.days}天)`, '≈/天', '当前库存', ''].map((h, i) => (
                <th key={i} style={{ padding: '10px 12px', color: '#fff', fontSize: '12px', fontWeight: 700, textAlign: i >= 4 && i <= 6 ? 'right' : 'left', letterSpacing: '0.5px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((it, i) => (
              <tr key={`${it.supplier_sku}-${it.colour_name}`} style={{ borderTop: '1px solid #EFEBE3', background: i % 2 ? '#FBFAF7' : '#fff' }}>
                <td style={{ padding: '9px 12px', fontWeight: 700, color: i < 3 ? GOLD : NAVY }}>{i + 1}</td>
                <td style={{ padding: '9px 12px' }}>
                  <div style={{ fontWeight: 600, color: NAVY }}>{it.name || it.supplier_sku}</div>
                  <div style={{ fontSize: '11.5px', color: '#1a1a1a', fontFamily: '"DM Mono", monospace' }}>{it.supplier_sku}{it.published === false ? ' · 未上架' : ''}</div>
                </td>
                <td style={{ padding: '9px 12px', color: '#1a1a1a' }}>{it.colour_name || '—'}</td>
                <td style={{ padding: '9px 12px', color: '#1a1a1a' }}>{it.category || '—'}</td>
                <td style={{ padding: '9px 12px', textAlign: 'right', fontWeight: 700, color: NAVY }}>{Number(it.consumed).toLocaleString()}</td>
                <td style={{ padding: '9px 12px', textAlign: 'right', color: '#1a1a1a' }}>{it.per_day}</td>
                <td style={{ padding: '9px 12px', textAlign: 'right', color: '#1a1a1a' }}>{(it.latest_qty ?? 0).toLocaleString()}</td>
                <td style={{ padding: '9px 12px' }}>
                  {it.slug && <a href={`/products/${it.slug}`} target="_blank" rel="noreferrer" style={{ color: GOLD, fontWeight: 700, textDecoration: 'none', fontSize: '12.5px' }}>View ↗</a>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

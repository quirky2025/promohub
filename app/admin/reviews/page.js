'use client';

// D13 · Admin → Reviews:站内产品评价审核(pending 批准/拒绝;approved 上产品页 + 搜索星标)
import { useEffect, useState, useCallback } from 'react';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';
const TABS = [['pending', '待审核'], ['approved', '已上墙'], ['rejected', '已拒绝'], ['invited', '已邀未答'], ['all', '全部']];

export default function ReviewsAdminPage() {
  const [tab, setTab] = useState('pending');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/reviews?status=${tab}`);
      const data = await res.json();
      if (!res.ok) { alert(`加载失败: ${data?.error || res.status}`); setRows([]); }
      else setRows(data.reviews || []);
    } catch (e) { alert(`加载失败: ${e.message}`); }
    setLoading(false);
  }, [tab]);
  useEffect(() => { load(); }, [load]);

  async function act(id, status) {
    setBusy(id + status);
    try {
      const res = await fetch('/api/admin/reviews', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { alert('操作失败: ' + (data?.error || res.status)); }
      else load();
    } catch (e) { alert('操作失败: ' + e.message); }
    setBusy('');
  }

  const stars = (n) => '★'.repeat(n || 0) + '☆'.repeat(5 - (n || 0));

  return (
    <div style={{ fontFamily: '"DM Sans", sans-serif', padding: '24px 28px', color: '#000', background: '#fff', minHeight: '100vh' }}>
      <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 28, color: NAVY, margin: '0 0 4px' }}>Reviews</h1>
      <p style={{ fontSize: 13, color: '#000', margin: '0 0 16px' }}>
        客户从邀评邮件提交的产品评价。批准后显示在产品页 + 进入搜索结果星级;拒绝的不展示。
      </p>

      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        {TABS.map(([id, lb]) => (
          <button key={id} onClick={() => setTab(id)}
            style={{ background: tab === id ? NAVY : '#fff', color: tab === id ? '#fff' : NAVY, border: `1px solid ${tab === id ? NAVY : '#E0DDD7'}`, borderRadius: 18, padding: '7px 16px', fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}>
            {lb}
          </button>
        ))}
      </div>

      {loading ? <div style={{ padding: 40, color: '#000' }}>Loading…</div> : rows.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#000', border: '1px dashed #E0DDD7', borderRadius: 12 }}>
          这个分类下暂时没有评价。
        </div>
      ) : rows.map(r => (
        <div key={r.id} style={{ border: '1px solid #E0DDD7', borderRadius: 12, padding: '14px 16px', marginBottom: 12 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'baseline', flexWrap: 'wrap' }}>
            <span style={{ color: GOLD, fontSize: 16, letterSpacing: 2 }}>{stars(r.rating)}</span>
            <span style={{ fontWeight: 700, color: NAVY }}>{r.customer_name || '匿名'}</span>
            <span style={{ fontSize: 12, color: '#000' }}>{r.customer_email}</span>
            <span style={{ fontSize: 12, color: '#000', marginLeft: 'auto' }}>
              {r.submitted_at ? new Date(r.submitted_at).toLocaleString('en-AU') : `邀请于 ${r.invited_at ? new Date(r.invited_at).toLocaleDateString('en-AU') : '—'}`}
            </span>
          </div>
          <div style={{ fontSize: 12.5, color: '#000', margin: '4px 0' }}>
            产品:{r.product_slug
              ? <a href={`/products/${r.product_slug}`} target="_blank" rel="noreferrer" style={{ color: NAVY, fontWeight: 700 }}>{r.product_name} ↗</a>
              : r.product_name}
          </div>
          {r.body && <div style={{ fontSize: 14, color: '#1a1a1a', lineHeight: 1.6, margin: '6px 0', whiteSpace: 'pre-wrap' }}>{r.body}</div>}
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            {r.status !== 'approved' && r.status !== 'invited' && (
              <button onClick={() => act(r.id, 'approved')} disabled={!!busy}
                style={{ background: '#166534', color: '#fff', border: 'none', borderRadius: 7, padding: '6px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                ✓ 批准上墙
              </button>
            )}
            {r.status !== 'rejected' && r.status !== 'invited' && (
              <button onClick={() => act(r.id, 'rejected')} disabled={!!busy}
                style={{ background: '#fff', color: '#991B1B', border: '1px solid #E0C9C9', borderRadius: 7, padding: '6px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                ✕ 拒绝
              </button>
            )}
            {r.status === 'approved' && (
              <button onClick={() => act(r.id, 'pending')} disabled={!!busy}
                style={{ background: '#fff', color: NAVY, border: `1px solid ${NAVY}`, borderRadius: 7, padding: '6px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                撤回到待审核
              </button>
            )}
            <span style={{ fontSize: 11, fontWeight: 700, alignSelf: 'center', padding: '3px 10px', borderRadius: 12, background: r.status === 'approved' ? '#F0FAF4' : r.status === 'rejected' ? '#FDF0EF' : '#FEF3C7', color: r.status === 'approved' ? '#166534' : r.status === 'rejected' ? '#991B1B' : '#92400E' }}>
              {r.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

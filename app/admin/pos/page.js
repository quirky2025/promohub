// app/admin/pos/page.js
// 全部 PO 总列表 — 本地供应商 PO(AUD)+ China 工厂 PO(RMB)合在一起,LOCAL/INDENT 标签,可筛选。
'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';

const NAV = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Orders', href: '/admin/orders' },
  { label: 'Production', href: '/admin/production' },
  { label: 'Suppliers', href: '/admin/suppliers' },
  { label: '全部 PO', href: '/admin/pos' },
  { label: 'Sourcing', href: '/admin/sourcing' },
];

const aud = (n) => '$' + Number(n || 0).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const rmb = (n) => '¥' + Number(n || 0).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function AllPosPage() {
  const [local, setLocal] = useState([]);
  const [factory, setFactory] = useState([]);
  const [suppliers, setSuppliers] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');   // all | local | indent
  const [q, setQ] = useState('');

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/purchase-orders', { cache: 'no-store' }).then((r) => r.json()).catch(() => ({})),
      fetch('/api/admin/orders/factory-po?all=1', { cache: 'no-store' }).then((r) => r.json()).catch(() => ({})),
      fetch('/api/admin/suppliers', { cache: 'no-store' }).then((r) => r.json()).catch(() => ({})),
    ]).then(([po, fp, sup]) => {
      setLocal(po.purchaseOrders || []);
      setFactory(fp.pos || []);
      const map = {}; (sup.suppliers || []).forEach((s) => { map[s.id] = s.name; });
      setSuppliers(map);
    }).finally(() => setLoading(false));
  }, []);

  const rows = useMemo(() => {
    const L = local.map((p) => ({
      id: 'L' + p.id, type: 'local', po: p.po_number, order: p.order_number,
      party: suppliers[p.supplier_id] || p.supplier_name || '—',
      amount: aud(p.cost_total ?? p.cost_subtotal), status: p.status || 'draft',
      date: p.created_at,
    }));
    const F = factory.map((p) => ({
      id: 'F' + p.id, type: 'indent', po: p.po_number, order: p.order_number,
      party: p.factories?.name || '—',
      amount: rmb(p.total_rmb), status: p.status || 'draft',
      date: p.created_at,
    }));
    let all = [...L, ...F].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    if (filter !== 'all') all = all.filter((r) => r.type === filter);
    if (q) { const s = q.toLowerCase(); all = all.filter((r) => [r.po, r.order, r.party].join(' ').toLowerCase().includes(s)); }
    return all;
  }, [local, factory, suppliers, filter, q]);

  const nLocal = local.length, nIndent = factory.length;

  return (
    <div style={{ fontFamily: '"DM Sans", sans-serif', background: '#fff', minHeight: '100vh' }}>
      <div style={{ background: NAVY, padding: '0 32px', display: 'flex', alignItems: 'center', height: '56px' }}>
        <span style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '20px', fontWeight: 600, color: '#fff', letterSpacing: '2px', marginRight: '32px' }}>QUIRKY<span style={{ color: GOLD }}>PROMO</span></span>
        <nav style={{ display: 'flex', gap: '4px' }}>
          {NAV.map((i) => (
            <Link key={i.href} href={i.href} style={{ color: i.href === '/admin/pos' ? '#fff' : 'rgba(255,255,255,0.7)', background: i.href === '/admin/pos' ? 'rgba(255,255,255,0.12)' : 'transparent', textDecoration: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: 500 }}>{i.label}</Link>
          ))}
        </nav>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 32px' }}>
        <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '28px', color: NAVY, margin: '0 0 4px' }}>全部 PO · All Purchase Orders</h1>
        <div style={{ fontSize: '13px', color: '#000', marginBottom: '16px' }}>本地供应商 PO 和 China 工厂 PO 合在一起。LOCAL = 本地(AUD)· INDENT = 工厂(RMB)。点订单号跳到那张订单。</div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '14px' }}>
          {[['all', `全部 (${nLocal + nIndent})`], ['local', `LOCAL (${nLocal})`], ['indent', `INDENT (${nIndent})`]].map(([k, label]) => (
            <button key={k} onClick={() => setFilter(k)} style={{ background: filter === k ? NAVY : '#fff', color: filter === k ? '#fff' : NAVY, border: `1px solid ${filter === k ? NAVY : '#E0DDD7'}`, borderRadius: '20px', padding: '6px 14px', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer' }}>{label}</button>
          ))}
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="搜 PO# / 订单 / 供应商…" style={{ padding: '8px 12px', border: '1px solid #E0DDD7', borderRadius: '8px', fontSize: '13px', color: '#000', minWidth: '220px' }} />
        </div>

        {loading ? <div style={{ color: '#000' }}>Loading…</div> : rows.length === 0 ? <div style={{ color: '#000' }}>没有 PO。</div> : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', color: '#000' }}>
            <thead>
              <tr style={{ background: '#FBFAF8', textAlign: 'left', borderBottom: '2px solid #E0DDD7' }}>
                {['PO #', '类型', '订单', '供应商 / 工厂', '金额', '状态', '日期'].map((h) => <th key={h} style={{ padding: '10px 12px', fontWeight: 700 }}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} style={{ borderBottom: '1px solid #F0EEED' }}>
                  <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontWeight: 700, color: NAVY }}>{r.po || '—'}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{ background: r.type === 'indent' ? '#7C2D12' : '#1E40AF', color: '#fff', padding: '2px 8px', borderRadius: '5px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.05em' }}>{r.type === 'indent' ? 'INDENT' : 'LOCAL'}</span>
                  </td>
                  <td style={{ padding: '10px 12px' }}>{r.order ? <Link href={`/admin/orders?order=${encodeURIComponent(r.order)}`} style={{ color: NAVY, fontWeight: 700 }}>{r.order}</Link> : '—'}</td>
                  <td style={{ padding: '10px 12px' }}>{r.party}</td>
                  <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontWeight: 700 }}>{r.amount}</td>
                  <td style={{ padding: '10px 12px' }}>{r.status}</td>
                  <td style={{ padding: '10px 12px', color: '#000' }}>{r.date ? new Date(r.date).toLocaleDateString('en-AU') : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// app/admin/sourcing/procurement/page.js
// 采购总览 — 所有工厂 PO(RMB)+ 全局「欠爸爸」结余。
// 明细/编辑在对应客户订单里(/admin/orders 打开该 INDENT 订单 → 工厂采购)。
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const NAVY = '#1B2A4A';
const RED = '#991B1B';
const GREEN = '#2D6A4F';
const rmb = (n) => '¥' + Number(n || 0).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const aud = (n) => 'A$' + Number(n || 0).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const STATUS_LABEL = { draft: '草稿', sent: '已下单', deposit_paid: '已付定金', paid: '已付清', shipped: '已发货', closed: '完成' };

export default function ProcurementPage() {
  const [pos, setPos] = useState([]);
  const [ledger, setLedger] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/orders/factory-po?all=1', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => { setPos(d.pos || []); setLedger(d.ledger || {}); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: '24px 28px', fontFamily: '"DM Sans", sans-serif', color: '#000' }}>
      <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 26, color: NAVY, margin: '0 0 4px' }}>采购总览 · Factory POs</h1>
      <div style={{ fontSize: 13, color: '#000', marginBottom: 18 }}>所有工厂 PO 与「欠爸爸」结余。明细、付款、还款请到对应客户订单里操作(/admin/orders 打开该 INDENT 订单)。</div>

      {/* GLOBAL DAD LEDGER */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 22 }}>
        <Stat label="已付工厂折澳币(累计欠爸爸)" value={aud(ledger.paidToFactoryAud)} />
        <Stat label="已还爸爸" value={aud(ledger.repaidToDadAud)} color={GREEN} />
        <Stat label="还欠爸爸" value={aud(ledger.owedToDad)} color={Number(ledger.owedToDad) > 0.01 ? RED : GREEN} big />
      </div>

      {loading ? <div>Loading…</div> : pos.length === 0 ? (
        <div style={{ color: '#000' }}>还没有工厂 PO。到 INDENT 客户订单里「新建工厂 PO」。</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ textAlign: 'left', color: '#000', background: '#FBFAF8', borderBottom: '2px solid #E0DDD7' }}>
              {['PO#', '客户订单', '工厂', '产品', '数量', '工厂总额', '已付', '还差', '状态'].map(h => (
                <th key={h} style={{ padding: '9px 12px', fontWeight: 700 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pos.map((p) => {
              const owe = Math.max(0, (Number(p.total_rmb) || 0) - (Number(p.paid_rmb) || 0));
              return (
                <tr key={p.id} style={{ borderBottom: '1px solid #F0EEED' }}>
                  <td style={{ padding: '9px 12px', fontFamily: 'monospace', fontWeight: 700, color: NAVY }}>{p.po_number}</td>
                  <td style={{ padding: '9px 12px' }}>
                    {p.order_number ? <Link href={`/admin/orders?order=${encodeURIComponent(p.order_number)}`} style={{ color: NAVY, fontWeight: 700 }}>{p.order_number}</Link> : '—'}
                  </td>
                  <td style={{ padding: '9px 12px' }}>{p.factories?.name || '—'}</td>
                  <td style={{ padding: '9px 12px' }}>{p.product_name || '—'}{p.product_sku ? ` (${p.product_sku})` : ''}</td>
                  <td style={{ padding: '9px 12px' }}>{p.quantity || '—'}</td>
                  <td style={{ padding: '9px 12px' }}>{rmb(p.total_rmb)}</td>
                  <td style={{ padding: '9px 12px' }}>{rmb(p.paid_rmb)}</td>
                  <td style={{ padding: '9px 12px', color: owe > 0.01 ? RED : GREEN, fontWeight: 700 }}>{rmb(owe)}</td>
                  <td style={{ padding: '9px 12px' }}>{STATUS_LABEL[p.status] || p.status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

function Stat({ label, value, color, big }) {
  return (
    <div style={{ flex: '1 1 160px', minWidth: 160, background: '#FBFAF8', border: '1.5px solid #E0DDD7', borderRadius: 12, padding: '12px 16px' }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#000', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: big ? 22 : 17, fontWeight: 800, color: color || NAVY }}>{value}</div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';
const BG = '#F8F7F4';

const NAV = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Orders', href: '/admin/orders' },
  { label: 'Artworks', href: '/admin/artworks' },
  { label: 'Invoices', href: '/admin/invoices' },
  { label: 'Production', href: '/admin/production' },
  { label: 'Suppliers', href: '/admin/suppliers' },
  { label: 'Products', href: '/admin/products' },
];

const TERMS = {
  prepaid: { bg: '#FEF3C7', color: '#92400E', label: 'Prepaid' },
  account: { bg: '#DBEAFE', color: '#1E40AF', label: 'Monthly' },
};

const PO_STATUS = {
  draft:         { bg: '#F1EFE8', color: '#5F5E5A', label: 'Draft' },
  sent:          { bg: '#DBEAFE', color: '#1E40AF', label: 'Sent' },
  confirmed:     { bg: '#E0E7FF', color: '#3730A3', label: 'Confirmed' },
  in_production:  { bg: '#EDE9FE', color: '#5B21B6', label: 'In Production' },
  received:      { bg: '#D1FAE5', color: '#065F46', label: 'Received' },
  cancelled:     { bg: '#FEE2E2', color: '#991B1B', label: 'Cancelled' },
};

const money = (n) => '$' + Number(n || 0).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const grossOf = (o) => Number(o.total_gross) || Number(o.total) || 0;
const paidOf = (o) => Number(o.amount_paid) || 0;
const isPaid = (o) => grossOf(o) > 0 && paidOf(o) >= grossOf(o);
const isReady = (o) => isPaid(o) && o.artwork_status === 'approved';

export default function AdminProductionPage() {
  const [orders, setOrders] = useState([]);
  const [pos, setPos] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [poFor, setPoFor] = useState(null);     // order we're raising a PO for
  const [supplierId, setSupplierId] = useState('');
  const [newSupplier, setNewSupplier] = useState('');
  const [newSupplierTerms, setNewSupplierTerms] = useState('prepaid');
  const [cost, setCost] = useState('');
  const [freight, setFreight] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const [oRes, pRes, sRes] = await Promise.all([
        fetch('/api/admin/orders', { cache: 'no-store' }),
        fetch('/api/admin/purchase-orders', { cache: 'no-store' }),
        fetch('/api/admin/suppliers', { cache: 'no-store' }),
      ]);
      const o = await oRes.json(); const p = await pRes.json(); const s = await sRes.json();
      setOrders((Array.isArray(o.orders) ? o.orders : []).filter(x => x.status !== 'quote' && x.status !== 'cancelled'));
      setPos(Array.isArray(p.purchaseOrders) ? p.purchaseOrders : []);
      setSuppliers(Array.isArray(s.suppliers) ? s.suppliers : []);
    } catch { /* ignore */ }
    setLoading(false);
  }

  function poForOrder(orderId, orderNumber) {
    return pos.find(p => p.order_id === orderId || (orderNumber && p.order_number === orderNumber));
  }

  function openPo(o) {
    setPoFor(o); setSupplierId(''); setNewSupplier(''); setCost(''); setFreight(''); setNotes('');
  }

  async function submitPo() {
    if (!poFor) return;
    setSaving(true);
    let sid = supplierId;
    if (!sid && newSupplier.trim()) {
      const r = await fetch('/api/admin/suppliers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: newSupplier.trim(), payment_terms: newSupplierTerms }) });
      const d = await r.json();
      if (d.supplier) { sid = d.supplier.id; }
    }
    const res = await fetch('/api/admin/purchase-orders', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: poFor.id, orderNumber: poFor.order_number || poFor.invoice_number,
        supplierId: sid || null, costSubtotal: Number(cost) || 0, freightCost: Number(freight) || 0,
        notes, status: 'sent',
        items: (poFor.items || []).map(it => ({
          stockCode: it.sku || it.productSku || it.stockCode || '',
          name: it.productName || it.name || '',
          qty: it.qty || it.quantity || 1,
          branding: it.branding || it.brandingMethod || it.decoration_method || '',
        })),
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok || data.error) { alert('Failed: ' + (data.error || 'unknown')); return; }
    setPoFor(null); load();
  }

  async function patchPo(id, body) {
    const res = await fetch('/api/admin/purchase-orders', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, ...body }) });
    if (res.ok) load(); else alert('Update failed');
  }

  async function editCost(po) {
    const c = prompt('Product cost ($):', po.cost_subtotal ?? 0);
    if (c === null) return;
    const f = prompt('Freight cost ($):', po.freight_cost ?? 0);
    if (f === null) return;
    patchPo(po.id, { action: 'details', costSubtotal: Number(c) || 0, freightCost: Number(f) || 0 });
  }

  const supplierObj = (id) => suppliers.find(s => s.id === id);
  const supplierName = (id) => supplierObj(id)?.name || '—';
  const termsBadge = (id) => {
    const t = TERMS[supplierObj(id)?.payment_terms];
    if (!t) return null;
    return <span style={{ background: t.bg, color: t.color, fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '20px', marginLeft: '6px' }}>{t.label}</span>;
  };

  return (
    <div style={{ fontFamily: '"DM Sans", sans-serif', background: '#fff', minHeight: '100vh' }}>
      <div style={{ background: NAVY, padding: '0 32px', display: 'flex', alignItems: 'center', gap: '28px', height: '56px' }}>
        <span style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '20px', fontWeight: 600, color: '#fff', letterSpacing: '1px' }}>
          QUIRKY<span style={{ color: GOLD }}>PROMO</span>
        </span>
        <nav style={{ display: 'flex', gap: '2px' }}>
          {NAV.map(n => (
            <Link key={n.href} href={n.href}
              style={{ color: n.href === '/admin/production' ? '#fff' : 'rgba(255,255,255,0.7)', textDecoration: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: n.href === '/admin/production' ? 700 : 500, background: n.href === '/admin/production' ? 'rgba(255,255,255,0.1)' : 'none' }}>
              {n.label}
            </Link>
          ))}
        </nav>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '28px 32px' }}>
        <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '30px', fontWeight: 600, color: NAVY, margin: '0 0 6px' }}>Production</h1>
        <p style={{ fontSize: '13px', color: '#7A7570', margin: '0 0 20px' }}>Place supplier POs, track supplier invoices &amp; payments. Orders unlock for production when <strong>paid in full + artwork approved</strong>.</p>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#7A7570' }}>Loading...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #E0DDD7' }}>
                {['Order #', 'Job', 'Gate', 'Supplier PO', 'Supplier', 'Cost', 'Supplier Invoice', 'Pay', ''].map(h => (
                  <th key={h} style={{ padding: '12px 12px', textAlign: 'left', color: '#7A7570', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((o, i) => {
                const po = poForOrder(o.id, o.order_number || o.invoice_number);
                const ready = isReady(o);
                const job = o.job_name || o.customer_company || o.customer_name || '';
                const ps = po ? (PO_STATUS[po.status] || PO_STATUS.draft) : null;
                return (
                  <tr key={o.id} style={{ background: i % 2 === 0 ? '#fff' : BG, borderBottom: '1px solid #F0EEED' }}>
                    <td style={{ padding: '12px', fontWeight: 700, color: GOLD, fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{o.order_number || o.invoice_number}</td>
                    <td style={{ padding: '12px', color: NAVY }}>{job}</td>
                    <td style={{ padding: '12px', whiteSpace: 'nowrap' }}>
                      {ready ? <span style={{ color: '#065F46', fontWeight: 700 }}>✅ Ready</span>
                        : <span style={{ color: '#B0AAA3', fontSize: '11px' }}>{!isPaid(o) ? 'Awaiting payment' : 'Awaiting artwork'}</span>}
                    </td>
                    <td style={{ padding: '12px', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
                      {po ? <span><a href={`/api/admin/purchase-orders/pdf?id=${po.id}`} target="_blank" rel="noreferrer" style={{ color: NAVY, textDecoration: 'underline' }}>{po.po_number}</a> <span style={{ background: ps.bg, color: ps.color, fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '20px', marginLeft: '4px' }}>{ps.label}</span></span> : <span style={{ color: '#B0AAA3' }}>—</span>}
                    </td>
                    <td style={{ padding: '12px', color: '#5A5550' }}>{po ? <span>{supplierName(po.supplier_id)}{termsBadge(po.supplier_id)}</span> : ''}</td>
                    <td style={{ padding: '12px', whiteSpace: 'nowrap', color: NAVY }}>{po ? <span>{money(po.cost_total)} <button onClick={() => editCost(po)} style={{ background: 'none', border: 'none', color: GOLD, fontSize: '11px', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>edit</button></span> : ''}</td>
                    <td style={{ padding: '12px', whiteSpace: 'nowrap', fontSize: '12px' }}>
                      {po ? (po.supplier_invoice_number
                        ? <span style={{ color: '#5A5550' }}>{po.supplier_invoice_number}</span>
                        : <button onClick={() => { const n = prompt('Supplier invoice number:'); if (n) patchPo(po.id, { action: 'invoice', supplierInvoiceNumber: n }); }} style={{ background: 'none', border: '1px solid #E0DDD7', borderRadius: '6px', padding: '4px 8px', fontSize: '11px', cursor: 'pointer', color: NAVY }}>+ Invoice</button>) : ''}
                    </td>
                    <td style={{ padding: '12px', whiteSpace: 'nowrap' }}>
                      {po ? (po.supplier_payment_status === 'paid'
                        ? <span style={{ color: '#065F46', fontWeight: 700, fontSize: '12px' }}>Paid</span>
                        : <button onClick={() => { if (confirm('Mark supplier as paid?')) patchPo(po.id, { action: 'pay' }); }} style={{ background: 'none', border: '1px solid #E0DDD7', borderRadius: '6px', padding: '4px 8px', fontSize: '11px', cursor: 'pointer', color: NAVY }}>Mark paid</button>) : ''}
                    </td>
                    <td style={{ padding: '12px' }}>
                      {!po && (
                        <button onClick={() => openPo(o)} disabled={!ready}
                          style={{ background: ready ? GOLD : '#C8C4BC', color: '#fff', border: 'none', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', fontWeight: 700, cursor: ready ? 'pointer' : 'not-allowed', whiteSpace: 'nowrap' }}>
                          Raise PO
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {poFor && (
        <div onClick={e => e.target === e.currentTarget && setPoFor(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', maxWidth: '440px', width: '100%' }}>
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '22px', color: NAVY, margin: '0 0 4px' }}>Raise Supplier PO</h2>
            <p style={{ fontSize: '13px', color: '#7A7570', margin: '0 0 16px' }}>{poFor.order_number || poFor.invoice_number} · {poFor.customer_name} · Sale {money(grossOf(poFor))}</p>

            <label style={{ fontSize: '11px', fontWeight: 700, color: NAVY, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Supplier</label>
            <select value={supplierId} onChange={e => setSupplierId(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E0DDD7', borderRadius: '8px', fontSize: '14px', margin: '6px 0 8px', boxSizing: 'border-box', background: '#fff' }}>
              <option value="">— select existing —</option>
              {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <input value={newSupplier} onChange={e => setNewSupplier(e.target.value)} placeholder="…or type a new supplier name"
              style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E0DDD7', borderRadius: '8px', fontSize: '14px', margin: '0 0 10px', boxSizing: 'border-box' }} />
            {newSupplier.trim() && (
              <select value={newSupplierTerms} onChange={e => setNewSupplierTerms(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E0DDD7', borderRadius: '8px', fontSize: '14px', margin: '0 0 14px', boxSizing: 'border-box', background: '#fff' }}>
                <option value="prepaid">New supplier terms: Prepaid</option>
                <option value="account">New supplier terms: Monthly account</option>
              </select>
            )}

            <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: NAVY, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Product cost</label>
                <input value={cost} onChange={e => setCost(e.target.value)} type="number" step="0.01" placeholder="0.00"
                  style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E0DDD7', borderRadius: '8px', fontSize: '14px', margin: '6px 0 0', boxSizing: 'border-box' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: NAVY, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Freight cost</label>
                <input value={freight} onChange={e => setFreight(e.target.value)} type="number" step="0.01" placeholder="0.00"
                  style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E0DDD7', borderRadius: '8px', fontSize: '14px', margin: '6px 0 0', boxSizing: 'border-box' }} />
              </div>
            </div>
            <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes (optional)"
              style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E0DDD7', borderRadius: '8px', fontSize: '14px', margin: '0 0 18px', boxSizing: 'border-box' }} />

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={submitPo} disabled={saving || (!supplierId && !newSupplier.trim())}
                style={{ flex: 1, background: (!supplierId && !newSupplier.trim()) ? '#C8C4BC' : '#2D6A4F', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
                {saving ? 'Saving...' : 'Create PO'}
              </button>
              <button onClick={() => setPoFor(null)}
                style={{ background: '#fff', color: '#7A7570', border: '1.5px solid #E0DDD7', borderRadius: '8px', padding: '12px 18px', fontSize: '14px', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

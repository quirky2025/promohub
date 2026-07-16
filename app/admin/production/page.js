'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';
const BG = '#ffffff';

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
  draft:        { bg: '#F1EFE8', color: '#5F5E5A', label: 'Draft' },
  sent:         { bg: '#DBEAFE', color: '#1E40AF', label: 'Sent' },
  confirmed:    { bg: '#E0E7FF', color: '#3730A3', label: 'Confirmed' },
  in_production: { bg: '#EDE9FE', color: '#5B21B6', label: 'In Production' },
  received:     { bg: '#D1FAE5', color: '#065F46', label: 'Received' },
  cancelled:    { bg: '#FEE2E2', color: '#991B1B', label: 'Cancelled' },
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

  const [poFor, setPoFor] = useState(null);
  const [editingPoId, setEditingPoId] = useState(null);
  const [supplierId, setSupplierId] = useState('');
  const [newSupplier, setNewSupplier] = useState('');
  const [newSupplierTerms, setNewSupplierTerms] = useState('prepaid');
  const [lines, setLines] = useState([]);
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

  function posForOrder(orderId, orderNumber) {
    return pos.filter(p => p.order_id === orderId || (orderNumber && p.order_number === orderNumber));
  }

  function linesFromOrder(o) {
    const init = (o.items || []).map(it => ({
      stockCode: it.sku || it.productSku || it.stockCode || '',
      name: it.productName || it.name || '',
      qty: it.qty || it.quantity || 1,
      unitCost: '',
      branding: it.branding || it.brandingMethod || it.decoration_method || '',
    }));
    return init.length ? init : [{ stockCode: '', name: '', qty: 1, unitCost: '', branding: '' }];
  }

  function openPo(o) {
    setPoFor(o); setEditingPoId(null);
    setSupplierId(''); setNewSupplier(''); setNewSupplierTerms('prepaid'); setFreight(''); setNotes('');
    setLines(linesFromOrder(o));
  }

  function openEdit(o, po) {
    setPoFor(o); setEditingPoId(po.id);
    setSupplierId(po.supplier_id || ''); setNewSupplier(''); setNewSupplierTerms('prepaid');
    setFreight(po.freight_cost ?? ''); setNotes(po.notes || '');
    const ls = (Array.isArray(po.items) ? po.items : []).map(it => ({
      stockCode: it.stockCode || '', name: it.name || '', qty: it.qty || 1, unitCost: it.unitCost ?? '', branding: it.branding || '',
    }));
    setLines(ls.length ? ls : linesFromOrder(o));
  }

  function updateLine(i, k, v) { setLines(ls => ls.map((l, idx) => idx === i ? { ...l, [k]: v } : l)); }
  function addLine() { setLines(ls => [...ls, { stockCode: '', name: '', qty: 1, unitCost: '', branding: '' }]); }
  function removeLine(i) { setLines(ls => ls.filter((_, idx) => idx !== i)); }

  const subtotalOf = () => lines.reduce((s, l) => s + (Number(l.qty) || 0) * (Number(l.unitCost) || 0), 0);

  async function submitPo() {
    if (!poFor) return;
    setSaving(true);
    let sid = supplierId;
    if (!sid && newSupplier.trim()) {
      const r = await fetch('/api/admin/suppliers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: newSupplier.trim(), payment_terms: newSupplierTerms }) });
      const d = await r.json();
      if (d.supplier) sid = d.supplier.id;
    }
    const subtotal = Number(subtotalOf().toFixed(2));
    const items = lines.map(l => ({ stockCode: l.stockCode || '', name: l.name || '', qty: Number(l.qty) || 0, unitCost: Number(l.unitCost) || 0, branding: l.branding || '' }));
    let res;
    if (editingPoId) {
      res = await fetch('/api/admin/purchase-orders', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingPoId, action: 'details', supplierId: sid || null, costSubtotal: subtotal, freightCost: Number(freight) || 0, notes, items }),
      });
    } else {
      res = await fetch('/api/admin/purchase-orders', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: poFor.id, orderNumber: poFor.order_number || poFor.invoice_number, supplierId: sid || null, costSubtotal: subtotal, freightCost: Number(freight) || 0, notes, status: 'sent', items }),
      });
    }
    const data = await res.json();
    setSaving(false);
    if (!res.ok || data.error) { alert('Failed: ' + (data.error || 'unknown')); return; }
    setPoFor(null); setEditingPoId(null); load();
  }

  async function patchPo(id, body) {
    const res = await fetch('/api/admin/purchase-orders', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, ...body }) });
    if (res.ok) load(); else alert('Update failed');
  }

  async function sendPo(po) {
    const sup = suppliers.find(s => s.id === po.supplier_id);
    if (!sup?.email) { alert('This supplier has no email yet. Add one in Suppliers → Edit, then send.'); return; }
    if (!confirm(`Email ${po.po_number} to ${sup.name} (${sup.email})?`)) return;
    const res = await fetch('/api/admin/purchase-orders', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: po.id, action: 'send' }) });
    const data = await res.json().catch(() => ({}));
    if (res.ok) { alert(`Sent to ${sup.email} ✅`); load(); }
    else alert('Failed: ' + (data.error || 'unknown'));
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

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '28px 32px' }}>
        <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '30px', fontWeight: 600, color: NAVY, margin: '0 0 6px' }}>Production</h1>
        <p style={{ fontSize: '13px', color: '#7A7570', margin: '0 0 20px' }}>Raise supplier POs, track supplier invoices &amp; payments. Orders unlock when <strong>paid in full + artwork approved</strong>.</p>

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
              {orders.flatMap((o, i) => {
                const list = posForOrder(o.id, o.order_number || o.invoice_number);
                const rows = list.length ? list : [null];
                const ready = isReady(o);
                const job = o.job_name || o.customer_company || o.customer_name || '';
                return rows.map((po, j) => {
                  const first = j === 0;
                  const last = j === rows.length - 1;
                  const ps = po ? (PO_STATUS[po.status] || PO_STATUS.draft) : null;
                  return (
                  <tr key={o.id + '-' + (po ? po.id : 'none')} style={{ background: i % 2 === 0 ? '#fff' : BG, borderBottom: last ? '1px solid #F0EEED' : '1px dashed #F0EEED' }}>
                    <td style={{ padding: '12px', fontWeight: 700, color: GOLD, fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{first ? (o.order_number || o.invoice_number) : ''}</td>
                    <td style={{ padding: '12px', color: NAVY }}>{first ? job : ''}</td>
                    <td style={{ padding: '12px', whiteSpace: 'nowrap' }}>
                      {first ? (ready ? <span style={{ color: '#065F46', fontWeight: 700 }}>✅ Ready</span>
                        : <span style={{ color: '#B0AAA3', fontSize: '11px' }}>{!isPaid(o) ? 'Awaiting payment' : 'Awaiting artwork'}</span>) : ''}
                    </td>
                    <td style={{ padding: '12px', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
                      {po ? <span><a href={`/api/admin/purchase-orders/pdf?id=${po.id}`} target="_blank" rel="noreferrer" style={{ color: NAVY, textDecoration: 'underline' }}>{po.po_number}</a> <span style={{ background: ps.bg, color: ps.color, fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '20px', marginLeft: '4px' }}>{ps.label}</span> <button onClick={() => sendPo(po)} style={{ background: 'none', border: '1px solid #E0DDD7', borderRadius: '6px', padding: '2px 8px', fontSize: '10px', fontWeight: 700, color: NAVY, cursor: 'pointer', marginLeft: '4px', fontFamily: '"DM Sans", sans-serif' }}>✉ Send</button></span> : <span style={{ color: '#B0AAA3' }}>—</span>}
                    </td>
                    <td style={{ padding: '12px', color: '#5A5550' }}>{po ? <span>{supplierName(po.supplier_id)}{termsBadge(po.supplier_id)}</span> : ''}</td>
                    <td style={{ padding: '12px', whiteSpace: 'nowrap', color: NAVY }}>{po ? <span>{money(po.cost_total)} <button onClick={() => openEdit(o, po)} style={{ background: 'none', border: 'none', color: GOLD, fontSize: '11px', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>edit</button></span> : ''}</td>
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
                      {last && (
                        <button onClick={() => openPo(o)}
                          title={ready ? '' : '未满足"付清+审图"门槛,但可手动补录 PO'}
                          style={{ background: GOLD, color: '#fff', border: 'none', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                          {list.length ? '+ PO' : 'Raise PO'}
                        </button>
                      )}
                    </td>
                  </tr>
                  );
                });
              })}
            </tbody>
          </table>
        )}
      </div>

      {poFor && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', maxWidth: '560px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '22px', color: NAVY, margin: '0 0 4px' }}>{editingPoId ? 'Edit Supplier PO' : 'Raise Supplier PO'}</h2>
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

            <label style={{ fontSize: '11px', fontWeight: 700, color: NAVY, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Cost lines (supplier's prices)</label>
            <div style={{ marginTop: '6px', marginBottom: '8px' }}>
              {lines.map((l, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '6px', marginBottom: '6px', alignItems: 'center' }}>
                  <input value={l.stockCode} onChange={e => updateLine(idx, 'stockCode', e.target.value)} placeholder="Code"
                    style={{ width: '78px', padding: '8px', border: '1px solid #E0DDD7', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }} />
                  <input value={l.name} onChange={e => updateLine(idx, 'name', e.target.value)} placeholder="Description (product / Setup / Branding)"
                    style={{ flex: 1, padding: '8px 10px', border: '1px solid #E0DDD7', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }} />
                  <input value={l.qty} onChange={e => updateLine(idx, 'qty', e.target.value)} type="number" placeholder="Qty"
                    style={{ width: '54px', padding: '8px', border: '1px solid #E0DDD7', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }} />
                  <input value={l.unitCost} onChange={e => updateLine(idx, 'unitCost', e.target.value)} type="number" step="0.01" placeholder="Unit $"
                    style={{ width: '72px', padding: '8px', border: '1px solid #E0DDD7', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }} />
                  <button onClick={() => removeLine(idx)} title="Remove" style={{ background: 'none', border: 'none', color: '#B0AAA3', cursor: 'pointer', fontSize: '16px', padding: '0 2px' }}>×</button>
                </div>
              ))}
              <button onClick={addLine} style={{ background: 'none', border: '1px dashed #C8C4BC', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer', color: NAVY }}>+ Add line (Setup / Branding / …)</button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, color: NAVY, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Freight</label>
              <input value={freight} onChange={e => setFreight(e.target.value)} type="number" step="0.01" placeholder="0.00"
                style={{ width: '100px', padding: '8px 10px', border: '1.5px solid #E0DDD7', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
              <div style={{ marginLeft: 'auto', fontSize: '13px', color: NAVY, fontWeight: 700 }}>Total cost: {money(subtotalOf() + (Number(freight) || 0))}</div>
            </div>

            <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes (optional)"
              style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E0DDD7', borderRadius: '8px', fontSize: '14px', margin: '0 0 18px', boxSizing: 'border-box' }} />

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={submitPo} disabled={saving || (!supplierId && !newSupplier.trim())}
                style={{ flex: 1, background: (!supplierId && !newSupplier.trim()) ? '#C8C4BC' : '#2D6A4F', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
                {saving ? 'Saving...' : (editingPoId ? 'Save changes' : 'Create PO')}
              </button>
              <button onClick={() => { setPoFor(null); setEditingPoId(null); }}
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

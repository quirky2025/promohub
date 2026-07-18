'use client';

import { useEffect, useState, useCallback } from 'react';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';
const RED = '#991B1B';
const GREEN = '#2D6A4F';

const money = (n) => '$' + Number(n || 0).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const PO_STATUS = { draft: '草稿', sent: '已发', received: '已收', done: '完成' };
const inp = { padding: '6px 8px', border: '1.5px solid #E0DDD7', borderRadius: 7, fontSize: 12.5, color: '#000', background: '#fff', boxSizing: 'border-box' };
const btn = (bg) => ({ background: bg, color: '#fff', border: 'none', borderRadius: 7, padding: '6px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' });

// Per-product Supplier PO — writes to the SAME purchase_orders as Production,
// so anything here shows there too (invoice / pay / send). One record, two views.
export default function ProductSupplierPO({ orderId, orderNumber, itemIndex, productName, productSku }) {
  const [pos, setPos] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const [p, s] = await Promise.all([
        fetch('/api/admin/purchase-orders', { cache: 'no-store' }).then((r) => r.json()),
        fetch('/api/admin/suppliers', { cache: 'no-store' }).then((r) => r.json()),
      ]);
      const all = p.purchaseOrders || [];
      setPos(all.filter((x) => x.order_number === orderNumber && Number(x.order_item_index) === Number(itemIndex)));
      setSuppliers(s.suppliers || []);
    } catch { /* ignore */ }
  }, [orderNumber, itemIndex]);
  useEffect(() => { load(); }, [load]);

  const supName = (id) => suppliers.find((s) => s.id === id)?.name || '—';

  async function createPO() {
    setBusy(true);
    try {
      const res = await fetch('/api/admin/purchase-orders', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId, orderNumber, orderItemIndex: itemIndex,
          supplierId: form.supplierId || null,
          costSubtotal: Number(form.cost) || 0, freightCost: Number(form.freight) || 0,
          notes: form.notes || null,
          items: [{ name: productName || '', sku: productSku || '', qty: Number(form.qty) || 1 }],
          status: 'draft',
        }),
      });
      const d = await res.json();
      if (!res.ok) { alert('保存失败: ' + (d.error || '')); setBusy(false); return; }
      setForm(null); load();
    } catch (e) { alert('保存失败: ' + e.message); }
    setBusy(false);
  }
  async function patchPo(id, body) {
    const res = await fetch('/api/admin/purchase-orders', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, ...body }) });
    const d = await res.json().catch(() => ({}));
    if (!res.ok) { alert('操作失败: ' + (d.error || '')); return; }
    load();
  }
  async function delPo(id) { if (!confirm('删除这张供应商 PO?')) return; await fetch(`/api/admin/purchase-orders?id=${id}`, { method: 'DELETE' }); load(); }
  function pickInvFile(po) {
    const input = document.createElement('input'); input.type = 'file';
    input.onchange = async () => {
      const file = input.files?.[0]; if (!file) return;
      const fd = new FormData(); fd.append('file', file); fd.append('poId', po.id);
      const r = await fetch('/api/admin/purchase-orders/invoice-upload', { method: 'POST', body: fd });
      if (!r.ok) { const d = await r.json().catch(() => ({})); alert('上传失败: ' + (d.error || '')); return; }
      load();
    };
    input.click();
  }

  return (
    <div style={{ marginTop: 8, background: '#FAF8F4', borderRadius: 8, padding: '9px 11px' }}>
      <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.4px', color: '#000', marginBottom: 6, fontWeight: 700 }}>🏭 供应商 PO — 本产品</div>

      {pos.length === 0 && !form && <div style={{ fontSize: 11.5, color: '#000', marginBottom: 6 }}>还没给这个产品下供应商 PO。</div>}

      {pos.map((po) => (
        <div key={po.id} style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', fontSize: 12, color: '#000', padding: '5px 0', borderBottom: '1px solid #EFEAE0' }}>
          <a href={`/api/admin/purchase-orders/pdf?id=${po.id}`} target="_blank" rel="noreferrer" style={{ fontFamily: 'monospace', fontWeight: 700, color: NAVY }}>{po.po_number}</a>
          <span style={{ background: '#EEF', color: '#3730A3', fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 10 }}>{PO_STATUS[po.status] || po.status}</span>
          <span>{supName(po.supplier_id)}</span>
          <span style={{ fontWeight: 700 }}>{money(po.cost_total)}</span>
          <span style={{ display: 'inline-flex', gap: 8, alignItems: 'center', marginLeft: 'auto', flexWrap: 'wrap' }}>
            <button onClick={() => patchPo(po.id, { action: 'send' })} style={{ background: 'none', border: 'none', color: NAVY, fontWeight: 700, cursor: 'pointer', fontSize: 12 }}>✉ 发</button>
            {po.supplier_invoice_number
              ? <span title="供应商发票号">发票 {po.supplier_invoice_number}</span>
              : <button onClick={() => { const n = prompt('供应商发票号:'); if (n) patchPo(po.id, { action: 'invoice', supplierInvoiceNumber: n }); }} style={{ background: 'none', border: 'none', color: NAVY, cursor: 'pointer', fontSize: 12 }}>+ 发票</button>}
            {po.supplier_invoice_url && <a href={po.supplier_invoice_url} target="_blank" rel="noreferrer" title="打开发票">📄</a>}
            <button onClick={() => pickInvFile(po)} title="传发票文件" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}>📎</button>
            {po.supplier_payment_status === 'paid'
              ? <span style={{ color: GREEN, fontWeight: 700 }}>已付</span>
              : <button onClick={() => { const gross = Math.round((Number(po.cost_total) || 0) * 1.1 * 100) / 100; const v = prompt('实付金额(含 GST)。默认 = 成本 +10%:', gross.toFixed(2)); if (v === null) return; patchPo(po.id, { action: 'pay', paidAmount: Number(v) }); }} style={{ background: 'none', border: `1px solid ${NAVY}`, borderRadius: 6, color: NAVY, cursor: 'pointer', fontSize: 11, padding: '2px 7px' }}>标已付</button>}
            <button onClick={() => delPo(po.id)} style={{ background: 'none', border: 'none', color: RED, cursor: 'pointer', fontSize: 12 }}>删</button>
          </span>
        </div>
      ))}

      {!form
        ? <button onClick={() => setForm({ supplierId: '', cost: '', freight: '', qty: '', notes: '' })} style={{ ...btn(NAVY), marginTop: 8 }}>＋ 给本产品下供应商 PO</button>
        : (
          <div style={{ marginTop: 8, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 8 }}>
            <div>
              <label style={{ fontSize: 10, fontWeight: 700, color: '#000', display: 'block', marginBottom: 2 }}>供应商</label>
              <select value={form.supplierId} onChange={(e) => setForm({ ...form, supplierId: e.target.value })} style={{ ...inp, width: '100%' }}>
                <option value="">选供应商…</option>
                {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div><label style={{ fontSize: 10, fontWeight: 700, color: '#000', display: 'block', marginBottom: 2 }}>数量</label><input type="number" value={form.qty} onChange={(e) => setForm({ ...form, qty: e.target.value })} style={{ ...inp, width: '100%' }} /></div>
            <div><label style={{ fontSize: 10, fontWeight: 700, color: '#000', display: 'block', marginBottom: 2 }}>成本 $(ex GST)</label><input type="number" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} style={{ ...inp, width: '100%' }} /></div>
            <div><label style={{ fontSize: 10, fontWeight: 700, color: '#000', display: 'block', marginBottom: 2 }}>运费 $</label><input type="number" value={form.freight} onChange={(e) => setForm({ ...form, freight: e.target.value })} style={{ ...inp, width: '100%' }} /></div>
            <div style={{ gridColumn: '1 / -1' }}><label style={{ fontSize: 10, fontWeight: 700, color: '#000', display: 'block', marginBottom: 2 }}>备注</label><input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} style={{ ...inp, width: '100%' }} /></div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 8 }}>
              <button onClick={createPO} disabled={busy} style={btn(busy ? '#B0AAA3' : NAVY)}>{busy ? '保存中…' : '保存 PO'}</button>
              <button onClick={() => setForm(null)} style={{ ...btn('#fff'), color: NAVY, border: `1.5px solid ${NAVY}` }}>取消</button>
            </div>
          </div>
        )}
    </div>
  );
}

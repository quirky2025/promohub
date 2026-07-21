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
// 工单A(2026-07-22):成本分行录入 —— 未印刷单价 / 印刷费 / Setup / 运费,
// 合计 = PO 总额,和供应商发票逐行对得上。行结构沿用 items jsonb
// {name, qty, unitCost, stockCode?};costSubtotal=Σ(qty×unitCost),路由不变。
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

  // ---- 分行表单 ----
  const blankForm = () => ({
    editingId: null,
    supplierId: '', freight: '', notes: '',
    lines: [
      { name: `${productName || 'Product'} — unbranded`, qty: '', unitCost: '' },
      { name: 'Branding / print', qty: '', unitCost: '' },
      { name: 'Setup charge', qty: '1', unitCost: '' },
    ],
  });
  const editForm = (po) => ({
    editingId: po.id,
    supplierId: po.supplier_id || '',
    freight: po.freight_cost != null ? String(po.freight_cost) : '',
    notes: po.notes || '',
    lines: (Array.isArray(po.items) && po.items.length ? po.items : [{ name: '', qty: '', unitCost: '' }])
      .map((it) => ({ name: it.name || '', qty: it.qty != null ? String(it.qty) : '', unitCost: it.unitCost != null ? String(it.unitCost) : '' })),
  });

  const setLine = (i, k, v) => setForm((f) => ({ ...f, lines: f.lines.map((l, x) => x === i ? { ...l, [k]: v } : l) }));
  const addLine = () => setForm((f) => ({ ...f, lines: [...f.lines, { name: '', qty: '1', unitCost: '' }] }));
  const delLine = (i) => setForm((f) => ({ ...f, lines: f.lines.filter((_, x) => x !== i) }));

  const lineTotal = (l) => (Number(l.qty) || 0) * (Number(l.unitCost) || 0);
  const validLines = (f) => (f?.lines || []).filter((l) => l.name.trim() && (Number(l.qty) || 0) > 0 && l.unitCost !== '' && !Number.isNaN(Number(l.unitCost)));
  const subtotal = (f) => validLines(f).reduce((s, l) => s + lineTotal(l), 0);
  const grandExGst = (f) => subtotal(f) + (Number(f?.freight) || 0);

  async function savePO() {
    const lines = validLines(form);
    if (!lines.length) { alert('至少填一行有效成本(名称 + 数量 + 单价)。'); return; }
    const items = lines.map((l, i) => ({
      name: l.name.trim(),
      qty: Number(l.qty),
      unitCost: Number(Number(l.unitCost).toFixed(4)),
      ...(i === 0 && productSku ? { stockCode: productSku } : {}),
    }));
    const body = {
      supplierId: form.supplierId || null,
      costSubtotal: Number(subtotal(form).toFixed(2)),
      freightCost: Number(form.freight) || 0,
      notes: form.notes || null,
      items,
    };
    setBusy(true);
    try {
      let res;
      if (form.editingId) {
        res = await fetch('/api/admin/purchase-orders', {
          method: 'PATCH', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: form.editingId, action: 'details', ...body }),
        });
      } else {
        res = await fetch('/api/admin/purchase-orders', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId, orderNumber, orderItemIndex: itemIndex, status: 'draft', ...body }),
        });
      }
      const d = await res.json().catch(() => ({}));
      if (!res.ok) { alert('保存失败: ' + (d.error || res.status)); setBusy(false); return; }
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
        <div key={po.id} style={{ padding: '5px 0', borderBottom: '1px solid #EFEAE0' }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', fontSize: 12, color: '#000' }}>
            <a href={`/api/admin/purchase-orders/pdf?id=${po.id}`} target="_blank" rel="noreferrer" style={{ fontFamily: 'monospace', fontWeight: 700, color: NAVY }}>{po.po_number}</a>
            <span style={{ background: '#EEF', color: '#3730A3', fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 10 }}>{PO_STATUS[po.status] || po.status}</span>
            <span>{supName(po.supplier_id)}</span>
            <span style={{ fontWeight: 700 }}>{money((Number(po.cost_total) || 0) * 1.1)} <span style={{ fontSize: 9, color: '#000' }}>含GST</span></span>
            <span style={{ display: 'inline-flex', gap: 8, alignItems: 'center', marginLeft: 'auto', flexWrap: 'wrap' }}>
              <button onClick={() => setForm(editForm(po))} title="编辑成本分行" style={{ background: 'none', border: 'none', color: NAVY, fontWeight: 700, cursor: 'pointer', fontSize: 12 }}>✎ 改</button>
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
          {/* 成本分行一览(与供应商发票逐行核对) */}
          {Array.isArray(po.items) && po.items.length > 0 && (
            <div style={{ fontSize: 11, color: '#000', margin: '3px 0 0 2px' }}>
              {po.items.map((it, k) => (
                <span key={k} style={{ marginRight: 12 }}>
                  {it.name} × {it.qty} @ {money(it.unitCost)} = <strong>{money((Number(it.qty) || 0) * (Number(it.unitCost) || 0))}</strong>
                </span>
              ))}
              {Number(po.freight_cost) > 0 && <span>Freight <strong>{money(po.freight_cost)}</strong></span>}
            </div>
          )}
        </div>
      ))}

      {!form
        ? <button onClick={() => setForm(blankForm())} style={{ ...btn(NAVY), marginTop: 8 }}>＋ 给本产品下供应商 PO</button>
        : (
          <div style={{ marginTop: 8 }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
              <div style={{ minWidth: 180 }}>
                <label style={{ fontSize: 10, fontWeight: 700, color: '#000', display: 'block', marginBottom: 2 }}>供应商</label>
                <select value={form.supplierId} onChange={(e) => setForm({ ...form, supplierId: e.target.value })} style={{ ...inp, width: '100%' }}>
                  <option value="">选供应商…</option>
                  {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div style={{ flex: 1, minWidth: 180 }}>
                <label style={{ fontSize: 10, fontWeight: 700, color: '#000', display: 'block', marginBottom: 2 }}>备注</label>
                <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} style={{ ...inp, width: '100%' }} />
              </div>
            </div>

            {/* 成本分行(和供应商发票一行一行对) */}
            <div style={{ border: '1px solid #E0DDD7', borderRadius: 8, overflow: 'hidden', background: '#fff' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 70px 100px 90px 26px', gap: 6, padding: '6px 8px', background: NAVY, color: '#fff', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                <span>名称 / 说明</span><span>数量</span><span>单价 ex GST</span><span style={{ textAlign: 'right' }}>小计</span><span />
              </div>
              {form.lines.map((l, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 70px 100px 90px 26px', gap: 6, padding: '5px 8px', alignItems: 'center', borderTop: i ? '1px solid #F0EEE8' : 'none' }}>
                  <input value={l.name} placeholder={i === 0 ? '产品未印刷 / Unbranded product' : i === 1 ? '印刷费 / Branding' : 'Setup charge'} onChange={(e) => setLine(i, 'name', e.target.value)} style={{ ...inp, width: '100%' }} />
                  <input type="number" value={l.qty} placeholder="0" onChange={(e) => setLine(i, 'qty', e.target.value)} style={{ ...inp, width: '100%' }} />
                  <input type="number" step="0.0001" value={l.unitCost} placeholder="0.00" onChange={(e) => setLine(i, 'unitCost', e.target.value)} style={{ ...inp, width: '100%' }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: NAVY, textAlign: 'right' }}>{money(lineTotal(l))}</span>
                  <button onClick={() => delLine(i)} title="删这行" style={{ background: 'none', border: 'none', color: RED, cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>✕</button>
                </div>
              ))}
              <div style={{ padding: '5px 8px', borderTop: '1px solid #F0EEE8' }}>
                <button onClick={addLine} style={{ background: 'none', border: `1px dashed ${NAVY}`, borderRadius: 6, color: NAVY, cursor: 'pointer', fontSize: 11, fontWeight: 700, padding: '3px 10px' }}>＋ 加一行</button>
              </div>
            </div>

            {/* 运费 + 合计(含 GST 口径与「标已付」一致) */}
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap', marginTop: 8, fontSize: 12, color: '#000' }}>
              <span>
                运费 $ <input type="number" step="0.01" value={form.freight} onChange={(e) => setForm({ ...form, freight: e.target.value })} style={{ ...inp, width: 90 }} />
              </span>
              <span>小计 <strong>{money(subtotal(form))}</strong></span>
              <span>合计 ex GST <strong>{money(grandExGst(form))}</strong></span>
              <span style={{ color: NAVY }}>含 GST <strong>{money(grandExGst(form) * 1.1)}</strong></span>
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <button onClick={savePO} disabled={busy} style={btn(busy ? '#B0AAA3' : NAVY)}>{busy ? '保存中…' : form.editingId ? '保存修改' : '保存 PO'}</button>
              <button onClick={() => setForm(null)} style={{ ...btn('#fff'), color: NAVY, border: `1.5px solid ${NAVY}` }}>取消</button>
            </div>
          </div>
        )}
    </div>
  );
}

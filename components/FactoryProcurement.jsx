'use client';

import { useEffect, useState, useCallback } from 'react';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';
const RED = '#991B1B';
const GREEN = '#2D6A4F';

const rmb = (n) => '¥' + Number(n || 0).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const aud = (n) => 'A$' + Number(n || 0).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const STATUS_LABEL = { draft: '草稿 Draft', sent: '已发工厂 Sent', paid: '已付 Paid', shipped: '已发货 Shipped', closed: '完成 Closed' };

const inp = { padding: '7px 9px', border: '1.5px solid #E0DDD7', borderRadius: 7, fontSize: 12.5, color: '#000', background: '#fff', boxSizing: 'border-box' };
const lbl = { fontSize: 10.5, fontWeight: 700, color: '#000', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 3, display: 'block' };
const btn = (bg) => ({ background: bg, color: '#fff', border: 'none', borderRadius: 7, padding: '7px 13px', fontSize: 12.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' });

const emptyPO = (orderNumber) => ({ orderNumber, factoryId: '', productName: '', productSku: '', productSpec: '', quantity: '', unitPriceRmb: '', extraRmb: '', totalRmb: '', factoryInvoiceNumber: '', factoryInvoiceRmb: '', factoryInvoiceDate: '', factoryInvoiceUrl: '', status: 'draft', notes: '' });

// Minimal China procurement: just the Factory PO (so you can generate the PO PDF
// and email the factory). The actual cost (¥ paid · FX · =A$) you write in the
// order's Internal Notes below — that A$ is this order's cost (paid to Dad).
export default function FactoryProcurement({ orderNumber }) {
  const [factories, setFactories] = useState([]);
  const [pos, setPos] = useState([]);
  const [proofs, setProofs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [poForm, setPoForm] = useState(null);
  const [prodResults, setProdResults] = useState([]);
  const [busy, setBusy] = useState(false);

  // Search the factory product library (factory_quotes) by SKU / name.
  async function searchProducts(term) {
    setPoForm(p => ({ ...p, productSku: term }));
    if (!term || term.trim().length < 1) { setProdResults([]); return; }
    try {
      const res = await fetch(`/api/admin/sourcing/quotes?product=${encodeURIComponent(term.trim())}`);
      const d = await res.json();
      setProdResults((d.quotes || []).slice(0, 8));
    } catch { setProdResults([]); }
  }
  // When a product is picked, auto-fill name, SKU, factory, spec and ¥ price.
  function pickProduct(q) {
    const spec = [q.product_size ? `Size: ${q.product_size}` : '', q.material, q.craft].filter(Boolean).join(' · ');
    const tier = [...(q.quote_tiers || [])].sort((a, b) => (a.quantity || 0) - (b.quantity || 0))[0];
    setPoForm(p => ({
      ...p,
      productName: q.product_name || p.productName,
      productSku: q.sku || q.product_code || p.productSku,
      productSpec: spec || p.productSpec,
      factoryId: q.factory_id || p.factoryId,
      unitPriceRmb: tier?.exw_unit_price_rmb ?? p.unitPriceRmb,
    }));
    setProdResults([]);
  }

  const loadProofs = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/orders/documents?orderNumber=${encodeURIComponent(orderNumber)}`, { cache: 'no-store' });
      const d = await res.json();
      setProofs((d.documents || []).filter((x) => x.doc_type === 'payment_proof'));
    } catch { /* ignore */ }
  }, [orderNumber]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/factory-po?orderNumber=${encodeURIComponent(orderNumber)}`, { cache: 'no-store' });
      const d = await res.json();
      setPos(d.pos || []);
    } catch { /* ignore */ }
    await loadProofs();
    setLoading(false);
  }, [orderNumber, loadProofs]);

  useEffect(() => {
    if (!orderNumber) return;
    load();
    fetch('/api/admin/sourcing/factories').then(r => r.json()).then(d => setFactories(d.factories || [])).catch(() => {});
  }, [orderNumber, load]);

  async function post(payload) {
    setBusy(true);
    try {
      const res = await fetch('/api/admin/orders/factory-po', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orderNumber, ...payload }) });
      const d = await res.json();
      if (!res.ok) { alert('保存失败: ' + (d.error || 'unknown')); setBusy(false); return false; }
      if (d.pos) setPos(d.pos); else load();
      setBusy(false);
      return true;
    } catch (e) { alert('保存失败: ' + e.message); setBusy(false); return false; }
  }

  async function uploadFile(file, docType) {
    const fd = new FormData();
    fd.append('file', file); fd.append('orderNumber', orderNumber); fd.append('docType', docType);
    const res = await fetch('/api/admin/orders/documents', { method: 'POST', body: fd });
    const d = await res.json();
    if (!res.ok) { alert('上传失败: ' + (d.error || 'unknown')); return null; }
    return d.document?.file_url || null;
  }

  async function savePO() {
    const f = poForm;
    const total = f.totalRmb !== '' ? f.totalRmb : (Number(f.unitPriceRmb || 0) * Number(f.quantity || 0) + Number(f.extraRmb || 0));
    const ok = await post({ action: 'savePO', ...f, totalRmb: total });
    if (ok) setPoForm(null);
  }

  async function sendPO(po) {
    const to = prompt(`发工厂 PO ${po.po_number} 到工厂邮箱。\n留空则用工厂档案里的 Email；也可以在这里输入/覆盖收件邮箱：`, po.factories?.email || '');
    if (to === null) return;
    setBusy(true);
    try {
      const res = await fetch('/api/admin/orders/factory-po', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orderNumber, action: 'sendPO', id: po.id, toOverride: to.trim() || undefined }) });
      const d = await res.json();
      if (!res.ok) alert('发送失败: ' + (d.error || 'unknown'));
      else { alert('已发送到 ' + d.to); if (d.pos) setPos(d.pos); }
    } catch (e) { alert('发送失败: ' + e.message); }
    setBusy(false);
  }

  if (!orderNumber) return null;

  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ fontSize: 13, fontWeight: 800, color: '#000', marginBottom: 4 }}>🏭 工厂 PO · Factory PO (China)</div>
      <div style={{ fontSize: 11.5, color: '#000', marginBottom: 12 }}>搜 SKU 选产品(自动带出规格/¥价)→ 填数量 → 存 → <strong>📄 PO PDF / ✉ 发工厂</strong> 直接下单。发票、支付凭证后补。成本(¥→A$)写在订单 Internal Notes。</div>

      {loading ? <div style={{ fontSize: 12, color: '#000' }}>Loading…</div> : (
        <>
          {pos.map((po) => (
            <div key={po.id} style={{ border: '1.5px solid #E0DDD7', borderRadius: 10, padding: 12, marginBottom: 12, background: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <div>
                  <span style={{ fontFamily: 'monospace', fontWeight: 800, color: NAVY }}>{po.po_number}</span>
                  <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 700, color: '#000', background: '#F1EFE8', padding: '2px 8px', borderRadius: 20 }}>{STATUS_LABEL[po.status] || po.status}</span>
                  <div style={{ fontSize: 12.5, color: '#000', marginTop: 4 }}>{po.factories?.name || '(no factory)'} · {po.product_name || ''} {po.product_sku ? `(${po.product_sku})` : ''} · 数量 {po.quantity || '—'}</div>
                  {po.product_spec && <div style={{ fontSize: 12, color: '#000', marginTop: 2 }}>规格: {po.product_spec}</div>}
                  <div style={{ fontSize: 12.5, color: '#000', marginTop: 2 }}>工厂总额 <strong>{rmb(po.total_rmb)}</strong></div>
                  {po.factory_invoice_number && <div style={{ fontSize: 11.5, color: '#000', marginTop: 2 }}>工厂发票 {po.factory_invoice_number} · {rmb(po.factory_invoice_rmb)} {po.factory_invoice_date ? `· ${po.factory_invoice_date}` : ''} {po.factory_invoice_url ? <a href={po.factory_invoice_url} target="_blank" rel="noreferrer" style={{ color: NAVY, fontWeight: 700 }}> 查看→</a> : ''}</div>}
                </div>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  <a href={`/api/admin/orders/factory-po?pdf=1&poId=${po.id}`} target="_blank" rel="noreferrer" style={{ ...btn('#fff'), color: NAVY, border: `1.5px solid ${NAVY}`, textDecoration: 'none' }}>📄 PO PDF</a>
                  <button onClick={() => sendPO(po)} disabled={busy} style={btn(GREEN)}>✉ 发工厂</button>
                  <button onClick={() => setPoForm({ id: po.id, orderNumber, factoryId: po.factory_id || '', productName: po.product_name || '', productSku: po.product_sku || '', productSpec: po.product_spec || '', quantity: po.quantity ?? '', unitPriceRmb: po.unit_price_rmb ?? '', extraRmb: po.extra_rmb ?? '', totalRmb: po.total_rmb ?? '', factoryInvoiceNumber: po.factory_invoice_number || '', factoryInvoiceRmb: po.factory_invoice_rmb ?? '', factoryInvoiceDate: po.factory_invoice_date || '', factoryInvoiceUrl: po.factory_invoice_url || '', status: po.status || 'draft', notes: po.notes || '' })} style={{ ...btn('#fff'), color: NAVY, border: `1.5px solid ${NAVY}` }}>编辑</button>
                  <button onClick={async () => { if (confirm(`删除工厂 PO ${po.po_number}?`)) await post({ action: 'deletePO', id: po.id }); }} style={{ ...btn('#fff'), color: RED, border: `1.5px solid ${RED}` }}>删除</button>
                </div>
              </div>
            </div>
          ))}
          <button onClick={() => setPoForm(emptyPO(orderNumber))} style={btn(NAVY)}>＋ 新建工厂 PO</button>

          {/* 支付凭证 — 微信截图 */}
          <div style={{ marginTop: 16, borderTop: '1px solid #F0EEED', paddingTop: 12 }}>
            <div style={{ ...lbl, marginBottom: 8 }}>支付凭证 Payment proof（付工厂的微信截图）</div>
            <label style={{ display: 'inline-block', marginBottom: 8 }}>
              <input type="file" style={{ display: 'none' }} disabled={busy}
                onChange={async (e) => { const file = e.target.files?.[0]; e.target.value = ''; if (!file) return; setBusy(true); const url = await uploadFile(file, 'payment_proof'); if (url) await loadProofs(); setBusy(false); }} />
              <span style={btn(busy ? '#B0AAA3' : GOLD)}>{busy ? '上传中…' : '⬆ 上传支付凭证'}</span>
            </label>
            {proofs.length === 0 ? <div style={{ fontSize: 11.5, color: '#000' }}>还没上传凭证。</div> : (
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {proofs.map((d) => {
                  const isImg = (d.mime || '').startsWith('image/') || /\.(png|jpe?g|gif|webp|bmp)$/i.test(d.file_name || d.file_url || '');
                  return (
                    <div key={d.id} style={{ width: 120, border: '1.5px solid #E0DDD7', borderRadius: 10, overflow: 'hidden', background: '#fff' }}>
                      <a href={d.file_url} target="_blank" rel="noreferrer" style={{ display: 'block', textDecoration: 'none' }}>
                        {isImg ? <img src={d.file_url} alt={d.file_name} style={{ width: '100%', height: 84, objectFit: 'cover', display: 'block' }} /> : <div style={{ height: 84, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F6F3EE', fontSize: 26 }}>📄</div>}
                      </a>
                      <div style={{ padding: '6px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <a href={d.file_url} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: NAVY, fontWeight: 700 }}>看→</a>
                        <button onClick={async () => { if (confirm('删除这张凭证?')) { await fetch(`/api/admin/orders/documents?id=${d.id}`, { method: 'DELETE' }); loadProofs(); } }} style={{ background: 'none', border: 'none', color: RED, fontSize: 11, cursor: 'pointer', padding: 0 }}>删除</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {poForm && (
        <Modal title={poForm.id ? '编辑工厂 PO' : '新建工厂 PO'} onClose={() => setPoForm(null)}>
          {/* Product search — pick from the factory product library; auto-fills name/SKU/factory/spec/¥. */}
          <div style={{ position: 'relative', marginBottom: 10 }}>
            <label style={lbl}>搜产品 / SKU（从产品库选,自动带出产品/规格/价格）</label>
            <input value={poForm.productSku} onChange={e => searchProducts(e.target.value)} placeholder="输入 SKU 或产品名…" style={{ ...inp, width: '100%' }} />
            {prodResults.length > 0 && (
              <div style={{ position: 'absolute', zIndex: 20, left: 0, right: 0, background: '#fff', border: '1px solid #E0DDD7', borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', maxHeight: 220, overflowY: 'auto' }}>
                {prodResults.map(q => (
                  <div key={q.id} onClick={() => pickProduct(q)} style={{ padding: '8px 10px', cursor: 'pointer', fontSize: 12.5, borderBottom: '1px solid #F0EEED', color: '#000' }}>
                    <strong style={{ color: NAVY }}>{q.sku || q.product_code || '—'}</strong> — {q.product_name} <span style={{ color: '#000' }}>· {q.factories?.name || ''}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Field label="规格 SPEC（尺寸/颜色/工艺,如 3M adhesive backing）"><textarea value={poForm.productSpec} onChange={e => setPoForm({ ...poForm, productSpec: e.target.value })} rows={2} style={{ ...inp, width: '100%', resize: 'vertical' }} /></Field>
          <Grid>
            <Field label="工厂 Factory">
              <select value={poForm.factoryId} onChange={e => setPoForm({ ...poForm, factoryId: e.target.value })} style={{ ...inp, width: '100%' }}>
                <option value="">选择工厂…</option>
                {factories.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
            </Field>
            <Field label="状态 Status">
              <select value={poForm.status} onChange={e => setPoForm({ ...poForm, status: e.target.value })} style={{ ...inp, width: '100%' }}>
                {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </Field>
            <Field label="产品 Product"><input value={poForm.productName} onChange={e => setPoForm({ ...poForm, productName: e.target.value })} style={{ ...inp, width: '100%' }} /></Field>
            <Field label="SKU"><input value={poForm.productSku} onChange={e => setPoForm({ ...poForm, productSku: e.target.value })} style={{ ...inp, width: '100%' }} /></Field>
            <Field label="数量 Qty"><input type="number" value={poForm.quantity} onChange={e => setPoForm({ ...poForm, quantity: e.target.value })} style={{ ...inp, width: '100%' }} /></Field>
            <Field label="单价 EXW (¥)"><input type="number" value={poForm.unitPriceRmb} onChange={e => setPoForm({ ...poForm, unitPriceRmb: e.target.value })} style={{ ...inp, width: '100%' }} /></Field>
            <Field label="额外 (模具/打样 ¥)"><input type="number" value={poForm.extraRmb} onChange={e => setPoForm({ ...poForm, extraRmb: e.target.value })} style={{ ...inp, width: '100%' }} /></Field>
            <Field label="工厂总额 (¥) 留空自动算"><input type="number" value={poForm.totalRmb} onChange={e => setPoForm({ ...poForm, totalRmb: e.target.value })} placeholder={String(Number(poForm.unitPriceRmb || 0) * Number(poForm.quantity || 0) + Number(poForm.extraRmb || 0))} style={{ ...inp, width: '100%' }} /></Field>
            <Field label="工厂发票号（可选,后补）"><input value={poForm.factoryInvoiceNumber} onChange={e => setPoForm({ ...poForm, factoryInvoiceNumber: e.target.value })} style={{ ...inp, width: '100%' }} /></Field>
            <Field label="工厂发票额 (¥)"><input type="number" value={poForm.factoryInvoiceRmb} onChange={e => setPoForm({ ...poForm, factoryInvoiceRmb: e.target.value })} style={{ ...inp, width: '100%' }} /></Field>
            <Field label="工厂发票日期"><input type="date" value={poForm.factoryInvoiceDate} onChange={e => setPoForm({ ...poForm, factoryInvoiceDate: e.target.value })} style={{ ...inp, width: '100%' }} /></Field>
            <Field label="工厂发票文件">
              <input type="file" disabled={busy} onChange={async (e) => { const file = e.target.files?.[0]; if (!file) return; const url = await uploadFile(file, 'factory_invoice'); if (url) setPoForm(p => ({ ...p, factoryInvoiceUrl: url })); }} style={{ fontSize: 12, color: '#000' }} />
              {poForm.factoryInvoiceUrl && <a href={poForm.factoryInvoiceUrl} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: NAVY, fontWeight: 700 }}>已上传 查看→</a>}
            </Field>
          </Grid>
          <Field label="备注 Notes"><textarea value={poForm.notes} onChange={e => setPoForm({ ...poForm, notes: e.target.value })} rows={2} style={{ ...inp, width: '100%', resize: 'vertical' }} /></Field>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button onClick={savePO} disabled={busy} style={btn(busy ? '#B0AAA3' : NAVY)}>{busy ? '保存中…' : '保存 PO'}</button>
            <button onClick={() => setPoForm(null)} style={{ ...btn('#fff'), color: NAVY, border: `1.5px solid ${NAVY}` }}>取消</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Field({ label, children }) {
  return <div style={{ marginBottom: 8 }}><label style={lbl}>{label}</label>{children}</div>;
}
function Grid({ children }) {
  return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 8 }}>{children}</div>;
}
function Modal({ title, onClose, children }) {
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', zIndex: 1000, padding: 24, overflowY: 'auto' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 14, padding: 20, width: '100%', maxWidth: 620, marginTop: 40 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: NAVY }}>{title}</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, color: '#999', cursor: 'pointer', lineHeight: 1 }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

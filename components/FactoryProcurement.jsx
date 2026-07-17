'use client';

import { useEffect, useState, useCallback } from 'react';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';
const RED = '#991B1B';
const GREEN = '#2D6A4F';

const rmb = (n) => '¥' + Number(n || 0).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const aud = (n) => 'A$' + Number(n || 0).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const KIND_LABEL = { deposit: '定金 Deposit', balance: '尾款 Balance', full: '全款 Full', other: '其他 Other' };
const STATUS_LABEL = { draft: '草稿 Draft', sent: '已下单 Sent', deposit_paid: '已付定金 Deposit paid', paid: '已付清 Paid', shipped: '已发货 Shipped', closed: '完成 Closed' };

const inp = { padding: '7px 9px', border: '1.5px solid #E0DDD7', borderRadius: 7, fontSize: 12.5, color: '#000', background: '#fff', boxSizing: 'border-box' };
const lbl = { fontSize: 10.5, fontWeight: 700, color: '#000', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 3, display: 'block' };
const btn = (bg) => ({ background: bg, color: '#fff', border: 'none', borderRadius: 7, padding: '7px 13px', fontSize: 12.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' });

const emptyPO = (orderNumber) => ({ orderNumber, factoryId: '', productName: '', productSku: '', quantity: '', unitPriceRmb: '', extraRmb: '', totalRmb: '', fxRate: '4.5', factoryInvoiceNumber: '', factoryInvoiceRmb: '', factoryInvoiceDate: '', factoryInvoiceUrl: '', status: 'draft', notes: '' });

export default function FactoryProcurement({ orderNumber, order }) {
  const [factories, setFactories] = useState([]);
  const [data, setData] = useState({ pos: [], payments: [], repayments: [], ledger: {} });
  const [loading, setLoading] = useState(true);
  const [poForm, setPoForm] = useState(null);          // {id?, ...emptyPO}
  const [payForm, setPayForm] = useState(null);        // {poId, id?, kind, amountRmb, fxRate, paidDate, proofUrl, note}
  const [repayForm, setRepayForm] = useState(null);    // {id?, amountAud, paidDate, method, note, proofUrl, factoryPoId}
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/factory-po?orderNumber=${encodeURIComponent(orderNumber)}`, { cache: 'no-store' });
      const d = await res.json();
      setData({ pos: d.pos || [], payments: d.payments || [], repayments: d.repayments || [], ledger: d.ledger || {} });
    } catch { /* ignore */ }
    setLoading(false);
  }, [orderNumber]);

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
      if (d.pos) setData({ pos: d.pos, payments: d.payments || [], repayments: d.repayments || [], ledger: d.ledger || {} });
      else load();
      setBusy(false);
      return true;
    } catch (e) { alert('保存失败: ' + e.message); setBusy(false); return false; }
  }

  // Upload a proof file to R2 via the documents route; returns its URL.
  async function uploadProof(file, docType) {
    const fd = new FormData();
    fd.append('file', file); fd.append('orderNumber', orderNumber); fd.append('docType', docType);
    const res = await fetch('/api/admin/orders/documents', { method: 'POST', body: fd });
    const d = await res.json();
    if (!res.ok) { alert('上传失败: ' + (d.error || 'unknown')); return null; }
    return d.document?.file_url || null;
  }

  if (!orderNumber) return null;

  const paymentsFor = (poId) => data.payments.filter(p => p.factory_po_id === poId);
  const ledger = data.ledger || {};

  // ---- PO save ----
  async function savePO() {
    const f = poForm;
    const total = f.totalRmb !== '' ? f.totalRmb : (Number(f.unitPriceRmb || 0) * Number(f.quantity || 0) + Number(f.extraRmb || 0));
    const ok = await post({ action: 'savePO', ...f, totalRmb: total });
    if (ok) setPoForm(null);
  }
  async function savePayment() {
    const ok = await post({ action: 'savePayment', ...payForm, factoryPoId: payForm.poId });
    if (ok) setPayForm(null);
  }
  async function saveRepayment() {
    const ok = await post({ action: 'saveRepayment', ...repayForm });
    if (ok) setRepayForm(null);
  }

  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ fontSize: 13, fontWeight: 800, color: '#000', marginBottom: 12 }}>🏭 工厂采购 · Factory PO (China)</div>

      {/* DAD LEDGER SUMMARY */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
        <Stat label="已付工厂 (RMB)" value={rmb(ledger.paidToFactoryRmb)} />
        <Stat label="= 折澳币 (欠爸爸)" value={aud(ledger.paidToFactoryAud)} />
        <Stat label="已还爸爸 (AUD)" value={aud(ledger.repaidToDadAud)} color={GREEN} />
        <Stat label="还欠爸爸" value={aud(ledger.owedToDad)} color={Number(ledger.owedToDad) > 0.01 ? RED : GREEN} big />
      </div>

      {loading ? <div style={{ fontSize: 12, color: '#000' }}>Loading…</div> : (
        <>
          {/* FACTORY POs */}
          {data.pos.map((po) => {
            const legs = paymentsFor(po.id);
            const paidRmb = legs.reduce((s, l) => s + (Number(l.amount_rmb) || 0), 0);
            return (
              <div key={po.id} style={{ border: '1.5px solid #E0DDD7', borderRadius: 10, padding: 12, marginBottom: 12, background: '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                  <div>
                    <span style={{ fontFamily: 'monospace', fontWeight: 800, color: NAVY }}>{po.po_number}</span>
                    <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 700, color: '#000', background: '#F1EFE8', padding: '2px 8px', borderRadius: 20 }}>{STATUS_LABEL[po.status] || po.status}</span>
                    <div style={{ fontSize: 12.5, color: '#000', marginTop: 4 }}>{po.factories?.name || '(no factory)'} · {po.product_name || ''} {po.product_sku ? `(${po.product_sku})` : ''} · 数量 {po.quantity || '—'}</div>
                    <div style={{ fontSize: 12.5, color: '#000', marginTop: 2 }}>工厂总额 <strong>{rmb(po.total_rmb)}</strong> · 已付 {rmb(paidRmb)} · 还差 <strong style={{ color: paidRmb >= (Number(po.total_rmb) || 0) - 0.01 ? GREEN : RED }}>{rmb(Math.max(0, (Number(po.total_rmb) || 0) - paidRmb))}</strong></div>
                    {po.factory_invoice_number && <div style={{ fontSize: 11.5, color: '#000', marginTop: 2 }}>工厂发票 {po.factory_invoice_number} · {rmb(po.factory_invoice_rmb)} {po.factory_invoice_date ? `· ${po.factory_invoice_date}` : ''} {po.factory_invoice_url ? <a href={po.factory_invoice_url} target="_blank" rel="noreferrer" style={{ color: NAVY, fontWeight: 700 }}> 查看→</a> : ''}</div>}
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    <button onClick={() => setPoForm({ id: po.id, orderNumber, factoryId: po.factory_id || '', productName: po.product_name || '', productSku: po.product_sku || '', quantity: po.quantity ?? '', unitPriceRmb: po.unit_price_rmb ?? '', extraRmb: po.extra_rmb ?? '', totalRmb: po.total_rmb ?? '', fxRate: po.fx_rate ?? '4.5', factoryInvoiceNumber: po.factory_invoice_number || '', factoryInvoiceRmb: po.factory_invoice_rmb ?? '', factoryInvoiceDate: po.factory_invoice_date || '', factoryInvoiceUrl: po.factory_invoice_url || '', status: po.status || 'draft', notes: po.notes || '' })} style={{ ...btn('#fff'), color: NAVY, border: `1.5px solid ${NAVY}` }}>编辑</button>
                    <button onClick={async () => { if (confirm(`删除工厂 PO ${po.po_number}?（连同它的付款记录）`)) await post({ action: 'deletePO', id: po.id }); }} style={{ ...btn('#fff'), color: RED, border: `1.5px solid ${RED}` }}>删除</button>
                  </div>
                </div>

                {/* payment legs */}
                <div style={{ marginTop: 10, borderTop: '1px dashed #E0DDD7', paddingTop: 8 }}>
                  <div style={{ ...lbl, marginBottom: 6 }}>RMB 付款腿（爸爸微信付工厂）</div>
                  {legs.length === 0 && <div style={{ fontSize: 11.5, color: '#000', marginBottom: 6 }}>还没付款。加一笔定金或全款。</div>}
                  {legs.map((l) => (
                    <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#000', padding: '4px 0', borderBottom: '1px solid #F5F3EF' }}>
                      <span style={{ fontWeight: 700 }}>{KIND_LABEL[l.kind] || l.kind}</span>
                      <span>{rmb(l.amount_rmb)}</span>
                      <span style={{ color: '#555' }}>÷{l.fx_rate} = {aud(l.amount_aud)}</span>
                      <span style={{ color: '#555' }}>{l.paid_date || ''}</span>
                      {l.proof_url && <a href={l.proof_url} target="_blank" rel="noreferrer" style={{ color: NAVY, fontWeight: 700 }}>凭证→</a>}
                      <span style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                        <button onClick={() => setPayForm({ poId: po.id, id: l.id, kind: l.kind, amountRmb: l.amount_rmb ?? '', fxRate: l.fx_rate ?? (po.fx_rate ?? '4.5'), paidDate: l.paid_date || '', proofUrl: l.proof_url || '', note: l.note || '' })} style={{ background: 'none', border: 'none', color: NAVY, fontWeight: 700, cursor: 'pointer', fontSize: 12 }}>编辑</button>
                        <button onClick={async () => { if (confirm('删除这笔付款?')) await post({ action: 'deletePayment', id: l.id }); }} style={{ background: 'none', border: 'none', color: RED, cursor: 'pointer', fontSize: 12 }}>删除</button>
                      </span>
                    </div>
                  ))}
                  <button onClick={() => setPayForm({ poId: po.id, kind: legs.length === 0 ? 'deposit' : 'balance', amountRmb: '', fxRate: po.fx_rate ?? '4.5', paidDate: '', proofUrl: '', note: '' })} style={{ ...btn(GOLD), marginTop: 8 }}>＋ 记一笔付款</button>
                </div>
              </div>
            );
          })}

          <button onClick={() => setPoForm(emptyPO(orderNumber))} style={{ ...btn(NAVY), marginBottom: 16 }}>＋ 新建工厂 PO</button>

          {/* DAD REPAYMENTS */}
          <div style={{ borderTop: '1px solid #F0EEED', paddingTop: 12 }}>
            <div style={{ ...lbl, marginBottom: 6 }}>还爸爸澳币（公司 → 爸爸澳币账户）</div>
            {data.repayments.length === 0 && <div style={{ fontSize: 11.5, color: '#000', marginBottom: 6 }}>还没还款记录。</div>}
            {data.repayments.map((r) => (
              <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#000', padding: '4px 0', borderBottom: '1px solid #F5F3EF' }}>
                <span style={{ fontWeight: 700, color: GREEN }}>{aud(r.amount_aud)}</span>
                <span style={{ color: '#555' }}>{r.paid_date || ''}</span>
                <span style={{ color: '#555' }}>{r.method || ''}</span>
                {r.note && <span style={{ color: '#555' }}>{r.note}</span>}
                {r.proof_url && <a href={r.proof_url} target="_blank" rel="noreferrer" style={{ color: NAVY, fontWeight: 700 }}>凭证→</a>}
                <span style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                  <button onClick={() => setRepayForm({ id: r.id, amountAud: r.amount_aud ?? '', paidDate: r.paid_date || '', method: r.method || '', note: r.note || '', proofUrl: r.proof_url || '', factoryPoId: r.ref_factory_po_id || '' })} style={{ background: 'none', border: 'none', color: NAVY, fontWeight: 700, cursor: 'pointer', fontSize: 12 }}>编辑</button>
                  <button onClick={async () => { if (confirm('删除这笔还款?')) await post({ action: 'deleteRepayment', id: r.id }); }} style={{ background: 'none', border: 'none', color: RED, cursor: 'pointer', fontSize: 12 }}>删除</button>
                </span>
              </div>
            ))}
            <button onClick={() => setRepayForm({ amountAud: ledger.owedToDad > 0 ? String(ledger.owedToDad) : '', paidDate: '', method: 'Bank transfer', note: '', proofUrl: '', factoryPoId: '' })} style={{ ...btn(GREEN), marginTop: 8 }}>＋ 记一笔还爸爸</button>
          </div>
        </>
      )}

      {/* ---- PO FORM MODAL ---- */}
      {poForm && (
        <Modal title={poForm.id ? '编辑工厂 PO' : '新建工厂 PO'} onClose={() => setPoForm(null)}>
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
            <Field label="汇率 ¥ per A$1"><input type="number" value={poForm.fxRate} onChange={e => setPoForm({ ...poForm, fxRate: e.target.value })} style={{ ...inp, width: '100%' }} /></Field>
            <Field label="工厂发票号"><input value={poForm.factoryInvoiceNumber} onChange={e => setPoForm({ ...poForm, factoryInvoiceNumber: e.target.value })} style={{ ...inp, width: '100%' }} /></Field>
            <Field label="工厂发票额 (¥)"><input type="number" value={poForm.factoryInvoiceRmb} onChange={e => setPoForm({ ...poForm, factoryInvoiceRmb: e.target.value })} style={{ ...inp, width: '100%' }} /></Field>
            <Field label="工厂发票日期"><input type="date" value={poForm.factoryInvoiceDate} onChange={e => setPoForm({ ...poForm, factoryInvoiceDate: e.target.value })} style={{ ...inp, width: '100%' }} /></Field>
            <Field label="工厂发票文件">
              <input type="file" disabled={busy} onChange={async (e) => { const file = e.target.files?.[0]; if (!file) return; const url = await uploadProof(file, 'factory_invoice'); if (url) setPoForm(p => ({ ...p, factoryInvoiceUrl: url })); }} style={{ fontSize: 12, color: '#000' }} />
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

      {/* ---- PAYMENT FORM MODAL ---- */}
      {payForm && (
        <Modal title={payForm.id ? '编辑付款' : '记一笔付款（付工厂 RMB）'} onClose={() => setPayForm(null)}>
          <Grid>
            <Field label="类型">
              <select value={payForm.kind} onChange={e => setPayForm({ ...payForm, kind: e.target.value })} style={{ ...inp, width: '100%' }}>
                {Object.entries(KIND_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </Field>
            <Field label="金额 (¥)"><input type="number" value={payForm.amountRmb} onChange={e => setPayForm({ ...payForm, amountRmb: e.target.value })} style={{ ...inp, width: '100%' }} /></Field>
            <Field label="当天汇率 ¥ per A$1"><input type="number" value={payForm.fxRate} onChange={e => setPayForm({ ...payForm, fxRate: e.target.value })} style={{ ...inp, width: '100%' }} /></Field>
            <Field label="= 折澳币"><div style={{ ...inp, width: '100%', background: '#F6F3EE', fontWeight: 700 }}>{payForm.amountRmb && payForm.fxRate ? aud(Number(payForm.amountRmb) / Number(payForm.fxRate)) : '—'}</div></Field>
            <Field label="付款日期"><input type="date" value={payForm.paidDate} onChange={e => setPayForm({ ...payForm, paidDate: e.target.value })} style={{ ...inp, width: '100%' }} /></Field>
            <Field label="微信截图凭证">
              <input type="file" disabled={busy} onChange={async (e) => { const file = e.target.files?.[0]; if (!file) return; const url = await uploadProof(file, 'payment_proof'); if (url) setPayForm(p => ({ ...p, proofUrl: url })); }} style={{ fontSize: 12, color: '#000' }} />
              {payForm.proofUrl && <a href={payForm.proofUrl} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: NAVY, fontWeight: 700 }}>已上传 查看→</a>}
            </Field>
          </Grid>
          <Field label="备注"><input value={payForm.note} onChange={e => setPayForm({ ...payForm, note: e.target.value })} style={{ ...inp, width: '100%' }} /></Field>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button onClick={savePayment} disabled={busy} style={btn(busy ? '#B0AAA3' : GOLD)}>{busy ? '保存中…' : '保存付款'}</button>
            <button onClick={() => setPayForm(null)} style={{ ...btn('#fff'), color: NAVY, border: `1.5px solid ${NAVY}` }}>取消</button>
          </div>
        </Modal>
      )}

      {/* ---- REPAYMENT FORM MODAL ---- */}
      {repayForm && (
        <Modal title={repayForm.id ? '编辑还款' : '记一笔还爸爸（澳币）'} onClose={() => setRepayForm(null)}>
          <Grid>
            <Field label="金额 (A$)"><input type="number" value={repayForm.amountAud} onChange={e => setRepayForm({ ...repayForm, amountAud: e.target.value })} style={{ ...inp, width: '100%' }} /></Field>
            <Field label="日期"><input type="date" value={repayForm.paidDate} onChange={e => setRepayForm({ ...repayForm, paidDate: e.target.value })} style={{ ...inp, width: '100%' }} /></Field>
            <Field label="方式"><input value={repayForm.method} onChange={e => setRepayForm({ ...repayForm, method: e.target.value })} style={{ ...inp, width: '100%' }} /></Field>
            <Field label="对应工厂 PO（可选）">
              <select value={repayForm.factoryPoId} onChange={e => setRepayForm({ ...repayForm, factoryPoId: e.target.value })} style={{ ...inp, width: '100%' }}>
                <option value="">（不指定）</option>
                {data.pos.map(p => <option key={p.id} value={p.id}>{p.po_number}</option>)}
              </select>
            </Field>
            <Field label="凭证（可选）">
              <input type="file" disabled={busy} onChange={async (e) => { const file = e.target.files?.[0]; if (!file) return; const url = await uploadProof(file, 'payment_proof'); if (url) setRepayForm(p => ({ ...p, proofUrl: url })); }} style={{ fontSize: 12, color: '#000' }} />
              {repayForm.proofUrl && <a href={repayForm.proofUrl} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: NAVY, fontWeight: 700 }}>已上传 查看→</a>}
            </Field>
          </Grid>
          <Field label="备注"><input value={repayForm.note} onChange={e => setRepayForm({ ...repayForm, note: e.target.value })} style={{ ...inp, width: '100%' }} /></Field>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button onClick={saveRepayment} disabled={busy} style={btn(busy ? '#B0AAA3' : GREEN)}>{busy ? '保存中…' : '保存还款'}</button>
            <button onClick={() => setRepayForm(null)} style={{ ...btn('#fff'), color: NAVY, border: `1.5px solid ${NAVY}` }}>取消</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Stat({ label, value, color, big }) {
  return (
    <div style={{ flex: '1 1 120px', minWidth: 120, background: '#FBFAF8', border: '1.5px solid #E0DDD7', borderRadius: 10, padding: '9px 12px' }}>
      <div style={{ fontSize: 10.5, fontWeight: 700, color: '#000', marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: big ? 17 : 14, fontWeight: 800, color: color || NAVY }}>{value}</div>
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

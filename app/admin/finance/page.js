// app/admin/finance/page.js
// FINANCE v1 — manual bank ledger (source of truth, GST + business line for BAS)
// and the forwarder lump-payment allocator: one AUD payment settling several RMB
// invoices at spot FX + a handling fee, split back to each sourcing order.
'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { accountsBySection, SECTION_LABEL } from '@/lib/financeAccounts';
import '../sourcing/sourcing.css';

const aud = (v) =>
  v == null || v === '' || Number.isNaN(Number(v)) ? '—'
    : '$' + Number(v).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const rmb = (v) =>
  v == null || v === '' || Number.isNaN(Number(v)) ? '—'
    : '¥' + Number(v).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const r2 = (n) => Math.round((Number(n) || 0) * 100) / 100;
const LINE_LABEL = { local_stock: '本地备货', sourcing: 'Sourcing', overhead: '日常/管理' };

export default function FinancePage() {
  const [bank, setBank] = useState(null);
  const [fwd, setFwd] = useState({ bills: [], payments: [], orders: [] });
  const [tab, setTab] = useState('bank');
  const [err, setErr] = useState('');

  async function load() {
    const [b, f] = await Promise.all([
      fetch('/api/admin/finance/bank').then((r) => r.json()),
      fetch('/api/admin/finance/forwarder').then((r) => r.json()),
    ]);
    if (b.error) setErr(b.error); else setBank(b);
    if (!f.error) setFwd(f);
  }
  useEffect(() => { load(); }, []);

  return (
    <div className="srcx-wrap">
      <nav className="srcx-subnav">
        <Link href="/admin" style={{ color: 'var(--gold)', fontWeight: 700, textDecoration: 'none', paddingBottom: 10, marginRight: 4 }}>← 后台首页</Link>
        <span className="srcx-subnav-title">Finance</span>
        <a className={tab === 'bank' ? 'active' : ''} onClick={() => setTab('bank')} style={{ cursor: 'pointer' }}>银行流水</a>
        <a className={tab === 'forwarder' ? 'active' : ''} onClick={() => setTab('forwarder')} style={{ cursor: 'pointer' }}>货代付款</a>
        <a className={tab === 'invoices' ? 'active' : ''} onClick={() => setTab('invoices')} style={{ cursor: 'pointer' }}>发票 Invoices</a>
        <a className={tab === 'pl' ? 'active' : ''} onClick={() => setTab('pl')} style={{ cursor: 'pointer' }}>利润表 P&amp;L</a>
      </nav>

      {err && <div className="srcx-error">{err}</div>}

      {bank && <BalanceStrip summary={bank.summary} />}

      {tab === 'bank' && <BankLedger bank={bank} reload={load} />}
      {tab === 'forwarder' && <Forwarder fwd={fwd} reload={load} />}
      {tab === 'invoices' && <Invoices />}
      {tab === 'pl' && <ProfitLoss />}
    </div>
  );
}

// All invoices — one row per order. Open/download the Tax Invoice PDF; see who's paid.
function Invoices() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [onlyUnpaid, setOnlyUnpaid] = useState(false);

  useEffect(() => {
    fetch('/api/admin/orders').then((r) => r.json())
      .then((d) => setRows(d.orders || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const money = (n) => '$' + Number(n || 0).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const invNo = (o) => /^INV/i.test(o.invoice_number || '') ? o.invoice_number : `INV${(o.order_number || o.invoice_number || '').replace(/^OC/i, '')}`;

  const filtered = rows.filter((o) => {
    if (onlyUnpaid && o.payment_status === 'paid') return false;
    if (q) {
      const hay = [o.invoice_number, o.order_number, o.customer_name, o.customer_company].join(' ').toLowerCase();
      if (!hay.includes(q.toLowerCase())) return false;
    }
    return true;
  });

  const totBilled = filtered.reduce((s, o) => s + (Number(o.total) || 0), 0);
  const totPaid = filtered.filter((o) => o.payment_status === 'paid').reduce((s, o) => s + (Number(o.total) || 0), 0);
  const totOwing = totBilled - totPaid;

  return (
    <div>
      {(() => { const card = (label, val, color) => (
        <div style={{ flex: '1 1 150px', minWidth: 150, background: '#FBFAF8', border: '1.5px solid #E0DDD7', borderRadius: 12, padding: '10px 14px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#000', marginBottom: 4 }}>{label}</div>
          <div style={{ fontSize: 18, fontWeight: 800, color }}>{val}</div>
        </div>
      ); return (
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
          {card('已开票总额 (inc GST)', money(totBilled), '#000')}
          {card('已收', money(totPaid), '#2D6A4F')}
          {card('未收', money(totOwing), totOwing > 0.01 ? '#991B1B' : '#2D6A4F')}
        </div>
      ); })()}

      <div style={{ display: 'flex', gap: 10, marginBottom: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="搜发票号 / 客户…" style={{ padding: '8px 12px', border: '1px solid #E0DDD7', borderRadius: 8, fontSize: 13, color: '#000', minWidth: 220 }} />
        <label style={{ fontSize: 13, color: '#000', display: 'flex', gap: 6, alignItems: 'center', cursor: 'pointer' }}>
          <input type="checkbox" checked={onlyUnpaid} onChange={(e) => setOnlyUnpaid(e.target.checked)} /> 只看未收
        </label>
      </div>

      {loading ? <div style={{ color: '#000' }}>Loading…</div> : filtered.length === 0 ? <div style={{ color: '#000' }}>没有发票。</div> : (
        <table className="srcx-table">
          <thead>
            <tr style={{ color: '#000' }}>
              <th>Inv #</th><th>Order #</th><th>客户</th><th>日期</th><th style={{ textAlign: 'right' }}>金额</th><th>状态</th><th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} style={{ color: '#000' }}>
                <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>{invNo(o)}</td>
                <td style={{ fontFamily: 'monospace' }}>{o.order_number || o.invoice_number}</td>
                <td>{o.customer_company || o.customer_name}</td>
                <td>{o.created_at ? new Date(o.created_at).toLocaleDateString('en-AU') : '—'}</td>
                <td style={{ textAlign: 'right', fontFamily: 'monospace' }}>{money(o.total)}</td>
                <td>
                  <span style={{ padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 700, background: o.payment_status === 'paid' ? '#D1FAE5' : (o.pay_on_account ? '#EAF3DE' : '#FEF3C7'), color: o.payment_status === 'paid' ? '#065F46' : (o.pay_on_account ? '#3B6D11' : '#92400E') }}>
                    {o.payment_status === 'paid' ? '已收 Paid' : (o.pay_on_account ? '月结 Account' : '未收 Unpaid')}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <a href={`/api/admin/orders/invoice-pdf?id=${o.id}`} target="_blank" rel="noreferrer" style={{ color: '#1B2A4A', fontWeight: 700, textDecoration: 'none' }}>📄 Tax Invoice</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function BalanceStrip({ summary }) {
  if (!summary) return null;
  const lines = Object.entries(summary.byLine || {});
  return (
    <div className="srcx-card" style={{ display: 'flex', gap: 28, flexWrap: 'wrap', alignItems: 'center' }}>
      <div>
        <div className="srcx-muted">银行余额</div>
        <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--navy)' }}>{aud(summary.balance)}</div>
      </div>
      <div>
        <div className="srcx-muted">GST 销项(收)</div>
        <div style={{ fontSize: 18, fontWeight: 700 }}>{aud(summary.gstCollected)}</div>
      </div>
      <div>
        <div className="srcx-muted">GST 进项(付)</div>
        <div style={{ fontSize: 18, fontWeight: 700 }}>{aud(summary.gstPaid)}</div>
      </div>
      <div>
        <div className="srcx-muted">本期 GST 净额(BAS)</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: summary.gstNet >= 0 ? 'var(--red)' : 'var(--green)' }}>{aud(summary.gstNet)}</div>
      </div>
      <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
        {lines.map(([k, v]) => (
          <div key={k} className="srcx-muted" style={{ fontSize: 12 }}>
            {LINE_LABEL[k] || k}: +{aud(v.in)} / −{aud(v.out)}
          </div>
        ))}
      </div>
    </div>
  );
}

const EMPTY_TXN = {
  txnDate: new Date().toISOString().slice(0, 10), direction: 'out', amountAud: '', gstAud: '',
  businessLine: 'sourcing', category: '', counterparty: '', description: '', reference: '',
};

function BankLedger({ bank, reload }) {
  const [form, setForm] = useState(EMPTY_TXN);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  // convenience: auto GST = amount/11 when GST-inclusive toggle on
  function autoGst() {
    const a = Number(form.amountAud);
    if (a) set('gstAud', r2(a / 11));
  }

  async function add() {
    if (!Number(form.amountAud)) { setErr('请输入金额'); return; }
    setSaving(true); setErr('');
    const res = await fetch('/api/admin/finance/bank', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
    });
    const d = await res.json();
    setSaving(false);
    if (!res.ok) { setErr(d.error || '保存失败'); return; }
    setForm({ ...EMPTY_TXN });
    reload();
  }

  async function del(id) {
    if (!confirm('删除这笔流水?')) return;
    await fetch(`/api/admin/finance/bank?id=${id}`, { method: 'DELETE' });
    reload();
  }

  const txns = bank?.transactions || [];

  return (
    <>
      <div className="srcx-card">
        <h2>记一笔银行流水</h2>
        {err && <div className="srcx-error">{err}</div>}
        <div className="srcx-grid srcx-grid-4">
          <div className="srcx-field"><label>日期</label><input type="date" value={form.txnDate} onChange={(e) => set('txnDate', e.target.value)} /></div>
          <div className="srcx-field"><label>方向</label>
            <select value={form.direction} onChange={(e) => set('direction', e.target.value)}>
              <option value="in">进账(收)</option><option value="out">出账(付)</option>
            </select>
          </div>
          <div className="srcx-field"><label>金额(含GST)</label><input type="number" value={form.amountAud} onChange={(e) => set('amountAud', e.target.value)} onBlur={autoGst} /></div>
          <div className="srcx-field"><label>其中 GST</label><input type="number" value={form.gstAud} onChange={(e) => set('gstAud', e.target.value)} /></div>
          <div className="srcx-field"><label>业务线</label>
            <select value={form.businessLine} onChange={(e) => set('businessLine', e.target.value)}>
              <option value="local_stock">本地备货</option><option value="sourcing">Sourcing</option><option value="overhead">日常/管理</option>
            </select>
          </div>
          <div className="srcx-field"><label>科目</label>
            <select value={form.category} onChange={(e) => set('category', e.target.value)}>
              <option value="">— 选择科目 —</option>
              {Object.entries(accountsBySection()).map(([sec, list]) => (
                <optgroup key={sec} label={SECTION_LABEL[sec]}>
                  {list.map((a) => <option key={a.code} value={a.code}>{a.label}</option>)}
                </optgroup>
              ))}
            </select>
          </div>
          <div className="srcx-field"><label>对方</label><input value={form.counterparty} onChange={(e) => set('counterparty', e.target.value)} /></div>
          <div className="srcx-field"><label>参考(OC/发票号)</label><input value={form.reference} onChange={(e) => set('reference', e.target.value)} /></div>
        </div>
        <div className="srcx-field" style={{ marginTop: 8 }}><label>说明</label><input value={form.description} onChange={(e) => set('description', e.target.value)} /></div>
        <div style={{ marginTop: 10 }}>
          <button className="srcx-btn srcx-btn-sm" disabled={saving} onClick={add}>{saving ? '保存中…' : '+ 添加流水'}</button>
          <span className="srcx-muted" style={{ marginLeft: 10 }}>含 GST 的本地交易,可点金额框外自动算出 1/11 的 GST。</span>
        </div>
      </div>

      <div className="srcx-card">
        <h2>银行流水</h2>
        {txns.length === 0 ? <div className="srcx-empty">还没有流水。先记一笔(比如期初余额:方向「进账」、类别 opening_balance)。</div> : (
          <table className="srcx-table">
            <thead><tr><th>日期</th><th>方向</th><th className="srcx-num">金额</th><th className="srcx-num">GST</th><th>业务线</th><th>类别</th><th>说明</th><th></th></tr></thead>
            <tbody>
              {txns.map((t) => (
                <tr key={t.id}>
                  <td className="srcx-num">{t.txn_date}</td>
                  <td>{t.direction === 'in' ? <span className="srcx-badge srcx-badge-green">进</span> : <span className="srcx-badge">出</span>}</td>
                  <td className="srcx-num">{t.direction === 'in' ? '+' : '−'}{aud(t.amount_aud).replace('$', '$')}</td>
                  <td className="srcx-num">{aud(t.gst_aud)}</td>
                  <td>{LINE_LABEL[t.business_line] || t.business_line}</td>
                  <td>{t.category || '—'}</td>
                  <td>{t.description || t.counterparty || '—'}{t.reference ? <span className="srcx-muted"> · {t.reference}</span> : null}</td>
                  <td style={{ textAlign: 'right' }}>{t.source !== 'system' && <button className="srcx-link srcx-link-danger" onClick={() => del(t.id)}>删除</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

const EMPTY_BILL = { forwarderName: '', invoiceNumber: '', invoiceDate: new Date().toISOString().slice(0, 10), amountRmb: '', sourcingOrderId: '', description: '' };

function Forwarder({ fwd, reload }) {
  const [bill, setBill] = useState(EMPTY_BILL);
  const [savingBill, setSavingBill] = useState(false);
  const [picked, setPicked] = useState({});      // billId -> true
  const [fx, setFx] = useState('');
  const [fee, setFee] = useState('');
  const [feeGst, setFeeGst] = useState('');
  const [payDate, setPayDate] = useState(new Date().toISOString().slice(0, 10));
  const [forwarderName, setForwarderName] = useState('');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const setB = (k, v) => setBill((f) => ({ ...f, [k]: v }));

  const unpaid = (fwd.bills || []).filter((b) => b.status === 'unpaid');

  async function addBill() {
    if (!Number(bill.amountRmb)) { setErr('请输入 RMB 金额'); return; }
    setSavingBill(true); setErr('');
    const res = await fetch('/api/admin/finance/forwarder', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'bill', ...bill }),
    });
    const d = await res.json();
    setSavingBill(false);
    if (!res.ok) { setErr(d.error || '保存失败'); return; }
    setBill({ ...EMPTY_BILL });
    reload();
  }

  // live allocation preview (mirrors the server math)
  const preview = useMemo(() => {
    const f = Number(fx) || 0;
    const sel = unpaid.filter((b) => picked[b.id]);
    let lines = sel.map((b) => ({ b, rmb: Number(b.amount_rmb) || 0, augd: r2((Number(b.amount_rmb) || 0) * f) }));
    const billsAud = r2(lines.reduce((s, l) => s + l.augd, 0));
    const feeN = Number(fee) || 0;
    let assigned = 0;
    lines = lines.map((l, i) => {
      let share;
      if (i === lines.length - 1) share = r2(feeN - assigned);
      else { share = billsAud > 0 ? r2(feeN * (l.augd / billsAud)) : 0; assigned = r2(assigned + share); }
      return { ...l, feeShare: share, total: r2(l.augd + share) };
    });
    return { lines, billsAud, fee: feeN, total: r2(billsAud + feeN) };
  }, [picked, fx, fee, unpaid]);

  async function recordPayment() {
    if (!Number(fx)) { setErr('请输入当天汇率'); return; }
    if (!preview.lines.length) { setErr('请勾选要付的账单'); return; }
    setSaving(true); setErr('');
    const res = await fetch('/api/admin/finance/forwarder', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'payment', paymentDate: payDate, forwarderName, fxRate: fx,
        handlingFeeAud: fee, handlingFeeGstAud: feeGst,
        allocations: preview.lines.map((l) => ({ billId: l.b.id })),
      }),
    });
    const d = await res.json();
    setSaving(false);
    if (!res.ok) { setErr(d.error || '保存失败'); return; }
    setPicked({}); setFx(''); setFee(''); setFeeGst('');
    reload();
  }

  return (
    <>
      <div className="srcx-card">
        <h2>① 录入货代账单(人民币,挂到订单)</h2>
        {err && <div className="srcx-error">{err}</div>}
        <div className="srcx-grid srcx-grid-4">
          <div className="srcx-field"><label>货代</label><input value={bill.forwarderName} onChange={(e) => setB('forwarderName', e.target.value)} /></div>
          <div className="srcx-field"><label>发票号</label><input value={bill.invoiceNumber} onChange={(e) => setB('invoiceNumber', e.target.value)} /></div>
          <div className="srcx-field"><label>发票日期</label><input type="date" value={bill.invoiceDate} onChange={(e) => setB('invoiceDate', e.target.value)} /></div>
          <div className="srcx-field"><label>金额(RMB)</label><input type="number" value={bill.amountRmb} onChange={(e) => setB('amountRmb', e.target.value)} /></div>
          <div className="srcx-field" style={{ gridColumn: 'span 2' }}><label>挂到订单(OC)</label>
            <select value={bill.sourcingOrderId} onChange={(e) => setB('sourcingOrderId', e.target.value)}>
              <option value="">— 选择订单 —</option>
              {(fwd.orders || []).map((o) => (
                <option key={o.id} value={o.id}>{o.order_number} · {o.product_name} ({o.quantity})</option>
              ))}
            </select>
          </div>
          <div className="srcx-field" style={{ gridColumn: 'span 2' }}><label>说明</label><input value={bill.description} onChange={(e) => setB('description', e.target.value)} /></div>
        </div>
        <div style={{ marginTop: 10 }}>
          <button className="srcx-btn srcx-btn-sm" disabled={savingBill} onClick={addBill}>{savingBill ? '保存中…' : '+ 添加账单'}</button>
        </div>
      </div>

      <div className="srcx-card">
        <h2>② 记一笔付款(一次付清多张)</h2>
        {unpaid.length === 0 ? <div className="srcx-empty">没有未付账单。先在上面录入。</div> : (
          <>
            <table className="srcx-table">
              <thead><tr><th></th><th>发票号</th><th>订单</th><th>货代</th><th className="srcx-num">RMB</th>
                <th className="srcx-num">→ AUD</th><th className="srcx-num">手续费分摊</th><th className="srcx-num">该单运费</th></tr></thead>
              <tbody>
                {unpaid.map((b) => {
                  const line = preview.lines.find((l) => l.b.id === b.id);
                  return (
                    <tr key={b.id} className={picked[b.id] ? 'srcx-best' : ''}>
                      <td><input type="checkbox" checked={!!picked[b.id]} onChange={(e) => setPicked((p) => ({ ...p, [b.id]: e.target.checked }))} /></td>
                      <td>{b.invoice_number || '—'}</td>
                      <td className="srcx-num">{b.order_number || '—'}</td>
                      <td>{b.forwarder_name || '—'}</td>
                      <td className="srcx-num">{rmb(b.amount_rmb)}</td>
                      <td className="srcx-num">{line ? aud(line.augd) : '—'}</td>
                      <td className="srcx-num">{line ? aud(line.feeShare) : '—'}</td>
                      <td className="srcx-num">{line ? <b>{aud(line.total)}</b> : '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="srcx-grid srcx-grid-4" style={{ marginTop: 12 }}>
              <div className="srcx-field"><label>付款日期</label><input type="date" value={payDate} onChange={(e) => setPayDate(e.target.value)} /></div>
              <div className="srcx-field"><label>当天汇率 RMB→AUD</label><input type="number" step="0.0001" value={fx} onChange={(e) => setFx(e.target.value)} placeholder="如 0.213" /></div>
              <div className="srcx-field"><label>手续费(AUD)</label><input type="number" value={fee} onChange={(e) => setFee(e.target.value)} /></div>
              <div className="srcx-field"><label>手续费 GST(如有)</label><input type="number" value={feeGst} onChange={(e) => setFeeGst(e.target.value)} /></div>
              <div className="srcx-field" style={{ gridColumn: 'span 2' }}><label>货代名</label><input value={forwarderName} onChange={(e) => setForwarderName(e.target.value)} /></div>
            </div>

            <div className="srcx-landed" style={{ marginTop: 12 }}>
              <div className="srcx-row" style={{ justifyContent: 'space-between' }}>
                <span>账单合计(AUD):<b>{aud(preview.billsAud)}</b></span>
                <span>+ 手续费:<b>{aud(preview.fee)}</b></span>
                <span style={{ fontSize: 16 }}>= 银行实付:<b style={{ color: 'var(--navy)' }}>{aud(preview.total)}</b></span>
              </div>
            </div>
            <div style={{ marginTop: 10 }}>
              <button className="srcx-btn" disabled={saving} onClick={recordPayment}>{saving ? '记账中…' : '✓ 确认付款并分摊到订单'}</button>
              <span className="srcx-muted" style={{ marginLeft: 10 }}>会自动生成一笔银行出账,并把每单的真实运费写回 Sourcing 订单对账。</span>
            </div>
          </>
        )}
      </div>

      {(fwd.payments || []).length > 0 && (
        <div className="srcx-card">
          <h2>历史付款</h2>
          <table className="srcx-table">
            <thead><tr><th>日期</th><th>货代</th><th className="srcx-num">汇率</th><th className="srcx-num">账单AUD</th><th className="srcx-num">手续费</th><th className="srcx-num">实付AUD</th><th>分摊订单</th></tr></thead>
            <tbody>
              {fwd.payments.map((p) => (
                <tr key={p.id}>
                  <td className="srcx-num">{p.payment_date}</td>
                  <td>{p.forwarder_name || '—'}</td>
                  <td className="srcx-num">{p.fx_rate}</td>
                  <td className="srcx-num">{aud(p.bills_aud)}</td>
                  <td className="srcx-num">{aud(p.handling_fee_aud)}</td>
                  <td className="srcx-num"><b>{aud(p.total_aud)}</b></td>
                  <td className="srcx-muted">{(p.forwarder_payment_allocations || []).map((a) => a.order_number).filter(Boolean).join(', ') || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

function thisQuarter() {
  const d = new Date();
  const m = d.getMonth();
  const qStartMonth = m - (m % 3);
  const from = new Date(d.getFullYear(), qStartMonth, 1);
  const to = new Date(d.getFullYear(), qStartMonth + 3, 0);
  return { from: from.toISOString().slice(0, 10), to: to.toISOString().slice(0, 10) };
}
function thisFY() {
  const d = new Date();
  const y = d.getMonth() >= 6 ? d.getFullYear() : d.getFullYear() - 1;
  return { from: `${y}-07-01`, to: `${y + 1}-06-30` };
}

function ProfitLoss() {
  const [range, setRange] = useState(thisFY());
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  async function load(r) {
    setLoading(true);
    const d = await fetch(`/api/admin/finance/pl?from=${r.from}&to=${r.to}`).then((x) => x.json());
    setData(d.error ? null : d);
    setLoading(false);
  }
  useEffect(() => { load(range); /* eslint-disable-next-line */ }, [range.from, range.to]);

  const t = data?.totals;
  const accs = data?.byAccount || {};
  const sec = (s) => Object.entries(accs).filter(([, a]) => a.section === s);

  const Row = ({ label, val, bold, indent }) => (
    <tr style={bold ? { fontWeight: 700 } : undefined}>
      <td style={{ paddingLeft: indent ? 24 : 10 }}>{label}</td>
      <td className="srcx-num">{aud(val)}</td>
    </tr>
  );

  return (
    <>
      <div className="srcx-card">
        <div className="srcx-row" style={{ justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0 }}>利润表 P&amp;L <span className="srcx-muted" style={{ fontWeight: 400 }}>(现金制 · 不含 GST)</span></h2>
          <div className="srcx-tag-row">
            <button className="srcx-btn srcx-btn-ghost srcx-btn-sm" onClick={() => setRange(thisQuarter())}>本季度</button>
            <button className="srcx-btn srcx-btn-ghost srcx-btn-sm" onClick={() => setRange(thisFY())}>本财年</button>
          </div>
        </div>
        <div className="srcx-row" style={{ marginTop: 10 }}>
          <div className="srcx-field"><label>从</label><input type="date" value={range.from} onChange={(e) => setRange((r) => ({ ...r, from: e.target.value }))} /></div>
          <div className="srcx-field"><label>到</label><input type="date" value={range.to} onChange={(e) => setRange((r) => ({ ...r, to: e.target.value }))} /></div>
        </div>
      </div>

      {loading || !t ? <div className="srcx-empty">{loading ? '计算中…' : '没有数据'}</div> : (
        <div className="srcx-card">
          <table className="srcx-table" style={{ maxWidth: 520 }}>
            <tbody>
              <tr><td colSpan={2} style={{ fontWeight: 700, color: 'var(--navy)' }}>收入 Revenue</td></tr>
              {sec('revenue').map(([c, a]) => <Row key={c} label={a.label} val={a.amount} indent />)}
              <Row label="收入合计" val={t.revenue} bold />

              <tr><td colSpan={2} style={{ fontWeight: 700, color: 'var(--navy)', paddingTop: 10 }}>销货成本 COGS</td></tr>
              {sec('cogs').map(([c, a]) => <Row key={c} label={a.label} val={a.amount} indent />)}
              <Row label="成本合计" val={t.cogs} bold />

              <tr style={{ background: '#f7f4ee' }}><td style={{ fontWeight: 800, color: 'var(--navy)' }}>毛利 Gross profit</td><td className="srcx-num" style={{ fontWeight: 800 }}>{aud(t.grossProfit)}</td></tr>

              <tr><td colSpan={2} style={{ fontWeight: 700, color: 'var(--navy)', paddingTop: 10 }}>管理 / 运营费用 Overhead</td></tr>
              {sec('overhead').map(([c, a]) => <Row key={c} label={a.label} val={a.amount} indent />)}
              <Row label="费用合计" val={t.overhead} bold />

              <tr style={{ background: t.netProfit >= 0 ? '#e9f5ee' : '#fbeaea' }}>
                <td style={{ fontWeight: 800, color: 'var(--navy)' }}>净利 Net profit</td>
                <td className="srcx-num" style={{ fontWeight: 800, color: t.netProfit >= 0 ? 'var(--green)' : 'var(--red)' }}>{aud(t.netProfit)}</td>
              </tr>
            </tbody>
          </table>

          {Array.isArray(data.lines) && data.lines.length > 0 && (
            <>
              <hr className="srcx-divider" />
              <div style={{ fontWeight: 700, color: 'var(--navy)', marginBottom: 8 }}>按业务线</div>
              <table className="srcx-table" style={{ maxWidth: 620 }}>
                <thead><tr><th>业务线</th><th className="srcx-num">收入</th><th className="srcx-num">成本</th><th className="srcx-num">毛利</th><th className="srcx-num">费用</th><th className="srcx-num">净利</th></tr></thead>
                <tbody>
                  {data.lines.map((l) => (
                    <tr key={l.line}>
                      <td>{LINE_LABEL[l.line] || l.line}</td>
                      <td className="srcx-num">{aud(l.revenue)}</td>
                      <td className="srcx-num">{aud(l.cogs)}</td>
                      <td className="srcx-num">{aud(l.gross)}</td>
                      <td className="srcx-num">{aud(l.overhead)}</td>
                      <td className="srcx-num"><b>{aud(l.net)}</b></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      )}
    </>
  );
}

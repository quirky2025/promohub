'use client';

import { useEffect, useState, useCallback } from 'react';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';
const RED = '#991B1B';
const GREEN = '#2D6A4F';

const CARRIERS = ['DHL (Hong Kong)', 'DHL (China Mainland)', 'Air Freight', 'Sea Freight', 'Express', '其他/手填'];
const rmb = (n) => n == null ? '—' : '¥' + Number(n).toLocaleString('en-AU', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
const aud = (n) => n == null ? '—' : 'A$' + Number(n).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const pct = (n) => n == null ? '—' : Number(n).toFixed(1) + '%';

const inp = { padding: '6px 8px', border: '1.5px solid #E0DDD7', borderRadius: 6, fontSize: 12, color: '#000', background: '#fff', boxSizing: 'border-box', width: '100%' };
const lbl = { fontSize: 10, fontWeight: 700, color: '#000', display: 'block', marginBottom: 2 };

const blank = (sku) => ({ sku, recordDate: new Date().toISOString().slice(0, 10), quantity: '', factoryCostRmb: '', cnLocalRmb: '', intlFreightRmb: '', carrier: 'DHL (Hong Kong)', fxRate: '4.5', marginPct: '35', quoteUnitAud: '', quoteManual: false, note: '' });

// Live preview of derived numbers (mirrors the server derive()).
function preview(f) {
  const qty = Number(f.quantity) || 0;
  const totalRmb = (Number(f.factoryCostRmb) || 0) * qty + (Number(f.cnLocalRmb) || 0) + (Number(f.intlFreightRmb) || 0);
  const fx = Number(f.fxRate) || 0;
  const totalAud = fx ? totalRmb / fx : null;
  const landedUnit = (totalAud != null && qty) ? totalAud / qty : null;
  let marginPct = f.marginPct === '' ? null : Number(f.marginPct);
  let quoteUnit = f.quoteUnitAud === '' ? null : Number(f.quoteUnitAud);
  if (f.quoteManual) { if (quoteUnit && landedUnit != null && quoteUnit > 0) marginPct = (1 - landedUnit / quoteUnit) * 100; }
  else { if (marginPct != null && landedUnit != null && marginPct < 100) quoteUnit = landedUnit / (1 - marginPct / 100); }
  return { totalAud, landedUnit, marginPct, quoteUnit };
}

export default function ProductCostRecords({ quoteId, sku }) {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    if (!quoteId) return;
    try {
      const res = await fetch(`/api/admin/sourcing/product-records?quoteId=${quoteId}`, { cache: 'no-store' });
      const d = await res.json();
      setRows(d.records || []);
    } catch { /* ignore */ }
  }, [quoteId]);

  useEffect(() => { if (open) load(); }, [open, load]);

  async function save() {
    setBusy(true);
    try {
      const res = await fetch('/api/admin/sourcing/product-records', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, quoteId, sku }),
      });
      const d = await res.json();
      if (!res.ok) { alert('保存失败: ' + (d.error || '')); setBusy(false); return; }
      setForm(null); load();
    } catch (e) { alert('保存失败: ' + e.message); }
    setBusy(false);
  }
  async function del(id) {
    if (!confirm('删除这条报价记录?')) return;
    await fetch(`/api/admin/sourcing/product-records?id=${id}`, { method: 'DELETE' });
    load();
  }

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const pv = form ? preview(form) : null;

  return (
    <div style={{ marginTop: 8, borderTop: '1px dashed #E0DDD7', paddingTop: 8 }}>
      <button onClick={() => setOpen((o) => !o)} style={{ background: 'none', border: 'none', color: NAVY, fontWeight: 700, fontSize: 12.5, cursor: 'pointer', padding: 0 }}>
        {open ? '▾' : '▸'} 报价记录 Cost / Quote history{rows.length ? ` (${rows.length})` : ''}
      </button>

      {open && (
        <div style={{ marginTop: 8 }}>
          {rows.length === 0 ? <div style={{ fontSize: 12, color: '#000', marginBottom: 8 }}>还没有报价记录。每算一次可以存一条。</div> : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11.5, color: '#000', minWidth: 720 }}>
                <thead>
                  <tr style={{ background: '#FBFAF8', textAlign: 'left' }}>
                    {['日期', '数量', '工厂EXW/个', '国内', '国际运费', 'Carrier', '总成本', '我的报价', '毛利', ''].map((h) => (
                      <th key={h} style={{ padding: '6px 8px', fontWeight: 700, whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} style={{ borderTop: '1px solid #F0EEED' }}>
                      <td style={{ padding: '6px 8px', whiteSpace: 'nowrap' }}>{r.record_date}</td>
                      <td style={{ padding: '6px 8px' }}>{r.quantity ?? '—'}</td>
                      <td style={{ padding: '6px 8px' }}>{rmb(r.factory_cost_rmb)}/个</td>
                      <td style={{ padding: '6px 8px' }}>{rmb(r.cn_local_rmb)}</td>
                      <td style={{ padding: '6px 8px' }}>{rmb(r.intl_freight_rmb)}</td>
                      <td style={{ padding: '6px 8px', whiteSpace: 'nowrap' }}>{r.carrier || '—'}</td>
                      <td style={{ padding: '6px 8px', fontWeight: 700 }}>{aud(r.total_cost_aud)}</td>
                      <td style={{ padding: '6px 8px', fontWeight: 800, color: GOLD }}>{aud(r.quote_unit_aud)}/个{r.quote_manual ? ' ✎' : ''}</td>
                      <td style={{ padding: '6px 8px', color: (r.margin_pct != null && r.margin_pct < 0) ? RED : GREEN, fontWeight: 700 }}>{pct(r.margin_pct)}</td>
                      <td style={{ padding: '6px 8px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <button onClick={() => setForm({ id: r.id, sku: r.sku, recordDate: r.record_date, quantity: r.quantity ?? '', factoryCostRmb: r.factory_cost_rmb ?? '', cnLocalRmb: r.cn_local_rmb ?? '', intlFreightRmb: r.intl_freight_rmb ?? '', carrier: r.carrier || 'DHL (Hong Kong)', fxRate: r.fx_rate ?? '4.5', marginPct: r.margin_pct ?? '', quoteUnitAud: r.quote_unit_aud ?? '', quoteManual: !!r.quote_manual, note: r.note || '' })} style={{ background: 'none', border: 'none', color: NAVY, fontWeight: 700, cursor: 'pointer', fontSize: 11.5 }}>编辑</button>
                        <button onClick={() => del(r.id)} style={{ background: 'none', border: 'none', color: RED, cursor: 'pointer', fontSize: 11.5, marginLeft: 6 }}>删除</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!form && <button onClick={() => setForm(blank(sku))} style={{ marginTop: 8, background: NAVY, color: '#fff', border: 'none', borderRadius: 7, padding: '6px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>＋ 新增报价记录</button>}

          {form && (
            <div style={{ marginTop: 10, background: '#FBFAF8', border: '1.5px solid #E0DDD7', borderRadius: 10, padding: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: 8 }}>
                <div><label style={lbl}>日期</label><input type="date" value={form.recordDate} onChange={(e) => set('recordDate', e.target.value)} style={inp} /></div>
                <div><label style={lbl}>数量</label><input type="number" value={form.quantity} onChange={(e) => set('quantity', e.target.value)} style={inp} /></div>
                <div><label style={lbl}>工厂 EXW 单价 ¥/个</label><input type="number" value={form.factoryCostRmb} onChange={(e) => set('factoryCostRmb', e.target.value)} placeholder="2.6" style={inp} /></div>
                <div><label style={lbl}>国内 ¥</label><input type="number" value={form.cnLocalRmb} onChange={(e) => set('cnLocalRmb', e.target.value)} style={inp} /></div>
                <div><label style={lbl}>国际运费 ¥</label><input type="number" value={form.intlFreightRmb} onChange={(e) => set('intlFreightRmb', e.target.value)} style={inp} /></div>
                <div><label style={lbl}>Carrier</label>
                  <select value={form.carrier} onChange={(e) => set('carrier', e.target.value)} style={inp}>
                    {CARRIERS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div><label style={lbl}>汇率 ¥/A$1</label><input type="number" value={form.fxRate} onChange={(e) => set('fxRate', e.target.value)} style={inp} /></div>
              </div>

              <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap', marginTop: 10, borderTop: '1px dashed #E0DDD7', paddingTop: 10 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#000', display: 'flex', gap: 5, alignItems: 'center', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.quoteManual} onChange={(e) => set('quoteManual', e.target.checked)} /> 报价手动填
                </label>
                {form.quoteManual ? (
                  <div><label style={lbl}>我的报价 A$/个(手填)</label><input type="number" value={form.quoteUnitAud} onChange={(e) => set('quoteUnitAud', e.target.value)} style={{ ...inp, width: 130 }} /></div>
                ) : (
                  <div><label style={lbl}>毛利 %</label><input type="number" value={form.marginPct} onChange={(e) => set('marginPct', e.target.value)} style={{ ...inp, width: 90 }} /></div>
                )}
                <div style={{ fontSize: 12, color: '#000' }}>
                  总成本 <strong>{aud(pv?.totalAud)}</strong> · 到岸/个 <strong>{aud(pv?.landedUnit)}</strong> · 报价 <strong style={{ color: GOLD }}>{aud(pv?.quoteUnit)}/个</strong> · 毛利 <strong>{pct(pv?.marginPct)}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <button onClick={save} disabled={busy} style={{ background: busy ? '#B0AAA3' : GREEN, color: '#fff', border: 'none', borderRadius: 7, padding: '7px 14px', fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}>{busy ? '保存中…' : '保存记录'}</button>
                <button onClick={() => setForm(null)} style={{ background: '#fff', color: NAVY, border: `1.5px solid ${NAVY}`, borderRadius: 7, padding: '7px 14px', fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}>取消</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

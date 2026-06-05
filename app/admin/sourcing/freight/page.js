// app/admin/sourcing/freight/page.js
'use client';

import { useEffect, useMemo, useState } from 'react';

const CHANNELS = [
  { key: 'express', label: 'Express 快递专线', hint: '最快,适合急单/小货' },
  { key: 'air', label: 'Air 空运', hint: '中速,中等重量' },
  { key: 'sea', label: 'Sea 海运', hint: '最便宜,大货走这个' },
];

const fmt = (v, d = 2) =>
  v == null || Number.isNaN(Number(v))
    ? '—'
    : Number(v).toLocaleString('en-AU', { minimumFractionDigits: d, maximumFractionDigits: d });

export default function FreightPage() {
  const [rates, setRates] = useState([]);
  const [current, setCurrent] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    channel: 'sea', forwarder: '', rate_per_kg: '', currency: 'RMB',
    min_charge_kg: '', transit_days: '', effective_date: new Date().toISOString().slice(0, 10),
    notes: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // 试算器
  const [calc, setCalc] = useState({ weight: '', fx: '' });

  async function load() {
    const res = await fetch('/api/admin/sourcing/freight');
    const data = await res.json();
    setRates(data.rates || []);
    setCurrent(data.current || {});
  }
  useEffect(() => { load(); }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function save() {
    setError('');
    if (!form.rate_per_kg) { setError('每kg单价必填'); return; }
    setSaving(true);
    const res = await fetch('/api/admin/sourcing/freight', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setError(data.error || '保存失败'); return; }
    setShowForm(false);
    setForm({ ...form, forwarder: '', rate_per_kg: '', min_charge_kg: '', transit_days: '', notes: '' });
    load();
  }

  async function remove(id) {
    if (!confirm('删除这条运价记录?')) return;
    await fetch(`/api/admin/sourcing/freight?id=${id}`, { method: 'DELETE' });
    load();
  }

  const historyByChannel = useMemo(() => {
    const map = { express: [], air: [], sea: [] };
    for (const r of rates) {
      if (current[r.channel]?.id !== r.id) map[r.channel]?.push(r);
    }
    return map;
  }, [rates, current]);

  // 试算:每kg运费换算 AUD
  function rateAud(r) {
    if (!r) return null;
    const v = Number(r.rate_per_kg);
    if (r.currency === 'AUD') return v;
    const fx = Number(calc.fx);
    return fx ? v * fx : null;
  }

  return (
    <div>
      <div className="srcx-row" style={{ justifyContent: 'space-between', marginBottom: 14 }}>
        <h1 className="srcx-h1" style={{ margin: 0 }}>国际运费价格</h1>
        <button className="srcx-btn srcx-btn-gold" onClick={() => setShowForm(!showForm)}>
          {showForm ? '收起' : '+ 更新运价'}
        </button>
      </div>
      <p className="srcx-muted" style={{ marginTop: -6 }}>
        运价更新 = 插入新记录,旧的自动变历史。录价页的"到岸价试算"取这里各渠道的最新一条。
      </p>

      {showForm && (
        <div className="srcx-card" style={{ borderColor: '#c9a45c' }}>
          <h2>录入新运价</h2>
          <div className="srcx-grid srcx-grid-3">
            <div className="srcx-field">
              <label>渠道 *</label>
              <select value={form.channel} onChange={set('channel')}>
                {CHANNELS.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
              </select>
            </div>
            <div className="srcx-field">
              <label>货代 / 线路名称</label>
              <input value={form.forwarder} onChange={set('forwarder')} placeholder="如:XX物流 墨尔本海派" />
            </div>
            <div className="srcx-field">
              <label>生效日期</label>
              <input type="date" value={form.effective_date} onChange={set('effective_date')} />
            </div>
          </div>
          <div className="srcx-grid srcx-grid-3" style={{ marginTop: 12 }}>
            <div className="srcx-field">
              <label>每kg单价 *</label>
              <input type="number" step="0.01" value={form.rate_per_kg} onChange={set('rate_per_kg')} />
            </div>
            <div className="srcx-field">
              <label>币种</label>
              <select value={form.currency} onChange={set('currency')}>
                <option value="RMB">RMB</option>
                <option value="AUD">AUD</option>
              </select>
            </div>
            <div className="srcx-field">
              <label>最低计费重 (kg)</label>
              <input type="number" step="0.1" value={form.min_charge_kg} onChange={set('min_charge_kg')} />
            </div>
          </div>
          <div className="srcx-grid srcx-grid-2" style={{ marginTop: 12 }}>
            <div className="srcx-field">
              <label>时效(天)</label>
              <input value={form.transit_days} onChange={set('transit_days')} placeholder="如:25-35" />
            </div>
            <div className="srcx-field">
              <label>备注</label>
              <input value={form.notes} onChange={set('notes')} placeholder="带电/敏感货加价之类" />
            </div>
          </div>
          {error && <p className="srcx-error">{error}</p>}
          <button className="srcx-btn" onClick={save} disabled={saving} style={{ marginTop: 14 }}>
            {saving ? '保存中…' : '保存运价'}
          </button>
        </div>
      )}

      {/* 三渠道当前价 */}
      <div className="srcx-grid srcx-grid-3">
        {CHANNELS.map((c) => {
          const r = current[c.key];
          return (
            <div key={c.key} className="srcx-card" style={{ marginBottom: 0 }}>
              <h2 style={{ marginBottom: 4 }}>{c.label}</h2>
              <p className="srcx-muted" style={{ margin: '0 0 10px' }}>{c.hint}</p>
              {r ? (
                <>
                  <div style={{ fontSize: 26, fontWeight: 700 }} className="srcx-num">
                    {r.currency === 'AUD' ? '$' : '¥'}{fmt(r.rate_per_kg)}
                    <span className="srcx-muted" style={{ fontSize: 13, fontWeight: 400 }}> /kg</span>
                  </div>
                  <p className="srcx-muted" style={{ margin: '6px 0 0' }}>
                    {r.forwarder || '未填货代'}
                    {r.transit_days && ` · ${r.transit_days} 天`}
                    {r.min_charge_kg != null && ` · 最低 ${r.min_charge_kg}kg`}
                  </p>
                  <p className="srcx-muted" style={{ margin: '2px 0 0' }}>
                    生效 {r.effective_date}
                  </p>
                  {historyByChannel[c.key]?.length > 0 && (
                    <details style={{ marginTop: 8 }}>
                      <summary className="srcx-link" style={{ cursor: 'pointer' }}>
                        历史({historyByChannel[c.key].length})
                      </summary>
                      {historyByChannel[c.key].map((h) => (
                        <div key={h.id} className="srcx-muted" style={{ marginTop: 6, fontSize: 13 }}>
                          {h.effective_date}:{h.currency === 'AUD' ? '$' : '¥'}{fmt(h.rate_per_kg)}/kg
                          {h.forwarder && `(${h.forwarder})`}{' '}
                          <button className="srcx-link srcx-link-danger" onClick={() => remove(h.id)}>删</button>
                        </div>
                      ))}
                    </details>
                  )}
                </>
              ) : (
                <p className="srcx-muted">还没录,点右上角「+ 更新运价」</p>
              )}
            </div>
          );
        })}
      </div>

      {/* 快速试算 */}
      <div className="srcx-card" style={{ marginTop: 18 }}>
        <h2>运费快速试算</h2>
        <div className="srcx-row">
          <div className="srcx-field" style={{ width: 180 }}>
            <label>货物总重 (kg)</label>
            <input type="number" step="0.1" value={calc.weight}
              onChange={(e) => setCalc({ ...calc, weight: e.target.value })} />
          </div>
          <div className="srcx-field" style={{ width: 180 }}>
            <label>汇率 RMB→AUD(运价为RMB时换算用)</label>
            <input type="number" step="0.0001" value={calc.fx} placeholder="如 0.2150"
              onChange={(e) => setCalc({ ...calc, fx: e.target.value })} />
          </div>
        </div>
        {Number(calc.weight) > 0 && (
          <table className="srcx-table" style={{ marginTop: 10, maxWidth: 560 }}>
            <thead>
              <tr><th>渠道</th><th>每kg (AUD)</th><th>运费总价 (AUD)</th><th>时效</th></tr>
            </thead>
            <tbody className="srcx-num">
              {CHANNELS.map((c) => {
                const r = current[c.key];
                const perKg = rateAud(r);
                const w = Math.max(Number(calc.weight), Number(r?.min_charge_kg) || 0);
                return (
                  <tr key={c.key}>
                    <td>{c.label}</td>
                    <td>{perKg != null ? `$${fmt(perKg)}` : '—'}</td>
                    <td><strong>{perKg != null ? `$${fmt(perKg * w)}` : '—'}</strong></td>
                    <td className="srcx-muted">{r?.transit_days ? `${r.transit_days} 天` : '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

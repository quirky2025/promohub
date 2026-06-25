// app/admin/sourcing/freight/page.js
// Freight rate engine: global FX + default margin, a live multi-option comparison
// calculator (Express auto-cheapest + Air + Sea), and the forwarder rate-sheet reference.
'use client';

import { useEffect, useMemo, useState } from 'react';

const fmt = (v, d = 2) =>
  v == null || Number.isNaN(Number(v)) ? '—'
    : Number(v).toLocaleString('en-AU', { minimumFractionDigits: d, maximumFractionDigits: d });

const GOODS = [
  { v: 'class1', l: '一类 (纺织/灯具/钳…) ¥1/kg' },
  { v: 'class2', l: '二类 (包/杯/鞋/玩具…) ¥2/kg' },
  { v: 'class3', l: '三类 (电器/蓝牙…) ¥3/kg' },
  { v: 'special', l: '特殊 (U盘/手表/PCB) ¥3/件' },
  { v: 'high_value', l: '高价值 (单询)' },
];
const CARRIER_LABEL = {
  dhl: '香港 DHL', ups: '香港 UPS', fedex: '内地 FedEx', air: '空派', sea: '海派',
};
const CH_LABEL = { express: 'Express 快递', air: 'Air 空派', sea: 'Sea 海派' };

export default function FreightEnginePage() {
  const [data, setData] = useState(null);
  const [settings, setSettings] = useState({ fx_rate_rmb_to_aud: '', default_margin: '', fx_rate_source: '' });
  const [savingS, setSavingS] = useState(false);
  const [calc, setCalc] = useState({
    actualKg: '', cartonL: '', cartonW: '', cartonH: '', cartonCount: '1',
    qty: '', goodsClass: 'class1', postcode: '', declaredValueAud: '', longestCm: '',
  });
  const [result, setResult] = useState(null);
  const [calcing, setCalcing] = useState(false);

  async function load() {
    const res = await fetch('/api/admin/sourcing/freight-engine');
    const d = await res.json();
    setData(d);
    if (d.settings) setSettings({
      fx_rate_rmb_to_aud: d.settings.fx_rate_rmb_to_aud ?? '',
      default_margin: d.settings.default_margin ?? '',
      fx_rate_source: d.settings.fx_rate_source ?? '',
    });
  }
  useEffect(() => { load(); }, []);

  async function saveSettings() {
    setSavingS(true);
    const res = await fetch('/api/admin/sourcing/freight-engine', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'settings', ...settings }),
    });
    setSavingS(false);
    if (res.ok) load();
    else alert('保存失败');
  }

  async function runCalc() {
    setCalcing(true); setResult(null);
    const input = {
      actualKg: Number(calc.actualKg) || 0,
      cartonL: Number(calc.cartonL) || 0, cartonW: Number(calc.cartonW) || 0, cartonH: Number(calc.cartonH) || 0,
      cartonCount: Number(calc.cartonCount) || 1,
      qty: Number(calc.qty) || 0, goodsClass: calc.goodsClass,
      postcode: Number(calc.postcode) || null,
      declaredValueAud: Number(calc.declaredValueAud) || 0,
      longestCm: Number(calc.longestCm) || 0, pieces: Number(calc.cartonCount) || 1,
    };
    const res = await fetch('/api/admin/sourcing/freight-engine', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'calc', input }),
    });
    const d = await res.json();
    setResult(d);
    setCalcing(false);
  }

  const [hist, setHist] = useState(null); // { rowId, list }
  async function saveRate(rowId, field, value) {
    const res = await fetch('/api/admin/sourcing/freight-engine', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rowId, field, value }),
    });
    if (res.ok) load(); else alert('改价失败');
  }
  async function showHistory(rowId) {
    const res = await fetch(`/api/admin/sourcing/freight-engine?history=${rowId}`);
    const d = await res.json();
    setHist({ rowId, list: d.history || [] });
  }

  const set = (k) => (e) => setCalc({ ...calc, [k]: e.target.value });
  const sheetsByChannel = useMemo(() => {
    const m = { express: [], air: [], sea: [] };
    for (const s of data?.sheets || []) m[s.channel]?.push(s);
    return m;
  }, [data]);
  const rowsOf = (sid) => (data?.rows || []).filter((r) => r.rate_sheet_id === sid);

  function rowDesc(r) {
    if (r.pricing_model === 'flat_per_kg') return `${fmt(r.weight_from, 0)}–${r.weight_to ? fmt(r.weight_to, 0) : '∞'}kg · ¥${fmt(r.kg_rate)}/kg`;
    if (r.pricing_model === 'lookup_total') return `≤${fmt(r.weight_to, 1)}kg · ¥${fmt(r.flat_price)}/票`;
    if (r.pricing_model === 'first_additional') return `0–${fmt(r.weight_to, 0)}kg · 首${fmt(r.first_weight_unit, 1)}¥${fmt(r.first_weight_price)} +续${fmt(r.additional_weight_unit, 1)}¥${fmt(r.additional_weight_price)}`;
    return '';
  }

  return (
    <div>
      <h1 className="srcx-h1" style={{ marginBottom: 4 }}>国际运费引擎</h1>
      <p className="srcx-muted" style={{ marginTop: 0 }}>
        全局汇率 + 实时比价(Express 自动选最便宜)+ 货代费率总览。费率来自 freight_engine seed,改价/版本在下一步加。
      </p>

      {/* GLOBAL SETTINGS */}
      <div className="srcx-card" style={{ borderColor: '#c9a45c' }}>
        <h2>全局设置(单一来源)</h2>
        <div className="srcx-grid srcx-grid-3">
          <div className="srcx-field">
            <label>汇率 RMB → AUD *</label>
            <input type="number" step="0.0001" value={settings.fx_rate_rmb_to_aud}
              onChange={(e) => setSettings({ ...settings, fx_rate_rmb_to_aud: e.target.value })} placeholder="如 0.2100" />
          </div>
          <div className="srcx-field">
            <label>目录默认 MARGIN(INDENT 上架用)</label>
            <input type="number" step="0.01" value={settings.default_margin}
              onChange={(e) => setSettings({ ...settings, default_margin: e.target.value })} placeholder="如 1.40" />
          </div>
          <div className="srcx-field">
            <label>汇率来源/备注</label>
            <input value={settings.fx_rate_source}
              onChange={(e) => setSettings({ ...settings, fx_rate_source: e.target.value })} placeholder="如 银行 2026-06-25" />
          </div>
        </div>
        <button className="srcx-btn srcx-btn-gold" onClick={saveSettings} disabled={savingS} style={{ marginTop: 12 }}>
          {savingS ? '保存中…' : '保存全局设置'}
        </button>
        {data?.settings?.fx_rate_updated_at && (
          <p className="srcx-muted" style={{ margin: '8px 0 0' }}>汇率更新于 {new Date(data.settings.fx_rate_updated_at).toLocaleString('en-AU')}</p>
        )}
      </div>

      {/* LIVE COMPARISON CALCULATOR */}
      <div className="srcx-card">
        <h2>运费比价计算器</h2>
        <p className="srcx-muted" style={{ marginTop: -4 }}>填箱规+重量,自动算计费重,列出各方式价格(Express 自动选最省),你挑。</p>
        <div className="srcx-grid srcx-grid-3">
          <div className="srcx-field"><label>实重 kg</label><input type="number" step="0.1" value={calc.actualKg} onChange={set('actualKg')} /></div>
          <div className="srcx-field"><label>数量(件)</label><input type="number" value={calc.qty} onChange={set('qty')} /></div>
          <div className="srcx-field"><label>目的邮编</label><input value={calc.postcode} onChange={set('postcode')} placeholder="如 2000" /></div>
        </div>
        <div className="srcx-grid srcx-grid-4" style={{ marginTop: 12 }}>
          <div className="srcx-field"><label>箱 长 cm</label><input type="number" step="0.1" value={calc.cartonL} onChange={set('cartonL')} /></div>
          <div className="srcx-field"><label>箱 宽 cm</label><input type="number" step="0.1" value={calc.cartonW} onChange={set('cartonW')} /></div>
          <div className="srcx-field"><label>箱 高 cm</label><input type="number" step="0.1" value={calc.cartonH} onChange={set('cartonH')} /></div>
          <div className="srcx-field"><label>箱数</label><input type="number" value={calc.cartonCount} onChange={set('cartonCount')} /></div>
        </div>
        <div className="srcx-grid srcx-grid-3" style={{ marginTop: 12 }}>
          <div className="srcx-field"><label>品类</label>
            <select value={calc.goodsClass} onChange={set('goodsClass')}>{GOODS.map((g) => <option key={g.v} value={g.v}>{g.l}</option>)}</select>
          </div>
          <div className="srcx-field"><label>申报货值 AUD(算关税用,可空)</label><input type="number" value={calc.declaredValueAud} onChange={set('declaredValueAud')} /></div>
          <div className="srcx-field"><label>单边最长 cm(算超长,可空)</label><input type="number" value={calc.longestCm} onChange={set('longestCm')} /></div>
        </div>
        <button className="srcx-btn" onClick={runCalc} disabled={calcing} style={{ marginTop: 14 }}>
          {calcing ? '计算中…' : '比价'}
        </button>

        {result?.blacklisted && (
          <p className="srcx-error" style={{ marginTop: 12 }}>邮编 {result.postcode} 在不可派送黑名单 —— 无服务/单询。</p>
        )}

        {result && !result.blacklisted && (
          <div style={{ marginTop: 16 }}>
            {/* by-channel summary cards */}
            <div className="srcx-grid srcx-grid-3">
              {['express', 'air', 'sea'].map((ch) => {
                const r = result.byChannel?.[ch];
                const isCheapest = result.cheapest && r && result.cheapest.carrier === r.carrier && result.cheapest.service === r.service && result.cheapest.channel === r.channel;
                return (
                  <div key={ch} className="srcx-card" style={{ margin: 0, borderColor: isCheapest ? '#0F6E56' : undefined, borderWidth: isCheapest ? 2 : 1 }}>
                    <h2 style={{ marginBottom: 2 }}>{CH_LABEL[ch]}{isCheapest && <span style={{ color: '#0F6E56', fontSize: 12, marginLeft: 6 }}>最省 ✓</span>}</h2>
                    {r ? (
                      <>
                        <div className="srcx-num" style={{ fontSize: 24, fontWeight: 700 }}>${fmt(r.freightAud)}</div>
                        <p className="srcx-muted" style={{ margin: '4px 0 0' }}>
                          {CARRIER_LABEL[r.carrier] || r.carrier}{r.service ? ` · ${String(r.service).toUpperCase()}` : ''} · 计费重 {fmt(r.chargeableKg, 1)}kg
                        </p>
                        <p className="srcx-muted" style={{ margin: '2px 0 0', fontSize: 12 }}>¥{fmt(r.totalRmb)} × {fmt(result.fx, 4)}{r.taxInclusive ? ' · 含税' : ' · 不含税'}</p>
                      </>
                    ) : <p className="srcx-muted">此方式不可用(超重量档/不接)</p>}
                  </div>
                );
              })}
            </div>

            {/* full sorted list */}
            <table className="srcx-table" style={{ marginTop: 14 }}>
              <thead><tr><th>方式 / 承运商</th><th>计费重</th><th>RMB</th><th>AUD</th><th>/件</th></tr></thead>
              <tbody className="srcx-num">
                {result.valid?.map((r, i) => (
                  <tr key={i} style={{ background: i === 0 ? '#E1F5EE' : undefined }}>
                    <td>{CH_LABEL[r.channel]} · {CARRIER_LABEL[r.carrier] || r.carrier}{r.service ? ` ${String(r.service).toUpperCase()}` : ''}{i === 0 ? '  ← 最省' : ''}</td>
                    <td>{fmt(r.chargeableKg, 1)}kg</td>
                    <td>¥{fmt(r.totalRmb)}</td>
                    <td><strong>${fmt(r.freightAud)}</strong></td>
                    <td>{Number(calc.qty) > 0 ? `$${fmt(r.freightAud / Number(calc.qty))}` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {result.invalid?.length > 0 && (
              <p className="srcx-muted" style={{ marginTop: 6, fontSize: 12 }}>
                跳过:{result.invalid.map((r) => `${CARRIER_LABEL[r.carrier] || r.carrier}(${r.reason})`).join('、')}
              </p>
            )}
          </div>
        )}
      </div>

      {/* RATE SHEET REFERENCE */}
      <div className="srcx-card">
        <h2>货代费率总览</h2>
        {['express', 'air', 'sea'].map((ch) => (
          <div key={ch} style={{ marginBottom: 14 }}>
            <h3 style={{ margin: '8px 0' }}>{CH_LABEL[ch]}</h3>
            {sheetsByChannel[ch].map((s) => (
              <details key={s.id} style={{ marginBottom: 6 }}>
                <summary className="srcx-link" style={{ cursor: 'pointer', fontWeight: 600 }}>
                  {s.name} {s.tax_inclusive ? '· 含税' : '· 不含税'} · v{s.version}
                </summary>
                <div style={{ paddingLeft: 14, marginTop: 6 }}>
                  {rowsOf(s.id).map((r) => (
                    <RateRow key={r.id} r={r} onSave={saveRate} onHistory={showHistory} />
                  ))}
                </div>
              </details>
            ))}
          </div>
        ))}
        <p className="srcx-muted" style={{ fontSize: 12 }}>
          品类附加费:一类¥1 / 二类¥2 / 三类¥3 /kg · 特殊¥3/件。超重/超长叠加。不含税渠道申报&gt;1000AUD加120AUD清关+15%关税。
        </p>
      </div>

      {hist && (
        <div onClick={() => setHist(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: '#fff', borderRadius: 12, padding: 20, maxWidth: 440, width: '90%', maxHeight: '70vh', overflowY: 'auto' }}>
            <h2 style={{ marginTop: 0 }}>改价历史</h2>
            {hist.list.length === 0 ? <p className="srcx-muted">这一档还没改过价。</p> : (
              <table className="srcx-table">
                <thead><tr><th>日期</th><th>字段</th><th>旧 → 新</th></tr></thead>
                <tbody className="srcx-num">{hist.list.map((h) => (
                  <tr key={h.id}><td>{new Date(h.changed_at).toLocaleDateString('en-AU')}</td><td>{h.field}</td><td>{fmt(h.old_value)} → <strong>{fmt(h.new_value)}</strong></td></tr>
                ))}</tbody>
              </table>
            )}
            <button className="srcx-btn" onClick={() => setHist(null)} style={{ marginTop: 12 }}>关闭</button>
          </div>
        </div>
      )}
    </div>
  );
}

function RateRow({ r, onSave, onHistory }) {
  const fmt2 = (v) => (v == null || v === '' ? '' : Number(v));
  const fields = r.pricing_model === 'flat_per_kg' ? [['kg_rate', '¥/kg']]
    : r.pricing_model === 'lookup_total' ? [['flat_price', '¥/票']]
    : [['first_weight_price', '首¥'], ['additional_weight_price', '续¥']];
  const band = r.pricing_model === 'first_additional'
    ? `0–${Number(r.weight_to)}kg`
    : r.pricing_model === 'lookup_total' ? `≤${Number(r.weight_to)}kg`
    : `${Number(r.weight_from)}–${r.weight_to ? Number(r.weight_to) : '∞'}kg`;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, fontSize: 13, flexWrap: 'wrap' }}>
      <span className="srcx-muted" style={{ minWidth: 150 }}>
        {r.destination_zone ? `${r.destination_zone} ` : ''}{r.postcode_from ? `[${r.postcode_from}-${r.postcode_to}] ` : ''}{band}
      </span>
      {fields.map(([f, label]) => (
        <EditPrice key={f} rowId={r.id} field={f} label={label} initial={fmt2(r[f])} onSave={onSave} />
      ))}
      <button className="srcx-link" onClick={() => onHistory(r.id)} style={{ fontSize: 12 }}>历史</button>
    </div>
  );
}

function EditPrice({ rowId, field, label, initial, onSave }) {
  const [v, setV] = useState(initial);
  const [saving, setSaving] = useState(false);
  const changed = String(v) !== String(initial);
  async function go() { setSaving(true); await onSave(rowId, field, v); setSaving(false); }
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <span className="srcx-muted" style={{ fontSize: 12 }}>{label}</span>
      <input value={v} onChange={(e) => setV(e.target.value)} type="number" step="0.01"
        style={{ width: 78, padding: '3px 6px', border: '1px solid #E0DDD7', borderRadius: 6, fontSize: 13 }} />
      {changed && <button className="srcx-btn srcx-btn-gold" onClick={go} disabled={saving} style={{ padding: '2px 8px', fontSize: 12 }}>{saving ? '…' : '存'}</button>}
    </span>
  );
}

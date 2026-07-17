// app/admin/sourcing/factories/[id]/page.js
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ColourSwatches from '@/components/ColourSwatches';
import { parseColours } from '@/lib/colourCards';

const PRINTING = ['丝印', 'UV打印', '激光雕刻', '热转印', '刺绣', '烫金', '数码印刷', '无印刷'];
const CHANNEL_LABEL = { express: 'Express 快递', air: 'Air 空运', sea: 'Sea 海运' };

const fmt = (v, d = 4) =>
  v == null || v === '' || Number.isNaN(Number(v))
    ? '—'
    : Number(v).toLocaleString('en-AU', { minimumFractionDigits: d, maximumFractionDigits: d });

export default function FactoryDetailPage() {
  const { id } = useParams();
  const [factory, setFactory] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const [names, setNames] = useState([]);
  const [freight, setFreight] = useState({});
  const [globalFx, setGlobalFx] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editQuote, setEditQuote] = useState(null);
  const [quoteProduct, setQuoteProduct] = useState(null);

  async function load() {
    const [fRes, qRes, nRes, frRes, feRes] = await Promise.all([
      fetch(`/api/admin/sourcing/factories?id=${id}`),
      fetch(`/api/admin/sourcing/quotes?factory_id=${id}`),
      fetch(`/api/admin/sourcing/quotes?names=1`),
      fetch(`/api/admin/sourcing/freight`),
      fetch(`/api/admin/sourcing/freight-engine`),
    ]);
    setFactory((await fRes.json()).factory || null);
    setQuotes((await qRes.json()).quotes || []);
    setNames((await nRes.json()).names || []);
    setFreight((await frRes.json()).current || {});
    const fe = await feRes.json().catch(() => ({}));
    setGlobalFx(fe?.settings?.fx_rate_rmb_to_aud ?? '');
  }
  useEffect(() => { load(); }, [id]);

  async function removeQuote(qid) {
    if (!confirm('删除这条报价记录?')) return;
    await fetch(`/api/admin/sourcing/quotes?id=${qid}`, { method: 'DELETE' });
    load();
  }

  // 按产品分组
  const grouped = useMemo(() => {
    const map = new Map();
    for (const q of quotes) {
      if (!map.has(q.product_name)) map.set(q.product_name, []);
      map.get(q.product_name).push(q);
    }
    return [...map.entries()];
  }, [quotes]);

  if (!factory) return <p className="srcx-muted">加载中…</p>;

  return (
    <div>
      <p style={{ marginTop: 0 }}>
        <Link href="/admin/sourcing/factories" className="srcx-link">← 返回工厂列表</Link>
      </p>

      <div className="srcx-card">
        <div className="srcx-row" style={{ justifyContent: 'space-between' }}>
          <div>
            <h1 className="srcx-h1" style={{ marginBottom: 6 }}>{factory.name}</h1>
            <p className="srcx-muted" style={{ margin: 0 }}>
              {factory.contact_person || '联系人未填'}
              {factory.wechat && ` · 微信 ${factory.wechat}`}
              {factory.phone && ` · ${factory.phone}`}
              {factory.email && ` · ${factory.email}`}
            </p>
            {factory.main_categories && (
              <div className="srcx-tag-row" style={{ marginTop: 8 }}>
                {factory.main_categories.split(/[,、,]/).filter(Boolean).map((c, i) => (
                  <span key={i} className="srcx-badge">{c.trim()}</span>
                ))}
              </div>
            )}
            {factory.notes && <p className="srcx-muted" style={{ marginBottom: 0 }}>备注:{factory.notes}</p>}
          </div>
          <button className="srcx-btn srcx-btn-gold" onClick={() => { setEditQuote(null); setShowForm(!showForm); }}>
            {showForm && !editQuote ? '收起表单' : '+ 录入产品 / 报价'}
          </button>
        </div>
      </div>

      {showForm && (
        <QuoteForm
          key={editQuote?.id || 'new'}
          factoryId={id}
          names={names}
          freight={freight}
          globalFx={globalFx}
          editQuote={editQuote}
          onSaved={() => { setShowForm(false); setEditQuote(null); load(); }}
        />
      )}

      <h2 className="srcx-h1" style={{ fontSize: 19 }}>产品列表({grouped.length} 个产品)</h2>

      {!grouped.length && (
        <div className="srcx-empty">这家工厂还没有产品,点上方「+ 录入产品/报价」</div>
      )}

      {grouped.map(([product, list]) => (
        <div key={product} className="srcx-card">
          <div className="srcx-row" style={{ justifyContent: 'space-between', marginBottom: 8, alignItems: 'flex-start' }}>
            <div className="srcx-row" style={{ gap: 12, alignItems: 'flex-start' }}>
              {list[0].image_url ? (
                <img src={list[0].image_url} alt="" style={{ width: 54, height: 54, objectFit: 'cover', borderRadius: 8, border: '1px solid #e5e0d5' }} />
              ) : (
                <div style={{ width: 54, height: 54, borderRadius: 8, background: '#f4f0e8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontSize: 11 }}>无图</div>
              )}
              <div>
                <h2 style={{ margin: 0 }}>{product}</h2>
                <div style={{ fontSize: 12, color: '#000', marginTop: 2 }}>
                  {list[0].sku && <span style={{ fontFamily: 'monospace', color: '#1b2a4a', fontWeight: 700 }}>{list[0].sku}</span>}
                  {list[0].status && list[0].status !== 'active' && <span> · {list[0].status}</span>}
                  <span> · 报过 {list.length} 次</span>
                </div>
              </div>
            </div>
            <span style={{ display: 'inline-flex', gap: 14, alignItems: 'center', flexShrink: 0 }}>
              <button className="srcx-link" onClick={() => setQuoteProduct(list[0])}>报价给客户 →</button>
              {list.length > 1 && (
                <Link
                  className="srcx-link"
                  href={`/admin/sourcing/trends?factory=${id}&product=${encodeURIComponent(product)}`}
                >
                  看价格趋势 →
                </Link>
              )}
            </span>
          </div>

          {list.map((q) => (
            <div key={q.id} style={{ borderTop: '1px solid #f1ede5', paddingTop: 10, marginTop: 10 }}>
              <div className="srcx-row" style={{ justifyContent: 'space-between' }}>
                <span>
                  <strong>{q.quote_date}</strong>
                  {q.product_spec && <span className="srcx-muted"> · {q.product_spec}</span>}
                  {q.printing_method && <span className="srcx-muted"> · {q.printing_method}</span>}
                  {q.lead_time_days != null && <span className="srcx-muted"> · 交期 {q.lead_time_days} 天</span>}
                  <span className="srcx-muted"> · 汇率 {q.exchange_rate}</span>
                  {q.est_unit_weight_g != null && <span className="srcx-muted"> · 约 {q.est_unit_weight_g}g/个</span>}
                  {q.domestic_freight_rmb != null && <span className="srcx-muted"> · 国内运费 ¥{q.domestic_freight_rmb}</span>}
                </span>
                <span style={{ display: 'inline-flex', gap: 12 }}>
                  <button className="srcx-link" onClick={() => { setEditQuote(q); setShowForm(true); if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' }); }}>编辑</button>
                  <button className="srcx-link srcx-link-danger" onClick={() => removeQuote(q.id)}>删除</button>
                </span>
              </div>
              <table className="srcx-table" style={{ marginTop: 6 }}>
                <thead>
                  <tr>
                    <th>数量</th>
                    <th>EXW (RMB)</th>
                    <th>折算 (AUD)</th>
                    <th>对客报价 (AUD)</th>
                  </tr>
                </thead>
                <tbody className="srcx-num">
                  {(q.quote_tiers || []).map((t) => (
                    <tr key={t.id}>
                      <td>{Number(t.quantity).toLocaleString()}</td>
                      <td>¥{fmt(t.exw_unit_price_rmb)}</td>
                      <td className="srcx-muted">${fmt(Number(t.exw_unit_price_rmb) * Number(q.exchange_rate))}</td>
                      <td><strong>{t.customer_unit_price_aud != null ? `$${fmt(t.customer_unit_price_aud)}` : '—'}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {q.available_colours && (
                <div style={{ marginTop: 8 }}>
                  <span className="srcx-muted" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                    可选颜色({parseColours(q.available_colours).length}):
                  </span>
                  <ColourSwatches codes={q.available_colours} showCode />
                </div>
              )}
              {q.notes && <p className="srcx-muted" style={{ margin: '6px 0 0' }}>备注:{q.notes}</p>}
            </div>
          ))}
        </div>
      ))}

      {quoteProduct && (
        <IndentQuoteModal product={quoteProduct} onClose={() => setQuoteProduct(null)} />
      )}
    </div>
  );
}

/* ---------------- 录价表单(含三渠道到岸价试算) ---------------- */

function QuoteForm({ factoryId, names, freight, globalFx, editQuote, onSaved }) {
  const today = new Date().toISOString().slice(0, 10);
  const q = editQuote;
  const s = (v) => (v == null ? '' : String(v));
  const [head, setHead] = useState({
    quote_date: q?.quote_date || today,
    product_code: q?.product_code || '', product_name: q?.product_name || '', product_spec: q?.product_spec || '',
    printing_method: q?.printing_method || '', lead_time_days: s(q?.lead_time_days),
    exchange_rate: q?.exchange_rate != null ? String(q.exchange_rate) : (globalFx ? String(globalFx) : ''),
    est_unit_weight_g: s(q?.est_unit_weight_g), domestic_freight_rmb: s(q?.domestic_freight_rmb), notes: q?.notes || '',
    units_per_carton: s(q?.units_per_carton), carton_length_cm: s(q?.carton_length_cm), carton_width_cm: s(q?.carton_width_cm), carton_height_cm: s(q?.carton_height_cm),
    available_colours: q?.available_colours || '', image_url: q?.image_url || '', status: q?.status || 'active',
    setup_cost_rmb: s(q?.setup_cost_rmb), tooling_cost_rmb: s(q?.tooling_cost_rmb), sample_cost_rmb: s(q?.sample_cost_rmb),
    material: q?.material || '', product_size: q?.product_size || '', craft: q?.craft || '', packaging: q?.packaging || '',
  });
  const [tiers, setTiers] = useState(
    q?.quote_tiers?.length
      ? q.quote_tiers.map((t) => ({ quantity: s(t.quantity), rmb: s(t.exw_unit_price_rmb), aud: t.customer_unit_price_aud != null ? String(t.customer_unit_price_aud) : '' }))
      : [{ quantity: '', rmb: '', aud: '' }]
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (k) => (e) => setHead({ ...head, [k]: e.target.value });
  const setTier = (i, k, v) =>
    setTiers((rows) => rows.map((r, idx) => (idx === i ? { ...r, [k]: v } : r)));

  const fx = Number(head.exchange_rate) || 0;
  const weightKg = (Number(head.est_unit_weight_g) || 0) / 1000;

  // 渠道每kg运价 → AUD(运价是RMB就乘汇率)
  function channelRateAud(ch) {
    const r = freight[ch];
    if (!r) return null;
    const rate = Number(r.rate_per_kg);
    return r.currency === 'AUD' ? rate : fx ? rate * fx : null;
  }

  // 到岸成本/个 = EXW×汇率 + (国内运费÷数量)×汇率 + 单件重×国际运价
  function landed(rmb, qty, ch) {
    const rate = channelRateAud(ch);
    if (!fx || !weightKg || rate == null || !rmb) return null;
    const domesticPerUnit =
      Number(head.domestic_freight_rmb) && Number(qty)
        ? (Number(head.domestic_freight_rmb) / Number(qty)) * fx
        : 0;
    return Number(rmb) * fx + domesticPerUnit + weightKg * rate;
  }

  async function save() {
    setError('');
    setSaving(true);
    const res = await fetch('/api/admin/sourcing/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        factory_id: factoryId,
        id: editQuote?.id,
        ...head,
        tiers: tiers.map((t) => ({
          quantity: t.quantity,
          exw_unit_price_rmb: t.rmb,
          customer_unit_price_aud: t.aud,
        })),
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setError(data.error || '保存失败'); return; }
    onSaved();
  }

  const hasFreight = ['express', 'air', 'sea'].some((c) => freight[c]);

  return (
    <div className="srcx-card" style={{ borderColor: '#c9a45c' }}>
      <h2>{q ? `编辑产品:${q.sku || q.product_name}` : '录入产品 / 报价'}</h2>
      <p style={{ margin: '0 0 12px', fontSize: 13, color: '#000' }}>{q ? '改产品详情 / 价格,保存后 SKU 不变。' : '一步建好产品 + 价格。第一次填 = 新建产品(自动出 SKU);同一产品名再填 = 加一条新价格(历史)。'}</p>
      <div className="srcx-grid srcx-grid-4">
        <div className="srcx-field">
          <label>报价日期 *</label>
          <input type="date" value={head.quote_date} onChange={set('quote_date')} />
        </div>
        <div className="srcx-field">
          <label>产品编号</label>
          <input value={head.product_code} onChange={set('product_code')} placeholder="如 JH21001" />
        </div>
        <div className="srcx-field">
          <label>产品名称 *(输入时会提示已有名字,尽量复用)</label>
          <input list="srcx-product-names" value={head.product_name}
            onChange={set('product_name')} placeholder="如:Linen Notebook A5" />
          <datalist id="srcx-product-names">
            {names.map((n) => <option key={n} value={n} />)}
          </datalist>
        </div>
        <div className="srcx-field">
          <label>型号 / 规格</label>
          <input value={head.product_spec} onChange={set('product_spec')} placeholder="如:A5 96页 亚麻封面" />
        </div>
      </div>
      <div className="srcx-grid srcx-grid-4" style={{ marginTop: 12 }}>
        <div className="srcx-field">
          <label>材质 Material</label>
          <input value={head.material} onChange={set('material')} placeholder="如 PU皮 / 304不锈钢" />
        </div>
        <div className="srcx-field">
          <label>产品尺寸 Size(产品本身)</label>
          <input value={head.product_size} onChange={set('product_size')} placeholder="如 9 × 6 cm" />
        </div>
        <div className="srcx-field">
          <label>工艺 Craft</label>
          <input value={head.craft} onChange={set('craft')} placeholder="如 烫金 / 压纹 / 激光" />
        </div>
        <div className="srcx-field">
          <label>包装 Packaging</label>
          <input value={head.packaging} onChange={set('packaging')} placeholder="如 OPP袋 / 礼盒" />
        </div>
      </div>
      <div className="srcx-grid srcx-grid-3" style={{ marginTop: 12 }}>
        <div className="srcx-field">
          <label>印刷方式</label>
          <select value={head.printing_method} onChange={set('printing_method')}>
            <option value="">—</option>
            {PRINTING.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div className="srcx-field">
          <label>生产交期(天)</label>
          <input type="number" value={head.lead_time_days} onChange={set('lead_time_days')} />
        </div>
        <div className="srcx-field">
          <label>汇率 RMB→AUD *(自动带全局汇率,可改)</label>
          <input type="number" step="0.0001" value={head.exchange_rate}
            onChange={set('exchange_rate')} placeholder="如 0.21(在「运费价格」页设全局)" />
        </div>
      </div>
      <div className="srcx-grid srcx-grid-4" style={{ marginTop: 12 }}>
        <div className="srcx-field">
          <label>预估单件毛重(克)— 用于算国际运费</label>
          <input type="number" step="0.1" value={head.est_unit_weight_g}
            onChange={set('est_unit_weight_g')} placeholder="问厂时顺口问一句" />
        </div>
        <div className="srcx-field">
          <label>预估国内运费(RMB,这票总价)</label>
          <input type="number" step="0.01" value={head.domestic_freight_rmb}
            onChange={set('domestic_freight_rmb')} placeholder="工厂→货代仓,如 200" />
        </div>
        <div className="srcx-field">
          <label>可选颜色 Available colours</label>
          <input value={head.available_colours} onChange={set('available_colours')} placeholder="如 Navy, Black, Grey" />
        </div>
        <div className="srcx-field">
          <label>备注</label>
          <input value={head.notes} onChange={set('notes')} />
        </div>
      </div>

      <div className="srcx-grid srcx-grid-4" style={{ marginTop: 12 }}>
        <div className="srcx-field">
          <label>箱长 cm</label>
          <input type="number" step="0.1" value={head.carton_length_cm} onChange={set('carton_length_cm')} placeholder="如 40" />
        </div>
        <div className="srcx-field">
          <label>箱宽 cm</label>
          <input type="number" step="0.1" value={head.carton_width_cm} onChange={set('carton_width_cm')} placeholder="如 30" />
        </div>
        <div className="srcx-field">
          <label>箱高 cm</label>
          <input type="number" step="0.1" value={head.carton_height_cm} onChange={set('carton_height_cm')} placeholder="如 25" />
        </div>
        <div className="srcx-field">
          <label>每箱数量 *(算箱数/体积重)</label>
          <input type="number" value={head.units_per_carton} onChange={set('units_per_carton')} placeholder="如 60" />
        </div>
      </div>

      <div className="srcx-grid srcx-grid-4" style={{ marginTop: 12 }}>
        <div className="srcx-field">
          <label>产品图片 URL</label>
          <input value={head.image_url} onChange={set('image_url')} placeholder="图片链接(可后补)" />
        </div>
        <div className="srcx-field">
          <label>开模费 Tooling (RMB)</label>
          <input type="number" step="0.01" value={head.tooling_cost_rmb} onChange={set('tooling_cost_rmb')} />
        </div>
        <div className="srcx-field">
          <label>版费 Setup (RMB)</label>
          <input type="number" step="0.01" value={head.setup_cost_rmb} onChange={set('setup_cost_rmb')} />
        </div>
        <div className="srcx-field">
          <label>样品费 Sample (RMB)</label>
          <input type="number" step="0.01" value={head.sample_cost_rmb} onChange={set('sample_cost_rmb')} />
        </div>
      </div>

      <hr className="srcx-divider" />
      <div className="srcx-row" style={{ justifyContent: 'space-between' }}>
        <strong>数量阶梯 *(500 / 1000 / 5000 各一行)</strong>
        <button className="srcx-btn srcx-btn-ghost srcx-btn-sm"
          onClick={() => setTiers((r) => [...r, { quantity: '', rmb: '', aud: '' }])}>
          + 加一档
        </button>
      </div>
      <table className="srcx-table" style={{ marginTop: 8 }}>
        <thead>
          <tr>
            <th>数量</th>
            <th>EXW 单价 (RMB)</th>
            <th>货款折算 (AUD)</th>
            {hasFreight && <th>到岸/个 Express</th>}
            {hasFreight && <th>到岸/个 Air</th>}
            {hasFreight && <th>到岸/个 Sea</th>}
            <th>对客报价 (AUD)</th>
            <th></th>
          </tr>
        </thead>
        <tbody className="srcx-num">
          {tiers.map((t, i) => (
            <tr key={i}>
              <td style={{ minWidth: 90 }}>
                <input style={inp} type="number" value={t.quantity} placeholder="500"
                  onChange={(e) => setTier(i, 'quantity', e.target.value)} />
              </td>
              <td style={{ minWidth: 100 }}>
                <input style={inp} type="number" step="0.0001" value={t.rmb} placeholder="3.20"
                  onChange={(e) => setTier(i, 'rmb', e.target.value)} />
              </td>
              <td className="srcx-muted">{t.rmb && fx ? `$${fmt(Number(t.rmb) * fx)}` : '—'}</td>
              {hasFreight && ['express', 'air', 'sea'].map((ch) => (
                <td key={ch} className="srcx-muted">
                  {landed(t.rmb, t.quantity, ch) != null ? `$${fmt(landed(t.rmb, t.quantity, ch))}` : '—'}
                </td>
              ))}
              <td style={{ minWidth: 100 }}>
                <input style={inp} type="number" step="0.0001" value={t.aud} placeholder="可后补"
                  onChange={(e) => setTier(i, 'aud', e.target.value)} />
              </td>
              <td>
                {tiers.length > 1 && (
                  <button className="srcx-link srcx-link-danger"
                    onClick={() => setTiers((r) => r.filter((_, idx) => idx !== i))}>✕</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="srcx-muted" style={{ marginTop: 6 }}>
        到岸/个 = EXW×汇率 + 国内运费÷该档数量×汇率 + 单件毛重×当前国际运价(取「运费价格」页各渠道最新一条
        {!hasFreight && ';你还没录运价,先去「运费价格」页录三条,这里就会自动出现试算'}
        )。数量越大,国内运费摊得越薄。给客户报价 = 到岸成本 ÷ (1 − 目标毛利率)。
      </p>

      {error && <p className="srcx-error">{error}</p>}
      <button className="srcx-btn" onClick={save} disabled={saving} style={{ marginTop: 8 }}>
        {saving ? '保存中…' : q ? '保存修改' : '保存产品 / 报价'}
      </button>
    </div>
  );
}

const inp = {
  width: '100%', boxSizing: 'border-box', border: '1px solid #d8d2c6',
  borderRadius: 6, padding: '6px 8px', fontSize: 14,
};

/* ---------------- 报价给客户 (INDENT) → 主报价板 ---------------- */

const qmOverlay = { position: 'fixed', inset: 0, background: 'rgba(27,42,74,0.5)', zIndex: 1000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: 24, overflowY: 'auto' };
const qmModal = { background: '#fff', borderRadius: 12, padding: 24, width: '100%', maxWidth: 560, marginTop: 40, boxShadow: '0 20px 60px rgba(0,0,0,0.25)' };
const qmDrop = { position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #d8d2c6', borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 5, maxHeight: 200, overflowY: 'auto' };
const qmItem = { padding: '8px 10px', cursor: 'pointer', fontSize: 13, borderBottom: '1px solid #f1ede5' };

function IndentQuoteModal({ product, onClose }) {
  const tiers = [...(product.quote_tiers || [])].sort((a, b) => Number(a.quantity) - Number(b.quantity));
  const first = tiers[0] || {};
  const [qty, setQty] = useState(first.quantity != null ? String(first.quantity) : '');
  const [unit, setUnit] = useState(first.customer_unit_price_aud != null ? String(first.customer_unit_price_aud) : '');
  const [cust, setCust] = useState(null);
  const [custQ, setCustQ] = useState('');
  const [results, setResults] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(null);

  function applyTierFor(qv) {
    const n = Number(qv) || 0;
    let best = null;
    tiers.forEach((t) => { if (n >= Number(t.quantity)) best = t; });
    if (best?.customer_unit_price_aud != null) setUnit(String(best.customer_unit_price_aud));
  }
  async function searchCust(v) {
    setCustQ(v); setCust(null);
    if (v.trim().length < 2) { setResults([]); return; }
    try {
      const r = await fetch(`/api/admin/quote-builder?customer=${encodeURIComponent(v.trim())}`);
      const d = await r.json();
      setResults(d.customers || []);
    } catch { setResults([]); }
  }
  const qn = Number(qty) || 0, un = Number(unit) || 0;
  const subtotal = Math.round(qn * un * 100) / 100;
  const gst = Math.round(subtotal * 0.10 * 100) / 100;
  const total = Math.round((subtotal + gst) * 100) / 100;

  async function create() {
    setError('');
    if (!cust) { setError('先选一个客户'); return; }
    if (!qn || !un) { setError('填数量和单价'); return; }
    setSaving(true);
    try {
      const res = await fetch('/api/admin/quotes', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quote_type: 'indent', sourcing_product_id: product.id,
          product_name: product.product_name, product_sku: product.sku || '',
          company_id: cust.company_id, customer_name: cust.name, customer_email: cust.email,
          customer_phone: cust.phone, customer_company: cust.company,
          delivery_address: cust.delivery || '', quantity: qn, unit_price: un,
          subtotal, gst, total, shipping: 0, status: 'new',
        }),
      });
      const d = await res.json();
      setSaving(false);
      if (!res.ok) { setError(d.error || '生成失败'); return; }
      setDone(d.quote);
    } catch { setSaving(false); setError('生成失败'); }
  }

  return (
    <div style={qmOverlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={qmModal}>
        <h2 style={{ margin: '0 0 4px' }}>报价给客户 (INDENT)</h2>
        <p style={{ margin: '0 0 14px', color: '#000', fontSize: 13 }}>{product.sku} · {product.product_name}</p>
        {done ? (
          <div>
            <p style={{ color: '#1a7f37', fontWeight: 700 }}>✓ 报价 {done.quote_number} 已生成 → 主板 Enquiries &amp; Quotes(标 INDENT)</p>
            <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
              <a className="srcx-btn" href="/admin/quotes">去主报价板 →</a>
              <button className="srcx-btn srcx-btn-ghost" onClick={onClose}>关闭</button>
            </div>
          </div>
        ) : (
          <>
            <div className="srcx-field" style={{ position: 'relative' }}>
              <label>客户(搜公司 / 联系人 / 邮箱)</label>
              <input value={cust ? (cust.company || cust.name) : custQ} onChange={(e) => searchCust(e.target.value)} placeholder="输入客户名…" />
              {!cust && results.length > 0 && (
                <div style={qmDrop}>
                  {results.map((c, i) => (
                    <div key={i} style={qmItem} onClick={() => { setCust(c); setResults([]); }}>
                      <strong>{c.company || c.name}</strong>{c.name && c.company ? ` · ${c.name}` : ''}{c.email ? ` · ${c.email}` : ''}
                    </div>
                  ))}
                </div>
              )}
              {cust && <div style={{ fontSize: 12, color: '#000', marginTop: 4 }}>{cust.name} · {cust.email}{cust.delivery ? ` · ${cust.delivery}` : ''} <button className="srcx-link" onClick={() => { setCust(null); setCustQ(''); }}>改</button></div>}
            </div>
            <div className="srcx-grid srcx-grid-3" style={{ marginTop: 12 }}>
              <div className="srcx-field"><label>数量</label><input type="number" value={qty} onChange={(e) => { setQty(e.target.value); applyTierFor(e.target.value); }} /></div>
              <div className="srcx-field"><label>单价 AUD(ex GST)</label><input type="number" step="0.0001" value={unit} onChange={(e) => setUnit(e.target.value)} /></div>
              <div className="srcx-field"><label>&nbsp;</label><div style={{ padding: '6px 0', fontSize: 13, color: '#000' }}>小计 ${subtotal.toFixed(2)} · GST ${gst.toFixed(2)} · <strong>合计 ${total.toFixed(2)}</strong></div></div>
            </div>
            {tiers.length > 0 && <p style={{ fontSize: 12, color: '#000', margin: '8px 0 0' }}>档位:{tiers.map((t) => `${t.quantity}=$${t.customer_unit_price_aud ?? '—'}`).join(' · ')}(改数量自动带对应档价,可手改)</p>}
            {error && <p className="srcx-error">{error}</p>}
            <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
              <button className="srcx-btn" onClick={create} disabled={saving}>{saving ? '生成中…' : '生成报价 → 主板'}</button>
              <button className="srcx-btn srcx-btn-ghost" onClick={onClose}>取消</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

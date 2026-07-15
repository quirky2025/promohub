// app/admin/sourcing/orders/page.js
// 工厂下单 / 订单 — turn an accepted cost sheet into a sourcing order (OC + 工厂 PO),
// download the customer Order Confirmation and the factory Purchase Order (RMB),
// track status, and record the actuals Finance reconciles against.
'use client';

import { useEffect, useState } from 'react';

const aud = (v) =>
  v == null || v === '' || Number.isNaN(Number(v)) ? '—'
    : '$' + Number(v).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const rmb = (v) =>
  v == null || v === '' || Number.isNaN(Number(v)) ? '—'
    : '¥' + Number(v).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const STATUSES = [
  ['order_placed', '已下单 PO'],
  ['factory_confirmed', '工厂已确认'],
  ['in_production', '生产中'],
  ['ready_to_ship', '待出货'],
  ['in_transit', '运输中'],
  ['customs_clearance', '清关中'],
  ['delivered', '已送达'],
  ['completed', '完成'],
  ['cancelled', '取消'],
];
const STATUS_LABEL = Object.fromEntries(STATUSES);
const MODE_LABEL = { express: 'Express 快递', air: 'Air 空派', sea: 'Sea 海派' };

export default function SourcingOrdersPage() {
  const [sheets, setSheets] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(null);
  const [openId, setOpenId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [err, setErr] = useState('');

  async function load() {
    setLoading(true);
    try {
      const [sRes, oRes] = await Promise.all([
        fetch('/api/admin/sourcing/cost-sheets').then((r) => r.json()),
        fetch('/api/admin/sourcing/orders').then((r) => r.json()),
      ]);
      setSheets(sRes.sheets || []);
      setOrders(oRes.orders || []);
    } catch (e) {
      setErr(e.message);
    }
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  const orderedSheetIds = new Set(orders.map((o) => o.cost_sheet_id).filter(Boolean));
  const readySheets = sheets.filter((s) => !orderedSheetIds.has(s.id) && s.status !== 'archived');

  async function placeOrder(sheet) {
    if (!confirm(`确认为「${sheet.product_name}」生成订单?\n会自动分配 OC 客户订单号 + 工厂 PO 号。`)) return;
    setPlacing(sheet.id);
    setErr('');
    try {
      const res = await fetch('/api/admin/sourcing/orders', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ costSheetId: sheet.id }),
      });
      const d = await res.json();
      if (!res.ok) { setErr(d.error || '下单失败'); }
      else {
        await load();
        setOpenId(d.order.id);
        openDetail(d.order.id);
      }
    } catch (e) { setErr(e.message); }
    setPlacing(null);
  }

  async function openDetail(id) {
    if (openId === id && detail) { setOpenId(null); setDetail(null); return; }
    setOpenId(id);
    setDetail(null);
    const d = await fetch(`/api/admin/sourcing/orders?id=${id}`).then((r) => r.json());
    setDetail(d.order || null);
  }

  async function patchOrder(id, patch) {
    const res = await fetch('/api/admin/sourcing/orders', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...patch }),
    });
    const d = await res.json();
    if (!res.ok) { alert(d.error || '保存失败'); return; }
    await load();
    const fresh = await fetch(`/api/admin/sourcing/orders?id=${id}`).then((r) => r.json());
    setDetail(fresh.order || null);
  }

  return (
    <div>
      <h1 className="srcx-h1">工厂下单 / 订单</h1>
      {err && <div className="srcx-error">{err}</div>}

      {/* ── 待下单:已报价、还没转订单的成本单 ── */}
      <div className="srcx-card">
        <h2>待下单 · 报价单</h2>
        <p className="srcx-muted" style={{ marginTop: -6 }}>
          客户接受报价后,点「下单」生成 <b>OC 客户订单号</b> + <b>工厂 PO 号</b>。订单号会贯穿货代账单与对账。
        </p>
        {loading ? <p className="srcx-muted">加载中…</p> : readySheets.length === 0 ? (
          <div className="srcx-empty">没有待下单的报价单。先到「计价 / 报价」保存一张成本单。</div>
        ) : (
          <table className="srcx-table">
            <thead>
              <tr>
                <th>报价单号</th><th>产品</th><th>工厂</th><th className="srcx-num">数量</th>
                <th className="srcx-num">客户价(含GST)</th><th>状态</th><th></th>
              </tr>
            </thead>
            <tbody>
              {readySheets.map((s) => (
                <tr key={s.id}>
                  <td className="srcx-num">{s.sheet_number || '—'}</td>
                  <td>{s.product_name}</td>
                  <td>{s.factories?.name || '—'}</td>
                  <td className="srcx-num">{s.quantity}</td>
                  <td className="srcx-num">{aud(s.quote_inc_gst_aud)}</td>
                  <td><span className="srcx-badge srcx-badge-navy">{s.status}</span></td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="srcx-btn srcx-btn-sm" disabled={placing === s.id} onClick={() => placeOrder(s)}>
                      {placing === s.id ? '生成中…' : '下单 →'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── 订单列表 ── */}
      <div className="srcx-card">
        <h2>订单</h2>
        {loading ? <p className="srcx-muted">加载中…</p> : orders.length === 0 ? (
          <div className="srcx-empty">还没有订单。</div>
        ) : (
          <table className="srcx-table">
            <thead>
              <tr>
                <th>OC 订单号</th><th>工厂 PO</th><th>产品</th><th>工厂</th>
                <th className="srcx-num">数量</th><th className="srcx-num">客户价</th><th>状态</th><th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td className="srcx-num"><b>{o.order_number}</b></td>
                  <td className="srcx-num">{o.factory_po_number}</td>
                  <td>{o.product_name}</td>
                  <td>{o.factories?.name || '—'}</td>
                  <td className="srcx-num">{o.quantity}</td>
                  <td className="srcx-num">{aud(o.total_inc_gst_aud)}</td>
                  <td><span className="srcx-badge srcx-badge-green">{STATUS_LABEL[o.status] || o.status}</span></td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="srcx-link" onClick={() => openDetail(o.id)}>
                      {openId === o.id ? '收起' : '详情 / 单据'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {openId && (
          <OrderDetail
            order={detail}
            onPatch={(patch) => patchOrder(openId, patch)}
          />
        )}
      </div>
    </div>
  );
}

function OrderDetail({ order, onPatch }) {
  const [actual, setActual] = useState(null);

  useEffect(() => {
    if (!order) { setActual(null); return; }
    setActual({
      factoryInvoiceNumber: order.factory_invoice_number || '',
      factoryPaidRmb: order.factory_paid_rmb ?? '',
      factoryPaidAud: order.factory_paid_aud ?? '',
      factoryFxPaid: order.factory_fx_paid ?? '',
      forwarderInvoiceNumber: order.forwarder_invoice_number || '',
      actualFreightAud: order.actual_freight_aud ?? '',
      trackingNumber: order.tracking_number || '',
      shipDate: order.ship_date || '',
      deliveryDate: order.delivery_date || '',
    });
  }, [order]);

  if (!order || !actual) return <p className="srcx-muted" style={{ marginTop: 14 }}>加载详情…</p>;

  const pdf = (doc) => window.open(`/api/admin/sourcing/orders/pdf?id=${order.id}&doc=${doc}`, '_blank');
  const setA = (k, v) => setActual((a) => ({ ...a, [k]: v }));
  const [sendingPo, setSendingPo] = useState(false);
  async function sendPo() {
    const factoryEmail = order.factories?.email || '';
    const to = window.prompt('发工厂 PO 到哪个邮箱?', factoryEmail);
    if (!to) return;
    setSendingPo(true);
    try {
      const res = await fetch('/api/admin/sourcing/orders/send-po', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.id, toOverride: to }),
      });
      const d = await res.json();
      if (res.ok) alert(`工厂 PO 已发送到 ${d.to} ✅`);
      else alert('发送失败:' + (d.error || 'unknown'));
    } catch (e) { alert('发送失败:' + e.message); }
    setSendingPo(false);
  }

  return (
    <div className="srcx-landed" style={{ marginTop: 16 }}>
      <div className="srcx-row" style={{ justifyContent: 'space-between', marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy)' }}>
            {order.order_number} · {order.product_name}
          </div>
          <div className="srcx-muted">
            工厂 PO {order.factory_po_number} · {order.factories?.name || '—'} · {MODE_LABEL[order.selected_freight_mode] || order.selected_freight_mode || '—'}
          </div>
        </div>
        <div className="srcx-tag-row">
          <button className="srcx-btn srcx-btn-ghost srcx-btn-sm" onClick={() => pdf('oc')}>客户订单确认 PDF</button>
          <button className="srcx-btn srcx-btn-gold srcx-btn-sm" onClick={() => pdf('po')}>工厂 PO (RMB) PDF</button>
          <button className="srcx-btn srcx-btn-sm" disabled={sendingPo} onClick={sendPo}>{sendingPo ? '发送中…' : '✉ 发工厂 PO'}</button>
        </div>
      </div>

      {/* 客户 + 工厂 双栏 */}
      <div className="srcx-grid srcx-grid-2">
        <div>
          <table style={{ width: '100%' }}>
            <tbody>
              <tr><td className="srcx-muted">客户</td><td>{order.customer_company || order.customer_name || '—'}</td></tr>
              <tr><td className="srcx-muted">联系人</td><td>{order.customer_name || '—'}</td></tr>
              <tr><td className="srcx-muted">数量</td><td className="srcx-num">{order.quantity}</td></tr>
              <tr><td className="srcx-muted">单价(不含GST)</td><td className="srcx-num">{aud(order.unit_price_ex_gst_aud)}</td></tr>
              <tr><td className="srcx-muted">小计(不含GST)</td><td className="srcx-num">{aud(order.subtotal_ex_gst_aud)}</td></tr>
              <tr><td className="srcx-muted">GST</td><td className="srcx-num">{aud(order.gst_aud)}</td></tr>
              <tr><td className="srcx-muted"><b>客户合计(含GST)</b></td><td className="srcx-num"><b>{aud(order.total_inc_gst_aud)}</b></td></tr>
            </tbody>
          </table>
        </div>
        <div>
          <table style={{ width: '100%' }}>
            <tbody>
              <tr><td className="srcx-muted">EXW 单价</td><td className="srcx-num">{rmb(order.exw_unit_rmb)}</td></tr>
              <tr><td className="srcx-muted">工厂货款(含模具/打样)</td><td className="srcx-num">{rmb(order.factory_product_rmb)}</td></tr>
              <tr><td className="srcx-muted">中国内陆运费</td><td className="srcx-num">{rmb(order.china_local_freight_rmb)}</td></tr>
              <tr><td className="srcx-muted">汇率(RMB→AUD)</td><td className="srcx-num">{order.exchange_rate ?? '—'}</td></tr>
              <tr><td className="srcx-muted">预估国际运费</td><td className="srcx-num">{aud(order.est_international_freight_aud)}</td></tr>
              <tr><td className="srcx-muted">预估落地成本</td><td className="srcx-num">{aud(order.est_landed_cost_ex_gst_aud)}</td></tr>
              <tr><td className="srcx-muted">预估利润</td><td className="srcx-num">{aud(order.est_profit_aud)}</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <hr className="srcx-divider" />

      {/* 状态 */}
      <div className="srcx-row" style={{ marginBottom: 14 }}>
        <div className="srcx-field" style={{ minWidth: 200 }}>
          <label>订单状态</label>
          <select value={order.status} onChange={(e) => onPatch({ status: e.target.value })}>
            {STATUSES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
      </div>

      {/* 实际数据(给 Finance 对账) */}
      <div style={{ fontWeight: 700, color: 'var(--navy)', marginBottom: 8 }}>实际数据(给 Finance 对账)</div>
      <div className="srcx-grid srcx-grid-3">
        <Field label="工厂发票号" v={actual.factoryInvoiceNumber} on={(v) => setA('factoryInvoiceNumber', v)} />
        <Field label="付工厂(RMB)" v={actual.factoryPaidRmb} on={(v) => setA('factoryPaidRmb', v)} type="number" />
        <Field label="付工厂当天汇率" v={actual.factoryFxPaid} on={(v) => setA('factoryFxPaid', v)} type="number" />
        <Field label="付工厂(AUD)" v={actual.factoryPaidAud} on={(v) => setA('factoryPaidAud', v)} type="number" />
        <Field label="货代发票号" v={actual.forwarderInvoiceNumber} on={(v) => setA('forwarderInvoiceNumber', v)} />
        <Field label="实际国际运费(AUD)" v={actual.actualFreightAud} on={(v) => setA('actualFreightAud', v)} type="number" />
        <Field label="物流单号" v={actual.trackingNumber} on={(v) => setA('trackingNumber', v)} />
        <Field label="出货日期" v={actual.shipDate} on={(v) => setA('shipDate', v)} type="date" />
        <Field label="送达日期" v={actual.deliveryDate} on={(v) => setA('deliveryDate', v)} type="date" />
      </div>
      <div style={{ marginTop: 12 }}>
        <button className="srcx-btn srcx-btn-sm" onClick={() => onPatch(actual)}>保存实际数据</button>
      </div>

      {/* 事件记录 */}
      {Array.isArray(order.sourcing_order_events) && order.sourcing_order_events.length > 0 && (
        <>
          <hr className="srcx-divider" />
          <div style={{ fontWeight: 700, color: 'var(--navy)', marginBottom: 8 }}>记录</div>
          <table className="srcx-table">
            <tbody>
              {order.sourcing_order_events
                .slice()
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                .map((ev) => (
                  <tr key={ev.id}>
                    <td className="srcx-num" style={{ whiteSpace: 'nowrap' }}>
                      {new Date(ev.created_at).toLocaleString('en-AU')}
                    </td>
                    <td>{ev.note || ev.event_type}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

function Field({ label, v, on, type = 'text' }) {
  return (
    <div className="srcx-field">
      <label>{label}</label>
      <input type={type} value={v ?? ''} onChange={(e) => on(e.target.value)} />
    </div>
  );
}

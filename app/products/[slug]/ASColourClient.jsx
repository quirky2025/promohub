'use client';

// app/products/[slug]/ASColourClient.jsx
// AS Colour(及后续走计算器的服装品牌,如 Gildan)专用变体 PDP。
// 与 ProductClient 完全隔离:branded-only(只印不卖白款)+ 尺码×数量网格(4XL/5XL 按 size_pricing 加价)
// + Size Guide + 印刷计算器(接 lib/decorationPricing)+ 命名位置 + 价格汇总 + 信息 Tabs。
// 颜色 = 小圆点(VistaPrint 风格):悬停冒名字,选中后名字固定显示在 "Choose Colour" 后面。
// STEP 1 选色 → STEP 2 数量 → STEP 3 印刷,布局对齐 ProductClient(StepLabel + 底部 Tabs)。
// 仅当 page.js 判定 product.decoration_model === 'calculator' 时渲染。

import { useState, useMemo } from 'react';
import Link from 'next/link';
import ProductImg from '@/components/ProductImg';
import CartDrawer from '@/components/CartDrawer';
import { addToCart } from '@/lib/cart';
import { colourImageAlt } from '@/lib/colourName';
import { getColourHex } from '@/lib/colourSwatch';
import { getASHex } from '@/lib/ascolourSwatch';
import { GST, SHIPPING } from '@/lib/pricing';
import { quoteDecoration, methodsFor, startingUnitPrice, MIN_QTY } from '@/lib/decorationPricing';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';
const FONT = '"DM Sans", sans-serif';

// print_methods 展示标签 → 计算器方法 key
const LABEL_TO_KEY = {
  'Screen Print': 'screen_print',
  'DTG': 'dtg',
  'DTF': 'dtf',
  'Embroidery': 'embroidery',
};

// ⚠ 必须与 page.js 的 decoType 逐字一致 → "from $X" 分类 = JSON-LD offer 分类。
function decoType(product) {
  const s = `${product?.category || ''} ${product?.subcategory || ''}`.toLowerCase();
  if (/\b(hat|cap|beanie|headwear|visor)\b/.test(s)) return 'hats';
  if (/\b(bag|tote|backpack|pouch|satchel|duffle)\b/.test(s)) return 'bags';
  return 'apparel';
}

// 圆点色值:产品自带 hex → AS 近似表 → 通用表 → 默认灰
function resolveHex(c) {
  return (c.hex && c.hex !== '') ? c.hex : (getASHex(c.name) || getColourHex(c.name) || '#CFCFCF');
}

// 印刷位置(按产品类型)。选中数量 = 计算器的 positions。
const POSITIONS_BY_TYPE = {
  apparel: ['Front', 'Left Chest', 'Back', 'Nape', 'Sleeve'],
  hats: ['Front', 'Side', 'Back'],
  bags: ['Front', 'Back'],
};

const TABS = ['Description', 'Decoration & Artwork', 'Shipping & Delivery', 'Ordering Process'];
const COLLAPSE_AT = 40;

const money = (n) => `$${(Math.round(n * 100) / 100).toFixed(2)}`;

export default function ASColourClient({ product, mainImage, extraImages = [], colours = [], pricingTiers = [], initialColourIndex = null }) {
  const type = decoType(product);

  // ── 画廊 ──
  const bottomImages = [mainImage, ...(extraImages || [])].filter(Boolean);
  const [selectedColour, setSelectedColour] = useState(initialColourIndex ?? null);
  const [hoverName, setHoverName] = useState('');
  const [leftIdx, setLeftIdx] = useState(0);
  const [showAllColours, setShowAllColours] = useState(false);
  const [activeTab, setActiveTab] = useState('Description');
  const bigImage = selectedColour !== null
    ? (colours[selectedColour]?.image || bottomImages[0] || mainImage)
    : (bottomImages[leftIdx] || mainImage);

  // ── 尺码 × 数量 ──
  const sizes = useMemo(() => {
    const s = product.size_chart?.sizes;
    return Array.isArray(s) && s.length ? s : ['OS'];
  }, [product.size_chart]);
  const sizePricing = product.size_pricing || {};              // { "4XL": 17.85 } 绝对客户单价(已×1.4)
  const bases = pricingTiers.map((t) => Number(t.base_price)).filter((n) => Number.isFinite(n) && n > 0);
  const garmentBase = bases.length ? Math.min(...bases) : 0;
  const baseSell = garmentBase * (product.margin || 1.4);
  // "from $X":与 page.js→JSON-LD 同源(startingUnitPrice)→ 显示价=结构化价
  const fromPrice = startingUnitPrice(garmentBase, type);
  const garmentUnit = (size) => (sizePricing[size] != null ? Number(sizePricing[size]) : baseSell);

  const [sizeQty, setSizeQty] = useState({});
  const setQtyFor = (size, val) => {
    const n = Math.max(0, parseInt(val, 10) || 0);
    setSizeQty((p) => ({ ...p, [size]: n }));
  };
  const totalQty = sizes.reduce((s, sz) => s + (sizeQty[sz] || 0), 0);
  const garmentSubtotal = sizes.reduce((s, sz) => s + (sizeQty[sz] || 0) * garmentUnit(sz), 0);
  const minQty = product.min_qty || MIN_QTY;
  const qtyOk = totalQty >= minQty;

  // ── 印刷方式(按 print_methods 过滤)──
  const availMethods = useMemo(() => {
    const fromCol = (product.print_methods || []).map((l) => LABEL_TO_KEY[l]).filter(Boolean);
    const mapped = fromCol.map((k) => (type === 'hats' && k === 'dtf') ? 'dtf_hats' : k);
    const keys = mapped.length ? mapped : methodsFor(type).map((m) => m.key);
    const seen = new Set();
    return keys.filter((k) => !seen.has(k) && seen.add(k)).map((k) => {
      const lm = methodsFor(type).find((m) => m.key === k);
      return { key: k, label: lm ? lm.label : k };
    });
  }, [product.print_methods, type]);

  const [method, setMethod] = useState(availMethods[0]?.key || 'screen_print');
  const [screenColours, setScreenColours] = useState(1);
  const [shade, setShade] = useState('white');
  const [sizeKey, setSizeKey] = useState('');

  // ── 命名位置(替代 1/2/3 position 下拉,像 VistaPrint 的 Front/Left Chest)──
  const posOptions = POSITIONS_BY_TYPE[type] || POSITIONS_BY_TYPE.apparel;
  const [selectedPositions, setSelectedPositions] = useState(['Front']);
  function togglePosition(p) {
    setSelectedPositions((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]);
  }
  const positions = Math.max(selectedPositions.length, 1);

  const SIZE_OPTS = {
    dtf: [['small', 'Small ~12×12cm'], ['medium', 'Medium ~28×20cm'], ['large', 'Large ~28×28cm'], ['xlarge', 'XL ~35×40cm']],
    dtg: [['A4', 'A4 ~21×30cm'], ['35x40', '35×40cm'], ['40x50', '40×50cm']],
    embroidery: [['small', 'Small ≤12×12cm'], ['medium', 'Medium 12–20cm (POA)']],
  };
  const needsSize = ['dtf', 'dtg', 'embroidery'].includes(method);
  const effSizeKey = sizeKey || (SIZE_OPTS[method]?.[0]?.[0]) || undefined;

  const quote = useMemo(() => quoteDecoration({
    method, colours: screenColours, positions, qty: totalQty || minQty, shade, sizeKey: effSizeKey,
  }), [method, screenColours, positions, totalQty, minQty, shade, effSizeKey]);

  const decoPerUnit = quote.poa ? 0 : quote.perUnit;
  const decoSetup = quote.poa ? 0 : quote.setup;
  const exGst = garmentSubtotal + decoPerUnit * totalQty + decoSetup;
  const gstAmt = (exGst + SHIPPING) * GST;
  const grand = exGst + SHIPPING + gstAmt;
  const blendedUnit = totalQty > 0 ? (garmentSubtotal + decoPerUnit * totalQty) / totalQty : (baseSell + decoPerUnit);

  const posOk = selectedPositions.length >= 1;
  const canAdd = qtyOk && !quote.poa && selectedColour !== null && posOk;

  // ── UI 状态 ──
  const [cartOpen, setCartOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const methodLabel = availMethods.find((m) => m.key === method)?.label || method;

  function handleAdd() {
    if (!canAdd) return;
    const sizeBreakdown = Object.fromEntries(sizes.filter((s) => (sizeQty[s] || 0) > 0).map((s) => [s, sizeQty[s]]));
    const posText = selectedPositions.join(', ');
    const decoName = `${methodLabel}${method === 'screen_print' ? ` · ${screenColours}c` : ''}${needsSize && effSizeKey ? ` · ${effSizeKey}` : ''} · ${posText}`;
    const item = {
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      sku: product.supplier_sku,
      image: bigImage || mainImage,
      colour: selectedColour !== null ? colours[selectedColour]?.name : '',
      qty: totalQty,
      sizeBreakdown,
      unitPrice: Math.round(blendedUnit * 100) / 100,
      subtotal: Math.round(exGst * 100) / 100,
      shipping: SHIPPING,
      gst: Math.round(gstAmt * 100) / 100,
      grand: Math.round(grand * 100) / 100,
      addons: [{ id: method, name: decoName, perUnit: decoPerUnit, setupFee: decoSetup, setupQty: 1 }],
    };
    addToCart(item);
    setAdded(true);
    setCartOpen(true);
    setTimeout(() => setAdded(false), 1800);
  }

  const measurements = product.size_chart?.measurements || [];
  const unit = product.size_chart?.unit || 'cm';
  const shownColours = showAllColours ? colours : colours.slice(0, COLLAPSE_AT);
  const activeColourName = hoverName || (selectedColour !== null ? colours[selectedColour]?.name : '');

  return (
    <div style={{ fontFamily: FONT, background: '#fff', color: '#1a1a1a' }}>
      {/* breadcrumb */}
      <div className="qp-padx" style={{ background: '#fff', borderBottom: '1px solid #E0DDD7', padding: '12px 40px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', fontSize: '13px' }}>
          <Link href="/catalog" style={{ color: '#7A7570', textDecoration: 'none' }}>Catalog</Link>
          <span style={{ color: '#C8C4BC', margin: '0 8px' }}>/</span>
          <span style={{ color: NAVY }}>{product.name}</span>
        </div>
      </div>

      <div className="qp-pdp-main" style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 40px 40px', display: 'grid', gridTemplateColumns: '480px 1fr', gap: '48px', alignItems: 'start' }}>
        {/* ── LEFT: gallery ── */}
        <div className="qp-pdp-left" style={{ position: 'sticky', top: '70px' }}>
          <div style={{ background: '#fff', border: '1px solid #E0DDD7', borderRadius: '16px', width: '100%', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: '12px' }}>
            {bigImage
              ? <ProductImg src={bigImage} alt={colourImageAlt(colours[selectedColour]?.name || '', product.name)} size="detail" eager style={{ width: '94%', height: '94%', objectFit: 'contain' }} />
              : <div style={{ fontSize: '14px' }}>No image available</div>}
          </div>
          {bottomImages.length > 1 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {bottomImages.map((src, i) => (
                <div key={i} onClick={() => { setLeftIdx(i); setSelectedColour(null); }} style={{ cursor: 'pointer' }}>
                  <div style={{ width: '100%', aspectRatio: '1', borderRadius: '10px', border: leftIdx === i && selectedColour === null ? `2.5px solid ${GOLD}` : '1.5px solid #E0DDD7', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    <ProductImg src={src} alt={colourImageAlt('', product.name)} size="thumb" style={{ width: '90%', height: '90%', objectFit: 'contain' }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── RIGHT: buy box ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* header */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, letterSpacing: '0.5px', marginBottom: '8px', background: '#EFF6FF', color: '#1E40AF', border: '1px solid #93C5FD' }}>
              SOLD PRINTED ONLY · MIN {minQty}
            </div>
            <div style={{ fontSize: '12px', color: '#1a1a1a', marginBottom: '6px', fontFamily: '"DM Mono", monospace', letterSpacing: '1px' }}>{product.supplier_sku} · {product.brand}</div>
            <h1 className="qp-pdp-h1" style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '34px', fontWeight: 600, margin: '0 0 8px', color: NAVY, lineHeight: 1.2 }}>{product.name}</h1>
            {fromPrice != null && (
              <div style={{ fontSize: '15px', color: NAVY, fontWeight: 700, margin: '6px 0 0' }}>
                From <span style={{ color: GOLD, fontSize: '22px' }}>{money(fromPrice)}</span>
                <span style={{ fontWeight: 400, fontSize: '12px', color: '#7A7570' }}> / unit decorated (ex GST)</span>
              </div>
            )}
            <div style={{ fontSize: '12px', color: '#7A7570', marginTop: '4px' }}>Blank garments are not sold — every order includes your logo.</div>
            {product.short_desc && <p style={{ fontSize: '14px', lineHeight: 1.7, margin: '12px 0 0' }}>{product.short_desc}</p>}
          </div>

          {/* STEP 1: colour — 小圆点 */}
          {colours.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
                <StepLabel num={1} text={`Choose ${product.colour_label || 'Product Colour'} *`} />
                {activeColourName && <span style={{ fontSize: '14px', color: GOLD, fontWeight: 500 }}>{activeColourName}</span>}
              </div>
              <div style={{ display: 'flex', gap: '9px', flexWrap: 'wrap' }}>
                {shownColours.map((c, i) => {
                  const hex = resolveHex(c);
                  const on = selectedColour === i;
                  return (
                    <div key={i} title={c.name} role="button" aria-label={`Select colour ${c.name}`}
                      onClick={() => setSelectedColour(i)}
                      onMouseEnter={() => setHoverName(c.name)} onMouseLeave={() => setHoverName('')}
                      style={{ width: '26px', height: '26px', borderRadius: '50%', cursor: 'pointer', background: hex, boxSizing: 'border-box', border: on ? `2px solid ${GOLD}` : '1px solid rgba(0,0,0,.18)', outline: on ? `2px solid ${GOLD}` : 'none', outlineOffset: '1px' }} />
                  );
                })}
              </div>
              {colours.length > COLLAPSE_AT && (
                <button onClick={() => setShowAllColours((v) => !v)} style={{ marginTop: '12px', background: 'none', border: `1.5px solid ${GOLD}`, color: NAVY, borderRadius: '20px', padding: '5px 14px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: FONT }}>
                  {showAllColours ? 'Show fewer ▲' : `Show all ${colours.length} colours ▼`}
                </button>
              )}
              {selectedColour === null && <div style={{ fontSize: '12px', color: '#C0392B', marginTop: '8px' }}>Please choose a colour.</div>}
            </div>
          )}

          {/* STEP 2: quantity per size */}
          <div>
            <div style={{ marginBottom: '12px' }}>
              <StepLabel num={2} text="Enter Quantity per Size *" />
            </div>
            {measurements.length > 0 && (
              <button onClick={() => setShowGuide((v) => !v)} style={{ background: 'none', border: 'none', color: GOLD, fontSize: '13px', fontWeight: 600, cursor: 'pointer', padding: 0, textDecoration: 'underline', fontFamily: FONT, marginBottom: '10px' }}>
                {showGuide ? 'Hide size guide ▲' : 'Size guide ▼'}
              </button>
            )}
            {showGuide && measurements.length > 0 && (
              <div style={{ margin: '0 0 12px', overflowX: 'auto', border: '1px solid #E0DDD7', borderRadius: '10px' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ background: '#F7F5F1' }}>
                      <th style={{ textAlign: 'left', padding: '8px 10px', color: NAVY }}>Measurement ({unit})</th>
                      {sizes.map((s) => <th key={s} style={{ padding: '8px 10px', color: NAVY }}>{s}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {measurements.map((m, mi) => (
                      <tr key={mi} style={{ borderTop: '1px solid #EEE' }}>
                        <td style={{ padding: '8px 10px', fontWeight: 600 }}>{m.name}</td>
                        {sizes.map((s, si) => <td key={s} style={{ padding: '8px 10px', textAlign: 'center' }}>{m.values?.[si] ?? '–'}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {sizes.map((s) => {
                const surcharge = sizePricing[s] != null && Number(sizePricing[s]) !== baseSell;
                return (
                  <div key={s} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: NAVY, marginBottom: '4px' }}>{s}</div>
                    <input type="number" min="0" value={sizeQty[s] || ''} onChange={(e) => setQtyFor(s, e.target.value)} placeholder="0"
                      style={{ width: '58px', padding: '8px 4px', border: '1.5px solid #C8C4BC', borderRadius: '8px', fontSize: '15px', fontWeight: 600, textAlign: 'center', fontFamily: FONT, outline: 'none', background: '#fff', color: NAVY, boxSizing: 'border-box' }} />
                    <div style={{ fontSize: '10px', color: surcharge ? '#B45309' : '#7A7570', marginTop: '3px' }}>{money(garmentUnit(s))}{surcharge ? ' ▲' : ''}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ fontSize: '13px', marginTop: '10px' }}>Total: <strong style={{ color: NAVY }}>{totalQty}</strong> units</div>
            {!qtyOk && totalQty > 0 && <div style={{ fontSize: '12px', color: '#C0392B', marginTop: '4px' }}>Minimum order is {minQty} units across all sizes.</div>}
          </div>

          {/* STEP 3: decoration */}
          <div>
            <div style={{ marginBottom: '12px' }}>
              <StepLabel num={3} text="Choose Decoration *" />
            </div>
            <div style={{ border: '1px solid #E0DDD7', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ background: NAVY, padding: '11px 14px', fontSize: '12px', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.8px', textAlign: 'center' }}>Print Method &amp; Placement</div>
              <div style={{ padding: '16px', background: '#FBFAF8' }}>
                {/* method pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
                  {availMethods.map((m) => (
                    <button key={m.key} onClick={() => { setMethod(m.key); setSizeKey(''); }}
                      style={{ padding: '7px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: FONT, border: method === m.key ? `2px solid ${GOLD}` : '1.5px solid #C8C4BC', background: method === m.key ? '#FFF8ED' : '#fff', color: method === m.key ? '#92400E' : '#555' }}>
                      {m.label}
                    </button>
                  ))}
                </div>
                {/* method-specific inputs */}
                {(method === 'screen_print' || method === 'dtg' || (needsSize && SIZE_OPTS[method])) && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-end', marginBottom: '14px' }}>
                    {method === 'screen_print' && (
                      <Field label="Print colours">
                        <select value={screenColours} onChange={(e) => setScreenColours(Number(e.target.value))} style={selStyle}>
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => <option key={n} value={n}>{n} colour{n > 1 ? 's' : ''}</option>)}
                        </select>
                      </Field>
                    )}
                    {method === 'dtg' && (
                      <Field label="Garment shade">
                        <select value={shade} onChange={(e) => setShade(e.target.value)} style={selStyle}>
                          <option value="white">Light / white</option>
                          <option value="dark">Dark</option>
                        </select>
                      </Field>
                    )}
                    {needsSize && SIZE_OPTS[method] && (
                      <Field label="Print size">
                        <select value={effSizeKey} onChange={(e) => setSizeKey(e.target.value)} style={selStyle}>
                          {SIZE_OPTS[method].map(([k, lbl]) => <option key={k} value={k}>{lbl}</option>)}
                        </select>
                      </Field>
                    )}
                  </div>
                )}
                {/* named positions */}
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#7A7570', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Print positions (each adds cost)</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {posOptions.map((p) => {
                      const on = selectedPositions.includes(p);
                      return (
                        <button key={p} onClick={() => togglePosition(p)}
                          style={{ padding: '7px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: FONT, border: on ? `2px solid ${GOLD}` : '1.5px solid #C8C4BC', background: on ? '#FFF8ED' : '#fff', color: on ? '#92400E' : '#555' }}>
                          {on ? '✓ ' : ''}{p}
                        </button>
                      );
                    })}
                  </div>
                  {!posOk && <div style={{ fontSize: '12px', color: '#C0392B', marginTop: '6px' }}>Select at least one print position.</div>}
                </div>
                {quote.poa && (
                  <div style={{ marginTop: '12px', fontSize: '12px', color: '#92400E', background: '#FFF8ED', border: '1px solid #FCD34D', borderRadius: '8px', padding: '8px 10px' }}>
                    This combination is price-on-application. Add your sizes &amp; colour, then request a quote — we&apos;ll confirm pricing.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* price summary */}
          <div style={{ border: `1.5px solid ${GOLD}`, borderRadius: '12px', padding: '16px', background: '#fff' }}>
            <Row label="Garments" value={money(garmentSubtotal)} />
            <Row label="Decoration" value={quote.poa ? 'POA' : money(decoPerUnit * totalQty)} />
            <Row label={`Setup (one-off, ${positions} position${positions > 1 ? 's' : ''})`} value={quote.poa ? '—' : money(decoSetup)} />
            <div style={{ borderTop: '1px solid #E0DDD7', margin: '8px 0' }} />
            <Row label="Subtotal (ex GST)" value={quote.poa ? 'POA' : money(exGst)} bold />
            {!quote.poa && totalQty > 0 && (
              <>
                <div style={{ marginTop: '10px', padding: '10px 12px', background: '#FBFAF8', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '13px', color: NAVY, fontWeight: 600 }}>Price per unit</span>
                  <span style={{ fontSize: '22px', fontWeight: 700, color: GOLD }}>{money(blendedUnit)}</span>
                </div>
                <div style={{ fontSize: '11px', color: '#7A7570', marginTop: '6px', textAlign: 'right' }}>incl. decoration · ex GST &amp; shipping</div>
              </>
            )}
          </div>

          {/* actions */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button onClick={handleAdd} disabled={!canAdd}
              style={{ flex: 1, minWidth: '180px', padding: '14px 20px', borderRadius: '10px', border: 'none', fontSize: '15px', fontWeight: 700, fontFamily: FONT, cursor: canAdd ? 'pointer' : 'not-allowed', background: canAdd ? NAVY : '#C8C4BC', color: '#fff' }}>
              {added ? '✓ Added' : canAdd ? `Add to Cart — ${money(grand)} incl. GST` : 'Add to Cart'}
            </button>
            <Link href="/contact" style={{ flex: 1, minWidth: '160px', textAlign: 'center', padding: '14px 20px', borderRadius: '10px', border: `1.5px solid ${NAVY}`, fontSize: '15px', fontWeight: 700, fontFamily: FONT, color: NAVY, textDecoration: 'none', background: '#fff' }}>
              Get a Quote
            </Link>
          </div>
          {totalQty > 0 && !quote.poa && selectedColour === null && (
            <div style={{ fontSize: '12px', color: '#C0392B' }}>Choose a colour to add to cart.</div>
          )}
        </div>
      </div>

      {/* ── TABS (full width, like ProductClient) ── */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 40px 60px' }}>
        <div style={{ border: '1px solid #E0DDD7', borderRadius: '10px', overflow: 'hidden', background: '#fff' }}>
          <div className="qp-pdp-tabs" style={{ display: 'flex', borderBottom: '1px solid #E0DDD7' }}>
            {TABS.map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{ flex: 1, padding: '14px 8px', fontSize: '13px', fontWeight: 700, color: activeTab === tab ? NAVY : '#000', background: activeTab === tab ? '#FDF8F0' : 'none', border: 'none', borderBottom: activeTab === tab ? `3px solid ${GOLD}` : '3px solid transparent', cursor: 'pointer', fontFamily: FONT, whiteSpace: 'nowrap', textAlign: 'center' }}>
                {tab}
              </button>
            ))}
          </div>
          <div style={{ padding: '24px', fontSize: '14px', lineHeight: 1.8, color: '#1a1a1a' }}>
            {activeTab === 'Description' && (
              <div className="qp-desc-3col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '32px', alignItems: 'start' }}>
                <div>
                  {Array.isArray(product.features) && product.features.filter(Boolean).length > 0 && (
                    <div style={{ marginBottom: '20px' }}>
                      <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '18px', color: NAVY, margin: '0 0 12px' }}>Features</h3>
                      <ul style={{ margin: 0, paddingLeft: '20px' }}>
                        {product.features.filter(Boolean).map((f, i) => <li key={i} style={{ marginBottom: '6px' }}>{f}</li>)}
                      </ul>
                    </div>
                  )}
                  {Array.isArray(product.material_tags) && product.material_tags.length > 0 && (
                    <div style={{ marginBottom: '12px', padding: '12px 16px', background: '#fff', borderRadius: '8px', border: '1px solid #E0DDD7', borderLeft: `3px solid ${GOLD}` }}>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '4px' }}>Material</div>
                      <div style={{ fontSize: '13px', color: NAVY, fontWeight: 500, lineHeight: 1.6 }}>{product.material_tags.join(', ')}</div>
                    </div>
                  )}
                </div>
                <div>
                  {product.specs && typeof product.specs === 'object' && !Array.isArray(product.specs) && Object.keys(product.specs).length > 0 && (
                    <div style={{ border: '1px solid #E0DDD7', borderRadius: '8px', overflow: 'hidden' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                        <tbody>
                          {Object.entries(product.specs).map(([k, v]) => (
                            <tr key={k} style={{ borderBottom: '1px solid #F0EEED' }}>
                              <td style={{ padding: '9px 12px', fontWeight: 600, color: NAVY, background: '#FAFAF8', textTransform: 'capitalize' }}>{k.replace(/_/g, ' ')}</td>
                              <td style={{ padding: '9px 12px', color: '#1a1a1a' }}>{String(v)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
                <div>
                  {product.description && (
                    <div>
                      <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '18px', color: NAVY, margin: '0 0 12px' }}>Description</h3>
                      <p style={{ margin: 0, lineHeight: 1.7 }}>{product.description}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'Decoration & Artwork' && (
              <div style={{ maxWidth: '760px' }}>
                <p style={{ margin: '0 0 14px', lineHeight: 1.7 }}>Every {product.name} is decorated to order with your logo. Choose from the print methods above — each is priced live in the calculator.</p>
                <ul style={{ margin: '0 0 16px', paddingLeft: '20px' }}>
                  <li style={{ marginBottom: '6px' }}><strong>Screen Print</strong> — best value at volume; priced per colour × position.</li>
                  <li style={{ marginBottom: '6px' }}><strong>DTG</strong> — full-colour direct print, ideal for detailed or photographic artwork.</li>
                  <li style={{ marginBottom: '6px' }}><strong>DTF</strong> — durable full-colour transfer, no setup fee.</li>
                  <li><strong>Embroidery</strong> — premium stitched finish for a classic corporate look.</li>
                </ul>
                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '17px', color: NAVY, margin: '0 0 10px' }}>Artwork Requirements</h4>
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    <li style={{ marginBottom: '8px' }}>Preferred formats: <strong>AI, EPS, PDF</strong> (vector files)</li>
                    <li style={{ marginBottom: '8px' }}>Also accepted: <strong>PNG or JPG</strong> at minimum 300dpi</li>
                    <li style={{ marginBottom: '8px' }}>Provide <strong>PMS colour codes</strong> if colour matching is required</li>
                    <li>A free digital mockup is created for your approval before production begins</li>
                  </ul>
                </div>
                <div style={{ padding: '14px 16px', background: `${GOLD}15`, borderRadius: '10px', border: `1px solid ${GOLD}40` }}>
                  <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.6 }}><strong>Need help with your artwork?</strong> Contact us at <strong>hello@quirkypromo.com.au</strong> or call <strong>02 9477 4748</strong>.</p>
                </div>
              </div>
            )}

            {activeTab === 'Shipping & Delivery' && (
              <div style={{ maxWidth: '760px' }}>
                <div style={{ padding: '14px', background: '#fff', borderRadius: '10px', borderTop: `3px solid ${GOLD}`, marginBottom: '20px' }}>
                  <div style={{ fontSize: '22px', marginBottom: '6px' }}>🚚</div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: NAVY, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Flat Rate Shipping</div>
                  <div style={{ fontSize: '13px' }}>$30 per domestic address, Australia-wide</div>
                </div>
                <h4 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '17px', color: NAVY, margin: '0 0 12px' }}>Delivery Times After Dispatch</h4>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <tbody>
                    {[['Brisbane / Sydney / Melbourne', '2–5 business days'], ['Adelaide', '3–5 business days'], ['Perth', '5–7 business days'], ['Rural Regions', '5–15 business days']].map(([r, t]) => (
                      <tr key={r} style={{ borderBottom: '1px solid #F0EEED' }}>
                        <td style={{ padding: '10px 14px' }}>{r}</td>
                        <td style={{ padding: '10px 14px', fontWeight: 600, color: NAVY, textAlign: 'right' }}>{t}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p style={{ margin: '10px 0 0', fontSize: '12px', color: '#7A7570' }}>Production lead time is quoted per order after artwork approval. Delivery times are estimates only.</p>
              </div>
            )}

            {activeTab === 'Ordering Process' && (
              <div>
                <p style={{ margin: '0 0 20px', fontSize: '14px' }}>Four simple steps from order to delivery — your branded products, done right.</p>
                <div className="qp-steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                  {[['🛒', 'Place Your Order', 'Select colour, sizes & decoration, then Add to Cart or Get a Quote.'], ['🎨', 'Artwork & Mockup', 'Upload your logo. Our design team creates a free digital mockup for approval.'], ['⚙️', 'Approve & Produce', 'Approve your proof in writing and production begins.'], ['📦', 'Delivery', 'Dispatched Australia-wide, $30 flat rate, tracked to your door.']].map(([icon, title, desc], i) => (
                    <div key={i} style={{ background: '#fff', border: '1px solid #E0DDD7', borderRadius: '10px', padding: '16px', borderTop: `3px solid ${GOLD}` }}>
                      <div style={{ fontSize: '24px', marginBottom: '8px' }}>{icon}</div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: NAVY, marginBottom: '6px' }}>{i + 1}. {title}</div>
                      <div style={{ fontSize: '12px', color: '#1a1a1a', lineHeight: 1.5 }}>{desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}

const selStyle = { padding: '8px 10px', border: '1.5px solid #C8C4BC', borderRadius: '8px', fontSize: '13px', fontFamily: FONT, background: '#fff', color: NAVY, minWidth: '150px' };

function StepLabel({ num, text }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: GOLD, color: '#fff', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{num}</div>
      <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '20px', fontWeight: 600, color: NAVY }}>{text}</div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      <span style={{ fontSize: '11px', fontWeight: 700, color: '#7A7570', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
      {children}
    </label>
  );
}

function Row({ label, value, bold }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '3px 0', fontSize: bold ? '15px' : '13px', fontWeight: bold ? 700 : 400, color: bold ? NAVY : '#444' }}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

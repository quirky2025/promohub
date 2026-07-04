'use client';

// app/products/[slug]/ASColourClient.jsx
// AS Colour(及后续走计算器的服装品牌,如 Gildan)专用变体 PDP。
// 与 ProductClient 完全隔离:branded-only(只印不卖白款)+ 尺码×数量网格(4XL/5XL 按 size_pricing 加价)
// + Size Guide + 印刷计算器(接 lib/decorationPricing)+ 位置选择 + 价格汇总。
// 仅当 page.js 判定 product.decoration_model === 'calculator' 时渲染,不影响其它品牌。

import { useState, useMemo } from 'react';
import Link from 'next/link';
import ProductImg from '@/components/ProductImg';
import CartDrawer from '@/components/CartDrawer';
import { addToCart } from '@/lib/cart';
import { colourImageAlt } from '@/lib/colourName';
import { GST, SHIPPING } from '@/lib/pricing';
import { quoteDecoration, methodsFor, startingUnitPrice, MIN_QTY } from '@/lib/decorationPricing';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';
const FONT = '"DM Sans", sans-serif';

// print_methods(text[] 展示标签)→ 计算器方法 key
const LABEL_TO_KEY = {
  'Screen Print': 'screen_print',
  'DTG': 'dtg',
  'DTF': 'dtf',
  'Embroidery': 'embroidery',
};
// 产品类型 → 计算器 type(供 methodsFor 兜底,并决定帽子走 dtf_hats)
// 与 page.js 的 decoType 逐字一致 → "from $X" 分类 = JSON-LD offer 分类。
function decoType(product) {
  const s = `${product?.category || ''} ${product?.subcategory || ''}`.toLowerCase();
  if (/\b(hat|cap|beanie|headwear|visor)\b/.test(s)) return 'hats';
  if (/\b(bag|tote|backpack|pouch|satchel|duffle)\b/.test(s)) return 'bags';
  return 'apparel';
}

const money = (n) => `$${(Math.round(n * 100) / 100).toFixed(2)}`;

export default function ASColourClient({ product, mainImage, extraImages = [], colours = [], pricingTiers = [], initialColourIndex = null }) {
  const type = decoType(product);

  // ── 画廊 ──
  const bottomImages = [mainImage, ...(extraImages || [])].filter(Boolean);
  const [selectedColour, setSelectedColour] = useState(initialColourIndex ?? null);
  const [leftIdx, setLeftIdx] = useState(0);
  const bigImage = selectedColour !== null
    ? (colours[selectedColour]?.image || bottomImages[0] || mainImage)
    : (bottomImages[leftIdx] || mainImage);

  // ── 尺码 × 数量 ──
  const sizes = useMemo(() => {
    const s = product.size_chart?.sizes;
    return Array.isArray(s) && s.length ? s : ['OS'];
  }, [product.size_chart]);
  const sizePricing = product.size_pricing || {};             // { "4XL": 17.85, ... } 绝对客户单价
  const bases = pricingTiers.map((t) => Number(t.base_price)).filter((n) => Number.isFinite(n) && n > 0);
  const garmentBase = bases.length ? Math.min(...bases) : 0;
  const baseSell = garmentBase * (product.margin || 1.4);
  // "from $X":衣服 + 最便宜印刷,与 page.js→JSON-LD 同源(startingUnitPrice)→ 显示价=结构化价
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

  // ── 印刷计算器 ──
  const availMethods = useMemo(() => {
    const fromCol = (product.print_methods || [])
      .map((l) => LABEL_TO_KEY[l])
      .filter(Boolean);
    // 帽子:DTF 走 dtf_hats
    const mapped = fromCol.map((k) => (type === 'hats' && k === 'dtf') ? 'dtf_hats' : k);
    const keys = mapped.length ? mapped : methodsFor(type).map((m) => m.key);
    // 去重 + 生成 {key,label}
    const seen = new Set();
    return keys.filter((k) => !seen.has(k) && seen.add(k)).map((k) => {
      const lm = methodsFor(type).find((m) => m.key === k);
      return { key: k, label: lm ? lm.label : k };
    });
  }, [product.print_methods, type]);

  const [method, setMethod] = useState(availMethods[0]?.key || 'screen_print');
  const [screenColours, setScreenColours] = useState(1);
  const [positions, setPositions] = useState(1);
  const [shade, setShade] = useState('white');                // dtg
  const [sizeKey, setSizeKey] = useState('');                 // dtf/dtg/embroidery 印刷尺寸

  // 各方法的印刷尺寸选项
  const SIZE_OPTS = {
    dtf: [['small', 'Small ~12×12cm'], ['medium', 'Medium ~28×20cm'], ['large', 'Large ~28×28cm'], ['xlarge', 'XL ~35×40cm']],
    dtg: [['A4', 'A4 ~21×30cm'], ['35x40', '35×40cm'], ['40x50', '40×50cm']],
    embroidery: [['small', 'Small ≤12×12cm'], ['medium', 'Medium 12–20cm (POA)']],
  };
  const needsSize = ['dtf', 'dtg', 'embroidery'].includes(method);
  const effSizeKey = sizeKey || (SIZE_OPTS[method]?.[0]?.[0]) || undefined;

  const quote = useMemo(() => quoteDecoration({
    method,
    colours: screenColours,
    positions,
    qty: totalQty || minQty,
    shade,
    sizeKey: effSizeKey,
  }), [method, screenColours, positions, totalQty, minQty, shade, effSizeKey]);

  const decoPerUnit = quote.poa ? 0 : quote.perUnit;
  const decoSetup = quote.poa ? 0 : quote.setup;
  const decoLine = decoPerUnit * totalQty + decoSetup;
  const exGst = garmentSubtotal + decoLine;
  const gstAmt = (exGst + SHIPPING) * GST;
  const grand = exGst + SHIPPING + gstAmt;
  const blendedUnit = totalQty > 0 ? (garmentSubtotal + decoPerUnit * totalQty) / totalQty : (baseSell + decoPerUnit);

  const canAdd = qtyOk && !quote.poa && selectedColour !== null;

  // ── UI 状态 ──
  const [cartOpen, setCartOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const methodLabel = availMethods.find((m) => m.key === method)?.label || method;

  function handleAdd() {
    if (!canAdd) return;
    const sizeBreakdown = Object.fromEntries(sizes.filter((s) => (sizeQty[s] || 0) > 0).map((s) => [s, sizeQty[s]]));
    const decoName = `${methodLabel}${method === 'screen_print' ? ` · ${screenColours}c` : ''}${needsSize && effSizeKey ? ` · ${effSizeKey}` : ''} · ${positions} pos`;
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

      <div className="qp-pdp-main" style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 40px 60px', display: 'grid', gridTemplateColumns: '480px 1fr', gap: '48px', alignItems: 'start' }}>
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

        {/* ── RIGHT: details ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* branded-only badge */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, letterSpacing: '0.5px', marginBottom: '8px', background: '#EFF6FF', color: '#1E40AF', border: '1px solid #93C5FD' }}>
              DECORATED TO ORDER · MIN {minQty}
            </div>
            <div style={{ fontSize: '12px', color: '#1a1a1a', marginBottom: '6px', fontFamily: '"DM Mono", monospace', letterSpacing: '1px' }}>{product.supplier_sku} · {product.brand}</div>
            <h1 className="qp-pdp-h1" style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '34px', fontWeight: 600, margin: '0 0 8px', color: NAVY, lineHeight: 1.2 }}>{product.name}</h1>
            {fromPrice != null && (
              <div style={{ fontSize: '15px', color: NAVY, fontWeight: 700, margin: '6px 0 0' }}>
                From <span style={{ color: GOLD, fontSize: '22px' }}>{money(fromPrice)}</span>
                <span style={{ fontWeight: 400, fontSize: '12px', color: '#7A7570' }}> / unit decorated (ex GST)</span>
              </div>
            )}
            {product.short_desc && <p style={{ fontSize: '14px', lineHeight: 1.7, margin: '12px 0 0' }}>{product.short_desc}</p>}
          </div>

          {/* colour swatches (branded model shots) */}
          {colours.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: NAVY }}>{product.colour_label || 'Choose Product Colour'}</span>
                {selectedColour !== null && <span style={{ fontSize: '14px', color: GOLD, fontWeight: 500 }}>{colours[selectedColour]?.name}</span>}
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '12px' }}>
                {colours.map((c, i) => {
                  const hex = c.hex && c.hex !== '' ? c.hex : null;
                  return (
                    <div key={i} onClick={() => setSelectedColour(i)} role="button" aria-label={`Select colour ${c.name}`} style={{ cursor: 'pointer', textAlign: 'center' }}>
                      <div style={{ width: '64px', height: '64px', borderRadius: '10px', border: selectedColour === i ? `2.5px solid ${GOLD}` : '1.5px solid #E0DDD7', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: '6px', boxShadow: selectedColour === i ? '0 2px 10px rgba(201,169,110,.3)' : '0 1px 3px rgba(0,0,0,.06)' }}>
                        {c.image ? <ProductImg src={c.image} alt={colourImageAlt(c.name, product.name)} size="thumb" style={{ width: '90%', height: '90%', objectFit: 'contain' }} />
                          : hex ? <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: hex, border: hex === '#FFFFFF' ? '1px solid #E0DDD7' : '1px solid rgba(0,0,0,.18)', boxSizing: 'border-box' }} />
                            : <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#E0DDD7' }} />}
                      </div>
                      <div style={{ fontSize: '10px', color: selectedColour === i ? GOLD : '#7A7570', fontWeight: selectedColour === i ? 600 : 400, maxWidth: '64px', lineHeight: '1.2' }}>{c.name}</div>
                    </div>
                  );
                })}
              </div>
              {selectedColour === null && <div style={{ fontSize: '12px', color: '#C0392B', marginTop: '8px' }}>Please choose a colour.</div>}
            </div>
          )}

          {/* size guide toggle */}
          {measurements.length > 0 && (
            <div>
              <button onClick={() => setShowGuide((v) => !v)} style={{ background: 'none', border: 'none', color: GOLD, fontSize: '13px', fontWeight: 600, cursor: 'pointer', padding: 0, textDecoration: 'underline', fontFamily: FONT }}>
                {showGuide ? 'Hide size guide ▲' : 'Size guide ▼'}
              </button>
              {showGuide && (
                <div style={{ marginTop: '10px', overflowX: 'auto', border: '1px solid #E0DDD7', borderRadius: '10px' }}>
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
                  {product.size_chart?.note && <div style={{ fontSize: '11px', color: '#7A7570', padding: '8px 10px' }}>{product.size_chart.note}</div>}
                </div>
              )}
            </div>
          )}

          {/* size × qty grid */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: NAVY, marginBottom: '10px' }}>Enter quantity per size</div>
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

          {/* decoration calculator */}
          <div style={{ border: '1px solid #E0DDD7', borderRadius: '12px', padding: '16px', background: '#FBFAF8' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: NAVY, marginBottom: '10px' }}>Decoration</div>

            {/* method */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
              {availMethods.map((m) => (
                <button key={m.key} onClick={() => { setMethod(m.key); setSizeKey(''); }}
                  style={{ padding: '7px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: FONT,
                    border: method === m.key ? `2px solid ${GOLD}` : '1.5px solid #C8C4BC', background: method === m.key ? '#FFF8ED' : '#fff', color: method === m.key ? '#92400E' : '#555' }}>
                  {m.label}
                </button>
              ))}
            </div>

            {/* method-specific inputs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-end' }}>
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
              <Field label="Positions">
                <select value={positions} onChange={(e) => setPositions(Number(e.target.value))} style={selStyle}>
                  {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n} position{n > 1 ? 's' : ''}</option>)}
                </select>
              </Field>
            </div>

            {quote.poa && (
              <div style={{ marginTop: '12px', fontSize: '12px', color: '#92400E', background: '#FFF8ED', border: '1px solid #FCD34D', borderRadius: '8px', padding: '8px 10px' }}>
                This combination is price-on-application. Add your sizes/colour and request a quote — we'll confirm pricing.
              </div>
            )}
          </div>

          {/* price summary */}
          <div style={{ border: `1.5px solid ${GOLD}`, borderRadius: '12px', padding: '16px', background: '#fff' }}>
            <Row label="Garments" value={money(garmentSubtotal)} />
            <Row label={`Decoration (${totalQty || 0} × ${money(decoPerUnit)})`} value={quote.poa ? 'POA' : money(decoPerUnit * totalQty)} />
            <Row label="Setup (one-off)" value={quote.poa ? '—' : money(decoSetup)} />
            <div style={{ borderTop: '1px solid #E0DDD7', margin: '8px 0' }} />
            <Row label="Subtotal (ex GST)" value={quote.poa ? 'POA' : money(exGst)} bold />
            {!quote.poa && totalQty > 0 && (
              <div style={{ fontSize: '12px', color: '#7A7570', marginTop: '6px' }}>≈ {money(blendedUnit)} / unit incl. decoration (+ setup, ex GST & shipping)</div>
            )}
          </div>

          {/* actions */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button onClick={handleAdd} disabled={!canAdd}
              style={{ flex: 1, minWidth: '180px', padding: '14px 20px', borderRadius: '10px', border: 'none', fontSize: '15px', fontWeight: 700, fontFamily: FONT, cursor: canAdd ? 'pointer' : 'not-allowed', background: canAdd ? NAVY : '#C8C4BC', color: '#fff' }}>
              {added ? '✓ Added' : 'Add to Cart'}
            </button>
            <Link href="/contact" style={{ flex: 1, minWidth: '160px', textAlign: 'center', padding: '14px 20px', borderRadius: '10px', border: `1.5px solid ${NAVY}`, fontSize: '15px', fontWeight: 700, fontFamily: FONT, color: NAVY, textDecoration: 'none', background: '#fff' }}>
              Get a Quote
            </Link>
          </div>
          {!canAdd && totalQty > 0 && !quote.poa && selectedColour === null && (
            <div style={{ fontSize: '12px', color: '#C0392B' }}>Choose a colour to add to cart.</div>
          )}
        </div>
      </div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}

const selStyle = { padding: '8px 10px', border: '1.5px solid #C8C4BC', borderRadius: '8px', fontSize: '13px', fontFamily: FONT, background: '#fff', color: NAVY, minWidth: '150px' };

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

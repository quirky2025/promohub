'use client';

// app/products/[slug]/ASColourClient.jsx
// AS Colour(及后续走计算器的服装品牌,如 Gildan)专用变体 PDP。
// branded-only(只印不卖白款)+ 尺码×数量网格(4XL/5XL 按 size_pricing 加价)
// + Size Guide(折叠)+ 逐位置印刷计算器(接 lib/decorationPricing.quoteJob)+ 深底/附加费
// + navy "Your Selection" 汇总卡 + 信任徽章 + 原版同款 Tabs。观感对齐 ProductClient。
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
import { quoteJob, quoteDecoration, methodsFor, startingUnitPrice, isDarkHex, FINISHING, MIN_QTY } from '@/lib/decorationPricing';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';
const FONT = '"DM Sans", sans-serif';

const LABEL_TO_KEY = { 'Screen Print': 'screen_print', 'DTG': 'dtg', 'DTF': 'dtf', 'Embroidery': 'embroidery' };

// ⚠ 必须与 page.js 的 decoType 逐字一致 → "from $X" 分类 = JSON-LD offer 分类。
function decoType(product) {
  const s = `${product?.category || ''} ${product?.subcategory || ''}`.toLowerCase();
  if (/\b(hat|cap|beanie|headwear|visor)\b/.test(s)) return 'hats';
  if (/\b(bag|tote|backpack|pouch|satchel|duffle)\b/.test(s)) return 'bags';
  return 'apparel';
}

function resolveHex(c) {
  return (c && c.hex && c.hex !== '') ? c.hex : (getASHex(c && c.name) || getColourHex(c && c.name) || '#CFCFCF');
}

const POSITION_OPTIONS = {
  apparel: ['Left Chest', 'Right Chest', 'Front / Centre', 'Back', 'Nape', 'Left Sleeve', 'Right Sleeve'],
  hats: ['Front', 'Side', 'Back'],
  bags: ['Front', 'Back'],
};

const SIZE_OPTS = {
  dtf: [['small', 'Small ~12×12cm'], ['medium', 'Medium ~28×20cm'], ['large', 'Large ~28×28cm'], ['xlarge', 'XL ~35×40cm']],
  dtg: [['A4', 'Small ~21×30cm'], ['35x40', 'Medium ~35×40cm'], ['40x50', 'Large ~40×50cm']],
  embroidery: [['small', 'Small ≤12×12cm'], ['medium', 'Medium 12–20cm (POA)']],
};
const needsSize = (m) => ['dtf', 'dtg', 'embroidery'].includes(m);
const effSize = (p) => p.sizeKey || (SIZE_OPTS[p.method] && SIZE_OPTS[p.method][0][0]) || undefined;

const TABS = ['Description', 'Sample Policy', 'Mockups & Artwork', 'Shipping & Delivery', 'Ordering Process'];
const COLLAPSE_AT = 40;

const money = (n) => `$${(Math.round(n * 100) / 100).toFixed(2)}`;
const aud = (n) => '$' + Number(n || 0).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function ASColourClient({ product, mainImage, extraImages = [], colours = [], pricingTiers = [], initialColourIndex = null }) {
  const type = decoType(product);

  const bottomImages = [mainImage, ...(extraImages || [])].filter(Boolean);
  const [selectedColour, setSelectedColour] = useState(initialColourIndex ?? null);
  const [hoverName, setHoverName] = useState('');
  const [leftIdx, setLeftIdx] = useState(0);
  const [showAllColours, setShowAllColours] = useState(false);
  const [activeTab, setActiveTab] = useState('Description');
  const [showGuide, setShowGuide] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const [specialty, setSpecialty] = useState(false);
  const [addons, setAddons] = useState({});
  const toggleAddon = (k) => setAddons((a) => ({ ...a, [k]: !a[k] }));

  const bigImage = selectedColour !== null
    ? (colours[selectedColour]?.image || bottomImages[0] || mainImage)
    : (bottomImages[leftIdx] || mainImage);

  const sizes = useMemo(() => {
    const s = product.size_chart?.sizes;
    return Array.isArray(s) && s.length ? s : ['OS'];
  }, [product.size_chart]);
  const sizePricing = product.size_pricing || {};
  const bases = pricingTiers.map((t) => Number(t.base_price)).filter((n) => Number.isFinite(n) && n > 0);
  const garmentBase = bases.length ? Math.min(...bases) : 0;
  const baseSell = garmentBase * (product.margin || 1.4);
  const fromPrice = startingUnitPrice(garmentBase, type);
  const garmentUnit = (size) => (sizePricing[size] != null ? Number(sizePricing[size]) : baseSell);

  const [sizeQty, setSizeQty] = useState({});
  const setQtyFor = (size, val) => setSizeQty((p) => ({ ...p, [size]: Math.max(0, parseInt(val, 10) || 0) }));
  const totalQty = sizes.reduce((s, sz) => s + (sizeQty[sz] || 0), 0);
  const garmentSubtotal = sizes.reduce((s, sz) => s + (sizeQty[sz] || 0) * garmentUnit(sz), 0);
  const minQty = product.min_qty || MIN_QTY;
  const qtyOk = totalQty >= minQty;

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

  const posOptions = POSITION_OPTIONS[type] || POSITION_OPTIONS.apparel;

  // 逐位置配置:每行 { position, method, colours, sizeKey, shade }
  const [positions, setPositions] = useState([{ position: posOptions[0], method: availMethods[0]?.key || 'screen_print', colours: 1, sizeKey: '', shade: 'white' }]);
  const usedPositions = positions.map((p) => p.position);
  const nextFreePos = posOptions.find((o) => !usedPositions.includes(o)) || posOptions[0];
  function addPosition() {
    if (positions.length >= posOptions.length) return;
    setPositions((prev) => [...prev, { position: nextFreePos, method: availMethods[0]?.key || 'screen_print', colours: 1, sizeKey: '', shade: 'white' }]);
  }
  function updatePosition(i, patch) {
    setPositions((prev) => prev.map((p, idx) => idx === i ? { ...p, ...patch } : p));
  }
  function removePosition(i) {
    setPositions((prev) => prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev);
  }

  // 附加费触发
  const dark = selectedColour !== null ? isDarkHex(resolveHex(colours[selectedColour])) : false;
  const matStr = `${(product.material_tags || []).join(' ')} ${product.name || ''}`.toLowerCase();
  const poly = /poly|polyester/.test(matStr);
  const fleece = /fleece/.test(matStr);
  const longSleeve = /long ?sleeve|l\/s|crew(?!.*neck tee)/.test(`${product.name || ''} ${product.subcategory || ''}`.toLowerCase());

  const jobPositions = positions.map((p) => ({ method: p.method, colours: p.colours, sizeKey: effSize(p), shade: p.shade }));
  const job = useMemo(() => quoteJob({ positions: jobPositions, qty: totalQty || minQty, dark, poly, fleece, longSleeve, specialty }),
    [JSON.stringify(jobPositions), totalQty, minQty, dark, poly, fleece, longSleeve, specialty]);

  const decoPerUnit = job.poa ? 0 : job.perUnit;
  const decoSetup = job.poa ? 0 : job.setup;
  const marginX = product.margin || 1.4;
  const addonPerUnit = FINISHING.reduce((sum, a) => addons[a.key] ? sum + (((a.per_unit_fleece && fleece) ? a.per_unit_fleece : a.per_unit)) : sum, 0) * marginX;
  const addonTotal = addonPerUnit * totalQty;
  const exGst = garmentSubtotal + decoPerUnit * totalQty + decoSetup + addonTotal;
  const gstAmt = (exGst + SHIPPING) * GST;
  const grand = exGst + SHIPPING + gstAmt;
  const blendedUnit = totalQty > 0 ? (garmentSubtotal + (decoPerUnit + addonPerUnit) * totalQty) / totalQty : (baseSell + decoPerUnit + addonPerUnit);

  const canAdd = qtyOk && !job.poa && selectedColour !== null && positions.length >= 1;
  const isValidQty = totalQty > 0;

  function posLabel(p) {
    const mlabel = (availMethods.find((m) => m.key === p.method)?.label || p.method).replace(' (Direct to Garment)', '').replace(' (Direct to Film)', '');
    const extra = p.method === 'screen_print' ? ` ${p.colours}c` : (needsSize(p.method) && effSize(p) ? ` ${effSize(p)}` : '');
    return `${p.position} (${mlabel}${extra})`;
  }

  function handleAdd() {
    if (!canAdd) return;
    const sizeBreakdown = Object.fromEntries(sizes.filter((s) => (sizeQty[s] || 0) > 0).map((s) => [s, sizeQty[s]]));
    const finishingNames = FINISHING.filter((a) => addons[a.key]).map((a) => a.label);
    const decoName = positions.map(posLabel).join(' · ') + (finishingNames.length ? ' + ' + finishingNames.join(', ') : '');
    const item = {
      productId: product.id, productName: product.name, productSlug: product.slug, sku: product.supplier_sku,
      image: bigImage || mainImage,
      colour: selectedColour !== null ? colours[selectedColour]?.name : '',
      qty: totalQty, sizeBreakdown,
      unitPrice: Math.round(blendedUnit * 100) / 100,
      subtotal: Math.round(exGst * 100) / 100,
      shipping: SHIPPING, gst: Math.round(gstAmt * 100) / 100, grand: Math.round(grand * 100) / 100,
      addons: [{ id: 'decoration', name: decoName, perUnit: decoPerUnit, setupFee: decoSetup, setupQty: 1 }],
    };
    addToCart(item);
    setAdded(true); setCartOpen(true); setTimeout(() => setAdded(false), 1800);
  }

  const measurements = product.size_chart?.measurements || [];
  const unit = product.size_chart?.unit || 'cm';
  const shownColours = showAllColours ? colours : colours.slice(0, COLLAPSE_AT);
  const activeColourName = hoverName || (selectedColour !== null ? colours[selectedColour]?.name : '');
  const selName = selectedColour !== null ? colours[selectedColour]?.name : '';

  return (
    <div style={{ fontFamily: FONT, background: '#fff', color: '#1a1a1a' }}>
      {/* breadcrumb */}
      <div className="qp-padx" style={{ background: '#fff', borderBottom: '1px solid #E0DDD7', padding: '12px 40px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', fontSize: '13px' }}>
          <Link href="/catalog" style={{ color: '#1a1a1a', textDecoration: 'none' }}>Catalog</Link>
          <span style={{ color: '#C8C4BC', margin: '0 8px' }}>/</span>
          <span style={{ color: NAVY }}>{product.name}</span>
        </div>
      </div>

      <div className="qp-pdp-main" style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 40px 40px', display: 'grid', gridTemplateColumns: '480px 1fr', gap: '48px', alignItems: 'start' }}>
        {/* LEFT gallery */}
        <div className="qp-pdp-left" style={{ position: 'sticky', top: '70px' }}>
          <div style={{ background: '#fff', border: '1px solid #E0DDD7', borderRadius: '16px', width: '100%', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: '12px' }}>
            {bigImage
              ? <ProductImg src={bigImage} alt={colourImageAlt(selName || '', product.name)} size="detail" eager style={{ width: '94%', height: '94%', objectFit: 'contain' }} />
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

        {/* RIGHT buy box */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, letterSpacing: '0.5px', marginBottom: '8px', background: '#EFF6FF', color: '#1E40AF', border: '1px solid #93C5FD' }}>
              SOLD PRINTED ONLY · MIN {minQty}
            </div>
            <div style={{ fontSize: '12px', color: '#1a1a1a', marginBottom: '6px', fontFamily: '"DM Mono", monospace', letterSpacing: '1px' }}>{product.supplier_sku} · {product.brand}</div>
            <h1 className="qp-pdp-h1" style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '34px', fontWeight: 600, margin: '0 0 8px', color: NAVY, lineHeight: 1.2 }}>{product.name}</h1>
            {fromPrice != null && (
              <div style={{ fontSize: '15px', color: NAVY, fontWeight: 700, margin: '6px 0 0' }}>
                From <span style={{ color: GOLD, fontSize: '22px' }}>{money(fromPrice)}</span>
                <span style={{ fontWeight: 400, fontSize: '12px', color: '#1a1a1a' }}> / unit decorated (ex GST)</span>
              </div>
            )}
            <div style={{ fontSize: '12px', color: '#1a1a1a', marginTop: '4px' }}>Blank garments are not sold — every order includes your logo.</div>
            {product.short_desc && <p style={{ fontSize: '14px', lineHeight: 1.7, margin: '12px 0 0' }}>{product.short_desc}</p>}
          </div>

          {/* STEP 1 colour dots */}
          {colours.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
                <StepLabel num={1} text={`Choose ${product.colour_label || 'Product Colour'} *`} />
                {activeColourName && <span style={{ fontSize: '14px', color: GOLD, fontWeight: 500 }}>{activeColourName}</span>}
              </div>
              <div style={{ display: 'flex', gap: '9px', flexWrap: 'wrap' }}>
                {shownColours.map((c, i) => {
                  const on = selectedColour === i;
                  return (
                    <div key={i} title={c.name} role="button" aria-label={`Select colour ${c.name}`}
                      onClick={() => setSelectedColour(i)}
                      onMouseEnter={() => setHoverName(c.name)} onMouseLeave={() => setHoverName('')}
                      style={{ width: '26px', height: '26px', borderRadius: '50%', cursor: 'pointer', background: resolveHex(c), boxSizing: 'border-box', border: on ? `2px solid ${GOLD}` : '1px solid rgba(0,0,0,.18)', outline: on ? `2px solid ${GOLD}` : 'none', outlineOffset: '1px' }} />
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

          {/* STEP 2 quantity + folded size guide */}
          <div>
            <div style={{ marginBottom: '12px' }}><StepLabel num={2} text="Enter Quantity per Size *" /></div>
            {measurements.length > 0 && (
              <button onClick={() => setShowGuide((v) => !v)} style={{ background: 'none', border: 'none', color: GOLD, fontSize: '13px', fontWeight: 600, cursor: 'pointer', padding: 0, textDecoration: 'underline', fontFamily: FONT, marginBottom: '10px' }}>
                {showGuide ? 'Hide size chart ▲' : 'Size chart ▼'}
              </button>
            )}
            {showGuide && measurements.length > 0 && (
              <div style={{ margin: '0 0 12px', border: '1px solid #E0DDD7', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ background: NAVY, padding: '10px 14px', fontSize: '12px', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.8px', textAlign: 'center' }}>Size Chart ({unit})</div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '12px' }}>
                    <thead>
                      <tr style={{ background: '#FAFAF8' }}>
                        <th style={{ textAlign: 'left', padding: '8px 10px', color: NAVY }}>Measurement</th>
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
                    <div style={{ fontSize: '10px', color: surcharge ? '#B45309' : '#1a1a1a', marginTop: '3px' }}>{money(garmentUnit(s))}{surcharge ? ' ▲' : ''}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ fontSize: '13px', marginTop: '10px' }}>Total: <strong style={{ color: NAVY }}>{totalQty}</strong> units {totalQty > 0 && !qtyOk && <span style={{ color: '#C0392B' }}>(minimum {minQty})</span>}</div>
          </div>

          {/* STEP 3 branding — per position */}
          <div>
            <div style={{ marginBottom: '12px' }}><StepLabel num={3} text="Add Branding Options *" /></div>
            <div style={{ border: '1px solid #E0DDD7', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ background: NAVY, padding: '11px 14px', fontSize: '12px', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.8px', textAlign: 'center' }}>Branding &amp; Decoration</div>
              <div style={{ padding: '14px', background: '#fff', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {positions.map((p, i) => {
                  const rowQuote = quoteDecoration({ method: p.method, colours: p.colours, positions: 1, qty: totalQty || minQty, shade: p.shade, sizeKey: effSize(p), dark, poly });
                  return (
                    <div key={i} style={{ border: '1px solid #E0DDD7', borderRadius: '10px', padding: '12px', background: '#fff' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'flex-end' }}>
                        <Field label="Position">
                          <select value={p.position} onChange={(e) => updatePosition(i, { position: e.target.value })} style={selStyle}>
                            {posOptions.map((o) => <option key={o} value={o} disabled={o !== p.position && usedPositions.includes(o)}>{o}</option>)}
                          </select>
                        </Field>
                        <Field label="Method">
                          <select value={p.method} onChange={(e) => updatePosition(i, { method: e.target.value, sizeKey: '' })} style={selStyle}>
                            {availMethods.map((m) => <option key={m.key} value={m.key}>{m.label}</option>)}
                          </select>
                        </Field>
                        {p.method === 'screen_print' && (
                          <Field label="Print colours">
                            <select value={p.colours} onChange={(e) => updatePosition(i, { colours: Number(e.target.value) })} style={selStyle}>
                              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => <option key={n} value={n}>{n} colour{n > 1 ? 's' : ''}</option>)}
                            </select>
                          </Field>
                        )}
                        {p.method === 'screen_print' && (
                          <Field label="Print size">
                            <div style={{ padding: '8px 10px', border: '1.5px solid #E0DDD7', borderRadius: '8px', fontSize: '13px', fontFamily: FONT, background: '#F4F2EE', color: '#1a1a1a', minWidth: '130px' }}>Up to 35×45cm</div>
                          </Field>
                        )}
                        {p.method === 'dtg' && (
                          <Field label="Garment shade">
                            <select value={p.shade} onChange={(e) => updatePosition(i, { shade: e.target.value })} style={selStyle}>
                              <option value="white">Light / white</option>
                              <option value="dark">Dark</option>
                            </select>
                          </Field>
                        )}
                        {needsSize(p.method) && SIZE_OPTS[p.method] && (
                          <Field label="Print size">
                            <select value={effSize(p)} onChange={(e) => updatePosition(i, { sizeKey: e.target.value })} style={selStyle}>
                              {SIZE_OPTS[p.method].map(([k, lbl]) => <option key={k} value={k}>{lbl}</option>)}
                            </select>
                          </Field>
                        )}
                        {positions.length > 1 && (
                          <button onClick={() => removePosition(i)} aria-label="Remove position" style={{ marginLeft: 'auto', background: 'none', border: '1.5px solid #E0DDD7', color: '#C0392B', borderRadius: '8px', width: '34px', height: '34px', cursor: 'pointer', fontSize: '16px' }}>×</button>
                        )}
                      </div>
                      <div style={{ fontSize: '11px', color: rowQuote.poa ? '#C0392B' : '#1a1a1a', marginTop: '8px' }}>
                        {rowQuote.poa ? 'This size = request a quote' : `≈ ${money(rowQuote.perUnit)}/unit · setup ${money(rowQuote.setup)}`}
                      </div>
                    </div>
                  );
                })}
                {positions.length < posOptions.length && (
                  <button onClick={addPosition} style={{ alignSelf: 'flex-start', background: '#fff', border: `1.5px dashed ${GOLD}`, color: NAVY, borderRadius: '10px', padding: '9px 16px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: FONT }}>
                    + Add a print position
                  </button>
                )}
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#1a1a1a', cursor: 'pointer' }}>
                  <input type="checkbox" checked={specialty} onChange={(e) => setSpecialty(e.target.checked)} />
                  Puff / metallic / specialty ink (price on application)
                </label>
                {dark && !specialty && <div style={{ fontSize: '11px', color: '#B45309' }}>Dark garment — screen print dark-base surcharge (+$1.00/print) applied.</div>}
                <div style={{ fontSize: '11px', color: '#1a1a1a' }}>Screen print area up to 35×45cm (adult tee; smaller for kids). Oversize / all-over / wrap-around = request a quote.</div>
              </div>
            </div>
          </div>

          {/* Add-ons & Extras (finishing, D 组) */}
          <div>
            <div style={{ border: '1px solid #E0DDD7', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ background: NAVY, padding: '11px 14px', fontSize: '12px', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.8px', textAlign: 'center' }}>Add-ons &amp; Extras (optional)</div>
              <div style={{ padding: '14px', background: '#fff', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {FINISHING.map((a) => {
                  const price = ((a.per_unit_fleece && fleece) ? a.per_unit_fleece : a.per_unit) * marginX;
                  return (
                    <label key={a.key} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#1a1a1a', cursor: 'pointer' }}>
                      <input type="checkbox" checked={!!addons[a.key]} onChange={() => toggleAddon(a.key)} />
                      <span style={{ flex: 1 }}>{a.label}</span>
                      <span style={{ color: NAVY, fontWeight: 600 }}>+{money(price)}/unit</span>
                    </label>
                  );
                })}
                <div style={{ fontSize: '11px', color: '#1a1a1a', borderTop: '1px solid #F0EEED', paddingTop: '8px', marginTop: '2px' }}>
                  Need re-labelling or neck-tag printing? Those start at 100 units and vary by label type — <Link href="/contact" style={{ color: GOLD, fontWeight: 600 }}>request a quote</Link>.
                </div>
              </div>
            </div>
          </div>

          {/* navy YOUR SELECTION summary */}
          {isValidQty && !job.poa && (
            <div style={{ background: NAVY, borderRadius: '16px', padding: '22px', color: '#fff' }}>
              <div style={{ marginBottom: '14px', paddingBottom: '14px', borderBottom: '1px solid rgba(255,255,255,.12)' }}>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Your Selection</div>
                <div style={{ fontSize: '14px', lineHeight: 1.6 }}>
                  {selName ? <span><strong>{selName}</strong> · </span> : null}
                  Qty <strong>{Number(totalQty).toLocaleString('en-AU')}</strong> · {positions.map(posLabel).join(' · ')}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Unit price (excl. GST)</div>
                  <div style={{ fontFamily: '"DM Mono", monospace', fontSize: '32px', fontWeight: 500, color: GOLD }}>{money(blendedUnit)}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Subtotal (excl. GST)</div>
                  <div style={{ fontFamily: '"DM Mono", monospace', fontSize: '26px', fontWeight: 500 }}>{aud(exGst)}</div>
                </div>
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,.12)', margin: '0 0 14px' }} />
              <PriceRow label="Garments" value={aud(garmentSubtotal)} />
              <PriceRow label="Decoration" value={aud(decoPerUnit * totalQty)} />
              <PriceRow label="Setup (one-off)" value={aud(decoSetup)} />
              {addonTotal > 0 && <PriceRow label="Finishing" value={aud(addonTotal)} />}
              <PriceRow label="Shipping & Handling" value={`$${SHIPPING.toFixed(2)}`} />
              <PriceRow label="GST (10%)" value={aud(gstAmt)} />
              <PriceRow label="Total (incl. GST)" value={aud(grand)} bold />
              <div style={{ fontSize: '11px', marginTop: '8px' }}>All prices in AUD. GST invoice provided with order.</div>
            </div>
          )}
          {job.poa && isValidQty && (
            <div style={{ background: '#FFF8ED', border: '1px solid #FCD34D', borderRadius: '12px', padding: '14px 16px', fontSize: '13px', color: '#92400E' }}>
              This configuration is price-on-application. Choose your colour &amp; sizes and request a quote — we&apos;ll confirm pricing.
            </div>
          )}

          {/* actions */}
          <button onClick={canAdd ? handleAdd : undefined} disabled={!canAdd}
            style={{ width: '100%', background: canAdd ? GOLD : '#C8C4BC', color: '#fff', border: 'none', borderRadius: '12px', padding: '18px', fontSize: '18px', fontWeight: 700, cursor: canAdd ? 'pointer' : 'not-allowed', fontFamily: FONT, boxShadow: canAdd ? '0 4px 16px rgba(201,169,110,.4)' : 'none' }}>
            {added ? '✅ Added to Cart!' : !isValidQty ? 'Enter quantity to see pricing' : (colours.length > 0 && selectedColour === null) ? 'Choose a colour to continue' : job.poa ? 'Request a quote for pricing' : `Add to Cart  —  ${aud(grand)} incl. GST`}
          </button>
          <Link href="/contact" style={{ width: '100%', boxSizing: 'border-box', background: NAVY, color: '#fff', border: 'none', borderRadius: '12px', padding: '16px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', fontFamily: FONT, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', textDecoration: 'none' }}>
            <span style={{ fontSize: '18px' }}>💬</span> Get a Quote / Ask a Question
          </Link>
        </div>
      </div>

      {/* trust badges */}
      <div style={{ background: '#fff', borderTop: '1px solid #E0DDD7', padding: '32px 40px 8px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div className="qp-pdp-benefits" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px', marginBottom: '24px' }}>
            {[
              { icon: '🎨', title: 'Free Digital Proof', sub: 'See it before we make it' },
              { icon: '🚚', title: '$30 Flat Shipping', sub: 'Australia-wide, no surprises' },
              { icon: '✅', title: 'Quality Guarantee', sub: 'We stand behind every order' },
              { icon: '🏆', title: "13 Years' Experience", sub: "You're in good hands" },
            ].map((b) => (
              <div key={b.title} style={{ background: '#fff', border: `1.5px solid ${GOLD}40`, borderRadius: '12px', padding: '16px 10px', textAlign: 'center', borderTop: `3px solid ${GOLD}` }}>
                <div style={{ fontSize: '26px', marginBottom: '8px' }}>{b.icon}</div>
                <div style={{ fontSize: '13px', color: NAVY, fontWeight: 700, marginBottom: '4px' }}>{b.title}</div>
                <div style={{ fontSize: '11px', color: '#1a1a1a', lineHeight: 1.4 }}>{b.sub}</div>
              </div>
            ))}
          </div>

          {/* tabs */}
          <div style={{ border: '1px solid #E0DDD7', borderRadius: '10px', overflow: 'hidden', background: '#fff', marginBottom: '40px' }}>
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
                    {Array.isArray(product.specs) && product.specs.filter((x) => x && x.name && x.value).length > 0 && (
                      <div style={{ border: '1px solid #E0DDD7', borderRadius: '8px', overflow: 'hidden' }}>
                        <div style={{ background: NAVY, padding: '9px 12px', fontSize: '12px', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Product Details</div>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                          <tbody>
                            {product.specs.filter((x) => x && x.name && x.value).map((x, i) => (
                              <tr key={i} style={{ borderBottom: '1px solid #F0EEED' }}>
                                <td style={{ padding: '9px 12px', fontWeight: 600, color: NAVY, background: '#FAFAF8', verticalAlign: 'top', whiteSpace: 'nowrap' }}>{x.name}</td>
                                <td style={{ padding: '9px 12px', color: '#1a1a1a', lineHeight: 1.6 }}>{x.value}</td>
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

              {activeTab === 'Sample Policy' && (
                <div style={{ maxWidth: '760px' }}>
                  <p style={{ margin: '0 0 16px', fontSize: '15px', lineHeight: 1.7 }}>Before committing to a bulk order, we offer several ways to verify quality, colour, and branding — so you can order with confidence.</p>
                  {[
                    { num: '1', title: 'Undecorated Physical Sample', desc: 'Receive an actual product to check material and colour in person.', points: ['Sample cost + shipping applies', 'Sample cost refunded on bulk order', 'Shipping fee is non-refundable'] },
                    { num: '2', title: 'Branded Sample (Custom Logo)', desc: 'See exactly how your logo looks before full production.', points: ['Charged at unit price + setup + shipping', 'Sample cost refunded on bulk order', 'Setup and shipping non-refundable'] },
                  ].map((s) => (
                    <div key={s.num} style={{ marginBottom: '16px', padding: '16px', background: '#fff', borderRadius: '10px', borderLeft: `3px solid ${GOLD}` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: NAVY, color: '#fff', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{s.num}</div>
                        <div style={{ fontWeight: 700, color: NAVY, fontSize: '15px', fontFamily: '"Cormorant Garamond", serif' }}>{s.title}</div>
                      </div>
                      <p style={{ margin: '0 0 10px', fontSize: '13px' }}>{s.desc}</p>
                      <ul style={{ margin: 0, paddingLeft: '18px' }}>{s.points.map((p, i) => <li key={i} style={{ marginBottom: '4px', fontSize: '13px' }}>{p}</li>)}</ul>
                    </div>
                  ))}
                  <div style={{ padding: '14px 16px', background: `${GOLD}15`, borderRadius: '10px', border: `1px solid ${GOLD}40` }}>
                    <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.6 }}><strong>Not ready for a physical sample?</strong> Every order includes a free digital mockup — you approve it before we print.</p>
                  </div>
                </div>
              )}

              {activeTab === 'Mockups & Artwork' && (
                <div style={{ maxWidth: '760px' }}>
                  <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '22px', color: NAVY, margin: '0 0 10px' }}>See your logo before we print</h3>
                  <p style={{ margin: '0 0 16px', lineHeight: 1.7 }}>Every order includes a <strong>free digital mockup</strong> from our in-house design team. <strong>Production only begins after you approve it in writing.</strong> No surprises, no guesswork.</p>
                  <h4 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '17px', color: NAVY, margin: '0 0 12px' }}>Artwork Requirements</h4>
                  <ul style={{ margin: '0 0 16px', paddingLeft: '20px' }}>
                    <li style={{ marginBottom: '8px' }}>Preferred formats: <strong>AI, EPS, PDF</strong> (vector files)</li>
                    <li style={{ marginBottom: '8px' }}>Also accepted: <strong>PNG or JPG</strong> at minimum 300dpi</li>
                    <li style={{ marginBottom: '8px' }}>Provide <strong>PMS colour codes</strong> if colour matching is required</li>
                    <li>Screen print area up to 35×45cm (adult); DTG 40×50cm; DTF 35×40cm; embroidery up to 12×12cm</li>
                  </ul>
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
                  <p style={{ margin: '10px 0 0', fontSize: '12px', color: '#1a1a1a' }}>Production lead time is quoted per order after artwork approval. Delivery times are estimates only.</p>
                </div>
              )}

              {activeTab === 'Ordering Process' && (
                <div>
                  <p style={{ margin: '0 0 20px', fontSize: '14px' }}>Four simple steps from order to delivery — your branded products, done right.</p>
                  <div className="qp-steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                    {[['🛒', 'Place Your Order', 'Select colour, sizes & decoration, then Add to Cart or Get a Quote.'], ['🎨', 'Artwork & Mockup', 'Upload your logo. We create a free digital mockup for approval.'], ['⚙️', 'Approve & Produce', 'Approve your proof in writing and production begins.'], ['📦', 'Delivery', 'Dispatched Australia-wide, $30 flat rate, tracked to your door.']].map(([icon, title, desc], i) => (
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
      </div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}

const selStyle = { padding: '8px 10px', border: '1.5px solid #C8C4BC', borderRadius: '8px', fontSize: '13px', fontFamily: FONT, background: '#fff', color: NAVY, minWidth: '130px' };

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
      <span style={{ fontSize: '11px', fontWeight: 700, color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
      {children}
    </label>
  );
}

function PriceRow({ label, value, bold }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontWeight: bold ? 700 : 400, marginBottom: '8px', marginTop: bold ? '2px' : 0, paddingTop: bold ? '12px' : 0, borderTop: bold ? '1px solid rgba(255,255,255,.18)' : 'none', fontFamily: '"DM Sans", sans-serif' }}>
      <span style={{ color: '#fff', fontSize: bold ? '15px' : '13px' }}>{label}</span>
      <span style={{ color: bold ? GOLD : '#fff', fontFamily: bold ? '"DM Mono", monospace' : 'inherit', fontSize: bold ? '30px' : '13px', fontWeight: bold ? 700 : 400, lineHeight: 1 }}>{value}</span>
    </div>
  );
}

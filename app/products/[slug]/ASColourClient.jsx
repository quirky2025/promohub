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
const CRED_LABEL = { amfori: 'amfori', vegan: 'Vegan', upf50plus: 'UPF 50+', australian_cotton: 'Australian Cotton' };
const CRED_ASSET = { amfori: '/credentials/cert-amfori.webp', vegan: '/credentials/cert-vegan.webp', upf50plus: '/credentials/upf50plus.svg', australian_cotton: '/credentials/australian_cotton.svg' };
// Gildan Brands (Gildan / Comfort Colors / American Apparel) — same 4 brand-level certs, fixed by supplier.
const GILDAN_CREDS = [
  { src: '/credentials/standard100.png', alt: 'OEKO-TEX Standard 100' },
  { src: '/credentials/wrap.png', alt: 'WRAP Certified' },
  { src: '/credentials/sedex.png', alt: 'Sedex Member' },
  { src: '/credentials/fairlabor.png', alt: 'Fair Labor Association' },
];

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

// 完整标题:品牌 + 名(去尾部通用词) + 性别所有格 + 品类单数。
const CAT_SINGULAR = { 'T-Shirts': 'T-shirt', 'Tees': 'T-shirt', 'Hoodies': 'Hoodie', 'Singlets': 'Singlet', 'Polos': 'Polo', 'Jumpers': 'Jumper', 'Sweatshirts': 'Sweatshirt', 'Jackets': 'Jacket', 'Vests': 'Vest', 'Tanks': 'Tank', 'Bags': 'Bag', 'Hats': 'Hat', 'Caps': 'Cap' };
const TYPE_WORD = /\s+(tee|t-shirt|hoodie|singlet|polo|jumper|jacket|crew|sweatshirt|sweat|tank|vest|cap|hat|tote|bag)$/i;
function fullTitle(product) {
  const brand = (product.brand || 'AS Colour').trim();
  const name = (product.name || '').trim();
  const g = (product.gender || '').trim();
  const isMW = /^(men|women)('?s)?$/i.test(g);
  // 只有 Men/Women 才做「去尾词 + 性别所有格 + 品类」;其它(unisex/kids/包/帽)= 品牌 + 原名
  if (!isMW) {
    return name.toLowerCase().startsWith(brand.toLowerCase()) ? name : (brand + ' ' + name).trim();
  }
  const core = name.replace(TYPE_WORD, '').trim() || name;
  const gender = g.replace(/s$/, '') + "'s";
  const cat = CAT_SINGULAR[product.category] || (product.category || '').replace(/s$/, '');
  return [brand, core, gender, cat].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
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
  const [quoteOpen, setQuoteOpen] = useState(false);
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

  const [sizeQty, setSizeQty] = useState(() => (Array.isArray(sizes) && sizes.length === 1) ? { [sizes[0]]: (product.min_qty || MIN_QTY) } : {});
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
  const credentials = useMemo(() => {
    const sp = (Array.isArray(product.specs) ? product.specs : []).find((x) => x && x.name === 'Credentials');
    if (!sp || !sp.value) return [];
    return String(sp.value).split(',').map((t) => t.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')).filter(Boolean).map((k) => ({ key: k, label: CRED_LABEL[k] || k.replace(/_/g, ' '), src: CRED_ASSET[k] || ('/credentials/' + k + '.svg') }));
  }, [product.specs]);
  const longSleeve = /long ?sleeve|l\/s|crew(?!.*neck tee)/.test(`${product.name || ''} ${product.subcategory || ''}`.toLowerCase());

  const jobPositions = positions.map((p) => ({ method: p.method, colours: p.colours, sizeKey: effSize(p), shade: p.shade }));
  const job = useMemo(() => quoteJob({ positions: jobPositions, qty: totalQty || minQty, dark, poly, fleece, longSleeve, specialty }),
    [JSON.stringify(jobPositions), totalQty, minQty, dark, poly, fleece, longSleeve, specialty]);

  const decoPerUnit = job.poa ? 0 : job.perUnit;
  const decoSetup = job.poa ? 0 : job.setup;
  const addonPerUnit = FINISHING.reduce((sum, a) => addons[a.key] ? sum + a.per_unit : sum, 0);
  const addonTotal = addonPerUnit * totalQty;
  const exGst = garmentSubtotal + decoPerUnit * totalQty + decoSetup + addonTotal;
  const gstAmt = (exGst + SHIPPING) * GST;
  const grand = exGst + SHIPPING + gstAmt;
  const blendedUnit = totalQty > 0 ? (garmentSubtotal + (decoPerUnit + addonPerUnit) * totalQty) / totalQty : (baseSell + decoPerUnit + addonPerUnit);
  const quoteSelection = (selectedColour !== null && colours[selectedColour] ? colours[selectedColour].name + ' \u00b7 ' : '') + 'Qty ' + (totalQty || minQty) + (positions.length ? ' \u00b7 ' + positions.map(posLabel).join(' \u00b7 ') : '') + (FINISHING.filter((a) => addons[a.key]).length ? ' \u00b7 Add-ons: ' + FINISHING.filter((a) => addons[a.key]).map((a) => a.label).join(', ') : '');

  const canAdd = qtyOk && !job.poa && selectedColour !== null && positions.length >= 1;
  const isValidQty = totalQty > 0;

  function posLabel(p) {
    const mlabel = (availMethods.find((m) => m.key === p.method)?.label || p.method).replace(' (Direct to Garment)', '').replace(' (Direct to Film)', '');
    const szOpt = (SIZE_OPTS[p.method] || []).find(([k]) => k === effSize(p));
    const szTxt = szOpt ? szOpt[1].split(' ')[0] : effSize(p);
    const extra = p.method === 'screen_print' ? ` ${p.colours}c` : (needsSize(p.method) && szTxt ? ` ${szTxt}` : '');
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
    <div style={{ fontFamily: FONT, background: '#fff', color: '#000000' }}>
      {/* breadcrumb */}
      <div className="qp-padx" style={{ background: '#fff', borderBottom: '1px solid #E0DDD7', padding: '12px 40px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', fontSize: '13px' }}>
          <Link href="/" style={{ color: '#000000', textDecoration: 'none' }}>Home</Link>
          {product.category && (
            <>
              <span style={{ color: '#C8C4BC', margin: '0 8px' }}>/</span>
              <span style={{ color: '#000000' }}>{product.category}</span>
            </>
          )}
          {product.subcategory && (
            <>
              <span style={{ color: '#C8C4BC', margin: '0 8px' }}>/</span>
              <span style={{ color: '#000000' }}>{product.subcategory}</span>
            </>
          )}
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
            <div style={{ fontSize: '12px', color: '#000000', marginBottom: '6px', fontFamily: '"DM Mono", monospace', letterSpacing: '1px' }}>{product.supplier_sku} · {product.brand}</div>
            <h1 className="qp-pdp-h1" style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '34px', fontWeight: 600, margin: '0 0 8px', color: NAVY, lineHeight: 1.2 }}>{fullTitle(product)}</h1>
            {fromPrice != null && (
              <div style={{ fontSize: '15px', color: NAVY, fontWeight: 700, margin: '6px 0 0' }}>
                From <span style={{ color: GOLD, fontSize: '22px' }}>{money(fromPrice)}</span>
                <span style={{ fontWeight: 400, fontSize: '12px', color: '#000000' }}> / unit decorated (ex GST)</span>
              </div>
            )}
            {product.seo_description && <p style={{ fontSize: '14px', lineHeight: 1.7, margin: '12px 0 0' }}>{product.seo_description}</p>}
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
            <div style={{ marginBottom: '12px' }}><StepLabel num={2} text={sizes.length === 1 ? "Enter Quantity *" : "Enter Quantity per Size *"} /></div>
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
            {sizes.length === 1 ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                <input type="number" min={minQty} value={sizeQty[sizes[0]] || ''} onChange={(e) => setQtyFor(sizes[0], e.target.value)} placeholder={String(minQty)}
                  style={{ width: '140px', padding: '14px 12px', border: '1.5px solid #C8C4BC', borderRadius: '10px', fontSize: '26px', fontWeight: 700, textAlign: 'center', fontFamily: FONT, outline: 'none', background: '#fff', color: NAVY, boxSizing: 'border-box' }} />
                <div style={{ fontSize: '13px', color: '#000000', fontWeight: 500 }}>{money(garmentUnit(sizes[0]))} / unit · min {minQty}</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {sizes.map((s) => {
                  const surcharge = sizePricing[s] != null && Number(sizePricing[s]) !== baseSell;
                  return (
                    <div key={s} style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: NAVY, marginBottom: '5px' }}>{s}</div>
                      <input type="number" min="0" value={sizeQty[s] || ''} onChange={(e) => setQtyFor(s, e.target.value)} placeholder="0"
                        style={{ width: '68px', padding: '11px 6px', border: '1.5px solid #C8C4BC', borderRadius: '10px', fontSize: '18px', fontWeight: 700, textAlign: 'center', fontFamily: FONT, outline: 'none', background: '#fff', color: NAVY, boxSizing: 'border-box' }} />
                      <div style={{ fontSize: '11px', color: surcharge ? '#B45309' : '#000000', marginTop: '4px' }}>{money(garmentUnit(s))}{surcharge ? ' ▲' : ''}</div>
                    </div>
                  );
                })}
              </div>
            )}
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
                            <div style={{ padding: '8px 10px', border: '1.5px solid #E0DDD7', borderRadius: '8px', fontSize: '13px', fontFamily: FONT, background: '#F4F2EE', color: '#000000', minWidth: '130px' }}>Up to 35×45cm</div>
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
                      <div style={{ fontSize: '11px', color: rowQuote.poa ? '#C0392B' : '#000000', marginTop: '8px' }}>
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
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#000000', cursor: 'pointer' }}>
                  <input type="checkbox" checked={specialty} onChange={(e) => setSpecialty(e.target.checked)} />
                  Puff / metallic / specialty ink (price on application)
                </label>
                {dark && !specialty && <div style={{ fontSize: '11px', color: '#B45309' }}>Dark garment — screen print dark-base surcharge (+$1.00/print) applied.</div>}
                <div style={{ fontSize: '11px', color: '#000000' }}>Screen print area up to 35×45cm (adult tee; smaller for kids). Oversize / all-over / wrap-around = request a quote.</div>
              </div>
            </div>
          </div>

          {/* STEP 4: Add-on Options(finishing D 组)— 原版 toggle 样式 */}
          <div>
            <div style={{ marginBottom: '12px' }}><StepLabel num={4} text="Select Add-on Options" /></div>
            <div style={{ border: '1px solid #E0DDD7', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ background: NAVY, padding: '11px 14px', fontSize: '12px', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.8px', textAlign: 'center' }}>Add-ons &amp; Extras</div>
              <div style={{ background: '#fff' }}>
                {FINISHING.map((a) => {
                  const on = !!addons[a.key];
                  return (
                    <div key={a.key} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderBottom: '1px solid #F0EEED' }}>
                      <label style={{ position: 'relative', width: '44px', height: '24px', cursor: 'pointer', display: 'inline-block', flexShrink: 0 }}>
                        <input type="checkbox" checked={on} onChange={() => toggleAddon(a.key)} style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }} />
                        <span style={{ position: 'absolute', inset: 0, background: on ? GOLD : '#C8C4BC', borderRadius: '12px', transition: 'background .2s' }} />
                        <span style={{ position: 'absolute', top: '3px', left: on ? '23px' : '3px', width: '18px', height: '18px', background: '#fff', borderRadius: '50%', transition: 'left .2s', boxShadow: '0 1px 3px rgba(0,0,0,.2)' }} />
                      </label>
                      <span style={{ flex: 1, fontSize: '13px', fontWeight: 500, color: NAVY }}>{a.label}</span>
                      <span style={{ fontSize: '13px', color: NAVY, fontWeight: 600 }}>+{money(a.per_unit)}/unit</span>
                    </div>
                  );
                })}
                <div style={{ fontSize: '11px', color: '#000000', padding: '10px 14px' }}>
                  Need re-labelling or neck-tag printing? Those start at 100 units and vary by label type — <button onClick={() => setQuoteOpen(true)} style={{ background: 'none', border: 'none', color: GOLD, fontWeight: 600, cursor: 'pointer', padding: 0, font: 'inherit', textDecoration: 'underline' }}>request a quote</button>.
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
          <div style={{ fontSize: '13px', color: '#000', fontWeight: 500 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span aria-hidden="true">🕒</span> Production: 7–10 business days (after artwork approval)</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}><span aria-hidden="true">⚡</span> Rush order available — <button onClick={() => setQuoteOpen(true)} style={{ background: 'none', border: 'none', color: GOLD, fontWeight: 600, cursor: 'pointer', padding: 0, font: 'inherit', textDecoration: 'underline' }}>ask us for a faster turnaround</button>.</div>
          </div>
          <button onClick={canAdd ? handleAdd : undefined} disabled={!canAdd}
            style={{ width: '100%', background: canAdd ? GOLD : '#C8C4BC', color: '#fff', border: 'none', borderRadius: '12px', padding: '18px', fontSize: '18px', fontWeight: 700, cursor: canAdd ? 'pointer' : 'not-allowed', fontFamily: FONT, boxShadow: canAdd ? '0 4px 16px rgba(201,169,110,.4)' : 'none' }}>
            {added ? '✅ Added to Cart!' : !isValidQty ? 'Enter quantity to see pricing' : (colours.length > 0 && selectedColour === null) ? 'Choose a colour to continue' : job.poa ? 'Request a quote for pricing' : `Add to Cart  —  ${aud(grand)} incl. GST`}
          </button>
          <button onClick={() => setQuoteOpen(true)} style={{ width: '100%', boxSizing: 'border-box', background: NAVY, color: '#fff', border: 'none', borderRadius: '12px', padding: '16px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', fontFamily: FONT, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <span style={{ fontSize: '18px' }}>💬</span> Get a Quote / Ask a Question
          </button>
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
                <div style={{ fontSize: '11px', color: '#000000', lineHeight: 1.4 }}>{b.sub}</div>
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
            <div style={{ padding: '24px', fontSize: '14px', lineHeight: 1.8, color: '#000000' }}>
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
                    {credentials.length > 0 && (
                      <div style={{ marginTop: '4px' }}>
                        <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '18px', color: NAVY, margin: '0 0 12px' }}>Credentials</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px', alignItems: 'center' }}>
                          {credentials.map((c) => (
                            <img key={c.key} src={c.src} alt={c.label} title={c.label} style={{ height: '46px', width: 'auto', objectFit: 'contain' }} />
                          ))}
                        </div>
                      </div>
                    )}
                    {product.supplier === 'Gildan Brands' && (
                      <div style={{ marginTop: '4px' }}>
                        <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '18px', color: NAVY, margin: '0 0 12px' }}>Credentials</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px', alignItems: 'center' }}>
                          {GILDAN_CREDS.map((c) => (
                            <img key={c.src} src={c.src} alt={c.alt} title={c.alt} style={{ height: '46px', width: 'auto', objectFit: 'contain' }} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    {Array.isArray(product.specs) && product.specs.filter((x) => x && x.name && x.value && x.name !== 'Credentials').length > 0 && (
                      <div style={{ border: '1px solid #E0DDD7', borderRadius: '8px', overflow: 'hidden' }}>
                        <div style={{ background: NAVY, padding: '9px 12px', fontSize: '12px', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Product Details</div>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                          <tbody>
                            {product.specs.filter((x) => x && x.name && x.value && x.name !== 'Credentials').map((x, i) => (
                              <tr key={i} style={{ borderBottom: '1px solid #F0EEED' }}>
                                <td style={{ padding: '9px 12px', fontWeight: 600, color: NAVY, background: '#FAFAF8', verticalAlign: 'top', whiteSpace: 'nowrap' }}>{x.name}</td>
                                <td style={{ padding: '9px 12px', color: '#000000', lineHeight: 1.6 }}>{x.name === 'Care' ? String(x.value).split(/\.\s+/).map((t) => t.trim().replace(/\.$/, '')).filter(Boolean).map((t, j) => <div key={j} style={{ marginBottom: '2px' }}>{t}</div>) : x.value}</td>
                              </tr>
                            ))}
                            <tr style={{ borderBottom: '1px solid #F0EEED' }}>
                              <td style={{ padding: '9px 12px', fontWeight: 600, color: NAVY, background: '#FAFAF8', verticalAlign: 'top', whiteSpace: 'nowrap' }}>Lead time</td>
                              <td style={{ padding: '9px 12px', color: '#000000', lineHeight: 1.6, fontWeight: 500 }}>7–10 business days (after artwork approval)</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}
                    {product.supplier === 'Gildan Brands' && product.specs && !Array.isArray(product.specs) && (() => {
                      const s = product.specs;
                      const material = [s.composition, s.weight_gsm ? `${s.weight_gsm} GSM` : ''].filter(Boolean).join(' · ');
                      const rows = [['Material', material], ['Fit', s.fit], ['Care', s.care]].filter(([, v]) => v && String(v).trim());
                      return (
                        <div style={{ border: '1px solid #E0DDD7', borderRadius: '8px', overflow: 'hidden' }}>
                          <div style={{ background: NAVY, padding: '9px 12px', fontSize: '12px', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Product Details</div>
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                            <tbody>
                              {rows.map(([k, v], i) => (
                                <tr key={i} style={{ borderBottom: '1px solid #F0EEED' }}>
                                  <td style={{ padding: '9px 12px', fontWeight: 600, color: NAVY, background: '#FAFAF8', verticalAlign: 'top', whiteSpace: 'nowrap' }}>{k}</td>
                                  <td style={{ padding: '9px 12px', color: '#000000', lineHeight: 1.6 }}>{v}</td>
                                </tr>
                              ))}
                              <tr style={{ borderBottom: '1px solid #F0EEED' }}>
                                <td style={{ padding: '9px 12px', fontWeight: 600, color: NAVY, background: '#FAFAF8', verticalAlign: 'top', whiteSpace: 'nowrap' }}>Lead time</td>
                                <td style={{ padding: '9px 12px', color: '#000000', lineHeight: 1.6, fontWeight: 500 }}>7–10 business days (after artwork approval)</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      );
                    })()}
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
                  <p style={{ margin: '10px 0 0', fontSize: '12px', color: '#000000' }}>Production lead time is quoted per order after artwork approval. Delivery times are estimates only.</p>
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
                        <div style={{ fontSize: '12px', color: '#000000', lineHeight: 1.5 }}>{desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {quoteOpen && (
        <ASQuoteModal product={product} selection={quoteSelection} colourName={selectedColour !== null ? (colours[selectedColour] && colours[selectedColour].name) : ''} qty={totalQty || minQty} unitPrice={blendedUnit} subtotal={exGst} shipping={SHIPPING} gst={gstAmt} total={grand} onClose={() => setQuoteOpen(false)} />
      )}
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
      <span style={{ fontSize: '11px', fontWeight: 700, color: '#000000', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
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


function SectionHead({ num, text }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
      <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: GOLD, color: '#fff', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{num}</div>
      <div style={{ fontSize: '13px', fontWeight: 700, color: NAVY, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{text}</div>
    </div>
  );
}

function ASQuoteModal({ product, selection, colourName, qty, unitPrice, subtotal, shipping, gst, total, onClose }) {
  const STATES = ['ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA'];
  const [form, setForm] = useState({ qty: String(qty || ''), name: '', company: '', email: '', phone: '', street: '', street2: '', suburb: '', state: '', postcode: '', requiredDate: '', notes: '' });
  const [status, setStatus] = useState('idle');
  const ch = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const canSubmit = form.name && form.email;
  async function submit() {
    if (!canSubmit) return;
    setStatus('sending');
    const deliveryAddress = [form.street, form.street2, form.suburb, form.state, form.postcode, 'Australia'].filter(Boolean).join(', ');
    const requiredDate = form.requiredDate ? new Date(form.requiredDate + 'T00:00:00').toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
    try {
      const res = await fetch('/api/quote', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, company: form.company, email: form.email, phone: form.phone, requiredDate, deliveryAddress, notes: form.notes, colour: colourName || '', brandingSummary: selection, productName: product.name, productSku: product.supplier_sku, unitPrice, subtotal, shipping, gst, total, qty: parseInt(form.qty, 10) || qty }),
      });
      setStatus(res.ok ? 'success' : 'error');
    } catch (e) { setStatus('error'); }
  }
  const inputStyle = { width: '100%', padding: '10px 14px', border: '1.5px solid #E0DDD7', borderRadius: '8px', fontSize: '14px', fontFamily: FONT, color: '#000', outline: 'none', boxSizing: 'border-box', background: '#fff' };
  const labelStyle = { fontSize: '11px', fontWeight: 700, color: NAVY, marginBottom: '6px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.08em' };
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(27,42,74,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '580px', maxHeight: '92vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(27,42,74,0.3)' }}>
        <div style={{ padding: '22px 28px 16px', borderBottom: '1px solid #E0DDD7', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'sticky', top: 0, background: '#fff', zIndex: 10 }}>
          <div>
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '26px', fontWeight: 600, color: NAVY, margin: '0 0 3px' }}>Get a Quote</h2>
            <p style={{ fontSize: '13px', color: '#000', margin: 0 }}>{product.name}</p>
          </div>
          <button onClick={onClose} aria-label="Close" style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#000', lineHeight: 1 }}>×</button>
        </div>
        <div style={{ padding: '20px 28px 28px', fontFamily: FONT }}>
          {status === 'success' ? (
            <div style={{ textAlign: 'center', padding: '30px 0' }}>
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>✅</div>
              <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '22px', color: NAVY, margin: '0 0 8px' }}>Quote request sent</h3>
              <p style={{ fontSize: '14px', color: '#000' }}>Thanks {(form.name || '').split(' ')[0]} — our team will get back to you shortly.</p>
              <button onClick={onClose} style={{ marginTop: '16px', background: NAVY, color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 24px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: FONT }}>Close</button>
            </div>
          ) : (
            <>
              <SectionHead num={1} text="Your Selection" />
              <div style={{ border: '1px solid #E0DDD7', borderRadius: '12px', padding: '14px 16px', marginBottom: '20px' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: NAVY, marginBottom: '8px' }}>{product.name}</div>
                <div style={{ fontSize: '13px', color: '#000', lineHeight: 1.6 }}>{selection}</div>
                {total > 0 && <div style={{ fontSize: '12px', color: '#000', marginTop: '6px' }}>Est. {money(unitPrice)}/unit · total {aud(total)} incl GST</div>}
                <label style={{ ...labelStyle, marginTop: '12px' }}>Quantity *</label>
                <input name="qty" type="number" min="1" value={form.qty} onChange={ch} style={inputStyle} />
                <div style={{ fontSize: '12px', color: '#000', marginTop: '8px' }}>Colour, sizes and decoration follow your selection on the product page. Note any changes below.</div>
              </div>
              <SectionHead num={2} text="Your Details" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
                <div><label style={labelStyle}>Your name *</label><input name="name" value={form.name} onChange={ch} placeholder="Jane Smith" style={inputStyle} /></div>
                <div><label style={labelStyle}>Company</label><input name="company" value={form.company} onChange={ch} placeholder="Acme Corp" style={inputStyle} /></div>
                <div><label style={labelStyle}>Email *</label><input name="email" type="email" value={form.email} onChange={ch} placeholder="jane@company.com" style={inputStyle} /></div>
                <div><label style={labelStyle}>Phone</label><input name="phone" value={form.phone} onChange={ch} placeholder="04xx xxx xxx" style={{ ...inputStyle, fontFamily: '"DM Mono", monospace' }} /></div>
              </div>
              <SectionHead num={3} text="Delivery Address" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                <input name="street" value={form.street} onChange={ch} placeholder="Address Line 1 (e.g. 123 George Street)" style={inputStyle} />
                <input name="street2" value={form.street2} onChange={ch} placeholder="Address Line 2 (Suite, Level, Unit — optional)" style={inputStyle} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <input name="suburb" value={form.suburb} onChange={ch} placeholder="Suburb" style={inputStyle} />
                  <select name="state" value={form.state} onChange={ch} style={inputStyle}><option value="">State / Territory</option>{STATES.map((st) => <option key={st} value={st}>{st}</option>)}</select>
                </div>
                <input name="postcode" value={form.postcode} onChange={ch} placeholder="Postcode" style={{ ...inputStyle, maxWidth: '180px' }} />
              </div>
              <SectionHead num={4} text="More From You" />
              <div style={{ marginBottom: '12px' }}><label style={labelStyle}>Required date</label><input name="requiredDate" type="date" value={form.requiredDate} onChange={ch} style={inputStyle} /></div>
              <div style={{ marginBottom: '14px' }}><label style={labelStyle}>Notes</label><textarea name="notes" value={form.notes} onChange={ch} rows={3} placeholder="Anything else we should know?" style={{ ...inputStyle, resize: 'vertical' }} /></div>
              <div style={{ fontSize: '12px', color: '#000', marginBottom: '16px' }}>Email your logo / artwork to <strong>hello@quirkypromo.com.au</strong> after submitting.</div>
              {status === 'error' && <div style={{ fontSize: '13px', color: '#C0392B', marginBottom: '12px' }}>Something went wrong. Please try again or email us directly.</div>}
              <button onClick={submit} disabled={!canSubmit || status === 'sending'} style={{ width: '100%', background: canSubmit ? GOLD : '#C8C4BC', color: '#fff', border: 'none', borderRadius: '12px', padding: '16px', fontSize: '16px', fontWeight: 700, cursor: canSubmit ? 'pointer' : 'not-allowed', fontFamily: FONT }}>{status === 'sending' ? 'Sending…' : 'Submit Quote Request'}</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

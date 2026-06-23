'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { addToCart } from '@/lib/cart';
import CartDrawer from '@/components/CartDrawer';
import { getColourHex } from '@/lib/colourSwatch';
import { slugify } from '@/lib/slug';
import { colourImageAlt, cleanColour } from '@/lib/colourName';
import ProductImg from '@/components/ProductImg';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';
const aud = (n) => '$' + Number(n || 0).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const isColourMethod = (d) => { const n = (d?.name || '').toLowerCase(); return n.includes('screen print') || n.includes('pad print'); };
const isOneColourLocked = (d) => { const x = (d?.detail || '').toLowerCase(); return x.includes('one colour') || x.includes('1 colour'); };
// Laser engraving / etching / debossing have no colour — show the method name only.
const isEngravingMethod = (d) => { const n = (d?.name || '').toLowerCase(); return n.includes('laser') || n.includes('engrav') || n.includes('deboss') || n.includes('emboss') || n.includes('etch'); };
const brandingLabel = (d, setupQty) => isEngravingMethod(d) ? d.name : isColourMethod(d) ? `${d.name} — ${isOneColourLocked(d) ? 1 : (setupQty || 1)} COL · 1 POS` : `${d.name} — Full Colour · 1 POS`;
const MARGIN = 1.40;
const GST = 0.10;
const SHIPPING = 30;
const SETUP_FEE = 40;
const TABS = ['Description', 'Sample Policy', 'Mockups & Artwork', 'Shipping & Delivery', 'Ordering Process'];

// ── colourImageAlt imported from lib/colourName (shared with 4B variant logic) ──
function isGoodAltText(alt, name, colourNames) {
  if (!alt) return false;
  const t = String(alt).trim();
  if (!t || t === name) return false;
  const low = t.toLowerCase();
  if (low === 'custom' || low === 'default') return false;
  if ((colourNames || []).some(cn => cn && String(cn).toLowerCase() === low)) return false;
  return t.length >= 8 && t.length <= 125;
}

export default function ProductClient({ product, mainImage, colours, extraImages, pricingTiers, decorations, secondaryColours, initialColourIndex }) {
  // 4B-3: SSR pre-selects a colour from ?colour=<colour_slug> (page.js passes its index).
  const [selectedColour, setSelectedColour] = useState(initialColourIndex ?? null);
  const [selectedSecondary, setSelectedSecondary] = useState(0);
  const [leftIdx, setLeftIdx] = useState(0);
  const [qty, setQty] = useState(product.min_qty || 48);
  const [qtyInput, setQtyInput] = useState(String(product.min_qty || 48));
  const [activeTab, setActiveTab] = useState('Description');
  const [similarProducts, setSimilarProducts] = useState([]);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [cartAdded, setCartAdded] = useState(false);
  // ===== Apparel size matrix =====
  const sizeList = Array.isArray(product.size_chart?.sizes) ? product.size_chart.sizes : [];
  const hasSizes = sizeList.length > 0;
  const [sizeQty, setSizeQty] = useState({});
  const sizeTotal = sizeList.reduce((sum, s) => sum + (parseInt(sizeQty[s]) || 0), 0);

  function handleSizeQty(size, val) {
    const n = Math.max(0, parseInt(val) || 0);
    setSizeQty(prev => ({ ...prev, [size]: n }));
  }

  useEffect(() => {
    if (hasSizes) { setQty(sizeTotal); setQtyInput(String(sizeTotal)); }
  }, [sizeTotal, hasSizes]);
  useEffect(() => {
    if (secondaryColours?.options?.length) setSelectedSecondary(0);
  }, [secondaryColours]);
  const router = useRouter();
  const hasSecondary = Boolean(secondaryColours?.options?.length);
  const brandingDecorations = (decorations || []).filter(d => d.type !== 'addon');
  const addonDecorations = (decorations || []).filter(d => d.type === 'addon');
  const [addonState, setAddonState] = useState(() => {
    const s = {};
    decorations.forEach(d => {
      s[d.id] = { on: false, setupQty: d.default_setup_qty || 1 };
    });
    return s;
  });

  const bottomImages = [mainImage, ...(extraImages || [])].filter(Boolean);

  const bigImage = selectedColour !== null
    ? (colours[selectedColour]?.image || bottomImages[0] || mainImage)
    : (bottomImages[leftIdx] || mainImage);

  // ── SEO alt text (Rulebook §9, #3) ──
  const colourNames = (colours || []).map(c => c?.name).filter(Boolean);
  const mainAlt = isGoodAltText(product.alt_text, product.name, colourNames)
    ? String(product.alt_text).trim()
    : `${product.name} with logo`;
  const galleryAlt = `${product.name} with custom branding`;

  // ── Available colours visible text (Rulebook §11.2, #2) ──
  // Server-rendered, crawlable list of real discrete colours (cleaned names,
  // deduped). Skips Custom / placeholder. Shown only when >= 2 real colours.
  const availableColours = (() => {
    const seen = new Set();
    const out = [];
    for (const c of (colours || [])) {
      const { name } = cleanColour(c?.name);
      if (name) {
        const k = name.toLowerCase();
        if (!seen.has(k)) { seen.add(k); out.push(name); }
      }
    }
    return out;
  })();

  useEffect(() => {
    async function fetchSimilar() {
      if (!product.subcategory) return;
      const { data } = await supabase
        .from('products')
        .select(`id, name, slug, min_qty, product_colours(id, name, hex, images, sort_order), pricing_tiers(base_price)`)
        .ilike('subcategory', product.subcategory)
        .eq('status', 'active')
        .neq('id', product.id)
        .limit(4);
      if (data) setSimilarProducts(data);
    }
    fetchSimilar();
  }, [product.id, product.subcategory]);

  const activeTier = pricingTiers.reduce((best, tier) => {
    if (qty >= tier.min_qty) return !best || tier.min_qty > best.min_qty ? tier : best;
    return best;
  }, null) || pricingTiers[0];

  const calcUnit = useCallback((tierPrice, quantity) => {
    if (!tierPrice || !quantity) return 0;
    let unit = tierPrice * MARGIN;
    decorations.forEach(d => {
      const st = addonState[d.id];
      if (!st?.on) return;
      unit += d.per_unit * (st.setupQty || 1) * MARGIN;
      if (d.has_setup) unit += (SETUP_FEE * st.setupQty / quantity) * MARGIN;
    });
    return unit;
  }, [addonState, decorations]);

  const unitPrice = activeTier ? calcUnit(activeTier.base_price, qty) : 0;
  const subtotal = Math.round(unitPrice * qty * 100) / 100;
  const gstAmt = Math.round((subtotal + SHIPPING) * GST * 100) / 100;
  const grand = subtotal + SHIPPING + gstAmt;
  const firstRetailPrice = pricingTiers[0] ? pricingTiers[0].base_price * MARGIN : 0;
  const isValidQty = qty >= (product.min_qty || 1);
  const canAdd = isValidQty && (colours.length === 0 || selectedColour !== null);
  const collectionLabel = product.collection
    ? (Array.isArray(product.collection) ? product.collection.join(', ') : product.collection)
    : null;
  const mainColourStep = hasSecondary ? 2 : 1;
  const qtyStep = (colours.length > 0 ? 2 : 1) + (hasSecondary ? 1 : 0);
  const brandingStep = (colours.length > 0 ? 3 : 2) + (hasSecondary ? 1 : 0);
  const addonStep = (colours.length > 0 ? (brandingDecorations.length > 0 ? 4 : 3) : (brandingDecorations.length > 0 ? 3 : 2)) + (hasSecondary ? 1 : 0);

  function resolveColourHex(colour) {
    if (!colour) return '';
    return colour.hex || getColourHex(colour.name) || '';
  }

  function handleQtyChange(val) {
    setQtyInput(val);
    const n = parseInt(val);
    if (!isNaN(n) && n >= (product.min_qty || 1)) setQty(n);
  }

  function toggleAddon(id, on) {
    setAddonState(prev => ({ ...prev, [id]: { ...prev[id], on } }));
  }

  function setSetupQty(id, val) {
    const n = Math.max(1, parseInt(val) || 1);
    setAddonState(prev => ({ ...prev, [id]: { ...prev[id], setupQty: n } }));
  }

  function handleSelectColour(i) {
    setSelectedColour(i);
    setLeftIdx(0);
  }

  function handleBottomThumb(i) {
    setLeftIdx(i);
    setSelectedColour(null);
  }

  function getSimilarImage(p) {
    if (!p.product_colours?.length) return null;
    const sorted = [...p.product_colours].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    const imgs = sorted[0]?.images;
    if (!imgs) return null;
    const arr = Array.isArray(imgs) ? imgs : Object.values(imgs);
    return arr[0] || null;
  }

  function getSimilarLowestPrice(p) {
    if (!p.pricing_tiers?.length) return 0;
    return Math.min(...p.pricing_tiers.map(t => parseFloat(t.base_price) * MARGIN));
  }

  function handleAddToCart() {
    const selectedAddons = decorations
      .filter(d => addonState[d.id]?.on)
      .map(d => ({
        id: d.id,
        name: d.name,
        perUnit: d.per_unit * MARGIN,
        setupFee: d.has_setup ? SETUP_FEE * MARGIN : 0,
        setupQty: addonState[d.id]?.setupQty || 1,
      }));

    const selectedSecondaryOption = hasSecondary ? secondaryColours.options[selectedSecondary] : null;
    const selectedPrimaryName = selectedColour !== null ? colours[selectedColour]?.name : '';
    const colourText = selectedPrimaryName
      ? selectedSecondaryOption
        ? `${selectedPrimaryName} / ${secondaryColours.label}: ${selectedSecondaryOption.name}`
        : selectedPrimaryName
      : selectedSecondaryOption
        ? `${secondaryColours.label}: ${selectedSecondaryOption.name}`
        : '';

    const item = {
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      sku: product.supplier_sku,
      image: bigImage || mainImage,
      colour: colourText,
      qty,
      sizeBreakdown: hasSizes ? Object.fromEntries(sizeList.filter(s => (sizeQty[s] || 0) > 0).map(s => [s, sizeQty[s]])) : null,
      unitPrice,
      subtotal: Math.round(unitPrice * qty * 100) / 100,
      shipping: SHIPPING,
      gst: Math.round((Math.round(unitPrice * qty * 100) / 100 + SHIPPING) * GST * 100) / 100,
      grand,
      addons: selectedAddons,
      minQty: product.min_qty,
    };

    addToCart(item);
    setCartAdded(true);
  }

  return (
    <div style={{ fontFamily: '"DM Sans", sans-serif', background: '#fff', color: '#1a1a1a' }}>

      {/* BREADCRUMB */}
      <div className="qp-padx" style={{ background: '#fff', borderBottom: '1px solid #E0DDD7', padding: '12px 40px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', fontSize: '13px', color: '#1a1a1a' }}>
          <Link href="/" style={{ color: '#1a1a1a', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 8px' }}>›</span>
          <Link href={`/category/${slugify(product.category)}`} style={{ color: '#1a1a1a', textDecoration: 'none' }}>{product.category}</Link>
          <span style={{ margin: '0 8px' }}>›</span>
          <Link href={`/category/${slugify(product.category)}/${slugify(product.subcategory)}`} style={{ color: '#1a1a1a', textDecoration: 'none' }}>{product.subcategory}</Link>
          <span style={{ margin: '0 8px' }}>›</span>
          <span style={{ color: NAVY, fontWeight: 600 }}>{product.name}</span>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="qp-pdp-main" style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 40px 60px', display: 'grid', gridTemplateColumns: '480px 1fr', gap: '48px', alignItems: 'start' }}>

        {/* LEFT */}
        <div className="qp-pdp-left" style={{ position: 'sticky', top: '70px' }}>
          <div style={{ background: '#fff', border: '1px solid #E0DDD7', borderRadius: '16px', width: '100%', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: '12px' }}>
            {bigImage
              ? <ProductImg src={bigImage} alt={mainAlt} size="detail" eager style={{ width: '85%', height: '85%', objectFit: 'contain' }} />
              : <div style={{ color: '#1a1a1a', fontSize: '14px' }}>No image available</div>
            }
          </div>
          {bottomImages.length >= 1 && (
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
              {bottomImages.map((src, i) => (
                <div key={i} onClick={() => handleBottomThumb(i)} style={{ cursor: 'pointer', flexShrink: 0 }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '10px', border: leftIdx === i && selectedColour === null ? `2.5px solid ${GOLD}` : '1.5px solid #E0DDD7', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: leftIdx === i && selectedColour === null ? `0 2px 8px rgba(201,169,110,.3)` : 'none' }}>
                    <ProductImg src={src} alt={i === 0 ? mainAlt : galleryAlt} size="thumb" style={{ width: '90%', height: '90%', objectFit: 'contain' }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            {product.indent_type && (
  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, letterSpacing: '0.5px', marginBottom: '8px', background: product.indent_type === 'indent_air' ? '#FFF8E7' : '#EFF6FF', color: product.indent_type === 'indent_air' ? '#92400E' : '#1E40AF', border: product.indent_type === 'indent_air' ? '1px solid #FCD34D' : '1px solid #93C5FD' }}>
    {product.indent_type === 'indent_air' ? '✈️ INDENT AIR' : '🚢 INDENT SEA'}
  </div>
)}
            <div style={{ fontSize: '12px', color: '#1a1a1a', marginBottom: '6px', fontFamily: '"DM Mono", monospace', letterSpacing: '1px' }}>{product.supplier_sku}</div>
            <h1 className="qp-pdp-h1" style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '34px', fontWeight: 600, margin: '0 0 8px', color: NAVY, lineHeight: 1.2 }}>{product.name}</h1>
            <div style={{ fontSize: '14px', color: GOLD, fontWeight: 500, minHeight: '22px' }}>
              {selectedColour !== null ? `Colour: ${colours[selectedColour]?.name}` : ''}
            </div>
            {product.seo_description && (
              <p style={{ fontSize: '14px', color: '#1a1a1a', lineHeight: 1.7, margin: '12px 0 0', fontFamily: '"DM Sans", sans-serif' }}>
                {product.seo_description}
              </p>
            )}
          </div>

          {hasSecondary && (
            <div>
              <StepLabel num={1} text={`Choose ${secondaryColours.label}`} />
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '12px' }}>
                {secondaryColours.options.map((c, i) => {
                  const hex = resolveColourHex(c);
                  return (
                    <div key={i} onClick={() => setSelectedSecondary(i)} role="button" aria-label={`Select ${secondaryColours.label || 'option'} ${c.name}`} style={{ cursor: 'pointer', textAlign: 'center' }}>
                      <div style={{ width: '64px', height: '64px', borderRadius: '10px', border: selectedSecondary === i ? `2.5px solid ${GOLD}` : '1.5px solid #E0DDD7', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: '6px', boxShadow: selectedSecondary === i ? `0 2px 10px rgba(201,169,110,.3)` : '0 1px 3px rgba(0,0,0,.06)', transition: 'border .15s, box-shadow .15s' }}>
                        {(c.image || (Array.isArray(c.images) && c.images[0])) ? <ProductImg src={c.image || c.images[0]} alt={colourImageAlt(c.name, product.name)} size="thumb" style={{ width: '90%', height: '90%', objectFit: 'contain' }} />
                          : hex ? <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: hex, border: hex === '#FFFFFF' ? '1px solid #E0DDD7' : '1px solid rgba(0,0,0,.18)', boxSizing: 'border-box' }} />
                          : <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#E0DDD7' }} />}
                      </div>
                      <div style={{ fontSize: '10px', color: selectedSecondary === i ? GOLD : '#7A7570', fontWeight: selectedSecondary === i ? 600 : 400, maxWidth: '64px', lineHeight: '1.2', fontFamily: '"DM Sans", sans-serif' }}>{c.name}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {colours.length > 0 && (
            <div>
              <StepLabel num={mainColourStep} text={`Choose ${product.colour_label || 'Product Colour'} *`} />
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '12px' }}>
                {colours.map((c, i) => {
                  const hex = resolveColourHex(c);
                  return (
                    <div key={i} onClick={() => handleSelectColour(i)} role="button" aria-label={`Select ${product.colour_label || 'colour'} ${c.name}`} style={{ cursor: 'pointer', textAlign: 'center' }}>
                      <div style={{ width: '64px', height: '64px', borderRadius: '10px', border: selectedColour === i ? `2.5px solid ${GOLD}` : '1.5px solid #E0DDD7', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: '6px', boxShadow: selectedColour === i ? `0 2px 10px rgba(201,169,110,.3)` : '0 1px 3px rgba(0,0,0,.06)', transition: 'border .15s, box-shadow .15s' }}>
                        {c.image ? <ProductImg src={c.image} alt={colourImageAlt(c.name, product.name)} size="thumb" style={{ width: '90%', height: '90%', objectFit: 'contain' }} />
                          : hex ? <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: hex, border: hex === '#FFFFFF' ? '1px solid #E0DDD7' : '1px solid rgba(0,0,0,.18)', boxSizing: 'border-box' }} />
                          : <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#E0DDD7' }} />}
                      </div>
                      <div style={{ fontSize: '10px', color: selectedColour === i ? GOLD : '#7A7570', fontWeight: selectedColour === i ? 600 : 400, maxWidth: '64px', lineHeight: '1.2', fontFamily: '"DM Sans", sans-serif' }}>{c.name}</div>
                    </div>
                  );
                })}
              </div>
              {availableColours.length >= 2 && (
                <p style={{ fontSize: '13px', color: '#1a1a1a', lineHeight: 1.6, margin: '14px 0 0', fontFamily: '"DM Sans", sans-serif' }}>
                  Available colours: {availableColours.join(', ')}.
                </p>
              )}
            </div>
          )}

      <div>
            <StepLabel num={qtyStep} text={(hasSizes ? 'Enter Quantity per Size' : 'Enter Quantity') + ' *'} />
            {hasSizes ? (
              <div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', margin: '12px 0 10px' }}>
                  {sizeList.map(s => (
                    <div key={s} style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: NAVY, marginBottom: '4px', fontFamily: '"DM Sans", sans-serif' }}>{s}</div>
                      <input type="number" min="0" value={sizeQty[s] ?? ''} placeholder="0"
                        onChange={e => handleSizeQty(s, e.target.value)}
                        style={{ width: '58px', padding: '8px 4px', border: '1.5px solid #C8C4BC', borderRadius: '8px', fontSize: '15px', fontWeight: 600, textAlign: 'center', fontFamily: '"DM Sans", sans-serif', outline: 'none', background: '#fff', color: NAVY, boxSizing: 'border-box' }} />
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: '13px', color: '#1a1a1a' }}>
                  Total: <strong style={{ color: sizeTotal >= (product.min_qty || 1) ? NAVY : '#C0392B', fontSize: '16px' }}>{sizeTotal} units</strong>
                  <span style={{ marginLeft: '10px' }}>(Minimum order: {product.min_qty} units)</span>
                </div>
                {!isValidQty && <div style={{ fontSize: '12px', color: '#C0392B', marginTop: '8px' }}>Minimum order quantity is {product.min_qty} units across all sizes.</div>}
                <SizeChartTable sizeChart={product.size_chart} />
              </div>
            ) : (
              <>
                <div style={{ fontSize: '13px', color: '#1a1a1a', margin: '6px 0 12px' }}>Minimum order: <strong style={{ color: NAVY }}>{product.min_qty} units</strong></div>
                <input
                  type="number"
                  value={qtyInput}
                  onChange={e => handleQtyChange(e.target.value)}
                  min={product.min_qty}
                  placeholder={`Min. ${product.min_qty}`}
                  style={{
                    width: '160px', padding: '10px 16px', border: '1.5px solid #C8C4BC',
                    borderRadius: '8px', fontSize: '18px', fontWeight: 600,
                    fontFamily: '"DM Sans", sans-serif', color: NAVY, outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
                {!isValidQty && <div style={{ fontSize: '12px', color: '#C0392B', marginTop: '8px' }}>Minimum order quantity is {product.min_qty} units.</div>}
              </>
            )}
          </div>

          {pricingTiers.length > 0 && (
            <div className="qp-scroll-x" style={{ border: '1px solid #E0DDD7', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ background: '#F8F7F4', padding: '10px 14px', fontSize: '12px', fontWeight: 700, borderBottom: '1px solid #E0DDD7', color: '#000000', textTransform: 'uppercase', letterSpacing: '0.8px', textAlign: 'center' }}>Unbranded Pricing (excl. GST)</div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#FAFAF8' }}>
                    <th style={thStyle}>Qty</th>
                    {pricingTiers.map(t => { const isActive = activeTier?.id === t.id; return <th key={t.id} style={{ ...thStyle, background: isActive ? '#FDF8F0' : undefined, color: isActive ? GOLD : undefined }}>{t.min_qty}+</th>; })}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={tdLabelStyle}>Price</td>
                    {pricingTiers.map(t => { const isActive = activeTier?.id === t.id; return <td key={t.id} style={{ ...tdStyle, fontWeight: isActive ? 700 : 500, color: isActive ? GOLD : NAVY, background: isActive ? '#FDF8F0' : undefined, fontSize: isActive ? '15px' : '13px' }}>${(t.base_price * MARGIN).toFixed(2)}</td>; })}
                  </tr>
                  <tr>
                    <td style={tdLabelStyle}>Save</td>
                    {pricingTiers.map((t, i) => { const isActive = activeTier?.id === t.id; return <td key={t.id} style={{ ...tdStyle, color: '#1a1a1a', fontWeight: 700, fontSize: '15px', background: isActive ? '#FDF8F0' : undefined }}>{i === 0 ? '—' : Math.round((1 - (t.base_price * MARGIN) / firstRetailPrice) * 100) + '%'}</td>; })}
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {brandingDecorations.length > 0 && (
            <div>
              <StepLabel num={brandingStep} text="Add Branding Options" />
              <div className="qp-scroll-x" style={{ border: '1px solid #E0DDD7', borderRadius: '10px', overflow: 'hidden', marginTop: '10px' }}>
                <div style={{ background: '#F8F7F4', padding: '10px 14px', fontSize: '12px', fontWeight: 700, borderBottom: '1px solid #E0DDD7', color: '#000000', textTransform: 'uppercase', letterSpacing: '0.8px', textAlign: 'center' }}>Branding & Decoration</div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#FAFAF8' }}>
                      <th style={{ ...thStyle, textAlign: 'left' }}>Method</th>
                      <th style={thStyle}>Add?</th>
                      <th style={thStyle}>Per Unit</th>
                      <th style={thStyle}>Order Qty</th>
                      <th style={thStyle}>Setup Fee</th>
                      <th style={thStyle}># Setups</th>
                    </tr>
                  </thead>
                  <tbody>
                    {brandingDecorations.map(d => {
                      const st = addonState[d.id] || { on: false, setupQty: 1 };
                      return (
                        <tr key={d.id} style={{ borderBottom: '1px solid #F0EEED' }}>
                          <td style={{ padding: '10px 14px' }}>
                            <div style={{ fontSize: '13px', fontWeight: 500, color: NAVY }}>{d.name}</div>
                            {d.detail && d.detail !== 'EMPTY' && <div style={{ fontSize: '11px', color: '#1a1a1a', marginTop: '2px' }}>{d.detail}</div>}
                          </td>
                          <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                            <label style={{ position: 'relative', width: '44px', height: '24px', cursor: 'pointer', display: 'inline-block' }}>
                              <input type="checkbox" checked={st.on} onChange={e => toggleAddon(d.id, e.target.checked)} style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }} />
                              <span style={{ position: 'absolute', inset: 0, background: st.on ? GOLD : '#C8C4BC', borderRadius: '12px', transition: 'background .2s' }} />
                              <span style={{ position: 'absolute', top: '3px', left: st.on ? '23px' : '3px', width: '18px', height: '18px', background: '#fff', borderRadius: '50%', transition: 'left .2s', boxShadow: '0 1px 3px rgba(0,0,0,.2)' }} />
                            </label>
                          </td>
                          <td style={{ ...tdStyle, fontWeight: 500, color: NAVY }}>${(d.per_unit * MARGIN).toFixed(2)}</td>
                          <td style={{ ...tdStyle, color: '#1a1a1a' }}>{qty}</td>
                          <td style={tdStyle}>{d.has_setup ? `$${(SETUP_FEE * MARGIN).toFixed(2)}` : '—'}</td>
                          <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                            {d.has_setup
                              ? <input type="number" value={(!isColourMethod(d) || isOneColourLocked(d)) ? 1 : st.setupQty} min="1" disabled={!st.on || !isColourMethod(d) || isOneColourLocked(d)}onChange={e => setSetupQty(d.id, e.target.value)} style={{ width: '54px', border: '1.5px solid #C8C4BC', borderRadius: '6px', padding: '5px 6px', fontSize: '13px', fontWeight: 600, textAlign: 'center', fontFamily: '"DM Sans", sans-serif', background: !st.on ? '#F4F2EE' : '#fff', color: !st.on ? '#B0AAA3' : NAVY,outline: 'none' }} />
                              : <span style={{ color: '#1a1a1a' }}>—</span>}
                          </td>
                        </tr>
                      );
                    })}
                    <tr>
                      <td style={{ padding: '10px 14px' }}>
                        <div style={{ fontSize: '13px', fontWeight: 500, color: NAVY }}>Shipping & Handling</div>
                        <div style={{ fontSize: '11px', color: '#1a1a1a' }}>Per domestic address</div>
                      </td>
                      <td /><td /><td />
                      <td style={{ ...tdStyle, fontWeight: 500, color: NAVY }}>${SHIPPING.toFixed(2)}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'center', color: '#1a1a1a' }}>1</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {addonDecorations.length > 0 && (
            <div>
              <StepLabel num={addonStep} text="Select Add-on Options" />
              <div style={{ border: '1px solid #E0DDD7', borderRadius: '10px', overflow: 'hidden', marginTop: '10px' }}>
                <div style={{ background: '#F8F7F4', padding: '10px 14px', fontSize: '12px', fontWeight: 700, borderBottom: '1px solid #E0DDD7', color: '#000000', textTransform: 'uppercase', letterSpacing: '0.8px', textAlign: 'center' }}>Add-ons & Extras</div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {addonDecorations.map(d => {
                    const st = addonState[d.id] || { on: false, setupQty: 1 };
                    return (
                      <div key={d.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderBottom: '1px solid #F0EEED' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                          <label style={{ position: 'relative', width: '44px', height: '24px', cursor: 'pointer', display: 'inline-block', flexShrink: 0 }}>
                            <input type="checkbox" checked={st.on} onChange={e => toggleAddon(d.id, e.target.checked)} style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }} />
                            <span style={{ position: 'absolute', inset: 0, background: st.on ? GOLD : '#C8C4BC', borderRadius: '12px', transition: 'background .2s' }} />
                            <span style={{ position: 'absolute', top: '3px', left: st.on ? '23px' : '3px', width: '18px', height: '18px', background: '#fff', borderRadius: '50%', transition: 'left .2s', boxShadow: '0 1px 3px rgba(0,0,0,.2)' }} />
                          </label>
                          <div>
                            <div style={{ fontSize: '13px', fontWeight: 500, color: NAVY }}>{d.name}</div>
                            {d.detail && d.detail !== 'EMPTY' && <div style={{ fontSize: '11px', color: '#1a1a1a', marginTop: '2px' }}>{d.detail}</div>}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '13px', fontWeight: 500, color: NAVY }}>+${(d.per_unit * MARGIN).toFixed(2)}/unit</div>
                          {d.has_setup && <div style={{ fontSize: '11px', color: '#1a1a1a', marginTop: '2px' }}>Setup: ${(SETUP_FEE * MARGIN).toFixed(2)}</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {pricingTiers.length > 0 && (
            <div style={{ border: '1px solid #E0DDD7', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ background: '#F8F7F4', padding: '10px 14px', fontSize: '12px', fontWeight: 700, borderBottom: '1px solid #E0DDD7', color: '#000000', textTransform: 'uppercase', letterSpacing: '0.8px', textAlign: 'center' }}>Price Summary</div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#FAFAF8' }}>
                    <th style={{ ...thStyle, textAlign: 'left' }}>Quantity</th>
                    {pricingTiers.map(t => { const isActive = activeTier?.id === t.id; return <th key={t.id} style={{ ...thStyle, color: isActive ? GOLD : undefined, background: isActive ? '#FDF8F0' : undefined }}>{t.min_qty}</th>; })}
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #F0EEED' }}>
                    <td style={tdLabelStyle}>Buy (unit)</td>
                    {pricingTiers.map(t => { const u = calcUnit(t.base_price, t.min_qty); const isActive = activeTier?.id === t.id; return <td key={t.id} style={{ ...tdStyle, fontWeight: 600, color: isActive ? GOLD : NAVY, background: isActive ? '#FDF8F0' : undefined }}>${u.toFixed(2)}</td>; })}
                  </tr>
                  <tr>
                    <td style={tdLabelStyle}>Buy (subtotal)</td>
                    {pricingTiers.map(t => { const u = calcUnit(t.base_price, t.min_qty); const isActive = activeTier?.id === t.id; return <td key={t.id} style={{ ...tdStyle, fontWeight: 600, color: isActive ? GOLD : NAVY, background: isActive ? '#FDF8F0' : undefined }}>{aud(u * t.min_qty)}</td>; })}
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {isValidQty && unitPrice > 0 && (
            <div style={{ background: NAVY, borderRadius: '16px', padding: '24px', color: '#fff' }}>
              <div style={{ marginBottom: '14px', paddingBottom: '14px', borderBottom: '1px solid rgba(255,255,255,.12)' }}>
                <div style={{ fontSize: '11px', color: '#fff', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Your Selection</div>
                <div style={{ fontSize: '14px', color: '#fff', lineHeight: 1.6 }}>
                  {selectedColour !== null && colours[selectedColour]?.name ? (<span><strong>{colours[selectedColour].name}</strong> · </span>) : null}
                  Qty <strong>{Number(qty).toLocaleString('en-AU')}</strong> · {decorations.filter(d => addonState[d.id]?.on).map(d => brandingLabel(d, addonState[d.id]?.setupQty)).join(' · ') || 'Unbranded'}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#fff', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Unit price (excl. GST)</div>
                  <div style={{ fontFamily: '"DM Mono", monospace', fontSize: '32px', fontWeight: 500, color: GOLD }}>${unitPrice.toFixed(2)}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', color: '#fff', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Subtotal (excl. GST)</div>
                  <div style={{ fontFamily: '"DM Mono", monospace', fontSize: '26px', fontWeight: 500, color: '#fff' }}>{aud(subtotal)}</div>
                </div>
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,.12)', margin: '0 0 14px' }} />
              <PriceRow label="Subtotal (excl. GST)" value={`${aud(subtotal)}`} />
              <PriceRow label="Shipping & Handling" value={`$${SHIPPING.toFixed(2)}`} />
              <PriceRow label="GST (10%)" value={`${aud(gstAmt)}`} />
              <PriceRow label="Total (incl. GST)" value={`${aud(grand)}`} bold />
              <div style={{ fontSize: '11px', color: '#fff', marginTop: '8px' }}>All prices in AUD. GST invoice provided with order.</div>
            </div>
          )}

          <button
            onClick={canAdd ? handleAddToCart : undefined}
            disabled={!canAdd}
            style={{
              width: '100%',
              background: canAdd ? GOLD : '#C8C4BC',
              color: '#fff', border: 'none', borderRadius: '12px', padding: '20px',
              fontSize: '19px', fontWeight: 700,
              cursor: isValidQty ? 'pointer' : 'not-allowed',
              fontFamily: '"DM Sans", sans-serif',
              boxShadow: isValidQty ? '0 4px 16px rgba(201,169,110,.4)' : 'none',
              transition: 'background .3s',
            }}>
            {cartAdded ? '✅ Added to Cart!' : !isValidQty ? 'Enter quantity to see pricing' : (colours.length > 0 && selectedColour === null) ? 'Choose a colour to continue' : `Add to Cart  —  ${aud(grand)} incl. GST`}
          </button>

          <button onClick={() => setQuoteOpen(true)} style={{ width: '100%', background: NAVY, color: '#fff', border: 'none', borderRadius: '12px', padding: '18px', fontSize: '17px', fontWeight: 700, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>💬</span> Get a Quote / Ask a Question
          </button>

          <div className="qp-pdp-benefits" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            {[
              { icon: '🎨', title: 'Free Digital Proof', sub: 'See it before we make it' },
              { icon: '🚚', title: '$30 Flat Shipping', sub: 'Australia-wide, no surprises' },
              { icon: '✅', title: 'Quality Guarantee', sub: 'We stand behind every order' },
            ].map(b => (
              <div key={b.title} style={{ background: '#fff', border: `1.5px solid ${GOLD}40`, borderRadius: '12px', padding: '16px 10px', textAlign: 'center', borderTop: `3px solid ${GOLD}` }}>
                <div style={{ fontSize: '26px', marginBottom: '8px' }}>{b.icon}</div>
                <div style={{ fontSize: '13px', color: NAVY, fontWeight: 700, marginBottom: '4px', fontFamily: '"DM Sans", sans-serif' }}>{b.title}</div>
                <div style={{ fontSize: '11px', color: '#1a1a1a', fontFamily: '"DM Sans", sans-serif', lineHeight: 1.4 }}>{b.sub}</div>
              </div>
            ))}
          </div>

          <div style={{ border: '1px solid #E0DDD7', borderRadius: '10px', overflow: 'hidden', background: '#fff' }}>
            <div className="qp-pdp-tabs" style={{ display: 'flex', borderBottom: '1px solid #E0DDD7' }}>
              {TABS.map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} style={{ flex: 1, padding: '14px 8px', fontSize: '13px', fontWeight: 700, color: activeTab === tab ? NAVY : '#000000', background: activeTab === tab ? '#FDF8F0' : 'none', border: 'none', borderBottom: activeTab === tab ? `3px solid ${GOLD}` : '3px solid transparent', cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', whiteSpace: 'nowrap', textAlign: 'center' }}>
                  {tab}
                </button>
              ))}
            </div>
            <div style={{ padding: '24px', fontSize: '14px', lineHeight: '1.8', color: '#1a1a1a', fontFamily: '"DM Sans", sans-serif' }}>
              {activeTab === 'Description' && (
  <div>
    {product.features && Array.isArray(product.features) && product.features.length > 0 && (
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '18px', color: NAVY, margin: '0 0 12px' }}>Features</h3>
                      <ul style={{ margin: 0, paddingLeft: '20px' }}>
                        {product.features.filter(f => f).map((f, i) => (
                          <li key={i} style={{ marginBottom: '6px', color: '#1a1a1a' }}>{f}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {product.description && (
                    <div style={{ marginBottom: '24px' }}>
                      <p style={{ margin: 0, color: '#1a1a1a', lineHeight: 1.7 }}>{product.description}</p>
                    </div>
                  )}
                  <div style={{ borderTop: '1px solid #E0DDD7', paddingTop: '20px' }}>
                    <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '18px', color: NAVY, margin: '0 0 16px' }}>Specifications</h3>

                    {/* Materials highlighted at top */}
                    {product.materials && (
                      <div style={{ marginBottom: '16px', padding: '12px 16px', background: '#F8F7F4', borderRadius: '8px', borderLeft: `3px solid ${GOLD}` }}>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '4px' }}>Materials</div>
                        <div style={{ fontSize: '13px', color: NAVY, fontWeight: 500, lineHeight: 1.6 }}>{product.materials}</div>
                      </div>
                    )}

                    {/* Dimensions below materials */}
                    {product.dimensions && (
                      <div style={{ marginBottom: '16px', padding: '12px 16px', background: '#F8F7F4', borderRadius: '8px', borderLeft: `3px solid #E0DDD7` }}>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '4px' }}>Dimensions</div>
                        <div style={{ fontSize: '13px', color: NAVY, fontWeight: 500, lineHeight: 1.6 }}>{product.dimensions}</div>
                      </div>
                    )}

                    {product.cover_type || product.ruling ? (
                      <NotebookSpecs product={product} />
                    ) : (
                      <FlatSpecTable product={product} />
                    )}
                  </div>
                  {decorations.length > 0 && (
                    <div style={{ borderTop: '1px solid #E0DDD7', paddingTop: '20px', marginTop: '20px' }}>
                      <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '18px', color: NAVY, margin: '0 0 16px' }}>Decoration Options</h3>
                      {decorations.map(d => (
                        <div key={d.id} style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #F0EEED' }}>
                          <div style={{ fontWeight: 600, color: NAVY }}>{d.name}</div>
                          {d.detail && d.detail !== 'EMPTY' && <div style={{ color: '#1a1a1a', fontSize: '13px' }}>{d.detail}</div>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'Sample Policy' && (
                <div>
                  <p style={{ margin: '0 0 16px', fontSize: '15px', color: '#1a1a1a', lineHeight: 1.7 }}>
                    Before committing to a bulk order, we offer several ways to help you verify quality, colour, and branding — so you can order with complete confidence.
                  </p>
                  {[
                    {
                      num: '1', title: 'Undecorated Physical Sample',
                      desc: 'Receive an actual product to check material quality and colour in person.',
                      points: [
                        'Sample cost + shipping fee applies',
                        'Sample cost is refunded upon placing a bulk order',
                        'Shipping fee is non-refundable',
                      ]
                    },
                    {
                      num: '2', title: 'Branded Sample (Custom Logo)',
                      desc: 'See exactly how your logo looks on the product before full production.',
                      points: [
                        'Charged at unit price + setup charge + shipping fee',
                        'Sample cost is refunded upon placing a bulk order',
                        'Setup charge and shipping fee are non-refundable',
                      ]
                    },
                    {
                      num: '3', title: 'Indent Custom Sample',
                      desc: 'For large volume factory-direct orders, fully customised samples are available.',
                      points: [
                        'Pricing and lead times vary by project and supplier',
                        'Refund policy is determined by order quantity and supplier terms',
                        'Contact us to discuss your specific requirements',
                      ]
                    },
                  ].map(s => (
                    <div key={s.num} style={{ marginBottom: '20px', padding: '16px', background: '#F8F7F4', borderRadius: '10px', borderLeft: `3px solid ${GOLD}` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: NAVY, color: '#fff', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{s.num}</div>
                        <div style={{ fontWeight: 700, color: NAVY, fontSize: '15px', fontFamily: '"Cormorant Garamond", serif' }}>{s.title}</div>
                      </div>
                      <p style={{ margin: '0 0 10px', color: '#1a1a1a', fontSize: '13px' }}>{s.desc}</p>
                      <ul style={{ margin: 0, paddingLeft: '18px' }}>
                        {s.points.map((p, i) => <li key={i} style={{ marginBottom: '4px', fontSize: '13px', color: '#1a1a1a' }}>{p}</li>)}
                      </ul>
                    </div>
                  ))}
                  <div style={{ marginTop: '20px', padding: '14px 16px', background: `${GOLD}15`, borderRadius: '10px', border: `1px solid ${GOLD}40`, display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '20px', flexShrink: 0 }}>💡</span>
                    <p style={{ margin: 0, fontSize: '13px', color: '#1a1a1a', lineHeight: 1.6 }}>
                      <strong>Not ready for a physical sample?</strong> Every order includes a free digital mockup created by our design team — showing exactly how your logo will appear on the final product. You must approve this mockup before production begins. <button onClick={() => setActiveTab('Mockups & Artwork')} style={{ background: 'none', border: 'none', color: GOLD, fontWeight: 700, cursor: 'pointer', padding: 0, fontSize: '13px', textDecoration: 'underline' }}>See Mockups & Artwork →</button>
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'Mockups & Artwork' && (
                <div>
                  <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '22px', color: NAVY, margin: '0 0 10px' }}>Wondering what your logo will look like on the product?</h3>
                    <p style={{ margin: '0 0 10px', color: '#1a1a1a', lineHeight: 1.7 }}>
                      Ordering branded merchandise without seeing the final result can feel like a leap of faith. That's why every order includes a <strong>free digital mockup</strong> created by our in-house design team, so you can see exactly how your brand will look before a single item is produced.
                    </p>
                    <p style={{ margin: 0, fontWeight: 700, color: NAVY }}>No surprises. No guesswork. Just confidence.</p>
                  </div>
                  <div style={{ padding: '16px', background: '#F8F7F4', borderRadius: '10px', borderLeft: `3px solid ${NAVY}`, marginBottom: '20px' }}>
                    <h4 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '17px', color: NAVY, margin: '0 0 10px' }}>How It Works</h4>
                    <p style={{ margin: 0, color: '#1a1a1a', fontSize: '13px', lineHeight: 1.7 }}>
                      Once your order is confirmed, our design team creates a digital mockup showing your logo on the product and sends it to you for approval. <strong>Production only begins after you give us the green light in writing.</strong>
                    </p>
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '17px', color: NAVY, margin: '0 0 12px' }}>Artwork Requirements</h4>
                    <ul style={{ margin: 0, paddingLeft: '20px' }}>
                      <li style={{ marginBottom: '8px' }}>Preferred formats: <strong>AI, EPS, PDF</strong> (vector files)</li>
                      <li style={{ marginBottom: '8px' }}>Also accepted: <strong>PNG or JPG</strong> at minimum 300dpi</li>
                      <li style={{ marginBottom: '8px' }}>Please provide <strong>PMS colour codes</strong> if colour matching is required</li>
                      <li>Our team will advise if any artwork adjustments are needed before production</li>
                    </ul>
                  </div>
                  <div style={{ padding: '14px 16px', background: `${GOLD}15`, borderRadius: '10px', border: `1px solid ${GOLD}40`, display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <span style={{ fontSize: '20px', flexShrink: 0 }}>🎨</span>
                    <p style={{ margin: 0, fontSize: '13px', color: '#1a1a1a', lineHeight: 1.6 }}>
                      <strong>Need help with your artwork?</strong> Don't have a vector file? No problem — our design team can assist. Contact us at <strong>hello@quirkypromo.com.au</strong> or call <strong>02 9477 4748</strong>.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'Shipping & Delivery' && (
                <div>
                  <div className="qp-pdp-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                    {[
                      { icon: '🚚', title: 'Flat Rate Shipping', value: '$30 per domestic address, Australia-wide' },
                      { icon: '🏭', title: 'Production Time', value: '3-7 business days after proof approval' },
                    ].map(c => (
                      <div key={c.title} style={{ padding: '14px', background: '#F8F7F4', borderRadius: '10px', borderTop: `3px solid ${GOLD}` }}>
                        <div style={{ fontSize: '22px', marginBottom: '6px' }}>{c.icon}</div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: NAVY, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>{c.title}</div>
                        <div style={{ fontSize: '13px', color: '#1a1a1a' }}>{c.value}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '17px', color: NAVY, margin: '0 0 12px' }}>Delivery Times After Dispatch</h4>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                      <tbody>
                        {[
                          { region: '🏙 Brisbane / Sydney / Melbourne', time: '2–5 business days' },
                          { region: '🏙 Adelaide', time: '3–5 business days' },
                          { region: '🏙 Perth', time: '5–7 business days' },
                          { region: '🌾 Rural Regions', time: '5–15 business days' },
                        ].map((r, i) => (
                          <tr key={i} style={{ background: i % 2 === 0 ? '#F8F7F4' : '#fff' }}>
                            <td style={{ padding: '10px 14px', color: '#1a1a1a' }}>{r.region}</td>
                            <td style={{ padding: '10px 14px', fontWeight: 600, color: NAVY, textAlign: 'right' }}>{r.time}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#1a1a1a' }}>Delivery times are estimates only. For up-to-date tracking, refer to your dispatch notification email.</p>
                  </div>
                  <div style={{ padding: '14px 16px', background: '#F0F4FF', borderRadius: '10px', borderLeft: `3px solid ${NAVY}`, marginBottom: '12px' }}>
                    <h4 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '16px', color: NAVY, margin: '0 0 8px' }}>Indent Orders</h4>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <div style={{ flex: 1, background: '#FFF8E7', borderRadius: '8px', padding: '10px 12px', border: '1px solid #FCD34D' }}>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#92400E', marginBottom: '2px' }}>✈️ Indent Air</div>
                        <div style={{ fontSize: '13px', color: '#92400E' }}>Made to order — enquire for lead time</div>
                      </div>
                      <div style={{ flex: 1, background: '#EFF6FF', borderRadius: '8px', padding: '10px 12px', border: '1px solid #93C5FD' }}>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#1E40AF', marginBottom: '2px' }}>🚢 Indent Sea</div>
                        <div style={{ fontSize: '13px', color: '#1E40AF' }}>Made to order — enquire for lead time</div>
                      </div>
                    </div>
                    <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#1a1a1a' }}>Indent orders are factory-direct and ideal for large volume orders with significant cost savings. Lead times commence after artwork proof approval.</p>
                  </div>
                  <div style={{ padding: '14px 16px', background: `${GOLD}15`, borderRadius: '10px', border: `1px solid ${GOLD}40`, display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span style={{ fontSize: '20px', flexShrink: 0 }}>⚡</span>
                    <p style={{ margin: 0, fontSize: '13px', color: '#1a1a1a', lineHeight: 1.6 }}>
                      <strong>Urgent deadline?</strong> Contact us as soon as possible at <strong>hello@quirkypromo.com.au</strong> or call <strong>02 9477 4748</strong> and we'll do our best to accommodate your timeline.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'Ordering Process' && (
                <div>
                  <p style={{ margin: '0 0 20px', color: '#1a1a1a', fontSize: '14px' }}>Four simple steps from quote to delivery — your branded products, done right.</p>
                  <div className="qp-steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
                    {[
                      {
                        num: 1, icon: '🛒', title: 'Place Your Order',
                        content: (
                          <div>
                            <div style={{ background: '#F8F7F4', borderRadius: '6px', padding: '8px 10px', marginBottom: '6px', border: '1px solid #E0DDD7' }}>
                              <div style={{ fontSize: '11px', fontWeight: 700, color: NAVY, marginBottom: '2px' }}>Add to Cart</div>
                              <div style={{ fontSize: '11px', color: '#1a1a1a' }}>Select colour & qty, pay by EFT or credit card</div>
                            </div>
                            <div style={{ textAlign: 'center', fontSize: '11px', color: '#1a1a1a', margin: '4px 0' }}>— or —</div>
                            <div style={{ background: '#F8F7F4', borderRadius: '6px', padding: '8px 10px', border: '1px solid #E0DDD7' }}>
                              <div style={{ fontSize: '11px', fontWeight: 700, color: NAVY, marginBottom: '2px' }}>Get a Quote</div>
                              <div style={{ fontSize: '11px', color: '#1a1a1a' }}>For custom requirements or large orders</div>
                            </div>
                          </div>
                        )
                      },
                      { num: 2, icon: '🎨', title: 'Artwork & Mockup', desc: 'Upload your logo. Our design team creates a free digital mockup for your approval.' },
                      { num: 3, icon: '⚙️', title: 'Approve & Produce', desc: 'Review and approve your proof. Once confirmed in writing, production begins immediately.' },
                      { num: 4, icon: '📦', title: 'Delivery', desc: 'Your branded products are dispatched Australia-wide. $30 flat rate, tracked to your door.' },
                    ].map(s => (
                      <div key={s.num} style={{ background: '#F8F7F4', borderRadius: '10px', padding: '14px', border: '1px solid #E0DDD7', borderTop: `3px solid ${GOLD}`, position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: GOLD, color: '#fff', fontSize: '10px', fontWeight: 700, borderRadius: '20px', padding: '2px 10px' }}>Step {s.num}</div>
                        <div style={{ fontSize: '22px', textAlign: 'center', margin: '8px 0 6px' }}>{s.icon}</div>
                        <div style={{ fontWeight: 700, color: NAVY, fontSize: '13px', textAlign: 'center', marginBottom: '8px', fontFamily: '"DM Sans", sans-serif' }}>{s.title}</div>
                        {s.content || <p style={{ margin: 0, fontSize: '12px', color: '#1a1a1a', lineHeight: 1.5, textAlign: 'center' }}>{s.desc}</p>}
                      </div>
                    ))}
                  </div>
                  <div style={{ padding: '14px 16px', background: `${GOLD}15`, borderRadius: '10px', border: `1px solid ${GOLD}40`, display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span style={{ fontSize: '18px', flexShrink: 0 }}>💬</span>
                    <p style={{ margin: 0, fontSize: '13px', color: '#1a1a1a', lineHeight: 1.6 }}>
                      Need help? Contact our team at <strong>hello@quirkypromo.com.au</strong> or call <strong>02 9477 4748</strong> — we're here to make the process seamless.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {similarProducts.length > 0 && (
        <div style={{ background: '#fff', borderTop: '1px solid #E0DDD7', padding: '48px 40px' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '28px', fontWeight: 600, color: NAVY, margin: '0 0 24px' }}>Similar Products</h2>
            <div className="qp-similar-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
              {similarProducts.map(p => {
                const img = getSimilarImage(p);
                const price = getSimilarLowestPrice(p);
                return (
                  <Link key={p.id} href={`/products/${p.slug}`} style={{ textDecoration: 'none' }}>
                    <div style={{ background: '#F8F7F4', borderRadius: '12px', overflow: 'hidden', border: '1px solid #E0DDD7', transition: 'box-shadow .2s, transform .2s' }}
                      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                      <div style={{ height: '180px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px' }}>
                        {img ? <ProductImg src={img} alt={`${p.name} with logo`} size="list" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <div style={{ fontSize: '32px', color: '#1a1a1a' }}>📦</div>}
                      </div>
                      <div style={{ padding: '14px 16px' }}>
                        <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '14px', fontWeight: 600, color: NAVY, marginBottom: '8px', lineHeight: '1.4' }}>{p.name}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          {price > 0 && (<div><div style={{ fontSize: '11px', color: '#1a1a1a' }}>As low as</div><div style={{ fontSize: '16px', fontWeight: 400, color: GOLD }}>${price.toFixed(2)}</div></div>)}
                          <div style={{ textAlign: 'right' }}><div style={{ fontSize: '11px', color: '#1a1a1a' }}>Min Qty</div><div style={{ fontSize: '16px', fontWeight: 400, color: NAVY }}>{p.min_qty}</div></div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {quoteOpen && (
        <QuoteModal
          product={product}
          colours={colours}
          decorations={decorations}
          addonState={addonState}
          pricingTiers={pricingTiers}
          calcUnit={calcUnit}
          selectedColour={selectedColour !== null ? colours[selectedColour]?.name : ''}
          qty={qty}
          onClose={() => setQuoteOpen(false)}
        />
      )}

      <CartDrawer open={cartAdded} onClose={() => setCartAdded(false)} />

    </div>
  );
}

function QuoteModal({ product, colours, decorations, pricingTiers, calcUnit, selectedColour, qty, addonState, onClose }) {
  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const STATES = ['ACT','NSW','NT','QLD','SA','TAS','VIC','WA'];
  const currentYear = new Date().getFullYear();
  const YEARS = [currentYear, currentYear+1, currentYear+2];

  const [form, setForm] = useState({
    qty: String(qty),
    requiredDate: '', purpose: '',
    street: '', street2: '', suburb: '', state: '', postcode: '',
    name: '', company: '', email: '', phone: '',
    notes: '', artworkFileName: '',
  });
  const [status, setStatus] = useState('idle');
  const [purposeOther, setPurposeOther] = useState(false);

  // Branding carried over from the product page selection (read-only here)
  const selectedDecos = decorations.filter(d => addonState?.[d.id]?.on);
  const brandingDecos = selectedDecos.filter(d => d.type !== 'addon');
  const addonDecos = selectedDecos.filter(d => d.type === 'addon');
  const brandingSummary = brandingDecos.map(d => brandingLabel(d, addonState?.[d.id]?.setupQty)).join(' · ') || 'Unbranded';

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit() {
    if (!form.name || !form.email) return;
    setStatus('sending');
    const requiredDate = form.requiredDate
      ? new Date(form.requiredDate + 'T00:00:00').toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })
      : '';
    const deliveryAddress = [form.street, form.street2, form.suburb, form.state, form.postcode, 'Australia'].filter(Boolean).join(', ');

    const formQty = parseInt(form.qty) || qty;

    // Find matching pricing tier
    const matchedTier = pricingTiers.reduce((best, tier) => {
      if (formQty >= tier.min_qty) return !best || tier.min_qty > best.min_qty ? tier : best;
      return best;
    }, null) || pricingTiers[0];

    // Price uses the SAME selection as the product page (calcUnit already includes chosen branding)
    const unitPrice = matchedTier ? calcUnit(matchedTier.base_price, formQty) : 0;
    const subtotal = Math.round(unitPrice * formQty * 100) / 100;
    const gst = Math.round((subtotal + SHIPPING) * GST * 100) / 100;
    const total = subtotal + SHIPPING + gst;

    try {
      const payload = {
        ...form,
        colour: selectedColour || '',
        requiredDate,
        deliveryAddress,
        brandingMethod: brandingDecos.map(d => d.name).join(', '),
        brandingSummary,
        extraOptions: addonDecos.map(d => d.name),
        productName: product.name,
        productSku: product.supplier_sku,
        unitPrice,
        subtotal,
        shipping: SHIPPING,
        gst,
        total,
        qty: formQty,
      };
      const { data: { session: _qs } } = await supabase.auth.getSession();
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(_qs ? { Authorization: `Bearer ${_qs.access_token}` } : {}) },
        body: JSON.stringify(payload),
      });
      if (res.ok) setStatus('success');
      else setStatus('error');
    } catch { setStatus('error'); }
  }

  function handleBackdrop(e) {
    if (e.target === e.currentTarget) onClose();
  }

  const inputStyle = {
    width: '100%', padding: '10px 14px', border: '1.5px solid #E0DDD7', borderRadius: '8px',
    fontSize: '14px', fontFamily: '"DM Sans", sans-serif', color: '#000000',
    outline: 'none', boxSizing: 'border-box', background: '#fff',
  };
  const selectStyle = {
    ...inputStyle, cursor: 'pointer', appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%231B2A4A' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center', paddingRight: '36px',
  };
  const labelStyle = {
    fontSize: '11px', fontWeight: 700, color: '#1B2A4A', marginBottom: '6px',
    display: 'block', textTransform: 'uppercase', letterSpacing: '0.08em',
    fontFamily: '"DM Sans", sans-serif',
  };

  // Section header — gold circle number like product page
  function SectionHead({ num, text }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#C9A96E', color: '#fff', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: '"DM Sans", sans-serif' }}>{num}</div>
        <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '13px', fontWeight: 700, color: '#1B2A4A', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{text}</div>
      </div>
    );
  }

  const canSubmit = form.name && form.email;

  return (
    <div onClick={handleBackdrop} style={{ position: 'fixed', inset: 0, background: 'rgba(27,42,74,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '580px', maxHeight: '92vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(27,42,74,0.3)' }}>

        {/* Sticky Header */}
        <div style={{ padding: '22px 28px 16px', borderBottom: '1px solid #E0DDD7', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'sticky', top: 0, background: '#fff', zIndex: 10 }}>
          <div>
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '26px', fontWeight: 600, color: '#1B2A4A', margin: '0 0 3px' }}>Get a Quote</h2>
            <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '13px', color: '#1a1a1a', margin: 0 }}>{product.name}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#1a1a1a', lineHeight: 1, padding: '4px 8px' }}>✕</button>
        </div>

        {status === 'success' ? (
          <div style={{ padding: '48px 32px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
            <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '24px', color: '#1B2A4A', margin: '0 0 10px' }}>Quote Request Sent!</h3>
            <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '14px', color: '#1a1a1a', margin: '0 0 24px' }}>We'll get back to you within 1 hour.</p>
            <button onClick={onClose} style={{ background: '#C9A96E', color: '#fff', border: 'none', borderRadius: '10px', padding: '13px 32px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}>Close</button>
          </div>
        ) : (
          <div style={{ padding: '24px 28px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* YOUR SELECTION — carried over from the product page */}
            <div>
              <SectionHead num={1} text="Your Selection" />
              <div style={{ background: '#F8F7F4', border: '1px solid #E0DDD7', borderRadius: '12px', padding: '16px 18px' }}>
                <div style={{ fontSize: '14px', color: '#1B2A4A', lineHeight: 1.6, fontFamily: '"DM Sans", sans-serif' }}>
                  <strong>{product.name}</strong>
                  {selectedColour ? <> · {selectedColour}</> : null}
                  {' · '}{brandingSummary}
                </div>
                <div style={{ marginTop: '14px', maxWidth: '200px' }}>
                  <label style={labelStyle}>Quantity *</label>
                  <input name="qty" type="text" inputMode="numeric" value={form.qty} onChange={handleChange}
                    placeholder={`min. ${product.min_qty}`}
                    style={{ ...inputStyle, fontFamily: '"DM Mono", monospace' }} />
                </div>
                <div style={{ marginTop: '8px', fontSize: '11px', color: '#000', fontFamily: '"DM Sans", sans-serif' }}>
                  Colour & branding follow your selection on the product page. Need changes? Note them below.
                </div>
              </div>
            </div>

            {/* SECTION 2: YOUR DETAILS (contact) */}
            <div style={{ borderTop: '1px solid #F0EEED', paddingTop: '20px' }}>
              <SectionHead num={2} text="Your Details" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={labelStyle}>Your Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} placeholder="Jane Smith" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Company</label>
                    <input name="company" value={form.company} onChange={handleChange} placeholder="Acme Corp" style={inputStyle} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={labelStyle}>Email *</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="jane@company.com" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Phone</label>
                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="04xx xxx xxx" style={{ ...inputStyle, fontFamily: '"DM Mono", monospace' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 3: DELIVERY ADDRESS */}
            <div style={{ borderTop: '1px solid #F0EEED', paddingTop: '20px' }}>
              <SectionHead num={3} text="Delivery Address" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <input name="street" value={form.street} onChange={handleChange}
                  placeholder="Address Line 1 (e.g. 123 George Street)" style={inputStyle} />
                <input name="street2" value={form.street2 || ''} onChange={handleChange}
                  placeholder="Address Line 2 (Suite, Level, Unit — optional)" style={inputStyle} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <input name="suburb" value={form.suburb} onChange={handleChange}
                    placeholder="Suburb" style={inputStyle} />
                  <select name="state" value={form.state} onChange={handleChange} style={selectStyle}>
                    <option value="">State / Territory</option>
                    {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <input name="postcode" value={form.postcode} onChange={handleChange}
                    placeholder="Postcode" style={{ ...inputStyle, fontFamily: '"DM Mono", monospace' }} />
                  <input value="Australia" readOnly style={{ ...inputStyle, background: '#F8F7F4', color: '#1a1a1a', cursor: 'not-allowed' }} />
                </div>
              </div>
              <div style={{ marginTop: '6px', fontSize: '11px', color: '#000', fontFamily: '"DM Sans", sans-serif' }}>
                Need delivery to multiple locations? Please note in More From You.
              </div>
            </div>

            {/* SECTION 4: MORE FROM YOU */}
            <div style={{ borderTop: '1px solid #F0EEED', paddingTop: '20px' }}>
              <SectionHead num={4} text="More From You" />

              <div style={{ marginBottom: '14px' }}>
                <label style={labelStyle}>Required Date</label>
                <input name="requiredDate" type="date" value={form.requiredDate} onChange={handleChange}
                  style={inputStyle} min={new Date().toISOString().split('T')[0]} />
                {form.requiredDate && (
                  <div style={{ marginTop: '6px', fontSize: '12px', color: '#1B2A4A', fontFamily: '"DM Sans", sans-serif', fontWeight: 600 }}>
                    📅 {new Date(form.requiredDate + 'T00:00:00').toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={labelStyle}>Occasion / Event <span style={{ color: '#000', fontWeight: 400 }}>(optional)</span></label>
                <select
                  value={purposeOther ? '__other__' : form.purpose}
                  onChange={e => {
                    const v = e.target.value;
                    if (v === '__other__') { setPurposeOther(true); setForm(f => ({ ...f, purpose: '' })); }
                    else { setPurposeOther(false); setForm(f => ({ ...f, purpose: v })); }
                  }}
                  style={selectStyle}
                >
                  <option value="">Select… (optional)</option>
                  <option>Client / Customer Gift</option>
                  <option>Staff / Employee Gift</option>
                  <option>Thank You Gift</option>
                  <option>Executive / VIP Gift</option>
                  <option>New Starter / Onboarding Kit</option>
                  <option>Trade Show / Expo</option>
                  <option>Conference / Seminar</option>
                  <option>Product Launch</option>
                  <option>Brand Awareness / Marketing</option>
                  <option>Promotional Giveaway</option>
                  <option>End of Year / Christmas Gift</option>
                  <option value="__other__">Other / Not sure</option>
                </select>
                {purposeOther && (
                  <input type="text" name="purpose" value={form.purpose} onChange={handleChange} placeholder="Tell us what it's for…" style={{ ...inputStyle, marginTop: '10px' }} />
                )}
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={labelStyle}>Upload Artwork <span style={{ color: '#000', fontWeight: 400, textTransform: 'none', fontSize: '11px' }}>(AI, PDF, PNG, JPG, EPS)</span></label>
                <div style={{ border: '1.5px dashed #C9A96E', borderRadius: '8px', padding: '16px', textAlign: 'center', background: '#FDF8F0', cursor: 'pointer' }}
                  onClick={() => document.getElementById('artworkUpload').click()}>
                  <div style={{ fontSize: '20px', marginBottom: '4px' }}>🎨</div>
                  <div style={{ fontSize: '13px', color: '#000', fontFamily: '"DM Sans", sans-serif' }}>Click to upload your logo / artwork</div>
                  <div style={{ fontSize: '11px', color: '#000', marginTop: '3px', fontFamily: '"DM Sans", sans-serif' }}>or email to hello@quirkypromo.com.au after submitting</div>
                  <input id="artworkUpload" type="file" accept=".ai,.pdf,.png,.jpg,.jpeg,.eps,.svg" style={{ display: 'none' }}
                    onChange={e => {
                      const file = e.target.files[0];
                      if (file) setForm(prev => ({ ...prev, artworkFileName: file.name }));
                    }} />
                </div>
                {form.artworkFileName && (
                  <div style={{ marginTop: '6px', fontSize: '12px', color: '#2D6A4F', fontFamily: '"DM Sans", sans-serif' }}>✅ {form.artworkFileName}</div>
                )}
              </div>

              <div>
                <label style={labelStyle}>Additional Notes</label>
                <textarea name="notes" value={form.notes} onChange={handleChange}
                  placeholder="e.g. Need 2 print positions, specific requirements, multiple delivery locations..."
                  rows={3} style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.6' }} />
              </div>
            </div>

            {/* Validation hint */}
            {!canSubmit && (
              <div style={{ textAlign: 'center', fontSize: '12px', color: '#000', fontFamily: '"DM Sans", sans-serif' }}>
                Please fill in your name and email to submit
              </div>
            )}

            {status === 'error' && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '12px 16px', fontSize: '13px', color: '#DC2626', fontFamily: '"DM Sans", sans-serif' }}>
                Something went wrong. Please try again or call us on 02 9477 4748.
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={status === 'sending' || !canSubmit}
              style={{
                width: '100%',
                background: !canSubmit ? '#C8C4BC' : status === 'sending' ? '#1B2A4A' : '#C9A96E',
                color: '#fff', border: 'none', borderRadius: '10px', padding: '18px',
                fontSize: '17px', fontWeight: 700,
                cursor: (!canSubmit || status === 'sending') ? 'not-allowed' : 'pointer',
                fontFamily: '"DM Sans", sans-serif', transition: 'background .25s',
                boxShadow: canSubmit && status !== 'sending' ? '0 4px 16px rgba(201,169,110,.4)' : 'none',
              }}
            >
              {status === 'sending' ? '⏳ Sending…' : 'Send Quote Request'}
            </button>

            {/* Reply line */}
            <p style={{ textAlign: 'center', fontSize: '14px', fontWeight: 600, color: '#1B2A4A', fontFamily: '"DM Sans", sans-serif', margin: 0 }}>
              We'll reply within 1 hour · 📞 02 9477 4748
            </p>

          </div>
        )}
      </div>
    </div>
  );
}
function StepLabel({ num, text }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: GOLD, color: '#fff', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{num}</div>
      <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '20px', fontWeight: 600, color: NAVY }}>{text}</div>
    </div>
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

function SpecGroup({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  const hasContent = Array.isArray(children) ? children.some(Boolean) : Boolean(children);
  if (!hasContent) return null;
  return (
    <div style={{ marginBottom: '8px', border: '1px solid #E0DDD7', borderRadius: '10px', overflow: 'hidden' }}>
      <button onClick={() => setOpen(o => !o)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', background: '#F8F7F4', border: 'none', cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', fontWeight: 700, fontSize: '13px', color: NAVY, textAlign: 'left' }}>
        <span>{title}</span>
        <span style={{ fontSize: '16px', color: '#1a1a1a', transition: 'transform .2s', display: 'inline-block', transform: open ? 'rotate(180deg)' : 'none' }}>▾</span>
      </button>
      {open && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>{children}</tbody>
        </table>
      )}
    </div>
  );
}

function NotebookSpecs({ product }) {
  const leadTime = product.indent_type === 'indent_air'
    ? (product.indent_lead_time ? `Production: ${product.indent_lead_time} business days (Air Freight, after artwork approval)` : 'Indent order (Air Freight) — enquire for lead time')
    : product.indent_type === 'indent_sea'
    ? (product.indent_lead_time ? `Production: ${product.indent_lead_time} business days (Sea Freight, after artwork approval)` : 'Indent order (Sea Freight) — enquire for lead time')
    : 'Production: 3-7 business days (after artwork approval)';
  return (
    <div>
      <SpecGroup title="📓 Notebook" defaultOpen={true}>
        {product.cover_type && <SpecRow label="Cover Type" value={product.cover_type} />}
        {product.cover_material && <SpecRow label="Cover Material" value={product.cover_material} />}
        {product.page_size && <SpecRow label="Size" value={product.page_size} />}
        {product.page_count && <SpecRow label="Pages" value={String(product.page_count)} />}
        {product.ruling && <SpecRow label="Ruling" value={product.ruling} />}
        {product.paper_material && <SpecRow label="Paper Material" value={product.paper_material} />}
        {product.paper_weight && <SpecRow label="Paper Weight" value={product.paper_weight} />}
        {product.page_colour && <SpecRow label="Page Colour" value={product.page_colour} />}
        {product.page_edges && <SpecRow label="Page Edges" value={product.page_edges} />}
        {product.binding && <SpecRow label="Binding" value={product.binding} />}
        {product.closure && <SpecRow label="Closure" value={product.closure} />}
        {product.ribbon === true && <SpecRow label="Ribbon Marker" value="✓ Included" />}
        {product.pen_loop === true && <SpecRow label="Pen Loop" value="✓ Included" />}
        {product.accordion_pocket === true && <SpecRow label="Accordion Pocket" value="✓ Included" />}
        {product.belly_band === true && <SpecRow label="Belly Band" value="✓ Available" />}
        {product.debossing === true && <SpecRow label="Debossing" value="✓ Available" />}
      </SpecGroup>
      {product.includes_pen === true && (
        <SpecGroup title="🖊️ Pen" defaultOpen={true}>
          {product.pen_type && <SpecRow label="Pen Type" value={product.pen_type} />}
          {product.pen_mechanism && <SpecRow label="Mechanism" value={product.pen_mechanism} />}
          {product.pen_barrel_finish && <SpecRow label="Barrel Finish" value={product.pen_barrel_finish} />}
          {product.pen_trim && <SpecRow label="Trim" value={product.pen_trim} />}
          {product.pen_nib_size && <SpecRow label="Nib Size" value={product.pen_nib_size} />}
          {product.pen_ink_colour && <SpecRow label="Ink Colour" value={product.pen_ink_colour} />}
          {product.pen_refill_colour && <SpecRow label="Refill Colour" value={product.pen_refill_colour} />}
          {product.pen_writing_distance && <SpecRow label="Writing Distance" value={product.pen_writing_distance} />}
          {product.pen_laser_finish && <SpecRow label="Laser Engrave Finish" value={product.pen_laser_finish} />}
          {product.pen_refillable === true && <SpecRow label="Refillable" value="✓ Yes" />}
        </SpecGroup>
      )}
      <SpecGroup title="📦 Packaging & Order Info" defaultOpen={false}>
        {product.includes_gift_box === true && <SpecRow label="Gift Box" value={product.gift_box ? `✓ Included (${product.gift_box})` : '✓ Included'} />}
        {product.notebook_includes && <SpecRow label="Includes" value={product.notebook_includes} />}
        {product.packing && <SpecRow label="Packaging" value={product.packing} />}
        {product.min_qty && <SpecRow label="Min. Order Qty" value={`${product.min_qty} units`} />}
        <SpecRow label="Lead Time" value={leadTime} />
        <SpecRow label="SKU" value={product.supplier_sku} />
      </SpecGroup>
    </div>
  );
}

function FlatSpecTable({ product }) {
  const [expanded, setExpanded] = useState(false);
  const PREVIEW = 5;
  const leadTime = product.indent_type === 'indent_air'
    ? (product.indent_lead_time ? `Production: ${product.indent_lead_time} business days (Air Freight, after artwork approval)` : 'Indent order (Air Freight) — enquire for lead time')
    : product.indent_type === 'indent_sea'
    ? (product.indent_lead_time ? `Production: ${product.indent_lead_time} business days (Sea Freight, after artwork approval)` : 'Indent order (Sea Freight) — enquire for lead time')
    : 'Production: 3-7 business days (after artwork approval)';
// 通用 specs 表(Technology 起所有抓了 specs 的产品)— 必须放在 Drinkware 判断之前
  const specRows = Array.isArray(product.specs) ? product.specs.filter(s => s && s.name && s.value) : [];
  if (specRows.length > 0) {
    return (
      <div>
        <SpecGroup title="📊 Product Specs" defaultOpen={true}>
          {specRows.map((s, i) => (
            <SpecRow
              key={i}
              label={s.name}
              value={s.value === 'Yes' ? '✓ Yes' : s.value === 'No' ? '✗ No' : s.value}
            />
          ))}
        </SpecGroup>

        <SpecGroup title="📦 Packaging & Order Info" defaultOpen={false}>
          {product.gift_box && product.gift_box !== 'None' && <SpecRow label="Gift Box" value={product.includes_gift_box ? `✓ Included (${product.gift_box})` : `Optional (${product.gift_box})`} />}
          {product.packing && <SpecRow label="Packaging" value={product.packing} />}
          {product.min_qty && <SpecRow label="Min. Order Qty" value={`${product.min_qty} units`} />}
          <SpecRow label="Lead Time" value={leadTime} />
          <SpecRow label="SKU" value={product.supplier_sku} />
        </SpecGroup>
      </div>
    );
  }
  // Check if this is Drinkware
  if (product.category === 'Drinkware' || product.capacity) {
    return (
      <div>
        <SpecGroup title="📊 Product Specs" defaultOpen={true}>
          {product.capacity && <SpecRow label="Capacity" value={product.capacity} />}
          {product.insulation && <SpecRow label="Insulation" value={product.insulation} />}
          {product.finish && <SpecRow label="Finish" value={product.finish} />}
          {product.is_bpa_free === true && <SpecRow label="BPA Free" value="✓ Yes" />}
          {product.is_hot_suitable === true && <SpecRow label="Hot Drinks" value="✓ Suitable" />}
          {product.keep_hot_hours && <SpecRow label="Keep Hot" value={`${product.keep_hot_hours} hours`} />}
          {product.keep_cold_hours && <SpecRow label="Keep Cold" value={`${product.keep_cold_hours} hours`} />}
          {product.is_dishwasher_safe === true && <SpecRow label="Dishwasher Safe" value="✓ Yes" />}
{product.is_dishwasher_safe === false && <SpecRow label="Wash Instructions" value="✗ Hand Wash Recommended" />}
{product.is_carbonated_suitable === true && <SpecRow label="Carbonated Liquids" value="✓ Suitable" />}
{product.is_carbonated_suitable === false && <SpecRow label="Carbonated Liquids" value="✗ Not Suitable" />}
        </SpecGroup>

        <SpecGroup title="🔒 Lid & Handle" defaultOpen={true}>
          {product.lid_style && <SpecRow label="Lid Style" value={product.lid_style} />}
          {product.lid_attachment && <SpecRow label="Lid Attachment" value={product.lid_attachment} />}
          {product.carry_handle === true && <SpecRow label="Carry Handle" value="✓ Included" />}
          {product.straw_included === true && <SpecRow label="Straw" value="✓ Included" />}
        </SpecGroup>

        <SpecGroup title="📦 Packaging & Order Info" defaultOpen={false}>
          {product.gift_box && product.gift_box !== 'None' && <SpecRow label="Gift Box" value={product.includes_gift_box ? `✓ Included (${product.gift_box})` : `Optional (${product.gift_box})`} />}
          {product.packing && <SpecRow label="Packaging" value={product.packing} />}
          {product.min_qty && <SpecRow label="Min. Order Qty" value={`${product.min_qty} units`} />}
          <SpecRow label="Lead Time" value={leadTime} />
          <SpecRow label="SKU" value={product.supplier_sku} />
        </SpecGroup>
      </div>
    );
  }
   if (product.category === 'Pens' || product.pen_type || product.pen_mechanism) {
    return (
      <div>
        <SpecGroup title="🖊️ Product Specs" defaultOpen={true}>
          {product.pen_type && <SpecRow label="Pen Type" value={product.pen_type} />}
          {product.pen_mechanism && <SpecRow label="Mechanism" value={product.pen_mechanism} />}
          {product.pen_nib_size && <SpecRow label="Nib Size" value={product.pen_nib_size} />}
          {product.pen_writing_distance && <SpecRow label="Writing Distance" value={product.pen_writing_distance} />}
          {product.pen_barrel_finish && <SpecRow label="Barrel Finish" value={product.pen_barrel_finish} />}
          {product.pen_trim && <SpecRow label="Trim" value={product.pen_trim} />}
          {product.pen_ink_colour && <SpecRow label="Refill Colour" value={product.pen_ink_colour} />}
          {product.pen_laser_finish && <SpecRow label="Laser Engrave Finish" value={product.pen_laser_finish} />}
          {product.pen_refillable === true && <SpecRow label="Refillable" value="✓ Yes" />}
        </SpecGroup>

        <SpecGroup title="📦 Packaging & Order Info" defaultOpen={false}>
          {product.gift_box && product.gift_box !== 'None' && <SpecRow label="Gift Box" value={product.includes_gift_box ? `✓ Included (${product.gift_box})` : `Optional (${product.gift_box})`} />}
          {product.packing && <SpecRow label="Packaging" value={product.packing} />}
          {product.min_qty && <SpecRow label="Min. Order Qty" value={`${product.min_qty} units`} />}
          <SpecRow label="Lead Time" value={leadTime} />
          <SpecRow label="SKU" value={product.supplier_sku} />
        </SpecGroup>
      </div>
    );
  }
  // Original flat table for other categories
  const rows = [
    product.capacity && { label: 'Capacity', value: product.capacity },
    product.closure && { label: 'Closure', value: product.closure },
    product.brand && { label: 'Brand', value: product.brand },
    product.is_eco === true && { label: 'Eco-Friendly', value: '✓ Yes' },
    product.insulation && { label: 'Insulation', value: product.insulation },
    product.lid_style && { label: 'Lid Style', value: product.lid_style },
    product.lid_attachment && { label: 'Lid Attachment', value: product.lid_attachment },
    product.finish && { label: 'Finish', value: product.finish },
    product.is_bpa_free === true && { label: 'BPA Free', value: '✓ Yes' },
    product.is_dishwasher_safe === true && { label: 'Dishwasher Safe', value: '✓ Yes' },
    product.is_hot_suitable === true && { label: 'Hot Drinks', value: '✓ Suitable' },
    product.keep_hot_hours && { label: 'Keep Hot', value: `${product.keep_hot_hours} hours` },
    product.keep_cold_hours && { label: 'Keep Cold', value: `${product.keep_cold_hours} hours` },
    product.carry_handle === true && { label: 'Carry Handle', value: '✓ Included' },
    product.straw_included === true && { label: 'Straw', value: '✓ Included' },
    product.gift_box && product.gift_box !== 'None' && { label: 'Gift Box', value: product.gift_box },
    product.packing && { label: 'Packaging', value: product.packing },
    product.min_qty && { label: 'Min. Order Qty', value: `${product.min_qty} units` },
    { label: 'Lead Time', value: leadTime },
    { label: 'SKU', value: product.supplier_sku },
  ].filter(Boolean);

  const visible = expanded ? rows : rows.slice(0, PREVIEW);
  return (
    <div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>{visible.map((r, i) => <SpecRow key={i} label={r.label} value={r.value} />)}</tbody>
      </table>
      {rows.length > PREVIEW && (
        <button onClick={() => setExpanded(e => !e)} style={{ marginTop: '10px', width: '100%', padding: '9px', background: 'none', border: '1.5px solid #E0DDD7', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#1B2A4A', fontFamily: '"DM Sans", sans-serif' }}>
          {expanded ? '▲ Show Less' : `▼ Show More (${rows.length - PREVIEW} more)`}
        </button>
      )}
    </div>
  );
}

function SpecRow({ label, value }) {
  return (
    <tr style={{ borderBottom: '1px solid #F0EEED', fontFamily: '"DM Sans", sans-serif' }}>
      <td style={{ width: '160px', verticalAlign: 'top', padding: '8px 0', color: '#1a1a1a', fontSize: '13px' }}>{label}</td>
      <td style={{ padding: '8px 0', fontWeight: 500, color: NAVY }}>{value}</td>
    </tr>
  );
}

const qtyBtnStyle = { width: '38px', height: '42px', background: '#F8F7F4', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#1a1a1a', fontFamily: '"DM Sans", sans-serif' };
const thStyle = { fontSize: '11px', fontWeight: 600, padding: '8px 10px', textAlign: 'center', color: '#1a1a1a', borderBottom: '1px solid #E0DDD7', fontFamily: '"DM Sans", sans-serif' };
const tdStyle = { padding: '8px 10px', fontSize: '13px', textAlign: 'center', fontFamily: '"DM Sans", sans-serif' };
const tdLabelStyle = { padding: '8px 12px', fontSize: '12px', color: '#1a1a1a', fontWeight: 500, background: '#FAFAF8', fontFamily: '"DM Sans", sans-serif' };
function SizeChartTable({ sizeChart }) {
  if (!sizeChart || !Array.isArray(sizeChart.sizes) || !sizeChart.sizes.length) return null;
  return (
    <div style={{ border: '1.5px solid #E0DDD7', borderRadius: '10px', overflow: 'hidden', marginTop: '14px' }}>
      <div style={{ background: '#F8F7F4', padding: '10px 14px', fontSize: '12px', fontWeight: 700, borderBottom: '1px solid #E0DDD7', color: '#000000', textTransform: 'uppercase', letterSpacing: '0.8px', textAlign: 'center' }}>
        Size Chart {sizeChart.unit ? `(${sizeChart.unit})` : ''}
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead><tr>
          <th style={{ ...thStyle, textAlign: 'left' }}>Measurement</th>
          {sizeChart.sizes.map(s => <th key={s} style={thStyle}>{s}</th>)}
        </tr></thead>
        <tbody>
          {(sizeChart.measurements || []).map((m, i) => (
            <tr key={i} style={{ background: i % 2 ? '#FAFAF8' : '#fff' }}>
              <td style={tdLabelStyle}>{m.name}</td>
              {(m.values || []).map((v, j) => <td key={j} style={tdStyle}>{v}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    <style>{`
        @media (max-width: 768px) {
          .qp-padx { padding-left: 16px !important; padding-right: 16px !important; }
          .qp-pdp-main {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
            padding: 20px 16px 48px !important;
          }
          .qp-pdp-h1 { font-size: 26px !important; }
          .qp-pdp-benefits { grid-template-columns: 1fr !important; }
          .qp-pdp-2col { grid-template-columns: 1fr !important; }
          .qp-pdp-left { position: static !important; top: auto !important; }
        }
      `}</style>
    </div>
  );
}
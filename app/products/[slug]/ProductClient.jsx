'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';
const MARGIN = 1.40;
const GST = 0.10;
const SHIPPING = 30;
const SETUP_FEE = 40;
const TABS = ['Description', 'Specifications', 'Decoration', 'Packaging', 'How to Order', 'Returns', 'Shipping'];

export default function ProductClient({ product, mainImage, colours, extraImages, pricingTiers, decorations }) {
  const [selectedColour, setSelectedColour] = useState(null);
  const [leftIdx, setLeftIdx] = useState(0);
  const [qty, setQty] = useState(product.min_qty || 48);
  const [qtyInput, setQtyInput] = useState(String(product.min_qty || 48));
  const [activeTab, setActiveTab] = useState('Description');
  const [similarProducts, setSimilarProducts] = useState([]);
  const [addonState, setAddonState] = useState(() => {
    const s = {};
    decorations.forEach(d => {
      s[d.id] = { on: false, setupQty: d.default_setup_qty || 1 };
    });
    return s;
  });

  // Bottom thumbnails: main image + extra angles
  const bottomImages = [mainImage, ...(extraImages || [])].filter(Boolean);

  // Big image: if colour selected → that colour's image, else → bottom thumb
  const bigImage = selectedColour !== null
    ? (colours[selectedColour]?.image || mainImage)
    : (bottomImages[leftIdx] || mainImage);

  // Fetch similar products
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
      unit += d.per_unit * MARGIN;
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

  return (
    <div style={{ fontFamily: '"DM Sans", sans-serif', background: '#F8F7F4', color: '#1a1a1a' }}>

      {/* BREADCRUMB */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E0DDD7', padding: '12px 40px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', fontSize: '13px', color: '#7A7570' }}>
          <Link href="/" style={{ color: '#7A7570', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 8px' }}>›</span>
          <Link href={`/category/${encodeURIComponent((product.category || '').toLowerCase())}`} style={{ color: '#7A7570', textDecoration: 'none' }}>{product.category}</Link>
          <span style={{ margin: '0 8px' }}>›</span>
          <Link href={`/subcategory/${encodeURIComponent((product.subcategory || '').toLowerCase().replace(/ /g, '-'))}`} style={{ color: '#7A7570', textDecoration: 'none' }}>{product.subcategory}</Link>
          <span style={{ margin: '0 8px' }}>›</span>
          <span style={{ color: NAVY, fontWeight: 600 }}>{product.name}</span>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 40px 60px', display: 'grid', gridTemplateColumns: '480px 1fr', gap: '48px', alignItems: 'start' }}>

        {/* LEFT: BIG IMAGE + HORIZONTAL THUMBNAILS */}
        <div style={{ position: 'sticky', top: '70px' }}>
          <div style={{ background: '#fff', border: '1px solid #E0DDD7', borderRadius: '16px', width: '100%', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: '12px' }}>
            {bigImage
              ? <img src={bigImage} alt={product.name} style={{ width: '85%', height: '85%', objectFit: 'contain' }} />
              : <div style={{ color: '#B0AAA3', fontSize: '14px' }}>No image available</div>
            }
          </div>

          {/* BOTTOM THUMBNAILS — main image + extra angles */}
          {bottomImages.length > 1 && (
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
              {bottomImages.map((src, i) => (
                <div key={i} onClick={() => handleBottomThumb(i)} style={{ cursor: 'pointer', flexShrink: 0 }}>
                  <div style={{
                    width: '80px', height: '80px', borderRadius: '10px',
                    border: leftIdx === i && selectedColour === null ? `2.5px solid ${GOLD}` : '1.5px solid #E0DDD7',
                    background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    overflow: 'hidden',
                    boxShadow: leftIdx === i && selectedColour === null ? `0 2px 8px rgba(201,169,110,.3)` : 'none',
                  }}>
                    <img src={src} alt="" style={{ width: '90%', height: '90%', objectFit: 'contain' }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: DETAILS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* TITLE */}
          <div>
            <div style={{ fontSize: '12px', color: '#B0AAA3', marginBottom: '6px', fontFamily: '"DM Mono", monospace', letterSpacing: '1px' }}>{product.supplier_sku}</div>
            <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '34px', fontWeight: 600, margin: '0 0 8px', color: NAVY, lineHeight: 1.2 }}>{product.name}</h1>
            <div style={{ fontSize: '14px', color: GOLD, fontWeight: 500, minHeight: '22px' }}>
              {selectedColour !== null ? `Colour: ${colours[selectedColour]?.name}` : ''}
            </div>
          </div>

          {/* STEP 1: COLOUR */}
          {colours.length > 0 && (
            <div>
              <StepLabel num={1} text="Choose Product Colour" />
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '12px' }}>
                {colours.map((c, i) => (
                  <div key={i} onClick={() => handleSelectColour(i)} style={{ cursor: 'pointer', textAlign: 'center' }}>
                    <div style={{
                      width: '64px', height: '64px', borderRadius: '10px',
                      border: selectedColour === i ? `2.5px solid ${GOLD}` : '1.5px solid #E0DDD7',
                      background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      overflow: 'hidden', marginBottom: '6px',
                      boxShadow: selectedColour === i ? `0 2px 10px rgba(201,169,110,.3)` : '0 1px 3px rgba(0,0,0,.06)',
                      transition: 'border .15s, box-shadow .15s',
                    }}>
                      {c.image
                        ? <img src={c.image} alt={c.name} style={{ width: '90%', height: '90%', objectFit: 'contain' }} />
                        : c.hex
                          ? <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: c.hex }} />
                          : <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#E0DDD7' }} />
                      }
                    </div>
                    <div style={{ fontSize: '10px', color: selectedColour === i ? GOLD : '#7A7570', fontWeight: selectedColour === i ? 600 : 400, maxWidth: '64px', lineHeight: '1.2', fontFamily: '"DM Sans", sans-serif' }}>
                      {c.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: QUANTITY */}
          <div>
            <StepLabel num={colours.length > 0 ? 2 : 1} text="Enter Quantity" />
            <div style={{ fontSize: '13px', color: '#7A7570', margin: '6px 0 12px' }}>Minimum order: <strong style={{ color: NAVY }}>{product.min_qty} units</strong></div>
            <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #C8C4BC', borderRadius: '8px', overflow: 'hidden', width: 'fit-content' }}>
              <button onClick={() => handleQtyChange(String(Math.max(product.min_qty, qty - 1)))} style={qtyBtnStyle}>−</button>
              <input type="number" value={qtyInput} onChange={e => handleQtyChange(e.target.value)} style={{ width: '80px', textAlign: 'center', border: 'none', padding: '10px', fontSize: '16px', fontWeight: 600, outline: 'none', fontFamily: '"DM Sans", sans-serif', color: NAVY }} />
              <button onClick={() => handleQtyChange(String(qty + 1))} style={qtyBtnStyle}>+</button>
            </div>
            {!isValidQty && <div style={{ fontSize: '12px', color: '#C0392B', marginTop: '8px' }}>Minimum order quantity is {product.min_qty} units.</div>}
          </div>

          {/* UNBRANDED PRICING */}
          {pricingTiers.length > 0 && (
            <div style={{ border: '1px solid #E0DDD7', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ background: '#F8F7F4', padding: '10px 14px', fontSize: '12px', fontWeight: 700, borderBottom: '1px solid #E0DDD7', color: NAVY, textTransform: 'uppercase', letterSpacing: '0.8px' }}>Unbranded Pricing (excl. GST)</div>
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
                    {pricingTiers.map((t, i) => { const isActive = activeTier?.id === t.id; return <td key={t.id} style={{ ...tdStyle, color: '#2D6A4F', fontSize: '12px', background: isActive ? '#FDF8F0' : undefined }}>{i === 0 ? '—' : Math.round((1 - (t.base_price * MARGIN) / firstRetailPrice) * 100) + '%'}</td>; })}
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* STEP 3: BRANDING */}
          {decorations.length > 0 && (
            <div>
              <StepLabel num={colours.length > 0 ? 3 : 2} text="Add Branding Options" />
              <div style={{ border: '1px solid #E0DDD7', borderRadius: '10px', overflow: 'hidden', marginTop: '10px' }}>
                <div style={{ background: '#F8F7F4', padding: '10px 14px', fontSize: '12px', fontWeight: 700, borderBottom: '1px solid #E0DDD7', color: NAVY, textTransform: 'uppercase', letterSpacing: '0.8px' }}>Branding & Decoration</div>
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
                    {decorations.map(d => {
                      const st = addonState[d.id] || { on: false, setupQty: 1 };
                      return (
                        <tr key={d.id} style={{ borderBottom: '1px solid #F0EEED' }}>
                          <td style={{ padding: '10px 14px' }}>
                            <div style={{ fontSize: '13px', fontWeight: 500, color: NAVY }}>{d.name}</div>
                            {d.detail && d.detail !== 'EMPTY' && <div style={{ fontSize: '11px', color: '#7A7570', marginTop: '2px' }}>{d.detail}</div>}
                          </td>
                          <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                            <label style={{ position: 'relative', width: '44px', height: '24px', cursor: 'pointer', display: 'inline-block' }}>
                              <input type="checkbox" checked={st.on} onChange={e => toggleAddon(d.id, e.target.checked)} style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }} />
                              <span style={{ position: 'absolute', inset: 0, background: st.on ? GOLD : '#C8C4BC', borderRadius: '12px', transition: 'background .2s' }} />
                              <span style={{ position: 'absolute', top: '3px', left: st.on ? '23px' : '3px', width: '18px', height: '18px', background: '#fff', borderRadius: '50%', transition: 'left .2s', boxShadow: '0 1px 3px rgba(0,0,0,.2)' }} />
                            </label>
                          </td>
                          <td style={{ ...tdStyle, fontWeight: 500, color: NAVY }}>${(d.per_unit * MARGIN).toFixed(2)}</td>
                          <td style={{ ...tdStyle, color: '#7A7570' }}>{qty}</td>
                          <td style={tdStyle}>{d.has_setup ? `$${(SETUP_FEE * MARGIN).toFixed(2)}` : '—'}</td>
                          <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                            {d.has_setup
                              ? <input type="number" value={st.setupQty} min="1" disabled={!st.on || !d.setup_qty_editable} onChange={e => setSetupQty(d.id, e.target.value)} style={{ width: '54px', border: '1.5px solid #C8C4BC', borderRadius: '6px', padding: '5px 6px', fontSize: '13px', fontWeight: 600, textAlign: 'center', fontFamily: '"DM Sans", sans-serif', background: (!st.on || !d.setup_qty_editable) ? '#F4F2EE' : '#fff', color: (!st.on || !d.setup_qty_editable) ? '#B0AAA3' : NAVY, outline: 'none' }} />
                              : <span style={{ color: '#B0AAA3' }}>—</span>}
                          </td>
                        </tr>
                      );
                    })}
                    <tr>
                      <td style={{ padding: '10px 14px' }}>
                        <div style={{ fontSize: '13px', fontWeight: 500, color: NAVY }}>Shipping & Handling</div>
                        <div style={{ fontSize: '11px', color: '#7A7570' }}>Flat rate per order</div>
                      </td>
                      <td /><td /><td />
                      <td style={{ ...tdStyle, fontWeight: 500, color: NAVY }}>${SHIPPING.toFixed(2)}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'center', color: '#B0AAA3' }}>1</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PRICE SUMMARY TABLE */}
          {pricingTiers.length > 0 && (
            <div style={{ border: '1px solid #E0DDD7', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ background: '#F8F7F4', padding: '10px 14px', fontSize: '12px', fontWeight: 700, borderBottom: '1px solid #E0DDD7', color: NAVY, textTransform: 'uppercase', letterSpacing: '0.8px' }}>Price Summary</div>
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
                    {pricingTiers.map(t => { const u = calcUnit(t.base_price, t.min_qty); const isActive = activeTier?.id === t.id; return <td key={t.id} style={{ ...tdStyle, fontWeight: 600, color: isActive ? GOLD : NAVY, background: isActive ? '#FDF8F0' : undefined }}>${(u * t.min_qty).toFixed(2)}</td>; })}
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* DARK PRICE SUMMARY */}
          {isValidQty && unitPrice > 0 && (
            <div style={{ background: NAVY, borderRadius: '16px', padding: '24px', color: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,.4)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Unit price (excl. GST)</div>
                  <div style={{ fontFamily: '"DM Mono", monospace', fontSize: '32px', fontWeight: 500, color: GOLD }}>${unitPrice.toFixed(2)}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,.4)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Subtotal (excl. GST)</div>
                  <div style={{ fontFamily: '"DM Mono", monospace', fontSize: '26px', fontWeight: 500, color: '#fff' }}>${subtotal.toFixed(2)}</div>
                </div>
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,.12)', margin: '0 0 14px' }} />
              <PriceRow label="Subtotal (excl. GST)" value={`$${subtotal.toFixed(2)}`} />
              <PriceRow label="Shipping & Handling" value={`$${SHIPPING.toFixed(2)}`} />
              <PriceRow label="GST (10%)" value={`$${gstAmt.toFixed(2)}`} />
              <PriceRow label="Total (incl. GST)" value={`$${grand.toFixed(2)}`} bold />
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,.25)', marginTop: '8px' }}>All prices in AUD. GST invoice provided with order.</div>
            </div>
          )}

          {/* ADD TO CART */}
          <button disabled={!isValidQty} style={{ width: '100%', background: isValidQty ? GOLD : '#C8C4BC', color: '#fff', border: 'none', borderRadius: '12px', padding: '20px', fontSize: '19px', fontWeight: 700, cursor: isValidQty ? 'pointer' : 'not-allowed', fontFamily: '"DM Sans", sans-serif', boxShadow: isValidQty ? '0 4px 16px rgba(201,169,110,.4)' : 'none' }}>
            {isValidQty ? `Add to Cart  —  $${grand.toFixed(2)} incl. GST` : 'Enter quantity to see pricing'}
          </button>

          {/* GET A QUOTE */}
          <button style={{ width: '100%', background: NAVY, color: '#fff', border: 'none', borderRadius: '12px', padding: '18px', fontSize: '17px', fontWeight: 700, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>💬</span> Get a Quote / Ask a Question
          </button>

          {/* TRUST BADGES */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            {[{ icon: '🎨', text: 'Free digital proof' }, { icon: '🚚', text: '$30 flat shipping' }, { icon: '✅', text: 'Quality guarantee' }].map(b => (
              <div key={b.text} style={{ background: '#fff', border: '1px solid #E0DDD7', borderRadius: '10px', padding: '14px 10px', textAlign: 'center' }}>
                <div style={{ fontSize: '22px', marginBottom: '6px' }}>{b.icon}</div>
                <div style={{ fontSize: '12px', color: NAVY, fontWeight: 500 }}>{b.text}</div>
              </div>
            ))}
          </div>

          {/* TABS */}
          <div style={{ border: '1px solid #E0DDD7', borderRadius: '10px', overflow: 'hidden', background: '#fff' }}>
            <div style={{ display: 'flex', overflowX: 'auto', borderBottom: '1px solid #E0DDD7' }}>
              {TABS.map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} style={{ flexShrink: 0, padding: '14px 18px', fontSize: '15px', fontWeight: 700, color: activeTab === tab ? NAVY : '#B0AAA3', background: activeTab === tab ? '#FDF8F0' : 'none', border: 'none', borderBottom: activeTab === tab ? `3px solid ${GOLD}` : '3px solid transparent', cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', whiteSpace: 'nowrap' }}>
                  {tab}
                </button>
              ))}
            </div>
            <div style={{ padding: '24px', fontSize: '14px', lineHeight: '1.8', color: '#3D3A36', fontFamily: '"DM Sans", sans-serif' }}>
              {activeTab === 'Description' && (
                <>{product.description ? <p style={{ margin: '0 0 12px' }}>{product.description}</p> : <p style={{ margin: 0, color: '#B0AAA3' }}>No description available.</p>}
                  {product.short_desc && <p style={{ margin: 0, color: '#7A7570' }}>{product.short_desc}</p>}</>
              )}
              {activeTab === 'Specifications' && (
                <><SpecRow label="Min. Order Qty" value={`${product.min_qty} units`} />
                  {product.lead_time_days && <SpecRow label="Lead Time" value={`${product.lead_time_days} days`} />}
                  {product.packing && <SpecRow label="Packing" value={product.packing} />}
                  <SpecRow label="SKU" value={product.supplier_sku} /></>
              )}
              {activeTab === 'Decoration' && (
                <>{decorations.length > 0 ? decorations.map(d => (
                  <div key={d.id} style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #F0EEED' }}>
                    <div style={{ fontWeight: 700, color: NAVY, marginBottom: '2px' }}>{d.name}</div>
                    {d.detail && d.detail !== 'EMPTY' && <div style={{ color: '#7A7570', fontSize: '13px' }}>{d.detail}</div>}
                  </div>
                )) : <p style={{ margin: 0, color: '#B0AAA3' }}>No decoration options available.</p>}</>
              )}
              {activeTab === 'Packaging' && <p style={{ margin: 0 }}>{product.packing || 'Packaging information not available.'}</p>}
              {activeTab === 'How to Order' && (
                <ol style={{ margin: 0, paddingLeft: '20px' }}>
                  <li style={{ marginBottom: '8px' }}>Select your colour and enter your required quantity above.</li>
                  <li style={{ marginBottom: '8px' }}>Choose any branding options you need.</li>
                  <li style={{ marginBottom: '8px' }}>Click <strong>Add to Cart</strong> or <strong>Get a Quote</strong> for custom arrangements.</li>
                  <li style={{ marginBottom: '8px' }}>Our team will send you a free digital proof before production.</li>
                  <li>Approve the proof and we'll get your order into production.</li>
                </ol>
              )}
              {activeTab === 'Returns' && (
                <><p style={{ margin: '0 0 10px' }}>We stand behind every order. If there's a quality issue, we'll make it right.</p>
                  <p style={{ margin: 0, color: '#7A7570' }}>Custom branded products cannot be returned unless there is a manufacturing defect. Contact us within 14 days of receiving your order.</p></>
              )}
              {activeTab === 'Shipping' && (
                <><p style={{ margin: '0 0 10px' }}><strong>$30 flat rate</strong> shipping on all orders Australia-wide.</p>
                  <p style={{ margin: '0 0 10px' }}>Standard production time is 7–10 business days after proof approval.</p>
                  <p style={{ margin: 0, color: '#7A7570' }}>Delivery typically takes 2–5 business days after dispatch.</p></>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SIMILAR PRODUCTS */}
      {similarProducts.length > 0 && (
        <div style={{ background: '#fff', borderTop: '1px solid #E0DDD7', padding: '48px 40px' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '28px', fontWeight: 600, color: NAVY, margin: '0 0 24px' }}>Similar Products</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
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
                        {img ? <img src={img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                          : <div style={{ fontSize: '32px', color: '#D0CCC8' }}>📦</div>}
                      </div>
                      <div style={{ padding: '14px 16px' }}>
                        <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '14px', fontWeight: 600, color: NAVY, marginBottom: '8px', lineHeight: '1.4' }}>{p.name}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          {price > 0 && (
                            <div>
                              <div style={{ fontSize: '11px', color: '#7A7570' }}>As low as</div>
                              <div style={{ fontSize: '16px', fontWeight: 400, color: GOLD }}>${price.toFixed(2)}</div>
                            </div>
                          )}
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '11px', color: '#7A7570' }}>Min Qty</div>
                            <div style={{ fontSize: '16px', fontWeight: 400, color: NAVY }}>{p.min_qty}</div>
                          </div>
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
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: bold ? '14px' : '13px', fontWeight: bold ? 700 : 400, marginBottom: '8px', fontFamily: '"DM Sans", sans-serif' }}>
      <span style={{ color: bold ? 'rgba(255,255,255,.9)' : 'rgba(255,255,255,.5)' }}>{label}</span>
      <span style={{ color: bold ? GOLD : '#fff' }}>{value}</span>
    </div>
  );
}

function SpecRow({ label, value }) {
  return (
    <div style={{ display: 'flex', padding: '8px 0', borderBottom: '1px solid #F0EEED', fontFamily: '"DM Sans", sans-serif' }}>
      <div style={{ width: '160px', flexShrink: 0, color: '#7A7570', fontSize: '13px' }}>{label}</div>
      <div style={{ fontWeight: 500, color: NAVY }}>{value}</div>
    </div>
  );
}

const qtyBtnStyle = { width: '38px', height: '42px', background: '#F8F7F4', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#3D3A36', fontFamily: '"DM Sans", sans-serif' };
const thStyle = { fontSize: '11px', fontWeight: 600, padding: '8px 10px', textAlign: 'center', color: '#7A7570', borderBottom: '1px solid #E0DDD7', fontFamily: '"DM Sans", sans-serif' };
const tdStyle = { padding: '8px 10px', fontSize: '13px', textAlign: 'center', fontFamily: '"DM Sans", sans-serif' };
const tdLabelStyle = { padding: '8px 12px', fontSize: '12px', color: '#7A7570', fontWeight: 500, background: '#FAFAF8', fontFamily: '"DM Sans", sans-serif' };

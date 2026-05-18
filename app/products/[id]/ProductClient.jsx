'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';

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
  const [addonState, setAddonState] = useState(() => {
    const s = {};
    decorations.forEach(d => {
      s[d.id] = { on: false, setupQty: d.default_setup_qty || 1 };
    });
    return s;
  });

  // Bottom thumbnails: main image + extra images
  const bottomImages = [mainImage, ...(extraImages || [])].filter(Boolean);

  // Big image: colour selected → show colour image, else show bottom panel selection
  const bigImage = selectedColour !== null
    ? (colours[selectedColour]?.image || mainImage)
    : (bottomImages[leftIdx] || mainImage);

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

  return (
    <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", minHeight: '100vh', background: '#F4F2EE', color: '#1A1714' }}>

      {/* NAV */}
      <nav style={{ background: '#1A1714', height: '54px', display: 'flex', alignItems: 'center', padding: '0 32px' }}>
        <Link href="/" style={{ fontFamily: 'serif', fontSize: '19px', color: '#fff', textDecoration: 'none', letterSpacing: '1px' }}>
          PROMO<span style={{ color: '#E07050' }}>HUB</span>
        </Link>
      </nav>

      {/* BREADCRUMB */}
      <div style={{ padding: '10px 32px', fontSize: '12px', color: '#7A7570', background: '#fff', borderBottom: '1px solid #E0DDD7' }}>
        <Link href="/" style={{ color: '#7A7570', textDecoration: 'none' }}>Home</Link>
        <span style={{ margin: '0 6px' }}>›</span>
        <Link href={`/category/${encodeURIComponent(product.category)}`} style={{ color: '#7A7570', textDecoration: 'none' }}>{product.category}</Link>
        <span style={{ margin: '0 6px' }}>›</span>
        <span>{product.name}</span>
      </div>

      {/* MAIN LAYOUT */}
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '28px 32px 80px', display: 'grid', gridTemplateColumns: '480px 1fr', gap: '48px', alignItems: 'start' }}>

        {/* LEFT: BIG IMAGE + HORIZONTAL THUMBNAILS BELOW */}
        <div style={{ position: 'sticky', top: '20px' }}>

          {/* Big image */}
          <div style={{ background: '#fff', border: '1px solid #E0DDD7', borderRadius: '16px', width: '100%', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: '12px' }}>
            {bigImage
              ? <img src={bigImage} alt={product.name} style={{ width: '85%', height: '85%', objectFit: 'contain' }} />
              : <div style={{ color: '#B0AAA3', fontSize: '14px' }}>No image</div>
            }
          </div>

          {/* Horizontal thumbnails below: main + extra images */}
          {bottomImages.length > 1 && (
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
              {bottomImages.map((src, i) => (
                <div key={i} onClick={() => handleBottomThumb(i)} style={{ cursor: 'pointer', flexShrink: 0 }}>
                  <div style={{
                    width: '80px', height: '80px', borderRadius: '10px',
                    border: leftIdx === i && selectedColour === null ? '2.5px solid #0C7A6B' : '1.5px solid #E0DDD7',
                    background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    overflow: 'hidden',
                    boxShadow: leftIdx === i && selectedColour === null ? '0 2px 8px rgba(12,122,107,.2)' : 'none',
                  }}>
                    <img src={src} alt="" style={{ width: '90%', height: '90%', objectFit: 'contain' }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: DETAILS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Title */}
          <div>
            <div style={{ fontSize: '12px', color: '#B0AAA3', marginBottom: '4px' }}>{product.supplier_sku}</div>
            <h1 style={{ fontFamily: 'serif', fontSize: '28px', fontWeight: 500, margin: '0 0 6px' }}>{product.name}</h1>
            <div style={{ fontSize: '13px', color: '#0C7A6B', fontWeight: 500, minHeight: '20px' }}>
              {selectedColour !== null ? `Colour: ${colours[selectedColour]?.name}` : ''}
            </div>
          </div>

          {/* STEP 1: COLOUR */}
          {colours.length > 0 && (
            <div>
              <StepLabel num={1} text="Choose Product Colour" />
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
                {colours.map((c, i) => (
                  <div key={i} onClick={() => handleSelectColour(i)} style={{ cursor: 'pointer', textAlign: 'center' }}>
                    <div style={{
                      width: '60px', height: '60px', borderRadius: '10px',
                      border: selectedColour === i ? '2.5px solid #0C7A6B' : '1.5px solid #E0DDD7',
                      background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      overflow: 'hidden', marginBottom: '4px',
                      boxShadow: selectedColour === i ? '0 2px 10px rgba(12,122,107,.2)' : '0 1px 3px rgba(0,0,0,.06)',
                    }}>
                      {c.image
                        ? <img src={c.image} alt={c.name} style={{ width: '90%', height: '90%', objectFit: 'contain' }} />
                        : <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: c.hex || '#C8C4BC' }} />
                      }
                    </div>
                    <div style={{ fontSize: '10px', color: selectedColour === i ? '#0C7A6B' : '#7A7570', fontWeight: selectedColour === i ? 600 : 400, maxWidth: '60px', lineHeight: '1.2' }}>
                      {c.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: QUANTITY */}
          <div>
            <StepLabel num={2} text="Enter Quantity" />
            <div style={{ fontSize: '12px', color: '#7A7570', margin: '4px 0 10px' }}>
              Minimum order: <strong>{product.min_qty} units</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #C8C4BC', borderRadius: '8px', overflow: 'hidden', width: 'fit-content' }}>
              <button onClick={() => handleQtyChange(String(Math.max(product.min_qty, qty - 1)))} style={qtyBtnStyle}>−</button>
              <input type="number" value={qtyInput} onChange={e => handleQtyChange(e.target.value)}
                style={{ width: '80px', textAlign: 'center', border: 'none', padding: '10px', fontSize: '16px', fontWeight: 600, outline: 'none', fontFamily: 'inherit' }} />
              <button onClick={() => handleQtyChange(String(qty + 1))} style={qtyBtnStyle}>+</button>
            </div>
            {!isValidQty && <div style={{ fontSize: '12px', color: '#C0392B', marginTop: '6px' }}>Minimum order quantity is {product.min_qty} units.</div>}
          </div>

          {/* UNBRANDED PRICING TABLE */}
          {pricingTiers.length > 0 && (
            <div style={{ border: '1px solid #E0DDD7', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ background: '#F0EEED', padding: '8px 14px', fontSize: '13px', fontWeight: 600, borderBottom: '1px solid #E0DDD7', textAlign: 'center' }}>Unbranded Pricing</div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#F8F7F5' }}>
                    <th style={thStyle}>Qty</th>
                    {pricingTiers.map(t => {
                      const isActive = activeTier?.id === t.id;
                      return <th key={t.id} style={{ ...thStyle, background: isActive ? '#E6F5F2' : undefined, color: isActive ? '#0C7A6B' : undefined }}>{t.min_qty}</th>;
                    })}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={tdLabelStyle}>Price</td>
                    {pricingTiers.map(t => {
                      const isActive = activeTier?.id === t.id;
                      return <td key={t.id} style={{ ...tdStyle, fontWeight: 600, color: isActive ? '#0C7A6B' : undefined, background: isActive ? '#E6F5F2' : undefined, fontSize: isActive ? '15px' : undefined }}>
                        ${(t.base_price * MARGIN).toFixed(2)}
                      </td>;
                    })}
                  </tr>
                  <tr>
                    <td style={tdLabelStyle}>Save</td>
                    {pricingTiers.map((t, i) => {
                      const save = i === 0 ? '' : Math.round((1 - (t.base_price * MARGIN) / firstRetailPrice) * 100) + '%';
                      const isActive = activeTier?.id === t.id;
                      return <td key={t.id} style={{ ...tdStyle, color: '#C0392B', fontSize: '11px', background: isActive ? '#E6F5F2' : undefined }}>{save}</td>;
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* STEP 3: BRANDING OPTIONS */}
          {decorations.length > 0 && (
            <div>
              <StepLabel num={3} text="Add Branding Options" />
              <div style={{ border: '1px solid #E0DDD7', borderRadius: '10px', overflow: 'hidden', marginTop: '8px' }}>
                <div style={{ background: '#F0EEED', padding: '8px 14px', fontSize: '13px', fontWeight: 600, borderBottom: '1px solid #E0DDD7', textAlign: 'center' }}>Additional Costs</div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#F8F7F5' }}>
                      <th style={{ ...thStyle, textAlign: 'left' }}>Item</th>
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
                          <td style={{ padding: '10px 12px' }}>
                            <div style={{ fontSize: '13px', fontWeight: 500 }}>{d.name}</div>
                            {d.detail && d.detail !== 'EMPTY' && <div style={{ fontSize: '11px', color: '#7A7570', marginTop: '2px' }}>{d.detail}</div>}
                          </td>
                          <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                            <label style={{ position: 'relative', width: '44px', height: '24px', cursor: 'pointer', display: 'inline-block' }}>
                              <input type="checkbox" checked={st.on} onChange={e => toggleAddon(d.id, e.target.checked)} style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }} />
                              <span style={{ position: 'absolute', inset: 0, background: st.on ? '#0C7A6B' : '#C8C4BC', borderRadius: '12px', transition: 'background .2s' }} />
                              <span style={{ position: 'absolute', top: '3px', left: st.on ? '23px' : '3px', width: '18px', height: '18px', background: '#fff', borderRadius: '50%', transition: 'left .2s', boxShadow: '0 1px 3px rgba(0,0,0,.2)' }} />
                            </label>
                          </td>
                          <td style={{ ...tdStyle, fontWeight: 500 }}>${(d.per_unit * MARGIN).toFixed(2)}</td>
                          <td style={{ ...tdStyle, color: '#7A7570' }}>{qty}</td>
                          <td style={tdStyle}>{d.has_setup ? `$${(SETUP_FEE * MARGIN).toFixed(2)}` : '—'}</td>
                          <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                            {d.has_setup ? (
                              <input type="number" value={st.setupQty} min="1"
                                disabled={!st.on || !d.setup_qty_editable}
                                onChange={e => setSetupQty(d.id, e.target.value)}
                                style={{ width: '54px', border: '1.5px solid #C8C4BC', borderRadius: '6px', padding: '5px 6px', fontSize: '13px', fontWeight: 600, textAlign: 'center', fontFamily: 'inherit', background: (!st.on || !d.setup_qty_editable) ? '#F4F2EE' : '#fff', color: (!st.on || !d.setup_qty_editable) ? '#B0AAA3' : '#1A1714', outline: 'none' }} />
                            ) : <span style={{ color: '#B0AAA3' }}>—</span>}
                          </td>
                        </tr>
                      );
                    })}
                    <tr>
                      <td style={{ padding: '10px 12px' }}>
                        <div style={{ fontSize: '13px', fontWeight: 500 }}>Shipping & Handling</div>
                        <div style={{ fontSize: '11px', color: '#7A7570' }}>Flat rate per order</div>
                      </td>
                      <td /><td /><td />
                      <td style={{ ...tdStyle, fontWeight: 500 }}>${SHIPPING.toFixed(2)}</td>
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
              <div style={{ background: '#F0EEED', padding: '8px 14px', fontSize: '13px', fontWeight: 600, borderBottom: '1px solid #E0DDD7', textAlign: 'center' }}>Price Summary</div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#F8F7F5' }}>
                    <th style={{ ...thStyle, textAlign: 'left' }}>Quantity</th>
                    {pricingTiers.map(t => {
                      const isActive = activeTier?.id === t.id;
                      return <th key={t.id} style={{ ...thStyle, color: isActive ? '#0C7A6B' : undefined, background: isActive ? '#E6F5F2' : undefined }}>{t.min_qty}</th>;
                    })}
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #F0EEED' }}>
                    <td style={tdLabelStyle}>Buy (unit)</td>
                    {pricingTiers.map(t => {
                      const u = calcUnit(t.base_price, t.min_qty);
                      const isActive = activeTier?.id === t.id;
                      return <td key={t.id} style={{ ...tdStyle, fontWeight: 600, color: isActive ? '#0C7A6B' : undefined, background: isActive ? '#E6F5F2' : undefined }}>${u.toFixed(2)}</td>;
                    })}
                  </tr>
                  <tr>
                    <td style={tdLabelStyle}>Buy (subtotal)</td>
                    {pricingTiers.map(t => {
                      const u = calcUnit(t.base_price, t.min_qty);
                      const isActive = activeTier?.id === t.id;
                      return <td key={t.id} style={{ ...tdStyle, fontWeight: 600, color: isActive ? '#0C7A6B' : undefined, background: isActive ? '#E6F5F2' : undefined }}>${(u * t.min_qty).toFixed(2)}</td>;
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* DARK PRICE SUMMARY */}
          {isValidQty && unitPrice > 0 && (
            <div style={{ background: '#1A1714', borderRadius: '16px', padding: '20px', color: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '14px' }}>
                <div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,.4)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '3px' }}>Unit price (excl. GST)</div>
                  <div style={{ fontFamily: 'serif', fontSize: '28px' }}>${unitPrice.toFixed(2)}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,.4)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '3px' }}>Subtotal (excl. GST)</div>
                  <div style={{ fontFamily: 'serif', fontSize: '22px' }}>${subtotal.toFixed(2)}</div>
                </div>
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,.12)', margin: '0 0 12px' }} />
              <PriceRow label="Subtotal (excl. GST)" value={`$${subtotal.toFixed(2)}`} />
              <PriceRow label="Shipping & Handling" value={`$${SHIPPING.toFixed(2)}`} />
              <PriceRow label="GST (10%)" value={`$${gstAmt.toFixed(2)}`} />
              <PriceRow label="Total (incl. GST)" value={`$${grand.toFixed(2)}`} bold />
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,.25)', marginTop: '8px' }}>All prices in AUD. GST invoice provided with order.</div>
            </div>
          )}

          {/* ADD TO CART */}
          <button disabled={!isValidQty} style={{ width: '100%', background: isValidQty ? '#0C7A6B' : '#C8C4BC', color: '#fff', border: 'none', borderRadius: '10px', padding: '15px', fontSize: '15px', fontWeight: 600, cursor: isValidQty ? 'pointer' : 'not-allowed', fontFamily: 'inherit' }}>
            {isValidQty ? `Add to Cart  —  $${grand.toFixed(2)} incl. GST` : 'Enter quantity to see pricing'}
          </button>

          {/* GET A QUOTE */}
          <button style={{ width: '100%', background: '#fff', color: '#1A1714', border: '1.5px solid #C8C4BC', borderRadius: '10px', padding: '14px', fontSize: '14px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <span>💬</span> Get a Quote / Ask a Question
          </button>

          {/* TRUST BADGES */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            {[
              { icon: '🎨', text: 'Free digital proof' },
              { icon: '🚚', text: '$30 flat shipping' },
              { icon: '✅', text: 'Quality guarantee' },
            ].map(b => (
              <div key={b.text} style={{ background: '#fff', border: '1px solid #E0DDD7', borderRadius: '10px', padding: '14px 10px', textAlign: 'center' }}>
                <div style={{ fontSize: '22px', marginBottom: '6px' }}>{b.icon}</div>
                <div style={{ fontSize: '12px', color: '#3D3A36', fontWeight: 500 }}>{b.text}</div>
              </div>
            ))}
          </div>

          {/* TABS */}
          <div style={{ border: '1px solid #E0DDD7', borderRadius: '10px', overflow: 'hidden', background: '#fff' }}>
            <div style={{ display: 'flex', overflowX: 'auto', borderBottom: '1px solid #E0DDD7' }}>
              {TABS.map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} style={{ flexShrink: 0, padding: '12px 16px', fontSize: '13px', fontWeight: activeTab === tab ? 600 : 400, color: activeTab === tab ? '#0C7A6B' : '#7A7570', background: 'none', border: 'none', borderBottom: activeTab === tab ? '2px solid #0C7A6B' : '2px solid transparent', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                  {tab}
                </button>
              ))}
            </div>
            <div style={{ padding: '20px', fontSize: '14px', lineHeight: '1.8', color: '#3D3A36' }}>
              {activeTab === 'Description' && (
                <>
                  {product.description
                    ? <p style={{ margin: '0 0 12px' }}>{product.description}</p>
                    : <p style={{ margin: 0, color: '#B0AAA3' }}>No description available.</p>}
                  {product.short_desc && <p style={{ margin: 0, color: '#7A7570' }}>{product.short_desc}</p>}
                </>
              )}
              {activeTab === 'Specifications' && (
                <>
                  {product.material && <SpecRow label="Material" value={product.material} />}
                  {product.dimensions && <SpecRow label="Dimensions" value={product.dimensions} />}
                  {product.weight && <SpecRow label="Weight" value={product.weight} />}
                  <SpecRow label="Min. Order Qty" value={`${product.min_qty} units`} />
                  <SpecRow label="SKU" value={product.supplier_sku} />
                  {!product.material && !product.dimensions && !product.weight && (
                    <p style={{ margin: '8px 0 0', color: '#B0AAA3' }}>No additional specifications available.</p>
                  )}
                </>
              )}
              {activeTab === 'Decoration' && (
                <>
                  {decorations.length > 0 ? decorations.map(d => (
                    <div key={d.id} style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #F0EEED' }}>
                      <div style={{ fontWeight: 600, marginBottom: '2px' }}>{d.name}</div>
                      {d.detail && d.detail !== 'EMPTY' && <div style={{ color: '#7A7570', fontSize: '13px' }}>{d.detail}</div>}
                    </div>
                  )) : <p style={{ margin: 0, color: '#B0AAA3' }}>No decoration options available.</p>}
                </>
              )}
              {activeTab === 'Packaging' && (
                <p style={{ margin: 0 }}>{product.packing || 'Packaging information not available.'}</p>
              )}
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
                <>
                  <p style={{ margin: '0 0 10px' }}>We stand behind every order. If there's a quality issue, we'll make it right.</p>
                  <p style={{ margin: 0, color: '#7A7570' }}>Custom branded products cannot be returned unless there is a manufacturing defect. Contact us within 14 days of receiving your order.</p>
                </>
              )}
              {activeTab === 'Shipping' && (
                <>
                  <p style={{ margin: '0 0 10px' }}><strong>$30 flat rate</strong> shipping on all orders Australia-wide.</p>
                  <p style={{ margin: '0 0 10px' }}>Standard production time is 7–10 business days after proof approval.</p>
                  <p style={{ margin: 0, color: '#7A7570' }}>Delivery typically takes 2–5 business days after dispatch.</p>
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function StepLabel({ num, text }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#0C7A6B', color: '#fff', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{num}</div>
      <div style={{ fontFamily: 'serif', fontSize: '18px', fontWeight: 500 }}>{text}</div>
    </div>
  );
}

function PriceRow({ label, value, bold }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: bold ? '13px' : '12px', fontWeight: bold ? 700 : 400, marginBottom: '7px' }}>
      <span style={{ color: bold ? 'rgba(255,255,255,.8)' : 'rgba(255,255,255,.5)' }}>{label}</span>
      <span style={{ color: '#fff' }}>{value}</span>
    </div>
  );
}

function SpecRow({ label, value }) {
  return (
    <div style={{ display: 'flex', padding: '8px 0', borderBottom: '1px solid #F0EEED' }}>
      <div style={{ width: '160px', flexShrink: 0, color: '#7A7570', fontSize: '13px' }}>{label}</div>
      <div style={{ fontWeight: 500 }}>{value}</div>
    </div>
  );
}

const qtyBtnStyle = {
  width: '38px', height: '42px', background: '#F4F2EE', border: 'none',
  fontSize: '20px', cursor: 'pointer', color: '#3D3A36', fontFamily: 'inherit',
};
const thStyle = {
  fontSize: '11px', fontWeight: 600, padding: '8px 10px',
  textAlign: 'center', color: '#7A7570', borderBottom: '1px solid #E0DDD7',
};
const tdStyle = { padding: '8px 10px', fontSize: '13px', textAlign: 'center' };
const tdLabelStyle = { padding: '8px 10px', fontSize: '11px', color: '#7A7570', fontWeight: 500, background: '#FAFAF8' };
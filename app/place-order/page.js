'use client';

import { useState, useEffect } from 'react';
import { cld } from '@/lib/cloudinary';
import { uploadImage } from '@/lib/imageHost';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getCart, clearCart, removeFromCart } from '@/lib/cart';
import { gaEvent } from '@/lib/gtag';
import { supabase } from '@/lib/supabase';
import { SHIPPING, GST } from '@/lib/pricing';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';
const STRIPE_SURCHARGE = 0.02;
const STATES = ['ACT','NSW','NT','QLD','SA','TAS','VIC','WA'];

// Stripe payment form component
function StripePaymentForm({ orderData, onSuccess, onError }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  async function handleStripeSubmit(e) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (error) {
      onError(error.message);
      setProcessing(false);
    } else if (paymentIntent.status === 'succeeded') {
      // Payment successful, now save order
      try {
        const { data: { session: _os } } = await supabase.auth.getSession();
        const res = await fetch('/api/order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...(_os ? { Authorization: `Bearer ${_os.access_token}` } : {}) },
          body: JSON.stringify({ ...orderData, paymentMethod: 'stripe', stripePaymentId: paymentIntent.id }),
        });
        if (res.ok) {
          const data = await res.json();
          onSuccess(data.orderNumber);
        } else {
          onError('Order could not be saved. Please contact us.');
        }
      } catch {
        onError('Something went wrong. Please contact us.');
      }
      setProcessing(false);
    }
  }

  return (
    <form onSubmit={handleStripeSubmit}>
      <PaymentElement options={{ layout: 'tabs' }} />
      <button
        type="submit"
        disabled={!stripe || processing}
        style={{
          width: '100%', marginTop: '20px',
          background: processing ? NAVY : GOLD,
          color: '#fff', border: 'none', borderRadius: '10px', padding: '16px',
          fontSize: '16px', fontWeight: 700,
          cursor: processing ? 'not-allowed' : 'pointer',
          fontFamily: '"DM Sans", sans-serif',
          transition: 'background .2s',
        }}
      >
        {processing ? '⏳ Processing payment...' : `Pay Now & Place Order`}
      </button>
    </form>
  );
}

export default function PlaceOrderPage() {
  const [cart, setCart] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('eft');
  const [payMode, setPayMode] = useState(null);
  const [agreeTerms, setAgreeTerms] = useState(false);
  useEffect(() => { const p = new URLSearchParams(window.location.search).get('pay'); if (p) setPayMode(p); if (p === 'now') setPaymentMethod('stripe'); }, []);
  const [submitting, setSubmitting] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [logoUrl, setLogoUrl] = useState('');
  const [logoPngUrl, setLogoPngUrl] = useState('');
  const [logoUploading, setLogoUploading] = useState(false);
  const [error, setError] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [showStripeForm, setShowStripeForm] = useState(false);
  const [form, setForm] = useState({
    name: '', company: '', email: '', phone: '',
    street: '', street2: '', suburb: '', state: '', postcode: '',
    requiredDate: '', purpose: '', comments: '',
  });
  const [purposeOther, setPurposeOther] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const c = getCart();
    setCart(c);
    setLoaded(true);
    if (c.length === 0) router.push('/promotional-products');
  }, []);

  const totalSubtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const orderShipping = SHIPPING;
  const orderGst = Math.round((totalSubtotal + orderShipping) * GST * 100) / 100;
  const orderTotal = totalSubtotal + orderShipping + orderGst;
  const stripeSurcharge = Math.round(orderTotal * STRIPE_SURCHARGE * 100) / 100;
  const orderTotalWithSurcharge = orderTotal + stripeSurcharge;

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const canSubmit = form.name && form.email && form.street && form.suburb && form.state && form.postcode && agreeTerms;

  const orderData = {
    customer: form,
    items: cart,
    subtotal: totalSubtotal,
    shipping: orderShipping,
    gst: orderGst,
    total: orderTotalWithSurcharge,
    surcharge: stripeSurcharge,
  };

  // EFT submit
  // Upload logo via our own converter (lib/imageHost) — handles vector files
  // (AI/EPS/PDF/SVG), stores the original + a PNG preview on R2. Same path as the
  // /upload customer link. Returns { logo_url, logo_png_url } or null.
  async function uploadLogo(file) {
    if (!file) return null;
    setLogoUploading(true);
    try {
      const up = await uploadImage(file, null, 'logo');
      if (!up || !up.logo_url) return null;
      return up; // { logo_url, logo_png_url }
    } finally {
      setLogoUploading(false);
    }
  }

  // Trigger artwork mockup after order placed
  async function triggerArtwork({ orderNumber, customerName, customerEmail, paymentMethod, uploadedLogoUrl, uploadedLogoPngUrl, savedCartItems }) {
    const cartItems = savedCartItems || getCart();
    const firstItem = cartItems[0];
    if (!firstItem) {
      return;
    }

    const logoToUse = uploadedLogoUrl || logoUrl;
    const logoPngToUse = uploadedLogoPngUrl || logoPngUrl;

    if (logoToUse) {
      // Logo available - generate mockup automatically
      await fetch('/api/artwork/upload', {
        method: 'POST',
        keepalive: true,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber,
          customerName,
          customerEmail,
          productName: firstItem.productName,
          productImageUrl: firstItem.image || '',
          logoUrl: logoToUse,
          logoPngUrl: logoPngToUse,
          paymentMethod,
          colour: firstItem.colour || '',
          qty: firstItem.qty,
        }),
      });
    } else {
      // No logo - send "please upload logo" email
      await fetch('/api/artwork/request-logo', {
        method: 'POST',
        keepalive: true,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber,
          customerName,
          customerEmail,
          productName: firstItem.productName,
          paymentMethod,
        }),
      });
    }
  }

  async function handleEFTSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);
    setError('');
    try {
      // Create the order FIRST — it doesn't need the logo, so don't make the
      // customer wait on the (slow) logo upload + rasterization.
      const { data: { session: _os2 } } = await supabase.auth.getSession();
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(_os2 ? { Authorization: `Bearer ${_os2.access_token}` } : {}) },
        body: JSON.stringify({ ...orderData, total: orderTotal, paymentMethod: 'eft', surcharge: 0 }),
      });
      if (res.ok) {
        const data = await res.json();
        // Save cart items before clearing
        const savedItems = getCart();
        clearCart();
        gaEvent('purchase', {
          transaction_id: data.orderNumber,
          currency: 'AUD',
          value: orderTotal,
          items: (savedItems || []).map(it => ({ item_id: it.sku || it.productSlug, slug: it.productSlug, item_name: it.productName, price: it.unitPrice, quantity: it.qty })),
        });
        // Upload the logo (if any) + fire the artwork/proof workflow in the BACKGROUND.
        // Soft client navigation keeps this JS runtime alive, so the slow logo
        // rasterization no longer blocks the customer's Order Placed screen.
        (async () => {
          try {
            let uLogoUrl = logoUrl, uLogoPngUrl = logoPngUrl;
            if (logoFile && !logoUrl) {
              const up = await uploadLogo(logoFile);
              if (up) { uLogoUrl = up.logo_url; uLogoPngUrl = up.logo_png_url || ''; }
            }
            triggerArtwork({
              orderNumber: data.orderNumber,
              customerName: form.name,
              customerEmail: form.email,
              paymentMethod: 'eft',
              uploadedLogoUrl: uLogoUrl,
              uploadedLogoPngUrl: uLogoPngUrl,
              savedCartItems: savedItems,
            });
          } catch (bgErr) {
            console.error('[place-order] background logo/artwork failed', bgErr);
          }
        })();
        router.push(`/order-confirmation?order=${data.orderNumber}&method=eft`);
      } else {
        setError('Something went wrong. Please try again or call us on 02 9477 4748.');
      }
    } catch {
      setError('Something went wrong. Please try again or call us on 02 9477 4748.');
    } finally {
      setSubmitting(false);
    }
  }

  // Stripe: create payment intent first
  async function handleStripeInit() {
    if (!canSubmit) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: orderTotalWithSurcharge, orderData }),
      });
      if (res.ok) {
        const data = await res.json();
        setClientSecret(data.clientSecret);
        setShowStripeForm(true);
      } else {
        setError('Could not initialise payment. Please try again.');
      }
    } catch {
      setError('Could not initialise payment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleStripeSuccess(orderNumber) {
    const savedItems = getCart();
    clearCart();
    gaEvent('purchase', {
      transaction_id: orderNumber,
      currency: 'AUD',
      value: orderTotalWithSurcharge,
      items: (savedItems || []).map(it => ({ item_id: it.sku || it.productSlug, slug: it.productSlug, item_name: it.productName, price: it.unitPrice, quantity: it.qty })),
    });
    // Payment already succeeded + order saved — run artwork/proof workflow in the
    // background (keepalive) so the customer lands on Order Placed immediately.
    triggerArtwork({
      orderNumber,
      customerName: form.name,
      customerEmail: form.email,
      paymentMethod: 'stripe',
      uploadedLogoUrl: logoUrl,
      uploadedLogoPngUrl: logoPngUrl,
      savedCartItems: savedItems,
    });
    router.push(`/order-confirmation?order=${orderNumber}&method=stripe`);
  }

  function handleStripeError(msg) {
    setError(msg);
    setShowStripeForm(false);
    setClientSecret('');
  }

  const inputStyle = {
    width: '100%', padding: '11px 14px', border: '1.5px solid #E0DDD7', borderRadius: '8px',
    fontSize: '14px', fontFamily: '"DM Sans", sans-serif', color: '#000',
    outline: 'none', boxSizing: 'border-box', background: '#fff',
  };
  const selectStyle = {
    ...inputStyle, cursor: 'pointer', appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%231B2A4A' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center', paddingRight: '36px',
  };
  const labelStyle = {
    fontSize: '11px', fontWeight: 700, color: NAVY, marginBottom: '6px',
    display: 'block', textTransform: 'uppercase', letterSpacing: '0.08em',
    fontFamily: '"DM Sans", sans-serif',
  };

  if (!loaded) return null;

  return (
    <div style={{ background: '#fff', minHeight: '100vh', fontFamily: '"DM Sans", sans-serif' }}>

      {/* Breadcrumb */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E0DDD7', padding: '12px 40px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', fontSize: '13px', color: '#000' }}>
          <Link href="/" style={{ color: '#000', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 8px' }}>›</span>
          <Link href="/place-order" style={{ color: '#000', textDecoration: 'none' }}>Place Order</Link>
          <span style={{ margin: '0 8px' }}>›</span>
          <span style={{ color: NAVY, fontWeight: 600 }}>Place Order</span>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 40px 80px' }}>
        <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '36px', fontWeight: 600, color: NAVY, margin: '0 0 32px' }}>Place Order</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '40px', alignItems: 'start' }}>

          {/* LEFT */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

            {/* Two column info blocks */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #E0DDD7' }}>
                <div style={{ background: GOLD, padding: '14px 20px' }}>
                  <div style={{ fontWeight: 700, color: NAVY, fontSize: '15px', fontFamily: '"DM Sans", sans-serif' }}>📋 What happens next?</div>
                </div>
                <div style={{ background: '#fff', padding: '16px 20px' }}>
                  <div style={{ fontSize: '13px', color: '#000', fontFamily: '"DM Sans", sans-serif', lineHeight: 1.7 }}>
                    After placing your order, we'll send you a <strong>free digital proof</strong> as soon as we can. Production only begins after you approve the artwork.
                  </div>
                </div>
              </div>
              <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #E0DDD7' }}>
                <div style={{ background: GOLD, padding: '14px 20px' }}>
                  <div style={{ fontWeight: 700, color: NAVY, fontSize: '15px', fontFamily: '"DM Sans", sans-serif' }}>✅ Order With Confidence</div>
                </div>
                <div style={{ background: '#fff', padding: '16px 20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: '#000', fontFamily: '"DM Sans", sans-serif' }}>
                    <div>✓ Free proof before anything is printed</div>
                    <div>✓ No production until artwork approved</div>
                    <div>✓ No risk or penalty for cancelling</div>
                    <div>✓ Unlimited changes to your proof</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E0DDD7', padding: '24px' }}>
              <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '22px', fontWeight: 600, color: NAVY, margin: '0 0 20px' }}>Contact Information</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={labelStyle}>Full Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} placeholder="Jane Smith" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Company</label>
                    <input name="company" value={form.company} onChange={handleChange} placeholder="Acme Corp" style={inputStyle} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
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

            {/* Delivery Address */}
            <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E0DDD7', padding: '24px' }}>
              <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '22px', fontWeight: 600, color: NAVY, margin: '0 0 20px' }}>Delivery Address</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Address Line 1 *</label>
                  <input name="street" value={form.street} onChange={handleChange} placeholder="e.g. 123 George Street" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Address Line 2 <span style={{ fontWeight: 400, textTransform: 'none' }}>(optional)</span></label>
                  <input name="street2" value={form.street2} onChange={handleChange} placeholder="Suite, Level, Unit" style={inputStyle} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={labelStyle}>Suburb *</label>
                    <input name="suburb" value={form.suburb} onChange={handleChange} placeholder="Suburb" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>State *</label>
                    <select name="state" value={form.state} onChange={handleChange} style={selectStyle}>
                      <option value="">Select State</option>
                      {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={labelStyle}>Postcode *</label>
                    <input name="postcode" value={form.postcode} onChange={handleChange} placeholder="2000" style={{ ...inputStyle, fontFamily: '"DM Mono", monospace' }} />
                  </div>
                  <div>
                    <label style={labelStyle}>Country</label>
                    <input value="Australia" readOnly style={{ ...inputStyle, background: '#ffffff', color: '#9CA3AF', cursor: 'not-allowed' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* MORE FROM YOU */}
            <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E0DDD7', padding: '24px' }}>
              <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '22px', fontWeight: 600, color: NAVY, margin: '0 0 18px' }}>More From You</h2>

              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Required Date <span style={{ color: '#000', fontWeight: 400 }}>(when do you need it by?)</span></label>
                <input type="date" name="requiredDate" value={form.requiredDate} onChange={handleChange} style={inputStyle} />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Occasion / Event <span style={{ color: '#000', fontWeight: 400 }}>(optional)</span></label>
                <select
                  value={purposeOther ? '__other__' : form.purpose}
                  onChange={e => {
                    const v = e.target.value;
                    if (v === '__other__') { setPurposeOther(true); setForm(f => ({ ...f, purpose: '' })); }
                    else { setPurposeOther(false); setForm(f => ({ ...f, purpose: v })); }
                  }}
                  style={inputStyle}
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

              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Upload Your Logo</label>
                <p style={{ fontSize: '13px', color: '#000', margin: '0 0 12px' }}>Optional — you can also email your logo to hello@quirkypromo.com.au after placing your order.</p>
              <div
                onClick={() => document.getElementById('logo-upload-input').click()}
                style={{
                  border: `2px dashed ${logoFile ? GOLD : '#C8C4BC'}`,
                  borderRadius: '10px',
                  padding: '32px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: logoFile ? '#FFFBF4' : '#ffffff',
                  transition: 'all .2s',
                }}>
                <input
                  id="logo-upload-input"
                  type="file"
                  accept=".ai,.pdf,.png,.jpg,.jpeg,.eps,.svg"
                  style={{ display: 'none' }}
                  onChange={e => {
                    const file = e.target.files[0];
                    if (file) setLogoFile(file);
                  }}
                />
                {logoFile ? (
                  <>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>✅</div>
                    <div style={{ fontWeight: 600, color: NAVY, fontSize: '15px' }}>{logoFile.name}</div>
                    <div style={{ fontSize: '12px', color: '#000', marginTop: '4px' }}>Click to change file</div>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎨</div>
                    <div style={{ fontWeight: 600, color: NAVY, fontSize: '15px', marginBottom: '4px' }}>Click to upload your logo / artwork</div>
                    <div style={{ fontSize: '12px', color: '#000' }}>AI, PDF, PNG, JPG, EPS, SVG accepted</div>
                  </>
                )}
              </div>
              {logoUploading && (
                <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '13px', color: '#000' }}>Uploading logo...</div>
              )}
              </div>

              <div>
                <label style={labelStyle}>Comments</label>
                <textarea name="comments" value={form.comments} onChange={handleChange} rows={3} placeholder="e.g. ship to multiple addresses, special requirements…" style={{ ...inputStyle, resize: 'vertical' }} />
              </div>

              <p style={{ fontSize: '12px', color: '#000', margin: '14px 0 0' }}>📦 Stock is confirmed before your order is processed.</p>
            </div>

            {/* Payment Method */}
            <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E0DDD7', padding: '24px' }}>
              <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '22px', fontWeight: 600, color: NAVY, margin: '0 0 20px' }}>Payment Method</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

                {/* EFT */}
                <label style={{ cursor: 'pointer', display: payMode !== 'now' ? 'block' : 'none' }} onClick={() => { setShowStripeForm(false); setClientSecret(''); }}>
                  <div style={{ border: `2px solid ${paymentMethod === 'eft' ? GOLD : '#E0DDD7'}`, borderRadius: '10px', padding: '16px 20px', background: paymentMethod === 'eft' ? '#FDF8F0' : '#fff', transition: 'all .15s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: paymentMethod === 'eft' ? '14px' : 0 }}>
                      <input type="radio" name="payment" value="eft" checked={paymentMethod === 'eft'} onChange={() => setPaymentMethod('eft')} style={{ accentColor: GOLD, width: '18px', height: '18px' }} />
                      <div>
                        <div style={{ fontWeight: 700, color: NAVY, fontSize: '15px', fontFamily: '"DM Sans", sans-serif' }}>🏦 Pay by EFT (Bank Transfer) (Bank Transfer)</div>
                        <div style={{ fontSize: '12px', color: '#000', fontFamily: '"DM Sans", sans-serif' }}>Order Confirmation + Invoice (Awaiting Payment) sent now — pay by EFT before production</div>
                      </div>
                    </div>
                    {paymentMethod === 'eft' && (
                      <div style={{ background: '#ffffff', borderRadius: '8px', padding: '14px 16px', fontSize: '13px', fontFamily: '"DM Sans", sans-serif' }}>
                        <div style={{ fontWeight: 700, color: NAVY, marginBottom: '10px' }}>Bank Transfer Details:</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', color: '#000' }}>
                          {[
                            ['Account Name', 'Grow Your Marketing', false],
                            ['Bank', 'ANZ', false],
                            ['BSB', '012-306', true],
                            ['Account Number', '192040129', true],
                            ['ABN', '95 656 714 270', true],
                          ].map(([label, value, mono]) => (
                            <div key={label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span style={{ color: '#000' }}>{label}</span>
                              <strong style={{ fontFamily: mono ? '"DM Mono", monospace' : 'inherit' }}>{value}</strong>
                            </div>
                          ))}
                        </div>
                        <div style={{ marginTop: '10px', fontSize: '12px', color: '#9CA3AF', borderTop: '1px solid #E0DDD7', paddingTop: '10px' }}>
                          Please use your Order Number as the payment reference.
                        </div>
                      </div>
                    )}
                  </div>
                </label>

                {/* Stripe */}
                <label style={{ cursor: 'pointer', display: payMode !== 'later' ? 'block' : 'none' }}>
                  <div style={{ border: `2px solid ${paymentMethod === 'stripe' ? GOLD : '#E0DDD7'}`, borderRadius: '10px', padding: '16px 20px', background: paymentMethod === 'stripe' ? '#FDF8F0' : '#fff', transition: 'all .15s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: paymentMethod === 'stripe' && showStripeForm ? '16px' : 0 }}>
                      <input type="radio" name="payment" value="stripe" checked={paymentMethod === 'stripe'} onChange={() => setPaymentMethod('stripe')} style={{ accentColor: GOLD, width: '18px', height: '18px' }} />
                      <div>
                        <div style={{ fontWeight: 700, color: NAVY, fontSize: '15px', fontFamily: '"DM Sans", sans-serif' }}>💳 Pay Now by Credit Card</div>
                        <div style={{ fontSize: '12px', color: '#000', fontFamily: '"DM Sans", sans-serif' }}>Visa, Mastercard, Amex · 2% surcharge applies</div>
                      </div>
                    </div>
                    {paymentMethod === 'stripe' && !showStripeForm && (
                      <div style={{ background: '#FEF9EC', border: '1px solid #F5E6B8', borderRadius: '8px', padding: '10px 14px', fontSize: '12px', color: '#92640A', fontFamily: '"DM Sans", sans-serif', marginTop: '10px' }}>
                        💳 A 2% credit card surcharge of <strong>${stripeSurcharge.toFixed(2)}</strong> will be added. Total: <strong>${orderTotalWithSurcharge.toFixed(2)}</strong>
                      </div>
                    )}
                    {/* Stripe Payment Form */}
                    {showStripeForm && clientSecret && (
                      <div style={{ marginTop: '16px' }}>
                        <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe', variables: { colorPrimary: GOLD } } }}>
                          <StripePaymentForm orderData={orderData} onSuccess={handleStripeSuccess} onError={handleStripeError} />
                        </Elements>
                      </div>
                    )}
                  </div>
                </label>
              </div>
            </div>

            {!canSubmit && (
              <div style={{ textAlign: 'center', fontSize: '12px', color: '#000', fontFamily: '"DM Sans", sans-serif' }}>
                Please fill in all required fields (*)
              </div>
            )}

            {error && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '12px 16px', fontSize: '13px', color: '#DC2626', fontFamily: '"DM Sans", sans-serif' }}>
                {error}
              </div>
            )}

            {/* Sales T&C */}
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: '#3D3A36', fontFamily: '"DM Sans", sans-serif', cursor: 'pointer' }}>
              <input type="checkbox" checked={agreeTerms} onChange={e => setAgreeTerms(e.target.checked)} style={{ accentColor: GOLD, width: '18px', height: '18px', marginTop: '1px', flexShrink: 0 }} />
              <span>I have read and agree to the <a href="https://www.quirkypromo.com.au/sales-terms" target="_blank" rel="noopener noreferrer" style={{ color: GOLD, fontWeight: 600 }}>Sales Terms &amp; Conditions</a>.</span>
            </label>

            {/* Submit buttons */}
            {!showStripeForm && (
              <button
                onClick={paymentMethod === 'eft' ? handleEFTSubmit : handleStripeInit}
                disabled={!canSubmit || submitting}
                style={{
                  width: '100%',
                  background: !canSubmit ? '#C8C4BC' : GOLD,
                  color: '#fff', border: 'none', borderRadius: '12px', padding: '20px',
                  fontSize: '18px', fontWeight: 700,
                  cursor: !canSubmit || submitting ? 'not-allowed' : 'pointer',
                  fontFamily: '"DM Sans", sans-serif',
                  boxShadow: canSubmit ? '0 4px 16px rgba(201,169,110,.4)' : 'none',
                  transition: 'background .2s',
                }}
              >
                {submitting ? '⏳ Processing...' : paymentMethod === 'stripe'
                  ? `Continue to Payment — $${orderTotalWithSurcharge.toFixed(2)}`
                  : `Place Order & Pay by EFT (Bank Transfer) — $${orderTotal.toFixed(2)}`}
              </button>
            )}

            <p style={{ textAlign: 'center', fontSize: '12px', color: '#000', fontFamily: '"DM Sans", sans-serif', margin: 0 }}>
              By placing your order you agree to our terms and conditions.
            </p>
          </div>

          {/* RIGHT: Order Summary */}
          <div style={{ position: 'sticky', top: '80px' }}>
            <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E0DDD7', padding: '24px' }}>
              <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '22px', fontWeight: 600, color: NAVY, margin: '0 0 20px' }}>Order Summary</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                {cart.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{ width: '52px', height: '52px', flexShrink: 0, borderRadius: '6px', border: '1px solid #E0DDD7', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      {item.image ? <img src={cld(item.image, 160)} alt={item.productName} style={{ width: '90%', height: '90%', objectFit: 'contain' }} /> : <span>📦</span>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: NAVY, fontFamily: '"DM Sans", sans-serif' }}>{item.productName}</div>
                      {item.colour && <div style={{ fontSize: '11px', color: '#000', fontFamily: '"DM Sans", sans-serif' }}>Colour: {item.colour}</div>}
                      {item.addons?.length > 0 && item.addons.map(a => (
                        <div key={a.id} style={{ fontSize: '11px', color: '#000', fontFamily: '"DM Sans", sans-serif' }}>+ {a.name}</div>
                      ))}
                      <div style={{ fontSize: '11px', color: '#000', fontFamily: '"DM Sans", sans-serif' }}>Qty: {item.qty}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: NAVY, fontFamily: '"DM Mono", monospace' }}>${item.subtotal.toFixed(2)}</div>
                      <button
                        onClick={() => { setCart(removeFromCart(item.id)); }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#000', fontSize: '11px', fontFamily: '"DM Sans", sans-serif', padding: 0, textDecoration: 'underline' }}
                      >Remove</button>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ height: '1px', background: '#E0DDD7', marginBottom: '16px' }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', fontFamily: '"DM Sans", sans-serif' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#000' }}>Subtotal (excl. GST)</span>
                  <span style={{ fontFamily: '"DM Mono", monospace' }}>${totalSubtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#000' }}>Shipping & Handling</span>
                  <span style={{ fontFamily: '"DM Mono", monospace' }}>${orderShipping.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#000' }}>GST (10%)</span>
                  <span style={{ fontFamily: '"DM Mono", monospace' }}>${orderGst.toFixed(2)}</span>
                </div>
                {paymentMethod === 'stripe' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#92640A' }}>
                    <span>Credit card surcharge (2%)</span>
                    <span style={{ fontFamily: '"DM Mono", monospace' }}>${stripeSurcharge.toFixed(2)}</span>
                  </div>
                )}
                <div style={{ height: '1px', background: '#E0DDD7' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '16px' }}>
                  <span style={{ color: NAVY }}>Total (incl. GST)</span>
                  <span style={{ fontFamily: '"DM Mono", monospace', color: GOLD }}>
                    ${paymentMethod === 'stripe' ? orderTotalWithSurcharge.toFixed(2) : orderTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <div style={{ marginTop: '16px', fontSize: '11px', color: '#9CA3AF', fontFamily: '"DM Sans", sans-serif' }}>
                ABN: 95 656 714 270 · All prices in AUD · $30 flat rate shipping
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
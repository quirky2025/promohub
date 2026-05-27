'use client';

import { useState } from 'react';
import Link from 'next/link';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';
const BG = '#F8F7F4';

const STEPS = ['Product Requirements', 'Branding & Compliance', 'Your Details'];

const inputStyle = {
  width: '100%', padding: '11px 14px', border: '1.5px solid #E0DDD7',
  borderRadius: '8px', fontSize: '14px', fontFamily: '"DM Sans", sans-serif',
  color: NAVY, outline: 'none', background: '#fff', boxSizing: 'border-box',
};

const labelStyle = {
  display: 'block', fontSize: '13px', fontWeight: 700, color: NAVY,
  marginBottom: '6px', fontFamily: '"DM Sans", sans-serif',
};

const selectStyle = {
  ...inputStyle, cursor: 'pointer', appearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%231B2A4A' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center',
};

export default function SupplyChainQuotePage() {
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState('idle');
  const [form, setForm] = useState({
    // Step 1
    productDescription: '',
    quantity: '',
    targetPrice: '',
    inHandsDate: '',
    freightPreference: '',
    // Step 2
    brandingRequirements: '',
    colourRequirements: '',
    decorationMethod: '',
    forChildren: '',
    deliveryState: '',
    complianceNotes: '',
    // Step 3
    companyName: '',
    name: '',
    email: '',
    phone: '',
    notes: '',
  });

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function canProceedStep0() {
    return form.productDescription.trim() && form.quantity.trim() && form.inHandsDate;
  }

  function canProceedStep1() {
    return form.brandingRequirements.trim() && form.forChildren && form.deliveryState.trim();
  }

  function canSubmit() {
    return form.companyName.trim() && form.name.trim() && form.email.trim();
  }

  async function handleSubmit() {
    if (!canSubmit()) return;
    setStatus('sending');
    try {
      const res = await fetch('/api/supply-chain-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div style={{ fontFamily: '"DM Sans", sans-serif', background: BG, minHeight: '100vh' }}>
        <div style={{ background: '#fff', borderBottom: '1px solid #E0DDD7', padding: '12px 40px' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', fontSize: '13px', color: '#7A7570' }}>
            <Link href="/" style={{ color: '#7A7570', textDecoration: 'none' }}>Home</Link>
            <span style={{ margin: '0 8px' }}>›</span>
            <Link href="/supply-chain" style={{ color: '#7A7570', textDecoration: 'none' }}>Supply Chain</Link>
            <span style={{ margin: '0 8px' }}>›</span>
            <span style={{ color: NAVY, fontWeight: 600 }}>Sourcing Quote</span>
          </div>
        </div>
        <div style={{ maxWidth: '600px', margin: '80px auto', padding: '0 40px', textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>✅</div>
          <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '36px', color: NAVY, margin: '0 0 16px' }}>
            Quote Request Received
          </h1>
          <p style={{ fontSize: '15px', color: '#5A5550', lineHeight: 1.8, margin: '0 0 32px' }}>
            Thank you for your enquiry. Our sourcing team will review your requirements and get back to you within <strong>24–48 business hours</strong> with a detailed quotation.
          </p>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid #E0DDD7', marginBottom: '32px', textAlign: 'left' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: NAVY, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>What happens next</div>
            {[
              'Our sourcing team reviews your requirements',
              'We identify the best factory and product match',
              'You receive a detailed quote with pricing and lead times',
              'We discuss any questions and refine the brief if needed',
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: GOLD, color: '#fff', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</div>
                <div style={{ fontSize: '13px', color: '#5A5550', lineHeight: 1.5 }}>{s}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Link href="/supply-chain" style={{ background: NAVY, color: '#fff', padding: '12px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
              Back to Supply Chain
            </Link>
            <Link href="/category/bags" style={{ background: '#fff', color: NAVY, padding: '12px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, textDecoration: 'none', border: `1.5px solid ${NAVY}` }}>
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: '"DM Sans", sans-serif', background: BG, minHeight: '100vh' }}>

      {/* BREADCRUMB */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E0DDD7', padding: '12px 40px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', fontSize: '13px', color: '#7A7570' }}>
          <Link href="/" style={{ color: '#7A7570', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 8px' }}>›</span>
          <Link href="/supply-chain" style={{ color: '#7A7570', textDecoration: 'none' }}>Supply Chain</Link>
          <span style={{ margin: '0 8px' }}>›</span>
          <span style={{ color: NAVY, fontWeight: 600 }}>Get a Sourcing Quote</span>
        </div>
      </div>

      {/* HEADER */}
      <div style={{ background: NAVY, padding: '48px 40px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '42px', fontWeight: 600, color: '#fff', margin: '0 0 12px' }}>
            Get a Sourcing Quote
          </h1>
          <p style={{ color: 'rgba(255,255,255,.65)', fontSize: '15px', margin: 0, lineHeight: 1.7 }}>
            Fill in your requirements below and our sourcing team will respond within 24–48 business hours with a detailed quotation.
          </p>
        </div>
      </div>

      {/* STEP INDICATOR */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E0DDD7', padding: '20px 40px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '0' }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: i <= step ? NAVY : '#E0DDD7', color: i <= step ? GOLD : '#B0AAA3', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"DM Mono", monospace' }}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span style={{ fontSize: '13px', fontWeight: i === step ? 700 : 400, color: i === step ? NAVY : '#B0AAA3', whiteSpace: 'nowrap' }}>{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ flex: 1, height: '1px', background: i < step ? GOLD : '#E0DDD7', margin: '0 12px' }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* FORM */}
      <div style={{ maxWidth: '700px', margin: '40px auto', padding: '0 40px 60px' }}>
        <div style={{ background: '#fff', borderRadius: '16px', padding: '40px', border: '1px solid #E0DDD7' }}>

          {/* STEP 0 — Product Requirements */}
          {step === 0 && (
            <div>
              <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '26px', color: NAVY, margin: '0 0 8px' }}>Product Requirements</h2>
              <p style={{ fontSize: '13px', color: '#7A7570', margin: '0 0 28px' }}>Tell us what you need — be as detailed as possible.</p>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Product Description <span style={{ color: '#C0392B' }}>*</span></label>
                <textarea name="productDescription" value={form.productDescription} onChange={handleChange}
                  placeholder="e.g. Custom branded tote bag, natural cotton, approx 40x35cm, with long handles. Logo on one side, full colour print."
                  rows={4} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={labelStyle}>Quantity Required <span style={{ color: '#C0392B' }}>*</span></label>
                  <input name="quantity" value={form.quantity} onChange={handleChange}
                    placeholder="e.g. 500, or 500 / 1000 / 2000" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Target Unit Price (AUD)</label>
                  <input name="targetPrice" value={form.targetPrice} onChange={handleChange}
                    placeholder="e.g. Under $5.00" style={inputStyle} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={labelStyle}>Required In-Hands Date <span style={{ color: '#C0392B' }}>*</span></label>
                  <input type="date" name="inHandsDate" value={form.inHandsDate} onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Preferred Freight Option</label>
                  <select name="freightPreference" value={form.freightPreference} onChange={handleChange} style={selectStyle}>
                    <option value="">Not sure yet</option>
                    <option value="express">Express (5–7 days)</option>
                    <option value="air">Air Freight (20 days)</option>
                    <option value="sea">Sea Freight (45 days)</option>
                    <option value="local">Local stock only</option>
                  </select>
                </div>
              </div>

              <button
                onClick={() => canProceedStep0() && setStep(1)}
                style={{ width: '100%', background: canProceedStep0() ? GOLD : '#C8C4BC', color: '#fff', border: 'none', borderRadius: '10px', padding: '16px', fontSize: '15px', fontWeight: 700, cursor: canProceedStep0() ? 'pointer' : 'not-allowed', fontFamily: '"DM Sans", sans-serif', marginTop: '8px' }}
              >
                Next: Branding & Compliance →
              </button>
              {!canProceedStep0() && (
                <p style={{ textAlign: 'center', fontSize: '12px', color: '#B0AAA3', margin: '8px 0 0' }}>Please fill in all required fields to continue</p>
              )}
            </div>
          )}

          {/* STEP 1 — Branding & Compliance */}
          {step === 1 && (
            <div>
              <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '26px', color: NAVY, margin: '0 0 8px' }}>Branding & Compliance</h2>
              <p style={{ fontSize: '13px', color: '#7A7570', margin: '0 0 28px' }}>Help us understand your branding requirements and any compliance needs.</p>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Logo / Branding Requirements <span style={{ color: '#C0392B' }}>*</span></label>
                <textarea name="brandingRequirements" value={form.brandingRequirements} onChange={handleChange}
                  placeholder="e.g. Company logo on front, 1 colour print in navy PMS 281. Or: Full colour CMYK print, both sides."
                  rows={3} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Colour Requirements</label>
                <input name="colourRequirements" value={form.colourRequirements} onChange={handleChange}
                  placeholder="e.g. PMS 281 Navy, PMS 871 Gold — or describe the colours" style={inputStyle} />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Preferred Decoration Method</label>
                <select name="decorationMethod" value={form.decorationMethod} onChange={handleChange} style={selectStyle}>
                  <option value="">Not sure — advise me</option>
                  <option value="screen-print">Screen Print</option>
                  <option value="embroidery">Embroidery</option>
                  <option value="digital-print">Digital Print</option>
                  <option value="heat-transfer">Heat Transfer</option>
                  <option value="laser-engrave">Laser Engraving</option>
                  <option value="pad-print">Pad Print</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={labelStyle}>Is this product for children? <span style={{ color: '#C0392B' }}>*</span></label>
                  <select name="forChildren" value={form.forChildren} onChange={handleChange} style={selectStyle}>
                    <option value="">Select...</option>
                    <option value="yes">Yes — under 14 years</option>
                    <option value="no">No — adult use</option>
                    <option value="mixed">Mixed / general public</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Delivery State / Territory <span style={{ color: '#C0392B' }}>*</span></label>
                  <select name="deliveryState" value={form.deliveryState} onChange={handleChange} style={selectStyle}>
                    <option value="">Select state...</option>
                    {['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT', 'Multiple States', 'International'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={labelStyle}>Compliance / Certification Requirements</label>
                <textarea name="complianceNotes" value={form.complianceNotes} onChange={handleChange}
                  placeholder="e.g. REACH compliance required, AS/NZS toy safety standard, ACCC documentation needed for government tender"
                  rows={2} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => setStep(0)} style={{ flex: 1, background: '#fff', color: NAVY, border: `1.5px solid ${NAVY}`, borderRadius: '10px', padding: '14px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}>
                  ← Back
                </button>
                <button
                  onClick={() => canProceedStep1() && setStep(2)}
                  style={{ flex: 2, background: canProceedStep1() ? GOLD : '#C8C4BC', color: '#fff', border: 'none', borderRadius: '10px', padding: '14px', fontSize: '15px', fontWeight: 700, cursor: canProceedStep1() ? 'pointer' : 'not-allowed', fontFamily: '"DM Sans", sans-serif' }}
                >
                  Next: Your Details →
                </button>
              </div>
              {!canProceedStep1() && (
                <p style={{ textAlign: 'center', fontSize: '12px', color: '#B0AAA3', margin: '8px 0 0' }}>Please fill in all required fields to continue</p>
              )}
            </div>
          )}

          {/* STEP 2 — Your Details */}
          {step === 2 && (
            <div>
              <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '26px', color: NAVY, margin: '0 0 8px' }}>Your Details</h2>
              <p style={{ fontSize: '13px', color: '#7A7570', margin: '0 0 28px' }}>Almost done — tell us who to send the quote to.</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={labelStyle}>Company Name <span style={{ color: '#C0392B' }}>*</span></label>
                  <input name="companyName" value={form.companyName} onChange={handleChange} placeholder="Acme Corporation" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Your Name <span style={{ color: '#C0392B' }}>*</span></label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Jane Smith" style={inputStyle} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={labelStyle}>Email <span style={{ color: '#C0392B' }}>*</span></label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="jane@company.com" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Phone</label>
                  <input name="phone" value={form.phone} onChange={handleChange} placeholder="04xx xxx xxx" style={{ ...inputStyle, fontFamily: '"DM Mono", monospace' }} />
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={labelStyle}>Additional Notes</label>
                <textarea name="notes" value={form.notes} onChange={handleChange}
                  placeholder="Anything else we should know — budget constraints, similar products you've seen, previous supplier issues, etc."
                  rows={3} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} />
              </div>

              {/* SUMMARY */}
              <div style={{ background: BG, borderRadius: '10px', padding: '16px 20px', border: '1px solid #E0DDD7', marginBottom: '20px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: NAVY, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>Your Request Summary</div>
                {[
                  { label: 'Product', value: form.productDescription.slice(0, 60) + (form.productDescription.length > 60 ? '...' : '') },
                  { label: 'Quantity', value: form.quantity },
                  { label: 'In-Hands Date', value: form.inHandsDate ? new Date(form.inHandsDate + 'T00:00:00').toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }) : '' },
                  { label: 'Freight', value: form.freightPreference || 'Not specified' },
                  { label: 'For Children', value: form.forChildren },
                  { label: 'Delivery State', value: form.deliveryState },
                ].filter(r => r.value).map(r => (
                  <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                    <span style={{ color: '#7A7570' }}>{r.label}</span>
                    <span style={{ color: NAVY, fontWeight: 500, textAlign: 'right', maxWidth: '60%' }}>{r.value}</span>
                  </div>
                ))}
              </div>

              {status === 'error' && (
                <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '12px 16px', fontSize: '13px', color: '#DC2626', marginBottom: '16px' }}>
                  Something went wrong. Please try again or email us at hello@quirkypromo.com.au
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => setStep(1)} style={{ flex: 1, background: '#fff', color: NAVY, border: `1.5px solid ${NAVY}`, borderRadius: '10px', padding: '14px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}>
                  ← Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={status === 'sending' || !canSubmit()}
                  style={{ flex: 2, background: !canSubmit() ? '#C8C4BC' : status === 'sending' ? NAVY : GOLD, color: '#fff', border: 'none', borderRadius: '10px', padding: '14px', fontSize: '15px', fontWeight: 700, cursor: (!canSubmit() || status === 'sending') ? 'not-allowed' : 'pointer', fontFamily: '"DM Sans", sans-serif' }}
                >
                  {status === 'sending' ? '⏳ Sending...' : 'Submit Quote Request →'}
                </button>
              </div>
              {!canSubmit() && (
                <p style={{ textAlign: 'center', fontSize: '12px', color: '#B0AAA3', margin: '8px 0 0' }}>Please fill in company name, your name and email</p>
              )}
              <p style={{ textAlign: 'center', fontSize: '13px', color: '#7A7570', margin: '16px 0 0' }}>
                We'll respond within <strong style={{ color: NAVY }}>24–48 business hours</strong> · 📞 02 9477 4748
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

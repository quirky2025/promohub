'use client';

import { useState } from 'react';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';
const BG = '#ffffff';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSent(true);
        setForm({ name: '', email: '', phone: '', message: '' });
      } else {
        setError('Something went wrong. Please try again or call us directly.');
      }
    } catch {
      setError('Something went wrong. Please try again or call us directly.');
    }
    setSending(false);
  }

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    border: '1.5px solid #E0DDD7',
    borderRadius: '8px',
    fontSize: '15px',
    fontFamily: '"DM Sans", sans-serif',
    color: NAVY,
    background: '#fff',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '12px',
    fontWeight: 700,
    color: NAVY,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '8px',
  };

  return (
    <div style={{ background: '#fff', fontFamily: '"DM Sans", sans-serif', minHeight: '100vh' }}>

      {/* HERO */}
      <div style={{ background: NAVY, padding: '80px 40px', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ width: '48px', height: '2px', background: GOLD, margin: '0 auto 32px' }} />
          <h1 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: 600, color: '#fff', letterSpacing: '2px', lineHeight: 1.1, margin: '0 0 16px' }}>
            Get in Touch
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', margin: 0 }}>
            We'd love to hear from you. Send us a message and we'll get back to you shortly.
          </p>
          <div style={{ width: '48px', height: '2px', background: GOLD, margin: '32px auto 0' }} />
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '80px 40px', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '80px', alignItems: 'start' }}>

        {/* LEFT — Contact Info */}
        <div>
          <h2 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '32px', fontWeight: 600, color: NAVY, marginBottom: '40px', lineHeight: 1.2 }}>
            Contact Information
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: GOLD, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>Phone</div>
              <a href="tel:0294774748" style={{ fontSize: '20px', fontFamily: '"DM Mono", monospace', color: NAVY, textDecoration: 'none', fontWeight: 500 }}>
                02 9477 4748
              </a>
            </div>

            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: GOLD, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>Email</div>
              <a href="mailto:hello@quirkypromo.com.au" style={{ fontSize: '16px', color: NAVY, textDecoration: 'none', fontWeight: 500 }}>
                hello@quirkypromo.com.au
              </a>
            </div>

            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: GOLD, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>Business Hours</div>
              <div style={{ fontSize: '15px', color: '#5A5A5A', lineHeight: 1.8 }}>
                Monday – Friday<br />
                9:00am – 5:00pm AEST
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — Form */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '48px', border: '1px solid #E0DDD7' }}>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
              <h3 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '28px', color: NAVY, marginBottom: '12px' }}>Message Sent!</h3>
              <p style={{ color: '#7A7570', fontSize: '15px', lineHeight: 1.7 }}>
                Thank you for reaching out. We'll get back to you within 3 business hours.
              </p>
              <button onClick={() => setSent(false)}
                style={{ marginTop: '24px', background: 'none', border: `1.5px solid ${GOLD}`, color: GOLD, padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, fontFamily: '"DM Sans", sans-serif' }}>
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={labelStyle}>Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} required
                    placeholder="Your full name" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Phone</label>
                  <input name="phone" value={form.phone} onChange={handleChange}
                    placeholder="Your phone number" style={inputStyle} />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Email *</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required
                  placeholder="your@email.com" style={inputStyle} />
              </div>

              <div style={{ marginBottom: '28px' }}>
                <label style={labelStyle}>Message *</label>
                <textarea name="message" value={form.message} onChange={handleChange} required
                  placeholder="Tell us about your project, product requirements, or any questions..." rows={6}
                  style={{ ...inputStyle, resize: 'vertical' }} />
              </div>

              {error && (
                <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', color: '#DC2626', fontSize: '14px' }}>
                  {error}
                </div>
              )}

              <button type="submit" disabled={sending}
                style={{ width: '100%', background: sending ? '#B0AAA3' : GOLD, color: '#fff', border: 'none', borderRadius: '8px', padding: '16px', fontSize: '15px', fontWeight: 700, cursor: sending ? 'not-allowed' : 'pointer', fontFamily: '"DM Sans", sans-serif', letterSpacing: '0.5px' }}>
                {sending ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

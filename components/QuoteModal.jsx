'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { gaEvent } from '@/lib/gtag';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';

const inputStyle = {
  width: '100%', boxSizing: 'border-box', padding: '12px 14px',
  borderRadius: '8px', border: '1px solid #D8D4CE', background: '#fff',
  fontSize: '14px', fontFamily: '"DM Sans", sans-serif', color: '#000',
  outline: 'none',
};

const labelStyle = {
  display: 'block', fontSize: '12px', fontWeight: 700, color: NAVY,
  letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '6px',
  fontFamily: '"DM Sans", sans-serif',
};

export default function QuoteModal({ open, onClose, source = 'homepage' }) {
  const [form, setForm] = useState({
    name: '', company: '', email: '', phone: '',
    message: '', quantity: '', date_needed: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  // Esc 关闭 + 锁定背景滚动
  useEffect(() => {
    if (!open) return;
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  function set(field) {
    return (e) => setForm(f => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit() {
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError('Please fill in your name, email and what you need.');
      return;
    }
    setSubmitting(true);
    setError('');
    let err = null;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers = { 'Content-Type': 'application/json' };
      if (session?.access_token) headers.Authorization = `Bearer ${session.access_token}`;
      const res = await fetch('/api/lead-enquiry', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: form.name.trim(),
          company: form.company.trim() || null,
          email: form.email.trim(),
          phone: form.phone.trim() || null,
          message: form.message.trim(),
          quantity: form.quantity.trim() || null,
          date_needed: form.date_needed || null,
          source,
        }),
      });
      if (!res.ok) err = await res.json().catch(() => ({ error: 'failed' }));
    } catch (e) {
      err = { error: e.message };
    }
    setSubmitting(false);
    if (err) {
      setError('Something went wrong. Please try again or call us on 02 9477 4748.');
      return;
    }
    gaEvent('enquiry_submit', { source, quantity: form.quantity.trim() || undefined });
    setDone(true);
  }

  function handleClose() {
    onClose();
    // 关闭后重置,下次打开是干净表单
    setTimeout(() => { setDone(false); setError(''); setForm({ name: '', company: '', email: '', phone: '', message: '', quantity: '', date_needed: '' }); }, 300);
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(27,42,74,.55)', backdropFilter: 'blur(3px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: '16px', width: 'min(560px, 100%)',
          maxHeight: '90vh', overflowY: 'auto', position: 'relative',
          boxShadow: '0 24px 80px rgba(0,0,0,.35)', padding: '36px 36px 32px',
          fontFamily: '"DM Sans", sans-serif',
        }}
      >
        {/* 关闭按钮 */}
        <button onClick={handleClose} aria-label="Close"
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '22px', color: '#9B958E', cursor: 'pointer', lineHeight: 1, padding: '6px' }}>
          ✕
        </button>

        {done ? (
          <div style={{ textAlign: 'center', padding: '32px 8px' }}>
            <div style={{ fontSize: '44px', marginBottom: '16px' }}>🎉</div>
            <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '30px', color: NAVY, margin: '0 0 12px', fontWeight: 600 }}>
              Quote Request Received!
            </h3>
            <p style={{ fontSize: '14px', color: '#000', lineHeight: 1.7, margin: '0 0 24px' }}>
              Thanks {form.name.split(' ')[0]} — our team will get back to you within 3 business hours with pricing and options.
            </p>
            <button onClick={handleClose}
              style={{ background: GOLD, color: '#fff', border: 'none', padding: '12px 32px', borderRadius: '10px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
              Done
            </button>
          </div>
        ) : (
          <>
            <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '32px', color: NAVY, margin: '0 0 6px', fontWeight: 600 }}>
              Get a Quote
            </h3>
            <p style={{ fontSize: '14px', color: '#000', margin: '0 0 24px', lineHeight: 1.6 }}>
              Tell us what you need — we reply within 3 business hours.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
              <div>
                <label style={labelStyle}>Name *</label>
                <input style={inputStyle} value={form.name} onChange={set('name')} placeholder="Your name" />
              </div>
              <div>
                <label style={labelStyle}>Company</label>
                <input style={inputStyle} value={form.company} onChange={set('company')} placeholder="Company name" />
              </div>
              <div>
                <label style={labelStyle}>Email *</label>
                <input style={inputStyle} type="email" value={form.email} onChange={set('email')} placeholder="you@company.com.au" />
              </div>
              <div>
                <label style={labelStyle}>Phone</label>
                <input style={inputStyle} type="tel" value={form.phone} onChange={set('phone')} placeholder="04xx xxx xxx" />
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>What do you need? *</label>
              <textarea style={{ ...inputStyle, minHeight: '90px', resize: 'vertical' }} value={form.message} onChange={set('message')}
                placeholder="e.g. 200 branded drink bottles with our logo for a conference in August" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
              <div>
                <label style={labelStyle}>Quantity</label>
                <input style={inputStyle} value={form.quantity} onChange={set('quantity')} placeholder="e.g. 200" />
              </div>
              <div>
                <label style={labelStyle}>Date Needed</label>
                <input style={inputStyle} type="date" value={form.date_needed} onChange={set('date_needed')} />
              </div>
            </div>

            {error && (
              <div style={{ background: '#FDECEA', color: '#B3261E', fontSize: '13px', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px' }}>
                {error}
              </div>
            )}

            <button onClick={handleSubmit} disabled={submitting}
              style={{ width: '100%', background: GOLD, color: '#fff', border: 'none', padding: '15px', borderRadius: '10px', fontSize: '16px', fontWeight: 700, cursor: submitting ? 'wait' : 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(201,169,110,.4)', opacity: submitting ? 0.7 : 1 }}>
              {submitting ? 'Sending…' : 'Get My Free Quote →'}
            </button>
            <p style={{ fontSize: '12px', color: '#000', textAlign: 'center', margin: '14px 0 0' }}>
              Prefer to talk? Call us on <a href="tel:0294774748" style={{ color: GOLD, fontWeight: 600, textDecoration: 'none' }}>02 9477 4748</a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

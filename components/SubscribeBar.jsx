'use client';

import { useState } from 'react';

const GOLD = '#C9A96E';

export default function SubscribeBar() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | done | error
  const [msg, setMsg] = useState('');

  async function submit(e) {
    e.preventDefault();
    const clean = email.trim();
    if (!clean.includes('@') || !clean.includes('.')) {
      setStatus('error'); setMsg('Please enter a valid email address.');
      return;
    }
    setStatus('loading'); setMsg('');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: clean }),
      });
      const data = await res.json();
      if (res.ok) { setStatus('done'); setEmail(''); setMsg("You're in — thanks for subscribing!"); }
      else { setStatus('error'); setMsg(data.error || 'Something went wrong. Please try again.'); }
    } catch {
      setStatus('error'); setMsg('Something went wrong. Please try again.');
    }
  }

  if (status === 'done') {
    return (
      <div style={{ color: '#fff', fontSize: '14px', fontWeight: 600, fontFamily: '"DM Sans", sans-serif' }}>
        ✓ {msg}
      </div>
    );
  }

  return (
    <div>
      <form className="qp-sub-box" onSubmit={submit} style={{ display: 'flex', gap: '0', flexShrink: 0 }}>
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); if (status === 'error') setStatus('idle'); }}
          placeholder="Enter your email address"
          className="qp-sub-input"
          style={{ padding: '12px 16px', border: 'none', background: 'rgba(255,255,255,.1)', color: '#fff', fontSize: '13px', outline: 'none', fontFamily: '"DM Sans", sans-serif', borderRadius: '8px 0 0 8px', width: '280px' }}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          style={{ background: GOLD, color: '#fff', border: 'none', padding: '12px 24px', fontSize: '13px', fontWeight: 600, cursor: status === 'loading' ? 'default' : 'pointer', opacity: status === 'loading' ? 0.7 : 1, fontFamily: '"DM Sans", sans-serif', borderRadius: '0 8px 8px 0', whiteSpace: 'nowrap' }}
        >
          {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
        </button>
      </form>
      {status === 'error' && (
        <div style={{ color: '#fff', fontSize: '12px', fontWeight: 600, marginTop: '8px', fontFamily: '"DM Sans", sans-serif' }}>{msg}</div>
      )}
    </div>
  );
}

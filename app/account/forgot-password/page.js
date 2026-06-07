'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function handleReset() {
    if (!email) return;
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/account/reset-password`,
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSent(true);
    }
  }

  return (
    <div style={{ background: '#fff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', fontFamily: '"DM Sans", sans-serif' }}>
      <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #E0DDD7', padding: '48px', maxWidth: '440px', width: '100%', boxShadow: '0 8px 32px rgba(27,42,74,0.08)', textAlign: 'center' }}>

        <Link href="/" style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '28px', color: NAVY, textDecoration: 'none', letterSpacing: '3px', fontWeight: 600 }}>
          QUIRKY<span style={{ color: GOLD }}>PROMO</span>
        </Link>

        {sent ? (
          <>
            <div style={{ fontSize: '48px', margin: '24px 0 16px' }}>📧</div>
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '28px', color: NAVY, margin: '0 0 12px' }}>Email sent!</h2>
            <p style={{ fontSize: '14px', color: '#7A7570', margin: '0 0 24px' }}>
              Check your inbox at <strong>{email}</strong> for a password reset link.
            </p>
            <Link href="/account/login" style={{ color: GOLD, textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
              ← Back to Sign In
            </Link>
          </>
        ) : (
          <>
            <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '28px', fontWeight: 600, color: NAVY, margin: '24px 0 8px' }}>Forgot Password?</h1>
            <p style={{ fontSize: '14px', color: '#7A7570', margin: '0 0 28px' }}>
              Enter your email and we'll send you a reset link.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: NAVY, marginBottom: '6px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="jane@company.com"
                  onKeyDown={e => e.key === 'Enter' && handleReset()}
                  style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #E0DDD7', borderRadius: '8px', fontSize: '15px', fontFamily: '"DM Sans", sans-serif', color: '#000', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              {error && (
                <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '12px 16px', fontSize: '13px', color: '#DC2626' }}>
                  {error}
                </div>
              )}
              <button onClick={handleReset} disabled={!email || loading}
                style={{ width: '100%', background: !email ? '#C8C4BC' : GOLD, color: '#fff', border: 'none', borderRadius: '10px', padding: '15px', fontSize: '16px', fontWeight: 700, cursor: !email ? 'not-allowed' : 'pointer', fontFamily: '"DM Sans", sans-serif' }}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
              <p style={{ textAlign: 'center', fontSize: '14px', color: '#7A7570', margin: 0 }}>
                <Link href="/account/login" style={{ color: GOLD, textDecoration: 'none', fontWeight: 600 }}>← Back to Sign In</Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

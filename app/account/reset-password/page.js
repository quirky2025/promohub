'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Supabase puts the token in the URL hash when user clicks email link
    // We need to listen for the PASSWORD_RECOVERY event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setReady(true);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleReset() {
    if (!password || !confirm) return;
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setDone(true);
      setTimeout(() => router.push('/account'), 3000);
    }
  }

  const inputStyle = {
    width: '100%', padding: '12px 16px', border: '1.5px solid #E0DDD7', borderRadius: '8px',
    fontSize: '15px', fontFamily: '"DM Sans", sans-serif', color: '#000',
    outline: 'none', boxSizing: 'border-box', background: '#fff',
  };

  return (
    <div style={{ background: '#fff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', fontFamily: '"DM Sans", sans-serif' }}>
      <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #E0DDD7', padding: '48px', maxWidth: '440px', width: '100%', boxShadow: '0 8px 32px rgba(27,42,74,0.08)', textAlign: 'center' }}>

        <Link href="/" style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '28px', color: NAVY, textDecoration: 'none', letterSpacing: '3px', fontWeight: 600 }}>
          QUIRKY<span style={{ color: GOLD }}>PROMO</span>
        </Link>

        {done ? (
          <>
            <div style={{ fontSize: '48px', margin: '24px 0 16px' }}>✅</div>
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '28px', color: NAVY, margin: '0 0 12px' }}>Password Updated!</h2>
            <p style={{ fontSize: '14px', color: '#000', margin: '0 0 24px' }}>
              Your password has been reset successfully. Redirecting you to your account...
            </p>
            <Link href="/account" style={{ color: GOLD, textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
              Go to My Account →
            </Link>
          </>
        ) : !ready ? (
          <>
            <div style={{ fontSize: '48px', margin: '24px 0 16px' }}>🔗</div>
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '28px', color: NAVY, margin: '0 0 12px' }}>Checking link...</h2>
            <p style={{ fontSize: '14px', color: '#000', margin: '0 0 24px' }}>
              Please wait while we verify your reset link. If this takes too long, your link may have expired.
            </p>
            <Link href="/account/forgot-password" style={{ color: GOLD, textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
              Request a new link →
            </Link>
          </>
        ) : (
          <>
            <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '28px', fontWeight: 600, color: NAVY, margin: '24px 0 8px' }}>Set New Password</h1>
            <p style={{ fontSize: '14px', color: '#000', margin: '0 0 28px' }}>
              Choose a strong password for your account.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: NAVY, marginBottom: '6px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.08em' }}>New Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  onKeyDown={e => e.key === 'Enter' && handleReset()}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: NAVY, marginBottom: '6px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Confirm Password</label>
                <input
                  type="password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="Re-enter your password"
                  onKeyDown={e => e.key === 'Enter' && handleReset()}
                  style={inputStyle}
                />
              </div>

              {error && (
                <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '12px 16px', fontSize: '13px', color: '#DC2626' }}>
                  {error}
                </div>
              )}

              <button
                onClick={handleReset}
                disabled={!password || !confirm || loading}
                style={{ width: '100%', background: (!password || !confirm) ? '#C8C4BC' : GOLD, color: '#fff', border: 'none', borderRadius: '10px', padding: '15px', fontSize: '16px', fontWeight: 700, cursor: (!password || !confirm || loading) ? 'not-allowed' : 'pointer', fontFamily: '"DM Sans", sans-serif', transition: 'background .2s' }}>
                {loading ? 'Updating...' : 'Update Password'}
              </button>

              <p style={{ textAlign: 'center', fontSize: '14px', color: '#000', margin: 0 }}>
                <Link href="/account/login" style={{ color: GOLD, textDecoration: 'none', fontWeight: 600 }}>← Back to Sign In</Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

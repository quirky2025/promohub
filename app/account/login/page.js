'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleLogin() {
    if (!email || !password) return;
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/account');
    }
  }

  const inputStyle = {
    width: '100%', padding: '12px 16px', border: '1.5px solid #E0DDD7', borderRadius: '8px',
    fontSize: '15px', fontFamily: '"DM Sans", sans-serif', color: '#000',
    outline: 'none', boxSizing: 'border-box', background: '#fff',
  };

  return (
    <div style={{ background: '#F8F7F4', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', fontFamily: '"DM Sans", sans-serif' }}>
      <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #E0DDD7', padding: '48px', maxWidth: '440px', width: '100%', boxShadow: '0 8px 32px rgba(27,42,74,0.08)' }}>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link href="/" style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '28px', color: NAVY, textDecoration: 'none', letterSpacing: '3px', fontWeight: 600 }}>
            QUIRKY<span style={{ color: GOLD }}>PROMO</span>
          </Link>
          <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '28px', fontWeight: 600, color: NAVY, margin: '16px 0 8px' }}>Sign In</h1>
          <p style={{ fontSize: '14px', color: '#7A7570', margin: 0 }}>Welcome back! Sign in to view your orders.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: NAVY, marginBottom: '6px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="jane@company.com" style={inputStyle}
              onKeyDown={e => e.key === 'Enter' && handleLogin()} />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: NAVY, marginBottom: '6px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={inputStyle}
              onKeyDown={e => e.key === 'Enter' && handleLogin()} />
          </div>

          <div style={{ textAlign: 'right' }}>
            <Link href="/account/forgot-password" style={{ fontSize: '13px', color: GOLD, textDecoration: 'none', fontWeight: 500 }}>
              Forgot password?
            </Link>
          </div>

          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '12px 16px', fontSize: '13px', color: '#DC2626' }}>
              {error}
            </div>
          )}

          <button onClick={handleLogin} disabled={!email || !password || loading}
            style={{ width: '100%', background: (!email || !password) ? '#C8C4BC' : GOLD, color: '#fff', border: 'none', borderRadius: '10px', padding: '15px', fontSize: '16px', fontWeight: 700, cursor: (!email || !password || loading) ? 'not-allowed' : 'pointer', fontFamily: '"DM Sans", sans-serif', transition: 'background .2s' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '14px', color: '#7A7570', margin: 0 }}>
            Don't have an account?{' '}
            <Link href="/account/register" style={{ color: GOLD, textDecoration: 'none', fontWeight: 600 }}>Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
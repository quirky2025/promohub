'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', company: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleRegister() {
    if (!form.name || !form.email || !form.password) return;
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { name: form.name, company: form.company },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
    }
  }

  const inputStyle = {
    width: '100%', padding: '12px 16px', border: '1.5px solid #E0DDD7', borderRadius: '8px',
    fontSize: '15px', fontFamily: '"DM Sans", sans-serif', color: '#000',
    outline: 'none', boxSizing: 'border-box', background: '#fff',
  };
  const labelStyle = { fontSize: '11px', fontWeight: 700, color: NAVY, marginBottom: '6px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.08em' };

  if (success) {
    return (
      <div style={{ background: '#F8F7F4', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #E0DDD7', padding: '48px', maxWidth: '440px', width: '100%', textAlign: 'center', boxShadow: '0 8px 32px rgba(27,42,74,0.08)' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '28px', color: NAVY, margin: '0 0 12px' }}>Check your email!</h2>
          <p style={{ fontSize: '14px', color: '#7A7570', margin: '0 0 24px' }}>
            We've sent a verification link to <strong>{form.email}</strong>. Click the link to activate your account.
          </p>
          <Link href="/account/login" style={{ background: GOLD, color: '#fff', textDecoration: 'none', padding: '14px 32px', borderRadius: '10px', fontWeight: 700, fontSize: '15px', fontFamily: '"DM Sans", sans-serif' }}>
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#F8F7F4', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', fontFamily: '"DM Sans", sans-serif' }}>
      <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #E0DDD7', padding: '48px', maxWidth: '440px', width: '100%', boxShadow: '0 8px 32px rgba(27,42,74,0.08)' }}>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link href="/" style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '28px', color: NAVY, textDecoration: 'none', letterSpacing: '3px', fontWeight: 600 }}>
            QUIRKY<span style={{ color: GOLD }}>PROMO</span>
          </Link>
          <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '28px', fontWeight: 600, color: NAVY, margin: '16px 0 8px' }}>Create Account</h1>
          <p style={{ fontSize: '14px', color: '#7A7570', margin: 0 }}>Join QuirkyPromo to track your orders.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Full Name *</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Jane Smith" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Company</label>
              <input name="company" value={form.company} onChange={handleChange} placeholder="Acme Corp" style={inputStyle} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Email *</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="jane@company.com" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Password *</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Min. 6 characters" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Confirm Password *</label>
            <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} placeholder="Re-enter password" style={inputStyle} />
          </div>

          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '12px 16px', fontSize: '13px', color: '#DC2626' }}>
              {error}
            </div>
          )}

          <button onClick={handleRegister} disabled={!form.name || !form.email || !form.password || loading}
            style={{ width: '100%', background: (!form.name || !form.email || !form.password) ? '#C8C4BC' : GOLD, color: '#fff', border: 'none', borderRadius: '10px', padding: '15px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', marginTop: '4px' }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '14px', color: '#7A7570', margin: 0 }}>
            Already have an account?{' '}
            <Link href="/account/login" style={{ color: GOLD, textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

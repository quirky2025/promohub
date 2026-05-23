'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin() {
    if (!username || !password) return;
    setLoading(true);
    setError('');

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      router.push('/admin');
    } else {
      setError('Invalid username or password');
      setLoading(false);
    }
  }

  return (
    <div style={{ background: '#F8F7F4', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"DM Sans", sans-serif' }}>
      <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #E0DDD7', padding: '48px', maxWidth: '420px', width: '100%', boxShadow: '0 8px 32px rgba(27,42,74,0.08)' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '28px', fontWeight: 600, color: NAVY, letterSpacing: '3px' }}>
            QUIRKY<span style={{ color: GOLD }}>PROMO</span>
          </div>
          <div style={{ fontSize: '13px', color: '#7A7570', marginTop: '8px' }}>Admin Panel</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: NAVY, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Username</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="admin"
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #E0DDD7', borderRadius: '8px', fontSize: '15px', fontFamily: '"DM Sans", sans-serif', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: NAVY, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #E0DDD7', borderRadius: '8px', fontSize: '15px', fontFamily: '"DM Sans", sans-serif', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '12px 16px', fontSize: '13px', color: '#DC2626' }}>
              {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={!username || !password || loading}
            style={{ width: '100%', background: !username || !password ? '#C8C4BC' : GOLD, color: '#fff', border: 'none', borderRadius: '10px', padding: '15px', fontSize: '16px', fontWeight: 700, cursor: !username || !password ? 'not-allowed' : 'pointer', fontFamily: '"DM Sans", sans-serif' }}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
}

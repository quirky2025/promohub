// app/admin/login/page.js —— 整体替换旧登录页
// Supabase Auth 邮箱+密码登录。无注册入口(Supabase 后台也已关闭注册)。
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const { error: err } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (err) {
      setLoading(false);
      setError('邮箱或密码不正确');
      return;
    }
    // 登录成功,session 已写入 cookie,proxy.js 会放行
    router.push('/admin');
    router.refresh();
  }

  return (
    <div style={st.page}>
      <form onSubmit={handleLogin} style={st.card}>
        <div style={st.brand}>
          <span style={st.brandQuirky}>QUIRKY</span>
          <span style={st.brandPromo}>PROMO</span>
          <span style={st.brandAdmin}>ADMIN</span>
        </div>
        <h1 style={st.title}>管理后台登录</h1>

        <label style={st.label}>邮箱</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoFocus
          autoComplete="email"
          style={st.input}
        />

        <label style={st.label}>密码</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          style={st.input}
        />

        {error && <p style={st.error}>{error}</p>}

        <button type="submit" disabled={loading} style={st.button}>
          {loading ? '登录中…' : '登 录'}
        </button>
      </form>
    </div>
  );
}

const st = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#1B2A4A',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    background: '#F8F7F4',
    borderRadius: 12,
    padding: '36px 32px',
    boxShadow: '0 18px 50px rgba(0,0,0,0.35)',
    borderTop: '4px solid #C9A96E',
  },
  brand: { letterSpacing: '0.08em', marginBottom: 4 },
  brandQuirky: {
    fontFamily: 'Georgia, serif',
    fontSize: 20,
    fontWeight: 700,
    color: '#1B2A4A',
  },
  brandPromo: {
    fontFamily: 'Georgia, serif',
    fontSize: 20,
    fontWeight: 700,
    color: '#C9A96E',
  },
  brandAdmin: {
    fontSize: 10,
    color: '#8a8577',
    marginLeft: 8,
    letterSpacing: '0.25em',
  },
  title: {
    fontFamily: 'Georgia, serif',
    fontSize: 17,
    color: '#1B2A4A',
    margin: '4px 0 24px',
    fontWeight: 400,
  },
  label: {
    display: 'block',
    fontSize: 12,
    color: '#6b6a64',
    marginBottom: 6,
  },
  input: {
    width: '100%',
    boxSizing: 'border-box',
    border: '1px solid #d8d2c6',
    borderRadius: 7,
    padding: '10px 12px',
    fontSize: 14,
    marginBottom: 16,
    background: '#fff',
    outline: 'none',
  },
  error: {
    color: '#b4413e',
    fontSize: 13,
    margin: '0 0 14px',
  },
  button: {
    width: '100%',
    border: 'none',
    borderRadius: 7,
    padding: '11px 0',
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    background: '#1B2A4A',
    color: '#fff',
    letterSpacing: '0.2em',
  },
};

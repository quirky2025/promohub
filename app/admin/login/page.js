// app/admin/login/page.js —— 整体替换(升级:支持 MFA 两步登录)
// 第一步:邮箱+密码;如果账号已绑定验证器,出现第二步:输入 6 位动态码。
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

function sb() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState('password'); // 'password' | 'code'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [factorId, setFactorId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handlePassword(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const supabase = sb();

    const { error: err } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (err) {
      setLoading(false);
      setError('邮箱或密码不正确');
      return;
    }

    // 密码通过后,看这个账号是否绑定了验证器(需要第二步)
    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (aal && aal.nextLevel === 'aal2' && aal.currentLevel !== 'aal2') {
      const { data: factors } = await supabase.auth.mfa.listFactors();
      const totp = factors?.totp?.[0];
      if (totp) {
        setFactorId(totp.id);
        setStep('code');
        setLoading(false);
        return;
      }
    }

    router.push('/admin');
    router.refresh();
  }

  async function handleCode(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const supabase = sb();

    const { error: err } = await supabase.auth.mfa.challengeAndVerify({
      factorId,
      code: code.trim(),
    });
    if (err) {
      setLoading(false);
      setError('验证码不正确或已过期,看一眼 App 上最新的 6 位数再试');
      return;
    }
    router.push('/admin');
    router.refresh();
  }

  return (
    <div style={st.page}>
      <form
        onSubmit={step === 'password' ? handlePassword : handleCode}
        style={st.card}
      >
        <div style={st.brand}>
          <span style={st.brandQuirky}>QUIRKY</span>
          <span style={st.brandPromo}>PROMO</span>
          <span style={st.brandAdmin}>ADMIN</span>
        </div>
        <h1 style={st.title}>
          {step === 'password' ? '管理后台登录' : '两步验证'}
        </h1>

        {step === 'password' ? (
          <>
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
          </>
        ) : (
          <>
            <p style={st.hint}>
              打开手机上的验证器 App(Google / Microsoft Authenticator),
              输入 QuirkyPromo Admin 的 6 位动态码:
            </p>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              required
              autoFocus
              placeholder="000000"
              style={{ ...st.input, ...st.codeInput }}
            />
          </>
        )}

        {error && <p style={st.error}>{error}</p>}

        <button type="submit" disabled={loading} style={st.button}>
          {loading ? '验证中…' : step === 'password' ? '登 录' : '验 证'}
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
  brandQuirky: { fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 700, color: '#1B2A4A' },
  brandPromo: { fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 700, color: '#C9A96E' },
  brandAdmin: { fontSize: 10, color: '#8a8577', marginLeft: 8, letterSpacing: '0.25em' },
  title: { fontFamily: 'Georgia, serif', fontSize: 17, color: '#1B2A4A', margin: '4px 0 24px', fontWeight: 400 },
  label: { display: 'block', fontSize: 12, color: '#6b6a64', marginBottom: 6 },
  hint: { fontSize: 13, color: '#6b6a64', margin: '0 0 14px', lineHeight: 1.6 },
  input: {
    width: '100%', boxSizing: 'border-box', border: '1px solid #d8d2c6',
    borderRadius: 7, padding: '10px 12px', fontSize: 14, marginBottom: 16,
    background: '#fff', outline: 'none',
  },
  codeInput: {
    fontSize: 26, letterSpacing: '0.4em', textAlign: 'center',
    fontVariantNumeric: 'tabular-nums',
  },
  error: { color: '#b4413e', fontSize: 13, margin: '0 0 14px' },
  button: {
    width: '100%', border: 'none', borderRadius: 7, padding: '11px 0',
    fontSize: 15, fontWeight: 700, cursor: 'pointer',
    background: '#1B2A4A', color: '#fff', letterSpacing: '0.2em',
  },
};

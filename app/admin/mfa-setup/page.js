// app/admin/mfa-setup/page.js —— 新文件
// 两步验证管理页:第一次用时扫码绑定手机验证器;之后可在这里查看/解绑。
// 访问地址:/admin/mfa-setup(需先登录)
'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

function sb() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export default function MfaSetupPage() {
  const [factors, setFactors] = useState([]);
  const [enrolling, setEnrolling] = useState(null); // { id, qr, secret }
  const [code, setCode] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function load() {
    const supabase = sb();
    const { data } = await supabase.auth.mfa.listFactors();
    setFactors(data?.totp || []);
    // 清理之前没绑完的半成品(未验证的因子)
    const unverified = (data?.all || []).filter((f) => f.status !== 'verified');
    for (const f of unverified) {
      await supabase.auth.mfa.unenroll({ factorId: f.id }).catch(() => {});
    }
  }
  useEffect(() => { load(); }, []);

  async function startEnroll() {
    setError(''); setMsg(''); setLoading(true);
    const supabase = sb();
    const { data, error: err } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
      friendlyName: 'QuirkyPromo Admin',
    });
    setLoading(false);
    if (err) { setError(err.message || '启动绑定失败'); return; }
    setEnrolling({
      id: data.id,
      qr: data.totp.qr_code,     // SVG 二维码
      secret: data.totp.secret,  // 手动输入用的密钥
    });
  }

  async function confirmEnroll(e) {
    e.preventDefault();
    setError(''); setLoading(true);
    const supabase = sb();
    const { error: err } = await supabase.auth.mfa.challengeAndVerify({
      factorId: enrolling.id,
      code: code.trim(),
    });
    setLoading(false);
    if (err) { setError('验证码不对,看 App 上最新的 6 位数再试'); return; }
    setEnrolling(null);
    setCode('');
    setMsg('✅ 绑定成功!从下次登录开始,输完密码还需要输 App 上的 6 位码。');
    load();
  }

  async function removeFactor(id) {
    if (!confirm('确定解绑?解绑后登录将不再需要验证码,安全性下降。')) return;
    const supabase = sb();
    const { error: err } = await supabase.auth.mfa.unenroll({ factorId: id });
    if (err) { setError(err.message || '解绑失败'); return; }
    setMsg('已解绑。');
    load();
  }

  return (
    <div style={st.wrap}>
      <h1 style={st.h1}>两步验证(MFA)</h1>
      <p style={st.muted}>
        绑定手机验证器后,登录后台需要"密码 + App 上的 6 位动态码",
        即使密码泄露,别人没有你的手机也进不来。
      </p>

      {msg && <p style={st.ok}>{msg}</p>}
      {error && <p style={st.err}>{error}</p>}

      {factors.length > 0 && !enrolling && (
        <div style={st.card}>
          <h2 style={st.h2}>已绑定的验证器</h2>
          {factors.map((f) => (
            <div key={f.id} style={st.row}>
              <span>
                📱 {f.friendly_name || 'Authenticator'}
                <span style={st.muted}>
                  (绑定于 {String(f.created_at).slice(0, 10)})
                </span>
              </span>
              <button style={st.linkDanger} onClick={() => removeFactor(f.id)}>
                解绑
              </button>
            </div>
          ))}
        </div>
      )}

      {factors.length === 0 && !enrolling && (
        <div style={st.card}>
          <h2 style={st.h2}>还没有绑定验证器</h2>
          <ol style={st.steps}>
            <li>手机应用商店搜索安装 <strong>Google Authenticator</strong>(或 Microsoft Authenticator)</li>
            <li>点下面的按钮,屏幕会出现一个二维码</li>
            <li>打开 App → 点 “+” → 扫描二维码</li>
            <li>把 App 显示的 6 位数输回来,完成绑定</li>
          </ol>
          <button style={st.btn} onClick={startEnroll} disabled={loading}>
            {loading ? '生成中…' : '开始绑定'}
          </button>
        </div>
      )}

      {enrolling && (
        <div style={st.card}>
          <h2 style={st.h2}>第 1 步:用验证器 App 扫这个码</h2>
          <div
            style={st.qrBox}
            dangerouslySetInnerHTML={{ __html: enrolling.qr }}
          />
          <p style={st.muted}>
            扫不了码?在 App 里选"手动输入",密钥:
            <code style={st.code}>{enrolling.secret}</code>
          </p>
          <h2 style={st.h2}>第 2 步:输入 App 上显示的 6 位数</h2>
          <form onSubmit={confirmEnroll} style={{ display: 'flex', gap: 10 }}>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              autoFocus
              style={st.codeInput}
            />
            <button type="submit" style={st.btn} disabled={loading || code.length !== 6}>
              {loading ? '验证中…' : '完成绑定'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

const st = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '32px 20px', color: '#2b2b2b', fontSize: 14, lineHeight: 1.6 },
  h1: { fontFamily: 'Georgia, serif', fontSize: 24, color: '#1B2A4A', marginBottom: 6 },
  h2: { fontFamily: 'Georgia, serif', fontSize: 16, color: '#1B2A4A', margin: '0 0 10px' },
  muted: { color: '#8a8577', fontSize: 13 },
  ok: { color: '#2e7d52', fontWeight: 600 },
  err: { color: '#b4413e' },
  card: {
    background: '#fff', border: '1px solid #e6e1d8', borderRadius: 10,
    padding: '20px 22px', marginTop: 16,
  },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' },
  steps: { paddingLeft: 20, margin: '8px 0 16px' },
  btn: {
    border: 'none', borderRadius: 7, padding: '10px 22px', fontSize: 14,
    fontWeight: 700, cursor: 'pointer', background: '#1B2A4A', color: '#fff',
  },
  linkDanger: {
    background: 'none', border: 'none', color: '#b4413e', cursor: 'pointer', fontSize: 13,
  },
  qrBox: {
    width: 200, height: 200, margin: '4px 0 10px',
    background: '#fff', border: '1px solid #e6e1d8', borderRadius: 8, padding: 8,
  },
  code: {
    background: '#f3efe7', padding: '2px 8px', borderRadius: 4,
    marginLeft: 6, fontSize: 13, wordBreak: 'break-all',
  },
  codeInput: {
    border: '1px solid #d8d2c6', borderRadius: 7, padding: '10px 12px',
    fontSize: 22, letterSpacing: '0.35em', textAlign: 'center', width: 180,
  },
};

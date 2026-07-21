'use client';

import { useState } from 'react';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';

// D13 · 客户评价表单:星级 + 姓名 + 评语,30 秒交卷。
// 提交成功 → 感谢页,顺手引导去 Google 再发一条(双轨)。
export default function ReviewForm({ token, alreadySubmitted, productName, productSlug, customerName, googleUrl }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [name, setName] = useState(customerName || '');
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(alreadySubmitted);

  async function submit() {
    if (!rating) { alert('Please tap a star rating first.'); return; }
    setBusy(true);
    try {
      const res = await fetch('/api/review/submit', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, rating, name: name.trim(), body: body.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { alert('Could not submit: ' + (data?.error || res.status)); setBusy(false); return; }
      setDone(true);
    } catch (e) { alert('Could not submit: ' + String(e?.message || e)); }
    setBusy(false);
  }

  const star = (n) => (
    <span key={n}
      onClick={() => setRating(n)}
      onMouseEnter={() => setHover(n)}
      onMouseLeave={() => setHover(0)}
      role="button" aria-label={`${n} star${n > 1 ? 's' : ''}`}
      style={{ fontSize: 42, cursor: 'pointer', color: (hover || rating) >= n ? GOLD : '#D8D2C6', userSelect: 'none', transition: 'color .1s' }}>
      ★
    </span>
  );

  if (done) {
    return (
      <div style={{ fontFamily: '"DM Sans", sans-serif', maxWidth: 560, margin: '60px auto', padding: '0 20px', color: '#1a1a1a', textAlign: 'center' }}>
        <div style={{ fontSize: 52 }}>🎉</div>
        <h1 style={{ fontFamily: '"Cormorant Garamond", serif', color: NAVY, fontSize: 30, margin: '10px 0' }}>
          {alreadySubmitted ? 'You’ve already reviewed this one' : 'Thank you!'}
        </h1>
        <p style={{ fontSize: 15, lineHeight: 1.7 }}>
          {alreadySubmitted
            ? 'Thanks again — your feedback has been received.'
            : 'Your review has been received and will appear on our site once approved.'}
        </p>
        {googleUrl && (
          <div style={{ marginTop: 24, padding: '20px', background: '#FBF7EF', border: `1px solid ${GOLD}`, borderRadius: 12 }}>
            <p style={{ fontSize: 14, margin: '0 0 12px', color: '#1a1a1a' }}>
              Got 30 more seconds? A quick Google review helps other businesses find us.
            </p>
            <a href={googleUrl} target="_blank" rel="noreferrer"
              style={{ background: GOLD, color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: 14, padding: '11px 24px', borderRadius: 8, display: 'inline-block' }}>
              Also share it on Google
            </a>
          </div>
        )}
        {productSlug && (
          <p style={{ marginTop: 22, fontSize: 13 }}>
            <a href={`/products/${productSlug}`} style={{ color: NAVY, fontWeight: 700 }}>← Back to {productName}</a>
          </p>
        )}
      </div>
    );
  }

  return (
    <div style={{ fontFamily: '"DM Sans", sans-serif', maxWidth: 560, margin: '50px auto', padding: '0 20px', color: '#1a1a1a' }}>
      <h1 style={{ fontFamily: '"Cormorant Garamond", serif', color: NAVY, fontSize: 30, margin: '0 0 4px' }}>How was your {productName}?</h1>
      <p style={{ fontSize: 14, lineHeight: 1.6, margin: '0 0 18px' }}>Two taps and you're done — a rating and (if you like) a sentence or two.</p>

      <div style={{ margin: '10px 0 18px' }}>{[1, 2, 3, 4, 5].map(star)}</div>

      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: NAVY, marginBottom: 4 }}>Your name (shown with your review)</label>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Sarah from Acme Events"
        style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #C8C4BC', borderRadius: 8, fontSize: 14, marginBottom: 14, boxSizing: 'border-box', color: '#1a1a1a' }} />

      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: NAVY, marginBottom: 4 }}>Your review (optional)</label>
      <textarea value={body} onChange={e => setBody(e.target.value)} rows={4}
        placeholder="How did the branding turn out? Would you order again?"
        style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #C8C4BC', borderRadius: 8, fontSize: 14, lineHeight: 1.6, marginBottom: 18, boxSizing: 'border-box', resize: 'vertical', color: '#1a1a1a', fontFamily: 'inherit' }} />

      <button onClick={submit} disabled={busy}
        style={{ background: busy ? '#B0AAA3' : NAVY, color: '#fff', border: 'none', borderRadius: 8, padding: '13px 30px', fontSize: 15, fontWeight: 700, cursor: 'pointer', width: '100%' }}>
        {busy ? 'Submitting…' : 'Submit review'}
      </button>
    </div>
  );
}

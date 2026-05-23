'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';

function MockupViewer({ url }) {
  if (!url) return null;

  const isPdf = url.toLowerCase().includes('.pdf');

  // Use Cloudinary pg_1 transformation to render PDF first page as JPG
  const displayUrl = isPdf
    ? url.replace('/upload/', '/upload/pg_1/').replace(/\.pdf$/, '.jpg')
    : url;

  return (
    <div>
      <img
        src={displayUrl}
        alt="Artwork Mockup"
        style={{ maxWidth: '100%', maxHeight: '600px', objectFit: 'contain', borderRadius: '8px', border: '1px solid #E0DDD7' }}
      />
      {isPdf && (
        <div style={{ marginTop: '16px' }}>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '10px 20px', background: NAVY, color: '#fff',
              borderRadius: '8px', fontSize: '13px', fontWeight: 600,
              textDecoration: 'none', fontFamily: '"DM Sans", sans-serif',
            }}
          >
            📄 Download PDF Mockup
          </a>
        </div>
      )}
    </div>
  );
}

export default function ArtworkPage() {
  const { token } = useParams();
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [requestingChanges, setRequestingChanges] = useState(false);

  useEffect(() => {
    fetch(`/api/artwork/get?token=${token}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) setError(data.error);
        else setArtwork(data);
        setLoading(false);
      })
      .catch(() => { setError('Failed to load artwork'); setLoading(false); });
  }, [token]);

  async function handleApprove() {
    if (!name.trim()) return;
    setSubmitting(true);
    const res = await fetch('/api/artwork/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, approvedBy: name, ipAddress: '', notes }),
    });
    if (res.ok) setDone(true);
    else setError('Something went wrong. Please call 02 9477 4748.');
    setSubmitting(false);
  }

  async function handleRequestChanges() {
    if (!notes.trim() || !name.trim()) return;
    setSubmitting(true);
    await fetch('/api/artwork/changes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, name, notes }),
    });
    setRequestingChanges(false);
    setDone('changes');
    setSubmitting(false);
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: '"DM Sans", sans-serif' }}>
      Loading your artwork...
    </div>
  );

  if (error) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: '"DM Sans", sans-serif', textAlign: 'center', padding: '40px' }}>
      <div>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
        <h2 style={{ color: NAVY, marginBottom: '8px' }}>Link not found</h2>
        <p style={{ color: '#7A7570' }}>{error}</p>
        <p style={{ color: '#7A7570' }}>Please call us: <strong>02 9477 4748</strong></p>
      </div>
    </div>
  );

  if (done === true) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#F8F7F4', fontFamily: '"DM Sans", sans-serif', padding: '40px' }}>
      <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #E0DDD7', padding: '48px', maxWidth: '500px', width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>✅</div>
        <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '32px', color: NAVY, margin: '0 0 12px' }}>Artwork Approved!</h1>
        <p style={{ fontSize: '15px', color: '#7A7570', margin: '0 0 24px' }}>
          Thank you, <strong>{name}</strong>! Your approval has been recorded and a confirmation has been emailed to you.
        </p>
        <div style={{ background: '#F8F7F4', borderRadius: '10px', padding: '16px', fontSize: '14px', color: '#7A7570' }}>
          {artwork?.payment_method === 'eft'
            ? 'Your Invoice will arrive shortly. Production begins once payment is received.'
            : "Production is now starting. We'll notify you when your order is dispatched."}
        </div>
      </div>
    </div>
  );

  if (done === 'changes') return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#F8F7F4', fontFamily: '"DM Sans", sans-serif', padding: '40px' }}>
      <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #E0DDD7', padding: '48px', maxWidth: '500px', width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>📝</div>
        <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '32px', color: NAVY, margin: '0 0 12px' }}>Changes Requested</h1>
        <p style={{ fontSize: '15px', color: '#7A7570', margin: '0 0 16px' }}>
          We've received your feedback and will send a revised mockup shortly.
        </p>
        <p style={{ fontSize: '13px', color: '#9CA3AF' }}>
          You'll receive an email when the updated mockup is ready. Use the same link to review and approve.
        </p>
      </div>
    </div>
  );

  if (artwork?.status === 'approved') return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#F8F7F4', fontFamily: '"DM Sans", sans-serif', padding: '40px' }}>
      <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #E0DDD7', padding: '48px', maxWidth: '500px', width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>✅</div>
        <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '32px', color: NAVY, margin: '0 0 12px' }}>Already Approved</h1>
        <p style={{ fontSize: '15px', color: '#7A7570' }}>
          This artwork has already been approved by <strong>{artwork.approved_by}</strong>.
        </p>
      </div>
    </div>
  );

  const isChangesRequested = artwork?.status === 'changes_requested';

  return (
    <div style={{ background: '#F8F7F4', minHeight: '100vh', fontFamily: '"DM Sans", sans-serif' }}>
      <div style={{ background: NAVY, padding: '20px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '22px', fontWeight: 600, color: '#fff', letterSpacing: '2px' }}>
          QUIRKY<span style={{ color: GOLD }}>PROMO</span>
        </span>
        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
          Artwork Approval · <span style={{ color: GOLD, fontWeight: 600 }}>{artwork?.order_number}</span>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>

        {isChangesRequested && (
          <div style={{ background: '#FEF3C7', border: '1px solid #F59E0B', borderRadius: '10px', padding: '14px 18px', marginBottom: '20px', fontSize: '14px', color: '#92400E' }}>
            ⏳ <strong>Changes requested.</strong> We're working on a revised mockup and will notify you by email when it's ready.
          </div>
        )}

        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E0DDD7', padding: '20px 24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', fontSize: '14px' }}>
            <div><span style={{ color: '#7A7570' }}>Order Number: </span><strong style={{ color: GOLD }}>{artwork?.order_number}</strong></div>
            <div><span style={{ color: '#7A7570' }}>Product: </span><strong>{artwork?.product_name}</strong></div>
            <div><span style={{ color: '#7A7570' }}>Customer: </span><strong>{artwork?.customer_name}</strong></div>
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E0DDD7', padding: '24px', marginBottom: '24px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '24px', color: NAVY, margin: '0 0 20px' }}>Your Artwork Mockup</h2>
          <MockupViewer url={artwork?.mockup_url} />
          <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '16px' }}>
            This mockup is for positional reference only. Colours on screen may differ from the final printed product.
          </p>
        </div>

        {!isChangesRequested && (
          <>
            {!requestingChanges ? (
              <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E0DDD7', padding: '24px' }}>
                <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '22px', color: NAVY, margin: '0 0 20px' }}>Review & Sign</h2>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: NAVY, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Your Full Name *
                  </label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Jane Smith"
                    style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #E0DDD7', borderRadius: '8px', fontSize: '15px', fontFamily: '"DM Sans", sans-serif', boxSizing: 'border-box', outline: 'none' }} />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: NAVY, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Additional Notes (optional)
                  </label>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any comments about the artwork..." rows={3}
                    style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #E0DDD7', borderRadius: '8px', fontSize: '14px', fontFamily: '"DM Sans", sans-serif', boxSizing: 'border-box', outline: 'none', resize: 'vertical' }} />
                </div>

                <div style={{ background: '#F8F7F4', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', fontSize: '12px', color: '#7A7570' }}>
                  By clicking "I Approve This Artwork", you confirm that you have reviewed the mockup and approve it for production. This approval is legally binding.
                </div>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button onClick={handleApprove} disabled={!name.trim() || submitting}
                    style={{ flex: 1, background: !name.trim() ? '#C8C4BC' : '#2D6A4F', color: '#fff', border: 'none', borderRadius: '10px', padding: '16px', fontSize: '16px', fontWeight: 700, cursor: !name.trim() ? 'not-allowed' : 'pointer', fontFamily: '"DM Sans", sans-serif', minWidth: '200px' }}>
                    {submitting ? 'Processing...' : '✅ I Approve This Artwork'}
                  </button>
                  <button onClick={() => setRequestingChanges(true)}
                    style={{ flex: 1, background: '#fff', color: NAVY, border: `1.5px solid ${NAVY}`, borderRadius: '10px', padding: '16px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', minWidth: '160px' }}>
                    ✏️ Request Changes
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E0DDD7', padding: '24px' }}>
                <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '22px', color: NAVY, margin: '0 0 20px' }}>Request Changes</h2>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: NAVY, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Your Name *</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Jane Smith"
                    style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #E0DDD7', borderRadius: '8px', fontSize: '15px', fontFamily: '"DM Sans", sans-serif', boxSizing: 'border-box', outline: 'none' }} />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: NAVY, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>What changes do you need? *</label>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Please describe the changes you'd like..." rows={4}
                    style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #E0DDD7', borderRadius: '8px', fontSize: '14px', fontFamily: '"DM Sans", sans-serif', boxSizing: 'border-box', outline: 'none', resize: 'vertical' }} />
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={handleRequestChanges} disabled={!name.trim() || !notes.trim() || submitting}
                    style={{ flex: 1, background: GOLD, color: '#fff', border: 'none', borderRadius: '10px', padding: '14px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}>
                    {submitting ? 'Sending...' : 'Submit Changes Request'}
                  </button>
                  <button onClick={() => setRequestingChanges(false)}
                    style={{ background: '#fff', color: '#7A7570', border: '1.5px solid #E0DDD7', borderRadius: '10px', padding: '14px 20px', fontSize: '14px', cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

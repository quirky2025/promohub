'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { uploadImage } from '@/lib/imageHost';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';

export default function UploadLogoPage() {
  const { token } = useParams();
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logoFile, setLogoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/artwork/get?token=${token}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) setError('Link not found or expired.');
        else setArtwork(data);
        setLoading(false);
      });
  }, [token]);

  async function handleUpload() {
    if (!logoFile) return;
    setUploading(true);
    setError('');

    try {
      // Upload via centralised uploader (lib/imageHost.js)
      const up = await uploadImage(logoFile, artwork.order_number, 'logo');
      if (!up || !up.logo_url) throw new Error('upload failed');
      const logoUrl = up.logo_url;
      const logoPngUrl = up.logo_png_url;

      // Trigger mockup generation
      await fetch('/api/artwork/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber: artwork.order_number,
          customerName: artwork.customer_name,
          customerEmail: artwork.customer_email,
          productName: artwork.product_name,
          productImageUrl: artwork.product_image_url || '',
          logoUrl,
          logoPngUrl,
          paymentMethod: artwork.payment_method,
          token,
        }),
      });

      setDone(true);
    } catch {
      setError('Upload failed. Please try again or email your logo to hello@quirkypromo.com.au');
    }
    setUploading(false);
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: '"DM Sans", sans-serif' }}>
      Loading...
    </div>
  );

  if (error) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: '"DM Sans", sans-serif', padding: '40px', textAlign: 'center' }}>
      <div>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
        <h2 style={{ color: NAVY }}>{error}</h2>
        <p style={{ color: '#7A7570' }}>Please email your logo to <strong>hello@quirkypromo.com.au</strong></p>
        <p style={{ color: '#7A7570' }}>Or call us: <strong>02 9477 4748</strong></p>
      </div>
    </div>
  );

  if (done) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#fff', fontFamily: '"DM Sans", sans-serif', padding: '40px' }}>
      <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #E0DDD7', padding: '48px', maxWidth: '500px', width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎨</div>
        <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '32px', color: NAVY, margin: '0 0 12px' }}>Logo Uploaded!</h1>
        <p style={{ fontSize: '15px', color: '#7A7570', margin: '0 0 8px' }}>
          Thank you! We're generating your artwork mockup now.
        </p>
        <p style={{ fontSize: '14px', color: '#7A7570' }}>
          You'll receive an email shortly with your mockup to review and approve.
        </p>
      </div>
    </div>
  );

  return (
    <div style={{ background: '#fff', minHeight: '100vh', fontFamily: '"DM Sans", sans-serif' }}>
      {/* Header */}
      <div style={{ background: NAVY, padding: '20px 40px' }}>
        <span style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '22px', fontWeight: 600, color: '#fff', letterSpacing: '2px' }}>
          QUIRKY<span style={{ color: GOLD }}>PROMO</span>
        </span>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E0DDD7', padding: '40px' }}>
          <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '30px', color: NAVY, margin: '0 0 8px' }}>Upload Your Logo</h1>
          <p style={{ fontSize: '14px', color: '#7A7570', margin: '0 0 24px' }}>
            Order: <strong style={{ color: GOLD }}>{artwork?.order_number}</strong> · {artwork?.product_name}
          </p>

          <div
            onClick={() => document.getElementById('logo-file-input').click()}
            style={{
              border: `2px dashed ${logoFile ? GOLD : '#C8C4BC'}`,
              borderRadius: '12px',
              padding: '48px 32px',
              textAlign: 'center',
              cursor: 'pointer',
              background: logoFile ? '#FFFBF4' : '#ffffff',
              marginBottom: '24px',
              transition: 'all .2s',
            }}>
            <input
              id="logo-file-input"
              type="file"
              accept=".ai,.pdf,.png,.jpg,.jpeg,.eps,.svg"
              style={{ display: 'none' }}
              onChange={e => { if (e.target.files[0]) setLogoFile(e.target.files[0]); }}
            />
            {logoFile ? (
              <>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>✅</div>
                <div style={{ fontWeight: 700, color: NAVY, fontSize: '16px' }}>{logoFile.name}</div>
                <div style={{ fontSize: '13px', color: '#7A7570', marginTop: '8px' }}>Click to change file</div>
              </>
            ) : (
              <>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎨</div>
                <div style={{ fontWeight: 700, color: NAVY, fontSize: '16px', marginBottom: '8px' }}>Click to upload your logo</div>
                <div style={{ fontSize: '13px', color: '#7A7570' }}>AI, PDF, PNG, JPG, EPS, SVG</div>
                <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>Vector files (AI, PDF, EPS) preferred for best quality</div>
              </>
            )}
          </div>

          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '12px 16px', fontSize: '13px', color: '#DC2626', marginBottom: '16px' }}>
              {error}
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!logoFile || uploading}
            style={{
              width: '100%', background: !logoFile ? '#C8C4BC' : GOLD,
              color: '#fff', border: 'none', borderRadius: '10px', padding: '16px',
              fontSize: '16px', fontWeight: 700,
              cursor: !logoFile ? 'not-allowed' : 'pointer',
              fontFamily: '"DM Sans", sans-serif',
            }}>
            {uploading ? 'Uploading...' : 'Upload Logo & Generate Mockup →'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '13px', color: '#9CA3AF', marginTop: '16px' }}>
            Or email your logo to{' '}
            <a href="mailto:hello@quirkypromo.com.au" style={{ color: GOLD }}>hello@quirkypromo.com.au</a>
            {' '}with reference <strong>{artwork?.order_number}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

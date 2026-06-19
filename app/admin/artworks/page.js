'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';

const STATUS_COLORS = {
  awaiting_logo: { bg: '#FEF3C7', text: '#92400E', label: 'Awaiting Logo' },
  logo_received: { bg: '#DBEAFE', text: '#1E40AF', label: 'Logo Received' },
  mockup_sent: { bg: '#E0E7FF', text: '#3730A3', label: 'Mockup Sent' },
  changes_requested: { bg: '#FEE2E2', text: '#991B1B', label: 'Changes Requested' },
  approved: { bg: '#D1FAE5', text: '#065F46', label: 'Approved' },
};

function toDisplayUrl(url) {
  if (!url) return url;
  if (!url.toLowerCase().includes('.pdf')) return url;
  return url
    .replace('/upload/', '/upload/pg_1/')
    .replace(/\.pdf$/, '.jpg');
}

function loadCanvasImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

function drawContain(ctx, img, x, y, width, height) {
  const ratio = Math.min(width / img.naturalWidth, height / img.naturalHeight);
  const drawWidth = img.naturalWidth * ratio;
  const drawHeight = img.naturalHeight * ratio;
  const drawX = x + (width - drawWidth) / 2;
  const drawY = y + (height - drawHeight) / 2;
  ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
  return { x: drawX, y: drawY, width: drawWidth, height: drawHeight };
}

export default function AdminArtworksPage() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [studio, setStudio] = useState(null);
  const [mockupFile, setMockupFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadArtworks();
  }, [filter]);

  async function loadArtworks() {
    setLoading(true);
    const url = filter === 'all' ? '/api/admin/artworks' : `/api/admin/artworks?status=${filter}`;
    const res = await fetch(url);
    const data = await res.json();
    setArtworks(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  async function uploadMockup() {
    if (!mockupFile || !selected) return;
    setUploading(true);

    let mockupUrl = '';
    const isPdf = mockupFile.name.toLowerCase().endsWith('.pdf');

    if (isPdf) {
      // PDF → backend API (uses SUPABASE_SERVICE_KEY to bypass RLS)
      const pdfForm = new FormData();
      pdfForm.append('file', mockupFile);
      pdfForm.append('orderNumber', selected.order_number);
      const pdfRes = await fetch('/api/admin/artworks/upload-pdf', {
        method: 'POST',
        body: pdfForm,
      });
      const pdfData = await pdfRes.json();
      if (!pdfRes.ok) {
        alert('Upload failed: ' + pdfData.error);
        setUploading(false);
        return;
      }
      mockupUrl = pdfData.url;
    } else {
      // Image → Cloudinary
      const formData = new FormData();
      formData.append('file', mockupFile);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );
      const cloudData = await cloudRes.json();
      mockupUrl = cloudData.secure_url;
    }

    // Save and send to customer
    const res = await fetch('/api/admin/artworks/send-mockup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: selected.token, mockupUrl }),
    });

    if (res.ok) {
      setSuccess(`Mockup sent to ${selected.customer_email}!`);
      setSelected(null);
      setMockupFile(null);
      loadArtworks();
    }
    setUploading(false);
  }

  function getActionButton(art) {
    if (art.status === 'logo_received') {
      return (
        <>
          <button onClick={() => { setStudio(art); setSuccess(''); }}
            style={{ background: GOLD, color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', whiteSpace: 'nowrap' }}>
            Artwork Studio
          </button>
          <button onClick={() => { setSelected(art); setMockupFile(null); setSuccess(''); }}
            style={{ background: '#fff', color: NAVY, border: `1.5px solid ${NAVY}`, borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', whiteSpace: 'nowrap' }}>
            Upload File
          </button>
        </>
      );
    }
    if (art.status === 'mockup_sent') {
      return (
        <>
          <button onClick={() => { setStudio(art); setSuccess(''); }}
            style={{ background: '#fff', color: NAVY, border: `1.5px solid ${NAVY}`, borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', whiteSpace: 'nowrap' }}>
            Artwork Studio
          </button>
          <button onClick={() => { setSelected(art); setMockupFile(null); setSuccess(''); }}
            style={{ background: '#fff', color: '#7A7570', border: '1.5px solid #E0DDD7', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', whiteSpace: 'nowrap' }}>
            Upload File
          </button>
        </>
      );
    }
    if (art.status === 'changes_requested') {
      return (
        <>
          <button onClick={() => { setStudio(art); setSuccess(''); }}
            style={{ background: '#991B1B', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', whiteSpace: 'nowrap' }}>
            Artwork Studio
          </button>
          <button onClick={() => { setSelected(art); setMockupFile(null); setSuccess(''); }}
            style={{ background: '#fff', color: '#991B1B', border: '1.5px solid #991B1B', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', whiteSpace: 'nowrap' }}>
            Upload File
          </button>
        </>
      );
    }
    if (art.status === 'approved') {
      return <span style={{ fontSize: '12px', color: '#065F46', fontWeight: 600 }}>✅ Approved</span>;
    }
    return null;
  }

  function getModalTitle(art) {
    if (art.status === 'mockup_sent') return 'Upload New Version';
    if (art.status === 'changes_requested') return 'Upload Revised Mockup';
    return 'Upload Mockup';
  }

  return (
    <div style={{ background: '#fff', minHeight: '100vh', fontFamily: '"DM Sans", sans-serif' }}>
      <div style={{ background: NAVY, padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '56px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <span style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '20px', fontWeight: 600, color: '#fff', letterSpacing: '2px' }}>
            QUIRKY<span style={{ color: GOLD }}>PROMO</span>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginLeft: '8px', letterSpacing: '1px' }}>ADMIN</span>
          </span>
          <nav style={{ display: 'flex', gap: '4px' }}>
            {[
              { label: 'Dashboard', href: '/admin' },
              { label: 'Artworks', href: '/admin/artworks' },
              { label: 'Orders', href: '/admin/orders' },
              { label: 'Quotes', href: '/admin/quotes' },
              { label: 'Products', href: '/admin/products' },
            ].map(item => (
              <Link key={item.href} href={item.href} style={{ color: item.href === '/admin/artworks' ? '#fff' : 'rgba(255,255,255,0.7)', textDecoration: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: item.href === '/admin/artworks' ? 700 : 500, background: item.href === '/admin/artworks' ? 'rgba(255,255,255,0.1)' : 'none' }}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <Link href="/admin/login" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '13px' }}>Logout</Link>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '32px', fontWeight: 600, color: NAVY, margin: 0 }}>Artwork Management</h1>
          {success && (
            <div style={{ background: '#D1FAE5', color: '#065F46', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 600 }}>
              ✅ {success}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {['all', 'awaiting_logo', 'logo_received', 'mockup_sent', 'changes_requested', 'approved'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: '6px 14px', borderRadius: '6px', border: '1.5px solid', borderColor: filter === f ? NAVY : '#E0DDD7', background: filter === f ? NAVY : '#fff', color: filter === f ? '#fff' : '#7A7570', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', textTransform: 'capitalize' }}>
              {f === 'all' ? 'All' : STATUS_COLORS[f]?.label || f}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#7A7570' }}>Loading...</div>
        ) : artworks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#7A7570', background: '#fff', borderRadius: '12px', border: '1px solid #E0DDD7' }}>No artworks found</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {artworks.map((art, index) => {
              const artworkKey = art.id || art.token || art.order_number || `${art.customer_email || 'artwork'}-${art.created_at || index}`;
              return (
              <div key={artworkKey} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E0DDD7', padding: '20px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 700, color: GOLD, fontFamily: '"DM Mono", monospace', fontSize: '15px' }}>{art.order_number}</span>
                      <span style={{ background: STATUS_COLORS[art.status]?.bg || '#F3F4F6', color: STATUS_COLORS[art.status]?.text || '#374151', padding: '2px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>
                        {STATUS_COLORS[art.status]?.label || art.status}
                      </span>
                      <span style={{ fontSize: '12px', color: '#7A7570' }}>{art.payment_method === 'eft' ? '🏦 EFT' : '💳 Card'}</span>
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: NAVY, marginBottom: '4px' }}>{art.customer_name}</div>
                    <div style={{ fontSize: '13px', color: '#7A7570', marginBottom: '4px' }}>{art.customer_email}</div>
                    <div style={{ fontSize: '13px', color: '#7A7570', marginBottom: '4px' }}>Product: <strong style={{ color: NAVY }}>{art.product_name}</strong></div>
                    <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{new Date(art.created_at).toLocaleString('en-AU')}</div>
                    {art.notes && (
                      <div style={{ marginTop: '8px', background: '#FEF3C7', borderRadius: '6px', padding: '8px 12px', fontSize: '12px', color: '#92400E' }}>
                        <strong>Customer notes:</strong> {art.notes}
                      </div>
                    )}
                  </div>

                  {art.logo_url && (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '11px', color: '#7A7570', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Logo</div>
                      <img src={art.logo_url} alt="Logo" style={{ width: '80px', height: '80px', objectFit: 'contain', border: '1px solid #E0DDD7', borderRadius: '8px', padding: '4px', background: '#fff' }} />
                      <div style={{ marginTop: '4px' }}>
                        <a href={art.logo_url} target="_blank" rel="noreferrer" style={{ fontSize: '11px', color: GOLD, textDecoration: 'none' }}>Download</a>
                      </div>
                    </div>
                  )}

                  {art.mockup_url && (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '11px', color: '#7A7570', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Mockup</div>
                      <img src={toDisplayUrl(art.mockup_url)} alt="Mockup" style={{ width: '80px', height: '80px', objectFit: 'contain', border: '1px solid #E0DDD7', borderRadius: '8px', padding: '4px', background: '#fff' }} />
                      <div style={{ marginTop: '4px' }}>
                        <a href={art.mockup_url} target="_blank" rel="noreferrer" style={{ fontSize: '11px', color: GOLD, textDecoration: 'none' }}>View</a>
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '160px', alignItems: 'flex-end' }}>
                    {getActionButton(art)}
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        )}
      </div>

      {studio && (
        <MockupStudio
          art={studio}
          onClose={() => setStudio(null)}
          onSent={() => {
            setSuccess(`Mockup sent to ${studio.customer_email}!`);
            setStudio(null);
            loadArtworks();
          }}
        />
      )}

      {selected && (
        <div onClick={e => e.target === e.currentTarget && setSelected(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', maxWidth: '500px', width: '100%' }}>
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '24px', color: NAVY, margin: '0 0 8px' }}>
              {getModalTitle(selected)}
            </h2>
            <p style={{ fontSize: '14px', color: '#7A7570', margin: '0 0 20px' }}>
              Order: <strong style={{ color: GOLD }}>{selected.order_number}</strong> · {selected.customer_name}
            </p>

            {selected.status === 'changes_requested' && selected.notes && (
              <div style={{ background: '#FEF3C7', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', color: '#92400E' }}>
                <strong>Customer requested:</strong><br />{selected.notes}
              </div>
            )}

            {selected.logo_url && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '12px', color: '#7A7570', marginBottom: '8px' }}>Customer Logo:</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src={selected.logo_url} alt="Logo" style={{ width: '60px', height: '60px', objectFit: 'contain', border: '1px solid #E0DDD7', borderRadius: '6px', padding: '4px' }} />
                  <a href={selected.logo_url} target="_blank" rel="noreferrer" style={{ fontSize: '13px', color: GOLD, textDecoration: 'none', fontWeight: 600 }}>
                    Download Logo →
                  </a>
                </div>
              </div>
            )}

            <div onClick={() => document.getElementById('mockup-upload').click()}
              style={{ border: `2px dashed ${mockupFile ? GOLD : '#C8C4BC'}`, borderRadius: '10px', padding: '32px', textAlign: 'center', cursor: 'pointer', background: mockupFile ? '#FFFBF4' : '#F8F7F4', marginBottom: '20px' }}>
              <input id="mockup-upload" type="file" accept="image/*,.pdf" style={{ display: 'none' }}
                onChange={e => { if (e.target.files[0]) setMockupFile(e.target.files[0]); }} />
              {mockupFile ? (
                <>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>✅</div>
                  <div style={{ fontWeight: 600, color: NAVY }}>{mockupFile.name}</div>
                  <div style={{ fontSize: '12px', color: '#7A7570', marginTop: '4px' }}>Click to change</div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎨</div>
                  <div style={{ fontWeight: 600, color: NAVY, marginBottom: '4px' }}>Click to upload mockup</div>
                  <div style={{ fontSize: '12px', color: '#7A7570' }}>PNG, JPG, PDF accepted</div>
                </>
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={uploadMockup} disabled={!mockupFile || uploading}
                style={{ flex: 1, background: !mockupFile ? '#C8C4BC' : GOLD, color: '#fff', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '14px', fontWeight: 700, cursor: !mockupFile ? 'not-allowed' : 'pointer', fontFamily: '"DM Sans", sans-serif' }}>
                {uploading ? 'Uploading...' : 'Send to Customer →'}
              </button>
              <button onClick={() => setSelected(null)}
                style={{ background: '#fff', color: '#7A7570', border: '1.5px solid #E0DDD7', borderRadius: '8px', padding: '12px 20px', fontSize: '14px', cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MockupStudio({ art, onClose, onSent }) {
  const stageRef = useRef(null);
  const dragRef = useRef(null);
  const [productFileUrl, setProductFileUrl] = useState('');
  const [logo, setLogo] = useState({ x: 50, y: 50, w: 22 });
  const [printMethod, setPrintMethod] = useState('Screen Print');
  const [printPosition, setPrintPosition] = useState('Front');
  const [printSize, setPrintSize] = useState('80mm W');
  const [notes, setNotes] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const productUrl = productFileUrl || toDisplayUrl(art.product_image_url || '');
  const logoUrl = toDisplayUrl(art.logo_url || '');

  function updateLogo(next) {
    setLogo((current) => ({ ...current, ...next }));
  }

  function handleProductFile(file) {
    if (!file) return;
    setProductFileUrl(URL.createObjectURL(file));
  }

  function startDrag(event) {
    event.preventDefault();
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      logo,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function moveDrag(event) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const dx = ((event.clientX - drag.startX) / rect.width) * 100;
    const dy = ((event.clientY - drag.startY) / rect.height) * 100;
    updateLogo({
      x: Math.max(5, Math.min(95, drag.logo.x + dx)),
      y: Math.max(5, Math.min(95, drag.logo.y + dy)),
    });
  }

  function endDrag(event) {
    const drag = dragRef.current;
    if (drag?.pointerId === event.pointerId) dragRef.current = null;
  }

  async function generateMockupDataUrl() {
    const canvas = document.createElement('canvas');
    canvas.width = 1600;
    canvas.height = 1200;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#F8F7F4';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(70, 70, 1460, 960);

    if (productUrl) {
      const productImg = await loadCanvasImage(productUrl);
      drawContain(ctx, productImg, 120, 120, 1360, 820);
    } else {
      ctx.strokeStyle = '#E0DDD7';
      ctx.lineWidth = 6;
      ctx.strokeRect(300, 220, 1000, 560);
      ctx.fillStyle = '#7A7570';
      ctx.font = '48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(art.product_name || 'Product image required', 800, 510);
    }

    if (!logoUrl) {
      throw new Error('No logo file is available for this artwork.');
    }
    const logoImg = await loadCanvasImage(logoUrl);
    const logoWidth = canvas.width * (logo.w / 100);
    const logoHeight = logoWidth * (logoImg.naturalHeight / logoImg.naturalWidth);
    const logoX = canvas.width * (logo.x / 100) - logoWidth / 2;
    const logoY = canvas.height * (logo.y / 100) - logoHeight / 2;

    ctx.save();
    ctx.globalAlpha = 0.96;
    ctx.drawImage(logoImg, logoX, logoY, logoWidth, logoHeight);
    ctx.restore();

    ctx.fillStyle = '#1B2A4A';
    ctx.font = 'bold 30px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('ARTWORK PROOF', 80, 1100);
    ctx.font = '24px Arial';
    ctx.fillStyle = '#3D3A36';
    ctx.fillText(`${art.order_number || ''} / ${art.product_name || ''}`, 80, 1138);
    ctx.fillText(`${printMethod} / ${printPosition} / ${printSize}`, 80, 1172);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#7A7570';
    ctx.font = '20px Arial';
    ctx.fillText('Mockup for position reference only. Production starts after approval.', 1520, 1138);
    if (notes.trim()) {
      ctx.fillText(notes.trim().slice(0, 90), 1520, 1172);
    }

    return canvas.toDataURL('image/png');
  }

  async function refreshPreview() {
    setBusy(true);
    setError('');
    try {
      const dataUrl = await generateMockupDataUrl();
      setPreviewUrl(dataUrl);
      return dataUrl;
    } catch (err) {
      setError(`${err.message || 'Could not generate mockup.'} If this is a vector/PDF logo, use Upload File for now.`);
      return '';
    } finally {
      setBusy(false);
    }
  }

  async function downloadPng() {
    const dataUrl = previewUrl || await refreshPreview();
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `${art.order_number || 'mockup'}-proof.png`;
    a.click();
  }

  async function uploadDataUrl(dataUrl) {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !preset) {
      throw new Error('Cloudinary upload settings are missing.');
    }
    const formData = new FormData();
    formData.append('file', dataUrl);
    formData.append('upload_preset', preset);
    formData.append('folder', 'quirkypromo/mockups');
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (!res.ok || !data.secure_url) {
      throw new Error(data.error?.message || 'Cloudinary upload failed.');
    }
    return data.secure_url;
  }

  async function sendToCustomer() {
    setBusy(true);
    setError('');
    try {
      const dataUrl = previewUrl || await generateMockupDataUrl();
      setPreviewUrl(dataUrl);
      const mockupUrl = await uploadDataUrl(dataUrl);
      const res = await fetch('/api/admin/artworks/send-mockup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: art.token, mockupUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send mockup.');
      onSent();
    } catch (err) {
      setError(err.message || 'Failed to send mockup.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      onClick={(event) => event.target === event.currentTarget && !busy && onClose()}
      style={{ position: 'fixed', inset: 0, background: 'rgba(10,16,30,.72)', zIndex: 1100, display: 'flex', alignItems: 'stretch', justifyContent: 'center', padding: '18px' }}
    >
      <div style={{ background: '#fff', borderRadius: '12px', width: 'min(1380px, 100%)', display: 'grid', gridTemplateColumns: 'minmax(520px, 1fr) 360px', overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,.26)' }}>
        <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', background: '#F8F7F4' }}>
          <div style={{ background: NAVY, color: '#fff', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '14px' }}>
            <div>
              <div style={{ color: GOLD, fontFamily: '"DM Mono", monospace', fontSize: '12px', fontWeight: 700 }}>{art.order_number}</div>
              <div style={{ fontWeight: 700, fontSize: '16px' }}>Artwork Studio / {art.product_name}</div>
            </div>
            <button onClick={onClose} disabled={busy} style={{ background: 'rgba(255,255,255,.1)', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 12px', cursor: busy ? 'not-allowed' : 'pointer' }}>Close</button>
          </div>

          <div style={{ padding: '18px', flex: 1, minHeight: 0, overflow: 'auto' }}>
            <div
              ref={stageRef}
              style={{ position: 'relative', width: '100%', maxWidth: '900px', aspectRatio: '4 / 3', margin: '0 auto', background: '#fff', border: '1px solid #E0DDD7', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 10px 28px rgba(27,42,74,.08)' }}
            >
              {productUrl ? (
                <img src={productUrl} alt={art.product_name} style={{ position: 'absolute', inset: '5%', width: '90%', height: '78%', objectFit: 'contain', pointerEvents: 'none' }} />
              ) : (
                <div style={{ position: 'absolute', inset: '14% 12% 24%', border: '2px dashed #C8C4BC', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7A7570', textAlign: 'center', padding: '24px' }}>
                  Upload or provide a product image to place the logo.
                </div>
              )}

              {logoUrl && (
                <div
                  onPointerDown={startDrag}
                  onPointerMove={moveDrag}
                  onPointerUp={endDrag}
                  onPointerCancel={endDrag}
                  style={{ position: 'absolute', left: `${logo.x}%`, top: `${logo.y}%`, width: `${logo.w}%`, transform: 'translate(-50%, -50%)', cursor: 'move', border: '1.5px solid rgba(201,169,110,.85)', borderRadius: '4px', padding: '3px', background: 'rgba(255,255,255,.04)', touchAction: 'none' }}
                >
                  <img src={logoUrl} alt="Customer logo" draggable={false} style={{ width: '100%', display: 'block', pointerEvents: 'none' }} />
                  <span style={{ position: 'absolute', right: '-8px', bottom: '-8px', width: '14px', height: '14px', borderRadius: '50%', background: GOLD, border: '2px solid #fff' }} />
                </div>
              )}

              <div style={{ position: 'absolute', left: '18px', bottom: '16px', color: '#7A7570', fontSize: '12px', background: 'rgba(255,255,255,.9)', padding: '8px 10px', borderRadius: '6px', border: '1px solid #E0DDD7' }}>
                Drag logo on canvas. Use controls for exact size.
              </div>
            </div>

            {previewUrl && (
              <div style={{ maxWidth: '900px', margin: '14px auto 0', background: '#fff', border: '1px solid #E0DDD7', borderRadius: '8px', padding: '12px' }}>
                <div style={{ fontSize: '12px', color: '#7A7570', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '.06em' }}>Generated Proof Preview</div>
                <img src={previewUrl} alt="Generated mockup proof" style={{ width: '100%', maxHeight: '260px', objectFit: 'contain', background: '#F8F7F4', borderRadius: '6px' }} />
              </div>
            )}
          </div>
        </div>

        <aside style={{ padding: '18px', overflow: 'auto', borderLeft: '1px solid #E0DDD7' }}>
          <h2 style={{ margin: '0 0 4px', fontSize: '20px', color: NAVY }}>Proof Details</h2>
          <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#7A7570' }}>{art.customer_name} / {art.customer_email}</p>

          {error && (
            <div style={{ background: '#FEF2F2', color: '#991B1B', border: '1px solid #FCA5A5', borderRadius: '8px', padding: '10px 12px', fontSize: '13px', marginBottom: '14px', lineHeight: 1.5 }}>
              {error}
            </div>
          )}

          <ControlGroup title="Artwork Assets">
            <AssetRow label="Logo" url={art.logo_url} />
            <AssetRow label="Product" url={art.product_image_url} />
            <label style={labelStyle}>
              Product image override
              <input type="file" accept="image/*" onChange={(event) => handleProductFile(event.target.files?.[0])} style={{ marginTop: '7px', width: '100%' }} />
            </label>
          </ControlGroup>

          <ControlGroup title="Logo Placement">
            <Slider label="Horizontal" value={logo.x} min={5} max={95} onChange={(value) => updateLogo({ x: value })} />
            <Slider label="Vertical" value={logo.y} min={5} max={95} onChange={(value) => updateLogo({ y: value })} />
            <Slider label="Logo Width" value={logo.w} min={5} max={65} onChange={(value) => updateLogo({ w: value })} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginTop: '8px' }}>
              {[
                ['Top', { x: 50, y: 28 }],
                ['Center', { x: 50, y: 50 }],
                ['Bottom', { x: 50, y: 70 }],
              ].map(([label, pos]) => (
                <button key={label} onClick={() => updateLogo(pos)} style={smallButtonStyle}>{label}</button>
              ))}
            </div>
          </ControlGroup>

          <ControlGroup title="Production Notes">
            <SelectControl label="Decoration method" value={printMethod} onChange={setPrintMethod} options={['Screen Print', 'Pad Print', 'Digital Print', 'Laser Engraving', 'Embroidery', 'Sublimation']} />
            <SelectControl label="Print position" value={printPosition} onChange={setPrintPosition} options={['Front', 'Back', 'Left Side', 'Right Side', 'Lid', 'Sleeve', 'Pocket', 'Custom']} />
            <label style={labelStyle}>
              Print size
              <input value={printSize} onChange={(event) => setPrintSize(event.target.value)} style={inputStyle} />
            </label>
            <label style={labelStyle}>
              Internal note on proof
              <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={3} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.45 }} placeholder="Optional short proof note" />
            </label>
          </ControlGroup>

          <div style={{ display: 'grid', gap: '8px', marginTop: '16px' }}>
            <button onClick={refreshPreview} disabled={busy} style={{ ...primaryButtonStyle, background: NAVY }}>
              {busy ? 'Working...' : 'Generate Preview'}
            </button>
            <button onClick={downloadPng} disabled={busy} style={{ ...secondaryButtonStyle }}>
              Download PNG
            </button>
            <button onClick={sendToCustomer} disabled={busy} style={{ ...primaryButtonStyle, background: GOLD }}>
              {busy ? 'Sending...' : 'Send Proof to Customer'}
            </button>
          </div>

          <div style={{ marginTop: '14px', fontSize: '12px', color: '#7A7570', lineHeight: 1.55 }}>
            This sends through the existing approval link and email flow. Customer can approve or request changes from the same page.
          </div>
        </aside>
      </div>
    </div>
  );
}

function ControlGroup({ title, children }) {
  return (
    <section style={{ borderTop: '1px solid #F0EEED', paddingTop: '14px', marginTop: '14px' }}>
      <h3 style={{ margin: '0 0 10px', fontSize: '12px', color: '#7A7570', textTransform: 'uppercase', letterSpacing: '.06em' }}>{title}</h3>
      <div style={{ display: 'grid', gap: '10px' }}>{children}</div>
    </section>
  );
}

function AssetRow({ label, url }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', alignItems: 'center', fontSize: '13px' }}>
      <span style={{ color: '#7A7570' }}>{label}</span>
      {url ? (
        <a href={url} target="_blank" rel="noreferrer" style={{ color: GOLD, fontWeight: 700, textDecoration: 'none' }}>Open</a>
      ) : (
        <span style={{ color: '#B0AAA3' }}>Missing</span>
      )}
    </div>
  );
}

function Slider({ label, value, min, max, onChange }) {
  return (
    <label style={labelStyle}>
      <span style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
        <span>{label}</span>
        <strong style={{ color: NAVY }}>{Math.round(value)}%</strong>
      </span>
      <input type="range" min={min} max={max} value={value} onChange={(event) => onChange(Number(event.target.value))} style={{ width: '100%', marginTop: '6px' }} />
    </label>
  );
}

function SelectControl({ label, value, onChange, options }) {
  return (
    <label style={labelStyle}>
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)} style={inputStyle}>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

const labelStyle = {
  display: 'block',
  fontSize: '12px',
  color: '#7A7570',
  fontWeight: 700,
};

const inputStyle = {
  display: 'block',
  width: '100%',
  marginTop: '6px',
  border: '1.5px solid #E0DDD7',
  borderRadius: '7px',
  padding: '9px 10px',
  boxSizing: 'border-box',
  fontFamily: '"DM Sans", sans-serif',
  color: NAVY,
  background: '#fff',
};

const smallButtonStyle = {
  background: '#fff',
  color: NAVY,
  border: '1px solid #E0DDD7',
  borderRadius: '6px',
  padding: '7px 8px',
  fontSize: '12px',
  fontWeight: 700,
  cursor: 'pointer',
};

const primaryButtonStyle = {
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  padding: '12px 14px',
  fontSize: '14px',
  fontWeight: 800,
  cursor: 'pointer',
  fontFamily: '"DM Sans", sans-serif',
};

const secondaryButtonStyle = {
  background: '#fff',
  color: NAVY,
  border: '1.5px solid #E0DDD7',
  borderRadius: '8px',
  padding: '11px 14px',
  fontSize: '14px',
  fontWeight: 800,
  cursor: 'pointer',
  fontFamily: '"DM Sans", sans-serif',
};

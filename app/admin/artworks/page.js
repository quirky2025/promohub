'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductImg from '@/components/ProductImg';
import { displayThumb, uploadImage } from '@/lib/imageHost';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';

const STATUS_COLORS = {
  awaiting_logo: { bg: '#FEF3C7', text: '#92400E', label: 'Awaiting Logo' },
  logo_received: { bg: '#DBEAFE', text: '#1E40AF', label: 'Logo Received' },
  mockup_sent: { bg: '#E0E7FF', text: '#3730A3', label: 'Mockup Sent' },
  changes_requested: { bg: '#FEE2E2', text: '#991B1B', label: 'Changes Requested' },
  approved: { bg: '#D1FAE5', text: '#065F46', label: 'Approved' },
};

// Thumbnail transform centralised in lib/imageHost.js (one place to change
// when the image host changes).
const toDisplayUrl = displayThumb;

export default function AdminArtworksPage() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [mockupFile, setMockupFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState('');
  const [logoUploading, setLogoUploading] = useState(false);
  // auto proof generator
  const [genStock, setGenStock] = useState('');
  const [genColour, setGenColour] = useState('');
  const [genPrintColour, setGenPrintColour] = useState('');
  const [genPms, setGenPms] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState('');

  useEffect(() => {
    loadArtworks();
  }, [filter]);

  // reset the auto-proof form whenever a different artwork is opened
  useEffect(() => {
    setGeneratedUrl('');
    setGenStock(selected?.stock_code || '');
    setGenColour(''); setGenPrintColour(''); setGenPms('');
  }, [selected]);

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
      // Image → hosted via centralised uploader (lib/imageHost.js)
      mockupUrl = (await uploadImage(mockupFile))?.logo_url;
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

  async function uploadCustomerLogo(file) {
    if (!file || !selected) return;
    setLogoUploading(true);
    try {
      const up = await uploadImage(file);
      if (!up || !up.logo_url) { alert('Upload failed'); setLogoUploading(false); return; }
      const res = await fetch('/api/admin/artworks/set-logo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: selected.token, logoUrl: up.logo_url, logoPngUrl: up.logo_png_url }),
      });
      if (!res.ok) { alert('Save failed'); setLogoUploading(false); return; }
      setSelected({ ...selected, logo_url: up.logo_url, logo_png_url: up.logo_png_url, status: 'logo_received' });
      setSuccess('Customer logo uploaded.');
      loadArtworks();
    } catch (e) {
      alert('Error: ' + e.message);
    }
    setLogoUploading(false);
  }

  async function generateProof() {
    if (!selected) return;
    setGenerating(true);
    setSuccess('');
    try {
      const res = await fetch('/api/admin/artworks/generate-proof', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: selected.token,
          stockCode: genStock,
          productColour: genColour,
          printColour: genPrintColour,
          pms: genPms,
        }),
      });
      const data = await res.json();
      if (data.error === 'no_template') {
        alert('No template saved for stock code "' + data.stockCode + '". Add one first (download the Trends template, save it as a product template). Auto-generate works once the template exists.');
      } else if (data.error === 'no_stock_code') {
        alert('Please enter the product stock code first.');
      } else if (!res.ok || data.error) {
        alert('Generate failed: ' + (data.error || 'unknown'));
      } else {
        setGeneratedUrl(data.url);
        setSuccess('Proof generated - preview it, then send to the customer.');
      }
    } catch (e) {
      alert('Generate failed: ' + e.message);
    }
    setGenerating(false);
  }

  async function sendGenerated() {
    if (!generatedUrl || !selected) return;
    setUploading(true);
    const res = await fetch('/api/admin/artworks/send-mockup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: selected.token, mockupUrl: generatedUrl }),
    });
    if (res.ok) {
      setSuccess('Proof sent to ' + selected.customer_email + '!');
      setSelected(null);
      setGeneratedUrl('');
      loadArtworks();
    } else {
      alert('Send failed');
    }
    setUploading(false);
  }

  async function resendUploadLink(art) {
    if (!confirm(`Resend the "upload your logo" link to ${art.customer_email}?`)) return;
    const res = await fetch('/api/admin/artworks/send-upload-link', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: art.token }) });
    if (res.ok) { alert(`Upload link resent to ${art.customer_email} ✅`); }
    else { const d = await res.json().catch(() => ({})); alert('Failed: ' + (d.error || 'unknown')); }
  }

  function getActionButton(art) {
    if (art.status === 'awaiting_logo') {
      return (
        <button onClick={() => resendUploadLink(art)}
          style={{ background: '#fff', color: NAVY, border: `1.5px solid ${NAVY}`, borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', whiteSpace: 'nowrap' }}>
          ✉ Resend upload link
        </button>
      );
    }
    if (art.status === 'logo_received') {
      return (
        <button onClick={() => { setSelected(art); setMockupFile(null); setSuccess(''); }}
          style={{ background: GOLD, color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', whiteSpace: 'nowrap' }}>
          Upload Mockup
        </button>
      );
    }
    if (art.status === 'mockup_sent') {
      return (
        <button onClick={() => { setSelected(art); setMockupFile(null); setSuccess(''); }}
          style={{ background: '#fff', color: NAVY, border: `1.5px solid ${NAVY}`, borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', whiteSpace: 'nowrap' }}>
          Upload New Version
        </button>
      );
    }
    if (art.status === 'changes_requested') {
      return (
        <button onClick={() => { setSelected(art); setMockupFile(null); setSuccess(''); }}
          style={{ background: '#991B1B', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', whiteSpace: 'nowrap' }}>
          Upload Revised Mockup
        </button>
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
            {artworks.map(art => (
              <div key={art.id} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E0DDD7', padding: '20px 24px' }}>
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
                      <ProductImg src={(art.logo_png_url || art.logo_url)} size="thumb" alt="Logo" style={{ width: '80px', height: '80px', objectFit: 'contain', border: '1px solid #E0DDD7', borderRadius: '8px', padding: '4px', background: '#fff' }} />
                      <div style={{ marginTop: '4px' }}>
                        <a href={art.logo_url} target="_blank" rel="noreferrer" style={{ fontSize: '11px', color: GOLD, textDecoration: 'none' }}>Download</a>
                      </div>
                    </div>
                  )}

                  {art.mockup_url && (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '11px', color: '#7A7570', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Mockup</div>
                      {/\.pdf(\?|$)/i.test(art.mockup_url) ? (
                        <a href={art.mockup_url} target="_blank" rel="noreferrer" title="Open mockup" style={{ display: 'block', width: '100px', height: '120px', margin: '0 auto', border: '1px solid #E0DDD7', borderRadius: '8px', overflow: 'hidden', background: '#fff' }}>
                          <iframe src={`${art.mockup_url}#toolbar=0&navpanes=0&view=FitH`} title="Mockup" style={{ width: '100%', height: '100%', border: 'none', pointerEvents: 'none' }} />
                        </a>
                      ) : (
                        <ProductImg src={toDisplayUrl(art.mockup_url)} size="thumb" alt="Mockup" style={{ width: '80px', height: '80px', objectFit: 'contain', border: '1px solid #E0DDD7', borderRadius: '8px', padding: '4px', background: '#fff' }} />
                      )}
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
            ))}
          </div>
        )}
      </div>

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
                  <ProductImg src={(selected.logo_png_url || selected.logo_url)} size="thumb" eager alt="Logo" style={{ width: '60px', height: '60px', objectFit: 'contain', border: '1px solid #E0DDD7', borderRadius: '6px', padding: '4px' }} />
                  <a href={selected.logo_url} target="_blank" rel="noreferrer" style={{ fontSize: '13px', color: GOLD, textDecoration: 'none', fontWeight: 600 }}>
                    Download Logo →
                  </a>
                </div>
              </div>
            )}

            {/* Admin: upload / replace customer logo (e.g. emailed to us) */}
            <div style={{ marginBottom: '16px' }}>
              <div onClick={() => document.getElementById('cust-logo-upload').click()}
                style={{ border: '1.5px dashed #C8C4BC', borderRadius: '10px', padding: '14px', textAlign: 'center', cursor: 'pointer', background: '#ffffff', fontSize: '13px', color: NAVY, fontWeight: 600, fontFamily: '"DM Sans", sans-serif' }}>
                <input id="cust-logo-upload" type="file" accept=".ai,.eps,.pdf,.svg,image/*" style={{ display: 'none' }}
                  onChange={e => { if (e.target.files[0]) uploadCustomerLogo(e.target.files[0]); }} />
                {logoUploading ? 'Uploading & converting…' : (selected.logo_url ? '↻ Replace customer logo' : '⬆ Upload customer logo (AI / EPS / PDF / SVG)')}
              </div>
            </div>

            {/* Auto-generate proof */}
            <div style={{ border: '1.5px solid ' + GOLD, borderRadius: '10px', padding: '16px', background: '#FFFBF4', marginBottom: '16px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: NAVY, marginBottom: '10px' }}>Generate proof automatically</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                <input value={genStock} onChange={e => setGenStock(e.target.value)} placeholder="Stock code (e.g. 128027)"
                  style={{ padding: '8px 10px', border: '1px solid #E0DDD7', borderRadius: '6px', fontSize: '13px', fontFamily: '"DM Sans", sans-serif' }} />
                <input value={genColour} onChange={e => setGenColour(e.target.value)} placeholder="Product colour (e.g. Black)"
                  style={{ padding: '8px 10px', border: '1px solid #E0DDD7', borderRadius: '6px', fontSize: '13px', fontFamily: '"DM Sans", sans-serif' }} />
                <input value={genPrintColour} onChange={e => setGenPrintColour(e.target.value)} placeholder="Print colour (e.g. White)"
                  style={{ padding: '8px 10px', border: '1px solid #E0DDD7', borderRadius: '6px', fontSize: '13px', fontFamily: '"DM Sans", sans-serif' }} />
                <input value={genPms} onChange={e => setGenPms(e.target.value)} placeholder="PMS # (optional)"
                  style={{ padding: '8px 10px', border: '1px solid #E0DDD7', borderRadius: '6px', fontSize: '13px', fontFamily: '"DM Sans", sans-serif' }} />
              </div>
              <button onClick={generateProof} disabled={generating || !selected?.logo_url}
                style={{ width: '100%', background: !selected?.logo_url ? '#C8C4BC' : NAVY, color: '#fff', border: 'none', borderRadius: '8px', padding: '10px', fontSize: '14px', fontWeight: 700, cursor: generating ? 'wait' : 'pointer', fontFamily: '"DM Sans", sans-serif' }}>
                {generating ? 'Generating...' : 'Generate Proof'}
              </button>
              {generatedUrl && (
                <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'space-between' }}>
                  <a href={generatedUrl} target="_blank" rel="noreferrer" style={{ fontSize: '13px', color: GOLD, fontWeight: 600, textDecoration: 'none' }}>Preview generated proof</a>
                  <button onClick={sendGenerated} disabled={uploading}
                    style={{ background: GOLD, color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}>
                    {uploading ? 'Sending...' : 'Send this proof'}
                  </button>
                </div>
              )}
            </div>

            <div style={{ textAlign: 'center', fontSize: '12px', color: '#9CA3AF', margin: '0 0 14px' }}>- or upload a mockup manually -</div>

            <div onClick={() => document.getElementById('mockup-upload').click()}
              style={{ border: `2px dashed ${mockupFile ? GOLD : '#C8C4BC'}`, borderRadius: '10px', padding: '32px', textAlign: 'center', cursor: 'pointer', background: mockupFile ? '#FFFBF4' : '#ffffff', marginBottom: '20px' }}>
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
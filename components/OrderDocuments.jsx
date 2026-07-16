'use client';

import { useEffect, useState, useRef } from 'react';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';

const TYPES = [
  { key: 'factory_po',       label: '工厂 PO' },
  { key: 'factory_invoice',  label: '工厂发票' },
  { key: 'payment_proof',    label: '付款凭证' },
  { key: 'product_image',    label: '产品图片' },
  { key: 'customer_invoice', label: '客户发票' },
  { key: 'other',            label: '其他' },
];
const LABEL = Object.fromEntries(TYPES.map((t) => [t.key, t.label]));
const isImage = (d) => (d.mime || '').startsWith('image/') || /\.(png|jpe?g|gif|webp|bmp)$/i.test(d.file_name || d.file_url || '');

export default function OrderDocuments({ orderNumber }) {
  const [docs, setDocs] = useState([]);
  const [docType, setDocType] = useState('factory_invoice');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileRef = useRef(null);

  useEffect(() => { if (orderNumber) load(); /* eslint-disable-next-line */ }, [orderNumber]);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/documents?orderNumber=${encodeURIComponent(orderNumber)}`, { cache: 'no-store' });
      const data = await res.json();
      setDocs(Array.isArray(data.documents) ? data.documents : []);
    } catch { setDocs([]); }
    setLoading(false);
  }

  async function upload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('orderNumber', orderNumber);
      fd.append('docType', docType);
      const res = await fetch('/api/admin/orders/documents', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) alert('上传失败:' + (data.error || 'unknown'));
      else load();
    } catch (err) { alert('上传失败:' + err.message); }
    setBusy(false);
    if (fileRef.current) fileRef.current.value = '';
  }

  async function del(id) {
    if (!confirm('删除这个凭证?')) return;
    await fetch(`/api/admin/orders/documents?id=${id}`, { method: 'DELETE' });
    load();
  }

  if (!orderNumber) return null;

  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: '#000', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>📎 单据 / 凭证</div>

      {/* upload */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', background: '#FDFBF7', border: '1.5px dashed #D8CFC0', borderRadius: 10, padding: 10, marginBottom: 12 }}>
        <select value={docType} onChange={(e) => setDocType(e.target.value)}
          style={{ padding: '7px 10px', border: '1.5px solid #E0DDD7', borderRadius: 8, fontSize: 13, color: '#000', background: '#fff' }}>
          {TYPES.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
        </select>
        <input ref={fileRef} type="file" onChange={upload} disabled={busy}
          style={{ fontSize: 13, color: '#000' }} />
        {busy && <span style={{ fontSize: 12, color: NAVY, fontWeight: 700 }}>上传中…</span>}
        <span style={{ fontSize: 11, color: '#000' }}>选类型 → 选文件即上传(图片/PDF 均可)</span>
      </div>

      {/* list */}
      {loading ? (
        <div style={{ fontSize: 12, color: '#000' }}>加载中…</div>
      ) : docs.length === 0 ? (
        <div style={{ fontSize: 12, color: '#000' }}>还没有凭证。上传工厂 PO、工厂发票、付款凭证、产品图片等。</div>
      ) : (
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {docs.map((d) => (
            <div key={d.id} style={{ width: 150, border: '1.5px solid #E0DDD7', borderRadius: 10, overflow: 'hidden', background: '#fff' }}>
              <a href={d.file_url} target="_blank" rel="noreferrer" style={{ display: 'block', textDecoration: 'none' }}>
                {isImage(d)
                  ? <img src={d.file_url} alt={d.title || d.file_name} style={{ width: '100%', height: 96, objectFit: 'cover', display: 'block' }} />
                  : <div style={{ height: 96, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F6F3EE', fontSize: 30 }}>📄</div>}
              </a>
              <div style={{ padding: '7px 9px' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: GOLD }}>{LABEL[d.doc_type] || d.doc_type}</div>
                <div style={{ fontSize: 11, color: '#000', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={d.title || d.file_name}>{d.title || d.file_name}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
                  <a href={d.file_url} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: NAVY, fontWeight: 700 }}>打开 →</a>
                  <button onClick={() => del(d.id)} style={{ background: 'none', border: 'none', color: '#991B1B', fontSize: 11, cursor: 'pointer', padding: 0 }}>删除</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

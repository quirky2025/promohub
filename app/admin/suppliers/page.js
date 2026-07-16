'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';
const BG = '#ffffff';

const NAV = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Orders', href: '/admin/orders' },
  { label: 'Artworks', href: '/admin/artworks' },
  { label: 'Invoices', href: '/admin/invoices' },
  { label: 'Production', href: '/admin/production' },
  { label: 'Suppliers', href: '/admin/suppliers' },
  { label: 'Products', href: '/admin/products' },
];

const TERMS = {
  prepaid: { bg: '#FEF3C7', color: '#92400E', label: 'Prepaid' },
  account: { bg: '#DBEAFE', color: '#1E40AF', label: 'Monthly account' },
};

export default function AdminSuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', contact_name: '', email: '', phone: '', payment_terms: 'prepaid', notes: '' });
  const [saving, setSaving] = useState(false);

  const EMPTY = { name: '', contact_name: '', email: '', phone: '', payment_terms: 'prepaid', notes: '' };
  function startAdd() { setEditingId(null); setForm(EMPTY); setAdding(true); }
  function startEdit(s) {
    setEditingId(s.id);
    setForm({ name: s.name || '', contact_name: s.contact_name || '', email: s.email || '', phone: s.phone || '', payment_terms: s.payment_terms || 'prepaid', notes: s.notes || '' });
    setAdding(true);
  }
  function closeModal() { setAdding(false); setEditingId(null); setForm(EMPTY); }

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/suppliers', { cache: 'no-store' });
      const data = await res.json();
      setSuppliers(Array.isArray(data.suppliers) ? data.suppliers : []);
    } catch { setSuppliers([]); }
    setLoading(false);
  }

  async function save() {
    if (!form.name.trim()) return;
    setSaving(true);
    const res = await fetch('/api/admin/suppliers', {
      method: editingId ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingId ? { id: editingId, ...form } : form),
    });
    setSaving(false);
    if (!res.ok) { alert('Failed'); return; }
    closeModal();
    load();
  }

  return (
    <div style={{ fontFamily: '"DM Sans", sans-serif', background: '#fff', minHeight: '100vh' }}>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '28px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '30px', fontWeight: 600, color: NAVY, margin: 0 }}>Suppliers</h1>
          <button onClick={startAdd} style={{ background: GOLD, color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>+ Add supplier</button>
        </div>
        <p style={{ fontSize: '13px', color: '#7A7570', margin: '0 0 20px' }}>Local-stock suppliers (Trends etc.). Mark each as <strong>Prepaid</strong> or <strong>Monthly account</strong> — shown when you pay them.</p>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#7A7570' }}>Loading...</div>
        ) : suppliers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px', color: '#7A7570', border: '1px solid #E0DDD7', borderRadius: '12px' }}>No suppliers yet — add your first.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #E0DDD7' }}>
                {['Supplier', 'Contact', 'Email', 'Phone', 'Terms', ''].map(h => (
                  <th key={h} style={{ padding: '12px 14px', textAlign: 'left', color: '#7A7570', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {suppliers.map((s, i) => {
                const t = TERMS[s.payment_terms] || TERMS.prepaid;
                return (
                  <tr key={s.id} style={{ background: i % 2 === 0 ? '#fff' : BG, borderBottom: '1px solid #F0EEED' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: NAVY }}>{s.name}</td>
                    <td style={{ padding: '12px 14px', color: '#5A5550' }}>{s.contact_name || '—'}</td>
                    <td style={{ padding: '12px 14px', color: '#5A5550' }}>{s.email || '—'}</td>
                    <td style={{ padding: '12px 14px', color: '#5A5550' }}>{s.phone || '—'}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ background: t.bg, color: t.color, fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px' }}>{t.label}</span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <button onClick={() => startEdit(s)} style={{ background: 'none', border: '1px solid #E0DDD7', borderRadius: '6px', padding: '4px 12px', fontSize: '12px', fontWeight: 600, color: NAVY, cursor: 'pointer' }}>Edit</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {adding && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', maxWidth: '420px', width: '100%' }}>
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '22px', color: NAVY, margin: '0 0 16px' }}>{editingId ? 'Edit supplier' : 'Add supplier'}</h2>
            {[['name', 'Name *'], ['contact_name', 'Contact name'], ['email', 'Email'], ['phone', 'Phone']].map(([k, label]) => (
              <div key={k} style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: NAVY, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</label>
                <input value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E0DDD7', borderRadius: '8px', fontSize: '14px', margin: '6px 0 0', boxSizing: 'border-box' }} />
              </div>
            ))}
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, color: NAVY, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Payment terms</label>
              <select value={form.payment_terms} onChange={e => setForm({ ...form, payment_terms: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E0DDD7', borderRadius: '8px', fontSize: '14px', margin: '6px 0 0', boxSizing: 'border-box', background: '#fff' }}>
                <option value="prepaid">Prepaid (pay before production)</option>
                <option value="account">Monthly account (pay on statement)</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <button onClick={save} disabled={saving || !form.name.trim()}
                style={{ flex: 1, background: !form.name.trim() ? '#C8C4BC' : '#2D6A4F', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
                {saving ? 'Saving...' : (editingId ? 'Save changes' : 'Save supplier')}
              </button>
              <button onClick={closeModal}
                style={{ background: '#fff', color: '#7A7570', border: '1.5px solid #E0DDD7', borderRadius: '8px', padding: '12px 18px', fontSize: '14px', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

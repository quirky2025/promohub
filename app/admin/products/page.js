'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';

const CATEGORIES = [
  'Bags', 'Drinkware', 'Stationery', 'Technology', 'Apparel',
  'Headwear', 'Lifestyle', 'outdoor', 'Health & Wellness', 'Kids',
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [editing, setEditing] = useState(null); // product being edited
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  const loadProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (categoryFilter) params.set('category', categoryFilter);
    const res = await fetch(`/api/admin/products?${params}`);
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [search, categoryFilter]);

  useEffect(() => {
    const t = setTimeout(loadProducts, 300);
    return () => clearTimeout(t);
  }, [loadProducts]);

  async function saveProduct() {
    if (!editing) return;
    setSaving(true);
    const res = await fetch('/api/admin/products', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editing),
    });
    if (res.ok) {
      setSuccess('Saved!');
      setEditing(null);
      loadProducts();
      setTimeout(() => setSuccess(''), 3000);
    }
    setSaving(false);
  }

  function startEdit(product) {
    setEditing({ ...product });
    setSuccess('');
  }

  function updateField(field, value) {
    setEditing(prev => ({ ...prev, [field]: value }));
  }

  return (
    <div style={{ background: '#F8F7F4', minHeight: '100vh', fontFamily: '"DM Sans", sans-serif' }}>
      {/* Nav */}
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
              <Link key={item.href} href={item.href} style={{ color: item.href === '/admin/products' ? '#fff' : 'rgba(255,255,255,0.7)', textDecoration: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: item.href === '/admin/products' ? 700 : 500, background: item.href === '/admin/products' ? 'rgba(255,255,255,0.1)' : 'none' }}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <Link href="/admin/login" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '13px' }}>Logout</Link>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '32px', fontWeight: 600, color: NAVY, margin: 0 }}>
            Product Management
          </h1>
          {success && (
            <div style={{ background: '#D1FAE5', color: '#065F46', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 600 }}>
              ✅ {success}
            </div>
          )}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, padding: '10px 16px', border: '1.5px solid #E0DDD7', borderRadius: '8px', fontSize: '14px', fontFamily: '"DM Sans", sans-serif', outline: 'none' }}
          />
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            style={{ padding: '10px 16px', border: '1.5px solid #E0DDD7', borderRadius: '8px', fontSize: '14px', fontFamily: '"DM Sans", sans-serif', outline: 'none', background: '#fff' }}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Products Table */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#7A7570' }}>Loading...</div>
        ) : (
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E0DDD7', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#F8F7F4', borderBottom: '1px solid #E0DDD7' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: NAVY, fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Product</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: NAVY, fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Category</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: NAVY, fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Subcategory</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: NAVY, fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Brand</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: NAVY, fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Collection</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', color: NAVY, fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Eco</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', color: NAVY, fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>New</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', color: NAVY, fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Sale</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: NAVY, fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, i) => (
                  <tr key={product.id} style={{ borderBottom: '1px solid #F0EEED', background: i % 2 === 0 ? '#fff' : '#FAFAF9' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 600, color: NAVY, marginBottom: '2px' }}>{product.name}</div>
                      <div style={{ fontSize: '11px', color: '#9CA3AF', fontFamily: '"DM Mono", monospace' }}>{product.supplier_sku}</div>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#7A7570' }}>{product.category || '—'}</td>
                    <td style={{ padding: '12px 16px', color: '#7A7570' }}>{product.subcategory || '—'}</td>
                    <td style={{ padding: '12px 16px', color: '#7A7570' }}>{product.brand || '—'}</td>
                    <td style={{ padding: '12px 16px', color: '#7A7570' }}>{product.collection || '—'}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>{product.is_eco ? '🌿' : '—'}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>{product.is_new_arrival ? '✨' : '—'}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>{product.is_sale ? '🏷️' : '—'}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <button
                        onClick={() => startEdit(product)}
                        style={{ background: GOLD, color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 14px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}>
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {products.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', color: '#7A7570' }}>No products found</div>
            )}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editing && (
        <div onClick={e => e.target === e.currentTarget && setEditing(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '24px', color: NAVY, margin: '0 0 4px' }}>Edit Product</h2>
            <p style={{ fontSize: '13px', color: '#7A7570', margin: '0 0 24px' }}>{editing.name}</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              {/* Category */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: NAVY, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Category</label>
                <select value={editing.category || ''} onChange={e => updateField('category', e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E0DDD7', borderRadius: '8px', fontSize: '14px', fontFamily: '"DM Sans", sans-serif', outline: 'none' }}>
                  <option value="">Select...</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Subcategory */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: NAVY, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Subcategory</label>
                <input type="text" value={editing.subcategory || ''} onChange={e => updateField('subcategory', e.target.value)}
                  placeholder="e.g. Backpacks"
                  style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E0DDD7', borderRadius: '8px', fontSize: '14px', fontFamily: '"DM Sans", sans-serif', outline: 'none', boxSizing: 'border-box' }} />
              </div>

              {/* Brand */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: NAVY, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Brand</label>
                <input type="text" value={editing.brand || ''} onChange={e => updateField('brand', e.target.value)}
                  placeholder="e.g. Titleist"
                  style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E0DDD7', borderRadius: '8px', fontSize: '14px', fontFamily: '"DM Sans", sans-serif', outline: 'none', boxSizing: 'border-box' }} />
              </div>

              {/* Collection */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: NAVY, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Collection</label>
                <input type="text" value={editing.collection || ''} onChange={e => updateField('collection', e.target.value)}
                  placeholder="e.g. Winter Essentials"
                  style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E0DDD7', borderRadius: '8px', fontSize: '14px', fontFamily: '"DM Sans", sans-serif', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            </div>

            {/* Toggles */}
            <div style={{ display: 'flex', gap: '24px', marginBottom: '24px', padding: '16px', background: '#F8F7F4', borderRadius: '10px' }}>
              {[
                { field: 'is_eco', label: '🌿 Eco Product' },
                { field: 'is_new_arrival', label: '✨ New Arrival' },
                { field: 'is_sale', label: '🏷️ On Sale' },
              ].map(({ field, label }) => (
                <label key={field} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: NAVY }}>
                  <input type="checkbox" checked={!!editing[field]} onChange={e => updateField(field, e.target.checked)}
                    style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                  {label}
                </label>
              ))}
            </div>

            {/* SEO */}
            <div style={{ borderTop: '1px solid #E0DDD7', paddingTop: '20px', marginBottom: '24px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: NAVY, marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>SEO</div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: NAVY, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Meta Title <span style={{ color: '#9CA3AF', fontWeight: 400, textTransform: 'none' }}>(60 chars max)</span>
                </label>
                <input type="text" value={editing.meta_title || ''} onChange={e => updateField('meta_title', e.target.value)}
                  placeholder="e.g. Custom Printed Backpacks | QuirkyPromo Australia"
                  maxLength={60}
                  style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E0DDD7', borderRadius: '8px', fontSize: '14px', fontFamily: '"DM Sans", sans-serif', outline: 'none', boxSizing: 'border-box' }} />
                <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '4px', textAlign: 'right' }}>{(editing.meta_title || '').length}/60</div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: NAVY, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Meta Description <span style={{ color: '#9CA3AF', fontWeight: 400, textTransform: 'none' }}>(160 chars max)</span>
                </label>
                <textarea value={editing.meta_description || ''} onChange={e => updateField('meta_description', e.target.value)}
                  placeholder="e.g. Premium custom branded backpacks for corporate events and promotions. Low minimums, fast turnaround across Australia."
                  maxLength={160} rows={3}
                  style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E0DDD7', borderRadius: '8px', fontSize: '14px', fontFamily: '"DM Sans", sans-serif', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }} />
                <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '4px', textAlign: 'right' }}>{(editing.meta_description || '').length}/160</div>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: NAVY, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Image Alt Text</label>
                <input type="text" value={editing.alt_text || ''} onChange={e => updateField('alt_text', e.target.value)}
                  placeholder="e.g. Custom printed Aquinas backpack with company logo"
                  style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E0DDD7', borderRadius: '8px', fontSize: '14px', fontFamily: '"DM Sans", sans-serif', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={saveProduct} disabled={saving}
                style={{ flex: 1, background: GOLD, color: '#fff', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button onClick={() => setEditing(null)}
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

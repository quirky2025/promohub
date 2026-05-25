'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';

const CATEGORIES = [
  'Apparel', 'Bags', 'Business', 'Drinkware', 'Headwear',
  'Leisure', 'Packaging', 'Pens', 'Personal', 'Print', 'Promotion', 'Technology',
];

const ALL_SUBCATEGORIES = {
  'Apparel': ['Apparel Accessories', 'Jackets', 'Socks & Footwear', 'Sweatshirts'],
  'Bags': ['Backpacks', 'Cooler Bags', 'Crossbody & Belt Bags', 'Drawstring Bags', 'Duffle Bags', 'Jute Bags', 'Laptop Bags', 'Paper Bags', 'Satchel Bags', 'Tote Bags'],
  'Business': ['Highlighters', 'ID Holders', 'Lanyards', 'Note Pads', 'Notebooks', 'Stationery', 'Sticky Notes'],
  'Drinkware': ['Ceramic Mugs', 'Coffee Cups', 'Cups & Tumblers', 'Drink Bottles - Glass', 'Drink Bottles - Metal', 'Drink Bottles - Plastic', 'Drinkware Presentation', 'Flasks', 'Travel Mugs'],
  'Headwear': ['Beanies', 'Bucket Hats', 'Caps', 'Headwear Accessories', 'Headwear Express'],
  'Leisure': ['Camping & Outdoors', 'Chairs', 'Coasters', 'Games & Puzzles', 'Home & Living', 'Picnic & BBQ', 'Sport', 'Sunglasses', 'Tools', 'Towels', 'Travel', 'Umbrellas'],
  'Packaging': ['Gift Boxes', 'Packaging Accessories', 'Ribbons'],
  'Pens': ['Black Refill', 'Metal', 'Novelty', 'Paper', 'Plastic', 'Presentation', 'Refills'],
  'Personal': ['Candles & Diffusers', 'Hand Sanitiser', 'Lip Balms', 'Lotions & Sunscreens', 'Personal Care'],
  'Print': ['Pads & Planners', 'Signage'],
  'Promotion': ['Badges', 'Bottle Openers', 'Fidget Items', 'Key Rings', 'Pet Accessories', 'Promotional', 'Stress Items', 'Stubby & Can Holders', 'Wristbands'],
  'Technology': ['Charging Cables', 'Earbuds', 'Flash Drives', 'Headphones', 'Mouse Mats', 'Phone Wallets', 'Power Banks', 'Screen Cleaners', 'Sleeves & Cases', 'Speakers', 'Tech Accessories', 'USB Hubs', 'Wireless Chargers'],
};

const BRANDS = [
  'Archer', 'Blunt', 'BrandCraft', 'CamelBak', 'Cross', 'Frontier',
  'Impact Aware', 'Ingenio', 'Keepsake', 'Lamy', 'Luigi Bormioli',
  'Moleskine', 'Natura', 'Ocean Bottle', 'Osprey', 'Pierre Cardin',
  'Rollink', 'Skullcandy', "Sol's", 'Spice', 'Swiss Peak', 'Titleist',
  'Trendswear', 'WNSDY', 'XD Design',
];

const COLLECTIONS = [
  'Agriculture', 'Automotive', 'Children', 'Conference', 'Custom Shape',
  'Festivals & Events', 'Full Custom', 'Fundraising', 'Golf',
  'Health & Beauty', 'Hospitality', 'Logistics', 'Mailable Items',
  'Natural', 'NZ Made', 'Price Buster', 'Real Estate', 'Recycled',
  'Rest Homes', 'Safety', 'Sports & Fitness', 'Summer', 'Trades',
  'Tradeshows', 'Travel', 'Winter',
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [publishFilter, setPublishFilter] = useState('all');
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('classification');
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 50;

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setCurrentPage(1);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (categoryFilter) params.set('category', categoryFilter);
    if (publishFilter !== 'all') params.set('published', publishFilter === 'published' ? 'true' : 'false');
    const res = await fetch(`/api/admin/products?${params}`);
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [search, categoryFilter, publishFilter]);

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
    setActiveTab('classification');
    setSuccess('');
  }

  function updateField(field, value) {
    setEditing(prev => ({ ...prev, [field]: value }));
  }

  function getFeatures() {
    const f = editing?.features;
    if (!f) return [''];
    if (Array.isArray(f)) return f.length > 0 ? f : [''];
    return [''];
  }

  function updateFeature(index, value) {
    const features = getFeatures();
    const updated = [...features];
    updated[index] = value;
    updateField('features', updated);
  }

  function addFeature() {
    updateField('features', [...getFeatures(), '']);
  }

  function removeFeature(index) {
    const features = getFeatures();
    updateField('features', features.filter((_, i) => i !== index));
  }

  const inputStyle = {
    width: '100%', padding: '10px 12px', border: '1.5px solid #E0DDD7',
    borderRadius: '8px', fontSize: '14px', fontFamily: '"DM Sans", sans-serif',
    outline: 'none', boxSizing: 'border-box',
  };

  const labelStyle = {
    fontSize: '11px', fontWeight: 700, color: NAVY, display: 'block',
    marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em',
  };

  const publishedCount = products.filter(p => p.is_published).length;
  const unpublishedCount = products.filter(p => !p.is_published).length;

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
          <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '32px', fontWeight: 600, color: NAVY, margin: 0 }}>Product Management</h1>
          {success && (
            <div style={{ background: '#D1FAE5', color: '#065F46', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 600 }}>✅ {success}</div>
          )}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          <input type="text" placeholder="Search by name or SKU..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, padding: '10px 16px', border: '1.5px solid #E0DDD7', borderRadius: '8px', fontSize: '14px', fontFamily: '"DM Sans", sans-serif', outline: 'none' }} />
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
            style={{ padding: '10px 16px', border: '1.5px solid #E0DDD7', borderRadius: '8px', fontSize: '14px', fontFamily: '"DM Sans", sans-serif', outline: 'none', background: '#fff' }}>
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Publish filter tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          {[
            { id: 'all', label: `All (${products.length})` },
            { id: 'published', label: `✅ Published (${publishedCount})` },
            { id: 'unpublished', label: `⬜ Not Published (${unpublishedCount})` },
          ].map(f => (
            <button key={f.id} onClick={() => setPublishFilter(f.id)}
              style={{ padding: '6px 16px', borderRadius: '6px', border: '1.5px solid', borderColor: publishFilter === f.id ? NAVY : '#E0DDD7', background: publishFilter === f.id ? NAVY : '#fff', color: publishFilter === f.id ? '#fff' : '#7A7570', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Products Table */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#7A7570' }}>Loading...</div>
        ) : (
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E0DDD7', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#F8F7F4', borderBottom: '1px solid #E0DDD7' }}>
                  {['', 'Product', 'Category', 'Subcategory', 'Brand', 'Eco', 'New', 'Sale', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: ['Eco', 'New', 'Sale', ''].includes(h) ? 'center' : 'left', color: NAVY, fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE).map((product, i) => (
                  <tr key={product.id} style={{ borderBottom: '1px solid #F0EEED', background: i % 2 === 0 ? '#fff' : '#FAFAF9' }}>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <span title={product.is_published ? 'Published' : 'Not published'} style={{ fontSize: '16px' }}>
                        {product.is_published ? '✅' : '⬜'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 600, color: NAVY, marginBottom: '2px' }}>{product.name}</div>
                      <div style={{ fontSize: '11px', color: '#9CA3AF', fontFamily: '"DM Mono", monospace' }}>{product.supplier_sku}</div>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#7A7570' }}>{product.category || '—'}</td>
                    <td style={{ padding: '12px 16px', color: '#7A7570' }}>{product.subcategory || '—'}</td>
                    <td style={{ padding: '12px 16px', color: '#7A7570' }}>{product.brand || '—'}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>{product.is_eco ? '🌿' : '—'}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>{product.is_new_arrival ? '✨' : '—'}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>{product.is_sale ? '🏷️' : '—'}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <button onClick={() => startEdit(product)}
                        style={{ background: GOLD, color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 14px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}>
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {products.length === 0 && <div style={{ textAlign: 'center', padding: '40px', color: '#7A7570' }}>No products found</div>}
            {/* Pagination */}
            {products.length > PAGE_SIZE && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '24px', borderTop: '1px solid #E0DDD7' }}>
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                  style={{ padding: '8px 16px', border: '1.5px solid #E0DDD7', borderRadius: '6px', background: currentPage === 1 ? '#F8F7F4' : '#fff', color: currentPage === 1 ? '#B0AAA3' : NAVY, cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontFamily: '"DM Sans", sans-serif', fontSize: '13px', fontWeight: 600 }}>
                  ← Prev
                </button>
                <span style={{ fontSize: '13px', color: '#7A7570', fontFamily: '"DM Sans", sans-serif' }}>
                  Page {currentPage} of {Math.ceil(products.length / PAGE_SIZE)} ({products.length} products)
                </span>
                <button onClick={() => setCurrentPage(p => Math.min(Math.ceil(products.length / PAGE_SIZE), p + 1))} disabled={currentPage === Math.ceil(products.length / PAGE_SIZE)}
                  style={{ padding: '8px 16px', border: '1.5px solid #E0DDD7', borderRadius: '6px', background: currentPage === Math.ceil(products.length / PAGE_SIZE) ? '#F8F7F4' : '#fff', color: currentPage === Math.ceil(products.length / PAGE_SIZE) ? '#B0AAA3' : NAVY, cursor: currentPage === Math.ceil(products.length / PAGE_SIZE) ? 'not-allowed' : 'pointer', fontFamily: '"DM Sans", sans-serif', fontSize: '13px', fontWeight: 600 }}>
                  Next →
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editing && (
        <div onClick={e => e.target === e.currentTarget && setEditing(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', maxWidth: '700px', width: '100%', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>

            {/* Modal Header */}
            <div style={{ padding: '24px 32px 0', borderBottom: '1px solid #E0DDD7' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '22px', color: NAVY, margin: 0 }}>{editing.name}</h2>
                {/* Published toggle */}
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: editing.is_published ? '#065F46' : '#7A7570' }}>
                    {editing.is_published ? '✅ Published' : '⬜ Not Published'}
                  </span>
                  <div style={{ position: 'relative', width: '44px', height: '24px', cursor: 'pointer' }} onClick={() => updateField('is_published', !editing.is_published)}>
                    <div style={{ position: 'absolute', inset: 0, background: editing.is_published ? '#065F46' : '#C8C4BC', borderRadius: '12px', transition: 'background .2s' }} />
                    <div style={{ position: 'absolute', top: '3px', left: editing.is_published ? '23px' : '3px', width: '18px', height: '18px', background: '#fff', borderRadius: '50%', transition: 'left .2s', boxShadow: '0 1px 3px rgba(0,0,0,.2)' }} />
                  </div>
                </label>
              </div>
              {/* Tabs */}
              <div style={{ display: 'flex' }}>
                {[
                  { id: 'classification', label: 'Classification' },
                  { id: 'content', label: 'Content' },
                  { id: 'seo', label: 'SEO' },
                ].map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    style={{ padding: '8px 20px', border: 'none', borderBottom: activeTab === tab.id ? `2px solid ${GOLD}` : '2px solid transparent', background: 'none', fontSize: '13px', fontWeight: activeTab === tab.id ? 700 : 500, color: activeTab === tab.id ? NAVY : '#7A7570', cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px 32px', overflowY: 'auto', flex: 1 }}>

              {activeTab === 'classification' && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={labelStyle}>Category</label>
                      <select value={editing.category || ''} onChange={e => updateField('category', e.target.value)} style={inputStyle}>
                        <option value="">Select...</option>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Subcategory</label>
                      <select value={editing.subcategory || ''} onChange={e => updateField('subcategory', e.target.value)} style={inputStyle}>
                        <option value="">Select subcategory...</option>
                        {(ALL_SUBCATEGORIES[editing.category] || []).map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Brand</label>
                      <select value={editing.brand || ''} onChange={e => updateField('brand', e.target.value)} style={inputStyle}>
                        <option value="">No Brand</option>
                        {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Collection</label>
                      <select value={editing.collection || ''} onChange={e => updateField('collection', e.target.value)} style={inputStyle}>
                        <option value="">No Collection</option>
                        {COLLECTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={labelStyle}>Indent Type</label>
                    <select value={editing.indent_type || ''} onChange={e => updateField('indent_type', e.target.value || null)} style={inputStyle}>
                      <option value="">Stock (Standard)</option>
                      <option value="indent_air">✈️ Indent - Air</option>
                      <option value="indent_sea">🚢 Indent - Sea</option>
                    </select>
                    {editing.indent_type && (
                      <div style={{ marginTop: '8px', padding: '8px 12px', background: editing.indent_type === 'indent_air' ? '#FFF8E7' : '#EFF6FF', borderRadius: '6px', fontSize: '12px', color: editing.indent_type === 'indent_air' ? '#92400E' : '#1E40AF' }}>
                        {editing.indent_type === 'indent_air' ? '✈️ Air freight — approx. 25 working days lead time' : '🚢 Sea freight — approx. 45 working days lead time'}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '24px', padding: '16px', background: '#F8F7F4', borderRadius: '10px' }}>
                    {[
                      { field: 'is_eco', label: '🌿 Eco Product' },
                      { field: 'is_new_arrival', label: '✨ New Arrival' },
                      { field: 'is_sale', label: '🏷️ On Sale' },
                    ].map(({ field, label }) => (
                      <label key={field} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: NAVY }}>
                        <input type="checkbox" checked={!!editing[field]} onChange={e => updateField(field, e.target.checked)} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'content' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={labelStyle}>SEO Description <span style={{ color: '#9CA3AF', fontWeight: 400, textTransform: 'none' }}>(shown below product title)</span></label>
                    <textarea value={editing.seo_description || ''} onChange={e => updateField('seo_description', e.target.value)}
                      placeholder="Keep your brand cool and refreshing with our custom Canvas Cooler Bag..."
                      rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
                  </div>

                  <div>
                    <label style={labelStyle}>Features <span style={{ color: '#9CA3AF', fontWeight: 400, textTransform: 'none' }}>(bullet points)</span></label>
                    {getFeatures().map((feature, index) => (
                      <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                        <input type="text" value={feature} onChange={e => updateFeature(index, e.target.value)}
                          placeholder={`Feature ${index + 1}`} style={{ ...inputStyle, flex: 1 }} />
                        <button onClick={() => removeFeature(index)}
                          style={{ background: '#FEE2E2', color: '#991B1B', border: 'none', borderRadius: '6px', padding: '8px 12px', cursor: 'pointer', fontSize: '14px' }}>✕</button>
                      </div>
                    ))}
                    <button onClick={addFeature}
                      style={{ background: '#F8F7F4', color: NAVY, border: '1.5px dashed #C8C4BC', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', width: '100%' }}>
                      + Add Feature
                    </button>
                  </div>

                  <div style={{ borderTop: '1px solid #E0DDD7', paddingTop: '20px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: NAVY, marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Specifications</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={labelStyle}>Materials</label>
                        <input type="text" value={editing.materials || ''} onChange={e => updateField('materials', e.target.value)} placeholder="e.g. 100% Cotton Canvas" style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>Dimensions</label>
                        <input type="text" value={editing.dimensions || ''} onChange={e => updateField('dimensions', e.target.value)} placeholder="e.g. H 420mm x W 345mm" style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>Capacity</label>
                        <input type="text" value={editing.capacity || ''} onChange={e => updateField('capacity', e.target.value)} placeholder="e.g. 14L" style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>Packaging</label>
                        <input type="text" value={editing.packing || ''} onChange={e => updateField('packing', e.target.value)} placeholder="e.g. Loose Packed, 150pcs/ctn" style={inputStyle} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>Full Description <span style={{ color: '#9CA3AF', fontWeight: 400, textTransform: 'none' }}>(optional)</span></label>
                    <textarea value={editing.description || ''} onChange={e => updateField('description', e.target.value)}
                      placeholder="Detailed product description..." rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
                  </div>
                </div>
              )}

              {activeTab === 'seo' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>Meta Title <span style={{ color: '#9CA3AF', fontWeight: 400, textTransform: 'none' }}>(60 chars max)</span></label>
                    <input type="text" value={editing.meta_title || ''} onChange={e => updateField('meta_title', e.target.value)}
                      placeholder="e.g. Custom Canvas Cooler Bags | QuirkyPromo Australia" maxLength={60} style={inputStyle} />
                    <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '4px', textAlign: 'right' }}>{(editing.meta_title || '').length}/60</div>
                  </div>
                  <div>
                    <label style={labelStyle}>Meta Description <span style={{ color: '#9CA3AF', fontWeight: 400, textTransform: 'none' }}>(160 chars max)</span></label>
                    <textarea value={editing.meta_description || ''} onChange={e => updateField('meta_description', e.target.value)}
                      placeholder="e.g. Premium custom branded canvas cooler bags for corporate events..." maxLength={160} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
                    <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '4px', textAlign: 'right' }}>{(editing.meta_description || '').length}/160</div>
                  </div>
                  <div>
                    <label style={labelStyle}>Image Alt Text</label>
                    <input type="text" value={editing.alt_text || ''} onChange={e => updateField('alt_text', e.target.value)}
                      placeholder="e.g. Custom printed canvas cooler bag with company logo" style={inputStyle} />
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '16px 32px', borderTop: '1px solid #E0DDD7', display: 'flex', gap: '12px' }}>
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

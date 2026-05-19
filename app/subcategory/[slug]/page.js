'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';

export default function SubcategoryPage() {
  const { slug } = useParams();
  const subcategoryName = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState(null);

  const [minQty, setMinQty] = useState('');
  const [hasRush, setHasRush] = useState(false);
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select(`
          id, name, slug, category, subcategory,
          short_desc, min_qty, lead_time_days, has_rush, status,
          product_colours ( id, name, hex, images, sort_order ),
          pricing_tiers ( min_qty, max_qty, base_price, sort_order )
        `)
        .ilike('subcategory', subcategoryName)
        .eq('status', 'active')
        .order('name');

      if (!error && data) {
        setProducts(data);
        setFiltered(data);
      }
      setLoading(false);
    }
    fetchProducts();
  }, [slug]);

  useEffect(() => {
    let result = [...products];
    if (minQty) result = result.filter(p => p.min_qty <= parseInt(minQty));
    if (hasRush) result = result.filter(p => p.has_rush === true);
    if (sortBy === 'name') result.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === 'min_qty') result.sort((a, b) => a.min_qty - b.min_qty);
    if (sortBy === 'price') result.sort((a, b) => getLowestPrice(a) - getLowestPrice(b));
    setFiltered(result);
  }, [minQty, hasRush, sortBy, products]);

  function getFirstImage(product) {
    if (!product.product_colours?.length) return null;
    const sorted = [...product.product_colours].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    const imgs = sorted[0]?.images;
    if (!imgs) return null;
    const arr = Array.isArray(imgs) ? imgs : Object.values(imgs);
    return arr[0] || null;
  }

  function getLowestPrice(product) {
    if (!product.pricing_tiers?.length) return 0;
    const prices = product.pricing_tiers.map(t => parseFloat(t.base_price));
    return Math.min(...prices);
  }

  function getColours(product) {
    if (!product.product_colours?.length) return [];
    return [...product.product_colours]
      .filter(c => c.hex && c.name !== 'Default')
      .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
      .slice(0, 12);
  }

  function clearFilters() {
    setMinQty('');
    setHasRush(false);
    setSortBy('name');
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8F7F4' }}>

      {/* BREADCRUMB */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E0DDD7', padding: '12px 40px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', fontSize: '13px', color: '#7A7570', fontFamily: '"DM Sans", sans-serif' }}>
          <Link href="/" style={{ color: '#7A7570', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 8px' }}>›</span>
          <Link href="/products" style={{ color: '#7A7570', textDecoration: 'none' }}>All Products</Link>
          <span style={{ margin: '0 8px' }}>›</span>
          <span style={{ color: NAVY, fontWeight: 600 }}>{subcategoryName}</span>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 40px', display: 'flex', gap: '32px', alignItems: 'flex-start' }}>

        {/* LEFT FILTER PANEL */}
        <div style={{ width: '220px', flexShrink: 0, background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,.06)', position: 'sticky', top: '72px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '15px', fontWeight: 700, color: NAVY }}>Filters</span>
            <button onClick={clearFilters} style={{ fontSize: '12px', color: GOLD, background: 'none', border: 'none', cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', fontWeight: 600 }}>Clear all</button>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <div style={filterLabel}>Sort By</div>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={selectStyle}>
              <option value="name">Name A–Z</option>
              <option value="price">Price: Low to High</option>
              <option value="min_qty">Min Quantity</option>
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <div style={filterLabel}>Max Min. Quantity</div>
            <select value={minQty} onChange={e => setMinQty(e.target.value)} style={selectStyle}>
              <option value="">Any</option>
              <option value="25">Up to 25</option>
              <option value="50">Up to 50</option>
              <option value="100">Up to 100</option>
              <option value="250">Up to 250</option>
              <option value="500">Up to 500</option>
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input type="checkbox" checked={hasRush} onChange={e => setHasRush(e.target.checked)} style={{ width: '16px', height: '16px', accentColor: GOLD }} />
              <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '14px', color: '#1a1a1a' }}>Rush available</span>
            </label>
          </div>

          <div style={{ borderTop: '1px solid #E0DDD7', paddingTop: '16px', fontFamily: '"DM Sans", sans-serif', fontSize: '13px', color: '#7A7570' }}>
            {filtered.length} product{filtered.length !== 1 ? 's' : ''} found
          </div>
        </div>

        {/* RIGHT PRODUCT GRID */}
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '32px', color: NAVY, margin: 0, fontWeight: 600 }}>{subcategoryName}</h1>
            <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '14px', color: '#7A7570', margin: '6px 0 0' }}>{filtered.length} products</p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px', fontFamily: '"DM Sans", sans-serif', color: '#7A7570' }}>Loading products...</div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px', fontFamily: '"DM Sans", sans-serif', color: '#7A7570' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
              <div style={{ fontSize: '16px', fontWeight: 600, color: NAVY, marginBottom: '8px' }}>No products found</div>
              <button onClick={clearFilters} style={{ marginTop: '8px', background: GOLD, color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', fontWeight: 600 }}>Clear Filters</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
              {filtered.map(product => {
                const img = getFirstImage(product);
                const lowestPrice = getLowestPrice(product);
                const colours = getColours(product);
                const totalColours = product.product_colours?.filter(c => c.hex && c.name !== 'Default').length || 0;
                const extraColours = totalColours - 12;
                const isHovered = hoveredId === product.id;

                return (
                  <Link key={product.id} href={`/products/${product.slug}`} style={{ textDecoration: 'none' }}>
                    <div
                      onMouseEnter={() => setHoveredId(product.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      style={{
                        background: '#fff',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: isHovered ? '0 8px 24px rgba(0,0,0,.12)' : '0 2px 8px rgba(0,0,0,.06)',
                        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
                        transition: 'box-shadow .2s, transform .2s',
                        cursor: 'pointer',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      {/* IMAGE */}
                      <div style={{ height: '200px', background: '#F8F7F4', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                        {img ? (
                          <img src={img} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '12px' }} />
                        ) : (
                          <div style={{ fontSize: '40px', color: '#D0CCC8' }}>📦</div>
                        )}
                        {product.has_rush && (
                          <span style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '11px', background: GOLD, color: '#fff', padding: '3px 8px', borderRadius: '20px', fontFamily: '"DM Sans", sans-serif', fontWeight: 700 }}>RUSH</span>
                        )}
                      </div>

                      {/* INFO */}
                      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>

                        {/* PRODUCT NAME */}
                        <div style={{
                          fontFamily: '"DM Sans", sans-serif',
                          fontSize: '15px',
                          fontWeight: 600,
                          lineHeight: '1.4',
                          textAlign: 'center',
                          color: NAVY,
                          textDecoration: isHovered ? 'underline' : 'none',
                          textUnderlineOffset: '3px',
                          textDecorationColor: GOLD,
                          transition: 'text-decoration .15s',
                        }}>
                          {product.name}
                        </div>

                        {/* PRICE + MOQ */}
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', alignItems: 'flex-end' }}>
                          {lowestPrice > 0 && (
                            <div style={{ textAlign: 'center' }}>
                              <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '12px', color: '#7A7570', marginBottom: '2px' }}>As low as</div>
                              <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '19px', fontWeight: 400, color: GOLD }}>
                                ${lowestPrice.toFixed(2)}
                              </div>
                            </div>
                          )}
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '12px', color: '#7A7570', marginBottom: '2px' }}>Min Qty</div>
                            <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '19px', fontWeight: 400, color: NAVY }}>
                              {product.min_qty}
                            </div>
                          </div>
                        </div>

                        {/* COLOUR DOTS */}
                        {colours.length > 0 && (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', flexWrap: 'wrap' }}>
                            {colours.map(c => (
                              <div
                                key={c.id}
                                title={c.name}
                                style={{
                                  width: '18px', height: '18px', borderRadius: '50%',
                                  background: c.hex || '#ccc',
                                  border: '1.5px solid rgba(0,0,0,.1)',
                                  flexShrink: 0,
                                }}
                              />
                            ))}
                            {extraColours > 0 && (
                              <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '12px', color: '#7A7570', marginLeft: '2px' }}>+{extraColours}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const filterLabel = {
  fontFamily: '"DM Sans", sans-serif',
  fontSize: '11px',
  fontWeight: 700,
  color: NAVY,
  textTransform: 'uppercase',
  letterSpacing: '0.8px',
  marginBottom: '8px',
};

const selectStyle = {
  width: '100%',
  padding: '8px 12px',
  borderRadius: '8px',
  border: '1px solid #E0DDD7',
  fontFamily: '"DM Sans", sans-serif',
  fontSize: '13px',
  color: '#1a1a1a',
  background: '#fff',
  outline: 'none',
  cursor: 'pointer',
};
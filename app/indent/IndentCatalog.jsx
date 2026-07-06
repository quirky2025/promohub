// app/indent/IndentCatalog.jsx —— Air / Sea 两页共用的目录组件
'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { MARGIN } from '@/lib/pricing';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import QuoteModal from '@/components/QuoteModal';
import ProductImg from '@/components/ProductImg';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';
const PAGE_SIZE = 24;

const PRICE_RANGES = [
  { value: '', label: 'All Prices' },
  { value: '0-5', label: 'Under $5', test: p => p < 5 },
  { value: '5-10', label: '$5 – $10', test: p => p >= 5 && p < 10 },
  { value: '10-20', label: '$10 – $20', test: p => p >= 10 && p < 20 },
  { value: '20-50', label: '$20 – $50', test: p => p >= 20 && p < 50 },
  { value: '50+', label: '$50+', test: p => p >= 50 },
];

export default function IndentCatalog({ config }) {
  const [allProducts, setAllProducts] = useState([]);
  const [displayed, setDisplayed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState(null);
  const [page, setPage] = useState(0);
  const [quoteOpen, setQuoteOpen] = useState(false);

  const [categoryFilter, setCategoryFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data } = await supabase
        .from('products')
        .select('id, name, slug, category, subcategory, is_eco, min_qty, lead_time_days, is_published, product_colours(images, sort_order), pricing_tiers(base_price)')
        .eq('indent_type', config.indentType)
        .eq('is_published', true);
      if (data) setAllProducts(data);
      setLoading(false);
    }
    fetchData();
  }, [config.indentType]);

  function getLowestPrice(product) {
    if (!product.pricing_tiers?.length) return 0;
    return Math.min(...product.pricing_tiers.map(t => parseFloat(t.base_price))) * MARGIN;
  }

  function getFirstImage(product) {
    const sorted = [...(product.product_colours || [])].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    const imgs = sorted[0]?.images;
    const arr = Array.isArray(imgs) ? imgs : imgs ? Object.values(imgs) : [];
    return arr[0] || null;
  }

  // Category 选项(带数量)
  const categoryOptions = useMemo(() => {
    const counts = {};
    allProducts.forEach(p => {
      if (p.category) counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]); // 按数量多到少
  }, [allProducts]);

  const getFiltered = useCallback(() => {
    let result = [...allProducts];
    if (categoryFilter) result = result.filter(p => p.category === categoryFilter);
    if (priceFilter) {
      const range = PRICE_RANGES.find(r => r.value === priceFilter);
      if (range?.test) result = result.filter(p => range.test(getLowestPrice(p)));
    }
    if (sortBy === 'name') result.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === 'price') result.sort((a, b) => getLowestPrice(a) - getLowestPrice(b));
    if (sortBy === 'min_qty') result.sort((a, b) => a.min_qty - b.min_qty);
    return result;
  }, [allProducts, categoryFilter, priceFilter, sortBy]);

  useEffect(() => {
    setDisplayed(getFiltered().slice(0, PAGE_SIZE));
    setPage(0);
  }, [getFiltered]);

  function loadMore() {
    const filtered = getFiltered();
    const nextPage = page + 1;
    setDisplayed(filtered.slice(0, (nextPage + 1) * PAGE_SIZE));
    setPage(nextPage);
  }

  function clearFilters() {
    setCategoryFilter('');
    setPriceFilter('');
    setSortBy('name');
  }

  const filtered = getFiltered();
  const hasMore = displayed.length < filtered.length;
  const hasActiveFilter = categoryFilter || priceFilter;

  const selectStyle = { padding: '10px 16px', borderRadius: '8px', border: '1px solid #E0DDD7', fontSize: '14px', color: NAVY, background: '#fff', cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' };

  return (
    <div style={{ fontFamily: '"DM Sans", sans-serif', minHeight: '100vh', background: '#ffffff', color: '#000' }}>

      {/* BREADCRUMB */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E0DDD7', padding: '12px 40px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', fontSize: '13px', color: '#000' }}>
          <Link href="/" style={{ color: '#000', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <span style={{ color: '#000' }}>Indent</span>
          <span style={{ margin: '0 8px' }}>/</span>
          <span style={{ color: NAVY, fontWeight: 600 }}>{config.crumb}</span>
        </div>
      </div>

      {/* HEADER */}
      <div style={{ background: NAVY, padding: '56px 40px 48px', textAlign: 'center' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ display: 'inline-block', background: config.badgeBg, color: '#fff', fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', padding: '5px 14px', borderRadius: '20px', marginBottom: '18px' }}>
            {config.badge}
          </div>
          <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '46px', fontWeight: 600, color: '#fff', margin: '0 0 14px', lineHeight: 1.1 }}>
            {config.heading}
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,.75)', lineHeight: 1.7, margin: 0 }}>
            {config.intro}
          </p>
        </div>

        {/* 流程条 */}
        <div style={{ maxWidth: '900px', margin: '36px auto 0', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '8px' }}>
          {config.steps.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ background: 'rgba(255,255,255,.08)', border: '1px solid rgba(201,169,110,.4)', borderRadius: '10px', padding: '10px 16px', minWidth: '130px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: GOLD }}>{s.title}</div>
                <div style={{ fontSize: '11.5px', color: 'rgba(255,255,255,.65)', marginTop: '2px' }}>{s.sub}</div>
              </div>
              {i < config.steps.length - 1 && (
                <span style={{ color: GOLD, fontSize: '16px' }}>→</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* PRODUCTS */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '48px 40px' }}>
        {/* FILTER BAR */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '30px', color: NAVY, margin: 0, fontWeight: 600 }}>
            {config.gridTitle} {!loading && <span style={{ fontSize: '15px', color: '#000', fontWeight: 400 }}>({filtered.length})</span>}
          </h2>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} style={selectStyle}>
              <option value="">All Categories</option>
              {categoryOptions.map(([c, n]) => <option key={c} value={c}>{c} ({n})</option>)}
            </select>
            <select value={priceFilter} onChange={e => setPriceFilter(e.target.value)} style={selectStyle}>
              {PRICE_RANGES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={selectStyle}>
              <option value="name">Sort: Name</option>
              <option value="price">Sort: Price (low–high)</option>
              <option value="min_qty">Sort: Min Quantity</option>
            </select>
            {hasActiveFilter && (
              <button onClick={clearFilters} style={{ background: 'transparent', color: GOLD, border: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', textDecoration: 'underline' }}>
                Clear
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#000' }}>Loading products…</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>{config.emoji}</div>
            <div style={{ fontSize: '16px', fontWeight: 600, color: NAVY, marginBottom: '8px' }}>
              {hasActiveFilter ? 'No products match these filters' : 'Range coming soon'}
            </div>
            {hasActiveFilter && (
              <button onClick={clearFilters} style={{ background: GOLD, color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, marginTop: '8px' }}>Clear Filters</button>
            )}
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '20px' }}>
              {displayed.map(product => {
                const img = getFirstImage(product);
                const price = getLowestPrice(product);
                const isHovered = hoveredId === product.id;
                return (
                  <Link key={product.id} href={`/products/${product.slug}`} style={{ textDecoration: 'none' }}>
                    <div
                      onMouseEnter={() => setHoveredId(product.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', border: '1px solid #E0DDD7', boxShadow: isHovered ? '0 8px 24px rgba(0,0,0,.1)' : '0 2px 6px rgba(0,0,0,.05)', transform: isHovered ? 'translateY(-2px)' : 'none', transition: 'box-shadow .2s, transform .2s', height: '100%', display: 'flex', flexDirection: 'column' }}
                    >
                      <div style={{ height: '190px', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                        {img
                          ? <ProductImg src={img} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '12px' }} />
                          : <div style={{ fontSize: '40px', color: '#D0CCC8' }}>📦</div>}
                        <div style={{ position: 'absolute', top: '10px', left: '10px', background: config.badgeBg, color: '#fff', fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '20px' }}>
                          {config.cardBadge}
                        </div>
                        {product.is_eco && (
                          <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#2D6A4F', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '20px' }}>🌿 ECO</div>
                        )}
                      </div>
                      <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: NAVY, lineHeight: 1.4, textAlign: 'center' }}>{product.name}</div>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: 'auto' }}>
                          {price > 0 && (
                            <div style={{ textAlign: 'center' }}>
                              <div style={{ fontSize: '11px', color: '#000', marginBottom: '2px' }}>As low as</div>
                              <div style={{ fontSize: '18px', color: GOLD, fontWeight: 400 }}>${price.toFixed(2)}</div>
                            </div>
                          )}
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '11px', color: '#000', marginBottom: '2px' }}>Min Qty</div>
                            <div style={{ fontSize: '18px', color: NAVY, fontWeight: 400 }}>{product.min_qty}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {hasMore && (
              <div style={{ textAlign: 'center', marginTop: '40px' }}>
                <button
                  onClick={loadMore}
                  style={{ background: NAVY, color: '#fff', border: 'none', borderRadius: '10px', padding: '14px 40px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', transition: 'background .2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = GOLD}
                  onMouseLeave={e => e.currentTarget.style.background = NAVY}
                >
                  {`Load More (${filtered.length - displayed.length} remaining)`}
                </button>
              </div>
            )}
          </>
        )}

        {/* CUSTOM SOURCING CTA */}
        <div style={{ marginTop: '56px', background: NAVY, borderRadius: '16px', padding: '40px', textAlign: 'center', border: `1px solid ${GOLD}` }}>
          <div style={{ fontSize: '34px', marginBottom: '10px' }}>{config.emoji}</div>
          <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '28px', color: '#fff', margin: '0 0 10px', fontWeight: 600 }}>
            {config.ctaTitle}
          </h3>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,.75)', maxWidth: '560px', margin: '0 auto 22px', lineHeight: 1.7 }}>
            {config.ctaText}
          </p>
          <button
            onClick={() => setQuoteOpen(true)}
            style={{ background: GOLD, color: '#fff', border: 'none', padding: '13px 36px', borderRadius: '8px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', letterSpacing: '0.5px', boxShadow: '0 2px 10px rgba(201,169,110,.35)' }}
          >
            GET A QUOTE
          </button>
        </div>
      </div>

      <QuoteModal open={quoteOpen} onClose={() => setQuoteOpen(false)} source={config.quoteSource} />
    </div>
  );
}

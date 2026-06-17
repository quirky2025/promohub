'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { slugify, titleFromSlug } from '@/lib/slug';
import ProductImg from '@/components/ProductImg';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';
const MARGIN = 1.40;
const PAGE_SIZE = 24;

const CROSS_CATEGORY_ONLY = ['Note Pads', 'Promotional', 'Personal Care', 'Travel', 'Drinkware Presentation'];

// SEO content per category
const SEO_CONTENT = {
  bags: {
    intro: 'Custom printed promotional bags are one of the most effective branded merchandise investments for Australian businesses. With a large decoration area, everyday practicality, and a wide range of styles, bags carry your brand into your clients\' daily lives — from the office to the supermarket, the gym to the boardroom.',
    sections: [
      {
        title: 'Why Promotional Bags Work for Australian Businesses',
        body: 'Bags are a staple of any corporate merchandise range for good reason. Unlike single-use promotional items, a quality branded bag is used repeatedly — generating thousands of logo impressions over its lifetime. Whether it\'s a reusable tote spotted at the farmers market or a branded laptop bag on the train, your logo travels with your audience wherever they go.',
      },
      {
        title: 'Eco-Friendly Bag Options',
        body: 'Australia\'s shift away from single-use plastics has made reusable bags more popular than ever. Our range includes natural jute bags, unbleached cotton totes, juco (jute-cotton blend) shoppers, and recycled material options — perfect for brands with sustainability commitments or ESG reporting requirements.',
      },
      {
        title: 'Corporate & Conference Bags',
        body: 'From high-end leather-look laptop bags for executive gifting to non-woven totes for conference delegate packs, we supply branded bags for Australia\'s largest corporate events, trade shows, and onboarding programs. Bulk pricing starts from small quantities with no hidden setup surprises.',
      },
      {
        title: 'Custom Bag Decoration Methods',
        body: 'We offer screen printing, embroidery, heat transfer, and digital printing across our bag range. Decoration method availability depends on the product material and your artwork. Our team will advise on the best method to make your logo look its best on the finished product.',
      },
    ],
  },
};

export default function CategoryPage() {
  const { category } = useParams();
  const categoryName = titleFromSlug(category);
  const categoryKey = (category || '').toLowerCase();

  const [subcategories, setSubcategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [displayed, setDisplayed] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);

  // Filters
  const [isEco, setIsEco] = useState(false);
  const [minQtyFilter, setMinQtyFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [page, setPage] = useState(0);

  // Fetch subcategories + first batch of products
  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      const { data: allData } = await supabase
        .from('products')
        .select('id, name, slug, subcategory, extra_subcategories, is_eco, min_qty, is_published, product_colours(images, sort_order), pricing_tiers(base_price)')
        .ilike('category', categoryName)
        .eq('is_published', true);

      if (allData) {
        // Build subcategory map
        const subMap = {};
        const addToSub = (sub, p) => {
          if (!subMap[sub]) subMap[sub] = { name: sub, count: 0, image: null };
          subMap[sub].count++;
          if (!subMap[sub].image) {
            const sorted = [...(p.product_colours || [])].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
            const imgs = sorted[0]?.images;
            const arr = Array.isArray(imgs) ? imgs : imgs ? Object.values(imgs) : [];
            if (arr[0]) subMap[sub].image = arr[0];
          }
        };
        allData.forEach(p => {
          addToSub(p.subcategory || 'Other', p);            // 主户口
          (Array.isArray(p.extra_subcategories) ? p.extra_subcategories : []).forEach(extraSub => {
            if (
              extraSub &&
              extraSub !== p.subcategory &&
              !CROSS_CATEGORY_ONLY.includes(extraSub)
            ) {
              addToSub(extraSub, p);  // 副牌货架
            }
          });
        });
        setSubcategories(Object.values(subMap).sort((a, b) => a.name.localeCompare(b.name)));
        setAllProducts(allData);
        setTotal(allData.length);
      }
      setLoading(false);
    }
    fetchData();
  }, [category]);

  // Apply filters + sort
  const getFiltered = useCallback(() => {
    let result = [...allProducts];
    if (isEco) result = result.filter(p => p.is_eco === true);
    if (minQtyFilter) result = result.filter(p => p.min_qty <= parseInt(minQtyFilter));
    if (sortBy === 'name') result.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === 'price') result.sort((a, b) => getLowestPrice(a) - getLowestPrice(b));
    if (sortBy === 'min_qty') result.sort((a, b) => a.min_qty - b.min_qty);
    return result;
  }, [allProducts, isEco, minQtyFilter, sortBy]);

  useEffect(() => {
    const filtered = getFiltered();
    setDisplayed(filtered.slice(0, PAGE_SIZE));
    setPage(0);
  }, [getFiltered]);

  function loadMore() {
    setLoadingMore(true);
    const filtered = getFiltered();
    const nextPage = page + 1;
    setDisplayed(filtered.slice(0, (nextPage + 1) * PAGE_SIZE));
    setPage(nextPage);
    setLoadingMore(false);
  }

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

  function clearFilters() {
    setIsEco(false);
    setMinQtyFilter('');
    setSortBy('name');
  }

  const filtered = getFiltered();
  const hasMore = displayed.length < filtered.length;
  const seo = SEO_CONTENT[categoryKey] || null;

  return (
    <div style={{ fontFamily: '"DM Sans", sans-serif', minHeight: '100vh', background: '#F8F7F4', color: '#1a1a1a' }}>

      {/* BREADCRUMB */}
      <div className="qp-padx" style={{ background: '#fff', borderBottom: '1px solid #E0DDD7', padding: '12px 40px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', fontSize: '13px', color: '#7A7570' }}>
          <Link href="/" style={{ color: '#7A7570', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 8px' }}>›</span>
          <Link href="/products" style={{ color: '#7A7570', textDecoration: 'none' }}>All Products</Link>
          <span style={{ margin: '0 8px' }}>›</span>
          <span style={{ color: NAVY, fontWeight: 600 }}>{categoryName}</span>
        </div>
      </div>

      {/* HEADER */}
      <div className="qp-padx" style={{ background: NAVY, padding: '40px 40px 48px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h1 className="qp-cat-h1" style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '42px', fontWeight: 600, margin: '0 0 10px', color: '#fff' }}>
            Custom Printed {categoryName}
          </h1>
          <p style={{ color: 'rgba(255,255,255,.65)', margin: '0', fontSize: '15px' }}>
            {total} products · {subcategories.length} subcategories · Australia-wide delivery
          </p>
        </div>
      </div>

      {/* SUBCATEGORY CARDS */}
      <div className="qp-padx" style={{ background: '#fff', borderBottom: '1px solid #E0DDD7', padding: '32px 40px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '22px', color: NAVY, margin: '0 0 20px', fontWeight: 600 }}>
            Browse by Subcategory
          </h2>
          <div className="qp-subcat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
            {subcategories.map(sub => (
              <Link key={sub.name} href={`/category/${category}/${slugify(sub.name)}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: '#F8F7F4', borderRadius: '12px', overflow: 'hidden', border: '1px solid #E0DDD7', cursor: 'pointer', transition: 'box-shadow .2s, transform .2s' }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <div style={{ height: '140px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {sub.image
                      ? <img src={sub.image} alt={sub.name} style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
                      : <div style={{ color: '#C8C4BC', fontSize: '32px' }}>📦</div>}
                  </div>
                  <div style={{ padding: '12px 14px', borderTop: '1px solid #F0EEED' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: NAVY, marginBottom: '2px' }}>{sub.name}</div>
                    <div style={{ fontSize: '11px', color: '#7A7570' }}>{sub.count} products</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN — FILTERS + PRODUCTS */}
      <div className="qp-cat-main" style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 40px', display: 'flex', gap: '32px', alignItems: 'flex-start' }}>

        {/* FILTER SIDEBAR */}
        <div className="qp-cat-sidebar" style={{ width: '220px', flexShrink: 0, background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,.06)', position: 'sticky', top: '72px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <span style={{ fontSize: '15px', fontWeight: 700, color: NAVY }}>Filters</span>
            <button onClick={clearFilters} style={{ fontSize: '12px', color: GOLD, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Clear all</button>
          </div>

          {/* Sort */}
          <div style={{ marginBottom: '20px' }}>
            <div style={labelStyle}>Sort By</div>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={selectStyle}>
              <option value="name">Name A–Z</option>
              <option value="price">Price: Low to High</option>
              <option value="min_qty">Min Quantity</option>
            </select>
          </div>

          {/* Min Qty */}
          <div style={{ marginBottom: '20px' }}>
            <div style={labelStyle}>Max Min. Quantity</div>
            <select value={minQtyFilter} onChange={e => setMinQtyFilter(e.target.value)} style={selectStyle}>
              <option value="">Any</option>
              <option value="25">Up to 25</option>
              <option value="50">Up to 50</option>
              <option value="100">Up to 100</option>
              <option value="250">Up to 250</option>
              <option value="500">Up to 500</option>
            </select>
          </div>

          {/* Eco */}
          <div style={{ marginBottom: '20px' }}>
            <div style={labelStyle}>Sustainability</div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input type="checkbox" checked={isEco} onChange={e => setIsEco(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: GOLD }} />
              <span style={{ fontSize: '14px', color: '#1a1a1a' }}>🌿 Eco-Friendly only</span>
            </label>
          </div>

          <div style={{ borderTop: '1px solid #E0DDD7', paddingTop: '16px', fontSize: '13px', color: '#7A7570' }}>
            {filtered.length} product{filtered.length !== 1 ? 's' : ''} found
          </div>
        </div>

        {/* PRODUCT GRID */}
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '28px', color: NAVY, margin: 0, fontWeight: 600 }}>
              All {categoryName}
            </h2>
            <span style={{ fontSize: '14px', color: '#7A7570' }}>Showing {displayed.length} of {filtered.length}</span>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px', color: '#7A7570' }}>Loading products...</div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
              <div style={{ fontSize: '16px', fontWeight: 600, color: NAVY, marginBottom: '8px' }}>No products found</div>
              <button onClick={clearFilters} style={{ background: GOLD, color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Clear Filters</button>
            </div>
          ) : (
            <>
              <div className="qp-prod-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '20px' }}>
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
                        <div style={{ height: '190px', background: '#F8F7F4', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                          {img
                            ? <ProductImg src={img} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '12px' }} />
                            : <div style={{ fontSize: '40px', color: '#D0CCC8' }}>📦</div>}
                          {product.is_eco && (
                            <div style={{ position: 'absolute', top: '10px', left: '10px', background: '#2D6A4F', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '20px' }}>🌿 ECO</div>
                          )}
                        </div>
                        <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <div style={{ fontSize: '14px', fontWeight: 600, color: NAVY, lineHeight: 1.4, textAlign: 'center' }}>{product.name}</div>
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: 'auto' }}>
                            {price > 0 && (
                              <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '11px', color: '#7A7570', marginBottom: '2px' }}>As low as</div>
                                <div style={{ fontSize: '18px', color: GOLD, fontWeight: 400 }}>${price.toFixed(2)}</div>
                              </div>
                            )}
                            <div style={{ textAlign: 'center' }}>
                              <div style={{ fontSize: '11px', color: '#7A7570', marginBottom: '2px' }}>Min Qty</div>
                              <div style={{ fontSize: '18px', color: NAVY, fontWeight: 400 }}>{product.min_qty}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* LOAD MORE */}
              {hasMore && (
                <div style={{ textAlign: 'center', marginTop: '40px' }}>
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    style={{ background: NAVY, color: '#fff', border: 'none', borderRadius: '10px', padding: '14px 40px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', transition: 'background .2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = GOLD}
                    onMouseLeave={e => e.currentTarget.style.background = NAVY}
                  >
                    {loadingMore ? 'Loading...' : `Load More (${filtered.length - displayed.length} remaining)`}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* SEO CONTENT */}
      {seo && (
        <div className="qp-padx" style={{ background: '#fff', borderTop: '1px solid #E0DDD7', padding: '56px 40px' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '32px', color: NAVY, margin: '0 0 20px', fontWeight: 600 }}>
              Custom Printed {categoryName} for Australian Businesses
            </h2>
            <p style={{ fontSize: '16px', color: '#5A5550', lineHeight: 1.8, margin: '0 0 36px' }}>{seo.intro}</p>
            <div className="qp-seo-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
              {seo.sections.map((s, i) => (
                <div key={i}>
                  <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '20px', color: NAVY, margin: '0 0 10px', fontWeight: 600 }}>{s.title}</h3>
                  <p style={{ fontSize: '14px', color: '#5A5550', lineHeight: 1.8, margin: 0 }}>{s.body}</p>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '40px', padding: '24px 28px', background: '#F8F7F4', borderRadius: '12px', borderLeft: `4px solid ${GOLD}` }}>
              <p style={{ margin: 0, fontSize: '14px', color: '#3D3A36', lineHeight: 1.8 }}>
                <strong>Ready to get started?</strong> Browse our full range above, or contact our team at{' '}
                <a href="mailto:hello@quirkypromo.com.au" style={{ color: GOLD, fontWeight: 600 }}>hello@quirkypromo.com.au</a>{' '}
                or call <strong>02 9477 4748</strong> — we'll help you find the right bag at the right price for your campaign.
              </p>
            </div>
          </div>
        </div>
      )}
    <style>{`
        @media (max-width: 768px) {
          .qp-padx { padding-left: 16px !important; padding-right: 16px !important; }
          .qp-cat-main { flex-direction: column !important; padding: 20px 16px !important; gap: 18px !important; }
          .qp-cat-sidebar { width: 100% !important; position: static !important; box-sizing: border-box; }
          .qp-cat-h1 { font-size: 30px !important; }
          .qp-prod-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
          .qp-subcat-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
          .qp-seo-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

const labelStyle = { fontSize: '11px', fontWeight: 700, color: NAVY, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' };
const selectStyle = { width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #E0DDD7', fontFamily: '"DM Sans", sans-serif', fontSize: '13px', color: '#1a1a1a', background: '#fff', outline: 'none', cursor: 'pointer' };

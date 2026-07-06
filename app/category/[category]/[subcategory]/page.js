'use client';

import { useEffect, useState, useCallback } from 'react';
import { MARGIN } from '@/lib/pricing';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { findNameBySlug, normalizeSlug, titleFromSlug } from '@/lib/slug';
import ProductImg from '@/components/ProductImg';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';
const PAGE_SIZE = 24;

// SEO blurbs per subcategory(键为 normalizeSlug 后的标准形)
const SUB_SEO = {
  'backpacks': 'Custom printed backpacks are a premium corporate gift and a practical everyday item for staff, students, and event attendees. With large decoration areas and a wide range of styles — from roll-top commuter packs to foldable daypacks — branded backpacks deliver exceptional brand exposure wherever they go.',
  'tote-bags': 'Branded tote bags are one of the most cost-effective promotional items available. Lightweight, reusable, and available in cotton, jute, and non-woven materials, custom printed tote bags are ideal for conferences, retail environments, and eco-conscious campaigns across Australia.',
  'cooler-bags': 'Promotional cooler bags are a practical branded gift perfect for corporate events, team gifts, and outdoor activations. With insulated linings and a range of sizes from lunch bags to large trolley coolers, your logo stays front-of-mind from the office kitchen to the weekend barbecue.',
  'laptop-bags': 'Custom branded laptop bags and sleeves are an executive-level corporate gift that clients and staff will use daily. Our range includes padded briefcases, slim sleeves, and anti-theft backpacks — all with generous decoration areas and professional finishes suited to premium corporate branding.',
  'jute-bags': 'Jute promotional bags are the eco-friendly choice for brands with sustainability commitments. Natural, biodegradable, and incredibly durable, custom printed jute bags deliver an authentic eco message for retail, grocery, gifting, and corporate campaigns.',
  'duffle-bags': 'Branded duffle bags are a versatile corporate gift for staff, sports clubs, and travel-focused campaigns. From compact foldaway weekenders to full-size gym bags with separate shoe compartments, our custom duffle bags offer generous print areas and long-lasting brand exposure.',
  'paper-bags': 'Custom printed paper bags add a premium touch to retail, gifting, and event experiences. Available in a range of sizes with ribbon or rope handles, gloss laminated paper bags turn every purchase or gift into a branded moment that your recipients will remember.',
  'drawstring-bags': 'Promotional drawstring bags are a lightweight, affordable option for events, schools, gyms, and charity campaigns. Custom printed in your brand colours, drawstring bags in cotton, fleece, or mesh materials are a practical giveaway that gets regular use.',
  'satchel-bags': 'Custom branded satchel and messenger bags are a smart corporate gift for office workers, conference delegates, and frequent travellers. With document compartments, water bottle holders, and large decoration areas, branded satchels combine function with professional style.',
  'crossbody-belt-bags': 'Promotional crossbody and belt bags are compact, hands-free solutions ideal for events, tourism activations, and youth-focused campaigns. Lightweight and practical, custom printed crossbody bags offer a modern branded gifting option.',
};

export default function SubcategoryPage() {
  const { category, subcategory } = useParams();
  const categoryName = titleFromSlug(category);
  const subcategoryKey = normalizeSlug(subcategory);

  // 显示名:先用 URL 还原的临时名,解析出库内原名后替换(保证 "Drink Bottles - Metal" 原样显示)
  const [subName, setSubName] = useState(titleFromSlug(subcategory));
  const [allProducts, setAllProducts] = useState([]);
  const [displayed, setDisplayed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);
  const [page, setPage] = useState(0);

  // Filters
  const [isEco, setIsEco] = useState(false);
  const [minQtyFilter, setMinQtyFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);

      // 第一步:从该类目的库内子类名中,按 slug 匹配出真正的 subcategory 原名
      // (兼容新链接 drink-bottles-metal 和旧链接 drink-bottles---metal / cups-and-tumblers)
      let realSub = null;
      const { data: subs } = await supabase
        .from('nav_subcategories')
        .select('subcategory')
        .ilike('category', categoryName);
      if (subs && subs.length) {
        realSub = findNameBySlug(subs.map(s => s.subcategory), subcategory);
      }
      if (realSub) setSubName(realSub);

      // 第二步:用解析出的原名精确查询;视图不可用时退回旧式还原(简单名仍可工作)
      let query = supabase
        .from('products')
        .select(`
          id, name, slug, category, subcategory,
          min_qty, is_eco, is_published,
          product_colours ( id, name, hex, images, sort_order ),
          pricing_tiers ( min_qty, base_price )
        `)
        .ilike('category', categoryName)
        .eq('is_published', true)
        .order('name');

      query = realSub
        ? query.eq('subcategory', realSub)
        : query.ilike('subcategory', titleFromSlug(subcategory));

      const { data } = await query;

      // 第三步:副牌命中(extra_subcategories 含本子类名;跨类目生效,主户口在别处的产品也能在此货架出现)
      const subForExtra = realSub || titleFromSlug(subcategory);
      const { data: extraData } = await supabase
        .from('products')
        .select(`
          id, name, slug, category, subcategory,
          min_qty, is_eco, is_published,
          product_colours ( id, name, hex, images, sort_order ),
          pricing_tiers ( min_qty, base_price )
        `)
        .contains('extra_subcategories', JSON.stringify([subForExtra]))
        .eq('is_published', true)
        .order('name');

      // 合并去重(主归属优先,副牌补充)
      const merged = [...(data || [])];
      const seen = new Set(merged.map(p => p.id));
      (extraData || []).forEach(p => { if (!seen.has(p.id)) merged.push(p); });
      merged.sort((a, b) => a.name.localeCompare(b.name));

      setAllProducts(merged);
      setLoading(false);
    }
    fetchProducts();
  }, [category, subcategory]);

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
    setDisplayed(getFiltered().slice(0, PAGE_SIZE));
    setPage(0);
  }, [getFiltered]);

  function loadMore() {
    setLoadingMore(true);
    const nextPage = page + 1;
    setDisplayed(getFiltered().slice(0, (nextPage + 1) * PAGE_SIZE));
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

  function getColours(product) {
    return [...(product.product_colours || [])]
      .filter(c => c.hex && c.name !== 'Default')
      .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
      .slice(0, 10);
  }

  function clearFilters() {
    setIsEco(false);
    setMinQtyFilter('');
    setSortBy('name');
  }

  const filtered = getFiltered();
  const hasMore = displayed.length < filtered.length;
  const seoBlurb = SUB_SEO[subcategoryKey] || null;

  return (
    <div style={{ fontFamily: '"DM Sans", sans-serif', minHeight: '100vh', background: '#ffffff' }}>

      {/* BREADCRUMB */}
      <div className="qp-sub-padx" style={{ background: '#fff', borderBottom: '1px solid #E0DDD7', padding: '12px 40px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', fontSize: '13px', color: '#000' }}>
          <Link href="/" style={{ color: '#000', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 8px' }}>›</span>
          <Link href={`/category/${category}`} style={{ color: '#000', textDecoration: 'none' }}>{categoryName}</Link>
          <span style={{ margin: '0 8px' }}>›</span>
          <span style={{ color: NAVY, fontWeight: 600 }}>{subName}</span>
        </div>
      </div>

      {/* HEADER */}
      <div className="qp-sub-padx" style={{ background: NAVY, padding: '36px 40px 44px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h1 className="qp-sub-h1" style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '38px', fontWeight: 600, margin: '0 0 10px', color: '#fff' }}>
            Custom {subName}
          </h1>
          {seoBlurb && (
            <p style={{ color: 'rgba(255,255,255,.65)', margin: '0', fontSize: '14px', maxWidth: '720px', lineHeight: 1.7 }}>
              {seoBlurb.slice(0, 160)}...
            </p>
          )}
        </div>
      </div>

      {/* MAIN */}
      <div className="qp-sub-main" style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 40px', display: 'flex', gap: '32px', alignItems: 'flex-start' }}>

        {/* FILTER SIDEBAR */}
        <div className="qp-sub-sidebar" style={{ width: '220px', flexShrink: 0, background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,.06)', position: 'sticky', top: '72px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <span style={{ fontSize: '15px', fontWeight: 700, color: NAVY }}>Filters</span>
            <button onClick={clearFilters} style={{ fontSize: '12px', color: GOLD, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Clear all</button>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <div style={labelStyle}>Sort By</div>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={selectStyle}>
              <option value="name">Name A–Z</option>
              <option value="price">Price: Low to High</option>
              <option value="min_qty">Min Quantity</option>
            </select>
          </div>

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

          <div style={{ marginBottom: '20px' }}>
            <div style={labelStyle}>Sustainability</div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input type="checkbox" checked={isEco} onChange={e => setIsEco(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: GOLD }} />
              <span style={{ fontSize: '14px', color: '#000' }}>🌿 Eco-Friendly only</span>
            </label>
          </div>

          <div style={{ borderTop: '1px solid #E0DDD7', paddingTop: '16px', fontSize: '13px', color: '#000' }}>
            {filtered.length} product{filtered.length !== 1 ? 's' : ''} found
          </div>
        </div>

        {/* PRODUCT GRID */}
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '26px', color: NAVY, margin: 0, fontWeight: 600 }}>
              {subName}
            </h2>
            <span style={{ fontSize: '13px', color: '#000' }}>Showing {displayed.length} of {filtered.length}</span>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px', color: '#000' }}>Loading products...</div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
              <div style={{ fontSize: '16px', fontWeight: 600, color: NAVY, marginBottom: '8px' }}>No products found</div>
              <button onClick={clearFilters} style={{ background: GOLD, color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Clear Filters</button>
            </div>
          ) : (
            <>
              <div className="qp-sub-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '20px' }}>
                {displayed.map(product => {
                  const img = getFirstImage(product);
                  const price = getLowestPrice(product);
                  const colours = getColours(product);
                  const totalColours = product.product_colours?.filter(c => c.hex && c.name !== 'Default').length || 0;
                  const extraColours = totalColours - 10;
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
                          {product.is_eco && (
                            <div style={{ position: 'absolute', top: '10px', left: '10px', background: '#2D6A4F', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '20px' }}>🌿 ECO</div>
                          )}
                        </div>
                        <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <div style={{ fontSize: '14px', fontWeight: 600, color: NAVY, lineHeight: 1.4, textAlign: 'center' }}>{product.name}</div>
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: 'auto' }}>
                            {price > 0 && (
                              <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '11px', color: '#000', marginBottom: '2px' }}>As low as</div>
                                <div style={{ fontSize: '18px', color: GOLD }}>${price.toFixed(2)}</div>
                              </div>
                            )}
                            <div style={{ textAlign: 'center' }}>
                              <div style={{ fontSize: '11px', color: '#000', marginBottom: '2px' }}>Min Qty</div>
                              <div style={{ fontSize: '18px', color: NAVY }}>{product.min_qty}</div>
                            </div>
                          </div>
                          {colours.length > 0 && (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', flexWrap: 'wrap' }}>
                              {colours.map(c => (
                                <div key={c.id} title={c.name} style={{ width: '16px', height: '16px', borderRadius: '50%', background: c.hex, border: '1.5px solid rgba(0,0,0,.1)', flexShrink: 0 }} />
                              ))}
                              {extraColours > 0 && <span style={{ fontSize: '11px', color: '#000' }}>+{extraColours}</span>}
                            </div>
                          )}
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
      {seoBlurb && (
        <div className="qp-sub-padx" style={{ background: '#fff', borderTop: '1px solid #E0DDD7', padding: '56px 40px' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '28px', color: NAVY, margin: '0 0 16px', fontWeight: 600 }}>
              About Custom Printed {subName}
            </h2>
            <p style={{ fontSize: '15px', color: '#000', lineHeight: 1.8, margin: '0 0 28px' }}>{seoBlurb}</p>
            <div style={{ padding: '20px 24px', background: '#ffffff', borderRadius: '12px', borderLeft: `4px solid ${GOLD}` }}>
              <p style={{ margin: 0, fontSize: '14px', color: '#3D3A36', lineHeight: 1.8 }}>
                <strong>Need help choosing?</strong> Contact our team at{' '}
                <a href="mailto:hello@quirkypromo.com.au" style={{ color: GOLD, fontWeight: 600 }}>hello@quirkypromo.com.au</a>{' '}
                or call <strong>02 9477 4748</strong> — we'll find the right product for your brand and budget.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const labelStyle = { fontSize: '11px', fontWeight: 700, color: NAVY, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' };
const selectStyle = { width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #E0DDD7', fontFamily: '"DM Sans", sans-serif', fontSize: '13px', color: '#000', background: '#fff', outline: 'none', cursor: 'pointer' };

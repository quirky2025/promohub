'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { MARGIN } from '@/lib/pricing';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { slugify } from '@/lib/slug';
import ProductImg from '@/components/ProductImg';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';
const PAGE_SIZE = 24;

const PRICE_RANGES = [
  { value: '', label: 'All Prices' },
  { value: '0-5',   label: 'Under $5',   test: p => p < 5 },
  { value: '5-10',  label: '$5 – $10',   test: p => p >= 5 && p < 10 },
  { value: '10-20', label: '$10 – $20',  test: p => p >= 10 && p < 20 },
  { value: '20-50', label: '$20 – $50',  test: p => p >= 20 && p < 50 },
  { value: '50+',   label: '$50+',       test: p => p >= 50 },
];

function toSlug(name) {
  return (name || '').toLowerCase()
    .replace(/ & /g, '-and-')
    .replace(/&/g, 'and')
    .replace(/ /g, '-');
}

// 别名映射: 某些导航分类合并多个数据库 collection 值。
// key = URL slug, value = { label: 显示名, values: [匹配的数据库 collection 值] }
const COLLECTION_ALIASES = {
  'tradeshow-and-events': {
    label: 'Tradeshow & Events',
    values: ['Conference', 'Events & Conferences', 'Festivals & Events', 'Tradeshows'],
  },
};

// 已知的数据库 collection 值(取自当前 products.collection 实际去重值)。
// 这是「暂时」的本地映射:等分类体系成熟后整体替换为读配置表时,只需替换
// 下面 KNOWN_COLLECTION_VALUES + resolveCollectionValues 这两处,其余逻辑不动。
const KNOWN_COLLECTION_VALUES = [
  'Summer', 'Natural', 'Corporate & Business', 'Sports & Fitness', 'Children',
  'Conference', 'Gifts & Promotions', 'Travel', 'Eco-Friendly', 'Health & Beauty',
  'Festivals & Events', 'Travel & Outdoor', 'Food & Beverage', 'Fundraising',
  'Cotton Bags', 'Tradeshows', 'New Arrivals', 'Price Buster',
  'Events & Conferences', 'Promotion', 'Promotional',
];

// slug -> { label: 显示名, values: [需匹配的数据库 collection 值] }
// 为了把过滤下推到数据库,得先知道一个 URL slug 对应哪些 DB collection 值:
//   - 别名(一个 slug 合并多个 DB 值)走 COLLECTION_ALIASES;
//   - 普通 slug 用 KNOWN_COLLECTION_VALUES 反查(toSlug 后相等,大小写无关);
//   - 都没命中(未知 slug)返回空 values,调用方据此直接给空结果、不打 DB。
function resolveCollectionValues(slug) {
  const alias = COLLECTION_ALIASES[slug];
  if (alias) return { label: alias.label, values: alias.values };
  const matches = KNOWN_COLLECTION_VALUES.filter(v => toSlug(v) === slug);
  if (matches.length) return { label: matches[0], values: matches };
  return { label: (slug || '').replace(/-/g, ' '), values: [] };
}

export default function CollectionPage() {
  const { slug } = useParams();

  const [allProducts, setAllProducts] = useState([]);
  const [collectionName, setCollectionName] = useState('');
  const [banner, setBanner] = useState(null);   // hero image set in admin → Catalog → Banners
  const [displayed, setDisplayed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);
  const [page, setPage] = useState(0);

  const [categoryFilter, setCategoryFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setLoadError(false);

      const { label, values } = resolveCollectionValues(slug);
      setCollectionName(label);

      // 未知 slug:没有对应的 DB collection 值,直接给空结果,不去打 DB。
      if (values.length === 0) {
        setAllProducts([]);
        setLoading(false);
        return;
      }

      // 把 collection 过滤下推到数据库,只取该 collection 的产品(行数从全表 ~2600
      // 降到几百),这样即便带 product_colours / pricing_tiers 两个 join 也不超时。
      // collection 是 jsonb 数组,用 contains(@>);一个 slug 可能对应多个 DB 值
      // (别名),用 OR 把每个值的 contains 条件拼起来。
      // 注:当前 DB 值不含逗号/括号,可安全拼进 PostgREST 的 or() 过滤串。
      const orFilter = values.map(v => `collection.cs.${JSON.stringify([v])}`).join(',');
      const { data, error } = await supabase
        .from('products')
        .select('id, name, slug, supplier_sku, category, subcategory, is_eco, collection, min_qty, is_published, quote_only, product_colours(images, sort_order), pricing_tiers(base_price)')
        .eq('is_published', true)
        .or(orFilter);

      if (error) {
        // 不再静默吞掉:打日志 + 置错误态,让 UI 显示错误而不是假装「没有产品」。
        console.error('[collections] query failed for slug:', slug, error);
        setAllProducts([]);
        setLoadError(true);
      } else {
        setAllProducts(data || []);
      }
      setLoading(false);
    }
    if (slug) fetchData();
  }, [slug]);

  // Hero banner (admin → Catalog → Banners → 系列页). Admin stores page_key = slugify(collection name);
  // also try the URL slug as fallback for alias pages (e.g. tradeshow-and-events).
  useEffect(() => {
    if (!collectionName && !slug) return;
    let cancelled = false;
    (async () => {
      try {
        const keys = [...new Set([slugify(collectionName), String(slug || '')].filter(Boolean))];
        const { data } = await supabase
          .from('page_banners').select('*')
          .eq('page_type', 'collection')
          .in('page_key', keys)
          .eq('is_active', true)
          .order('sort_order', { ascending: true })
          .limit(1);
        if (!cancelled) setBanner(data?.[0] || null);
      } catch { /* table may not exist yet — keep navy */ }
    })();
    return () => { cancelled = true; };
  }, [collectionName, slug]);

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

  const categoryOptions = useMemo(() => {
    const set = new Set();
    allProducts.forEach(p => { if (p.category) set.add(p.category); });
    return [...set].sort();
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
      <div style={{ background: '#fff', borderBottom: '1px solid #E0DDD7', padding: '12px 40px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', fontSize: '13px', color: '#000' }}>
          <Link href="/" style={{ color: '#000', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <Link href="/collections" style={{ color: '#000', textDecoration: 'none' }}>Collections</Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <span style={{ color: NAVY, fontWeight: 600, textTransform: 'capitalize' }}>{collectionName}</span>
        </div>
      </div>

      {/* Hero — banner image set in admin → Catalog → Banners; falls back to navy. */}
      <div style={{
        background: banner?.image_url
          ? `linear-gradient(rgba(27,42,74,${(banner.overlay_pct ?? 45) / 100}), rgba(27,42,74,${(banner.overlay_pct ?? 45) / 100})), url(${banner.image_url}) center/cover no-repeat`
          : NAVY,
        padding: '56px 40px', textAlign: 'center',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'inline-block', background: `${GOLD}25`, color: GOLD, fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', padding: '5px 14px', borderRadius: '20px', marginBottom: '18px' }}>Collection</div>
          <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '46px', fontWeight: 600, color: '#fff', margin: '0 0 14px', lineHeight: 1.1, textTransform: 'capitalize', textShadow: banner?.image_url ? '0 2px 12px rgba(0,0,0,.45)' : 'none' }}>
            {banner?.headline || collectionName}
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,.75)', lineHeight: 1.7, margin: 0, textShadow: banner?.image_url ? '0 1px 8px rgba(0,0,0,.5)' : 'none' }}>
            {banner?.subheadline || `Branded promotional products curated for ${collectionName}.`}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '48px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '30px', color: NAVY, margin: 0, fontWeight: 600 }}>
            Products {!loading && <span style={{ fontSize: '15px', color: '#000', fontWeight: 400 }}>({filtered.length})</span>}
          </h2>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} style={selectStyle}>
              <option value="">All Categories</option>
              {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
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
              <button onClick={clearFilters} style={{ background: 'transparent', color: GOLD, border: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', textDecoration: 'underline' }}>Clear</button>
            )}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#000' }}>Loading…</div>
        ) : loadError ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
            <div style={{ fontSize: '16px', fontWeight: 600, color: NAVY, marginBottom: '8px' }}>Couldn’t load this collection</div>
            <div style={{ fontSize: '14px', color: '#000', marginBottom: '8px' }}>Something went wrong. Please try again in a moment.</div>
            <Link href="/" style={{ display: 'inline-block', marginTop: '8px', background: GOLD, color: '#fff', padding: '10px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 }}>Browse All Products</Link>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
            <div style={{ fontSize: '16px', fontWeight: 600, color: NAVY, marginBottom: '8px' }}>No products in this collection yet</div>
            <Link href="/" style={{ display: 'inline-block', marginTop: '8px', background: GOLD, color: '#fff', padding: '10px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 }}>Browse All Products</Link>
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
                    <div onMouseEnter={() => setHoveredId(product.id)} onMouseLeave={() => setHoveredId(null)}
                      style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', border: '1px solid #E0DDD7', boxShadow: isHovered ? '0 8px 24px rgba(0,0,0,.1)' : '0 2px 6px rgba(0,0,0,.05)', transform: isHovered ? 'translateY(-2px)' : 'none', transition: 'box-shadow .2s, transform .2s', height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ height: '190px', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                        {img ? <ProductImg src={img} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '12px' }} /> : <div style={{ fontSize: '40px', color: '#D0CCC8' }}>📦</div>}
                        {product.is_eco && (<div style={{ position: 'absolute', top: '10px', left: '10px', background: '#2D6A4F', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '20px' }}>🌿 ECO</div>)}
                      </div>
                      <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {product.supplier_sku && (<div style={{ fontSize: '11px', color: '#000', fontFamily: '"DM Mono", monospace', textAlign: 'center' }}>SKU: {product.supplier_sku}</div>)}
                        <div style={{ fontSize: '14px', fontWeight: 600, color: NAVY, lineHeight: 1.4, textAlign: 'center' }}>{product.name}</div>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: 'auto' }}>
                          {product.quote_only ? (<div style={{ textAlign: 'center' }}><div style={{ fontSize: '11px', color: '#000' }}>&nbsp;</div><div style={{ color: GOLD, fontSize: '14px', fontWeight: 700 }}>Get a Quote</div></div>) : price > 0 && (<div style={{ textAlign: 'center' }}><div style={{ fontSize: '11px', color: '#000', marginBottom: '2px' }}>As low as</div><div style={{ fontSize: '18px', color: GOLD, fontWeight: 400 }}>${price.toFixed(2)}</div></div>)}
                          <div style={{ textAlign: 'center' }}><div style={{ fontSize: '11px', color: '#000', marginBottom: '2px' }}>Min Qty</div><div style={{ fontSize: '18px', color: NAVY, fontWeight: 400 }}>{product.min_qty}</div></div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            {hasMore && (
              <div style={{ textAlign: 'center', marginTop: '40px' }}>
                <button onClick={loadMore} disabled={loadingMore}
                  style={{ background: NAVY, color: '#fff', border: 'none', borderRadius: '10px', padding: '14px 40px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}
                  onMouseEnter={e => e.currentTarget.style.background = GOLD} onMouseLeave={e => e.currentTarget.style.background = NAVY}>
                  {loadingMore ? 'Loading...' : `Load More (${filtered.length - displayed.length} remaining)`}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

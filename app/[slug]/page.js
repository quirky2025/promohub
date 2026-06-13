/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getColourSwatches,
  getLiveChildUrlPages,
  getFirstImage,
  getLiveUrlPage,
  getLowestPrice,
  getProductsForUrlPage,
} from '@/lib/urlPages';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';
const BG = '#F8F7F4';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const urlPage = await getLiveUrlPage(slug);

  if (!urlPage) {
    return {
      title: 'Page Not Found | QuirkyPromo',
    };
  }

  return {
    title: urlPage.title || `${urlPage.h1 || urlPage.nav_label} | QuirkyPromo`,
    description: urlPage.meta_description || undefined,
    alternates: {
      canonical: urlPage.canonical_url || `/${urlPage.slug}`,
    },
    robots: urlPage.noindex ? { index: false, follow: true } : undefined,
  };
}

export default async function UrlPage({ params }) {
  const { slug } = await params;
  const urlPage = await getLiveUrlPage(slug);

  if (!urlPage) notFound();

  const { products, count, error, unsupported } = await getProductsForUrlPage(urlPage);
  const childPages = urlPage.product_filter?.type === 'category'
    ? await getChildPageCards(urlPage)
    : [];
  const productCount = count ?? products.length;

  return (
    <main style={{ minHeight: '100vh', background: BG, color: '#1a1a1a' }}>
      <Breadcrumb urlPage={urlPage} />
      <Hero urlPage={urlPage} productCount={productCount} />

      {childPages.length > 0 && (
        <SubcategorySection childPages={childPages} />
      )}

      <section style={{ maxWidth: '1400px', margin: '0 auto', padding: '42px 40px 58px' }}>
        {error || unsupported ? (
          <StatusPanel
            title="This page is not ready yet"
            body="The URL is live, but its product filter needs a small configuration check before products can display."
          />
        ) : productCount === 0 ? (
          <StatusPanel
            title="Products are being prepared"
            body="This page is live, but matching products have not been assigned yet. Check the product category, subcategory, tags or kit fields before switching navigation to this URL."
          />
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '18px', alignItems: 'flex-end', marginBottom: '24px', flexWrap: 'wrap' }}>
              <div>
                <div style={{ color: GOLD, fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '7px' }}>
                  Products
                </div>
                <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '31px', lineHeight: 1.15, color: NAVY, margin: 0, fontWeight: 600 }}>
                  {urlPage.nav_label || urlPage.h1}
                </h2>
              </div>
              <div style={{ color: '#7A7570', fontSize: '14px' }}>
                {products.length < productCount
                  ? `Showing ${products.length} of ${productCount} products`
                  : `Showing ${productCount} product${productCount === 1 ? '' : 's'}`}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(214px, 1fr))', gap: '20px' }}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </section>

      {(urlPage.seo_content || Array.isArray(urlPage.faq)) && (
        <SeoSection urlPage={urlPage} />
      )}
    </main>
  );
}

async function getChildPageCards(urlPage) {
  const childPages = await getLiveChildUrlPages(urlPage.slug);

  const cards = await Promise.all(
    childPages.map(async (childPage) => {
      const { products, count } = await getProductsForUrlPage(childPage, 24);
      return {
        ...childPage,
        product_count: count ?? products.length,
        image: getFirstImage(products[0]),
      };
    })
  );

  return cards.filter((card) => card.product_count > 0);
}

function Breadcrumb({ urlPage }) {
  return (
    <div style={{ background: '#fff', borderBottom: '1px solid #E0DDD7', padding: '12px 40px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', fontSize: '13px', color: '#7A7570' }}>
        <Link href="/" style={{ color: '#7A7570', textDecoration: 'none' }}>Home</Link>
        {urlPage.breadcrumb_parent && (
          <>
            <span style={{ margin: '0 8px' }}>/</span>
            <Link href={`/${urlPage.breadcrumb_parent}`} style={{ color: '#7A7570', textDecoration: 'none' }}>
              {parentLabel(urlPage.breadcrumb_parent)}
            </Link>
          </>
        )}
        <span style={{ margin: '0 8px' }}>/</span>
        <span style={{ color: NAVY, fontWeight: 600 }}>{urlPage.nav_label || urlPage.h1}</span>
      </div>
    </div>
  );
}

function SubcategorySection({ childPages }) {
  return (
    <section style={{ background: '#fff', borderBottom: '1px solid #E0DDD7', padding: '42px 40px 46px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '31px', lineHeight: 1.15, color: NAVY, margin: '0 0 24px', fontWeight: 600 }}>
          Browse by Subcategory
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(218px, 1fr))', gap: '18px' }}>
          {childPages.map((childPage) => (
            <Link key={childPage.slug} href={`/${childPage.slug}`} style={{ textDecoration: 'none' }}>
              <article style={{ height: '100%', background: '#fff', border: '1px solid #E0DDD7', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 7px rgba(0,0,0,.04)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: '150px', background: '#F8F7F4', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {childPage.image ? (
                    <img src={childPage.image} alt={childPage.nav_label || childPage.h1} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '12px', boxSizing: 'border-box' }} />
                  ) : (
                    <div style={{ color: '#BEB8AF', fontSize: '13px' }}>No image</div>
                  )}
                </div>
                <div style={{ padding: '15px 16px 16px' }}>
                  <div style={{ color: NAVY, fontSize: '15px', fontWeight: 700, lineHeight: 1.35 }}>
                    {childPage.nav_label || childPage.h1}
                  </div>
                  <div style={{ color: '#7A7570', fontSize: '13px', marginTop: '4px' }}>
                    {childPage.product_count} product{childPage.product_count === 1 ? '' : 's'}
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Hero({ urlPage, productCount }) {
  const intro = urlPage.meta_description || '';

  return (
    <section style={{ background: NAVY, padding: '54px 40px 58px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ maxWidth: '820px' }}>
          <div style={{ display: 'inline-block', background: `${GOLD}25`, color: GOLD, fontSize: '11px', fontWeight: 700, letterSpacing: '1.4px', textTransform: 'uppercase', padding: '5px 13px', borderRadius: '20px', marginBottom: '18px' }}>
            {pageTypeLabel(urlPage)}
          </div>
          <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '48px', lineHeight: 1.08, color: '#fff', fontWeight: 600, margin: '0 0 16px' }}>
            {urlPage.h1 || urlPage.nav_label}
          </h1>
          {intro && (
            <p style={{ color: 'rgba(255,255,255,.76)', fontSize: '16px', lineHeight: 1.75, margin: '0 0 22px', maxWidth: '780px' }}>
              {intro}
            </p>
          )}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <Link href="/contact" style={{ background: GOLD, color: '#fff', padding: '12px 22px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '14px' }}>
              Request a Quote
            </Link>
            <span style={{ color: 'rgba(255,255,255,.65)', fontSize: '13px' }}>
              {productCount} product{productCount === 1 ? '' : 's'} matched
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product }) {
  const image = getFirstImage(product);
  const price = getLowestPrice(product);
  const swatches = getColourSwatches(product);

  return (
    <Link href={`/products/${product.slug}`} style={{ textDecoration: 'none' }}>
      <article style={{ height: '100%', background: '#fff', border: '1px solid #E0DDD7', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 7px rgba(0,0,0,.05)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ height: '192px', background: '#F8F7F4', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
          {image ? (
            <img src={image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '13px', boxSizing: 'border-box' }} />
          ) : (
            <div style={{ color: '#BEB8AF', fontSize: '13px' }}>No image</div>
          )}
          {product.is_eco && (
            <div style={{ position: 'absolute', left: '10px', top: '10px', background: '#2D6A4F', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '4px 8px', borderRadius: '999px' }}>
              ECO
            </div>
          )}
        </div>
        <div style={{ padding: '14px 15px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ color: NAVY, fontSize: '14px', fontWeight: 700, lineHeight: 1.35, textAlign: 'center' }}>
            {product.name}
          </div>
          <div style={{ fontSize: '12px', color: '#7A7570', textAlign: 'center' }}>
            {product.subcategory || product.category}
          </div>
          <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'center', gap: '22px', alignItems: 'flex-end' }}>
            {price > 0 && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: '#7A7570' }}>As low as</div>
                <div style={{ color: GOLD, fontSize: '18px' }}>${price.toFixed(2)}</div>
              </div>
            )}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: '#7A7570' }}>Min Qty</div>
              <div style={{ color: NAVY, fontSize: '18px' }}>{product.min_qty || '-'}</div>
            </div>
          </div>
          {swatches.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', flexWrap: 'wrap' }}>
              {swatches.map((colour) => (
                <span key={colour.id} title={colour.name} style={{ width: '15px', height: '15px', borderRadius: '999px', background: colour.hex, border: '1px solid rgba(0,0,0,.14)' }} />
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}

function StatusPanel({ title, body }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #E0DDD7', borderRadius: '8px', padding: '44px 28px', textAlign: 'center' }}>
      <h2 style={{ fontFamily: '"Cormorant Garamond", serif', color: NAVY, fontSize: '30px', margin: '0 0 10px', fontWeight: 600 }}>
        {title}
      </h2>
      <p style={{ color: '#6F6962', fontSize: '15px', lineHeight: 1.7, margin: '0 auto', maxWidth: '620px' }}>
        {body}
      </p>
    </div>
  );
}

function SeoSection({ urlPage }) {
  const faq = Array.isArray(urlPage.faq) ? urlPage.faq : [];

  if (!urlPage.seo_content && faq.length === 0) return null;

  return (
    <section style={{ background: '#fff', borderTop: '1px solid #E0DDD7', padding: '54px 40px 64px' }}>
      <div style={{ maxWidth: '920px', margin: '0 auto' }}>
        {urlPage.seo_content && (
          <div style={{ color: '#4F4943', fontSize: '15px', lineHeight: 1.85, whiteSpace: 'pre-line' }}>
            {urlPage.seo_content}
          </div>
        )}
        {faq.length > 0 && (
          <div style={{ marginTop: urlPage.seo_content ? '34px' : 0 }}>
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', color: NAVY, fontSize: '30px', margin: '0 0 18px', fontWeight: 600 }}>
              FAQs
            </h2>
            <div style={{ display: 'grid', gap: '12px' }}>
              {faq.map((item, index) => (
                <div key={`${item.question || 'faq'}-${index}`} style={{ border: '1px solid #E0DDD7', borderRadius: '8px', padding: '18px 20px', background: BG }}>
                  <div style={{ color: NAVY, fontWeight: 700, marginBottom: '7px' }}>
                    {item.question}
                  </div>
                  <div style={{ color: '#5A5550', fontSize: '14px', lineHeight: 1.7 }}>
                    {item.answer}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function pageTypeLabel(urlPage) {
  if (urlPage.page_type === 'collection') return 'Collection';
  if (urlPage.page_type === 'landing') return 'Landing Page';
  return 'Product Range';
}

function parentLabel(slug) {
  return slug
    .replace(/-australia$/, '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

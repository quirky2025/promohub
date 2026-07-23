/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { cld } from '@/lib/cloudinary';
import { notFound } from 'next/navigation';
import {
  getColourSwatches,
  getLiveChildUrlPages,
  getFirstImage,
  getLiveUrlPage,
  getLowestPrice,
  getProductsForUrlPage,
  getAllLivePageSlugs,
  getMaterialCollectionLinks,
} from '@/lib/urlPages';
import { absoluteUrl } from '@/lib/siteUrl';
import { getPageBanner } from '@/lib/pageBanners';
import { calculatorFromPrice } from '@/lib/decorationPricing';
import CategoryFilter from '@/components/CategoryFilter';
import SeoContent from '@/components/SeoContent';
import QuoteButton from '@/components/QuoteButton';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';
const BG = '#ffffff';

// ISR:类目页静态缓存 5 分钟,CDN 直出(原本每次请求实时 SSR 查 Supabase)
export const revalidate = 300;

// 部署时预渲染所有已上线类目页 → 纯 CDN 静态直出,用户不吃冷渲染
export async function generateStaticParams() {
  const slugs = await getAllLivePageSlugs();
  return slugs.map((slug) => ({ slug }));
}

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
      canonical: absoluteUrl(urlPage.canonical_url || `/${urlPage.slug}`),
    },
    robots: urlPage.noindex ? { index: false, follow: true } : undefined,
  };
}

export default async function UrlPage({ params }) {
  const { slug } = await params;
  const urlPage = await getLiveUrlPage(slug);

  if (!urlPage) notFound();

  // Hero banner set in admin → Catalog → Banners (page_key = this page's slug). Null → navy default.
  const banner = await getPageBanner('category', slug);

  // smart_collection pages get the same filter sidebar as subcategory pages —
  // TAXONOMY_V2: converted material pages must be visually identical to before.
  const pfType = urlPage.product_filter?.type;
  const filterable = pfType === 'category' || pfType === 'subcategory' || pfType === 'smart_collection';
  const { products, count, error, unsupported } = await getProductsForUrlPage(urlPage, filterable ? 1000 : 96);
  // 只把筛选+卡片真正用到的精简字段传给客户端(砍掉 product_colours 图数组 / pricing_tiers / decoration_options),
  // 大幅缩小 RSC payload —— 类目页仍偏慢的主因。
  const filterProducts = filterable
    ? products.map((p) => ({
        id: p.id, name: p.name, slug: p.slug,
        category: p.category, subcategory: p.subcategory, supplier_sku: p.supplier_sku,
        brand: p.brand, is_eco: p.is_eco, min_qty: p.min_qty, fulfillment: p.fulfillment,
        decoration_model: p.decoration_model,
        colour_slugs: p.colour_slugs, materials: p.materials, material_tags: p.material_tags,
        capacity: p.capacity, pen_mechanism: p.pen_mechanism, pen_ink_colour: p.pen_ink_colour,
        _image: getFirstImage(p),
        _price: p.decoration_model === 'calculator' ? (calculatorFromPrice(p) || 0) : getLowestPrice(p),
        _quoteOnly: !!p.quote_only,
        _swatches: getColourSwatches(p),
        _decorationNames: (p.decoration_options || []).filter((d) => d.type !== 'addon').map((d) => d.name),
      }))
    : null;
  const childPages = urlPage.product_filter?.type === 'category'
    ? await getChildPageCards(urlPage)
    : [];
  const productCount = count ?? products.length;

  // "Shop by material" links (published attribute collections for this category).
  // Category prop for the filter sidebar: smart_collection pages carry no
  // category in product_filter — derive it from the resolved products.
  const filterCategory = urlPage.product_filter?.category || products[0]?.category || null;
  const materialLinks = urlPage.product_filter?.type === 'category'
    ? await getMaterialCollectionLinks(urlPage.product_filter.category)
    : [];

  return (
    <main style={{ minHeight: '100vh', background: BG, color: '#000' }}>
      <Breadcrumb urlPage={urlPage} />
      <Hero urlPage={urlPage} productCount={productCount} banner={banner} />

      {childPages.length > 0 && (
        <SubcategorySection childPages={childPages} />
      )}

      {/* TAXONOMY_V2 step 4 — primary "Shop by material" entry (below Browse by Subcategory) */}
      {materialLinks.length > 0 && (
        <section style={{ background: '#fff', borderBottom: '1px solid #E0DDD7', padding: '20px 40px' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: NAVY, textTransform: 'uppercase', letterSpacing: '0.8px' }}>Shop by material</span>
            {materialLinks.map(l => (
              <Link key={l.href} href={l.href}
                style={{ fontSize: '13px', color: NAVY, textDecoration: 'none', border: '1px solid #E0DDD7', borderRadius: '20px', padding: '6px 16px', fontWeight: 600, background: '#fff' }}>
                {l.label}
              </Link>
            ))}
          </div>
        </section>
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
              <div style={{ color: '#000', fontSize: '14px' }}>
                {products.length < productCount
                  ? `Showing ${products.length} of ${productCount} products`
                  : `Showing ${productCount} product${productCount === 1 ? '' : 's'}`}
              </div>
            </div>

            {filterable ? (
              <CategoryFilter products={filterProducts} category={filterCategory} includeType={urlPage.product_filter?.type === 'category'} materialLinks={materialLinks} />
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(214px, 1fr))', gap: '20px' }}>
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {(urlPage.seo_content || (Array.isArray(urlPage.faq) && urlPage.faq.length > 0)) && (
        <SeoContent content={urlPage.seo_content} faq={Array.isArray(urlPage.faq) ? urlPage.faq : []} />
      )}
      {Array.isArray(urlPage.faq) && urlPage.faq.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: urlPage.faq.map((fq) => ({
              "@type": "Question",
              name: fq.question,
              acceptedAnswer: { "@type": "Answer", text: String(fq.answer || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() },
            })),
          }) }}
        />
      )}
    </main>
  );
}

async function getChildPageCards(urlPage) {
  const childPages = (await getLiveChildUrlPages(urlPage.slug)).filter((c) => c.page_type !== 'collection');

  const cards = await Promise.all(
    childPages.map(async (childPage) => {
      const { products, count } = await getProductsForUrlPage(childPage, 1); // 只需数量+一张图,别拉 24 条
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
      <div style={{ maxWidth: '1400px', margin: '0 auto', fontSize: '13px', color: '#000' }}>
        <Link href="/" style={{ color: '#000', textDecoration: 'none' }}>Home</Link>
        {urlPage.breadcrumb_parent && (
          <>
            <span style={{ margin: '0 8px' }}>/</span>
            <Link href={`/${urlPage.breadcrumb_parent}`} style={{ color: '#000', textDecoration: 'none' }}>
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
                <div style={{ height: '150px', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {childPage.image ? (
                    <img src={cld(childPage.image, 300)} alt={childPage.nav_label || childPage.h1} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '12px', boxSizing: 'border-box' }} />
                  ) : (
                    <div style={{ color: '#000', fontSize: '13px' }}>No image</div>
                  )}
                </div>
                <div style={{ padding: '15px 16px 16px' }}>
                  <div style={{ color: NAVY, fontSize: '15px', fontWeight: 700, lineHeight: 1.35 }}>
                    {childPage.nav_label || childPage.h1}
                  </div>
                  <div style={{ color: '#000', fontSize: '13px', marginTop: '4px' }}>
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

function Hero({ urlPage, productCount, banner }) {
  const intro = banner?.subheadline || urlPage.seo_intro || urlPage.meta_description || '';
  // Banner image from admin → Catalog → Banners, with navy overlay for text legibility. No banner → navy.
  const hasImage = Boolean(banner?.image_url);
  const overlay = (banner?.overlay_pct ?? 45) / 100;
  const background = hasImage
    ? `linear-gradient(rgba(27,42,74,${overlay}), rgba(27,42,74,${overlay})), url(${banner.image_url}) center/cover no-repeat`
    : NAVY;

  return (
    <section style={{ background, padding: '54px 40px 58px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ maxWidth: '820px' }}>
          <div style={{ display: 'inline-block', background: `${GOLD}25`, color: GOLD, fontSize: '11px', fontWeight: 700, letterSpacing: '1.4px', textTransform: 'uppercase', padding: '5px 13px', borderRadius: '20px', marginBottom: '18px' }}>
            {pageTypeLabel(urlPage)}
          </div>
          <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '48px', lineHeight: 1.08, color: '#fff', fontWeight: 600, margin: '0 0 16px', textShadow: hasImage ? '0 2px 12px rgba(0,0,0,.45)' : 'none' }}>
            {banner?.headline || urlPage.h1 || urlPage.nav_label}
          </h1>
          {intro && (
            <p style={{ color: 'rgba(255,255,255,.76)', fontSize: '16px', lineHeight: 1.75, margin: '0 0 22px', maxWidth: '780px', textShadow: hasImage ? '0 1px 8px rgba(0,0,0,.5)' : 'none' }}>
              {intro}
            </p>
          )}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <QuoteButton label="Request a Quote" source="category" style={{ background: GOLD, color: '#fff', padding: '12px 22px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '14px', fontFamily: '"DM Sans", sans-serif' }} />
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
  const isCalc = product.decoration_model === 'calculator';
  const price = isCalc ? (calculatorFromPrice(product) || 0) : getLowestPrice(product);
  const swatches = getColourSwatches(product);

  return (
    <Link href={`/products/${product.slug}`} style={{ textDecoration: 'none' }}>
      <article style={{ height: '100%', background: '#fff', border: '1px solid #E0DDD7', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 7px rgba(0,0,0,.05)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ height: '192px', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
          {image ? (
            <img src={cld(image, 400)} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '13px', boxSizing: 'border-box' }} />
          ) : (
            <div style={{ color: '#000', fontSize: '13px' }}>No image</div>
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
          <div style={{ fontSize: '12px', color: '#000', textAlign: 'center', fontFamily: '"DM Mono", monospace', letterSpacing: '0.5px' }}>
            {product.supplier_sku ? `SKU: ${product.supplier_sku}` : (product.subcategory || product.category)}
          </div>
          <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'center', gap: '22px', alignItems: 'flex-end' }}>
            {product.quote_only ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: '#000' }}>&nbsp;</div>
                <div style={{ color: GOLD, fontSize: '14px', fontWeight: 700 }}>Get a Quote</div>
              </div>
            ) : price > 0 && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: '#000' }}>{isCalc ? 'From' : 'As low as'}</div>
                <div style={{ color: GOLD, fontSize: '18px' }}>${price.toFixed(2)}</div>
                {isCalc && <div style={{ fontSize: '10px', color: '#000' }}>decorated</div>}
              </div>
            )}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: '#000' }}>Min Qty</div>
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
      <p style={{ color: '#000', fontSize: '15px', lineHeight: 1.7, margin: '0 auto', maxWidth: '620px' }}>
        {body}
      </p>
    </div>
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

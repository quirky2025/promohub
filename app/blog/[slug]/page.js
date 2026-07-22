/* eslint-disable @next/next/no-img-element */
// /blog/[slug] — post detail (CMS Phase 2): breadcrumb, auto TOC (from H2s,
// can be turned off per post), body, end CTA (Get a Quote + related products),
// Article schema. Published posts only; auto-included in the sitemap.
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { absoluteUrl } from '@/lib/siteUrl';
import { addHeadingIds } from '@/lib/cmsHtml';
import { getLowestPrice, getFirstImage } from '@/lib/urlPages';
import { cld } from '@/lib/cloudinary';
import SeoContent from '@/components/SeoContent';
import QuoteButton from '@/components/QuoteButton';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';

export const revalidate = 300;

async function getPost(slug) {
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();
  return data || null;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: 'Post Not Found | QuirkyPromo' };
  return {
    title: `${post.title} | QuirkyPromo`,
    description: post.meta_description || undefined,
    alternates: { canonical: absoluteUrl(`/blog/${post.slug}`) },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const { html, toc } = addHeadingIds(post.content_html || '');
  const showToc = post.show_toc !== false && toc.length >= 2;

  // related products (cards) — fetched fresh so prices/images stay current
  const relatedIds = (post.related_products || []).map(p => p.id).filter(Boolean);
  let relatedProducts = [];
  if (relatedIds.length) {
    const { data } = await supabase
      .from('products')
      .select('id, name, slug, min_qty, quote_only, product_colours(images, sort_order), pricing_tiers(min_qty, base_price)')
      .eq('is_published', true)
      .in('id', relatedIds);
    relatedProducts = data || [];
  }

  return (
    <main style={{ fontFamily: '"DM Sans", sans-serif', background: '#fff', color: '#000', minHeight: '100vh' }}>
      {/* Article schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: post.title,
          description: post.meta_description || undefined,
          image: post.cover_image_url || undefined,
          author: { '@type': 'Organization', name: post.author || 'QuirkyPromo Team' },
          publisher: { '@type': 'Organization', name: 'QuirkyPromo' },
          datePublished: post.published_at || undefined,
          dateModified: post.updated_at || undefined,
          mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
        }) }}
      />

      {/* breadcrumb */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E0DDD7', padding: '12px 40px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', fontSize: '13px', color: '#000' }}>
          <Link href="/" style={{ color: '#000', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <Link href="/blog" style={{ color: '#000', textDecoration: 'none' }}>Blog</Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <span style={{ color: NAVY, fontWeight: 600 }}>{post.title}</span>
        </div>
      </div>

      {/* hero */}
      <section style={{ background: NAVY, padding: '80px 40px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '44px', lineHeight: 1.12, color: '#fff', fontWeight: 600, margin: '0 0 14px' }}>
            {post.title}
          </h1>
          <div style={{ color: 'rgba(255,255,255,.82)', fontSize: '14px' }}>
            {post.author} · {post.published_at ? new Date(post.published_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
          </div>
        </div>
      </section>

      {post.cover_image_url && (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 40px 0' }}>
          <img src={post.cover_image_url} alt={post.cover_image_alt || post.title}
            style={{ width: '100%', borderRadius: '12px', display: 'block' }} />
        </div>
      )}

      {/* TOC */}
      {showToc && (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '28px 40px 0' }}>
          <div style={{ border: '1px solid #E0DDD7', borderLeft: `3px solid ${GOLD}`, borderRadius: '8px', padding: '16px 20px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: NAVY, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>In this article</div>
            {toc.map(t => (
              <a key={t.id} href={`#${t.id}`} style={{ display: 'block', color: '#000', fontSize: '14px', textDecoration: 'none', padding: '3px 0' }}>
                {t.text}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* body — same limited style system as the category SEO sections */}
      <SeoContent content={html} faq={[]} />

      {/* end CTA + related */}
      <section style={{ background: NAVY, padding: '56px 40px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '32px', color: '#fff', fontWeight: 600, margin: '0 0 10px' }}>
            Ready to put your logo on it?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: '15px', margin: '0 0 22px' }}>
            Free digital proof on every order. Tell us what you need and we&apos;ll come back within 3 business hours.
          </p>
          <QuoteButton label="Get a Quote" source="blog"
            style={{ background: GOLD, color: '#fff', padding: '16px 40px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '15px', fontFamily: '"DM Sans", sans-serif', letterSpacing: '0.5px' }} />
        </div>
      </section>

      {(relatedProducts.length > 0 || (post.related_pages || []).length > 0) && (
        <section style={{ maxWidth: '1400px', margin: '0 auto', padding: '48px 40px 72px' }}>
          {relatedProducts.length > 0 && (
            <>
              <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '28px', color: NAVY, fontWeight: 600, margin: '0 0 20px' }}>
                Products mentioned in this article
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                {relatedProducts.map(p => {
                  const img = getFirstImage(p);
                  const price = getLowestPrice(p);
                  return (
                    <Link key={p.id} href={`/products/${p.slug}`} style={{ textDecoration: 'none' }}>
                      <article style={{ height: '100%', background: '#fff', border: '1px solid #E0DDD7', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 7px rgba(0,0,0,.05)', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ height: '170px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                          {img ? <img src={cld(img, 400)} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '12px', boxSizing: 'border-box' }} /> : <span>📦</span>}
                        </div>
                        <div style={{ padding: '12px 14px 16px', textAlign: 'center' }}>
                          <div style={{ color: NAVY, fontSize: '14px', fontWeight: 700, lineHeight: 1.35, marginBottom: '6px' }}>{p.name}</div>
                          {p.quote_only ? (
                            <div style={{ textAlign: 'center' }}>
                              <div style={{ fontSize: '11px', color: '#000' }}>&nbsp;</div>
                              <div style={{ color: GOLD, fontSize: '14px', fontWeight: 700 }}>Get a Quote</div>
                            </div>
                          ) : price > 0 && <div style={{ color: GOLD, fontSize: '16px' }}>As low as ${price.toFixed(2)}</div>}
                        </div>
                      </article>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
          {(post.related_pages || []).length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: NAVY, textTransform: 'uppercase', letterSpacing: '0.8px' }}>Keep browsing</span>
              {post.related_pages.map(rp => (
                <Link key={rp.slug} href={`/${rp.slug}`}
                  style={{ fontSize: '12.5px', color: NAVY, textDecoration: 'none', border: '1px solid #E0DDD7', borderRadius: '20px', padding: '5px 14px', fontWeight: 600 }}>
                  {rp.label}
                </Link>
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
}

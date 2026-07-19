/* eslint-disable @next/next/no-img-element */
// /blog — index of published posts (CMS Phase 2).
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { absoluteUrl } from '@/lib/siteUrl';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';

export const revalidate = 300;

export const metadata = {
  title: 'Blog — Promotional Product Guides & Ideas | QuirkyPromo',
  description: 'Practical guides, ideas and buying advice for promotional products in Australia, from the QuirkyPromo team.',
  alternates: { canonical: absoluteUrl('/blog') },
};

export default async function BlogIndexPage() {
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('title, slug, author, cover_image_url, cover_image_alt, meta_description, published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(100);

  return (
    <main style={{ fontFamily: '"DM Sans", sans-serif', background: '#fff', color: '#000', minHeight: '100vh' }}>
      <section style={{ background: NAVY, padding: '80px 40px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '48px', color: '#fff', fontWeight: 600, margin: '0 0 12px' }}>
            The QuirkyPromo Blog
          </h1>
          <p style={{ color: 'rgba(255,255,255,.82)', fontSize: '16px', margin: 0, maxWidth: 720 }}>
            Guides, ideas and straight answers on promotional products for Australian businesses.
          </p>
        </div>
      </section>

      <section style={{ maxWidth: '1400px', margin: '0 auto', padding: '48px 40px 72px' }}>
        {(!posts || posts.length === 0) ? (
          <p style={{ color: '#000' }}>Articles are on the way — check back soon.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {posts.map(p => (
              <Link key={p.slug} href={`/blog/${p.slug}`} style={{ textDecoration: 'none' }}>
                <article style={{ height: '100%', background: '#fff', border: '1px solid #E0DDD7', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 7px rgba(0,0,0,.05)', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ height: '180px', background: NAVY, overflow: 'hidden' }}>
                    {p.cover_image_url && (
                      <img src={p.cover_image_url} alt={p.cover_image_alt || p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    )}
                  </div>
                  <div style={{ padding: '18px 20px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '22px', color: NAVY, margin: 0, fontWeight: 600, lineHeight: 1.25 }}>{p.title}</h2>
                    {p.meta_description && <p style={{ fontSize: '14px', color: '#000', lineHeight: 1.65, margin: 0 }}>{p.meta_description}</p>}
                    <div style={{ marginTop: 'auto', fontSize: '12px', color: '#000' }}>
                      {p.author} · {p.published_at ? new Date(p.published_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                      <span style={{ color: GOLD, fontWeight: 700, marginLeft: 10 }}>Read →</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

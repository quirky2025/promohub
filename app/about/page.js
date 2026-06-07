import Link from 'next/link';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';
const BG = '#F8F7F4';

export default function AboutPage() {
  return (
    <div style={{ background: '#fff', fontFamily: '"DM Sans", sans-serif' }}>

      {/* HERO */}
      <div style={{ background: NAVY, padding: '100px 40px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ width: '48px', height: '2px', background: GOLD, margin: '0 auto 32px' }} />
          <h1 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 'clamp(48px, 6vw, 80px)', fontWeight: 600, color: '#fff', letterSpacing: '2px', lineHeight: 1.1, margin: '0 0 24px' }}>
            Our Story
          </h1>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, margin: 0 }}>
            Thirteen years. One vision. Built from the ground up.
          </p>
          <div style={{ width: '48px', height: '2px', background: GOLD, margin: '32px auto 0' }} />
        </div>
      </div>

      {/* STORY */}
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '80px 40px' }}>
        <p style={{ fontSize: '20px', lineHeight: 1.9, color: '#2A2A2A', marginBottom: '32px', fontWeight: 400 }}>
          QuirkyPromo didn't start with a business plan — it started with a chance encounter.
        </p>
        <p style={{ fontSize: '16px', lineHeight: 1.9, color: '#5A5A5A', marginBottom: '28px' }}>
          Back in 2012, I was in China with a simple idea: find quality products and bring them to Australia. Having spent a year in China's promotional products export industry, I knew the factories, I knew the quality, and I believed there was a better way to connect Australian businesses with the products they needed.
        </p>
        <p style={{ fontSize: '16px', lineHeight: 1.9, color: '#5A5A5A', marginBottom: '28px' }}>
          It was a flag base factory that changed everything. They had an Australian client but no one who could speak English — so they introduced me to Darren. We met right there in my city, and that handshake would shape the next decade of my life.
        </p>
        <p style={{ fontSize: '16px', lineHeight: 1.9, color: '#5A5A5A', marginBottom: '28px' }}>
          When I arrived in Australia, Darren connected me with Daily Press — a company looking for a reliable sourcing partner. That first order was the beginning of everything.
        </p>
        <p style={{ fontSize: '16px', lineHeight: 1.9, color: '#5A5A5A' }}>
          For over 13 years, I've been building this business — one order, one client, one relationship at a time. What started as sourcing from Chinese factories evolved into a full-service promotional products business, combining deep manufacturing knowledge with the service standards Australian corporates expect.
        </p>
      </div>

      {/* STATS */}
      <div style={{ background: NAVY, padding: '80px 40px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px', textAlign: 'center' }}>
          {[
            { number: '13+', label: 'Years in Business' },
            { number: '2,800+', label: 'Products Available' },
            { number: 'Australia Wide', label: 'Delivery' },
          ].map(({ number, label }) => (
            <div key={label}>
              <div style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: 600, color: GOLD, lineHeight: 1, marginBottom: '12px' }}>
                {number}
              </div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 600 }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* NEXT CHAPTER */}
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '80px 40px' }}>
        <div style={{ width: '40px', height: '2px', background: GOLD, marginBottom: '40px' }} />
        <h2 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 600, color: NAVY, marginBottom: '32px', lineHeight: 1.2 }}>
          Why QuirkyPromo?
        </h2>
        <p style={{ fontSize: '16px', lineHeight: 1.9, color: '#5A5A5A', marginBottom: '40px' }}>
          For too long, promotional products have been stuck in the old way — call for a quote, wait days for a response, hidden pricing, slow turnarounds. We've seen it from the inside, and we knew there had to be a better way.
        </p>
        <p style={{ fontSize: '18px', lineHeight: 1.9, color: '#2A2A2A', marginBottom: '40px', fontWeight: 500 }}>
          QuirkyPromo was built to change that. We believe every Australian business deserves access to premium promotional products at transparent, honest prices — no phone calls required.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {[
            { title: 'Transparent Pricing', desc: 'See your price instantly, at any quantity. No hidden fees, no surprises.' },
            { title: 'Fast Online Ordering', desc: 'Place your order in minutes, not days. Available any time, any device.' },
            { title: 'Quick Turnaround', desc: 'Local stock means faster delivery to your door, Australia wide.' },
            { title: 'Dedicated Service', desc: 'Real people who know this industry inside out, ready to help when you need it.' },
            { title: 'Direct Factory Relationships', desc: 'For custom and made-to-order products, our 13 years of sourcing experience means better quality and better value.' },
          ].map(({ title, desc }) => (
            <div key={title} style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: GOLD, marginTop: '8px', flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 700, color: NAVY, fontSize: '15px', marginBottom: '4px' }}>{title}</div>
                <div style={{ color: '#7A7570', fontSize: '14px', lineHeight: 1.7 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CLOSING STATEMENT */}
      <div style={{ background: '#fff', borderTop: '1px solid #E0DDD7', borderBottom: '1px solid #E0DDD7', padding: '80px 40px', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <p style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 600, color: NAVY, lineHeight: 1.4, marginBottom: '8px' }}>
            One person. Thirteen years. One vision.
          </p>
          <p style={{ fontSize: '15px', color: '#7A7570', marginBottom: '40px' }}>
            Promotional products shouldn't be a luxury. They should be accessible, affordable, and easy — for every brand, every budget, every occasion.
          </p>
          <Link href="/category" style={{ display: 'inline-block', background: GOLD, color: '#fff', padding: '16px 40px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '15px', letterSpacing: '0.5px' }}>
            Browse Our Products
          </Link>
        </div>
      </div>

    </div>
  );
}

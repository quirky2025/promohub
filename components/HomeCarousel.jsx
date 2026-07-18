'use client';

// Homepage banner carousel. Slides are managed in admin → Catalog → Banners →
// 首页轮播 (page_banners, page_type='home', page_key='carousel').
// Renders nothing at all if there are no active slides, so the homepage is
// unchanged until Lily adds one.

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';
const INTERVAL = 6000;

export default function HomeCarousel() {
  const [slides, setSlides] = useState([]);
  const [i, setI] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await supabase
          .from('page_banners').select('*')
          .eq('page_type', 'home').eq('page_key', 'carousel').eq('is_active', true)
          .order('sort_order', { ascending: true });
        if (!cancelled) setSlides((data || []).filter(s => s.image_url));
      } catch { /* table may not exist yet — render nothing */ }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (slides.length < 2) return;
    const id = setInterval(() => setI(v => (v + 1) % slides.length), INTERVAL);
    return () => clearInterval(id);
  }, [slides.length]);

  if (!slides.length) return null;
  const s = slides[Math.min(i, slides.length - 1)];
  const ov = (s.overlay_pct ?? 45) / 100;

  return (
    <section aria-label="Featured" style={{ position: 'relative', borderBottom: '1px solid #E0DDD7' }}>
      <div style={{
        position: 'relative',
        minHeight: 340,
        display: 'flex', alignItems: 'center',
        background: `linear-gradient(rgba(27,42,74,${ov}), rgba(27,42,74,${ov})), url(${s.image_url}) center/cover no-repeat`,
        transition: 'background-image .4s ease',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '56px 40px', width: '100%', textAlign: 'center' }}>
          {s.headline && (
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 40, fontWeight: 600, color: '#fff', margin: '0 0 10px', textShadow: '0 2px 14px rgba(0,0,0,.45)' }}>
              {s.headline}
            </h2>
          )}
          {s.subheadline && (
            <p style={{ color: 'rgba(255,255,255,.9)', fontSize: 16, margin: '0 0 20px', textShadow: '0 1px 10px rgba(0,0,0,.5)' }}>
              {s.subheadline}
            </p>
          )}
          {s.cta_label && s.cta_href && (
            <a href={s.cta_href} style={{ display: 'inline-block', background: GOLD, color: NAVY, textDecoration: 'none', padding: '13px 30px', borderRadius: 10, fontWeight: 700, fontSize: 15 }}>
              {s.cta_label}
            </a>
          )}
        </div>

        {slides.length > 1 && (
          <div style={{ position: 'absolute', bottom: 16, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 8 }}>
            {slides.map((_, k) => (
              <button key={k} onClick={() => setI(k)} aria-label={`Slide ${k + 1}`}
                style={{ width: 10, height: 10, borderRadius: '50%', border: 'none', cursor: 'pointer', padding: 0, background: k === i ? '#fff' : 'rgba(255,255,255,.45)' }} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

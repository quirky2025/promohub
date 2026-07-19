import { NextResponse } from 'next/server';
import { isAdmin, unauthorized } from '@/lib/adminAuth';
import { sourcingDb } from '@/lib/sourcingDb';
import { resolveCollectionProducts } from '@/lib/smartCollections';
import { calculatorFromPrice } from '@/lib/decorationPricing';

// D8 — live preview for the rule builder: hit count + first 24 cards.
function cardPrice(p) {
  if (p.decoration_model === 'calculator') return calculatorFromPrice(p) || 0;
  if (!p.pricing_tiers?.length) return 0;
  const v = p.pricing_tiers.map(t => parseFloat(t.base_price)).filter(Number.isFinite);
  return v.length ? Math.min(...v) * 1.4 : 0;
}
function firstImage(p) {
  const sorted = [...(p.product_colours || [])].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  const imgs = sorted[0]?.images;
  const arr = Array.isArray(imgs) ? imgs : imgs ? Object.values(imgs) : [];
  return arr[0] || null;
}

export async function POST(request) {
  if (!(await isAdmin(request))) return unauthorized();
  try {
    const b = await request.json();
    const { products, count } = await resolveCollectionProducts(sourcingDb(), {
      rules: b.rules, pinned: b.pinned, excluded: b.excluded,
    });
    return NextResponse.json({
      count,
      thin: count < 4, // spec: warn "collection too thin to publish"
      sample: products.slice(0, 24).map(p => ({
        id: p.id, name: p.name, slug: p.slug,
        image: firstImage(p),
        price: cardPrice(p),
        min_qty: p.min_qty,
        pinned: false,
      })),
    });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

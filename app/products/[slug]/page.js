import { createClient } from '@supabase/supabase-js';
import ProductClient from './ProductClient';
import { COLOUR_SWATCH } from '@/lib/colourSwatch';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function extractImgNum(url) {
  const match = url.match(/-(\d+)\.\w+$/);
  return match ? parseInt(match[1]) : 999;
}

export default async function ProductPage({ params }) {
  const { slug } = await params;

  const { data: product, error } = await supabase
    .from('products')
    .select(`
      *,
      product_colours(id, name, hex, images, sort_order),
      pricing_tiers(id, min_qty, max_qty, base_price, sort_order),
      decoration_options(id, name, detail, per_unit, has_setup, default_setup_qty, setup_qty_editable, sort_order, type)
    `)
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (!product) return (
    <div style={{ padding: '4rem', textAlign: 'center', fontFamily: '"DM Sans", sans-serif', color: '#1B2A4A' }}>
      Product not found
    </div>
  );

  const pricingTiers = [...(product.pricing_tiers || [])].sort((a, b) => a.sort_order - b.sort_order);
  const decorations = [...(product.decoration_options || [])].sort((a, b) => a.sort_order - b.sort_order);

  // ── GET COLOUR NAMES ──
  let colourData = [];
  let fromColoursField = false;
  if (product.colours) {
    if (Array.isArray(product.colours)) {
      colourData = product.colours;
    } else if (typeof product.colours === 'string') {
      try { colourData = JSON.parse(product.colours); } catch (e) {}
    }
  }
  fromColoursField = colourData.length > 0;
  colourData = colourData.map(c => ({ ...c, hex: c.hex || COLOUR_SWATCH[c.name] || '' }));

  if (colourData.length === 0) {
    const pcRecords = [...(product.product_colours || [])].sort((a, b) => a.sort_order - b.sort_order);
    const nonDefault = pcRecords.filter(pc => pc.name && pc.name !== 'Default');
    if (nonDefault.length > 0) {
      colourData = nonDefault.map(pc => ({ name: pc.name, hex: pc.hex || '' }));
    }
  }

  const colourCount = colourData.length;

  // ── GET ALL IMAGES sorted by number in URL ──
  const rawColours = [...(product.product_colours || [])].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

  // Find first product_colour with images, fallback to first record
  let imageSource = null;
  for (const pc of rawColours) {
    if (pc?.images && (Array.isArray(pc.images) ? pc.images.length > 0 : Object.keys(pc.images).length > 0)) {
      imageSource = pc;
      break;
    }
  }
  imageSource = imageSource || rawColours[0];

  const rawImages = imageSource?.images
    ? (Array.isArray(imageSource.images) ? imageSource.images : Object.values(imageSource.images))
    : [];

  const sortedImages = [...rawImages].sort((a, b) => extractImgNum(a) - extractImgNum(b));

  // ── SPLIT IMAGES ──
  // [0] = main hero image; [1..colourCount] = per-colour pool; rest = extras
  const mainImage = sortedImages[0] || null;
  // 刻意色块系:colours 字段存在且全员无图 → 图池不发牌,除主图外全部进轮播
  const allSwatch = fromColoursField && colourCount > 0 && colourData.every(c => !c.image && (!Array.isArray(c.images) || c.images.length === 0));
  const colourImages = allSwatch ? [] : sortedImages.slice(1, colourCount + 1);
  const extraImages = allSwatch ? sortedImages.slice(1) : sortedImages.slice(colourCount + 1);

  // ── BUILD COLOUR OBJECTS ──
  // priority: inline image on colour entry > image pool slice > none (swatch fallback in UI)
  let colours = colourData.map((c, i) => {
    const img = c.image || (Array.isArray(c.images) && c.images[0]) || colourImages[i] || null;
    return { id: i, name: c.name || `Colour ${i + 1}`, hex: c.hex || null, image: img, images: img ? [img] : [] };
  });

  // 色块系产品(所有颜色都自带或都无图,不吃图池)→ 图池整体让位给主图轮播
  const poolUsed = colours.some(c => c.image && colourImages.includes(c.image));
  const finalExtras = poolUsed ? extraImages : sortedImages.slice(1);

  return (
    <ProductClient
      product={product}
      mainImage={mainImage}
      extraImages={finalExtras}
      colours={colours}
      pricingTiers={pricingTiers}
      decorations={decorations}
      secondaryColours={product.secondary_colours || null}
    />
  );
}
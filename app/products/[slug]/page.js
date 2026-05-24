import { createClient } from '@supabase/supabase-js';
import ProductClient from './ProductClient';

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
    .single();

  if (error) console.error('Product fetch error:', error);
  if (!product) return (
    <div style={{ padding: '4rem', textAlign: 'center', fontFamily: '"DM Sans", sans-serif', color: '#1B2A4A' }}>
      Product not found
    </div>
  );

  const pricingTiers = [...(product.pricing_tiers || [])].sort((a, b) => a.sort_order - b.sort_order);
  const allDecorations = [...(product.decoration_options || [])].sort((a, b) => a.sort_order - b.sort_order);

  // Split decorations by type
  const brandingDecorations = allDecorations.filter(d => d.type !== 'addon');
  const addonDecorations = allDecorations.filter(d => d.type === 'addon');

  let colourData = [];
  if (product.colours) {
    if (Array.isArray(product.colours)) {
      colourData = product.colours;
    } else if (typeof product.colours === 'string') {
      try { colourData = JSON.parse(product.colours); } catch (e) {}
    }
  }

  if (colourData.length === 0) {
    const pcRecords = [...(product.product_colours || [])].sort((a, b) => a.sort_order - b.sort_order);
    const nonDefault = pcRecords.filter(pc => pc.name && pc.name !== 'Default');
    if (nonDefault.length > 0) {
      colourData = nonDefault.map(pc => ({ name: pc.name, hex: pc.hex || '' }));
    }
  }

  const colourCount = colourData.length;

  const rawColours = [...(product.product_colours || [])].sort((a, b) => a.sort_order - b.sort_order);
  const firstColour = rawColours[0];
  const rawImages = firstColour?.images
    ? (Array.isArray(firstColour.images) ? firstColour.images : Object.values(firstColour.images))
    : [];
  const sortedImages = [...rawImages].sort((a, b) => extractImgNum(a) - extractImgNum(b));

  const mainImage = sortedImages[0] || null;
  const colourImages = sortedImages.slice(1, colourCount + 1);
  const extraImages = sortedImages.slice(colourCount + 1);

  const colours = colourCount > 0
    ? colourData.map((c, i) => ({
        id: i,
        name: c.name || `Colour ${i + 1}`,
        hex: c.hex || null,
        image: colourImages[i] || null,
        images: colourImages[i] ? [colourImages[i]] : [],
      }))
    : [];

  return (
    <ProductClient
      product={product}
      mainImage={mainImage}
      extraImages={colourCount > 0 ? extraImages : sortedImages.slice(1)}
      colours={colours}
      pricingTiers={pricingTiers}
      brandingDecorations={brandingDecorations}
      addonDecorations={addonDecorations}
    />
  );
}

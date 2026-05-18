import { createClient } from '@supabase/supabase-js';
import ProductClient from './ProductClient';

const supabase = createClient(
  'https://ztfmeopyknfzmxvbpnxo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0Zm1lb3B5a25mem14dmJwbnhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4NzgyNDMsImV4cCI6MjA5NDQ1NDI0M30.wKUraRxUq9yJNDeeOQ-X_ek3Wx_GMmeaSMxq9RyboKY'
);

export default async function ProductPage({ params }) {
  const { id } = await params;

  const { data: product, error } = await supabase
    .from('products')
    .select(`
      *,
      product_colours(id, name, hex, images, sort_order),
      pricing_tiers(id, min_qty, max_qty, base_price, sort_order),
      decoration_options(id, name, detail, per_unit, has_setup, default_setup_qty, setup_qty_editable, sort_order)
    `)
    .eq('id', id)
    .single();

  if (error) console.error('Product fetch error:', error);
  if (!product) return <div style={{ padding: '2rem' }}>Product not found</div>;

  // Sort Cloudinary images by the number in filename (0.jpg, 1.jpg, 2.jpg...)
  const allImages = [...(product.product_colours?.[0]?.images || [])]
    .sort((a, b) => {
      const numA = parseInt(a.match(/(\d+)\.jpg$/i)?.[1] ?? '0');
      const numB = parseInt(b.match(/(\d+)\.jpg$/i)?.[1] ?? '0');
      return numA - numB;
    });

  // Colour names/hex from products.colours field
  const colourData = typeof product.colours === 'string'
    ? JSON.parse(product.colours)
    : (product.colours || []);

  const numColours = colourData.length;

  // images[0] = main image
  // images[1] to images[numColours] = colour images
  // images[numColours+1] onwards = extra images (feature, packaging, belly band etc.)
  const mainImage = allImages[0] || null;

  const colours = colourData.map((c, i) => ({
    name: c.name,
    hex: c.hex || '',
    image: allImages[i + 1] || null,
  }));

  const extraImages = allImages.slice(numColours + 1);

  const pricingTiers = [...(product.pricing_tiers || [])].sort((a, b) => a.sort_order - b.sort_order);
  const decorations = [...(product.decoration_options || [])].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <ProductClient
      product={product}
      mainImage={mainImage}
      colours={colours}
      extraImages={extraImages}
      pricingTiers={pricingTiers}
      decorations={decorations}
    />
  );
}
import { createClient } from '@supabase/supabase-js';
import ProductClient from './ProductClient';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function ProductPage({ params }) {
  const { slug } = await params;

  const { data: product, error } = await supabase
    .from('products')
    .select(`
      *,
      product_colours(id, name, hex, images, sort_order),
      pricing_tiers(id, min_qty, max_qty, base_price, sort_order),
      decoration_options(id, name, detail, per_unit, has_setup, default_setup_qty, setup_qty_editable, sort_order)
    `)
    .eq('slug', slug)
    .single();

  if (!product) return (
    <div style={{ padding: '4rem', textAlign: 'center', fontFamily: '"DM Sans", sans-serif', color: '#1B2A4A' }}>
      Product not found
    </div>
  );

  const colours = [...(product.product_colours || [])].sort((a, b) => a.sort_order - b.sort_order);
  const pricingTiers = [...(product.pricing_tiers || [])].sort((a, b) => a.sort_order - b.sort_order);
  const decorations = [...(product.decoration_options || [])].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <ProductClient
      product={product}
      colours={colours}
      pricingTiers={pricingTiers}
      decorations={decorations}
    />
  );
}

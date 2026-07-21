import { createClient } from '@supabase/supabase-js';
import ProductClient from './ProductClient';
import ASColourClient from './ASColourClient';
import ProductJsonLd from './ProductJsonLd';
import { startingUnitPrice } from '@/lib/decorationPricing';
import { getAlsoFoundIn } from '@/lib/alsoFoundIn';
import { COLOUR_SWATCH } from '@/lib/colourSwatch';
import { colourSlug } from '@/lib/colourName';
import { absoluteUrl } from '@/lib/siteUrl';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const BRAND = 'QuirkyPromo';

// 平铺画廊 + 主图取第0位:PromoBrands / AS Colour(及后续所有走计算器的服装品牌,如 Gildan)
const FLAT_GALLERY_SUPPLIERS = ['PromoBrands', 'AS Colour'];
function useFlatGallery(product) {
  return FLAT_GALLERY_SUPPLIERS.includes(product?.supplier) || product?.decoration_model === 'calculator';
}

// 计算器产品的印刷类型(决定可用印刷方式 → 起步价)。默认 apparel。
// ⚠ 必须与 ASColourClient.jsx 的 decoType 逐字一致 → "from $X" 分类 = JSON-LD offer 分类。
function decoType(product) {
  const s = `${product?.category || ''} ${product?.subcategory || ''}`.toLowerCase();
  if (/\b(hat|cap|beanie|headwear|visor)\b/.test(s)) return 'hats';
  if (/\b(bag|tote|backpack|pouch|satchel|duffle)\b/.test(s)) return 'bags';
  return 'apparel';
}

// Append the brand once, never twice (SEO Rulebook §6 title format).
function withBrand(title) {
  if (!title) return null;
  return title.includes(BRAND) ? title : `${title} | ${BRAND}`;
}

// SEO Rulebook §5 + §6: every TRENDS product page must declare its own
// canonical (/products/[slug]) and a product-specific title/meta instead of
// inheriting the homepage canonical ('/') from the root layout.
export async function generateMetadata({ params, searchParams }) {
  const { slug } = await params;

  // 4B-3: a colour-variant URL (/products/[slug]?colour=...) must NOT be indexed
  // (faceted noindex, Rulebook §A) but its canonical still points at the base
  // product URL, so equity consolidates on /products/[slug].
  const sp = searchParams ? await searchParams : {};
  const hasColour = typeof sp.colour === 'string' && sp.colour.length > 0;

  const { data: product } = await supabase
    .from('products')
    .select('name, display_title, slug, meta_title, meta_description, seo_description, category, subcategory, materials, is_eco')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  // Canonical always points at the product's own URL, even before the page
  // is fully populated, so search engines never fold it into the homepage.
  const canonical = absoluteUrl(`/products/${slug}`);

  if (!product) {
    return {
      title: `Product Not Found | ${BRAND}`,
      alternates: { canonical },
      robots: { index: false, follow: true },
    };
  }


  // PRODUCT_TITLE_ENRICHMENT: display_title (when populated) feeds the customer-
  // facing title/H1/JSON-LD; internal `name` keeps serving search/cart/invoices.
  const displayName = product.display_title || product.name;

  // Enriched titles carry their own commercial qualifier (Custom / Promotional /
  // Logo Printed…) — don't wrap them in the template or Google sees "Custom Custom …".
  const hasQualifier = /^(custom|customised|promotional|advertising|logo\s?printed|imprinted|branded|personalised|printed)\b/i.test(displayName);

  const title =
    withBrand(product.meta_title) ||
    (hasQualifier ? `${displayName} | ${BRAND}` : `Custom ${displayName} with Logo | ${BRAND}`);

  const description =
    product.meta_description ||
    product.seo_description ||
    `Order custom ${displayName.toLowerCase()} with your logo for corporate gifts, events and brand promotions. ` +
      `${product.materials ? product.materials + '. ' : ''}` +
      `Fast Australia-wide delivery, branding options and bulk quote support.`;

  return {
    title,
    description,
    alternates: { canonical },
    // base URL stays indexable; ?colour= variant URLs are noindex,follow.
    robots: hasColour ? { index: false, follow: true } : undefined,
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
      siteName: BRAND,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

function extractImgNum(url) {
  const match = url.match(/-(\d+)\.\w+$/);
  return match ? parseInt(match[1]) : 999;
}

export default async function ProductPage({ params, searchParams }) {
  const { slug } = await params;

  const { data: product, error } = await supabase
    .from('products')
    .select(`
      *,
      product_colours(id, name, hex, images, sort_order),
      pricing_tiers(id, min_qty, max_qty, base_price, sort_order),
      decoration_options(id, name, detail, per_unit, has_setup, setup_fee, default_setup_qty, setup_qty_editable, sort_order, type)
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

  // D9: "Also found in" internal links (scenario collections > colours > subcategory > eco > brand)
  const alsoFoundIn = await getAlsoFoundIn(product);

  // D11: supplier live stock (empty for suppliers not yet synced → block hidden)
  const { data: stockRows } = await supabase
    .from('product_stock')
    .select('colour_name, qty, next_shipment, synced_at')
    .eq('product_id', product.id);

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

  const sortedImages = useFlatGallery(product)
    ? [...rawImages]
    : [...rawImages].sort((a, b) => extractImgNum(a) - extractImgNum(b));

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
  const finalExtras = useFlatGallery(product)
    ? sortedImages.slice(1)
    : (poolUsed ? extraImages : sortedImages.slice(1));

  // ── 4B-3: SSR pre-select colour from ?colour=<colour_slug> ──
  // colourSlug() is the SAME function the 4B-2 backfill used, so the slug here is
  // byte-identical to product_variants.colour_slug — the URL always matches the DB.
  const sp = searchParams ? await searchParams : {};
  const wantColour = typeof sp.colour === 'string' ? sp.colour : null;
  let initialColourIndex = null;
  if (wantColour) {
    const i = colourData.findIndex(c => colourSlug(c.name) === wantColour);
    if (i >= 0) initialColourIndex = i;
  }

  // calculator 产品:JSON-LD offer 价 = 真实起步价(衣服×1.4 + 最便宜印刷),
  // 不是空白衣服价 —— 与 PDP "from $X" 同一个 startingUnitPrice(),页面价=结构化价。
  const isCalc = product.decoration_model === 'calculator';
  let offerPrice = null;
  if (isCalc) {
    const bases = pricingTiers.map(t => Number(t.base_price)).filter(n => Number.isFinite(n) && n > 0);
    const garmentBase = bases.length ? Math.min(...bases) : 0;
    offerPrice = startingUnitPrice(garmentBase, decoType(product));
  }

  return (
    <>
      <ProductJsonLd
        product={product}
        images={[mainImage, ...finalExtras]}
        pricingTiers={pricingTiers}
        offerPrice={offerPrice}
      />
      {isCalc ? (
        <ASColourClient
          product={product}
          mainImage={mainImage}
          extraImages={finalExtras}
          colours={colours}
          pricingTiers={pricingTiers}
          initialColourIndex={initialColourIndex}
          alsoFoundIn={alsoFoundIn}
        />
      ) : (
        <ProductClient
          product={product}
          mainImage={mainImage}
          extraImages={finalExtras}
          colours={colours}
          pricingTiers={pricingTiers}
          decorations={decorations}
          secondaryColours={product.secondary_colours || null}
          initialColourIndex={initialColourIndex}
          alsoFoundIn={alsoFoundIn}
          stockRows={stockRows || []}
        />
      )}
    </>
  );
}

const slugify = (name) => (name || '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

const CATEGORY_URLS = [
  {
    label: 'Apparel',
    href: '/custom-branded-apparel-australia',
    children: [
      ['Apparel Accessories', '/branded-apparel-accessories-australia'],
      ['Aprons', '/custom-aprons-australia'],
      ['Hoodies', '/custom-hoodies-australia'],
      ['Jackets', '/custom-jackets-australia'],
      ['Pants & Shorts', '/workwear-pants-and-shorts-australia'],
      ['Polo Shirts', '/custom-polo-shirts-australia'],
      ['Scarves & Gloves', '/branded-scarves-and-accessories-australia'],
      ['Shirts', '/custom-shirts-australia'],
      ['Socks', '/custom-socks-australia'],
      ['Sweatshirts', '/custom-sweatshirts-australia'],
      ['Teamwear', '/custom-teamwear-australia'],
      ['T-Shirts', '/custom-t-shirts-australia'],
      ['Vests', '/custom-vests-australia'],
      ['Workwear', '/branded-workwear-australia'],
    ],
  },
  {
    label: 'Bags',
    href: '/custom-bags-australia',
    children: [
      ['Backpacks', '/custom-backpacks-australia'],
      ['Cooler Bags', '/custom-cooler-bags-australia'],
      ['Cotton Tote Bags', '/custom-cotton-tote-bags-australia'],
      ['Crossbody & Belt Bags', '/crossbody-bags-australia'],
      ['Drawstring Bags', '/custom-drawstring-bags-australia'],
      ['Dry Bags', '/dry-bags-australia'],
      ['Jute Bags', '/jute-bags-australia'],
      ['Laptop Bags', '/custom-laptop-bags-australia'],
      ['Paper Bags', '/custom-paper-bags-australia'],
      ['Satchel Bags', '/satchel-bags-australia'],
      ['Toiletry Bags', '/custom-toiletry-bags-australia'],
      ['Tote Bags', '/custom-tote-bags-australia'],
      ['Travel & Duffle Bags', '/custom-duffle-bags-australia'],
      ['Wine Carriers', '/wine-carriers-australia'],
    ],
  },
  {
    label: 'Barware & Accessories',
    href: '/branded-barware-australia',
    children: [
      ['Bar Accessories', '/bar-accessories-australia'],
      ['Bar Mats', '/custom-bar-mats-australia'],
      ['Bottle Openers', '/custom-bottle-openers-australia'],
      ['Coasters', '/custom-coasters-australia'],
      ['Stubby Holders', '/custom-stubby-holders-australia'],
      ['Wine Accessories', '/branded-wine-accessories-australia'],
    ],
  },
  {
    label: 'Drinkware',
    href: '/custom-drinkware-australia',
    children: [
      ['Coffee Cups', '/custom-coffee-cups-australia'],
      ['Drink Bottles', '/custom-drink-bottles-australia'],
      ['Flasks', '/custom-flasks-australia'],
      ['Glassware', '/branded-glassware-australia'],
      ['Mugs', '/custom-mugs-australia'],
      ['Teaware', '/custom-teaware-australia'],
      ['Travel Mugs', '/custom-travel-mugs-australia'],
      ['Tumblers', '/custom-tumblers-australia'],
    ],
  },
  {
    label: 'Flags & Displays',
    href: '/trade-show-displays-australia',
    children: [
      ['A-Frames & Signage', '/a-frame-signage-australia'],
      ['Feather & Teardrop Flags', '/custom-feather-flags-australia'],
      ['Marquees', '/custom-marquees-australia'],
      ['Media Walls', '/media-walls-australia'],
      ['Pull Up Banners', '/pull-up-banners-australia'],
      ['Table Covers', '/custom-table-covers-australia'],
    ],
  },
  {
    label: 'Giveaways & Event Accessories',
    href: '/promotional-giveaways-australia',
    children: [
      ['Badges', '/custom-badges-australia'],
      ['Balloons', '/custom-balloons-australia'],
      ['ID Holders', '/id-card-holders-australia'],
      ['Lanyards', '/custom-lanyards-australia'],
      ['Magnets', '/custom-fridge-magnets-australia'],
      ['Novelty Giveaways', '/novelty-giveaways-australia'],
      ['Stickers & Patches', '/promotional-stickers-and-patches-australia'],
      ['Temporary Tattoos', '/temporary-tattoos-australia'],
      ['Wristbands', '/custom-wristbands-australia'],
    ],
  },
  {
    label: 'Headwear',
    href: '/custom-headwear-australia',
    children: [
      ['Beanies', '/custom-beanies-australia'],
      ['Bucket Hats', '/custom-bucket-hats-australia'],
      ['Caps', '/custom-caps-australia'],
      ['Novelty Headwear', '/novelty-headwear-australia'],
      ['Straw Hats', '/straw-hats-australia'],
      ['Visors', '/custom-visors-australia'],
      ['Wide Brim Hats', '/custom-wide-brim-hats-australia'],
    ],
  },
  {
    label: 'Home & Living',
    href: '/branded-homewares-australia',
    children: [
      ['Candles & Diffusers', '/candles-and-diffusers-australia'],
      ['Cheese & Serving Boards', '/cheese-boards-australia'],
      ['Home Decor', '/promotional-home-decor-australia'],
      ['Kitchen & Dining', '/custom-kitchenware-australia'],
    ],
  },
  {
    label: 'Key Rings',
    href: '/custom-keyrings-australia',
    children: [
      ['Eco Keyrings', '/eco-keyrings-australia'],
      ['Functional Keyrings', '/functional-keyrings-australia'],
      ['Leather Keyrings', '/leather-keyrings-australia'],
      ['Metal Keyrings', '/custom-metal-keyrings-australia'],
      ['Novelty Keyrings', '/novelty-keyrings-australia'],
      ['Silicone & PVC Keyrings', '/silicone-keyrings-australia'],
    ],
  },
  {
    label: 'Marketing Materials',
    href: '/printed-marketing-materials-australia',
    children: [
      ['Business Cards', '/business-cards-australia'],
      ['Labels & Stickers', '/custom-stickers-australia'],
      ['Resin Labels', '/resin-labels-australia'],
    ],
  },
  {
    label: 'Office & Desk',
    href: '/branded-office-supplies-australia',
    children: [
      ['Desk Items', '/desk-accessories-australia'],
      ['Note Pads', '/custom-note-pads-australia'],
      ['Notebooks', '/branded-notebooks-australia'],
      ['Pads & Planners', '/custom-planners-australia'],
      ['Pencil Cases', '/custom-pencil-cases-australia'],
      ['Portfolios & Compendiums', '/custom-compendiums-australia'],
      ['Rulers', '/custom-rulers-australia'],
      ['Stationery', '/custom-stationery-australia'],
      ['Sticky Notes', '/custom-sticky-notes-australia'],
    ],
  },
  {
    label: 'Outdoor & Sports',
    href: '/outdoor-promotional-products-australia',
    children: [
      ['Blankets', '/picnic-blankets-australia'],
      ['Camping & Outdoors', '/camping-gear-australia'],
      ['Golf Products', '/custom-golf-products-australia'],
      ['Picnic & BBQ', '/picnic-and-bbq-australia'],
      ['Sports Products', '/promotional-sports-products-australia'],
      ['Sunglasses', '/custom-sunglasses-australia'],
      ['Supporter Gear', '/custom-supporter-gear-australia'],
      ['Towels', '/custom-towels-australia'],
      ['Umbrellas', '/custom-umbrellas-australia'],
    ],
  },
  {
    label: 'Packaging',
    href: '/custom-packaging-australia',
    children: [
      ['Gift Bags', '/custom-gift-bags-australia'],
      ['Gift Boxes', '/custom-gift-boxes-australia'],
      ['Gift Tubes', '/gift-tubes-australia'],
      ['Greeting & Gift Cards', '/greeting-cards-australia'],
      ['Pouches', '/custom-pouches-australia'],
      ['Ribbons & Gift Tags', '/ribbons-and-gift-tags-australia'],
      ['Tissue & Wrapping', '/custom-tissue-paper-australia'],
    ],
  },
  {
    label: 'Pens',
    href: '/branded-pens-australia',
    children: [
      ['Ballpoint Pens', '/custom-ballpoint-pens-australia'],
      ['Eco Pens', '/eco-pens-australia'],
      ['Highlighters', '/custom-highlighters-australia'],
      ['Metal Pens', '/custom-metal-pens-australia'],
      ['Pencils', '/custom-pencils-australia'],
      ['Plastic Pens', '/custom-plastic-pens-australia'],
      ['Stylus Pens', '/custom-stylus-pens-australia'],
    ],
  },
  {
    label: 'Personal Care',
    href: '/branded-personal-care-products-australia',
    children: [
      ['Bath & Body', '/bath-and-body-gifts-australia'],
      ['Face Masks', '/custom-face-masks-australia'],
      ['First Aid', '/first-aid-kits-australia'],
      ['Grooming', '/grooming-products-australia'],
      ['Hand Sanitiser', '/custom-hand-sanitiser-australia'],
      ['Lip Balms', '/custom-lip-balm-australia'],
      ['Manicure Sets', '/manicure-sets-australia'],
      ['Mirrors & Beauty Accessories', '/compact-mirrors-australia'],
      ['Sunscreen & Lotions', '/sunscreen-australia'],
    ],
  },
  {
    label: 'Pet',
    href: '/branded-pet-products-australia',
    children: [
      ['Pet Accessories', '/custom-pet-accessories-australia'],
    ],
  },
  {
    label: 'Technology',
    href: '/corporate-tech-gifts-australia',
    children: [
      ['Bluetooth Speakers', '/custom-bluetooth-speakers-australia'],
      ['Charging Cables & Chargers', '/custom-charging-cables-australia'],
      ['Earbuds & Headphones', '/custom-earbuds-australia'],
      ['Phone Accessories', '/custom-phone-accessories-australia'],
      ['Power Banks', '/custom-power-banks-australia'],
      ['Tech Accessories', '/tech-accessories-australia'],
      ['USB Flash Drives', '/custom-usb-drives-australia'],
      ['Wireless Chargers', '/wireless-chargers-australia'],
    ],
  },
  {
    label: 'Tools & Auto',
    href: '/branded-tools-and-car-accessories-australia',
    children: [
      ['Car Accessories', '/car-accessories-australia'],
      ['Multi-Tools', '/custom-multi-tools-australia'],
      ['Tape Measures', '/custom-tape-measures-australia'],
      ['Tool Sets & Screwdrivers', '/tool-sets-australia'],
      ['Torches & Lights', '/custom-torches-australia'],
    ],
  },
  {
    label: 'Toys & Games',
    href: '/promotional-toys-and-games-australia',
    children: [
      ['Colouring & Kids Sets', '/colouring-sets-australia'],
      ['Games & Puzzles', '/custom-games-and-puzzles-australia'],
      ['Novelty Toys', '/novelty-toys-australia'],
      ['Outdoor Toys', '/outdoor-toys-australia'],
      ['Plush Toys', '/custom-plush-toys-australia'],
      ['Stress Balls & Toys', '/custom-stress-balls-australia'],
      ['Wooden Toys & Models', '/wooden-toys-and-models-australia'],
    ],
  },
  {
    label: 'Travel',
    href: '/branded-travel-accessories-australia',
    children: [
      ['Luggage Tags', '/custom-luggage-tags-australia'],
      ['Passport Holders', '/passport-holders-australia'],
      ['Travel Accessories', '/travel-accessories-australia'],
      ['Travel Pillows & Comfort', '/travel-pillows-australia'],
      ['Travel Wallets', '/travel-wallets-australia'],
    ],
  },
];

const LEGACY_BUCKET_REDIRECTS = [
  // Renamed subcategory 'Scarves & Accessories' -> 'Scarves & Gloves'; keep the old /category path alive.
  ['/category/apparel/scarves-accessories', '/branded-scarves-and-accessories-australia'],
  ['/category/business', '/branded-office-supplies-australia'],
  ['/category/business/business-cards', '/business-cards-australia'],
  ['/category/leisure', '/outdoor-promotional-products-australia'],
  ['/category/leisure/beach-ball', '/outdoor-toys-australia'],
  ['/category/leisure/beach-balls', '/outdoor-toys-australia'],
  ['/category/leisure/candles-diffusers', '/candles-and-diffusers-australia'],
  ['/category/leisure/cheese-boards', '/cheese-boards-australia'],
  ['/category/leisure/fidget-items', '/novelty-toys-australia'],
  ['/category/leisure/games-puzzles', '/custom-games-and-puzzles-australia'],
  ['/category/leisure/pet-accessories', '/custom-pet-accessories-australia'],
  ['/category/leisure/travel', '/branded-travel-accessories-australia'],
  ['/category/leisure/wooden-models', '/wooden-toys-and-models-australia'],
  ['/category/leisure/wooden-toys', '/wooden-toys-and-models-australia'],
  ['/category/personal', '/branded-personal-care-products-australia'],
  ['/category/personal/personal-care', '/branded-personal-care-products-australia'],
  ['/category/print', '/printed-marketing-materials-australia'],
  ['/category/print/a-frames-signage', '/a-frame-signage-australia'],
  ['/category/print/ad-labels', '/custom-stickers-australia'],
  ['/category/print/business-cards', '/business-cards-australia'],
  ['/category/print/feather-teardrop-flags', '/custom-feather-flags-australia'],
  ['/category/print/marquees', '/custom-marquees-australia'],
  ['/category/print/media-walls', '/media-walls-australia'],
  ['/category/print/pull-up-banners', '/pull-up-banners-australia'],
  ['/category/print/resin-labels', '/resin-labels-australia'],
  ['/category/print/signage', '/trade-show-displays-australia'],
  ['/category/print/table-covers', '/custom-table-covers-australia'],
  ['/category/promotion', '/promotional-giveaways-australia'],
  ['/category/promotion/badges', '/custom-badges-australia'],
  ['/category/promotion/balloons', '/custom-balloons-australia'],
  ['/category/promotion/id-holders', '/id-card-holders-australia'],
  ['/category/promotion/lanyards', '/custom-lanyards-australia'],
  ['/category/promotion/magnets', '/custom-fridge-magnets-australia'],
  ['/category/promotion/plush-toys', '/custom-plush-toys-australia'],
  ['/category/promotion/promotion', '/promotional-giveaways-australia'],
  ['/category/promotion/promotional', '/promotional-giveaways-australia'],
  ['/category/promotion/stress-items', '/custom-stress-balls-australia'],
  ['/category/promotion/temporary-tattoos', '/temporary-tattoos-australia'],
  ['/category/promotion/wristband', '/custom-wristbands-australia'],
  ['/category/promotion/wristbands', '/custom-wristbands-australia'],
  ['/category/promotional', '/promotional-giveaways-australia'],
  ['/category/promotional/promotion', '/promotional-giveaways-australia'],
];

function redirect(source, destination) {
  return {
    source,
    destination,
    statusCode: 301,
  };
}

function buildCategoryRedirects() {
  const redirects = [];

  for (const category of CATEGORY_URLS) {
    redirects.push(redirect(`/category/${slugify(category.label)}`, category.href));

    for (const [label, href] of category.children) {
      redirects.push(redirect(`/category/${slugify(category.label)}/${slugify(label)}`, href));
    }
  }

  for (const [source, destination] of LEGACY_BUCKET_REDIRECTS) {
    redirects.push(redirect(source, destination));
  }

  return [...new Map(redirects.map((item) => [item.source, item])).values()];
}

// Static one-off redirects (not category-driven).
// /products has no index page (only /products/[slug]); send it to the main hub.
const STATIC_REDIRECTS = [
  ['/products', '/promotional-products'],
  ['/privacy-policy', '/privacy'],
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      ...buildCategoryRedirects(),
      ...STATIC_REDIRECTS.map(([source, destination]) => redirect(source, destination)),
    ];
  },
};

export default nextConfig;

// app/indent/sea/page.js —— Indent Sea 页面(服务端外壳,带 SEO 元数据)
import IndentCatalog from '../IndentCatalog';

export const metadata = {
  title: 'Indent Sea — Bulk Made-to-Order Promotional Products | QuirkyPromo',
  description:
    'Bulk custom promotional products shipped by sea freight to Australia. The most cost-effective option for large quantity orders, delivered in around 8–12 weeks.',
};

const config = {
  indentType: 'indent_sea',
  crumb: 'Indent Sea',
  emoji: '🚢',
  badge: '🚢 Sea Freight · Best Bulk Pricing',
  badgeBg: '#2c5f8a',
  cardBadge: '🚢 SEA',
  heading: 'Indent Sea — Bulk Made-to-Order Products',
  intro:
    'Custom manufactured to your brief and shipped by sea freight — the most cost-effective way to order promotional products in larger quantities. Typically delivered in around 8–12 weeks from artwork approval, with significant savings over air freight.',
  steps: [
    { title: '1. Quote', sub: 'Tell us what you need' },
    { title: '2. Free Proof', sub: 'Approve your artwork' },
    { title: '3. Production', sub: 'Made to order' },
    { title: '4. Sea Freight', sub: 'Shipped to Australia' },
    { title: '5. Delivered', sub: '≈ 8–12 weeks total' },
  ],
  gridTitle: 'Sea Indent Range',
  ctaTitle: 'Almost anything can be made and shipped by sea',
  ctaText:
    'Our sea indent catalogue is just the beginning. Through our Custom Sourcing service we can manufacture and ship nearly any product by sea — drinkware, bags, tech, packaging and more — at the best possible unit price for bulk orders. Tell us your idea and target quantity.',
  quoteSource: 'indent_sea',
};

export default function IndentSeaPage() {
  return <IndentCatalog config={config} />;
}

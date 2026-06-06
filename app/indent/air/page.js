// app/indent/air/page.js —— Indent Air 页面(服务端外壳,带 SEO 元数据)
import IndentCatalog from '../IndentCatalog';

export const metadata = {
  title: 'Indent Air — Made-to-Order Promotional Products | QuirkyPromo',
  description:
    'Custom made-to-order promotional products, air freighted to Australia in around 3–5 weeks. Full custom branding, factory-direct pricing.',
};

const config = {
  indentType: 'indent_air',
  crumb: 'Indent Air',
  emoji: '✈️',
  badge: '✈️ Air Freight · Made to Order',
  badgeBg: '#8a6d34',
  cardBadge: '✈️ AIR',
  heading: 'Indent Air — Made-to-Order Promotional Products',
  intro:
    'Custom manufactured to your exact brief and air freighted to Australia. The fastest way to get fully customised, factory-direct merchandise — typically delivered in around 3–5 weeks from artwork approval.',
  steps: [
    { title: '1. Quote', sub: 'Tell us what you need' },
    { title: '2. Free Proof', sub: 'Approve your artwork' },
    { title: '3. Production', sub: 'Made to order' },
    { title: '4. Air Freight', sub: 'Flown to Australia' },
    { title: '5. Delivered', sub: '≈ 3–5 weeks total' },
  ],
  gridTitle: 'Air Indent Range',
  ctaTitle: "Can't find exactly what you need?",
  ctaText:
    'Our Custom Sourcing service can manufacture almost any promotional product to your specification — custom shapes, colours, packaging and branding. Tell us your idea and target quantity, and we will quote it for you.',
  quoteSource: 'indent_air',
};

export default function IndentAirPage() {
  return <IndentCatalog config={config} />;
}

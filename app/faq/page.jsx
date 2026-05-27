'use client';

import { useState } from 'react';
import Link from 'next/link';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';

const FAQS = [
  {
    category: 'Ordering & Quoting',
    icon: '🛒',
    questions: [
      {
        q: 'How do I place an order?',
        a: 'You can place an order directly on our website by selecting your product, choosing your colour and quantity, and clicking "Place Order". You can pay by EFT (bank transfer) or credit card. Alternatively, click "Get a Quote" for custom requirements, large volumes, or if you\'d like to discuss your options with our team first.',
      },
      {
        q: 'What is the minimum order quantity?',
        a: 'Minimum order quantities vary by product and are listed on each product page. Most products start from 25–100 units. If you need a smaller quantity, contact us and we\'ll do our best to help.',
      },
      {
        q: 'Can I get a quote before committing to an order?',
        a: 'Absolutely. Click "Get a Quote" on any product page and fill in your requirements. We\'ll respond within 1 business hour with pricing, lead times, and any relevant recommendations.',
      },
      {
        q: 'Do you offer discounts for large orders?',
        a: 'Yes — our pricing is tiered, so the more you order, the lower the unit price. Pricing tiers are shown on each product page. For very large orders or indent (factory-direct) orders, contact us for a custom quote.',
      },
      {
        q: 'Can I combine different products in one order?',
        a: 'Each product is ordered separately. However, if you\'re running a campaign with multiple products, contact us and we can manage everything under a single project with consolidated invoicing.',
      },
    ],
  },
  {
    category: 'Artwork & Branding',
    icon: '🎨',
    questions: [
      {
        q: 'What file format should I send my logo in?',
        a: 'We prefer vector files: AI, EPS, or PDF. These give the sharpest results across all decoration methods. We also accept PNG or JPG at a minimum of 300dpi. If you\'re unsure, send us what you have and our team will advise.',
      },
      {
        q: 'What if I don\'t have a vector file of my logo?',
        a: 'No problem. Contact us at hello@quirkypromo.com.au and our design team can help prepare your artwork. Additional design fees may apply depending on the complexity.',
      },
      {
        q: 'Will I see a proof before production starts?',
        a: 'Yes, always. Every order includes a free digital mockup showing exactly how your logo will appear on the product. Production only begins after you give us written approval. No surprises.',
      },
      {
        q: 'Can I match my exact brand colours?',
        a: 'Yes. Please provide your PMS (Pantone) colour codes when submitting your artwork. We offer PMS colour matching across most decoration methods. Visit our PMS Colour Match page to see our full colour range.',
      },
      {
        q: 'How many print positions can I have?',
        a: 'This varies by product and decoration method. Most products support 1–2 decoration positions. If you need multiple positions, include this in your quote request and we\'ll confirm what\'s possible.',
      },
    ],
  },
  {
    category: 'Samples',
    icon: '📦',
    questions: [
      {
        q: 'Can I see the product before placing a bulk order?',
        a: 'Yes. We offer two types of samples: an undecorated physical sample (so you can check quality and colour) or a branded sample (with your logo applied). Sample and shipping costs apply, but the sample cost is refunded when you place your bulk order.',
      },
      {
        q: 'How much does a sample cost?',
        a: 'Undecorated samples are charged at the product\'s sample price plus shipping. Branded samples are charged at the unit price plus setup charge plus shipping. Contact us for exact sample pricing on any product.',
      },
      {
        q: 'Is the sample cost refunded?',
        a: 'Yes — the sample product cost is refunded when you proceed with a bulk order. Shipping fees and setup charges are non-refundable.',
      },
      {
        q: 'Can I get a digital mockup without ordering a sample?',
        a: 'Yes. Every order includes a free digital mockup created by our design team. Just send us your logo and we\'ll show you exactly how it will look on the product before anything goes into production.',
      },
    ],
  },
  {
    category: 'Production & Lead Times',
    icon: '⚙️',
    questions: [
      {
        q: 'How long does production take?',
        a: 'Standard production time is 7–10 business days after your artwork proof is approved. Production times vary by product — check the individual product page for details. Indent (factory-direct) orders take approximately 20 business days by air or 45 business days by sea.',
      },
      {
        q: 'I have an urgent deadline. Can you help?',
        a: 'Contact us as soon as possible at hello@quirkypromo.com.au or call 02 9477 4748. We\'ll do everything we can to meet your deadline, including exploring rush production and express freight options.',
      },
      {
        q: 'What are Indent Air and Indent Sea orders?',
        a: 'Indent orders are factory-direct orders manufactured overseas, ideal for large volume orders with significant cost savings. Indent Air (approx. 20 business days) is faster; Indent Sea (approx. 45 business days) is more economical. Contact us to find out if your product is available as an indent order.',
      },
      {
        q: 'When does the production clock start?',
        a: 'Production starts from the date you give written approval of your artwork proof — not from when you place the order. We recommend approving your proof promptly to avoid delays.',
      },
    ],
  },
  {
    category: 'Shipping & Delivery',
    icon: '🚚',
    questions: [
      {
        q: 'How much is shipping?',
        a: '$30 flat rate per domestic delivery address, Australia-wide. No surprises at checkout.',
      },
      {
        q: 'Do you deliver to all states in Australia?',
        a: 'Yes, we deliver Australia-wide. Delivery times after dispatch are typically 2–5 business days for major cities and 5–15 business days for rural regions.',
      },
      {
        q: 'Can you deliver to multiple locations?',
        a: 'Yes. Each delivery address incurs a $30 shipping fee. If you need delivery to multiple locations, note this in your order or quote request and we\'ll provide a total shipping cost.',
      },
      {
        q: 'How will I know when my order has been dispatched?',
        a: 'You\'ll receive an email notification with tracking details once your order has been dispatched. You can also track your order progress through your account.',
      },
    ],
  },
  {
    category: 'Payment & Invoicing',
    icon: '💳',
    questions: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept EFT (bank transfer) and credit card (via Stripe). EFT details are provided on your invoice. Payment is required before production begins.',
      },
      {
        q: 'Will I receive a tax invoice?',
        a: 'Yes. A GST-inclusive tax invoice is provided with every order. Our ABN is 95 656 714 270.',
      },
      {
        q: 'Do prices include GST?',
        a: 'Product prices shown on the website are exclusive of GST. GST (10%) is added at checkout and shown on your invoice.',
      },
      {
        q: 'Can I pay on account (net 30)?',
        a: 'Account terms may be available for established businesses with a history of orders. Contact us to discuss.',
      },
    ],
  },
  {
    category: 'Returns & Quality',
    icon: '✅',
    questions: [
      {
        q: 'What is your quality guarantee?',
        a: 'We stand behind every order. If your products arrive with a manufacturing defect or the decoration doesn\'t match your approved proof, we\'ll make it right — whether that means reprinting or providing a refund.',
      },
      {
        q: 'Can I return my order if I change my mind?',
        a: 'Because all products are custom branded to your specifications, we\'re unable to accept change-of-mind returns. Please review our Refund & Return Policy for full details.',
      },
      {
        q: 'What if my order arrives damaged?',
        a: 'Please contact us within 7 days of receiving your order with photos of the damage. We\'ll assess the situation and work with you to resolve it promptly.',
      },
    ],
  },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid #F0EEED' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: '100%', textAlign: 'left', padding: '18px 0', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}
      >
        <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '15px', fontWeight: 600, color: NAVY, lineHeight: 1.5 }}>{q}</span>
        <span style={{ color: GOLD, fontSize: '20px', flexShrink: 0, transition: 'transform .2s', transform: open ? 'rotate(45deg)' : 'rotate(0deg)', display: 'inline-block' }}>+</span>
      </button>
      {open && (
        <div style={{ paddingBottom: '18px', paddingRight: '32px' }}>
          <p style={{ margin: 0, fontSize: '14px', color: '#5A5550', lineHeight: 1.8, fontFamily: '"DM Sans", sans-serif' }}>{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState(null);

  const displayed = activeCategory
    ? FAQS.filter(f => f.category === activeCategory)
    : FAQS;

  return (
    <div style={{ fontFamily: '"DM Sans", sans-serif', minHeight: '100vh', background: '#F8F7F4' }}>

      {/* BREADCRUMB */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E0DDD7', padding: '12px 40px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', fontSize: '13px', color: '#7A7570' }}>
          <Link href="/" style={{ color: '#7A7570', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 8px' }}>›</span>
          <span style={{ color: NAVY, fontWeight: 600 }}>FAQ</span>
        </div>
      </div>

      {/* HEADER */}
      <div style={{ background: NAVY, padding: '48px 40px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '44px', fontWeight: 600, color: '#fff', margin: '0 0 12px' }}>
            Frequently Asked Questions
          </h1>
          <p style={{ color: 'rgba(255,255,255,.65)', fontSize: '15px', margin: '0 0 28px', lineHeight: 1.7 }}>
            Everything you need to know about ordering custom branded merchandise with QuirkyPromo.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <span style={{ color: 'rgba(255,255,255,.5)', fontSize: '14px' }}>Can't find your answer?</span>
            <a href="mailto:hello@quirkypromo.com.au" style={{ background: GOLD, color: '#fff', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
              Contact Us →
            </a>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 40px', display: 'grid', gridTemplateColumns: '240px 1fr', gap: '48px', alignItems: 'start' }}>

        {/* SIDEBAR NAV */}
        <div style={{ position: 'sticky', top: '80px' }}>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #E0DDD7' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#B0AAA3', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '12px' }}>Jump to</div>
            <button
              onClick={() => setActiveCategory(null)}
              style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: activeCategory === null ? 700 : 400, color: activeCategory === null ? GOLD : '#3D3A36', background: activeCategory === null ? '#FDF8F0' : 'none', marginBottom: '4px', fontFamily: '"DM Sans", sans-serif' }}
            >
              All Questions
            </button>
            {FAQS.map(f => (
              <button
                key={f.category}
                onClick={() => setActiveCategory(activeCategory === f.category ? null : f.category)}
                style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: activeCategory === f.category ? 700 : 400, color: activeCategory === f.category ? GOLD : '#3D3A36', background: activeCategory === f.category ? '#FDF8F0' : 'none', marginBottom: '4px', fontFamily: '"DM Sans", sans-serif' }}
              >
                {f.icon} {f.category}
              </button>
            ))}
          </div>

          {/* CONTACT CARD */}
          <div style={{ marginTop: '20px', background: NAVY, borderRadius: '12px', padding: '20px' }}>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff', marginBottom: '8px', fontFamily: '"Cormorant Garamond", serif' }}>Still need help?</div>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,.6)', margin: '0 0 14px', lineHeight: 1.6 }}>Our team replies within 1 business hour.</p>
            <a href="mailto:hello@quirkypromo.com.au" style={{ display: 'block', background: GOLD, color: '#fff', textAlign: 'center', padding: '10px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, textDecoration: 'none', marginBottom: '8px' }}>
              📧 Email Us
            </a>
            <a href="tel:0294774748" style={{ display: 'block', background: 'rgba(255,255,255,.1)', color: '#fff', textAlign: 'center', padding: '10px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
              📞 02 9477 4748
            </a>
          </div>
        </div>

        {/* FAQ CONTENT */}
        <div>
          {displayed.map(section => (
            <div key={section.category} style={{ marginBottom: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', paddingBottom: '12px', borderBottom: `2px solid ${GOLD}` }}>
                <span style={{ fontSize: '24px' }}>{section.icon}</span>
                <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '24px', fontWeight: 600, color: NAVY, margin: 0 }}>
                  {section.category}
                </h2>
              </div>
              <div style={{ background: '#fff', borderRadius: '12px', padding: '0 24px', border: '1px solid #E0DDD7' }}>
                {section.questions.map((item, i) => (
                  <FAQItem key={i} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
          ))}

          {/* BOTTOM CTA */}
          <div style={{ background: '#fff', borderRadius: '12px', padding: '32px', border: '1px solid #E0DDD7', textAlign: 'center', marginTop: '20px' }}>
            <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '24px', color: NAVY, margin: '0 0 10px' }}>Ready to get started?</h3>
            <p style={{ fontSize: '14px', color: '#7A7570', margin: '0 0 20px', lineHeight: 1.7 }}>Browse our full product range or contact our team for expert advice on your next campaign.</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/category/bags" style={{ background: GOLD, color: '#fff', padding: '12px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
                Browse Products →
              </Link>
              <Link href="/contact" style={{ background: '#fff', color: NAVY, padding: '12px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, textDecoration: 'none', border: `1.5px solid ${NAVY}` }}>
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

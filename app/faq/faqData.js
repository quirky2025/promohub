// app/faq/faqData.js — single source of truth for the FAQ page + FAQPage schema.
// Answers are HTML strings (Google allows <a>/<ul>/<li>/<strong>/<p> in FAQ answers).
// Content口径 confirmed with Lily 2026-07. Only internal links to pages known to exist.

export const FAQ_SECTIONS = [
  {
    category: 'Ordering',
    icon: '🛒',
    questions: [
      {
        q: 'How do I order? (5 ways to order)',
        a: `<p>There are five ways to order — pick whatever suits you:</p>
<ul>
<li><strong>Add to cart &amp; pay online</strong> — check out and pay by card straight away.</li>
<li><strong>Add to cart &amp; pay later (EFT)</strong> — place the order now and pay by bank transfer.</li>
<li><strong><a href="#quote" data-quote>Get a Quote</a></strong> — tell us your product, quantity and logo placement; we reply within 3 business hours.</li>
<li><strong>Call us</strong> — order over the phone on <a href="tel:0294774748">02 9477 4748</a>.</li>
<li><strong>Email us</strong> — send your details to <a href="mailto:hello@quirkypromo.com.au">hello@quirkypromo.com.au</a>.</li>
</ul>
<p>Whichever you choose, the process is the same: we send a free digital proof, you approve it, we produce (7–10 business days after approval), then ship Australia-wide ($30 flat) with tracking. <a href="/account">Create a free account</a> to track every order and see your full history.</p>`,
      },
      {
        q: 'Can I see a proof before production starts?',
        a: `<p>Yes — every order includes a free digital proof. Nothing goes to print until you've approved it, so you can request changes until it's exactly right.</p>`,
      },
      {
        q: `What's your proof approval policy?`,
        a: `<p>Every order includes a free digital proof before printing. Please check the spelling, colours, layout and logo position carefully — once you approve the proof, we print exactly what's shown. If you notice anything after approving, <a href="/contact">contact us</a> straight away and we'll do our best to fix it before production begins.</p>`,
      },
      {
        q: 'How do I upload my logo, and what file formats do you accept?',
        a: `<p>You can upload your logo on the product page or attach it to your <a href="#quote" data-quote>quote request</a>. Vector files (AI, EPS, PDF, SVG) give the sharpest print result. A high-resolution PNG also works — our team will check your file and let you know if we need anything better.</p>`,
      },
      {
        q: `What's the difference between vector and PNG files — which prints best?`,
        a: `<p>Vector files (AI, EPS, PDF, SVG) are built from mathematical paths, so they stay razor-sharp at any size — the best choice for printing and embroidery. PNG and JPG files are made of pixels and can look blurry or jagged when enlarged. If you only have a high-resolution PNG we can usually work with it, and our team will let you know if we need to recreate it as vector. See our <a href="/services/decoration-methods">decoration methods</a> guide for more.</p>`,
      },
    ],
  },
  {
    category: 'Quantities',
    icon: '🔢',
    questions: [
      {
        q: 'What is the minimum order quantity?',
        a: `<p>Minimum order quantities vary from product to product — the minimum for each is shown on its product page. Many products start low; if you need a smaller quantity, <a href="/contact">contact us</a> and we'll do our best to help.</p>`,
      },
      {
        q: 'Can I mix sizes and colours in one order?',
        a: `<p>You can mix sizes within the same colour to reach the minimum — for example, 20 tees in navy across S–XL. Different colours need to be ordered separately.</p>`,
      },
    ],
  },
  {
    category: 'Pricing & Payment',
    icon: '💳',
    questions: [
      {
        q: 'Do your prices include GST?',
        a: `<p>Prices shown are ex-GST. GST (10%) is added at checkout or on your quote, itemised clearly so there are no surprises.</p>`,
      },
      {
        q: 'Is there a setup fee for printing?',
        a: `<p>Yes — a one-off setup fee applies per print position and method, and it's always shown as a separate line on your quote, never hidden in the unit price.</p>`,
      },
      {
        q: 'If I reorder, do I pay the setup fee again?',
        a: `<p>Yes — a setup fee applies to reorders as well, usually the same as your original order's setup. As always, it's shown as a separate line on your quote, ex-GST.</p>`,
      },
      {
        q: 'How do I get a quote?',
        a: `<p>Hit <a href="#quote" data-quote>Get a Quote</a> on any product (or the button in the menu), tell us your quantity and where you want your logo, and we'll come back to you within 3 business hours.</p>`,
      },
      {
        q: 'What payment methods do you accept?',
        a: `<p>You can pay by EFT (bank transfer), Visa, Mastercard or American Express. EFT has no surcharge; Visa and Mastercard incur a 2% surcharge, and American Express 3.5%.</p>`,
      },
    ],
  },
  {
    category: 'Production & Turnaround',
    icon: '⚙️',
    questions: [
      {
        q: 'How long does production take?',
        a: `<p>Custom-printed orders take 7–10 business days after you approve your artwork proof, plus shipping time. Need it sooner? Ask us when you enquire and we'll tell you what's possible.</p>`,
      },
      {
        q: 'Do you offer rush or fast turnaround?',
        a: `<p>Yes — rush production is available on many products, but timing depends on the specific product and decoration, so it's not one-size-fits-all. Tell us your deadline when you <a href="#quote" data-quote>enquire</a> and our team will confirm what's achievable; we'll lock it in when you place your order.</p>`,
      },
      {
        q: 'Can you match my exact brand colour (PMS)?',
        a: `<p>Yes — send us your PMS (Pantone) colour code and we'll match it across most decoration methods. Not sure of your code? Use our <a href="/resources/pms-chart">PMS chart</a> to find it.</p>`,
      },
      {
        q: 'What print methods do you offer, and which is best for my logo?',
        a: `<p>We offer screen printing, pad printing, laser engraving, embroidery and more — the best method depends on your product and logo. See our <a href="/services/decoration-methods">decoration methods</a> guide, or just send us your logo and we'll recommend one.</p>`,
      },
    ],
  },
  {
    category: 'Shipping & Returns',
    icon: '🚚',
    questions: [
      {
        q: 'How much is shipping?',
        a: `<p>$30 flat rate, Australia-wide — no matter how big your order is.</p>`,
      },
      {
        q: 'How long does delivery take?',
        a: `<p>Shipping is $30 flat, Australia-wide. After production, typical delivery times are:</p>
<ul>
<li>Sydney, Melbourne &amp; Brisbane — 2–5 business days</li>
<li>Adelaide — 3–5 business days</li>
<li>Perth — 5–7 business days</li>
<li>Rural &amp; regional areas — 5–15 business days</li>
</ul>
<p>Remember production (7–10 business days after proof approval) comes first, so factor in both for deadlines.</p>`,
      },
      {
        q: 'How do I check my order status? Will I get tracking?',
        a: `<p><a href="/account">Create a free account</a> and log in to see all your orders and quotes in one place — status, totals, saved addresses and company contacts. Once your order ships we'll also email you a tracking number and link so you can follow it to your door.</p>`,
      },
      {
        q: 'What if my order arrives damaged or with a printing error?',
        a: `<p>Let us know as soon as possible and we'll put it right. For items damaged in transit, tell us as soon as possible — ideally within 48 hours of delivery — so we can investigate and lodge a courier claim where needed. For a print error or defect that's our responsibility, contact us as soon as you notice it; we may need to inspect the goods, and we'll reprint or refund the affected items. Full details are in our <a href="/refund-return">Refund &amp; Return policy</a>.</p>`,
      },
    ],
  },
  {
    category: 'Products & Samples',
    icon: '📦',
    questions: [
      {
        q: 'Can I buy products blank, without printing?',
        a: `<p>Most of our range is available blank — check the product page. Our AS Colour apparel range is supplied custom-printed only.</p>`,
      },
      {
        q: 'Can I get a sample before I order?',
        a: `<p>Yes — we offer three kinds of samples:</p>
<ul>
<li><strong>Undecorated physical sample</strong> — an actual product so you can check material and colour in person. Sample cost + shipping applies; the sample cost is refunded when you place a bulk order (shipping is non-refundable).</li>
<li><strong>Branded sample (with your logo)</strong> — see exactly how your logo looks before full production. Charged at unit price + setup charge + shipping; the sample cost is refunded on a bulk order (setup charge and shipping are non-refundable).</li>
<li><strong>Indent custom sample</strong> — for large-volume, factory-direct orders, fully customised samples are available. Pricing and lead times vary by project and supplier; refund terms depend on order quantity and supplier. <a href="/contact">Contact us</a> to discuss.</li>
</ul>`,
      },
      {
        q: 'Do you offer eco-friendly promotional products?',
        a: `<p>Yes — browse our <a href="/eco">Eco range</a>. Many of our apparel products also carry credentials like amfori BSCI, PETA-Approved Vegan, UPF50+ and Australian Cotton, shown on each product page.</p>`,
      },
    ],
  },
];

-- Pens 类目页深化文案落地(branded-pens-australia)。整块跑一次。
-- 数字已软化(over 300 styles 等,避免过时)。Get a Quote 用 data-quote → 开询价弹窗。

-- STEP 0: 加 seo_intro 字段(开头段 ≠ SEO meta;幂等)
alter table url_pages add column if not exists seo_intro text;

-- STEP 1: 更新 Pens 页文案
update url_pages set
  title = 'Custom Pens Australia — Branded With Your Logo | QuirkyPromo',
  meta_description = 'Over 300 custom pens from under $1 ex-GST — ballpoint, metal, bamboo & stylus. Screen print, laser engraving or full colour. Free digital proof, fast Australia-wide delivery.',
  seo_intro = 'Custom pens are the workhorse of Australian promotional marketing — cheap enough to hand out by the box, useful enough that nobody throws them away. Whether you need 250 giveaway pens for a trade show, branded pens for the front desk, or engraved metal pens for client gifts, our range of over 300 pens covers every budget from under $1 to executive gift level. Upload your logo, approve your free digital proof, and we’ll do the rest.',
  seo_content = '<h2>How to Choose the Right Promotional Pen</h2>
<h3>By budget</h3>
<ul>
<li><strong>Under $1 — volume giveaways.</strong> Plastic and paper-barrel pens (hundreds of our pens sit under $2). Best for expos, events and counter-top jars where quantity beats luxury.</li>
<li><strong>$1–$2 — the sweet spot.</strong> Aluminium and bamboo pens that feel a grade above their price. The most popular band for corporate handouts.</li>
<li><strong>$2–$5 — client-facing.</strong> Metal barrels, soft-touch finishes and stylus combos — good enough to keep on a desk.</li>
<li><strong>$5+ — executive gifts.</strong> Premium metal pens (Ambassador, Accord) that hold their own in a gift box. Add a <a href="/pen-presentation-australia">pen presentation box</a>, or browse our ready-made <a href="/pen-gift-sets-australia">pen gift sets</a>.</li>
</ul>
<h3>By material</h3>
<p>Metal and aluminium for weight and a laser-engraved finish; plastic for the lowest cost per unit; bamboo, wood and recycled paper for eco credentials (we stock over 100 eco pens). Stainless steel and soft-touch silicone round out the premium end.</p>
<h3>By print method</h3>
<ul>
<li><strong>Screen / pad print</strong> — the standard for pen barrels; sharp one-to-two colour logos.</li>
<li><strong>Laser engraving</strong> — permanent, premium look on metal and bamboo.</li>
<li><strong>Full colour print</strong> — photos, gradients and multi-colour logos.</li>
</ul>
<p>The barrel is the standard print position on pens; selected styles also take a clip print. Not sure which suits your logo? See our <a href="/services/decoration-methods">decoration methods guide</a>, or just <a href="#quote" data-quote>send us the file</a> — we’ll show you exactly how it sits on your free proof.</p>
<h3>Ordering facts</h3>
<p>Minimums start as low as 25 units (most pens are 100–250). Prices are shown ex-GST and exclude decoration and one-off setup (always itemised separately on your quote). $30 flat shipping Australia-wide. Sourced from local Australian suppliers for fast turnaround — popular pens move quickly, so availability is confirmed on your quote.</p>',
  faq = '[{"question": "How much do custom pens cost in Australia?", "answer": "Most branded pens land between $0.50 and $2.00 ex-GST per unit at typical quantities, plus a one-off print setup. Volume giveaway pens start from around 20c; engraved executive pens run $5+. <a href=\"#quote\" data-quote>Request a quote</a> for exact per-unit pricing at your quantity."}, {"question": "What’s the minimum order for branded pens?", "answer": "It varies by pen — some start at just 25 units, most at 100–250. The minimum is shown on every product page."}, {"question": "Can I split my order across different pen colours?", "answer": "Yes — unlike many suppliers, you can mix barrel colours in one order as long as the artwork stays the same. One thing to watch: some logo colours read better on certain barrels, so if the print colour needs to change per barrel we’ll flag it (and any extra setup) on your free digital proof before anything goes to production."}, {"question": "Which printing method is best for pens?", "answer": "Pad or screen printing for most barrels (crisp, cost-effective), laser engraving for metal and bamboo (permanent, premium), and full colour for complex logos. We’ll recommend the best fit when you send your logo."}, {"question": "Do you have eco-friendly pens?", "answer": "Yes — over 100 of our pens are eco or sustainable options: bamboo, recycled paper barrels, wheat straw and more. Browse our <a href=\"/eco-pens-australia\">Eco Pens</a> or filter any pen list by Eco."}, {"question": "How fast can I get branded pens?", "answer": "Our pens come from local Australian suppliers, so turnaround is quick once you approve your free digital proof — exact production and delivery dates (and current availability) are confirmed on your quote."}]'::jsonb
where slug = 'branded-pens-australia';

-- STEP 2: 核对
select slug, title, left(seo_intro,60) as intro_head, left(seo_content,50) as content_head, jsonb_array_length(faq) as faq_n from url_pages where slug='branded-pens-australia';

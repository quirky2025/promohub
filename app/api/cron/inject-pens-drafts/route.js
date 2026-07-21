import { sourcingDb } from '@/lib/sourcingDb';

// 一次性:7 个 Pens 页面文案注入为草稿(url_page_revisions, status=draft)。
// SQL 编辑器分号切分问题绕不过,改走服务端。跑完即可删除本文件。
// GET /api/cron/inject-pens-drafts?key=<TRENDS_PROBE_KEY>

const PAGES = [
  {
    "slug": "custom-stylus-pens-australia",
    "payload": {
      "title": "Custom Stylus Pens Australia — Pen + Touchscreen In One | QuirkyPromo",
      "meta_description": "Promotional stylus pens with your logo — write on paper, swipe on screens. Around 36 styles in metal, bamboo and plastic from about $1 ex-GST.",
      "seo_intro": "Half pen, half touchscreen tool, the stylus pen earns its desk space twice over. The soft rubber tip works on phones and tablets (gloves on, winter mornings, food-service counters), and the ballpoint end handles the paperwork. A small upgrade over a standard pen that recipients genuinely notice — which is the whole point of a promotional product.",
      "guide_blocks": [
        {
          "level": "h2",
          "heading": "Picking a Stylus Pen",
          "html": "<ul><li><b>Metal stylus combos</b> — the corporate favourite: aluminium barrel, laser-engravable, from around $1.</li><li><b>Bamboo stylus</b> — eco credentials plus the tech touch — a conversation starter on both counts.</li><li><b>Who they land with</b>: field teams, healthcare, logistics, real estate — anyone juggling a screen and a clipboard.</li><li>Prices ex-GST — decoration and setup itemised on your quote.</li></ul>",
          "image_url": "",
          "image_alt": ""
        }
      ],
      "faq": [
        {
          "question": "Do stylus tips work on all touchscreens?",
          "answer": "<p>They work on standard capacitive screens — which covers virtually all modern phones and tablets. The soft tip won't scratch, and it's a lifesaver for gloved hands or cold-weather events.</p>"
        },
        {
          "question": "Are stylus pens worth the extra cost over standard pens?",
          "answer": "<p>They typically run under a dollar more than a comparable standard pen, and they're kept longer because they do two jobs. For client-facing giveaways, that extra usefulness usually pays for itself in retention.</p>"
        }
      ]
    }
  },
  {
    "slug": "black-promotional-pens-australia",
    "payload": {
      "title": "Black Promotional Pens — Custom Printed | QuirkyPromo",
      "meta_description": "Around 250 black pens printed with your logo — the corporate classic that matches every brand guide. From under $1 ex-GST, free digital proof.",
      "seo_intro": "Black is the uniform of the corporate pen — it matches every brand guide, suits every industry, and never looks off next to a contract. Around 250 of our pens come in black barrels, from budget click pens to engraved metal executives. White, silver or full-colour logos all print sharply on black — if you're unsure which will pop best, your free digital proof settles it before production.",
      "guide_blocks": [],
      "faq": [
        {
          "question": "What logo colour works best on black pens?",
          "answer": "<p>White and silver give the strongest contrast — metallic finishes read premium. Full-colour logos work too on suitable barrels. We'll show your exact artwork on the pen in your free digital proof.</p>"
        },
        {
          "question": "Are black pens available across all pen types?",
          "answer": "<p>Almost — ballpoints, stylus pens, highlighter combos, metal and eco styles all come in black. Use the filters on this page to narrow by material, mechanism or budget.</p>"
        }
      ]
    }
  },
  {
    "slug": "pen-gift-sets-australia",
    "payload": {
      "title": "Pen Gift Sets Australia — Boxed & Branded | QuirkyPromo",
      "meta_description": "Boxed pen gift sets with your logo — pen and notebook combos, bamboo sets and executive boxes. Client-gift ready from around $2 ex-GST.",
      "seo_intro": "A pen on its own is a giveaway — a pen in a box is a gift. Our pen gift sets pair quality pens with notebooks, boxes and matching accessories — the difference between \"here's a pen\" and \"we appreciate you.\" From bamboo sets at around $2 to executive boxed pieces, they're built for client thank-yous, conference VIPs and end-of-year gifting.",
      "guide_blocks": [],
      "faq": [
        {
          "question": "Can the box be branded as well as the pen?",
          "answer": "<p>On most sets, yes — pen and box can each carry your logo (decoration options and setup shown on your quote). Ask us to recommend the combination that suits your budget.</p>"
        }
      ]
    }
  },
  {
    "slug": "custom-highlighters-australia",
    "payload": {
      "title": "Custom Highlighters Australia — Printed With Your Logo | QuirkyPromo",
      "meta_description": "Promotional highlighters from around 60c ex-GST — multi-colour sets, eco kraft styles and highlighter-pen combos, printed with your logo.",
      "seo_intro": "Highlighters live on desks for months — students, admin teams and event crowds all reach for them daily. Ours run from budget singles around 60c to multi-colour sets, wax crayon styles and recycled kraft-barrel options, all printed with your logo where eyes land every time something important gets marked.",
      "guide_blocks": [],
      "faq": [
        {
          "question": "Which highlighters suit conferences and study promotions?",
          "answer": "<p>Multi-colour sets and highlighter-pen combos get the strongest response — one item, several uses. For eco-conscious audiences, kraft and recycled styles carry the same message as your logo.</p>"
        }
      ]
    }
  },
  {
    "slug": "custom-pencils-australia",
    "payload": {
      "title": "Custom Pencils Australia — Printed & Engraved | QuirkyPromo",
      "meta_description": "Promotional pencils from around 20c ex-GST — classic HB, carpenters and coloured pencil sets, branded with your logo.",
      "seo_intro": "The humble pencil still earns its keep: schools, trades, golf days and kids' packs all run on them. From classic sharpened HBs at around 20c to carpenters pencils for the trades and coloured sets for family events, a branded pencil is the lowest-cost writing item on the site — and one of the most kept.",
      "guide_blocks": [],
      "faq": [
        {
          "question": "What's the cheapest branded writing product you offer?",
          "answer": "<p>Pencils — plain HB styles start around 20c ex-GST at volume, before decoration and setup. For bulk school or event packs, nothing beats them on cost per unit.</p>"
        }
      ]
    }
  },
  {
    "slug": "pen-presentation-australia",
    "payload": {
      "title": "Pen Presentation Boxes Australia | QuirkyPromo",
      "meta_description": "Pen boxes, sleeves and cases from 14c ex-GST — turn any branded pen into a gift. Aluminium, kraft and velvet styles.",
      "seo_intro": "The right box upgrades a $2 pen into a keepsake. From kraft paper sleeves at 14c to aluminium presentation cases, these are the finishing touch for client gifts, awards and conference VIP packs — pair one with any pen in our range.",
      "guide_blocks": [],
      "faq": [
        {
          "question": "Do presentation boxes fit any pen?",
          "answer": "<p>Most standard-sized pens fit our boxes and sleeves — each listing notes dimensions. Tell us which pen you're pairing and we'll confirm the fit on your quote.</p>"
        }
      ]
    }
  },
  {
    "slug": "novelty-pens-australia",
    "payload": {
      "title": "Novelty Pens Australia — Fun Custom Pens | QuirkyPromo",
      "meta_description": "Novelty promotional pens that start conversations — banner pens, shaped and multi-function styles printed with your logo.",
      "seo_intro": "Sometimes the job is to be remembered, not refined. Novelty pens — banner pull-outs, shaped barrels, multi-function gadgets — trade a little polish for a lot of attention, which makes them expo-table gold. Use them where a smile beats a suit.",
      "guide_blocks": [],
      "faq": [
        {
          "question": "When should I choose a novelty pen over a standard one?",
          "answer": "<p>Trade shows, launches and youth-facing campaigns — anywhere the goal is stopping traffic and starting conversations. For boardrooms, stick to our metal range.</p>"
        }
      ]
    }
  }
];

export async function GET(request) {
  const url = new URL(request.url);
  const key = url.searchParams.get('key');
  const probeKey = process.env.PROBE_KEY || process.env.TRENDS_PROBE_KEY;
  if (!probeKey || key !== probeKey) return Response.json({ error: 'unauthorized' }, { status: 401 });

  const db = sourcingDb();
  const results = [];
  for (const p of PAGES) {
    const { data: page } = await db.from('url_pages').select('slug').eq('slug', p.slug).maybeSingle();
    if (!page) { results.push({ slug: p.slug, result: 'skipped: url_pages 无此 slug' }); continue; }
    const { data: existing } = await db.from('url_page_revisions')
      .select('id').eq('slug', p.slug).eq('status', 'draft').limit(1);
    if (existing && existing[0]) { results.push({ slug: p.slug, result: 'skipped: 已有草稿(未覆盖)' }); continue; }
    const { error } = await db.from('url_page_revisions')
      .insert({ slug: p.slug, status: 'draft', version: 0, payload: p.payload, created_by: 'claude-batch-20260721' });
    results.push({ slug: p.slug, result: error ? `error: ${error.message}` : 'draft created' });
  }
  return Response.json({ results });
}

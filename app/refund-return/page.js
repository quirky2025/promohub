const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';
const BG = '#ffffff';

const sections = [
  {
    title: 'Cancelling Your Order',
    subsections: [
      {
        subtitle: 'Custom / Branded Orders',
        content: `Orders can be cancelled up to the point your items enter production and/or are customised. If you need to cancel, contact us as soon as possible and we will confirm whether production has commenced. We will charge for any costs incurred up to that point, such as artwork and proofing fees.`,
      },
      {
        subtitle: 'Plain Stock Items',
        content: `You may cancel plain stock items before they are dispatched. If you change your mind on plain stock items, you may request a return within 14 days of delivery, provided the items have not been customised or personalised in any way. Freight and administration fees will apply in processing your return.`,
      },
      {
        subtitle: 'Non-Cancellable Items',
        content: `Plain stock items that are sourced from overseas specifically for your order, or custom-made to your specifications, cannot be cancelled once the order has been confirmed.`,
      },
    ],
  },
  {
    title: 'When Returns & Refunds Are Accepted',
    subsections: [
      {
        subtitle: 'Wrong Order Received',
        content: `If the products you receive do not match what you ordered (including incorrect branding or customisation), contact us as soon as possible and we will work with you to rectify the issue.`,
      },
      {
        subtitle: 'Damaged Items (In Transit)',
        content: `If your order is damaged during transit, please notify us as soon as possible — ideally within 48 hours of delivery — so we can investigate and, where applicable, lodge a claim with the courier. We reserve the right to re-supply damaged products or issue a refund for those items.`,
      },
      {
        subtitle: 'Faulty Products',
        content: `If you receive items that are defective or faulty, please notify us within a reasonable time after you become aware of the issue — ideally within 5 business days of delivery. We may need to inspect the goods to confirm the fault. We reserve the right to re-supply faulty products or issue a refund for those items.`,
      },
      {
        subtitle: 'Incorrect Quantity',
        content: `If the quantity delivered does not match your order, contact us as soon as possible. We will arrange to supply missing items, issue a refund, or organise the return of excess items.`,
      },
    ],
  },
  {
    title: 'Custom & Branded Goods',
    content: `Due to the bespoke nature of promotional products, customised, printed or branded goods cannot be returned for change of mind — they are made to your approved specifications and cannot be resold. This includes items that have been branded, printed, embroidered, etched, engraved or otherwise customised.`,
  },
  {
    title: 'Plain Stock Returns (Change of Mind)',
    content: `If you wish to return plain stock items for change of mind:\n\n• You must notify us within 14 days of delivery\n• Items must be unused, unwashed, and in original packaging in a re-saleable condition\n• Return shipping costs are the responsibility of the customer unless the return is due to our error or the items are faulty/damaged\n• Freight and administration fees will apply in processing your return\n\nFor orders delivered in multiple batches, the 14-day return window begins from the date you receive the final batch.`,
  },
  {
    title: 'Print Errors and Defects',
    content: `If there is a print error or defect determined to be our responsibility, we will offer to reprint the products or provide an appropriate remedy such as a refund on defectively printed goods.\n\nWe require the opportunity to inspect the goods within a reasonable timeframe following delivery or notification if you believe the products are defective.`,
  },
  {
    title: 'Remedy Options',
    content: `Remedies may depend on whether the issue is a major or minor failure:\n\n• For minor issues, we may choose to repair, replace or otherwise remedy the issue within a reasonable time\n• For major issues, you may be entitled to a refund or replacement`,
  },
  {
    title: 'How to Lodge a Return or Claim',
    content: `To help us resolve your request quickly, please email us at hello@quirkypromo.com.au with:\n\n• Your order number and order details\n• A description of the issue\n• Clear photos (and video if helpful) showing the issue, including packaging where relevant\n• Confirmation of quantities affected\n\nPlease keep all packaging and do not dispose of goods until we advise, as this may be required for courier claims or inspection.`,
  },
  {
    title: 'Refund Process',
    content: `If a refund is approved:\n\n• Refunds are processed within 10 business days of us receiving and inspecting returned goods (where a return is required)\n• Refunds are issued to the original payment method used for the purchase\n• Your financial institution may take additional time to process the refund to your account\n• If returned products are found to be used, damaged, or otherwise unsaleable (for change-of-mind returns), they may be returned to you and a refund may not be issued`,
  },
  {
    title: 'Australian Consumer Law',
    content: `Nothing in this policy excludes, restricts or modifies any rights you may have under the Australian Consumer Law (ACL). Where the ACL applies, you may be entitled to a repair, replacement, refund or other remedy if goods are faulty, not as described, not fit for purpose, or don't meet consumer guarantees.`,
  },
];

export default function RefundReturnPage() {
  return (
    <div style={{ background: '#fff', fontFamily: '"DM Sans", sans-serif', minHeight: '100vh' }}>

      {/* HERO */}
      <div style={{ background: NAVY, padding: '80px 40px', textAlign: 'center' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ width: '48px', height: '2px', background: GOLD, margin: '0 auto 32px' }} />
          <h1 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 'clamp(40px, 5vw, 60px)', fontWeight: 600, color: '#fff', letterSpacing: '2px', lineHeight: 1.1, margin: '0 0 16px' }}>
            Refund & Return Policy
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.7 }}>
            Customer satisfaction is our priority. This policy outlines our terms for cancellations, returns and refunds.
          </p>
          <div style={{ width: '48px', height: '2px', background: GOLD, margin: '32px auto 0' }} />
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 40px 80px' }}>

        {/* Quick summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '56px' }}>
          {[
            { icon: '✅', label: 'Wrong order', desc: 'We fix it at no cost' },
            { icon: '📦', label: 'Damaged in transit', desc: 'Notify us within 48 hours' },
            { icon: '🔄', label: 'Plain stock returns', desc: '14 days, unused items only' },
          ].map(({ icon, label, desc }) => (
            <div key={label} style={{ background: '#fff', border: '1px solid #E0DDD7', borderRadius: '10px', padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{icon}</div>
              <div style={{ fontWeight: 700, color: NAVY, fontSize: '14px', marginBottom: '4px' }}>{label}</div>
              <div style={{ fontSize: '12px', color: '#000' }}>{desc}</div>
            </div>
          ))}
        </div>

        {/* Sections */}
        {sections.map(({ title, content, subsections }) => (
          <div key={title} style={{ marginBottom: '48px' }}>
            <div style={{ width: '32px', height: '2px', background: GOLD, marginBottom: '16px' }} />
            <h2 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '26px', fontWeight: 600, color: NAVY, marginBottom: '16px' }}>
              {title}
            </h2>
            {content && content.split('\n\n').map((para, i) => (
              <p key={i} style={{ fontSize: '16px', lineHeight: 1.9, color: '#000', marginBottom: '12px', whiteSpace: 'pre-line' }}>
                {para}
              </p>
            ))}
            {subsections && subsections.map(({ subtitle, content: sub }) => (
              <div key={subtitle} style={{ marginBottom: '20px', paddingLeft: '16px', borderLeft: '3px solid #E0DDD7' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: NAVY, marginBottom: '8px' }}>{subtitle}</h3>
                <p style={{ fontSize: '16px', lineHeight: 1.9, color: '#000', margin: 0 }}>{sub}</p>
              </div>
            ))}
          </div>
        ))}

        {/* Contact box */}
        <div style={{ background: NAVY, borderRadius: '12px', padding: '32px', textAlign: 'center' }}>
          <h3 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '24px', color: '#fff', marginBottom: '12px' }}>
            Need to lodge a return or claim?
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', marginBottom: '20px' }}>
            Contact our team and we'll get back to you within 1 business day.
          </p>
          <a href="mailto:hello@quirkypromo.com.au" style={{ display: 'inline-block', background: GOLD, color: '#fff', padding: '14px 32px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '15px' }}>
            hello@quirkypromo.com.au
          </a>
        </div>
      </div>
    </div>
  );
}

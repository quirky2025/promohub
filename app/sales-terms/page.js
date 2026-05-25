const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';
const BG = '#F8F7F4';

const sections = [
  {
    title: '1. Definitions',
    content: `"Contract" means these Sales Terms and Conditions together with any quotation, order, invoice or other document expressed to be supplemental to this Contract.

"Seller" means Grow Your Marketing ABN 95 656 714 270 trading as QuirkyPromo, its successors and assigns.

"Customer" means the person or entity requesting the Seller to provide Goods as specified in any quotation, order, invoice or other documentation.

"Goods" means all goods or services supplied by the Seller to the Customer from time to time.

"Price" means the price payable (plus GST where applicable) for the Goods as agreed between the Seller and the Customer.

"GST" means Goods and Services Tax as defined within the A New Tax System (Goods and Services Tax) Act 1999 (Cth).`,
  },
  {
    title: '2. Acceptance',
    content: `The Customer is taken to have accepted and is bound by these terms and conditions if the Customer places an order or accepts delivery of the Goods.

In the event of any inconsistency between these terms and any other prior document, the terms of this Contract shall prevail.

Any amendment to these terms and conditions may only be made in writing by the consent of both parties.

Electronic signatures shall be deemed accepted by either party providing that the parties have complied with the Electronic Transactions Act 2001 or any applicable provisions of that Act.`,
  },
  {
    title: '3. Price and Payment',
    content: `All prices are subject to change without notice. The price charged will be the price in effect at the time the order is placed and will be confirmed in your order confirmation.

Unless otherwise stated, the Price does not include GST. GST will be added to your order total.

A non-refundable deposit may be required at the Seller's sole discretion.

Payment is due on the date specified on any invoice. Accepted payment methods include EFT (bank transfer) and credit card (a 2% surcharge applies to card payments).

Time for payment is of the essence. Interest on overdue invoices shall accrue daily at 2.5% per calendar month from the due date until payment is received.`,
  },
  {
    title: '4. Delivery',
    content: `Delivery occurs when the Seller's nominated carrier delivers the Goods to the Customer's nominated address.

Delivery timeframes are estimates only. The Seller will not be liable for any loss or damage as a result of late delivery.

A flat shipping fee of $30 applies per domestic delivery address. Additional charges may apply for remote areas or oversized items.

Risk of damage or loss passes to the Customer on delivery. The Customer must insure the Goods on or before delivery.`,
  },
  {
    title: '5. Artwork and Branding',
    content: `The Customer is responsible for supplying artwork that meets the Seller's specifications. Artwork requirements are detailed on the product page and in the artwork upload portal.

The Seller will provide a digital mockup for the Customer's approval prior to production. No production will commence without written approval from the Customer.

The Seller shall not be liable for any errors not corrected by the Customer in the final proof approval. Once the Customer approves artwork, the Seller is authorised to proceed with production.

The Seller shall not be liable for colour variations between digital mockups and finished goods, as colour reproduction may vary between screens and print processes.

Whilst every effort will be made to match PMS and CMYK colours, the Seller reserves the right to judge defectiveness based on industry standards.`,
  },
  {
    title: '6. Returns and Refunds',
    content: `The Customer must inspect the Goods on delivery and notify the Seller in writing within 7 days of any evident defect, damage, or shortage.

Goods printed or made to the Customer's specifications are not eligible for return or refund unless they are defective or do not match the approved artwork.

If the Seller is required to replace defective Goods but is unable to do so, a refund of the purchase price will be provided.

Cancellation of orders once production has commenced will not be accepted. The Customer will be liable for all costs incurred up to the point of cancellation.`,
  },
  {
    title: '7. Intellectual Property',
    content: `The Customer warrants that all designs, logos and artwork supplied to the Seller do not infringe any copyright, trademark, patent or other intellectual property rights of any third party.

The Customer agrees to indemnify the Seller against any claims arising from intellectual property infringement in connection with artwork or designs supplied by the Customer.

The Seller may use images of completed orders for marketing and portfolio purposes unless the Customer advises otherwise in writing.`,
  },
  {
    title: '8. Limitation of Liability',
    content: `To the extent permitted by law, the Seller's liability for any defect or damage is limited to the value of the Goods supplied.

The Seller shall not be liable for any indirect or consequential loss, including loss of profit, arising from any breach of these terms and conditions.

Nothing in these terms excludes, restricts or modifies any right or remedy, or any guarantee, warranty or other term or condition implied or imposed by the Australian Consumer Law that cannot be excluded.`,
  },
  {
    title: '9. Privacy',
    content: `The Seller is committed to protecting your Personal Information in accordance with the Privacy Act 1988 (Cth) and the Australian Privacy Principles.

Personal information collected will be used only for the purpose of fulfilling your order, providing customer service, and marketing communications where consent has been provided.

Please refer to our Privacy Policy at quirkypromo.com.au/privacy for full details.`,
  },
  {
    title: '10. Governing Law',
    content: `These terms and conditions are governed by the laws of New South Wales, Australia. Both parties submit to the exclusive jurisdiction of the courts of New South Wales.`,
  },
  {
    title: '11. General',
    content: `The failure by either party to enforce any provision of these terms shall not be treated as a waiver of that provision.

If any provision of these terms is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.

Neither party shall be liable for any default due to any act of God, war, terrorism, strike, fire, flood, or other event beyond the reasonable control of either party.`,
  },
];

export default function SalesTermsPage() {
  return (
    <div style={{ background: BG, fontFamily: '"DM Sans", sans-serif', minHeight: '100vh' }}>

      {/* HERO */}
      <div style={{ background: NAVY, padding: '80px 40px', textAlign: 'center' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ width: '48px', height: '2px', background: GOLD, margin: '0 auto 32px' }} />
          <h1 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 600, color: '#fff', letterSpacing: '2px', lineHeight: 1.1, margin: '0 0 16px' }}>
            Sales Terms & Conditions
          </h1>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', margin: '0 0 4px' }}>
            Grow Your Marketing ABN 95 656 714 270 trading as QuirkyPromo
          </p>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
            Last updated: May 2026
          </p>
          <div style={{ width: '48px', height: '2px', background: GOLD, margin: '32px auto 0' }} />
        </div>
      </div>

      {/* INTRO */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 40px 0' }}>
        <p style={{ fontSize: '15px', lineHeight: 1.9, color: '#5A5A5A', padding: '20px 24px', background: '#fff', borderLeft: `4px solid ${GOLD}`, borderRadius: '0 8px 8px 0' }}>
          By placing an order with QuirkyPromo, you accept and are bound by these Sales Terms and Conditions. Please read them carefully before placing your order.
        </p>
      </div>

      {/* SECTIONS */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 40px 80px' }}>
        {sections.map(({ title, content }) => (
          <div key={title} style={{ marginBottom: '48px' }}>
            <div style={{ width: '32px', height: '2px', background: GOLD, marginBottom: '16px' }} />
            <h2 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '22px', fontWeight: 600, color: NAVY, marginBottom: '16px' }}>
              {title}
            </h2>
            {content.split('\n\n').map((para, i) => (
              <p key={i} style={{ fontSize: '14px', lineHeight: 1.9, color: '#5A5A5A', marginBottom: '12px' }}>
                {para}
              </p>
            ))}
          </div>
        ))}

        <div style={{ borderTop: '1px solid #E0DDD7', paddingTop: '32px', fontSize: '13px', color: '#B0AAA3' }}>
          For any queries regarding these terms, please contact us at hello@quirkypromo.com.au or call 02 9477 4748.
        </div>
      </div>
    </div>
  );
}

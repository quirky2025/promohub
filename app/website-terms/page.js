const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';
const BG = '#ffffff';

const sections = [
  {
    title: '1. Acceptance of Terms',
    content: `By accessing and using quirkypromo.com.au ("the Website"), you accept and agree to be bound by these Website Terms and Conditions. If you do not agree to these terms, please do not use the Website.

These terms apply to all visitors, users and others who access or use the Website. We reserve the right to update these terms at any time. Your continued use of the Website following any changes constitutes your acceptance of the new terms.`,
  },
  {
    title: '2. Use of the Website',
    content: `You may use the Website only for lawful purposes and in accordance with these terms. You agree not to use the Website in any way that violates any applicable Australian or international laws or regulations.

You must not attempt to gain unauthorised access to any part of the Website, its server, or any database connected to the Website.

You must not introduce any viruses, malware, or other harmful material to the Website.

We reserve the right to suspend or terminate your access to the Website at any time if we believe you have violated these terms.`,
  },
  {
    title: '3. Account Registration',
    content: `To access certain features of the Website, including placing orders, you may be required to register for an account. You agree to provide accurate and complete information when registering.

You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. You agree to notify us immediately of any unauthorised use of your account at hello@quirkypromo.com.au.

We reserve the right to disable any account at any time if we believe you have violated these terms.`,
  },
  {
    title: '4. Intellectual Property',
    content: `The Website and all its content, including but not limited to text, graphics, logos, images, and software, are the property of Grow Your Marketing trading as QuirkyPromo and are protected by Australian and international copyright and intellectual property laws.

You may not reproduce, distribute, modify, or create derivative works of any content from the Website without our prior written consent.

You may print or download content from the Website for your own personal, non-commercial use only.`,
  },
  {
    title: '5. Product Information and Pricing',
    content: `We endeavour to ensure that all product information, descriptions and pricing on the Website are accurate. However, we reserve the right to correct any errors, inaccuracies or omissions at any time without prior notice.

All prices displayed on the Website are in Australian Dollars (AUD) and exclude GST unless otherwise stated. GST will be added at checkout.

Product images are for illustrative purposes only. Actual products may vary slightly from images shown.`,
  },
  {
    title: '6. Online Ordering',
    content: `By placing an order through the Website, you are making an offer to purchase Goods subject to our Sales Terms and Conditions. Your order constitutes an offer only and is not accepted until you receive an order confirmation from us.

We reserve the right to refuse or cancel any order at our discretion, including if we suspect fraudulent activity or if the product is no longer available.

We do not guarantee the Website's availability at all times. The Website may be unavailable due to scheduled maintenance or technical issues.`,
  },
  {
    title: '7. Third Party Links',
    content: `The Website may contain links to third party websites. These links are provided for your convenience only. We have no control over the content of those websites and accept no responsibility for them or for any loss or damage that may arise from your use of them.`,
  },
  {
    title: '8. Disclaimer of Warranties',
    content: `The Website is provided on an "as is" and "as available" basis without any warranties of any kind, either express or implied.

To the fullest extent permitted by Australian law, we disclaim all warranties including but not limited to warranties of merchantability, fitness for a particular purpose, and non-infringement.

Nothing in these terms excludes any guarantee or warranty implied by the Australian Consumer Law that cannot lawfully be excluded.`,
  },
  {
    title: '9. Limitation of Liability',
    content: `To the fullest extent permitted by Australian law, QuirkyPromo shall not be liable for any indirect, incidental, special or consequential damages arising from your use of the Website or inability to use the Website.

Our total liability to you for any claim arising out of or in connection with these terms shall not exceed the amount paid by you for the relevant Goods.`,
  },
  {
    title: '10. Privacy',
    content: `Your use of the Website is also governed by our Privacy Policy, which is incorporated into these terms by reference. By using the Website, you consent to the collection and use of your personal information as described in our Privacy Policy.

Please review our Privacy Policy at quirkypromo.com.au/privacy for details on how we collect, use and protect your personal information.`,
  },
  {
    title: '11. Governing Law',
    content: `These Website Terms and Conditions are governed by the laws of New South Wales, Australia. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of New South Wales.`,
  },
  {
    title: '12. Contact Us',
    content: `If you have any questions about these Website Terms and Conditions, please contact us:\n\nEmail: hello@quirkypromo.com.au\nPhone: 02 9477 4748\nWebsite: quirkypromo.com.au`,
  },
];

export default function WebsiteTermsPage() {
  return (
    <div style={{ background: '#fff', fontFamily: '"DM Sans", sans-serif', minHeight: '100vh' }}>

      {/* HERO */}
      <div style={{ background: NAVY, padding: '80px 40px', textAlign: 'center' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ width: '48px', height: '2px', background: GOLD, margin: '0 auto 32px' }} />
          <h1 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 600, color: '#fff', letterSpacing: '2px', lineHeight: 1.1, margin: '0 0 16px' }}>
            Website Terms & Conditions
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
        <p style={{ fontSize: '15px', lineHeight: 1.9, color: '#000', padding: '20px 24px', background: '#fff', borderLeft: `4px solid ${GOLD}`, borderRadius: '0 8px 8px 0' }}>
          Please read these Website Terms and Conditions carefully before using quirkypromo.com.au. By accessing or using the Website, you agree to be bound by these terms.
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
              <p key={i} style={{ fontSize: '14px', lineHeight: 1.9, color: '#000', marginBottom: '12px' }}>
                {para}
              </p>
            ))}
          </div>
        ))}

        <div style={{ borderTop: '1px solid #E0DDD7', paddingTop: '32px', fontSize: '13px', color: '#000' }}>
          For any queries regarding these terms, please contact us at hello@quirkypromo.com.au or call 02 9477 4748.
        </div>
      </div>
    </div>
  );
}

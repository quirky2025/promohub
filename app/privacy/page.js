const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';
const BG = '#ffffff';

export default function PrivacyPolicyPage() {
  return (
    <div style={{ background: '#fff', fontFamily: '"DM Sans", sans-serif', minHeight: '100vh' }}>

      {/* HERO */}
      <div style={{ background: NAVY, padding: '80px 40px', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ width: '48px', height: '2px', background: GOLD, margin: '0 auto 32px' }} />
          <h1 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: 600, color: '#fff', letterSpacing: '2px', lineHeight: 1.1, margin: '0 0 16px' }}>
            Privacy Policy
          </h1>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
            Last updated: May 2026
          </p>
          <div style={{ width: '48px', height: '2px', background: GOLD, margin: '32px auto 0' }} />
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 40px' }}>

        <p style={{ fontSize: '16px', lineHeight: 1.9, color: '#5A5A5A', marginBottom: '48px' }}>
          QuirkyPromo (operated by Grow Your Marketing, ABN 95 656 714 270) is committed to providing quality services to you. This policy outlines our ongoing obligations in respect of how we manage your Personal Information. We have adopted the Australian Privacy Principles (APPs) contained in the Privacy Act 1988 (Cth).
        </p>

        {[
          {
            title: 'What is Personal Information and Why Do We Collect It?',
            content: `Personal Information is information or an opinion that identifies an individual. Examples of Personal Information we collect include: names, addresses, email addresses, and phone numbers.

This Personal Information is obtained in many ways including correspondence, by telephone, by email, via our website quirkypromo.com.au, and from third parties. We don't guarantee website links or the policy of authorised third parties.

We collect your Personal Information for the primary purpose of providing our services to you, providing information to our clients, and marketing. We may also use your Personal Information for secondary purposes closely related to the primary purpose, in circumstances where you would reasonably expect such use or disclosure.

You may unsubscribe from our mailing/marketing lists at any time by using the unsubscribe link at the bottom of our promotional emails.`,
          },
          {
            title: 'Sensitive Information',
            content: `Sensitive information is defined in the Privacy Act to include information or opinion about an individual's racial or ethnic origin, political opinions, religious or philosophical beliefs, criminal record, or health information.

Sensitive information will be used by us only for the primary purpose for which it was obtained, for a secondary purpose directly related to the primary purpose, with your consent, or where required or authorised by law.`,
          },
          {
            title: 'Third Parties',
            content: `Where reasonable and practicable to do so, we will collect your Personal Information only from you. However, in some circumstances we may be provided with information by third parties. In such a case we will take reasonable steps to ensure that you are made aware of the information provided to us by the third party.`,
          },
          {
            title: 'Disclosure of Personal Information',
            content: `Your Personal Information may be disclosed in a number of circumstances including: to third parties where you consent to the use or disclosure, and where required or authorised by law.`,
          },
          {
            title: 'Security of Personal Information',
            content: `Your Personal Information is stored in a manner that reasonably protects it from misuse and loss and from unauthorised access, modification or disclosure.

When your Personal Information is no longer needed for the purpose for which it was obtained, we will take reasonable steps to destroy or permanently de-identify your Personal Information. Most Personal Information will be stored in client files which will be kept by us for a minimum of 7 years.`,
          },
          {
            title: 'Access to Your Personal Information',
            content: `You may access the Personal Information we hold about you and update and/or correct it, subject to certain exceptions. If you wish to access your Personal Information, please contact us in writing at hello@quirkypromo.com.au.

QuirkyPromo will not charge any fee for your access request, but may charge an administrative fee for providing a copy of your Personal Information. In order to protect your Personal Information we may require identification from you before releasing the requested information.`,
          },
          {
            title: 'Maintaining the Quality of Your Personal Information',
            content: `It is important to us that your Personal Information is up to date. We will take reasonable steps to make sure that your Personal Information is accurate, complete and up-to-date. If you find that the information we have is not up to date or is inaccurate, please advise us as soon as practicable so we can update our records.`,
          },
          {
            title: 'Policy Updates',
            content: `This Policy may change from time to time and is available on our website at quirkypromo.com.au.`,
          },
          {
            title: 'Privacy Policy Complaints and Enquiries',
            content: `If you have any queries or complaints about our Privacy Policy please contact us:\n\nEmail: hello@quirkypromo.com.au\nPhone: 02 9477 4748`,
          },
        ].map(({ title, content }) => (
          <div key={title} style={{ marginBottom: '48px' }}>
            <div style={{ width: '32px', height: '2px', background: GOLD, marginBottom: '16px' }} />
            <h2 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '24px', fontWeight: 600, color: NAVY, marginBottom: '16px' }}>
              {title}
            </h2>
            {content.split('\n\n').map((para, i) => (
              <p key={i} style={{ fontSize: '15px', lineHeight: 1.9, color: '#5A5A5A', marginBottom: '16px' }}>
                {para}
              </p>
            ))}
          </div>
        ))}

      </div>
    </div>
  );
}

// app/faq/page.jsx — server component: renders FAQPage structured data (server-side,
// so Google/AI read it in the initial HTML) + the interactive FAQ UI (client).
// Content lives in ./faqData.js (shared by the schema and the UI).

import FaqClient from './FaqClient';
import { FAQ_SECTIONS } from './faqData';

export const metadata = {
  title: 'FAQ — Ordering Custom Promotional Products | QuirkyPromo',
  description:
    'Answers on ordering custom branded merchandise in Australia: quotes, artwork, minimum orders, setup fees, production times, shipping, payment and returns.',
  alternates: { canonical: '/faq' },
};

function faqSchema() {
  const questions = FAQ_SECTIONS.flatMap((s) => s.questions).map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.a,
    },
  }));
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions,
  };
}

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema()) }}
      />
      <FaqClient />
    </>
  );
}

import './globals.css';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { SITE_URL } from '@/lib/siteUrl';
import GoogleAnalytics from '@/components/GoogleAnalytics';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'QuirkyPromo — Premium Promotional Products Australia',
  description: 'High-quality branded merchandise for Australian businesses.',
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts — Cormorant Garamond + DM Sans + DM Mono */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{
        margin: 0,
        fontFamily: '"DM Sans", -apple-system, BlinkMacSystemFont, sans-serif',
        background: '#fff',
        color: '#1B2A4A',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
      }}>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}

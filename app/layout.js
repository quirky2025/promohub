import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import './globals.css';

export const metadata = {
  title: 'PromoHub — Premium Promotional Products Australia',
  description: 'High-quality branded merchandise for Australian businesses. Custom promotional products delivered Australia-wide.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, fontFamily: "'IBM Plex Sans', sans-serif", background: '#F4F2EE', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Nav />
        <main style={{ flex: 1 }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

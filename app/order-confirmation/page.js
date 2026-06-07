'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';

function OrderConfirmationContent() {
  const params = useSearchParams();
  const orderNumber = params.get('order');
  const method = params.get('method');
  const isEFT = method === 'eft';
  const isPaid = method === 'stripe';

  return (
    <div style={{ background: '#fff', minHeight: '100vh', fontFamily: '"DM Sans", sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
      <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #E0DDD7', padding: '48px', maxWidth: '600px', width: '100%', textAlign: 'center', boxShadow: '0 8px 32px rgba(27,42,74,0.08)' }}>

        {/* Success icon */}
        <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#F0FAF4', border: '3px solid #2D6A4F', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '32px' }}>
          ✅
        </div>

        <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '36px', fontWeight: 600, color: NAVY, margin: '0 0 12px' }}>
          Order Placed!
        </h1>

        <p style={{ fontSize: '16px', color: '#7A7570', margin: '0 0 8px' }}>
          Thank you for your order.
        </p>

        {orderNumber && (
          <div style={{ background: '#F8F7F4', borderRadius: '10px', padding: '12px 20px', margin: '16px 0 24px', display: 'inline-block' }}>
            <span style={{ fontSize: '13px', color: '#7A7570' }}>Order Number: </span>
            <span style={{ fontSize: '16px', fontWeight: 700, color: NAVY, fontFamily: '"DM Mono", monospace' }}>{orderNumber}</span>
          </div>
        )}

        {/* What happens next */}
        <div style={{ background: '#F8F7F4', borderRadius: '12px', padding: '20px 24px', marginBottom: '24px', textAlign: 'left' }}>
          <div style={{ fontWeight: 700, color: NAVY, marginBottom: '12px', fontSize: '15px' }}>📋 What happens next?</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', color: '#3D3A36' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <span style={{ color: GOLD, fontWeight: 700, flexShrink: 0 }}>1.</span>
              <span>We'll email you a <strong>free digital proof</strong> for approval</span>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <span style={{ color: GOLD, fontWeight: 700, flexShrink: 0 }}>2.</span>
              <span>You approve the artwork online (unlimited revisions)</span>
            </div>
            {isEFT && (
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ color: GOLD, fontWeight: 700, flexShrink: 0 }}>3.</span>
                <span>Once approved, we'll send your <strong>Invoice</strong> — pay via bank transfer</span>
              </div>
            )}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <span style={{ color: GOLD, fontWeight: 700, flexShrink: 0 }}>{isEFT ? '4.' : '3.'}</span>
              <span>Production begins · Delivery 2–5 business days after dispatch</span>
            </div>
          </div>
        </div>



        {/* Stripe paid confirmation */}
        {isPaid && (
          <div style={{ background: '#F0FAF4', border: '1px solid #2D6A4F', borderRadius: '12px', padding: '16px 24px', marginBottom: '24px', textAlign: 'left' }}>
            <div style={{ fontWeight: 700, color: '#2D6A4F', fontSize: '15px' }}>✅ Payment received — Invoice has been emailed to you</div>
          </div>
        )}

        <p style={{ fontSize: '14px', color: '#7A7570', margin: '0 0 24px' }}>
          A confirmation email has been sent to your inbox.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link href="/products" style={{ background: GOLD, color: '#fff', textDecoration: 'none', padding: '14px 28px', borderRadius: '10px', fontWeight: 700, fontSize: '15px', fontFamily: '"DM Sans", sans-serif' }}>
            Continue Shopping
          </Link>
          <a href="tel:0294774748" style={{ background: '#fff', color: NAVY, textDecoration: 'none', padding: '14px 28px', borderRadius: '10px', fontWeight: 600, fontSize: '15px', border: `1.5px solid ${NAVY}`, fontFamily: '"DM Sans", sans-serif' }}>
            📞 02 9477 4748
          </a>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>Loading...</div>}>
      <OrderConfirmationContent />
    </Suspense>
  );
}

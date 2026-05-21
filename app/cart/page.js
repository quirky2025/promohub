'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getCart, removeFromCart, updateQty, clearCart } from '@/lib/cart';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';
const SHIPPING = 30;
const GST = 0.10;

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setCart(getCart());
    setLoaded(true);
    function onUpdate() { setCart(getCart()); }
    window.addEventListener('cart-updated', onUpdate);
    return () => window.removeEventListener('cart-updated', onUpdate);
  }, []);

  function handleRemove(id) {
    setCart(removeFromCart(id));
  }

  function handleQtyChange(id, val) {
    const n = parseInt(val);
    if (!isNaN(n) && n >= 1) {
      setCart(updateQty(id, n));
    }
  }

  // Fixed $30 shipping for entire order
  const totalSubtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const orderShipping = cart.length > 0 ? SHIPPING : 0;
  const orderGst = Math.round((totalSubtotal + orderShipping) * GST * 100) / 100;
  const orderTotal = totalSubtotal + orderShipping + orderGst;

  if (!loaded) return null;

  return (
    <div style={{ background: '#F8F7F4', minHeight: '100vh', fontFamily: '"DM Sans", sans-serif' }}>
      {/* Breadcrumb */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E0DDD7', padding: '12px 40px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', fontSize: '13px', color: '#7A7570' }}>
          <Link href="/" style={{ color: '#7A7570', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 8px' }}>›</span>
          <span style={{ color: NAVY, fontWeight: 600 }}>Shopping Cart</span>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 40px 80px' }}>
        <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '36px', fontWeight: 600, color: NAVY, margin: '0 0 32px' }}>
          Shopping Cart {cart.length > 0 && <span style={{ fontSize: '20px', color: '#7A7570' }}>({cart.length} item{cart.length !== 1 ? 's' : ''})</span>}
        </h1>

        {cart.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🛒</div>
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '28px', color: NAVY, margin: '0 0 12px' }}>Your cart is empty</h2>
            <p style={{ color: '#7A7570', marginBottom: '32px' }}>Start shopping to add products to your cart.</p>
            <Link href="/products" style={{ background: GOLD, color: '#fff', textDecoration: 'none', padding: '16px 40px', borderRadius: '10px', fontWeight: 700, fontSize: '16px' }}>
              Browse Products
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '40px', alignItems: 'start' }}>

            {/* Cart Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {cart.map(item => (
                <div key={item.id} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E0DDD7', padding: '20px 24px', display: 'flex', gap: '20px', alignItems: 'flex-start' }}>

                  {/* Image */}
                  <div style={{ width: '100px', height: '100px', flexShrink: 0, borderRadius: '8px', border: '1px solid #E0DDD7', background: '#F8F7F4', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {item.image
                      ? <img src={item.image} alt={item.productName} style={{ width: '90%', height: '90%', objectFit: 'contain' }} />
                      : <span style={{ fontSize: '32px' }}>📦</span>}
                  </div>

                  {/* Details */}
                  <div style={{ flex: 1 }}>
                    <Link href={`/products/${item.productSlug}`} style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '15px', fontWeight: 600, color: NAVY, textDecoration: 'none' }}>
                      {item.productName}
                    </Link>
                    <div style={{ fontSize: '12px', color: '#7A7570', marginTop: '4px', fontFamily: '"DM Mono", monospace' }}>{item.sku}</div>
                    {item.colour && <div style={{ fontSize: '13px', color: '#7A7570', marginTop: '4px' }}>Colour: <strong style={{ color: NAVY }}>{item.colour}</strong></div>}

                    {item.addons?.length > 0 && (
                      <div style={{ marginTop: '8px' }}>
                        {item.addons.map(a => (
                          <div key={a.id} style={{ fontSize: '12px', color: '#7A7570' }}>+ {a.name}</div>
                        ))}
                      </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <label style={{ fontSize: '12px', color: '#7A7570' }}>Qty:</label>
                        <input
                          type="number"
                          value={item.qty}
                          min={item.minQty || 1}
                          onChange={e => handleQtyChange(item.id, e.target.value)}
                          style={{ width: '72px', padding: '6px 10px', border: '1.5px solid #E0DDD7', borderRadius: '6px', fontSize: '14px', fontWeight: 600, fontFamily: '"DM Mono", monospace', color: NAVY, textAlign: 'center', outline: 'none' }}
                        />
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '12px', color: '#7A7570' }}>${item.unitPrice.toFixed(2)} / unit</div>
                        <div style={{ fontFamily: '"DM Mono", monospace', fontSize: '18px', fontWeight: 600, color: GOLD }}>${item.subtotal.toFixed(2)} <span style={{ fontSize: '11px', fontWeight: 400, color: '#7A7570' }}>excl. GST</span></div>
                      </div>
                    </div>
                  </div>

                  <button onClick={() => handleRemove(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#B0AAA3', fontSize: '18px', padding: '4px', flexShrink: 0 }} title="Remove">✕</button>
                </div>
              ))}

              <button onClick={() => { clearCart(); setCart([]); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#B0AAA3', fontSize: '13px', fontFamily: '"DM Sans", sans-serif', textDecoration: 'underline', padding: '8px 0', textAlign: 'left' }}>
                Clear cart
              </button>
            </div>

            {/* Order Summary */}
            <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E0DDD7', padding: '24px', position: 'sticky', top: '80px' }}>
              <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '22px', fontWeight: 600, color: NAVY, margin: '0 0 20px' }}>Order Summary</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px', fontSize: '14px', fontFamily: '"DM Sans", sans-serif' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#7A7570' }}>Subtotal (excl. GST)</span>
                  <span style={{ fontFamily: '"DM Mono", monospace' }}>${totalSubtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#7A7570' }}>Shipping & Handling</span>
                  <span style={{ fontFamily: '"DM Mono", monospace' }}>${orderShipping.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#7A7570' }}>GST (10%)</span>
                  <span style={{ fontFamily: '"DM Mono", monospace' }}>${orderGst.toFixed(2)}</span>
                </div>
                <div style={{ height: '1px', background: '#E0DDD7', margin: '4px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '16px' }}>
                  <span style={{ color: NAVY }}>Total (incl. GST)</span>
                  <span style={{ fontFamily: '"DM Mono", monospace', color: GOLD }}>${orderTotal.toFixed(2)}</span>
                </div>
              </div>

              <div style={{ fontSize: '11px', color: '#9CA3AF', marginBottom: '20px', fontFamily: '"DM Sans", sans-serif' }}>
                All prices in AUD · $30 flat rate shipping Australia-wide · GST invoice provided with order.
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button
                  onClick={() => router.push('/checkout')}
                  style={{ width: '100%', background: GOLD, color: '#fff', border: 'none', borderRadius: '10px', padding: '16px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', boxShadow: '0 4px 16px rgba(201,169,110,.3)' }}>
                  Proceed to Checkout →
                </button>
                <Link href="/products" style={{ display: 'block', textAlign: 'center', color: '#7A7570', textDecoration: 'none', fontSize: '14px', fontFamily: '"DM Sans", sans-serif' }}>
                  ← Continue Shopping
                </Link>
              </div>

              <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #E0DDD7', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { icon: '🔒', text: 'Secure checkout' },
                  { icon: '🎨', text: 'Free digital proof' },
                  { icon: '✅', text: 'Quality guarantee' },
                ].map(b => (
                  <div key={b.text} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#7A7570', fontFamily: '"DM Sans", sans-serif' }}>
                    <span>{b.icon}</span><span>{b.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
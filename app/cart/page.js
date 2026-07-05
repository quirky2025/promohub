'use client';

import { useState, useEffect } from 'react';
import { cld } from '@/lib/cloudinary';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getCart, removeFromCart, updateCartItem } from '@/lib/cart';
import { SHIPPING, GST } from '@/lib/pricing';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';
const BG = '#ffffff';

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setCart(getCart());
    setLoaded(true);
  }, []);

  function handleRemove(id) {
    const updated = removeFromCart(id);
    setCart(updated);
  }

  function handleQtyChange(id, newQty) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    const n = parseInt(newQty);
    if (isNaN(n) || n < (item.minQty || 1)) return;
    const updated = updateCartItem(id, { qty: n, subtotal: Math.round(item.unitPrice * n * 100) / 100 });
    setCart(updated);
  }

  const totalSubtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const gstAmt = Math.round((totalSubtotal + SHIPPING) * GST * 100) / 100;
  const total = totalSubtotal + SHIPPING + gstAmt;

  if (!loaded) return null;

  if (cart.length === 0) {
    return (
      <div style={{ fontFamily: '"DM Sans", sans-serif', background: '#fff', minHeight: '100vh' }}>
        <div style={{ background: '#fff', borderBottom: '1px solid #E0DDD7', padding: '12px 40px' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', fontSize: '13px', color: '#7A7570' }}>
            <Link href="/" style={{ color: '#7A7570', textDecoration: 'none' }}>Home</Link>
            <span style={{ margin: '0 8px' }}>›</span>
            <span style={{ color: NAVY, fontWeight: 600 }}>Your Cart</span>
          </div>
        </div>
        <div style={{ maxWidth: '500px', margin: '100px auto', padding: '0 40px', textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>🛒</div>
          <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '32px', color: NAVY, margin: '0 0 12px' }}>Your cart is empty</h1>
          <p style={{ fontSize: '15px', color: '#7A7570', margin: '0 0 32px', lineHeight: 1.7 }}>
            Browse our range and add products to your cart to get started.
          </p>
          <Link href="/category/bags" style={{ background: GOLD, color: '#fff', padding: '14px 32px', borderRadius: '10px', fontSize: '15px', fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}>
            Browse Products →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: '"DM Sans", sans-serif', background: '#fff', minHeight: '100vh' }}>

      {/* BREADCRUMB */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E0DDD7', padding: '12px 40px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', fontSize: '13px', color: '#7A7570' }}>
          <Link href="/" style={{ color: '#7A7570', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 8px' }}>›</span>
          <span style={{ color: NAVY, fontWeight: 600 }}>Your Cart</span>
        </div>
      </div>

      {/* HEADER */}
      <div style={{ background: NAVY, padding: '32px 40px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '36px', fontWeight: 600, color: '#fff', margin: 0 }}>
              Your Cart
            </h1>
            <p style={{ color: 'rgba(255,255,255,.6)', fontSize: '14px', margin: '4px 0 0' }}>
              {cart.length} item{cart.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Link href="/promotional-products" style={{ color: 'rgba(255,255,255,.7)', fontSize: '14px', textDecoration: 'none', fontFamily: '"DM Sans", sans-serif' }}>
            ← Keep Shopping
          </Link>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 40px 60px', display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px', alignItems: 'start' }}>

        {/* LEFT — CART ITEMS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {cart.map(item => (
            <div key={item.id} style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E0DDD7', padding: '20px 24px', display: 'flex', gap: '20px', alignItems: 'flex-start' }}>

              {/* Image */}
              <div style={{ width: '100px', height: '100px', flexShrink: 0, borderRadius: '10px', border: '1px solid #E0DDD7', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {item.image
                  ? <img src={cld(item.image, 160)} alt={item.productName} style={{ width: '90%', height: '90%', objectFit: 'contain' }} />
                  : <span style={{ fontSize: '32px' }}>📦</span>}
              </div>

              {/* Details */}
              <div style={{ flex: 1 }}>
                <Link href={`/products/${item.productSlug}`} style={{ textDecoration: 'none' }}>
                  <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '16px', fontWeight: 700, color: NAVY, marginBottom: '6px', lineHeight: 1.3 }}>{item.productName}</div>
                </Link>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '13px', color: '#7A7570', fontFamily: '"DM Sans", sans-serif', marginBottom: '12px' }}>
                  {item.sku && <span>SKU: {item.sku}</span>}
                  {item.colour && <span>Colour: {item.colour}</span>}
                  <span>Unit price: ${item.unitPrice?.toFixed(2)}</span>
                </div>
                {item.addons?.length > 0 && (
                  <div style={{ marginBottom: '12px' }}>
                    {item.addons.map(a => (
                      <div key={a.id} style={{ fontSize: '12px', color: '#5A5550', fontFamily: '"DM Sans", sans-serif' }}>
                        + {a.name}
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label style={{ fontSize: '12px', color: '#7A7570', fontFamily: '"DM Sans", sans-serif' }}>Qty:</label>
                    <input
                      type="number"
                      value={item.qty}
                      min={item.minQty || 1}
                      onChange={e => handleQtyChange(item.id, e.target.value)}
                      style={{ width: '80px', padding: '6px 10px', border: '1.5px solid #E0DDD7', borderRadius: '6px', fontSize: '14px', fontFamily: '"DM Sans", sans-serif', color: NAVY, outline: 'none' }}
                    />
                    {item.minQty && <span style={{ fontSize: '11px', color: '#B0AAA3' }}>Min {item.minQty}</span>}
                  </div>
                  <button onClick={() => handleRemove(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#B0AAA3', fontSize: '12px', fontFamily: '"DM Sans", sans-serif', textDecoration: 'underline', padding: 0 }}>
                    Remove
                  </button>
                </div>
              </div>

              {/* Price */}
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontFamily: '"DM Mono", monospace', fontSize: '20px', fontWeight: 600, color: GOLD }}>${item.subtotal.toFixed(2)}</div>
                <div style={{ fontSize: '11px', color: '#B0AAA3', fontFamily: '"DM Sans", sans-serif', marginTop: '3px' }}>excl. GST</div>
              </div>
            </div>
          ))}

          {/* CONTINUE SHOPPING */}
          <div style={{ paddingTop: '8px' }}>
            <Link href="/promotional-products" style={{ color: NAVY, fontSize: '14px', textDecoration: 'none', fontFamily: '"DM Sans", sans-serif', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              ← Keep Shopping
            </Link>
          </div>
        </div>

        {/* RIGHT — ORDER SUMMARY */}
        <div style={{ position: 'sticky', top: '80px' }}>
          <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E0DDD7', padding: '28px' }}>
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '24px', fontWeight: 600, color: NAVY, margin: '0 0 20px' }}>Order Summary</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px', fontSize: '14px', fontFamily: '"DM Sans", sans-serif' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#7A7570' }}>Subtotal ({cart.length} item{cart.length !== 1 ? 's' : ''})</span>
                <span style={{ fontFamily: '"DM Mono", monospace' }}>${totalSubtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#7A7570' }}>Shipping & Handling</span>
                <span style={{ fontFamily: '"DM Mono", monospace' }}>${SHIPPING.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#7A7570' }}>GST (10%)</span>
                <span style={{ fontFamily: '"DM Mono", monospace' }}>${gstAmt.toFixed(2)}</span>
              </div>
              <div style={{ height: '1px', background: '#E0DDD7' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '17px' }}>
                <span style={{ color: NAVY }}>Total (incl. GST)</span>
                <span style={{ fontFamily: '"DM Mono", monospace', color: GOLD }}>${total.toFixed(2)}</span>
              </div>
            </div>

            <div style={{ fontSize: '11px', color: '#9CA3AF', fontFamily: '"DM Sans", sans-serif', marginBottom: '20px' }}>
              All prices in AUD · $30 flat rate shipping · ABN 95 656 714 270
            </div>

            <Link href="/place-order?pay=now" style={{ display: 'block', background: GOLD, color: '#fff', textAlign: 'center', padding: '16px', borderRadius: '10px', fontSize: '16px', fontWeight: 700, textDecoration: 'none', fontFamily: '"DM Sans", sans-serif', boxShadow: '0 4px 16px rgba(201,169,110,.4)', marginBottom: '10px' }}>
              Checkout — Pay Now →
            </Link>
            <Link href="/place-order?pay=later" style={{ display: 'block', background: NAVY, color: '#fff', textAlign: 'center', padding: '16px', borderRadius: '10px', fontSize: '16px', fontWeight: 700, textDecoration: 'none', fontFamily: '"DM Sans", sans-serif', marginBottom: '12px' }}>
              Place Order — Pay Later →
            </Link>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', fontSize: '12px', color: '#7A7570', fontFamily: '"DM Sans", sans-serif' }}>
              <span>🔒 Secure checkout</span>
              <span>·</span>
              <span>EFT or Credit Card</span>
            </div>

            {/* TRUST BADGES */}
            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #F0EEED', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {[
                { icon: '🎨', text: 'Free digital proof' },
                { icon: '🚚', text: '$30 flat shipping' },
                { icon: '✅', text: 'Quality guarantee' },
                { icon: '💬', text: 'Reply within 3 business hours' },
              ].map(b => (
                <div key={b.text} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#5A5550', fontFamily: '"DM Sans", sans-serif' }}>
                  <span>{b.icon}</span><span>{b.text}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

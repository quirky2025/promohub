'use client';
import { useState, useEffect } from 'react';
import { cld } from '@/lib/cloudinary';
import { useRouter } from 'next/navigation';
import { getCart, removeFromCart, updateQty } from '@/lib/cart';

const NAVY = '#1B2A4A';
const GOLD = '#C9A96E';

export default function CartDrawer({ open, onClose }) {
  const [items, setItems] = useState([]);
  const router = useRouter();

  useEffect(() => { if (open) setItems(getCart()); }, [open]);

  const subtotal = items.reduce((s, it) => s + (Number(it.subtotal) || 0), 0);
  function go(href) { if (onClose) onClose(); router.push(href); }
  function remove(it) { setItems(removeFromCart(it.id)); }
  function changeQty(it, delta) { const q = Math.max(1, (Number(it.qty) || 1) + delta); setItems(updateQty(it.id, q)); }
  const qtyBtn = { background: '#ffffff', border: 'none', width: '26px', height: '26px', fontSize: '15px', lineHeight: 1, cursor: 'pointer', color: NAVY };

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(27,42,74,.45)', opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none', transition: 'opacity .25s', zIndex: 1000 }} />
      <aside style={{ position: 'fixed', top: 0, right: 0, height: '100%', width: '380px', maxWidth: '90vw', background: '#fff', boxShadow: '-8px 0 32px rgba(0,0,0,.18)', transform: open ? 'translateX(0)' : 'translateX(100%)', transition: 'transform .3s ease', zIndex: 1001, display: 'flex', flexDirection: 'column', fontFamily: '"DM Sans", sans-serif' }}>
        <div style={{ padding: '18px 20px', borderBottom: '1px solid #E0DDD7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '22px', color: NAVY, fontWeight: 600 }}>✅ Added to Cart</div>
          <button onClick={onClose} aria-label="Close" style={{ background: 'none', border: 'none', fontSize: '24px', lineHeight: 1, cursor: 'pointer', color: '#7A7570' }}>×</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '14px 20px' }}>
          {items.length === 0 ? (
            <div style={{ color: '#7A7570', fontSize: '14px', textAlign: 'center', marginTop: '40px' }}>Your cart is empty.</div>
          ) : items.map((it, i) => (
            <div key={it.id || i} style={{ display: 'flex', gap: '12px', padding: '12px 0', borderBottom: '1px solid #F0EEED' }}>
              {it.image && <img src={cld(it.image, 120)} alt="" style={{ width: '54px', height: '54px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: NAVY, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.productName}</div>
                {it.colour ? <div style={{ fontSize: '12px', color: '#7A7570' }}>{it.colour}</div> : null}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid #E0DDD7', borderRadius: '8px', overflow: 'hidden' }}>
                    <button onClick={() => changeQty(it, -1)} aria-label="Decrease quantity" style={qtyBtn}>−</button>
                    <span style={{ minWidth: '30px', textAlign: 'center', fontSize: '13px', color: NAVY, fontFamily: '"DM Mono", monospace' }}>{it.qty}</span>
                    <button onClick={() => changeQty(it, 1)} aria-label="Increase quantity" style={qtyBtn}>+</button>
                  </div>
                  <button onClick={() => remove(it)} style={{ background: 'none', border: 'none', color: '#9CA3AF', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>Remove</button>
                </div>
              </div>
              <div style={{ fontFamily: '"DM Mono", monospace', fontSize: '13px', fontWeight: 600, color: GOLD, whiteSpace: 'nowrap' }}>${(Number(it.subtotal) || 0).toFixed(2)}</div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid #E0DDD7', padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '15px', fontWeight: 700, color: NAVY }}>
            <span>Subtotal</span><span style={{ fontFamily: '"DM Mono", monospace' }}>${subtotal.toFixed(2)}</span>
          </div>
          <div style={{ fontSize: '11px', color: '#7A7570', marginBottom: '14px' }}>Shipping & GST calculated at checkout. Stock is confirmed before your order is processed.</div>
          <button onClick={() => go('/place-order?pay=now')} style={{ width: '100%', background: GOLD, color: '#fff', border: 'none', borderRadius: '10px', padding: '14px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', marginBottom: '8px', fontFamily: '"DM Sans", sans-serif' }}>Checkout — Pay Now</button>
          <button onClick={() => go('/place-order?pay=later')} style={{ width: '100%', background: NAVY, color: '#fff', border: 'none', borderRadius: '10px', padding: '14px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', marginBottom: '8px', fontFamily: '"DM Sans", sans-serif' }}>Place Order — Pay Later</button>
          <button onClick={onClose} style={{ width: '100%', background: '#fff', color: NAVY, border: '1.5px solid ' + NAVY, borderRadius: '10px', padding: '12px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}>← Keep Shopping</button>
        </div>
      </aside>
    </>
  );
}

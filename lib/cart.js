// lib/cart.js - Cart utility functions using localStorage
export const CART_KEY = 'quirkypromo_cart';
export function getCart() {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  } catch { return []; }
}
export function saveCart(items) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event('cart-updated'));
}
export function addToCart(item) {
  const cart = getCart();
  // Check if same product+colour+addons already in cart
  const existingIdx = cart.findIndex(c =>
    c.productId === item.productId &&
    c.colour === item.colour &&
    JSON.stringify(c.addons) === JSON.stringify(item.addons)
  );
  if (existingIdx >= 0) {
    cart[existingIdx].qty += item.qty;
    cart[existingIdx].grand = calcGrand(cart[existingIdx]);
  } else {
    cart.push({ ...item, id: Date.now().toString() });
  }
  saveCart(cart);
  return cart;
}
export function removeFromCart(id) {
  const cart = getCart().filter(c => c.id !== id);
  saveCart(cart);
  return cart;
}
export function updateQty(id, qty) {
  const cart = getCart().map(c => c.id === id ? { ...c, qty, grand: calcGrand({ ...c, qty }) } : c);
  saveCart(cart);
  return cart;
}
export function clearCart() {
  saveCart([]);
}
export function getCartCount() {
  return getCart().reduce((sum, c) => sum + c.qty, 0);
}
const MARGIN = 1.40;
const GST = 0.10;
const SHIPPING = 30;
const SETUP_FEE = 40;
export function calcGrand(item) {
  const { unitPrice, qty } = item;
  const subtotal = Math.round(unitPrice * qty * 100) / 100;
  const gst = Math.round((subtotal + SHIPPING) * GST * 100) / 100;
  return subtotal + SHIPPING + gst;
}
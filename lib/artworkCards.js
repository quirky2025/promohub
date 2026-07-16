import crypto from 'crypto';

// Create per-product artwork cards for an order so EACH product gets its own
// proof + approval on the Artwork Management board (Lily's rule: everything
// split by product). Skips items that already have a card (matched by
// order_item_index). Returns { created }.
//
// Default status 'logo_received' so the board shows "Upload Mockup" straight
// away (old customers usually already sent their artwork). No email is sent
// here — sending a proof is a deliberate action on the Artwork board.
export async function createArtworkCards(db, order) {
  const items = Array.isArray(order.items) ? order.items : [];
  if (!items.length) return { created: 0 };
  const orderNumber = order.order_number || order.invoice_number;
  if (!orderNumber) return { created: 0 };

  const { data: existing } = await db
    .from('artworks').select('order_item_index').eq('order_number', orderNumber);
  const have = new Set((existing || []).map((r) => r.order_item_index).filter((v) => v != null));

  const rows = [];
  items.forEach((it, i) => {
    if (have.has(i)) return;
    const pname = it.productName || it.product_description || it.name || `Product ${i + 1}`;
    rows.push({
      order_number: orderNumber,
      customer_name: order.customer_name || '',
      customer_email: order.customer_email || '',
      product_name: pname,
      status: 'logo_received',
      logo_url: it.artwork_url || null,
      token: crypto.randomBytes(32).toString('hex'),
      payment_method: order.payment_method || 'eft',
      order_item_index: i,
    });
  });

  if (!rows.length) return { created: 0 };
  const { error } = await db.from('artworks').insert(rows);
  if (error) throw new Error(error.message);
  return { created: rows.length };
}

import { getAdminUser, unauthorized } from '@/lib/adminAuth';
import { sourcingDb } from '@/lib/sourcingDb';
import { nextOrderNumber } from '@/lib/docNumbers';
import { createArtworkCards } from '@/lib/artworkCards';

// Create an order from scratch in the backend (old / offline customers who did
// NOT come through the website or a quote). Allocates a proper OC number, saves
// a confirmed order, and creates one artwork card PER product. No customer email
// is sent — this is an order the admin already agreed offline.
export async function POST(request) {
  const user = await getAdminUser(request);
  if (!user) return unauthorized();
  try {
    const body = await request.json();
    const {
      customer = {}, items = [],
      shipping = 0, subtotal = 0, gst = 0, total = 0,
      paymentMethod = 'eft', paymentTerms = 'prepaid', makeArtworks = true,
    } = body;

    if (!customer.name || !customer.email) {
      return Response.json({ error: 'Customer name and email are required' }, { status: 400 });
    }
    if (!Array.isArray(items) || !items.length) {
      return Response.json({ error: 'Add at least one product' }, { status: 400 });
    }

    const db = sourcingDb();
    const orderNumber = await nextOrderNumber(db);

    const cleanItems = items.map((it) => {
      const qty = Number(it.qty) || 1;
      const unitPrice = Number(it.unitPrice) || 0;
      return {
        productName: it.productName || it.name || 'Product',
        sku: it.sku || '', stockCode: it.sku || '',
        colour: it.colour || '', branding: it.branding || '',
        qty, unitPrice,
        subtotal: it.subtotal != null ? Number(it.subtotal) : Number((qty * unitPrice).toFixed(2)),
        status: 'in_production',
        artwork_approved: false,
      };
    });

    const orderRow = {
      order_number: orderNumber, invoice_number: orderNumber,
      status: 'confirmed', payment_terms: paymentTerms, payment_method: paymentMethod, payment_status: 'unpaid',
      customer_name: customer.name, customer_email: customer.email,
      customer_phone: customer.phone || '', customer_company: customer.company || '',
      delivery_address: customer.address || '',
      items: cleanItems,
      subtotal: Number(subtotal) || 0, shipping: Number(shipping) || 0, gst: Number(gst) || 0, total: Number(total) || 0,
      total_net: Number(((Number(subtotal) || 0) + (Number(shipping) || 0)).toFixed(2)),
      gst_total: Number(gst) || 0, total_gross: Number(total) || 0,
      created_at: new Date().toISOString(),
    };

    let { error } = await db.from('orders').insert(orderRow);
    if (error && /column|does not exist|could not find/i.test(error.message || '')) {
      const legacy = {
        invoice_number: orderNumber, customer_name: customer.name, customer_email: customer.email,
        customer_phone: customer.phone || '', customer_company: customer.company || '', delivery_address: customer.address || '',
        items: cleanItems, subtotal: Number(subtotal) || 0, shipping: Number(shipping) || 0, gst: Number(gst) || 0,
        total: Number(total) || 0, payment_method: paymentMethod, payment_status: 'unpaid', created_at: new Date().toISOString(),
      };
      ({ error } = await db.from('orders').insert(legacy));
    }
    if (error) return Response.json({ error: error.message }, { status: 500 });

    let artworks = 0;
    if (makeArtworks) {
      try {
        const { data: ord } = await db.from('orders').select('*').eq('order_number', orderNumber).single();
        const r = await createArtworkCards(db, ord || orderRow);
        artworks = r.created;
      } catch (_) { /* non-fatal — order already created */ }
    }

    return Response.json({ success: true, orderNumber, artworks });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

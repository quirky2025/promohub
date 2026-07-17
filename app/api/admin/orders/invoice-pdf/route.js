import { getAdminUser, unauthorized } from '@/lib/adminAuth';
import { sourcingDb } from '@/lib/sourcingDb';
import { generateOrderDocPDF, QUIRKY_BANK } from '@/lib/orderDocPdf';
import { fmtAddrRow, fmtBilling, pickDefaultDelivery } from '@/lib/companyAddress';

// When an order has no delivery address of its own (e.g. an INDENT order created
// from a quote), fall back to the customer's company account address.
async function resolveDeliveryAddress(db, order) {
  if (order.delivery_address) return order.delivery_address;
  let company = null;
  if (order.company_id) {
    const { data } = await db.from('companies').select('id, name, billing_address').eq('id', order.company_id).maybeSingle();
    company = data;
  }
  if (!company && order.customer_company) {
    const { data } = await db.from('companies').select('id, name, billing_address').ilike('name', order.customer_company).limit(1).maybeSingle();
    company = data;
  }
  if (!company) return '';
  const { data: addrs } = await db.from('company_addresses').select('*').eq('company_id', company.id);
  return fmtAddrRow(pickDefaultDelivery(addrs || [])) || fmtBilling(company.billing_address) || '';
}

// GET ?id=<order id>  → on-demand Tax Invoice PDF for an existing order.
// Used by the admin Orders modal "Generate Tax Invoice" button. Auth is by
// admin cookie (window.open sends it automatically). Returns the PDF inline.
export async function GET(request) {
  const user = await getAdminUser(request);
  if (!user) return unauthorized();
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return Response.json({ error: 'Missing id' }, { status: 400 });

    const db = sourcingDb();
    const { data: order } = await db.from('orders').select('*').eq('id', id).single();
    if (!order) return Response.json({ error: 'Order not found' }, { status: 404 });

    const orderNumber = order.order_number || order.invoice_number || '';
    const items = Array.isArray(order.items) ? order.items : [];
    const num = (v) => (v == null ? null : Number(v));
    const deliveryAddress = await resolveDeliveryAddress(db, order);

    const bytes = await generateOrderDocPDF({
      docType: 'TAX INVOICE',
      orderNumber,
      // Only pass an explicit invoice number if it's a real INV… number; otherwise
      // let the template derive INV… from the OC… order number.
      invoiceNumber: /^INV/i.test(order.invoice_number || '') ? order.invoice_number : undefined,
      date: new Date(order.created_at || Date.now()).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }),
      customer: {
        company: order.customer_company || '',
        name: order.customer_name || '',
        email: order.customer_email || '',
        phone: order.customer_phone || '',
      },
      deliveryAddress,
      items: items.map((it) => ({
        stockCode: it.sku || it.stock_code || it.productSku || it.stockCode || '',
        name: it.productName || it.product_description || it.name || 'Product',
        spec: it.spec || it.product_spec || '',
        colour: it.colour || '',
        branding: it.branding || it.brandingMethod || it.decoration_method || '',
        addons: Array.isArray(it.addons) ? it.addons.map((a) => a.name || a) : [],
        qty: it.qty ?? it.quantity ?? 1,
        unit: it.unitPrice ?? it.unit_price ?? 0,
        lineTotal: it.subtotal ?? it.line_total ?? null,
      })),
      subtotal: num(order.subtotal),
      shipping: num(order.shipping),
      gst: num(order.gst ?? order.gst_total),
      surcharge: num(order.surcharge) || 0,
      total: num(order.total ?? order.total_gross),
      paymentStatus: order.payment_status === 'paid' ? 'paid' : 'awaiting',
      leadTimeDays: '3-7',
      bank: QUIRKY_BANK,
    });

    return new Response(Buffer.from(bytes), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="TaxInvoice_${orderNumber}.pdf"`,
      },
    });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

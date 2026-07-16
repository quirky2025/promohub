import { getAdminUser, unauthorized } from '@/lib/adminAuth';
import { sourcingDb } from '@/lib/sourcingDb';
import { generateOrderDocPDF, QUIRKY_BANK } from '@/lib/orderDocPdf';

const round2 = (n) => Math.round((Number(n) || 0) * 100) / 100;

// pdf-lib's standard fonts are WinAnsi (Latin-1) only — arrows / em-dashes /
// smart quotes crash encoding. Map the common ones, strip anything else > 0xFF.
const winSafe = (s) => String(s || '')
  .replace(/[→⟶➔➜]/g, '->')
  .replace(/[←]/g, '<-')
  .replace(/[–—]/g, '-')
  .replace(/[“”]/g, '"')
  .replace(/[‘’]/g, "'")
  .replace(/[×]/g, 'x')
  .replace(/[^\x00-\xff]/g, '');

// GET ?id=<order id>&reason=... → a Credit Note (customer overpaid after a
// spec change) OR an Adjustment / Balance-due note (customer owes more).
// The amount is the difference between the revised order total and what the
// customer already paid (orders.amount_paid).
export async function GET(request) {
  const user = await getAdminUser(request);
  if (!user) return unauthorized();
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const reason = searchParams.get('reason') || '';
    if (!id) return Response.json({ error: 'Missing id' }, { status: 400 });

    const db = sourcingDb();
    const { data: order } = await db.from('orders').select('*').eq('id', id).single();
    if (!order) return Response.json({ error: 'Order not found' }, { status: 404 });

    // Adjustment lines (ex-GST, signed): − credit to customer, + they owe more.
    const adj = Array.isArray(order.adjustments) ? order.adjustments : [];
    const net = round2(adj.reduce((s, a) => s + (Number(a.amount) || 0), 0));
    if (!adj.length || Math.abs(net) < 0.01) {
      return Response.json({ error: 'No adjustment lines recorded on this order' }, { status: 400 });
    }

    const credit = net < 0;
    const gst = round2(net * 0.10);
    const total = round2(net + gst);

    const orderNumber = order.order_number || order.invoice_number || '';
    const docType = credit ? 'CREDIT NOTE' : 'ADJUSTMENT - BALANCE DUE';

    const items = adj.map((a) => ({
      stockCode: '', name: winSafe(a.desc || 'Adjustment'), colour: '', branding: '', addons: [],
      qty: 1, unit: round2(a.amount), lineTotal: round2(a.amount),
    }));

    const bytes = await generateOrderDocPDF({
      docType,
      orderNumber,
      date: new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }),
      customer: {
        company: winSafe(order.customer_company || ''), name: winSafe(order.customer_name || ''),
        email: winSafe(order.customer_email || ''), phone: winSafe(order.customer_phone || ''),
      },
      deliveryAddress: winSafe(order.delivery_address || ''),
      items,
      subtotal: net,
      shipping: 0,
      gst,
      total,
      paymentStatus: credit ? 'paid' : 'awaiting',
      leadTimeDays: '3-7',
      bank: QUIRKY_BANK,
    });

    return new Response(Buffer.from(bytes), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${credit ? 'CreditNote' : 'Balance'}_${orderNumber}.pdf"`,
      },
    });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

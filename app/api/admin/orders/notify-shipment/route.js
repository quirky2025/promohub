import { getAdminUser, unauthorized } from '@/lib/adminAuth';
import { sourcingDb } from '@/lib/sourcingDb';
import { Resend } from 'resend';
import { quirkyEmail } from '@/lib/emailLayout';

const resend = new Resend(process.env.RESEND_API_KEY);

const TRACK_URL = {
  'Australia Post': (t) => `https://auspost.com.au/mypost/track/#/details/${t}`,
  'AusPost': (t) => `https://auspost.com.au/mypost/track/#/details/${t}`,
  'FedEx': (t) => `https://www.fedex.com/fedextrack/?trknbr=${t}`,
  'DHL': (t) => `https://www.dhl.com/au-en/home/tracking.html?tracking-id=${t}`,
  'StarTrack': (t) => `https://startrack.com.au/track/search?id=${t}`,
  'TNT': (t) => `https://www.tnt.com/express/en_au/site/tracking.html?searchType=con&cons=${t}`,
};

// POST { orderId, index, parcelIndex, to } → email the customer a branded
// shipping notification for ONE product's parcel (carrier + tracking + address).
// Recipient defaults to the order's customer email but the caller can override.
export async function POST(request) {
  const user = await getAdminUser(request);
  if (!user) return unauthorized();
  try {
    const { orderId, index, parcelIndex = 0, to } = await request.json();
    if (!orderId || index == null) return Response.json({ error: 'Missing fields' }, { status: 400 });

    const db = sourcingDb();
    const { data: order } = await db.from('orders').select('*').eq('id', orderId).single();
    if (!order || !Array.isArray(order.items)) return Response.json({ error: 'Order not found' }, { status: 404 });

    const idx = Number(index);
    const item = order.items[idx];
    if (!item) return Response.json({ error: 'Product not found' }, { status: 404 });
    const parcels = Array.isArray(item.parcels) ? item.parcels : [];
    const pc = parcels[Number(parcelIndex)] || parcels[0] || {};

    const recipient = (to || order.customer_email || '').trim();
    if (!recipient) return Response.json({ error: 'No recipient email' }, { status: 400 });

    const orderNo = order.order_number || order.invoice_number || '';
    const lineRef = `${orderNo}-${idx + 1}`;
    const productName = item.productName || item.product_description || item.name || 'your item';
    const carrier = pc.carrier || '';
    const tracking = pc.tracking || '';
    const address = pc.deliverTo || '';
    const trackUrl = (carrier && tracking && TRACK_URL[carrier]) ? TRACK_URL[carrier](tracking) : '';

    const body = `
      <p style="font-size:15px;margin:0 0 16px;">Hi ${order.customer_name || 'there'},</p>
      <p style="font-size:15px;line-height:1.6;margin:0 0 16px;">Good news — <strong>${productName}</strong> from your order has been dispatched${address ? ` to <strong>${address}</strong>` : ''}.</p>
      <div style="background:#ffffff;border-radius:10px;padding:14px 18px;margin:16px 0;font-size:14px;">
        <table style="width:100%;font-size:14px;">
          <tr><td style="color:#7A7570;padding:3px 0;">Item</td><td style="text-align:right;font-weight:600;color:#1B2A4A;">${lineRef}</td></tr>
          ${carrier ? `<tr><td style="color:#7A7570;padding:3px 0;">Carrier</td><td style="text-align:right;font-weight:600;">${carrier}</td></tr>` : ''}
          ${tracking ? `<tr><td style="color:#7A7570;padding:3px 0;">Tracking</td><td style="text-align:right;font-weight:600;font-family:monospace;">${tracking}</td></tr>` : ''}
        </table>
      </div>
      ${trackUrl ? `<div style="text-align:center;margin:24px 0;"><a href="${trackUrl}" style="display:inline-block;background:#C9A96E;color:#fff;text-decoration:none;padding:13px 34px;border-radius:10px;font-weight:700;font-size:15px;">Track your parcel →</a></div>` : ''}
      <p style="font-size:14px;line-height:1.6;color:#3D3A36;margin:16px 0 0;">Any questions, just reply or call us on <strong>02 9477 4748</strong>.</p>`;

    await resend.emails.send({
      from: 'QuirkyPromo <noreply@quirkypromo.com.au>',
      replyTo: 'hello@quirkypromo.com.au',
      to: [recipient],
      subject: `Your order ${lineRef} has shipped`,
      html: quirkyEmail(body),
    });

    // Stamp the parcel as notified.
    const items = order.items.map((it, i) => {
      if (i !== idx) return it;
      const ps = Array.isArray(it.parcels) ? it.parcels.slice() : [];
      if (ps[Number(parcelIndex)]) ps[Number(parcelIndex)] = { ...ps[Number(parcelIndex)], notified_at: new Date().toISOString(), notifyEmail: recipient };
      return { ...it, parcels: ps };
    });
    await db.from('orders').update({ items }).eq('id', orderId);

    return Response.json({ success: true, items });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

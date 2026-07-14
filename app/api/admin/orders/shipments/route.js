import { getAdminUser, unauthorized } from '@/lib/adminAuth';
import { sourcingDb } from '@/lib/sourcingDb';
import { Resend } from 'resend';
import { quirkyEmail } from '@/lib/emailLayout';

const resend = new Resend(process.env.RESEND_API_KEY);

// Build a tracking URL from carrier + number when one isn't supplied.
const TRACK_URL = {
  'Australia Post': (t) => `https://auspost.com.au/mypost/track/#/details/${t}`,
  'StarTrack': (t) => `https://startrack.com.au/track/details/${t}`,
  'FedEx': (t) => `https://www.fedex.com/fedextrack/?trknbr=${t}`,
  'Direct Freight Express': (t) => `https://www.directfreight.com.au/Track/Track?ConNote=${t}`,
};
function trackUrl(carrier, number, provided) {
  if (provided) return provided;
  const fn = TRACK_URL[carrier];
  return (number && fn) ? fn(number) : null;
}

// Per-parcel dispatch email — like the order dispatch email, but scoped to ONE shipment.
async function emailShipment(order, ship) {
  // tracking goes to THIS parcel's recipient; fall back to the order's buyer
  const email = ship.recipient_email || order.customer_email;
  if (!email) return;
  const name = ship.recipient_name || order.customer_name || 'there';
  const orderNo = order.order_number || order.invoice_number || '';
  const url = trackUrl(ship.carrier, ship.tracking_number, ship.tracking_url);
  const delivered = ship.status === 'delivered';

  const trackLine = ship.tracking_number
    ? `<div style="background:#ffffff;border-radius:10px;padding:14px 18px;margin:16px 0;font-size:14px;border:1px solid #E0DDD7;">
         <span style="color:#000;">Carrier</span> <strong style="color:#000;">${ship.carrier || 'Courier'}</strong>
         &nbsp;·&nbsp; <span style="color:#000;">Tracking</span> <strong style="color:#000;">${ship.tracking_number}</strong>
         ${url ? `<div style="margin-top:8px;"><a href="${url}" style="color:#C9A96E;font-weight:600;">Track this parcel →</a></div>` : ''}
       </div>`
    : '';
  const contentsLine = ship.contents
    ? `<p style="font-size:14px;line-height:1.6;color:#000;margin:0 0 8px;"><strong>In this parcel:</strong> ${ship.contents}</p>` : '';
  const toLine = ship.address
    ? `<p style="font-size:14px;line-height:1.6;color:#000;margin:0 0 16px;"><strong>Delivering to:</strong> ${ship.address}</p>` : '';

  const subject = delivered
    ? `A parcel from your order has arrived — ${orderNo}`
    : `Part of your order is on its way — ${orderNo}`;
  const lead = delivered
    ? `A parcel from your order <strong>${orderNo}</strong> has been delivered. 🎉`
    : `Good news — part of your order <strong>${orderNo}</strong> has been dispatched! 🚚`;

  const body = `
    <p style="font-size:15px;margin:0 0 16px;color:#000;">Hi ${name},</p>
    <p style="font-size:15px;line-height:1.6;margin:0 0 12px;color:#000;">${lead}</p>
    ${contentsLine}
    ${toLine}
    ${delivered ? '' : trackLine}
    <p style="font-size:14px;line-height:1.6;color:#000;margin:16px 0 0;">Your order is being sent in a few parcels — we'll let you know as each one goes out. Any questions, just reply or call us on <strong>02 9477 4748</strong>.</p>`;

  await resend.emails.send({
    from: 'QuirkyPromo <noreply@quirkypromo.com.au>',
    replyTo: 'hello@quirkypromo.com.au',
    to: [email],
    subject,
    html: quirkyEmail(body),
  });
}

// GET ?orderId=… → list shipments for an order
export async function GET(request) {
  const user = await getAdminUser(request);
  if (!user) return unauthorized();
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('orderId');
  if (!orderId) return Response.json({ error: 'Missing orderId' }, { status: 400 });

  const db = sourcingDb();
  const { data, error } = await db
    .from('order_shipments').select('*').eq('order_id', orderId)
    .order('seq', { ascending: true }).order('created_at', { ascending: true });
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ shipments: data || [] });
}

// POST → create a shipment (optionally notify the customer)
export async function POST(request) {
  const user = await getAdminUser(request);
  if (!user) return unauthorized();

  try {
    const b = await request.json();
    const { orderId, notify } = b;
    if (!orderId) return Response.json({ error: 'Missing orderId' }, { status: 400 });

    const db = sourcingDb();
    const { data: order } = await db.from('orders').select('*').eq('id', orderId).single();
    if (!order) return Response.json({ error: 'Order not found' }, { status: 404 });

    // next seq number
    const { data: existing } = await db.from('order_shipments').select('seq').eq('order_id', orderId);
    const nextSeq = (existing || []).reduce((m, r) => Math.max(m, r.seq || 0), 0) + 1;

    const status = b.status || (b.shipDate ? 'shipped' : 'pending');
    const url = trackUrl(b.carrier, b.trackingNumber, b.trackingUrl);

    const row = {
      order_id: orderId,
      seq: nextSeq,
      carrier: b.carrier || null,
      tracking_number: b.trackingNumber || null,
      tracking_url: url,
      ship_date: b.shipDate || null,
      recipient_name: b.recipientName || null,
      recipient_email: b.recipientEmail || null,
      address: b.address || null,
      contents: b.contents || null,
      status,
      notes: b.notes || null,
    };

    const { data: created, error } = await db.from('order_shipments').insert(row).select('*').single();
    if (error) return Response.json({ error: error.message }, { status: 500 });

    // Nudge the order status forward to 'dispatched' once a parcel ships (don't downgrade)
    if (status === 'shipped' && !['dispatched', 'completed', 'delivered'].includes(order.status)) {
      await db.from('orders').update({ status: 'dispatched', dispatched_at: new Date().toISOString() }).eq('id', orderId);
    }

    if (notify && status !== 'pending') {
      try {
        await emailShipment(order, created);
        await db.from('order_shipments').update({ notified_at: new Date().toISOString() }).eq('id', created.id);
        created.notified_at = new Date().toISOString();
      } catch {}
    }

    return Response.json({ shipment: created });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

// PATCH → update a shipment (edit fields, mark delivered, optionally notify)
export async function PATCH(request) {
  const user = await getAdminUser(request);
  if (!user) return unauthorized();

  try {
    const b = await request.json();
    const { id, notify } = b;
    if (!id) return Response.json({ error: 'Missing shipment id' }, { status: 400 });

    const db = sourcingDb();
    const updates = {};
    for (const [key, col] of Object.entries({
      carrier: 'carrier', trackingNumber: 'tracking_number', trackingUrl: 'tracking_url',
      shipDate: 'ship_date', recipientName: 'recipient_name', recipientEmail: 'recipient_email', address: 'address',
      contents: 'contents', status: 'status', notes: 'notes',
    })) {
      if (Object.prototype.hasOwnProperty.call(b, key)) updates[col] = b[key] || null;
    }
    // recompute tracking URL if carrier/number changed and no explicit URL given
    if ((updates.carrier || updates.tracking_number) && !b.trackingUrl) {
      const { data: cur } = await db.from('order_shipments').select('carrier,tracking_number').eq('id', id).single();
      const carrier = updates.carrier ?? cur?.carrier;
      const number = updates.tracking_number ?? cur?.tracking_number;
      const u = trackUrl(carrier, number, null);
      if (u) updates.tracking_url = u;
    }

    const { data: updated, error } = await db.from('order_shipments').update(updates).eq('id', id).select('*').single();
    if (error) return Response.json({ error: error.message }, { status: 500 });

    if (notify && updated.status !== 'pending') {
      const { data: order } = await db.from('orders').select('*').eq('id', updated.order_id).single();
      if (order) {
        try {
          await emailShipment(order, updated);
          await db.from('order_shipments').update({ notified_at: new Date().toISOString() }).eq('id', id);
          updated.notified_at = new Date().toISOString();
        } catch {}
      }
    }

    // If every shipment is delivered, mark the order completed
    if (updated.status === 'delivered') {
      const { data: all } = await db.from('order_shipments').select('status').eq('order_id', updated.order_id);
      if ((all || []).length && all.every((s) => s.status === 'delivered')) {
        await db.from('orders').update({ status: 'completed' }).eq('id', updated.order_id);
      }
    }

    return Response.json({ shipment: updated });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

// DELETE ?id=… → remove a shipment
export async function DELETE(request) {
  const user = await getAdminUser(request);
  if (!user) return unauthorized();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return Response.json({ error: 'Missing id' }, { status: 400 });
  const db = sourcingDb();
  const { error } = await db.from('order_shipments').delete().eq('id', id);
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ success: true });
}

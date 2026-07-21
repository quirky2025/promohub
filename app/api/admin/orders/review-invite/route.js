import { Resend } from 'resend';
import { getAdminUser, unauthorized } from '@/lib/adminAuth';
import { sourcingDb } from '@/lib/sourcingDb';
import { quirkyEmail } from '@/lib/emailLayout';

// D13 · Per-product review invitation → 站内评价表单(token 链接)。
// 提交后感谢页再引导 Google(双轨:站内评价墙 + Google 门面)。
// POST { orderId, index, to } → 建 product_reviews 邀评行(token)→ 发英文邮件
// → 记 items[index].review_invite;可重发(重发复用未提交的 token,已提交则建新行)。

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  const user = await getAdminUser(request);
  if (!user) return unauthorized();

  try {
    const { orderId, index, to } = await request.json();
    if (!orderId || index == null || !to) {
      return Response.json({ error: 'Missing orderId / index / to' }, { status: 400 });
    }

    const db = sourcingDb();
    const { data: order, error: readErr } = await db
      .from('orders')
      .select('id, order_number, invoice_number, customer_name, customer_email, items')
      .eq('id', orderId).single();
    if (readErr || !order || !Array.isArray(order.items)) {
      return Response.json({ error: 'Order or items not found' }, { status: 404 });
    }
    const idx = Number(index);
    const item = order.items[idx];
    if (!item) return Response.json({ error: `No item at index ${idx}` }, { status: 404 });
    if ((item.status || '') !== 'delivered') {
      return Response.json({ error: 'Review invite is only available after this product is delivered' }, { status: 400 });
    }

    const productName = item.display_title || item.name || item.product_name || 'your order';
    const firstName = String(order.customer_name || '').trim().split(/\s+/)[0] || 'there';

    // 找到该产品的 product_id(按 items 里可能存的 id/product_id/supplier_sku 依次匹配)
    let productId = item.product_id || item.productId || null;
    if (!productId && (item.supplier_sku || item.sku)) {
      const { data: p } = await db.from('products').select('id')
        .eq('supplier_sku', item.supplier_sku || item.sku).limit(1).maybeSingle();
      productId = p?.id || null;
    }
    if (!productId && item.slug) {
      const { data: p } = await db.from('products').select('id').eq('slug', item.slug).limit(1).maybeSingle();
      productId = p?.id || null;
    }
    if (!productId) {
      return Response.json({ error: 'Could not resolve product_id for this line item (no product_id/sku/slug on item)' }, { status: 400 });
    }

    // 未提交的旧邀评 → 复用 token(重发);已提交 → 新建一行
    let token = null;
    const { data: existing } = await db.from('product_reviews')
      .select('id, token, status')
      .eq('order_id', orderId).eq('order_item_index', idx).eq('status', 'invited')
      .limit(1).maybeSingle();
    if (existing) {
      token = existing.token;
      await db.from('product_reviews').update({ customer_email: String(to).trim(), invited_at: new Date().toISOString() }).eq('id', existing.id);
    } else {
      const { data: created, error: insErr } = await db.from('product_reviews').insert({
        product_id: productId,
        order_id: orderId,
        order_item_index: idx,
        customer_name: order.customer_name || null,
        customer_email: String(to).trim(),
        status: 'invited',
        source: 'invite',
      }).select('token').single();
      if (insErr) return Response.json({ error: `invite row: ${insErr.message}` }, { status: 500 });
      token = created.token;
    }

    const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.quirkypromo.com.au';
    const reviewUrl = `${site}/review/${token}`;

    const body = `
      <p style="font-size:15px;color:#1a1a1a;">Hi ${firstName},</p>
      <p style="font-size:14px;color:#1a1a1a;line-height:1.7;">
        We hope your <strong style="color:#1B2A4A;">${productName}</strong> arrived safely and your team loves how the branding turned out.
      </p>
      <p style="font-size:14px;color:#1a1a1a;line-height:1.7;">
        Would you take 30 seconds to rate it? Your feedback helps other businesses choose with confidence — and helps our small Australian team keep improving.
      </p>
      <p style="margin:22px 0;">
        <a href="${reviewUrl}"
           style="background:#C9A96E;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 26px;border-radius:8px;display:inline-block;">
          Rate your ${productName.length > 30 ? 'order' : productName}
        </a>
      </p>
      <p style="font-size:13px;color:#1a1a1a;line-height:1.6;">
        And if anything isn't perfect, please just reply to this email — we'll make it right first.
      </p>`;

    await resend.emails.send({
      from: 'QuirkyPromo <noreply@quirkypromo.com.au>',
      to: [String(to).trim()],
      reply_to: 'hello@quirkypromo.com.au',
      subject: `How did we do? — ${productName}`,
      html: quirkyEmail(body),
    });

    const now = new Date().toISOString();
    const items = order.items.map((it, i) => i === idx
      ? { ...it, review_invite: { sent_at: now, to: String(to).trim(), count: ((it.review_invite?.count || 0) + 1) } }
      : it);
    const { error: upErr } = await db.from('orders').update({ items }).eq('id', orderId);
    if (upErr) return Response.json({ error: `Sent, but failed to record: ${upErr.message}` }, { status: 500 });

    return Response.json({ success: true, items });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

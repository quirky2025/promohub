import { getAdminUser, unauthorized } from '@/lib/adminAuth';
import { sourcingDb } from '@/lib/sourcingDb';
import { generateFactoryPoPDF } from '@/lib/factoryPoDocPdf';
import { Resend } from 'resend';
import { quirkyEmail } from '@/lib/emailLayout';

const resend = new Resend(process.env.RESEND_API_KEY);

// Map a factory_pos row (+ joined factory) into the Factory PO PDF shape.
function poPdfPayload(po) {
  const f = po.factories || {};
  return {
    poNumber: po.po_number,
    date: new Date(po.created_at || Date.now()).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }),
    ourRef: po.order_number || '',
    supplier: {
      name: f.name,
      contact: f.contact_person,
      phone: [f.phone, f.wechat ? `WeChat: ${f.wechat}` : null].filter(Boolean).join('  '),
      address: f.address,
    },
    shipTo: { label: 'Our forwarder (EXW collection)', address: 'To be advised — please hold for collection and notify us when ready.' },
    incoterm: 'EXW',
    paymentTerms: f.payment_terms || '30% deposit, 70% before shipment',
    items: [{ name: po.product_name || 'Product', spec: [po.product_sku, po.product_spec].filter(Boolean).join(' · '), qty: po.quantity, unitRmb: po.unit_price_rmb }],
    charges: Number(po.extra_rmb) ? [{ label: 'Setup / tooling / sample', amountRmb: po.extra_rmb }] : [],
    notes: po.notes || '',
  };
}

// Factory PO (China procurement) + RMB payments (Dad's WeChat) + Dad-loan ledger.
// FX convention: fx_rate = ¥ per A$1, so AUD = RMB / fx_rate.
// One route, action-based POST, so the whole China-procurement panel on the
// INDENT order talks to a single endpoint. Everything has full CRUD.

const num = (v) => {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};
const text = (v) => (typeof v === 'string' && v.trim() ? v.trim() : null);
const audOf = (rmb, fx) => (num(rmb) != null && num(fx) ? Number((num(rmb) / num(fx)).toFixed(2)) : null);

async function nextSpoNumber(db) {
  const fy = (() => { const d = new Date(); const y = d.getFullYear(); const endYr = d.getMonth() >= 6 ? y + 1 : y; return String(endYr).slice(2); })();
  const { count } = await db.from('factory_pos').select('*', { count: 'exact', head: true });
  return `SPO${fy}${String((count || 0) + 1001).padStart(4, '0')}`;
}

// Assemble the full procurement bundle for a customer order.
async function bundle(db, orderNumber) {
  const { data: pos } = await db.from('factory_pos').select('*, factories(id, name, contact_person, wechat, phone, email, address, payment_terms)')
    .eq('order_number', orderNumber).order('created_at', { ascending: true });
  const list = pos || [];
  const ids = list.map((p) => p.id);
  let payments = [];
  if (ids.length) {
    const { data } = await db.from('factory_po_payments').select('*').in('factory_po_id', ids).order('paid_date', { ascending: true });
    payments = data || [];
  }
  const { data: repays } = await db.from('dad_repayments').select('*').eq('ref_order_number', orderNumber).order('paid_date', { ascending: true });
  const repayments = repays || [];

  const paidToFactoryAud = payments.reduce((s, p) => s + (num(p.amount_aud) || 0), 0);
  const paidToFactoryRmb = payments.reduce((s, p) => s + (num(p.amount_rmb) || 0), 0);
  const repaidToDadAud = repayments.reduce((s, r) => s + (num(r.amount_aud) || 0), 0);
  const owedToDad = Number((paidToFactoryAud - repaidToDadAud).toFixed(2));

  return { pos: list, payments, repayments, ledger: { paidToFactoryRmb, paidToFactoryAud: Number(paidToFactoryAud.toFixed(2)), repaidToDadAud: Number(repaidToDadAud.toFixed(2)), owedToDad } };
}

// Whole-of-business procurement summary (all factory POs + global Dad ledger),
// used by the Sourcing procurement page.
async function summary(db) {
  const { data: pos } = await db.from('factory_pos').select('*, factories(id, name)').order('created_at', { ascending: false });
  const list = pos || [];
  const ids = list.map((p) => p.id);
  let payments = [];
  if (ids.length) {
    const { data } = await db.from('factory_po_payments').select('*').in('factory_po_id', ids);
    payments = data || [];
  }
  const { data: repays } = await db.from('dad_repayments').select('*');
  const repayments = repays || [];
  const paidByPo = {};
  payments.forEach((p) => { paidByPo[p.factory_po_id] = (paidByPo[p.factory_po_id] || 0) + (num(p.amount_rmb) || 0); });
  const rows = list.map((p) => ({ ...p, paid_rmb: paidByPo[p.id] || 0 }));
  const paidToFactoryAud = payments.reduce((s, p) => s + (num(p.amount_aud) || 0), 0);
  const repaidToDadAud = repayments.reduce((s, r) => s + (num(r.amount_aud) || 0), 0);
  return { pos: rows, ledger: { paidToFactoryAud: Number(paidToFactoryAud.toFixed(2)), repaidToDadAud: Number(repaidToDadAud.toFixed(2)), owedToDad: Number((paidToFactoryAud - repaidToDadAud).toFixed(2)) } };
}

export async function GET(request) {
  const user = await getAdminUser(request);
  if (!user) return unauthorized();
  const { searchParams } = new URL(request.url);
  const orderNumber = searchParams.get('orderNumber');
  const db = sourcingDb();
  try {
    // Factory PO PDF (inline). ?pdf=1&poId=…
    if (searchParams.get('pdf')) {
      const poId = searchParams.get('poId');
      if (!poId) return Response.json({ error: 'poId required' }, { status: 400 });
      const { data: po } = await db.from('factory_pos').select('*, factories(*)').eq('id', poId).single();
      if (!po) return Response.json({ error: 'PO not found' }, { status: 404 });
      const bytes = await generateFactoryPoPDF(poPdfPayload(po));
      return new Response(Buffer.from(bytes), { headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': `inline; filename="PO_${po.po_number}.pdf"` } });
    }
    if (searchParams.get('all')) return Response.json(await summary(db));
    if (!orderNumber) return Response.json({ error: 'orderNumber required' }, { status: 400 });
    return Response.json(await bundle(db, orderNumber));
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request) {
  const user = await getAdminUser(request);
  if (!user) return unauthorized();
  try {
    const body = await request.json();
    const action = body.action;
    const db = sourcingDb();

    // ---- Factory PO ----
    if (action === 'savePO') {
      const row = {
        order_number: text(body.orderNumber),
        factory_id: text(body.factoryId),
        product_sku: text(body.productSku),
        product_name: text(body.productName),
        product_spec: text(body.productSpec),
        quantity: num(body.quantity),
        unit_price_rmb: num(body.unitPriceRmb),
        extra_rmb: num(body.extraRmb) || 0,
        total_rmb: num(body.totalRmb),
        fx_rate: num(body.fxRate),
        factory_invoice_number: text(body.factoryInvoiceNumber),
        factory_invoice_rmb: num(body.factoryInvoiceRmb),
        factory_invoice_date: text(body.factoryInvoiceDate),
        factory_invoice_url: text(body.factoryInvoiceUrl),
        status: text(body.status) || 'draft',
        notes: text(body.notes),
        updated_at: new Date().toISOString(),
      };
      if (body.id) {
        const { data, error } = await db.from('factory_pos').update(row).eq('id', body.id).select('*').single();
        if (error) return Response.json({ error: error.message }, { status: 500 });
        return Response.json({ po: data, ...(row.order_number ? await bundle(db, row.order_number) : {}) });
      }
      row.po_number = await nextSpoNumber(db);
      row.created_by = user.email;
      const { data, error } = await db.from('factory_pos').insert(row).select('*').single();
      if (error) return Response.json({ error: error.message }, { status: 500 });
      return Response.json({ po: data, ...(row.order_number ? await bundle(db, row.order_number) : {}) });
    }

    if (action === 'sendPO') {
      if (!body.id) return Response.json({ error: 'id required' }, { status: 400 });
      const { data: po } = await db.from('factory_pos').select('*, factories(*)').eq('id', body.id).single();
      if (!po) return Response.json({ error: 'PO not found' }, { status: 404 });
      const f = po.factories || {};
      const to = (body.toOverride || f.email || '').trim();
      if (!to.includes('@')) return Response.json({ error: '没有工厂邮箱。请到 工厂管理 给这家工厂填 Email，或手动填收件地址。' }, { status: 400 });
      const bytes = await generateFactoryPoPDF(poPdfPayload(po));
      const html = `
        <p style="font-size:15px;margin:0 0 16px;color:#000;">Hi ${f.contact_person || 'there'},</p>
        <p style="font-size:15px;line-height:1.6;margin:0 0 16px;color:#000;">Please find attached our Purchase Order <strong>${po.po_number}</strong> for <strong>${po.product_name || 'product'}</strong> (Qty ${po.quantity || ''}). Could you please confirm receipt and the expected completion date?</p>
        <p style="font-size:14px;line-height:1.6;color:#000;margin:16px 0 0;">Thank you,<br>QuirkyPromo Sourcing · hello@quirkypromo.com.au</p>`;
      await resend.emails.send({
        from: 'QuirkyPromo <noreply@quirkypromo.com.au>', replyTo: 'hello@quirkypromo.com.au',
        to: [to], subject: `Purchase Order ${po.po_number} — QuirkyPromo`,
        html: quirkyEmail(html),
        attachments: [{ filename: `PO_${po.po_number}.pdf`, content: Buffer.from(bytes).toString('base64') }],
      });
      try { await db.from('factory_pos').update({ status: po.status === 'draft' ? 'sent' : po.status, updated_at: new Date().toISOString() }).eq('id', po.id); } catch (_) { /* ignore */ }
      return Response.json({ success: true, to, ...(po.order_number ? await bundle(db, po.order_number) : {}) });
    }

    if (action === 'deletePO') {
      if (!body.id) return Response.json({ error: 'id required' }, { status: 400 });
      const { error } = await db.from('factory_pos').delete().eq('id', body.id);
      if (error) return Response.json({ error: error.message }, { status: 500 });
      return Response.json({ ...(body.orderNumber ? await bundle(db, body.orderNumber) : { success: true }) });
    }

    // ---- RMB payment legs ----
    if (action === 'savePayment') {
      const row = {
        factory_po_id: text(body.factoryPoId),
        kind: text(body.kind) || 'deposit',
        amount_rmb: num(body.amountRmb),
        fx_rate: num(body.fxRate),
        amount_aud: audOf(body.amountRmb, body.fxRate),
        paid_date: text(body.paidDate),
        proof_url: text(body.proofUrl),
        note: text(body.note),
      };
      if (row.amount_rmb == null) return Response.json({ error: 'amount_rmb required' }, { status: 400 });
      if (body.id) {
        const { error } = await db.from('factory_po_payments').update(row).eq('id', body.id);
        if (error) return Response.json({ error: error.message }, { status: 500 });
      } else {
        row.created_by = user.email;
        const { error } = await db.from('factory_po_payments').insert(row);
        if (error) return Response.json({ error: error.message }, { status: 500 });
      }
      // Auto-advance PO status when fully paid vs deposit.
      try {
        const { data: po } = await db.from('factory_pos').select('id, total_rmb, order_number').eq('id', row.factory_po_id).single();
        if (po) {
          const { data: legs } = await db.from('factory_po_payments').select('amount_rmb').eq('factory_po_id', po.id);
          const paid = (legs || []).reduce((s, l) => s + (num(l.amount_rmb) || 0), 0);
          const st = (num(po.total_rmb) && paid >= num(po.total_rmb) - 0.01) ? 'paid' : (paid > 0 ? 'deposit_paid' : 'sent');
          await db.from('factory_pos').update({ status: st, updated_at: new Date().toISOString() }).eq('id', po.id);
          return Response.json(await bundle(db, po.order_number || body.orderNumber));
        }
      } catch (_) { /* non-fatal */ }
      return Response.json(body.orderNumber ? await bundle(db, body.orderNumber) : { success: true });
    }

    if (action === 'deletePayment') {
      if (!body.id) return Response.json({ error: 'id required' }, { status: 400 });
      const { error } = await db.from('factory_po_payments').delete().eq('id', body.id);
      if (error) return Response.json({ error: error.message }, { status: 500 });
      return Response.json(body.orderNumber ? await bundle(db, body.orderNumber) : { success: true });
    }

    // ---- Dad AUD repayments ----
    if (action === 'saveRepayment') {
      const row = {
        amount_aud: num(body.amountAud),
        paid_date: text(body.paidDate),
        method: text(body.method),
        ref_order_number: text(body.orderNumber),
        ref_factory_po_id: text(body.factoryPoId),
        note: text(body.note),
        proof_url: text(body.proofUrl),
      };
      if (row.amount_aud == null) return Response.json({ error: 'amount_aud required' }, { status: 400 });
      if (body.id) {
        const { error } = await db.from('dad_repayments').update(row).eq('id', body.id);
        if (error) return Response.json({ error: error.message }, { status: 500 });
      } else {
        row.created_by = user.email;
        const { error } = await db.from('dad_repayments').insert(row);
        if (error) return Response.json({ error: error.message }, { status: 500 });
      }
      return Response.json(body.orderNumber ? await bundle(db, body.orderNumber) : { success: true });
    }

    if (action === 'deleteRepayment') {
      if (!body.id) return Response.json({ error: 'id required' }, { status: 400 });
      const { error } = await db.from('dad_repayments').delete().eq('id', body.id);
      if (error) return Response.json({ error: error.message }, { status: 500 });
      return Response.json(body.orderNumber ? await bundle(db, body.orderNumber) : { success: true });
    }

    return Response.json({ error: 'Unsupported action' }, { status: 400 });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

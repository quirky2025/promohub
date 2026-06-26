import { NextResponse } from 'next/server';
import { getAdminUser, isAdmin, unauthorized } from '@/lib/adminAuth';
import { sourcingDb } from '@/lib/sourcingDb';

function text(v) { return typeof v === 'string' && v.trim() ? v.trim() : null; }
function money(v) { const n = Number(v); return Number.isFinite(n) ? Math.round(n * 100) / 100 : 0; }
function num(v) { const n = Number(v); return Number.isFinite(n) ? n : 0; }

export async function GET(request) {
  if (!(await isAdmin(request))) return unauthorized();
  const db = sourcingDb();
  try {
    const [billsRes, paysRes, ordersRes] = await Promise.all([
      db.from('forwarder_bills').select('*').order('created_at', { ascending: false }).limit(300),
      db.from('forwarder_payments').select('*, forwarder_payment_allocations(*)').order('payment_date', { ascending: false }).limit(100),
      db.from('sourcing_orders').select('id, order_number, product_name, quantity, est_international_freight_aud, actual_freight_aud, factories(name)').order('created_at', { ascending: false }).limit(200),
    ]);
    if (billsRes.error) return NextResponse.json({ error: billsRes.error.message }, { status: 500 });
    return NextResponse.json({
      bills: billsRes.data || [],
      payments: paysRes.error ? [] : (paysRes.data || []),
      orders: ordersRes.error ? [] : (ordersRes.data || []),
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  const user = await getAdminUser(request);
  if (!user) return unauthorized();
  try {
    const body = await request.json();
    const db = sourcingDb();

    // ── Add a forwarder bill (one RMB invoice tied to an order) ──
    if (body.action === 'bill') {
      let orderNumber = text(body.orderNumber);
      if (body.sourcingOrderId && !orderNumber) {
        const { data: o } = await db.from('sourcing_orders').select('order_number').eq('id', body.sourcingOrderId).maybeSingle();
        orderNumber = o?.order_number || null;
      }
      const row = {
        forwarder_name: text(body.forwarderName),
        invoice_number: text(body.invoiceNumber),
        invoice_date: text(body.invoiceDate),
        currency: 'RMB',
        amount_rmb: money(body.amountRmb),
        sourcing_order_id: body.sourcingOrderId || null,
        order_number: orderNumber,
        description: text(body.description),
        status: 'unpaid',
        created_by: user.email,
      };
      const { data, error } = await db.from('forwarder_bills').insert(row).select().single();
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ bill: data });
    }

    // ── Record a lump AUD payment that settles several RMB bills ──
    if (body.action === 'payment') {
      const fx = num(body.fxRate);
      if (!fx) return NextResponse.json({ error: 'fxRate (RMB→AUD) is required' }, { status: 400 });
      const allocInput = Array.isArray(body.allocations) ? body.allocations.filter((a) => a.billId) : [];
      if (!allocInput.length) return NextResponse.json({ error: 'Select at least one bill' }, { status: 400 });

      // load the bills
      const billIds = allocInput.map((a) => a.billId);
      const { data: bills, error: bErr } = await db.from('forwarder_bills').select('*').in('id', billIds);
      if (bErr) return NextResponse.json({ error: bErr.message }, { status: 500 });
      const billMap = Object.fromEntries((bills || []).map((b) => [b.id, b]));

      // per-bill AUD = RMB × fx
      const fee = money(body.handlingFeeAud);
      const feeGst = money(body.handlingFeeGstAud);
      let allocs = allocInput.map((a) => {
        const bill = billMap[a.billId];
        const rmb = a.amountRmb != null && a.amountRmb !== '' ? money(a.amountRmb) : money(bill?.amount_rmb);
        return { billId: a.billId, bill, rmb, aud: money(rmb * fx) };
      });
      const billsAud = money(allocs.reduce((s, a) => s + a.aud, 0));

      // pro-rata handling fee (remainder onto the last line so the split is exact)
      let feeAssigned = 0;
      allocs = allocs.map((a, i) => {
        let share;
        if (i === allocs.length - 1) share = money(fee - feeAssigned);
        else { share = billsAud > 0 ? money(fee * (a.aud / billsAud)) : 0; feeAssigned = money(feeAssigned + share); }
        return { ...a, feeShare: share, total: money(a.aud + share) };
      });
      const totalAud = money(billsAud + fee);

      // 1) payment row
      const { data: payment, error: pErr } = await db.from('forwarder_payments').insert({
        payment_date: text(body.paymentDate) || new Date().toISOString().slice(0, 10),
        forwarder_name: text(body.forwarderName),
        fx_rate: fx,
        bills_aud: billsAud,
        handling_fee_aud: fee,
        handling_fee_gst_aud: feeGst,
        total_aud: totalAud,
        note: text(body.note),
        created_by: user.email,
      }).select().single();
      if (pErr) return NextResponse.json({ error: pErr.message }, { status: 500 });

      // 2) one bank transaction (money out)
      const ocList = allocs.map((a) => a.bill?.order_number).filter(Boolean).join(', ');
      const { data: bankTxn } = await db.from('bank_transactions').insert({
        txn_date: payment.payment_date,
        direction: 'out',
        amount_aud: totalAud,
        gst_aud: feeGst,
        business_line: 'sourcing',
        category: 'cogs_intl_freight',
        counterparty: text(body.forwarderName) || 'Forwarder',
        description: `Forwarder payment — ${allocs.length} invoice(s)${ocList ? ' · ' + ocList : ''} @ FX ${fx}${fee ? ` + fee $${fee}` : ''}`,
        reference: ocList || null,
        reconciled: true,
        source: 'system',
        linked_type: 'forwarder_payment',
        linked_id: payment.id,
        created_by: user.email,
      }).select().single();
      if (bankTxn?.id) await db.from('forwarder_payments').update({ bank_transaction_id: bankTxn.id }).eq('id', payment.id);

      // 3) allocations + mark bills paid + write actual freight back to each order
      for (const a of allocs) {
        await db.from('forwarder_payment_allocations').insert({
          payment_id: payment.id,
          bill_id: a.billId,
          sourcing_order_id: a.bill?.sourcing_order_id || null,
          order_number: a.bill?.order_number || null,
          amount_rmb: a.rmb,
          amount_aud: a.aud,
          fee_share_aud: a.feeShare,
          total_aud: a.total,
        });
        await db.from('forwarder_bills').update({
          status: 'paid', payment_id: payment.id, paid_aud: a.aud, fee_share_aud: a.feeShare,
        }).eq('id', a.billId);

        if (a.bill?.sourcing_order_id) {
          // accumulate (an order may have more than one forwarder bill)
          const { data: ord } = await db.from('sourcing_orders').select('actual_freight_aud, forwarder_invoice_number').eq('id', a.bill.sourcing_order_id).maybeSingle();
          const prior = num(ord?.actual_freight_aud);
          const inv = [ord?.forwarder_invoice_number, a.bill.invoice_number].filter(Boolean).join(', ');
          await db.from('sourcing_orders').update({
            actual_freight_aud: money(prior + a.total),
            forwarder_invoice_number: inv || null,
          }).eq('id', a.bill.sourcing_order_id);
          await db.from('sourcing_order_events').insert({
            order_id: a.bill.sourcing_order_id,
            event_type: 'freight_reconciled',
            note: `Forwarder freight reconciled: ¥${a.rmb} × ${fx} = $${a.aud}${a.feeShare ? ` + fee $${a.feeShare}` : ''} = $${a.total}`,
            snapshot: { paymentId: payment.id, billId: a.billId },
            created_by: user.email,
          });
        }
      }

      return NextResponse.json({ payment, allocations: allocs.map((a) => ({ billId: a.billId, orderNumber: a.bill?.order_number, rmb: a.rmb, aud: a.aud, feeShare: a.feeShare, total: a.total })), totalAud, billsAud });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  if (!(await isAdmin(request))) return unauthorized();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('billId');
  if (!id) return NextResponse.json({ error: 'billId is required' }, { status: 400 });
  const { error } = await sourcingDb().from('forwarder_bills').delete().eq('id', id).eq('status', 'unpaid');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

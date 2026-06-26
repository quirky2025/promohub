import { NextResponse } from 'next/server';
import { isAdmin, unauthorized } from '@/lib/adminAuth';
import { sourcingDb } from '@/lib/sourcingDb';
import { ACCOUNT_BY_CODE, sectionOf } from '@/lib/financeAccounts';

const r2 = (n) => Math.round(((Number(n) || 0) + Number.EPSILON) * 100) / 100;

// Australian financial year start (1 Jul) for a given date.
function fyStart(d = new Date()) {
  const y = d.getFullYear();
  const start = d.getMonth() >= 6 ? y : y - 1; // month is 0-based; >=6 means Jul+
  return `${start}-07-01`;
}

// GET ?from=YYYY-MM-DD&to=YYYY-MM-DD  → cash-basis, ex-GST P&L.
export async function GET(request) {
  if (!(await isAdmin(request))) return unauthorized();
  const db = sourcingDb();
  const { searchParams } = new URL(request.url);
  const to = searchParams.get('to') || new Date().toISOString().slice(0, 10);
  const from = searchParams.get('from') || fyStart(new Date());

  try {
    const { data, error } = await db
      .from('bank_transactions')
      .select('txn_date, direction, amount_aud, gst_aud, business_line, category')
      .gte('txn_date', from)
      .lte('txn_date', to)
      .limit(5000);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const byAccount = {};   // code -> { label, section, amount }
    const byLine = {};      // line -> { revenue, cogs, overhead }
    const totals = { revenue: 0, cogs: 0, overhead: 0 };

    for (const t of data || []) {
      const section = sectionOf(t.category);
      if (section === 'other') continue;
      const net = r2((Number(t.amount_aud) || 0) - (Number(t.gst_aud) || 0)); // ex-GST
      // revenue counts money IN as positive; cost sections count money OUT as positive.
      const signed = section === 'revenue'
        ? (t.direction === 'in' ? net : -net)
        : (t.direction === 'out' ? net : -net);

      const code = t.category || 'uncategorised';
      const label = ACCOUNT_BY_CODE[code]?.label || code;
      byAccount[code] = byAccount[code] || { label, section, amount: 0 };
      byAccount[code].amount = r2(byAccount[code].amount + signed);

      const line = t.business_line || 'overhead';
      byLine[line] = byLine[line] || { revenue: 0, cogs: 0, overhead: 0 };
      byLine[line][section] = r2(byLine[line][section] + signed);

      totals[section] = r2(totals[section] + signed);
    }

    const grossProfit = r2(totals.revenue - totals.cogs);
    const netProfit = r2(grossProfit - totals.overhead);

    // per-line gross profit (overhead usually company-wide)
    const lines = Object.entries(byLine).map(([line, v]) => ({
      line,
      revenue: r2(v.revenue),
      cogs: r2(v.cogs),
      gross: r2(v.revenue - v.cogs),
      overhead: r2(v.overhead),
      net: r2(v.revenue - v.cogs - v.overhead),
    }));

    return NextResponse.json({
      period: { from, to },
      totals: { revenue: r2(totals.revenue), cogs: r2(totals.cogs), grossProfit, overhead: r2(totals.overhead), netProfit },
      byAccount,
      lines,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// lib/docNumbers.js
// Single source of truth for customer order (OC) and supplier/factory PO numbers.
//
// Numbering scheme (unified, financial-year based):
//   OC{FY}{NNNN}  — customer order / invoice base   e.g. OC273003
//   PO{FY}{NNNN}  — supplier / factory purchase order e.g. PO273002
// {FY} = Australian financial year (Jul–Jun), labelled by the year it ENDS
//        (e.g. Jul 2026–Jun 2027 → "27"). The running number comes from an
//        atomic counter (public.doc_counters via next_doc_number), so numbers
//        never collide across the website + manual + sourcing insert streams.
//
// SAFE FALLBACK: if the counter table/function isn't present yet (before the
// doc_counters migration is run), we fall back to a row-count number so order
// creation can never break.

async function safeCount(db, table) {
  try {
    const { count, error } = await db.from(table).select('*', { count: 'exact', head: true });
    if (error) return 0;
    return count || 0;
  } catch (_) {
    return 0;
  }
}

// Australian financial year: Jul–Jun. Label = ending year's last two digits.
function fy() {
  const d = new Date();
  const endYear = d.getMonth() >= 6 ? d.getFullYear() + 1 : d.getFullYear(); // getMonth() 6 = July
  return String(endYear).slice(2);
}

// Atomic next number for a key ('OC' | 'PO'); returns null if counter not available.
async function nextCounter(db, key) {
  try {
    const { data, error } = await db.rpc('next_doc_number', { p_key: key });
    if (!error && data != null) return Number(data);
  } catch (_) { /* fall through to fallback */ }
  return null;
}

// OC{FY}{NNNN} — customer-facing order number.
export async function nextOrderNumber(db) {
  let n = await nextCounter(db, 'OC');
  if (n == null) {
    n = (await safeCount(db, 'orders')) + (await safeCount(db, 'sourcing_orders')) + 1;
  }
  return `OC${fy()}${String(n).padStart(4, '0')}`;
}

// PO{FY}{NNNN} — supplier / factory purchase order.
export async function nextPoNumber(db) {
  let n = await nextCounter(db, 'PO');
  if (n == null) {
    n = (await safeCount(db, 'purchase_orders')) + (await safeCount(db, 'sourcing_orders')) + 1;
  }
  return `PO${fy()}${String(n).padStart(4, '0')}`;
}

// lib/docNumbers.js
// Single source of truth for customer order (OC) and supplier/factory PO numbers.
// Local-stock orders and sourcing orders live in different tables but share ONE
// OC namespace and ONE PO namespace (the order number is the universal key used
// across orders, POs, forwarder invoices and Finance). We therefore number from
// the size of the UNION of both tables, so the two insert streams never collide.
//
// safeCount tolerates a table that does not exist yet (e.g. before the
// sourcing_orders migration is run in production) by returning 0, so adding this
// helper can never break existing local-stock order/PO creation.

async function safeCount(db, table) {
  try {
    const { count, error } = await db.from(table).select('*', { count: 'exact', head: true });
    if (error) return 0;
    return count || 0;
  } catch (_) {
    return 0;
  }
}

function yy() {
  return String(new Date().getFullYear()).slice(2);
}

// OC{YY}{NNNN} — customer-facing order number (orders ∪ sourcing_orders).
export async function nextOrderNumber(db) {
  const a = await safeCount(db, 'orders');
  const b = await safeCount(db, 'sourcing_orders');
  return `OC${yy()}${String(a + b + 1).padStart(4, '0')}`;
}

// PO{YY}{NNNN} — supplier / factory purchase order (purchase_orders ∪ sourcing_orders).
export async function nextPoNumber(db) {
  const a = await safeCount(db, 'purchase_orders');
  const b = await safeCount(db, 'sourcing_orders');
  return `PO${yy()}${String(a + b + 1).padStart(4, '0')}`;
}

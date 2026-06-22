import { getAdminUser, unauthorized } from '@/lib/adminAuth';
import { sourcingDb } from '@/lib/sourcingDb';

const FLOW_STATUS = [
  'quote',
  'confirmed',
  'proof_sent',
  'approved',
  'in_production',
  'dispatched',
  'completed',
  'cancelled',
];

const LEGACY_STATUS_MAP = {
  pending: 'confirmed',
  artwork_sent: 'proof_sent',
  artwork_approved: 'approved',
  delivered: 'completed',
};

function normalizeStatus(status) {
  return LEGACY_STATUS_MAP[status] || status || 'quote';
}

function money(value) {
  const n = Number(value || 0);
  return Number.isFinite(n) ? n : 0;
}

function groupByOrder(rows) {
  return (rows || []).reduce((acc, row) => {
    const key = row.order_id;
    if (!acc[key]) acc[key] = [];
    acc[key].push(row);
    return acc;
  }, {});
}

function legacyItems(order) {
  if (!Array.isArray(order.items)) return [];
  return order.items.map((item, index) => ({
    id: `legacy-${order.id}-${index}`,
    order_id: order.id,
    stock_code: item.sku || item.productSku || '',
    product_description: item.productName || item.name || 'Product',
    colour: item.colour || '',
    quantity: Number(item.qty || item.quantity || 1),
    unit_price: money(item.unitPrice || item.unit_price),
    decoration_method: item.brandingMethod || item.decoration_method || '',
    setup_cost: money(item.setupCost || item.setup_cost),
    line_total: money(item.subtotal || item.line_total),
    notes: Array.isArray(item.addons) ? item.addons.map((a) => a.name).join(', ') : '',
    source: 'legacy_json',
  }));
}

function normalizeOrder(order, related) {
  const items = related.itemsByOrder[order.id] || legacyItems(order);
  const proofs = related.proofsByOrder[order.id] || [];
  const approvals = related.approvalsByOrder[order.id] || [];
  const statusLog = related.statusLogByOrder[order.id] || [];
  const grossTotal =
    order.total_gross ?? order.total ?? order.gross_total ?? order.subtotal ?? 0;

  const aw = related.artworkByNumber?.[order.order_number || order.invoice_number];

  return {
    ...order,
    order_number: order.order_number || order.invoice_number || '',
    display_status: normalizeStatus(order.status),
    artwork_status: aw?.status || null,
    artwork_mockup_url: aw?.mockup_url || null,
    total_gross: money(grossTotal),
    total_net: money(order.total_net ?? order.subtotal),
    gst_total: money(order.gst_total ?? order.gst),
    items,
    artwork_proofs: proofs,
    approvals,
    status_log: statusLog,
  };
}

function missingSchema(error) {
  const text = `${error?.code || ''} ${error?.message || ''}`.toLowerCase();
  return text.includes('does not exist') || text.includes('could not find') || text.includes('42p01');
}

async function safeRelated(db, table, ids, select, orderColumn = 'created_at') {
  if (!ids.length) return { rows: [], missing: false };

  let query = db.from(table).select(select).in('order_id', ids);
  if (orderColumn) {
    query = query.order(orderColumn, { ascending: table === 'artwork_proofs' });
  }

  const { data, error } = await query;
  if (error) {
    if (missingSchema(error)) {
      return { rows: [], missing: true, message: error.message };
    }
    throw error;
  }
  return { rows: data || [], missing: false };
}

async function audit(db, actorEmail, action, entityType, entityId, beforeData, afterData) {
  const { error } = await db.from('admin_audit_log').insert({
    actor_email: actorEmail,
    action,
    entity_type: entityType,
    entity_id: entityId,
    before_data: beforeData || null,
    after_data: afterData || null,
  });
  return !error;
}

async function safeOrderUpdate(db, id, updates) {
  const { data, error } = await db
    .from('orders')
    .update(updates)
    .eq('id', id)
    .select('*')
    .single();

  if (!error) return { data, error: null };
  if (!missingSchema(error)) return { data: null, error };

  const fallback = { ...updates };
  delete fallback.order_number;
  delete fallback.po_number;
  delete fallback.payment_terms;
  delete fallback.supplier;
  delete fallback.delivery_address_json;
  delete fallback.ship_date;
  delete fallback.total_net;
  delete fallback.gst_total;
  delete fallback.total_gross;
  delete fallback.artwork_approved_at;
  delete fallback.production_started_at;
  delete fallback.dispatched_at;

  return db
    .from('orders')
    .update(fallback)
    .eq('id', id)
    .select('*')
    .single();
}

export async function GET(request) {
  const user = await getAdminUser(request);
  if (!user) return unauthorized();

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || '';
    const search = (searchParams.get('search') || '').trim().toLowerCase();
    const limit = Math.min(Number(searchParams.get('limit') || 200), 500);
    const db = sourcingDb();

    const { data, error } = await db
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    const orders = data || [];
    const ids = orders.map((order) => order.id);
    const [itemsRes, proofsRes, approvalsRes, statusLogRes] = await Promise.all([
      safeRelated(db, 'order_items', ids, '*', 'created_at'),
      safeRelated(db, 'artwork_proofs', ids, '*', 'version'),
      safeRelated(db, 'order_approvals', ids, '*', 'signed_at'),
      safeRelated(db, 'order_status_log', ids, '*', 'created_at'),
    ]);

    const orderNumbers = orders.map((o) => o.order_number || o.invoice_number).filter(Boolean);
    const artworkByNumber = {};
    if (orderNumbers.length) {
      const { data: aw } = await db
        .from('artworks')
        .select('order_number,status,mockup_url')
        .in('order_number', orderNumbers);
      (aw || []).forEach((a) => { artworkByNumber[a.order_number] = a; });
    }

    const related = {
      itemsByOrder: groupByOrder(itemsRes.rows),
      proofsByOrder: groupByOrder(proofsRes.rows),
      approvalsByOrder: groupByOrder(approvalsRes.rows),
      statusLogByOrder: groupByOrder(statusLogRes.rows),
      artworkByNumber,
    };

    let normalized = orders.map((order) => normalizeOrder(order, related));
    if (status) {
      normalized = normalized.filter((order) => order.display_status === status);
    }
    if (search) {
      normalized = normalized.filter((order) => {
        const haystack = [
          order.order_number,
          order.invoice_number,
          order.customer_name,
          order.customer_email,
          order.customer_company,
          order.po_number,
          order.supplier,
        ].join(' ').toLowerCase();
        return haystack.includes(search);
      });
    }

    const counts = FLOW_STATUS.reduce((acc, key) => {
      acc[key] = normalized.filter((order) => order.display_status === key).length;
      return acc;
    }, {});

    return Response.json({
      orders: normalized,
      counts,
      schema_missing: {
        order_items: itemsRes.missing,
        artwork_proofs: proofsRes.missing,
        order_approvals: approvalsRes.missing,
        order_status_log: statusLogRes.missing,
      },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  const user = await getAdminUser(request);
  if (!user) return unauthorized();

  try {
    const body = await request.json();
    const { id, action } = body;
    if (!id) return Response.json({ error: 'Missing order id' }, { status: 400 });

    const db = sourcingDb();
    const { data: before } = await db.from('orders').select('*').eq('id', id).single();
    let updates = {};

    if (action === 'status') {
      if (!FLOW_STATUS.includes(body.status)) {
        return Response.json({ error: 'Invalid status' }, { status: 400 });
      }
      updates = { status: body.status };
      if (body.status === 'approved') updates.artwork_approved_at = new Date().toISOString();
      if (body.status === 'in_production') updates.production_started_at = new Date().toISOString();
      if (body.status === 'dispatched') updates.dispatched_at = new Date().toISOString();
    } else if (action === 'details') {
      const allowed = [
        'po_number',
        'payment_terms',
        'payment_status',
        'supplier',
        'ship_date',
        'tracking_number',
        'tracking_url',
        'internal_notes',
      ];
      updates = allowed.reduce((acc, key) => {
        if (Object.prototype.hasOwnProperty.call(body, key)) acc[key] = body[key] || null;
        return acc;
      }, {});
    } else {
      return Response.json({ error: 'Unsupported action' }, { status: 400 });
    }

    const { data, error } = await safeOrderUpdate(db, id, updates);
    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    await audit(db, user.email, `order_${action}`, 'order', id, before || null, data || updates);

    return Response.json({ order: normalizeOrder(data, {
      itemsByOrder: {},
      proofsByOrder: {},
      approvalsByOrder: {},
      statusLogByOrder: {},
    }) });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

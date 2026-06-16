import { getAdminUser, unauthorized } from '@/lib/adminAuth';
import { sourcingDb } from '@/lib/sourcingDb';

const QUOTE_STATUS = [
  'new',
  'reviewing',
  'supplier_quote',
  'quoted',
  'accepted',
  'rejected',
  'archived',
];

const LEGACY_STATUS_MAP = {
  pending: 'new',
  in_progress: 'reviewing',
  sent: 'quoted',
  declined: 'rejected',
  expired: 'archived',
};

function normalizeStatus(status) {
  return LEGACY_STATUS_MAP[status] || status || 'new';
}

function normalizeQuote(quote) {
  return {
    ...quote,
    display_status: normalizeStatus(quote.status),
  };
}

function missingColumn(error) {
  const text = `${error?.code || ''} ${error?.message || ''}`.toLowerCase();
  return text.includes('could not find') || text.includes('does not exist');
}

async function audit(db, actorEmail, action, entityId, beforeData, afterData) {
  const { error } = await db.from('admin_audit_log').insert({
    actor_email: actorEmail,
    action,
    entity_type: 'quote',
    entity_id: entityId,
    before_data: beforeData || null,
    after_data: afterData || null,
  });
  return !error;
}

export async function GET(request) {
  const user = await getAdminUser(request);
  if (!user) return unauthorized();

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || '';
    const search = (searchParams.get('search') || '').trim().toLowerCase();
    const db = sourcingDb();

    const { data, error } = await db
      .from('quotes')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(500);

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    let quotes = (data || []).map(normalizeQuote);
    if (status) {
      quotes = quotes.filter((quote) => quote.display_status === status);
    }
    if (search) {
      quotes = quotes.filter((quote) => {
        const haystack = [
          quote.quote_number,
          quote.customer_name,
          quote.customer_email,
          quote.customer_company,
          quote.product_name,
          quote.product_sku,
        ].join(' ').toLowerCase();
        return haystack.includes(search);
      });
    }

    const counts = QUOTE_STATUS.reduce((acc, key) => {
      acc[key] = quotes.filter((quote) => quote.display_status === key).length;
      return acc;
    }, {});

    return Response.json({ quotes, counts });
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
    if (!id) return Response.json({ error: 'Missing quote id' }, { status: 400 });

    const db = sourcingDb();
    const { data: before } = await db.from('quotes').select('*').eq('id', id).single();
    let updates = {};

    if (action === 'status') {
      if (!QUOTE_STATUS.includes(body.status)) {
        return Response.json({ error: 'Invalid quote status' }, { status: 400 });
      }
      updates = { status: body.status };
    } else if (action === 'note') {
      updates = { internal_notes: body.internal_notes || null };
    } else {
      return Response.json({ error: 'Unsupported action' }, { status: 400 });
    }

    let result = await db.from('quotes').update(updates).eq('id', id).select('*').single();
    if (result.error && missingColumn(result.error) && action === 'note') {
      await audit(db, user.email, 'quote_note_skipped_missing_column', id, before || null, before || null);
      return Response.json({ quote: normalizeQuote(before) });
    }
    if (result.error) {
      return Response.json({ error: result.error.message }, { status: 500 });
    }

    await audit(db, user.email, `quote_${action}`, id, before || null, result.data || updates);
    return Response.json({ quote: normalizeQuote(result.data) });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

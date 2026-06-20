import { sourcingDb } from '@/lib/sourcingDb';
import { resolveB2BFromRequest, resolveOrCreateLeadFromQuote } from '@/lib/b2bContext';

// Unified Local-Stock enquiry intake (the nav / generic "Get a Quote").
// Every enquiry becomes a LEAD: logged-in users attach to their company,
// guests get a lead company auto-created (email dedup, needs_review). Then the
// enquiry is stored in quote_requests linked to that company. Fails safe.
export async function POST(req) {
  try {
    const body = await req.json();
    const name = (body.name || '').trim();
    const email = (body.email || '').trim();
    const message = (body.message || '').trim();
    if (!name || !email || !message) {
      return Response.json({ error: 'Name, email and message are required' }, { status: 400 });
    }

    const b2b = await resolveB2BFromRequest(req);
    const link = b2b.company_id
      ? b2b
      : await resolveOrCreateLeadFromQuote({
          email,
          name,
          company: body.company,
          phone: body.phone,
          industry: body.industry,
        });

    const db = sourcingDb();
    const { error } = await db.from('quote_requests').insert([{
      name,
      company: (body.company || '').trim() || null,
      email,
      phone: (body.phone || '').trim() || null,
      message,
      quantity: (body.quantity || '').toString().trim() || null,
      date_needed: body.date_needed || null,
      source: body.source || 'website',
      ...(link.company_id ? { company_id: link.company_id } : {}),
      ...(link.placed_by_contact_id ? { placed_by_contact_id: link.placed_by_contact_id } : {}),
    }]);

    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { getAdminUser, isAdmin, unauthorized } from '@/lib/adminAuth';
import { sourcingDb } from '@/lib/sourcingDb';

function text(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function quantity(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : null;
}

function joinParts(parts, separator = '\n') {
  return parts.filter(Boolean).join(separator);
}

function productDescription(body) {
  const productName = text(body.productName) || text(body.product_name);
  const details = text(body.productDescription) || text(body.product_description);
  if (productName && details) {
    return `Product name: ${productName}\n\nDetails:\n${details}`;
  }
  return productName || details;
}

function colourRequirements(body) {
  const productColour = text(body.productColour) || text(body.product_colour);
  const pmsColour = text(body.pmsColour) || text(body.pms_colour);
  const existing = text(body.colourRequirements) || text(body.colour_requirements);
  return joinParts([
    productColour ? `Product colour: ${productColour}` : null,
    pmsColour ? `PMS colour: ${pmsColour}` : null,
    existing,
  ]);
}

function brandingRequirements(body) {
  const logoPrint = text(body.logoPrintRequirements) || text(body.logo_print_requirements);
  const existing = text(body.brandingRequirements) || text(body.branding_requirements);
  return joinParts([
    logoPrint ? `Logo / print requirements:\n${logoPrint}` : null,
    existing,
  ], '\n\n') || 'To be confirmed';
}

function contactPhones(body) {
  const companyPhone = text(body.companyPhone) || text(body.company_phone);
  const mobile = text(body.mobile) || text(body.mobilePhone) || text(body.mobile_phone);
  const existing = text(body.phone);
  if (!companyPhone && !mobile) return existing;
  return joinParts([
    companyPhone ? `Company phone: ${companyPhone}` : null,
    mobile ? `Mobile: ${mobile}` : null,
  ]);
}

function requestNotes(body) {
  const deliveryAddress = text(body.deliveryAddress) || text(body.delivery_address);
  const existing = text(body.notes);
  return joinParts([
    deliveryAddress ? `Delivery address:\n${deliveryAddress}` : null,
    existing,
  ], '\n\n');
}

function requestPayload(body) {
  return {
    product_description: productDescription(body),
    quantity: quantity(body.quantity),
    target_price: text(body.targetPrice) || text(body.target_price),
    in_hands_date: text(body.inHandsDate) || text(body.in_hands_date),
    freight_preference: text(body.freightPreference) || text(body.freight_preference),
    branding_requirements: brandingRequirements(body),
    colour_requirements: colourRequirements(body),
    decoration_method: text(body.decorationMethod) || text(body.decoration_method),
    for_children: text(body.forChildren) || text(body.for_children) || 'no',
    delivery_state: text(body.deliveryState) || text(body.delivery_state) || 'TBA',
    compliance_notes: text(body.complianceNotes) || text(body.compliance_notes),
    company_name: text(body.companyName) || text(body.company_name),
    contact_name: text(body.contactName) || text(body.name) || text(body.contact_name),
    email: text(body.email),
    phone: contactPhones(body),
    notes: requestNotes(body),
    internal_notes: text(body.internalNotes) || text(body.internal_notes),
    status: body.status || 'new',
  };
}

export async function GET(request) {
  if (!(await isAdmin(request))) return unauthorized();

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const status = searchParams.get('status');

    if (id) {
      const { data, error } = await sourcingDb()
        .from('sourcing_requests')
        .select('*')
        .eq('id', id)
        .single();
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ request: data });
    }

    let query = sourcingDb()
      .from('sourcing_requests')
      .select('*')
      .order('created_at', { ascending: false });
    if (status) query = query.eq('status', status);

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ requests: data || [] });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  const user = await getAdminUser(request);
  if (!user) return unauthorized();

  try {
    const body = await request.json();
    const payload = requestPayload(body);
    if (!payload.company_name) {
      return NextResponse.json({ error: 'Company name is required' }, { status: 400 });
    }
    if (!payload.contact_name) {
      return NextResponse.json({ error: 'Contact name is required' }, { status: 400 });
    }
    if (!payload.email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    if (!payload.product_description) {
      return NextResponse.json({ error: 'Product description is required' }, { status: 400 });
    }
    if (!payload.quantity) {
      return NextResponse.json({ error: 'Quantity is required' }, { status: 400 });
    }

    const noteParts = [
      payload.internal_notes,
      `Manual admin entry by ${user.email}`,
    ].filter(Boolean);

    const { data, error } = await sourcingDb()
      .from('sourcing_requests')
      .insert({
        ...payload,
        internal_notes: noteParts.join('\n\n'),
      })
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ request: data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  if (!(await isAdmin(request))) return unauthorized();

  try {
    const body = await request.json();
    if (!body.id) return NextResponse.json({ error: 'id is required' }, { status: 400 });

    const update = {};
    if (body.status) update.status = body.status;
    if (body.internal_notes !== undefined || body.internalNotes !== undefined) {
      update.internal_notes = body.internal_notes ?? body.internalNotes ?? null;
    }

    if (!Object.keys(update).length) {
      return NextResponse.json({ error: 'No supported fields to update' }, { status: 400 });
    }

    const { data, error } = await sourcingDb()
      .from('sourcing_requests')
      .update(update)
      .eq('id', body.id)
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ request: data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

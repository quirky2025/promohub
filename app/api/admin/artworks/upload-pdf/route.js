import { createClient } from '@supabase/supabase-js';

// Use service key to bypass RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const orderNumber = formData.get('orderNumber');

    if (!file) return Response.json({ error: 'No file' }, { status: 400 });

    const fileName = `${orderNumber}_${Date.now()}.pdf`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error } = await supabase.storage
      .from('mockups')
      .upload(fileName, buffer, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    const { data } = supabase.storage
      .from('mockups')
      .getPublicUrl(fileName);

    return Response.json({ url: data.publicUrl });
  } catch (err) {
    return Response.json({ error: 'Failed' }, { status: 500 });
  }
}

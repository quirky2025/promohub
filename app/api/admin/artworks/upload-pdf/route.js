import { isAdmin, unauthorized } from '@/lib/adminAuth';
import { sourcingDb } from '@/lib/sourcingDb';

export async function POST(req) {
  if (!(await isAdmin(req))) return unauthorized();

  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const orderNumber = formData.get('orderNumber');

    if (!file) return Response.json({ error: 'No file' }, { status: 400 });

    const fileName = `${orderNumber}_${Date.now()}.pdf`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const supabase = sourcingDb();

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

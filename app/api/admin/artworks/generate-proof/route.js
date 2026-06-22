import { createClient } from '@supabase/supabase-js';
import { generateArtworkProof } from '@/lib/proofGen';

// service key → bypass RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(req) {
  try {
    const body = await req.json();
    const { token, stockCode, productColour, printColour, pms, quantity } = body;

    const { data: art } = await supabase.from('artworks').select('*').eq('token', token).single();
    if (!art) return Response.json({ error: 'Artwork not found' }, { status: 404 });
    if (!art.logo_url) return Response.json({ error: 'No customer logo on file yet' }, { status: 400 });

    const code = (stockCode || art.stock_code || '').trim();
    if (!code) return Response.json({ error: 'no_stock_code' }, { status: 200 });

    const { data: tpl } = await supabase.from('product_templates').select('*').eq('stock_code', code).single();
    if (!tpl) return Response.json({ error: 'no_template', stockCode: code }, { status: 200 });

    // Resolve assets against the CURRENT deployment origin (preview or prod),
    // so it works before the branch is merged to production.
    const host = req.headers.get('host');
    const proto = req.headers.get('x-forwarded-proto') || 'https';
    const site = host ? `${proto}://${host}` : (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.quirkypromo.com.au');
    const templateUrl = /^https?:\/\//.test(tpl.template_url) ? tpl.template_url : site + tpl.template_url;

    const pdfBytes = await generateArtworkProof({
      brandLogoUrl: site + '/quirky-logo-light.png',
      templateUrl,
      customerLogoUrl: art.logo_url,
      box: { x: tpl.box_x, y: tpl.box_y, w: tpl.box_w, h: tpl.box_h },
      orderNumber: art.order_number,
      date: new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }),
      quoteRef: art.quote_ref || '',
      version: 'V1',
      productName: tpl.product_name || art.product_name || '',
      stockCode: tpl.stock_code,
      qty: quantity || art.quantity || 100,
      productColour: productColour || tpl.base_colour || '',
      printColour: printColour || '',
      pms: pms || '',
      printMethod: tpl.print_method ? `${tpl.print_method}:  ${tpl.print_size || ''}`.trim() : '',
      position: 'Front, centred',
      docRef: `AP-${art.order_number}-V1`,
    });

    // Upload the proof PDF to Cloudinary (image/upload) so the thumbnail and the
    // customer approval page can preview it (via the pg_1 -> jpg transform).
    const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    let url;
    if (cloud && preset) {
      const form = new FormData();
      form.append('file', new Blob([pdfBytes], { type: 'application/pdf' }), `${art.order_number}_proof.pdf`);
      form.append('upload_preset', preset);
      const up = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, { method: 'POST', body: form });
      const upData = await up.json();
      if (!up.ok || !upData.secure_url) throw new Error('Cloudinary upload failed: ' + (upData.error?.message || up.status));
      url = upData.secure_url;
    } else {
      // fallback: Supabase Storage
      const fileName = `${art.order_number}_proof_${Date.now()}.pdf`;
      const { error: upErr } = await supabase.storage
        .from('mockups')
        .upload(fileName, Buffer.from(pdfBytes), { contentType: 'application/pdf', upsert: true });
      if (upErr) throw upErr;
      url = supabase.storage.from('mockups').getPublicUrl(fileName).data.publicUrl;
    }

    await supabase.from('artworks').update({ mockup_url: url }).eq('token', token);

    return Response.json({ success: true, url });
  } catch (error) {
    return Response.json({ error: error.message || 'Failed to generate proof' }, { status: 500 });
  }
}

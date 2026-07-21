import { sourcingDb } from '@/lib/sourcingDb';
import ReviewForm from './ReviewForm';

// D13 · 公开评价提交页 /review/<token>(邀评邮件落地页)
// token 行由 review-invite 创建;这里查产品信息交给客户端表单。noindex。

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  return { title: 'Rate your order | QuirkyPromo', robots: { index: false, follow: false } };
}

export default async function ReviewPage({ params }) {
  const { token } = await params;
  const db = sourcingDb();

  const { data: invite } = await db
    .from('product_reviews')
    .select('id, token, status, rating, customer_name, product_id')
    .eq('token', token)
    .maybeSingle();

  let product = null;
  if (invite?.product_id) {
    const { data: p } = await db
      .from('products')
      .select('name, display_title, slug')
      .eq('id', invite.product_id)
      .maybeSingle();
    product = p || null;
  }

  const googleUrl = process.env.GOOGLE_REVIEW_URL || null;

  if (!invite) {
    return (
      <div style={{ fontFamily: '"DM Sans", sans-serif', maxWidth: 560, margin: '60px auto', padding: '0 20px', color: '#1a1a1a' }}>
        <h1 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontSize: 30 }}>Link not found</h1>
        <p style={{ fontSize: 15, lineHeight: 1.7 }}>
          This review link isn't valid — it may have been mistyped. If you'd like to leave feedback,
          just reply to our email or contact <a href="mailto:hello@quirkypromo.com.au" style={{ color: '#C9A96E' }}>hello@quirkypromo.com.au</a>.
        </p>
      </div>
    );
  }

  return (
    <ReviewForm
      token={String(invite.token)}
      alreadySubmitted={invite.status !== 'invited'}
      productName={product ? (product.display_title || product.name) : 'your order'}
      productSlug={product?.slug || null}
      customerName={invite.customer_name || ''}
      googleUrl={googleUrl}
    />
  );
}

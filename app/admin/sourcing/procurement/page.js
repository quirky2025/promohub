// Retired — the "欠爸爸/采购总账" was removed (too complex). China cost now lives
// in each order's Internal Notes (¥ paid · FX · =A$). Redirect anyone who had this
// bookmarked back to the Sourcing orders page.
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RetiredProcurementPage() {
  const router = useRouter();
  useEffect(() => { router.replace('/admin/sourcing/orders'); }, [router]);
  return <div style={{ padding: 24, color: '#000', fontFamily: '"DM Sans", sans-serif' }}>已移除,正在跳转…</div>;
}

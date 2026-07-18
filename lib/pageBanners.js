import { supabase } from '@/lib/supabase';

// Admin-managed hero banner (admin → Catalog → Banners), stored in page_banners.
// Single source: page_key for category pages = url_pages.slug (the customer-facing URL).
// Returns null when no active banner is set → pages keep their default navy hero.
export async function getPageBanner(pageType, pageKey) {
  if (!pageType || !pageKey) return null;
  try {
    const { data, error } = await supabase
      .from('page_banners')
      .select('*')
      .eq('page_type', pageType)
      .eq('page_key', pageKey)
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .limit(1);
    if (error) return null; // table may not exist yet — keep default hero
    return (data && data[0]) || null;
  } catch {
    return null;
  }
}

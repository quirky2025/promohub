// Pseudocode only. Do not paste directly without adapting to the app query layer.

export function applyProductFilter(query, productFilter) {
  const type = productFilter?.type;
  query = query.eq('is_published', true);

  if (type === 'category') {
    return query.eq('category', productFilter.category);
  }

  if (type === 'subcategory') {
    return query
      .eq('category', productFilter.category)
      .eq('subcategory', productFilter.subcategory);
  }

  if (type === 'compound') {
    query = query.eq('category', productFilter.category);

    if (productFilter.material) {
      return query.contains('material_tags', [productFilter.material.toLowerCase()]);
    }
    if (Array.isArray(productFilter.tags) && productFilter.tags.length) {
      return query.overlaps('tags', productFilter.tags.map((tag) => tag.toLowerCase()));
    }
    if (productFilter.is_eco === true) {
      return query.eq('is_eco', true);
    }
  }

  if (type === 'kit_collection') {
    query = query.in('offer_type', productFilter.offer_types || []);
    if (productFilter.include_all_kit_candidates) return query;
    return query.overlaps('kit_themes', productFilter.kit_themes || []);
  }

  if (type === 'kit_template') {
    // Template pages should render curated component/category rails and quote CTA.
    // A direct product query is optional, not the main content.
    return query
      .in('offer_type', productFilter.offer_types || [])
      .overlaps('kit_themes', productFilter.kit_themes || []);
  }

  throw new Error(`Unsupported product_filter.type: ${type}`);
}

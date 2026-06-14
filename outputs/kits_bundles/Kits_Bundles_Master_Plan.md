# QuirkyPromo Kits & Bundles Master Plan

> Generated from supplier kit candidates. This is a collection/offer layer, not a product category.

## Locked Direction

- Main navigation label: **Kits & Bundles**
- `Kits & Bundles` is not `Sourcing / Supply Chain`.
- A kit is assembled from existing product categories such as Bags, Drinkware, Pens, Office & Desk, Packaging, Apparel, Technology, Home & Living and Personal Care.
- Supplier prebuilt kits/gift sets/hampers become collection candidates.
- QuirkyPromo can also create custom kit templates, such as `New Home Gift Kits`, even when no supplier prebuilt kit exists.

## Master Table

| collection_name | slug | page_kind | primary_kit_theme | source_candidate_count | show_in_nav | show_in_footer | seo_priority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Custom Merch Kits | custom-merch-kits-australia | hub | all | 104 | true | true | 100 |
| Employee Onboarding Kits | employee-onboarding-kits-australia | kit_collection | employee_onboarding | 5 | true | true | 95 |
| Conference & Event Kits | conference-event-kits-australia | kit_collection | conference_event | 3 | true | true | 90 |
| Corporate Gift Sets | corporate-gift-sets-australia | kit_collection | corporate_gift_sets | 38 | true | true | 96 |
| Wellness Gift Packs | wellness-gift-packs-australia | kit_collection | wellness_care | 6 | true | true | 82 |
| Eco Merch Kits | eco-merch-kits-australia | kit_collection | eco_sustainable | 3 | true | true | 80 |
| Tech Gift Sets | tech-gift-sets-australia | kit_collection | tech_gift_set | 22 | true | false | 86 |
| Outdoor Event Kits | outdoor-event-kits-australia | kit_collection | beach_outdoor | 13 | true | false | 78 |
| New Home Gift Kits | new-home-gift-kits-australia | custom_kit_template | new_home | 0 | true | false | 84 |
| Premium Corporate Gift Sets | premium-corporate-gift-sets-australia | kit_collection | premium_corporate_gift | 1 | false | true | 76 |
| Office & School Kits | office-and-school-kits-australia | support_collection | office_school | 13 | false | false | 62 |

## Candidate Counts By Primary Page

| slug | candidate_count |
| --- | --- |
| corporate-gift-sets-australia | 38 |
| tech-gift-sets-australia | 22 |
| outdoor-event-kits-australia | 13 |
| office-and-school-kits-australia | 13 |
| wellness-gift-packs-australia | 6 |
| employee-onboarding-kits-australia | 5 |
| eco-merch-kits-australia | 3 |
| conference-event-kits-australia | 3 |
| premium-corporate-gift-sets-australia | 1 |

## Kit Theme Counts

| kit_theme | candidate_count |
| --- | --- |
| tech_gift_set | 22 |
| food_drink_gifting | 20 |
| general_corporate_gifting | 18 |
| beach_outdoor | 13 |
| office_school | 13 |
| wellness_care | 6 |
| employee_onboarding | 5 |
| eco_sustainable | 3 |
| conference_event | 3 |
| premium_corporate_gift | 1 |

## Offer Type Counts

| offer_type | candidate_count |
| --- | --- |
| gift_set | 59 |
| prebuilt_kit | 35 |
| hamper | 9 |
| prebuilt_bundle | 1 |

## URL Pages Seed Rules

- `page_type = collection` for supplier-driven kit collections.
- `page_type = landing` for QuirkyPromo-created kit templates such as `New Home Gift Kits`.
- `source_type = collection`
- `product_filter.type = kit_collection` for collection pages.
- `product_filter.type = kit_template` for manual kit-template pages.
- All rows start as `status = draft`.

## Recommended Initial Nav Dropdown

1. Custom Merch Kits
2. Employee Onboarding Kits
3. Conference & Event Kits
4. Corporate Gift Sets
5. Wellness Gift Packs
6. Eco Merch Kits
7. Tech Gift Sets
8. Outdoor Event Kits
9. New Home Gift Kits

`Premium Corporate Gift Sets` and `Office & School Kits` can exist as SEO/support pages first, without appearing in the main dropdown.

## Generated Files

- `kits_bundles_master_table.csv`
- `supplier_kit_collection_assignments.csv`
- `kits_bundles_url_pages_seed.json`
- `kits_bundles_url_pages_seed.csv`
- `kits_bundles_master_plan_validation.json`

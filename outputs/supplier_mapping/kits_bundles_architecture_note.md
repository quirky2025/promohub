# Kits & Bundles Architecture Note

## Decision

`Kits & Bundles` is a collection/offer layer, not a product category and not Sourcing/Supply Chain.

Products still keep one primary product category such as `Pens`, `Bags`, `Drinkware`, `Office & Desk`, `Packaging`, or `Personal Care`.
Kits are built by combining products from those categories into a sellable offer/template.

## Navigation

Recommended main navigation label:

```text
Kits & Bundles
```

Use `Merch Bundles`, `Merch Kits`, and `Corporate Gift Sets` inside SEO copy and page titles where useful.

## Data Model

Recommended fields for product/offers:

```text
offer_type:
- single_product
- prebuilt_kit
- prebuilt_bundle
- gift_set
- hamper
- custom_kit_template

kit_theme:
- employee_onboarding
- conference_event
- office_school
- wellness_care
- beach_outdoor
- food_drink_gifting
- eco_sustainable
- tech_gift_set
- premium_corporate_gift
- general_corporate_gifting
```

Single-product multi-packs such as `4 Pack Face Masks` are not kitting. They should stay in the normal product category with a `pack_size` attribute.

## Starter URLs

```text
/custom-merch-kits-australia
/employee-onboarding-kits-australia
/conference-event-kits-australia
/corporate-gift-sets-australia
/wellness-gift-packs-australia
/eco-merch-kits-australia
/premium-corporate-gift-sets-australia
/new-home-gift-kits-australia
```

`New Home Gift Kits` is a QuirkyPromo-created template/landing page. Supplier gift set candidates can feed it only when components match home/settlement gifting.

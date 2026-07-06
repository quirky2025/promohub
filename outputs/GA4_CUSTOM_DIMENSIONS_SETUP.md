# GA4 — Custom Dimensions & Setup Checklist

Companion to `GA4_TRACKING_SPEC.md`. Records the GA4 back-office setup once the 6
events are firing (see "Implemented events" below for what the code emits).

Measurement ID: **`G-06J4WRFMLY`** · Timezone Sydney · Currency AUD (amounts ex-GST).

---

## 1. Custom dimensions to register

**GA4 → Admin → Custom definitions → Custom dimensions → Create custom dimension.**
For each: **Scope = Event**, then enter the exact **Event parameter** name.

### Required

| Dimension name | Scope | Event parameter | Appears on |
|---|---|---|---|
| Product Slug | Event | `product_slug` | product_view / quote_click / enquiry_submit / add_to_cart |
| Supplier | Event | `supplier` | product_view |
| Decoration Model | Event | `decoration_model` | product_view |
| Source Location | Event | `source_location` | quote_click (nav / pdp / category / landing / cart / footer) |
| Payment Type | Event | `payment_type` | purchase (`eft` = Pay Later / `stripe` = paid) |

### Optional (register only if you want them split in standard reports)

| Dimension name | Scope | Event parameter | Appears on |
|---|---|---|---|
| Enquiry Type | Event | `enquiry_type` | enquiry_submit (general_quote / product_enquiry / nav …) |
| Category | Event | `category` | product_view |

> Standard GA4 params — **do NOT register** these (they feed the built-in
> e-commerce reports automatically): `value`, `currency`, `transaction_id`, `items`.

---

## 2. Mark Key events (conversions)

**GA4 → Admin → Events** → toggle **Mark as key event**:

- `enquiry_submit`
- `purchase`

---

## 3. Implemented events (what the code emits)

| Event | Trigger | Params |
|---|---|---|
| `page_view` | GA4 automatic | — |
| `product_view` | PDP load (ProductClient + ASColourClient) | `product_slug`, `supplier`, `decoration_model`, `category` |
| `quote_click` | Any Get a Quote / Request a Quote (nav desktop+mobile, PDP, AS PDP, QuoteButton on category/landing) | `source_location`, `product_slug` (when on a product) |
| `enquiry_submit` | Quote/enquiry form success (QuoteModal, PDP enquiry, AS quote modal) | `product_slug` (if any), `enquiry_type` |
| `add_to_cart` | Add to Cart (ProductClient + ASColourClient) | `product_slug`, `value`, `currency` |
| `purchase` | Order placed (EFT Pay Later + Stripe paid) | `transaction_id`, `value`, `currency`, `items[]` (item_id/slug/price/quantity), `payment_type` |

**Revenue tip:** filter `payment_type = stripe` to see paid-only revenue; `eft` = orders placed but not yet paid (paid after artwork approval).

---

## 4. Notes

- Custom dimensions affect **standard reports only**. **Realtime / DebugView show
  every param already** — you can verify events without registering.
- Registration is **not retroactive** (no backfill), but events keep collecting, so
  register early.
- Event-scoped custom dimension limit is 50 — plenty of headroom.

## 5. Also on the spec's config list (later)

- Register custom dimensions above ✅ (this doc).
- Referral source grouping — add AI referrers for GEO monitoring: `chatgpt.com`,
  `perplexity.ai`, `copilot.microsoft.com`, `gemini.google.com`.
- Internal traffic filter (Data streams → Define internal traffic: team IP; Data
  filters → activate) once events are validated, to keep test data out.
- Cancel the leftover test `purchase` order(s) from testing.

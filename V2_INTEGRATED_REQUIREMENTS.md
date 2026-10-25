# Jain Sarafa Thella — V2 Integrated

**Version:** V2 Integrated  
**Date:** 25 October 2026  
**Project:** Premium retail + wholesale bag manufacturing e-commerce website  
**Business location:** Agra, Uttar Pradesh, India  
**Launch approach:** Staging/testing first; production only after approval  
**Budget approach:** Zero-cost development wherever practical; paid services only when necessary  
**Current status:** Planning and requirements consolidation only (no implementation yet)

---

## Project objective

Build a premium, mobile-first e-commerce platform that supports:

- Retail purchases.
- Wholesale purchases with quantity-based pricing.
- Custom manufacturing requests.
- Shared physical + online inventory.
- Hindi-first UX with English and additional Indian languages.
- Secure administration of catalogue, stock, orders, payments, customers, staff, marketing, and analytics.

---

## Consolidated functional scope

### 1) Storefront and catalogue
- Premium responsive homepage.
- Category, PDP, and search pages.
- Hindi-first content and validation messages.
- Language selector and translation-ready flows.
- Product model with SKU, variants, stock, pricing tiers, MOQ, dimensions, tax config, status, and product type (ready stock / made-to-order / custom).
- Discovery: search by name/SKU/keywords, filtering, sorting, related/recent products.
- CSV import/export with validation, error reporting, and SKU uniqueness checks.
- Stock adjustment history and audit logs.

### 2) Retail checkout and payments
- Full checkout: cart → auth → address → validation → payment selection → order creation.
- Payment methods: UPI, cards, net banking, wallets, COD (retail only), and advance payments where needed.
- Server-side verification for payments and webhooks.
- Duplicate-event protection.
- Separate order/payment/fulfilment/refund statuses.
- Never mark paid using only browser redirect state.

### 3) Wholesale portal
- Wholesale registration + approval.
- Business details and wholesale-specific pricing visibility.
- MOQ and tiered pricing enforcement.
- Bulk checkout with server-side validation.
- Wholesale order history + quick reorder with revalidation.
- Quotation workflow states:
  `New → Under Review → Quoted → Negotiation → Accepted / Rejected / Expired`.
- Accepted quotation conversion to order.

### 4) Custom manufacturing enquiry CRM
- Enquiry form with quantity, material, dimensions, branding, files, timeline, and delivery info.
- Admin assignment, notes, follow-ups, quotation revisions, sample tracking.
- Conversion to advance-payment/production order.
- Secure upload validation/storage.

### 5) Inventory, production, and fulfilment
- Ready stock reservation/deduction policy with oversell prevention.
- Made-to-order lead times and production tracking.
- Custom production linked to approved quotation/specifications.
- Payment, production, and inventory states kept separate.
- Courier integration (e.g., Shiprocket): rates, labels, tracking, dispatch updates, NDR/RTO handling where supported.
- Controlled manual fallback when courier API is unavailable.

### 6) Admin and operations
- Core admin modules: products, inventory, orders/quotations, customers, promotions, staff roles, reconciliation, shipping, content/translations, policies/config.
- RBAC enforced server-side.
- Sensitive action logging (refunds, role changes, stock corrections, pricing overrides).

### 7) Communication and retention
- WhatsApp Business Platform API with opt-in/opt-out and template compliance.
- Transactional notifications separated from marketing consent.
- Coupons/offers, order history, quick reorder; loyalty and advanced campaigns in later phase.

### 8) GST, invoices, and policy
- GST-aware invoices and credit notes.
- HSN/tax-rate config where applicable.
- Exportable reconciliation records.
- Policy pages for shipping/returns/privacy/terms/wholesale/custom orders.
- Accountant validation before production.

### 9) Security, reliability, and compliance
- Secure auth and authorization.
- Input validation and rate limiting.
- Verified signed webhooks.
- Idempotency/duplicate protection.
- Audit logs, backups + restore testing, operational monitoring.
- Secret management through environment variables.
- Secure file uploads and staged deployment separation.

### 10) SEO, performance, and accessibility
- Crawlable product/category routes, metadata, canonical/sitemap/robots, structured product data.
- Performance goals for testing phase: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1.
- Accessibility baseline: keyboard navigation, labels, contrast, accessible controls.

---

## Recommended architecture (initial)

- **Frontend:** Next.js + TypeScript
- **Backend:** Next.js server-side modules (or separate API only if justified)
- **Database/Auth:** Supabase/PostgreSQL (candidate)
- **Storage:** Object storage for media/uploads
- **Payments:** Razorpay or equivalent (subject to onboarding/commercial checks)
- **Shipping:** Shiprocket or equivalent
- **Messaging:** Official WhatsApp Business Platform API
- **Environments:** strict staging/production separation

Use a modular monolith initially with domain modules: catalogue, inventory, retail orders, wholesale, quotations, production, payments, shipping, customers, notifications, reporting.

---

## Roadmap (phased)

- **Phase 0:** Requirements/business rules finalization.
- **Phase 1:** Technical foundation (schema, auth, RBAC, logs, backup, CI, env separation).
- **Phase 2:** Storefront and catalogue.
- **Phase 3:** Retail + wholesale + manufacturing workflows.
- **Phase 4:** Payments + GST + shipping reconciliation.
- **Phase 5:** Admin operations + retention workflows.
- **Phase 6:** Staging acceptance and launch approval.

---

## Priorities

- **P0:** Hindi-first storefront, catalogue/variants/inventory, customer accounts, secure checkout/payments, retail-only COD controls, wholesale/MOQ/quotations, admin + RBAC, GST-aware records, shipping/tracking, backups/audit logs, staging acceptance.
- **P1:** Custom enquiry CRM, quick reorder, CSV operations + stock audit, advanced discovery, returns/refunds, WhatsApp transactional flows, analytics, structured data.
- **P2:** Loyalty and advanced campaigns, abandoned cart automation, more languages, advanced reporting, ERP/accounting integrations.

---

## Production readiness criteria

Before launch, validate:
1. Retail orders and tracking work end-to-end.
2. COD is blocked for wholesale orders.
3. Wholesale pricing + MOQ are server-side enforced.
4. Overselling is prevented under concurrency.
5. Custom enquiries convert correctly to orders.
6. Payment verification is independent of browser redirect.
7. Refund/invoice/shipping reconciliation is available.
8. RBAC prevents unauthorized sensitive actions.
9. Hindi + English customer journeys are complete.
10. Consent preferences are respected.
11. Backups can be restored.
12. Owner signs off on staging test outcomes and policies.

---

## Decisions to finalize before implementation

- Final category/variant template.
- Retail/wholesale pricing logic.
- MOQ, quantity breaks, quotation expiry.
- Custom-product advance/cancellation rules.
- Inventory reservation and production lead-time policy.
- Final payment/courier providers.
- Hosting/domain and recurring cost thresholds.
- Accountant-approved invoice + GST setup.
- Return and refund timelines.
- Initial additional language rollout.

---

## Repository rule

This V2 Integrated plan is the single planning source of truth for this repository until implementation is explicitly authorized.

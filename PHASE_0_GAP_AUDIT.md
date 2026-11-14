# Jain Sarafa Thella (JST) — Phase 0: System Audit & Implementation Gap Report

**Document Version:** 1.0.0  
**Date:** 15 November 2026  
**Project:** Jain Sarafa Thella Platform Enhancement  
**Reference Benchmark:** MLJ Bags (Murari Lal Jain & Co., Agra — https://www.mljbags.com/)  
**Primary Directive:** Preserve existing functionality; extend modules iteratively; raise separate PRs per milestone.

---

## 1. Executive Summary

Jain Sarafa Thella (JST) is expanding its digital operations from an initial bilingual storefront prototype into a comprehensive, centralized business management and digital presence platform. This audit reviews the current repository state, benchmarks presentation and capability against industry peer **MLJ Bags**, and establishes the granular blueprint for subsequent implementation phases.

---

## 2. Technical Audit of Existing System

| Component | Current Implementation | Status & Audit Verdict |
|---|---|---|
| **Frontend Framework** | Next.js 14.2.35 (App Router, Server & Client components) | **Retain:** Excellent performance, React 18, optimal for SEO and dynamic routing. |
| **Styling & Design System** | Tailwind CSS 3.4 with custom Sarafa palette (Gold `#C5A059`, Maroon `#7A1CAC`, Stone, Amber) | **Retain:** Fully aligned with Indian luxury jewellery and bag aesthetic. |
| **Bilingual Localization** | Custom client-side dictionary (`/src/locales/hi.json`, `en.json`, `/src/lib/i18n.ts`) | **Retain & Extend:** Default `hi-IN` with `en-IN` toggle; extend dictionaries for manufacturing, about us, and product technical specifications. |
| **State Management** | React Context (`CartContext.tsx`) with localStorage persistence, wholesale tier calculation, and MOQ checks | **Retain:** Working cleanly; retain for retail and wholesale checkout. |
| **Backend API Layer** | Next.js App Router route handlers (`/api/cart/validate`, `/api/checkout/reserve`, `/api/orders`, `/api/wholesale/register`, `/api/custom-enquiries`) | **Retain & Extend:** Working cleanly with mock/local state; extend to persist against database and add admin endpoints. |
| **Database Architecture** | PostgreSQL schema (`supabase/migrations/20261025000000_init_schema.sql`) covering 15 core tables (users, products, variants, reservations, orders, payments, refunds, shipments) | **Retain & Extend:** Solid relational foundation; needs supplementary migration for central business profile, media assets registry, Google Drive mapping, and sync jobs. |
| **Build & Scripts** | `npm run dev`, `npm run build`, `npm run lint`, and one-click Windows launcher `run.bat` | **Retain:** Verified production build passing with 0 errors. |

---

## 3. Business Functionality Audit: Retain vs. Modify vs. Add

### 3.1 Functionality to Retain (Preserved Unbroken)
1. **Shopping Bag & Potli Storefront (`src/app/page.tsx`):** Hero section, category pills, persona switcher (retail/wholesale/custom), and product grid.
2. **Atomic Inventory Soft-Reservation (`src/app/api/checkout/reserve` & `stock_reservations`):** 10-15 minute reservation locking to prevent overselling counter vs. online stock.
3. **Wholesale Verification & Tiered Pricing:** Dynamic price per unit calculation based on minimum order quantity break points.
4. **Custom Manufacturing Quote Modal (`CustomQuoteModal.tsx`):** Form capturing fabric, dimensions, quantity, artwork upload, and screen/foil printing requests.
5. **Bespoke Styling & Brand Tokens:** Royal Maroon and Agra Sarafa Gold design aesthetics.

### 3.2 Functionality Requiring Modification (Extended Compatibility)
1. **Product Structure & Specifications:**
   - *Current:* Fixed dimensions (height, width, gusset) and limited attributes in `Product` type.
   - *Required:* Flexible product-specific dimensions (supporting cm, inches, mm, GSM, denier, weight capacity), problem-solving descriptions (what it does, where it is used, who uses it), and split parent vs. variant media.
2. **ProductCard Media Display (`ProductCard.tsx`):**
   - *Current:* Placeholder SVG bag visual.
   - *Required:* Render high-resolution product image when available (supporting Google Drive direct CDN links and local storage), with graceful fallback to styled placeholder.
3. **Navigation Architecture (`Navbar.tsx`):**
   - *Current:* Single-page section anchors (`#products`, `#wholesale`, `#custom`).
   - *Required:* Multi-page enterprise routing (`/`, `/about`, `/manufacturing`, `/products`, `/custom-manufacturing`, `/wholesale`, `/contact`, `/admin`).

### 3.3 Missing Functionality Requiring Development (Phased Roadmap)
1. **Phase 1 — Business Identity & Manufacturing Explanation:** Comprehensive company narrative, Agra Sarafa heritage, manufacturing machinery, fabric specifications, and customer segment profiles.
2. **Phase 2 & 9 — Enhanced Product Catalog & Database Migration:** Migration for `businesses`, `business_locations`, `business_hours`, `media_assets`, `drive_files`, `publishing_targets`, and `sync_jobs`.
3. **Phase 3 & 4 — Custom Manufacturing CRM & Wholesale Quotations:** Structured quote lifecycle (`submitted -> under_review -> spec_confirmed -> quotation_sent -> in_production -> completed`).
4. **Phase 5 — Dedicated Multi-Page Web Application:** Dedicated `/about`, `/manufacturing`, `/products/[slug]`, and `/contact` pages.
5. **Phase 6 — Central Admin Control Panel:** Complete `/admin` dashboard for single-pane-of-glass management.
6. **Phase 7 & 8 — Google Drive Sync & Google Business Profile Adapters:** Server-to-server media synchronization and Business Profile publishing.

---

## 4. Benchmark Comparison: MLJ Bags vs. Jain Sarafa Thella (JST)

| Dimension | MLJ Bags (Murari Lal Jain & Co. — Established 1965) | Jain Sarafa Thella (JST — Target Architecture) |
|---|---|---|
| **Core Heritage & Market** | Johri / Sarafa Bazaar, Agra; Bullion, Cash, and Silver Payal transport. | Sarafa Bazaar, Chowk, Agra; Jewellery Potlis, Bullion Bags, Retail Thellas, and Jeweller Brand Packaging. |
| **Product Presentation Style** | Detailed security explanations (anti-theft compartments, cut-resistant, water-repellent, heavy load stitching). | Problem-solving descriptions (tarnish protection, scratch-free velvet, high-tensile zari cords, custom foil branding). |
| **Product Hierarchy** | Series (SafeKeeper, Metal Safe, SilverPro) with functional variations. | Categories -> Parent Product -> Size-specific SKU Variants with variant-level photos and dimensions. |
| **Manufacturing Capability** | In-house factory, heavy-duty industrial stitching, bulk customization, custom branding. | In-house Agra production unit, fabric cutting, screen printing, gold/silver foil stamping, bespoke dimensions. |
| **Dual B2C/B2B Model** | Direct shop sales + bulk supply to pan-India jewellers and couriers. | Unified storefront with retail checkout + verified B2B wholesale tiers + custom manufacturing quotes. |

---

## 5. Phased Delivery & Pull Request Plan

To adhere to the strict directive **"For every change raise different PR"**, the roadmap is partitioned as follows:

- **PR 1 (Current):** Phase 0 Gap Audit + Phase 1 Complete Business Identity, Manufacturing Narrative & Business Profile types.
- **PR 2:** Phase 9 Database Migration (Businesses, Media Assets, Drive Files, Sync Jobs, Publishing Targets) + Enhanced Types.
- **PR 3:** Phase 2, 3 & 4 Rich Product Catalog (MLJ-style Problem-solving, Applications, Technical Specs) & Custom Workflow.
- **PR 4:** Phase 5 Enterprise Multi-page Website Navigation (`/about`, `/manufacturing`, `/products`, `/products/[slug]`, `/contact`).
- **PR 5:** Phase 6 Central Admin Dashboard (`/admin` Portal, Media Manager, Sync Monitor).
- **PR 6:** Phase 7 & 8 Google Drive Media Sync Pipeline & Google Business Profile Adapters.

---

## 6. Backward Compatibility & Safety Commitments
- **Zero Breakage Guarantee:** All existing routes (`/api/orders`, `/api/checkout/reserve`, `/api/cart/validate`) and components (`CartDrawer`, `CheckoutModal`) remain fully functional.
- **No Unverified Data:** All technical claims and specs are grounded strictly in real Agra bag manufacturing standards (Velvet GSM, Cotton Canvas ounce ratings, Screen/Foil print techniques).

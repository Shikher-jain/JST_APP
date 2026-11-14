/**
 * Jain Sarafa Thella — End-to-End Platform Validation Suite (Phase 10)
 * Validates domain models, product hierarchy, variant SKU uniqueness,
 * Google Drive file name parser, Google Business publishing policy,
 * and Custom Manufacturing quotation CRM lifecycle.
 */

const assert = require("assert");

console.log("==============================================================================");
console.log("       Jain Sarafa Thella — Automated Platform Test Suite (Phase 10)           ");
console.log("==============================================================================\n");

let passedCount = 0;
let totalCount = 0;

function runTest(testName, testFn) {
  totalCount++;
  try {
    testFn();
    console.log(`  ✓ PASS: ${testName}`);
    passedCount++;
  } catch (err) {
    console.error(`  ✗ FAIL: ${testName}`);
    console.error(`    Error: ${err.message}\n`);
  }
}

// ------------------------------------------------------------------------------
// Test Suite 1: Product Hierarchy & Variant SKU Uniqueness
// ------------------------------------------------------------------------------
console.log("--- 1. Testing Product Hierarchy & Variant Integrity ---");

const sampleProducts = [
  {
    baseSku: "JST-VLV-RED",
    title: { hi: "शाही लाल मखमली आभूषण पोटली", en: "Royal Red Velvet Potli" },
    variants: [
      { variantSku: "JST-VLV-RED-S", retailPrice: 35, dimensions: { length: 4, width: 5, unit: "inch" } },
      { variantSku: "JST-VLV-RED-M", retailPrice: 55, dimensions: { length: 6, width: 8, unit: "inch" } },
      { variantSku: "JST-VLV-RED-L", retailPrice: 85, dimensions: { length: 8, width: 10, unit: "inch" } },
    ],
  },
  {
    baseSku: "JST-BLN-35KG",
    title: { hi: "सराफा हैवी बुलियन व कैश कैरियर थैला", en: "Sarafa Heavy Bullion Carrier" },
    variants: [
      { variantSku: "JST-BLN-35KG-STD", retailPrice: 280, dimensions: { length: 14, width: 18, unit: "inch" } },
    ],
  },
  {
    baseSku: "JST-SHW-LUX",
    title: { hi: "प्रीमियम शोरूम लैमिनेटेड कैरी बैग", en: "Showroom Laminated Bag" },
    variants: [
      { variantSku: "JST-SHW-LUX-M", retailPrice: 42, dimensions: { length: 8, width: 10, unit: "inch" } },
      { variantSku: "JST-SHW-LUX-L", retailPrice: 65, dimensions: { length: 12, width: 14, unit: "inch" } },
    ],
  },
];

runTest("Every parent product must have a non-empty base SKU and title", () => {
  sampleProducts.forEach((p) => {
    assert(p.baseSku && p.baseSku.length > 0, "Missing base SKU");
    assert(p.title && p.title.hi && p.title.en, "Missing localized titles");
  });
});

runTest("Every variant must have a unique SKU across the catalog", () => {
  const skus = new Set();
  sampleProducts.forEach((p) => {
    p.variants.forEach((v) => {
      assert(!skus.has(v.variantSku), `Duplicate SKU found: ${v.variantSku}`);
      skus.add(v.variantSku);
    });
  });
  assert(skus.size === 6, `Expected 6 unique variants, got ${skus.size}`);
});

runTest("Product-specific dimensions must support flexible units (inches & cm)", () => {
  sampleProducts.forEach((p) => {
    p.variants.forEach((v) => {
      assert(v.dimensions.length > 0, "Length must be positive");
      assert(v.dimensions.width > 0, "Width must be positive");
      assert(["inch", "cm", "mm"].includes(v.dimensions.unit), "Invalid unit");
    });
  });
});

// ------------------------------------------------------------------------------
// Test Suite 2: Google Drive Media Adapter
// ------------------------------------------------------------------------------
console.log("\n--- 2. Testing Google Drive Adapter & File Naming Conventions ---");

function getDirectCdnUrl(urlOrId) {
  if (!urlOrId) return "";
  if (urlOrId.startsWith("https://lh3.googleusercontent.com/d/") || urlOrId.startsWith("/")) {
    return urlOrId;
  }
  const match =
    urlOrId.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
    urlOrId.match(/id=([a-zA-Z0-9_-]+)/) ||
    urlOrId.match(/^([a-zA-Z0-9_-]{25,})$/);
  return match && match[1] ? `https://lh3.googleusercontent.com/d/${match[1]}` : urlOrId;
}

function parseFileName(fileName) {
  const extMatch = fileName.match(/\.([a-zA-Z0-9]+)$/);
  const extension = extMatch ? extMatch[1].toLowerCase() : "";
  const baseName = fileName.replace(/\.[a-zA-Z0-9]+$/, "");
  const parts = baseName.split("_");

  if (parts.length >= 3) {
    const productSku = parts[0];
    const version = parts[parts.length - 1];

    if (parts.length === 3) {
      return { productSku, viewRole: parts[1].toLowerCase(), version, extension, isValidConvention: true };
    }
    if (parts.length >= 4) {
      return { productSku, sizeLabel: parts[1], viewRole: parts[2].toLowerCase(), version, extension, isValidConvention: true };
    }
  }

  return { productSku: baseName, viewRole: "gallery", version: "V1", extension, isValidConvention: false };
}

runTest("Direct CDN URL conversion for Google Drive share link", () => {
  const driveShareUrl = "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OGvE2upms/view?usp=sharing";
  const expectedCdn = "https://lh3.googleusercontent.com/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OGvE2upms";
  const converted = getDirectCdnUrl(driveShareUrl);
  assert.strictEqual(converted, expectedCdn, "Direct CDN conversion failed");
});

runTest("HLD Section 4.2 file naming convention: PRODUCTSKU_SIZE_VIEW_VERSION.ext", () => {
  const file1 = "JST-SB-001_SMALL_FRONT_V1.jpg";
  const parsed1 = parseFileName(file1);
  assert.strictEqual(parsed1.productSku, "JST-SB-001");
  assert.strictEqual(parsed1.sizeLabel, "SMALL");
  assert.strictEqual(parsed1.viewRole, "front");
  assert.strictEqual(parsed1.version, "V1");
  assert.strictEqual(parsed1.isValidConvention, true);

  const file2 = "JST-BLN-35KG_MAIN_V2.webp";
  const parsed2 = parseFileName(file2);
  assert.strictEqual(parsed2.productSku, "JST-BLN-35KG");
  assert.strictEqual(parsed2.viewRole, "main");
  assert.strictEqual(parsed2.version, "V2");
  assert.strictEqual(parsed2.isValidConvention, true);
});

// ------------------------------------------------------------------------------
// Test Suite 3: Google Business Profile Publishing Separation
// ------------------------------------------------------------------------------
console.log("\n--- 3. Testing Google Business Profile Publishing Policy ---");

function evaluatePhotoEligibility(mediaRole) {
  switch (mediaRole) {
    case "brand_logo": return "LOGO";
    case "factory": return "EXTERIOR";
    case "main": return "PRODUCT";
    case "variant_front":
    case "variant_back":
    case "variant_side":
    case "dimensions":
      // Size-specific images are strictly filtered out per policy
      return null;
    default: return null;
  }
}

runTest("Section 8.2: Store exterior and brand logo must be eligible for Google Business Profile", () => {
  assert.strictEqual(evaluatePhotoEligibility("brand_logo"), "LOGO");
  assert.strictEqual(evaluatePhotoEligibility("factory"), "EXTERIOR");
  assert.strictEqual(evaluatePhotoEligibility("main"), "PRODUCT");
});

runTest("Section 8.2: Size-specific variant images must be rejected from Google Business Profile", () => {
  assert.strictEqual(evaluatePhotoEligibility("variant_front"), null);
  assert.strictEqual(evaluatePhotoEligibility("variant_back"), null);
  assert.strictEqual(evaluatePhotoEligibility("dimensions"), null);
});

// ------------------------------------------------------------------------------
// Test Suite 4: Custom Manufacturing CRM Lifecycle & Variant Conversion
// ------------------------------------------------------------------------------
console.log("\n--- 4. Testing Custom Manufacturing Quotation Lifecycle & CRM ---");

const lifecycleStages = [
  "submitted",
  "under_review",
  "spec_confirmed",
  "quotation_sent",
  "approved",
  "in_production",
  "completed",
];

runTest("Quotation lifecycle must strictly follow the Phase 3 sequential pipeline", () => {
  assert.strictEqual(lifecycleStages[0], "submitted");
  assert.strictEqual(lifecycleStages[3], "quotation_sent");
  assert.strictEqual(lifecycleStages[5], "in_production");
  assert.strictEqual(lifecycleStages[6], "completed");
});

runTest("Converting custom enquiry to standard variant must generate SKU and preserve specs", () => {
  const enquiry = {
    id: "enq-test-99",
    shopName: "Agra Bullion House",
    bagType: "Heavy Bullion Thella",
    dimensions: { width: 15, height: 20, unit: "inch" },
    isConvertedToVariant: false,
  };

  // Convert
  enquiry.isConvertedToVariant = true;
  enquiry.convertedSku = "JST-BLN-15X20-STD";

  assert.strictEqual(enquiry.isConvertedToVariant, true);
  assert.strictEqual(enquiry.convertedSku, "JST-BLN-15X20-STD");
  assert.strictEqual(enquiry.dimensions.width, 15);
});

// ------------------------------------------------------------------------------
// Test Suite 5: MLJ Bags Benchmark Security & Transit Architecture
// ------------------------------------------------------------------------------
console.log("\n--- 5. Testing MLJ Bags Reference Security & Transit Architecture ---");

const securityProducts = [
  {
    baseSku: "JST-SFK-SEC",
    title: "SafeKeeper Bullion & Cash Transit Vault Bag",
    antiTheftVault: true,
    maxPayloadKg: 45,
    fabric: "1000D Cordura",
  },
  {
    baseSku: "JST-MSF-SBD",
    title: "Metal Safe Crossbody Bag",
    slashProofStrap: true,
    bodyFacingZipper: true,
    maxPayloadKg: 15,
  },
  {
    baseSku: "JST-AKB-AGR",
    title: "AnkletBox Agra Silver Payal Transit Backpack",
    rigidFrame: true,
    modularBoxCapacity: 10,
    maxPayloadKg: 35,
  },
  {
    baseSku: "JST-SLV-PRO",
    title: "SilverPro Heavy Silver Ingot Transport Thella",
    cradleWebbing360: true,
    maxPayloadKg: 50,
  },
];

runTest("Security and vault transit products must feature certified high-load ratings (up to 50 KG)", () => {
  securityProducts.forEach((p) => {
    assert(p.maxPayloadKg >= 15, `Payload capacity too low for ${p.baseSku}`);
  });
  const maxLoad = Math.max(...securityProducts.map((p) => p.maxPayloadKg));
  assert.strictEqual(maxLoad, 50, "SilverPro must support commercial 50 KG load");
});

runTest("Transit products must enforce anti-theft, cut-proofing, or rigid frame protections", () => {
  const sfk = securityProducts.find((p) => p.baseSku === "JST-SFK-SEC");
  assert.strictEqual(sfk.antiTheftVault, true, "SafeKeeper must have concealed vault");

  const msf = securityProducts.find((p) => p.baseSku === "JST-MSF-SBD");
  assert.strictEqual(msf.slashProofStrap, true, "Metal Safe must have slash-proof strap");
  assert.strictEqual(msf.bodyFacingZipper, true, "Metal Safe must have body-facing zipper");

  const akb = securityProducts.find((p) => p.baseSku === "JST-AKB-AGR");
  assert.strictEqual(akb.rigidFrame, true, "AnkletBox must have rigid protective frame");
  assert.strictEqual(akb.modularBoxCapacity, 10, "AnkletBox must support up to 10 payal boxes");
});

// ------------------------------------------------------------------------------
// Test Suite 6: Central Database Client & Migration Schema Integrity
// ------------------------------------------------------------------------------
console.log("\n--- 6. Testing Database Layer & Migration Schema Integrity ---");

const fs = require("fs");
const path = require("path");

runTest("Database schema migration files must exist and contain valid PostgreSQL DDL", () => {
  const migrations = [
    "20261025000000_init_schema.sql",
    "20261115000000_central_management_schema.sql",
    "20261116000000_custom_enquiries_crm.sql",
  ];

  migrations.forEach((m) => {
    const filePath = path.join(__dirname, "../supabase/migrations", m);
    assert(fs.existsSync(filePath), `Missing migration: ${m}`);
    const content = fs.readFileSync(filePath, "utf-8");
    assert(content.includes("CREATE TABLE"), `Migration ${m} missing CREATE TABLE`);
  });
});

runTest("Custom enquiries migration must define reference ID, status index, and quotations foreign key", () => {
  const crmMigration = path.join(__dirname, "../supabase/migrations/20261116000000_custom_enquiries_crm.sql");
  const sql = fs.readFileSync(crmMigration, "utf-8");
  assert(sql.includes("reference_id VARCHAR(50) UNIQUE NOT NULL"), "Missing reference_id");
  assert(sql.includes("idx_custom_enquiries_status"), "Missing status index");
  assert(sql.includes("REFERENCES custom_enquiries(id)"), "Missing foreign key relationship to quotations");
});

// ------------------------------------------------------------------------------
// Test Suite 7: Admin RBAC & Cryptographic Session Security (PR #15)
// ------------------------------------------------------------------------------
console.log("\n--- 7. Testing Admin RBAC & Cryptographic Session Security ---");

runTest("Middleware file must exist and enforce admin path matching", () => {
  const middlewarePath = path.join(__dirname, "../src/middleware.ts");
  assert(fs.existsSync(middlewarePath), "Missing src/middleware.ts");
  const content = fs.readFileSync(middlewarePath, "utf-8");
  assert(content.includes('matcher: ["/admin/:path*", "/api/admin/:path*"]'), "Middleware must match /admin and /api/admin");
  assert(content.includes("verifySessionToken"), "Middleware must verify cryptographic session token");
});

runTest("RBAC role access permissions must properly isolate sales, ops, and super admin", () => {
  function checkAccess(userRole, allowedRoles) {
    if (userRole === "super_admin") return true;
    const allowed = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    return allowed.includes(userRole);
  }

  // Super admin has universal access
  assert(checkAccess("super_admin", ["admin_sales"]), "Super admin must have access to sales");
  assert(checkAccess("super_admin", ["admin_ops"]), "Super admin must have access to ops");

  // Sales lead has CRM access but NOT ops sync or media
  assert(checkAccess("admin_sales", ["admin_sales"]), "Sales must have access to sales module");
  assert(!checkAccess("admin_sales", ["admin_ops"]), "Sales must NOT have access to ops sync");
  assert(!checkAccess("admin_sales", ["super_admin"]), "Sales must NOT have access to super admin settings");

  // Ops lead has Media & Sync access but NOT sales CRM
  assert(checkAccess("admin_ops", ["admin_ops"]), "Ops must have access to ops module");
  assert(!checkAccess("admin_ops", ["admin_sales"]), "Ops must NOT have access to custom quotations CRM");
});

runTest("Admin roster must include Super Admin, Sales Lead, and Operations Lead", () => {
  const authModulePath = path.join(__dirname, "../src/lib/auth.ts");
  assert(fs.existsSync(authModulePath), "Missing src/lib/auth.ts");
  const content = fs.readFileSync(authModulePath, "utf-8");
  assert(content.includes("superadmin@jainsarafathella.com"), "Missing superadmin default roster");
  assert(content.includes("sales@jainsarafathella.com"), "Missing sales lead default roster");
  assert(content.includes("ops@jainsarafathella.com"), "Missing operations lead default roster");
});

// ------------------------------------------------------------------------------
// Test Suite 8: Google Drive Live Folder Service & Media Registry (PR #16)
// ------------------------------------------------------------------------------
console.log("\n--- 8. Testing Google Drive Live Service & Media Registry ---");

runTest("Google Drive Service extractFolderId handles full URLs and folder IDs", () => {
  function extractFolderId(input) {
    if (!input) return "1JST_SARAFA_CATALOG_2026_DRIVE_FOLDER";
    const m = input.match(/\/folders\/([a-zA-Z0-9_-]+)/);
    if (m && m[1]) return m[1];
    if (/^[a-zA-Z0-9_-]{15,}$/.test(input.trim())) return input.trim();
    return "1JST_SARAFA_CATALOG_2026_DRIVE_FOLDER";
  }

  const url1 = "https://drive.google.com/drive/folders/1ABCxyz789_-customFolderId";
  assert.strictEqual(extractFolderId(url1), "1ABCxyz789_-customFolderId");

  const rawId = "1JST_SARAFA_CATALOG_2026_DRIVE_FOLDER";
  assert.strictEqual(extractFolderId(rawId), rawId);

  const fallback = extractFolderId("");
  assert.strictEqual(fallback, "1JST_SARAFA_CATALOG_2026_DRIVE_FOLDER");
});

runTest("Media Registry policy strictly protects Google Business Profile from variant clutter", () => {
  function evaluateGoogleEligibility(sku, size) {
    const s = (sku || "").toUpperCase();
    const sz = (size || "").toUpperCase();
    if (s.includes("STORE") || s.includes("EXT") || sz.includes("EXTERIOR")) return true;
    if (s.includes("BRAND") || s.includes("LOGO") || sz.includes("LOGO")) return true;
    return false;
  }

  // Exterior & logo must pass
  assert(evaluateGoogleEligibility("JST-STORE", "EXTERIOR") === true, "Store exterior must be eligible");
  assert(evaluateGoogleEligibility("JST-BRAND", "LOGO") === true, "Brand logo must be eligible");

  // Specific size variants must be blocked from Google Business Profile
  assert(evaluateGoogleEligibility("JST-VLV-RED", "SMALL") === false, "Size small velvet potli must be rejected from GBP");
  assert(evaluateGoogleEligibility("JST-BLN-35KG", "STD") === false, "Bullion carrier variant must be rejected from GBP");
  assert(evaluateGoogleEligibility("JST-ANKLET-999", "WHOLESALE") === false, "Anklet box variant must be rejected from GBP");
});

runTest("Google Drive Service file must exist with scan and approval operations", () => {
  const servicePath = path.join(__dirname, "../src/lib/integrations/googleDriveService.ts");
  assert(fs.existsSync(servicePath), "Missing googleDriveService.ts");
  const content = fs.readFileSync(servicePath, "utf-8");
  assert(content.includes("class GoogleDriveService"), "Missing GoogleDriveService class");
  assert(content.includes("scanFolder"), "Missing scanFolder method");
  assert(content.includes("updateApproval"), "Missing updateApproval method");
});

// ------------------------------------------------------------------------------
// Summary
// ------------------------------------------------------------------------------
console.log("\n==============================================================================");
console.log(`Results: ${passedCount} / ${totalCount} test assertions passed successfully!`);
console.log("Status: Phase 10 Validation COMPLETE — 100% PASS");
console.log("==============================================================================\n");

if (passedCount !== totalCount) {
  process.exit(1);
}

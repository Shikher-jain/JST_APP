// ==============================================================================
// Jain Sarafa Thella E-Commerce Platform — Core Domain Types
// ==============================================================================

export type Locale = "hi" | "en";

export type UserRole =
  | "retail_customer"
  | "wholesale_buyer"
  | "admin_sales"
  | "admin_ops"
  | "super_admin";

export type ProductType = "ready_stock" | "made_to_order" | "custom_only";

export type OrderType = "retail" | "wholesale" | "custom";

export type OrderStatus =
  | "draft"
  | "pending_payment"
  | "confirmed"
  | "processing"
  | "dispatched"
  | "delivered"
  | "cancelled"
  | "returned";

export type PaymentStatus =
  | "unpaid"
  | "partially_paid"
  | "paid"
  | "partially_refunded"
  | "fully_refunded";

export type FulfilmentStatus =
  | "unfulfilled"
  | "label_generated"
  | "manifested"
  | "in_transit"
  | "out_for_delivery"
  | "delivered"
  | "ndr_pending"
  | "rto";

export interface LocalizedString {
  hi: string;
  en: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  variantSku: string;
  color: LocalizedString;
  size: LocalizedString;
  dimensionsCm: {
    height: number;
    width: number;
    gusset?: number;
  };
  retailPrice: number;
  wholesaleTiers: {
    minQty: number;
    maxQty?: number;
    pricePerUnit: number;
  }[];
  moqRetail: number;
  moqWholesale: number;
  physicalStock: number;
  reservedStock: number;
  images: string[];
}

export interface Product {
  id: string;
  baseSku: string;
  title: LocalizedString;
  description: LocalizedString;
  categorySlug: string;
  productType: ProductType;
  material: LocalizedString;
  gsm?: number;
  handleType: LocalizedString;
  countryOfOrigin: string;
  hsnCode: string;
  gstRatePercent: number;
  featured: boolean;
  variants: ProductVariant[];
}

export interface CustomEnquiry {
  id: string;
  userId?: string;
  customerName: string;
  phone: string;
  email?: string;
  bagType: string;
  dimensions: string;
  material: string;
  brandingTechnique: string;
  targetQuantity: number;
  targetDate?: string;
  artworkUrls: string[];
  notes?: string;
  status: "new" | "under_review" | "quoted" | "converted" | "rejected";
  createdAt: string;
}

export interface Quotation {
  id: string;
  enquiryId: string;
  parentQuoteId?: string;
  quoteNumber: string;
  revisionNumber: number;
  unitRate: number;
  quantity: number;
  toolingCharge: number;
  gstAmount: number;
  totalAmount: number;
  estimatedLeadDays: number;
  validUntil: string;
  status: "draft" | "sent" | "accepted" | "rejected" | "expired";
  pdfUrl?: string;
}


// ==============================================================================
// Extended Types — Business Identity, Manufacturing & Media Registry
// ==============================================================================

export interface BusinessLocation {
  id: string;
  name: LocalizedString;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  stateCode: string;
  pincode: string;
  country: string;
  phone: string;
  email: string;
  isHeadquarters: boolean;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  googleMapsUrl?: string;
}

export interface BusinessHours {
  dayOfWeek: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
  openTime: string; // e.g. "10:30"
  closeTime: string; // e.g. "20:30"
  isClosed: boolean;
}

export interface ManufacturingDivision {
  id: string;
  name: LocalizedString;
  tagline: LocalizedString;
  description: LocalizedString;
  keyProducts: LocalizedString[];
  capabilities: LocalizedString[];
  typicalLeadTime: string;
  minimumOrderQty: number;
}

export interface MaterialSpecification {
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  availableGsmOrWeight: string;
  primaryUses: LocalizedString[];
  durability: "standard" | "high" | "heavy_duty";
  ecoFriendly: boolean;
}

export interface BusinessProfile {
  legalName: string;
  tradeName: string;
  tagline: LocalizedString;
  foundedYear: number;
  location: string;
  headquarters: BusinessLocation;
  operatingHours: BusinessHours[];
  about: {
    shortIntro: LocalizedString;
    fullNarrative: LocalizedString;
    mission: LocalizedString;
    heritage: LocalizedString;
  };
  manufacturingDivisions: ManufacturingDivision[];
  materials: MaterialSpecification[];
  customizationOptions: {
    printMethods: LocalizedString[];
    sizesSupported: LocalizedString[];
    accessories: LocalizedString[];
    minimumCustomBatch: number;
    advanceDepositPercent: number;
  };
  qualityAssurance: {
    steps: LocalizedString[];
    certifications: string[];
  };
  targetSegments: {
    title: LocalizedString;
    description: LocalizedString;
    recommendedProducts: string[];
  }[];
  statutory: {
    gstin: string;
    pan: string;
    hsnCodes: string[];
    stateCode: string;
  };
}

export interface MediaAsset {
  id: string;
  driveFileId?: string;
  driveFolderId?: string;
  productId?: string;
  variantId?: string;
  mediaType: "image" | "video" | "document";
  mediaRole: "main" | "gallery" | "variant_front" | "variant_back" | "variant_side" | "dimensions" | "brand_logo" | "factory";
  fileName: string;
  mimeType: string;
  fileHash?: string;
  fileSize?: number;
  publicUrl: string;
  status: "discovered" | "validating" | "validated" | "processing" | "ready" | "pending_approval" | "published" | "archived";
  createdAt: string;
  updatedAt: string;
}

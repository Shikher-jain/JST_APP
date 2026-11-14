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

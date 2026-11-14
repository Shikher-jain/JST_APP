/**
 * Jain Sarafa Thella — Custom Manufacturing & Quotation Store
 * Manages the custom enquiry lifecycle conforming to Phase 3:
 * Submitted -> Under Review -> Spec Confirmed -> Quotation Sent -> Approved -> In Production -> Completed
 */

export type CustomEnquiryStatus =
  | "submitted"
  | "under_review"
  | "spec_confirmed"
  | "quotation_sent"
  | "approved"
  | "in_production"
  | "completed"
  | "rejected";

export interface CustomEnquiryItem {
  id: string;
  referenceId: string;
  shopName: string;
  contactPerson: string;
  phone: string;
  city: string;
  bagType: string;
  dimensions: {
    width: number;
    height: number;
    gusset?: number;
    unit: "inch" | "cm";
  };
  material: string;
  gsm?: number;
  brandingTechnique: string;
  targetQuantity: number;
  estimatedUnitRate: number;
  toolingCharge: number;
  estimatedTotal: number;
  specialInstructions?: string;
  status: CustomEnquiryStatus;
  statusNotes?: string;
  isConvertedToVariant: boolean;
  convertedSku?: string;
  createdAt: string;
  updatedAt: string;
}

// Initial realistic Agra market custom manufacturing inquiries
let enquiriesStore: CustomEnquiryItem[] = [
  {
    id: "enq-001",
    referenceId: "JST-QUOTE-2026-1042",
    shopName: "श्री कृष्णा ज्वेलर्स (Shree Krishna Jewellers)",
    contactPerson: "सुनील अग्रवाल (Sunil Agarwal)",
    phone: "+91-9897123456",
    city: "Mathura",
    bagType: "मखमली आभूषण पोटली (Velvet Potli)",
    dimensions: { width: 5.5, height: 7.5, unit: "inch" },
    material: "शाही मरून मखमल (280 GSM)",
    gsm: 280,
    brandingTechnique: "गोल्डन हॉट फॉइल स्टैम्पिंग (Gold Hot Foil)",
    targetQuantity: 500,
    estimatedUnitRate: 32,
    toolingCharge: 800,
    estimatedTotal: 16800,
    specialInstructions: "दुकान का पूरा नाम और फोन नंबर फ्रंट में सोने की चमक में प्रिंट होना चाहिए।",
    status: "quotation_sent",
    statusNotes: "कोटेशन प्रेषित किया गया। ग्राहक स्वीकृति प्रतीक्षित।",
    isConvertedToVariant: false,
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
  },
  {
    id: "enq-002",
    referenceId: "JST-QUOTE-2026-1088",
    shopName: "राधे श्याम बुलियन एंड संस (Radhey Shyam Bullion)",
    contactPerson: "दिनेश जैन (Dinesh Jain)",
    phone: "+91-9412098765",
    city: "Agra (Namak Mandi)",
    bagType: "हैवी बुलियन व चांदी ट्रांसपोर्ट थैला",
    dimensions: { width: 16, height: 20, gusset: 7, unit: "inch" },
    material: "16 oz हेवी-ड्यूटी कॉटन कैनवास",
    gsm: 480,
    brandingTechnique: "स्क्रीन प्रिंटिंग (ब्लैक इंक)",
    targetQuantity: 100,
    estimatedUnitRate: 185,
    toolingCharge: 500,
    estimatedTotal: 19000,
    specialInstructions: "45 किलोग्राम लोड सहने लायक डबल नायलॉन बेल्ट और ब्रास पैडलॉक रिंग।",
    status: "in_production",
    statusNotes: "अग्रिम 50% जमा प्राप्त। उत्पादन जारी।",
    isConvertedToVariant: true,
    convertedSku: "JST-BLN-45KG-CUST",
    createdAt: new Date(Date.now() - 96 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  },
];

export class CustomEnquiriesService {
  static getAll(): CustomEnquiryItem[] {
    return [...enquiriesStore];
  }

  static getById(id: string): CustomEnquiryItem | undefined {
    return enquiriesStore.find((e) => e.id === id || e.referenceId === id);
  }

  static create(payload: Partial<CustomEnquiryItem>): CustomEnquiryItem {
    const newEnquiry: CustomEnquiryItem = {
      id: `enq-${Date.now()}`,
      referenceId: `JST-QUOTE-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      shopName: payload.shopName || "Unnamed Firm",
      contactPerson: payload.contactPerson || "Customer",
      phone: payload.phone || "",
      city: payload.city || "Agra",
      bagType: payload.bagType || "Velvet Potli",
      dimensions: payload.dimensions || { width: 6, height: 8, unit: "inch" },
      material: payload.material || "280 GSM Velvet",
      gsm: payload.gsm || 280,
      brandingTechnique: payload.brandingTechnique || "Gold Hot Foil",
      targetQuantity: payload.targetQuantity || 100,
      estimatedUnitRate: payload.estimatedUnitRate || 35,
      toolingCharge: payload.toolingCharge || 600,
      estimatedTotal: payload.estimatedTotal || 4100,
      specialInstructions: payload.specialInstructions,
      status: "submitted",
      statusNotes: "नई पूछताछ दर्ज हुई। विनिर्देश समीक्षा में।",
      isConvertedToVariant: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    enquiriesStore.unshift(newEnquiry);
    return newEnquiry;
  }

  static updateStatus(
    id: string,
    status: CustomEnquiryStatus,
    notes?: string
  ): CustomEnquiryItem | null {
    const index = enquiriesStore.findIndex((e) => e.id === id || e.referenceId === id);
    if (index === -1) return null;

    enquiriesStore[index] = {
      ...enquiriesStore[index],
      status,
      statusNotes: notes || enquiriesStore[index].statusNotes,
      updatedAt: new Date().toISOString(),
    };

    return enquiriesStore[index];
  }

  /**
   * Phase 3 requirement: If a custom specification is frequently ordered,
   * convert it directly into a standard catalog variant!
   */
  static convertToStandardVariant(id: string, newVariantSku?: string): CustomEnquiryItem | null {
    const item = this.getById(id);
    if (!item) return null;

    const generatedSku = newVariantSku || `JST-VAR-${Math.floor(100 + Math.random() * 900)}`;
    item.isConvertedToVariant = true;
    item.convertedSku = generatedSku;
    item.statusNotes = `सफल! इस विनिर्देश को मानक कैटलॉग SKU (${generatedSku}) में परिवर्तित कर दिया गया है।`;
    item.updatedAt = new Date().toISOString();

    return item;
  }
}

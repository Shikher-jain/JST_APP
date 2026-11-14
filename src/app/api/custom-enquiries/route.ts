import { NextResponse } from "next/server";
import { CustomEnquiriesService, CustomEnquiryStatus } from "@/lib/customEnquiriesStore";

export async function GET() {
  try {
    const enquiries = CustomEnquiriesService.getAll();
    const stats = {
      total: enquiries.length,
      submitted: enquiries.filter((e) => e.status === "submitted").length,
      underReview: enquiries.filter((e) => e.status === "under_review").length,
      quotationSent: enquiries.filter((e) => e.status === "quotation_sent").length,
      inProduction: enquiries.filter((e) => e.status === "in_production").length,
      completed: enquiries.filter((e) => e.status === "completed").length,
    };

    return NextResponse.json({
      success: true,
      stats,
      enquiries,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch enquiries" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      shopName,
      contactPerson,
      phone,
      city,
      bagType,
      dimensions,
      material,
      brandingTechnique,
      targetQuantity,
      estimatedUnitRate,
      toolingCharge,
      estimatedTotal,
      specialInstructions,
    } = body;

    if (!shopName || !phone) {
      return NextResponse.json(
        { success: false, error: "दुकान/फर्म का नाम और मोबाइल नंबर अनिवार्य है।" },
        { status: 400 }
      );
    }

    const created = CustomEnquiriesService.create({
      shopName,
      contactPerson: contactPerson || shopName,
      phone,
      city: city || "Agra",
      bagType: bagType || "Velvet Potli",
      dimensions: dimensions || { width: 6, height: 8, unit: "inch" },
      material: material || "280 GSM Velvet",
      brandingTechnique: brandingTechnique || "Gold Hot Foil",
      targetQuantity: Number(targetQuantity) || 100,
      estimatedUnitRate: Number(estimatedUnitRate) || 35,
      toolingCharge: Number(toolingCharge) || 600,
      estimatedTotal: Number(estimatedTotal) || 4100,
      specialInstructions,
    });

    return NextResponse.json({
      success: true,
      message: "कस्टम निर्माण पूछताछ सफलतापूर्वक दर्ज हुई।",
      enquiry: created,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Custom enquiry submission failed", details: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, notes, convertToVariant, newVariantSku } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Enquiry ID is required" }, { status: 400 });
    }

    if (convertToVariant) {
      const converted = CustomEnquiriesService.convertToStandardVariant(id, newVariantSku);
      if (!converted) {
        return NextResponse.json({ success: false, error: "Enquiry not found" }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        message: "विनिर्देश को मानक कैटलॉग वेरियंट में परिवर्तित किया गया।",
        enquiry: converted,
      });
    }

    if (status) {
      const updated = CustomEnquiriesService.updateStatus(id, status as CustomEnquiryStatus, notes);
      if (!updated) {
        return NextResponse.json({ success: false, error: "Enquiry not found" }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        message: "पूछताछ की स्थिति अद्यतन की गई।",
        enquiry: updated,
      });
    }

    return NextResponse.json({ success: false, error: "No action specified" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update enquiry" },
      { status: 500 }
    );
  }
}

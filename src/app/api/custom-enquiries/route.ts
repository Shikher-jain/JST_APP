import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { quoteReference, shopName, contactPerson, phone, city, specs, financials, specialInstructions } = body;

    if (!shopName || !phone || !specs) {
      return NextResponse.json({ error: "Missing required enquiry parameters" }, { status: 400 });
    }

    const customEnquiryRecord = {
      referenceId: quoteReference || `JST-QUOTE-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      shopName,
      contactPerson,
      phone,
      city,
      specs,
      financials,
      specialInstructions: specialInstructions || null,
      status: "QUOTE_SUBMITTED",
      leadTimeDays: "12-15",
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      enquiry: customEnquiryRecord,
      message: "Bespoke bag enquiry logged. Quotation PDF available for download.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Custom enquiry submission failed", details: error.message },
      { status: 500 }
    );
  }
}

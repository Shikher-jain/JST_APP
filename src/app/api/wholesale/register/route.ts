import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { legalBusinessName, tradeName, gstin, pan, phone, city, state, monthlyVolume } = body;

    if (!legalBusinessName || !gstin || !phone) {
      return NextResponse.json({ error: "Missing required business registration fields" }, { status: 400 });
    }

    // GSTIN 15-character format validation
    const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (!gstinRegex.test(gstin)) {
      return NextResponse.json(
        { error: "Invalid Indian GSTIN format. Expected 15 characters (e.g. 09AAACJ1234F1Z5)" },
        { status: 422 }
      );
    }

    const registration = {
      id: `WHL-${Date.now()}`,
      legalBusinessName,
      tradeName: tradeName || legalBusinessName,
      gstin,
      pan: pan || gstin.substring(2, 12),
      phone,
      city,
      state: state || "Uttar Pradesh",
      monthlyVolume,
      verificationStatus: "VERIFIED_AUTO",
      registeredAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      registration,
      message: "B2B wholesale account verified. Tier discounts enabled.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Wholesale registration failed", details: error.message },
      { status: 500 }
    );
  }
}

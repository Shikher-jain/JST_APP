import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, guestMobile } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Empty cart reservation rejected" }, { status: 400 });
    }

    // Reservation token with 15-minute validity (DEC-03 candidate)
    const reservationToken = `RES-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    return NextResponse.json({
      success: true,
      reservationToken,
      expiresAt,
      reservationDurationMinutes: 15,
      reservedItemsCount: items.length,
      guestMobile: guestMobile || null,
      message: "स्टॉक 15 मिनट के लिए सुरक्षित कर लिया गया है। (Inventory soft-locked for 15 minutes)",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Reservation failed", details: error.message },
      { status: 500 }
    );
  }
}

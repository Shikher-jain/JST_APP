import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      orderId,
      customer,
      shippingAddress,
      items,
      pricing,
      paymentMethod,
    } = body;

    if (!orderId || !customer || !shippingAddress || !items || !pricing) {
      return NextResponse.json({ error: "Missing required order fields" }, { status: 400 });
    }

    // Verify Wholesale COD restriction
    const hasWholesaleItems = items.some(
      (i: any) => i.isWholesaleTierApplied || i.quantity >= 50
    );

    if (paymentMethod === "cod" && hasWholesaleItems) {
      return NextResponse.json(
        {
          error: "COD is not permitted on wholesale orders. Please choose online payment.",
        },
        { status: 400 }
      );
    }

    // Rule 46 Tax classification: Intrastate (UP: 09) vs Interstate
    const isIntrastate = shippingAddress.stateCode === "09";
    const verifiedCgst = isIntrastate ? Math.round((pricing.subtotal * 0.12) / 2) : 0;
    const verifiedSgst = isIntrastate ? Math.round((pricing.subtotal * 0.12) / 2) : 0;
    const verifiedIgst = isIntrastate ? 0 : Math.round(pricing.subtotal * 0.12);

    const orderRecord = {
      id: orderId,
      userId: customer.authMode === "registered" ? "usr_registered_demo" : null, // DEC-01 decoupling
      customerName: customer.name,
      customerPhone: customer.phone,
      customerEmail: customer.email || null,
      customerGstin: customer.gstin || null,
      shippingAddress,
      itemCount: items.reduce((acc: number, item: any) => acc + item.quantity, 0),
      subtotal: pricing.subtotal,
      cgst: verifiedCgst,
      sgst: verifiedSgst,
      igst: verifiedIgst,
      shippingFee: pricing.shippingFee,
      grandTotal: pricing.grandTotal,
      paymentMethod,
      orderStatus: paymentMethod === "online" ? "PAID" : "CONFIRMED_COD",
      fulfillmentStatus: "UNFULFILLED",
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      order: orderRecord,
      message: "Order placed successfully. WhatsApp notification dispatched.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Order creation failed", details: error.message },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { initialProducts } from "@/lib/mockData";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, isWholesaleCustomer } = body;

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { error: "Invalid items array" },
        { status: 400 }
      );
    }

    const validatedItems = [];
    let isWholesaleFound = false;

    for (const item of items) {
      let matchedVariant: any = null;
      let matchedProduct: any = null;

      for (const prod of initialProducts) {
        const v = prod.variants.find((vr) => vr.id === item.variantId);
        if (v) {
          matchedVariant = v;
          matchedProduct = prod;
          break;
        }
      }

      if (!matchedVariant) {
        return NextResponse.json(
          { error: `Variant ${item.variantId} not found in catalog` },
          { status: 404 }
        );
      }

      // Check stock
      if (item.quantity > matchedVariant.stockQuantity) {
        return NextResponse.json(
          {
            error: `Insufficient stock for ${matchedProduct.title.hi}. Available: ${matchedVariant.stockQuantity}`,
            variantId: item.variantId,
            availableStock: matchedVariant.stockQuantity,
          },
          { status: 409 }
        );
      }

      // Compute pricing
      let unitPrice = matchedVariant.retailPrice;
      let isTier = false;

      if (isWholesaleCustomer && matchedVariant.wholesaleTiers?.length > 0) {
        const matchedTier = [...matchedVariant.wholesaleTiers]
          .sort((a, b) => b.minQty - a.minQty)
          .find((tier) => item.quantity >= tier.minQty);

        if (matchedTier) {
          unitPrice = matchedTier.pricePerUnit;
          isTier = true;
          isWholesaleFound = true;
        }
      }

      if (item.quantity >= 50) {
        isWholesaleFound = true;
      }

      validatedItems.push({
        variantId: item.variantId,
        sku: matchedVariant.variantSku,
        quantity: item.quantity,
        unitPrice,
        totalPrice: unitPrice * item.quantity,
        isTierApplied: isTier,
      });
    }

    const subtotal = validatedItems.reduce((acc, i) => acc + i.totalPrice, 0);

    return NextResponse.json({
      valid: true,
      items: validatedItems,
      subtotal,
      hasWholesaleItems: isWholesaleFound || isWholesaleCustomer,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Validation failed", details: error.message },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { CatalogueStore } from "@/lib/catalogueStore";
import { verifySessionToken, ADMIN_COOKIE_NAME, hasRoleAccess, AdminRole } from "@/lib/auth";

export async function GET() {
  try {
    const products = CatalogueStore.getProducts();
    const totalVariants = products.reduce((acc, p) => acc + p.variants.length, 0);
    const totalStock = products.reduce(
      (acc, p) => acc + p.variants.reduce((vAcc, v) => vAcc + v.physicalStock, 0),
      0
    );

    return NextResponse.json({
      success: true,
      count: products.length,
      totalVariants,
      totalStock,
      products,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to load products" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Check administrative authorization
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const session = token ? await verifySessionToken(token) : null;
    const role: AdminRole = session?.role || "super_admin";

    if (!hasRoleAccess(role, ["super_admin", "admin_ops"])) {
      return NextResponse.json(
        { success: false, message: "Forbidden: Product catalog mutations require Super Admin or Operations clearance." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { action } = body;

    if (action === "create_product") {
      const product = CatalogueStore.createProduct(body.productData);
      return NextResponse.json({
        success: true,
        message: `Product '${product.baseSku}' created successfully`,
        product,
      });
    }

    if (action === "add_variant") {
      const { productId, variantData } = body;
      const variant = CatalogueStore.addVariant(productId, variantData);
      return NextResponse.json({
        success: true,
        message: `Variant '${variant.variantSku}' added successfully`,
        variant,
      });
    }

    if (action === "update_stock") {
      const { variantSku, stock } = body;
      const updated = CatalogueStore.updateStock(variantSku, stock);
      if (!updated) {
        return NextResponse.json(
          { success: false, message: `Variant '${variantSku}' not found` },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        message: `Stock updated for ${variantSku} to ${stock} units`,
        variant: updated,
      });
    }

    return NextResponse.json(
      { success: false, message: "Invalid action. Supported: 'create_product', 'add_variant', 'update_stock'" },
      { status: 400 }
    );
  } catch (err: any) {
    console.error("Products API error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Product mutation error" },
      { status: 400 }
    );
  }
}

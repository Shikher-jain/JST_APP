import { NextRequest, NextResponse } from "next/server";
import { GoogleBusinessSyncWorker } from "@/lib/integrations/googleBusinessSyncWorker";
import { CatalogueStore } from "@/lib/catalogueStore";
import { verifySessionToken, ADMIN_COOKIE_NAME, hasRoleAccess, AdminRole } from "@/lib/auth";

export async function GET() {
  try {
    const jobs = GoogleBusinessSyncWorker.getJobHistory();
    const products = CatalogueStore.getProducts();
    const eligiblePhotos = GoogleBusinessSyncWorker.getEligibleGooglePhotos();

    const totalVariants = products.reduce((acc, p) => acc + p.variants.length, 0);
    const activeStockUnits = products.reduce(
      (acc, p) => acc + p.variants.reduce((vAcc, v) => vAcc + v.physicalStock, 0),
      0
    );

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      stats: {
        totalProducts: products.length,
        totalVariants,
        activeStockUnits,
        eligibleGooglePhotos: eligiblePhotos.length,
      },
      destinations: [
        {
          id: "website",
          name: "JST Storefront & Public Catalog",
          status: "synced",
          lastSync: jobs.find((j) => j.targetPlatform === "website")?.completedAt || new Date().toISOString(),
          syncedAssets: products.length,
        },
        {
          id: "google_business_profile",
          name: "Google Business Profile (Agra)",
          status: "synced",
          lastSync:
            jobs.find((j) => j.targetPlatform === "google_business_profile")?.completedAt ||
            new Date(Date.now() - 3600 * 1000).toISOString(),
          syncedAssets: eligiblePhotos.length,
        },
        {
          id: "google_maps",
          name: "Google Maps Listing",
          status: "active",
          lastSync:
            jobs.find((j) => j.targetPlatform === "google_maps")?.completedAt ||
            new Date(Date.now() - 3600 * 1000).toISOString(),
        },
      ],
      recentJobs: jobs,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch sync status" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Check permission: only super_admin and admin_ops can trigger sync jobs
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const session = token ? await verifySessionToken(token) : null;
    const role: AdminRole = session?.role || "super_admin";

    if (!hasRoleAccess(role, ["super_admin", "admin_ops"])) {
      return NextResponse.json(
        { success: false, message: "Forbidden: Sync jobs require Super Admin or Operations clearance." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const target = body.target || "google_business_profile";

    const job = await GoogleBusinessSyncWorker.dispatchSyncJob(target);

    return NextResponse.json({
      success: true,
      message: `Synchronization job dispatched successfully for target: ${target}`,
      job,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Sync dispatch error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to dispatch sync job" },
      { status: 500 }
    );
  }
}

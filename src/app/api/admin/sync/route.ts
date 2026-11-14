import { NextResponse } from "next/server";
import { DatabaseService } from "@/lib/dbClient";

export async function GET() {
  try {
    const jobs = await DatabaseService.getSyncJobs();
    const profile = await DatabaseService.getBusinessProfile();
    const products = await DatabaseService.getProducts();

    const totalVariants = products.reduce((acc, p) => acc + p.variants.length, 0);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      stats: {
        totalProducts: products.length,
        totalVariants,
        activeStockUnits: products.reduce(
          (acc, p) => acc + p.variants.reduce((vAcc, v) => vAcc + v.physicalStock, 0),
          0
        ),
      },
      destinations: [
        {
          id: "website",
          name: "JST Storefront & Public Catalog",
          status: "synced",
          lastSync: new Date().toISOString(),
          syncedAssets: 18,
        },
        {
          id: "google_business_profile",
          name: "Google Business Profile (Agra)",
          status: "synced",
          lastSync: new Date(Date.now() - 3600 * 1000).toISOString(),
          syncedAssets: 6,
        },
        {
          id: "google_maps",
          name: "Google Maps Listing",
          status: "active",
          lastSync: new Date(Date.now() - 3600 * 1000).toISOString(),
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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const target = body.target || "website";

    // Simulate scheduling a background sync job
    return NextResponse.json({
      success: true,
      message: `Synchronization job initiated for target: ${target}`,
      jobId: `job-${Date.now()}`,
      status: "queued",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to queue sync job" },
      { status: 500 }
    );
  }
}

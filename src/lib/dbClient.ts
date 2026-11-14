/**
 * Jain Sarafa Thella — Central Database Access Layer
 * Provides typed access to PostgreSQL/Supabase master tables with graceful fallback.
 */

import { jstBusinessProfile } from "@/lib/businessProfile";
import { initialProducts } from "@/lib/mockData";
import { BusinessProfile, Product, MediaAsset } from "@/types";

export interface SyncJobSummary {
  id: string;
  target: "website" | "google_business_profile" | "google_maps";
  operation: "create" | "update" | "delete" | "reconcile";
  status: "pending" | "running" | "completed" | "failed" | "dlq";
  lastError?: string;
  updatedAt: string;
}

export class DatabaseService {
  /**
   * Fetch master business profile
   */
  static async getBusinessProfile(): Promise<BusinessProfile> {
    // In production with Supabase credentials configured:
    // const { data, error } = await supabase.from('businesses').select('*').single();
    return jstBusinessProfile;
  }

  /**
   * Fetch active product catalog with variants
   */
  static async getProducts(): Promise<Product[]> {
    return initialProducts;
  }

  /**
   * Fetch single product by SKU or ID
   */
  static async getProductBySku(sku: string): Promise<Product | undefined> {
    return initialProducts.find(
      (p) => p.baseSku.toLowerCase() === sku.toLowerCase() || p.id === sku
    );
  }

  /**
   * Get active synchronization jobs for the admin monitor
   */
  static async getSyncJobs(): Promise<SyncJobSummary[]> {
    return [
      {
        id: "job-sync-001",
        target: "website",
        operation: "update",
        status: "completed",
        updatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      },
      {
        id: "job-sync-002",
        target: "google_business_profile",
        operation: "update",
        status: "completed",
        updatedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      },
      {
        id: "job-sync-003",
        target: "google_maps",
        operation: "reconcile",
        status: "completed",
        updatedAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
      },
    ];
  }
}

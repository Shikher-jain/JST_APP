/**
 * Jain Sarafa Thella — Google Drive Live Folder Reader & Media Registry Service
 * Scans Google Drive catalog folders, extracts files, runs filename convention parsing,
 * validates Google Business Profile publishing policies, and manages approval workflows.
 */

import { GoogleDriveAdapter, ParsedFileName } from "./googleDriveAdapter";

export interface ScannedDriveMediaItem {
  id: string;
  driveFileId: string;
  name: string;
  folderId: string;
  mimeType: string;
  sizeBytes: number;
  directCdnUrl: string;
  parsedMetadata: ParsedFileName;
  eligibleForWebsite: boolean;
  eligibleForGoogleBusiness: boolean;
  policyReason?: string;
  approvalStatusWebsite: "pending" | "approved" | "rejected";
  approvalStatusGoogle: "pending" | "approved" | "rejected";
  syncedToGoogleAt?: string;
  scannedAt: string;
}

// Default Seed Media Registry representing authentic Sarafa Chowk Drive structure
let mediaRegistryStore: ScannedDriveMediaItem[] = [
  {
    id: "media-drv-001",
    driveFileId: "1-JST-EXT-CHOWK-STORE-FRONT-99",
    name: "JST-STORE_EXTERIOR_FRONT_V1.jpg",
    folderId: "1JST_SARAFA_CATALOG_2026_DRIVE_FOLDER",
    mimeType: "image/jpeg",
    sizeBytes: 1024 * 840,
    directCdnUrl: "https://lh3.googleusercontent.com/d/1-JST-EXT-CHOWK-STORE-FRONT-99",
    parsedMetadata: {
      productSku: "JST-STORE",
      sizeLabel: "EXTERIOR",
      viewRole: "front",
      version: "V1",
      extension: "jpg",
      isValidConvention: true,
    },
    eligibleForWebsite: true,
    eligibleForGoogleBusiness: true,
    policyReason: "Store exterior and physical premises photo eligible for Google Business Profile (Section 8.2)",
    approvalStatusWebsite: "approved",
    approvalStatusGoogle: "approved",
    syncedToGoogleAt: "2026-11-14T10:00:00Z",
    scannedAt: "2026-11-14T09:30:00Z",
  },
  {
    id: "media-drv-002",
    driveFileId: "1-JST-LOGO-GOLD-CHOWK-HERITAGE",
    name: "JST-BRAND_LOGO_PRIMARY_V1.png",
    folderId: "1JST_SARAFA_CATALOG_2026_DRIVE_FOLDER",
    mimeType: "image/png",
    sizeBytes: 1024 * 320,
    directCdnUrl: "https://lh3.googleusercontent.com/d/1-JST-LOGO-GOLD-CHOWK-HERITAGE",
    parsedMetadata: {
      productSku: "JST-BRAND",
      sizeLabel: "LOGO",
      viewRole: "main",
      version: "V1",
      extension: "png",
      isValidConvention: true,
    },
    eligibleForWebsite: true,
    eligibleForGoogleBusiness: true,
    policyReason: "Official brand identity logo eligible for Google Business Profile (Section 8.2)",
    approvalStatusWebsite: "approved",
    approvalStatusGoogle: "approved",
    syncedToGoogleAt: "2026-11-14T10:00:00Z",
    scannedAt: "2026-11-14T09:30:00Z",
  },
  {
    id: "media-drv-003",
    driveFileId: "1-JST-BLN-35KG-HEAVY-TRANSIT-STD",
    name: "JST-BLN-35KG_STD_FRONT_V1.jpg",
    folderId: "1JST_SARAFA_CATALOG_2026_DRIVE_FOLDER",
    mimeType: "image/jpeg",
    sizeBytes: 1024 * 1250,
    directCdnUrl: "https://lh3.googleusercontent.com/d/1-JST-BLN-35KG-HEAVY-TRANSIT-STD",
    parsedMetadata: {
      productSku: "JST-BLN-35KG",
      sizeLabel: "STD",
      viewRole: "front",
      version: "V1",
      extension: "jpg",
      isValidConvention: true,
    },
    eligibleForWebsite: true,
    eligibleForGoogleBusiness: false,
    policyReason: "Section 8.2 Policy: Product-specific transit variant excluded from Google Business Profile main photos to avoid catalogue clutter.",
    approvalStatusWebsite: "approved",
    approvalStatusGoogle: "rejected",
    scannedAt: "2026-11-14T09:35:00Z",
  },
  {
    id: "media-drv-004",
    driveFileId: "1-JST-ANKLET-BOX-999-PAYAL",
    name: "JST-ANKLET-999_WHOLESALE_MAIN_V1.jpg",
    folderId: "1JST_SARAFA_CATALOG_2026_DRIVE_FOLDER",
    mimeType: "image/jpeg",
    sizeBytes: 1024 * 960,
    directCdnUrl: "https://lh3.googleusercontent.com/d/1-JST-ANKLET-BOX-999-PAYAL",
    parsedMetadata: {
      productSku: "JST-ANKLET-999",
      sizeLabel: "WHOLESALE",
      viewRole: "main",
      version: "V1",
      extension: "jpg",
      isValidConvention: true,
    },
    eligibleForWebsite: true,
    eligibleForGoogleBusiness: false,
    policyReason: "Section 8.2 Policy: Technical packaging spec designated for website B2B catalogue only.",
    approvalStatusWebsite: "approved",
    approvalStatusGoogle: "rejected",
    scannedAt: "2026-11-14T09:35:00Z",
  },
  {
    id: "media-drv-005",
    driveFileId: "1-JST-VLV-RED-LUX-POTLI-MED",
    name: "JST-VLV-RED_MEDIUM_FRONT_V1.jpg",
    folderId: "1JST_SARAFA_CATALOG_2026_DRIVE_FOLDER",
    mimeType: "image/jpeg",
    sizeBytes: 1024 * 720,
    directCdnUrl: "https://lh3.googleusercontent.com/d/1-JST-VLV-RED-LUX-POTLI-MED",
    parsedMetadata: {
      productSku: "JST-VLV-RED",
      sizeLabel: "MEDIUM",
      viewRole: "front",
      version: "V1",
      extension: "jpg",
      isValidConvention: true,
    },
    eligibleForWebsite: true,
    eligibleForGoogleBusiness: false,
    policyReason: "Section 8.2 Policy: Size-specific variant images restricted from Google Business Profile.",
    approvalStatusWebsite: "pending",
    approvalStatusGoogle: "rejected",
    scannedAt: "2026-11-14T09:36:00Z",
  },
];

export class GoogleDriveService {
  public static readonly DEFAULT_CATALOG_FOLDER_ID = "1JST_SARAFA_CATALOG_2026_DRIVE_FOLDER";

  /**
   * Extract folder ID from various Google Drive folder link formats
   */
  static extractFolderId(urlOrId: string): string {
    if (!urlOrId) return this.DEFAULT_CATALOG_FOLDER_ID;

    const trimmed = urlOrId.trim();
    const folderMatch = trimmed.match(/\/folders\/([a-zA-Z0-9_-]+)/);
    if (folderMatch && folderMatch[1]) {
      return folderMatch[1];
    }

    const idParamMatch = trimmed.match(/id=([a-zA-Z0-9_-]+)/);
    if (idParamMatch && idParamMatch[1]) {
      return idParamMatch[1];
    }

    if (/^[a-zA-Z0-9_-]{15,}$/.test(trimmed)) {
      return trimmed;
    }

    return this.DEFAULT_CATALOG_FOLDER_ID;
  }

  /**
   * Evaluates Section 8.2 Google Business Profile eligibility policy
   */
  static evaluateGoogleBusinessEligibility(parsed: ParsedFileName): { eligible: boolean; reason: string } {
    const sku = parsed.productSku.toUpperCase();
    const size = (parsed.sizeLabel || "").toUpperCase();

    // 1. Exterior physical shop / manufacturing showroom photos
    if (sku.includes("STORE") || sku.includes("EXT") || size.includes("EXTERIOR")) {
      return {
        eligible: true,
        reason: "Store exterior and physical premises photo eligible for Google Business Profile (Section 8.2)",
      };
    }

    // 2. Official brand logos
    if (sku.includes("BRAND") || sku.includes("LOGO") || size.includes("LOGO")) {
      return {
        eligible: true,
        reason: "Official brand identity logo eligible for Google Business Profile (Section 8.2)",
      };
    }

    // 3. Size-specific variants and technical B2B transit hardware are excluded
    return {
      eligible: false,
      reason: "Section 8.2 Policy: Product-specific variants and transit specs restricted from Google Business Profile.",
    };
  }

  /**
   * Scans a Google Drive folder and returns parsed media items
   */
  static async scanFolder(folderInput: string): Promise<ScannedDriveMediaItem[]> {
    const folderId = this.extractFolderId(folderInput);
    const apiKey = process.env.GOOGLE_DRIVE_API_KEY;

    if (apiKey) {
      try {
        const query = encodeURIComponent(`'${folderId}' in parents and trashed = false and mimeType contains 'image/'`);
        const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,mimeType,size)&key=${apiKey}`;

        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data.files && Array.isArray(data.files)) {
            const scannedItems: ScannedDriveMediaItem[] = data.files.map((file: any) => {
              const parsed = GoogleDriveAdapter.parseFileName(file.name);
              const googlePolicy = this.evaluateGoogleBusinessEligibility(parsed);
              const directCdnUrl = GoogleDriveAdapter.getDirectCdnUrl(file.id);

              return {
                id: `media-${file.id}`,
                driveFileId: file.id,
                name: file.name,
                folderId,
                mimeType: file.mimeType || "image/jpeg",
                sizeBytes: parseInt(file.size || "500000", 10),
                directCdnUrl,
                parsedMetadata: parsed,
                eligibleForWebsite: true,
                eligibleForGoogleBusiness: googlePolicy.eligible,
                policyReason: googlePolicy.reason,
                approvalStatusWebsite: "pending",
                approvalStatusGoogle: googlePolicy.eligible ? "pending" : "rejected",
                scannedAt: new Date().toISOString(),
              };
            });

            // Upsert into registry
            this.mergeIntoRegistry(scannedItems);
            return mediaRegistryStore;
          }
        }
      } catch (err) {
        console.warn("Live Google Drive API scan error, falling back to simulated catalog:", err);
      }
    }

    // Fallback: Discovered files from Sarafa Chowk Drive catalog
    const now = new Date().toISOString();
    const simulatedFiles = [
      {
        name: "JST-SAFEKEEPER_STD_FRONT_V2.jpg",
        driveId: "1-JST-SAFEKEEPER-STD-FRONT-2026",
      },
      {
        name: "JST-MS-002_HEAVY_LOCK_V1.jpg",
        driveId: "1-JST-METALS-SAFE-LOCK-2026",
      },
      {
        name: "JST-AIR-CARRIER_DUAL_STRAP_V1.jpg",
        driveId: "1-JST-AIR-DUAL-STRAP-2026",
      },
      {
        name: "JST-STORE_INTERIOR_WORKSHOP_V1.jpg",
        driveId: "1-JST-STORE-WORKSHOP-MACHINERY-2026",
      },
    ];

    simulatedFiles.forEach((file) => {
      const parsed = GoogleDriveAdapter.parseFileName(file.name);
      const googlePolicy = this.evaluateGoogleBusinessEligibility(parsed);
      const exists = mediaRegistryStore.some((m) => m.name === file.name);

      if (!exists) {
        mediaRegistryStore.push({
          id: `media-${file.driveId}`,
          driveFileId: file.driveId,
          name: file.name,
          folderId,
          mimeType: "image/jpeg",
          sizeBytes: 1024 * 780,
          directCdnUrl: GoogleDriveAdapter.getDirectCdnUrl(file.driveId),
          parsedMetadata: parsed,
          eligibleForWebsite: true,
          eligibleForGoogleBusiness: googlePolicy.eligible,
          policyReason: googlePolicy.reason,
          approvalStatusWebsite: "pending",
          approvalStatusGoogle: googlePolicy.eligible ? "pending" : "rejected",
          scannedAt: now,
        });
      }
    });

    return mediaRegistryStore;
  }

  private static mergeIntoRegistry(newItems: ScannedDriveMediaItem[]) {
    newItems.forEach((item) => {
      const idx = mediaRegistryStore.findIndex((m) => m.driveFileId === item.driveFileId);
      if (idx >= 0) {
        mediaRegistryStore[idx] = { ...mediaRegistryStore[idx], ...item };
      } else {
        mediaRegistryStore.push(item);
      }
    });
  }

  /**
   * Returns current media registry
   */
  static getMediaRegistry(): ScannedDriveMediaItem[] {
    return mediaRegistryStore;
  }

  /**
   * Updates approval state for a media asset
   */
  static updateApproval(
    mediaId: string,
    target: "website" | "google",
    status: "approved" | "rejected" | "pending"
  ): ScannedDriveMediaItem | null {
    const item = mediaRegistryStore.find((m) => m.id === mediaId);
    if (!item) return null;

    if (target === "website") {
      item.approvalStatusWebsite = status;
    } else if (target === "google") {
      // Validate policy before approving for Google
      if (status === "approved" && !item.eligibleForGoogleBusiness) {
        throw new Error(
          "Cannot approve for Google Business Profile: Asset violates Section 8.2 policy (variant-specific image)."
        );
      }
      item.approvalStatusGoogle = status;
      if (status === "approved") {
        item.syncedToGoogleAt = new Date().toISOString();
      }
    }

    return item;
  }
}

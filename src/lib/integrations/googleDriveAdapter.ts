/**
 * Jain Sarafa Thella — Google Drive Media Integration Adapter
 * Implements Google Drive file parsing, CDN link generation,
 * file naming convention parsing, and manifest generation.
 */

export interface ParsedFileName {
  productSku: string;
  sizeLabel?: string;
  viewRole: "main" | "gallery" | "front" | "back" | "side" | "dimensions" | "video";
  version: string;
  extension: string;
  isValidConvention: boolean;
}

export interface DriveMediaFile {
  fileId: string;
  name: string;
  mimeType: string;
  sizeBytes?: number;
  folderPath: string;
  directCdnUrl: string;
  parsedMetadata: ParsedFileName;
}

export class GoogleDriveAdapter {
  /**
   * Convert any Google Drive URL or File ID into Google's high-speed direct CDN URL
   * Format: https://lh3.googleusercontent.com/d/{FILE_ID}
   */
  static getDirectCdnUrl(urlOrId: string): string {
    if (!urlOrId) return "";

    // If it's already a direct CDN link or relative path, return as is
    if (urlOrId.startsWith("https://lh3.googleusercontent.com/d/") || urlOrId.startsWith("/")) {
      return urlOrId;
    }

    // Extract File ID from standard Drive share URLs:
    // https://drive.google.com/file/d/1a2b3c4d.../view
    // https://drive.google.com/open?id=1a2b3c4d...
    const fileIdMatch =
      urlOrId.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
      urlOrId.match(/id=([a-zA-Z0-9_-]+)/) ||
      urlOrId.match(/^([a-zA-Z0-9_-]{25,})$/);

    if (fileIdMatch && fileIdMatch[1]) {
      return `https://lh3.googleusercontent.com/d/${fileIdMatch[1]}`;
    }

    return urlOrId;
  }

  /**
   * Parse file name conforming to HLD Section 4.2 convention:
   * Format: PRODUCTSKU_SIZE_VIEW_VERSION.ext
   * Examples:
   *   JST-SB-001_SMALL_FRONT_V1.jpg
   *   JST-VLV-RED_MEDIUM_FRONT_V1.jpg
   *   JST-BLN-35KG_MAIN_V1.jpg
   */
  static parseFileName(fileName: string): ParsedFileName {
    const extMatch = fileName.match(/\.([a-zA-Z0-9]+)$/);
    const extension = extMatch ? extMatch[1].toLowerCase() : "";
    const baseName = fileName.replace(/\.[a-zA-Z0-9]+$/, "");

    const parts = baseName.split("_");

    if (parts.length >= 3) {
      const productSku = parts[0];
      const version = parts[parts.length - 1];

      if (parts.length === 3) {
        // e.g. JST-SB-001_MAIN_V1
        const viewOrRole = parts[1].toLowerCase();
        return {
          productSku,
          viewRole: (viewOrRole as any) || "gallery",
          version,
          extension,
          isValidConvention: true,
        };
      }

      if (parts.length >= 4) {
        // e.g. JST-SB-001_SMALL_FRONT_V1
        const sizeLabel = parts[1];
        const viewRole = parts[2].toLowerCase();
        return {
          productSku,
          sizeLabel,
          viewRole: (viewRole as any) || "gallery",
          version,
          extension,
          isValidConvention: true,
        };
      }
    }

    return {
      productSku: baseName,
      viewRole: "gallery",
      version: "V1",
      extension,
      isValidConvention: false,
    };
  }

  /**
   * Generate machine-readable Product Manifest JSON conforming to HLD Section 4.3
   */
  static generateProductManifest(productSku: string, productName: string, variants: any[]): object {
    return {
      product_sku: productSku,
      product_name: productName,
      generated_at: new Date().toISOString(),
      media: {
        main_image: `${productSku}_MAIN_V1.jpg`,
        gallery: [
          `${productSku}_GALLERY_1_V1.jpg`,
          `${productSku}_GALLERY_2_V1.jpg`,
        ],
      },
      variants: variants.map((v) => ({
        sku: v.variantSku,
        size: v.size?.en || v.size,
        dimensions: v.dimensionsDetail || v.dimensionsCm,
        media: {
          front: `${v.variantSku}_FRONT_V1.jpg`,
          back: `${v.variantSku}_BACK_V1.jpg`,
        },
      })),
    };
  }
}

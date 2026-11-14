/**
 * Jain Sarafa Thella — Central Catalogue Store & Mutation Engine
 * Manages parent products and size-specific variants with SKU uniqueness validation,
 * dimension mapping, and stock updates.
 */

import { Product, ProductVariant } from "@/types";
import { initialProducts } from "./mockData";

// In-memory catalog state initialized with verified Sarafa Chowk catalogue
let catalogStore: Product[] = [...initialProducts];

export class CatalogueStore {
  /**
   * Retrieve all catalog products
   */
  static getProducts(): Product[] {
    return catalogStore;
  }

  /**
   * Find product by ID or base SKU
   */
  static findProduct(idOrSku: string): Product | undefined {
    const key = idOrSku.trim().toUpperCase();
    return catalogStore.find(
      (p) => p.id === idOrSku || p.baseSku.toUpperCase() === key || p.slug === idOrSku.toLowerCase()
    );
  }

  /**
   * Validate Base SKU or Variant SKU uniqueness and formatting
   */
  static validateSku(sku: string, isVariant: boolean = false): { valid: boolean; error?: string } {
    if (!sku || sku.trim().length < 3) {
      return { valid: false, error: "SKU must be at least 3 characters long" };
    }

    const cleanSku = sku.trim().toUpperCase();
    if (!/^[A-Z0-9-]+$/.test(cleanSku)) {
      return { valid: false, error: "SKU may only contain uppercase alphanumeric characters and hyphens (-)" };
    }

    // Check uniqueness across base SKUs
    if (!isVariant) {
      const exists = catalogStore.some((p) => p.baseSku.toUpperCase() === cleanSku);
      if (exists) {
        return { valid: false, error: `Base SKU '${cleanSku}' already exists in catalogue` };
      }
    } else {
      // Check uniqueness across all variants
      for (const prod of catalogStore) {
        for (const v of prod.variants) {
          if (v.variantSku.toUpperCase() === cleanSku) {
            return { valid: false, error: `Variant SKU '${cleanSku}' already exists in catalogue` };
          }
        }
      }
    }

    return { valid: true };
  }

  /**
   * Create a new parent product
   */
  static createProduct(data: {
    baseSku: string;
    titleHi: string;
    titleEn: string;
    descriptionHi: string;
    descriptionEn: string;
    categorySlug: string;
    materialHi: string;
    materialEn: string;
    handleTypeHi?: string;
    handleTypeEn?: string;
    hsnCode?: string;
    gstRatePercent?: number;
    initialVariant?: {
      sizeLabelHi: string;
      sizeLabelEn: string;
      length: number;
      width: number;
      height?: number;
      unit?: "inch" | "cm";
      loadCapacity?: string;
      retailPrice: number;
      wholesalePrice: number;
      moqWholesale?: number;
      physicalStock?: number;
    };
  }): Product {
    const skuValidation = this.validateSku(data.baseSku, false);
    if (!skuValidation.valid) {
      throw new Error(skuValidation.error);
    }

    const cleanBaseSku = data.baseSku.trim().toUpperCase();
    const id = `prod-${Date.now().toString(36)}`;
    const slug = data.titleEn
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const newProduct: Product = {
      id,
      baseSku: cleanBaseSku,
      slug: slug || cleanBaseSku.toLowerCase(),
      title: { hi: data.titleHi, en: data.titleEn },
      description: { hi: data.descriptionHi, en: data.descriptionEn },
      categorySlug: data.categorySlug || "transit_bags",
      productType: "ready_stock",
      material: { hi: data.materialHi || "कैनवास / मखमल", en: data.materialEn || "Heavy-duty fabric" },
      handleType: { hi: data.handleTypeHi || "नायलॉन बद्धी", en: data.handleTypeEn || "Reinforced handles" },
      countryOfOrigin: "India",
      hsnCode: data.hsnCode || "4202",
      gstRatePercent: data.gstRatePercent || 18,
      featured: false,
      mainImage: "/images/products/velvet-red-pouch.webp",
      variants: [],
    };

    // If initial variant provided, attach it
    if (data.initialVariant) {
      const v = data.initialVariant;
      const variantSku = `${cleanBaseSku}-STD`;
      newProduct.variants.push({
        id: `var-${Date.now().toString(36)}-1`,
        productId: id,
        variantSku,
        color: { hi: "मानक", en: "Standard" },
        size: { hi: v.sizeLabelHi || "मानक साइज़", en: v.sizeLabelEn || "Standard Size" },
        dimensionsCm: {
          height: v.height || 10,
          width: v.width || 12,
        },
        dimensionsDetail: {
          length: v.length || 10,
          width: v.width || 12,
          height: v.height || 4,
          unit: v.unit || "inch",
        },
        loadCapacity: v.loadCapacity || "25 KG",
        retailPrice: v.retailPrice || 100,
        wholesaleTiers: [
          { minQty: v.moqWholesale || 50, pricePerUnit: v.wholesalePrice || Math.round(v.retailPrice * 0.75) },
        ],
        moqRetail: 1,
        moqWholesale: v.moqWholesale || 50,
        physicalStock: v.physicalStock || 100,
        reservedStock: 0,
        images: ["/images/products/velvet-red-pouch.webp"],
      });
    }

    catalogStore.unshift(newProduct);
    return newProduct;
  }

  /**
   * Add a new size/variant to an existing product
   */
  static addVariant(
    productIdOrSku: string,
    data: {
      variantSku: string;
      sizeLabelHi: string;
      sizeLabelEn: string;
      length: number;
      width: number;
      height?: number;
      unit?: "inch" | "cm";
      loadCapacity?: string;
      retailPrice: number;
      wholesalePrice: number;
      moqWholesale?: number;
      physicalStock?: number;
    }
  ): ProductVariant {
    const product = this.findProduct(productIdOrSku);
    if (!product) {
      throw new Error(`Parent product not found: '${productIdOrSku}'`);
    }

    const skuValidation = this.validateSku(data.variantSku, true);
    if (!skuValidation.valid) {
      throw new Error(skuValidation.error);
    }

    const cleanVariantSku = data.variantSku.trim().toUpperCase();
    const newVariant: ProductVariant = {
      id: `var-${Date.now().toString(36)}-${product.variants.length + 1}`,
      productId: product.id,
      variantSku: cleanVariantSku,
      color: { hi: "मानक", en: "Standard" },
      size: { hi: data.sizeLabelHi, en: data.sizeLabelEn },
      dimensionsCm: {
        height: data.height || 10,
        width: data.width || 12,
      },
      dimensionsDetail: {
        length: data.length,
        width: data.width,
        height: data.height || 4,
        unit: data.unit || "inch",
      },
      loadCapacity: data.loadCapacity || "25 KG",
      retailPrice: data.retailPrice,
      wholesaleTiers: [
        {
          minQty: data.moqWholesale || 50,
          pricePerUnit: data.wholesalePrice || Math.round(data.retailPrice * 0.75),
        },
      ],
      moqRetail: 1,
      moqWholesale: data.moqWholesale || 50,
      physicalStock: data.physicalStock || 50,
      reservedStock: 0,
      images: product.mainImage ? [product.mainImage] : ["/images/products/velvet-red-pouch.webp"],
    };

    product.variants.push(newVariant);
    return newVariant;
  }

  /**
   * Update physical stock for a variant
   */
  static updateStock(variantSku: string, newStock: number): ProductVariant | null {
    const key = variantSku.trim().toUpperCase();
    for (const prod of catalogStore) {
      const v = prod.variants.find((item) => item.variantSku.toUpperCase() === key);
      if (v) {
        v.physicalStock = Math.max(0, newStock);
        return v;
      }
    }
    return null;
  }
}

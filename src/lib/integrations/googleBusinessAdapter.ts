/**
 * Jain Sarafa Thella — Google Business Profile & Google Maps Adapter
 * Enforces Section 8.2 publishing policy separation:
 * Only business photos and selected main products sync to Google Business Profile,
 * while size-specific variants remain website-only.
 */

import { BusinessLocation, BusinessHours } from "@/types";

export interface GoogleBusinessPhotoPayload {
  mediaRole: "LOGO" | "COVER" | "EXTERIOR" | "INTERIOR" | "PRODUCT";
  photoUrl: string;
  description?: string;
  isEligibleForGoogle: boolean;
}

export class GoogleBusinessAdapter {
  /**
   * Filter and enforce Google Business Profile photo publishing policy
   * Section 8.2: Do not publish every product variant image to Google Business Profile.
   */
  static evaluatePhotoEligibility(mediaRole: string): GoogleBusinessPhotoPayload["mediaRole"] | null {
    switch (mediaRole) {
      case "brand_logo":
        return "LOGO";
      case "factory":
        return "EXTERIOR";
      case "main":
        return "PRODUCT";
      case "variant_front":
      case "variant_back":
      case "variant_side":
      case "dimensions":
        // Size-specific images are strictly filtered out per policy
        return null;
      default:
        return null;
    }
  }

  /**
   * Format Location details for Google Business Profile API (Google My Business API v4/v1)
   */
  static formatLocationPayload(location: BusinessLocation, hours: BusinessHours[]) {
    return {
      languageCode: "hi",
      storeCode: "JST-AGRA-HQ",
      title: "Jain Sarafa Thella — Agra",
      primaryPhone: location.phone,
      websiteUri: "https://jainsarafathella.com",
      address: {
        addressLines: [location.addressLine1, location.addressLine2 || ""].filter(Boolean),
        locality: location.city,
        administrativeArea: location.state,
        postalCode: location.pincode,
        regionCode: "IN",
      },
      latlng: location.coordinates
        ? {
            latitude: location.coordinates.latitude,
            longitude: location.coordinates.longitude,
          }
        : undefined,
      regularHours: {
        periods: hours
          .filter((h) => !h.isClosed)
          .map((h) => ({
            openDay: h.dayOfWeek.toUpperCase(),
            openTime: h.openTime + ":00",
            closeDay: h.dayOfWeek.toUpperCase(),
            closeTime: h.closeTime + ":00",
          })),
      },
      categories: {
        primaryCategory: {
          displayName: "Packaging Supply Store",
        },
        additionalCategories: [
          { displayName: "Manufacturer" },
          { displayName: "Wholesaler" },
        ],
      },
    };
  }
}

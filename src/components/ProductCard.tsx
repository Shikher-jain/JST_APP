"use client";

import React, { useState } from "react";
import { Product, Locale } from "@/types";
import { formatCurrencyINR, getDictionary } from "@/lib/i18n";
import { ShoppingBag, Eye, CheckCircle2, Clock } from "lucide-react";

interface ProductCardProps {
  product: Product;
  currentLocale: Locale;
  onAddToCart?: (variantId: string, quantity: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currentLocale,
  onAddToCart,
}) => {
  const dict = getDictionary(currentLocale);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const selectedVariant = product.variants[selectedVariantIndex] || product.variants[0];

  const lowestWholesalePrice = selectedVariant?.wholesaleTiers?.length
    ? Math.min(...selectedVariant.wholesaleTiers.map((t) => t.pricePerUnit))
    : null;

  return (
    <div className="sarafa-card rounded-xl overflow-hidden flex flex-col h-full group">
      {/* Product Image Area */}
      <div className="relative aspect-square w-full bg-gradient-to-br from-amber-50 to-stone-100 overflow-hidden flex items-center justify-center p-6 border-b border-sarafa-gold/20">
        {/* Placeholder SVG Bag Visual */}
        <div className="w-32 h-36 rounded-2xl bg-sarafa-maroon/90 shadow-lg border-2 border-sarafa-gold/50 flex flex-col items-center justify-center text-white relative group-hover:scale-105 transition-transform duration-300">
          <div className="w-8 h-2 bg-sarafa-gold rounded-full mb-3" />
          <span className="text-xs font-bold font-hindi text-sarafa-gold-light">
            जैन सराफा
          </span>
          <span className="text-[10px] opacity-80 uppercase tracking-widest mt-1">
            AGRA
          </span>
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-sarafa-gold animate-pulse" />
        </div>

        {/* Status Tag */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.productType === "ready_stock" ? (
            <span className="bg-emerald-700/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
              <CheckCircle2 className="w-3 h-3 text-emerald-300" />
              {dict.products.readyStock}
            </span>
          ) : (
            <span className="bg-amber-700/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
              <Clock className="w-3 h-3 text-amber-300" />
              {dict.products.madeToOrder}
            </span>
          )}
        </div>

        {/* SKU Badge */}
        <div className="absolute bottom-2 right-2 text-[10px] font-mono bg-white/80 backdrop-blur-sm text-slate-600 px-2 py-0.5 rounded border border-slate-200">
          {selectedVariant.variantSku}
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Material & Dimensions */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="font-medium text-sarafa-maroon">
              {product.material[currentLocale]}
            </span>
            <span>
              {selectedVariant.size[currentLocale]}
            </span>
          </div>

          {/* Product Title */}
          <h3 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2 mb-2 group-hover:text-sarafa-maroon transition-colors">
            {product.title[currentLocale]}
          </h3>

          {/* Pricing Row */}
          <div className="bg-amber-50/60 p-2.5 rounded-lg border border-amber-200/50 mb-3">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-500 font-medium">खुदरा भाव: </span>
                <span className="text-base font-bold text-sarafa-maroon">
                  {formatCurrencyINR(selectedVariant.retailPrice)}
                </span>
                <span className="text-[10px] text-slate-500"> {dict.products.perPiece}</span>
              </div>
            </div>

            {lowestWholesalePrice && (
              <div className="mt-1 pt-1 border-t border-amber-200/60 flex items-center justify-between text-[11px]">
                <span className="text-amber-800 font-medium">
                  थोक दर ({selectedVariant.moqWholesale}+ पीस):
                </span>
                <span className="font-bold text-emerald-700">
                  {formatCurrencyINR(lowestWholesalePrice)}/पीस
                </span>
              </div>
            )}
          </div>

          {/* Variant Selector (if multiple) */}
          {product.variants.length > 1 && (
            <div className="mb-3">
              <div className="text-[11px] text-slate-500 mb-1">आकार / वेरियंट चुनें:</div>
              <div className="flex flex-wrap gap-1.5">
                {product.variants.map((v, idx) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVariantIndex(idx)}
                    className={`text-[11px] px-2 py-0.5 rounded border transition-all ${
                      idx === selectedVariantIndex
                        ? "bg-sarafa-maroon text-white border-sarafa-maroon font-semibold"
                        : "bg-white text-slate-700 border-slate-300 hover:border-sarafa-maroon"
                    }`}
                  >
                    {v.size[currentLocale]}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="pt-2 flex items-center gap-2">
          <button
            type="button"
            onClick={() => onAddToCart && onAddToCart(selectedVariant.id, 1)}
            className="flex-1 bg-sarafa-maroon hover:bg-sarafa-maroon-dark text-white text-xs font-semibold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-sarafa-gold" />
            <span>{dict.products.addToCart}</span>
          </button>

          <a
            href={`https://wa.me/919876543210?text=नमस्ते,%20मुझे%20उत्पाद%20${encodeURIComponent(
              product.title.hi
            )}%20(${selectedVariant.variantSku})%20के%20थोक%20भाव%20की%20जानकारी%20चाहिए।`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 border border-sarafa-gold rounded-lg hover:bg-amber-50 text-sarafa-maroon transition-colors"
            title="थोक पूछताछ"
          >
            <Eye className="w-4 h-4 text-sarafa-gold" />
          </a>
        </div>
      </div>
    </div>
  );
};

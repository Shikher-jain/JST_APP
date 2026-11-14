"use client";

import React, { useState } from "react";
import { useParams, notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { WholesaleModal } from "@/components/wholesale/WholesaleModal";
import { CustomQuoteModal } from "@/components/custom/CustomQuoteModal";
import { CheckoutModal } from "@/components/checkout/CheckoutModal";
import { CartProvider, useCart } from "@/context/CartContext";
import { initialProducts } from "@/lib/mockData";
import { formatCurrencyINR, getDictionary } from "@/lib/i18n";
import { Locale } from "@/types";
import { 
  ShoppingBag, 
  Eye, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  Building2, 
  ArrowLeft,
  ChevronRight,
  MessageCircle
} from "lucide-react";
import Link from "next/link";

function ProductDetailPageContent() {
  const params = useParams();
  const slug = params?.slug as string;
  const [currentLocale, setCurrentLocale] = useState<Locale>("hi");
  const [isWholesaleModalOpen, setIsWholesaleModalOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [imageFailed, setImageFailed] = useState(false);

  const { itemCount, addToCart, isWholesaleCustomer, setIsCartOpen } = useCart();
  const dict = getDictionary(currentLocale);

  const product = initialProducts.find(
    (p) => p.slug === slug || p.baseSku.toLowerCase() === slug?.toLowerCase() || p.id === slug
  );

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-stone-50 items-center justify-center p-4">
        <h2 className="text-xl font-bold text-slate-800 mb-2">उत्पाद नहीं मिला (Product Not Found)</h2>
        <p className="text-sm text-slate-500 mb-4">यह उत्पाद उपलब्ध नहीं है या यूआरएल अमान्य है।</p>
        <Link href="/products" className="bg-sarafa-maroon text-white text-xs font-semibold px-4 py-2 rounded-lg">
          सभी उत्पाद देखें
        </Link>
      </div>
    );
  }

  const selectedVariant = product.variants[selectedVariantIndex] || product.variants[0];
  const lowestWholesalePrice = selectedVariant?.wholesaleTiers?.length
    ? Math.min(...selectedVariant.wholesaleTiers.map((t) => t.pricePerUnit))
    : null;

  const currentImage = selectedVariant.images?.[0] || product.mainImage;

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 font-sans">
      <Navbar
        currentLocale={currentLocale}
        onLocaleChange={setCurrentLocale}
        cartCount={itemCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWholesale={() => setIsWholesaleModalOpen(true)}
        onOpenCustom={() => setIsCustomModalOpen(true)}
        isWholesaleCustomer={isWholesaleCustomer}
      />

      {/* Breadcrumb Bar */}
      <div className="bg-white border-b border-stone-200 py-3 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-sarafa-maroon">होम</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/products" className="hover:text-sarafa-maroon">उत्पाद</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-800 font-medium truncate">{product.title[currentLocale]}</span>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-10 flex-1 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm">
          {/* Left Column: Image Showcase */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-square w-full rounded-2xl bg-gradient-to-br from-amber-50 to-stone-100 border border-sarafa-gold/30 flex items-center justify-center overflow-hidden p-6">
              {currentImage && !imageFailed ? (
                <img
                  src={currentImage}
                  alt={product.title[currentLocale]}
                  onError={() => setImageFailed(true)}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-48 h-56 rounded-3xl bg-sarafa-maroon shadow-xl border-4 border-sarafa-gold flex flex-col items-center justify-center text-white relative">
                  <div className="w-12 h-3 bg-sarafa-gold rounded-full mb-4" />
                  <span className="text-sm font-bold font-hindi text-sarafa-gold-light">
                    जैन सराफा
                  </span>
                  <span className="text-xs opacity-80 uppercase tracking-widest mt-1">
                    AGRA
                  </span>
                </div>
              )}

              {/* Status and Capacity Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className="bg-emerald-700 text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                  {product.productType === "ready_stock" ? "तैयार स्टॉक (Ready)" : "ऑर्डर पर निर्माण"}
                </span>
                {selectedVariant.loadCapacity && (
                  <span className="bg-sarafa-maroon text-sarafa-gold-light text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
                    <ShieldCheck className="w-3.5 h-3.5 text-sarafa-gold" />
                    {selectedVariant.loadCapacity}
                  </span>
                )}
              </div>
            </div>

            {/* Gallery Thumbnails */}
            {product.galleryImages && product.galleryImages.length > 0 && (
              <div className="flex gap-2">
                {product.galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="w-16 h-16 rounded-lg border-2 border-stone-200 overflow-hidden bg-stone-50 hover:border-sarafa-gold"
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Pricing, Specs & Variant Selector */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="font-semibold text-sarafa-maroon">{product.material[currentLocale]}</span>
                <span className="font-mono bg-stone-100 px-2 py-0.5 rounded text-slate-600">
                  SKU: {selectedVariant.variantSku}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold font-hindi text-slate-900 mb-3 leading-snug">
                {product.title[currentLocale]}
              </h1>

              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                {product.description[currentLocale]}
              </p>

              {/* Pricing Box */}
              <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200/80 mb-6 space-y-3">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-slate-500 font-medium">खुदरा भाव (Retail Price): </span>
                    <span className="text-2xl font-bold text-sarafa-maroon ml-2">
                      {formatCurrencyINR(selectedVariant.retailPrice)}
                    </span>
                    <span className="text-xs text-slate-500"> / पीस</span>
                  </div>
                  <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded font-semibold border border-emerald-200">
                    जीएसटी: {product.gstRatePercent}%
                  </span>
                </div>

                {/* Wholesale Volume Tiers */}
                {selectedVariant.wholesaleTiers && selectedVariant.wholesaleTiers.length > 0 && (
                  <div className="pt-3 border-t border-amber-200/60">
                    <div className="text-xs font-semibold text-amber-900 mb-2">
                      थोक खरीद स्लैब (Wholesale Volume Tiers):
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {selectedVariant.wholesaleTiers.map((tier, tIdx) => (
                        <div key={tIdx} className="bg-white p-2 rounded-lg border border-amber-200 text-center">
                          <div className="text-[11px] text-slate-500">
                            {tier.minQty}{tier.maxQty ? ` - ${tier.maxQty}` : "+"} पीस
                          </div>
                          <div className="text-sm font-bold text-emerald-700">
                            {formatCurrencyINR(tier.pricePerUnit)}/पीस
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Size / Variant Selector */}
              {product.variants.length > 1 && (
                <div className="mb-6">
                  <div className="text-xs font-semibold text-slate-700 mb-2">
                    उपलब्ध आकार / नाप (Select Size):
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v, idx) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => {
                          setSelectedVariantIndex(idx);
                          setImageFailed(false);
                        }}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                          idx === selectedVariantIndex
                            ? "bg-sarafa-maroon text-white border-sarafa-maroon font-bold shadow-xs"
                            : "bg-white text-slate-700 border-slate-300 hover:border-sarafa-gold"
                        }`}
                      >
                        {v.size[currentLocale]}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => addToCart(selectedVariant.id, 1)}
                className="flex-1 bg-sarafa-maroon hover:bg-sarafa-maroon-dark text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <ShoppingBag className="w-4 h-4 text-sarafa-gold" />
                <span>कार्ट में जोड़ें ({dict.products.addToCart})</span>
              </button>

              <a
                href={`https://wa.me/919876543210?text=नमस्ते,%20मुझे%20उत्पाद%20${encodeURIComponent(
                  product.title.hi
                )}%20(${selectedVariant.variantSku})%20के%20थोक%20ऑर्डर%20हेतु%20कोटेशन%20चाहिए।`}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-sarafa-gold text-sarafa-maroon hover:bg-amber-50 font-semibold py-3 px-5 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>थोक पूछताछ (WhatsApp)</span>
              </a>
            </div>
          </div>
        </div>

        {/* Deep Domain Explanation Tabs (MLJ Reference Benchmark) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Applications & Problem Solving */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 font-hindi flex items-center gap-2 border-b border-stone-100 pb-3">
              <Sparkles className="w-4 h-4 text-sarafa-gold" />
              <span>उपयोग एवं समाधान (Applications & Problems Solved)</span>
            </h3>

            {product.applications && (
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">मुख्य उपयोग:</div>
                <ul className="space-y-2">
                  {product.applications.map((app, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{app[currentLocale]}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product.problemsSolved && (
              <div className="pt-2">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">यह क्या समस्या हल करता है:</div>
                <ul className="space-y-2">
                  {product.problemsSolved.map((prob, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                      <ShieldCheck className="w-4 h-4 text-sarafa-gold shrink-0 mt-0.5" />
                      <span>{prob[currentLocale]}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Manufacturing & Customization Details */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 font-hindi flex items-center gap-2 border-b border-stone-100 pb-3">
              <Building2 className="w-4 h-4 text-sarafa-maroon" />
              <span>विनिर्माण एवं कस्टमाइजेशन (Manufacturing & Specs)</span>
            </h3>

            {product.manufacturingProcess && (
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">निर्माण विधि:</div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {product.manufacturingProcess[currentLocale]}
                </p>
              </div>
            )}

            {product.customizationOptions && (
              <div className="pt-2">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">उपलब्ध कस्टमाइजेशन विकल्प:</div>
                <div className="flex flex-wrap gap-2">
                  {product.customizationOptions.map((opt, idx) => (
                    <span key={idx} className="bg-amber-50 text-sarafa-maroon text-xs px-2.5 py-1 rounded-md border border-amber-200 font-medium">
                      {opt[currentLocale]}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {product.targetUsers && (
              <div className="pt-2">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">लक्षित उपयोगकर्ता:</div>
                <p className="text-xs text-slate-600">
                  {product.targetUsers.map((u) => u[currentLocale]).join(" • ")}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer currentLocale={currentLocale} />
      <CartDrawer currentLocale={currentLocale} />
      <WholesaleModal isOpen={isWholesaleModalOpen} onClose={() => setIsWholesaleModalOpen(false)} currentLocale={currentLocale} />
      <CustomQuoteModal isOpen={isCustomModalOpen} onClose={() => setIsCustomModalOpen(false)} currentLocale={currentLocale} />
      <CheckoutModal currentLocale={currentLocale} />
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <CartProvider>
      <ProductDetailPageContent />
    </CartProvider>
  );
}

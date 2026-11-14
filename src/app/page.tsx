"use client";

import React, { useState } from "react";
import { CartProvider, useCart } from "@/context/CartContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CheckoutModal } from "@/components/checkout/CheckoutModal";
import { WholesaleModal } from "@/components/wholesale/WholesaleModal";
import { CustomQuoteModal } from "@/components/custom/CustomQuoteModal";
import { initialProducts } from "@/lib/mockData";
import { Locale } from "@/types";
import { getDictionary } from "@/lib/i18n";
import { 
  Sparkles, 
  Building2, 
  ShoppingBag, 
  Paintbrush, 
  Truck, 
  ShieldCheck, 
  CheckCircle, 
  ArrowRight,
  MessageCircle,
  Clock,
  Layers,
  RefreshCw,
  Calculator,
  ChevronRight
} from "lucide-react";

function HomePageContent() {
  const [currentLocale, setCurrentLocale] = useState<Locale>("hi");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activePersona, setActivePersona] = useState<"retail" | "wholesale" | "custom">("retail");
  const [cartToast, setCartToast] = useState<string | null>(null);

  // Modals
  const [isWholesaleModalOpen, setIsWholesaleModalOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  const {
    itemCount,
    addToCart,
    isWholesaleCustomer,
    setIsCartOpen,
  } = useCart();

  const dict = getDictionary(currentLocale);

  const handleAddToCart = (variantId: string, quantity: number) => {
    addToCart(variantId, quantity);
    setCartToast(
      currentLocale === "hi"
        ? "उत्पाद सफलतापूर्वक टोकरी में जोड़ा गया!"
        : "Product added to cart successfully!"
    );
    setTimeout(() => setCartToast(null), 3000);
  };

  const filteredProducts =
    activeCategory === "all"
      ? initialProducts
      : initialProducts.filter((p) => p.categorySlug === activeCategory);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Toast Notification */}
      {cartToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-sarafa-maroon text-white text-xs font-semibold px-4 py-3 rounded-lg shadow-xl border border-sarafa-gold flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-4 h-4 text-sarafa-gold" />
          <span>{cartToast}</span>
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="ml-2 text-sarafa-gold underline font-bold"
          >
            {currentLocale === "hi" ? "टोकरी देखें" : "View Cart"}
          </button>
        </div>
      )}

      {/* Navigation */}
      <Navbar
        currentLocale={currentLocale}
        onLocaleChange={setCurrentLocale}
        cartCount={itemCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWholesale={() => setIsWholesaleModalOpen(true)}
        onOpenCustom={() => setIsCustomModalOpen(true)}
        isWholesaleCustomer={isWholesaleCustomer}
      />

      <main className="flex-1">
        {/* ==================================================================== */}
        {/* HERO SECTION */}
        {/* ==================================================================== */}
        <section className="relative bg-sarafa-gradient text-white overflow-hidden py-16 sm:py-24 border-b-4 border-sarafa-gold/60">
          {/* Subtle Decorative Pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
            <div className="max-w-3xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sarafa-gold/20 border border-sarafa-gold/40 text-sarafa-gold-light text-xs font-semibold mb-6">
                <Sparkles className="w-3.5 h-3.5 text-sarafa-gold" />
                <span>{dict.hero.badge}</span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-5 font-hindi">
                {dict.hero.title}
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-lg text-sarafa-ivory/90 leading-relaxed mb-8">
                {dict.hero.subtitle}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3.5">
                <a
                  href="#catalog"
                  className="bg-gold-gradient hover:opacity-95 text-sarafa-maroon-dark font-bold text-sm px-6 py-3 rounded-lg shadow-md transition-all flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{dict.hero.ctaRetail}</span>
                </a>

                <button
                  type="button"
                  onClick={() => setIsWholesaleModalOpen(true)}
                  className="bg-white/10 hover:bg-white/20 border border-sarafa-gold/40 text-sarafa-ivory font-semibold text-sm px-5 py-3 rounded-lg transition-all flex items-center gap-2"
                >
                  <Building2 className="w-4 h-4 text-sarafa-gold" />
                  <span>{dict.hero.ctaWholesale}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsCustomModalOpen(true)}
                  className="bg-transparent hover:bg-white/5 border border-white/30 text-white text-sm px-5 py-3 rounded-lg transition-all flex items-center gap-2"
                >
                  <Paintbrush className="w-4 h-4 text-sarafa-gold" />
                  <span>{dict.hero.ctaCustom}</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* CUSTOMER PERSONA QUICK SELECTOR */}
        {/* ==================================================================== */}
        <section className="bg-white border-b border-stone-200 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="text-center mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-sarafa-maroon">
                {currentLocale === "hi" ? "अपनी आवश्यकता अनुसार चुनें" : "Select Your Purchase Need"}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Persona 1: Retail */}
              <button
                type="button"
                onClick={() => {
                  setActivePersona("retail");
                  const el = document.getElementById("catalog");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`p-4 rounded-xl border text-left transition-all ${
                  activePersona === "retail"
                    ? "border-sarafa-gold bg-amber-50/50 shadow-sm"
                    : "border-stone-200 hover:border-sarafa-gold/60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sarafa-maroon text-sarafa-gold flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h2 className="font-bold text-sm text-slate-900">
                      {currentLocale === "hi" ? "खुदरा खरीदार (Retail)" : "Retail Shopper"}
                    </h2>
                    <p className="text-xs text-slate-500">
                      {currentLocale === "hi" ? "1 पीस से ऑर्डर, पूरे भारत में डिलीवरी, COD उपलब्ध" : "Order from 1 pc, doorstep courier, COD available"}
                    </p>
                  </div>
                </div>
              </button>

              {/* Persona 2: Wholesale */}
              <button
                type="button"
                onClick={() => {
                  setActivePersona("wholesale");
                  setIsWholesaleModalOpen(true);
                }}
                className={`p-4 rounded-xl border text-left transition-all ${
                  activePersona === "wholesale"
                    ? "border-sarafa-gold bg-amber-50/50 shadow-sm"
                    : "border-stone-200 hover:border-sarafa-gold/60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sarafa-gold text-sarafa-maroon-dark flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h2 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                      <span>{currentLocale === "hi" ? "थोक व्यापारी (Wholesale B2B)" : "Wholesale Merchant"}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-sarafa-maroon" />
                    </h2>
                    <p className="text-xs text-slate-500">
                      {currentLocale === "hi" ? "50+ पीस पर थोक दरें, त्वरित पुनः ऑर्डर मैट्रिक्स" : "50+ pcs tiered rates, quick reorder matrix"}
                    </p>
                  </div>
                </div>
              </button>

              {/* Persona 3: Custom */}
              <button
                type="button"
                onClick={() => {
                  setActivePersona("custom");
                  setIsCustomModalOpen(true);
                }}
                className={`p-4 rounded-xl border text-left transition-all ${
                  activePersona === "custom"
                    ? "border-sarafa-gold bg-amber-50/50 shadow-sm"
                    : "border-stone-200 hover:border-sarafa-gold/60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sarafa-maroon-dark text-white flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h2 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                      <span>{currentLocale === "hi" ? "कस्टम ब्रांडिंग (Bespoke CRM)" : "Custom Printing"}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-sarafa-maroon" />
                    </h2>
                    <p className="text-xs text-slate-500">
                      {currentLocale === "hi" ? "लोगो की गोल्ड फॉयल/स्क्रीन प्रिंटिंग, लाइव कोटेशन इंजन" : "Gold foil/screen print with logo, live quote calculator"}
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* TRUST & HERITAGE HIGHLIGHTS */}
        {/* ==================================================================== */}
        <section className="py-12 bg-sarafa-cream border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-lg bg-amber-100 text-sarafa-maroon shrink-0">
                  <ShieldCheck className="w-5 h-5 text-sarafa-gold-dark" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{dict.features.pricing}</h3>
                  <p className="text-xs text-slate-600 mt-1">{dict.features.pricingDesc}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-lg bg-amber-100 text-sarafa-maroon shrink-0">
                  <Layers className="w-5 h-5 text-sarafa-gold-dark" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{dict.features.quality}</h3>
                  <p className="text-xs text-slate-600 mt-1">{dict.features.qualityDesc}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-lg bg-amber-100 text-sarafa-maroon shrink-0">
                  <Paintbrush className="w-5 h-5 text-sarafa-gold-dark" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{dict.features.custom}</h3>
                  <p className="text-xs text-slate-600 mt-1">{dict.features.customDesc}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-lg bg-amber-100 text-sarafa-maroon shrink-0">
                  <Truck className="w-5 h-5 text-sarafa-gold-dark" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{dict.features.delivery}</h3>
                  <p className="text-xs text-slate-600 mt-1">{dict.features.deliveryDesc}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* PRODUCT CATALOG SECTION */}
        {/* ==================================================================== */}
        <section id="catalog" className="py-16 max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sarafa-maroon">
                Ready Stock Catalog
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-hindi mt-1">
                {dict.products.featuredTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                {dict.products.featuredSubtitle}
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveCategory("all")}
                className={`text-xs px-3.5 py-1.5 rounded-lg font-medium transition-all ${
                  activeCategory === "all"
                    ? "bg-sarafa-maroon text-white shadow-sm"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-sarafa-gold"
                }`}
              >
                {dict.categories.all}
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory("velvet-pouches")}
                className={`text-xs px-3.5 py-1.5 rounded-lg font-medium transition-all ${
                  activeCategory === "velvet-pouches"
                    ? "bg-sarafa-maroon text-white shadow-sm"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-sarafa-gold"
                }`}
              >
                {dict.categories.velvet}
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory("cotton-thellas")}
                className={`text-xs px-3.5 py-1.5 rounded-lg font-medium transition-all ${
                  activeCategory === "cotton-thellas"
                    ? "bg-sarafa-maroon text-white shadow-sm"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-sarafa-gold"
                }`}
              >
                {dict.categories.cotton}
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory("suede-envelopes")}
                className={`text-xs px-3.5 py-1.5 rounded-lg font-medium transition-all ${
                  activeCategory === "suede-envelopes"
                    ? "bg-sarafa-maroon text-white shadow-sm"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-sarafa-gold"
                }`}
              >
                {dict.categories.suede}
              </button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                currentLocale={currentLocale}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </section>

        {/* ==================================================================== */}
        {/* WHOLESALE B2B CALLOUT BANNER */}
        {/* ==================================================================== */}
        <section id="wholesale" className="py-14 bg-sarafa-gradient text-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="bg-sarafa-maroon-dark/80 p-8 sm:p-12 rounded-2xl border-2 border-sarafa-gold/40 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl">
              <div className="max-w-2xl">
                <span className="text-xs font-bold uppercase tracking-wider text-sarafa-gold-light bg-white/10 px-3 py-1 rounded-full border border-sarafa-gold/30">
                  B2B Wholesale Portal & Quick Reorder
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold font-hindi text-white mt-3 mb-3">
                  {dict.wholesale.bannerTitle}
                </h2>
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed mb-6">
                  {dict.wholesale.bannerSubtitle}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-sarafa-gold-light font-medium">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-sarafa-gold" />
                    <span>50 पीस से 10,000+ पीस तक आपूर्ति</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-sarafa-gold" />
                    <span>GST B2B इनपुट टैक्स इनवॉइस</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-sarafa-gold" />
                    <span>त्वरित पुनः ऑर्डर (Quick Reorder Matrix)</span>
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <button
                  type="button"
                  onClick={() => setIsWholesaleModalOpen(true)}
                  className="bg-gold-gradient text-sarafa-maroon-dark font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg hover:opacity-95 transition-all text-center flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>त्वरित पुनः ऑर्डर शीट खोलें</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsWholesaleModalOpen(true)}
                  className="bg-white/10 hover:bg-white/20 border border-sarafa-gold/40 text-white font-semibold text-sm px-5 py-3.5 rounded-xl transition-all text-center flex items-center justify-center gap-2"
                >
                  <Building2 className="w-4 h-4 text-sarafa-gold" />
                  <span>GST B2B पंजीकरण</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* CUSTOM MANUFACTURING ENQUIRY SECTION */}
        {/* ==================================================================== */}
        <section id="custom" className="py-16 bg-stone-50 border-t border-stone-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-8">
            <div className="text-center mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-sarafa-maroon">
                Bespoke Manufacturing & Custom Printing CRM
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-hindi mt-1">
                {dict.custom.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2">
                {dict.custom.subtitle}
              </p>
            </div>

            {/* Custom Interactive Tool Launch Card */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border-2 border-sarafa-gold/40 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 rounded-full text-xs font-bold text-amber-900">
                  <Calculator className="w-3.5 h-3.5 text-sarafa-gold-dark" />
                  <span>लाइव कोटेशन व आर्टवर्क अपलोड इंजन (DEC-05 उम्मीदवार)</span>
                </div>
                <h3 className="font-bold text-xl text-slate-900 font-hindi">
                  आभूषण दुकान के नाम की गोल्ड फॉयल स्टैम्पिंग व बैग कस्टमाइजेशन
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-lg">
                  बैग के आयाम (ऊंचाई x चौड़ाई x गसेट), फैब्रिक GSM, गोल्डन जरी डोरी एवं लोगो अपलोड करें और तत्काल सटीक इकाई निर्माण दर व 50% अग्रिम जमा गणना प्राप्त करें।
                </p>
                <div className="flex flex-wrap gap-2 text-[11px] text-slate-500 font-medium">
                  <span>✓ न्यूनतम 250 पीस बैच</span>
                  <span>•</span>
                  <span>✓ एकमुश्त ₹800 ब्लॉक चार्ज</span>
                  <span>•</span>
                  <span>✓ 12–15 कार्यदिवस डिलीवरी</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsCustomModalOpen(true)}
                className="w-full md:w-auto bg-sarafa-maroon hover:bg-sarafa-maroon-dark text-white font-bold text-sm py-4 px-8 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 shrink-0 group"
              >
                <Paintbrush className="w-5 h-5 text-sarafa-gold" />
                <span>कोटेशन कैलकुलेटर खोलें</span>
                <ArrowRight className="w-4 h-4 text-sarafa-gold group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer currentLocale={currentLocale} />

      {/* Phase 3 Interactive Modals & Slide-overs */}
      <CartDrawer currentLocale={currentLocale} />
      <CheckoutModal currentLocale={currentLocale} />
      <WholesaleModal
        isOpen={isWholesaleModalOpen}
        onClose={() => setIsWholesaleModalOpen(false)}
        currentLocale={currentLocale}
      />
      <CustomQuoteModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        currentLocale={currentLocale}
      />
    </div>
  );
}

export default function HomePage() {
  return (
    <CartProvider>
      <HomePageContent />
    </CartProvider>
  );
}

"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { WholesaleModal } from "@/components/wholesale/WholesaleModal";
import { CustomQuoteModal } from "@/components/custom/CustomQuoteModal";
import { CheckoutModal } from "@/components/checkout/CheckoutModal";
import { CartProvider, useCart } from "@/context/CartContext";
import { jstBusinessProfile } from "@/lib/businessProfile";
import { Locale } from "@/types";
import { 
  Building2, 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  Printer,
  Scissors,
  Check,
  FileCheck,
  Package
} from "lucide-react";
import Link from "next/link";

function ManufacturingPageContent() {
  const [currentLocale, setCurrentLocale] = useState<Locale>("hi");
  const [isWholesaleModalOpen, setIsWholesaleModalOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  const { itemCount, setIsCartOpen, isWholesaleCustomer } = useCart();
  const profile = jstBusinessProfile;

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

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sarafa-maroon-dark via-sarafa-maroon to-sarafa-maroon text-white py-14 px-4 sm:px-8 border-b-2 border-sarafa-gold">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-sarafa-gold/20 text-sarafa-gold-light border border-sarafa-gold/40 px-3 py-1 rounded-full text-xs font-semibold mb-4">
            <Building2 className="w-3.5 h-3.5 text-sarafa-gold" />
            <span>इन-हाउस विनिर्माण केंद्र • आगरा (उ.प्र.)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-hindi text-white mb-4 leading-tight">
            विनिर्माण क्षमताएं एवं उत्पादन प्रक्रिया
          </h1>
          <p className="text-base sm:text-lg text-sarafa-gold-light max-w-3xl leading-relaxed">
            कच्चे माल के चयन से लेकर स्वचालित डाई कटिंग, गोल्डन हॉट फॉइल स्टैम्पिंग एवं इंटरलॉक सिलाई तक — प्रत्येक थैले की गुणवत्ता की गारंटी।
          </p>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-8 py-12 flex-1 space-y-12">
        {/* Manufacturing Divisions */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 font-hindi">
              {currentLocale === "hi" 
                ? `हमारे ${profile.manufacturingDivisions.length} विशेषज्ञ उत्पादन प्रभाग` 
                : `Our ${profile.manufacturingDivisions.length} Specialized Manufacturing Divisions`}
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              {currentLocale === "hi"
                ? "बुलियन सुरक्षा, थोक पायल पारगमन, मखमली पोटली एवं शोरूम बैग्स हेतु समर्पित उत्पादन लाइनें।"
                : "Dedicated manufacturing lines for bullion vault security, wholesale payal transit, velvet pouches, and luxury packaging."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profile.manufacturingDivisions.map((div) => (
              <div key={div.id} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-sarafa-maroon uppercase tracking-wider bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                      प्रभाग
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      MOQ: {div.minimumOrderQty} पीस
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 font-hindi mb-2">
                    {div.name[currentLocale]}
                  </h3>
                  <p className="text-xs font-semibold text-amber-800 mb-3">
                    {div.tagline[currentLocale]}
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed mb-4">
                    {div.description[currentLocale]}
                  </p>

                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 mb-4">
                    <div className="text-xs font-semibold text-slate-700 mb-2">प्रमुख विशेषताएं एवं क्षमताएं:</div>
                    <ul className="space-y-1.5">
                      {div.capabilities.map((cap, cIdx) => (
                        <li key={cIdx} className="text-xs text-slate-600 flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{cap[currentLocale]}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-slate-500">
                  <span>औसत उत्पादन समय: <strong>{div.typicalLeadTime}</strong></span>
                  <button
                    type="button"
                    onClick={() => setIsCustomModalOpen(true)}
                    className="text-sarafa-maroon hover:text-sarafa-maroon-dark font-semibold flex items-center gap-1"
                  >
                    <span>कोटेशन मांगें</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Materials Specification Table */}
        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 font-hindi mb-2">
            प्रयुक्त कपड़े एवं कच्चा माल विनिर्देश
          </h2>
          <p className="text-sm text-slate-600 mb-6">
            हम केवल प्रमाणित, उच्च घनत्व (High-Density) और पर्यावरण-अनुकूल कपड़ों का उपयोग करते हैं।
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {profile.materials.map((mat) => (
              <div key={mat.id} className="p-4 rounded-xl border border-amber-200/70 bg-amber-50/40 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm font-hindi mb-1">
                    {mat.name[currentLocale]}
                  </h3>
                  <div className="text-xs font-mono font-semibold text-sarafa-maroon mb-2">
                    {mat.availableGsmOrWeight}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    {mat.description[currentLocale]}
                  </p>
                </div>
                <div className="pt-2 border-t border-amber-200/60 text-[11px] text-slate-500 font-medium">
                  सहनशीलता: <span className="font-bold text-slate-700 capitalize">{mat.durability}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Custom Printing & Branding Workflow */}
        <section className="bg-gradient-to-br from-amber-50 to-orange-50/40 p-6 sm:p-8 rounded-2xl border border-amber-200 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 font-hindi mb-2">
                कस्टम ब्रांडिंग व लोगो प्रिंटिंग सेवाएं
              </h2>
              <p className="text-sm text-slate-700 max-w-2xl leading-relaxed">
                सोने-चांदी की चमक में हॉट फॉइल स्टैम्पिंग, सदाबहार स्क्रीन प्रिंटिंग और आपकी पसंद के अनुसार किसी भी नाप में थैले तैयार किए जाते हैं।
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {profile.customizationOptions.printMethods.map((m, idx) => (
                  <span key={idx} className="bg-white text-sarafa-maroon text-xs font-semibold px-3 py-1 rounded-full border border-sarafa-gold/50 shadow-xs">
                    {m[currentLocale]}
                  </span>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsCustomModalOpen(true)}
              className="bg-sarafa-maroon hover:bg-sarafa-maroon-dark text-white font-semibold text-sm py-3 px-6 rounded-xl shadow-md transition-colors shrink-0"
            >
              कस्टम ऑर्डर फॉर्म भरें
            </button>
          </div>
        </section>
      </main>

      <Footer currentLocale={currentLocale} />
      <CartDrawer currentLocale={currentLocale} />
      <WholesaleModal isOpen={isWholesaleModalOpen} onClose={() => setIsWholesaleModalOpen(false)} currentLocale={currentLocale} />
      <CustomQuoteModal isOpen={isCustomModalOpen} onClose={() => setIsCustomModalOpen(false)} currentLocale={currentLocale} />
      <CheckoutModal currentLocale={currentLocale} />
    </div>
  );
}

export default function ManufacturingPage() {
  return (
    <CartProvider>
      <ManufacturingPageContent />
    </CartProvider>
  );
}

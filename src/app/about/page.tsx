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
  MapPin, 
  Award, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  Clock,
  Phone,
  Mail,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

function AboutPageContent() {
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

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-sarafa-maroon-dark via-sarafa-maroon to-sarafa-maroon text-white py-14 px-4 sm:px-8 border-b-2 border-sarafa-gold">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-sarafa-gold/20 text-sarafa-gold-light border border-sarafa-gold/40 px-3 py-1 rounded-full text-xs font-semibold mb-4">
            <Award className="w-3.5 h-3.5 text-sarafa-gold" />
            <span>स्थापित {profile.foundedYear} • आगरा सराफा बाजार का गौरव</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-hindi text-white mb-4 leading-tight">
            {profile.legalName} — हमारे बारे में
          </h1>
          <p className="text-base sm:text-lg text-sarafa-gold-light max-w-3xl leading-relaxed">
            {profile.tagline[currentLocale]}
          </p>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-8 py-12 flex-1 space-y-12">
        {/* Core Narrative */}
        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sarafa-maroon mb-2">
            <Sparkles className="w-4 h-4 text-sarafa-gold" />
            <span>{currentLocale === "hi" ? "आगरा सर्राफा की विरासत एवं सत्यनिष्ठा" : "Agra Sarafa Heritage & Provenance"}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4 font-hindi border-b border-amber-100 pb-3">
            {currentLocale === "hi" ? "तीन दशकों की अटूट विश्वसनीयता एवं प्रामाणिक निर्माण" : "Over 35 Years of Manufacturing Trust in Agra's Jewellery Heartland"}
          </h2>
          <p className="text-slate-700 leading-relaxed text-base mb-6">
            {currentLocale === "hi"
              ? "सन 1988 में आगरा के ऐतिहासिक सर्राफा बाजार (चौक) में स्थापित 'जैन सराफा थैला' केवल एक थैला निर्माता नहीं, बल्कि उत्तर भारत के आभूषण व्यापार का एक अभिन्न सुरक्षा एवं पैकेजिंग स्तंभ है। आगरा, जो देश की प्रसिद्ध चांदी पायल (पाजेब) निर्माण की राजधानी है, वहां साधारण बैग काम नहीं करते। चांदी की भारी ईंटें, बारीक कड़ियों वाली पायल और करोड़ों के सोने के गहनों को ऐसे बैग्स की आवश्यकता होती है जो न तो रास्ते में वजन से फटें और न ही भीड़ में ब्लेड से काटे जा सकें। पिछले साढ़े तीन दशकों से हमारी इन-हाउस निर्माण इकाई आगरा में सर्राफा व्यापारियों, थोक निर्माताओं और प्रमुख आभूषण शोरूम्स को अटूट विश्वसनीयता प्रदान कर रही है।"
              : "Established in 1988 in the historic Sarafa Bazar (Chowk) of Agra, Jain Sarafa Thella (JST) is an integral operational partner to North India's jewellery and bullion trade. In Agra, the historic capital of India's silver anklet (payal) craftsmanship, ordinary luggage fails. Heavy smelted silver bars, delicate silver chains, and high-value gold bullion demand bags that will never burst at the seams under extreme tonnage or succumb to knife-slashing in congested bazaars. For over 35 years, our in-house Agra production facility has delivered uncompromising strength, anti-tarnish protection, and bespoke branding directly to jewellers across India."}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-stone-100">
            <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200/50">
              <div className="text-2xl font-bold text-sarafa-maroon font-hindi">1988 से</div>
              <div className="text-xs text-slate-700 font-semibold mt-1">
                {currentLocale === "hi" ? "आगरा सर्राफा बाजार (चौक) में अनवरत सेवा" : "Continuous Operations in Agra Sarafa Bazar"}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                {currentLocale === "hi" ? "35+ वर्षों का व्यापारिक अनुभव" : "35+ Years of Trade Trust"}
              </div>
            </div>
            <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200/50">
              <div className="text-2xl font-bold text-sarafa-maroon font-hindi">दोहरी विशेषज्ञता</div>
              <div className="text-xs text-slate-700 font-semibold mt-1">
                {currentLocale === "hi" ? "लक्जरी पैकेजिंग + हेवी बुलियन सुरक्षा" : "Luxury Packaging + Bullion Transit"}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                {currentLocale === "hi" ? "मखमली पोटली से 50 KG थैलों तक" : "Velvet Potlis to 50 KG Thellas"}
              </div>
            </div>
            <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200/50">
              <div className="text-2xl font-bold text-sarafa-maroon font-hindi">100% इन-हाउस</div>
              <div className="text-xs text-slate-700 font-semibold mt-1">
                {currentLocale === "hi" ? "डाई कटिंग, सिलाई एवं जर्मन हॉट फॉयल" : "Rotary Cutting & Hot Foil Stamping"}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                {currentLocale === "hi" ? "शून्य बिचौलिया, सीधे कारखाना भाव" : "Factory Direct, Zero Middlemen"}
              </div>
            </div>
          </div>
        </section>

        {/* Manufacturing Strengths */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 font-hindi">
              हमारे प्रमुख विनिर्माण प्रभाग
            </h2>
            <Link
              href="/manufacturing"
              className="text-sm font-semibold text-sarafa-maroon hover:text-sarafa-maroon-dark flex items-center gap-1"
            >
              <span>विस्तार से देखें</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profile.manufacturingDivisions.map((div) => (
              <div key={div.id} className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm hover:border-sarafa-gold transition-all">
                <h3 className="text-lg font-bold text-sarafa-maroon mb-1 font-hindi">
                  {div.name[currentLocale]}
                </h3>
                <p className="text-xs text-amber-800 font-medium mb-3">
                  {div.tagline[currentLocale]}
                </p>
                <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                  {div.description[currentLocale]}
                </p>
                <div className="border-t border-stone-100 pt-3 flex items-center justify-between text-xs text-slate-500">
                  <span>न्यूनतम बैच: <strong>{div.minimumOrderQty} पीस</strong></span>
                  <span>समय: <strong>{div.typicalLeadTime}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quality Commitment & Location */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4 font-hindi flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>गुणवत्ता आश्वासन प्रक्रिया</span>
            </h3>
            <ul className="space-y-3">
              {profile.qualityAssurance.steps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{step[currentLocale]}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4 font-hindi flex items-center gap-2">
                <MapPin className="w-5 h-5 text-sarafa-maroon" />
                <span>कार्यालय व निर्माण स्थल</span>
              </h3>
              <p className="text-sm text-slate-700 mb-1 font-semibold">
                {profile.headquarters.addressLine1}, {profile.headquarters.addressLine2}
              </p>
              <p className="text-sm text-slate-600 mb-4">
                {profile.headquarters.city}, {profile.headquarters.state} - {profile.headquarters.pincode}
              </p>
              <p className="text-xs text-slate-500 flex items-center gap-2 mb-2">
                <Phone className="w-3.5 h-3.5 text-sarafa-maroon" />
                <span>{profile.headquarters.phone}</span>
              </p>
              <p className="text-xs text-slate-500 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-sarafa-maroon" />
                <span>{profile.headquarters.email}</span>
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-100 flex gap-3">
              <Link
                href="/contact"
                className="flex-1 bg-sarafa-maroon hover:bg-sarafa-maroon-dark text-white text-xs font-semibold py-2.5 px-4 rounded-lg text-center transition-colors"
              >
                संपर्क एवं दिशा-निर्देश
              </Link>
              <Link
                href="/products"
                className="flex-1 border border-sarafa-gold text-sarafa-maroon hover:bg-amber-50 text-xs font-semibold py-2.5 px-4 rounded-lg text-center transition-colors"
              >
                उत्पाद सूची देखें
              </Link>
            </div>
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

export default function AboutPage() {
  return (
    <CartProvider>
      <AboutPageContent />
    </CartProvider>
  );
}

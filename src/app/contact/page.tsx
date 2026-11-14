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
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Building2, 
  Send, 
  CheckCircle2,
  ExternalLink
} from "lucide-react";

function ContactPageContent() {
  const [currentLocale, setCurrentLocale] = useState<Locale>("hi");
  const [isWholesaleModalOpen, setIsWholesaleModalOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
      <div className="bg-gradient-to-r from-sarafa-maroon-dark via-sarafa-maroon to-sarafa-maroon text-white py-12 px-4 sm:px-8 border-b-2 border-sarafa-gold">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold font-hindi text-white mb-2">
            संपर्क एवं प्रतिष्ठान विवरण (Contact Us)
          </h1>
          <p className="text-sm sm:text-base text-sarafa-gold-light max-w-2xl">
            आगरा सराफा बाजार में स्थित हमारे प्रतिष्ठान पर पधारें या थोक ऑर्डर हेतु सीधे संपर्क करें।
          </p>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-8 py-12 flex-1 space-y-10 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Location & Hours Card */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <div className="text-xs font-semibold text-sarafa-maroon uppercase tracking-wider mb-1">
                  मुख्य प्रतिष्ठान
                </div>
                <h2 className="text-xl font-bold text-slate-900 font-hindi mb-2">
                  {profile.headquarters.name[currentLocale]}
                </h2>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {profile.headquarters.addressLine1}, {profile.headquarters.addressLine2}<br />
                  {profile.headquarters.city}, {profile.headquarters.state} - {profile.headquarters.pincode}
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-stone-100 text-sm">
                <div className="flex items-center gap-3 text-slate-700">
                  <Phone className="w-4 h-4 text-sarafa-maroon" />
                  <a href={`tel:${profile.headquarters.phone}`} className="hover:underline font-semibold">
                    {profile.headquarters.phone}
                  </a>
                </div>
                <div className="flex items-center gap-3 text-slate-700">
                  <Mail className="w-4 h-4 text-sarafa-maroon" />
                  <a href={`mailto:${profile.headquarters.email}`} className="hover:underline">
                    {profile.headquarters.email}
                  </a>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="pt-4 border-t border-stone-100">
                <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-sarafa-maroon" />
                  <span>दुकान खुलने का समय (Business Hours):</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                  {profile.operatingHours.map((h, idx) => (
                    <div key={idx} className="capitalize">
                      <strong>{h.dayOfWeek}:</strong> {h.openTime} - {h.closeTime}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-100">
              <a
                href={profile.headquarters.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-amber-50 hover:bg-amber-100 text-sarafa-maroon border border-sarafa-gold text-xs font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <span>Google Maps पर देखें</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Quick Contact / Message Form */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 font-hindi mb-2">
              संदेश या पूछताछ भेजें
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              थोक ऑर्डर, सैंपल या विशेष नाप के थैलों के लिए तुरंत संदेश भेजें।
            </p>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h3 className="font-bold text-slate-900 text-sm font-hindi">धन्यवाद! आपका संदेश प्राप्त हुआ।</h3>
                <p className="text-xs text-slate-600">हमारी टीम शीघ्र ही आपसे संपर्क करेगी।</p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
                className="space-y-4 text-xs"
              >
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">आपका नाम या फर्म का नाम *</label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. श्री गणेश ज्वेलर्स / राजेश जैन"
                    className="w-full p-2.5 border border-stone-300 rounded-lg text-xs focus:outline-none focus:border-sarafa-gold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">मोबाइल नंबर (WhatsApp) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full p-2.5 border border-stone-300 rounded-lg text-xs focus:outline-none focus:border-sarafa-gold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">आवश्यकता का विवरण</label>
                  <textarea
                    rows={4}
                    placeholder="थोक पोटली, बुलियन बैग्स या प्रिंटिंग विवरण लिखें..."
                    className="w-full p-2.5 border border-stone-300 rounded-lg text-xs focus:outline-none focus:border-sarafa-gold"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-sarafa-maroon hover:bg-sarafa-maroon-dark text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 shadow-sm transition-colors text-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>संदेश प्रेषित करें</span>
                </button>
              </form>
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

export default function ContactPage() {
  return (
    <CartProvider>
      <ContactPageContent />
    </CartProvider>
  );
}

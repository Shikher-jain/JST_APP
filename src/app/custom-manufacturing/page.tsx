"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { WholesaleModal } from "@/components/wholesale/WholesaleModal";
import { CustomQuoteModal } from "@/components/custom/CustomQuoteModal";
import { CheckoutModal } from "@/components/checkout/CheckoutModal";
import { CartProvider, useCart } from "@/context/CartContext";
import { formatCurrencyINR } from "@/lib/i18n";
import { Locale } from "@/types";
import { 
  Building2, 
  Sparkles, 
  Layers, 
  Scissors, 
  Printer, 
  ShieldCheck, 
  CheckCircle2, 
  Send, 
  MessageCircle,
  Copy,
  Check,
  ChevronRight,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

function CustomManufacturingPageContent() {
  const [currentLocale, setCurrentLocale] = useState<Locale>("hi");
  const [isWholesaleModalOpen, setIsWholesaleModalOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  // Form State
  const [bagType, setBagType] = useState("मखमली आभूषण पोटली (Velvet Potli)");
  const [width, setWidth] = useState(6);
  const [height, setHeight] = useState(8);
  const [gusset, setGusset] = useState(0);
  const [unit, setUnit] = useState<"inch" | "cm">("inch");
  const [material, setMaterial] = useState("प्रीमियम मखमल (280 GSM Velvet)");
  const [branding, setBranding] = useState("गोल्डन हॉट फॉइल स्टैम्पिंग (Gold Hot Foil)");
  const [quantity, setQuantity] = useState(200);

  // Contact Info
  const [shopName, setShopName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Agra");
  const [specialInstructions, setSpecialInstructions] = useState("");

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const { itemCount, setIsCartOpen, isWholesaleCustomer } = useCart();

  // Dynamic Real-time Cost Estimation
  const baseRate = bagType.includes("कैनवास") || bagType.includes("बुलियन") ? 160 : bagType.includes("लैमिनेटेड") ? 35 : 28;
  const sizeFactor = Math.max(1, (width * height) / 48);
  const estimatedUnitRate = Math.round(baseRate * (sizeFactor * 0.7 + 0.3));
  const toolingCharge = branding.includes("फॉइल") ? 800 : branding.includes("स्क्रीन") ? 500 : 300;
  const estimatedTotal = Math.round(estimatedUnitRate * quantity + toolingCharge);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopName || !phone) {
      alert("कृपया दुकान/फर्म का नाम और मोबाइल नंबर दर्ज करें।");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/custom-enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shopName,
          contactPerson,
          phone,
          city,
          bagType,
          dimensions: { width: Number(width), height: Number(height), gusset: Number(gusset), unit },
          material,
          brandingTechnique: branding,
          targetQuantity: Number(quantity),
          estimatedUnitRate,
          toolingCharge,
          estimatedTotal,
          specialInstructions,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmissionResult(data.enquiry);
      } else {
        alert(data.error || "कोटेशन सबमिट करने में त्रुटि हुई।");
      }
    } catch {
      alert("सर्वर से संपर्क करने में त्रुटि। कृपया पुनः प्रयास करें।");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
          <div className="inline-flex items-center gap-2 bg-sarafa-gold/20 text-sarafa-gold-light border border-sarafa-gold/40 px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <Scissors className="w-3.5 h-3.5 text-sarafa-gold" />
            <span>कस्टम बैग निर्माता • किसी भी नाप व कपड़े में</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-hindi text-white mb-2">
            कस्टम बैग विनिर्माण व कोटेशन पोर्टल (Bespoke OEM)
          </h1>
          <p className="text-sm sm:text-base text-sarafa-gold-light max-w-2xl leading-relaxed">
            अपनी दुकान के नाम, मनचाही नाप, चुने हुए कपड़े एवं सोने-चांदी के फॉइल लोगो के साथ विशेष थैले तैयार करवाएं।
          </p>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-8 py-10 flex-1 w-full space-y-10">
        {submissionResult ? (
          /* Submission Success Screen */
          <div className="bg-white p-8 rounded-2xl border border-emerald-200 shadow-md text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
                पूछताछ सफलतापूर्वक दर्ज हुई
              </div>
              <h2 className="text-2xl font-bold text-slate-900 font-hindi mb-2">
                कोटेशन संदर्भ संख्या: {submissionResult.referenceId}
              </h2>
              <p className="text-sm text-slate-600 max-w-lg mx-auto">
                श्रीमान {submissionResult.contactPerson} ({submissionResult.shopName}), आपका कस्टम ऑर्डर विवरण हमारे आगरा उत्पादन केंद्र को प्राप्त हो गया है।
              </p>
            </div>

            {/* Spec Card */}
            <div className="max-w-md mx-auto bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">बैग का प्रकार:</span>
                <strong className="text-slate-800">{submissionResult.bagType}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">आकार / नाप:</span>
                <strong className="text-slate-800">
                  {submissionResult.dimensions.width}x{submissionResult.dimensions.height} {submissionResult.dimensions.unit}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">मात्रा (Quantity):</span>
                <strong className="text-slate-800">{submissionResult.targetQuantity} पीस</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">अनुमानित दर:</span>
                <strong className="text-sarafa-maroon font-bold">
                  {formatCurrencyINR(submissionResult.estimatedUnitRate)} / पीस
                </strong>
              </div>
              <div className="flex justify-between pt-2 border-t border-stone-200">
                <span className="text-slate-500">कुल अनुमानित मूल्य (डाई चार्ज सहित):</span>
                <strong className="text-emerald-700 font-bold text-sm">
                  {formatCurrencyINR(submissionResult.estimatedTotal)}
                </strong>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 max-w-md mx-auto pt-2">
              <button
                type="button"
                onClick={() => copyToClipboard(submissionResult.referenceId)}
                className="bg-stone-100 hover:bg-stone-200 text-slate-700 text-xs font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 border border-stone-300 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? "कॉपी हो गया!" : "रेफरेंस आईडी कॉपी करें"}</span>
              </button>

              <a
                href={`https://wa.me/919876543210?text=नमस्ते,%20मैंने%20कस्टम%20बैग%20कोटेशन%20दर्ज%20किया%20है।%20रेफरेंस%20संख्या:%20${submissionResult.referenceId}%20(${encodeURIComponent(
                  submissionResult.shopName
                )})।`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp पर तुरंत चर्चा करें</span>
              </a>
            </div>

            <div>
              <button
                type="button"
                onClick={() => setSubmissionResult(null)}
                className="text-xs text-sarafa-maroon hover:underline font-semibold"
              >
                नया कस्टम कोटेशन भरें
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* 5-Stage Transparent Bespoke Lifecycle */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sarafa-maroon mb-2">
                <Sparkles className="w-4 h-4 text-sarafa-gold" />
                <span>{currentLocale === "hi" ? "कस्टम निर्माण की 5-चरणीय पारदर्शी प्रक्रिया" : "5-Stage Transparent Bespoke OEM Lifecycle"}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-hindi mb-2">
                {currentLocale === "hi" ? "आपकी नाप, आपका कपड़ा, आपकी ब्रास डाई — शून्य जोखिम" : "Your Exact Dimensions, Chosen Fabric, Custom Brass Die"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mb-6">
                {currentLocale === "hi"
                  ? "आगरा इन-हाउस निर्माण केंद्र द्वारा प्रत्येक कस्टम ऑर्डर को 5 चरणों में सटीकता से पूरा किया जाता है।"
                  : "Every custom showroom packaging run is engineered in our Agra facility across five transparent milestones."}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/60">
                  <span className="font-bold text-sarafa-maroon block mb-1">1. नाप व कपड़ा चयन</span>
                  <p className="text-[11px] text-slate-600">बॉक्स या सिल्लियों की आंतरिक नाप (इंच/मिमी) व जीएसएम निर्धारण।</p>
                </div>
                <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/60">
                  <span className="font-bold text-sarafa-maroon block mb-1">2. ब्रास डाई उत्कीर्णन</span>
                  <p className="text-[11px] text-slate-600">शोरूम लोगो व हॉलमार्क की हाई-डेंसिटी ब्रास डाई मेकिंग।</p>
                </div>
                <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/60">
                  <span className="font-bold text-sarafa-maroon block mb-1">3. 48-घंटे अप्रूवल</span>
                  <p className="text-[11px] text-slate-600">डिजिटल 3D मॉकअप एवं बल्क ऑर्डर्स (200+) पर फिजिकल मास्टर सैंपल।</p>
                </div>
                <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/60">
                  <span className="font-bold text-sarafa-maroon block mb-1">4. बैच उत्पादन व सिलाई</span>
                  <p className="text-[11px] text-slate-600">ऑटो डाई कटिंग, जर्मन हॉट फॉयल स्टैम्पिंग एवं इंटरलॉक सिलाई।</p>
                </div>
                <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/60">
                  <span className="font-bold text-sarafa-maroon block mb-1">5. बीमित डिलीवरी</span>
                  <p className="text-[11px] text-slate-600">वाटरप्रूफ बंडल पैकिंग व पक्के जीएसटी इनवॉइस के साथ देशव्यापी शिपिंग।</p>
                </div>
              </div>
            </div>

            {/* Interactive Bag Configurator */}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: Form Options */}
            <div className="lg:col-span-2 space-y-6">
              {/* Step 1: Bag Silhouette */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  1. बैग का प्रकार चुनें (Bag Silhouette) *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    "मखमली आभूषण पोटली (Velvet Potli)",
                    "हैवी सराफा बुलियन व कैश कैरियर थैला",
                    "प्रीमियम शोरूम लैमिनेटेड आर्ट बोर्ड बैग",
                    "चांदी पायल व सिक्का ज़िप पाउच",
                  ].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setBagType(type)}
                      className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                        bagType === type
                          ? "bg-amber-50 border-sarafa-maroon text-sarafa-maroon shadow-xs"
                          : "border-stone-200 hover:border-sarafa-gold text-slate-700"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Dimensions */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    2. सटीक नाप / आकार (Custom Dimensions) *
                  </label>
                  <div className="flex bg-stone-100 rounded-lg p-0.5 border border-stone-200">
                    <button
                      type="button"
                      onClick={() => setUnit("inch")}
                      className={`text-xs px-2.5 py-0.5 rounded font-semibold ${
                        unit === "inch" ? "bg-white shadow-xs text-slate-900" : "text-slate-500"
                      }`}
                    >
                      इंच (Inches)
                    </button>
                    <button
                      type="button"
                      onClick={() => setUnit("cm")}
                      className={`text-xs px-2.5 py-0.5 rounded font-semibold ${
                        unit === "cm" ? "bg-white shadow-xs text-slate-900" : "text-slate-500"
                      }`}
                    >
                      सेमी (cm)
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">चौड़ाई (Width)</label>
                    <input
                      type="number"
                      min={2}
                      max={40}
                      step={0.5}
                      value={width}
                      onChange={(e) => setWidth(Number(e.target.value))}
                      className="w-full p-2.5 border border-stone-300 rounded-lg text-xs font-bold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">ऊंचाई (Height)</label>
                    <input
                      type="number"
                      min={2}
                      max={50}
                      step={0.5}
                      value={height}
                      onChange={(e) => setHeight(Number(e.target.value))}
                      className="w-full p-2.5 border border-stone-300 rounded-lg text-xs font-bold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">गसेट / बॉटम (Gusset)</label>
                    <input
                      type="number"
                      min={0}
                      max={20}
                      step={0.5}
                      value={gusset}
                      onChange={(e) => setGusset(Number(e.target.value))}
                      className="w-full p-2.5 border border-stone-300 rounded-lg text-xs font-bold text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Step 3: Material & Branding */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  3. कपड़ा एवं ब्रांडिंग तकनीक (Material & Branding) *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">कपड़ा विनिर्देश</label>
                    <select
                      value={material}
                      onChange={(e) => setMaterial(e.target.value)}
                      className="w-full p-2.5 border border-stone-300 rounded-lg text-xs text-slate-800 bg-white"
                    >
                      <option value="प्रीमियम मखमल (280 GSM Velvet)">प्रीमियम मखमल (280 GSM Velvet)</option>
                      <option value="16 oz हेवी-ड्यूटी कॉटन कैनवास">16 oz हेवी-ड्यूटी कॉटन कैनवास</option>
                      <option value="250 GSM आर्ट बोर्ड + मैट लैमिनेशन">250 GSM आर्ट बोर्ड + मैट लैमिनेशन</option>
                      <option value="100 GSM वर्जिन नॉन-वूवन">100 GSM वर्जिन नॉन-वूवन</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">प्रिंटिंग / लोगो तकनीक</label>
                    <select
                      value={branding}
                      onChange={(e) => setBranding(e.target.value)}
                      className="w-full p-2.5 border border-stone-300 rounded-lg text-xs text-slate-800 bg-white"
                    >
                      <option value="गोल्डन हॉट फॉइल स्टैम्पिंग (Gold Hot Foil)">गोल्डन हॉट फॉइल स्टैम्पिंग (Gold Hot Foil)</option>
                      <option value="सिल्वर हॉट फॉइल स्टैम्पिंग (Silver Hot Foil)">सिल्वर हॉट फॉइल स्टैम्पिंग (Silver Hot Foil)</option>
                      <option value="मल्टी-कलर स्क्रीन प्रिंटिंग (Screen Print)">मल्टी-कलर स्क्रीन प्रिंटिंग (Screen Print)</option>
                      <option value="मशीनी कढ़ाई (Machine Embroidery)">मशीनी कढ़ाई (Machine Embroidery)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">
                    ऑर्डर मात्रा (Target Quantity): <strong>{quantity} पीस</strong>
                  </label>
                  <input
                    type="range"
                    min={50}
                    max={2000}
                    step={25}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full accent-sarafa-maroon cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>न्यूनतम: 50 पीस</span>
                    <span>1,000 पीस</span>
                    <span>2,000+ पीस</span>
                  </div>
                </div>
              </div>

              {/* Step 4: Contact Information */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  4. आपका व्यावसायिक विवरण (Business Info) *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">दुकान / फर्म का नाम *</label>
                    <input
                      type="text"
                      required
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                      placeholder="उदा. श्री गणेश ज्वेलर्स"
                      className="w-full p-2.5 border border-stone-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">संपर्क व्यक्ति का नाम</label>
                    <input
                      type="text"
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      placeholder="उदा. राजेश अग्रवाल"
                      className="w-full p-2.5 border border-stone-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">मोबाइल नंबर (WhatsApp) *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full p-2.5 border border-stone-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">शहर (City)</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Agra, Mathura, Delhi..."
                      className="w-full p-2.5 border border-stone-300 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">विशेष निर्देश या लोगो विवरण</label>
                  <textarea
                    rows={2}
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="डोरी का रंग, लोगो प्लेसमेंट या आवश्यक डिलीवरी तिथि लिखें..."
                    className="w-full p-2.5 border border-stone-300 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Right 1 Col: Summary & Price Card */}
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-2xl border-2 border-sarafa-gold shadow-sm sticky top-24 space-y-4">
                <div className="flex items-center gap-2 text-sarafa-maroon font-bold text-sm font-hindi border-b border-stone-100 pb-3">
                  <Sparkles className="w-4 h-4 text-sarafa-gold" />
                  <span>तुरंत लागत अनुमान (Estimate)</span>
                </div>

                <div className="space-y-2.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>चुनी गई नाप:</span>
                    <strong className="text-slate-800">{width}x{height} {unit}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>मात्रा:</span>
                    <strong className="text-slate-800">{quantity} पीस</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>अनुमानित प्रति पीस दर:</span>
                    <strong className="text-sarafa-maroon text-sm font-bold">
                      {formatCurrencyINR(estimatedUnitRate)}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>डाई / टूलिंग शुल्क:</span>
                    <span className="text-slate-700 font-semibold">{formatCurrencyINR(toolingCharge)}</span>
                  </div>

                  <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
                    <span className="font-bold text-slate-800">कुल अनुमानित मूल्य:</span>
                    <span className="text-xl font-bold text-emerald-700">
                      {formatCurrencyINR(estimatedTotal)}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    * जीएसटी 12% व मालभाड़ा वास्तविक बिलिंग पर नियमानुसार देय होगा।
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-sarafa-maroon hover:bg-sarafa-maroon-dark text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors text-xs disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5 text-sarafa-gold" />
                  <span>{isSubmitting ? "सबमिट हो रहा है..." : "कोटेशन अनुरोध सबमिट करें"}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </main>

      <Footer currentLocale={currentLocale} />
      <CartDrawer currentLocale={currentLocale} />
      <WholesaleModal isOpen={isWholesaleModalOpen} onClose={() => setIsWholesaleModalOpen(false)} currentLocale={currentLocale} />
      <CustomQuoteModal isOpen={isCustomModalOpen} onClose={() => setIsCustomModalOpen(false)} currentLocale={currentLocale} />
      <CheckoutModal currentLocale={currentLocale} />
    </div>
  );
}

export default function CustomManufacturingPage() {
  return (
    <CartProvider>
      <CustomManufacturingPageContent />
    </CartProvider>
  );
}

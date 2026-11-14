"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { Locale } from "@/types";
import { formatCurrencyINR, getDictionary } from "@/lib/i18n";
import { 
  X, 
  ShieldCheck, 
  Lock, 
  Clock, 
  Truck, 
  CreditCard, 
  Banknote, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft,
  Smartphone,
  MapPin,
  Building,
  FileText,
  UserCheck,
  Send
} from "lucide-react";

interface CheckoutModalProps {
  currentLocale: Locale;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ currentLocale }) => {
  const {
    items,
    subtotal,
    totalGst,
    grandTotal,
    hasWholesaleItems,
    isCheckoutOpen,
    setIsCheckoutOpen,
    clearCart,
  } = useCart();

  const dict = getDictionary(currentLocale);

  // Funnel Step: 1: Auth & Cart Lock, 2: Address & Shipping, 3: Tax & Review, 4: Payment, 5: Confirmed
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Soft-lock reservation timer (15 minutes = 900 seconds candidate DEC-03)
  const [secondsRemaining, setSecondsRemaining] = useState<number>(900);

  // Auth Mode: "guest" (DEC-01) or "registered"
  const [authMode, setAuthMode] = useState<"guest" | "registered">("guest");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  // Address
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [stateCode, setStateCode] = useState("09"); // Default Uttar Pradesh 09
  const [addressLine, setAddressLine] = useState("");
  const [shippingMethod, setShippingMethod] = useState<"surface" | "express">("surface");
  const [shippingFee, setShippingFee] = useState<number>(0);

  // B2B optional GSTIN
  const [customerGstin, setCustomerGstin] = useState("");

  // Payment Selection
  const [paymentMode, setPaymentMode] = useState<"online" | "cod">("online");
  const [codOtpSent, setCodOtpSent] = useState(false);
  const [codOtpInput, setCodOtpInput] = useState("");
  const [codOtpVerified, setCodOtpVerified] = useState(false);

  // Final Order Receipt
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 15-minute countdown timer effect
  useEffect(() => {
    if (!isCheckoutOpen || currentStep === 5) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isCheckoutOpen, currentStep]);

  // Format seconds into MM:SS
  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Indian Pincode Auto-Fill Helper
  const handlePincodeChange = (code: string) => {
    setPincode(code);
    if (code.length === 6) {
      if (code.startsWith("282")) {
        setCity("Agra");
        setStateName("Uttar Pradesh");
        setStateCode("09");
      } else if (code.startsWith("110")) {
        setCity("New Delhi");
        setStateName("Delhi");
        setStateCode("07");
      } else if (code.startsWith("400")) {
        setCity("Mumbai");
        setStateName("Maharashtra");
        setStateCode("27");
      } else if (code.startsWith("560")) {
        setCity("Bengaluru");
        setStateName("Karnataka");
        setStateCode("29");
      } else if (code.startsWith("302")) {
        setCity("Jaipur");
        setStateName("Rajasthan");
        setStateCode("08");
      } else if (code.startsWith("208")) {
        setCity("Kanpur");
        setStateName("Uttar Pradesh");
        setStateCode("09");
      } else {
        // Fallback default
        setCity("India");
        setStateName("Other State");
        setStateCode("99");
      }
    }
  };

  // Calculate Shipping fee
  useEffect(() => {
    if (subtotal >= 999) {
      setShippingFee(shippingMethod === "express" ? 60 : 0);
    } else {
      setShippingFee(shippingMethod === "express" ? 120 : 60);
    }
  }, [subtotal, shippingMethod]);

  // Tax calculation: Intrastate (09) vs Interstate
  const isIntrastate = stateCode === "09";
  const cgstAmount = isIntrastate ? Math.round(totalGst / 2) : 0;
  const sgstAmount = isIntrastate ? Math.round(totalGst / 2) : 0;
  const igstAmount = isIntrastate ? 0 : totalGst;
  const finalPayable = subtotal + totalGst + shippingFee;

  // COD availability rule: Allowed ONLY if no wholesale items and grand total between candidate ₹499 and ₹3,000 (DEC-02)
  const isCodAllowed = !hasWholesaleItems && finalPayable >= 499 && finalPayable <= 3000;

  // Handle Order Placement
  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    const generatedId = `JST-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    try {
      // Call mock or real API route
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: generatedId,
          customer: {
            authMode,
            name: customerName,
            phone: customerPhone,
            email: customerEmail,
            gstin: customerGstin || undefined,
          },
          shippingAddress: {
            addressLine,
            city,
            state: stateName,
            stateCode,
            pincode,
          },
          items,
          pricing: {
            subtotal,
            cgst: cgstAmount,
            sgst: sgstAmount,
            igst: igstAmount,
            shippingFee,
            grandTotal: finalPayable,
          },
          paymentMethod: paymentMode,
          status: paymentMode === "online" ? "PAID" : "CONFIRMED_COD",
        }),
      });
    } catch {
      // Fallback silently if offline or dev
    }

    setConfirmedOrderId(generatedId);
    clearCart();
    setIsSubmitting(false);
    setCurrentStep(5);
  };

  if (!isCheckoutOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={() => {
          if (currentStep !== 5) setIsCheckoutOpen(false);
        }}
      />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-4">
        <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden border-2 border-sarafa-gold/40">
          {/* Header */}
          <div className="bg-sarafa-maroon text-white p-4 sm:p-5 flex items-center justify-between border-b border-sarafa-gold/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gold-gradient text-sarafa-maroon-dark font-bold text-lg flex items-center justify-center shadow-inner">
                जै
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg font-hindi text-white">
                  {currentLocale === "hi" ? "सुरक्षित चेकआउट" : "Secure Checkout"}
                </h3>
                <p className="text-[11px] text-sarafa-gold-light">
                  {currentLocale === "hi"
                    ? "जैन सराफा थैला — प्रामाणिक इनवॉइस एवं सुरक्षित प्रेषण"
                    : "Jain Sarafa Thella — Authentic Invoice & Secure Dispatch"}
                </p>
              </div>
            </div>

            {/* 15-Minute Soft Lock Countdown (DEC-03 candidate) */}
            {currentStep < 5 && (
              <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-sarafa-gold/40 text-xs">
                <Clock className="w-4 h-4 text-sarafa-gold animate-spin-slow" />
                <div className="text-right">
                  <span className="text-[10px] text-sarafa-ivory block leading-none">स्टॉक आरक्षित:</span>
                  <span className="font-mono font-bold text-sarafa-gold">{formatTimer(secondsRemaining)}</span>
                </div>
              </div>
            )}

            {currentStep !== 5 && (
              <button
                type="button"
                onClick={() => setIsCheckoutOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Stepper Indicator */}
          {currentStep < 5 && (
            <div className="bg-stone-50 px-6 py-2.5 border-b border-stone-200 flex items-center justify-between text-xs">
              <div className={`flex items-center gap-1.5 font-semibold ${currentStep >= 1 ? "text-sarafa-maroon" : "text-slate-400"}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStep >= 1 ? "bg-sarafa-maroon text-white" : "bg-slate-200"}`}>1</span>
                <span>खाता/संपर्क</span>
              </div>
              <div className="h-0.5 w-6 bg-stone-300" />
              <div className={`flex items-center gap-1.5 font-semibold ${currentStep >= 2 ? "text-sarafa-maroon" : "text-slate-400"}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStep >= 2 ? "bg-sarafa-maroon text-white" : "bg-slate-200"}`}>2</span>
                <span>पता व कूरियर</span>
              </div>
              <div className="h-0.5 w-6 bg-stone-300" />
              <div className={`flex items-center gap-1.5 font-semibold ${currentStep >= 3 ? "text-sarafa-maroon" : "text-slate-400"}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStep >= 3 ? "bg-sarafa-maroon text-white" : "bg-slate-200"}`}>3</span>
                <span>GST कर विवरण</span>
              </div>
              <div className="h-0.5 w-6 bg-stone-300" />
              <div className={`flex items-center gap-1.5 font-semibold ${currentStep >= 4 ? "text-sarafa-maroon" : "text-slate-400"}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStep >= 4 ? "bg-sarafa-maroon text-white" : "bg-slate-200"}`}>4</span>
                <span>भुगतान</span>
              </div>
            </div>
          )}

          {/* Modal Body */}
          <div className="p-6 max-h-[75vh] overflow-y-auto">
            {/* ========================================================== */}
            {/* STEP 1: AUTHENTICATION POLICY (DEC-01) & CONTACT           */}
            {/* ========================================================== */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <div className="border border-amber-200 bg-amber-50/60 p-3.5 rounded-xl">
                  <h4 className="text-xs font-bold text-amber-900 mb-1 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-sarafa-gold-dark" />
                    <span>खरीदार पहचान नीति (DEC-01 लचीलापन):</span>
                  </h4>
                  <p className="text-[11px] text-amber-800">
                    आप बिना पासवर्ड बनाए सीधे मोबाइल नंबर से अतिथि चेकआउट कर सकते हैं, अथवा अपने सहेजे गए पते का उपयोग करने के लिए लॉगिन कर सकते हैं।
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAuthMode("guest")}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      authMode === "guest"
                        ? "border-sarafa-maroon bg-sarafa-maroon/5 ring-1 ring-sarafa-maroon"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <span className="font-bold text-xs text-slate-900 block">अतिथि चेकआउट (Guest)</span>
                    <span className="text-[10px] text-slate-500">केवल मोबाइल OTP से त्वरित खरीद</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAuthMode("registered")}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      authMode === "registered"
                        ? "border-sarafa-maroon bg-sarafa-maroon/5 ring-1 ring-sarafa-maroon"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <span className="font-bold text-xs text-slate-900 block">पंजीकृत खाता (Login)</span>
                    <span className="text-[10px] text-slate-500">सहेजे गए पते और ऑर्डर इतिहास</span>
                  </button>
                </div>

                <div className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      पूरा नाम / दुकान का नाम *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="उदा. राजेश कुमार जैन"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-sarafa-maroon"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        व्हाट्सएप मोबाइल नंबर *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-medium">+91</span>
                        <input
                          type="tel"
                          maxLength={10}
                          required
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="9876543210"
                          className="w-full text-xs pl-10 pr-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-sarafa-maroon font-mono"
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 block">ऑर्डर पुष्टि व कूरियर ट्रैकिंग हेतु</span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        ईमेल पता (वैकल्पिक)
                      </label>
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="rajesh@example.com"
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-sarafa-maroon"
                      />
                    </div>
                  </div>
                </div>

                {/* Soft Lock Notice */}
                <div className="bg-stone-50 p-3 rounded-lg border border-stone-200 text-xs text-slate-600 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>स्टॉक 15 मिनट के लिए सुरक्षित कर लिया गया है।</span>
                  </span>
                  <span className="font-bold text-sarafa-maroon">{items.length} उत्पाद</span>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    disabled={!customerName || customerPhone.length < 10}
                    onClick={() => setCurrentStep(2)}
                    className="bg-sarafa-maroon hover:bg-sarafa-maroon-dark disabled:opacity-50 text-white font-bold text-xs py-2.5 px-6 rounded-lg flex items-center gap-2 transition-all shadow-sm"
                  >
                    <span>अगला: डिलीवरी का पता</span>
                    <ArrowRight className="w-4 h-4 text-sarafa-gold" />
                  </button>
                </div>
              </div>
            )}

            {/* ========================================================== */}
            {/* STEP 2: SHIPPING ADDRESS & SHIPROCKET COURIER LOOKUP        */}
            {/* ========================================================== */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      पिन कोड (Pincode) *
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={pincode}
                      onChange={(e) => handlePincodeChange(e.target.value)}
                      placeholder="उदा. 282001"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-sarafa-maroon font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      शहर (City)
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={city}
                      placeholder="स्वतः खोज..."
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-stone-100 text-slate-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      राज्य (State)
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={stateName}
                      placeholder="स्वतः खोज..."
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-stone-100 text-slate-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    सड़क / दुकान नंबर / मोहल्ला (Street & Landmark) *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    placeholder="दुकान नंबर 14, सराफा बाजार, निकट घंटाघर..."
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-sarafa-maroon"
                  />
                </div>

                {/* Courier Selection */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    कूरियर सेवा चुनें (Shiprocket Aggregated Couriers):
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setShippingMethod("surface")}
                      className={`p-3 rounded-xl border text-left flex items-start justify-between transition-all ${
                        shippingMethod === "surface"
                          ? "border-sarafa-maroon bg-sarafa-maroon/5 ring-1 ring-sarafa-maroon"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                          <Truck className="w-3.5 h-3.5 text-sarafa-maroon" />
                          <span>स्टैंडर्ड सरफेस (Surface Cargo)</span>
                        </div>
                        <span className="text-[10px] text-slate-500 block mt-1">3–5 कार्यदिवस डिलीवरी</span>
                      </div>
                      <span className="text-xs font-bold text-emerald-700">
                        {subtotal >= 999 ? "मुफ़्त (Free)" : "₹60"}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShippingMethod("express")}
                      className={`p-3 rounded-xl border text-left flex items-start justify-between transition-all ${
                        shippingMethod === "express"
                          ? "border-sarafa-maroon bg-sarafa-maroon/5 ring-1 ring-sarafa-maroon"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>एक्सप्रेस एयर (Express Air)</span>
                        </div>
                        <span className="text-[10px] text-slate-500 block mt-1">1–2 कार्यदिवस त्वरित प्रेषण</span>
                      </div>
                      <span className="text-xs font-bold text-slate-800">
                        {subtotal >= 999 ? "₹60" : "₹120"}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="border border-slate-300 text-slate-700 font-semibold text-xs py-2 px-4 rounded-lg flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>वापस</span>
                  </button>

                  <button
                    type="button"
                    disabled={pincode.length < 6 || !addressLine}
                    onClick={() => setCurrentStep(3)}
                    className="bg-sarafa-maroon hover:bg-sarafa-maroon-dark disabled:opacity-50 text-white font-bold text-xs py-2.5 px-6 rounded-lg flex items-center gap-2 transition-all shadow-sm"
                  >
                    <span>अगला: कर व इनवॉइस विवरण</span>
                    <ArrowRight className="w-4 h-4 text-sarafa-gold" />
                  </button>
                </div>
              </div>
            )}

            {/* ========================================================== */}
            {/* STEP 3: TAX CALCULATION & RULE 46 INVOICE BREAKDOWN       */}
            {/* ========================================================== */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-3">
                  <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5 border-b border-stone-200 pb-2">
                    <FileText className="w-4 h-4 text-sarafa-maroon" />
                    <span>GST कर गणना पूर्वावलोकन (Rule 46 Tax Invoice)</span>
                  </h4>

                  <div className="text-xs space-y-2">
                    <div className="flex justify-between text-slate-600">
                      <span>आपूर्ति का स्थान (Place of Supply):</span>
                      <span className="font-semibold text-slate-900">
                        {stateName} (राज्य कोड: {stateCode})
                      </span>
                    </div>

                    <div className="flex justify-between text-slate-600">
                      <span>उत्पाद आधार मूल्य:</span>
                      <span className="font-semibold">{formatCurrencyINR(subtotal)}</span>
                    </div>

                    {isIntrastate ? (
                      <>
                        <div className="flex justify-between text-slate-600 pl-3 border-l-2 border-emerald-500">
                          <span>केंद्रीय वस्तु एवं सेवा कर (CGST @ half rate):</span>
                          <span className="font-semibold">{formatCurrencyINR(cgstAmount)}</span>
                        </div>
                        <div className="flex justify-between text-slate-600 pl-3 border-l-2 border-emerald-500">
                          <span>राज्य वस्तु एवं सेवा कर (SGST @ half rate):</span>
                          <span className="font-semibold">{formatCurrencyINR(sgstAmount)}</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex justify-between text-slate-600 pl-3 border-l-2 border-blue-500">
                        <span>एकीकृत वस्तु एवं सेवा कर (IGST):</span>
                        <span className="font-semibold">{formatCurrencyINR(igstAmount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-slate-600">
                      <span>कूरियर प्रेषण शुल्क:</span>
                      <span className="font-semibold">{formatCurrencyINR(shippingFee)}</span>
                    </div>

                    <div className="border-t border-stone-200 pt-2 flex justify-between text-sm font-bold text-slate-900">
                      <span>अंतिम देय राशि (Final Amount):</span>
                      <span className="text-base text-sarafa-maroon">{formatCurrencyINR(finalPayable)}</span>
                    </div>
                  </div>
                </div>

                {/* Optional B2B GSTIN */}
                <div className="border border-slate-200 p-3 rounded-xl bg-white">
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-sarafa-gold-dark" />
                    <span>व्यापारिक GSTIN (वैकल्पिक — इनपुट टैक्स क्रेडिट हेतु)</span>
                  </label>
                  <input
                    type="text"
                    maxLength={15}
                    value={customerGstin}
                    onChange={(e) => setCustomerGstin(e.target.value.toUpperCase())}
                    placeholder="उदा. 09AAACJ1234F1Z5"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-sarafa-maroon font-mono uppercase"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    यदि दिया जाता है, तो इनवॉइस B2B प्रारूप में जारी किया जाएगा।
                  </span>
                </div>

                <div className="pt-2 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="border border-slate-300 text-slate-700 font-semibold text-xs py-2 px-4 rounded-lg flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>वापस</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    className="bg-sarafa-maroon hover:bg-sarafa-maroon-dark text-white font-bold text-xs py-2.5 px-6 rounded-lg flex items-center gap-2 transition-all shadow-sm"
                  >
                    <span>अगला: भुगतान विकल्प</span>
                    <ArrowRight className="w-4 h-4 text-sarafa-gold" />
                  </button>
                </div>
              </div>
            )}

            {/* ========================================================== */}
            {/* STEP 4: PAYMENT SELECTION (ONLINE VS COD RESTRICTIONS)     */}
            {/* ========================================================== */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="text-xs font-bold text-slate-700 mb-2">
                  भुगतान का माध्यम चुनें:
                </div>

                {/* Option A: Razorpay Online */}
                <button
                  type="button"
                  onClick={() => setPaymentMode("online")}
                  className={`w-full p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                    paymentMode === "online"
                      ? "border-sarafa-maroon bg-sarafa-maroon/5 ring-2 ring-sarafa-maroon"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800 shrink-0">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">
                        ऑनलाइन भुगतान (UPI, RuPay, डेबिट/क्रेडिट कार्ड, नेट बैंकिंग)
                      </span>
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                        100% सुरक्षित
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Razorpay पेमेंट गेटवे द्वारा सुरक्षित। तत्काल ऑर्डर पुष्टि और प्राथमिकता प्रेषण।
                    </p>
                  </div>
                </button>

                {/* Option B: Cash on Delivery (Strictly conditional under DEC-02) */}
                <div
                  className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                    !isCodAllowed
                      ? "opacity-60 bg-stone-100 border-stone-300 cursor-not-allowed"
                      : paymentMode === "cod"
                      ? "border-sarafa-maroon bg-sarafa-maroon/5 ring-2 ring-sarafa-maroon"
                      : "border-slate-200 hover:border-slate-300 cursor-pointer"
                  }`}
                  onClick={() => {
                    if (isCodAllowed) setPaymentMode("cod");
                  }}
                >
                  <div className="p-2 rounded-lg bg-amber-100 text-amber-800 shrink-0">
                    <Banknote className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">
                        कैश ऑन डिलीवरी (Cash on Delivery)
                      </span>
                      {!isCodAllowed && (
                        <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded">
                          अनुपलब्ध (Disabled)
                        </span>
                      )}
                    </div>

                    {!isCodAllowed ? (
                      <p className="text-[11px] text-rose-700 mt-1">
                        {hasWholesaleItems
                          ? "⚠️ थोक ऑर्डर या बल्क मात्रा पर COD उपलब्ध नहीं है। कृपया ऑनलाइन भुगतान चुनें।"
                          : `⚠️ COD केवल ₹499 से ₹3,000 के खुदरा ऑर्डरों पर उपलब्ध है (वर्तमान मूल्य: ${formatCurrencyINR(finalPayable)})।`}
                      </p>
                    ) : (
                      <p className="text-[11px] text-slate-500 mt-1">
                        पार्सल प्राप्त करते समय नकद भुगतान करें। डिलीवरी से पहले व्हाट्सएप पर OTP सत्यापन अनिवार्य है।
                      </p>
                    )}
                  </div>
                </div>

                {/* COD WhatsApp OTP verification if COD chosen */}
                {paymentMode === "cod" && isCodAllowed && (
                  <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl space-y-2.5">
                    <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4 text-amber-700" />
                      <span>COD सत्यापन: व्हाट्सएप OTP कोड</span>
                    </span>
                    <p className="text-[11px] text-amber-800">
                      नकली ऑर्डरों से बचने हेतु आपके नंबर <strong>+91 {customerPhone}</strong> पर एक 4-अंकीय सत्यापन कोड भेजा जाएगा।
                    </p>

                    {!codOtpSent ? (
                      <button
                        type="button"
                        onClick={() => setCodOtpSent(true)}
                        className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold py-1.5 px-3 rounded-lg flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>व्हाट्सएप पर OTP भेजें</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          maxLength={4}
                          value={codOtpInput}
                          onChange={(e) => {
                            setCodOtpInput(e.target.value);
                            if (e.target.value === "1234") setCodOtpVerified(true);
                          }}
                          placeholder="1234 (डेमो कोड)"
                          className="w-32 text-xs p-2 rounded-lg border border-amber-300 font-mono font-bold text-center"
                        />
                        {codOtpVerified ? (
                          <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> सत्यापित!
                          </span>
                        ) : (
                          <span className="text-[11px] text-amber-700">डेमो कोड <strong>1234</strong> दर्ज करें</span>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div className="pt-3 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="border border-slate-300 text-slate-700 font-semibold text-xs py-2 px-4 rounded-lg flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>वापस</span>
                  </button>

                  <button
                    type="button"
                    disabled={isSubmitting || (paymentMode === "cod" && !codOtpVerified)}
                    onClick={handlePlaceOrder}
                    className="bg-sarafa-maroon hover:bg-sarafa-maroon-dark disabled:opacity-50 text-white font-bold text-sm py-3 px-8 rounded-xl flex items-center gap-2 transition-all shadow-md group"
                  >
                    <Lock className="w-4 h-4 text-sarafa-gold" />
                    <span>
                      {isSubmitting
                        ? "ऑर्डर प्रसंस्कृत हो रहा है..."
                        : `${formatCurrencyINR(finalPayable)} का ऑर्डर पूर्ण करें`}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* ========================================================== */}
            {/* STEP 5: ORDER CONFIRMATION & RECEIPT                       */}
            {/* ========================================================== */}
            {currentStep === 5 && (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <span className="text-xs uppercase font-bold tracking-wider text-emerald-700">
                    ऑर्डर सफलतापूर्वक दर्ज हुआ!
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold font-hindi text-slate-900 mt-1">
                    जैन सराफा थैला को चुनने के लिए धन्यवाद!
                  </h3>
                  <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-stone-100 rounded-full font-mono text-xs font-bold text-slate-800 border border-stone-200">
                    <span>ऑर्डर संदर्भ:</span>
                    <span className="text-sarafa-maroon">{confirmedOrderId}</span>
                  </div>
                </div>

                <div className="bg-amber-50 border border-sarafa-gold/40 rounded-xl p-4 max-w-md mx-auto text-left text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <Smartphone className="w-4 h-4 text-sarafa-gold-dark" />
                    <span>व्हाट्सएप पुष्टि सूचना (Meta Cloud API):</span>
                  </div>
                  <p className="text-slate-600">
                    आपके पंजीकृत नंबर <strong>+91 {customerPhone}</strong> पर आधिकारिक GST इनवॉइस प्रतिलिपि एवं Shiprocket ट्रैकिंग लिंक प्रेषित कर दी गई है।
                  </p>
                  <div className="border-t border-amber-200 pt-2 text-[11px] text-slate-500">
                    आगरा कार्यशाला से प्रेषण: <strong>24 से 48 घंटे के भीतर</strong>
                  </div>
                </div>

                <div className="pt-4 flex justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCheckoutOpen(false);
                      setCurrentStep(1);
                    }}
                    className="bg-sarafa-maroon hover:bg-sarafa-maroon-dark text-white font-bold text-xs py-2.5 px-6 rounded-lg transition-colors shadow-sm"
                  >
                    खरीदारी जारी रखें (Continue Shopping)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

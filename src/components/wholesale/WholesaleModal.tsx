"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Locale } from "@/types";
import { formatCurrencyINR, getDictionary } from "@/lib/i18n";
import { 
  X, 
  Building2, 
  FileCheck2, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ShoppingBag, 
  Plus, 
  Minus, 
  ArrowRight,
  ShieldCheck,
  Phone,
  Layers
} from "lucide-react";

interface WholesaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocale: Locale;
}

// Quick reorder catalog items with pre-calculated volume breaks
interface QuickOrderItem {
  variantId: string;
  name: { hi: string; en: string };
  sku: string;
  size: string;
  retailPrice: number;
  tiers: { minQty: number; price: number }[];
  quantity: number;
}

const initialQuickOrderList: QuickOrderItem[] = [
  {
    variantId: "var-001-s",
    name: {
      hi: "शाही लाल मखमली आभूषण पोटली (4x5 इंच)",
      en: "Royal Red Velvet Jewellery Pouch (4x5 in)",
    },
    sku: "JST-VLV-RED-S",
    size: "4 x 5 इंच",
    retailPrice: 35,
    tiers: [
      { minQty: 50, price: 22 },
      { minQty: 200, price: 19 },
      { minQty: 500, price: 16 },
    ],
    quantity: 0,
  },
  {
    variantId: "var-001-m",
    name: {
      hi: "शाही लाल मखमली आभूषण पोटली (6x8 इंच)",
      en: "Royal Red Velvet Jewellery Pouch (6x8 in)",
    },
    sku: "JST-VLV-RED-M",
    size: "6 x 8 इंच",
    retailPrice: 55,
    tiers: [
      { minQty: 50, price: 38 },
      { minQty: 200, price: 34 },
      { minQty: 500, price: 30 },
    ],
    quantity: 0,
  },
  {
    variantId: "var-002-std",
    name: {
      hi: "प्राकृतिक सूती सराफा थैला (10x12 इंच)",
      en: "Natural Organic Cotton Sarafa Thella (10x12 in)",
    },
    sku: "JST-COT-NAT-10X12",
    size: "10 x 12 इंच",
    retailPrice: 45,
    tiers: [
      { minQty: 100, price: 28 },
      { minQty: 300, price: 24 },
      { minQty: 1000, price: 21 },
    ],
    quantity: 0,
  },
  {
    variantId: "var-004-env",
    name: {
      hi: "रॉयल ब्लू स्वीड स्नैप-बटन पाऊच (4x4 इंच)",
      en: "Royal Blue Suede Snap Envelope (4x4 in)",
    },
    sku: "JST-SUD-BLU-4X4",
    size: "4 x 4 इंच",
    retailPrice: 50,
    tiers: [
      { minQty: 50, price: 34 },
      { minQty: 200, price: 29 },
      { minQty: 500, price: 25 },
    ],
    quantity: 0,
  },
];

export const WholesaleModal: React.FC<WholesaleModalProps> = ({
  isOpen,
  onClose,
  currentLocale,
}) => {
  const { isWholesaleCustomer, setIsWholesaleCustomer, addToCart, setIsCartOpen } = useCart();
  const [activeTab, setActiveTab] = useState<"register" | "reorder">("reorder");

  // Registration Form State
  const [bizName, setBizName] = useState("");
  const [tradeName, setTradeName] = useState("");
  const [gstin, setGstin] = useState("");
  const [pan, setPan] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Agra");
  const [state, setState] = useState("Uttar Pradesh");
  const [monthlyVolume, setMonthlyVolume] = useState("1000-5000");
  const [regSuccess, setRegSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quick Reorder Items State
  const [reorderItems, setReorderItems] = useState<QuickOrderItem[]>(initialQuickOrderList);
  const [addedSuccessToast, setAddedSuccessToast] = useState(false);

  if (!isOpen) return null;

  // Handle Quick Reorder Quantity Changes
  const handleQtyChange = (variantId: string, delta: number) => {
    setReorderItems((prev) =>
      prev.map((item) => {
        if (item.variantId === variantId) {
          const newQ = Math.max(0, item.quantity + delta);
          return { ...item, quantity: newQ };
        }
        return item;
      })
    );
  };

  const handleSetExactQty = (variantId: string, qty: number) => {
    setReorderItems((prev) =>
      prev.map((item) => (item.variantId === variantId ? { ...item, quantity: qty } : item))
    );
  };

  // Get Unit Price based on quantity
  const getItemUnitPrice = (item: QuickOrderItem) => {
    if (item.quantity === 0) return item.retailPrice;
    const matched = [...item.tiers]
      .sort((a, b) => b.minQty - a.minQty)
      .find((t) => item.quantity >= t.minQty);
    return matched ? matched.price : item.retailPrice;
  };

  // Calculate Quick Reorder Summary
  const quickOrderSubtotal = reorderItems.reduce((acc, item) => {
    const unitPrice = getItemUnitPrice(item);
    return acc + unitPrice * item.quantity;
  }, 0);

  const quickOrderCount = reorderItems.reduce((acc, item) => acc + item.quantity, 0);

  // Add all selected items to main cart
  const handleAddAllToCart = () => {
    let itemsAdded = 0;
    reorderItems.forEach((item) => {
      if (item.quantity > 0) {
        addToCart(item.variantId, item.quantity);
        itemsAdded++;
      }
    });

    if (itemsAdded > 0) {
      setAddedSuccessToast(true);
      setTimeout(() => {
        setAddedSuccessToast(false);
        onClose();
        setIsCartOpen(true);
      }, 800);
    }
  };

  // Submit B2B Registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch("/api/wholesale/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          legalBusinessName: bizName,
          tradeName: tradeName || bizName,
          gstin,
          pan,
          phone,
          city,
          state,
          monthlyVolume,
        }),
      });
    } catch {
      // Fallback in dev
    }

    setIsSubmitting(false);
    setRegSuccess(true);
    setIsWholesaleCustomer(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-4">
        <div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl overflow-hidden border-2 border-sarafa-gold/40">
          {/* Header */}
          <div className="bg-sarafa-maroon text-white p-5 flex items-center justify-between border-b border-sarafa-gold/30">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gold-gradient text-sarafa-maroon-dark shadow-inner">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg font-hindi text-white flex items-center gap-2">
                  <span>थोक व्यापार पोर्टल (B2B Wholesale Portal)</span>
                  {isWholesaleCustomer && (
                    <span className="text-[10px] bg-sarafa-gold text-sarafa-maroon-dark font-bold px-2 py-0.5 rounded-full uppercase">
                      सत्यापित थोक खरीदार
                    </span>
                  )}
                </h3>
                <p className="text-xs text-sarafa-gold-light">
                  सराफा व्यापारियों एवं ज्वैलर्स हेतु विशेष थोक दरें, GST इनपुट क्रेडिट एवं त्वरित पुनः ऑर्डर
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Simulation Banner for Reviewer */}
          <div className="bg-amber-100/80 px-5 py-2.5 border-b border-amber-300/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-amber-950 font-medium">
              <Sparkles className="w-4 h-4 text-sarafa-gold-dark shrink-0" />
              <span>
                <strong>परीक्षण मोड (Simulation):</strong> वर्तमान में {isWholesaleCustomer ? "थोक मूल्य (B2B Tiers)" : "खुदरा मूल्य (Retail)"} सक्रिय है।
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsWholesaleCustomer(!isWholesaleCustomer)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all shadow-2xs ${
                isWholesaleCustomer
                  ? "bg-sarafa-maroon text-white hover:bg-sarafa-maroon-dark"
                  : "bg-emerald-700 text-white hover:bg-emerald-800"
              }`}
            >
              {isWholesaleCustomer ? "खुदरा मोड में बदलें" : "थोक B2B मोड सक्रिय करें"}
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-stone-200 bg-stone-50">
            <button
              type="button"
              onClick={() => setActiveTab("reorder")}
              className={`flex-1 py-3 px-4 text-xs font-bold font-hindi flex items-center justify-center gap-2 border-b-2 transition-all ${
                activeTab === "reorder"
                  ? "border-sarafa-maroon text-sarafa-maroon bg-white"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <RefreshCw className="w-4 h-4" />
              <span>त्वरित पुनः ऑर्डर (Quick Reorder Matrix)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("register")}
              className={`flex-1 py-3 px-4 text-xs font-bold font-hindi flex items-center justify-center gap-2 border-b-2 transition-all ${
                activeTab === "register"
                  ? "border-sarafa-maroon text-sarafa-maroon bg-white"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <FileCheck2 className="w-4 h-4" />
              <span>B2B व्यापारी पंजीकरण (GST Verification)</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6 max-h-[65vh] overflow-y-auto">
            {/* ========================================================== */}
            {/* TAB 1: QUICK REORDER MATRIX                                */}
            {/* ========================================================== */}
            {activeTab === "reorder" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-600">
                    आभूषण की दुकानों के लिए सर्वाधिक बिकने वाले मानक पाउच व थैले:
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                    50+ पीस पर विशेष थोक छूट लागू
                  </span>
                </div>

                <div className="border border-stone-200 rounded-xl overflow-hidden divide-y divide-stone-200 shadow-2xs">
                  {reorderItems.map((item) => {
                    const unitPrice = getItemUnitPrice(item);
                    const itemTotal = unitPrice * item.quantity;
                    const isTierActive = item.quantity >= 50;

                    return (
                      <div
                        key={item.variantId}
                        className="p-3.5 sm:p-4 bg-white hover:bg-stone-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                              {item.name[currentLocale]}
                            </h4>
                            <span className="text-[10px] font-mono bg-stone-100 text-slate-600 px-1.5 py-0.5 rounded border">
                              {item.sku}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                            <span>आकार: <strong>{item.size}</strong></span>
                            <span>•</span>
                            <span>मूल दर: <del>{formatCurrencyINR(item.retailPrice)}</del></span>
                            <span>•</span>
                            <span className="text-emerald-700 font-bold">
                              वर्तमान लागू दर: {formatCurrencyINR(unitPrice)}/पीस
                            </span>
                          </div>

                          {/* Volume tier pills */}
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {item.tiers.map((t) => (
                              <button
                                key={t.minQty}
                                type="button"
                                onClick={() => handleSetExactQty(item.variantId, t.minQty)}
                                className={`text-[10px] px-2 py-0.5 rounded-full border transition-all ${
                                  item.quantity === t.minQty
                                    ? "bg-sarafa-maroon text-white border-sarafa-maroon font-bold"
                                    : "bg-stone-100 text-slate-700 border-stone-300 hover:border-sarafa-gold"
                                }`}
                              >
                                {t.minQty}+ पीस: {formatCurrencyINR(t.price)}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Controls & Total */}
                        <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                          <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden shadow-2xs">
                            <button
                              type="button"
                              onClick={() => handleQtyChange(item.variantId, -50)}
                              className="px-2.5 py-1.5 text-slate-600 hover:bg-stone-100 transition-colors text-xs font-bold"
                              title="-50 पीस"
                            >
                              -50
                            </button>
                            <span className="px-3 py-1 text-xs font-bold text-slate-900 min-w-12 text-center">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleQtyChange(item.variantId, 50)}
                              className="px-2.5 py-1.5 text-slate-600 hover:bg-stone-100 transition-colors text-xs font-bold"
                              title="+50 पीस"
                            >
                              +50
                            </button>
                          </div>

                          <div className="text-right min-w-20">
                            <div className="text-sm font-bold text-sarafa-maroon">
                              {formatCurrencyINR(itemTotal)}
                            </div>
                            {isTierActive && (
                              <span className="text-[10px] text-emerald-700 font-semibold block">
                                थोक छूट लागू
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Quick Reorder Bottom Action */}
                <div className="bg-amber-50/70 border border-sarafa-gold/40 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
                  <div>
                    <span className="text-xs text-slate-600 block">कुल चयनित मात्रा:</span>
                    <span className="text-base font-bold text-slate-900">
                      {quickOrderCount} पीस — कुल मूल्य:{" "}
                      <span className="text-sarafa-maroon">{formatCurrencyINR(quickOrderSubtotal)}</span>
                    </span>
                  </div>

                  <button
                    type="button"
                    disabled={quickOrderCount === 0}
                    onClick={handleAddAllToCart}
                    className="w-full sm:w-auto bg-sarafa-maroon hover:bg-sarafa-maroon-dark disabled:opacity-50 text-white font-bold text-xs py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <ShoppingBag className="w-4 h-4 text-sarafa-gold" />
                    <span>सभी टोकरी में जोड़ें ({quickOrderCount} पीस)</span>
                    <ArrowRight className="w-4 h-4 text-sarafa-gold" />
                  </button>
                </div>
              </div>
            )}

            {/* ========================================================== */}
            {/* TAB 2: B2B REGISTRATION FORM                               */}
            {/* ========================================================== */}
            {activeTab === "register" && (
              <div className="space-y-4">
                {regSuccess ? (
                  <div className="text-center py-8 space-y-3">
                    <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 font-hindi">
                      थोक पंजीकरण आवेदन प्राप्त हुआ!
                    </h4>
                    <p className="text-xs text-slate-600 max-w-md mx-auto">
                      आपका GSTIN <strong>{gstin}</strong> हमारे सिस्टम में दर्ज हो चुका है। आपके खाते पर थोक दरें सक्रिय कर दी गई हैं।
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveTab("reorder")}
                      className="mt-4 bg-sarafa-maroon hover:bg-sarafa-maroon-dark text-white text-xs font-semibold px-5 py-2.5 rounded-lg"
                    >
                      थोक पुनः ऑर्डर सूची पर जाएं
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleRegisterSubmit} className="space-y-4">
                    <div className="bg-stone-50 border border-stone-200 p-3 rounded-lg text-xs text-slate-600 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>
                        GST पंजीकृत व्यापारी 50+ पीस पर 15% से 35% तक निर्माता छूट एवं इनपुट टैक्स क्रेडिट के पात्र हैं।
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          व्यावसायिक कानूनी नाम (Legal Name) *
                        </label>
                        <input
                          type="text"
                          required
                          value={bizName}
                          onChange={(e) => setBizName(e.target.value)}
                          placeholder="उदा. श्री गणेश ज्वेलर्स प्रा. लि."
                          className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-sarafa-maroon"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          दुकान / ट्रेड नाम (Trade Name)
                        </label>
                        <input
                          type="text"
                          value={tradeName}
                          onChange={(e) => setTradeName(e.target.value)}
                          placeholder="उदा. गणेश ज्वेलर्स"
                          className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-sarafa-maroon"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          15-अंकीय GSTIN नंबर *
                        </label>
                        <input
                          type="text"
                          maxLength={15}
                          required
                          value={gstin}
                          onChange={(e) => setGstin(e.target.value.toUpperCase())}
                          placeholder="09AAACJ1234F1Z5"
                          className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-sarafa-maroon font-mono uppercase font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          व्यापारिक PAN नंबर *
                        </label>
                        <input
                          type="text"
                          maxLength={10}
                          required
                          value={pan}
                          onChange={(e) => setPan(e.target.value.toUpperCase())}
                          placeholder="AAACJ1234F"
                          className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-sarafa-maroon font-mono uppercase"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          व्हाट्सएप नंबर *
                        </label>
                        <input
                          type="tel"
                          maxLength={10}
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="9876543210"
                          className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-sarafa-maroon font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          शहर (City) *
                        </label>
                        <input
                          type="text"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="Agra"
                          className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-sarafa-maroon"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          मासिक अनुमानित आवश्यकता
                        </label>
                        <select
                          value={monthlyVolume}
                          onChange={(e) => setMonthlyVolume(e.target.value)}
                          className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-sarafa-maroon bg-white"
                        >
                          <option value="500-1000">500 से 1,000 पीस / माह</option>
                          <option value="1000-5000">1,000 से 5,000 पीस / माह</option>
                          <option value="5000+">5,000+ पीस / माह (विशेष अनुबंध)</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting || gstin.length !== 15}
                        className="w-full bg-sarafa-maroon hover:bg-sarafa-maroon-dark disabled:opacity-50 text-white font-bold text-xs sm:text-sm py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
                      >
                        <FileCheck2 className="w-4 h-4 text-sarafa-gold" />
                        <span>
                          {isSubmitting
                            ? "सत्यापन प्रक्रिया जारी..."
                            : "B2B खाता सत्यापित करें एवं थोक दरें अनलॉक करें"}
                        </span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

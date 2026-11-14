"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import { Locale } from "@/types";
import { formatCurrencyINR, getDictionary } from "@/lib/i18n";
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  ShieldAlert, 
  CheckCircle2, 
  Sparkles,
  Lock
} from "lucide-react";

interface CartDrawerProps {
  currentLocale: Locale;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ currentLocale }) => {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    totalGst,
    grandTotal,
    itemCount,
    hasWholesaleItems,
    isWholesaleCustomer,
    isCartOpen,
    setIsCartOpen,
    setIsCheckoutOpen,
  } = useCart();

  const dict = getDictionary(currentLocale);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-sarafa-gold/30">
          {/* Header */}
          <div className="bg-sarafa-maroon text-white px-5 py-4 flex items-center justify-between border-b border-sarafa-gold/30">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-white/10 text-sarafa-gold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-base font-hindi text-white flex items-center gap-2">
                  <span>{currentLocale === "hi" ? "आपकी टोकरी" : "Your Shopping Cart"}</span>
                  <span className="text-xs bg-sarafa-gold text-sarafa-maroon-dark px-2 py-0.5 rounded-full font-bold">
                    {itemCount}
                  </span>
                </h2>
                <p className="text-[11px] text-sarafa-gold-light">
                  {currentLocale === "hi" ? "जैन सराफा थैला — सीधे आगरा निर्माता भाव" : "Jain Sarafa Thella — Factory Direct Agra"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Wholesale Status Banner if active */}
          {isWholesaleCustomer && (
            <div className="bg-amber-50 px-4 py-2 border-b border-amber-200 flex items-center justify-between text-xs text-amber-900">
              <span className="flex items-center gap-1.5 font-medium">
                <Sparkles className="w-4 h-4 text-sarafa-gold-dark" />
                <span>{currentLocale === "hi" ? "सत्यापित थोक सत्र सक्रिय (Wholesale Active)" : "Verified Wholesale Session Active"}</span>
              </span>
              <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded font-bold uppercase">
                B2B Tier
              </span>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 text-slate-500">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-slate-400 mb-4 border border-stone-200">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-base text-slate-800 font-hindi mb-1">
                  {currentLocale === "hi" ? "आपकी टोकरी खाली है" : "Your cart is empty"}
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mb-6">
                  {currentLocale === "hi"
                    ? "हमारे प्रीमियम मखमली पोटली, जरी बैग एवं कॉटन थैलों का कैटलॉग देखें।"
                    : "Browse our premium velvet jewelry pouches, satin potlis, and cotton thellas."}
                </p>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="bg-sarafa-maroon hover:bg-sarafa-maroon-dark text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-sm"
                >
                  {currentLocale === "hi" ? "कैटलॉग ब्राउज़ करें" : "Browse Catalog"}
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.variantId}
                  className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-white hover:border-sarafa-gold/50 transition-all flex gap-3.5 relative group"
                >
                  {/* Miniature Product Icon */}
                  <div className="w-16 h-16 rounded-lg bg-sarafa-maroon/90 text-sarafa-gold flex flex-col items-center justify-center shrink-0 border border-sarafa-gold/30">
                    <div className="w-4 h-1 bg-sarafa-gold rounded-full mb-1" />
                    <span className="text-[8px] font-bold font-hindi">जैन सराफा</span>
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-xs text-slate-900 leading-snug truncate">
                        {item.product.title[currentLocale]}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.variantId)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-0.5"
                        title={currentLocale === "hi" ? "हटाएं" : "Remove"}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                      <span>{item.variant.size[currentLocale]}</span>
                      <span>•</span>
                      <span className="font-mono text-[10px]">{item.variant.variantSku}</span>
                    </div>

                    {/* Applied Tier Tag */}
                    {item.isWholesaleTierApplied && (
                      <div className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{currentLocale === "hi" ? "थोक छूट लागू" : "Wholesale Tier Applied"}</span>
                      </div>
                    )}

                    {/* Quantity & Price Controls */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden shadow-2xs">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="px-2 py-1 text-slate-600 hover:bg-stone-100 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 py-1 text-xs font-bold text-slate-800 min-w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          className="px-2 py-1 text-slate-600 hover:bg-stone-100 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-bold text-sarafa-maroon">
                          {formatCurrencyINR(item.totalPrice)}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {formatCurrencyINR(item.unitPrice)}/पीस
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {items.length > 0 && (
            <div className="border-t border-stone-200 bg-white p-5 space-y-3.5 shadow-lg">
              {/* Wholesale Alert Banner if applicable */}
              {hasWholesaleItems && (
                <div className="bg-amber-50 border border-amber-300/80 rounded-lg p-2.5 flex items-start gap-2 text-xs text-amber-900">
                  <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">
                      {currentLocale === "hi" ? "थोक ऑर्डर नीति सूचना:" : "Wholesale Policy Notice:"}
                    </span>{" "}
                    {currentLocale === "hi"
                      ? "थोक मात्रा ऑर्डर केवल ऑनलाइन/बैंक भुगतान द्वारा स्वीकार किए जाते हैं। इन पर खुदरा COD उपलब्ध नहीं है।"
                      : "Wholesale quantity orders require prepaid/online payment. Retail COD is not available."}
                  </div>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>{currentLocale === "hi" ? "कुल उत्पाद मूल्य (Subtotal)" : "Subtotal"}</span>
                  <span className="font-semibold">{formatCurrencyINR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>{currentLocale === "hi" ? "अनुमानित GST (5% / 12%)" : "Estimated GST"}</span>
                  <span className="font-semibold">{formatCurrencyINR(totalGst)}</span>
                </div>
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>{currentLocale === "hi" ? "डिलीवरी शुल्क" : "Shipping Charge"}</span>
                  <span className="text-emerald-700 font-medium">
                    {subtotal >= 999
                      ? currentLocale === "hi" ? "मुफ़्त डिलीवरी (₹999+ पर)" : "FREE (Above ₹999)"
                      : currentLocale === "hi" ? "चेकआउट पर परिकलित" : "Calculated at checkout"}
                  </span>
                </div>
                <div className="border-t border-stone-200 pt-2 flex justify-between items-baseline text-sm font-bold text-slate-900">
                  <span className="font-hindi">{currentLocale === "hi" ? "कुल देय राशि" : "Grand Total"}</span>
                  <span className="text-lg text-sarafa-maroon">{formatCurrencyINR(grandTotal)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                type="button"
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className="w-full bg-sarafa-maroon hover:bg-sarafa-maroon-dark text-white font-bold text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md group"
              >
                <Lock className="w-4 h-4 text-sarafa-gold" />
                <span>{currentLocale === "hi" ? "सुरक्षित चेकआउट पर जाएं" : "Proceed to Secure Checkout"}</span>
                <ArrowRight className="w-4 h-4 text-sarafa-gold group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-[11px] text-slate-400 hover:text-rose-600 transition-colors"
                >
                  {currentLocale === "hi" ? "टोकरी खाली करें" : "Empty Cart"}
                </button>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>100% सुरक्षित भारतीय भुगतान</span>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { WholesaleModal } from "@/components/wholesale/WholesaleModal";
import { CustomQuoteModal } from "@/components/custom/CustomQuoteModal";
import { CheckoutModal } from "@/components/checkout/CheckoutModal";
import { CartProvider, useCart } from "@/context/CartContext";
import { initialProducts } from "@/lib/mockData";
import { Locale } from "@/types";
import { getDictionary } from "@/lib/i18n";
import { Search, ShoppingBag, Sparkles, Filter } from "lucide-react";

function ProductsPageContent() {
  const [currentLocale, setCurrentLocale] = useState<Locale>("hi");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isWholesaleModalOpen, setIsWholesaleModalOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  const { itemCount, addToCart, isWholesaleCustomer, setIsCartOpen } = useCart();
  const dict = getDictionary(currentLocale);

  const filteredProducts = initialProducts.filter((product) => {
    const matchesCategory =
      activeCategory === "all" || product.categorySlug === activeCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      product.title[currentLocale].toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.baseSku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description[currentLocale].toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold font-hindi text-white mb-2">
            सम्पूर्ण उत्पाद कैटलॉग (Products)
          </h1>
          <p className="text-sm sm:text-base text-sarafa-gold-light max-w-2xl">
            आभूषण पोटली, बुलियन ट्रांसपोर्ट बैग्स एवं शोरूम लग्जरी दस्तकारी थैलों की विस्तृत श्रृंखला।
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10 flex-1 w-full space-y-8">
        {/* Search & Category Filter Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="नाम, कोड या मटीरियल से खोजें..."
              className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-sarafa-gold"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeCategory === "all"
                  ? "bg-sarafa-maroon text-white shadow-xs"
                  : "bg-stone-100 text-slate-700 hover:bg-stone-200"
              }`}
            >
              {dict.categories.all} ({initialProducts.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory("security-bullion")}
              className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeCategory === "security-bullion"
                  ? "bg-sarafa-maroon text-white shadow-xs"
                  : "bg-stone-100 text-slate-700 hover:bg-stone-200"
              }`}
            >
              {dict.categories.security}
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory("wholesale-transit")}
              className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeCategory === "wholesale-transit"
                  ? "bg-sarafa-maroon text-white shadow-xs"
                  : "bg-stone-100 text-slate-700 hover:bg-stone-200"
              }`}
            >
              {dict.categories.wholesale}
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory("pouches")}
              className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeCategory === "pouches"
                  ? "bg-sarafa-maroon text-white shadow-xs"
                  : "bg-stone-100 text-slate-700 hover:bg-stone-200"
              }`}
            >
              {dict.categories.pouches}
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory("carry-bags")}
              className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeCategory === "carry-bags"
                  ? "bg-sarafa-maroon text-white shadow-xs"
                  : "bg-stone-100 text-slate-700 hover:bg-stone-200"
              }`}
            >
              {dict.categories.carryBags}
            </button>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                currentLocale={currentLocale}
                onAddToCart={(variantId, qty) => addToCart(variantId, qty)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 text-center rounded-2xl border border-stone-200">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="text-lg font-bold text-slate-800 mb-1 font-hindi">कोई उत्पाद नहीं मिला</h3>
            <p className="text-sm text-slate-500 mb-4">कृपया अन्य खोज शब्द का प्रयास करें या फ़िल्टर रीसेट करें।</p>
            <button
              type="button"
              onClick={() => {
                setActiveCategory("all");
                setSearchQuery("");
              }}
              className="text-xs bg-sarafa-maroon text-white px-4 py-2 rounded-lg font-semibold"
            >
              फ़िल्टर रीसेट करें
            </button>
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

export default function ProductsPage() {
  return (
    <CartProvider>
      <ProductsPageContent />
    </CartProvider>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Locale } from "@/types";
import { getDictionary } from "@/lib/i18n";
import { 
  ShoppingBag, 
  Phone, 
  MapPin, 
  Search, 
  Menu, 
  X, 
  ShieldCheck, 
  FileText,
  Sparkles,
  Building2
} from "lucide-react";

interface NavbarProps {
  currentLocale: Locale;
  onLocaleChange: (locale: Locale) => void;
  cartCount?: number;
  onOpenCart?: () => void;
  onOpenWholesale?: () => void;
  onOpenCustom?: () => void;
  isWholesaleCustomer?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLocale,
  onLocaleChange,
  cartCount = 0,
  onOpenCart,
  onOpenWholesale,
  onOpenCustom,
  isWholesaleCustomer = false,
}) => {
  const dict = getDictionary(currentLocale);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full shadow-md">
      {/* Top Utility Bar */}
      <div className="bg-sarafa-maroon-dark text-sarafa-ivory text-xs py-1.5 px-4 sm:px-8 border-b border-sarafa-gold/30">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 opacity-90">
              <MapPin className="w-3.5 h-3.5 text-sarafa-gold" />
              <span>{dict.site.location}</span>
            </span>
            <span className="hidden md:flex items-center gap-1.5 opacity-90 border-l border-white/20 pl-4">
              <ShieldCheck className="w-3.5 h-3.5 text-sarafa-gold" />
              <span>सीधे निर्माता भाव • 100% प्रामाणिक</span>
            </span>
            {isWholesaleCustomer && (
              <span className="hidden lg:flex items-center gap-1 bg-amber-500/20 text-sarafa-gold-light border border-sarafa-gold/40 px-2 py-0.5 rounded-full text-[10px] font-bold">
                <Sparkles className="w-3 h-3 text-sarafa-gold" />
                <span>सत्यापित थोक खरीदार सत्र (B2B Active)</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://wa.me/919876543210?text=नमस्ते%20जैन%20सराफा%20थैला,%20मुझे%20बैग्स%20की%20जानकारी%20चाहिए"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sarafa-gold hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3" />
              <span className="font-medium">व्हाट्सएप: +91 98765 43210</span>
            </a>

            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-white/10 rounded-full p-0.5 border border-sarafa-gold/30">
              <button
                type="button"
                onClick={() => onLocaleChange("hi")}
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold transition-all ${
                  currentLocale === "hi"
                    ? "bg-sarafa-gold text-sarafa-charcoal shadow-sm"
                    : "text-white/80 hover:text-white"
                }`}
              >
                हिन्दी
              </button>
              <button
                type="button"
                onClick={() => onLocaleChange("en")}
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold transition-all ${
                  currentLocale === "en"
                    ? "bg-sarafa-gold text-sarafa-charcoal shadow-sm"
                    : "text-white/80 hover:text-white"
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-sarafa-maroon text-white px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-gold-gradient flex items-center justify-center text-sarafa-maroon-dark font-bold text-xl shadow-inner group-hover:scale-105 transition-transform">
              जै
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-sarafa-gold transition-colors font-hindi">
                {dict.site.name}
              </div>
              <div className="text-[10px] sm:text-xs text-sarafa-gold-light tracking-wide uppercase font-medium">
                Agra Sarafa Bag Manufacturers
              </div>
            </div>
          </Link>

          {/* Desktop Search */}
          <div className="hidden lg:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <input
                type="text"
                placeholder={
                  currentLocale === "hi"
                    ? "पोटली, कॉटन थैला, मखमली बैग खोजें..."
                    : "Search velvet pouches, cotton bags, potlis..."
                }
                className="w-full bg-white/10 text-white placeholder-white/60 text-sm rounded-lg pl-10 pr-4 py-2 border border-white/20 focus:outline-none focus:border-sarafa-gold focus:bg-white/15 transition-all"
              />
              <Search className="w-4 h-4 text-sarafa-gold absolute left-3 top-3" />
            </div>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-4 text-xs lg:text-sm font-medium">
            <Link
              href="/"
              className="text-sarafa-ivory hover:text-sarafa-gold transition-colors"
            >
              {dict.nav.home}
            </Link>
            <Link
              href="/products"
              className="text-sarafa-ivory hover:text-sarafa-gold transition-colors"
            >
              उत्पाद (Products)
            </Link>
            <Link
              href="/manufacturing"
              className="text-sarafa-ivory hover:text-sarafa-gold transition-colors"
            >
              विनिर्माण (Manufacturing)
            </Link>
            <Link
              href="/about"
              className="text-sarafa-ivory hover:text-sarafa-gold transition-colors"
            >
              परिचय (About)
            </Link>
            <Link
              href="/contact"
              className="text-sarafa-ivory hover:text-sarafa-gold transition-colors"
            >
              संपर्क (Contact)
            </Link>
            <button
              type="button"
              onClick={onOpenWholesale}
              className="px-2.5 py-1 rounded-md bg-sarafa-gold/20 text-sarafa-gold border border-sarafa-gold/40 hover:bg-sarafa-gold hover:text-sarafa-maroon-dark transition-all font-semibold flex items-center gap-1"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>{dict.nav.wholesale}</span>
            </button>
            <button
              type="button"
              onClick={onOpenCustom}
              className="text-sarafa-ivory hover:text-sarafa-gold transition-colors flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5 text-sarafa-gold" />
              <span>{dict.nav.customOrder}</span>
            </button>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenCart}
              className="relative p-2 rounded-lg bg-white/10 hover:bg-white/20 text-sarafa-ivory transition-colors flex items-center justify-center cursor-pointer"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-sarafa-gold" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-sarafa-gold text-sarafa-maroon-dark text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 text-sarafa-ivory"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-white/20 flex flex-col gap-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 text-sarafa-ivory font-medium"
            >
              {dict.nav.home}
            </Link>
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 text-sarafa-ivory font-medium"
            >
              उत्पाद कैटलॉग (Products)
            </Link>
            <Link
              href="/manufacturing"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 text-sarafa-ivory font-medium"
            >
              विनिर्माण (Manufacturing)
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 text-sarafa-ivory font-medium"
            >
              हमारे बारे में (About Us)
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 text-sarafa-ivory font-medium"
            >
              संपर्क (Contact Us)
            </Link>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenWholesale && onOpenWholesale();
              }}
              className="py-1.5 text-sarafa-gold font-semibold text-left flex items-center gap-1.5"
            >
              <Building2 className="w-4 h-4" />
              <span>{dict.nav.wholesale} (B2B पोर्टल)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCustom && onOpenCustom();
              }}
              className="py-1.5 text-sarafa-ivory font-medium flex items-center gap-1.5 text-left"
            >
              <FileText className="w-4 h-4 text-sarafa-gold" />
              <span>{dict.nav.customOrder} (कस्टम प्रिंटिंग)</span>
            </button>
          </div>
        )}
      </nav>
    </header>
  );
};

import React from "react";
import Link from "next/link";
import { Locale } from "@/types";
import { getDictionary } from "@/lib/i18n";
import { MapPin, Phone, Mail, ShieldAlert, Award, CreditCard } from "lucide-react";

interface FooterProps {
  currentLocale: Locale;
}

export const Footer: React.FC<FooterProps> = ({ currentLocale }) => {
  const dict = getDictionary(currentLocale);

  return (
    <footer className="bg-sarafa-charcoal-dark text-slate-300 pt-14 pb-8 border-t-2 border-sarafa-gold/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-700/60">
          {/* Col 1: Brand & Heritage */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded bg-gold-gradient text-sarafa-maroon-dark font-bold flex items-center justify-center text-lg">
                जै
              </div>
              <span className="text-xl font-bold text-white font-hindi">
                {dict.site.name}
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400 mb-4">
              {dict.footer.about}
            </p>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-sarafa-gold shrink-0 mt-0.5" />
                <span>चौक, सराफा बाज़ार, आगरा, उत्तर प्रदेश - 282001</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-sarafa-gold shrink-0" />
                <span>व्हाट्सएप/फोन: +91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-sarafa-gold shrink-0" />
                <span>support@jainsarafathella.com</span>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-sarafa-gold mb-3.5">
              {dict.footer.quickLinks}
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  उत्पाद कैटलॉग (All Products)
                </Link>
              </li>
              <li>
                <Link href="/manufacturing" className="hover:text-white transition-colors">
                  विनिर्माण क्षमताएं (Manufacturing)
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  हमारे बारे में (About Us)
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  संपर्क एवं दुकान का पता (Contact)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Statutory Policies */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-sarafa-gold mb-3.5">
              {dict.footer.legal}
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="#privacy" className="hover:text-white transition-colors">
                  {dict.footer.privacy}
                </Link>
              </li>
              <li>
                <Link href="#terms" className="hover:text-white transition-colors">
                  {dict.footer.terms}
                </Link>
              </li>
              <li>
                <Link href="#returns" className="hover:text-white transition-colors">
                  {dict.footer.returns}
                </Link>
              </li>
              <li>
                <Link href="#shipping" className="hover:text-white transition-colors">
                  {dict.footer.shipping}
                </Link>
              </li>
              <li>
                <span className="text-[11px] text-slate-400 block pt-1">
                  देश: भारत (Country of Origin: India)
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4: Consumer Grievance & Tax Compliance */}
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50 text-xs">
            <div className="flex items-center gap-1.5 text-sarafa-gold font-semibold mb-2">
              <ShieldAlert className="w-4 h-4" />
              <span>उपभोक्ता शिकायत निवारण</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal mb-2.5">
              {dict.footer.compliance}
            </p>
            <div className="border-t border-slate-700/60 pt-2 space-y-1 text-[11px] text-slate-300">
              <div>
                <strong className="text-white">अधिकारी:</strong> श्री आर. के. जैन
              </div>
              <div>
                <strong className="text-white">ईमेल:</strong> grievance@jainsarafathella.com
              </div>
              <div>
                <strong className="text-white">निवारण अवधि:</strong> 48 घंटे में पावती, 30 दिन में समाधान
              </div>
              <div className="pt-1 text-[10px] text-sarafa-gold-light">
                GSTIN: 09XXXXXXXXXXZX (Agra, UP)
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} {dict.footer.rights}
          </div>
          <div className="flex items-center gap-3 text-slate-300">
            <span className="flex items-center gap-1 text-[11px]">
              <CreditCard className="w-3.5 h-3.5 text-sarafa-gold" />
              <span>UPI, RuPay, Cards, NetBanking, COD (खुदरा)</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

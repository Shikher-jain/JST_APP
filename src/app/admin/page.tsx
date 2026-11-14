"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { jstBusinessProfile } from "@/lib/businessProfile";
import { initialProducts } from "@/lib/mockData";
import { GoogleDriveAdapter } from "@/lib/integrations/googleDriveAdapter";
import { formatCurrencyINR } from "@/lib/i18n";
import { 
  Building2, 
  Layers, 
  RefreshCw, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Image as ImageIcon, 
  Globe, 
  MapPin, 
  Settings, 
  FileText,
  Package,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ArrowRight
} from "lucide-react";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "profile" | "media" | "sync">("overview");
  const [syncStatus, setSyncStatus] = useState<any>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [testDriveLink, setTestDriveLink] = useState("");
  const [convertedCdnUrl, setConvertedCdnUrl] = useState("");
  const [parsedFileNameResult, setParsedFileNameResult] = useState<any>(null);

  const profile = jstBusinessProfile;
  const products = initialProducts;
  const totalVariants = products.reduce((acc, p) => acc + p.variants.length, 0);
  const totalStock = products.reduce(
    (acc, p) => acc + p.variants.reduce((vAcc, v) => vAcc + v.physicalStock, 0),
    0
  );

  useEffect(() => {
    fetch("/api/admin/sync")
      .then((res) => res.json())
      .then((data) => setSyncStatus(data))
      .catch(() => {});
  }, []);

  const triggerSync = async (target: string) => {
    setIsSyncing(true);
    try {
      await fetch("/api/admin/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target }),
      });
      const updated = await fetch("/api/admin/sync").then((r) => r.json());
      setSyncStatus(updated);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleTestDriveConversion = () => {
    if (!testDriveLink.trim()) return;
    const directUrl = GoogleDriveAdapter.getDirectCdnUrl(testDriveLink.trim());
    setConvertedCdnUrl(directUrl);
    const parsed = GoogleDriveAdapter.parseFileName(testDriveLink.trim());
    setParsedFileNameResult(parsed);
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans">
      {/* Admin Top Header */}
      <header className="bg-slate-900 text-white px-6 py-4 border-b border-slate-800 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gold-gradient text-sarafa-maroon-dark font-bold text-lg flex items-center justify-center">
            जै
          </div>
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              <span>JST Central Business Admin Panel</span>
              <span className="text-[10px] bg-sarafa-gold/30 text-sarafa-gold border border-sarafa-gold/40 px-2 py-0.5 rounded-full font-mono uppercase">
                v1.0 Ready
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Jain Sarafa Thella • Centralized Digital Presence & Synchronization Hub
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700"
          >
            <Globe className="w-3.5 h-3.5 text-sarafa-gold" />
            <span>लाइव वेबसाइट देखें (View Storefront)</span>
          </Link>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 bg-slate-900 text-slate-300 p-4 border-r border-slate-800 flex flex-col justify-between shrink-0">
          <div className="space-y-1">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
              प्रबंधन मॉड्यूल (Management)
            </div>
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "overview"
                  ? "bg-sarafa-maroon text-white shadow-sm"
                  : "hover:bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <Layers className="w-4 h-4 text-sarafa-gold" />
              <span>सिस्टम अवलोकन (Overview)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("products")}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "products"
                  ? "bg-sarafa-maroon text-white shadow-sm"
                  : "hover:bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <Package className="w-4 h-4 text-sarafa-gold" />
              <span>उत्पाद कैटलॉग (Products & Sizes)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "profile"
                  ? "bg-sarafa-maroon text-white shadow-sm"
                  : "hover:bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <Building2 className="w-4 h-4 text-sarafa-gold" />
              <span>प्रतिष्ठान विवरण (Business Profile)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("media")}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "media"
                  ? "bg-sarafa-maroon text-white shadow-sm"
                  : "hover:bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <ImageIcon className="w-4 h-4 text-sarafa-gold" />
              <span>Google Drive मीडिया (Media Registry)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("sync")}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "sync"
                  ? "bg-sarafa-maroon text-white shadow-sm"
                  : "hover:bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <RefreshCw className="w-4 h-4 text-sarafa-gold" />
              <span>सिंक्रोनाइज़ेशन मॉनिटर (Sync Engine)</span>
            </button>
          </div>

          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 space-y-1">
            <div>आगरा सराफा बाजार • पिन 282001</div>
            <div>स्टेट कोड: 09 (उत्तर प्रदेश)</div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-hindi">
                  सिस्टम अवलोकन एवं मुख्य स्थिति (System Overview)
                </h2>
                <p className="text-xs text-slate-500">
                  वेबसाइट, Google Business Profile एवं Google Maps की वास्तविक समय पर स्थिति।
                </p>
              </div>

              {/* KPI Counters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
                  <div className="text-xs font-medium text-slate-500">कुल मूल उत्पाद (Parent Products)</div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">{products.length}</div>
                  <div className="text-[11px] text-emerald-600 font-semibold mt-1">100% प्रकाशित (Published)</div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
                  <div className="text-xs font-medium text-slate-500">कुल आकार वेरियंट (SKU Variants)</div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">{totalVariants}</div>
                  <div className="text-[11px] text-slate-500 mt-1">नाप-वार अद्वितीय कोड्स</div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
                  <div className="text-xs font-medium text-slate-500">सक्रिय भौतिक स्टॉक (Physical Stock)</div>
                  <div className="text-2xl font-bold text-sarafa-maroon mt-1">{totalStock}</div>
                  <div className="text-[11px] text-slate-500 mt-1">पीस उपलब्ध (Agra Warehouse)</div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
                  <div className="text-xs font-medium text-slate-500">Google Business स्थिति</div>
                  <div className="text-xl font-bold text-emerald-600 mt-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>सत्यापित (Active)</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">Google Maps पर दृश्यमान</div>
                </div>
              </div>

              {/* Connected Destinations Status */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm font-hindi">
                    कनेक्टेड डिजिटल प्लेटफॉर्म (Publishing Destinations)
                  </h3>
                  <button
                    type="button"
                    onClick={() => triggerSync("all")}
                    disabled={isSyncing}
                    className="text-xs bg-sarafa-maroon hover:bg-sarafa-maroon-dark text-white font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-sarafa-gold ${isSyncing ? "animate-spin" : ""}`} />
                    <span>सभी पुनः सिंक करें (Sync All)</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-slate-900 text-sm">1. JST Storefront</span>
                      <span className="text-[10px] bg-emerald-700 text-white px-2 py-0.5 rounded-full font-semibold">
                        LIVE
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mb-3">
                      सार्वजनिक ई-कॉमर्स कैटलॉग, रिटेल चेकआउट एवं थोक बी2बी दरें।
                    </p>
                    <div className="text-[11px] text-slate-500 font-mono">अंतिम सिंक: अभी-अभी</div>
                  </div>

                  <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-slate-900 text-sm">2. Google Business Profile</span>
                      <span className="text-[10px] bg-blue-700 text-white px-2 py-0.5 rounded-full font-semibold">
                        SYNCED
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mb-3">
                      आगरा प्रतिष्ठान का पता, खुलने का समय, फोन एवं शोरूम फोटो।
                    </p>
                    <div className="text-[11px] text-slate-500 font-mono">अंतिम सिंक: 1 घंटा पूर्व</div>
                  </div>

                  <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-slate-900 text-sm">3. Google Maps Listing</span>
                      <span className="text-[10px] bg-emerald-700 text-white px-2 py-0.5 rounded-full font-semibold">
                        ACTIVE
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mb-3">
                      चौक सराफा बाजार में स्थित जीपीएस लोकेशन व ग्राहक समीक्षाएं।
                    </p>
                    <div className="text-[11px] text-slate-500 font-mono">स्थिति: 27.1856° N, 78.0142° E</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS */}
          {activeTab === "products" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 font-hindi">
                    उत्पाद एवं नाप-वेरियंट प्रबंधन (Products & Size Variants)
                  </h2>
                  <p className="text-xs text-slate-500">
                    मूल उत्पाद (Parent Product) के अधीन प्रत्येक नाप का अपना SKU, फोटो व दर स्लैब।
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {products.map((p) => (
                  <div key={p.id} className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                      <div>
                        <div className="text-xs font-mono font-semibold text-sarafa-maroon">
                          मूल कोड: {p.baseSku} • श्रेणी: {p.categorySlug}
                        </div>
                        <h3 className="font-bold text-slate-900 text-base font-hindi">
                          {p.title.hi} / {p.title.en}
                        </h3>
                      </div>
                      <Link
                        href={`/products/${p.slug}`}
                        target="_blank"
                        className="text-xs font-semibold text-sarafa-maroon hover:underline flex items-center gap-1"
                      >
                        <span>लाइव पेज देखें</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>

                    {/* Variant Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-stone-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-stone-200">
                          <tr>
                            <th className="p-2.5">वेरियंट SKU</th>
                            <th className="p-2.5">नाप (Size Label)</th>
                            <th className="p-2.5">आकार (Dimensions)</th>
                            <th className="p-2.5">वहन क्षमता</th>
                            <th className="p-2.5">खुदरा दर</th>
                            <th className="p-2.5">थोक स्लैब</th>
                            <th className="p-2.5">स्टॉक</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                          {p.variants.map((v) => (
                            <tr key={v.id} className="hover:bg-amber-50/40">
                              <td className="p-2.5 font-mono font-semibold text-slate-800">{v.variantSku}</td>
                              <td className="p-2.5 font-medium text-slate-700">{v.size.hi}</td>
                              <td className="p-2.5 text-slate-600">
                                {v.dimensionsDetail
                                  ? `${v.dimensionsDetail.length}x${v.dimensionsDetail.width} ${v.dimensionsDetail.unit}`
                                  : `${v.dimensionsCm.height}x${v.dimensionsCm.width} cm`}
                              </td>
                              <td className="p-2.5 text-slate-600">{v.loadCapacity || "मानक"}</td>
                              <td className="p-2.5 font-bold text-sarafa-maroon">{formatCurrencyINR(v.retailPrice)}</td>
                              <td className="p-2.5 text-emerald-700 font-semibold">
                                {v.wholesaleTiers?.[0]
                                  ? `${formatCurrencyINR(v.wholesaleTiers[0].pricePerUnit)} (${v.wholesaleTiers[0].minQty}+)`
                                  : "—"}
                              </td>
                              <td className="p-2.5 font-semibold text-slate-800">{v.physicalStock} पीस</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: BUSINESS PROFILE */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-hindi">
                  प्रतिष्ठान मास्टर प्रोफाइल (Business Master Identity)
                </h2>
                <p className="text-xs text-slate-500">
                  सभी वैधानिक विवरण, जीएसटी, पता एवं आधिकारिक विवरण।
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-500 mb-1">कानूनी नाम (Legal Name)</label>
                    <div className="font-semibold text-slate-800 text-sm">{profile.legalName}</div>
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">व्यापारिक नाम (Trade Name)</label>
                    <div className="font-semibold text-slate-800 text-sm">{profile.tradeName}</div>
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">स्थापना वर्ष</label>
                    <div className="font-semibold text-slate-800 text-sm">{profile.foundedYear} (35+ वर्ष)</div>
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">जीएसटी राज्य कोड</label>
                    <div className="font-semibold text-slate-800 text-sm">09 (उत्तर प्रदेश)</div>
                  </div>
                </div>

                <div className="border-t border-stone-100 pt-4 text-xs">
                  <label className="block text-slate-500 mb-1">मुख्यालय एवं निर्माण स्थल</label>
                  <div className="font-semibold text-slate-800">
                    {profile.headquarters.addressLine1}, {profile.headquarters.addressLine2}, {profile.headquarters.city}, {profile.headquarters.state} - {profile.headquarters.pincode}
                  </div>
                  <div className="text-slate-600 mt-1">
                    फोन: {profile.headquarters.phone} • ईमेल: {profile.headquarters.email}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MEDIA REGISTRY & DRIVE ADAPTER */}
          {activeTab === "media" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-hindi">
                  Google Drive मीडिया एकीकरण व कन्वर्टर
                </h2>
                <p className="text-xs text-slate-500">
                  Google Drive फ़ाइल लिंक्स को उच्च गति CDN लिंक्स में बदलें एवं HLD नेमिंग नियमों की जाँच करें।
                </p>
              </div>

              {/* Interactive Tool: Drive URL to CDN & Name Validator */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900 font-hindi">
                  Google Drive लिंक या फ़ाइल नाम टेस्ट करें
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={testDriveLink}
                    onChange={(e) => setTestDriveLink(e.target.value)}
                    placeholder="उदा. https://drive.google.com/file/d/1A2B3C... या JST-VLV-RED_SMALL_FRONT_V1.jpg"
                    className="flex-1 p-2.5 border border-stone-300 rounded-lg text-xs font-mono focus:outline-none focus:border-sarafa-gold"
                  />
                  <button
                    type="button"
                    onClick={handleTestDriveConversion}
                    className="bg-sarafa-maroon hover:bg-sarafa-maroon-dark text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors"
                  >
                    कन्वर्ट व वैलिडेट करें
                  </button>
                </div>

                {convertedCdnUrl && (
                  <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 space-y-2 text-xs">
                    <div className="font-bold text-amber-900">कन्वर्टेड डायरेक्ट CDN URL:</div>
                    <div className="font-mono text-slate-800 break-all select-all bg-white p-2 rounded border border-amber-300">
                      {convertedCdnUrl}
                    </div>
                  </div>
                )}

                {parsedFileNameResult && (
                  <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2 text-xs">
                    <div className="font-bold text-slate-800">फ़ाइल नेमिंग कन्वेंशन विश्लेषण (HLD Sec 4.2):</div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div className="bg-white p-2 rounded border border-stone-200">
                        <span className="text-slate-500 block text-[10px]">उत्पाद SKU:</span>
                        <strong className="text-slate-900">{parsedFileNameResult.productSku}</strong>
                      </div>
                      <div className="bg-white p-2 rounded border border-stone-200">
                        <span className="text-slate-500 block text-[10px]">आकार / साइज़:</span>
                        <strong className="text-slate-900">{parsedFileNameResult.sizeLabel || "—"}</strong>
                      </div>
                      <div className="bg-white p-2 rounded border border-stone-200">
                        <span className="text-slate-500 block text-[10px]">व्यू एंगल:</span>
                        <strong className="text-slate-900 uppercase">{parsedFileNameResult.viewRole}</strong>
                      </div>
                      <div className="bg-white p-2 rounded border border-stone-200">
                        <span className="text-slate-500 block text-[10px]">मान्यता स्थिति:</span>
                        <strong className={parsedFileNameResult.isValidConvention ? "text-emerald-700 font-bold" : "text-amber-700 font-bold"}>
                          {parsedFileNameResult.isValidConvention ? "मान्य (Valid)" : "कस्टम फॉर्मेट"}
                        </strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: SYNC ENGINE */}
          {activeTab === "sync" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-hindi">
                  सिंक्रोनाइज़ेशन इंजन एवं ऑडिट लॉग (Sync Engine & Audit Logs)
                </h2>
                <p className="text-xs text-slate-500">
                  वेबसाइट और Google सेवाओं के बीच स्वचालित डेटा डिलीवरी व बैकऑफ़ रिट्री।
                </p>
              </div>

              {/* Sync Dashboard Table */}
              <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
                <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">हालिया सिंक्रोनाइज़ेशन जॉब्स (Sync Jobs)</span>
                  <span className="text-[11px] text-emerald-700 font-semibold">0 विफल (No Failures)</span>
                </div>
                <table className="w-full text-xs text-left">
                  <thead className="bg-stone-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-stone-200">
                    <tr>
                      <th className="p-3">जॉब आईडी</th>
                      <th className="p-3">लक्ष्य प्लेटफ़ॉर्म</th>
                      <th className="p-3">ऑपरेशन</th>
                      <th className="p-3">स्थिति</th>
                      <th className="p-3">समय</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {syncStatus?.recentJobs ? (
                      syncStatus.recentJobs.map((job: any) => (
                        <tr key={job.id} className="hover:bg-amber-50/40">
                          <td className="p-3 font-mono font-semibold text-slate-700">{job.id}</td>
                          <td className="p-3 capitalize font-medium text-slate-800">{job.target.replace(/_/g, " ")}</td>
                          <td className="p-3 uppercase font-mono text-[11px] text-slate-600">{job.operation}</td>
                          <td className="p-3">
                            <span className="bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full text-[10px]">
                              {job.status}
                            </span>
                          </td>
                          <td className="p-3 text-slate-500 text-[11px]">{new Date(job.updatedAt).toLocaleTimeString()}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-4 text-center text-slate-500">
                          जॉब लोड हो रहे हैं...
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { jstBusinessProfile } from "@/lib/businessProfile";
import { initialProducts } from "@/lib/mockData";
import { GoogleDriveAdapter } from "@/lib/integrations/googleDriveAdapter";
import { formatCurrencyINR } from "@/lib/i18n";
import { AdminRole, AdminUser, getRoleBadgeInfo, hasRoleAccess } from "@/lib/auth";
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
  ArrowRight,
  Scissors,
  LogOut,
  User,
  Shield,
  FolderSearch,
  Check,
  X,
  Filter,
  Eye
} from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);

  const [activeTab, setActiveTab] = useState<"overview" | "products" | "profile" | "media" | "sync" | "custom">("overview");
  const [syncStatus, setSyncStatus] = useState<any>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [testDriveLink, setTestDriveLink] = useState("");
  const [convertedCdnUrl, setConvertedCdnUrl] = useState("");
  const [parsedFileNameResult, setParsedFileNameResult] = useState<any>(null);
  const [customEnquiries, setCustomEnquiries] = useState<any[]>([]);
  const [scannedMedia, setScannedMedia] = useState<any[]>([]);
  const [driveFolderInput, setDriveFolderInput] = useState("1JST_SARAFA_CATALOG_2026_DRIVE_FOLDER");
  const [isScanningDrive, setIsScanningDrive] = useState(false);
  const [mediaFilter, setMediaFilter] = useState<"all" | "pending" | "approved_web" | "approved_google" | "rejected">("all");
  const [mediaActionMessage, setMediaActionMessage] = useState<string | null>(null);

  const profile = jstBusinessProfile;
  const products = initialProducts;
  const totalVariants = products.reduce((acc, p) => acc + p.variants.length, 0);
  const totalStock = products.reduce(
    (acc, p) => acc + p.variants.reduce((vAcc, v) => vAcc + v.physicalStock, 0),
    0
  );

  useEffect(() => {
    // 1. Verify authenticated administrative session
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setCurrentUser(data.user);
        } else {
          router.push("/admin/login?from=/admin");
        }
      })
      .catch(() => router.push("/admin/login?from=/admin"))
      .finally(() => setLoadingSession(false));

    // 2. Fetch admin data
    fetch("/api/admin/sync")
      .then((res) => res.json())
      .then((data) => setSyncStatus(data))
      .catch(() => {});

    fetch("/api/custom-enquiries")
      .then((res) => res.json())
      .then((data) => {
        if (data.enquiries) setCustomEnquiries(data.enquiries);
      })
      .catch(() => {});

    fetch("/api/admin/drive")
      .then((res) => res.json())
      .then((data) => {
        if (data.items) setScannedMedia(data.items);
      })
      .catch(() => {});
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    }
  };

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

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/custom-enquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setCustomEnquiries((prev) =>
          prev.map((item) => (item.id === id ? data.enquiry : item))
        );
      }
    } catch {
      alert("Failed to update status");
    }
  };

  const handleConvertToVariant = async (id: string) => {
    try {
      const res = await fetch("/api/custom-enquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, convertToVariant: true }),
      });
      const data = await res.json();
      if (data.success) {
        setCustomEnquiries((prev) =>
          prev.map((item) => (item.id === id ? data.enquiry : item))
        );
        alert(data.message);
      }
    } catch {
      alert("Conversion failed");
    }
  };

  const handleScanDriveFolder = async () => {
    setIsScanningDrive(true);
    try {
      const res = await fetch("/api/admin/drive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "scan", folderId: driveFolderInput }),
      });
      const data = await res.json();
      if (data.success && data.items) {
        setScannedMedia(data.items);
        setMediaActionMessage(data.message);
        setTimeout(() => setMediaActionMessage(null), 4000);
      }
    } catch {
      alert("Folder scan failed");
    } finally {
      setIsScanningDrive(false);
    }
  };

  const handleUpdateMediaApproval = async (
    mediaId: string,
    target: "website" | "google",
    status: "approved" | "rejected" | "pending"
  ) => {
    try {
      const res = await fetch("/api/admin/drive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve", mediaId, target, status }),
      });
      const data = await res.json();
      if (data.success && data.item) {
        setScannedMedia((prev) =>
          prev.map((m) => (m.id === mediaId ? data.item : m))
        );
        setMediaActionMessage(data.message);
        setTimeout(() => setMediaActionMessage(null), 4000);
      } else {
        alert(data.message || "Failed to update media status");
      }
    } catch {
      alert("Media update error");
    }
  };

  const handleTestDriveConversion = () => {
    if (!testDriveLink.trim()) return;
    const directUrl = GoogleDriveAdapter.getDirectCdnUrl(testDriveLink.trim());
    setConvertedCdnUrl(directUrl);
    const parsed = GoogleDriveAdapter.parseFileName(testDriveLink.trim());
    setParsedFileNameResult(parsed);
  };

  if (loadingSession) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300">
        <div className="w-10 h-10 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold tracking-wide text-gold-400">
          प्रशासनिक प्रमाणीकरण की पुष्टि हो रही है...
        </p>
        <p className="text-xs text-slate-500 mt-1">
          Verifying cryptographic session signature
        </p>
      </div>
    );
  }

  const roleBadge = currentUser ? getRoleBadgeInfo(currentUser.role) : null;
  const userRole = currentUser?.role || "super_admin";

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans">
      {/* Admin Top Header */}
      <header className="bg-slate-900 text-white px-6 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gold-gradient text-sarafa-maroon-dark font-bold text-lg flex items-center justify-center shrink-0">
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

        <div className="flex items-center gap-3 text-xs">
          {/* Authenticated User & Role Badge */}
          {currentUser && roleBadge && (
            <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700/80 px-3 py-1.5 rounded-xl">
              <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <div className="text-left hidden sm:block">
                <div className="text-[11px] font-semibold text-slate-200 leading-tight">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-slate-400 leading-tight">
                  {currentUser.email}
                </div>
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${roleBadge.bg} ${roleBadge.text} ${roleBadge.border}`}>
                {roleBadge.label}
              </span>
            </div>
          )}

          <Link
            href="/"
            className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700"
          >
            <Globe className="w-3.5 h-3.5 text-sarafa-gold" />
            <span className="hidden sm:inline">लाइव वेबसाइट देखें (View Storefront)</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            title="लॉगआउट (Sign Out)"
            className="flex items-center gap-1.5 text-red-300 hover:text-red-200 transition-colors bg-red-950/40 hover:bg-red-900/50 px-3 py-1.5 rounded-xl border border-red-800/50 font-semibold"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">लॉगआउट</span>
          </button>
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
            
            {/* Overview (All roles) */}
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

            {/* Products (All roles) */}
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

            {/* Profile (Super Admin only) */}
            {hasRoleAccess(userRole, ["super_admin"]) && (
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
            )}

            {/* Media Registry (Super Admin & Ops) */}
            {hasRoleAccess(userRole, ["super_admin", "admin_ops"]) && (
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
            )}

            {/* Sync Engine (Super Admin & Ops) */}
            {hasRoleAccess(userRole, ["super_admin", "admin_ops"]) && (
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
            )}

            {/* Custom CRM (Super Admin & Sales) */}
            {hasRoleAccess(userRole, ["super_admin", "admin_sales"]) && (
              <button
                type="button"
                onClick={() => setActiveTab("custom")}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === "custom"
                    ? "bg-sarafa-maroon text-white shadow-sm"
                    : "hover:bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <Scissors className="w-4 h-4 text-sarafa-gold" />
                <span>कस्टम ऑर्डर व कोटेशन CRM</span>
              </button>
            )}
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 font-hindi flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-sarafa-maroon" />
                    Google Drive मीडिया रजिस्ट्री एवं अनुमोदन ग्रिड
                  </h2>
                  <p className="text-xs text-slate-500">
                    Google Drive कैटलॉग स्कैन करें, HLD 4.2 नेमिंग नियमों की जाँच करें, तथा Section 8.2 के अनुसार वेबसाइट व Google Business Profile के लिए स्वीकृत करें।
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    कुल पंजीकृत मीडिया: {scannedMedia.length}
                  </span>
                </div>
              </div>

              {mediaActionMessage && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center gap-2 shadow-xs animate-fade-in">
                  <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>{mediaActionMessage}</span>
                </div>
              )}

              {/* 1. Live Google Drive Folder Scanner */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 font-hindi flex items-center gap-2">
                      <FolderSearch className="w-4 h-4 text-sarafa-gold" />
                      Google Drive कैटलॉग फ़ोल्डर लाइव स्कैनर
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      निर्दिष्ट फ़ोल्डर ID या Drive शेयर लिंक प्रविष्ट कर नए उत्पाद चित्र व ब्रांडिंग मीडिया स्वचालित रूप से खोजें।
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDriveFolderInput("1JST_SARAFA_CATALOG_2026_DRIVE_FOLDER")}
                    className="text-[11px] text-sarafa-maroon hover:underline font-semibold"
                  >
                    डिफ़ॉल्ट कैटलॉग फ़ोल्डर सेट करें
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={driveFolderInput}
                    onChange={(e) => setDriveFolderInput(e.target.value)}
                    placeholder="Google Drive फ़ोल्डर ID या लिंक (उदा. 1JST_SARAFA_CATALOG_2026_DRIVE_FOLDER)"
                    className="flex-1 p-2.5 border border-stone-300 rounded-xl text-xs font-mono focus:outline-none focus:border-sarafa-gold"
                  />
                  <button
                    type="button"
                    onClick={handleScanDriveFolder}
                    disabled={isScanningDrive}
                    className="bg-sarafa-maroon hover:bg-sarafa-maroon-dark text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {isScanningDrive ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        फ़ोल्डर स्कैन हो रहा है...
                      </>
                    ) : (
                      <>
                        <FolderSearch className="w-4 h-4" />
                        स्कैन करें (Scan Folder)
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* 2. Interactive Media Approval Grid */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 font-hindi flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      मीडिया अनुमोदन एवं Google सिंक ग्रिड (Media Approval Grid)
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      वेबसाइट कैटलॉग तथा Google Business Profile (Section 8.2) प्रकाशन नियंत्रण।
                    </p>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex flex-wrap gap-1 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setMediaFilter("all")}
                      className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                        mediaFilter === "all"
                          ? "bg-slate-900 text-white font-bold"
                          : "bg-stone-100 text-slate-600 hover:bg-stone-200"
                      }`}
                    >
                      सभी ({scannedMedia.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setMediaFilter("pending")}
                      className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                        mediaFilter === "pending"
                          ? "bg-amber-600 text-white font-bold"
                          : "bg-amber-50 text-amber-800 hover:bg-amber-100"
                      }`}
                    >
                      लंबित (
                      {
                        scannedMedia.filter(
                          (m) =>
                            m.approvalStatusWebsite === "pending" ||
                            (m.eligibleForGoogleBusiness && m.approvalStatusGoogle === "pending")
                        ).length
                      }
                      )
                    </button>
                    <button
                      type="button"
                      onClick={() => setMediaFilter("approved_web")}
                      className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                        mediaFilter === "approved_web"
                          ? "bg-emerald-700 text-white font-bold"
                          : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                      }`}
                    >
                      वेबसाइट स्वीकृत (
                      {scannedMedia.filter((m) => m.approvalStatusWebsite === "approved").length}
                      )
                    </button>
                    <button
                      type="button"
                      onClick={() => setMediaFilter("approved_google")}
                      className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                        mediaFilter === "approved_google"
                          ? "bg-blue-700 text-white font-bold"
                          : "bg-blue-50 text-blue-800 hover:bg-blue-100"
                      }`}
                    >
                      Google स्वीकृत (
                      {scannedMedia.filter((m) => m.approvalStatusGoogle === "approved").length}
                      )
                    </button>
                  </div>
                </div>

                {/* Grid Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {scannedMedia
                    .filter((item) => {
                      if (mediaFilter === "pending") {
                        return (
                          item.approvalStatusWebsite === "pending" ||
                          (item.eligibleForGoogleBusiness && item.approvalStatusGoogle === "pending")
                        );
                      }
                      if (mediaFilter === "approved_web") {
                        return item.approvalStatusWebsite === "approved";
                      }
                      if (mediaFilter === "approved_google") {
                        return item.approvalStatusGoogle === "approved";
                      }
                      return true;
                    })
                    .map((item) => {
                      const meta = item.parsedMetadata || {};
                      const isWebApproved = item.approvalStatusWebsite === "approved";
                      const isGoogleApproved = item.approvalStatusGoogle === "approved";
                      const isGoogleEligible = item.eligibleForGoogleBusiness;

                      return (
                        <div
                          key={item.id}
                          className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden"
                        >
                          <div>
                            {/* Card Top: Thumbnail & File Meta */}
                            <div className="flex items-start gap-3 mb-3">
                              <div className="w-16 h-16 rounded-xl bg-stone-200 border border-stone-300 flex items-center justify-center shrink-0 overflow-hidden relative">
                                <ImageIcon className="w-8 h-8 text-stone-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4
                                  className="text-xs font-bold text-slate-900 truncate"
                                  title={item.name}
                                >
                                  {item.name}
                                </h4>
                                <div className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">
                                  ID: {item.driveFileId}
                                </div>
                                <div className="text-[10px] text-slate-400 mt-0.5">
                                  साइज: {Math.round((item.sizeBytes || 500000) / 1024)} KB
                                </div>
                              </div>
                            </div>

                            {/* Parsed Metadata Pills (HLD Section 4.2) */}
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              <span className="bg-white border border-stone-300 text-slate-800 text-[10px] font-mono px-2 py-0.5 rounded-md font-semibold">
                                SKU: {meta.productSku}
                              </span>
                              {meta.sizeLabel && (
                                <span className="bg-white border border-stone-300 text-slate-700 text-[10px] px-2 py-0.5 rounded-md">
                                  साइज़: {meta.sizeLabel}
                                </span>
                              )}
                              <span className="bg-white border border-stone-300 text-slate-700 text-[10px] uppercase px-2 py-0.5 rounded-md">
                                व्यू: {meta.viewRole}
                              </span>
                              <span className="bg-white border border-stone-300 text-slate-500 text-[10px] px-1.5 py-0.5 rounded-md">
                                {meta.version}
                              </span>
                            </div>

                            {/* Policy & Eligibility Badge */}
                            <div className="mb-4">
                              {isGoogleEligible ? (
                                <div className="text-[10px] bg-blue-50 text-blue-800 border border-blue-200 p-2 rounded-lg leading-tight flex items-start gap-1.5">
                                  <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                                  <span>
                                    <strong>Google नीति 8.2:</strong> प्रतिष्ठान या मुख्य लोगो चित्र — Google Business Profile हेतु मान्य।
                                  </span>
                                </div>
                              ) : (
                                <div className="text-[10px] bg-stone-200/60 text-slate-600 border border-stone-300 p-2 rounded-lg leading-tight flex items-start gap-1.5">
                                  <AlertCircle className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                                  <span>
                                    <strong>Google नीति 8.2:</strong> वेरियंट-विशिष्ट चित्र — Google Business Profile से बाहर, केवल वेबसाइट पर मान्य।
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Approval Controls */}
                          <div className="pt-3 border-t border-stone-200 space-y-2">
                            {/* Website Approval Row */}
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-[11px] font-semibold text-slate-700">
                                वेबसाइट कैटलॉग:
                              </span>
                              <div className="flex items-center gap-1">
                                {isWebApproved ? (
                                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-emerald-300">
                                    ✓ लाइव स्वीकृत
                                  </span>
                                ) : (
                                  <span className="bg-amber-100 text-amber-800 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-amber-300">
                                    लंबित
                                  </span>
                                )}
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleUpdateMediaApproval(
                                      item.id,
                                      "website",
                                      isWebApproved ? "rejected" : "approved"
                                    )
                                  }
                                  className={`text-[10px] font-bold px-2 py-1 rounded transition-colors ${
                                    isWebApproved
                                      ? "bg-stone-200 hover:bg-stone-300 text-slate-700"
                                      : "bg-emerald-600 hover:bg-emerald-700 text-white"
                                  }`}
                                >
                                  {isWebApproved ? "हटाएँ" : "स्वीकृत करें"}
                                </button>
                              </div>
                            </div>

                            {/* Google Business Approval Row */}
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-[11px] font-semibold text-slate-700">
                                Google Business:
                              </span>
                              <div className="flex items-center gap-1">
                                {isGoogleApproved ? (
                                  <span className="bg-blue-100 text-blue-800 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-blue-300">
                                    ✓ सिंक स्वीकृत
                                  </span>
                                ) : isGoogleEligible ? (
                                  <span className="bg-stone-100 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-stone-200">
                                    लंबित
                                  </span>
                                ) : (
                                  <span className="bg-stone-100 text-slate-400 text-[10px] px-1.5 py-0.5 rounded-md">
                                    अपात्र
                                  </span>
                                )}

                                {isGoogleEligible && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleUpdateMediaApproval(
                                        item.id,
                                        "google",
                                        isGoogleApproved ? "rejected" : "approved"
                                      )
                                    }
                                    className={`text-[10px] font-bold px-2 py-1 rounded transition-colors ${
                                      isGoogleApproved
                                        ? "bg-stone-200 hover:bg-stone-300 text-slate-700"
                                        : "bg-blue-600 hover:bg-blue-700 text-white"
                                    }`}
                                  >
                                    {isGoogleApproved ? "हटाएँ" : "स्वीकृत करें"}
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* 3. Interactive Tool: Drive URL to CDN & Name Validator */}
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

          {/* TAB 6: CUSTOM MANUFACTURING CRM & CONVERTER (PHASE 3) */}
          {activeTab === "custom" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 font-hindi">
                    कस्टम विनिर्माण पूछताछ एवं कोटेशन CRM (Phase 3)
                  </h2>
                  <p className="text-xs text-slate-500">
                    ग्राहक विनिर्देशों की समीक्षा करें, लाइफसाइकिल स्थिति अद्यतन करें एवं लोकप्रिय नाप को मानक SKU में बदलें।
                  </p>
                </div>
                <Link
                  href="/custom-manufacturing"
                  target="_blank"
                  className="text-xs bg-sarafa-maroon text-white font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 hover:bg-sarafa-maroon-dark transition-colors shrink-0"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>पब्लिक कस्टम बिल्डर देखें</span>
                </Link>
              </div>

              {/* Enquiries List */}
              <div className="space-y-4">
                {customEnquiries.length > 0 ? (
                  customEnquiries.map((enq) => (
                    <div
                      key={enq.id}
                      className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                        <div>
                          <div className="text-xs font-mono font-bold text-sarafa-maroon flex items-center gap-2">
                            <span>{enq.referenceId}</span>
                            <span className="text-[10px] text-slate-400 font-normal">
                              ({new Date(enq.createdAt).toLocaleDateString()})
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-slate-900 font-hindi">
                            {enq.shopName}
                          </h3>
                          <div className="text-xs text-slate-500">
                            संपर्क: {enq.contactPerson} • {enq.phone} • {enq.city}
                          </div>
                        </div>

                        {/* Status Lifecycle Dropdown */}
                        <div className="flex items-center gap-2">
                          <label className="text-[11px] text-slate-500 font-medium">स्थिति (Status):</label>
                          <select
                            value={enq.status}
                            onChange={(e) => handleStatusChange(enq.id, e.target.value)}
                            className="text-xs p-1.5 border border-stone-300 rounded-lg bg-white font-semibold text-slate-800"
                          >
                            <option value="submitted">1. दर्ज हुआ (Submitted)</option>
                            <option value="under_review">2. समीक्षा में (Under Review)</option>
                            <option value="spec_confirmed">3. नाप पक्की हुई (Spec Confirmed)</option>
                            <option value="quotation_sent">4. कोटेशन भेजा गया (Quotation Sent)</option>
                            <option value="approved">5. स्वीकृत (Approved)</option>
                            <option value="in_production">6. उत्पादन में (In Production)</option>
                            <option value="completed">7. पूर्ण (Completed)</option>
                            <option value="rejected">अस्वीकृत (Rejected)</option>
                          </select>
                        </div>
                      </div>

                      {/* Specs Matrix */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-50 p-3.5 rounded-xl border border-stone-200 text-xs">
                        <div>
                          <span className="text-slate-500 block text-[10px]">बैग का प्रकार:</span>
                          <strong className="text-slate-800">{enq.bagType}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">कस्टम नाप:</span>
                          <strong className="text-slate-800">
                            {enq.dimensions.width}x{enq.dimensions.height}
                            {enq.dimensions.gusset ? `x${enq.dimensions.gusset}` : ""} {enq.dimensions.unit}
                          </strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">कपड़ा / जीएसएम:</span>
                          <strong className="text-slate-800">{enq.material}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">लोगो / ब्रांडिंग:</span>
                          <strong className="text-slate-800">{enq.brandingTechnique}</strong>
                        </div>
                      </div>

                      {/* Financials & Action Buttons */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs">
                        <div className="flex items-center gap-4">
                          <span>
                            मात्रा: <strong>{enq.targetQuantity} पीस</strong>
                          </span>
                          <span>
                            अनुमानित दर: <strong className="text-sarafa-maroon">{formatCurrencyINR(enq.estimatedUnitRate)}</strong>/पीस
                          </span>
                          <span>
                            कुल: <strong className="text-emerald-700 font-bold">{formatCurrencyINR(enq.estimatedTotal)}</strong>
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Phase 3: Convert to standard variant button */}
                          {enq.isConvertedToVariant ? (
                            <span className="bg-emerald-100 text-emerald-800 font-mono text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-emerald-300">
                              ✓ मानक SKU: {enq.convertedSku}
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleConvertToVariant(enq.id)}
                              className="bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                              title="इस कस्टम नाप को नियमित कैटलॉग वेरियंट में जोड़ें"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                              <span>मानक वेरियंट में बदलें (Convert to SKU)</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {enq.statusNotes && (
                        <div className="text-[11px] text-slate-500 bg-amber-50/60 p-2 rounded-lg border border-amber-100">
                          <strong>नोट्स:</strong> {enq.statusNotes}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="bg-white p-8 text-center rounded-2xl border border-stone-200 text-xs text-slate-500">
                    कोई कस्टम पूछताछ दर्ज नहीं है।
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

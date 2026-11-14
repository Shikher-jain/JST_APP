"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Lock, Mail, ArrowRight, Sparkles, Building2, AlertCircle, KeyRound, CheckCircle2 } from "lucide-react";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("from") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const presets = [
    {
      role: "Super Admin",
      email: "superadmin@jainsarafathella.com",
      pass: "JstSuperAdmin@1990",
      description: "Full control: Catalogue, Media Approval, Sync & CRM",
      badgeColor: "bg-red-500/10 text-red-400 border-red-500/30",
    },
    {
      role: "Sales & CRM",
      email: "sales@jainsarafathella.com",
      pass: "JstSales@1990",
      description: "Custom Enquiries, Wholesale Quotations & Catalogue",
      badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    },
    {
      role: "Manufacturing & Ops",
      email: "ops@jainsarafathella.com",
      pass: "JstOps@1990",
      description: "Production Pipeline, Drive Ingestion & Google Sync",
      badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    },
  ];

  const handleSelectPreset = (p: typeof presets[0]) => {
    setEmail(p.email);
    setPassword(p.pass);
    setActivePreset(p.role);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Authentication failed. Please verify credentials.");
        setLoading(false);
        return;
      }

      // Successful login
      router.push(redirectPath);
      router.refresh();
    } catch (err: any) {
      setError("Network or authentication server error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 backdrop-blur-xl py-8 px-6 sm:px-10 rounded-3xl shadow-2xl relative">
      {/* Quick Demo Role Presets */}
      <div className="mb-8 p-4 bg-slate-950/60 border border-slate-800 rounded-2xl">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            Quick Role Evaluator
          </span>
          <span className="text-[11px] text-slate-500">1-Click Auto Fill</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {presets.map((p) => {
            const isSelected = activePreset === p.role;
            return (
              <button
                key={p.role}
                type="button"
                onClick={() => handleSelectPreset(p)}
                className={`text-left p-2.5 rounded-xl border text-xs transition-all ${
                  isSelected
                    ? "bg-gold-500/15 border-gold-400 text-white shadow-md shadow-gold-900/20"
                    : "bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700"
                }`}
              >
                <div className="font-semibold text-slate-200 flex items-center justify-between">
                  {p.role}
                  {isSelected && <CheckCircle2 className="w-3 h-3 text-gold-400" />}
                </div>
                <div className="text-[10px] text-slate-400 mt-1 leading-tight line-clamp-2">
                  {p.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/50 border border-red-500/40 text-red-200 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-300">Authentication Failed</p>
            <p className="text-xs mt-0.5 text-red-300/80">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
            Administrator Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@jainsarafathella.com"
              className="block w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
            Access Key / Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••••••"
              className="block w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-slate-950 font-bold rounded-xl text-sm shadow-lg shadow-gold-950/60 transition-all disabled:opacity-50"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              Verifying Cryptographic Credentials...
            </>
          ) : (
            <>
              <KeyRound className="w-4 h-4" />
              Authenticate & Enter Console
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1.5 text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          HMAC-SHA256 Encrypted Session
        </span>
        <Link
          href="/"
          className="text-gold-400 hover:text-gold-300 font-medium transition-colors"
        >
          ← Back to Storefront
        </Link>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-500/20 to-gold-700/10 border border-gold-500/30 shadow-lg shadow-gold-950/50 mb-4">
          <Building2 className="w-8 h-8 text-gold-400" />
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
          Jain Sarafa Thella
        </h1>
        <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-gold-400">
          Est. 1990 • Agra Sarafa Chowk
        </p>
        <p className="mt-2 text-sm text-slate-400">
          Central Administrative & Wholesale Operations Gateway
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl relative z-10 px-4 sm:px-0">
        <Suspense
          fallback={
            <div className="bg-slate-900/90 border border-slate-800 p-8 rounded-3xl text-center text-slate-400 text-sm">
              <div className="w-6 h-6 border-2 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              Loading security portal...
            </div>
          }
        >
          <AdminLoginForm />
        </Suspense>

        <p className="mt-6 text-center text-xs text-slate-400">
          Authorized Sarafa Chowk personnel only. Access and quotation modifications are audited.
        </p>
      </div>
    </div>
  );
}

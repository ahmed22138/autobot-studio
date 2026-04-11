"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Copy, Check, Upload, Loader2, CheckCircle, ArrowLeft, Smartphone, Building2, Wallet } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const PLAN_INFO: Record<string, { label: string; pricePKR: number; color: string }> = {
  medium:  { label: "Medium",  pricePKR: 15000, color: "blue"   },
  premium: { label: "Premium", pricePKR: 60000, color: "purple" },
};

// Payment details — set these in Vercel env vars
const PAYMENT_METHODS = [
  {
    id: "jazzcash",
    label: "JazzCash",
    icon: Smartphone,
    color: "red",
    fields: [
      { key: "name",   label: "Account Name",   value: process.env.NEXT_PUBLIC_JAZZCASH_NAME   || "AutoBot Studio" },
      { key: "number", label: "Mobile Number",  value: process.env.NEXT_PUBLIC_JAZZCASH_NUMBER || "03XX-XXXXXXX"   },
    ],
  },
  {
    id: "easypaisa",
    label: "EasyPaisa",
    icon: Wallet,
    color: "green",
    fields: [
      { key: "name",   label: "Account Name",   value: process.env.NEXT_PUBLIC_EASYPAISA_NAME   || "AutoBot Studio" },
      { key: "number", label: "Mobile Number",  value: process.env.NEXT_PUBLIC_EASYPAISA_NUMBER || "03XX-XXXXXXX"   },
    ],
  },
  {
    id: "bank",
    label: "Bank Transfer",
    icon: Building2,
    color: "blue",
    fields: [
      { key: "bank",    label: "Bank Name",     value: process.env.NEXT_PUBLIC_BANK_NAME         || "HBL / Meezan"   },
      { key: "name",    label: "Account Name",  value: process.env.NEXT_PUBLIC_BANK_ACCOUNT_NAME || "AutoBot Studio" },
      { key: "account", label: "Account No",   value: process.env.NEXT_PUBLIC_BANK_ACCOUNT      || "XXXX-XXXXXXXXX" },
    ],
  },
];

function CopyField({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="ml-2 p-1 rounded hover:bg-white/10 transition-colors flex-shrink-0">
      {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-500" />}
    </button>
  );
}

export default function PaymentPage() {
  const params  = useParams();
  const router  = useRouter();
  const plan    = (params.plan as string)?.toLowerCase();
  const info    = PLAN_INFO[plan];

  const [selectedMethod, setSelectedMethod] = useState("jazzcash");
  const [screenshot, setScreenshot]         = useState<string | null>(null);
  const [screenshotName, setScreenshotName] = useState("");
  const [note, setNote]                     = useState("");
  const [loading, setLoading]               = useState(false);
  const [submitted, setSubmitted]           = useState(false);
  const [error, setError]                   = useState("");
  const [user, setUser]                     = useState<{ id: string; email: string } | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push("/login?redirect=/pricing"); return; }
      setUser({ id: user.id, email: user.email || "" });
    });
  }, [router]);

  if (!info) {
    return (
      <main className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Invalid plan</p>
          <button onClick={() => router.push("/pricing")} className="text-blue-400 hover:underline">← Back to Pricing</button>
        </div>
      </main>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Please upload an image file."); return; }
    if (file.size > 5 * 1024 * 1024) { setError("Image too large. Max 5MB."); return; }
    setError("");
    setScreenshotName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => setScreenshot(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!screenshot) { setError("Please upload your payment screenshot."); return; }
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/payments/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          amount_pkr: info.pricePKR,
          payment_method: selectedMethod,
          screenshot,
          note,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
      setSubmitted(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Payment Submitted!</h2>
          <p className="text-zinc-400 mb-2">
            Tumhara <span className="text-white font-medium">{info.label}</span> plan request submit ho gaya.
          </p>
          <p className="text-zinc-500 text-sm mb-6">
            Hum 1-6 ghante mein verify karke activate kar denge. Confirmation email {user?.email} pe aayega.
          </p>
          <div className="bg-white/5 rounded-xl p-4 mb-6 text-left space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Plan</span>
              <span className="text-white font-medium">{info.label}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Amount</span>
              <span className="text-green-400 font-medium">PKR {info.pricePKR.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Method</span>
              <span className="text-white capitalize">{selectedMethod}</span>
            </div>
          </div>
          <button onClick={() => router.push("/dashboard")}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:from-blue-600 hover:to-purple-700 transition-all">
            Go to Dashboard
          </button>
        </motion.div>
      </main>
    );
  }

  const method = PAYMENT_METHODS.find(m => m.id === selectedMethod)!;

  const colorClass: Record<string, string> = {
    red:    "border-red-500/40 bg-red-500/10",
    green:  "border-green-500/40 bg-green-500/10",
    blue:   "border-blue-500/40 bg-blue-500/10",
    purple: "border-purple-500/40 bg-purple-500/10",
  };
  const textClass: Record<string, string> = {
    red: "text-red-400", green: "text-green-400", blue: "text-blue-400", purple: "text-purple-400",
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f] px-4 py-12">
      <div className="max-w-xl mx-auto">

        {/* Back */}
        <button onClick={() => router.push("/pricing")} className="flex items-center gap-2 text-zinc-500 hover:text-white text-sm mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Pricing
        </button>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Complete Payment</h1>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${colorClass[info.color]}`}>
              <span className={textClass[info.color]}>{info.label} Plan</span>
            </span>
            <span className="text-zinc-400">PKR {info.pricePKR.toLocaleString()}/month</span>
          </div>
        </motion.div>

        <div className="space-y-6">

          {/* Step 1: Choose Method */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <p className="text-white font-semibold mb-4">Step 1 — Payment Method Choose Karo</p>
            <div className="grid grid-cols-3 gap-3">
              {PAYMENT_METHODS.map((m) => {
                const Icon = m.icon;
                const isSelected = selectedMethod === m.id;
                return (
                  <button key={m.id} onClick={() => setSelectedMethod(m.id)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                      isSelected ? `${colorClass[m.color]} border-${m.color}-500/50` : "bg-white/5 border-white/10 hover:bg-white/10"
                    }`}>
                    <Icon className={`w-5 h-5 ${isSelected ? textClass[m.color] : "text-zinc-400"}`} />
                    <span className={`text-xs font-medium ${isSelected ? textClass[m.color] : "text-zinc-400"}`}>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Step 2: Payment Details */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <p className="text-white font-semibold mb-4">Step 2 — Yahan Payment Karo</p>
            <div className={`rounded-xl border p-5 space-y-4 ${colorClass[method.color]}`}>
              <div className="flex items-center gap-2 mb-2">
                <method.icon className={`w-5 h-5 ${textClass[method.color]}`} />
                <span className={`font-semibold ${textClass[method.color]}`}>{method.label}</span>
              </div>
              {method.fields.map((f) => (
                <div key={f.key} className="flex items-center justify-between bg-black/20 rounded-lg px-4 py-3">
                  <div>
                    <p className="text-zinc-500 text-xs mb-0.5">{f.label}</p>
                    <p className="text-white font-medium">{f.value}</p>
                  </div>
                  <CopyField value={f.value} />
                </div>
              ))}
              <div className="flex items-center justify-between bg-black/20 rounded-lg px-4 py-3">
                <div>
                  <p className="text-zinc-500 text-xs mb-0.5">Amount</p>
                  <p className="text-green-400 font-bold text-lg">PKR {info.pricePKR.toLocaleString()}</p>
                </div>
                <CopyField value={info.pricePKR.toString()} />
              </div>
            </div>
            <p className="text-zinc-500 text-xs mt-3">
              ⚠️ Exact amount bhejo — kam ya zyada bheja to verify nahi hoga
            </p>
          </motion.div>

          {/* Step 3: Screenshot */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <p className="text-white font-semibold mb-4">Step 3 — Payment Screenshot Upload Karo</p>

            <label className={`flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
              screenshot ? "border-green-500/50 bg-green-500/5" : "border-white/20 hover:border-white/40 hover:bg-white/5"
            }`}>
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              {screenshot ? (
                <div className="text-center">
                  <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-green-400 text-sm font-medium">{screenshotName}</p>
                  <p className="text-zinc-500 text-xs mt-1">Click to change</p>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
                  <p className="text-zinc-400 text-sm">Click to upload screenshot</p>
                  <p className="text-zinc-600 text-xs mt-1">JPG, PNG — max 5MB</p>
                </div>
              )}
            </label>

            {/* Optional note */}
            <div className="mt-4">
              <label className="block text-zinc-500 text-sm mb-2">Note (optional)</label>
              <input
                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-600 outline-none focus:border-blue-500/50 text-sm"
                placeholder="Transaction ID ya koi aur info..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </motion.div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Submit */}
          <motion.button
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            onClick={handleSubmit}
            disabled={loading || !screenshot}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold text-base transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</>
            ) : (
              "Submit Payment Request"
            )}
          </motion.button>

          <p className="text-zinc-600 text-xs text-center">
            Submit karne ke baad 1-6 ghante mein plan activate ho jata hai
          </p>
        </div>
      </div>
    </main>
  );
}

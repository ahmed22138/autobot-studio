"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader2, Eye, Clock, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface PaymentRequest {
  id: string;
  user_email: string;
  plan: string;
  amount_pkr: number;
  payment_method: string;
  screenshot: string;
  note: string | null;
  status: "pending" | "approved" | "rejected";
  admin_note: string | null;
  created_at: string;
}

const ADMIN_EMAILS = ["dj9581907@gmail.com", "workb9382@gmail.com"];

export default function AdminPaymentsPage() {
  const router = useRouter();
  const [requests, setRequests]     = useState<PaymentRequest[]>([]);
  const [loading, setLoading]       = useState(true);
  const [actionId, setActionId]     = useState<string | null>(null);
  const [viewImg, setViewImg]       = useState<string | null>(null);
  const [rejectId, setRejectId]     = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [filter, setFilter]         = useState<"pending" | "approved" | "rejected" | "all">("pending");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user || !ADMIN_EMAILS.includes((user.email || "").toLowerCase())) {
        router.push("/dashboard");
      }
    });
    loadRequests();
  }, [router]);

  const loadRequests = async () => {
    setLoading(true);
    const res = await fetch("/api/payments/list");
    if (res.ok) {
      const data = await res.json();
      setRequests(data.requests || []);
    }
    setLoading(false);
  };

  const approve = async (id: string) => {
    setActionId(id);
    const res = await fetch("/api/payments/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ request_id: id }),
    });
    if (res.ok) {
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "approved" } : r));
    }
    setActionId(null);
  };

  const reject = async (id: string) => {
    setActionId(id);
    const res = await fetch("/api/payments/reject", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ request_id: id, reason: rejectReason }),
    });
    if (res.ok) {
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "rejected", admin_note: rejectReason } : r));
    }
    setActionId(null);
    setRejectId(null);
    setRejectReason("");
  };

  const filtered = filter === "all" ? requests : requests.filter(r => r.status === filter);
  const pendingCount = requests.filter(r => r.status === "pending").length;

  return (
    <main className="min-h-screen bg-[#0a0a0f] px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Payment Requests</h1>
            <p className="text-zinc-500 text-sm">Subscription payments approve/reject karo</p>
          </div>
          {pendingCount > 0 && (
            <span className="ml-auto px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-sm font-medium border border-amber-500/30">
              {pendingCount} pending
            </span>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2">
          {(["pending", "approved", "rejected", "all"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs capitalize transition-all border ${
                filter === f ? "bg-blue-500/20 text-blue-400 border-blue-500/30" : "bg-white/5 text-zinc-400 border-white/10 hover:bg-white/10"
              }`}>
              {f}
              {f === "pending" && pendingCount > 0 && <span className="ml-1.5 bg-amber-500 text-black text-[10px] px-1.5 rounded-full">{pendingCount}</span>}
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">
            <Clock className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Koi {filter === "all" ? "" : filter} requests nahi</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((req, i) => (
              <motion.div key={req.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-white/5 border border-white/10 rounded-xl p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  {/* Info */}
                  <div className="space-y-1">
                    <p className="text-white font-medium">{req.user_email}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="capitalize text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">{req.plan}</span>
                      <span className="text-emerald-400 font-bold text-sm">PKR {req.amount_pkr?.toLocaleString()}</span>
                      <span className="capitalize text-xs text-zinc-500">{req.payment_method}</span>
                    </div>
                    {req.note && <p className="text-zinc-500 text-xs">Note: {req.note}</p>}
                    <p className="text-zinc-600 text-xs">{new Date(req.created_at).toLocaleString("en-PK")}</p>
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-2">
                    {req.status === "pending" && <span className="flex items-center gap-1 text-xs text-amber-400"><Clock className="w-3 h-3" /> Pending</span>}
                    {req.status === "approved" && <span className="flex items-center gap-1 text-xs text-green-400"><CheckCircle className="w-3 h-3" /> Approved</span>}
                    {req.status === "rejected" && <span className="flex items-center gap-1 text-xs text-red-400"><XCircle className="w-3 h-3" /> Rejected</span>}
                  </div>
                </div>

                {/* Screenshot + Actions */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5 flex-wrap gap-3">
                  <button onClick={() => setViewImg(req.screenshot)}
                    className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors">
                    <Eye className="w-3.5 h-3.5" /> View Screenshot
                  </button>

                  {req.status === "pending" && (
                    <div className="flex items-center gap-2">
                      <button onClick={() => approve(req.id)} disabled={actionId === req.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 text-xs transition-all disabled:opacity-50">
                        {actionId === req.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                        Approve
                      </button>
                      <button onClick={() => setRejectId(req.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs transition-all">
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                    </div>
                  )}
                  {req.status === "rejected" && req.admin_note && (
                    <p className="text-red-400/70 text-xs">Reason: {req.admin_note}</p>
                  )}
                </div>

                {/* Reject reason input */}
                {rejectId === req.id && (
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
                    <input
                      className="w-full p-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-zinc-600 text-sm outline-none"
                      placeholder="Rejection reason (optional)"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <button onClick={() => reject(req.id)} disabled={actionId === req.id}
                        className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 text-xs hover:bg-red-500/30 transition-all disabled:opacity-50">
                        {actionId === req.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Confirm Reject"}
                      </button>
                      <button onClick={() => { setRejectId(null); setRejectReason(""); }}
                        className="px-4 py-2 rounded-lg bg-white/5 text-zinc-400 text-xs hover:bg-white/10 transition-all">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Screenshot modal */}
      {viewImg && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setViewImg(null)}>
          <div className="relative max-w-lg w-full" onClick={e => e.stopPropagation()}>
            <button onClick={() => setViewImg(null)} className="absolute -top-10 right-0 text-white/60 hover:text-white text-sm">
              ✕ Close
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={viewImg} alt="Payment screenshot" className="w-full rounded-xl border border-white/10" />
          </div>
        </div>
      )}
    </main>
  );
}

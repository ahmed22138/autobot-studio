"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle, XCircle, Loader2, Eye, Clock,
  CreditCard, RefreshCw, TrendingUp,
} from "lucide-react";

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

export default function AdminPaymentsPage() {
  const [requests, setRequests]         = useState<PaymentRequest[]>([]);
  const [loading, setLoading]           = useState(true);
  const [actionId, setActionId]         = useState<string | null>(null);
  const [viewImg, setViewImg]           = useState<string | null>(null);
  const [rejectId, setRejectId]         = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [filter, setFilter]             = useState<"pending" | "approved" | "rejected" | "all">("pending");

  useEffect(() => { loadRequests(); }, []);

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
    } else {
      const data = await res.json().catch(() => ({}));
      alert(`Approve failed: ${data.error || res.status}`);
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
      setRequests(prev => prev.map(r =>
        r.id === id ? { ...r, status: "rejected", admin_note: rejectReason } : r
      ));
    }
    setActionId(null);
    setRejectId(null);
    setRejectReason("");
  };

  const filtered   = filter === "all" ? requests : requests.filter(r => r.status === filter);
  const pending    = requests.filter(r => r.status === "pending").length;
  const approved   = requests.filter(r => r.status === "approved").length;
  const totalPKR   = requests.filter(r => r.status === "approved").reduce((s, r) => s + (r.amount_pkr || 0), 0);

  const methodLabel: Record<string, string> = {
    jazzcash: "JazzCash",
    easypaisa: "EasyPaisa",
    bank: "Bank Transfer",
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-blue-400" />
            Payment Requests
          </h1>
          <p className="text-zinc-400">Review and approve subscription payments</p>
        </div>
        <button onClick={loadRequests}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/10 text-sm transition-all">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <p className="text-amber-400 text-xs font-medium mb-1">Pending Review</p>
          <p className="text-3xl font-bold text-white">{pending}</p>
        </div>
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
          <p className="text-green-400 text-xs font-medium mb-1">Approved</p>
          <p className="text-3xl font-bold text-white">{approved}</p>
        </div>
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
          <p className="text-red-400 text-xs font-medium mb-1">Rejected</p>
          <p className="text-3xl font-bold text-white">
            {requests.filter(r => r.status === "rejected").length}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <p className="text-blue-400 text-xs font-medium mb-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Total Collected
          </p>
          <p className="text-lg font-bold text-white">PKR {totalPKR.toLocaleString()}</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {(["pending", "approved", "rejected", "all"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm capitalize font-medium transition-all border ${
              filter === f
                ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                : "bg-white/5 text-zinc-400 border-white/10 hover:bg-white/10"
            }`}>
            {f}
            {f === "pending" && pending > 0 && (
              <span className="ml-2 bg-amber-500 text-black text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                {pending}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-zinc-500 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white/5 border border-white/5 rounded-2xl">
          <Clock className="w-12 h-12 mx-auto mb-3 text-zinc-600" />
          <p className="text-zinc-500">No {filter === "all" ? "" : filter} requests</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((req, i) => (
            <motion.div key={req.id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6">

              <div className="flex items-start justify-between gap-4 flex-wrap">
                {/* User + Plan info */}
                <div className="space-y-2">
                  <p className="text-white font-semibold text-base">{req.user_email}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="capitalize text-xs px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/20 font-medium">
                      {req.plan} Plan
                    </span>
                    <span className="text-emerald-400 font-bold">
                      PKR {req.amount_pkr?.toLocaleString()}
                    </span>
                    <span className="text-xs text-zinc-500 bg-white/5 px-2 py-0.5 rounded-full">
                      {methodLabel[req.payment_method] || req.payment_method}
                    </span>
                  </div>
                  {req.note && (
                    <p className="text-zinc-500 text-sm">Note: {req.note}</p>
                  )}
                  <p className="text-zinc-600 text-xs">
                    {new Date(req.created_at).toLocaleString("en-PK", {
                      day: "numeric", month: "short", year: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </p>
                </div>

                {/* Status badge */}
                <div>
                  {req.status === "pending" && (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/25 text-sm font-medium">
                      <Clock className="w-3.5 h-3.5" /> Pending
                    </span>
                  )}
                  {req.status === "approved" && (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/25 text-sm font-medium">
                      <CheckCircle className="w-3.5 h-3.5" /> Approved
                    </span>
                  )}
                  {req.status === "rejected" && (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/25 text-sm font-medium">
                      <XCircle className="w-3.5 h-3.5" /> Rejected
                    </span>
                  )}
                </div>
              </div>

              {/* Actions row */}
              <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/5 flex-wrap gap-3">
                <button onClick={() => setViewImg(req.screenshot)}
                  className="flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors">
                  <Eye className="w-4 h-4" /> View Screenshot
                </button>

                {req.status === "pending" && (
                  <div className="flex items-center gap-2">
                    <button onClick={() => approve(req.id)} disabled={actionId === req.id}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-500/10 hover:bg-green-500/20 text-green-400 text-sm font-medium transition-all disabled:opacity-50 border border-green-500/20">
                      {actionId === req.id
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : <CheckCircle className="w-4 h-4" />}
                      Approve
                    </button>
                    <button onClick={() => setRejectId(req.id)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium transition-all border border-red-500/20">
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </div>
                )}

                {req.status === "rejected" && req.admin_note && (
                  <p className="text-red-400/70 text-sm">Reason: {req.admin_note}</p>
                )}
              </div>

              {/* Reject reason input */}
              {rejectId === req.id && (
                <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
                  <input
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-600 text-sm outline-none focus:border-red-500/50"
                    placeholder="Rejection reason (optional)"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button onClick={() => reject(req.id)} disabled={actionId === req.id}
                      className="px-5 py-2 rounded-xl bg-red-500/20 text-red-400 text-sm hover:bg-red-500/30 transition-all font-medium disabled:opacity-50">
                      {actionId === req.id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Reject"}
                    </button>
                    <button onClick={() => { setRejectId(null); setRejectReason(""); }}
                      className="px-5 py-2 rounded-xl bg-white/5 text-zinc-400 text-sm hover:bg-white/10 transition-all">
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Screenshot modal */}
      {viewImg && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4"
          onClick={() => setViewImg(null)}>
          <div className="relative max-w-lg w-full" onClick={e => e.stopPropagation()}>
            <button onClick={() => setViewImg(null)}
              className="absolute -top-10 right-0 text-white/60 hover:text-white text-sm">
              ✕ Close
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={viewImg} alt="Payment screenshot"
              className="w-full rounded-2xl border border-white/10 shadow-2xl" />
          </div>
        </div>
      )}
    </div>
  );
}

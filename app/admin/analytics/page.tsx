"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Users, Bot, MessageSquare, CreditCard, RefreshCw, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface AnalyticsData {
  totalUsers: number;
  totalAgents: number;
  activeAgents: number;
  totalMessages: number;
  totalOrders: number;
  mediumUsers: number;
  premiumUsers: number;
  basicUsers: number;
  pendingPayments: number;
  approvedPayments: number;
  totalRevenuePKR: number;
  recentSignups: number;   // last 30 days
  recentMessages: number;  // last 30 days
}

export default function AnalyticsPage() {
  const [data, setData]     = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchAnalytics(); }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    const supabase = createClient();
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const [
      { data: agents },
      { data: subs },
      { count: msgCount },
      { count: recentMsgs },
      { count: orderCount },
      { data: payments },
    ] = await Promise.all([
      supabase.from("agents").select("status"),
      supabase.from("subscriptions").select("plan"),
      supabase.from("messages").select("id", { count: "exact", head: true }),
      supabase.from("messages").select("id", { count: "exact", head: true }).gte("created_at", thirtyDaysAgo),
      supabase.from("orders").select("id", { count: "exact", head: true }),
      supabase.from("payment_requests").select("status, amount_pkr"),
    ]);

    // Users from admin API
    let totalUsers = 0;
    let recentSignups = 0;
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const d = await res.json();
        totalUsers = d.count || 0;
        recentSignups = (d.users || []).filter(
          (u: { created_at: string }) => new Date(u.created_at) > new Date(thirtyDaysAgo)
        ).length;
      }
    } catch { /* ignore */ }

    const mediumUsers  = subs?.filter(s => s.plan === "medium").length  || 0;
    const premiumUsers = subs?.filter(s => s.plan === "premium").length || 0;
    const basicUsers   = subs?.filter(s => s.plan === "basic").length   || 0;
    const approvedPay  = payments?.filter(p => p.status === "approved") || [];
    const pendingPay   = payments?.filter(p => p.status === "pending").length || 0;
    const totalRevenue = approvedPay.reduce((s, p) => s + (p.amount_pkr || 0), 0);

    setData({
      totalUsers,
      totalAgents:     agents?.length || 0,
      activeAgents:    agents?.filter(a => a.status === "active").length || 0,
      totalMessages:   msgCount || 0,
      totalOrders:     orderCount || 0,
      mediumUsers,
      premiumUsers,
      basicUsers,
      pendingPayments: pendingPay,
      approvedPayments: approvedPay.length,
      totalRevenuePKR: totalRevenue,
      recentSignups,
      recentMessages:  recentMsgs || 0,
    });
    setLoading(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="w-10 h-10 text-green-400 animate-spin" />
    </div>
  );

  if (!data) return null;

  const paidUsers    = data.mediumUsers + data.premiumUsers;
  const convRate     = data.totalUsers > 0 ? ((paidUsers / data.totalUsers) * 100).toFixed(1) : "0";
  const activeRate   = data.totalAgents > 0 ? ((data.activeAgents / data.totalAgents) * 100).toFixed(0) : "0";

  return (
    <div className="max-w-7xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-green-400" />
            Analytics & Reports
          </h1>
          <p className="text-zinc-400">Real-time platform metrics</p>
        </div>
        <button onClick={fetchAnalytics}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/10 text-sm transition-all">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* KPI cards */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Users",     value: data.totalUsers,     sub: `+${data.recentSignups} this month`,  icon: Users,        color: "blue"   },
          { label: "Total Agents",    value: data.totalAgents,    sub: `${activeRate}% active`,              icon: Bot,          color: "purple" },
          { label: "Total Messages",  value: data.totalMessages,  sub: `${data.recentMessages} this month`,  icon: MessageSquare,color: "cyan"   },
          { label: "Total Orders",    value: data.totalOrders,    sub: "All time",                           icon: BarChart3,    color: "amber"  },
        ].map((card, i) => {
          const Icon = card.icon;
          const colors: Record<string, { bg: string; text: string }> = {
            blue:   { bg: "bg-blue-500/10",   text: "text-blue-400"   },
            purple: { bg: "bg-purple-500/10", text: "text-purple-400" },
            cyan:   { bg: "bg-cyan-500/10",   text: "text-cyan-400"   },
            amber:  { bg: "bg-amber-500/10",  text: "text-amber-400"  },
          };
          return (
            <motion.div key={card.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className={`p-6 rounded-2xl border ${colors[card.color].bg} border-white/10`}>
              <div className="flex items-center justify-between mb-3">
                <Icon className={`w-6 h-6 ${colors[card.color].text}`} />
                <TrendingUp className="w-4 h-4 text-zinc-600" />
              </div>
              <p className="text-zinc-400 text-sm mb-1">{card.label}</p>
              <p className="text-3xl font-bold text-white mb-1">{card.value.toLocaleString()}</p>
              <p className="text-xs text-zinc-500">{card.sub}</p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Revenue + Plans */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Revenue card */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-green-400" />
            <h3 className="text-white font-semibold">Revenue</h3>
          </div>
          <p className="text-4xl font-bold text-green-400 mb-1">
            PKR {data.totalRevenuePKR.toLocaleString()}
          </p>
          <p className="text-zinc-500 text-sm mb-6">Total collected (approved payments)</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Approved Payments</span>
              <span className="text-white font-medium">{data.approvedPayments}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Pending Review</span>
              <span className={data.pendingPayments > 0 ? "text-amber-400 font-medium" : "text-white font-medium"}>
                {data.pendingPayments}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Conversion Rate</span>
              <span className="text-white font-medium">{convRate}%</span>
            </div>
          </div>
        </div>

        {/* Plan breakdown */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <h3 className="text-white font-semibold mb-5">Plan Distribution</h3>
          <div className="space-y-4">
            {[
              { label: "Basic (Free)",  count: data.basicUsers,   color: "bg-zinc-500",   pct: data.totalUsers > 0 ? (data.basicUsers   / data.totalUsers * 100) : 0 },
              { label: "Medium",        count: data.mediumUsers,  color: "bg-blue-500",   pct: data.totalUsers > 0 ? (data.mediumUsers  / data.totalUsers * 100) : 0 },
              { label: "Premium",       count: data.premiumUsers, color: "bg-amber-500",  pct: data.totalUsers > 0 ? (data.premiumUsers / data.totalUsers * 100) : 0 },
            ].map(p => (
              <div key={p.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-zinc-400">{p.label}</span>
                  <span className="text-white font-medium">{p.count} users</span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className={`h-full rounded-full ${p.color} transition-all duration-700`}
                    style={{ width: `${Math.min(p.pct, 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Quick stats row */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Paid Users",      value: paidUsers,                    color: "text-green-400"  },
          { label: "Active Agents",   value: data.activeAgents,            color: "text-purple-400" },
          { label: "Msgs This Month", value: data.recentMessages,          color: "text-cyan-400"   },
          { label: "New Users/Month", value: data.recentSignups,           color: "text-blue-400"   },
        ].map(s => (
          <div key={s.label} className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value.toLocaleString()}</p>
            <p className="text-zinc-500 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

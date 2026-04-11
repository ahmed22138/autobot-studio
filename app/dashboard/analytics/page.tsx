"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Users, MessageSquare, Loader2, ShoppingBag, Bot } from "lucide-react";
import FeatureGate from "@/components/FeatureGate";
import { createClient } from "@/lib/supabase/client";

interface DayData { date: string; count: number; label: string; }
interface AgentStat { name: string; count: number; type: string; status: string; }

function AnalyticsContent() {
  const [loading, setLoading]       = useState(true);
  const [totalMessages, setTotal]   = useState(0);
  const [totalAgents, setAgents]    = useState(0);
  const [activeAgents, setActive]   = useState(0);
  const [totalOrders, setOrders]    = useState(0);
  const [weekData, setWeekData]     = useState<DayData[]>([]);
  const [agentStats, setAgentStats] = useState<AgentStat[]>([]);
  const [thisMonth, setThisMonth]   = useState(0);
  const [lastMonth, setLastMonth]   = useState(0);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const now      = new Date();
    const mStart   = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const lmStart  = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
    const lmEnd    = new Date(now.getFullYear(), now.getMonth(), 0).toISOString();

    // Parallel fetches
    const [msgAll, msgMonth, msgLastMonth, agentsData, ordersData] = await Promise.all([
      supabase.from("messages").select("*", { count: "exact", head: true }).eq("user_id", user.id),
      supabase.from("messages").select("*", { count: "exact", head: true }).eq("user_id", user.id).gte("created_at", mStart),
      supabase.from("messages").select("*", { count: "exact", head: true }).eq("user_id", user.id).gte("created_at", lmStart).lte("created_at", lmEnd),
      supabase.from("agents").select("agent_id, name, type, status").eq("user_id", user.id),
      supabase.from("messages").select("created_at").eq("user_id", user.id).gte("created_at", new Date(Date.now() - 7 * 86400000).toISOString()),
    ]);

    setTotal(msgAll.count || 0);
    setThisMonth(msgMonth.count || 0);
    setLastMonth(msgLastMonth.count || 0);
    setAgents(agentsData.data?.length || 0);
    setActive(agentsData.data?.filter(a => a.status === "active").length || 0);

    // Orders count
    if (agentsData.data?.length) {
      const agentIds = agentsData.data.map(a => a.agent_id);
      const { count } = await supabase.from("orders").select("*", { count: "exact", head: true }).in("agent_id", agentIds);
      setOrders(count || 0);
    }

    // Build last 7 days chart
    const days: DayData[] = [];
    for (let i = 6; i >= 0; i--) {
      const d    = new Date(Date.now() - i * 86400000);
      const key  = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString("en-PK", { weekday: "short" });
      const count = ordersData.data?.filter(m => m.created_at?.slice(0, 10) === key).length || 0;
      days.push({ date: key, count, label });
    }
    setWeekData(days);

    // Per-agent message count — single query, no N+1
    if (agentsData.data?.length) {
      const agentIds = agentsData.data.map(a => a.agent_id);
      const { data: allAgentMsgs } = await supabase
        .from("messages")
        .select("agent_id")
        .in("agent_id", agentIds);

      const countMap: Record<string, number> = {};
      allAgentMsgs?.forEach(m => {
        countMap[m.agent_id] = (countMap[m.agent_id] || 0) + 1;
      });

      const stats: AgentStat[] = agentsData.data.map(agent => ({
        name: agent.name,
        count: countMap[agent.agent_id] || 0,
        type: agent.type || "general",
        status: agent.status,
      }));
      setAgentStats(stats.sort((a, b) => b.count - a.count));
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </main>
    );
  }

  const maxDay = Math.max(...weekData.map(d => d.count), 1);
  const growth = lastMonth > 0 ? Math.round(((thisMonth - lastMonth) / lastMonth) * 100) : 0;

  const typeEmoji: Record<string, string> = { sales: "💰", support: "🎧", general: "🤖" };

  return (
    <main className="min-h-screen bg-[#0a0a0f] px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
          <p className="text-zinc-500 text-sm mt-1">Apne agents ki performance track karo</p>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Messages",  value: totalMessages.toLocaleString(), icon: MessageSquare, color: "blue" },
            { label: "Active Agents",   value: `${activeAgents}/${totalAgents}`, icon: Bot,         color: "purple" },
            { label: "This Month",      value: thisMonth.toLocaleString(),      icon: TrendingUp,   color: "green" },
            { label: "Total Orders",    value: totalOrders,                     icon: ShoppingBag,  color: "amber" },
          ].map((card, i) => {
            const Icon = card.icon;
            const bg   = { blue:"bg-blue-500/20", purple:"bg-purple-500/20", green:"bg-green-500/20", amber:"bg-amber-500/20" }[card.color];
            const tx   = { blue:"text-blue-400",  purple:"text-purple-400",  green:"text-green-400",  amber:"text-amber-400"  }[card.color];
            return (
              <motion.div key={i} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.08 }}
                className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${tx}`} />
                  </div>
                  <span className="text-zinc-500 text-xs">{card.label}</span>
                </div>
                <p className="text-2xl font-bold text-white">{card.value}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Month comparison */}
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.3 }}
          className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-zinc-400 text-sm">Month over Month</p>
            <p className="text-white text-lg font-semibold mt-1">
              {thisMonth} messages this month
              <span className={`ml-2 text-sm font-normal ${growth >= 0 ? "text-green-400" : "text-red-400"}`}>
                {growth >= 0 ? "▲" : "▼"} {Math.abs(growth)}%
              </span>
            </p>
          </div>
          <div className="flex gap-6 text-sm">
            <div><p className="text-zinc-500 text-xs">This Month</p><p className="text-white font-bold">{thisMonth}</p></div>
            <div><p className="text-zinc-500 text-xs">Last Month</p><p className="text-zinc-400 font-bold">{lastMonth}</p></div>
          </div>
        </motion.div>

        {/* Last 7 Days Chart */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }}
          className="bg-white/5 border border-white/10 rounded-xl p-5">
          <h2 className="text-white font-semibold mb-4">Last 7 Days — Messages</h2>
          <div className="flex items-end gap-3 h-32">
            {weekData.map((day, i) => {
              const pct = maxDay > 0 ? (day.count / maxDay) * 100 : 0;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-zinc-500 text-[10px]">{day.count}</span>
                  <div className="w-full rounded-t-md bg-blue-500/20 border border-blue-500/30 transition-all"
                    style={{ height: `${Math.max(pct, 4)}%` }} />
                  <span className="text-zinc-600 text-[10px]">{day.label}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Per-agent breakdown */}
        {agentStats.length > 0 && (
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5 }}
            className="bg-white/5 border border-white/10 rounded-xl p-5">
            <h2 className="text-white font-semibold mb-4">Per Agent Messages</h2>
            <div className="space-y-3">
              {agentStats.map((agent, i) => {
                const maxCount = agentStats[0].count || 1;
                const pct = (agent.count / maxCount) * 100;
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{typeEmoji[agent.type] || "🤖"}</span>
                        <span className="text-white text-sm">{agent.name}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                          agent.status === "active"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}>{agent.status}</span>
                      </div>
                      <span className="text-zinc-400 text-sm font-medium">{agent.count}</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-1.5">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all"
                        style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

      </div>
    </main>
  );
}

export default function AnalyticsPage() {
  return (
    <FeatureGate
      featureKey="analytics"
      title="Analytics Dashboard"
      description="View detailed analytics about your AI agents' performance, message volume, and user engagement."
      requiredPlan="Medium or Premium"
      icon={<BarChart3 className="w-8 h-8 text-zinc-500" />}
    >
      <AnalyticsContent />
    </FeatureGate>
  );
}

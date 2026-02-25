"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Users,
  MessageSquare,
  Loader2,
} from "lucide-react";
import FeatureGate from "@/components/FeatureGate";
import { createClient } from "@/lib/supabase/client";

interface Stats {
  totalMessages: number;
  totalAgents: number;
  activeAgents: number;
  avgMessagesPerAgent: number;
}

function AnalyticsContent() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const [{ count: totalMessages }, { data: agents }] = await Promise.all([
        supabase
          .from("messages")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id),
        supabase.from("agents").select("status").eq("user_id", user.id),
      ]);

      const totalAgents = agents?.length ?? 0;
      const activeAgents =
        agents?.filter((a) => a.status === "active").length ?? 0;

      setStats({
        totalMessages: totalMessages ?? 0,
        totalAgents,
        activeAgents,
        avgMessagesPerAgent:
          totalAgents > 0
            ? Math.round((totalMessages ?? 0) / totalAgents)
            : 0,
      });
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </main>
    );
  }

  const cards = [
    {
      label: "Total Messages",
      value: stats?.totalMessages.toLocaleString() ?? "0",
      icon: MessageSquare,
      color: "blue",
    },
    {
      label: "Total Agents",
      value: stats?.totalAgents ?? 0,
      icon: Users,
      color: "purple",
    },
    {
      label: "Active Agents",
      value: stats?.activeAgents ?? 0,
      icon: TrendingUp,
      color: "green",
    },
    {
      label: "Avg Messages/Agent",
      value: stats?.avgMessagesPerAgent ?? 0,
      icon: BarChart3,
      color: "amber",
    },
  ];

  const colorMap: Record<string, { bg: string; text: string }> = {
    blue: { bg: "bg-blue-500/20", text: "text-blue-400" },
    purple: { bg: "bg-purple-500/20", text: "text-purple-400" },
    green: { bg: "bg-green-500/20", text: "text-green-400" },
    amber: { bg: "bg-amber-500/20", text: "text-amber-400" },
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f] px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-zinc-400">
            Track your AI agents&apos; performance and usage
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {cards.map((card, i) => {
            const Icon = card.icon;
            const colors = colorMap[card.color];
            return (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="p-5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`w-9 h-9 rounded-lg ${colors.bg} flex items-center justify-center`}
                  >
                    <Icon className={`w-5 h-5 ${colors.text}`} />
                  </div>
                  <span className="text-zinc-400 text-sm">{card.label}</span>
                </div>
                <p className="text-3xl font-bold text-white">{card.value}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/5"
        >
          <h2 className="text-lg font-semibold text-white mb-4">
            Usage Overview
          </h2>
          <p className="text-zinc-500 text-sm">
            Detailed charts and reports coming soon. Your current statistics are
            displayed above.
          </p>
        </motion.div>
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

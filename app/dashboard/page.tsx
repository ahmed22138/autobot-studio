"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Plus,
  Bot,
  Copy,
  Check,
  Activity,
  Clock,
  Power,
  PowerOff,
  Trash2,
  ExternalLink,
  Loader2,
  Crown,
  MessageSquare,
  ArrowUpRight,
  BarChart3,
  Key,
  Palette,
  Puzzle,
  Lock,
  Headphones,
  Ticket,
} from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { createClient } from "@/lib/supabase/client";

interface Agent {
  id: string;
  agent_id: string;
  name: string;
  description: string;
  tone: string;
  status: string;
  created_at: string;
}

interface UsageData {
  plan: string;
  agentCount: number;
  messageCount: number;
  limits: { agents: number | null; messages: number | null };
  features: {
    customization: string;
    support: string;
    analytics: boolean;
    apiAccess: boolean;
    whiteLabel: boolean;
    customIntegrations: boolean;
  };
}

export default function DashboardPage() {
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Admin emails
  const ADMIN_EMAILS = [
    "workb9382@gmail.com",
    "dj9581907@gmail.com"
  ];

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const userEmail = user.email || "";
        setEmail(userEmail);

        // Get user name from metadata or email
        const name = user.user_metadata?.name || user.user_metadata?.full_name || userEmail.split('@')[0];
        setUserName(name);

        setIsAdmin(ADMIN_EMAILS.includes(userEmail.toLowerCase()));

        const { data } = await supabase
          .from("agents")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (data) setAgents(data);
      }
      setLoading(false);
    };

    fetchData();

    fetch("/api/usage")
      .then((res) => res.json())
      .then((data) => setUsage(data))
      .catch(() => {});
  }, []);

  const copyEmbed = (agentId: string) => {
    const origin =
      typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
    const script = `<script src="${origin}/chatbot.js" data-agent-id="${agentId}"></script>`;
    navigator.clipboard.writeText(script);
    setCopiedId(agentId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    const supabase = createClient();
    await supabase.from("agents").update({ status: newStatus }).eq("id", id);
    setAgents((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
  };

  const deleteAgent = async (id: string) => {
    const supabase = createClient();
    await supabase.from("agents").delete().eq("id", id);
    setAgents((prev) => prev.filter((a) => a.id !== id));
  };

  const totalAgents = agents.length;
  const activeAgents = agents.filter((a) => a.status === "active").length;
  const inactiveAgents = agents.filter((a) => a.status === "inactive").length;

  const planColors: Record<string, string> = {
    basic: "bg-zinc-500/20 text-zinc-300 border-zinc-500/30",
    medium: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    premium: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  };

  const getUsagePercent = (current: number, limit: number | null) => {
    if (limit === null) return 0;
    return Math.min((current / limit) * 100, 100);
  };

  const getBarColor = (percent: number) => {
    if (percent >= 90) return "bg-red-500";
    if (percent >= 70) return "bg-yellow-500";
    return "bg-blue-500";
  };

  const featureCards = usage
    ? [
        {
          name: isAdmin ? "Manage Tickets (Admin)" : "My Support Tickets",
          icon: Ticket,
          color: "cyan",
          unlocked: true, // Available for all plans
          href: isAdmin ? "/dashboard/tickets" : "/dashboard/my-tickets",
          requiredPlan: "All Plans",
        },
        {
          name: "Analytics Dashboard",
          icon: BarChart3,
          color: "blue",
          unlocked: usage.features.analytics,
          href: "/dashboard/analytics",
          requiredPlan: "Medium",
        },
        {
          name: "API Access",
          icon: Key,
          color: "amber",
          unlocked: usage.features.apiAccess,
          href: "/dashboard/api-access",
          requiredPlan: "Medium",
        },
        {
          name: "White-label",
          icon: Palette,
          color: "purple",
          unlocked: usage.features.whiteLabel,
          href: "/dashboard/white-label",
          requiredPlan: "Premium",
        },
        {
          name: "Custom Integrations",
          icon: Puzzle,
          color: "green",
          unlocked: usage.features.customIntegrations,
          href: "/dashboard/integrations",
          requiredPlan: "Premium",
        },
      ]
    : [];

  const colorMap: Record<string, { bg: string; text: string; border: string }> = {
    cyan: { bg: "bg-cyan-500/20", text: "text-cyan-400", border: "border-cyan-500/20" },
    blue: { bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/20" },
    amber: { bg: "bg-amber-500/20", text: "text-amber-400", border: "border-amber-500/20" },
    purple: { bg: "bg-purple-500/20", text: "text-purple-400", border: "border-purple-500/20" },
    green: { bg: "bg-green-500/20", text: "text-green-400", border: "border-green-500/20" },
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-[#0a0a0f] px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {userName || "User"}! 👋
            </h1>
            <div className="flex items-center gap-2 text-zinc-400">
              <span>{email}</span>
              {isAdmin && (
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-xs border border-cyan-500/20">
                  🛡️ Admin
                </span>
              )}
            </div>
          </motion.div>

          {/* Plan Info Card */}
          {usage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="mb-8 p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/5"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                    <Crown className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">Your Plan</p>
                    <span
                      className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${
                        planColors[usage.plan] || planColors.basic
                      }`}
                    >
                      {usage.plan}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {/* Support badge */}
                  <span className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-zinc-400 text-xs capitalize">
                    <Headphones className="w-3.5 h-3.5" />
                    {usage.features.support} support
                  </span>
                  {usage.plan !== "premium" && (
                    <Link
                      href="/pricing"
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-sm font-medium transition-all"
                    >
                      Upgrade
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                {/* Agent usage */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center gap-1.5 text-sm text-zinc-400">
                      <Bot className="w-4 h-4" />
                      Agents
                    </span>
                    <span className="text-sm text-white">
                      {usage.agentCount}/{usage.limits.agents ?? "Unlimited"}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${getBarColor(
                        getUsagePercent(usage.agentCount, usage.limits.agents)
                      )}`}
                      style={{
                        width:
                          usage.limits.agents === null
                            ? "0%"
                            : `${getUsagePercent(usage.agentCount, usage.limits.agents)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Message usage */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center gap-1.5 text-sm text-zinc-400">
                      <MessageSquare className="w-4 h-4" />
                      Messages this month
                    </span>
                    <span className="text-sm text-white">
                      {usage.messageCount.toLocaleString()}/{usage.limits.messages?.toLocaleString() ?? "Unlimited"}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${getBarColor(
                        getUsagePercent(usage.messageCount, usage.limits.messages)
                      )}`}
                      style={{
                        width:
                          usage.limits.messages === null
                            ? "0%"
                            : `${getUsagePercent(usage.messageCount, usage.limits.messages)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Customization level */}
              <div className="flex items-center gap-2 text-sm">
                <span className="text-zinc-500">Customization:</span>
                <span className="px-2 py-0.5 rounded-md bg-white/5 text-zinc-300 text-xs capitalize">
                  {usage.features.customization}
                </span>
              </div>
            </motion.div>
          )}

          {/* Feature Cards */}
          {usage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="mb-10"
            >
              <h2 className="text-xl font-semibold text-white mb-4">Quick Access</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {featureCards.map((feature, i) => {
                  const Icon = feature.icon;
                  const colors = colorMap[feature.color];
                  return (
                    <motion.div
                      key={feature.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
                    >
                      <Link
                        href={feature.unlocked ? feature.href : "/pricing"}
                        className={`block p-5 rounded-2xl border transition-all ${
                          feature.unlocked
                            ? "bg-white/5 border-white/5 hover:border-white/15"
                            : "bg-white/[0.02] border-white/5 opacity-60 hover:opacity-80"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div
                            className={`w-9 h-9 rounded-lg ${colors.bg} flex items-center justify-center`}
                          >
                            <Icon className={`w-5 h-5 ${colors.text}`} />
                          </div>
                          {!feature.unlocked && (
                            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                              <Lock className="w-3 h-3 text-zinc-500" />
                              <span className="text-zinc-500 text-[10px] font-medium">
                                {feature.requiredPlan}+
                              </span>
                            </div>
                          )}
                          {feature.unlocked && (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-white text-sm font-medium">
                          {feature.name}
                        </p>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10"
          >
            <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-zinc-400 text-sm">Total Agents</span>
              </div>
              <p className="text-3xl font-bold text-white">{totalAgents}</p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-green-400" />
                </div>
                <span className="text-zinc-400 text-sm">Active</span>
              </div>
              <p className="text-3xl font-bold text-green-400">{activeAgents}</p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-lg bg-zinc-500/20 flex items-center justify-center">
                  <PowerOff className="w-5 h-5 text-zinc-400" />
                </div>
                <span className="text-zinc-400 text-sm">Inactive</span>
              </div>
              <p className="text-3xl font-bold text-zinc-400">
                {inactiveAgents}
              </p>
            </div>
          </motion.div>

          {/* Create New Agent Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <Link
              href="/Agent"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium transition-all shadow-lg shadow-blue-500/20"
            >
              <Plus className="w-5 h-5" />
              Create New Agent
            </Link>
          </motion.div>

          {/* Agents List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-xl font-semibold text-white mb-4">
              Your Agents
            </h2>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              </div>
            ) : agents.length === 0 ? (
              <div className="text-center py-20 rounded-2xl bg-white/5 border border-white/5">
                <Bot className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                <p className="text-zinc-400 text-lg mb-2">No agents yet</p>
                <p className="text-zinc-500 text-sm">
                  Create your first AI agent to get started
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {agents.map((agent, i) => (
                  <motion.div
                    key={agent.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="p-5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/5 hover:border-white/10 transition-all"
                  >
                    {/* Agent Header */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Bot className="w-5 h-5 text-blue-400" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-white font-semibold text-lg truncate">
                            {agent.name}
                          </h3>
                          <p className="text-zinc-500 text-sm line-clamp-2">
                            {agent.description || "No description"}
                          </p>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                          agent.status === "active"
                            ? "bg-green-500/10 text-green-400 border border-green-500/20"
                            : "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            agent.status === "active"
                              ? "bg-green-400"
                              : "bg-zinc-500"
                          }`}
                        />
                        {agent.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </div>

                    {/* Agent Details */}
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-4 text-sm text-zinc-500">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(agent.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-white/5 text-zinc-400 text-xs">
                        Tone: {agent.tone}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-white/5 text-zinc-400 text-xs font-mono">
                        ID: {agent.agent_id}
                      </span>
                    </div>

                    {/* Embed Code */}
                    <div className="mb-4">
                      <p className="text-zinc-500 text-xs mb-1.5">
                        Embed Code (paste before &lt;/body&gt;)
                      </p>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 bg-black/30 border border-white/5 rounded-lg px-3 py-2 text-xs text-green-400 font-mono truncate">
                          {`<script src="${typeof window !== "undefined" ? window.location.origin : ""}/chatbot.js" data-agent-id="${agent.agent_id}"></script>`}
                        </code>
                        <button
                          onClick={() => copyEmbed(agent.agent_id)}
                          className="flex-shrink-0 p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-400 hover:text-white transition-all"
                          title="Copy embed code"
                        >
                          {copiedId === agent.agent_id ? (
                            <Check className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                      <Link
                        href={`/chatbot/${agent.agent_id}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-sm transition-all"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Open Chat
                      </Link>
                      <Link
                        href={`/dashboard/embed?agentId=${agent.agent_id}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 text-sm transition-all"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        Embed Page
                      </Link>
                      <button
                        onClick={() => toggleStatus(agent.id, agent.status)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all ${
                          agent.status === "active"
                            ? "bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400"
                            : "bg-green-500/10 hover:bg-green-500/20 text-green-400"
                        }`}
                      >
                        {agent.status === "active" ? (
                          <>
                            <PowerOff className="w-3.5 h-3.5" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <Power className="w-3.5 h-3.5" />
                            Activate
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => deleteAgent(agent.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm transition-all ml-auto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </ProtectedRoute>
  );
}

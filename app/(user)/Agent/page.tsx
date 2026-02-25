"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Bot, Loader2, AlertTriangle, Lock, ArrowUpRight } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { createClient } from "@/lib/supabase/client";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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

export default function CreateAgent() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
    tone: "friendly",
    welcomeMessage: "",
    responseLength: "medium",
    knowledgeBase: "",
    systemPrompt: "",
    customCss: "",
    webhookUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [usageLoading, setUsageLoading] = useState(true);

  useEffect(() => {
    fetch("/api/usage")
      .then((res) => res.json())
      .then((data) => setUsage(data))
      .catch(() => {})
      .finally(() => setUsageLoading(false));
  }, []);

  const limitReached =
    usage && usage.limits.agents !== null && usage.agentCount >= usage.limits.agents;

  const customization = usage?.features?.customization || "basic";
  const hasAdvanced = customization === "advanced" || customization === "full";
  const hasFull = customization === "full";

  const createAgent = async () => {
    if (limitReached) return;
    setLoading(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      // Generate unique agent ID
      const agent_id = `agent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Save agent directly to Supabase (no external API needed)
      const { data, error } = await supabase.from("agents").insert({
        user_id: user.id,
        agent_id: agent_id,
        name: form.name,
        description: form.description,
        tone: form.tone,
        status: "active",
      }).select();

      if (error) {
        console.error("Error creating agent:", error);
        alert("Failed to create agent. Please try again.");
        setLoading(false);
        return;
      }

      console.log("✅ Agent created successfully:", data);
      setLoading(false);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4 py-12">
        {/* Background effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-full max-w-xl"
        >
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-blue-400" />
              </div>
              <h1 className="text-2xl font-bold text-white">
                Create AI Agent
              </h1>
            </div>
            <p className="text-zinc-400 text-sm">
              Define your agent&apos;s personality and deploy it in seconds.
            </p>

            {/* Usage indicator */}
            {!usageLoading && usage && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">
                  Agents: {usage.agentCount}/{usage.limits.agents ?? "Unlimited"}
                </span>
                <span className="text-zinc-500 capitalize">{usage.plan} plan</span>
              </div>
            )}

            {/* Limit reached banner */}
            {limitReached && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-400 font-medium text-sm">Agent limit reached</p>
                  <p className="text-zinc-400 text-sm mt-1">
                    Your {usage.plan} plan allows {usage.limits.agents} agent{usage.limits.agents === 1 ? "" : "s"}.{" "}
                    <Link href="/pricing" className="text-blue-400 hover:underline">
                      Upgrade your plan
                    </Link>{" "}
                    to create more.
                  </p>
                </div>
              </div>
            )}

            {/* === BASIC CUSTOMIZATION (All plans) === */}
            <div className="space-y-4">
              <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium">Basic Settings</p>

              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">
                  Agent Name
                </label>
                <input
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                  placeholder="e.g. Support Bot"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">
                  Description
                </label>
                <textarea
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all resize-none"
                  placeholder="What does this agent do?"
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">
                  Tone
                </label>
                <select
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                  value={form.tone}
                  onChange={(e) => setForm({ ...form, tone: e.target.value })}
                >
                  <option value="friendly" className="bg-zinc-900">Friendly</option>
                  <option value="professional" className="bg-zinc-900">Professional</option>
                  <option value="casual" className="bg-zinc-900">Casual</option>
                </select>
              </div>
            </div>

            {/* === ADVANCED CUSTOMIZATION (Medium + Premium) === */}
            <div className={`space-y-4 ${!hasAdvanced ? "opacity-50" : ""}`}>
              <div className="flex items-center justify-between">
                <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium">Advanced Settings</p>
                {!hasAdvanced && (
                  <Link
                    href="/pricing"
                    className="flex items-center gap-1 text-[10px] text-blue-400 hover:underline"
                  >
                    <Lock className="w-3 h-3" />
                    Medium+ Plan
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>
                )}
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">
                  Welcome Message
                </label>
                <input
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all disabled:cursor-not-allowed"
                  placeholder="Hi! How can I help you today?"
                  value={form.welcomeMessage}
                  onChange={(e) => setForm({ ...form, welcomeMessage: e.target.value })}
                  disabled={!hasAdvanced}
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">
                  Response Length
                </label>
                <select
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all disabled:cursor-not-allowed"
                  value={form.responseLength}
                  onChange={(e) => setForm({ ...form, responseLength: e.target.value })}
                  disabled={!hasAdvanced}
                >
                  <option value="short" className="bg-zinc-900">Short</option>
                  <option value="medium" className="bg-zinc-900">Medium</option>
                  <option value="long" className="bg-zinc-900">Long</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">
                  Knowledge Base
                </label>
                <textarea
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all resize-none disabled:cursor-not-allowed"
                  placeholder="Paste custom knowledge or FAQ content for the agent..."
                  rows={3}
                  value={form.knowledgeBase}
                  onChange={(e) => setForm({ ...form, knowledgeBase: e.target.value })}
                  disabled={!hasAdvanced}
                />
              </div>
            </div>

            {/* === FULL CUSTOMIZATION (Premium only) === */}
            <div className={`space-y-4 ${!hasFull ? "opacity-50" : ""}`}>
              <div className="flex items-center justify-between">
                <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium">Premium Settings</p>
                {!hasFull && (
                  <Link
                    href="/pricing"
                    className="flex items-center gap-1 text-[10px] text-purple-400 hover:underline"
                  >
                    <Lock className="w-3 h-3" />
                    Premium Plan
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>
                )}
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">
                  System Prompt
                </label>
                <textarea
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all resize-none disabled:cursor-not-allowed"
                  placeholder="You are a helpful assistant for..."
                  rows={3}
                  value={form.systemPrompt}
                  onChange={(e) => setForm({ ...form, systemPrompt: e.target.value })}
                  disabled={!hasFull}
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">
                  Custom CSS
                </label>
                <textarea
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all resize-none font-mono text-sm disabled:cursor-not-allowed"
                  placeholder=".chatbot-widget { border-radius: 16px; }"
                  rows={3}
                  value={form.customCss}
                  onChange={(e) => setForm({ ...form, customCss: e.target.value })}
                  disabled={!hasFull}
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">
                  Webhook URL
                </label>
                <input
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all disabled:cursor-not-allowed"
                  placeholder="https://your-server.com/webhook"
                  value={form.webhookUrl}
                  onChange={(e) => setForm({ ...form, webhookUrl: e.target.value })}
                  disabled={!hasFull}
                />
              </div>
            </div>

            <button
              onClick={createAgent}
              disabled={loading || !form.name || !!limitReached}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Agent"
              )}
            </button>
          </div>
        </motion.div>
      </main>
    </ProtectedRoute>
  );
}

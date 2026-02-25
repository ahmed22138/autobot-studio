"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Key, Copy, Check, RefreshCw, Code2 } from "lucide-react";
import FeatureGate from "@/components/FeatureGate";

function ApiAccessContent() {
  const [copied, setCopied] = useState(false);
  const demoKey = "ak_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxx";

  const handleCopy = () => {
    navigator.clipboard.writeText(demoKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exampleCode = `fetch("https://api.autobots.studio/v1/chat", {
  method: "POST",
  headers: {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    agent_id: "your-agent-id",
    message: "Hello!"
  })
})`;

  return (
    <main className="min-h-screen bg-[#0a0a0f] px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-3xl font-bold text-white mb-2">API Access</h1>
          <p className="text-zinc-400">
            Integrate your AI agents into any application using our REST API
          </p>
        </motion.div>

        {/* API Key Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/5 mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Key className="w-5 h-5 text-amber-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">Your API Key</h2>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <code className="flex-1 bg-black/30 border border-white/5 rounded-lg px-4 py-3 text-sm text-green-400 font-mono">
              {demoKey}
            </code>
            <button
              onClick={handleCopy}
              className="flex-shrink-0 p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-400 hover:text-white transition-all"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
            <button className="flex-shrink-0 p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-400 hover:text-white transition-all">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          <p className="text-zinc-500 text-xs">
            Keep your API key secure. Do not share it publicly.
          </p>
        </motion.div>

        {/* Example Code */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/5 mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Code2 className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">Quick Start</h2>
          </div>

          <pre className="bg-black/40 border border-white/5 rounded-xl p-4 text-sm text-green-400 font-mono overflow-x-auto whitespace-pre">
            {exampleCode}
          </pre>
        </motion.div>

        {/* Endpoints */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/5"
        >
          <h2 className="text-lg font-semibold text-white mb-4">
            Available Endpoints
          </h2>
          <div className="space-y-3">
            {[
              {
                method: "POST",
                path: "/v1/chat",
                desc: "Send a message to an agent",
              },
              {
                method: "GET",
                path: "/v1/agents",
                desc: "List all your agents",
              },
              {
                method: "POST",
                path: "/v1/agents",
                desc: "Create a new agent",
              },
              {
                method: "GET",
                path: "/v1/agents/:id/messages",
                desc: "Get chat history",
              },
            ].map((ep) => (
              <div
                key={ep.path + ep.method}
                className="flex items-center gap-3 p-3 rounded-lg bg-black/20 border border-white/5"
              >
                <span
                  className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                    ep.method === "POST"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-blue-500/20 text-blue-400"
                  }`}
                >
                  {ep.method}
                </span>
                <code className="text-sm text-zinc-300 font-mono">
                  {ep.path}
                </code>
                <span className="text-zinc-500 text-sm ml-auto">
                  {ep.desc}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  );
}

export default function ApiAccessPage() {
  return (
    <FeatureGate
      featureKey="apiAccess"
      title="API Access"
      description="Integrate your AI agents into any application using our powerful REST API with full documentation."
      requiredPlan="Medium or Premium"
      icon={<Key className="w-8 h-8 text-zinc-500" />}
    >
      <ApiAccessContent />
    </FeatureGate>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Puzzle, Check, ExternalLink } from "lucide-react";
import FeatureGate from "@/components/FeatureGate";

const integrations = [
  {
    name: "Slack",
    description: "Send agent responses to Slack channels",
    icon: "S",
    color: "bg-[#4A154B]/30 text-[#E01E5A]",
    connected: false,
  },
  {
    name: "WhatsApp",
    description: "Connect agents to WhatsApp Business",
    icon: "W",
    color: "bg-green-500/20 text-green-400",
    connected: false,
  },
  {
    name: "Zapier",
    description: "Automate workflows with 5000+ apps",
    icon: "Z",
    color: "bg-orange-500/20 text-orange-400",
    connected: false,
  },
  {
    name: "Webhook",
    description: "Send events to any URL endpoint",
    icon: "{",
    color: "bg-blue-500/20 text-blue-400",
    connected: false,
  },
  {
    name: "Shopify",
    description: "Integrate with your Shopify store",
    icon: "S",
    color: "bg-[#96BF48]/20 text-[#96BF48]",
    connected: false,
  },
  {
    name: "WordPress",
    description: "One-click WordPress plugin install",
    icon: "W",
    color: "bg-[#21759B]/20 text-[#21759B]",
    connected: false,
  },
];

function IntegrationsContent() {
  const [connectedMap, setConnectedMap] = useState<Record<string, boolean>>({});

  const toggleConnect = (name: string) => {
    setConnectedMap((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f] px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            Custom Integrations
          </h1>
          <p className="text-zinc-400">
            Connect your AI agents with your favorite tools and platforms
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {integrations.map((int, i) => {
            const isConnected = connectedMap[int.name] ?? int.connected;
            return (
              <motion.div
                key={int.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="p-5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/5 hover:border-white/10 transition-all"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold ${int.color}`}
                  >
                    {int.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold">{int.name}</h3>
                    <p className="text-zinc-500 text-sm">{int.description}</p>
                  </div>
                </div>

                <button
                  onClick={() => toggleConnect(int.name)}
                  className={`w-full py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${
                    isConnected
                      ? "bg-green-500/10 text-green-400 border border-green-500/20"
                      : "bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10"
                  }`}
                >
                  {isConnected ? (
                    <>
                      <Check className="w-4 h-4" />
                      Connected
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4" />
                      Connect
                    </>
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

export default function IntegrationsPage() {
  return (
    <FeatureGate
      featureKey="customIntegrations"
      title="Custom Integrations"
      description="Connect your AI agents with Slack, WhatsApp, Zapier, Shopify, and more third-party platforms."
      requiredPlan="Premium"
      icon={<Puzzle className="w-8 h-8 text-zinc-500" />}
    >
      <IntegrationsContent />
    </FeatureGate>
  );
}

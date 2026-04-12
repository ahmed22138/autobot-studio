"use client";

import { motion } from "framer-motion";
import { Key, Clock } from "lucide-react";
import FeatureGate from "@/components/FeatureGate";

function ApiAccessContent() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20 bg-white/5 border border-white/10 rounded-2xl px-8"
        >
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 flex items-center justify-center mx-auto mb-5">
            <Clock className="w-8 h-8 text-amber-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">API Access — Coming Soon</h1>
          <p className="text-zinc-400 mb-2">
            Developers ke liye REST API jald aa raha hai.
          </p>
          <p className="text-zinc-500 text-sm">
            Apne agents ko kisi bhi app mein integrate karo — API keys, webhooks, aur full documentation ke saath.
          </p>
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

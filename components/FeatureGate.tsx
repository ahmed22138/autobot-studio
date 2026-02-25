"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, ArrowUpRight, Loader2 } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";

interface FeatureGateProps {
  featureKey: "analytics" | "apiAccess" | "whiteLabel" | "customIntegrations";
  title: string;
  description: string;
  requiredPlan: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

interface UsageData {
  plan: string;
  features: {
    analytics: boolean;
    apiAccess: boolean;
    whiteLabel: boolean;
    customIntegrations: boolean;
  };
}

export default function FeatureGate({
  featureKey,
  title,
  description,
  requiredPlan,
  icon,
  children,
}: FeatureGateProps) {
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/usage")
      .then((res) => res.json())
      .then((data) => setUsage(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const hasAccess = usage?.features?.[featureKey] ?? false;

  if (loading) {
    return (
      <ProtectedRoute>
        <main className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </main>
      </ProtectedRoute>
    );
  }

  if (!hasAccess) {
    return (
      <ProtectedRoute>
        <main className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative w-full max-w-md text-center"
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto">
                <Lock className="w-8 h-8 text-zinc-500" />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
                <p className="text-zinc-400 text-sm">{description}</p>
              </div>

              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <p className="text-amber-300 text-sm font-medium mb-1">
                  {requiredPlan} Plan Required
                </p>
                <p className="text-zinc-400 text-xs">
                  You&apos;re on the <span className="capitalize font-medium text-white">{usage?.plan}</span> plan.
                  Upgrade to unlock this feature.
                </p>
              </div>

              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium transition-all"
              >
                Upgrade Now
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </main>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  );
}

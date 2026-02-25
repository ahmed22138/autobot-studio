"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Zap, Star, Crown, Check, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

const plans = [
  {
    name: "Basic",
    price: "Free",
    period: "",
    description: "Perfect for getting started with AI agents",
    icon: Zap,
    color: "zinc",
    features: [
      { text: "1 AI Agent", included: true },
      { text: "100 Messages/month", included: true },
      { text: "Basic Customization", included: true },
      { text: "Email Support", included: true },
      { text: "Analytics Dashboard", included: false },
      { text: "API Access", included: false },
      { text: "White-label", included: false },
      { text: "Custom Integrations", included: false },
    ],
    cta: "Get Started",
    popular: false,
    priceId: null,
  },
  {
    name: "Medium",
    price: "$8",
    period: "/mo",
    description: "For growing businesses that need more power",
    icon: Star,
    color: "blue",
    features: [
      { text: "5 AI Agents", included: true },
      { text: "1,000 Messages/month", included: true },
      { text: "Advanced Customization", included: true },
      { text: "Priority Support", included: true },
      { text: "Analytics Dashboard", included: true },
      { text: "API Access", included: false },
      { text: "White-label", included: false },
      { text: "Custom Integrations", included: false },
    ],
    cta: "Subscribe",
    popular: true,
    priceId: process.env.NEXT_PUBLIC_STRIPE_MEDIUM_PRICE_ID,
  },
  {
    name: "Premium",
    price: "$15",
    period: "/mo",
    description: "Unlimited power for enterprise needs",
    icon: Crown,
    color: "purple",
    features: [
      { text: "Unlimited AI Agents", included: true },
      { text: "Unlimited Messages", included: true },
      { text: "Full Customization", included: true },
      { text: "24/7 Priority Support", included: true },
      { text: "Advanced Analytics", included: true },
      { text: "API Access", included: true },
      { text: "White-label", included: true },
      { text: "Custom Integrations", included: true },
    ],
    cta: "Subscribe",
    popular: false,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID,
  },
];

export default function PricingPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
  }, []);

  const handleSubscribe = async (priceId: string | null | undefined) => {
    if (!priceId) {
      // Basic plan — go to signup or dashboard
      if (user) {
        router.push("/dashboard");
      } else {
        router.push("/signup");
      }
      return;
    }

    if (!user) {
      router.push(`/login?redirect=/pricing`);
      return;
    }

    setLoadingPlan(priceId);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("Checkout error:", data.error);
        setLoadingPlan(null);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setLoadingPlan(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f] px-4 py-24">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Choose Your{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Plan
            </span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Start free and scale as you grow. All plans include core AI agent
            capabilities with no hidden fees.
          </p>
        </motion.div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const isPopular = plan.popular;
            const isLoading = loadingPlan === plan.priceId;

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative rounded-2xl p-[1px] ${
                  isPopular
                    ? "bg-gradient-to-b from-blue-500 to-purple-600"
                    : "bg-white/10"
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-semibold">
                    Most Popular
                  </div>
                )}

                <div
                  className={`h-full rounded-2xl bg-[#0f0f18] p-6 lg:p-8 flex flex-col ${
                    isPopular ? "border-0" : ""
                  }`}
                >
                  {/* Plan Icon & Name */}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        plan.color === "blue"
                          ? "bg-blue-500/20"
                          : plan.color === "purple"
                          ? "bg-purple-500/20"
                          : "bg-zinc-500/20"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${
                          plan.color === "blue"
                            ? "text-blue-400"
                            : plan.color === "purple"
                            ? "text-purple-400"
                            : "text-zinc-400"
                        }`}
                      />
                    </div>
                    <h3 className="text-xl font-semibold text-white">
                      {plan.name}
                    </h3>
                  </div>

                  {/* Price */}
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-white">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-zinc-500 text-lg">
                        {plan.period}
                      </span>
                    )}
                  </div>
                  <p className="text-zinc-500 text-sm mb-6">
                    {plan.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature.text} className="flex items-center gap-3">
                        <Check
                          className={`w-4 h-4 flex-shrink-0 ${
                            feature.included
                              ? plan.color === "blue"
                                ? "text-blue-400"
                                : plan.color === "purple"
                                ? "text-purple-400"
                                : "text-zinc-400"
                              : "text-zinc-700"
                          }`}
                        />
                        <span
                          className={`text-sm ${
                            feature.included ? "text-zinc-300" : "text-zinc-600"
                          }`}
                        >
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleSubscribe(plan.priceId)}
                    disabled={isLoading}
                    className={`w-full py-3 px-6 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                      isPopular
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-blue-500/20"
                        : plan.color === "purple"
                        ? "bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20"
                        : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      plan.cta
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center text-zinc-600 text-sm mt-12"
        >
          All paid plans include a 14-day free trial. Cancel anytime.
        </motion.p>
      </div>
    </main>
  );
}

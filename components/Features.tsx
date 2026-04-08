"use client";

import { motion } from "framer-motion";
import { Bot, Code2, MessageSquare, BarChart3, Check, ArrowRight, Zap, Shield, Globe } from "lucide-react";

const bentoFeatures = [
  {
    id: "agents",
    icon: Bot,
    label: "Core Feature",
    title: "Custom AI Agents",
    description: "Design agents with unique personalities, tones, and deep knowledge bases trained on your data.",
    size: "large",   // spans 2 cols on desktop
    gradient: "from-violet-600 to-purple-700",
    glow: "rgba(124,58,237,0.3)",
    accent: "#a78bfa",
    perks: ["Custom personality & tone", "Knowledge base training", "Multi-language support"],
  },
  {
    id: "embed",
    icon: Code2,
    label: "Developer-first",
    title: "One-Click Embed",
    description: "Add your agent to any website with a single script tag.",
    size: "small",
    gradient: "from-cyan-500 to-blue-600",
    glow: "rgba(6,182,212,0.25)",
    accent: "#67e8f9",
    perks: [],
  },
  {
    id: "analytics",
    icon: BarChart3,
    label: "Insights",
    title: "Smart Analytics",
    description: "Track conversations, engagement, and performance in real time.",
    size: "small",
    gradient: "from-emerald-500 to-teal-600",
    glow: "rgba(16,185,129,0.25)",
    accent: "#6ee7b7",
    perks: [],
  },
  {
    id: "chat",
    icon: MessageSquare,
    label: "Real-time",
    title: "Lightning Chat",
    description: "Sub-100ms responses with natural typing effects and full conversation memory for every user.",
    size: "large",
    gradient: "from-blue-600 to-indigo-700",
    glow: "rgba(37,99,235,0.3)",
    accent: "#93c5fd",
    perks: ["<50ms response time", "Conversation memory", "Typing indicators"],
  },
  {
    id: "security",
    icon: Shield,
    label: "Enterprise",
    title: "Secure & Reliable",
    description: "SOC 2 compliant with 99.9% uptime SLA.",
    size: "small",
    gradient: "from-rose-500 to-pink-600",
    glow: "rgba(244,63,94,0.25)",
    accent: "#fda4af",
    perks: [],
  },
  {
    id: "global",
    icon: Globe,
    label: "Scale",
    title: "Global CDN",
    description: "Deployed on edge nodes worldwide for instant load times.",
    size: "small",
    gradient: "from-amber-500 to-orange-600",
    glow: "rgba(245,158,11,0.25)",
    accent: "#fcd34d",
    perks: [],
  },
];

const steps = [
  {
    n: "01",
    title: "Create Your Agent",
    desc: "Name your agent, define its personality, tone, and purpose in under 2 minutes.",
    items: ["Set name & avatar", "Define personality", "Choose response style"],
    color: "from-violet-600 to-purple-700",
    accent: "#a78bfa",
  },
  {
    n: "02",
    title: "Train & Customize",
    desc: "Upload your docs, FAQs, or product data. The agent learns your brand instantly.",
    items: ["Upload knowledge base", "Set custom responses", "Configure tone & language"],
    color: "from-blue-600 to-cyan-600",
    accent: "#67e8f9",
  },
  {
    n: "03",
    title: "Deploy Anywhere",
    desc: "Paste one script tag and your AI agent is live on any website or app.",
    items: ["One-line embed code", "Works on any platform", "Real-time activation"],
    color: "from-emerald-500 to-teal-600",
    accent: "#6ee7b7",
  },
];

export default function Features() {
  return (
    <>
      {/* ══════════════════════════════
          BENTO FEATURES
      ══════════════════════════════ */}
      <section id="features" className="relative py-28 px-4 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
        {/* background aurora */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] rounded-full opacity-30"
            style={{ background: "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)", filter: "blur(80px)" }} />
          <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] rounded-full opacity-30"
            style={{ background: "radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)", filter: "blur(80px)" }} />
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/[0.08] border border-violet-500/20 text-violet-300/80 text-xs font-medium mb-5">
              <Zap className="w-3 h-3" />
              Everything included
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
              All the tools to build
              <br />
              <span className="text-aurora">world-class agents</span>
            </h2>
            <p className="text-white/40 max-w-xl mx-auto text-base leading-relaxed">
              No backend. No DevOps. Just powerful AI — ready to deploy in minutes.
            </p>
          </motion.div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 auto-rows-fr">
            {bentoFeatures.map((f, i) => (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className={`bento-card rounded-2xl p-6 group cursor-default ${
                  f.size === "large" ? "lg:col-span-2" : "lg:col-span-1"
                }`}
              >
                {/* Label */}
                <div className="flex items-center justify-between mb-5">
                  <span className="text-[10px] font-semibold uppercase tracking-widest"
                    style={{ color: f.accent + "99" }}>
                    {f.label}
                  </span>
                  {/* Icon */}
                  <div className="relative">
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500 blur-lg"
                      style={{ background: f.glow }} />
                    <div className={`relative w-10 h-10 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center shadow-lg`}>
                      <f.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>

                <h3 className="text-white/90 font-bold text-lg mb-2 group-hover:text-white transition-colors">
                  {f.title}
                </h3>
                <p className="text-white/35 text-sm leading-relaxed mb-4 group-hover:text-white/50 transition-colors">
                  {f.description}
                </p>

                {/* Perks list (large cards only) */}
                {f.perks.length > 0 && (
                  <ul className="space-y-2">
                    {f.perks.map((p) => (
                      <li key={p} className="flex items-center gap-2 text-xs text-white/40">
                        <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: f.glow }}>
                          <Check className="w-2.5 h-2.5" style={{ color: f.accent }} />
                        </div>
                        {p}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Hover CTA */}
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1 text-xs font-medium"
                  style={{ color: f.accent + "cc" }}>
                  Learn more <ArrowRight className="w-3 h-3" />
                </div>

                {/* Bottom inner glow on hover */}
                <div className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `linear-gradient(90deg, transparent, ${f.accent}40, transparent)` }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          HOW IT WORKS
      ══════════════════════════════ */}
      <section id="how-it-works" className="relative py-28 px-4 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />

        <div className="relative max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/[0.08] border border-blue-500/20 text-blue-300/80 text-xs font-medium mb-5">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              Simple 3-step process
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
              From idea to live agent
              <br />
              <span className="text-aurora-warm">in under 5 minutes</span>
            </h2>
            <p className="text-white/40 max-w-lg mx-auto text-base">
              No complex setup. No waiting. Just build, train, and deploy.
            </p>
          </motion.div>

          {/* Steps */}
          <div className="relative">
            {/* Vertical connector */}
            <div className="absolute left-[27px] top-12 bottom-12 w-px bg-gradient-to-b from-violet-500/30 via-blue-500/20 to-emerald-500/20 hidden md:block" />

            <div className="space-y-5">
              {steps.map((step, i) => (
                <motion.div
                  key={step.n}
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: i * 0.15, ease: [0.4, 0, 0.2, 1] }}
                  whileHover={{ x: 4, transition: { duration: 0.2 } }}
                  className="bento-card rounded-2xl p-6 flex flex-col md:flex-row items-start gap-5 group"
                >
                  {/* Number badge */}
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 blur-lg"
                      style={{ background: `linear-gradient(135deg, ${step.accent}66, transparent)` }} />
                    <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} bg-opacity-20 border border-white/[0.08] flex items-center justify-center`}
                      style={{ background: `linear-gradient(135deg, ${step.accent}18, ${step.accent}08)` }}>
                      <span className="text-xl font-black" style={{ color: step.accent }}>
                        {step.n}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white/90 font-bold text-xl mb-2 group-hover:text-white transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-white/40 text-sm leading-relaxed mb-4 group-hover:text-white/55 transition-colors">
                      {step.desc}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {step.items.map((item) => (
                        <span key={item} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium border"
                          style={{
                            background: `${step.accent}10`,
                            borderColor: `${step.accent}20`,
                            color: `${step.accent}cc`,
                          }}>
                          <Check className="w-2.5 h-2.5" />
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          CTA SECTION
      ══════════════════════════════ */}
      <section className="relative py-28 px-4 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />

        {/* Aurora glow */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full"
            style={{ background: "radial-gradient(ellipse, rgba(124,58,237,0.15) 0%, rgba(37,99,235,0.08) 40%, transparent 70%)", filter: "blur(60px)" }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="relative max-w-3xl mx-auto"
        >
          {/* Card */}
          <div className="relative bento-card rounded-2xl sm:rounded-3xl p-8 sm:p-12 lg:p-16 text-center overflow-hidden">
            {/* Inner aurora */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(124,58,237,0.08) 0%, transparent 70%)" }} />
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: "linear-gradient(90deg, transparent, rgba(124,58,237,0.4), rgba(6,182,212,0.3), transparent)" }} />

            {/* Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: "spring", stiffness: 180 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 mb-6 shadow-2xl"
              style={{ boxShadow: "0 20px 60px rgba(124,58,237,0.35)" }}
            >
              <Bot className="w-8 h-8 text-white" />
            </motion.div>

            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-4">
              Start building your
              <br />
              <span className="text-aurora">agent today</span>
            </h2>
            <p className="text-white/40 mb-10 max-w-lg mx-auto text-base leading-relaxed">
              Join 1,200+ teams deploying intelligent AI agents with AutoBot Studio.
              Free forever plan. No credit card required.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
              <a href="/signup"
                className="aurora-btn shimmer group inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 text-white font-semibold text-[15px]">
                <Zap className="w-4 h-4" />
                Get Started Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="/pricing"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl glass-2 text-white/50 hover:text-white/80 font-medium text-[15px] transition-all duration-300">
                View Pricing
              </a>
            </div>

            {/* Bottom trust row */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-8 border-t border-white/[0.05]">
              {[
                { icon: Check, text: "Free forever plan" },
                { icon: Shield, text: "SOC 2 compliant" },
                { icon: Zap, text: "Live in 5 minutes" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-white/35 text-xs">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/15 flex items-center justify-center">
                    <Icon className="w-2.5 h-2.5 text-emerald-400" />
                  </div>
                  {text}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>
    </>
  );
}

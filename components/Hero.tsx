"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Bot, MessageSquare, Star, Check } from "lucide-react";

/* ── Fake chat messages for the product mockup ── */
const chatMessages = [
  { role: "user",  text: "What plans do you offer?" },
  { role: "bot",   text: "We have 3 plans: Free, Pro ($29/mo), and Enterprise. The Pro plan includes unlimited agents and analytics." },
  { role: "user",  text: "How do I embed it?" },
  { role: "bot",   text: "Just paste one <script> tag — your bot goes live instantly on any site!" },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden aurora-bg dot-grid">

      {/* ── Animated aurora orbs ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* top-left violet */}
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -25, 0], scale: [1, 1.12, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 -left-24 w-[700px] h-[700px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.22) 0%, transparent 70%)", filter: "blur(60px)" }}
        />
        {/* right blue */}
        <motion.div
          animate={{ x: [0, -25, 0], y: [0, 30, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(37,99,235,0.16) 0%, transparent 70%)", filter: "blur(70px)" }}
        />
        {/* bottom cyan */}
        <motion.div
          animate={{ x: [0, 20, 0], y: [0, -20, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)", filter: "blur(80px)" }}
        />
        {/* center faint */}
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)", filter: "blur(90px)" }}
        />

        {/* Floating sparkle dots */}
        {[
          { x: "18%", y: "22%", d: 0 },
          { x: "75%", y: "15%", d: 1.2 },
          { x: "88%", y: "60%", d: 0.5 },
          { x: "10%", y: "70%", d: 2 },
          { x: "50%", y: "85%", d: 0.8 },
          { x: "35%", y: "12%", d: 1.5 },
        ].map((p, i) => (
          <motion.div key={i}
            animate={{ y: [0, -12, 0], opacity: [0.25, 0.7, 0.25] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: p.d, ease: "easeInOut" }}
            className="absolute w-1 h-1 rounded-full bg-violet-400/50"
            style={{ left: p.x, top: p.y }}
          />
        ))}
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-12 sm:pb-16">
        <div className="grid lg:grid-cols-2 gap-8 xl:gap-12 items-center">

          {/* LEFT — text */}
          <div>
            {/* Live badge */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="mb-7"
            >
              <div className="live-badge w-fit">
                <span className="pulse-ring" />
                <Zap className="w-3 h-3 text-violet-400" />
                AI-Powered SaaS — Now in Beta
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
              className="text-4xl sm:text-5xl xl:text-6xl 2xl:text-7xl font-bold tracking-tight leading-[1.06] mb-6"
            >
              <span className="text-white/95">Deploy</span>
              <br />
              <span className="text-aurora">AI Agents</span>
              <br />
              <span className="text-white/95">
                in{" "}
                <span className="relative inline-block">
                  <span className="text-white">Minutes</span>
                  {/* underline */}
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.7, delay: 0.7 }}
                    className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full origin-left"
                    style={{ background: "linear-gradient(90deg, #7c3aed, #06b6d4)" }}
                  />
                </span>
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.22 }}
              className="text-base sm:text-lg text-white/45 max-w-lg mb-8 leading-relaxed"
            >
              Build intelligent chatbots, train them on your data, and embed
              them anywhere with{" "}
              <span className="text-white/70 font-medium">a single line of code</span>.
              Zero backend knowledge required.
            </motion.p>

            {/* CTA row */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.32 }}
              className="flex flex-col xs:flex-row sm:flex-row gap-3 mb-8 sm:mb-10"
            >
              <Link href="/signup"
                className="aurora-btn shimmer group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 text-white font-semibold text-[15px]">
                <Zap className="w-4 h-4" />
                Get Started — It&apos;s Free
                <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  <ArrowRight className="w-4 h-4" />
                </motion.span>
              </Link>
              <a href="#features"
                className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl glass-2 text-white/60 hover:text-white/90 font-medium text-[15px] transition-all duration-300 hover:border-white/15">
                Watch Demo
                <ArrowRight className="w-4 h-4 opacity-40 group-hover:opacity-80 group-hover:translate-x-1 transition-all" />
              </a>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.48 }}
              className="flex flex-wrap items-center gap-4 sm:gap-5"
            >
              {/* Avatars */}
              <div className="flex items-center gap-2.5">
                <div className="flex -space-x-2.5">
                  {["#7c3aed","#2563eb","#06b6d4","#a855f7","#059669"].map((c, i) => (
                    <div key={i} className="w-7 h-7 rounded-full border-2 border-[#02020a] flex items-center justify-center text-[9px] font-bold text-white"
                      style={{ background: `linear-gradient(135deg, ${c}, ${c}88)` }}>
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex gap-0.5 mb-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />)}
                  </div>
                  <span className="text-white/35 text-xs">1,200+ happy teams</span>
                </div>
              </div>

              <div className="w-px h-6 bg-white/[0.08] hidden sm:block" />

              {/* Perks */}
              {["No credit card","Setup in 5 min","Cancel anytime"].map(t => (
                <div key={t} className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <Check className="w-2 h-2 text-emerald-400" />
                  </div>
                  <span className="text-white/35 text-xs">{t}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT — product mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.75, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="hidden lg:block"
          >
            <div className="relative">
              {/* Outer glow */}
              <div className="absolute -inset-4 bg-gradient-to-br from-violet-600/20 via-blue-600/10 to-cyan-500/15 rounded-3xl blur-2xl" />

              {/* Chat window */}
              <div className="relative glass-3 glass-highlight rounded-2xl overflow-hidden border border-white/[0.08]">
                {/* Title bar */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                  </div>
                  <div className="flex-1 mx-3 px-3 py-1 rounded-md bg-white/[0.04] border border-white/[0.05] text-white/25 text-[11px] font-mono">
                    autobot.studio/agent/support
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-400/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live
                  </div>
                </div>

                {/* Chat area */}
                <div className="p-5 space-y-4 min-h-[320px]">
                  {/* Agent header */}
                  <div className="flex items-center gap-3 pb-3 border-b border-white/[0.04]">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center">
                      <Bot className="w-4.5 h-4.5 text-white" />
                    </div>
                    <div>
                      <div className="text-white/85 text-sm font-semibold">Support Agent</div>
                      <div className="flex items-center gap-1 text-[11px] text-emerald-400/80">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Online · replies in seconds
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  {chatMessages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + i * 0.3 }}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {msg.role === "bot" && (
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-600/80 to-blue-600/80 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                          <MessageSquare className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <div className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-[12px] leading-relaxed ${
                        msg.role === "user"
                          ? "bg-gradient-to-br from-violet-600/70 to-blue-600/60 text-white rounded-br-sm"
                          : "bg-white/[0.06] text-white/75 rounded-bl-sm border border-white/[0.06]"
                      }`}>
                        {msg.text}
                      </div>
                    </motion.div>
                  ))}

                  {/* Typing indicator */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.2 }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-6 h-6 rounded-lg bg-white/[0.05] flex items-center justify-center">
                      <Bot className="w-3 h-3 text-white/40" />
                    </div>
                    <div className="flex gap-1 px-3 py-2 rounded-2xl bg-white/[0.04] border border-white/[0.05]">
                      {[0,1,2].map(i => (
                        <motion.span key={i}
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                          className="w-1.5 h-1.5 rounded-full bg-white/30"
                        />
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Input bar */}
                <div className="px-4 py-3 border-t border-white/[0.05] flex items-center gap-3">
                  <div className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.07] text-white/25 text-[12px]">
                    Ask me anything…
                  </div>
                  <button className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
              </div>

              {/* Floating badge: powered by */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5 }}
                className="absolute -bottom-5 -left-5 glass-2 glass-highlight rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 border border-white/[0.08]"
                style={{ animation: "float-up 4s ease-in-out infinite" }}
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-white" />
                </div>
                <div>
                  <div className="text-white/80 text-[11px] font-semibold">Response sent</div>
                  <div className="text-white/30 text-[10px]">48ms · 99.9% uptime</div>
                </div>
              </motion.div>

              {/* Floating badge: users */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.8 }}
                className="absolute -top-4 -right-4 glass-2 glass-highlight rounded-xl px-3.5 py-2.5 border border-white/[0.08]"
                style={{ animation: "float-up 5s ease-in-out infinite 1s" }}
              >
                <div className="text-[11px] text-white/35 mb-1">Active users</div>
                <div className="text-xl font-bold text-aurora">10,482</div>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#02020a] to-transparent pointer-events-none" />
    </section>
  );
}

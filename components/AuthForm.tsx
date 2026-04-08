"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, Lock, Loader2, User, Eye, EyeOff,
  ArrowRight, Bot, Zap, Check, Shield,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface AuthFormProps {
  mode: "login" | "signup";
}

const perks = [
  "Free forever — no credit card needed",
  "Deploy AI agents in under 5 minutes",
  "Unlimited conversations on free plan",
];

export default function AuthForm({ mode }: AuthFormProps) {
  const router   = useRouter();
  const supabase = createClient();
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false); return;
    }
    if (mode === "signup") {
      if (!name.trim()) { setError("Please enter your name"); setLoading(false); return; }
      const { error: err } = await supabase.auth.signUp({
        email, password,
        options: { data: { name: name.trim(), full_name: name.trim() } },
      });
      if (err) { setError(err.message); setLoading(false); return; }
    } else {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) { setError(err.message); setLoading(false); return; }
    }
    setLoading(false);
    router.push("/dashboard"); router.refresh();
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  return (
    <div className="min-h-screen aurora-bg dot-grid flex items-center justify-center px-4 py-8 sm:py-12 lg:py-0 relative overflow-hidden">

      {/* ── Background orbs ── */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.15, 1], x: [0, 25, 0] }}
          transition={{ duration: 14, repeat: Infinity }}
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)", filter: "blur(70px)" }}
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], y: [0, 25, 0] }}
          transition={{ duration: 18, repeat: Infinity, delay: 3 }}
          className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)", filter: "blur(80px)" }}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.25, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute top-1/2 right-1/4 w-[400px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)", filter: "blur(90px)" }}
        />
      </div>

      {/* ── Main container — brings text + form close together ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
        className="relative z-10 w-full max-w-[900px] flex flex-col lg:flex-row items-stretch rounded-3xl overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.025)",
          backdropFilter: "blur(32px)",
          WebkitBackdropFilter: "blur(32px)",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        {/* ── TOP highlight line ── */}
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(124,58,237,0.5), rgba(6,182,212,0.3), transparent)" }} />

        {/* ════════════════════════════
            LEFT PANEL — desktop only
        ════════════════════════════ */}
        <div className="hidden lg:flex flex-col w-[360px] flex-shrink-0 p-8 xl:p-10 relative border-r border-white/[0.06]">
          {/* Inner aurora on left */}
          <div className="absolute inset-0 pointer-events-none rounded-l-3xl overflow-hidden">
            <div className="absolute -top-20 -left-20 w-[300px] h-[300px] rounded-full"
              style={{ background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)", filter: "blur(40px)" }} />
          </div>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 mb-8 group relative z-10 w-fit">
            <div className="relative w-8 h-8 rounded-xl overflow-hidden flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-blue-600" />
              <Bot className="relative w-4 h-4 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <span className="font-bold text-sm tracking-tight">
              <span className="text-white/90">AutoBot</span>
              <span className="text-aurora"> Studio</span>
            </span>
          </Link>

          {/* Headline — right below logo */}
          <div className="relative z-10 flex-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
            >
              <div className="live-badge w-fit mb-5">
                <span className="pulse-ring" />
                <Zap className="w-3 h-3 text-violet-400" />
                {mode === "signup" ? "Join 1,200+ teams" : "Welcome back"}
              </div>

              <h2 className="text-3xl xl:text-4xl font-bold tracking-tight text-white leading-tight mb-3">
                {mode === "signup" ? (
                  <>Build smarter<br /><span className="text-aurora">AI agents</span><br />faster.</>
                ) : (
                  <>Good to see<br />you <span className="text-aurora">again</span>.</>
                )}
              </h2>

              <p className="text-white/35 text-sm leading-relaxed mt-3">
                {mode === "signup"
                  ? "No backend. No DevOps. Just powerful AI ready in minutes."
                  : "Your agents are live and waiting. Let's keep building."}
              </p>
            </motion.div>

            {/* Perks */}
            {mode === "signup" && (
              <motion.ul
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-6 space-y-2.5"
              >
                {perks.map((p, i) => (
                  <motion.li
                    key={p}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + i * 0.08 }}
                    className="flex items-center gap-2.5 text-sm text-white/40"
                  >
                    <div className="w-4 h-4 rounded-full bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-2.5 h-2.5 text-emerald-400" />
                    </div>
                    {p}
                  </motion.li>
                ))}
              </motion.ul>
            )}

            {/* Security note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 flex items-center gap-2 text-xs text-white/25"
            >
              <Shield className="w-3.5 h-3.5 text-white/20" />
              SOC 2 compliant · SSL encrypted · GDPR ready
            </motion.div>
          </div>

          {/* Chat preview card — bottom */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="relative z-10 mt-6 rounded-2xl p-4"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                <Bot className="w-3 h-3 text-white" />
              </div>
              <span className="text-white/55 text-xs font-medium">Support Agent</span>
              <span className="ml-auto flex items-center gap-1 text-[10px] text-emerald-400/70">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live
              </span>
            </div>
            <p className="text-white/28 text-xs leading-relaxed">
              &ldquo;Hi! I can answer product questions, handle support tickets, and more — 24/7.&rdquo;
            </p>
          </motion.div>
        </div>

        {/* ════════════════════════════
            RIGHT PANEL — form
        ════════════════════════════ */}
        <div className="flex-1 flex flex-col justify-center p-6 sm:p-8 xl:p-10">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-sm text-aurora">AutoBot Studio</span>
          </div>

          {/* Form header */}
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-1">
              {mode === "login" ? "Sign in to your account" : "Create your free account"}
            </h1>
            <p className="text-white/35 text-sm">
              {mode === "login"
                ? "Enter your details to continue"
                : "Start building AI agents today"}
            </p>
          </div>

          {/* Google button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 py-2.5 sm:py-3 px-4 rounded-xl text-white/65 hover:text-white/90 text-sm font-medium transition-all duration-200 mb-4"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </motion.button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-white/[0.05]" />
            <span className="text-white/22 text-[11px]">or with email</span>
            <div className="flex-1 h-px bg-white/[0.05]" />
          </div>

          {/* Form fields */}
          <form onSubmit={handleSubmit} className="space-y-3">

            {mode === "signup" && (
              <div className="relative group">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-violet-400/60 transition-colors pointer-events-none" />
                <input
                  type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="Full name" required autoComplete="name"
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl text-white/80 text-sm placeholder:text-white/20 outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = "rgba(124,58,237,0.4)"}
                  onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"}
                />
              </div>
            )}

            <div className="relative group">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-violet-400/60 transition-colors pointer-events-none" />
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="Email address" required autoComplete="email"
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl text-white/80 text-sm placeholder:text-white/20 outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
                onFocus={e => e.currentTarget.style.borderColor = "rgba(124,58,237,0.4)"}
                onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"}
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-violet-400/60 transition-colors pointer-events-none" />
              <input
                type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Password" required autoComplete={mode === "login" ? "current-password" : "new-password"}
                className="w-full pl-10 pr-11 py-2.5 sm:py-3 rounded-xl text-white/80 text-sm placeholder:text-white/20 outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
                onFocus={e => e.currentTarget.style.borderColor = "rgba(124,58,237,0.4)"}
                onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"}
              />
              <button
                type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors p-0.5"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl overflow-hidden"
                  style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                  <p className="text-red-400/90 text-xs">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit" disabled={loading}
              className="aurora-btn w-full py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 text-white text-sm font-semibold disabled:opacity-40 flex items-center justify-center gap-2 mt-1"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" />{mode === "login" ? "Signing in…" : "Creating account…"}</>
              ) : (
                <>{mode === "login" ? "Sign In" : "Create Account"}<ArrowRight className="w-4 h-4" /></>
              )}
            </motion.button>
          </form>

          {/* Switch link */}
          <p className="text-white/25 text-xs text-center mt-4">
            {mode === "login" ? (
              <>No account?{" "}
                <Link href="/signup" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
                  Sign up free
                </Link>
              </>
            ) : (
              <>Already have an account?{" "}
                <Link href="/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
                  Sign in
                </Link>
              </>
            )}
          </p>

          {/* Mobile perks */}
          <div className="lg:hidden mt-6 pt-5 border-t border-white/[0.05] space-y-2">
            {perks.map(p => (
              <div key={p} className="flex items-center gap-2 text-xs text-white/30">
                <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                {p}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

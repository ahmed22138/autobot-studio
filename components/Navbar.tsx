"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, LogOut, LayoutDashboard, Menu, X, Zap, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => { subscription.unsubscribe(); window.removeEventListener("scroll", onScroll); };
  }, []);

  const handleLogout = async () => {
    await createClient().auth.signOut();
    setUser(null);
    router.push("/");
    router.refresh();
  };

  if (pathname?.startsWith("/chatbot/")) return null;

  const navLinks = !user
    ? [
        { href: "#features",    label: "Features",    anchor: true },
        { href: "#how-it-works",label: "How It Works",anchor: true },
        { href: "/docs",        label: "Docs",        anchor: false },
        { href: "/pricing",     label: "Pricing",     anchor: false },
        { href: "/support",     label: "Support",     anchor: false },
      ]
    : [
        { href: "/dashboard",   label: "Dashboard",   anchor: false },
        { href: "/docs",        label: "Docs",        anchor: false },
        { href: "/pricing",     label: "Pricing",     anchor: false },
        { href: "/support",     label: "Support",     anchor: false },
      ];

  return (
    <>
      {/* ── DESKTOP: floating pill ── */}
      <motion.nav
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 hidden md:block w-full max-w-4xl px-4"
      >
        <div
          className={`glass-2 glass-highlight rounded-2xl px-4 h-14 flex items-center justify-between transition-all duration-500 ${
            scrolled
              ? "shadow-2xl shadow-black/40 border-white/10"
              : "border-white/[0.06]"
          }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="relative w-8 h-8 rounded-xl flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-blue-600 opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-blue-600 blur-md opacity-60" />
              <Bot className="relative w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-sm tracking-tight">
              <span className="text-white/90">AutoBot</span>
              <span className="text-aurora"> Studio</span>
            </span>
          </Link>

          {/* Center links */}
          <div className="flex items-center gap-1">
            {navLinks.map((link) => (
              link.anchor ? (
                <a key={link.href} href={link.href}
                  className="relative px-3.5 py-2 text-[13px] text-white/50 hover:text-white/90 transition-colors duration-200 rounded-xl hover:bg-white/[0.06] font-medium">
                  {link.label}
                </a>
              ) : (
                <Link key={link.href} href={link.href}
                  className="relative px-3.5 py-2 text-[13px] text-white/50 hover:text-white/90 transition-colors duration-200 rounded-xl hover:bg-white/[0.06] font-medium flex items-center gap-1.5">
                  {link.href === "/dashboard" && <LayoutDashboard className="w-3 h-3 opacity-60" />}
                  {link.label}
                </Link>
              )
            ))}
          </div>

          {/* Right CTA */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {!user ? (
              <>
                <Link href="/login"
                  className="px-3.5 py-2 text-[13px] text-white/50 hover:text-white/90 transition-colors font-medium">
                  Log in
                </Link>
                <Link href="/signup"
                  className="aurora-btn shimmer flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-[13px] font-semibold">
                  <Zap className="w-3 h-3" />
                  Start free
                  <ChevronRight className="w-3 h-3 opacity-70" />
                </Link>
              </>
            ) : (
              <>
                <span className="text-[11px] text-white/30 bg-white/[0.04] px-3 py-1.5 rounded-lg border border-white/[0.06] truncate max-w-[140px]">
                  {user.email}
                </span>
                <button onClick={handleLogout}
                  className="p-2 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-500/[0.08] transition-all">
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      </motion.nav>

      {/* ── MOBILE: top bar ── */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`md:hidden fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-[#02020a]/90 backdrop-blur-2xl border-b border-white/[0.06]" : "bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between h-14 px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-sm">
              <span className="text-white/90">AutoBot</span>
              <span className="text-aurora"> Studio</span>
            </span>
          </Link>

          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-8 h-8 rounded-xl glass-1 flex items-center justify-center text-white/50"
          >
            <AnimatePresence mode="wait">
              {menuOpen ? (
                <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <X className="w-4 h-4" />
                </motion.div>
              ) : (
                <motion.div key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <Menu className="w-4 h-4" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="overflow-hidden border-t border-white/[0.05] bg-[#02020a]/95 backdrop-blur-2xl"
            >
              <div className="px-4 py-3 space-y-1">
                {navLinks.map((link, i) => (
                  <motion.div key={link.href} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                    {link.anchor ? (
                      <a href={link.href} onClick={() => setMenuOpen(false)}
                        className="block px-3 py-2.5 rounded-xl text-white/50 hover:text-white hover:bg-white/[0.05] text-sm transition-all">
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href} onClick={() => setMenuOpen(false)}
                        className="block px-3 py-2.5 rounded-xl text-white/50 hover:text-white hover:bg-white/[0.05] text-sm transition-all">
                        {link.label}
                      </Link>
                    )}
                  </motion.div>
                ))}
                <div className="pt-2 pb-1 space-y-2 border-t border-white/[0.05]">
                  {!user ? (
                    <>
                      <Link href="/login" onClick={() => setMenuOpen(false)}
                        className="block px-3 py-2.5 rounded-xl text-white/50 hover:text-white hover:bg-white/[0.05] text-sm transition-all">
                        Log in
                      </Link>
                      <Link href="/signup" onClick={() => setMenuOpen(false)}
                        className="block px-4 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-semibold text-center">
                        Get Started Free
                      </Link>
                    </>
                  ) : (
                    <button onClick={() => { handleLogout(); setMenuOpen(false); }}
                      className="block w-full text-left px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/[0.06] text-sm transition-all">
                      Sign Out
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}

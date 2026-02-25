"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Bot, LogOut, LayoutDashboard, Menu, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
    router.refresh();
  };

  // Don't show navbar on chatbot pages
  if (pathname?.startsWith("/chatbot/")) return null;

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Bot className="w-7 h-7 text-blue-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              AutoBot Studio
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {!user ? (
              <>
                <a
                  href="#features"
                  className="text-zinc-400 hover:text-white transition-colors text-sm"
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  className="text-zinc-400 hover:text-white transition-colors text-sm"
                >
                  How It Works
                </a>
                <Link
                  href="/pricing"
                  className="text-zinc-400 hover:text-white transition-colors text-sm"
                >
                  Pricing
                </Link>
                <Link
                  href="/support"
                  className="text-zinc-400 hover:text-white transition-colors text-sm"
                >
                  Support
                </Link>
                <Link
                  href="/login"
                  className="text-zinc-400 hover:text-white transition-colors text-sm"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-sm font-medium transition-all"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  href="/pricing"
                  className="text-zinc-400 hover:text-white transition-colors text-sm"
                >
                  Pricing
                </Link>
                <Link
                  href="/support"
                  className="text-zinc-400 hover:text-white transition-colors text-sm"
                >
                  Support
                </Link>
                <span className="text-zinc-500 text-sm truncate max-w-[200px]">
                  {user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-zinc-400 hover:text-red-400 transition-colors text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-zinc-400 hover:text-white"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="md:hidden pb-4 space-y-3"
          >
            {!user ? (
              <>
                <a
                  href="#features"
                  onClick={() => setMenuOpen(false)}
                  className="block text-zinc-400 hover:text-white transition-colors text-sm py-2"
                >
                  Features
                </a>
                <Link
                  href="/pricing"
                  onClick={() => setMenuOpen(false)}
                  className="block text-zinc-400 hover:text-white transition-colors text-sm py-2"
                >
                  Pricing
                </Link>
                <Link
                  href="/support"
                  onClick={() => setMenuOpen(false)}
                  className="block text-zinc-400 hover:text-white transition-colors text-sm py-2"
                >
                  Support
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block text-zinc-400 hover:text-white transition-colors text-sm py-2"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium text-center"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="block text-zinc-400 hover:text-white transition-colors text-sm py-2"
                >
                  Dashboard
                </Link>
                <Link
                  href="/pricing"
                  onClick={() => setMenuOpen(false)}
                  className="block text-zinc-400 hover:text-white transition-colors text-sm py-2"
                >
                  Pricing
                </Link>
                <Link
                  href="/support"
                  onClick={() => setMenuOpen(false)}
                  className="block text-zinc-400 hover:text-white transition-colors text-sm py-2"
                >
                  Support
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="block text-zinc-400 hover:text-red-400 transition-colors text-sm py-2"
                >
                  Logout
                </button>
              </>
            )}
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}

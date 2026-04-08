"use client";

import { Bot, Github, Twitter, Linkedin, ArrowUpRight, Zap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const links = {
  Product: [
    { label: "Features",     href: "#features",     anchor: true },
    { label: "How It Works", href: "#how-it-works",  anchor: true },
    { label: "Pricing",      href: "/pricing" },
    { label: "Dashboard",    href: "/dashboard" },
  ],
  Account: [
    { label: "Log In",   href: "/login" },
    { label: "Sign Up",  href: "/signup" },
    { label: "Support",  href: "/support" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Use",   href: "#" },
    { label: "Cookie Policy",  href: "#" },
  ],
};

const socials = [
  { Icon: Github,   href: "#", label: "GitHub" },
  { Icon: Twitter,  href: "#", label: "Twitter" },
  { Icon: Linkedin, href: "#", label: "LinkedIn" },
];

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/chatbot/")) return null;

  return (
    <footer className="relative bg-[#02020a] overflow-hidden">
      {/* Top aurora line */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(124,58,237,0.3), rgba(6,182,212,0.2), transparent)" }} />

      {/* Faint background */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(124,58,237,0.04) 0%, transparent 70%)", filter: "blur(60px)" }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Top row */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-12 gap-8 md:gap-10 pb-10 sm:pb-12 border-b border-white/[0.04]">

          {/* Brand */}
          <div className="col-span-2 md:col-span-4">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group w-fit">
              <div className="relative w-8 h-8 rounded-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-blue-600" />
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-blue-600 blur-md opacity-70" />
                <Bot className="relative w-4 h-4 text-white m-2" />
              </div>
              <span className="font-bold text-sm tracking-tight">
                <span className="text-white/85">AutoBot</span>
                <span className="text-aurora"> Studio</span>
              </span>
            </Link>

            <p className="text-white/30 text-sm leading-relaxed max-w-xs mb-6">
              Build, customize, and deploy AI-powered chatbots in minutes.
              The fastest way to add AI to your product.
            </p>

            {/* Socials */}
            <div className="flex gap-2">
              {socials.map(({ Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  whileHover={{ scale: 1.1, y: -1 }}
                  whileTap={{ scale: 0.93 }}
                  className="w-8 h-8 rounded-xl glass-1 hover:glass-2 flex items-center justify-center text-white/30 hover:text-white/70 transition-colors duration-200"
                >
                  <Icon className="w-3.5 h-3.5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category} className="md:col-span-2">
              <h3 className="text-white/50 text-[10px] font-semibold uppercase tracking-widest mb-4">
                {category}
              </h3>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item.label}>
                    {"anchor" in item && item.anchor ? (
                      <a href={item.href}
                        className="group flex items-center gap-1 text-white/30 hover:text-white/70 text-sm transition-colors duration-200">
                        {item.label}
                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    ) : (
                      <Link href={item.href}
                        className="group flex items-center gap-1 text-white/30 hover:text-white/70 text-sm transition-colors duration-200">
                        {item.label}
                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div className="md:col-span-2">
            <h3 className="text-white/50 text-[10px] font-semibold uppercase tracking-widest mb-4">
              Newsletter
            </h3>
            <p className="text-white/25 text-xs leading-relaxed mb-3">
              Get product updates and AI tips delivered weekly.
            </p>
            <div className="space-y-2">
              <input
                type="email"
                placeholder="you@company.com"
                className="w-full px-3 py-2.5 rounded-xl glass-1 text-white/70 text-xs placeholder:text-white/20 outline-none focus:border-violet-500/30 transition-colors"
              />
              <button className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-xs font-semibold hover:shadow-lg hover:shadow-violet-500/15 transition-all duration-200">
                <Zap className="w-3 h-3" />
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6">
          <p className="text-white/20 text-xs">
            &copy; {new Date().getFullYear()} AutoBot Studio, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white/20 text-xs">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

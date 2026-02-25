"use client";

import { Bot } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  // Don't show footer on chatbot pages
  if (pathname?.startsWith("/chatbot/")) return null;

  return (
    <footer className="bg-[#0a0a0f] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Bot className="w-6 h-6 text-blue-500" />
              <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                AutoBot Studio
              </span>
            </div>
            <p className="text-zinc-500 text-sm max-w-sm">
              Build, customize, and deploy AI-powered chatbots in minutes. No
              coding required.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#features"
                  className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
                >
                  How It Works
                </a>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Account</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/login"
                  className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
                >
                  Log In
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
                >
                  Sign Up
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
                >
                  Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-10 pt-6 text-center">
          <p className="text-zinc-600 text-sm">
            &copy; {new Date().getFullYear()} AutoBot Studio. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

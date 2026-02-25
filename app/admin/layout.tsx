"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Bot,
  Ticket,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  MessageCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminName, setAdminName] = useState("");
  const [loading, setLoading] = useState(true);

  // Admin emails - Only these can access admin panel
  const ADMIN_EMAILS = [
    "workb9382@gmail.com",
    "dj9581907@gmail.com"
  ];

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Redirect to login if not logged in
    if (!user) {
      if (!pathname?.includes("/admin/login")) {
        router.push("/admin/login");
      }
      setLoading(false);
      return;
    }

    const email = user.email || "";
    setAdminEmail(email);

    // Get admin name from metadata or email (with better fallback)
    let name = "";

    // Try getting from user metadata
    if (user.user_metadata?.name) {
      name = user.user_metadata.name;
    } else if (user.user_metadata?.full_name) {
      name = user.user_metadata.full_name;
    } else if (email) {
      // Extract name from email (part before @)
      name = email.split('@')[0];
      // Clean up the name (remove numbers, make it readable)
      name = name.charAt(0).toUpperCase() + name.slice(1);
    } else {
      name = "Admin";
    }

    console.log("👤 Admin User Info:", { email, name, metadata: user.user_metadata });
    setAdminName(name);

    // Check if user is admin
    if (!ADMIN_EMAILS.includes(email.toLowerCase())) {
      // Not admin - redirect to user dashboard
      router.push("/dashboard");
      return;
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  // Navigation items
  const navItems = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: Users,
    },
    {
      name: "Agents",
      href: "/admin/agents",
      icon: Bot,
    },
    {
      name: "Tickets",
      href: "/admin/tickets",
      icon: Ticket,
    },
    {
      name: "Chatbot",
      href: "/admin/chatbot",
      icon: MessageCircle,
    },
    {
      name: "Analytics",
      href: "/admin/analytics",
      icon: BarChart3,
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  // Don't show layout on login page
  if (pathname?.includes("/admin/login")) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#0f0f14] border-r border-white/5 transition-transform duration-300`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold text-lg">Admin Panel</h1>
                <p className="text-zinc-500 text-xs">AutoBot Studio</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Admin Info */}
          <div className="p-4 border-t border-white/5">
            <div className="p-3 rounded-xl bg-white/5 mb-3">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {adminName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold truncate">
                    {adminName}
                  </p>
                  <p className="text-zinc-500 text-xs truncate">
                    {adminEmail}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-amber-500/10 border border-amber-500/20">
                <Shield className="w-3 h-3 text-amber-400" />
                <span className="text-amber-400 text-xs font-semibold">
                  ADMIN ACCESS
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg bg-white/5 text-white hover:bg-white/10"
            >
              {sidebarOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>

            <div className="flex items-center gap-4 ml-auto">
              {/* Admin Profile */}
              <div className="hidden sm:flex items-center gap-3">
                <div className="text-right">
                  <p className="text-white text-sm font-semibold">{adminName}</p>
                  <p className="text-zinc-500 text-xs">{adminEmail}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center ring-2 ring-amber-500/30">
                  <span className="text-white font-bold text-sm">
                    {adminName.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Admin Badge */}
              <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30">
                <Shield className="w-4 h-4 text-amber-400" />
                <span className="text-amber-300 font-semibold text-xs">
                  ADMIN
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
        />
      )}
    </div>
  );
}

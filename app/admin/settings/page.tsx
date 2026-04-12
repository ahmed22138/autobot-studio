"use client";

import { motion } from "framer-motion";
import { Settings, Shield, Database, Mail, Key, CheckCircle } from "lucide-react";

const ADMIN_EMAILS = ["dj9581907@gmail.com", "workb9382@gmail.com"];

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Settings className="w-8 h-8 text-zinc-400" />
          Settings
        </h1>
        <p className="text-zinc-400">Admin panel configuration and info</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="space-y-6">

        {/* Admin Access */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-semibold text-white">Admin Access</h2>
          </div>
          <p className="text-zinc-500 text-sm mb-4">
            Only these emails can access the admin panel. To change, update the code in <code className="text-zinc-400 bg-white/5 px-1.5 py-0.5 rounded">app/admin/layout.tsx</code>
          </p>
          <div className="space-y-2">
            {ADMIN_EMAILS.map(email => (
              <div key={email} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span className="text-white font-mono text-sm">{email}</span>
                <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">Admin</span>
              </div>
            ))}
          </div>
        </div>

        {/* Database */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-6 h-6 text-green-400" />
            <h2 className="text-xl font-semibold text-white">Database</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
              <div>
                <p className="text-white font-medium">Supabase</p>
                <p className="text-xs text-zinc-500">PostgreSQL — Row Level Security enabled</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-semibold border border-green-500/30">
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
              <div>
                <p className="text-white font-medium">Tables</p>
                <p className="text-xs text-zinc-500">agents, messages, orders, subscriptions, payment_requests, support_tickets</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold border border-blue-500/30">
                6 tables
              </span>
            </div>
          </div>
        </div>

        {/* Email */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-semibold text-white">Email Service</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
              <div>
                <p className="text-white font-medium">Resend</p>
                <p className="text-xs text-zinc-500">Transactional emails — payment notifications, plan activation</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-semibold border border-green-500/30">
                Active
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
              <div>
                <p className="text-white font-medium">Admin Email</p>
                <p className="text-xs text-zinc-500">Payment requests notifications go here</p>
              </div>
              <span className="text-zinc-400 text-sm font-mono">dj9581907@gmail.com</span>
            </div>
          </div>
        </div>

        {/* API Keys info */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <Key className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-semibold text-white">Services</h2>
          </div>
          <div className="space-y-3">
            {[
              { name: "Supabase",    status: "Connected",   color: "green" },
              { name: "Resend",      status: "Active",      color: "green" },
              { name: "OpenAI",      status: "Via Backend", color: "blue"  },
              { name: "Render.com",  status: "Backend API", color: "blue"  },
              { name: "Vercel",      status: "Frontend",    color: "blue"  },
            ].map(s => {
              const colors: Record<string, string> = {
                green: "bg-green-500/20 text-green-400 border-green-500/30",
                blue:  "bg-blue-500/20 text-blue-400 border-blue-500/30",
              };
              return (
                <div key={s.name} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                  <p className="text-white font-medium">{s.name}</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${colors[s.color]}`}>
                    {s.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </motion.div>
    </div>
  );
}

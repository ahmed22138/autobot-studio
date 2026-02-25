"use client";

import { motion } from "framer-motion";
import { Settings, Shield, Bell, Database, Mail, Key } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Settings className="w-8 h-8 text-zinc-400" />
          Settings
        </h1>
        <p className="text-zinc-400">
          Configure admin panel preferences and security
        </p>
      </motion.div>

      {/* Settings Sections */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-6"
      >
        {/* Security */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-semibold text-white">Security</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">
                Admin Email
              </label>
              <input
                type="email"
                value="workb9382@gmail.com"
                disabled
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-zinc-500 cursor-not-allowed"
              />
              <p className="text-xs text-zinc-500 mt-1">
                Contact developer to change admin email
              </p>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-semibold text-white">Notifications</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <div>
                <p className="text-white font-medium">New User Signups</p>
                <p className="text-xs text-zinc-500">
                  Get notified when new users register
                </p>
              </div>
              <div className="w-12 h-6 bg-blue-500 rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <div>
                <p className="text-white font-medium">Support Tickets</p>
                <p className="text-xs text-zinc-500">
                  Email alerts for new tickets
                </p>
              </div>
              <div className="w-12 h-6 bg-blue-500 rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <div>
                <p className="text-white font-medium">Revenue Updates</p>
                <p className="text-xs text-zinc-500">
                  Monthly revenue reports
                </p>
              </div>
              <div className="w-12 h-6 bg-zinc-600 rounded-full relative cursor-pointer">
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Database */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-6 h-6 text-green-400" />
            <h2 className="text-xl font-semibold text-white">Database</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <div>
                <p className="text-white font-medium">Supabase Status</p>
                <p className="text-xs text-zinc-500">Database connection</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-semibold">
                Connected
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <div>
                <p className="text-white font-medium">Data Backup</p>
                <p className="text-xs text-zinc-500">Last backup: Today</p>
              </div>
              <button className="px-4 py-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 text-sm transition-all">
                Backup Now
              </button>
            </div>
          </div>
        </div>

        {/* API Keys */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <Key className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-semibold text-white">API Keys</h2>
          </div>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-white/5">
              <p className="text-zinc-400 text-sm mb-2">Supabase URL</p>
              <code className="text-xs text-zinc-500 font-mono">
                https://atyjeaegzgtpbdawbjnq.supabase.co
              </code>
            </div>
            <div className="p-3 rounded-lg bg-white/5">
              <p className="text-zinc-400 text-sm mb-2">Stripe Status</p>
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-semibold">
                Test Mode
              </span>
            </div>
          </div>
        </div>

        {/* Email Configuration */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-semibold text-white">
              Email Configuration
            </h2>
          </div>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-white/5">
              <p className="text-zinc-400 text-sm mb-2">Support Email</p>
              <p className="text-white font-mono">workb9382@gmail.com</p>
            </div>
            <div className="p-3 rounded-lg bg-white/5">
              <p className="text-zinc-400 text-sm mb-2">Email Service</p>
              <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-semibold">
                Gmail (Nodemailer)
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex justify-end"
      >
        <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium transition-all">
          Save Changes
        </button>
      </motion.div>
    </div>
  );
}

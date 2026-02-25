"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Bot,
  Ticket,
} from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-green-400" />
          Analytics & Reports
        </h1>
        <p className="text-zinc-400">
          Detailed insights and performance metrics
        </p>
      </motion.div>

      {/* Coming Soon */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-12 rounded-2xl bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-500/20 text-center"
      >
        <BarChart3 className="w-16 h-16 text-green-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">
          Advanced Analytics Coming Soon
        </h2>
        <p className="text-zinc-400 mb-6">
          We're working on bringing you detailed charts, graphs, and insights
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="p-4 rounded-xl bg-white/5 border border-white/5">
            <TrendingUp className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <p className="text-zinc-400 text-sm">User Growth Trends</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/5">
            <DollarSign className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <p className="text-zinc-400 text-sm">Revenue Analytics</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/5">
            <Bot className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <p className="text-zinc-400 text-sm">Agent Usage Stats</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/5">
            <Ticket className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
            <p className="text-zinc-400 text-sm">Support Metrics</p>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
          <h3 className="text-white font-semibold mb-4">Growth Metrics</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 text-sm">User Growth</span>
              <span className="flex items-center gap-1 text-green-400 text-sm font-semibold">
                <TrendingUp className="w-4 h-4" />
                +24%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 text-sm">Agent Creation</span>
              <span className="flex items-center gap-1 text-green-400 text-sm font-semibold">
                <TrendingUp className="w-4 h-4" />
                +18%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 text-sm">Support Tickets</span>
              <span className="flex items-center gap-1 text-red-400 text-sm font-semibold">
                <TrendingDown className="w-4 h-4" />
                -12%
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
          <h3 className="text-white font-semibold mb-4">Revenue Insights</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 text-sm">Monthly Revenue</span>
              <span className="text-white font-semibold">$450</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 text-sm">Average per User</span>
              <span className="text-white font-semibold">$12.50</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 text-sm">Growth Rate</span>
              <span className="flex items-center gap-1 text-green-400 text-sm font-semibold">
                <TrendingUp className="w-4 h-4" />
                +15%
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

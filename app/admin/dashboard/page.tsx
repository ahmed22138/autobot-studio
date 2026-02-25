
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Bot,
  Ticket,
  TrendingUp,
  Activity,
  DollarSign,
  UserCheck,
  UserX,
  Power,
  PowerOff,
  AlertCircle,
  CheckCircle,
  Clock,
  Crown,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalAgents: number;
  activeAgents: number;
  inactiveAgents: number;
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  closedTickets: number;
  basicPlanUsers: number;
  mediumPlanUsers: number;
  premiumPlanUsers: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    totalAgents: 0,
    activeAgents: 0,
    inactiveAgents: 0,
    totalTickets: 0,
    openTickets: 0,
    inProgressTickets: 0,
    resolvedTickets: 0,
    closedTickets: 0,
    basicPlanUsers: 0,
    mediumPlanUsers: 0,
    premiumPlanUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const supabase = createClient();

    try {
      // Fetch all users from auth
      const { count: totalUsers } = await supabase
        .from("agents")
        .select("user_id", { count: "exact", head: true });

      // Get unique users
      const { data: agentsData } = await supabase
        .from("agents")
        .select("user_id, status");

      const uniqueUsers = new Set(agentsData?.map((a) => a.user_id) || []);

      // Fetch agents stats
      const { data: agents } = await supabase.from("agents").select("*");

      const totalAgents = agents?.length || 0;
      const activeAgents =
        agents?.filter((a) => a.status === "active").length || 0;
      const inactiveAgents = totalAgents - activeAgents;

      // Fetch tickets stats
      const { data: tickets } = await supabase.from("support_tickets").select("*");

      const totalTickets = tickets?.length || 0;
      const openTickets =
        tickets?.filter((t) => t.status === "open").length || 0;
      const inProgressTickets =
        tickets?.filter((t) => t.status === "in_progress").length || 0;
      const resolvedTickets =
        tickets?.filter((t) => t.status === "resolved").length || 0;
      const closedTickets =
        tickets?.filter((t) => t.status === "closed").length || 0;

      // Fetch subscriptions stats
      const { data: subscriptions } = await supabase
        .from("subscriptions")
        .select("*");

      const basicPlanUsers =
        subscriptions?.filter((s) => s.plan === "basic").length || 0;
      const mediumPlanUsers =
        subscriptions?.filter((s) => s.plan === "medium").length || 0;
      const premiumPlanUsers =
        subscriptions?.filter((s) => s.plan === "premium").length || 0;

      // Recent activity (last 5 tickets)
      const { data: recentTickets } = await supabase
        .from("support_tickets")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      setRecentActivity(recentTickets || []);

      setStats({
        totalUsers: uniqueUsers.size,
        activeUsers: uniqueUsers.size, // Simplified
        inactiveUsers: 0,
        totalAgents,
        activeAgents,
        inactiveAgents,
        totalTickets,
        openTickets,
        inProgressTickets,
        resolvedTickets,
        closedTickets,
        basicPlanUsers,
        mediumPlanUsers,
        premiumPlanUsers,
      });

      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "blue",
      subStats: [
        { label: "Active", value: stats.activeUsers, icon: UserCheck },
        { label: "Inactive", value: stats.inactiveUsers, icon: UserX },
      ],
    },
    {
      title: "Total Agents",
      value: stats.totalAgents,
      icon: Bot,
      color: "purple",
      subStats: [
        { label: "Active", value: stats.activeAgents, icon: Power },
        { label: "Inactive", value: stats.inactiveAgents, icon: PowerOff },
      ],
    },
    {
      title: "Support Tickets",
      value: stats.totalTickets,
      icon: Ticket,
      color: "cyan",
      subStats: [
        { label: "Open", value: stats.openTickets, icon: AlertCircle },
        { label: "Resolved", value: stats.resolvedTickets, icon: CheckCircle },
      ],
    },
    {
      title: "Revenue Stats",
      value: `$${(stats.mediumPlanUsers * 8 + stats.premiumPlanUsers * 15).toFixed(0)}`,
      icon: DollarSign,
      color: "green",
      subStats: [
        { label: "Medium", value: stats.mediumPlanUsers, icon: TrendingUp },
        { label: "Premium", value: stats.premiumPlanUsers, icon: Crown },
      ],
    },
  ];

  const colorMap: Record<
    string,
    { bg: string; text: string; border: string }
  > = {
    blue: {
      bg: "bg-blue-500/20",
      text: "text-blue-400",
      border: "border-blue-500/20",
    },
    purple: {
      bg: "bg-purple-500/20",
      text: "text-purple-400",
      border: "border-purple-500/20",
    },
    cyan: {
      bg: "bg-cyan-500/20",
      text: "text-cyan-400",
      border: "border-cyan-500/20",
    },
    green: {
      bg: "bg-green-500/20",
      text: "text-green-400",
      border: "border-green-500/20",
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-zinc-400">
          Welcome to AutoBot Studio admin panel - Overview and analytics
        </p>
      </motion.div>

      {/* Main Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {statCards.map((card, i) => {
          const Icon = card.icon;
          const colors = colorMap[card.color];
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center`}
                >
                  <Icon className={`w-6 h-6 ${colors.text}`} />
                </div>
                <Activity className="w-5 h-5 text-zinc-600" />
              </div>

              <h3 className="text-zinc-400 text-sm font-medium mb-1">
                {card.title}
              </h3>
              <p className="text-3xl font-bold text-white mb-4">{card.value}</p>

              {/* Sub Stats */}
              <div className="space-y-2">
                {card.subStats.map((sub) => {
                  const SubIcon = sub.icon;
                  return (
                    <div
                      key={sub.label}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <SubIcon className="w-4 h-4 text-zinc-500" />
                        <span className="text-zinc-500">{sub.label}</span>
                      </div>
                      <span className="text-zinc-300 font-semibold">
                        {sub.value}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Plan Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <div className="p-6 rounded-2xl bg-gradient-to-br from-zinc-500/10 to-zinc-500/5 border border-zinc-500/20">
          <h3 className="text-zinc-400 text-sm font-medium mb-2">Basic Plan</h3>
          <p className="text-4xl font-bold text-white mb-2">
            {stats.basicPlanUsers}
          </p>
          <p className="text-zinc-500 text-sm">Users on free plan</p>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20">
          <h3 className="text-blue-400 text-sm font-medium mb-2">
            Medium Plan
          </h3>
          <p className="text-4xl font-bold text-white mb-2">
            {stats.mediumPlanUsers}
          </p>
          <p className="text-zinc-500 text-sm">$8/month subscribers</p>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20">
          <h3 className="text-amber-400 text-sm font-medium mb-2">
            Premium Plan
          </h3>
          <p className="text-4xl font-bold text-white mb-2">
            {stats.premiumPlanUsers}
          </p>
          <p className="text-zinc-500 text-sm">$15/month subscribers</p>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 rounded-2xl bg-white/5 border border-white/5"
      >
        <h2 className="text-xl font-semibold text-white mb-4">
          Recent Support Tickets
        </h2>
        {recentActivity.length === 0 ? (
          <p className="text-zinc-500 text-center py-8">No recent activity</p>
        ) : (
          <div className="space-y-3">
            {recentActivity.map((ticket) => (
              <div
                key={ticket.id}
                className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-white font-medium mb-1">
                      {ticket.subject}
                    </p>
                    <p className="text-zinc-400 text-sm mb-2">
                      {ticket.email} • {ticket.ticket_id}
                    </p>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-medium ${
                          ticket.status === "open"
                            ? "bg-blue-500/20 text-blue-400"
                            : ticket.status === "in_progress"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : ticket.status === "resolved"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-zinc-500/20 text-zinc-400"
                        }`}
                      >
                        {ticket.status}
                      </span>
                      <span className="text-zinc-500 text-xs">
                        {new Date(ticket.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Ticket Status Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-blue-400" />
            <span className="text-blue-400 font-semibold">Open</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.openTickets}</p>
        </div>

        <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-yellow-400" />
            <span className="text-yellow-400 font-semibold">In Progress</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {stats.inProgressTickets}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-green-400 font-semibold">Resolved</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {stats.resolvedTickets}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-zinc-500/10 border border-zinc-500/20">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-zinc-400" />
            <span className="text-zinc-400 font-semibold">Closed</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.closedTickets}</p>
        </div>
      </motion.div>
    </div>
  );
}

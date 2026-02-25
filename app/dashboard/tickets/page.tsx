"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Ticket,
  Mail,
  User,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
  Crown,
} from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { createClient } from "@/lib/supabase/client";

interface SupportTicket {
  id: string;
  ticket_id: string;
  name: string;
  email: string;
  plan: string;
  priority: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function SupportTicketsPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [userEmail, setUserEmail] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Admin emails - Add your admin emails here
  const ADMIN_EMAILS = [
    "workb9382@gmail.com",
    // Add more admin emails here if needed
  ];

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    const supabase = createClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const email = user.email || "";
    setUserEmail(email);

    // Check if user is admin
    const adminStatus = ADMIN_EMAILS.includes(email.toLowerCase());
    setIsAdmin(adminStatus);

    // ADMIN ONLY PAGE - Redirect non-admins
    if (!adminStatus) {
      window.location.href = "/dashboard/my-tickets";
      return;
    }

    // Fetch ALL tickets (admin only)
    const { data, error } = await supabase
      .from("support_tickets")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      setTickets(data);
    }
    if (error) {
      console.error("Error fetching tickets:", error);
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const supabase = createClient();
    await supabase
      .from("support_tickets")
      .update({ status: newStatus })
      .eq("id", id);

    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
  };

  const filteredTickets = tickets.filter((t) => {
    if (filter === "all") return true;
    return t.status === filter;
  });

  const statusColors: Record<string, { bg: string; text: string; icon: any }> = {
    open: {
      bg: "bg-blue-500/10 border-blue-500/20",
      text: "text-blue-400",
      icon: AlertCircle,
    },
    in_progress: {
      bg: "bg-yellow-500/10 border-yellow-500/20",
      text: "text-yellow-400",
      icon: Clock,
    },
    resolved: {
      bg: "bg-green-500/10 border-green-500/20",
      text: "text-green-400",
      icon: CheckCircle,
    },
    closed: {
      bg: "bg-zinc-500/10 border-zinc-500/20",
      text: "text-zinc-400",
      icon: CheckCircle,
    },
  };

  const planColors: Record<string, string> = {
    basic: "bg-zinc-500/20 text-zinc-300 border-zinc-500/30",
    medium: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    premium: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  };

  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "open").length,
    in_progress: tickets.filter((t) => t.status === "in_progress").length,
    resolved: tickets.filter((t) => t.status === "resolved").length,
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-[#0a0a0f] px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                  <Ticket className="w-8 h-8 text-blue-400" />
                  Support Tickets
                </h1>
                <p className="text-zinc-400">
                  {isAdmin
                    ? "Admin View - Managing all customer support requests"
                    : "Your support tickets"}
                </p>
              </div>
              {isAdmin && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30">
                  <Crown className="w-5 h-5 text-amber-400" />
                  <span className="text-amber-300 font-semibold text-sm">Admin Access</span>
                </div>
              )}
              {!isAdmin && userEmail && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                  <User className="w-4 h-4 text-zinc-400" />
                  <span className="text-zinc-400 text-sm">{userEmail}</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8"
          >
            <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-400 text-sm">Total</span>
                <Ticket className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-3xl font-bold text-white">{stats.total}</p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-400 text-sm">Open</span>
                <AlertCircle className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-3xl font-bold text-blue-400">{stats.open}</p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-400 text-sm">In Progress</span>
                <Clock className="w-5 h-5 text-yellow-400" />
              </div>
              <p className="text-3xl font-bold text-yellow-400">
                {stats.in_progress}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-400 text-sm">Resolved</span>
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-3xl font-bold text-green-400">
                {stats.resolved}
              </p>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex gap-2 mb-6 overflow-x-auto pb-2"
          >
            {["all", "open", "in_progress", "resolved", "closed"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  filter === status
                    ? "bg-blue-500 text-white"
                    : "bg-white/5 text-zinc-400 hover:bg-white/10"
                }`}
              >
                {status.replace("_", " ").charAt(0).toUpperCase() +
                  status.slice(1).replace("_", " ")}
              </button>
            ))}
          </motion.div>

          {/* Tickets List */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="text-center py-20 rounded-2xl bg-white/5 border border-white/5">
              <Ticket className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-400 text-lg mb-2">
                {filter === "all"
                  ? (isAdmin ? "No support tickets yet" : "You haven't submitted any tickets yet")
                  : `No ${filter.replace("_", " ")} tickets`}
              </p>
              {!isAdmin && filter === "all" && (
                <a
                  href="/support"
                  className="inline-block mt-4 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium transition-all"
                >
                  Submit a Support Request
                </a>
              )}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              {filteredTickets.map((ticket, i) => {
                const StatusIcon = statusColors[ticket.status]?.icon || AlertCircle;
                return (
                  <motion.div
                    key={ticket.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-white font-semibold text-lg">
                            {ticket.subject}
                          </h3>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${
                              planColors[ticket.plan]
                            }`}
                          >
                            {ticket.plan}
                          </span>
                        </div>
                        <p className="text-zinc-400 text-sm font-mono">
                          {ticket.ticket_id}
                        </p>
                      </div>

                      <div
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${
                          statusColors[ticket.status]?.bg
                        }`}
                      >
                        <StatusIcon
                          className={`w-4 h-4 ${statusColors[ticket.status]?.text}`}
                        />
                        <span
                          className={`text-sm font-medium capitalize ${
                            statusColors[ticket.status]?.text
                          }`}
                        >
                          {ticket.status.replace("_", " ")}
                        </span>
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="flex flex-wrap gap-4 mb-4 text-sm text-zinc-400">
                      <span className="flex items-center gap-1.5">
                        <User className="w-4 h-4" />
                        {ticket.name}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-4 h-4" />
                        {ticket.email}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        {new Date(ticket.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Message */}
                    <div className="bg-black/30 rounded-lg p-4 mb-4">
                      <p className="text-zinc-300 text-sm line-clamp-3">
                        {ticket.message}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <a
                        href={`mailto:${ticket.email}?subject=Re: ${ticket.subject}`}
                        className="px-4 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-sm transition-all"
                      >
                        Reply
                      </a>
                      {ticket.status === "open" && (
                        <button
                          onClick={() => updateStatus(ticket.id, "in_progress")}
                          className="px-4 py-2 rounded-lg bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 text-sm transition-all"
                        >
                          Start Progress
                        </button>
                      )}
                      {ticket.status === "in_progress" && (
                        <button
                          onClick={() => updateStatus(ticket.id, "resolved")}
                          className="px-4 py-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 text-sm transition-all"
                        >
                          Mark Resolved
                        </button>
                      )}
                      {ticket.status === "resolved" && (
                        <button
                          onClick={() => updateStatus(ticket.id, "closed")}
                          className="px-4 py-2 rounded-lg bg-zinc-500/10 hover:bg-zinc-500/20 text-zinc-400 text-sm transition-all"
                        >
                          Close Ticket
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}

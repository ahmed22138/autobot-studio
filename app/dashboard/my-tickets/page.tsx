"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Ticket,
  Mail,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
  MessageSquare,
  Send,
  ChevronDown,
  ChevronUp,
  User,
  Shield,
} from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { createClient } from "@/lib/supabase/client";

interface TicketReply {
  id: string;
  ticket_id: string;
  sender_type: "user" | "admin";
  sender_email: string;
  sender_name: string;
  message: string;
  created_at: string;
}

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

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [replies, setReplies] = useState<Record<string, TicketReply[]>>({});
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string>("");
  const [filter, setFilter] = useState<string>("all");
  const [expandedTickets, setExpandedTickets] = useState<Set<string>>(new Set());
  const [replyMessages, setReplyMessages] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<string | null>(null);

  useEffect(() => {
    fetchMyTickets();
  }, []);

  const fetchMyTickets = async () => {
    const supabase = createClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const email = user.email || "";
    setUserEmail(email);

    // Fetch user's tickets
    const { data, error } = await supabase
      .from("support_tickets")
      .select("*")
      .eq("email", email)
      .order("created_at", { ascending: false });

    if (data) {
      setTickets(data);

      // Fetch replies for all tickets
      const ticketIds = data.map(t => t.ticket_id);
      const { data: repliesData } = await supabase
        .from("ticket_replies")
        .select("*")
        .in("ticket_id", ticketIds)
        .order("created_at", { ascending: true });

      if (repliesData) {
        const repliesByTicket: Record<string, TicketReply[]> = {};
        repliesData.forEach((reply) => {
          if (!repliesByTicket[reply.ticket_id]) {
            repliesByTicket[reply.ticket_id] = [];
          }
          repliesByTicket[reply.ticket_id].push(reply);
        });
        setReplies(repliesByTicket);
      }
    }
    if (error) {
      console.error("Error fetching tickets:", error);
    }
    setLoading(false);
  };

  const toggleTicket = (ticketId: string) => {
    setExpandedTickets(prev => {
      const newSet = new Set(prev);
      if (newSet.has(ticketId)) {
        newSet.delete(ticketId);
      } else {
        newSet.add(ticketId);
      }
      return newSet;
    });
  };

  const handleReplySubmit = async (ticketId: string) => {
    const message = replyMessages[ticketId]?.trim();
    if (!message) return;

    setSubmitting(ticketId);

    try {
      const response = await fetch("/api/support/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId, message }),
      });

      const data = await response.json();

      if (response.ok) {
        // Clear input
        setReplyMessages(prev => ({ ...prev, [ticketId]: "" }));

        // Refresh tickets to get updated replies
        await fetchMyTickets();

        // Show success (you can add toast notification here)
        alert("✅ Reply sent successfully! Admin will be notified.");
      } else {
        alert("❌ Failed to send reply: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error sending reply:", error);
      alert("❌ Failed to send reply. Please try again.");
    } finally {
      setSubmitting(null);
    }
  };

  const filteredTickets = tickets.filter((t) => {
    if (filter === "all") return true;
    return t.status === filter;
  });

  const statusColors: Record<string, { bg: string; text: string; icon: any; label: string }> = {
    open: {
      bg: "bg-blue-500/10 border-blue-500/20",
      text: "text-blue-400",
      icon: AlertCircle,
      label: "Waiting for response",
    },
    in_progress: {
      bg: "bg-yellow-500/10 border-yellow-500/20",
      text: "text-yellow-400",
      icon: Clock,
      label: "Being worked on",
    },
    resolved: {
      bg: "bg-green-500/10 border-green-500/20",
      text: "text-green-400",
      icon: CheckCircle,
      label: "Problem solved",
    },
    closed: {
      bg: "bg-zinc-500/10 border-zinc-500/20",
      text: "text-zinc-400",
      icon: CheckCircle,
      label: "Case closed",
    },
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
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <Ticket className="w-8 h-8 text-blue-400" />
              My Support Tickets
            </h1>
            <p className="text-zinc-400">Track your support requests and chat with our team</p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
          >
            <div className="p-5 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-400 text-sm">Total</span>
                <Ticket className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-3xl font-bold text-white">{stats.total}</p>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-blue-300 text-sm">Pending</span>
                <AlertCircle className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-3xl font-bold text-blue-400">{stats.open}</p>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 border border-yellow-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-yellow-300 text-sm">Active</span>
                <Clock className="w-5 h-5 text-yellow-400" />
              </div>
              <p className="text-3xl font-bold text-yellow-400">
                {stats.in_progress}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-green-300 text-sm">Solved</span>
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-3xl font-bold text-green-400">
                {stats.resolved}
              </p>
            </div>
          </motion.div>

          {/* Submit New Ticket Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-8"
          >
            <Link
              href="/support"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium transition-all shadow-lg shadow-blue-500/20"
            >
              <MessageSquare className="w-5 h-5" />
              Submit New Support Request
            </Link>
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
                {status === "all" ? "All Tickets" :
                 status === "open" ? "Pending" :
                 status === "in_progress" ? "Active" :
                 status === "resolved" ? "Solved" :
                 "Closed"}
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
                  ? "You haven't submitted any support tickets yet"
                  : `No ${filter.replace("_", " ")} tickets`}
              </p>
              {filter === "all" && (
                <Link
                  href="/support"
                  className="inline-block mt-4 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium transition-all"
                >
                  Submit Your First Ticket
                </Link>
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
                const statusInfo = statusColors[ticket.status] || statusColors.open;
                const StatusIcon = statusInfo.icon;
                const isExpanded = expandedTickets.has(ticket.ticket_id);
                const ticketReplies = replies[ticket.ticket_id] || [];
                const replyCount = ticketReplies.length;

                return (
                  <motion.div
                    key={ticket.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all overflow-hidden"
                  >
                    {/* Ticket Header */}
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex-1">
                          <h3 className="text-white font-semibold text-lg mb-2">
                            {ticket.subject}
                          </h3>
                          <p className="text-zinc-400 text-sm font-mono">
                            Ticket ID: {ticket.ticket_id}
                          </p>
                        </div>

                        <div
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${statusInfo.bg}`}
                        >
                          <StatusIcon className={`w-4 h-4 ${statusInfo.text}`} />
                          <span className={`text-sm font-medium capitalize ${statusInfo.text}`}>
                            {ticket.status.replace("_", " ")}
                          </span>
                        </div>
                      </div>

                      {/* Status Explanation */}
                      <div className="mb-4 p-3 rounded-lg bg-black/30 border-l-2" style={{
                        borderLeftColor: ticket.status === 'open' ? '#3b82f6' :
                                        ticket.status === 'in_progress' ? '#eab308' :
                                        ticket.status === 'resolved' ? '#22c55e' : '#6b7280'
                      }}>
                        <p className="text-sm text-zinc-300">
                          <strong className={statusInfo.text}>Status:</strong> {statusInfo.label}
                        </p>
                      </div>

                      {/* Details */}
                      <div className="flex flex-wrap gap-4 mb-4 text-sm text-zinc-400">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          {new Date(ticket.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MessageSquare className="w-4 h-4" />
                          {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
                        </span>
                      </div>

                      {/* Original Message */}
                      <div className="bg-black/30 rounded-lg p-4 mb-4">
                        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Your Message:</p>
                        <p className="text-zinc-300 text-sm">
                          {ticket.message}
                        </p>
                      </div>

                      {/* Expand Button */}
                      <button
                        onClick={() => toggleTicket(ticket.ticket_id)}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 font-medium transition-all"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="w-5 h-5" />
                            Hide Conversation
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-5 h-5" />
                            View Conversation & Reply ({replyCount})
                          </>
                        )}
                      </button>
                    </div>

                    {/* Conversation Thread (Expanded) */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-white/10 bg-black/20"
                        >
                          <div className="p-6 space-y-4">
                            {/* Replies */}
                            {ticketReplies.length > 0 ? (
                              <div className="space-y-3 mb-6">
                                <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Conversation:</h4>
                                {ticketReplies.map((reply) => (
                                  <div
                                    key={reply.id}
                                    className={`p-4 rounded-lg ${
                                      reply.sender_type === 'admin'
                                        ? 'bg-purple-500/10 border border-purple-500/20 ml-0'
                                        : 'bg-blue-500/10 border border-blue-500/20 mr-0'
                                    }`}
                                  >
                                    <div className="flex items-start gap-3 mb-2">
                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                        reply.sender_type === 'admin'
                                          ? 'bg-purple-500/20'
                                          : 'bg-blue-500/20'
                                      }`}>
                                        {reply.sender_type === 'admin' ? (
                                          <Shield className="w-4 h-4 text-purple-400" />
                                        ) : (
                                          <User className="w-4 h-4 text-blue-400" />
                                        )}
                                      </div>
                                      <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                          <span className={`font-semibold text-sm ${
                                            reply.sender_type === 'admin'
                                              ? 'text-purple-300'
                                              : 'text-blue-300'
                                          }`}>
                                            {reply.sender_type === 'admin' ? '🛡️ Support Team' : reply.sender_name}
                                          </span>
                                          <span className="text-xs text-zinc-500">
                                            {new Date(reply.created_at).toLocaleString()}
                                          </span>
                                        </div>
                                        <p className="text-zinc-300 text-sm whitespace-pre-wrap">
                                          {reply.message}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-zinc-500 text-sm text-center py-4">No replies yet. Start the conversation below!</p>
                            )}

                            {/* Reply Form */}
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                              <label className="block text-sm font-medium text-zinc-400 mb-2">
                                💬 Add Your Reply:
                              </label>
                              <textarea
                                value={replyMessages[ticket.ticket_id] || ""}
                                onChange={(e) =>
                                  setReplyMessages(prev => ({
                                    ...prev,
                                    [ticket.ticket_id]: e.target.value
                                  }))
                                }
                                placeholder="Type your message here... Admin will be notified via email."
                                rows={4}
                                className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/10 text-white placeholder:text-zinc-500 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                              />
                              <div className="flex items-center justify-between mt-3">
                                <p className="text-xs text-zinc-500">
                                  ✉️ Admin will receive email notification
                                </p>
                                <button
                                  onClick={() => handleReplySubmit(ticket.ticket_id)}
                                  disabled={
                                    !replyMessages[ticket.ticket_id]?.trim() ||
                                    submitting === ticket.ticket_id
                                  }
                                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {submitting === ticket.ticket_id ? (
                                    <>
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                      Sending...
                                    </>
                                  ) : (
                                    <>
                                      <Send className="w-4 h-4" />
                                      Send Reply
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
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

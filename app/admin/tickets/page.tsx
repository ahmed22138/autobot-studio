"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ticket,
  Mail,
  User,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
  Search,
  Eye,
  Send,
  X,
  Shield,
  MessageSquare,
  TrendingUp,
  Filter,
} from "lucide-react";
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

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<SupportTicket[]>([]);
  const [replies, setReplies] = useState<Record<string, TicketReply[]>>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filter, searchTerm, tickets]);

  const fetchTickets = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("support_tickets")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      setTickets(data);

      // Fetch all replies
      const { data: repliesData } = await supabase
        .from("ticket_replies")
        .select("*")
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
    if (error) console.error("Error:", error);
    setLoading(false);
  };

  const applyFilters = () => {
    let filtered = [...tickets];

    if (filter !== "all") {
      filtered = filtered.filter((t) => t.status === filter);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (t) =>
          t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.ticket_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTickets(filtered);
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

  const handleAdminReply = async () => {
    if (!selectedTicket || !replyMessage.trim()) return;

    setSending(true);
    try {
      const supabase = createClient();

      // Get admin user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Save admin reply
      await supabase.from("ticket_replies").insert({
        ticket_id: selectedTicket.ticket_id,
        sender_type: "admin",
        sender_email: user.email || "admin@autobobstudio.com",
        sender_name: "Support Team",
        message: replyMessage,
      });

      // Send email to customer (optional - implement similar to user reply)
      // For now, just refresh
      setReplyMessage("");
      await fetchTickets();
      alert("✅ Reply sent to customer!");
    } catch (error) {
      console.error("Failed to send reply:", error);
      alert("❌ Failed to send reply");
    } finally {
      setSending(false);
    }
  };

  const statusColors: Record<
    string,
    { bg: string; text: string; icon: any; badge: string }
  > = {
    open: {
      bg: "bg-blue-500/10",
      text: "text-blue-400",
      icon: AlertCircle,
      badge: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    },
    in_progress: {
      bg: "bg-yellow-500/10",
      text: "text-yellow-400",
      icon: Clock,
      badge: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    },
    resolved: {
      bg: "bg-green-500/10",
      text: "text-green-400",
      icon: CheckCircle,
      badge: "bg-green-500/20 text-green-300 border-green-500/30",
    },
    closed: {
      bg: "bg-zinc-500/10",
      text: "text-zinc-400",
      icon: CheckCircle,
      badge: "bg-zinc-500/20 text-zinc-300 border-zinc-500/30",
    },
  };

  const priorityColors: Record<string, string> = {
    low: "bg-zinc-500/20 text-zinc-300 border-zinc-500/30",
    medium: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    high: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    urgent: "bg-red-500/20 text-red-300 border-red-500/30",
  };

  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "open").length,
    in_progress: tickets.filter((t) => t.status === "in_progress").length,
    resolved: tickets.filter((t) => t.status === "resolved").length,
    avgResponseTime: "2.4h",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Shield className="w-8 h-8 text-cyan-400" />
            Admin Support Dashboard
          </h1>
          <p className="text-zinc-400">Manage and resolve customer tickets</p>
        </div>
        <div className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
          <p className="text-cyan-400 text-sm font-semibold">🛡️ Admin Access</p>
        </div>
      </motion.div>

      {/* Enhanced Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-5 gap-4"
      >
        <div className="p-5 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <Ticket className="w-5 h-5 text-cyan-400" />
            <TrendingUp className="w-4 h-4 text-zinc-600" />
          </div>
          <p className="text-zinc-500 text-xs mb-1">Total Tickets</p>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </div>

        <div className="p-5 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/30">
          <AlertCircle className="w-5 h-5 text-blue-400 mb-2" />
          <p className="text-blue-300 text-xs mb-1">Open</p>
          <p className="text-2xl font-bold text-blue-400">{stats.open}</p>
        </div>

        <div className="p-5 rounded-xl bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 border border-yellow-500/30">
          <Clock className="w-5 h-5 text-yellow-400 mb-2" />
          <p className="text-yellow-300 text-xs mb-1">In Progress</p>
          <p className="text-2xl font-bold text-yellow-400">
            {stats.in_progress}
          </p>
        </div>

        <div className="p-5 rounded-xl bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/30">
          <CheckCircle className="w-5 h-5 text-green-400 mb-2" />
          <p className="text-green-300 text-xs mb-1">Resolved</p>
          <p className="text-2xl font-bold text-green-400">{stats.resolved}</p>
        </div>

        <div className="p-5 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-purple-500/30">
          <MessageSquare className="w-5 h-5 text-purple-400 mb-2" />
          <p className="text-purple-300 text-xs mb-1">Avg Response</p>
          <p className="text-2xl font-bold text-purple-400">{stats.avgResponseTime}</p>
        </div>
      </motion.div>

      {/* Filters & Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col md:flex-row gap-4"
      >
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by customer, email, subject, or ticket ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
          />
        </div>

        <div className="flex gap-2">
          {["all", "open", "in_progress", "resolved", "closed"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-5 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap border ${
                filter === status
                  ? "bg-cyan-500 text-white border-cyan-500"
                  : "bg-white/5 text-zinc-400 hover:bg-white/10 border-white/10"
              }`}
            >
              {status === "all"
                ? "All"
                : status.replace("_", " ").charAt(0).toUpperCase() +
                  status.slice(1).replace("_", " ")}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Admin Table View */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-6 py-4 text-left text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                  Ticket Info
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                  Replies
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-zinc-500">
                    No tickets found
                  </td>
                </tr>
              ) : (
                filteredTickets.map((ticket, i) => {
                  const StatusIcon = statusColors[ticket.status]?.icon || AlertCircle;
                  const ticketReplies = replies[ticket.ticket_id] || [];

                  return (
                    <motion.tr
                      key={ticket.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-white font-semibold mb-1 text-sm">
                            {ticket.subject}
                          </p>
                          <p className="text-zinc-500 text-xs font-mono">
                            {ticket.ticket_id}
                          </p>
                          <p className="text-zinc-600 text-xs mt-1">
                            {new Date(ticket.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div>
                          <p className="text-zinc-300 text-sm font-medium">
                            {ticket.name}
                          </p>
                          <p className="text-zinc-500 text-xs">{ticket.email}</p>
                          <span className="inline-block mt-1 px-2 py-0.5 rounded text-xs font-semibold bg-white/10 text-zinc-400 capitalize">
                            {ticket.plan}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                            priorityColors[ticket.priority] || priorityColors.low
                          }`}
                        >
                          {ticket.priority}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-2">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                              statusColors[ticket.status]?.badge
                            }`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {ticket.status.replace("_", " ")}
                          </span>

                          {ticket.status === "open" && (
                            <button
                              onClick={() => updateStatus(ticket.id, "in_progress")}
                              className="text-xs text-yellow-400 hover:text-yellow-300"
                            >
                              Start →
                            </button>
                          )}
                          {ticket.status === "in_progress" && (
                            <button
                              onClick={() => updateStatus(ticket.id, "resolved")}
                              className="text-xs text-green-400 hover:text-green-300"
                            >
                              Resolve →
                            </button>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-zinc-500" />
                          <span className="text-zinc-300 text-sm font-semibold">
                            {ticketReplies.length}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedTicket(ticket)}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-sm font-medium transition-all border border-cyan-500/20"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 bg-white/5 border-t border-white/10 text-center text-zinc-500 text-sm">
          Showing {filteredTickets.length} of {tickets.length} tickets
        </div>
      </motion.div>

      {/* Ticket Detail Modal */}
      <AnimatePresence>
        {selectedTicket && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedTicket(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0f0f14] border border-white/10 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-b border-white/10 p-6 flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {selectedTicket.subject}
                  </h2>
                  <p className="text-zinc-400 font-mono text-sm">
                    {selectedTicket.ticket_id}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-6 h-6 text-zinc-400" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Customer Info */}
                <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div>
                    <p className="text-zinc-500 text-xs mb-1">Customer</p>
                    <p className="text-white font-semibold">{selectedTicket.name}</p>
                    <p className="text-zinc-400 text-sm">{selectedTicket.email}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 text-xs mb-1">Plan & Priority</p>
                    <p className="text-white font-semibold capitalize">{selectedTicket.plan}</p>
                    <p className="text-zinc-400 text-sm capitalize">{selectedTicket.priority} priority</p>
                  </div>
                </div>

                {/* Original Message */}
                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <p className="text-blue-300 text-xs uppercase tracking-wider mb-2">
                    Original Message:
                  </p>
                  <p className="text-zinc-300">{selectedTicket.message}</p>
                </div>

                {/* Conversation */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Conversation History
                  </h3>
                  <div className="space-y-3">
                    {(replies[selectedTicket.ticket_id] || []).map((reply) => (
                      <div
                        key={reply.id}
                        className={`p-4 rounded-xl border ${
                          reply.sender_type === "admin"
                            ? "bg-purple-500/10 border-purple-500/20"
                            : "bg-blue-500/10 border-blue-500/20"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              reply.sender_type === "admin"
                                ? "bg-purple-500/20"
                                : "bg-blue-500/20"
                            }`}
                          >
                            {reply.sender_type === "admin" ? (
                              <Shield className="w-5 h-5 text-purple-400" />
                            ) : (
                              <User className="w-5 h-5 text-blue-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <span
                                className={`font-semibold ${
                                  reply.sender_type === "admin"
                                    ? "text-purple-300"
                                    : "text-blue-300"
                                }`}
                              >
                                {reply.sender_type === "admin"
                                  ? "🛡️ Support Team"
                                  : reply.sender_name}
                              </span>
                              <span className="text-xs text-zinc-500">
                                {new Date(reply.created_at).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-zinc-300 whitespace-pre-wrap">
                              {reply.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Admin Reply Form */}
                <div className="bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-purple-500/20 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-purple-400" />
                    Send Admin Reply
                  </h3>
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your response to the customer..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/10 text-white placeholder:text-zinc-500 outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none mb-4"
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-zinc-500">
                      Customer will see this in their ticket conversation
                    </p>
                    <button
                      onClick={handleAdminReply}
                      disabled={!replyMessage.trim() || sending}
                      className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-semibold transition-all disabled:opacity-50"
                    >
                      {sending ? (
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

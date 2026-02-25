"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  MessageCircle,
  Search,
  Filter,
  User,
  Bot,
  Calendar,
  TrendingUp,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Conversation {
  id: string;
  session_id: string;
  user_id: string | null;
  user_email: string | null;
  user_name: string | null;
  user_message: string;
  bot_response: string;
  detected_intent: string;
  action_type: string | null;
  created_at: string;
}

export default function ChatbotConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterIntent, setFilterIntent] = useState("all");

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filterIntent, conversations]);

  const fetchConversations = async () => {
    try {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("chatbot_conversations")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) {
        console.error("Error fetching conversations:", error);
        return;
      }

      setConversations(data || []);
      setFilteredConversations(data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...conversations];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (conv) =>
          conv.user_message.toLowerCase().includes(searchTerm.toLowerCase()) ||
          conv.bot_response.toLowerCase().includes(searchTerm.toLowerCase()) ||
          conv.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          conv.user_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Intent filter
    if (filterIntent !== "all") {
      filtered = filtered.filter((conv) => conv.detected_intent === filterIntent);
    }

    setFilteredConversations(filtered);
  };

  const stats = {
    total: conversations.length,
    support_tickets: conversations.filter((c) => c.detected_intent === "create_support_ticket")
      .length,
    agent_help: conversations.filter(
      (c) =>
        c.detected_intent === "guide_agent_creation" ||
        c.detected_intent === "troubleshoot_agent"
    ).length,
    with_actions: conversations.filter((c) => c.action_type).length,
    unique_users: new Set(conversations.filter((c) => c.user_id).map((c) => c.user_id)).size,
  };

  const intents = Array.from(new Set(conversations.map((c) => c.detected_intent).filter(Boolean)));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <MessageCircle className="w-8 h-8 text-blue-400" />
          Chatbot Conversations
        </h1>
        <p className="text-zinc-400">View all chatbot interactions and analytics</p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-5 gap-4"
      >
        <div className="p-4 rounded-xl bg-white/5 border border-white/5">
          <p className="text-zinc-500 text-sm mb-1">Total</p>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <p className="text-blue-400 text-sm mb-1">Support Tickets</p>
          <p className="text-2xl font-bold text-blue-300">{stats.support_tickets}</p>
        </div>
        <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
          <p className="text-purple-400 text-sm mb-1">Agent Help</p>
          <p className="text-2xl font-bold text-purple-300">{stats.agent_help}</p>
        </div>
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
          <p className="text-green-400 text-sm mb-1">With Actions</p>
          <p className="text-2xl font-bold text-green-300">{stats.with_actions}</p>
        </div>
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <p className="text-amber-400 text-sm mb-1">Unique Users</p>
          <p className="text-2xl font-bold text-amber-300">{stats.unique_users}</p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 outline-none focus:border-blue-500/50"
          />
        </div>

        {/* Intent Filter */}
        <select
          value={filterIntent}
          onChange={(e) => setFilterIntent(e.target.value)}
          className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-blue-500/50"
        >
          <option value="all" className="bg-zinc-900">
            All Intents
          </option>
          {intents.map((intent) => (
            <option key={intent} value={intent} className="bg-zinc-900">
              {intent.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </option>
          ))}
        </select>
      </motion.div>

      {/* Conversations List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        {filteredConversations.length === 0 ? (
          <div className="bg-white/5 border border-white/5 rounded-2xl p-12 text-center">
            <MessageCircle className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-500">No conversations found</p>
          </div>
        ) : (
          filteredConversations.map((conv, i) => (
            <motion.div
              key={conv.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:bg-white/10 transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">
                      {conv.user_name || conv.user_email || "Anonymous User"}
                    </p>
                    <p className="text-zinc-400 text-sm">{conv.user_email || "No email"}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-zinc-500 text-xs flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" />
                    {new Date(conv.created_at).toLocaleString()}
                  </p>
                  <p className="text-zinc-600 text-xs mt-1">
                    Session: {conv.session_id.slice(0, 12)}...
                  </p>
                </div>
              </div>

              {/* Intent & Action Badges */}
              <div className="flex gap-2 mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {conv.detected_intent?.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </span>
                {conv.action_type && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30">
                    Action: {conv.action_type}
                  </span>
                )}
              </div>

              {/* Messages */}
              <div className="space-y-3">
                {/* User Message */}
                <div className="flex gap-3">
                  <User className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <p className="text-zinc-400 text-xs mb-1">User:</p>
                    <p className="text-white bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                      {conv.user_message}
                    </p>
                  </div>
                </div>

                {/* Bot Response */}
                <div className="flex gap-3">
                  <Bot className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <p className="text-zinc-400 text-xs mb-1">Bot:</p>
                    <p className="text-white bg-green-500/10 border border-green-500/20 rounded-lg p-3 whitespace-pre-wrap">
                      {conv.bot_response.substring(0, 300)}
                      {conv.bot_response.length > 300 && "..."}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Results Count */}
      <div className="text-center text-zinc-500 text-sm">
        Showing {filteredConversations.length} of {conversations.length} conversations
      </div>
    </div>
  );
}

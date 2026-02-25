"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Bot,
  Search,
  Power,
  PowerOff,
  Calendar,
  User,
  Loader2,
  ExternalLink,
  Trash2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Agent {
  id: string;
  agent_id: string;
  user_id: string;
  user_email: string;
  name: string;
  description: string;
  tone: string;
  status: string;
  created_at: string;
}

export default function AgentsManagement() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchAgents();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filterStatus, agents]);

  const fetchAgents = async () => {
    const supabase = createClient();

    try {
      const { data: agentsData } = await supabase
        .from("agents")
        .select("*")
        .order("created_at", { ascending: false });

      // Get user emails
      const agentsWithEmails = await Promise.all(
        (agentsData || []).map(async (agent) => {
          const { data: user } = await supabase.auth.admin.getUserById(
            agent.user_id
          );
          return {
            ...agent,
            user_email: user?.user?.email || "Unknown",
          };
        })
      );

      setAgents(agentsWithEmails);
      setFilteredAgents(agentsWithEmails);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching agents:", error);
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...agents];

    // Search
    if (searchTerm) {
      filtered = filtered.filter(
        (agent) =>
          agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          agent.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          agent.agent_id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((agent) => agent.status === filterStatus);
    }

    setFilteredAgents(filtered);
  };

  const toggleAgentStatus = async (id: string, currentStatus: string) => {
    const supabase = createClient();
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    await supabase.from("agents").update({ status: newStatus }).eq("id", id);

    setAgents((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
  };

  const deleteAgent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this agent?")) return;

    const supabase = createClient();
    await supabase.from("agents").delete().eq("id", id);

    setAgents((prev) => prev.filter((a) => a.id !== id));
  };

  const stats = {
    total: agents.length,
    active: agents.filter((a) => a.status === "active").length,
    inactive: agents.filter((a) => a.status === "inactive").length,
  };

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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Bot className="w-8 h-8 text-purple-400" />
          Agent Management
        </h1>
        <p className="text-zinc-400">
          Manage all AI agents created by users
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <div className="p-6 rounded-xl bg-white/5 border border-white/5">
          <div className="flex items-center gap-3 mb-2">
            <Bot className="w-6 h-6 text-purple-400" />
            <p className="text-zinc-400 text-sm">Total Agents</p>
          </div>
          <p className="text-3xl font-bold text-white">{stats.total}</p>
        </div>

        <div className="p-6 rounded-xl bg-green-500/10 border border-green-500/20">
          <div className="flex items-center gap-3 mb-2">
            <Power className="w-6 h-6 text-green-400" />
            <p className="text-green-400 text-sm">Active</p>
          </div>
          <p className="text-3xl font-bold text-green-400">{stats.active}</p>
        </div>

        <div className="p-6 rounded-xl bg-zinc-500/10 border border-zinc-500/20">
          <div className="flex items-center gap-3 mb-2">
            <PowerOff className="w-6 h-6 text-zinc-400" />
            <p className="text-zinc-400 text-sm">Inactive</p>
          </div>
          <p className="text-3xl font-bold text-zinc-400">{stats.inactive}</p>
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
            placeholder="Search by name, email, or agent ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 outline-none focus:border-purple-500/50"
          />
        </div>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-purple-500/50"
        >
          <option value="all" className="bg-zinc-900">All Status</option>
          <option value="active" className="bg-zinc-900">Active</option>
          <option value="inactive" className="bg-zinc-900">Inactive</option>
        </select>
      </motion.div>

      {/* Agents Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {filteredAgents.length === 0 ? (
          <div className="col-span-2 text-center py-20 text-zinc-500">
            No agents found
          </div>
        ) : (
          filteredAgents.map((agent, i) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-lg mb-1 truncate">
                      {agent.name}
                    </h3>
                    <p className="text-zinc-500 text-sm truncate">
                      {agent.description || "No description"}
                    </p>
                  </div>
                </div>

                <span
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                    agent.status === "active"
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-zinc-500/20 text-zinc-400 border border-zinc-500/30"
                  }`}
                >
                  {agent.status === "active" ? (
                    <Power className="w-3 h-3" />
                  ) : (
                    <PowerOff className="w-3 h-3" />
                  )}
                  {agent.status}
                </span>
              </div>

              {/* Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <User className="w-4 h-4" />
                  <span>{agent.user_email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Created{" "}
                    {new Date(agent.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="text-zinc-500">ID:</span>
                  <span className="text-zinc-400 font-mono ml-2">
                    {agent.agent_id}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="text-zinc-500">Tone:</span>
                  <span className="text-zinc-400 ml-2 capitalize">
                    {agent.tone}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-white/5">
                <button
                  onClick={() => toggleAgentStatus(agent.id, agent.status)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    agent.status === "active"
                      ? "bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400"
                      : "bg-green-500/10 hover:bg-green-500/20 text-green-400"
                  }`}
                >
                  {agent.status === "active" ? (
                    <>
                      <PowerOff className="w-4 h-4" />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <Power className="w-4 h-4" />
                      Activate
                    </>
                  )}
                </button>

                <button
                  onClick={() => deleteAgent(agent.id)}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Results Count */}
      <div className="text-center text-zinc-500 text-sm">
        Showing {filteredAgents.length} of {agents.length} agents
      </div>
    </div>
  );
}

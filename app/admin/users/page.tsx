"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Search,
  Filter,
  Mail,
  Calendar,
  Crown,
  Loader2,
  UserCheck,
  UserX,
  ExternalLink,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface UserData {
  id: string;
  name: string;
  email: string;
  created_at: string;
  last_sign_in_at: string;
  plan: string;
  agentCount: number;
  status: string;
}

export default function UsersManagement() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPlan, setFilterPlan] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filterPlan, filterStatus, users]);

  const fetchUsers = async () => {
    try {
      // Call API route (server-side) to fetch users
      const response = await fetch("/api/admin/users");

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error fetching users:", errorData.error);
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (data.success && data.users) {
        console.log(`✅ Fetched ${data.count} users from API`);
        setUsers(data.users);
        setFilteredUsers(data.users);
      } else {
        console.error("Invalid response format:", data);
        setUsers([]);
        setFilteredUsers([]);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
      setFilteredUsers([]);
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...users];

    // Search filter (name or email)
    if (searchTerm) {
      filtered = filtered.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Plan filter
    if (filterPlan !== "all") {
      filtered = filtered.filter((user) => user.plan === filterPlan);
    }

    // Status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((user) => user.status === filterStatus);
    }

    setFilteredUsers(filtered);
  };

  const stats = {
    total: users.length,
    basic: users.filter((u) => u.plan === "basic").length,
    medium: users.filter((u) => u.plan === "medium").length,
    premium: users.filter((u) => u.plan === "premium").length,
    active: users.filter((u) => u.status === "active").length,
  };

  const planColors: Record<string, string> = {
    basic: "bg-zinc-500/20 text-zinc-300 border-zinc-500/30",
    medium: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    premium: "bg-amber-500/20 text-amber-300 border-amber-500/30",
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
          <Users className="w-8 h-8 text-blue-400" />
          User Management
        </h1>
        <p className="text-zinc-400">Manage all registered users and their subscriptions</p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-5 gap-4"
      >
        <div className="p-4 rounded-xl bg-white/5 border border-white/5">
          <p className="text-zinc-500 text-sm mb-1">Total Users</p>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="p-4 rounded-xl bg-zinc-500/10 border border-zinc-500/20">
          <p className="text-zinc-400 text-sm mb-1">Basic</p>
          <p className="text-2xl font-bold text-zinc-300">{stats.basic}</p>
        </div>
        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <p className="text-blue-400 text-sm mb-1">Medium</p>
          <p className="text-2xl font-bold text-blue-300">{stats.medium}</p>
        </div>
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <p className="text-amber-400 text-sm mb-1">Premium</p>
          <p className="text-2xl font-bold text-amber-300">{stats.premium}</p>
        </div>
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
          <p className="text-green-400 text-sm mb-1">Active</p>
          <p className="text-2xl font-bold text-green-300">{stats.active}</p>
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
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 outline-none focus:border-blue-500/50"
          />
        </div>

        {/* Plan Filter */}
        <select
          value={filterPlan}
          onChange={(e) => setFilterPlan(e.target.value)}
          className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-blue-500/50"
        >
          <option value="all" className="bg-zinc-900">All Plans</option>
          <option value="basic" className="bg-zinc-900">Basic</option>
          <option value="medium" className="bg-zinc-900">Medium</option>
          <option value="premium" className="bg-zinc-900">Premium</option>
        </select>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-blue-500/50"
        >
          <option value="all" className="bg-zinc-900">All Status</option>
          <option value="active" className="bg-zinc-900">Active</option>
          <option value="canceled" className="bg-zinc-900">Canceled</option>
        </select>
      </motion.div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/5">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-400">
                  User
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-400">
                  Plan
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-400">
                  Agents
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-400">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-400">
                  Joined
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, i) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-semibold">{user.name}</p>
                          <p className="text-zinc-400 text-sm">{user.email}</p>
                          <p className="text-zinc-600 text-xs">ID: {user.id.slice(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border capitalize ${
                          planColors[user.plan]
                        }`}
                      >
                        {user.plan === "premium" && <Crown className="w-3 h-3" />}
                        {user.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white font-semibold">{user.agentCount}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                          user.status === "active"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {user.status === "active" ? (
                          <UserCheck className="w-3 h-3" />
                        ) : (
                          <UserX className="w-3 h-3" />
                        )}
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-zinc-400 text-sm">
                        <Calendar className="w-4 h-4" />
                        {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-sm transition-all"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Results Count */}
      <div className="text-center text-zinc-500 text-sm">
        Showing {filteredUsers.length} of {users.length} users
      </div>
    </div>
  );
}

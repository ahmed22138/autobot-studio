"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Clock, CheckCircle, XCircle, Loader2, Package } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  product_name: string;
  product_price: number;
  payment_method: string;
  payment_status: string;
  order_status: string;
  created_at: string;
  agent_id: string;
}

const STATUS_COLORS: Record<string, string> = {
  new:        "bg-blue-500/20 text-blue-400 border-blue-500/30",
  processing: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  shipped:    "bg-purple-500/20 text-purple-400 border-purple-500/30",
  delivered:  "bg-green-500/20 text-green-400 border-green-500/30",
  cancelled:  "bg-red-500/20 text-red-400 border-red-500/30",
};

const PAYMENT_COLORS: Record<string, string> = {
  pending:             "bg-yellow-500/20 text-yellow-400",
  screenshot_received: "bg-blue-500/20 text-blue-400",
  confirmed:           "bg-green-500/20 text-green-400",
  cancelled:           "bg-red-500/20 text-red-400",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Get user's agent IDs first
    const { data: agents } = await supabase
      .from("agents")
      .select("agent_id")
      .eq("user_id", user.id);

    if (!agents || agents.length === 0) {
      setLoading(false);
      return;
    }

    const agentIds = agents.map((a) => a.agent_id);

    const { data } = await supabase
      .from("orders")
      .select("*")
      .in("agent_id", agentIds)
      .order("created_at", { ascending: false });

    setOrders(data || []);
    setLoading(false);
  };

  const updateOrderStatus = async (orderId: string, field: string, value: string) => {
    const supabase = createClient();
    await supabase.from("orders").update({ [field]: value }).eq("id", orderId);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, [field]: value } : o))
    );
  };

  const filteredOrders = filter === "all"
    ? orders
    : orders.filter((o) => o.order_status === filter || o.payment_status === filter);

  const stats = {
    total:     orders.length,
    new:       orders.filter((o) => o.order_status === "new").length,
    confirmed: orders.filter((o) => o.payment_status === "confirmed").length,
    pending:   orders.filter((o) => o.payment_status === "pending").length,
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f] px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Orders</h1>
            <p className="text-zinc-500 text-sm">Sales bot se aaye orders</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Orders",    value: stats.total,     color: "text-white" },
            { label: "New",             value: stats.new,       color: "text-blue-400" },
            { label: "Payment Pending", value: stats.pending,   color: "text-yellow-400" },
            { label: "Confirmed",       value: stats.confirmed, color: "text-green-400" },
          ].map((s, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-zinc-500 text-xs mb-1">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex gap-2 flex-wrap">
          {["all", "new", "processing", "delivered", "pending", "confirmed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs capitalize transition-all border ${
                filter === f
                  ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                  : "bg-white/5 text-zinc-400 border-white/10 hover:bg-white/10"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Koi orders nahi mili</p>
            <p className="text-xs mt-1">Sales bot se orders ayenge yahan</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white/5 border border-white/10 rounded-xl p-5"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  {/* Left: Customer info */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{order.customer_name}</span>
                      <span className="text-zinc-500 text-xs">#{order.order_number || order.id.slice(0, 8)}</span>
                    </div>
                    <p className="text-zinc-400 text-sm">{order.customer_email}</p>
                    {order.customer_phone && (
                      <p className="text-zinc-500 text-xs">{order.customer_phone}</p>
                    )}
                  </div>

                  {/* Right: Product + price */}
                  <div className="text-right">
                    <p className="text-white font-medium">{order.product_name}</p>
                    <p className="text-emerald-400 font-bold">PKR {order.product_price?.toLocaleString()}</p>
                    <p className="text-zinc-500 text-xs mt-1">{order.payment_method}</p>
                  </div>
                </div>

                {/* Status row */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5 flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    {/* Order status */}
                    <select
                      value={order.order_status}
                      onChange={(e) => updateOrderStatus(order.id, "order_status", e.target.value)}
                      className={`text-xs px-2 py-1 rounded-lg border outline-none cursor-pointer bg-transparent ${STATUS_COLORS[order.order_status] || STATUS_COLORS.new}`}
                    >
                      <option value="new"        className="bg-zinc-900">New</option>
                      <option value="processing"  className="bg-zinc-900">Processing</option>
                      <option value="shipped"     className="bg-zinc-900">Shipped</option>
                      <option value="delivered"   className="bg-zinc-900">Delivered</option>
                      <option value="cancelled"   className="bg-zinc-900">Cancelled</option>
                    </select>

                    {/* Payment status */}
                    <select
                      value={order.payment_status}
                      onChange={(e) => updateOrderStatus(order.id, "payment_status", e.target.value)}
                      className={`text-xs px-2 py-1 rounded-lg outline-none cursor-pointer bg-transparent ${PAYMENT_COLORS[order.payment_status] || PAYMENT_COLORS.pending}`}
                    >
                      <option value="pending"             className="bg-zinc-900">Payment Pending</option>
                      <option value="screenshot_received" className="bg-zinc-900">Screenshot Received</option>
                      <option value="confirmed"           className="bg-zinc-900">Payment Confirmed</option>
                      <option value="cancelled"           className="bg-zinc-900">Cancelled</option>
                    </select>
                  </div>

                  <span className="text-zinc-600 text-xs">
                    {new Date(order.created_at).toLocaleDateString("en-PK", {
                      day: "numeric", month: "short", year: "numeric",
                      hour: "2-digit", minute: "2-digit"
                    })}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

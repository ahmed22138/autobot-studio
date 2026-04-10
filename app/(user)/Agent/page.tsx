"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Bot, Loader2, AlertTriangle, Lock, ArrowUpRight, Plus, Trash2, Package, CreditCard } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { createClient } from "@/lib/supabase/client";

interface UsageData {
  plan: string;
  agentCount: number;
  messageCount: number;
  limits: { agents: number | null; messages: number | null };
  features: {
    customization: string;
    support: string;
    analytics: boolean;
    apiAccess: boolean;
    whiteLabel: boolean;
    customIntegrations: boolean;
  };
}

interface Product {
  name: string;
  price: string;
  description: string;
}

interface PaymentConfig {
  cash_on_delivery: boolean;
  easypaisa_number: string;
  jazzcash_number: string;
  bank_name: string;
  bank_account: string;
  bank_account_name: string;
}

export default function CreateAgent() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
    tone: "friendly",
    type: "general",
    welcomeMessage: "",
    responseLength: "medium",
    knowledgeBase: "",
    systemPrompt: "",
    customCss: "",
    webhookUrl: "",
  });

  const [products, setProducts] = useState<Product[]>([
    { name: "", price: "", description: "" },
  ]);

  const [payment, setPayment] = useState<PaymentConfig>({
    cash_on_delivery: false,
    easypaisa_number: "",
    jazzcash_number: "",
    bank_name: "",
    bank_account: "",
    bank_account_name: "",
  });

  const [loading, setLoading] = useState(false);
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [usageLoading, setUsageLoading] = useState(true);

  useEffect(() => {
    fetch("/api/usage")
      .then((res) => res.json())
      .then((data) => setUsage(data))
      .catch(() => {})
      .finally(() => setUsageLoading(false));
  }, []);

  const limitReached =
    usage && usage.limits.agents !== null && usage.agentCount >= usage.limits.agents;

  const customization = usage?.features?.customization || "basic";
  const hasAdvanced = customization === "advanced" || customization === "full";
  const hasFull = customization === "full";

  const addProduct = () => {
    setProducts([...products, { name: "", price: "", description: "" }]);
  };

  const removeProduct = (index: number) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const updateProduct = (index: number, field: keyof Product, value: string) => {
    const updated = [...products];
    updated[index][field] = value;
    setProducts(updated);
  };

  const createAgent = async () => {
    if (limitReached) return;
    setLoading(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      // Step 1: Create agent in backend
      const res = await fetch(`${API}/create-agent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          tone: form.tone,
          type: form.type,
        }),
      });

      if (!res.ok) {
        alert("Failed to create agent. Please try again.");
        setLoading(false);
        return;
      }

      const { agent_id } = await res.json();

      // Step 2: Save agent to Supabase
      await supabase.from("agents").upsert({
        user_id: user.id,
        agent_id,
        name: form.name,
        description: form.description,
        tone: form.tone,
        type: form.type,
        status: "active",
      });

      // Step 3: If Sales bot — save products + payment config
      if (form.type === "sales") {
        // Save products (filter empty ones)
        const validProducts = products.filter((p) => p.name && p.price);
        if (validProducts.length > 0) {
          await supabase.from("agent_products").insert(
            validProducts.map((p) => ({
              agent_id,
              user_id: user.id,
              name: p.name,
              price: parseFloat(p.price),
              description: p.description || null,
              currency: "PKR",
            }))
          );
        }

        // Save payment config
        const hasAnyPayment =
          payment.cash_on_delivery ||
          payment.easypaisa_number ||
          payment.jazzcash_number ||
          payment.bank_account;

        if (hasAnyPayment) {
          await supabase.from("agent_payment_config").upsert({
            agent_id,
            user_id: user.id,
            cash_on_delivery: payment.cash_on_delivery,
            easypaisa_number: payment.easypaisa_number || null,
            jazzcash_number: payment.jazzcash_number || null,
            bank_name: payment.bank_name || null,
            bank_account: payment.bank_account || null,
            bank_account_name: payment.bank_account_name || null,
          });
        }
      }

      setLoading(false);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4 py-12">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-full max-w-xl"
        >
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-blue-400" />
              </div>
              <h1 className="text-2xl font-bold text-white">Create AI Agent</h1>
            </div>
            <p className="text-zinc-400 text-sm">
              Define your agent&apos;s personality and deploy it in seconds.
            </p>

            {/* Usage indicator */}
            {!usageLoading && usage && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">
                  Agents: {usage.agentCount}/{usage.limits.agents ?? "Unlimited"}
                </span>
                <span className="text-zinc-500 capitalize">{usage.plan} plan</span>
              </div>
            )}

            {/* Limit reached banner */}
            {limitReached && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-400 font-medium text-sm">Agent limit reached</p>
                  <p className="text-zinc-400 text-sm mt-1">
                    Your {usage?.plan} plan allows {usage?.limits.agents} agent{usage?.limits.agents === 1 ? "" : "s"}.{" "}
                    <Link href="/pricing" className="text-blue-400 hover:underline">Upgrade your plan</Link> to create more.
                  </p>
                </div>
              </div>
            )}

            {/* === BASIC SETTINGS === */}
            <div className="space-y-4">
              <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium">Basic Settings</p>

              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">Agent Name</label>
                <input
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                  placeholder="e.g. My Sales Bot"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">Description</label>
                <textarea
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all resize-none"
                  placeholder="What does this agent do?"
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">Tone</label>
                <select
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                  value={form.tone}
                  onChange={(e) => setForm({ ...form, tone: e.target.value })}
                >
                  <option value="friendly" className="bg-zinc-900">Friendly</option>
                  <option value="professional" className="bg-zinc-900">Professional</option>
                  <option value="casual" className="bg-zinc-900">Casual</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">Chatbot Type</label>
                <select
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  <option value="general" className="bg-zinc-900">🤖 General Bot</option>
                  <option value="support" className="bg-zinc-900">🎧 Support Bot</option>
                  <option value="sales" className="bg-zinc-900">💰 Sales Bot</option>
                </select>
                <p className="text-zinc-500 text-xs mt-1.5">
                  {form.type === "sales" && "Sells products, captures orders, handles payments"}
                  {form.type === "support" && "Handles support tickets and troubleshooting"}
                  {form.type === "general" && "Custom AI assistant for any use case"}
                </p>
              </div>
            </div>

            {/* === SALES SETTINGS (only when type = sales) === */}
            {form.type === "sales" && (
              <>
                {/* Products */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-emerald-400" />
                      <p className="text-xs text-zinc-300 uppercase tracking-wider font-medium">Your Products</p>
                    </div>
                    <button
                      type="button"
                      onClick={addProduct}
                      className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Product
                    </button>
                  </div>

                  {products.map((product, index) => (
                    <div key={index} className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-400 text-xs">Product {index + 1}</span>
                        {products.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeProduct(index)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-zinc-500 mb-1">Product Name *</label>
                          <input
                            className="w-full p-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-zinc-600 outline-none focus:border-emerald-500/50 transition-all"
                            placeholder="e.g. T-Shirt"
                            value={product.name}
                            onChange={(e) => updateProduct(index, "name", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-zinc-500 mb-1">Price (PKR) *</label>
                          <input
                            type="number"
                            className="w-full p-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-zinc-600 outline-none focus:border-emerald-500/50 transition-all"
                            placeholder="e.g. 1500"
                            value={product.price}
                            onChange={(e) => updateProduct(index, "price", e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-zinc-500 mb-1">Description (optional)</label>
                        <input
                          className="w-full p-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-zinc-600 outline-none focus:border-emerald-500/50 transition-all"
                          placeholder="e.g. Cotton, available in all sizes"
                          value={product.description}
                          onChange={(e) => updateProduct(index, "description", e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Payment Settings */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-yellow-400" />
                    <p className="text-xs text-zinc-300 uppercase tracking-wider font-medium">Payment Methods</p>
                  </div>

                  <div className="p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20 space-y-4">

                    {/* Cash on Delivery */}
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={payment.cash_on_delivery}
                        onChange={(e) => setPayment({ ...payment, cash_on_delivery: e.target.checked })}
                        className="w-4 h-4 rounded accent-yellow-400"
                      />
                      <span className="text-white text-sm">Cash on Delivery (COD)</span>
                    </label>

                    {/* EasyPaisa */}
                    <div>
                      <label className="block text-xs text-zinc-500 mb-1">EasyPaisa Number (optional)</label>
                      <input
                        className="w-full p-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-zinc-600 outline-none focus:border-yellow-500/50 transition-all"
                        placeholder="03XX-XXXXXXX"
                        value={payment.easypaisa_number}
                        onChange={(e) => setPayment({ ...payment, easypaisa_number: e.target.value })}
                      />
                    </div>

                    {/* JazzCash */}
                    <div>
                      <label className="block text-xs text-zinc-500 mb-1">JazzCash Number (optional)</label>
                      <input
                        className="w-full p-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-zinc-600 outline-none focus:border-yellow-500/50 transition-all"
                        placeholder="03XX-XXXXXXX"
                        value={payment.jazzcash_number}
                        onChange={(e) => setPayment({ ...payment, jazzcash_number: e.target.value })}
                      />
                    </div>

                    {/* Bank */}
                    <div className="space-y-2">
                      <label className="block text-xs text-zinc-500">Bank Transfer (optional)</label>
                      <input
                        className="w-full p-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-zinc-600 outline-none focus:border-yellow-500/50 transition-all"
                        placeholder="Bank Name (e.g. HBL, Meezan)"
                        value={payment.bank_name}
                        onChange={(e) => setPayment({ ...payment, bank_name: e.target.value })}
                      />
                      <input
                        className="w-full p-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-zinc-600 outline-none focus:border-yellow-500/50 transition-all"
                        placeholder="Account Number"
                        value={payment.bank_account}
                        onChange={(e) => setPayment({ ...payment, bank_account: e.target.value })}
                      />
                      <input
                        className="w-full p-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-zinc-600 outline-none focus:border-yellow-500/50 transition-all"
                        placeholder="Account Holder Name"
                        value={payment.bank_account_name}
                        onChange={(e) => setPayment({ ...payment, bank_account_name: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* === ADVANCED SETTINGS (Medium + Premium only) === */}
            {hasAdvanced && (
              <div className="space-y-4">
                <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium">Advanced Settings</p>

                <div>
                  <label className="block text-sm text-zinc-400 mb-1.5">Welcome Message</label>
                  <input
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                    placeholder="Hi! How can I help you today?"
                    value={form.welcomeMessage}
                    onChange={(e) => setForm({ ...form, welcomeMessage: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-1.5">Response Length</label>
                  <select
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                    value={form.responseLength}
                    onChange={(e) => setForm({ ...form, responseLength: e.target.value })}
                  >
                    <option value="short" className="bg-zinc-900">Short</option>
                    <option value="medium" className="bg-zinc-900">Medium</option>
                    <option value="long" className="bg-zinc-900">Long</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-1.5">Knowledge Base</label>
                  <textarea
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all resize-none"
                    placeholder="Paste custom knowledge or FAQ content for the agent..."
                    rows={3}
                    value={form.knowledgeBase}
                    onChange={(e) => setForm({ ...form, knowledgeBase: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* === PREMIUM SETTINGS (Premium only) === */}
            {hasFull && (
              <div className="space-y-4">
                <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium">Premium Settings</p>

                <div>
                  <label className="block text-sm text-zinc-400 mb-1.5">System Prompt</label>
                  <textarea
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all resize-none"
                    placeholder="You are a helpful assistant for..."
                    rows={3}
                    value={form.systemPrompt}
                    onChange={(e) => setForm({ ...form, systemPrompt: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-1.5">Custom CSS</label>
                  <textarea
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all resize-none font-mono text-sm"
                    placeholder=".chatbot-widget { border-radius: 16px; }"
                    rows={3}
                    value={form.customCss}
                    onChange={(e) => setForm({ ...form, customCss: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-1.5">Webhook URL</label>
                  <input
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                    placeholder="https://your-server.com/webhook"
                    value={form.webhookUrl}
                    onChange={(e) => setForm({ ...form, webhookUrl: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* Upgrade hint for Basic users */}
            {!hasAdvanced && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/3 border border-white/8">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-zinc-500" />
                  <span className="text-zinc-500 text-sm">More options available on higher plans</span>
                </div>
                <Link href="/pricing" className="flex items-center gap-1 text-xs text-blue-400 hover:underline">
                  Upgrade <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
            )}

            <button
              onClick={createAgent}
              disabled={loading || !form.name || !!limitReached}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Agent"
              )}
            </button>
          </div>
        </motion.div>
      </main>
    </ProtectedRoute>
  );
}

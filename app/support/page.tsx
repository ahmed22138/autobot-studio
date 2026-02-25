"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send, Loader2, CheckCircle } from "lucide-react";

export default function SupportPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    plan: "basic",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // API call to send email
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSuccess(true);
        setForm({ name: "", email: "", subject: "", message: "", plan: "basic" });
        setTimeout(() => setSuccess(false), 5000);
      }
    } catch (error) {
      console.error("Support request failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f] px-4 py-24">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Contact Support</h1>
            <p className="text-zinc-400">
              Need help? We're here to assist you!
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-3"
            >
              <CheckCircle className="w-5 h-5 text-green-400" />
              <p className="text-green-400 text-sm">
                Message sent successfully! We'll get back to you soon.
              </p>
            </motion.div>
          )}

          {/* Support Form */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">
                  Your Plan
                </label>
                <select
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                  value={form.plan}
                  onChange={(e) => setForm({ ...form, plan: e.target.value })}
                >
                  <option value="basic" className="bg-zinc-900">Basic (Email Support)</option>
                  <option value="medium" className="bg-zinc-900">Medium (Priority Support)</option>
                  <option value="premium" className="bg-zinc-900">Premium (24/7 Priority)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                  placeholder="How can we help?"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">
                  Message
                </label>
                <textarea
                  required
                  rows={6}
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all resize-none"
                  placeholder="Describe your issue or question..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Support Info */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">
                Basic Plan
              </p>
              <p className="text-white text-sm font-medium">Email Support</p>
              <p className="text-zinc-400 text-xs mt-1">Response in 24-48 hours</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">
                Medium Plan
              </p>
              <p className="text-white text-sm font-medium">Priority Support</p>
              <p className="text-zinc-400 text-xs mt-1">Response in 12-24 hours</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">
                Premium Plan
              </p>
              <p className="text-white text-sm font-medium">24/7 Priority</p>
              <p className="text-zinc-400 text-xs mt-1">Response in 2-4 hours</p>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Puzzle, MessageCircle, Check, Loader2, X, Copy, ExternalLink, Clock } from "lucide-react";
import FeatureGate from "@/components/FeatureGate";
import { createClient } from "@/lib/supabase/client";

interface Agent { id: string; agent_id: string; name: string; }
interface Integration { id: string; phone_number: string; agent_id: string; status: string; }

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "https://autobot-backend-wowh.onrender.com";
const TWILIO_NUMBER = process.env.NEXT_PUBLIC_TWILIO_SANDBOX_NUMBER || "+14155238886";
const SANDBOX_WORD  = process.env.NEXT_PUBLIC_TWILIO_SANDBOX_WORD  || "join <sandbox-word>";

function IntegrationsContent() {
  const [agents, setAgents]           = useState<Agent[]>([]);
  const [integration, setIntegration] = useState<Integration | null>(null);
  const [loading, setLoading]         = useState(true);
  const [saving, setSaving]           = useState(false);
  const [deleting, setDeleting]       = useState(false);
  const [showForm, setShowForm]       = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [phone, setPhone]             = useState("");
  const [agentId, setAgentId]         = useState("");
  const [error, setError]             = useState("");
  const [copied, setCopied]           = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const [agentsRes, integRes] = await Promise.all([
      supabase.from("agents").select("id, agent_id, name").eq("user_id", user.id).eq("status", "active"),
      fetch("/api/integrations/whatsapp"),
    ]);

    setAgents(agentsRes.data || []);
    if (integRes.ok) {
      const d = await integRes.json();
      setIntegration(d.integration);
      if (d.integration) setShowInstructions(true);
    }
    setLoading(false);
  };

  const handleConnect = async () => {
    if (!phone.trim()) { setError("WhatsApp number daalo"); return; }
    if (!agentId) { setError("Agent select karo"); return; }
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/integrations/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_number: phone, agent_id: agentId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setIntegration({ id: "", phone_number: data.phone_number, agent_id: agentId, status: "pending" });
      setShowForm(false);
      setShowInstructions(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm("WhatsApp integration disconnect karna chahte ho?")) return;
    setDeleting(true);
    await fetch("/api/integrations/whatsapp", { method: "DELETE" });
    setIntegration(null);
    setShowInstructions(false);
    setPhone("");
    setAgentId("");
    setDeleting(false);
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const connectedAgent = agents.find(a => a.agent_id === integration?.agent_id);
  const webhookUrl = `${BACKEND_URL}/webhook/whatsapp/${integration?.agent_id || agentId}`;

  if (loading) return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <Loader2 className="w-8 h-8 text-green-400 animate-spin" />
    </div>
  );

  return (
    <main className="min-h-screen bg-[#0a0a0f] px-4 py-12">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Custom Integrations</h1>
          <p className="text-zinc-400">Apne agent ko WhatsApp se connect karo</p>
        </div>

        {/* WhatsApp Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-white/5 border border-white/10">

          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">WhatsApp</h3>
                <p className="text-zinc-500 text-sm">Agent ko WhatsApp pe active karo</p>
              </div>
            </div>

            {integration ? (
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/15 text-green-400 text-sm border border-green-500/25">
                  <Check className="w-3.5 h-3.5" /> Connected
                </span>
                <button onClick={handleDisconnect} disabled={deleting}
                  className="p-2 rounded-lg hover:bg-white/10 text-zinc-500 hover:text-red-400 transition-colors">
                  {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                </button>
              </div>
            ) : (
              <button onClick={() => setShowForm(!showForm)}
                className="px-4 py-2 rounded-xl bg-green-500/10 hover:bg-green-500/20 text-green-400 text-sm font-medium border border-green-500/20 transition-all">
                Connect
              </button>
            )}
          </div>

          {/* Connected Info */}
          {integration && (
            <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/15 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">WhatsApp Number</span>
                <span className="text-white font-mono">{integration.phone_number}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Connected Agent</span>
                <span className="text-white">{connectedAgent?.name || integration.agent_id}</span>
              </div>
            </div>
          )}

          {/* Connect Form */}
          <AnimatePresence>
            {showForm && !integration && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="pt-5 space-y-4">
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">Apna WhatsApp Number</label>
                    <input
                      type="tel"
                      placeholder="03001234567"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-600 outline-none focus:border-green-500/50 text-sm"
                    />
                    <p className="text-zinc-600 text-xs mt-1">Pakistani number: 03XX-XXXXXXX</p>
                  </div>

                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">Agent Select karo</label>
                    <select value={agentId} onChange={e => setAgentId(e.target.value)}
                      className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-green-500/50 text-sm">
                      <option value="" className="bg-zinc-900">-- Agent chunno --</option>
                      {agents.map(a => (
                        <option key={a.agent_id} value={a.agent_id} className="bg-zinc-900">{a.name}</option>
                      ))}
                    </select>
                    <p className="text-zinc-600 text-xs mt-1">Ye agent tumhare WhatsApp pe jawab dega</p>
                  </div>

                  {error && <p className="text-red-400 text-sm">{error}</p>}

                  <button onClick={handleConnect} disabled={saving}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Connecting...</> : "Connect WhatsApp"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Instructions — show after connect */}
        <AnimatePresence>
          {showInstructions && integration && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-5">

              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-5 h-5 text-amber-400" />
                <h3 className="text-white font-semibold">Activation Steps</h3>
              </div>
              <p className="text-zinc-400 text-sm">Ye 2 kaam karo — ek baar sirf tumhe, ek baar customer ko:</p>

              {/* Step 1 — Admin setup */}
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-3">
                <p className="text-blue-400 font-semibold text-sm">Step 1 — Twilio Webhook Set Karo (Sirf Ek Baar)</p>
                <p className="text-zinc-400 text-xs">
                  Twilio Console → WhatsApp → Sandbox Settings → "When a message comes in" mein ye URL paste karo:
                </p>
                <div className="flex items-center gap-2 bg-black/30 rounded-lg px-3 py-2">
                  <code className="text-green-400 text-xs font-mono flex-1 break-all">{webhookUrl}</code>
                  <button onClick={() => copyText(webhookUrl)}
                    className="p-1 hover:bg-white/10 rounded text-zinc-400 hover:text-white transition-colors flex-shrink-0">
                    {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <a href="https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn"
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-xs transition-colors">
                  <ExternalLink className="w-3.5 h-3.5" /> Twilio Console kholein
                </a>
              </div>

              {/* Step 2 — Customer join */}
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 space-y-3">
                <p className="text-green-400 font-semibold text-sm">Step 2 — Customer Ko Yeh Batao (Ek Baar)</p>
                <p className="text-zinc-400 text-xs">Customer apne WhatsApp se is number pe message kare:</p>
                <div className="flex items-center justify-between bg-black/30 rounded-lg px-3 py-2">
                  <div>
                    <p className="text-zinc-500 text-xs mb-0.5">Number</p>
                    <p className="text-white font-mono font-bold">{TWILIO_NUMBER}</p>
                  </div>
                  <button onClick={() => copyText(TWILIO_NUMBER)}
                    className="p-1.5 hover:bg-white/10 rounded text-zinc-400 hover:text-white transition-colors">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center justify-between bg-black/30 rounded-lg px-3 py-2">
                  <div>
                    <p className="text-zinc-500 text-xs mb-0.5">Message</p>
                    <p className="text-white font-mono font-bold">{SANDBOX_WORD}</p>
                  </div>
                  <button onClick={() => copyText(SANDBOX_WORD)}
                    className="p-1.5 hover:bg-white/10 rounded text-zinc-400 hover:text-white transition-colors">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-zinc-500 text-xs">
                  Join hone ke baad customer directly message kar sakta hai — agent automatically reply karega!
                </p>
              </div>

              {/* Done */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                <Check className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-white font-medium">Setup Complete!</p>
                <p className="text-zinc-500 text-sm mt-1">
                  Customer message karega → <span className="text-white">{connectedAgent?.name}</span> jawab dega
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Other integrations — Coming Soon */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-4">
          {[
            { name: "Instagram", color: "pink", desc: "DMs pe agent" },
            { name: "Zapier",    color: "orange", desc: "5000+ apps connect" },
            { name: "Shopify",   color: "green",  desc: "Store integration" },
            { name: "Slack",     color: "purple", desc: "Team channels" },
          ].map(item => (
            <div key={item.name} className="p-4 rounded-xl bg-white/5 border border-white/5 opacity-50">
              <div className="flex items-center justify-between mb-2">
                <p className="text-white font-medium text-sm">{item.name}</p>
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-zinc-400">Soon</span>
              </div>
              <p className="text-zinc-600 text-xs">{item.desc}</p>
            </div>
          ))}
        </motion.div>

      </div>
    </main>
  );
}

export default function IntegrationsPage() {
  return (
    <FeatureGate
      featureKey="customIntegrations"
      title="Custom Integrations"
      description="Connect your AI agents with WhatsApp, Instagram, Zapier, and more."
      requiredPlan="Premium"
      icon={<Puzzle className="w-8 h-8 text-zinc-500" />}
    >
      <IntegrationsContent />
    </FeatureGate>
  );
}

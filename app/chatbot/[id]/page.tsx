"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Send, Bot, Loader2, AlertTriangle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface UsageData {
  plan: string;
  agentCount: number;
  messageCount: number;
  limits: { agents: number | null; messages: number | null };
}

export default function ChatbotPage() {
  const { id } = useParams();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "agent"; text: string }[]
  >([]);
  const [typing, setTyping] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [localMessageCount, setLocalMessageCount] = useState(0);

  const supabase = createClient();

  // Fetch usage on mount
  useEffect(() => {
    fetch("/api/usage")
      .then((res) => res.json())
      .then((data) => {
        setUsage(data);
        setLocalMessageCount(data.messageCount ?? 0);
      })
      .catch(() => {});
  }, []);

  const messageLimitReached =
    usage && usage.limits.messages !== null && localMessageCount >= usage.limits.messages;

  // Load chat history on mount
  useEffect(() => {
    const loadHistory = async () => {
      const { data } = await supabase
        .from("messages")
        .select("role, text")
        .eq("agent_id", id)
        .order("created_at", { ascending: true });

      if (data && data.length > 0) {
        setMessages(data.map((m) => ({ role: m.role as "user" | "agent", text: m.text })));
      }
      setLoadingHistory(false);
    };
    loadHistory();
  }, [id]);

  const saveMessage = async (role: string, text: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("messages").insert({
      agent_id: id,
      user_id: user?.id || null,
      role,
      text,
    });
  };

  const typeEffect = async (fullText: string) => {
    setTyping(true);
    let current = "";
    setMessages((prev) => [...prev, { role: "agent", text: "" }]);

    for (let i = 0; i < fullText.length; i++) {
      current += fullText[i];
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "agent", text: current };
        return updated;
      });
      await new Promise((r) => setTimeout(r, 25));
    }
    setTyping(false);

    // Save agent reply after typing completes
    await saveMessage("agent", fullText);
  };

  const send = async () => {
    if (!input || typing || messageLimitReached) return;
    const userMsg = input;
    setMessages((m) => [...m, { role: "user", text: userMsg }]);
    setInput("");

    // Increment local counter
    setLocalMessageCount((c) => c + 1);

    // Save user message
    await saveMessage("user", userMsg);

    const res = await fetch(`${API}/chat/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMsg }),
    });
    const data = await res.json();
    await typeEffect(data.reply);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white flex flex-col -mt-16">
      <header className="pt-16 p-4 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
          <Bot className="w-4 h-4 text-blue-400" />
        </div>
        <span className="font-semibold">AI Agent Chat</span>
      </header>

      <div className="flex-1 p-6 space-y-4 overflow-y-auto">
        {loadingHistory ? (
          <div className="flex items-center justify-center mt-20">
            <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-zinc-500 mt-20">
            <Bot className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>Send a message to start chatting</p>
          </div>
        ) : null}
        {!loadingHistory &&
          messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-xl px-4 py-3 rounded-2xl whitespace-pre-wrap leading-relaxed ${
                m.role === "user"
                  ? "ml-auto bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                  : "mr-auto bg-white/5 border border-white/5 text-zinc-200"
              }`}
            >
              {m.text}
            </div>
          ))}
        {typing && (
          <div className="mr-auto bg-white/5 border border-white/5 px-4 py-2 rounded-2xl text-sm text-zinc-400">
            <span className="inline-flex gap-1">
              <span className="animate-bounce">.</span>
              <span className="animate-bounce" style={{ animationDelay: "0.1s" }}>.</span>
              <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>.</span>
            </span>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl">
        {/* Message limit banner */}
        {messageLimitReached && (
          <div className="flex items-start gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 mb-3 max-w-4xl mx-auto">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-400 font-medium text-sm">Monthly message limit reached</p>
              <p className="text-zinc-400 text-sm mt-0.5">
                Your {usage?.plan} plan allows {usage?.limits.messages} messages/month.{" "}
                <Link href="/pricing" className="text-blue-400 hover:underline">
                  Upgrade your plan
                </Link>{" "}
                to continue chatting.
              </p>
            </div>
          </div>
        )}

        {/* Usage indicator */}
        {usage && usage.limits.messages !== null && !messageLimitReached && (
          <p className="text-zinc-500 text-xs text-center mb-2">
            {localMessageCount}/{usage.limits.messages} messages this month
          </p>
        )}

        <div className="flex gap-2 max-w-4xl mx-auto">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={messageLimitReached ? "Message limit reached" : "Type your message..."}
            disabled={!!messageLimitReached}
            className="flex-1 p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all disabled:opacity-50"
          />
          <button
            onClick={send}
            disabled={typing || !input || !!messageLimitReached}
            className="px-5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 transition-all flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </main>
  );
}

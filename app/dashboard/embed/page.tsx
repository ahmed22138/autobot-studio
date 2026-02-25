"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Eye, Code2, Loader2 } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";

function EmbedContent() {
  const params = useSearchParams();
  const agentId = params.get("agentId") || "";
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);

  const scriptCode = `<script src="${typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"}/chatbot.js" data-agent-id="${agentId}"></script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f] px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
              <Code2 className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Embed Your Chatbot
              </h1>
              <p className="text-zinc-400 text-sm">
                Copy and paste this code before &lt;/body&gt;
              </p>
            </div>
          </div>

          <pre className="bg-black/40 border border-white/5 text-green-400 p-4 rounded-xl text-sm overflow-x-auto">
            {scriptCode}
          </pre>

          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-sm font-medium transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Script
                </>
              )}
            </button>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white text-sm font-medium transition-all"
            >
              <Eye className="w-4 h-4" />
              {showPreview ? "Hide Preview" : "Preview Chatbot"}
            </button>
          </div>

          {showPreview && agentId && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 520 }}
              className="rounded-xl overflow-hidden border border-white/10"
            >
              <iframe
                src={`/chatbot/${agentId}`}
                className="w-full h-[520px]"
              />
            </motion.div>
          )}
        </div>
      </motion.div>
    </main>
  );
}

export default function EmbedPage() {
  return (
    <ProtectedRoute>
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        }
      >
        <EmbedContent />
      </Suspense>
    </ProtectedRoute>
  );
}

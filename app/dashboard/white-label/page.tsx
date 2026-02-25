"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Palette, Upload, Eye } from "lucide-react";
import FeatureGate from "@/components/FeatureGate";

function WhiteLabelContent() {
  const [brandName, setBrandName] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#3b82f6");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f] px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-3xl font-bold text-white mb-2">White-label</h1>
          <p className="text-zinc-400">
            Remove AutoBot branding and customize with your own brand identity
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/5 space-y-5"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Palette className="w-5 h-5 text-purple-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">
                Brand Settings
              </h2>
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">
                Brand Name
              </label>
              <input
                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                placeholder="Your Company Name"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">
                Primary Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-12 h-12 rounded-lg cursor-pointer border border-white/10 bg-transparent"
                />
                <input
                  className="flex-1 p-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-sm outline-none focus:border-purple-500/50 transition-all"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">
                Logo Upload
              </label>
              <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-white/20 transition-all cursor-pointer">
                <Upload className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
                <p className="text-zinc-500 text-sm">
                  Click or drag to upload your logo
                </p>
                <p className="text-zinc-600 text-xs mt-1">
                  PNG, SVG up to 2MB
                </p>
              </div>
            </div>

            <button
              onClick={handleSave}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-medium transition-all"
            >
              {saved ? "Saved!" : "Save Branding"}
            </button>
          </motion.div>

          {/* Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/5"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Eye className="w-5 h-5 text-blue-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">Preview</h2>
            </div>

            <div className="rounded-xl border border-white/10 overflow-hidden">
              {/* Mock chatbot preview */}
              <div
                className="p-3 flex items-center gap-2"
                style={{ backgroundColor: primaryColor + "20" }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: primaryColor + "30" }}
                >
                  <span
                    className="text-sm font-bold"
                    style={{ color: primaryColor }}
                  >
                    {brandName ? brandName[0]?.toUpperCase() : "A"}
                  </span>
                </div>
                <span className="text-white text-sm font-medium">
                  {brandName || "AutoBot Studio"}
                </span>
              </div>
              <div className="p-4 bg-black/30 min-h-[200px] space-y-3">
                <div className="mr-auto bg-white/5 border border-white/5 rounded-2xl px-4 py-2 text-sm text-zinc-300 max-w-[80%]">
                  Hi! How can I help you today?
                </div>
                <div
                  className="ml-auto rounded-2xl px-4 py-2 text-sm text-white max-w-[80%]"
                  style={{ backgroundColor: primaryColor }}
                >
                  I have a question about pricing
                </div>
              </div>
              {!brandName && (
                <div className="p-2 text-center border-t border-white/5">
                  <p className="text-zinc-600 text-xs">
                    Powered by AutoBot Studio
                  </p>
                </div>
              )}
            </div>

            {brandName && (
              <p className="text-green-400 text-xs mt-3 text-center">
                &quot;Powered by AutoBot Studio&quot; branding removed
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  );
}

export default function WhiteLabelPage() {
  return (
    <FeatureGate
      featureKey="whiteLabel"
      title="White-label"
      description="Remove AutoBot branding and fully customize the chatbot widget with your own brand identity, colors, and logo."
      requiredPlan="Premium"
      icon={<Palette className="w-8 h-8 text-zinc-500" />}
    >
      <WhiteLabelContent />
    </FeatureGate>
  );
}

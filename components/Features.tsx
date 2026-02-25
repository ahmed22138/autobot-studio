"use client";

import { motion } from "framer-motion";
import { Bot, Code2, MessageSquare, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "Custom AI Agents",
    description:
      "Design agents with unique personalities, tones, and knowledge bases tailored to your needs.",
  },
  {
    icon: Code2,
    title: "One-Click Embed",
    description:
      "Add your chatbot to any website with a single script tag. No complex integration required.",
  },
  {
    icon: MessageSquare,
    title: "Real-Time Chat",
    description:
      "Lightning-fast responses with a natural typing effect that feels like a real conversation.",
  },
  {
    icon: BarChart3,
    title: "Smart Analytics",
    description:
      "Track conversations, user engagement, and agent performance with built-in analytics.",
  },
];

const steps = [
  {
    number: "01",
    title: "Create",
    description: "Name your agent and define its personality and tone.",
  },
  {
    number: "02",
    title: "Customize",
    description: "Fine-tune responses and behavior to match your brand.",
  },
  {
    number: "03",
    title: "Deploy",
    description: "Copy the embed code and add it to your website instantly.",
  },
];

export default function Features() {
  return (
    <>
      {/* Features Section */}
      <section id="features" className="py-24 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything You Need to Build{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                AI Agents
              </span>
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Powerful tools to create, customize, and deploy intelligent
              chatbots without writing a single line of backend code.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/5 hover:border-white/10 hover:bg-white/[0.07] transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-4 group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all">
                  <feature.icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  {feature.title}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-4 relative">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto">
              Three simple steps to get your AI agent live on any website.
            </p>
          </motion.div>

          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/50 via-purple-500/50 to-transparent hidden md:block" />

            <div className="space-y-12">
              {steps.map((step, i) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="flex items-start gap-6"
                >
                  <div className="relative flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      {step.number}
                    </span>
                  </div>
                  <div className="pt-3">
                    <h3 className="text-white font-semibold text-xl mb-2">
                      {step.title}
                    </h3>
                    <p className="text-zinc-400">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-500/10 rounded-full blur-[120px]" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Start Building Your Agent Today
          </h2>
          <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
            Join developers and businesses building intelligent AI chatbots with
            AutoBot Studio. Get started in minutes.
          </p>
          <a
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
          >
            Get Started Free
          </a>
        </motion.div>
      </section>
    </>
  );
}

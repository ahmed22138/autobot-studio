"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  BookOpen, Bot, Zap, ChevronRight, Copy, Check,
  ShoppingBag, Headphones, Globe, GraduationCap,
  Building2, Utensils, Plane, Heart, Code2, MessageSquare,
} from "lucide-react";

const sections = [
  { id: "getting-started", label: "Getting Started" },
  { id: "create-agent",    label: "Agent Banao" },
  { id: "agent-types",     label: "Agent Types" },
  { id: "prompts",         label: "Better Prompts" },
  { id: "examples",        label: "10 Prompt Examples" },
  { id: "embed",           label: "Website pe Lagao" },
];

const colorMap: Record<string, { bg: string; text: string; border: string; badge: string }> = {
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", badge: "bg-emerald-500/20" },
  orange:  { bg: "bg-orange-500/10",  text: "text-orange-400",  border: "border-orange-500/20",  badge: "bg-orange-500/20" },
  blue:    { bg: "bg-blue-500/10",    text: "text-blue-400",    border: "border-blue-500/20",    badge: "bg-blue-500/20" },
  purple:  { bg: "bg-purple-500/10",  text: "text-purple-400",  border: "border-purple-500/20",  badge: "bg-purple-500/20" },
  cyan:    { bg: "bg-cyan-500/10",    text: "text-cyan-400",    border: "border-cyan-500/20",    badge: "bg-cyan-500/20" },
  pink:    { bg: "bg-pink-500/10",    text: "text-pink-400",    border: "border-pink-500/20",    badge: "bg-pink-500/20" },
  sky:     { bg: "bg-sky-500/10",     text: "text-sky-400",     border: "border-sky-500/20",     badge: "bg-sky-500/20" },
  violet:  { bg: "bg-violet-500/10",  text: "text-violet-400",  border: "border-violet-500/20",  badge: "bg-violet-500/20" },
  teal:    { bg: "bg-teal-500/10",    text: "text-teal-400",    border: "border-teal-500/20",    badge: "bg-teal-500/20" },
  amber:   { bg: "bg-amber-500/10",   text: "text-amber-400",   border: "border-amber-500/20",   badge: "bg-amber-500/20" },
};

const promptExamples = [
  {
    icon: ShoppingBag, color: "emerald",
    title: "Clothing Store Sales Bot", industry: "Fashion / Retail", description: "Kapron ki online dukaan ke liye",
    agent: { name: "StyleBot", type: "sales", tone: "friendly", description: "Online clothing store ka sales assistant jo customers ko products select karne aur order place karne mein madad karta hai." },
    prompt: `Mera naam StyleBot hai aur main Trendy Threads ka sales assistant hoon.

Meri responsibilities:
- Customers ko available products dikhao (T-shirts, Jeans, Dresses, etc.)
- Sizing guide dena (S, M, L, XL available hai)
- Sale/discount offers batana
- Order process explain karna
- Customer ki pasand ke mutabiq products suggest karna

Conversation style:
- Friendly aur helpful raho
- Urdu/English mix mein baat karo
- Agar customer confused ho to patiently help karo`,
  },
  {
    icon: Utensils, color: "orange",
    title: "Restaurant Order Bot", industry: "Food & Restaurant", description: "Restaurant ya food delivery ke liye",
    agent: { name: "FoodieBot", type: "sales", tone: "friendly", description: "Restaurant ka online ordering assistant jo menu dikhata hai aur orders leta hai." },
    prompt: `Main FoodieBot hoon — Spice Garden Restaurant ka digital waiter.

Main kya karta hoon:
- Full menu batata hoon with prices
- Daily specials aur chef recommendations share karta hoon
- Dine-in, takeaway ya delivery option explain karta hoon
- Allergies/dietary requirements puchta hoon
- Order confirm karne ke baad estimated time batata hoon

Rules:
- Har dish ki description appetizing andaaz mein karo
- Spice level puchna mat bhoolna
- Agar koi item available nahi to alternative suggest karo`,
  },
  {
    icon: Building2, color: "blue",
    title: "Real Estate Bot", industry: "Real Estate", description: "Property sales aur rentals ke liye",
    agent: { name: "PropBot", type: "sales", tone: "professional", description: "Real estate assistant jo property listings dikhata hai aur site visits schedule karta hai." },
    prompt: `Main PropBot hoon — AreebProperties ka virtual property consultant.

Mera kaam:
- Available properties (sale/rent) ki details dena
- Location, size, price, amenities explain karna
- Site visit schedule karna
- Property comparison karna

Important:
- Hamesha customer ka budget aur requirements pehle puchho
- Location preference confirm karo (DHA, Bahria, Gulberg, etc.)
- Professional aur trustworthy tone maintain karo`,
  },
  {
    icon: Headphones, color: "purple",
    title: "E-commerce Support Bot", industry: "E-commerce Support", description: "Order tracking aur returns ke liye",
    agent: { name: "SupportBot", type: "support", tone: "professional", description: "Customer support assistant for order issues, returns, and complaints." },
    prompt: `Main ShopEase ka customer support assistant hoon.

Main help karta hoon:
- Order status track karna (order number maango)
- Return/exchange process explain karna (7-day policy)
- Damaged product complaints handle karna
- Refund status check karna

Process:
1. Customer ka order number ya email lo
2. Issue clearly samjho
3. Solution ya next steps batao
4. Agar resolve nahi hua to escalate karo: support@shopease.pk

Tone: Patient, empathetic, solution-focused`,
  },
  {
    icon: GraduationCap, color: "cyan",
    title: "Online Course Bot", industry: "Education", description: "Online academy ya courses ke liye",
    agent: { name: "LearnBot", type: "general", tone: "friendly", description: "Online learning platform ka assistant jo students ko courses aur enrollment mein guide karta hai." },
    prompt: `Main LearnBot hoon — TechSkills Academy ka student advisor.

Main batata hoon:
- Available courses (Web Dev, Python, Graphic Design, etc.)
- Course duration aur schedule
- Fees aur payment plans (installments available)
- Certificate details
- Job placement support

Rules:
- Sirf available courses ke baare mein baat karo
- Free trial class offer karo
- Student ki background ke mutabiq course suggest karo`,
  },
  {
    icon: Heart, color: "pink",
    title: "Healthcare Clinic Bot", industry: "Healthcare", description: "Clinic appointment booking ke liye",
    agent: { name: "HealthBot", type: "support", tone: "professional", description: "Clinic ka appointment scheduling aur basic health info assistant." },
    prompt: `Main HealthBot hoon — CarePlus Clinic ka appointment assistant.

Mera kaam:
- Available doctors aur specializations batana
- Appointment schedule karna (name, phone, preferred time maangna)
- Consultation fees inform karna
- Emergency cases mein helpline: 0311-1234567

Important rules:
- Medical advice BILKUL mat dena — sirf appointment book karo
- Agar patient emergency mein ho to turant helpline dena
- Patient information confidential rakho`,
  },
  {
    icon: Plane, color: "sky",
    title: "Travel Agency Bot", industry: "Travel & Tourism", description: "Tour packages aur booking ke liye",
    agent: { name: "TravelBot", type: "sales", tone: "friendly", description: "Travel agency ka booking assistant jo tours, visas, aur hotels arrange karta hai." },
    prompt: `Main TravelBot hoon — DreamTrips Travel Agency ka tour consultant.

Main kya offer karta hoon:
- Domestic tours (Hunza, Swat, Naran, Murree)
- International packages (Dubai, Turkey, Thailand)
- Umrah packages
- Hotel aur flight booking

Approach:
- Pehle destination puchho
- Budget aur travel dates confirm karo
- Group size batao (family/solo/honeymoon)
- Advance booking discounts mention karo`,
  },
  {
    icon: Code2, color: "violet",
    title: "SaaS Product Bot", industry: "Software / SaaS", description: "Software product ke liye sales aur onboarding",
    agent: { name: "SaaSBot", type: "sales", tone: "professional", description: "Software product ka sales assistant jo demos schedule karta hai aur pricing explain karta hai." },
    prompt: `Main TechFlow ka product specialist hoon.

Main help karta hoon:
- Product features aur benefits explain karna
- Pricing plans compare karna (Starter $29/mo, Pro $79/mo)
- Free trial activate karna (14 days, no credit card)
- Demo schedule karna

Sales approach:
- Pain points pehle samjho
- Relevant features highlight karo
- Free trial offer karo — low friction entry
- Social proof mention karo (500+ customers)`,
  },
  {
    icon: Globe, color: "teal",
    title: "General FAQ Bot", industry: "Information / FAQ", description: "Website FAQ ya knowledge base ke liye",
    agent: { name: "InfoBot", type: "general", tone: "professional", description: "Company FAQ aur general information assistant." },
    prompt: `Main InfoBot hoon — apni knowledge base se sirf correct information deta hoon.

Rules:
- Sirf provided knowledge base se jawab dena
- Agar information nahi hai: "Is baare mein mujhe exact info nahi — contact@company.com pe email karen"
- Guess ya assume BILKUL mat karo
- Short, clear aur accurate answers do

[Apna FAQ, product info, ya document yahan paste karo]`,
  },
  {
    icon: MessageSquare, color: "amber",
    title: "WhatsApp Style Support", industry: "Any Business", description: "Casual, conversational support bot",
    agent: { name: "ChatBot", type: "support", tone: "casual", description: "Casual aur friendly support assistant jo WhatsApp style mein baat karta hai." },
    prompt: `Hey! Main yahan hoon tumhari help ke liye

Mera style:
- Bilkul casual — jaise koi dost baat kar raha ho
- Short messages — long paragraphs nahi
- Emojis thore use karo
- Agar problem solve ho jaye to confirm karo

Kya karta hoon:
- Common questions ka jawab
- Order/service issues help
- Contact info dena
- Next steps guide karna

Remember: User ka time valuable hai — to the point raho!`,
  },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white text-xs transition-all border border-white/10"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

export default function DocsPage() {
  const [active, setActive] = useState("getting-started");
  const [openPrompt, setOpenPrompt] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-[#0a0a0f]">
      <div className="max-w-6xl mx-auto px-4 py-12">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-zinc-500 text-sm">Documentation</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">AutoBot Studio Docs</h1>
          <p className="text-zinc-400 text-lg">Agent banao, customize karo, aur apni website pe lagao — poori guide yahan hai.</p>
        </motion.div>

        <div className="flex gap-8">

          {/* Sidebar */}
          <aside className="hidden lg:block w-52 flex-shrink-0">
            <div className="sticky top-24 space-y-1">
              {sections.map((s) => (
                <a key={s.id} href={`#${s.id}`} onClick={() => setActive(s.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                    active === s.id ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : "text-zinc-500 hover:text-white hover:bg-white/5"
                  }`}>
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${active === s.id ? "rotate-90 text-blue-400" : ""}`} />
                  {s.label}
                </a>
              ))}
              <div className="pt-4 mt-4 border-t border-white/5">
                <Link href="/Agent"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-all">
                  <Bot className="w-3.5 h-3.5" />
                  Agent Banao →
                </Link>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 space-y-16 min-w-0">

            {/* 01 Getting Started */}
            <section id="getting-started">
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                <p className="text-xs text-blue-400 uppercase tracking-widest font-medium mb-2">01</p>
                <h2 className="text-2xl font-bold text-white mb-6">Getting Started</h2>
                <div className="grid sm:grid-cols-3 gap-4 mb-6">
                  {[
                    { step: "1", title: "Account Banao", desc: "Sign up karo aur dashboard access karo", icon: "🚀" },
                    { step: "2", title: "Agent Create Karo", desc: "Naam, type aur personality set karo", icon: "🤖" },
                    { step: "3", title: "Embed Karo", desc: "Ek line code copy karke website pe lagao", icon: "✨" },
                  ].map((item) => (
                    <div key={item.step} className="bg-white/5 border border-white/10 rounded-xl p-5">
                      <div className="text-2xl mb-3">{item.icon}</div>
                      <p className="text-white font-semibold mb-1">Step {item.step}: {item.title}</p>
                      <p className="text-zinc-500 text-sm">{item.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-5">
                  <p className="text-blue-400 font-medium mb-1">⚡ Quick Start</p>
                  <p className="text-zinc-400 text-sm">Account bana ke 5 minute mein pehla agent deploy kar sakte ho. Koi coding nahi chahiye!</p>
                </div>
              </motion.div>
            </section>

            {/* 02 Create Agent */}
            <section id="create-agent">
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                <p className="text-xs text-purple-400 uppercase tracking-widest font-medium mb-2">02</p>
                <h2 className="text-2xl font-bold text-white mb-6">Agent Kaise Banate Hain</h2>
                <div className="space-y-4">
                  {[
                    { title: "Agent Name", tip: "Aisa naam rakho jo aapke brand se match kare.", good: "✅ StyleBot, FoodieHelper, SupportPro", bad: "❌ Bot1, MyAgent, Chatbot123" },
                    { title: "Description", tip: "Agent ko batao wo kaun hai aur kya karta hai. Yeh GPT ka context banta hai.", good: "✅ 'Trendy Threads ka sales assistant jo customers ko clothing products select karne mein madad karta hai'", bad: "❌ 'A helpful chatbot'" },
                    { title: "Tone", tip: "Apne audience ke hisaab se tone choose karo.", good: "✅ Friendly (retail/food), Professional (legal/finance), Casual (youth brands)", bad: "" },
                    { title: "Agent Type", tip: "Sahi type bohot zaroori hai — galat type se agent sahi kaam nahi karta.", good: "✅ Sales: products bechna | Support: issues solve karna | General: info dena", bad: "" },
                  ].map((item, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5">
                      <p className="text-white font-semibold mb-2">{item.title}</p>
                      <p className="text-zinc-400 text-sm mb-3">{item.tip}</p>
                      <p className="text-green-400 text-sm">{item.good}</p>
                      {item.bad && <p className="text-red-400 text-sm mt-1">{item.bad}</p>}
                    </div>
                  ))}
                </div>
              </motion.div>
            </section>

            {/* 03 Agent Types */}
            <section id="agent-types">
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                <p className="text-xs text-emerald-400 uppercase tracking-widest font-medium mb-2">03</p>
                <h2 className="text-2xl font-bold text-white mb-6">Agent Types</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    { icon: "💰", type: "Sales Bot", color: "emerald", desc: "Products bechne ke liye. Payment, orders, screenshot verify sab kuch.", use: "Online stores, restaurants, travel agencies", features: ["Product catalog", "Payment setup", "Screenshot verify", "Auto order save"] },
                    { icon: "🎧", type: "Support Bot", color: "blue", desc: "Customer issues resolve karne ke liye. Problems sunta hai, solutions deta hai.", use: "E-commerce support, SaaS help desk", features: ["Issue handling", "Escalation flow", "FAQ answers", "Ticket creation"] },
                    { icon: "🤖", type: "General Bot", color: "purple", desc: "Apni knowledge base se jawab deta hai. Book, FAQ, document content paste karo.", use: "Schools, clinics, law firms", features: ["Knowledge base", "Strict answers", "No hallucination", "Custom content"] },
                  ].map((item, i) => {
                    const c = colorMap[item.color];
                    return (
                      <div key={i} className={`${c.bg} border ${c.border} rounded-xl p-5`}>
                        <div className="text-2xl mb-3">{item.icon}</div>
                        <p className={`font-bold ${c.text} mb-2`}>{item.type}</p>
                        <p className="text-zinc-400 text-sm mb-3">{item.desc}</p>
                        <p className="text-zinc-500 text-xs mb-3"><strong className="text-zinc-400">Best for:</strong> {item.use}</p>
                        <ul className="space-y-1">
                          {item.features.map((f, j) => (
                            <li key={j} className={`text-xs flex items-center gap-1.5 ${c.text}`}><span>✓</span>{f}</li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </section>

            {/* 04 Better Prompts */}
            <section id="prompts">
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                <p className="text-xs text-amber-400 uppercase tracking-widest font-medium mb-2">04</p>
                <h2 className="text-2xl font-bold text-white mb-6">Better Prompts Kaise Likhein</h2>
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-5 mb-6">
                  <p className="text-amber-400 font-semibold mb-2">💡 Golden Rule</p>
                  <p className="text-zinc-300 text-sm">Prompt mein likho jaise tum ek <strong>naye employee</strong> ko train kar rahe ho. Usse batao: wo kaun hai, kya karta hai, kaise baat karta hai, aur kya nahi karna.</p>
                </div>
                <div className="space-y-4">
                  {[
                    { rule: "1. Identity Clear Karo", good: "Main [BusinessName] ka [role] hoon.", bad: "Tum ek helpful assistant ho.", why: "Agent ko pata hona chahiye wo kaun hai. Vague identity = vague replies." },
                    { rule: "2. Responsibilities List Karo", good: "Main kya karta hoon:\n- Products dikhata hoon\n- Orders leta hoon\n- Payment info deta hoon", bad: "Main customer ki help karta hoon.", why: "Bullet points mein responsibilities likhne se agent focused rehta hai." },
                    { rule: "3. Limits Set Karo", good: "Main SIRF apni products ke baare mein baat karta hoon. Competitors ka zikar nahi karta.", bad: "(kuch nahi likha)", why: "Bina limits ke agent kuch bhi bol sakta hai. Boundaries se quality hoti hai." },
                    { rule: "4. Language Define Karo", good: "Urdu/English mix (Hinglish) mein baat karo. Friendly raho. Emojis thore use karo.", bad: "Friendly tone mein baat karo.", why: "Pakistan mein Hinglish common hai — explicitly likho warna English mein reply aayenge." },
                    { rule: "5. Edge Cases Handle Karo", good: "Agar customer angry ho to pehle apologize karo, phir solution do.", bad: "(kuch nahi likha)", why: "Edge cases handle karne se agent professional rehta hai aur brand safe rehti hai." },
                  ].map((item, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5">
                      <p className="text-white font-semibold mb-4">{item.rule}</p>
                      <div className="grid sm:grid-cols-2 gap-3 mb-3">
                        <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3">
                          <p className="text-green-400 text-xs font-medium mb-1">✅ Acha</p>
                          <pre className="text-zinc-300 text-xs whitespace-pre-wrap font-mono">{item.good}</pre>
                        </div>
                        <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3">
                          <p className="text-red-400 text-xs font-medium mb-1">❌ Bura</p>
                          <pre className="text-zinc-500 text-xs whitespace-pre-wrap font-mono">{item.bad}</pre>
                        </div>
                      </div>
                      <p className="text-zinc-500 text-xs">💡 {item.why}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </section>

            {/* 05 Prompt Examples */}
            <section id="examples">
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                <p className="text-xs text-pink-400 uppercase tracking-widest font-medium mb-2">05</p>
                <h2 className="text-2xl font-bold text-white mb-2">10 Ready-Made Prompt Examples</h2>
                <p className="text-zinc-500 text-sm mb-8">Copy karo, apna business name replace karo, aur use karo!</p>
                <div className="space-y-3">
                  {promptExamples.map((ex, i) => {
                    const Icon = ex.icon;
                    const c = colorMap[ex.color];
                    const isOpen = openPrompt === i;
                    return (
                      <div key={i} className={`border ${c.border} rounded-xl overflow-hidden`}>
                        <button
                          onClick={() => setOpenPrompt(isOpen ? null : i)}
                          className={`w-full flex items-center justify-between p-5 ${c.bg} hover:opacity-90 transition-all text-left`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl ${c.badge} flex items-center justify-center flex-shrink-0`}>
                              <Icon className={`w-5 h-5 ${c.text}`} />
                            </div>
                            <div>
                              <p className="text-white font-semibold">{ex.title}</p>
                              <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <span className={`text-xs px-2 py-0.5 rounded-full ${c.badge} ${c.text}`}>{ex.industry}</span>
                                <span className="text-zinc-500 text-xs">{ex.description}</span>
                              </div>
                            </div>
                          </div>
                          <ChevronRight className={`w-4 h-4 text-zinc-500 flex-shrink-0 transition-transform ${isOpen ? "rotate-90" : ""}`} />
                        </button>

                        {isOpen && (
                          <div className="p-5 bg-[#0d0d14] space-y-4">
                            <div>
                              <p className="text-zinc-400 text-xs font-medium uppercase tracking-wider mb-3">Agent Settings</p>
                              <div className="grid sm:grid-cols-3 gap-3 mb-3">
                                {[
                                  { label: "Name", value: ex.agent.name },
                                  { label: "Type", value: ex.agent.type },
                                  { label: "Tone", value: ex.agent.tone },
                                ].map((f) => (
                                  <div key={f.label} className="bg-white/5 rounded-lg p-3">
                                    <p className="text-zinc-500 text-xs mb-1">{f.label}</p>
                                    <p className={`text-sm font-medium capitalize ${c.text}`}>{f.value}</p>
                                  </div>
                                ))}
                              </div>
                              <div className="bg-white/5 rounded-lg p-3">
                                <p className="text-zinc-500 text-xs mb-1">Description</p>
                                <p className="text-zinc-300 text-sm">{ex.agent.description}</p>
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-zinc-400 text-xs font-medium uppercase tracking-wider">System Prompt</p>
                                <CopyButton text={ex.prompt} />
                              </div>
                              <pre className="bg-black/40 border border-white/5 rounded-xl p-4 text-zinc-300 text-xs whitespace-pre-wrap font-mono leading-relaxed overflow-x-auto">
                                {ex.prompt}
                              </pre>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </section>

            {/* 06 Embed */}
            <section id="embed">
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                <p className="text-xs text-green-400 uppercase tracking-widest font-medium mb-2">06</p>
                <h2 className="text-2xl font-bold text-white mb-6">Website Pe Kaise Lagaen</h2>
                <div className="space-y-5">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                    <p className="text-white font-semibold mb-2">Step 1: Embed Code Copy Karo</p>
                    <p className="text-zinc-400 text-sm mb-4">Dashboard → Your Agent → &quot;Copy Embed Code&quot; button click karo</p>
                    <div className="bg-black/40 border border-white/5 rounded-lg p-4 font-mono text-sm text-green-400 overflow-x-auto">
                      {'<script src="https://autobot-studio.vercel.app/chatbot.js" data-agent-id="YOUR_AGENT_ID"></script>'}
                    </div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                    <p className="text-white font-semibold mb-2">Step 2: HTML mein Paste Karo</p>
                    <p className="text-zinc-400 text-sm mb-4">&lt;/body&gt; tag se pehle paste karo — har page pe chatbot dikhega.</p>
                    <pre className="bg-black/40 border border-white/5 rounded-lg p-4 font-mono text-sm text-zinc-300 overflow-x-auto">{`<html>
  <body>
    <!-- aapka content -->

    <script src="https://autobot-studio.vercel.app/chatbot.js"
            data-agent-id="YOUR_ID">
    </script>
  </body>
</html>`}</pre>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {[
                      { platform: "WordPress", icon: "🌐", steps: "Plugins → Header Footer Code → Footer mein paste karo" },
                      { platform: "Shopify",   icon: "🛍️", steps: "Themes → Edit Code → theme.liquid → </body> se pehle" },
                      { platform: "Wix",       icon: "🎨", steps: "Settings → Custom Code → Body mein add karo" },
                    ].map((p) => (
                      <div key={p.platform} className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <p className="text-xl mb-2">{p.icon}</p>
                        <p className="text-white font-medium mb-1">{p.platform}</p>
                        <p className="text-zinc-500 text-xs">{p.steps}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </section>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-8 text-center"
            >
              <Zap className="w-8 h-8 text-blue-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Ready ho? Agent banao!</h3>
              <p className="text-zinc-400 mb-6">5 minute mein pehla AI agent deploy karo — free plan se shuru karo.</p>
              <Link href="/Agent"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium transition-all">
                <Bot className="w-5 h-5" />
                Create Your First Agent →
              </Link>
            </motion.div>

          </div>
        </div>
      </div>
    </main>
  );
}

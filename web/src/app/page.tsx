'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Bot, Zap, BarChart3, Mic, ArrowRight, Shield, Globe, Cpu } from 'lucide-react'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-dark-900 grid-bg overflow-hidden">
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-500/15 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay:'2s'}} />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">OmniBot<span className="text-brand-400"> AI</span></span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-sm text-slate-400 hover:text-white transition-colors">Dashboard</Link>
          <Link href="/chat" className="btn-glow px-5 py-2 rounded-xl text-sm font-semibold text-white">
            Launch Chat
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center text-center pt-24 pb-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-500/30 bg-brand-600/10 text-brand-300 text-sm font-medium mb-8">
            <Zap className="w-4 h-4" />
            FlowZint AI Hackathon 2026 — Multi-Agent Intelligence
          </span>

          <h1 className="font-display text-6xl md:text-8xl font-black tracking-tight leading-none mb-6">
            One Bot.<br />
            <span className="gradient-text">Every Conversation.</span>
          </h1>

          <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            OmniBot AI unifies Sales, Support, and Customer Care into a single intelligent platform
            — powered by multi-agent orchestration, real-time sentiment analysis, and RAG.
          </p>

          <div className="flex items-center gap-4 justify-center flex-wrap">
            <Link href="/chat" className="btn-glow px-8 py-4 rounded-2xl font-display font-bold text-lg text-white flex items-center gap-2">
              Start Chatting <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/dashboard" className="px-8 py-4 rounded-2xl font-display font-bold text-lg text-slate-300 border border-white/10 hover:border-brand-500/50 transition-colors flex items-center gap-2">
              <BarChart3 className="w-5 h-5" /> View Dashboard
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 w-full max-w-4xl"
        >
          {[
            { value: '87.3%', label: 'Resolution Rate' },
            { value: '3', label: 'Specialized Agents' },
            { value: '<400ms', label: 'Avg Response' },
            { value: '₹3L', label: 'Prize Pool' },
          ].map((stat, i) => (
            <div key={i} className="glass p-6 text-center">
              <div className="font-display text-3xl font-black text-brand-400 mb-1">{stat.value}</div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Bot, title: 'Multi-Agent System', desc: 'LangGraph orchestrates Sales, Support, and Care agents with intelligent routing and auto-escalation.', color: 'text-brand-400' },
            { icon: Cpu, title: 'Real-Time Sentiment', desc: 'Fine-tuned RoBERTa model analyzes every message for sentiment and emotion, adapting bot tone dynamically.', color: 'text-accent-400' },
            { icon: Globe, title: 'RAG Knowledge Base', desc: 'ChromaDB + FAISS powered retrieval gives every agent factual, context-aware answers from your docs.', color: 'text-warn-400' },
            { icon: Mic, title: 'Voice Interface', desc: 'OpenAI Whisper enables hands-free voice input across web and mobile — transcribed in real time.', color: 'text-danger-400' },
            { icon: BarChart3, title: 'Live Analytics', desc: 'Full dashboard with sentiment trends, resolution rates, escalation metrics, and bot performance.', color: 'text-brand-300' },
            { icon: Shield, title: 'Auto-Escalation', desc: 'Detects extreme frustration or critical urgency and instantly escalates with full conversation summary.', color: 'text-accent-500' },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="glass p-6 hover:border-brand-500/40 transition-all duration-300 group"
            >
              <f.icon className={`w-8 h-8 ${f.color} mb-4 group-hover:scale-110 transition-transform`} />
              <h3 className="font-display font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-6 px-8 flex items-center justify-between text-sm text-slate-600">
        <span>OmniBot AI — FlowZint AI Hackathon 2026</span>
        <span>Built with Next.js + FastAPI + LangGraph</span>
      </footer>
    </main>
  )
}

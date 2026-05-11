'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { ArrowLeft, TrendingUp, MessageCircle, Zap, AlertTriangle, CheckCircle } from 'lucide-react'
import Link from 'next/link'

// Mock analytics data (replace with API call)
const sentimentTrend = [
  { date: 'May 4', positive: 58, neutral: 28, negative: 14 },
  { date: 'May 5', positive: 62, neutral: 25, negative: 13 },
  { date: 'May 6', positive: 55, neutral: 30, negative: 15 },
  { date: 'May 7', positive: 67, neutral: 22, negative: 11 },
  { date: 'May 8', positive: 61, neutral: 27, negative: 12 },
  { date: 'May 9', positive: 70, neutral: 20, negative: 10 },
  { date: 'May 10', positive: 65, neutral: 24, negative: 11 },
]

const hourlyVolume = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i.toString().padStart(2,'0')}:00`,
  count: Math.floor(20 + Math.random() * 100),
}))

const intentData = [
  { name: 'Support', value: 41.2, color: '#5c6fff' },
  { name: 'Care', value: 30.5, color: '#10b981' },
  { name: 'Sales', value: 28.3, color: '#f59e0b' },
]

const topIssues = [
  { issue: 'Password reset', count: 143 },
  { issue: 'Billing inquiry', count: 98 },
  { issue: 'API integration', count: 76 },
  { issue: 'Feature request', count: 54 },
  { issue: 'Account upgrade', count: 43 },
]

const botPerformance = [
  { name: 'Sales', resolved: 91, escalated: 9, confidence: 84 },
  { name: 'Support', resolved: 88, escalated: 12, confidence: 79 },
  { name: 'Care', resolved: 85, escalated: 15, confidence: 81 },
]

const STATS = [
  { label: 'Total Conversations', value: '1,247', icon: MessageCircle, color: 'text-brand-400', bg: 'bg-brand-600/10' },
  { label: 'Resolution Rate', value: '87.3%', icon: CheckCircle, color: 'text-accent-400', bg: 'bg-accent-500/10' },
  { label: 'Avg Response', value: '342ms', icon: Zap, color: 'text-warn-400', bg: 'bg-warn-500/10' },
  { label: 'Escalation Rate', value: '4.2%', icon: AlertTriangle, color: 'text-danger-400', bg: 'bg-danger-500/10' },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass px-3 py-2 text-xs">
      <p className="font-semibold text-white mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <div className="min-h-screen bg-dark-900 grid-bg">
      {/* Header */}
      <div className="border-b border-white/5 bg-dark-800/80 backdrop-blur-xl px-6 py-4 flex items-center gap-4">
        <Link href="/" className="text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-display font-black text-xl">Analytics Dashboard</h1>
          <p className="text-xs text-slate-500">Real-time multi-agent performance insights</p>
        </div>
        <div className="ml-auto flex items-center gap-2 text-xs text-accent-400">
          <div className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" />
          Live data
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08 }}
              className="glass p-5"
            >
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div className={`font-display text-3xl font-black ${s.color} mb-1`}>{s.value}</div>
              <div className="text-xs text-slate-500">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Sentiment Trend + Intent Pie */}
        <div className="grid md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0 }} animate={mounted ? { opacity: 1 } : {}} transition={{ delay: 0.3 }}
            className="glass p-6 md:col-span-2"
          >
            <h2 className="font-display font-bold mb-4 text-sm text-slate-300">Sentiment Trend (7 days)</h2>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={sentimentTrend}>
                <defs>
                  <linearGradient id="gPos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="gNeg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="positive" name="Positive" stroke="#10b981" fill="url(#gPos)" strokeWidth={2} />
                <Area type="monotone" dataKey="neutral" name="Neutral" stroke="#94a3b8" fill="none" strokeWidth={1.5} strokeDasharray="4 4" />
                <Area type="monotone" dataKey="negative" name="Negative" stroke="#ef4444" fill="url(#gNeg)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} animate={mounted ? { opacity: 1 } : {}} transition={{ delay: 0.4 }}
            className="glass p-6"
          >
            <h2 className="font-display font-bold mb-4 text-sm text-slate-300">Intent Distribution</h2>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={intentData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" strokeWidth={0}>
                  {intentData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {intentData.map((d, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                    <span className="text-slate-400">{d.name}</span>
                  </div>
                  <span className="font-semibold text-white">{d.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Hourly Volume + Bot Performance + Top Issues */}
        <div className="grid md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0 }} animate={mounted ? { opacity: 1 } : {}} transition={{ delay: 0.5 }}
            className="glass p-6 md:col-span-2"
          >
            <h2 className="font-display font-bold mb-4 text-sm text-slate-300">Hourly Conversation Volume</h2>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={hourlyVolume.filter((_, i) => i % 2 === 0)}>
                <XAxis dataKey="hour" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Conversations" fill="#5c6fff" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} animate={mounted ? { opacity: 1 } : {}} transition={{ delay: 0.6 }}
            className="glass p-6"
          >
            <h2 className="font-display font-bold mb-4 text-sm text-slate-300">Top Issues</h2>
            <div className="space-y-3">
              {topIssues.map((issue, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 truncate flex-1">{issue.issue}</span>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    <div className="w-16 h-1.5 bg-dark-500 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-500 rounded-full"
                        style={{ width: `${(issue.count / 143) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-slate-300 w-8 text-right">{issue.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bot Performance */}
        <motion.div
          initial={{ opacity: 0 }} animate={mounted ? { opacity: 1 } : {}} transition={{ delay: 0.7 }}
          className="glass p-6"
        >
          <h2 className="font-display font-bold mb-4 text-sm text-slate-300">Agent Performance</h2>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={botPerformance} layout="vertical">
              <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0,100]} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#e2e8f0', fontSize: 12 }} axisLine={false} tickLine={false} width={60} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="resolved" name="Resolved %" fill="#10b981" radius={[0,4,4,0]} />
              <Bar dataKey="confidence" name="Confidence %" fill="#5c6fff" radius={[0,4,4,0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  )
}

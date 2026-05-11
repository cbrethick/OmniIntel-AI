'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Mic, MicOff, Bot, User, ArrowLeft, Zap, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import axios from 'axios'
import toast from 'react-hot-toast'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface Message {
  id: string
  role: 'user' | 'bot'
  content: string
  intent?: string
  sentiment?: { label: string; score: number; emotion?: string }
  confidence?: number
  bot_type?: string
  escalated?: boolean
  timestamp: Date
}

const BOT_COLORS: Record<string, string> = {
  sales: 'text-warn-400',
  support: 'text-brand-400',
  care: 'text-accent-400',
  escalation: 'text-danger-400',
}

const BOT_LABELS: Record<string, string> = {
  sales: '💼 Sales Agent',
  support: '🛠️ Support Agent',
  care: '💚 Care Agent',
  escalation: '🚨 Escalation Agent',
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'bot',
      content: "Hi! I'm OmniBot AI 👋 I can help you with sales, technical support, or customer care. What brings you here today?",
      bot_type: 'care',
      timestamp: new Date(),
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId] = useState(() => crypto.randomUUID())
  const [isRecording, setIsRecording] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || loading) return
    const userMsg: Message = {
      id: crypto.randomUUID(), role: 'user', content: text, timestamp: new Date()
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const { data } = await axios.post(`${API_URL}/api/chat/message`, {
        message: text, session_id: sessionId
      })
      const botMsg: Message = {
        id: crypto.randomUUID(),
        role: 'bot',
        content: data.response,
        intent: data.intent,
        sentiment: data.sentiment,
        confidence: data.confidence,
        bot_type: data.bot_type,
        escalated: data.escalated,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, botMsg])
      if (data.escalated) toast('🚨 Escalated to human specialist', { icon: '⚠️' })
    } catch (e) {
      // Demo mode fallback
      const demoResponses: Record<string, string> = {
        default: "Thanks for reaching out! I'm here to help with sales inquiries, technical support, or customer care. How can I assist you today?",
      }
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(), role: 'bot',
        content: demoResponses.default, bot_type: 'care', timestamp: new Date()
      }])
    } finally {
      setLoading(false)
    }
  }, [loading, sessionId])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) }
  }

  const toggleRecording = async () => {
    if (isRecording && mediaRecorder) {
      mediaRecorder.stop()
      setIsRecording(false)
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const chunks: Blob[] = []
      recorder.ondataavailable = e => chunks.push(e.data)
      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' })
        const formData = new FormData()
        formData.append('audio', blob, 'recording.webm')
        try {
          const { data } = await axios.post(`${API_URL}/api/voice/transcribe`, formData)
          if (data.text) { setInput(data.text); inputRef.current?.focus() }
        } catch { toast.error('Voice transcription unavailable in demo') }
        stream.getTracks().forEach(t => t.stop())
      }
      recorder.start()
      setMediaRecorder(recorder)
      setIsRecording(true)
    } catch { toast.error('Microphone access denied') }
  }

  return (
    <div className="flex flex-col h-screen bg-dark-900">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-white/5 bg-dark-800/80 backdrop-blur-xl">
        <Link href="/" className="text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-display font-bold text-sm">OmniBot AI</h1>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" />
            <span className="text-xs text-slate-500">Online — Multi-Agent Active</span>
          </div>
        </div>
        <div className="ml-auto flex gap-2">
          {['Sales', 'Support', 'Care'].map(t => (
            <span key={t} className="text-xs px-2.5 py-1 rounded-full border border-white/10 text-slate-500">{t}</span>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'bot' && (
                <div className="w-8 h-8 rounded-lg bg-dark-600 border border-brand-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-brand-400" />
                </div>
              )}
              <div className={`max-w-[75%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                {msg.role === 'bot' && msg.bot_type && (
                  <span className={`text-xs font-medium ${BOT_COLORS[msg.bot_type] || 'text-slate-500'}`}>
                    {BOT_LABELS[msg.bot_type] || msg.bot_type}
                  </span>
                )}
                <div className={`px-4 py-3 text-sm leading-relaxed ${msg.role === 'user' ? 'chat-user text-white' : 'chat-bot text-slate-200'}`}>
                  {msg.content}
                </div>
                {msg.escalated && (
                  <div className="flex items-center gap-1.5 text-xs text-danger-400">
                    <AlertTriangle className="w-3 h-3" />
                    Escalated to human agent
                  </div>
                )}
                {msg.sentiment && (
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <span className={
                      msg.sentiment.label === 'POSITIVE' ? 'sentiment-positive' :
                      msg.sentiment.label === 'NEGATIVE' ? 'sentiment-negative' :
                      'sentiment-neutral'
                    }>
                      {msg.sentiment.label.toLowerCase()}
                    </span>
                    {msg.confidence && <span>· {Math.round(msg.confidence * 100)}% confidence</span>}
                  </div>
                )}
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-brand-700 flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-lg bg-dark-600 border border-brand-500/20 flex items-center justify-center">
              <Bot className="w-4 h-4 text-brand-400" />
            </div>
            <div className="chat-bot px-4 py-3 flex gap-1.5 items-center">
              <div className="typing-dot" />
              <div className="typing-dot" />
              <div className="typing-dot" />
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 pb-6 pt-3 border-t border-white/5 bg-dark-800/60 backdrop-blur-xl">
        <div className="flex items-end gap-3 glass px-4 py-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about sales, support, or customer care..."
            rows={1}
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-600 resize-none outline-none leading-relaxed max-h-32 overflow-y-auto"
            style={{ minHeight: '24px' }}
          />
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={toggleRecording}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${isRecording ? 'bg-danger-500 animate-pulse' : 'bg-dark-500 hover:bg-dark-400 text-slate-400 hover:text-white'}`}
            >
              {isRecording ? <MicOff className="w-4 h-4 text-white" /> : <Mic className="w-4 h-4" />}
            </button>
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              className="w-9 h-9 rounded-xl btn-glow flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
        <p className="text-center text-xs text-slate-700 mt-2">
          <Zap className="w-3 h-3 inline mr-1" />
          Powered by LangGraph · GPT-4o · RoBERTa · Whisper
        </p>
      </div>
    </div>
  )
}

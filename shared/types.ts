// Shared TypeScript types for OmniBot AI

export type Intent = 'sales' | 'support' | 'care' | 'escalation'

export type SentimentLabel = 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL'

export interface Sentiment {
  label: SentimentLabel
  score: number
  emotion?: string
  urgency?: boolean
}

export interface Message {
  id: string
  role: 'user' | 'bot'
  content: string
  intent?: Intent
  sentiment?: Sentiment
  confidence?: number
  bot_type?: Intent
  escalated?: boolean
  timestamp: Date
}

export interface ChatRequest {
  message: string
  session_id?: string
}

export interface ChatResponse {
  response: string
  session_id: string
  intent: Intent
  sentiment: Sentiment
  confidence: number
  bot_type: Intent
  escalated: boolean
}

export interface AnalyticsDashboard {
  total_conversations: number
  resolution_rate: number
  avg_response_time_ms: number
  escalation_rate: number
  sentiment_breakdown: Record<string, number>
  intent_breakdown: Record<string, number>
  hourly_volume: Array<{ hour: string; count: number }>
  top_issues: Array<{ issue: string; count: number }>
  bot_performance: Record<string, {
    resolved: number
    escalated: number
    avg_confidence: number
  }>
}

export interface KnowledgeDocument {
  content: string
  domain: 'sales' | 'support' | 'care' | 'general'
  metadata?: Record<string, string>
}

export interface TranscriptionResult {
  text: string
  language: string
  confidence: number
}

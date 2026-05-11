import axios from 'axios'

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

export interface ChatResponse {
  response: string
  session_id: string
  intent: string
  sentiment: { label: string; score: number; emotion?: string }
  confidence: number
  bot_type: string
  escalated: boolean
}

export const sendMessage = async (
  message: string,
  sessionId: string
): Promise<ChatResponse> => {
  const { data } = await api.post('/api/chat/message', {
    message, session_id: sessionId
  })
  return data
}

export const transcribeAudio = async (uri: string): Promise<{ text: string }> => {
  const formData = new FormData()
  formData.append('audio', { uri, type: 'audio/m4a', name: 'recording.m4a' } as any)
  const { data } = await api.post('/api/voice/transcribe', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export const getAnalytics = async () => {
  const { data } = await api.get('/api/analytics/dashboard')
  return data
}

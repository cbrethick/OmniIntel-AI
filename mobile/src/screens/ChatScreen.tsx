import React, { useState, useRef, useCallback } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator,
  Vibration, StatusBar,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Audio } from 'expo-av'
import * as Haptics from 'expo-haptics'
import { Colors, Spacing, Radius } from '../theme'
import { sendMessage, transcribeAudio, ChatResponse } from '../services/api'

interface Message {
  id: string
  role: 'user' | 'bot'
  content: string
  bot_type?: string
  sentiment?: { label: string; score: number }
  confidence?: number
  escalated?: boolean
  timestamp: Date
}

const BOT_COLOR: Record<string, string> = {
  sales: '#f59e0b',
  support: '#5c6fff',
  care: '#10b981',
  escalation: '#ef4444',
}

const BOT_LABEL: Record<string, string> = {
  sales: '💼 Sales',
  support: '🛠️ Support',
  care: '💚 Care',
  escalation: '🚨 Escalation',
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([{
    id: '0', role: 'bot',
    content: "Hi! I'm OmniBot AI 👋\nAsk me anything about sales, support, or customer care.",
    bot_type: 'care', timestamp: new Date()
  }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recording, setRecording] = useState<Audio.Recording | null>(null)
  const [sessionId] = useState(() => Math.random().toString(36).substr(2, 9))
  const flatListRef = useRef<FlatList>(null)

  const send = useCallback(async (text: string) => {
    if (!text.trim() || loading) return
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)

    const userMsg: Message = {
      id: Date.now().toString(), role: 'user',
      content: text, timestamp: new Date()
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await sendMessage(text, sessionId)
      const botMsg: Message = {
        id: (Date.now() + 1).toString(), role: 'bot',
        content: res.response, bot_type: res.bot_type,
        sentiment: res.sentiment, confidence: res.confidence,
        escalated: res.escalated, timestamp: new Date()
      }
      setMessages(prev => [...prev, botMsg])
      if (res.escalated) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(), role: 'bot',
        content: "I'm having trouble connecting. Please check your connection and try again.",
        bot_type: 'care', timestamp: new Date()
      }])
    } finally {
      setLoading(false)
    }
  }, [loading, sessionId])

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync()
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true })
      const { recording: rec } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      )
      setRecording(rec)
      setIsRecording(true)
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    } catch (e) { console.error(e) }
  }

  const stopRecording = async () => {
    if (!recording) return
    setIsRecording(false)
    await recording.stopAndUnloadAsync()
    const uri = recording.getURI()
    setRecording(null)
    if (uri) {
      try {
        const result = await transcribeAudio(uri)
        if (result.text) { setInput(result.text) }
      } catch { /* voice not available in demo */ }
    }
  }

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[styles.msgRow, item.role === 'user' && styles.msgRowUser]}>
      {item.role === 'bot' && (
        <View style={styles.avatar}>
          <Ionicons name="hardware-chip" size={14} color={Colors.brand} />
        </View>
      )}
      <View style={[styles.bubble, item.role === 'user' ? styles.bubbleUser : styles.bubbleBot]}>
        {item.role === 'bot' && item.bot_type && (
          <Text style={[styles.agentLabel, { color: BOT_COLOR[item.bot_type] || Colors.brand }]}>
            {BOT_LABEL[item.bot_type] || item.bot_type}
          </Text>
        )}
        <Text style={[styles.msgText, item.role === 'user' && { color: '#fff' }]}>
          {item.content}
        </Text>
        {item.escalated && (
          <View style={styles.escalatedBadge}>
            <Ionicons name="warning" size={10} color={Colors.danger} />
            <Text style={styles.escalatedText}>Escalated to specialist</Text>
          </View>
        )}
        {item.sentiment && (
          <Text style={[styles.sentimentText, {
            color: item.sentiment.label === 'POSITIVE' ? Colors.accent :
                   item.sentiment.label === 'NEGATIVE' ? Colors.danger : Colors.textMuted
          }]}>
            {item.sentiment.label.toLowerCase()}
            {item.confidence ? ` · ${Math.round(item.confidence * 100)}%` : ''}
          </Text>
        )}
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerBot}>
          <View style={styles.headerIcon}>
            <Ionicons name="hardware-chip" size={18} color="#fff" />
          </View>
          <View>
            <Text style={styles.headerTitle}>OmniBot AI</Text>
            <View style={styles.statusRow}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Online — 3 agents active</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.list}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {loading && (
        <View style={styles.typing}>
          <View style={styles.avatar}>
            <Ionicons name="hardware-chip" size={14} color={Colors.brand} />
          </View>
          <View style={styles.typingBubble}>
            <ActivityIndicator size="small" color={Colors.brand} />
          </View>
        </View>
      )}

      {/* Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Ask about sales, support, care..."
            placeholderTextColor={Colors.textMuted}
            multiline
            maxLength={1000}
            returnKeyType="send"
            onSubmitEditing={() => send(input)}
          />
          <TouchableOpacity
            style={[styles.micBtn, isRecording && styles.micBtnActive]}
            onPressIn={startRecording}
            onPressOut={stopRecording}
          >
            <Ionicons name={isRecording ? 'mic' : 'mic-outline'} size={18}
              color={isRecording ? '#fff' : Colors.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sendBtn, (!input.trim() || loading) && styles.sendBtnDisabled]}
            onPress={() => send(input)}
            disabled={!input.trim() || loading}
          >
            <Ionicons name="send" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.md, paddingTop: 56, paddingBottom: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
    backgroundColor: Colors.surface2,
  },
  headerBot: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerIcon: {
    width: 38, height: 38, borderRadius: Radius.md,
    backgroundColor: Colors.brand, alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { color: Colors.text, fontWeight: '700', fontSize: 16 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  statusDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.accent },
  statusText: { color: Colors.textMuted, fontSize: 11 },
  list: { padding: Spacing.md, gap: 12 },
  msgRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  msgRowUser: { flexDirection: 'row-reverse' },
  avatar: {
    width: 30, height: 30, borderRadius: Radius.sm,
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  bubble: { maxWidth: '78%', borderRadius: Radius.lg, padding: Spacing.md },
  bubbleUser: {
    backgroundColor: Colors.brand,
    borderBottomRightRadius: Radius.xs || 4,
  },
  bubbleBot: {
    backgroundColor: Colors.surface,
    borderWidth: 1, borderColor: Colors.border,
    borderBottomLeftRadius: Radius.xs || 4,
  },
  agentLabel: { fontSize: 10, fontWeight: '700', marginBottom: 4 },
  msgText: { color: Colors.text, fontSize: 14, lineHeight: 20 },
  sentimentText: { fontSize: 10, marginTop: 4 },
  escalatedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6,
    paddingHorizontal: 8, paddingVertical: 3,
    backgroundColor: 'rgba(239,68,68,0.1)', borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  escalatedText: { color: Colors.danger, fontSize: 10 },
  typing: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: Spacing.md, paddingBottom: 8,
  },
  typingBubble: {
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border,
    borderRadius: Radius.md, padding: Spacing.md,
  },
  inputRow: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 8,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    paddingBottom: Platform.OS === 'ios' ? 28 : Spacing.md,
    borderTopWidth: 1, borderTopColor: Colors.borderLight,
    backgroundColor: Colors.surface2,
  },
  input: {
    flex: 1, backgroundColor: Colors.surface, borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md, paddingVertical: 10,
    color: Colors.text, fontSize: 14, maxHeight: 100,
    borderWidth: 1, borderColor: Colors.border,
  },
  micBtn: {
    width: 42, height: 42, borderRadius: Radius.md,
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  micBtnActive: { backgroundColor: Colors.danger },
  sendBtn: {
    width: 42, height: 42, borderRadius: Radius.md,
    backgroundColor: Colors.brand,
    alignItems: 'center', justifyContent: 'center',
  },
  sendBtnDisabled: { opacity: 0.4 },
})

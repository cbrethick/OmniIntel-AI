import React from 'react'
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet, StatusBar, Linking
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Colors, Spacing, Radius } from '../theme'

const FEATURES = [
  { icon: 'git-network', label: 'Multi-Agent', desc: 'Sales, Support & Care agents with LangGraph routing', color: Colors.brand },
  { icon: 'pulse', label: 'Sentiment AI', desc: 'Real-time emotion detection with fine-tuned RoBERTa', color: Colors.accent },
  { icon: 'library', label: 'RAG Powered', desc: 'ChromaDB + FAISS knowledge retrieval', color: '#f59e0b' },
  { icon: 'mic', label: 'Voice Input', desc: 'OpenAI Whisper speech-to-text', color: Colors.danger },
  { icon: 'bar-chart', label: 'Live Analytics', desc: 'Full sentiment and performance dashboard', color: '#a78bfa' },
  { icon: 'shield-checkmark', label: 'Auto Escalation', desc: 'Smart escalation with full conversation summary', color: Colors.accent },
]

interface Props {
  onNavigateChat: () => void
  onNavigateAnalytics: () => void
}

export default function HomeScreen({ onNavigateChat, onNavigateAnalytics }: Props) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logo}>
            <Ionicons name="hardware-chip" size={20} color="#fff" />
          </View>
          <Text style={styles.logoText}>OmniBot <Text style={{ color: Colors.brand }}>AI</Text></Text>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.badge}>
            <Ionicons name="flash" size={12} color={Colors.brand} />
            <Text style={styles.badgeText}>FlowZint AI Hackathon 2026</Text>
          </View>
          <Text style={styles.heroTitle}>One Bot.{'\n'}Every{'\n'}Conversation.</Text>
          <Text style={styles.heroSub}>
            Multi-agent AI platform combining Sales, Support, and Customer Care with real-time sentiment intelligence.
          </Text>
        </View>

        {/* CTA Buttons */}
        <View style={styles.ctaRow}>
          <TouchableOpacity style={styles.ctaPrimary} onPress={onNavigateChat}>
            <Ionicons name="chatbubbles" size={18} color="#fff" />
            <Text style={styles.ctaPrimaryText}>Start Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ctaSecondary} onPress={onNavigateAnalytics}>
            <Ionicons name="bar-chart" size={18} color={Colors.brand} />
            <Text style={styles.ctaSecondaryText}>Dashboard</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { value: '87.3%', label: 'Resolution' },
            { value: '3', label: 'Agents' },
            { value: '<400ms', label: 'Response' },
          ].map((s, i) => (
            <View key={i} style={styles.statItem}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Features */}
        <Text style={styles.sectionTitle}>Core Capabilities</Text>
        <View style={styles.featureGrid}>
          {FEATURES.map((f, i) => (
            <View key={i} style={styles.featureCard}>
              <View style={[styles.featureIcon, { backgroundColor: f.color + '20' }]}>
                <Ionicons name={f.icon as any} size={20} color={f.color} />
              </View>
              <Text style={styles.featureName}>{f.label}</Text>
              <Text style={styles.featureDesc}>{f.desc}</Text>
            </View>
          ))}
        </View>

        {/* Tech Stack */}
        <View style={styles.techCard}>
          <Text style={styles.cardTitle}>Tech Stack</Text>
          {[
            ['LLM', 'GPT-4o / Gemini 1.5'],
            ['Orchestration', 'LangGraph + LangChain'],
            ['Vector DB', 'ChromaDB + FAISS'],
            ['Sentiment', 'Fine-tuned RoBERTa'],
            ['Voice', 'OpenAI Whisper'],
            ['Backend', 'FastAPI + Python 3.11'],
            ['Web', 'Next.js 14 + TypeScript'],
            ['Mobile', 'React Native + Expo'],
          ].map(([k, v], i) => (
            <View key={i} style={styles.techRow}>
              <Text style={styles.techKey}>{k}</Text>
              <Text style={styles.techVal}>{v}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.footer}>OmniBot AI · FlowZint Hackathon 2026</Text>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { padding: Spacing.md, paddingBottom: 40 },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingTop: 48, paddingBottom: Spacing.xl,
  },
  logo: {
    width: 38, height: 38, borderRadius: Radius.md,
    backgroundColor: Colors.brand, alignItems: 'center', justifyContent: 'center',
  },
  logoText: { color: Colors.text, fontSize: 22, fontWeight: '800' },
  hero: { marginBottom: Spacing.xl },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.border,
    backgroundColor: Colors.brand + '15', marginBottom: Spacing.md,
  },
  badgeText: { color: Colors.brand, fontSize: 11, fontWeight: '600' },
  heroTitle: {
    color: Colors.text, fontSize: 48, fontWeight: '900', lineHeight: 52, marginBottom: 12,
  },
  heroSub: { color: Colors.textMuted, fontSize: 15, lineHeight: 22 },
  ctaRow: { flexDirection: 'row', gap: 10, marginBottom: Spacing.xl },
  ctaPrimary: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, backgroundColor: Colors.brand, borderRadius: Radius.lg, paddingVertical: 14,
  },
  ctaPrimaryText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  ctaSecondary: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, borderRadius: Radius.lg, paddingVertical: 14,
    borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surface,
  },
  ctaSecondaryText: { color: Colors.brand, fontWeight: '700', fontSize: 15 },
  statsRow: {
    flexDirection: 'row', backgroundColor: Colors.surface, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.xl,
    overflow: 'hidden',
  },
  statItem: { flex: 1, alignItems: 'center', paddingVertical: Spacing.md },
  statValue: { color: Colors.brand, fontSize: 22, fontWeight: '900' },
  statLabel: { color: Colors.textMuted, fontSize: 11 },
  sectionTitle: { color: Colors.text, fontSize: 16, fontWeight: '800', marginBottom: Spacing.md },
  featureGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: Spacing.xl },
  featureCard: {
    width: '48%', backgroundColor: Colors.surface, borderRadius: Radius.lg,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.border,
  },
  featureIcon: {
    width: 36, height: 36, borderRadius: Radius.md,
    alignItems: 'center', justifyContent: 'center', marginBottom: 8,
  },
  featureName: { color: Colors.text, fontWeight: '700', fontSize: 13, marginBottom: 4 },
  featureDesc: { color: Colors.textMuted, fontSize: 11, lineHeight: 16 },
  techCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.md,
    borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.xl, gap: 10,
  },
  cardTitle: { color: Colors.text, fontSize: 14, fontWeight: '700', marginBottom: 4 },
  techRow: { flexDirection: 'row', justifyContent: 'space-between' },
  techKey: { color: Colors.textMuted, fontSize: 12 },
  techVal: { color: Colors.text, fontSize: 12, fontWeight: '600' },
  footer: { color: Colors.textMuted, fontSize: 11, textAlign: 'center' },
})

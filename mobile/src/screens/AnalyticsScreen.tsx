import React, { useState, useEffect } from 'react'
import {
  View, Text, ScrollView, StyleSheet, StatusBar, ActivityIndicator
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Colors, Spacing, Radius } from '../theme'
import { getAnalytics } from '../services/api'

const STATS = [
  { label: 'Total Chats', key: 'total_conversations', icon: 'chatbubbles', color: Colors.brand },
  { label: 'Resolution', key: 'resolution_rate', icon: 'checkmark-circle', color: Colors.accent, suffix: '%' },
  { label: 'Avg Response', key: 'avg_response_time_ms', icon: 'flash', color: '#f59e0b', suffix: 'ms' },
  { label: 'Escalation', key: 'escalation_rate', icon: 'warning', color: Colors.danger, suffix: '%' },
]

export default function AnalyticsScreen() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAnalytics().then(setData).catch(() => setData({
      total_conversations: 1247,
      resolution_rate: 87.3,
      avg_response_time_ms: 342,
      escalation_rate: 4.2,
      sentiment_breakdown: { positive: 52.1, neutral: 31.4, negative: 16.5 },
      intent_breakdown: { sales: 28.3, support: 41.2, care: 30.5 },
      top_issues: [
        { issue: 'Password reset', count: 143 },
        { issue: 'Billing inquiry', count: 98 },
        { issue: 'API integration', count: 76 },
        { issue: 'Feature request', count: 54 },
        { issue: 'Account upgrade', count: 43 },
      ],
      bot_performance: {
        sales: { resolved: 91, escalated: 9, avg_confidence: 0.84 },
        support: { resolved: 88, escalated: 12, avg_confidence: 0.79 },
        care: { resolved: 85, escalated: 15, avg_confidence: 0.81 },
      },
    })).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
      <ActivityIndicator color={Colors.brand} size="large" />
    </View>
  )

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Analytics</Text>
        <View style={styles.liveRow}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>Live</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {STATS.map((s, i) => (
            <View key={i} style={styles.statCard}>
              <Ionicons name={s.icon as any} size={20} color={s.color} />
              <Text style={[styles.statValue, { color: s.color }]}>
                {data?.[s.key]}{s.suffix || ''}
              </Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Sentiment */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sentiment Breakdown</Text>
          {[
            { label: 'Positive', key: 'positive', color: Colors.accent },
            { label: 'Neutral', key: 'neutral', color: Colors.textMuted },
            { label: 'Negative', key: 'negative', color: Colors.danger },
          ].map((s, i) => (
            <View key={i} style={styles.barRow}>
              <Text style={styles.barLabel}>{s.label}</Text>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, {
                  width: `${data?.sentiment_breakdown?.[s.key] || 0}%`,
                  backgroundColor: s.color,
                }]} />
              </View>
              <Text style={[styles.barPct, { color: s.color }]}>
                {data?.sentiment_breakdown?.[s.key]}%
              </Text>
            </View>
          ))}
        </View>

        {/* Intent Distribution */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Intent Distribution</Text>
          {[
            { label: 'Support', key: 'support', color: Colors.brand },
            { label: 'Care', key: 'care', color: Colors.accent },
            { label: 'Sales', key: 'sales', color: '#f59e0b' },
          ].map((s, i) => (
            <View key={i} style={styles.barRow}>
              <Text style={styles.barLabel}>{s.label}</Text>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, {
                  width: `${data?.intent_breakdown?.[s.key] || 0}%`,
                  backgroundColor: s.color,
                }]} />
              </View>
              <Text style={[styles.barPct, { color: s.color }]}>
                {data?.intent_breakdown?.[s.key]}%
              </Text>
            </View>
          ))}
        </View>

        {/* Agent Performance */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Agent Performance</Text>
          {['sales', 'support', 'care'].map((agent, i) => {
            const perf = data?.bot_performance?.[agent]
            const agentColor = agent === 'sales' ? '#f59e0b' : agent === 'support' ? Colors.brand : Colors.accent
            return (
              <View key={i} style={styles.agentRow}>
                <Text style={[styles.agentName, { color: agentColor }]}>
                  {agent.charAt(0).toUpperCase() + agent.slice(1)}
                </Text>
                <View style={styles.agentStats}>
                  <View style={styles.agentStat}>
                    <Text style={styles.agentStatVal}>{perf?.resolved}%</Text>
                    <Text style={styles.agentStatLabel}>Resolved</Text>
                  </View>
                  <View style={styles.agentStat}>
                    <Text style={styles.agentStatVal}>{Math.round((perf?.avg_confidence || 0) * 100)}%</Text>
                    <Text style={styles.agentStatLabel}>Confidence</Text>
                  </View>
                  <View style={styles.agentStat}>
                    <Text style={[styles.agentStatVal, { color: Colors.danger }]}>{perf?.escalated}%</Text>
                    <Text style={styles.agentStatLabel}>Escalated</Text>
                  </View>
                </View>
              </View>
            )
          })}
        </View>

        {/* Top Issues */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Top Issues</Text>
          {data?.top_issues?.map((issue: any, i: number) => (
            <View key={i} style={styles.issueRow}>
              <Text style={styles.issueRank}>#{i + 1}</Text>
              <Text style={styles.issueText}>{issue.issue}</Text>
              <Text style={styles.issueCount}>{issue.count}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
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
  headerTitle: { color: Colors.text, fontSize: 20, fontWeight: '800' },
  liveRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.accent },
  liveText: { color: Colors.accent, fontSize: 12, fontWeight: '600' },
  scroll: { padding: Spacing.md, gap: 12, paddingBottom: 40 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statCard: {
    flex: 1, minWidth: '45%', backgroundColor: Colors.surface,
    borderRadius: Radius.lg, padding: Spacing.md, gap: 6,
    borderWidth: 1, borderColor: Colors.border,
  },
  statValue: { fontSize: 26, fontWeight: '900' },
  statLabel: { color: Colors.textMuted, fontSize: 11 },
  card: {
    backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.md,
    borderWidth: 1, borderColor: Colors.border, gap: 12,
  },
  cardTitle: { color: Colors.text, fontSize: 13, fontWeight: '700' },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  barLabel: { color: Colors.textMuted, fontSize: 12, width: 60 },
  barTrack: { flex: 1, height: 6, backgroundColor: Colors.surface3, borderRadius: 3, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 3 },
  barPct: { fontSize: 12, fontWeight: '700', width: 40, textAlign: 'right' },
  agentRow: { gap: 8 },
  agentName: { fontSize: 13, fontWeight: '700' },
  agentStats: { flexDirection: 'row', gap: 16 },
  agentStat: { gap: 2 },
  agentStatVal: { color: Colors.text, fontSize: 16, fontWeight: '800' },
  agentStatLabel: { color: Colors.textMuted, fontSize: 10 },
  issueRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  issueRank: { color: Colors.brand, fontWeight: '700', fontSize: 12, width: 24 },
  issueText: { flex: 1, color: Colors.textSubtle, fontSize: 13 },
  issueCount: { color: Colors.text, fontWeight: '700', fontSize: 13 },
})

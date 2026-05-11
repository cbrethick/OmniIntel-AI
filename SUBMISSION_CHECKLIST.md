# FlowZint AI Hackathon 2026 — Submission Checklist

## Project: OmniBot AI — Omni-Intelligence Customer Platform

---

## ✅ Pre-Submission Checklist

### Repository
- [ ] GitHub repo is set to **PUBLIC**
- [ ] README.md is complete and professional
- [ ] ARCHITECTURE.md included
- [ ] `.env.example` included (no real API keys committed!)
- [ ] `docker-compose.yml` works end-to-end

### Code Quality
- [ ] All Python files have docstrings
- [ ] TypeScript types defined in `shared/types.ts`
- [ ] Error handling in all API routes
- [ ] No hardcoded API keys in code

### Functionality (Demo Day Checklist)
- [ ] Web app loads on `localhost:3000`
- [ ] Chat sends messages and receives AI responses
- [ ] Intent is correctly classified (test sales/support/care queries)
- [ ] Sentiment label shows under bot messages
- [ ] Voice input works (mic → transcription → sends)
- [ ] Analytics dashboard loads with charts
- [ ] Escalation triggers on highly negative input
- [ ] Mobile app runs on Expo Go (iOS/Android)

### Demo Video (Required)
- [ ] Screen record full demo (3-5 minutes)
- [ ] Show: Sales query → bot responds as Sales Agent
- [ ] Show: Support query → step-by-step response
- [ ] Show: Negative complaint → escalation triggered
- [ ] Show: Voice input → transcription
- [ ] Show: Analytics dashboard with live charts
- [ ] Show: Mobile app on phone

---

## 📊 Evaluation Criteria — Score Maximization

### 1. Model Innovation & Novelty (30%)
✅ Multi-agent orchestration (not a single chatbot)
✅ Real-time sentiment adaptation
✅ LangGraph stateful agent graph
✅ Fine-tuned RoBERTa for emotion detection
✅ Whisper voice input

### 2. Real-World Applicability (25%)
✅ Solves Sales + Support + Care simultaneously
✅ RAG grounds answers in real knowledge base
✅ Auto-escalation for critical situations
✅ Both web and mobile clients

### 3. Technical Architecture (25%)
✅ Clean FastAPI backend with typed routes
✅ LangGraph for agent orchestration
✅ ChromaDB vector store
✅ Docker Compose for full-stack deployment
✅ WebSocket support for real-time chat

### 4. Documentation Clarity (20%)
✅ README with quick start instructions
✅ ARCHITECTURE.md with system diagram
✅ Inline code documentation
✅ API docs at `/docs` (FastAPI auto-generated)
✅ This submission checklist

---

## 🚀 Demo Script

**Opening (30s):**
> "OmniBot AI is not just a chatbot — it's a multi-agent intelligence platform that unifies Sales, Support, and Customer Care into one system, with real-time sentiment analysis and RAG-powered knowledge retrieval."

**Demo Flow (3 min):**
1. Ask: "What's the pricing for OmniBot?" → Sales Agent responds
2. Ask: "How do I reset my API key?" → Support Agent responds with steps
3. Ask: "I'm really frustrated, you charged me twice!" → Care Agent + auto-escalation
4. Voice input demo → mic → transcription → send
5. Switch to Analytics dashboard → show charts

**Closing (30s):**
> "Built with Next.js, FastAPI, LangGraph, RoBERTa, and Whisper — deployed with Docker. Available on both web and mobile."

---

## 📧 Submission
Portal: https://flowzint.in/2026/ai/hackothon/
Deadline: July 4, 2026

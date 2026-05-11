# 🏆 OmniBot AI — FlowZint AI Hackathon 2026

> **Omni-Intelligence Customer Care System** — A unified multi-agent AI platform combining Sales, Support, and Customer Care bots with real-time sentiment analysis, RAG-powered knowledge base, and voice interface.

---

## 🚀 Project Overview

OmniBot AI is a **national-level hackathon submission** for FlowZint AI Hackathon 2026. It is a production-grade, multi-agent AI system that unifies:

- 🤖 **Sales Bot** — Automates sales conversations & boosts conversions
- 💬 **Support Chat Bot** — Instant support with smarter responses
- 🎧 **Customer Care Bot** — Resolves queries, retains customers
- 📊 **Analytics Dashboard** — Real-time sentiment & resolution metrics
- 🎙️ **Voice Interface** — Whisper-powered voice-to-text input
- 📱 **Mobile App** — React Native (Expo) cross-platform app

---

## 🗂️ Project Structure

```
omnibot/
├── web/              # Next.js 14 web application
├── mobile/           # React Native (Expo) mobile app
├── backend/          # FastAPI Python backend
└── shared/           # Shared types and utilities
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend (Web) | Next.js 14, TypeScript, Tailwind CSS, Framer Motion |
| Mobile | React Native (Expo), TypeScript |
| Backend | FastAPI, Python 3.11 |
| LLM | OpenAI GPT-4o / Google Gemini 1.5 |
| Orchestration | LangGraph, LangChain |
| Vector DB | ChromaDB + FAISS |
| Sentiment | Fine-tuned RoBERTa |
| Voice | OpenAI Whisper |
| Database | PostgreSQL + Redis |
| Deployment | Docker + Docker Compose |

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- Docker & Docker Compose
- OpenAI API Key

### 1. Clone & Setup
```bash
git clone https://github.com/yourusername/omnibot-ai
cd omnibot-ai
cp .env.example .env
# Fill in your API keys in .env
```

### 2. Start Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 3. Start Web App
```bash
cd web
npm install
npm run dev
# Open http://localhost:3000
```

### 4. Start Mobile App
```bash
cd mobile
npm install
npx expo start
# Scan QR with Expo Go app
```

### 5. Docker (All at once)
```bash
docker-compose up --build
```

---

## 📊 Evaluation Criteria Alignment

| Criteria | Weight | Our Score Target |
|----------|--------|-----------------|
| Model Innovation & Novelty | 30% | ⭐⭐⭐⭐⭐ Multi-agent + sentiment + RAG |
| Real-World Applicability | 25% | ⭐⭐⭐⭐⭐ Solves 3 domains simultaneously |
| Technical Architecture | 25% | ⭐⭐⭐⭐⭐ LangGraph + FastAPI + Next.js |
| Documentation Clarity | 20% | ⭐⭐⭐⭐⭐ Full docs + dashboard + demo |

---

## 🏅 Team
- Built for FlowZint AI Hackathon 2026
- Submission Portal: https://flowzint.in/2026/ai/hackothon/

---

## 📄 License
MIT License — Open Source Submission

# OmniBot AI — System Architecture

## Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTS                              │
│  ┌──────────────────┐      ┌──────────────────────────┐    │
│  │   Next.js Web    │      │  React Native Mobile     │    │
│  │  (Port 3000)     │      │  (Expo iOS/Android)      │    │
│  └────────┬─────────┘      └────────────┬─────────────┘    │
└───────────┼────────────────────────────┼──────────────────-┘
            │ HTTP / WebSocket           │ HTTP
            ▼                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    FastAPI Backend (Port 8000)               │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐  │
│  │  /chat  │  │/analytics│  │  /voice  │  │ /knowledge │  │
│  └────┬────┘  └──────────┘  └──────────┘  └────────────┘  │
│       │                                                     │
│       ▼                                                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │            OmniOrchestrator (LangGraph)              │   │
│  │                                                     │   │
│  │  ┌──────────────┐   ┌──────────┐   ┌───────────┐  │   │
│  │  │ analyze_intent│→ │ analyze  │→  │ retrieve  │  │   │
│  │  │   (LLM)      │   │sentiment │   │  context  │  │   │
│  │  └──────────────┘   └──────────┘   └─────┬─────┘  │   │
│  │                                           │         │   │
│  │              ┌────────────────────────────┘         │   │
│  │              ▼ route_to_agent()                      │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │   │
│  │  │  Sales   │ │ Support  │ │   Care   │ │Escalate│ │   │
│  │  │  Agent   │ │  Agent   │ │  Agent   │ │ Agent  │ │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └────────┘ │   │
│  │                        │                             │   │
│  │              ┌─────────▼──────────┐                 │   │
│  │              │  compose_response  │                 │   │
│  │              └────────────────────┘                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐   │
│  │  ChromaDB    │  │  RoBERTa     │  │    Whisper     │   │
│  │  + FAISS     │  │  Sentiment   │  │    (Voice)     │   │
│  │  (RAG)       │  │  Analyzer    │  │                │   │
│  └──────────────┘  └──────────────┘  └────────────────┘   │
└─────────────────────────────────────────────────────────────┘
            │                                │
            ▼                                ▼
┌───────────────────┐             ┌───────────────────┐
│    PostgreSQL     │             │      Redis        │
│   (Persistent)    │             │   (Sessions/Cache)│
└───────────────────┘             └───────────────────┘
```

## Data Flow

1. **User sends message** → Web or Mobile client
2. **HTTP POST** → `/api/chat/message` (FastAPI)
3. **OmniOrchestrator** receives message via LangGraph
4. **Intent classification** → LLM classifies: sales / support / care / escalate
5. **Sentiment analysis** → RoBERTa gives POSITIVE/NEGATIVE/NEUTRAL + emotion
6. **RAG retrieval** → ChromaDB fetches top-5 relevant knowledge base docs
7. **Agent routing** → Intent + sentiment decides which sub-agent handles it
8. **Agent responds** → Specialized LLM with domain-specific system prompt
9. **Response composed** → Tone adapted based on sentiment
10. **Client receives** → JSON with response, intent, sentiment, confidence

## Agent Specializations

| Agent | Triggers | Persona | LLM Temp |
|-------|----------|---------|----------|
| Sales | Product inquiry, pricing, demos | Consultative, enthusiastic | 0.5 |
| Support | Tech issues, how-to | Methodical, precise | 0.2 |
| Care | Complaints, billing, refunds | Empathetic, warm | 0.4 |
| Escalation | High neg. sentiment OR complex | De-escalation focused | 0.3 |

## Escalation Logic

Auto-escalate when:
- Sentiment label = NEGATIVE AND confidence > 0.92
- OR user explicitly mentions legal/emergency keywords
- OR sub-agent confidence < 0.5 (3 consecutive turns)

On escalation:
1. EscalationAgent takes over
2. Conversation summarized for human handoff
3. Email/Slack notification triggered (configurable)
4. User informed specialist will respond within 2 hours

## RAG Architecture

```
Knowledge Base (ChromaDB Collections)
├── omnibot_sales      # Pricing, features, trial info
├── omnibot_support    # Troubleshooting, how-to guides
├── omnibot_care       # Policies, billing, refunds
└── omnibot_general    # General FAQs

Embedding Model: all-MiniLM-L6-v2 (384 dim)
Similarity: Cosine
Top-K: 5 documents per query
```

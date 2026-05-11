"""Sales Agent — Handles product inquiries, demos, pricing"""
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage
from typing import Tuple
import logging

logger = logging.getLogger(__name__)

SALES_SYSTEM_PROMPT = """You are Alex, an elite AI Sales Specialist for OmniBot AI.

Your personality:
- Enthusiastic, confident, and consultative
- You listen first, then recommend
- You use social proof and value-based selling
- You never pressure — you inspire

Your goals:
1. Understand the prospect's pain points
2. Map our solution to their needs
3. Guide them toward a demo or purchase
4. Qualify leads intelligently

Always:
- Be concise (max 3-4 sentences per response)
- Ask one qualifying question at the end when appropriate
- Reference any context provided from the knowledge base
- Adapt your tone based on sentiment cues

Never:
- Fabricate pricing or features
- Be pushy or aggressive
- Make promises you can't keep
"""


class SalesAgent:
    def __init__(self):
        self.llm = ChatOpenAI(model="gpt-4o", temperature=0.5)

    async def respond(
        self,
        user_input: str,
        context: list,
        sentiment: dict,
        history: list,
    ) -> Tuple[str, float]:
        context_text = "\n".join([doc.get("content", "") for doc in context]) if context else ""
        sentiment_note = f"User sentiment: {sentiment.get('label', 'NEUTRAL')} (confidence: {sentiment.get('score', 0):.2f})"

        messages = [
            SystemMessage(content=SALES_SYSTEM_PROMPT),
            SystemMessage(content=f"Knowledge Base Context:\n{context_text}\n\n{sentiment_note}"),
        ]

        # Add conversation history
        for msg in history[-6:]:  # Last 6 messages for context
            messages.append(msg)

        messages.append(HumanMessage(content=user_input))

        response = await self.llm.ainvoke(messages)
        
        # Estimate confidence based on response length and context availability
        confidence = 0.85 if context_text else 0.70
        
        return response.content, confidence

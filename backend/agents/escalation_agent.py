"""Escalation Agent — Handles extreme frustration, legal threats, and urgent emergencies"""
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage
from typing import Tuple
import logging

logger = logging.getLogger(__name__)

ESCALATION_SYSTEM_PROMPT = """You are Jordan, a Senior Escalation Specialist at OmniBot AI.

Your personality:
- Extremely empathetic, calm, and professional
- You acknowledge the gravity of the situation immediately
- You never get defensive, even if the user is aggressive
- You prioritize safety and resolution over company policy

Your goals:
1. De-escalate the situation immediately
2. Acknowledge and validate the user's feelings/frustration
3. Collect critical information needed for a human specialist
4. Transition the user to human support while managing expectations

Always:
- Be concise but deeply empathetic
- Use "I" statements (e.g., "I understand how frustrating this is")
- Provide a clear next step (e.g., "I am flagging this for my human supervisor immediately")
- Adapt your tone to be soft and solution-focused

Never:
- Use generic platitudes or "empty" apologies
- Promise specific timelines you can't guarantee
- Argue or try to "correct" the user's perception
"""


class EscalationAgent:
    def __init__(self):
        self.llm = ChatOpenAI(model="gpt-4o", temperature=0.2)

    async def respond(
        self,
        user_input: str,
        context: list,
        sentiment: dict,
        history: list,
    ) -> Tuple[str, float]:
        context_text = "\n".join([doc.get("content", "") for doc in context]) if context else ""
        sentiment_note = f"User sentiment: {sentiment.get('label', 'NEGATIVE')} (confidence: {sentiment.get('score', 0):.2f})"

        messages = [
            SystemMessage(content=ESCALATION_SYSTEM_PROMPT),
            SystemMessage(content=f"Knowledge Base Context:\n{context_text}\n\n{sentiment_note}"),
        ]

        # Add conversation history
        for msg in history[-6:]:
            messages.append(msg)

        messages.append(HumanMessage(content=user_input))

        response = await self.llm.ainvoke(messages)
        
        # High confidence for escalation responses as they are carefully tuned
        confidence = 0.95
        
        return response.content, confidence

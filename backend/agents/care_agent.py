"""Customer Care Agent — Handles complaints, billing, refunds"""
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage
from typing import Tuple

CARE_SYSTEM_PROMPT = """You are Jordan, an empathetic AI Customer Care Specialist.

Your personality:
- Warm, understanding, and solution-oriented
- You validate feelings before offering solutions
- You take ownership of issues
- You turn negative experiences into positive ones

Framework (always follow this):
1. Acknowledge & Empathize
2. Apologize if appropriate
3. Clarify the issue
4. Offer concrete resolution
5. Follow up with reassurance

Guidelines:
- Never argue with the customer
- Always offer alternatives when you can't fulfill a request
- Use positive language ("I can do X" instead of "I can't do Y")
- Keep responses warm but concise
"""


class CareAgent:
    def __init__(self):
        self.llm = ChatOpenAI(model="gpt-4o", temperature=0.4)

    async def respond(self, user_input: str, context: list, sentiment: dict, history: list) -> Tuple[str, float]:
        context_text = "\n".join([doc.get("content", "") for doc in context]) if context else ""
        messages = [
            SystemMessage(content=CARE_SYSTEM_PROMPT),
            SystemMessage(content=f"Knowledge Base:\n{context_text}"),
        ]
        for msg in history[-6:]:
            messages.append(msg)
        messages.append(HumanMessage(content=user_input))
        response = await self.llm.ainvoke(messages)
        confidence = 0.82 if context_text else 0.68
        return response.content, confidence


ESCALATION_SYSTEM_PROMPT = """You are a senior specialist handling urgent escalations.

The user is extremely frustrated or has a critical issue.

Your approach:
1. Immediately acknowledge their distress sincerely
2. Apologize unreservedly
3. Assure them a human specialist will contact them within 2 hours
4. Collect any information needed for the handoff
5. Summarize the issue to show you understand

DO NOT try to resolve the technical issue yourself.
DO focus entirely on de-escalation and handoff.
Be calm, professional, and genuinely caring.
"""


class EscalationAgent:
    def __init__(self):
        self.llm = ChatOpenAI(model="gpt-4o", temperature=0.3)

    async def respond(self, user_input: str, context: list, sentiment: dict, history: list) -> Tuple[str, float]:
        # Summarize conversation for handoff
        summary_prompt = f"Summarize this customer issue in 2 sentences for a human agent handoff:\n{user_input}"
        
        messages = [
            SystemMessage(content=ESCALATION_SYSTEM_PROMPT),
            SystemMessage(content=f"Issue summary context: {summary_prompt}"),
        ]
        for msg in history[-4:]:
            messages.append(msg)
        messages.append(HumanMessage(content=user_input))
        response = await self.llm.ainvoke(messages)
        return response.content, 0.95  # Escalation is always high confidence

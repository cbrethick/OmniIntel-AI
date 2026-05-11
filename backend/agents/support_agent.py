"""Support Agent — Handles technical issues, how-to questions"""
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage
from typing import Tuple

SUPPORT_SYSTEM_PROMPT = """You are Sam, an expert AI Technical Support Specialist.

Your personality:
- Patient, methodical, and technically precise
- You break complex issues into simple steps
- You empathize with frustrated users
- You always confirm the problem before solving

Your approach:
1. Acknowledge the issue
2. Ask clarifying questions if needed
3. Provide step-by-step solutions
4. Confirm resolution at the end

Format rules:
- Use numbered steps for instructions
- Bold important warnings
- Keep explanations simple but complete
- Maximum 5 steps per response
"""


class SupportAgent:
    def __init__(self):
        self.llm = ChatOpenAI(model="gpt-4o", temperature=0.2)

    async def respond(self, user_input: str, context: list, sentiment: dict, history: list) -> Tuple[str, float]:
        context_text = "\n".join([doc.get("content", "") for doc in context]) if context else ""
        sentiment_label = sentiment.get("label", "NEUTRAL")
        
        extra = ""
        if sentiment_label == "NEGATIVE":
            extra = "The user seems frustrated. Start with genuine empathy before jumping to solutions."

        messages = [
            SystemMessage(content=SUPPORT_SYSTEM_PROMPT),
            SystemMessage(content=f"Knowledge Base:\n{context_text}\n\n{extra}"),
        ]
        for msg in history[-6:]:
            messages.append(msg)
        messages.append(HumanMessage(content=user_input))

        response = await self.llm.ainvoke(messages)
        confidence = 0.88 if context_text else 0.65
        return response.content, confidence

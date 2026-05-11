"""
OmniBot AI — Multi-Agent Orchestrator
Uses LangGraph to route between specialized agents
"""
from typing import TypedDict, Annotated, Literal
from langgraph.graph import StateGraph, END
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
import operator
import logging

from agents.sales_agent import SalesAgent
from agents.support_agent import SupportAgent
from agents.care_agent import CareAgent
from agents.escalation_agent import EscalationAgent
from sentiment.analyzer import SentimentAnalyzer
from rag.retriever import RAGRetriever

logger = logging.getLogger(__name__)


class AgentState(TypedDict):
    messages: Annotated[list, operator.add]
    session_id: str
    user_input: str
    intent: str
    sentiment: dict
    agent_response: str
    confidence: float
    escalate: bool
    retrieved_docs: list
    bot_type: str


class OmniOrchestrator:
    """
    Master orchestrator that:
    1. Detects user intent (sales/support/care)
    2. Analyzes sentiment in real-time
    3. Routes to specialized sub-agents
    4. Handles escalation when confidence is low
    """

    def __init__(self):
        self.llm = ChatOpenAI(model="gpt-4o", temperature=0.3)
        self.sentiment_analyzer = SentimentAnalyzer()
        self.rag = RAGRetriever()
        self.sales_agent = SalesAgent()
        self.support_agent = SupportAgent()
        self.care_agent = CareAgent()
        self.escalation_agent = EscalationAgent()
        self.graph = self._build_graph()

    def _build_graph(self) -> StateGraph:
        graph = StateGraph(AgentState)

        # Add nodes
        graph.add_node("analyze_intent", self.analyze_intent)
        graph.add_node("analyze_sentiment", self.analyze_sentiment)
        graph.add_node("retrieve_context", self.retrieve_context)
        graph.add_node("sales_agent", self.run_sales_agent)
        graph.add_node("support_agent", self.run_support_agent)
        graph.add_node("care_agent", self.run_care_agent)
        graph.add_node("escalation_agent", self.run_escalation_agent)
        graph.add_node("compose_response", self.compose_response)

        # Entry point
        graph.set_entry_point("analyze_intent")

        # Edges
        graph.add_edge("analyze_intent", "analyze_sentiment")
        graph.add_edge("analyze_sentiment", "retrieve_context")
        graph.add_conditional_edges(
            "retrieve_context",
            self.route_to_agent,
            {
                "sales": "sales_agent",
                "support": "support_agent",
                "care": "care_agent",
                "escalate": "escalation_agent",
            },
        )
        graph.add_edge("sales_agent", "compose_response")
        graph.add_edge("support_agent", "compose_response")
        graph.add_edge("care_agent", "compose_response")
        graph.add_edge("escalation_agent", "compose_response")
        graph.add_edge("compose_response", END)

        return graph.compile()

    async def analyze_intent(self, state: AgentState) -> AgentState:
        """Classify user intent using LLM"""
        prompt = f"""Classify this message into ONE category: sales, support, care, escalate
        
Message: {state['user_input']}

Rules:
- sales: product inquiries, pricing, demos, purchasing interest
- support: technical issues, bugs, how-to questions
- care: complaints, billing, refunds, account issues
- escalate: extreme frustration, legal threats, urgent emergencies

Respond with ONLY the category word."""

        response = await self.llm.ainvoke([HumanMessage(content=prompt)])
        intent = response.content.strip().lower()
        
        if intent not in ["sales", "support", "care", "escalate"]:
            intent = "care"  # Default fallback
        
        logger.info(f"[{state['session_id']}] Intent: {intent}")
        return {**state, "intent": intent}

    async def analyze_sentiment(self, state: AgentState) -> AgentState:
        """Real-time sentiment analysis"""
        sentiment = await self.sentiment_analyzer.analyze(state["user_input"])
        logger.info(f"[{state['session_id']}] Sentiment: {sentiment}")
        return {**state, "sentiment": sentiment}

    async def retrieve_context(self, state: AgentState) -> AgentState:
        """RAG: Retrieve relevant docs from knowledge base"""
        docs = await self.rag.retrieve(
            query=state["user_input"],
            intent=state["intent"],
            top_k=5
        )
        return {**state, "retrieved_docs": docs}

    def route_to_agent(self, state: AgentState) -> str:
        """Route based on intent and sentiment"""
        # If extreme negative sentiment, escalate immediately
        if state["sentiment"].get("label") == "NEGATIVE" and \
           state["sentiment"].get("score", 0) > 0.92:
            return "escalate"
        return state["intent"]

    async def run_sales_agent(self, state: AgentState) -> AgentState:
        response, confidence = await self.sales_agent.respond(
            user_input=state["user_input"],
            context=state["retrieved_docs"],
            sentiment=state["sentiment"],
            history=state["messages"]
        )
        return {**state, "agent_response": response, "confidence": confidence, "bot_type": "sales"}

    async def run_support_agent(self, state: AgentState) -> AgentState:
        response, confidence = await self.support_agent.respond(
            user_input=state["user_input"],
            context=state["retrieved_docs"],
            sentiment=state["sentiment"],
            history=state["messages"]
        )
        return {**state, "agent_response": response, "confidence": confidence, "bot_type": "support"}

    async def run_care_agent(self, state: AgentState) -> AgentState:
        response, confidence = await self.care_agent.respond(
            user_input=state["user_input"],
            context=state["retrieved_docs"],
            sentiment=state["sentiment"],
            history=state["messages"]
        )
        return {**state, "agent_response": response, "confidence": confidence, "bot_type": "care"}

    async def run_escalation_agent(self, state: AgentState) -> AgentState:
        response, confidence = await self.escalation_agent.respond(
            user_input=state["user_input"],
            context=state["retrieved_docs"],
            sentiment=state["sentiment"],
            history=state["messages"]
        )
        return {**state, "agent_response": response, "confidence": confidence, "bot_type": "escalation", "escalate": True}

    async def compose_response(self, state: AgentState) -> AgentState:
        """Final response composer — adapts tone based on sentiment"""
        sentiment_label = state["sentiment"].get("label", "NEUTRAL")
        
        tone_instruction = {
            "POSITIVE": "Be warm, enthusiastic, and match their energy.",
            "NEUTRAL": "Be professional, clear, and helpful.",
            "NEGATIVE": "Be empathetic, calm, and solution-focused. Acknowledge their frustration.",
        }.get(sentiment_label, "Be professional and helpful.")

        if state["confidence"] < 0.6 and not state.get("escalate"):
            # Low confidence — add disclaimer
            response = state["agent_response"] + "\n\n_If this didn't fully answer your question, I can connect you with a specialist._"
        else:
            response = state["agent_response"]

        return {**state, "agent_response": response}

    async def run(self, session_id: str, user_input: str, history: list) -> dict:
        """Main entry point"""
        initial_state = AgentState(
            messages=history,
            session_id=session_id,
            user_input=user_input,
            intent="",
            sentiment={},
            agent_response="",
            confidence=0.0,
            escalate=False,
            retrieved_docs=[],
            bot_type="",
        )
        result = await self.graph.ainvoke(initial_state)
        return {
            "response": result["agent_response"],
            "intent": result["intent"],
            "sentiment": result["sentiment"],
            "confidence": result["confidence"],
            "bot_type": result["bot_type"],
            "escalated": result.get("escalate", False),
        }

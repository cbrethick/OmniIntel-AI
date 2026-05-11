"""Chat API Routes"""
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
import uuid

from agents.orchestrator import OmniOrchestrator

router = APIRouter()
orchestrator = OmniOrchestrator()

# In-memory session store (use Redis in production)
sessions: dict = {}


class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None


class ChatResponse(BaseModel):
    response: str
    session_id: str
    intent: str
    sentiment: dict
    confidence: float
    bot_type: str
    escalated: bool


@router.post("/message", response_model=ChatResponse)
async def send_message(request: ChatRequest):
    """Process a chat message through the multi-agent system"""
    session_id = request.session_id or str(uuid.uuid4())
    history = sessions.get(session_id, [])

    try:
        result = await orchestrator.run(
            session_id=session_id,
            user_input=request.message,
            history=history,
        )

        # Update session history
        from langchain_core.messages import HumanMessage, AIMessage
        history.append(HumanMessage(content=request.message))
        history.append(AIMessage(content=result["response"]))
        sessions[session_id] = history[-20:]  # Keep last 20 messages

        return ChatResponse(
            response=result["response"],
            session_id=session_id,
            intent=result["intent"],
            sentiment=result["sentiment"],
            confidence=result["confidence"],
            bot_type=result["bot_type"],
            escalated=result["escalated"],
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/session/{session_id}")
async def clear_session(session_id: str):
    """Clear a chat session"""
    sessions.pop(session_id, None)
    return {"message": "Session cleared"}


@router.get("/session/{session_id}/history")
async def get_history(session_id: str):
    """Get session history"""
    history = sessions.get(session_id, [])
    return {"session_id": session_id, "message_count": len(history)}

"""WebSocket Connection Manager for real-time chat"""
from fastapi import WebSocket
from agents.orchestrator import OmniOrchestrator
import logging

logger = logging.getLogger(__name__)


class WebSocketManager:
    def __init__(self):
        self.active_connections: dict[str, WebSocket] = {}
        self.orchestrator = OmniOrchestrator()
        self.sessions: dict = {}

    async def connect(self, websocket: WebSocket, session_id: str):
        await websocket.accept()
        self.active_connections[session_id] = websocket
        logger.info(f"WebSocket connected: {session_id}")

    def disconnect(self, session_id: str):
        self.active_connections.pop(session_id, None)
        logger.info(f"WebSocket disconnected: {session_id}")

    async def handle_message(self, session_id: str, data: dict):
        websocket = self.active_connections.get(session_id)
        if not websocket:
            return

        message = data.get("message", "")
        history = self.sessions.get(session_id, [])

        try:
            # Send typing indicator
            await websocket.send_json({"type": "typing", "status": True})

            result = await self.orchestrator.run(
                session_id=session_id,
                user_input=message,
                history=history,
            )

            from langchain_core.messages import HumanMessage, AIMessage
            history.append(HumanMessage(content=message))
            history.append(AIMessage(content=result["response"]))
            self.sessions[session_id] = history[-20:]

            await websocket.send_json({
                "type": "message",
                "response": result["response"],
                "intent": result["intent"],
                "sentiment": result["sentiment"],
                "confidence": result["confidence"],
                "bot_type": result["bot_type"],
                "escalated": result["escalated"],
            })
        except Exception as e:
            await websocket.send_json({"type": "error", "message": str(e)})

    async def broadcast(self, message: dict):
        for ws in self.active_connections.values():
            await ws.send_json(message)

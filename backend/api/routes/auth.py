"""Auth Routes (simplified for hackathon)"""
from fastapi import APIRouter
from pydantic import BaseModel
import uuid

router = APIRouter()


class LoginRequest(BaseModel):
    email: str
    password: str


@router.post("/login")
async def login(request: LoginRequest):
    """Demo login — replace with real auth in production"""
    return {
        "token": str(uuid.uuid4()),
        "user": {"email": request.email, "name": "Demo User"},
        "message": "Login successful",
    }

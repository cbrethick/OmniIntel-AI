"""Analytics API Routes"""
from fastapi import APIRouter
from datetime import datetime, timedelta
import random

router = APIRouter()


@router.get("/dashboard")
async def get_dashboard():
    """Get real-time analytics dashboard data"""
    return {
        "total_conversations": 1247,
        "resolution_rate": 87.3,
        "avg_response_time_ms": 342,
        "escalation_rate": 4.2,
        "sentiment_breakdown": {
            "positive": 52.1,
            "neutral": 31.4,
            "negative": 16.5,
        },
        "intent_breakdown": {
            "sales": 28.3,
            "support": 41.2,
            "care": 30.5,
        },
        "hourly_volume": [
            {"hour": f"{i:02d}:00", "count": random.randint(20, 120)}
            for i in range(24)
        ],
        "top_issues": [
            {"issue": "Password reset", "count": 143},
            {"issue": "Billing inquiry", "count": 98},
            {"issue": "API integration", "count": 76},
            {"issue": "Feature request", "count": 54},
            {"issue": "Account upgrade", "count": 43},
        ],
        "bot_performance": {
            "sales": {"resolved": 91, "escalated": 9, "avg_confidence": 0.84},
            "support": {"resolved": 88, "escalated": 12, "avg_confidence": 0.79},
            "care": {"resolved": 85, "escalated": 15, "avg_confidence": 0.81},
        },
    }


@router.get("/sentiment/trend")
async def get_sentiment_trend():
    """Get sentiment trend over last 7 days"""
    trend = []
    for i in range(7):
        date = (datetime.now() - timedelta(days=6 - i)).strftime("%b %d")
        trend.append({
            "date": date,
            "positive": random.randint(45, 65),
            "neutral": random.randint(20, 35),
            "negative": random.randint(10, 25),
        })
    return {"trend": trend}

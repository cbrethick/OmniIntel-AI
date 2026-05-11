"""
Sentiment Analyzer — Fine-tuned RoBERTa for real-time emotion detection
Detects: POSITIVE, NEGATIVE, NEUTRAL with confidence scores
Also detects: frustration, urgency, happiness for adaptive responses
"""
from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
import torch
import logging
from functools import lru_cache

logger = logging.getLogger(__name__)


class SentimentAnalyzer:
    def __init__(self):
        self._sentiment_pipeline = None
        self._emotion_pipeline = None
        self._load_models()

    def _load_models(self):
        """No local models to save RAM on Render Free Tier"""
        self._sentiment_pipeline = None
        self._emotion_pipeline = None
        logger.info("Using lightweight sentiment analysis")

    async def analyze(self, text: str) -> dict:
        """
        Analyze sentiment and emotion of user input.
        Returns dict with label, score, emotion, urgency_flag
        """
        if not text or len(text.strip()) < 3:
            return {"label": "NEUTRAL", "score": 0.5, "emotion": "neutral", "urgency": False}

        try:
            if self._sentiment_pipeline:
                # Get sentiment
                sentiment_result = self._sentiment_pipeline(text[:512])[0]
                label_map = {"positive": "POSITIVE", "negative": "NEGATIVE", "neutral": "NEUTRAL"}
                label = label_map.get(sentiment_result["label"].lower(), "NEUTRAL")
                score = sentiment_result["score"]

                # Get emotion
                emotion = "neutral"
                if self._emotion_pipeline:
                    emotion_result = self._emotion_pipeline(text[:512])[0]
                    emotion = emotion_result["label"].lower()

                # Detect urgency keywords
                urgency_keywords = ["urgent", "asap", "immediately", "critical", "broken", "down", "cannot", "help"]
                urgency = any(kw in text.lower() for kw in urgency_keywords)

                return {
                    "label": label,
                    "score": round(score, 4),
                    "emotion": emotion,
                    "urgency": urgency,
                }
            else:
                return self._rule_based_sentiment(text)

        except Exception as e:
            logger.error(f"Sentiment analysis error: {e}")
            return self._rule_based_sentiment(text)

    def _rule_based_sentiment(self, text: str) -> dict:
        """Fallback rule-based sentiment when models unavailable"""
        text_lower = text.lower()
        
        negative_words = ["angry", "frustrated", "terrible", "awful", "bad", "wrong", "broken", "hate", "useless", "worst"]
        positive_words = ["great", "good", "excellent", "happy", "love", "amazing", "perfect", "thank", "awesome"]
        
        neg_count = sum(1 for w in negative_words if w in text_lower)
        pos_count = sum(1 for w in positive_words if w in text_lower)
        
        if neg_count > pos_count:
            return {"label": "NEGATIVE", "score": 0.75, "emotion": "anger", "urgency": neg_count > 2}
        elif pos_count > neg_count:
            return {"label": "POSITIVE", "score": 0.75, "emotion": "joy", "urgency": False}
        else:
            return {"label": "NEUTRAL", "score": 0.6, "emotion": "neutral", "urgency": False}

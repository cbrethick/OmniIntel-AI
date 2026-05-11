"""
Voice Handler — OpenAI Whisper for speech-to-text
Supports MP3, WAV, WebM audio formats
"""
import whisper
import tempfile
import os
import logging
from pathlib import Path

logger = logging.getLogger(__name__)


class VoiceTranscriber:
    def __init__(self, model_size: str = "base"):
        logger.info(f"Loading Whisper model: {model_size}")
        self.model = whisper.load_model(model_size)
        logger.info("Whisper model loaded")

    async def transcribe(self, audio_bytes: bytes, file_extension: str = "webm") -> dict:
        """Transcribe audio bytes to text"""
        with tempfile.NamedTemporaryFile(
            suffix=f".{file_extension}", delete=False
        ) as tmp:
            tmp.write(audio_bytes)
            tmp_path = tmp.name

        try:
            result = self.model.transcribe(
                tmp_path,
                language="en",
                task="transcribe",
                fp16=False,
            )
            return {
                "text": result["text"].strip(),
                "language": result.get("language", "en"),
                "segments": result.get("segments", []),
                "confidence": self._estimate_confidence(result),
            }
        except Exception as e:
            logger.error(f"Transcription error: {e}")
            return {"text": "", "error": str(e)}
        finally:
            os.unlink(tmp_path)

    def _estimate_confidence(self, result: dict) -> float:
        segments = result.get("segments", [])
        if not segments:
            return 0.8
        avg_logprob = sum(s.get("avg_logprob", -1) for s in segments) / len(segments)
        # Convert log probability to 0-1 confidence
        import math
        return round(min(1.0, max(0.0, math.exp(avg_logprob))), 4)

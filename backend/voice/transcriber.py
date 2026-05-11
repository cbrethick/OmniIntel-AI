"""
Voice Handler — OpenAI Whisper for speech-to-text
Supports MP3, WAV, WebM audio formats
"""
from openai import OpenAI
import tempfile
import os
import logging
from pathlib import Path

logger = logging.getLogger(__name__)


class VoiceTranscriber:
    def __init__(self, model_size: str = "whisper-1"):
        logger.info(f"Initializing OpenAI Whisper API client")
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.model_name = "whisper-1"
        logger.info("OpenAI Whisper API client ready")

    async def transcribe(self, audio_bytes: bytes, file_extension: str = "m4a") -> dict:
        """Transcribe audio bytes to text using OpenAI API"""
        with tempfile.NamedTemporaryFile(
            suffix=f".{file_extension}", delete=False
        ) as tmp:
            tmp.write(audio_bytes)
            tmp_path = tmp.name

        try:
            with open(tmp_path, "rb") as audio_file:
                transcript = self.client.audio.transcriptions.create(
                    model=self.model_name, 
                    file=audio_file,
                    response_format="json"
                )
            
            return {
                "text": transcript.text.strip(),
                "language": "en",
                "confidence": 0.99,
            }
        except Exception as e:
            logger.error(f"Transcription error: {e}")
            return {"text": "", "error": str(e)}
        finally:
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)


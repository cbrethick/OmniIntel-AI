"""Voice API Routes"""
from fastapi import APIRouter, UploadFile, File, HTTPException
from voice.transcriber import VoiceTranscriber

router = APIRouter()
transcriber = VoiceTranscriber()


@router.post("/transcribe")
async def transcribe_audio(audio: UploadFile = File(...)):
    """Transcribe uploaded audio file using Whisper"""
    allowed_types = ["audio/webm", "audio/wav", "audio/mp3", "audio/mpeg", "audio/ogg"]
    if audio.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail=f"Unsupported audio type: {audio.content_type}")

    audio_bytes = await audio.read()
    ext = audio.filename.split(".")[-1] if audio.filename else "webm"
    result = await transcriber.transcribe(audio_bytes, ext)

    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    return result

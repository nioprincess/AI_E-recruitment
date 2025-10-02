from celery import shared_task
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import time
import json
import base64
import numpy as np
import struct
from .voski_loader import get_vosk_model
from vosk import KaldiRecognizer
from .observation_utils import process_base64_image


vosk_model = None
accumulated_transcript = ""
sample_rate = 16000  
vosk_model = get_vosk_model()
recognizer = KaldiRecognizer(vosk_model, sample_rate)
recognizer.SetWords(True)
recognizer.SetPartialWords(True)
print(f"Vosk initialized: {sample_rate}")

@shared_task
def process_candidate(candidate_id, user_id):
    time.sleep(5)

    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"user_{user_id}_notification",
        {
            "type": "send_notification", 
            "message": f"Candidate {user_id} processing complete for {candidate_id}",
            "message_type": "danger"
        }
    )
    return "Done"



@shared_task
def process_image_data(imageData, user_id,exam_id, request_id):
     
    detections = process_base64_image(imageData, exam_id)
    detections["id"]= request_id,
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
    f"user_{user_id}_observation",
    {
        "type": "send_observation_response",  
        "message": detections
    }
)
    return "Done"


 



@shared_task
def process_web_audio_pcm(user_id, audio_bytes, audio_buffer,min_chunk_size, chunk_size,last_activity_time ):

    try:
        # Validate audio data length (must be even for 16-bit samples)
        if len(audio_bytes) % 2 != 0:
            print(f"Warning: Odd audio length {len(audio_bytes)}, padding with zero")
            audio_bytes = audio_bytes + b'\x00'
        
        # Add to buffer
        audio_buffer += audio_bytes
        
        # Process audio quality metrics
        audio_quality = analyze_audio_quality(audio_bytes)
        
        # Process in chunks matching the frontend's buffer size
        processed_chunks = 0
        while len(audio_buffer) >= min_chunk_size:
            # Extract chunk
            chunk_size = min(chunk_size, len(audio_buffer))
            # Ensure chunk size is even
            if chunk_size % 2 != 0:
                chunk_size -= 1
            
            if chunk_size < min_chunk_size:
                break
                
            chunk = audio_buffer[:chunk_size]
            audio_buffer = audio_buffer[chunk_size:]
            
            # Process chunk with Vosk
            process_chunk_with_vosk (user_id, chunk, audio_quality, last_activity_time)
            processed_chunks += 1
            
           
                
    except Exception as e:
        print(f"Error processing Web Audio PCM: {e}")
        import traceback
        traceback.print_exc()

def analyze_audio_quality(audio_bytes):
    """Analyze audio quality metrics"""
    try:
        if len(audio_bytes) < 2:
            return {"status": "insufficient_data"}
            
        # Convert bytes to int16 samples
        samples = []
        for i in range(0, len(audio_bytes), 2):
            if i + 1 < len(audio_bytes):
                sample = struct.unpack('<h', audio_bytes[i:i+2])[0]  # little-endian int16
                samples.append(sample)
        
        if not samples:
            return {"status": "no_samples"}
        
        # Calculate audio metrics
        abs_samples = [abs(s) for s in samples]
        max_amplitude = max(abs_samples)
        avg_amplitude = sum(abs_samples) / len(abs_samples)
        rms = np.sqrt(np.mean(np.square(samples))) if len(samples) > 0 else 0
        
        # Determine audio status
        status = "good"
        if max_amplitude < 100:
            status = "very_quiet"
        elif max_amplitude < 500:
            status = "quiet"
        elif avg_amplitude < 50:
            status = "low_signal"
            
        return {
            "status": status,
            "max_amplitude": max_amplitude,
            "avg_amplitude": avg_amplitude,
            "rms": rms,
            "sample_count": len(samples),
            "clipping": max_amplitude >= 32760  # Near int16 max
        }
        
    except Exception as e:
        print(f"Error analyzing audio quality: {e}")
        return {"status": "analysis_error"}
 
def process_chunk_with_vosk( user_id, chunk, audio_quality, last_activity_time):
    """Process audio chunk with Vosk recognizer"""
    try:
        if not recognizer:
            print("Recognizer not initialized")
            return
   
        base64_audio_Chunk= base64.b64encode(chunk).decode('utf-8')
        
        if recognizer.AcceptWaveform(chunk):
            # Final result
            result = json.loads(recognizer.Result())
            transcript = result.get("text", "").strip()
            confidence = result.get("confidence", 0)
            channel_layer= get_channel_layer()
            if transcript:
                    async_to_sync(channel_layer.group_send)(
                    f"user_{user_id}_audio",
                {
                    "type": "send_audio_with_transcription",
                    "message":{ 
                    "type":"final_transcript",
                    "transcription": transcript,
                    "confidence": confidence,
                    "audio_quality": audio_quality,
                    "timestamp": last_activity_time,
                    "audio_chunk":base64_audio_Chunk}
                    
                })
                
        else:
            # Partial result
            partial_result = json.loads(recognizer.PartialResult())
            partial = partial_result.get("partial", "").strip()
            
            if partial:
                async_to_sync(channel_layer.group_send)(
                    f"user_{user_id}_audio",
                {
                    "type": "send_audio_with_transcription",
                    "message": {
                    "type":"partial_transcript",
                    "transcription": partial,
                    "audio_quality": audio_quality,
                    "timestamp": last_activity_time,
                    "audio_chunk":base64_audio_Chunk}
                })
                
                    
    except Exception as e:
        print(f"Vosk processing error: {e}")
      



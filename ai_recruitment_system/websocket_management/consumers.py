import binascii
import json
import base64
import numpy as np
from channels.generic.websocket import AsyncWebsocketConsumer

from websocket_management.observation_utils import process_base64_image
from .ai_processors import AIProcessor
from channels.layers import get_channel_layer
import base64
import numpy as np
import logging
from vosk import KaldiRecognizer
from .voski_loader import get_vosk_model
import numpy as np
import wave
import io
import asyncio
import struct
import asyncio
from .tasks import process_web_audio_pcm
import time
from django.contrib.auth.models import AnonymousUser
from typing import Dict, Any, Optional, List
import uuid
from datetime import datetime
from .ai_processing import AIProcessor
from .encryption import EncryptionService
from .media_sync import MediaSynchronizer

import json
import asyncio
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import padding
from cryptography.hazmat.backends import default_backend
import os
from .tasks import process_image_data
from urllib.parse import parse_qs

       
 

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("SeparateAudioVideo") 


 

connections = {}

class WebRTCConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        connections[self.channel_name] = self
        print(f"Client connected: {self.channel_name}")
        
        # Notify other clients that a new user joined
        await self.broadcast_to_others({
            'type': 'user-joined',
            'userId': self.channel_name
        })

    async def disconnect(self, close_code):
        if self.channel_name in connections:
            del connections[self.channel_name]
            print(f"Client disconnected: {self.channel_name}")
            
            await self.broadcast_to_others({
                'type': 'user-left',
                'userId': self.channel_name
            })

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            
            message_type = data.get('type') or data.get('action')
            
            if 'message' in data:
                message_data = data['message']
                if isinstance(message_data, dict):
                    message_type = message_data.get('type') or message_data.get('action')
                    data = message_data
            
            
            if message_type == 'offer':
                await self.handle_offer(data)
            elif message_type == 'answer':
                await self.handle_answer(data)
            elif message_type == 'ice_candidate':
                await self.handle_ice_candidate(data)
            elif message_type == 'join':
                await self.handle_join(data)
            elif message_type == 'leave':
                await self.handle_leave(data)
            else:
                print(f"Unknown message type: {message_type}")
                # Send error response back to client
                await self.send(text_data=json.dumps({
                    'responseType': 'error',
                    'error': f'Unknown message type: {message_type}',
                    'error_code': 'INVALID_MESSAGE_TYPE',
                    'timestamp': self.get_timestamp()
                }))
                
        except json.JSONDecodeError as e:
            print(f"Invalid JSON received: {e}")
            await self.send(text_data=json.dumps({
                'responseType': 'error',
                'error': 'Invalid JSON format',
                'error_code': 'JSON_PARSE_ERROR',
                'timestamp': self.get_timestamp()
            }))
        except Exception as e:
            print(f"Error handling message: {e}")
            await self.send(text_data=json.dumps({
                'responseType': 'error',
                'error': str(e),
                'error_code': 'GENERAL_ERROR',
                'timestamp': self.get_timestamp()
            }))

    async def handle_offer(self, data):
        """Handle WebRTC offer from client"""
        offer = data.get('offer')
        user= self.scope["user"]
        if offer:
            # Send offer to all other connected clients
            await self.broadcast_to_others({
                'type': 'offer',
                'offer': offer,
                'userId': user.id
            })

    async def handle_answer(self, data):
        """Handle WebRTC answer from client"""
        user= self.scope["user"]
        answer = data.get('answer')
        if answer:
            await self.broadcast_to_others({
                'type': 'answer',
                'answer': answer,
                'userId': user.id
            })

    async def handle_ice_candidate(self, data):
        candidate = data.get('candidate')
        user= self.scope["user"]
        if candidate:
            # Send ICE candidate to all other connected clients
            candidate['userId']= user.id,
            candidate[ "first_name"]=user.u_first_name,
            candidate [ "last_name"]=user.u_last_name,
            candidate ["email"]=user.u_email
            await self.broadcast_to_others({
                'type': 'ice_candidate',
                'candidate': candidate,
                'userId': user.id
                
            })

    async def broadcast_to_others(self, message):
        """Send message to all connected clients except the sender"""
        for channel_name, consumer in connections.items():
            if channel_name != self.channel_name:
                try:
                    await consumer.send(text_data=json.dumps(message))
                except Exception as e:
                    print(f"Error sending to {channel_name}: {e}")
                    # Remove broken connection
                    if channel_name in connections:
                        del connections[channel_name]

    async def handle_join(self, data):
        """Handle client join request"""
        user= self.scope["user"]
        await self.send(text_data=json.dumps({
            'type': 'join_success',
            'userId': user.id,
            'timestamp': self.get_timestamp()
        }))

    async def handle_leave(self, data):
        """Handle client leave request"""
        user= self.scope["user"]
        await self.send(text_data=json.dumps({
            'type': 'leave_success',
            'userId': user.id,
            'timestamp': self.get_timestamp()
        }))

    def get_timestamp(self):
        """Get current timestamp in ISO format"""
        from datetime import datetime
        return datetime.now().isoformat()

    async def send_to_specific_client(self, target_channel, message):
        """Send message to a specific client"""
        if target_channel in connections:
            try:
                await connections[target_channel].send(text_data=json.dumps(message))
            except Exception as e:
                print(f"Error sending to {target_channel}: {e}")
                if target_channel in connections:
                    del connections[target_channel]
class FrameConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.frame_count = 0
        self.processing_enabled = True
        
    async def connect(self):
        print("WebSocket connection established.")
        user = self.scope["user"]
        if user.is_authenticated:
            self.group_name = f"user_{user.id}_video"
            await self.channel_layer.group_add(self.group_name, self.channel_name)
            await self.accept()
            print(f"User {user.id} connected to video stream")
        else:
            print("User not authenticated, closing connection.")
            await self.close()
       
    async def disconnect(self, close_code):
        user = self.scope["user"]
        if user.is_authenticated:
            await self.channel_layer.group_discard(self.group_name, self.channel_name)
            print(f"User {user.id} disconnected from video stream")
    async def send_video_frame(self, event):
        try:
            message = event["message"]

            await self.send(text_data=json.dumps( message))
        except Exception as e:
            print(str(e))
    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            frame_data= data.get("image")
           
            if not frame_data:
                return
             
            channel_layer = get_channel_layer()
            user = self.scope["user"]
            await channel_layer.group_send(
            f"user_{user.id}_video",
            {
                "type": "send_video_frame",  
                "message": {
                    "frame":frame_data
                }
            })
                
        except Exception as e:
            print(f"Error processing message: {e}")
            await self.send(text_data=json.dumps({
                "error": f"Failed to process message: {str(e)}"
            })) 
 
class AudioConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.vosk_model = None
        self.accumulated_transcript = ""
        self.sample_rate = 16000  
        self.audio_buffer = b""
        self.chunk_size = 8192   
        self.min_chunk_size = 1600   
        self.silence_threshold = 500  
        self.last_activity_time = 0
        self.vosk_model = get_vosk_model()
        self.recognizer = KaldiRecognizer(self.vosk_model, self.sample_rate)
        self.recognizer.SetWords(True)
        self.recognizer.SetPartialWords(True)
        print(f"Vosk initialized: {self.sample_rate}Hz, chunk_size: {self.chunk_size}")
        
    async def connect(self):
        user = self.scope["user"]

        if user.is_authenticated:
            self.group_name = f"user_{user.id}_audio"
            await self.channel_layer.group_add(self.group_name, self.channel_name)
            
         
       
            await self.accept()
            
            await self.send(text_data=json.dumps({
                'type': 'audio_config',
                'status': 'ready',
                'config': {
                    'sample_rate': self.sample_rate,
                    'bit_depth': 16,
                    'channels': 1,
                    'format': 'PCM_INT16',
                    'expected_chunk_size': self.chunk_size,
                    'buffer_size': 4096  
                }
            }))
        else:
            print("User not authenticated, closing connection.")
            await self.close()
        
    async def disconnect(self, close_code):
        user = self.scope["user"]
        if user.is_authenticated:
            await self.channel_layer.group_discard(f"user_{user.id}", self.channel_name)
        
        # Clean up resources
        self.vosk_model = None
        self.recognizer = None
        self.audio_buffer = b""
        print("AudioConsumer disconnected and cleaned up")

    async def receive(self, text_data):
        try:
            user= self.scope["user"]
            data_json = json.loads(text_data)
            message_type = data_json.get("type", "stream_data")
            
            if message_type == "stream_data":
                base64_data = data_json.get("data")
                if not base64_data:
                    return

                try:
                    audio_bytes = base64.b64decode(base64_data)
                    # process_web_audio_pcm.delay(user.id, audio_bytes, self.audio_buffer,self.min_chunk_size, self.chunk_size, self.last_activity_time )
                    await self.process_web_audio_pcm(audio_bytes)
                except Exception as e:
                    print(f"Error decoding base64 audio: {str(e)}")
                    
            elif message_type == "reset":
                await self.reset_transcription()
                
        except json.JSONDecodeError as e:
            print(f"JSON decode error: {e}")
        except Exception as e:
            print(f"Error processing message: {e}")
            import traceback
            traceback.print_exc()

    async def process_web_audio_pcm(self, audio_bytes):
  
        try:
            # Validate audio data length (must be even for 16-bit samples)
            if len(audio_bytes) % 2 != 0:
                print(f"Warning: Odd audio length {len(audio_bytes)}, padding with zero")
                audio_bytes = audio_bytes + b'\x00'
            
            # Add to buffer
            self.audio_buffer += audio_bytes
            
            # Process audio quality metrics
            audio_quality = self.analyze_audio_quality(audio_bytes)
            
            # Process in chunks matching the frontend's buffer size
            processed_chunks = 0
            while len(self.audio_buffer) >= self.min_chunk_size:
                # Extract chunk
                chunk_size = min(self.chunk_size, len(self.audio_buffer))
                # Ensure chunk size is even
                if chunk_size % 2 != 0:
                    chunk_size -= 1
                
                if chunk_size < self.min_chunk_size:
                    break
                    
                chunk = self.audio_buffer[:chunk_size]
                self.audio_buffer = self.audio_buffer[chunk_size:]
                
                # Process chunk with Vosk
                await self.process_chunk_with_vosk(chunk, audio_quality)
                processed_chunks += 1
                
                # Prevent blocking - yield control after processing multiple chunks
                if processed_chunks % 5 == 0:
                    await asyncio.sleep(0.001)
                    
        except Exception as e:
            print(f"Error processing Web Audio PCM: {e}")
            import traceback
            traceback.print_exc()

    def analyze_audio_quality(self, audio_bytes):
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
    
    async def send_audio_with_transcription(self, event):
        print("response received")
        try:
            message = event["message"]
            self.last_activity_time= time.time()
            # self.reset_transcription()

            await self.send(text_data=json.dumps( message))
        except Exception as e:
            print(str(e))
    async def process_chunk_with_vosk(self, chunk, audio_quality):
        """Process audio chunk with Vosk recognizer"""
        try:
            if not self.recognizer:
                print("Recognizer not initialized")
                return
            
           
            import time
            self.last_activity_time = time.time()
            base64_audio_Chunk= base64.b64encode(chunk).decode('utf-8')
            # Process with Vosk
            channel_layer= get_channel_layer()
            user= self.scope["user"]
            if self.recognizer.AcceptWaveform(chunk):
                # Final result
                result = json.loads(self.recognizer.Result())
                transcript = result.get("text", "").strip()
                confidence = result.get("confidence", 0)
                
                if transcript:
                     await channel_layer.group_send(
                        f"user_{user.id}_audio",
                   {
                        "type": "send_audio_with_transcription",
                        "message":{ 
                        "type":"final_transcript",
                        "transcription": transcript,
                        "confidence": confidence,
                        "audio_quality": audio_quality,
                        "timestamp": self.last_activity_time,
                        "audio_chunk":base64_audio_Chunk}
                       
                    })
                 
            else:
                # Partial result
                partial_result = json.loads(self.recognizer.PartialResult())
                partial = partial_result.get("partial", "").strip()
                
                if partial:
                   await channel_layer.group_send(
                        f"user_{user.id}_audio",
                   {
                        "type": "send_audio_with_transcription",
                        "message": {
                        "type":"partial_transcript",
                        "transcription": partial,
                        "audio_quality": audio_quality,
                        "timestamp": self.last_activity_time,
                        "audio_chunk":base64_audio_Chunk}
                    })
                   
                        
        except Exception as e:
            print(f"Vosk processing error: {e}")
            await self.send(text_data=json.dumps({
                "type": "error",
                "message": f"Speech recognition error: {str(e)}"
            }))

    async def reset_transcription(self):
        """Reset transcription state"""
        try:
            if self.recognizer and self.vosk_model:
                self.recognizer = KaldiRecognizer(self.vosk_model, self.sample_rate)
                self.recognizer.SetWords(True)
                self.recognizer.SetPartialWords(True)
                
            self.accumulated_transcript = ""
            self.audio_buffer = b""
            self.last_activity_time = 0
            
            await self.send(text_data=json.dumps({
                "type": "reset_complete",
                "message": "Transcription state reset successfully"
            }))
            
            print("Transcription state reset")
            
        except Exception as e:
            print(f"Error resetting transcription: {e}")
            await self.send(text_data=json.dumps({
                "type": "error", 
                "message": f"Reset failed: {str(e)}"
            }))

    # Legacy format support (keep for backwards compatibility)
    def is_wav_format(self, audio_bytes):
        """Check if audio data starts with WAV header"""
        return audio_bytes.startswith(b'RIFF') and b'WAVE' in audio_bytes[:12]

    def is_webm_format(self, audio_bytes):
        """Check if audio data starts with WebM header"""
        return audio_bytes.startswith(b'\x1a\x45\xdf\xa3')

    async def process_wav_audio(self, audio_bytes):
        """Process WAV formatted audio (legacy support)"""
        try:
            wav_io = io.BytesIO(audio_bytes)
            wf = wave.open(wav_io, "rb")

            channels = wf.getnchannels()
            sample_width = wf.getsampwidth()
            frame_rate = wf.getframerate()
            
            print(f"WAV: {channels}ch, {sample_width}B/sample, {frame_rate}Hz")

            if channels != 1 or sample_width != 2 or frame_rate != self.sample_rate:
                print(f"Warning: WAV format mismatch - expected 1ch, 2B/sample, {self.sample_rate}Hz")
                
            data = wf.readframes(wf.getnframes())
            wf.close()
            
            # Process as raw PCM
            await self.process_web_audio_pcm(data)
            
        except Exception as e:
            print(f"Error processing WAV: {e}")
            raise

    async def process_webm_audio(self, audio_bytes):
        """Process WebM audio (legacy support)"""
        try:
            # Skip WebM header (simplified approach)
            pcm_data = audio_bytes[44:] if len(audio_bytes) > 44 else audio_bytes
            
            if len(pcm_data) % 2 != 0:
                pcm_data = pcm_data[:-1]
                
            await self.process_web_audio_pcm(pcm_data)
            
        except Exception as e:
            print(f"Error processing WebM: {e}")
            raise
class NotificationConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.ai_processor = AIProcessor()
        self.group_name = 'notification_room'
        
    async def connect(self):
        user = self.scope["user"]

        if user.is_authenticated:
            self.group_name = f"user_{user.id}_notification"
            await self.channel_layer.group_add(self.group_name, self.channel_name)
       
            await self.accept()
        else:
            await self.close()
        
    async def disconnect(self, close_code):
        user = self.scope["user"]
        if user.is_authenticated:
            await self.channel_layer.group_discard(f"user_{user.id}", self.channel_name)
        

    async def receive(self, text_data):
        data = json.loads(text_data)
        notification_message= data.get("message")
        user = self.scope["user"]

        channel_layer = get_channel_layer()
        await channel_layer.group_send(
        f"user_{user.id}_notification",
        {
            "type": "send_notification",  
            "message": notification_message
        }
    )


    async def send_notification(self, event):
        message = event["message"]

        await self.send(text_data=json.dumps({
            "message": message
        }))



class InterviewConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        self.group_name = 'interview_room'
        
    async def connect(self):
        user = self.scope["user"]

        if user.is_authenticated:
            self.group_name = f"user_{user.id}_interview"
            await self.channel_layer.group_add(self.group_name, self.channel_name)
       
            await self.accept()
        else:
            await self.close()
        
    async def disconnect(self, close_code):
        user = self.scope["user"]
        if user.is_authenticated:
            await self.channel_layer.group_discard(f"user_{user.id}", self.channel_name)
        

    async def receive(self, text_data):
        data = json.loads(text_data)
        ai_message= data.get("message")
        user = self.scope["user"]

        channel_layer = get_channel_layer()
        await channel_layer.group_send(
        f"user_{user.id}_interview",
        {
            "type": "send_interview_response",  
            "message": ai_message
        }
    )


    async def send_interview_response(self, event):
        message = event["message"]

        await self.send(text_data=json.dumps({
            "message": message
        }))


class QuasiPeerConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope["user"]

        if user.is_authenticated:
           
       
            await self.accept()
        else:
            await self.close()

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            query_params = parse_qs(self.scope["query_string"].decode("utf8"))
            token = query_params["token"][0]
            
            if data["type"] == "video_frame":
                # Validate required fields
                if not all(k in data["data"] for k in ["encrypted", "iv"]):
                    raise ValueError("Missing required fields in video_frame data")

                decrypted = await self.decrypt_in_container(
                    data["data"]["encrypted"],
                    token,
                    data["data"]["iv"]
                )

                # Process the frame (example: just echo back)
                await self.send(text_data=json.dumps({
                    "type": "frame_processed",
                    "data": {
                        "status": "success",
                        "original_size": len(decrypted),
                        "timestamp": data.get("timestamp")
                    }
                }))

        except json.JSONDecodeError:
            await self.send_error("Invalid JSON format")
        except KeyError as e:
            await self.send_error(f"Missing required field: {str(e)}")
        except ValueError as e:
            await self.send_error(f"Validation error: {str(e)}")
        except Exception as e:
            await self.send_error(f"Processing error: {str(e)}")

    async def send_error(self, message: str):
        await self.send(text_data=json.dumps({
            "type": "error",
            "message": message
        }))

    async def decrypt_in_container(self, encrypted_data: str, key: str, iv: str) -> bytes:
        """Secure decryption with proper Base64 and padding handling"""
        try:
            # Decode with padding correction
            def safe_b64decode(s: str) -> bytes:
                s = s.strip()
                pad_len = len(s) % 4
                if pad_len:
                    s += '=' * (4 - pad_len)
                return base64.b64decode(s)

            key_bytes = safe_b64decode(key)
            iv_bytes = safe_b64decode(iv)
            encrypted_bytes = safe_b64decode(encrypted_data)

            # Validate lengths
            if len(iv_bytes) != 16:
                raise ValueError("IV must be 16 bytes")
            if len(key_bytes) not in [16, 24, 32]:
                raise ValueError("Invalid key length for AES")

            # Setup cipher
            cipher = Cipher(
                algorithms.AES(key_bytes),
                modes.CBC(iv_bytes),
                backend=default_backend()
            )
            decryptor = cipher.decryptor()
            
            # Decrypt and unpad
            decrypted_padded = decryptor.update(encrypted_bytes) + decryptor.finalize()
            unpadder = padding.PKCS7(128).unpadder()
            return unpadder.update(decrypted_padded) + unpadder.finalize()
            
        except binascii.Error as e:
            raise ValueError(f"Invalid Base64 data: {str(e)}")
        except Exception as e:
            raise ValueError(f"Decryption failed: {str(e)}")

    async def encrypt_in_container(self, plain_data: bytes, key: str) -> dict:
        """Secure encryption with new IV for each operation"""
        try:
            key_bytes = base64.b64decode(key)
            if len(key_bytes) not in [16, 24, 32]:
                raise ValueError("Invalid key length for AES")

            iv = os.urandom(16)
            padder = padding.PKCS7(128).padder()
            padded_data = padder.update(plain_data) + padder.finalize()

            cipher = Cipher(
                algorithms.AES(key_bytes),
                modes.CBC(iv),
                backend=default_backend()
            )
            encryptor = cipher.encryptor()
            encrypted = encryptor.update(padded_data) + encryptor.finalize()

            return {
                'encrypted': base64.b64encode(encrypted).decode('utf-8'),
                'iv': base64.b64encode(iv).decode('utf-8')
            }
        except Exception as e:
            raise ValueError(f"Encryption failed: {str(e)}")
 

# -------------------- Helper Functions --------------------
class ObservationConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        self.group_name = 'observation_room'
        
    async def connect(self):
        user = self.scope["user"]

        if user.is_authenticated:
            self.group_name = f"user_{user.id}_observation"
            await self.channel_layer.group_add(self.group_name, self.channel_name)
       
            await self.accept()
        else:
            await self.close()
        
    async def disconnect(self, close_code):
        user = self.scope["user"]
        if user.is_authenticated:
            await self.channel_layer.group_discard(f"user_{user.id}", self.channel_name)
        

    async def receive(self, text_data):
         
        data = json.loads(text_data)
        image_data= data.get("image_data")
        request_id= data.get("id")
        exam_id= data.get("exam_id")
        user = self.scope["user"]
        process_image_data.delay(image_data, user.id,exam_id, request_id)

     


    async def send_observation_response(self, event):
        message = event["message"]

        await self.send(text_data=json.dumps({
            "message": message
        }))
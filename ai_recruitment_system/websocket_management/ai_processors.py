import cv2
import numpy as np
from io import BytesIO
import asyncio
import concurrent.futures
import logging
import random
import speech_recognition as sr
from pydub import AudioSegment
import tempfile
import os
import subprocess
import wave
logger = logging.getLogger(__name__)

class AIProcessor:
    def __init__(self):
        self.setup_models()
        self.executor = concurrent.futures.ThreadPoolExecutor(max_workers=4)
        # Buffer to accumulate audio data for better processing
        self.audio_buffer = BytesIO()
        self.buffer_size = 0
        self.max_buffer_size = 5 * 1024 * 1024  # 5MB buffer limit

    def setup_models(self):
        self.speech_recognizer = sr.Recognizer()
        # Adjust recognition settings for better performance
        self.speech_recognizer.energy_threshold = 300
        self.speech_recognizer.dynamic_energy_threshold = True
        self.speech_recognizer.pause_threshold = 0.8
        self.speech_recognizer.phrase_threshold = 0.3
        logger.info("AI models initialized with optimized settings")

    async def process_frame(self, frame):
        """Return image analysis results"""
        try:
            loop = asyncio.get_event_loop()
            result = await loop.run_in_executor(
                self.executor, self._process_frame_sync, frame
            )
            return result
        except Exception as e:
            logger.error(f"Error in process_frame: {e}")
            return {'description': '', 'objects': [], 'emotions': []}
    def process_video_with_opencv(self, video_bytes, width=640, height=480):
        """
        Takes raw video bytes and processes with OpenCV.
        Assumes resolution is known (adjust if needed).
        """
        print("🎥 Processing video...")

        frame_size = width * height * 3  # BGR format
        frames = [video_bytes[i:i + frame_size] for i in range(0, len(video_bytes), frame_size)]

        for raw_frame in frames:
            if len(raw_frame) < frame_size:
                continue
            frame = np.frombuffer(raw_frame, dtype=np.uint8).reshape((height, width, 3))
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            cv2.imshow('Frame', gray)
            if cv2.waitKey(25) & 0xFF == ord('q'):
                break
        cv2.destroyAllWindows()



    def _process_frame_sync(self, frame):
        """Process frame with actual computer vision (dummy implementation)"""
        try:
            # Basic image analysis
            height, width = frame.shape[:2]
            
            # Calculate some basic metrics
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            brightness = np.mean(gray)
            
            # Simple object detection simulation based on image properties
            dummy_descriptions = [
                f"Scene with {width}x{height} resolution, brightness level: {brightness:.1f}",
                "Person visible in frame with good lighting",
                "Indoor environment detected",
                "Multiple objects visible in scene",
                "Clear video quality detected"
            ]
            
            dummy_objects = ["person", "face", "background", "foreground"]
            dummy_emotions = ["neutral", "focused", "engaged"]
            
            # Use image properties to make results more realistic
            if brightness > 100:
                dummy_emotions.append("positive")
            else:
                dummy_emotions.append("serious")
                
            return {
                'description': random.choice(dummy_descriptions),
                'objects': random.sample(dummy_objects, min(3, len(dummy_objects))),
                'emotions': [random.choice(dummy_emotions)]
            }
        except Exception as e:
            logger.error(f"Error in frame processing: {e}")
            return {
                'description': 'Frame processing error',
                'objects': [],
                'emotions': ['neutral']
            }

    async def process_audio(self, audio_data):
        """Process audio with improved WebM handling"""
        try:
            loop = asyncio.get_event_loop()
            result = await loop.run_in_executor(
                self.executor, self._process_audio_sync, audio_data
            )
            return result
        except Exception as e:
            logger.error(f"Error in process_audio: {e}")
            return {'transcription': '', 'analysis': 'Audio processing error'}
         
    def _process_audio_sync(self, audio_data: bytes) -> dict:
        """
        Process raw PCM audio data synchronously to extract transcription and generate analysis.

        Args:
            audio_data (bytes): Raw PCM audio data at 16kHz, mono, 16-bit signed int.

        Returns:
            dict: Contains 'transcription' and 'analysis' fields.
                Returns empty strings if processing fails.
        """
        result = {
            'transcription': '',
            'analysis': ''
        }

        try:
            # Wrap raw PCM in a WAV container using Python's built-in `wave` module
            wav_io = BytesIO()
            with wave.open(wav_io, 'wb') as wf:
                wf.setnchannels(1)          # Mono
                wf.setsampwidth(2)          # 2 bytes per sample (16-bit)
                wf.setframerate(16000)      # 16kHz
                wf.writeframes(audio_data)

            wav_io.seek(0)  # Rewind for reading

            recognizer = sr.Recognizer()
            with sr.AudioFile(wav_io) as source:
                audio_segment = recognizer.record(source)

            # Perform STT
            transcription = recognizer.recognize_google(audio_segment)
            print("🗣️ Transcription:", transcription)
            result['transcription'] = transcription

            # Placeholder: Audio level and sentiment
            audio_level = self._calculate_audio_level(audio_data)
            analysis = f"Audio Level: {audio_level:.2f} dB"

            if transcription.strip():
                sentiment = self._analyze_sentiment(transcription)
                word_count = len(transcription.split())
                analysis += f", Sentiment: {sentiment}, Words: {word_count}"

            result['analysis'] = analysis
            return result

        except sr.UnknownValueError:
            print("⚠️ Speech Recognition could not understand the audio.")
            return result
        except sr.RequestError as e:
            print(f"❌ Could not request results from Google Speech Recognition service: {e}")
        except Exception as e:
            print(f"❌ Unexpected error during audio processing: {e}")


                    
            
             
      
    def _calculate_audio_level(self, audio_data: bytes) -> float:
        """
        Placeholder for calculating RMS or peak audio level.
        You can use pydub or numpy to calculate volume here.
        """
        # Example dummy value
        return -20.0  # Simulated dB level
    def _analyze_sentiment(self, text):
        """Simple keyword-based sentiment analysis"""
        positive_words = ['good', 'great', 'excellent', 'happy', 'love', 'wonderful', 'amazing']
        negative_words = ['bad', 'terrible', 'hate', 'awful', 'horrible', 'sad', 'angry']
        
        text_lower = text.lower()
        positive_count = sum(1 for word in positive_words if word in text_lower)
        negative_count = sum(1 for word in negative_words if word in text_lower)
        
        if positive_count > negative_count:
            return "Positive"
        elif negative_count > positive_count:
            return "Negative"
        else:
            return "Neutral"
    
    def _generate_dummy_response(self):
        """Generate fallback response when audio processing fails"""
        dummy_dbfs = round(random.uniform(-40.0, -10.0), 1)
        sentiments = ["Neutral", "Engaged", "Active", "Speaking"]
        sentiment = random.choice(sentiments)
        
        return {
            'transcription': '',
            'analysis': f"Audio level: {dummy_dbfs} dB, Status: {sentiment}"
        }
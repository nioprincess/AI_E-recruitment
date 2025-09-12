# quasipeer/services/media_sync.py
import asyncio
from collections import deque
from typing import Dict, Deque, Optional

class FrameBuffer:
    def __init__(self, max_size=100):
        self.buffer: Deque = deque(maxlen=max_size)
        self.current_seq = 0

    def add_frame(self, sequence: int, timestamp: int, data: any):
        self.buffer.append((sequence, timestamp, data))

    def get_next_frame(self) -> Optional[tuple]:
        if not self.buffer:
            return None
            
        # Simple implementation - just return oldest frame
        return self.buffer.popleft()

class MediaSynchronizer:
    def __init__(self):
        self.sessions: Dict[str, dict] = {}  # session_id: {audio: FrameBuffer, video: FrameBuffer}

    async def add_audio_frame(self, session_id: str, sequence: int, timestamp: int, data: str):
        """Add audio frame to synchronization buffer"""
        if session_id not in self.sessions:
            self.sessions[session_id] = {
                'audio': FrameBuffer(),
                'video': FrameBuffer()
            }
            
        self.sessions[session_id]['audio'].add_frame(sequence, timestamp, data)
        await self.try_sync(session_id)

    async def add_video_frame(self, session_id: str, sequence: int, timestamp: int, data: dict):
        """Add video frame to synchronization buffer"""
        if session_id not in self.sessions:
            self.sessions[session_id] = {
                'audio': FrameBuffer(),
                'video': FrameBuffer()
            }
            
        self.sessions[session_id]['video'].add_frame(sequence, timestamp, data)
        await self.try_sync(session_id)

    async def try_sync(self, session_id: str):
        """Attempt to synchronize audio and video frames"""
        session = self.sessions.get(session_id)
        if not session:
            return
            
        audio_frame = session['audio'].get_next_frame()
        video_frame = session['video'].get_next_frame()
        
        if audio_frame and video_frame:
            # Simple synchronization - just pair the frames
            # In a real implementation, you'd use timestamps for proper sync
            synced_data = {
                'audio': audio_frame[2],  # data
                'video': video_frame[2],   # data
                'timestamp': max(audio_frame[1], video_frame[1])
            }
            
            # In a real implementation, you'd send this to clients
            # or process it further
            print(f"Synced frame for {session_id}: {synced_data}")
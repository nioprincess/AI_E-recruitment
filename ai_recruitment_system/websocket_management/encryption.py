# quasipeer/services/encryption.py
import os
import base64
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.hkdf import HKDF
from typing import Dict, Tuple

class EncryptionService:
    def __init__(self):
        self.sessions: Dict[str, bytes] = {}  # session_id: key

    async def setup_session(self, session_id: str, client_key: str) -> None:
        """Establish shared secret using client's public key"""
        # In a real implementation, you'd use proper key exchange
        # For this example, we'll just generate a random key
        session_key = os.urandom(32)
        self.sessions[session_id] = session_key
        
        # In a real implementation, you'd derive the key properly
        # This is a simplified version
        return base64.b64encode(session_key).decode()

    async def encrypt(self, session_id: str, data: bytes) -> Tuple[bytes, bytes]:
        """Encrypt data for a session"""
        if session_id not in self.sessions:
            raise ValueError("Session not established")
            
        iv = os.urandom(12)
        cipher = Cipher(
            algorithms.AES(self.sessions[session_id]),
            modes.GCM(iv)
        )
        encryptor = cipher.encryptor()
        encrypted = encryptor.update(data) + encryptor.finalize()
        return encrypted, iv

    async def decrypt(self, session_id: str, encrypted_data: bytes, iv: bytes) -> bytes:
        """Decrypt data for a session"""
        if session_id not in self.sessions:
            raise ValueError("Session not established")
            
        cipher = Cipher(
            algorithms.AES(self.sessions[session_id]),
            modes.GCM(iv)
        )
        decryptor = cipher.decryptor()
        return decryptor.update(encrypted_data) + decryptor.finalize()
import os
from dataclasses import dataclass
from typing import Dict, Any, Optional
from langchain_openai import ChatOpenAI
from langchain_community.llms import Ollama
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.schema import BaseOutputParser
import json


@dataclass
class ModelConfig:
    """Configuration for AI models"""

    provider: str  # 'openai', 'ollama', 'anthropic', 'google', etc.
    model_name: str
    temperature: float = 0.1
    max_tokens: Optional[int] = None
    top_p: float = 1.0
    frequency_penalty: float = 0.0
    presence_penalty: float = 0.0
    timeout: int = 60


class AIConfigManager:
    """Manage AI model configurations"""

    def __init__(self):
        self.configs = {
            "cv_parser": ModelConfig(
                provider="google",
                model_name="gemini-2.5-flash",
                temperature=0.1,
                max_tokens=10000,  # Increased from 2000 to 4000
            ),
            "question_generator": ModelConfig(
                provider="google",
                model_name="gemini-2.5-flash",
                temperature=0.1,
                max_tokens=10000,  # Increased from 2000 to 4000
            ),
            "interview_question_generator": ModelConfig(
                provider="google",
                model_name="gemini-2.5-flash",
                temperature=0.1,
                max_tokens=10000,  # Increased from 2000 to 4000
            ),
            "fast_parser": ModelConfig(
                provider="google",
                model_name="gemini-2.5-flash",
                temperature=0.1,
                max_tokens=10000,  # Increased from 2000 to 4000
            ),
            "gemini_pro": ModelConfig(
                provider="google",
                model_name="gemini-2.5-flash",
                temperature=0.1,
                max_tokens=10000,  # Increased from 2000 to 4000
            ),
            "gemini_question_generator": ModelConfig(
                provider="google",
                model_name="gemini-2.5-flash",
                temperature=0.7,
                max_tokens=10000,  # Increased from 2000 to 4000
            ),
        }

    def get_model(self, config_name: str, **kwargs) -> ChatOpenAI:
        """Get configured LLM instance"""
        config = self.configs[config_name]

        if config.provider == "openai":
            return ChatOpenAI(
                model_name=config.model_name,
                temperature=config.temperature,
                max_tokens=config.max_tokens,
                top_p=config.top_p,
                frequency_penalty=config.frequency_penalty,
                presence_penalty=config.presence_penalty,
                timeout=config.timeout,
                **kwargs,
            )
        elif config.provider == "ollama":
            return Ollama(
                model=config.model_name,
                temperature=config.temperature,
                num_predict=config.max_tokens,
                **kwargs,
            )
        elif config.provider == "google":
            return ChatGoogleGenerativeAI(
                model=config.model_name,
                temperature=config.temperature,
                max_tokens=config.max_tokens,
                timeout=config.timeout,
                google_api_key="AIzaSyCRUnN5JkkqU0G73CQaVfUSq5BJlNrktvk",
                client_options={"api_endpoint": "generativelanguage.googleapis.com"},
                **kwargs,
            )
        else:
            raise ValueError(f"Unsupported provider: {config.provider}")

    def update_config(self, config_name: str, **kwargs):
        """Update model configuration"""
        if config_name in self.configs:
            for key, value in kwargs.items():
                if hasattr(self.configs[config_name], key):
                    setattr(self.configs[config_name], key, value)

    def add_config(self, config_name: str, config: ModelConfig):
        """Add a new model configuration"""
        self.configs[config_name] = config

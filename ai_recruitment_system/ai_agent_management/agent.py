from typing import Dict, List, Any, Optional
from .ai_models import AIConfigManager
from .utils import TextExtractor, ChainBuilder
import os


class AIAgent:
    """Main AI agent for CV parsing and question generation"""

    def __init__(self, api_key: Optional[str] = None):
        self.config_manager = AIConfigManager()
        self.chain_builder = ChainBuilder(self.config_manager)
        self.text_extractor = TextExtractor()

        # Update API key if provided
        if api_key:
            self.update_api_key(api_key)

    def update_api_key(self, api_key: str):
        """Update API key for all models"""
        os.environ["OPENAI_API_KEY"] = api_key

    def update_model_config(self, config_name: str, **kwargs):
        """Update model configuration"""
        self.config_manager.update_config(config_name, **kwargs)

    def parse_cv(self, cv_text: str, use_fast_model: bool = False) -> Dict[str, Any]:

        try:

            cleaned_text = TextExtractor.clean_text(cv_text)

            # Choose model based on text length
            if len(cleaned_text) > 5000:
                use_fast_model = True

            # Create and run parsing chain
            chain = self.chain_builder.create_cv_parsing_chain(use_fast_model)
            result = chain.run(cv_text=cleaned_text)

            return {
                "success": True,
                "parsed_data": result,
                "text_length": len(cleaned_text),
                "model_used": "fast" if use_fast_model else "detailed",
            }

        except Exception as e:
            return {"success": False, "error": str(e), "parsed_data": {}}

    def screen_applications(
        self, applications_data, use_fast_model: bool = False
    ) -> Dict[str, Any]:

        try:

            # Create and run parsing chain
            chain = self.chain_builder.create_candidates_screening_chain(use_fast_model)
            result = chain.run(applications_data=applications_data)

            return {
                "success": True,
                "parsed_data": result,
                "text_length": len(applications_data),
                "model_used": "fast" if use_fast_model else "detailed",
            }

        except Exception as e:
            return {"success": False, "error": str(e), "parsed_data": {}}

    def generate_questions(
        self, question_type: str, applications_data: Dict[str, Any], num_questions: int
    ) -> Dict[str, Any]:
        """Generate interview questions based on CV data"""
        try:

            # Create and run question generation chain
            chain = self.chain_builder.create_question_generation_chain(question_type)
            result = chain.run(
                applications_data=applications_data, num_questions=num_questions
            )

            return {"success": True, "questions": result}

        except Exception as e:
            return {"success": False, "error": str(e), "generated_questions": {}}

    def generate_next_interview_question(
        self,
        company_info,
        job_description,
        cv_content,
        application_letter,
        previous_questions,
        exam_duration,
        current_time
    ) -> Dict[str, Any]:
        """Generate interview questions based on CV data"""
        try:

            # Create and run question generation chain
            chain = self.chain_builder.create_interview_question_chain(
                company_info,
                job_description,
                cv_content,
                application_letter,
                previous_questions,
                exam_duration,
                current_time
            )
            result = chain.run(
                company_info=company_info,
                job_description=job_description,
                cv_content=cv_content,
                application_letter=application_letter,
                previous_questions=previous_questions,
                exam_duration=exam_duration,
                current_time= current_time
            )

            return {"success": True, "questions": result}

        except Exception as e:
            return {"success": False, "error": str(e), "generated_questions": {}}

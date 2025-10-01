import re
import json
import pdfplumber
import docx2txt
from typing import Dict, List, Any, Optional
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from langchain.schema import BaseOutputParser


class JSONOutputParser(BaseOutputParser):
    """Parse LLM output as JSON with fallback"""

    def parse(self, text: str) -> Dict[str, Any]:
        try:
            # Try to find JSON in text
            json_match = re.search(r"\{.*\}", text, re.DOTALL)
            if json_match:
                return json.loads(json_match.group())
            else:
                return {"raw_output": text.strip()}
        except json.JSONDecodeError:
            return {"error": "Invalid JSON", "raw_output": text.strip()}


class TextExtractor:
    """Helper functions for text extraction from various formats"""

    @staticmethod
    def extract_text_from_pdf(file_path: str) -> str:
        """Extract text from PDF file"""
        text = ""
        try:
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages:
                    text += page.extract_text() or ""
            return text.strip()
        except Exception as e:
            raise Exception(f"PDF extraction error: {str(e)}")

    @staticmethod
    def extract_text_from_docx(file_path: str) -> str:
        """Extract text from DOCX file"""
        try:
            return docx2txt.process(file_path)
        except Exception as e:
            raise Exception(f"DOCX extraction error: {str(e)}")

    @staticmethod
    def extract_text_from_txt(file_path: str) -> str:
        """Extract text from TXT file"""
        try:
            with open(file_path, "r", encoding="utf-8") as file:
                return file.read()
        except Exception as e:
            raise Exception(f"Text file reading error: {str(e)}")

    @staticmethod
    def clean_text(text: str, max_length: int = 10000) -> str:
        """Clean and truncate text for LLM processing"""
        # Remove extra whitespace
        text = re.sub(r"\s+", " ", text)
        # Truncate if too long
        if len(text) > max_length:
            text = text[:max_length] + "... [truncated]"
        return text.strip()


class PromptTemplates:
    """Collection of prompt templates for different tasks"""

    @staticmethod
    def get_cv_parsing_template() -> PromptTemplate:
        """Template for CV parsing"""
        template = """
        Extract structured information from the following CV text. 
        Return ONLY valid professional Markdown formatted text
        
        CV Text:
        {cv_text}

        Return valid Markdown only:
        """

        return PromptTemplate(
            template=template,
            input_variables=["cv_text"],
            output_parser=JSONOutputParser(),
        )

    @staticmethod
    def get_candidate_screening_template() -> PromptTemplate:
        """Template for candidate screening"""
        template = """
        Screen the following candidates based on their application letter, CV content, and job requirements.
        Return ONLY valid JSON that includes application_id, decision (accepted/rejected), and reasons.
        
        Applications Data:
        {applications_data}

        Return valid JSON only:
        """

        return PromptTemplate(
            template=template,
            input_variables=["cv_text"],
            output_parser=JSONOutputParser(),
        )

    @staticmethod
    def get_hr_behavioral_questions_template() -> PromptTemplate:
        """Template for AI interviewer HR/behavioral question generation - one question at a time"""
        template = """
    You are an AI HR interviewer conducting a behavioral interview. Generate exactly ONE next question that continues the conversation naturally.

    **CONTEXTUAL DATA:**
    - Company: {company_info}
    - Job Role: {job_description} 
    - Candidate CV: {cv_content}

    **CONVERSATION STATE:**
    - Previous questions asked: {previous_questions}
    - Conversation duration: {exam_duration} minutes
    - Current time:{current_time} secs
    

    **GENERATION STRATEGY:**
    if there is already asked questions
    FOLLOW-UP MODE: 
    - Build directly on the candidate's last response or previous discussion
    - Probe deeper into specific experiences or competencies mentioned
    - Maintain natural conversational flow
    - Avoid repeating previously covered topics unless for deeper exploration
     if no questions
    FIRST QUESTION MODE:
    - Create an engaging opening question that builds rapport
    - Reference specific elements from the candidate's application letter to show you've read it
    - Connect their background and motivations to the role/company
    - Set positive, conversational tone for the interview
    - Focus on understanding their motivation and initial fit
     
    **APPLICATION LETTER INTEGRATION:**
    Pay special attention to these elements from their application letter:
    - Key motivations and interests mentioned 
    - Specific connections to our company/role 
    - Career goals and aspirations
    Application letter content:
    {application_letter}

    **QUESTION GENERATION RULES:**
    1. Generate exactly ONE question
    2. Make it conversational and open-ended
    3. Connect to their background, application letter, or previous discussion
    4. Focus on behavioral competencies (teamwork, leadership, problem-solving, adaptability, etc.)
    5. Ensure it feels like a natural next question in this interview

    **OUTPUT FORMAT (strict JSON):**
    {{
        "next_question": {{
            "question": "the actual question text",
            "session_ended":"yes"|"no" will be yes if no more information needed from candidate when inteview concluded otherwise no.
            "focus_area": "specific competency being evaluated",
            "question_type": "opening|follow_up|probing|situational|closing",
            "rationale": "why this question is relevant now and how it connects to candidate background",
            "expected_answer_elements": ["key element 1", "key element 2", "key element 3"],
            "potential_follow_up_paths": ["path 1", "path 2"]
        }},
   
    }}

    **Remember:** You are generating ONE question that continues this specific interview conversation and don't forward or imagine user response when they haven't responded yet continue when you see it is possible and respect time and when session marked as ended give user non respondable  messages for no further interactions.
    """

        return PromptTemplate(
            template=template,
            input_variables=[
                "company_info",
                "job_description",
                "cv_content",
                "application_letter",
                "previous_questions",
                "exam_duration",
                "current_time"
            ],
            output_parser=JSONOutputParser(),
        )

    @staticmethod
    def get_technical_questions_template() -> PromptTemplate:
        """Template for technical question generation"""
        template = """
        Generate {num_questions}  Industry technical written  mixed questions based on the candidate's cv and job requirements and description.
        
        from application data :
        {applications_data}
        
        For each question, include:
        - Question text
        - Question type (multiple-choice, short-answer, essay)
        - Difficulty level (easy/medium/hard)
        - Target skill
        - expected answer
        - Brief answer guidelines
        
        Return JSON format by respecting all the following format strictly:
           "application_id":"application",
            "questions": 
                
                    "question": "question text",
                    "difficulty": "easy/medium/hard",
                    choices: ["option1", "option2", "option3", "option4"] (only for multiple-choice),
                    "question_type": "multiple-choice/short-answer/essay",
                    "target_skill": "specific technology or concept",
                    "expected_answer": "what a good answer should include",
                    "answer_guidelines": "what to look for in answers"
                
            
        
        """

        return PromptTemplate(
            template=template,
            input_variables=["num_questions", "application_data"],
            output_parser=JSONOutputParser(),
        )

    @staticmethod
    def get_Coding_questions_template() -> PromptTemplate:
        """Template for coding question generation"""
        template = """
        Generate {num_questions}  coding challenge questions suitable for a technical interview, based on the candidate's work experience.

        from application data :
        {applications_data}

        Focus on areas such as:
        - Algorithmic problem-solving
        - Data structures
        - Code optimization
        - Debugging and troubleshooting
        - Real-world application scenarios

        Use known coding question types such as:
        - Function implementation
        - Code review
        - Bug fixing
        - Algorithm design
        - Data structure manipulation

        For each question, include:
        - Question text (describe the coding challenge)
        - Question type (function implementation, code review, bug fixing, algorithm design, data structure manipulation)
        - Competency area (e.g., algorithms, data structures, debugging)
        - What to assess (e.g., logical thinking, code efficiency, correctness)
        - Difficulty level (easy/medium/hard)
        - Expected solution outline

        Return JSON format by respecting all the following format strictly:
          "application_id":"application",
            "questions": 
            
                "question": "question text",
                "difficulty": "easy/medium/hard",
                "question_type": "function-implementation/code-review/bug-fixing/algorithm-design/data-structure-manipulation",
                "target_skill": "specific technology or concept",
                 choices: ["option1", "option2", "option3", "option4"] (only for multiple-choice),
                "expected_answer": "what a good answer should include",
                "answer_guidelines": "what to look for in answers"
            
            
        
        """

        return PromptTemplate(
            template=template,
            input_variables=["num_questions", "application_data"],
            output_parser=JSONOutputParser(),
        )

    @staticmethod
    def get_aptitude_questions_template() -> PromptTemplate:
        """Template for aptitude question generation"""
        template = """
        Generate {num_questions}  aptitude test questions suitable for candidate assessment, based on the job requirements and description.

        from application data :
        {applications_data}


        Focus on areas such as:
        - Logical reasoning
        - Quantitative aptitude
        - Verbal ability
        - Analytical thinking

        For each question, include:
        - Question text
        - Question type (multiple-choice, short-answer)
        - Difficulty level (easy/medium/hard)
        - Target skill (e.g., logical reasoning, quantitative aptitude)
        - Correct answer
        - Brief explanation

        Return JSON format by respecting all the following format strictly:
           "application_id":"application",
            "questions": 
                
                    "question": "question text",
                    "difficulty": "easy/medium/hard",
                    "question_type": "multiple-choice/short-answer/essay",
                    "target_skill": "specific technology or concept",
                     choices: ["option1", "option2", "option3", "option4"] (only for multiple-choice),
                    "expected_answer": "what a good answer should include",
                    "answer_guidelines": "what to look for in answers"
                
            
        
        """

        return PromptTemplate(
            template=template,
            input_variables=["num_questions", "application_data"],
            output_parser=JSONOutputParser(),
        )

    @staticmethod
    def get_aptitude_questions_template() -> PromptTemplate:
        """Template for aptitude question generation"""
        template = """
        Generate {num_questions}  aptitude test questions suitable for candidate assessment, based on the job requirements and description.

        from application data :
        {applications_data}


        Focus on areas such as:
        - Logical reasoning
        - Quantitative aptitude
        - Verbal ability
        - Analytical thinking

        For each question, include:
        - Question text
        - Question type (multiple-choice, short-answer)
        - Difficulty level (easy/medium/hard)
        - Target skill (e.g., logical reasoning, quantitative aptitude)
        - Correct answer
        - Brief explanation

        Return JSON format by respecting all the following format strictly:
          "application_id":"application",
            "questions": 
                
                    "question": "question text",
                    "difficulty": "easy/medium/hard",
                    "question_type": "multiple-choice/short-answer/essay",
                    "target_skill": "specific technology or concept",
                     choices: ["option1", "option2", "option3", "option4"] (only for multiple-choice),
                    "expected_answer": "what a good answer should include",
                    "answer_guidelines": "what to look for in answers"
                
            
        
        """

        return PromptTemplate(
            template=template,
            input_variables=["num_questions", "application_data"],
            output_parser=JSONOutputParser(),
        )

    @staticmethod
    def get_interview_questions_template() -> PromptTemplate:
        """Template for interview question generation"""
        template = """
        Generate {num_questions}  interview questions suitable for assessing a candidate for this job, based on the candidate's CV, job requirements, and job description.

        from application data :
        {applications_data}

        Focus on areas such as:
        - Behavioral and situational questions
        - Role-specific competencies
        - Communication and teamwork
        - Problem-solving and adaptability

        For each question, include:
        - Question text
        - Question type (behavioral, situational, technical, general)
        - Difficulty level (easy/medium/hard)
        - Target competency or skill
        - Expected answer outline
        - Brief interviewer guidelines

        Return JSON format by respecting all the following format strictly:
          "application_id":"application",
            "questions": 
                
                    "question": "question text",
                    "difficulty": "easy/medium/hard",
                    "question_type": "behavioral/situational/technical/general",
                    "target_skill": "competency or skill being assessed",
                    "expected_answer": "what a good answer should include",
                    "answer_guidelines": "what to look for in answers"
                
            
        
        """

        return PromptTemplate(
            template=template,
            input_variables=["num_questions", "application_data"],
            output_parser=JSONOutputParser(),
        )


class ChainBuilder:
    """Helper to build LLM chains with different configurations"""

    def __init__(self, config_manager):
        self.config_manager = config_manager

    def create_chain(self, task_type: str, prompt_template: PromptTemplate, **kwargs):
        """Create LLM chain for specific task"""
        llm = self.config_manager.get_model(task_type, **kwargs)
        return LLMChain(llm=llm, prompt=prompt_template)

    def create_cv_parsing_chain(self, use_fast_model: bool = False):
        """Create CV parsing chain"""
        task_type = "fast_parser" if use_fast_model else "cv_parser"
        template = PromptTemplates.get_cv_parsing_template()
        return self.create_chain(task_type, template)

    def create_candidates_screening_chain(self, use_fast_model: bool = False):
        """Create candidates screening chain"""
        task_type = "fast_parser" if use_fast_model else "cv_parser"
        template = PromptTemplates.get_candidate_screening_template()
        return self.create_chain(task_type, template)

    def create_question_generation_chain(self, question_type: str):
        """Create question generation chain"""
        template_mapping = {
            "written": PromptTemplates.get_technical_questions_template(),
            "coding": PromptTemplates.get_Coding_questions_template(),
            "aptitude": PromptTemplates.get_aptitude_questions_template(),
            "Interview": PromptTemplates.get_interview_questions_template(),
        }
        template = template_mapping.get(question_type)
        if not template:
            raise ValueError(f"Unsupported question type: {question_type}")

        return self.create_chain("question_generator", template)

    def create_interview_question_chain(
        self,
        company_info,
        job_description,
        cv_content,
        application_letter,
        previous_questions,
        exam_duration,
        current_time
    ):
        """Create question generation chain"""

        template = PromptTemplates.get_hr_behavioral_questions_template()

        return self.create_chain("interview_question_generator", template)

from celery import shared_task
from .agent import AIAgent
from user_management.models import Cv, User
import json
from job_management.models import Application, ApplicationStage
import json
from django.utils import timezone
import time
from examination_management.models import ExamQuestion, ApplicationExam
import re
from company_management.models import Company
from examination_management.models import InterviewQuestion, InterviewResponse
from websocket_management.utils import process_ai_response

agent = AIAgent()


@shared_task
def parse_cv_task(user_id, cv_text: str, use_fast_model: bool = False) -> dict:
    """Celery task to parse CV text"""
    try:
        user = User.objects.get(id=user_id)
        result = agent.parse_cv(cv_text, use_fast_model)
        print(f"Parsing CV for user {user_id}: {result}")

        if result["success"]:
            Cv.objects.update(
                user_id=user, parsed_data=json.dumps(result["parsed_data"])
            )

    except Exception as e:
        print(f"Error parsing CV for user {user_id}: {str(e)}")
        return {"success": False, "error": str(e)}


@shared_task
def screen_candidates_applications(
    application_ids, use_fast_model: bool = False
) -> dict:
    """Celery task to parse CV text"""
    try:
        applications_data = []
        applications = Application.objects.filter(
            id__in=application_ids
        ).select_related("u_id")
        for app in applications:
            user = app.u_id
            cv_content = Cv.objects.filter(user_id=user).first()
            application_letter_content = app.a_cover_letter_content
            job_requirements = app.j_id.j_requirements if app.j_id else ""
            job_description = app.j_id.j_description if app.j_id else ""

            if not cv_content or not application_letter_content:
                continue

            applications_data.append(
                {
                    "application_id": app.id,
                    "user_id": user.id,
                    "cv_content": cv_content.c_content,
                    "application_letter": application_letter_content,
                    "job_requirements": job_requirements,
                    "job_description": job_description,
                }
            )
        print(f"Applications data for screening: {applications_data}")

        result = agent.screen_applications(applications_data, use_fast_model)
        print(f"Screening result: {result}")

        if result["success"]:
            print(f"Screening result: {result }")
            json_str = result["parsed_data"].strip("```json\n").strip("```")
            parsed_list = json.loads(json_str)
            print(f"Parsed screening result: {parsed_list}")
            for res in parsed_list:
                app_id = res.get("application_id")
                decision = res.get("decision")
                reasons = res.get("reasons", "")
                try:
                    application = Application.objects.get(id=app_id)
                    application.status = (
                        "accepted" if decision == "accepted" else "rejected"
                    )
                    application.save()

                    existing_stages = ApplicationStage.objects.filter(
                        a_id=application.id
                    )
                    if existing_stages.exists():
                        existing_stages.update(
                            s_completed=True, s_ended_at=timezone.now()
                        )

                    if ApplicationStage.objects.filter(
                        a_id=application.id, s_name=decision
                    ).exists():
                        ApplicationStage.objects.filter(
                            a_id=application.id, s_name=decision
                        ).update(
                            s_completed=False,
                            s_notes=(
                                "".join(reasons)
                                if isinstance(reasons, list)
                                else reasons
                            ),
                            s_ended_at=None,
                        )
                    else:
                        ApplicationStage.objects.create(
                            a_id=application,
                            s_name="accepted" if decision == "accepted" else "rejected",
                            s_completed=True,
                            s_notes=(
                                "".join(reasons)
                                if isinstance(reasons, list)
                                else reasons
                            ),
                            s_started_at=timezone.now(),
                            s_ended_at=None,
                        )
                except Application.DoesNotExist:
                    print(f"Application with id {app_id} does not exist.")
                except Exception as e:
                    print(f"Error updating application {app_id}: {str(e)}")

    except Exception as e:
        print(f"Error screening applications {application_ids}: {str(e)}")
        return {"success": False, "error": str(e)}


@shared_task
def generate_exam_questions(application_exam_mapping, exam_type) -> dict:
    """Celery task to generate exam questions based on application data"""
    try:
        applications_data = []
        applications = Application.objects.filter(
            id__in=[mapping[0] for mapping in application_exam_mapping]
        ).select_related("u_id")

        for app in applications:
            user = app.u_id
            cv_content = Cv.objects.filter(user_id=user).first()

            job_requirements = app.j_id.j_requirements if app.j_id else ""
            job_description = app.j_id.j_description if app.j_id else ""

            applications_data.append(
                {
                    "application_id": app.id,
                    "cv_content": cv_content.c_content if cv_content else "",
                    "job_description": job_description,
                    "job_requirements": job_requirements,
                }
            )

        for application_data in applications_data:
            app_id = application_data.get("application_id")
            print(f"Processing application ID: {app_id}")

            if exam_type.lower() == "interview":
                continue

            result = agent.generate_questions(exam_type, application_data, 5)
            print(f"Screening result: {result}")

            if not result.get("success") or not result.get("questions"):
                print(f"No questions generated for application {app_id}")
                continue

            try:
                # Extract and clean JSON string
                json_str = result["questions"].strip()

                # Remove code block markers if present
                if json_str.startswith("```json"):
                    json_str = json_str[7:].strip()
                if json_str.endswith("```"):
                    json_str = json_str[:-3].strip()

                print(f"Cleaned JSON string length: {len(json_str)}")
                print(f"First 500 chars: {json_str[:500]}...")

                # Validate JSON structure before parsing
                if not is_valid_json_structure(json_str):
                    print(f"Invalid JSON structure for application {app_id}")
                    # Try to get at least the first complete question
                    fixed_json = extract_complete_questions(json_str)
                    if fixed_json:
                        parsed_data = json.loads(fixed_json)
                        app_exam_tuple = next(
                            (t for t in application_exam_mapping if t[0] == app_id),
                            None,
                        )
                        if app_exam_tuple:
                            process_questions_for_application(
                                parsed_data, app_exam_tuple
                            )
                    else:
                        print(
                            f"Could not extract valid questions from truncated JSON for application {app_id}"
                        )
                        continue
                else:
                    # Parse the complete JSON
                    parsed_data = json.loads(json_str)
                    app_exam_tuple = next(
                        (t for t in application_exam_mapping if t[0] == app_id), None
                    )
                    if app_exam_tuple:
                        process_questions_for_application(parsed_data, app_exam_tuple)

            except json.JSONDecodeError as e:
                print(f"JSON parsing error for application {app_id}: {e}")
                # Try to extract what we can from the truncated response
                extracted_data = extract_questions_from_truncated_json(json_str, app_id)
                if extracted_data and extracted_data.get("questions"):
                    app_exam_tuple = next(
                        (t for t in application_exam_mapping if t[0] == app_id), None
                    )
                    if app_exam_tuple:
                        process_questions_for_application(parsed_data, app_exam_tuple)
                else:
                    print(
                        f"Could not extract any questions from JSON for application {app_id}"
                    )

            except Exception as e:
                print(f"Error processing questions for application {app_id}: {str(e)}")

            time.sleep(60)

    except Exception as e:
        print(f"Error screening applications {application_exam_mapping}: {str(e)}")
        return {"success": False, "error": str(e)}

    return {"success": True, "message": "Exam questions generation completed"}


def is_valid_json_structure(json_str):
    """Check if JSON has complete structure"""
    try:
        # Quick validation without full parsing
        return (
            json_str.strip().startswith("{")
            and '"questions"' in json_str
            and '"application_id"' in json_str
        )
    except:
        return False


def extract_complete_questions(json_str):
    """Extract complete questions from potentially truncated JSON"""
    try:
        # Find the questions array and extract complete question objects
        questions_match = re.search(r'"questions":\s*\[(.*?)\]', json_str, re.DOTALL)
        if not questions_match:
            return None

        questions_content = questions_match.group(1)

        # Extract complete question objects (those that have both { and })
        complete_questions = []
        brace_count = 0
        current_question = ""

        for char in questions_content:
            current_question += char
            if char == "{":
                brace_count += 1
            elif char == "}":
                brace_count -= 1
                if brace_count == 0:
                    # Found a complete question object
                    complete_questions.append(current_question.strip())
                    current_question = ""

        if complete_questions:
            # Reconstruct valid JSON with complete questions only
            fixed_json = f'{{"application_id": 17, "questions": [{",".join(complete_questions)}]}}'
            return fixed_json

        return None
    except Exception as e:
        print(f"Error extracting complete questions: {e}")
        return None


def extract_questions_from_truncated_json(json_str, app_id):
    """Extract questions from truncated JSON response"""
    try:
        # Extract application_id if present
        app_id_match = re.search(r'"application_id":\s*(\d+)', json_str)
        extracted_app_id = app_id_match.group(1) if app_id_match else app_id

        # Find the questions array start
        questions_start = json_str.find('"questions": [')
        if questions_start == -1:
            return None

        # Extract from questions array start to end of string
        questions_section = json_str[questions_start + 13 :]  # Skip '"questions": ['

        # Find complete question objects
        question_objects = []
        current_obj = ""
        brace_count = 0
        in_string = False
        escape_next = False

        for char in questions_section:
            if escape_next:
                current_obj += char
                escape_next = False
                continue

            if char == "\\":
                current_obj += char
                escape_next = True
                continue

            if char == '"' and not escape_next:
                in_string = not in_string

            if not in_string:
                if char == "{":
                    brace_count += 1
                elif char == "}":
                    brace_count -= 1
                    if brace_count == 0:
                        current_obj += char
                        question_objects.append(current_obj.strip())
                        current_obj = ""
                        continue
                elif brace_count == 0 and char == "]":
                    break

            current_obj += char

            # Safety break if we've gone too far without finding complete objects
            if len(current_obj) > 10000:
                break

        if question_objects:
            # Create valid JSON with extracted questions
            valid_questions = []
            for q_obj in question_objects:
                try:
                    # Validate this is a complete question object
                    question_data = json.loads(q_obj)
                    if question_data.get("question"):
                        valid_questions.append(q_obj)
                except:
                    continue

            if valid_questions:
                return {
                    "application_id": int(extracted_app_id),
                    "questions": [json.loads(q) for q in valid_questions],
                }

        return None

    except Exception as e:
        print(f"Error extracting from truncated JSON: {e}")
        return None


def process_questions_for_application(parsed_data, app_exam_tuple):
    """Process questions for a specific application"""
    try:
        application = Application.objects.get(id=app_exam_tuple[0])
        application.status = "exam_generated"
        application.save()

        # Get the questions array from parsed data
        questions = parsed_data.get("questions", [])

        if not questions:
            print(
                f"No questions found in parsed data for application {app_exam_tuple[0]}"
            )
            return

        # Get or create the exam for this application
        exam = ApplicationExam.objects.get(
            a_id=application,
            id=app_exam_tuple[1],
        )

        created_count = 0
        for q in questions:
            question_text = q.get("question", "").strip()
            if not question_text:  # Skip empty questions
                continue

            choices = q.get("choices", [])
            correct_answer = q.get("expected_answer", "")
            question_type = q.get("question_type", "short-answer")

            exam_question = ExamQuestion.objects.create(
                e=exam,
                q_text=question_text,
                q_choices=json.dumps(choices) if choices else "[]",
                q_correct_answer=correct_answer,
                q_ai_generated=True,
                q_score_weight=1.0,
                q_type=question_type,
            )
            created_count += 1
            print(
                f"Created ExamQuestion {exam_question.id} for Application {app_exam_tuple[0]}"
            )

        print(
            f"Successfully created {created_count} questions for application {app_exam_tuple[0]}"
        )

    except Application.DoesNotExist:
        print(f"Application with id {app_exam_tuple[0]} does not exist.")
    except Exception as e:
        print(f"Error updating application {app_exam_tuple[0]}: {str(e)}")


@shared_task
def generate_next_interview_question(applicationExamId, user_id) -> dict:
    """Celery task to generate exam questions based on application data"""
    try:

        applicationExam = ApplicationExam.objects.get(id=applicationExamId)
        exam_duration = applicationExam.e_id.e_duration
        app = applicationExam.a_id
        user = User.objects.get(id=user_id)
        company = Company.objects.get(id=app.j_id.c_id.id)
        cv_content = Cv.objects.filter(user_id=user).first()
        job_requirements = app.j_id.j_requirements if app.j_id else ""
        job_description = app.j_id.j_description if app.j_id else ""
        conversation = []
        company_info = company.c_description
        application_letter_content = app.a_cover_letter_content
        questions = InterviewQuestion.objects.filter(e=applicationExam).order_by(
            "created_at"
        )
        for q in questions:
            answer = InterviewResponse.objects.filter(q=q).first()
            print(q.q_text, answer.r_text, sep=" ")
            convo = {
                "question": {"text": q.q_text, "asked_at": f"{q.current_time}secs ago"},
                "answer": {
                    "text": answer.r_text,
                    "answered_at": f"{answer.current_time} secs ago",
                },
            }
            conversation.append(convo)
     
        result = agent.generate_next_interview_question(
            company_info=company_info,
            job_description=job_description + job_requirements,
            cv_content=cv_content,
            application_letter=application_letter_content,
            previous_questions=json.dumps(conversation),
            exam_duration=exam_duration,
            current_time=applicationExam.current_time
        )
        if result["success"] == True:
            parsed_data = parse_questions_data(result)
            if parsed_data:

                next_question = parsed_data["questions"]["next_question"]
                print(next_question)
                expectedAnswer = ""
                session_ended= next_question["session_ended"]
                if session_ended=="yes":
                    applicationExam.exam_ended=True
                    applicationExam.save()
                for element in next_question["expected_answer_elements"]:
                    expectedAnswer += f"  - {element}"
                new_question = InterviewQuestion.objects.create(
                    e=applicationExam,
                    q_text=next_question["question"],
                    q_ai_generated=True,
                    q_score_weight=1,
                    q_type=next_question["question_type"],
                    q_correct_answer=expectedAnswer,
                )
                new_answer = InterviewResponse.objects.create(
                    q=new_question,
                    r_text="",
                )
                p_question = None
                if len(questions)>0:
                    p_question= questions[0]
                else:
                    p_question=new_question
                p_answer = answer = InterviewResponse.objects.filter(
                    q=p_question
                ).first()
                ai_response = {
                    "user_id": user.id,
                    "p_question": {
                        "q_id": p_question.id,
                        "q_text": p_question.q_text,
                        "a_id": p_answer.id,
                        "a_text": p_answer.r_text,
                    },
                    "n_question": {
                        "q_id": new_question.id,
                        "q_text": new_question.q_text,
                        "a_id": new_answer.id,
                        "a_text": new_answer.r_text,
                    },
                    "hangup":True if session_ended=="yes" else False
                }
                ai_response_str = json.dumps(ai_response)
                process_ai_response(ai_response_str, user.id)
                for element in next_question["expected_answer_elements"]:
                    print(f"  - {element}")

                print("\nPotential Follow-up Paths:")
                for path in next_question["potential_follow_up_paths"]:
                    print(f"  - {path}")

                # You can also access individual fields directly:
                print(
                    f"\nDirect access example - Question: {parsed_data['questions']['next_question']['question']}"
                )
            else:
                print("Failed to parse data")

    except Exception as e:
        print(f"Error screening applications  {str(e)}")
        return {"success": False, "error": str(e)}

    return {"success": True, "message": "Exam questions generation completed"}


def parse_questions_data(data):
    """
    Parse the nested JSON structure from the questions field
    """
    try:
        # Extract the JSON string from the markdown code block
        questions_str = data["questions"]

        # Remove the markdown code block markers (```json and ```)
        if questions_str.startswith("```json"):
            questions_str = questions_str[7:]  # Remove '```json'
        if questions_str.endswith("```"):
            questions_str = questions_str[:-3]  # Remove '```'

        # Parse the JSON string
        questions_data = json.loads(questions_str.strip())

        return {"success": data["success"], "questions": questions_data}

    except json.JSONDecodeError as e:
        print(f"Error parsing JSON: {e}")
        return None
    except KeyError as e:
        print(f"Missing key in data: {e}")
        return None

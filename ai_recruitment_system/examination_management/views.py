from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from job_management.serializers import ApplicationExamSerializer
from .models import (
    Exam,
    ExamNoiseHistory,
    ExamQuestion,
    ExamAnswer,
    ExamObservation,
    InterviewQuestion,
    InterviewResponse,
    InterviewObservation,
)
from .serializers import (
    ExamNoiseHistorySerializer,
    ExamSerializer,
    ExamQuestionSerializer,
    ExamAnswerSerializer,
    ExamObservationSerializer,
    InterviewQuestionSerializer,
    InterviewResponseSerializer,
    InterviewObservationSerializer,
)
from job_management.models import Application
from django.contrib.auth import get_user_model
from rest_framework import serializers
import json
from .models import ApplicationExam
from ai_agent_management.tasks import generate_exam_questions, generate_next_interview_question

User = get_user_model()


class ApplicationExamViewSet(viewsets.ModelViewSet):
    queryset= ApplicationExam.objects.all()
    serializer_class= ApplicationExamSerializer
class ExamNoiseHistoryViewSet(viewsets.ModelViewSet):
    queryset= ExamNoiseHistory.objects.all()
    serializer_class= ExamNoiseHistorySerializer

class ExamViewSet(viewsets.ModelViewSet):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        a_ids = data.get("a_ids", [])
        exam_data = data.copy()
        serializer = self.get_serializer(data=exam_data)
        serializer.is_valid(raise_exception=True)
        exam = serializer.save()
        serializer = self.get_serializer(exam)
        app_exam_ids_mapping = []

        if a_ids:
            if isinstance(a_ids, str):

                try:
                    a_ids = json.loads(a_ids)
                except json.JSONDecodeError:
                    a_ids = [int(id.strip()) for id in a_ids.split(",") if id.strip()]

            for a_id in a_ids:
                try:
                    application = Application.objects.get(id=a_id)
                    appexam=ApplicationExam.objects.create(a_id=application, e_id=exam)
                    app_exam_ids_mapping.append((application.id, appexam.id))
                except Application.DoesNotExist:
                    continue
        generate_exam_questions.delay(app_exam_ids_mapping, exam.e_type)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        # This will only be called for single exam creation
        if "a_id" not in serializer.validated_data:
            raise serializers.ValidationError({"a_id": "This field is required."})
        serializer.save()

    @action(detail=False, methods=["get"])
    def my_exams(self, request):
        user = request.user
        if user.u_role == "recruiter":

            exams = Exam.objects.filter(j_id__c_id__c_admin=user)
            serializer = self.get_serializer(exams, many=True)
            return Response(
                {
                    "success": True,
                    "data": serializer.data,
                    "message": "Exams retrieved successfully",
                }
            )
        else:

            exams = ApplicationExam.objects.filter(a_id__u_id=user)
            serializer = ApplicationExamSerializer(exams, many=True)
            return Response(
                {
                    "success": True,
                    "data": serializer.data,
                    "message": "Exams retrieved successfully",
                }
            )

    @action(detail=False, methods=["get", "post"])
    def questions(self, request, pk=None):
        exam_id= request.GET.get("examId")
        print(exam_id)
        exam = ApplicationExam.objects.get(id=exam_id)
        print(exam)
        if request.method == "GET":
            questions = ExamQuestion.objects.filter(e=exam)
            serializer = ExamQuestionSerializer(questions, many=True)
            return Response({
                "success":True,
                "data":serializer.data,
                "message":"Questions retrieved Successfully"
            })
        elif request.method == "POST":
            data = request.data.copy()
            data["e"] = pk
            serializer = ExamQuestionSerializer(data=data)
            if serializer.is_valid():
                serializer.save(e=exam)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    @action(detail=False, methods=["get"], url_path="current-question")
    def current_question(self, request, pk=None):
        q_id= request.GET.get("qId")
        question = ExamQuestion.objects.get(id=q_id)
        serializer = ExamQuestionSerializer(question)
        return Response({
                "success":True,
                "data":serializer.data,
                "message":"Question retrieved Successfully"
            })
       

    @action(detail=True, methods=["get"])
    def observations(self, request, pk=None):
        exam = self.get_object()
        observations = exam.examobservation_set.all()
        serializer = ExamObservationSerializer(observations, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["post"])
    def submit(self, request, pk=None):
        exam = self.get_object()
        # Add your submission logic here
        exam.e_status = "submitted"
        exam.save()
        return Response({"status": "exam submitted"})


class ExamQuestionViewSet(viewsets.ModelViewSet):
    queryset = ExamQuestion.objects.all()
    serializer_class = ExamQuestionSerializer

    @action(detail=True, methods=["get", "post"])
    def answers(self, request, pk=None):
        question = self.get_object()
        if request.method == "GET":
            answers = question.examanswer_set.all()
            serializer = ExamAnswerSerializer(answers, many=True)
            return Response(serializer.data)
        elif request.method == "POST":
            serializer = ExamAnswerSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(q=question)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    @action(detail=False, methods=["get", "post"], url_path="my-exam-questions")
    def my_exam_questions(self, request, pk=None):
        exam_id= request.GET.get("examId")
        exam= ApplicationExam(id=exam_id)
      
        questions=ExamQuestion.objects.filter(e=exam)
        serializer = ExamQuestionSerializer(questions, many=True)
        return Response(serializer.data)
    


class ExamAnswerViewSet(viewsets.ModelViewSet):
    queryset = ExamAnswer.objects.all()
    serializer_class = ExamAnswerSerializer
    
    @action(detail=False, methods=["post"], url_path="start_answer")
    def start_answer(self, request):
        q_id = request.GET.get("qId")
        
        # Fetch the complete question object from database
        try:
            question = ExamQuestion.objects.select_related('e').get(id=q_id)
        except ExamQuestion.DoesNotExist:
            return Response({
                "success": False,
                "message": "Question not found"
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Check if the question has a related exam
        if not question.e:
            return Response({
                "success": False,
                "message": "Question is not associated with any exam"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Create or update ExamAnswer and ExamObservation
        ExamAnswer.objects.update_or_create(q=question)
        observation, created=ExamObservation.objects.update_or_create(e=question.e)
        observation_serializer= ExamObservationSerializer(observation)
         
        return Response({
            "success": True,
            "data":observation_serializer.data,
            "message": "Exam answer created successfully"
        })



class ExamObservationViewSet(viewsets.ModelViewSet):
    queryset = ExamObservation.objects.all()
    serializer_class = ExamObservationSerializer
    @action(detail=True, methods=["get", "post"])
    def questions(self, request, pk=None):
        interview = self.get_object()
        if request.method == "GET":
            questions = interview.interviewquestion_set.all()
            serializer = InterviewQuestionSerializer(questions, many=True)
            return Response(serializer.data)
        elif request.method == "POST":
            serializer = InterviewQuestionSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(i=interview)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["get", "post"])
    def observations(self, request, pk=None):
        interview = self.get_object()
        if request.method == "GET":
            observations = interview.interviewobservation_set.all()
            serializer = InterviewObservationSerializer(observations, many=True)
            return Response(serializer.data)
        elif request.method == "POST":
            serializer = InterviewObservationSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(i=interview)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["post"])
    def complete(self, request, pk=None):
        interview = self.get_object()
        # Add your completion logic here
        interview.i_status = "completed"
        interview.save()
        return Response({"status": "interview completed"})


class InterviewQuestionViewSet(viewsets.ModelViewSet):
    queryset = InterviewQuestion.objects.all()
    serializer_class = InterviewQuestionSerializer

    @action(detail=True, methods=["get", "post"])
    def responses(self, request, pk=None):
        question = self.get_object()
        if request.method == "GET":
            responses = question.interviewresponse_set.all()
            serializer = InterviewResponseSerializer(responses, many=True)
            return Response(serializer.data)
        elif request.method == "POST":
            serializer = InterviewResponseSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(q=question)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    @action(detail=False, methods=["post"])
    def next_question(self, request):
        examId= request.GET.get("examId")
        generate_next_interview_question.delay(examId, request.user.id)

        return Response({
            "success":True,
            "message":"Request accepted"
        })
      


class InterviewResponseViewSet(viewsets.ModelViewSet):
    queryset = InterviewResponse.objects.all()
    serializer_class = InterviewResponseSerializer


class InterviewObservationViewSet(viewsets.ModelViewSet):
    queryset = InterviewObservation.objects.all()
    serializer_class = InterviewObservationSerializer

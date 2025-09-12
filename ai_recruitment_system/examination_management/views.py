from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import (
    Exam, ExamQuestion, ExamAnswer, ExamObservation,
    Interview, InterviewQuestion, InterviewResponse, InterviewObservation
)
from .serializers import (
    ExamSerializer, ExamQuestionSerializer, ExamAnswerSerializer, ExamObservationSerializer,
    InterviewSerializer, InterviewQuestionSerializer, InterviewResponseSerializer, InterviewObservationSerializer
)
from job_management.models import Application
from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()

class ExamViewSet(viewsets.ModelViewSet):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer
    
    def perform_create(self, serializer):
        data= self.request.data.copy()
        print(data)
        print("Validated data: ", serializer.validated_data)
        if 'a_id' not in serializer.validated_data:
            raise serializers.ValidationError({"a_id": "This field is required."})
        serializer.save()
    @action(detail=True, methods=['get', 'post'])
    def questions(self, request, pk=None):
        exam = self.get_object()
        if request.method == 'GET':
            questions = exam.examquestion_set.all()
            serializer = ExamQuestionSerializer(questions, many=True)
            return Response(serializer.data)
        elif request.method == 'POST':
            data= request.data.copy()
            data["e"]=pk
            serializer = ExamQuestionSerializer(data=data)
            if serializer.is_valid():
                serializer.save(e=exam)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'])
    def observations(self, request, pk=None):
        exam = self.get_object()
        observations = exam.examobservation_set.all()
        serializer = ExamObservationSerializer(observations, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        exam = self.get_object()
        # Add your submission logic here
        exam.e_status = 'submitted'
        exam.save()
        return Response({'status': 'exam submitted'})

class ExamQuestionViewSet(viewsets.ModelViewSet):
    queryset = ExamQuestion.objects.all()
    serializer_class = ExamQuestionSerializer
    
    @action(detail=True, methods=['get', 'post'])
    def answers(self, request, pk=None):
        question = self.get_object()
        if request.method == 'GET':
            answers = question.examanswer_set.all()
            serializer = ExamAnswerSerializer(answers, many=True)
            return Response(serializer.data)
        elif request.method == 'POST':
            serializer = ExamAnswerSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(q=question)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ExamAnswerViewSet(viewsets.ModelViewSet):
    queryset = ExamAnswer.objects.all()
    serializer_class = ExamAnswerSerializer

class ExamObservationViewSet(viewsets.ModelViewSet):
    queryset = ExamObservation.objects.all()
    serializer_class = ExamObservationSerializer

class InterviewViewSet(viewsets.ModelViewSet):
    queryset = Interview.objects.all()
    serializer_class = InterviewSerializer
    
    @action(detail=True, methods=['get', 'post'])
    def questions(self, request, pk=None):
        interview = self.get_object()
        if request.method == 'GET':
            questions = interview.interviewquestion_set.all()
            serializer = InterviewQuestionSerializer(questions, many=True)
            return Response(serializer.data)
        elif request.method == 'POST':
            serializer = InterviewQuestionSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(i=interview)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get', 'post'])
    def observations(self, request, pk=None):
        interview = self.get_object()
        if request.method == 'GET':
            observations = interview.interviewobservation_set.all()
            serializer = InterviewObservationSerializer(observations, many=True)
            return Response(serializer.data)
        elif request.method == 'POST':
            serializer = InterviewObservationSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(i=interview)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        interview = self.get_object()
        # Add your completion logic here
        interview.i_status = 'completed'
        interview.save()
        return Response({'status': 'interview completed'})

class InterviewQuestionViewSet(viewsets.ModelViewSet):
    queryset = InterviewQuestion.objects.all()
    serializer_class = InterviewQuestionSerializer
    
    @action(detail=True, methods=['get', 'post'])
    def responses(self, request, pk=None):
        question = self.get_object()
        if request.method == 'GET':
            responses = question.interviewresponse_set.all()
            serializer = InterviewResponseSerializer(responses, many=True)
            return Response(serializer.data)
        elif request.method == 'POST':
            serializer = InterviewResponseSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(q=question)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class InterviewResponseViewSet(viewsets.ModelViewSet):
    queryset = InterviewResponse.objects.all()
    serializer_class = InterviewResponseSerializer

class InterviewObservationViewSet(viewsets.ModelViewSet):
    queryset = InterviewObservation.objects.all()
    serializer_class = InterviewObservationSerializer
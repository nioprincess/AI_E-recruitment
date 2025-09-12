from rest_framework import serializers
from .models import (
    Exam, ExamQuestion, ExamAnswer, ExamObservation,
    Interview, InterviewQuestion, InterviewResponse, InterviewObservation
)
from job_management.serializers import ApplicationSerializer
from sharedapp_management.serializers import UserSerializer
from  job_management.models import Application

class ExamAnswerSerializer(serializers.ModelSerializer):
  
    class Meta:
        model = ExamAnswer
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

class ExamQuestionSerializer(serializers.ModelSerializer):
    answers = ExamAnswerSerializer(many=True, read_only=True)
    
    class Meta:
        model = ExamQuestion
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

class ExamObservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExamObservation
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

class ExamSerializer(serializers.ModelSerializer):
    questions = ExamQuestionSerializer(many=True, read_only=True)
    observations = ExamObservationSerializer(many=True, read_only=True)
    a_id = serializers.PrimaryKeyRelatedField(
        queryset=Application.objects.all(),
        
    )
    
    
    class Meta:
        model = Exam
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

class InterviewResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterviewResponse
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

class InterviewQuestionSerializer(serializers.ModelSerializer):
    responses = InterviewResponseSerializer(many=True, read_only=True)
    
    class Meta:
        model = InterviewQuestion
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

class InterviewObservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterviewObservation
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

class InterviewSerializer(serializers.ModelSerializer):
    questions = InterviewQuestionSerializer(many=True, read_only=True)
    observations = InterviewObservationSerializer(many=True, read_only=True)
    a_id = ApplicationSerializer(read_only=True)
    u_id = UserSerializer(read_only=True)
    
    class Meta:
        model = Interview
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
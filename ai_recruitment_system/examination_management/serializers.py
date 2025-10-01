from rest_framework import serializers
from .models import (
    ApplicationExam, Exam, ExamNoiseHistory, ExamQuestion, ExamAnswer, ExamObservation,
    InterviewQuestion, InterviewResponse, InterviewObservation
)
from sharedapp_management.serializers import UserSerializer
 

class ExamAnswerSerializer(serializers.ModelSerializer):
  
    class Meta:
        model = ExamAnswer
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']



class ExamObservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExamObservation
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
 
class ExamSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Exam
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


     
    def create(self, validated_data):
        # Remove a_ids from validated_data since it's not a model field
        a_ids = validated_data.pop('a_ids', [])
        exam_data = validated_data.copy()
        # Create the exam instance
        instance = Exam.objects.create(**exam_data)
        for a_id in a_ids:
            ApplicationExam.objects.create(a_id=a_id, e_id=instance)
        return instance
    
class ExamNoiseHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ExamNoiseHistory
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

   
class ExamQuestionSerializer(serializers.ModelSerializer):
    exam =  serializers.SerializerMethodField()
    answer =  serializers.SerializerMethodField()

    class Meta:
        model = ExamQuestion
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']   
    def get_answer(self, obj):
        try:
           
            answer = ExamAnswer.objects.get(
                q=obj,
               
            )
            if answer:
                return ExamAnswerSerializer(answer).data
            return None
        except ExamAnswer.DoesNotExist:
            return None

    def get_exam(self, obj):
       from job_management.serializers import ApplicationExamSerializer
       return ApplicationExamSerializer(obj.e).data if obj.e else None
 


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

 
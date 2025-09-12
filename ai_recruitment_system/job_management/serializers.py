from rest_framework import serializers
from job_management.models import Job  
from user_management.models import User
from company_management.models import Company
from sharedapp_management. serializers import UserSerializer
from sharedapp_management.serializers import CompanySerializer
from file_management.models import File
from file_management.serializers import FileSerializer   
from .models import Application

ALLOWED_MIME_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'] 
class JobSerializer(serializers.ModelSerializer):
    u_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    c_id = serializers.PrimaryKeyRelatedField(queryset=Company.objects.all())
    user=UserSerializer(source='u_id', read_only=True)
    company=CompanySerializer(source='c_id', read_only=True)
    j_attachments = serializers.PrimaryKeyRelatedField(
        many=True,
        read_only=True,
        source='j_attachments.all'
    )

    class Meta:
        model = Job
        fields = [
            'id',
            'c_id',
            'u_id',
            'j_title',
            'j_description',
            'j_requirements',
            'j_location',
            'j_employement_type',
            'j_salary_min',
            'j_salary_max',
            'j_deadline',
            'j_attachments',
            'j_status',
            'created_at',
            'updated_at',
            'user',
            'company'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

        
    def validate_j_attachments(self, files):
        for file in files:
            if file.content_type not in ALLOWED_MIME_TYPES:
                raise serializers.ValidationError(f"File type {file.content_type} not allowed.")
        return files
    




class ApplicationSerializer(serializers.ModelSerializer):
    a_cover_letter = FileSerializer(read_only=True)
    a_cover_letter_id = serializers.PrimaryKeyRelatedField(
        queryset=File.objects.all(),
        source='a_cover_letter',
        write_only=True,
        required=False,
        allow_null=True
    )

    class Meta:
        model = Application
        fields = [
            'id',
            'u_id',
            'j_id',
            'status',
            'notes',
            'a_cover_letter',
            'a_cover_letter_id',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['u_id', 'j_id', 'status', 'created_at', 'updated_at']

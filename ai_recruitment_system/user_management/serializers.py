from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .validators import get_password_strength
from django.utils.translation import gettext_lazy as _
from .models import Profile,AuditLog, Address
from file_management.serializers import FileSerializer
from user_management.models import Cv
from sharedapp_management.serializers import CompanySerializer
from company_management.models import Company
from sharedapp_management.serializers import UserSerializer
User = get_user_model()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
   
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["firstname"]= user.u_first_name,
        token["middlename"]= user.u_middle_name,
        token["phone"]= user.u_phone,
        token["lastname"]= user.u_last_name,
        token['email'] = user.u_email
        token['role'] = user.u_role
        return token



class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])
    password_strength = serializers.SerializerMethodField(read_only=True)
    
    def get_password_strength(self, obj):
        password = self.initial_data.get('new_password', None)
        if password:
            return get_password_strength(password)
        return None
    
    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect")
        return value
    
    def validate_new_password(self, value):
        
        validate_password(value)
        
        # Then check strength
        strength_info = get_password_strength(value, self.context['request'].user)
        
        # If password is too weak, raise validation error
        if strength_info['score'] < 40:  # Require at least medium strength
            raise serializers.ValidationError(
                f"Password is too weak (strength: {strength_info['strength']}). "
                f"Please address these issues: {', '.join(strength_info['feedback']['warnings'] + strength_info['feedback']['suggestions'])}"
            )
        
        return value
    
    def save(self):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user
    


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(source='u_id', read_only=True)

    class Meta:
        model = Profile
        fields = [
            'id', 'user', 'p_picture', 'p_cover_picture', 'a_id',
            'p_martial_status', 'p_hobbies', 'p_languages', 'p_bio',
            'created_at', 'updated_at'
        ]

 

 

class AuditLogSerializer(serializers.ModelSerializer):
    user = UserSerializer(source='u_id', read_only=True)

    class Meta:
        model = AuditLog
        fields = [
            'id', 'user', 'a_action', 'a_ip_address',
            'a_user_agent', 'a_metadata', 'created_at', 'updated_at'
        ]

class CvSerializer(serializers.ModelSerializer):
    c_f_id = FileSerializer(read_only=True)
    c_f_id_upload = serializers.FileField(write_only=True, required=False)

    class Meta:
        model = Cv
        fields = [
            'id',
            'user_id',
            'c_f_id',
            'c_f_id_upload',
            'c_content',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'user_id']

    def validate(self, attrs):
        file = self.initial_data.get('c_f_id_upload')
        if file:
            allowed_types = [
                'application/pdf',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ]
            if file.content_type not in allowed_types:
                raise serializers.ValidationError({
                    'c_f_id_upload': 'Only PDF or DOCX files are allowed.'
                })
        return attrs

    def create(self, validated_data):
        validated_data.pop('c_f_id_upload', None) 
        return super().create(validated_data)

    def update(self, instance, validated_data):
        validated_data.pop('c_f_id_upload', None) 
        return super().update(instance, validated_data)
    

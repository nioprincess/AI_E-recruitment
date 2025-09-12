from rest_framework import serializers

from sharedapp_management.serializers import CompanySerializer, UserSerializer
from  .models import    CompanyUser


class CompanyUserSerializer(serializers.ModelSerializer):
    user = UserSerializer(source='u_id', read_only=True)
    company = CompanySerializer(source='c', read_only=True)

    class Meta:
        model = CompanyUser
        fields = [
            'id', 'u_id', 'c', 'role', 'status', 'user', 'company', 'created_at', 'updated_at'
        ]
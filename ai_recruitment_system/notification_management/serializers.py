from sharedapp_management.serializers import UserSerializer, CompanySerializer
from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    user = UserSerializer(source='u_id', read_only=True)
    company = CompanySerializer(source='c_id', read_only=True)

    class Meta:
        model = Notification
        fields = [
            'id', 'user', 'company','c_id','n_message', 'n_type',
            'n_is_read', 'created_at', 'updated_at'
        ]

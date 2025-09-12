from rest_framework import serializers
from .models import File

class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = [
            'id',
            'u_id',
            'c_id',
            'f_name',
            'f_url',
            'f_path',
            'f_type',
            'f_size',
            'f_public_id',
            'f_uploaded_at',
            'created_at',
            'updated_at',
            'f_category',
            'f_format',
            'f_resource_type',
        ]
        read_only_fields = [
            'id',
            'f_url',
            'f_path',
            'f_uploaded_at',
            'created_at',
            'updated_at',
            'f_public_id',
            'f_format',
            'f_resource_type',
        ]

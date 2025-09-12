from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from user_management.validators import get_password_strength
from django.utils.translation import gettext_lazy as _
from company_management.models import Company
from user_management.models import Address
User= get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password_strength = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = User
        fields = (
            'id', 'u_email', 'u_first_name', 'u_middle_name', 'u_last_name', 'password', 
            'password_strength', 'u_role', 'u_is_active', 'u_dob', 'u_gender', 'u_phone',
             'is_staff', 'has_company', 'created_at', 'updated_at'
        )
        extra_kwargs = {
            'password': {'write_only': True},
            'u_dob': {'required': True},
            'u_gender': {'required': True},
            'u_phone': {'required': True},
        }
    
    def get_password_strength(self, obj):
        """
        Calculate password strength when reading the object
        """
        # Only return strength for password_confirmation during creation
        password = self.initial_data.get('password', None) if hasattr(self, 'initial_data') else None
        
        if password:
            return get_password_strength(password)
        return None
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()

        return user
    
    def update(self, instance, validated_data):
        if 'password' in validated_data:
            password = validated_data.pop('password')
            instance.set_password(password)
        return super().update(instance, validated_data)
    
    def validate_password(self, value):
       
        validate_password(value)
        
        # Then check strength
        strength_info = get_password_strength(value)
        
        # If password is too weak, raise validation error
        if strength_info['score'] < 40:  # Require at least medium strength
            raise serializers.ValidationError(
                f"Password is too weak (strength: {strength_info['strength']}). "
                f"Please address these issues: {', '.join(strength_info['feedback']['warnings'] + strength_info['feedback']['suggestions'])}"
            )
        
        return value
    
    def create(self, validated_data):
        role = validated_data.get('u_role')
        if role not in ['user', 'recruiter', 'admin']:
            raise serializers.ValidationError("Invalid role. Must be 'user', 'recruiter', or 'admin'.")

     

        user = User.objects.create_user(**validated_data)
            
           
         
        return user
    
    def update(self, instance, validated_data):

       
        password = validated_data.pop('password', None)
        user = super().update(instance, validated_data)
        
        if password:
            user.set_password(password)
            user.save()
        
        
        return user


class CompanySerializer(serializers.ModelSerializer):
     
    c_admin = UserSerializer(read_only=True)
    class Meta:
        model = Company
        fields = [
            'id', 'c_admin', 'c_type', 'c_industry', 'c_reg_number',
            'c_address', 'c_website', 'c_logo', 'c_email', 'c_phone',
            'c_description', 'created_at', 'updated_at'
        ]



class AddressSerializer(serializers.ModelSerializer):
    u_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False, allow_null=True)
    c_id = serializers.PrimaryKeyRelatedField(queryset=Company.objects.all(), required=False, allow_null=True)
    user = UserSerializer(source='u_id', read_only=True)
    company = CompanySerializer(source='c_id', read_only=True)

    class Meta:
        model = Address
        fields = [
            'id',
            'u_id',
            'c_id',
            'a_country',
            'a_province_state',
            'a_address_line1',
            'a_address_line2',
            'a_city',
            'a_postal_code',
            'created_at',
            'updated_at',
            'user',
            'company'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
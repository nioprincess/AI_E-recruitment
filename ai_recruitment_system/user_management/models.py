from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone
class UserManager(BaseUserManager):
    def create_user(self, u_email, password=None, **extra_fields):
        if not u_email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(u_email)
        user = self.model(u_email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('u_role', 'admin')
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        
        return self.create_user(email, password, **extra_fields)
    
class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ('user', 'User'),
        ('recruiter', 'Recruiter'),
        ('admin', 'Admin'),
    )
    u_first_name = models.CharField(max_length=255)
    u_middle_name = models.CharField(max_length=255)
    u_last_name = models.CharField(max_length=255)
    u_role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')
    u_is_active = models.BooleanField(default=True)
    u_dob = models.DateField()
    u_gender = models.CharField(max_length=10)
    u_email = models.CharField(max_length=255, unique=True)
    u_phone = models.CharField(max_length=20)
    u_profile= models.ForeignKey ("user_management.Profile", on_delete=models.SET_NULL, related_name='user_profile', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)
    has_company = models.BooleanField()
    created_at = models.DateTimeField(default=timezone.now)
    updated_at =models.DateTimeField(default=timezone.now)
    USERNAME_FIELD = 'u_email'
    REQUIRED_FIELDS = []
    objects = UserManager()
    class Meta:
        managed = True
        db_table = 'user'
    def __str__(self):
        return self.u_email
    
    def get_full_name(self):
        return f"{self.u_first_name} {self.u_middle_name} {self.u_last_name}"

class Profile(models.Model):
    u_id = models.ForeignKey(User, models.DO_NOTHING, related_name='profile_user')
    p_picture = models.ForeignKey ('file_management.File', on_delete=models.SET_NULL, related_name='profile_picture', blank=True, null=True)
    p_cover_picture = models.ForeignKey('file_management.File', models.SET_NULL, related_name='profile_cover_picture', blank=True, null=True)
    a_id = models.IntegerField()
    p_martial_status = models.CharField(max_length=20, blank=True, null=True)
    p_hobbies = models.TextField(blank=True, null=True)
    p_languages = models.TextField(blank=True, null=True)
    p_bio = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)

    class Meta:
        managed = True
        db_table = 'profile'


class AuditLog(models.Model):
    u_id = models.ForeignKey(User, models.DO_NOTHING, related_name='audit_user')
    a_action = models.TextField()
    a_ip_address = models.CharField(max_length=255)
    a_user_agent = models.CharField(max_length=255)
    a_metadata = models.TextField()  
    created_at = models.DateTimeField(default=timezone.now)
    updated_at =models.DateTimeField(default=timezone.now)

    class Meta:
        managed = True
        db_table = 'audit_log'


class Cv(models.Model):
    user_id = models.ForeignKey(User, models.DO_NOTHING, related_name='cv_user')
    c_f_id =models.ForeignKey('file_management.File', on_delete=models.SET_NULL, related_name='cv_file', blank=True, null=True)
    c_content = models.TextField( blank=True, null=True)
    parsed_data = models.TextField( blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at =models.DateTimeField(default=timezone.now)

    class Meta:
        managed = True
        db_table = 'cv'


class Address(models.Model):
    u_id = models.ForeignKey(User, models.DO_NOTHING, related_name='address_user', blank=True, null=True)
    c_id = models.ForeignKey('company_management.Company', models.DO_NOTHING, related_name='address_company', blank=True, null=True)
    a_country = models.CharField(max_length=255)
    a_province_state = models.CharField(max_length=255, blank=True, null=True)
    a_address_line1 = models.TextField()
    a_address_line2 = models.TextField(blank=True, null=True)
    a_city = models.CharField(max_length=255)
    a_postal_code = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField( default=timezone.now)
    updated_at = models.DateTimeField( default=timezone.now)

    class Meta:
        managed = True
        db_table = 'address'
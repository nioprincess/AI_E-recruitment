from django.db import models
from django.utils import timezone
from django.contrib.auth import get_user_model
User= get_user_model()
class Company(models.Model):
    c_admin = models.ForeignKey(User, models.DO_NOTHING, related_name='company_admin', null=True)
    c_type = models.CharField(max_length=255, blank=True, null=True)
    c_industry = models.CharField(max_length=255, blank=True, null=True)
    c_reg_number = models.CharField(max_length=255, blank=True, null=True)
    c_address = models.IntegerField(blank=True, null=True)
    c_website = models.CharField(max_length=255, blank=True, null=True)
    c_logo = models.CharField(max_length=255, blank=True, null=True)
    c_email = models.CharField(max_length=255, blank=True, null=True)
    c_phone = models.CharField(max_length=255, blank=True, null=True)
    c_description = models.TextField(blank=True, null=True)
    created_at =models.DateTimeField(default=timezone.now)
    updated_at =models.DateTimeField(default=timezone.now)

    class Meta:
        managed = True
        db_table = 'company'

class CompanyUser(models.Model):
    u_id = models.ForeignKey(User, models.DO_NOTHING, related_name='company_user', null=True, blank=True)
    c = models.ForeignKey(Company, models.DO_NOTHING, null=True, blank=True, related_name='company_user')
    role = models.CharField(max_length=50)
    status = models.CharField(max_length=50)
    created_at =models.DateTimeField(default=timezone.now)
    updated_at =models.DateTimeField(default=timezone.now)

    class Meta:
        managed =True
        db_table = 'company_user'
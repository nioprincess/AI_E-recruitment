from django.db import models
from cloudinary.models import CloudinaryField
from company_management.models import Company
from file_management.storage import LocalMediaStorage
from django.utils import timezone


local_storage =  LocalMediaStorage
class File(models.Model):
    u_id = models.ForeignKey('user_management.User', on_delete=models.CASCADE, blank=True, null=True)
    c_id = models.ForeignKey(Company, on_delete=models.CASCADE, blank=True, null=True)
    f_name = models.CharField(max_length=255)
    f_url =  CloudinaryField('f_url', blank=True, null=True)  
    f_path =  models.FileField(storage=local_storage, upload_to='cv/', blank=True, null=True)
    f_type = models.CharField(max_length=255)
    f_size = models.CharField(max_length=255)
    f_public_id= models.CharField(max_length=255, blank=True, null=True)
    f_uploaded_at = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at =models.DateTimeField(default=timezone.now)
    f_category = models.TextField() 
    f_format= models.CharField(max_length=50, blank=True, null=True)
    f_resource_type = models.CharField(max_length=50, blank=True, null=True) 

    class Meta:
        managed = True
        db_table = 'file'
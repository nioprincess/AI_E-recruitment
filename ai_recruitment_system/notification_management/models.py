from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
User= get_user_model()
class Notification(models.Model):
    
    u_id = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='notification_user', blank=True, null=True)
    c_id = models.ForeignKey('company_management.Company', on_delete=models.SET_NULL, related_name='notification_company', blank=True, null=True)
    n_message = models.TextField(blank=True, null=True)
    n_type = models.CharField(max_length=255, default="info")
    n_is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)

    class Meta:
        managed = True
        db_table = 'notification'
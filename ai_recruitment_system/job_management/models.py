from django.db import models
from django.utils import timezone

class Job(models.Model):
    c_id = models.ForeignKey('company_management.Company', on_delete=models.CASCADE, related_name='jobs')
    u_id = models.ForeignKey('user_management.User', on_delete=models.CASCADE, related_name='jobs')
    j_title = models.CharField(max_length=255)
    j_description = models.TextField(blank=True, null=True)
    j_requirements = models.TextField(blank=True, null=True)
    j_location = models.CharField(max_length=255, blank=True, null=True)
    j_employement_type = models.CharField(max_length=255, blank=True, null=True)
    j_salary_min = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    j_salary_max = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    j_deadline = models.DateTimeField()
    j_attachments = models.ManyToManyField('file_management.File', blank=True, related_name='job_attachments')
    j_status = models.CharField(max_length=255)
    created_at = models.DateTimeField( default=timezone.now, editable=False)
    updated_at = models.DateTimeField( default=timezone.now)

    class Meta:
        managed = True
        db_table = 'job'


class Application(models.Model):
    u_id = models.IntegerField()
    j_id = models.IntegerField()
    a_cover_letter = models.ForeignKey ('file_management.File', on_delete=models.SET_NULL, related_name='application_letter', blank=True, null=True)
    status = models.CharField(max_length=255)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now )
    updated_at = models.DateTimeField(default=timezone.now)

    class Meta:
        managed = True
        db_table = 'application'


 
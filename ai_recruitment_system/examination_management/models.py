from django.db import models
from django.contrib.auth import  get_user_model
from django.utils import timezone

User= get_user_model()
class Interview(models.Model):
    a_id = models.ForeignKey("job_management.Application", on_delete=models.CASCADE, )
    u_id = models.ForeignKey(User, on_delete=models.CASCADE)
    i_scheduled_at = models.DateTimeField()
    i_status = models.CharField(max_length=255, blank=True, null=True)
    i_notes = models.TextField(blank=True, null=True)
    i_feedback = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)

    class Meta:
        managed = True
        db_table = 'interview'
 


class InterviewObservation(models.Model):
    i = models.ForeignKey(Interview, models.DO_NOTHING)
    o_punctuality_score = models.DecimalField(max_digits=5, decimal_places=2)
    o_dressing_code_ok = models.BooleanField()
    o_gestures_detected = models.TextField()
    o_face_expressions = models.TextField()
    o_communitication_clarity = models.IntegerField()
    o_professionalism_score = models.DecimalField(max_digits=5, decimal_places=2)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)

    class Meta:
        managed = True
        db_table = 'interview_observation'

 
class InterviewQuestion(models.Model):
    i = models.ForeignKey(Interview, on_delete=models.CASCADE)
    q_text = models.TextField()
    q_choices = models.TextField()   
    q_correct_answer = models.TextField()
    q_ai_generated = models.BooleanField()
    q_score_weight = models.DecimalField(max_digits=5, decimal_places=2)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    q_type = models.TextField()   

    class Meta:
        managed = True
        db_table = 'interview_question'

class InterviewResponse(models.Model):
    q = models.ForeignKey(InterviewQuestion, on_delete=models.CASCADE)
    r_text = models.TextField()
    r_socre = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    r_review_notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    class Meta:
        managed = True
        db_table = 'interview_response'


class Exam(models.Model):
    a_id = models.ForeignKey("job_management.Application", on_delete=models.CASCADE, )
    e_title = models.CharField(max_length=255)
    e_start_time = models.DateTimeField()
    e_duration = models.IntegerField()
    e_submitted_at = models.DateTimeField()
    e_score = models.DecimalField(max_digits=5, decimal_places=2)
    e_status = models.CharField(max_length=255)
    e_notes = models.TextField(blank=True, null=True)
    create_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)

    class Meta:
        managed = True
        db_table = 'exam'


class ExamAnswer(models.Model):
    q = models.ForeignKey('ExamQuestion', on_delete=models.CASCADE)
    a_text = models.TextField()
    a_score = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    a_review_notes = models.TextField(blank=True, null=True)
    create_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)

    class Meta:
        managed = True
        db_table = 'exam_answer'


class ExamObservation(models.Model):
    e = models.ForeignKey(Exam,on_delete=models.CASCADE)
    o_distraction_level = models.IntegerField(default=0)
    o_noise_detected = models.BooleanField(default=0)
    o_tab_switches = models.IntegerField(default=0)
    o_eye_contact_score = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    o_suspesious_behaviour = models.TextField(blank=True, null=True, default=0)
    o_dressing_code_ok = models.BooleanField()
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)

    class Meta:
        managed = True
        db_table = 'exam_observation'


class ExamQuestion(models.Model):
    e = models.ForeignKey(Exam, on_delete=models.CASCADE)
    q_text = models.TextField()
    q_choices = models.TextField()   
    q_correct_answer = models.TextField()
    q_ai_generated = models.BooleanField()
    q_score_weight = models.DecimalField(max_digits=5, decimal_places=2)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    q_type = models.TextField()   

    class Meta:
        managed = True
        db_table = 'exam_question'
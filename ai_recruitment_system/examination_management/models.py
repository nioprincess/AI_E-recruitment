from django.db import models
from django.contrib.auth import  get_user_model
from django.utils import timezone

User= get_user_model()



class Exam(models.Model):
    j_id = models.ForeignKey("job_management.Job", on_delete=models.CASCADE, null=True)
    e_title = models.CharField(max_length=255)
    e_start_time = models.DateTimeField(null=True , blank=True)
    e_duration = models.IntegerField(null= True , blank=True)   
    e_deadline_type = models.CharField(max_length=255, default= 'fixed')  
    e_type = models.CharField(max_length=255, default='written')
    e_mode= models.CharField(max_length=255, default='online')
    e_submitted_at = models.DateTimeField(null=True , blank=True)
    e_score = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    e_max_score = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    e_status = models.CharField(max_length=255, default='pending')
    e_notes = models.TextField(blank=True, null=True)
    create_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)

    class Meta:
        managed = True
        db_table = 'exam'
class ApplicationExam(models.Model):
    a_id = models.ForeignKey("job_management.Application", on_delete=models.CASCADE, )
    e_id = models.ForeignKey(Exam, on_delete=models.CASCADE, )
    exam_started= models.BooleanField(default=False)
    exam_ended=models.BooleanField(default=False)
    current_time= models.IntegerField(default=0)
    last_question=models.IntegerField(default=0)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)

    class Meta:
        managed = True
        db_table = 'application_exam'



class ExamAnswer(models.Model):
    q = models.OneToOneField('ExamQuestion', on_delete=models.CASCADE)
    a_text = models.TextField(null=True, blank=True)
    a_score = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    a_review_notes = models.TextField(blank=True, null=True)
    create_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)

    class Meta:
        managed = True
        db_table = 'exam_answer'


class ExamObservation(models.Model):
    e = models.OneToOneField(ApplicationExam, on_delete=models.CASCADE)
    o_distraction_level = models.IntegerField(default=0,)
    o_noise_detected = models.BooleanField(default=0)
    o_tab_switches = models.IntegerField(default=0)
    o_eye_contact_score = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    o_suspesious_behaviour = models.TextField(blank=True, null=True, default=0)
    o_dressing_code_ok = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)

    class Meta:
        managed = True
        db_table = 'exam_observation'

class ExamNoiseHistory(models.Model):
    e = models.ForeignKey(ApplicationExam, on_delete=models.CASCADE)
    n_level= models.DecimalField(default=0,max_digits=5, decimal_places=2)
    n_timestamp = models.IntegerField(default=0)
    n_sound=models.CharField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)

    class Meta:
        managed = True
        db_table = 'exam_noise_history'



class ExamQuestion(models.Model):
    e = models.ForeignKey(ApplicationExam, on_delete=models.CASCADE)
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


# class Interview(models.Model):
#     a_id = models.ForeignKey("job_management.Application", on_delete=models.CASCADE, )
#     u_id = models.ForeignKey(User, on_delete=models.CASCADE)
#     i_scheduled_at = models.DateTimeField()
#     i_status = models.CharField(max_length=255, blank=True, null=True)
#     i_notes = models.TextField(blank=True, null=True)
#     i_feedback = models.TextField(blank=True, null=True)
#     created_at = models.DateTimeField(default=timezone.now)
#     updated_at = models.DateTimeField(default=timezone.now)

#     class Meta:
#         managed = True
#         db_table = 'interview'
 


class InterviewObservation(models.Model):
    e = models.OneToOneField(ApplicationExam, models.DO_NOTHING, null=True)
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
    e = models.ForeignKey(ApplicationExam, on_delete=models.CASCADE, null=True)
    q_text = models.TextField(blank=True, null=True)
    q_correct_answer = models.TextField(blank=True, )
    current_time= models.IntegerField(default=0)
    q_ai_generated = models.BooleanField()
    q_score_weight = models.DecimalField(max_digits=5, decimal_places=2)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    q_type = models.TextField()   

    class Meta:
        managed = True
        db_table = 'interview_question'

class InterviewResponse(models.Model):
    q = models.ForeignKey(InterviewQuestion, on_delete=models.CASCADE, null=True)
    r_text = models.TextField()
    current_time= models.IntegerField(default=0)
    r_socre = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    r_review_notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    class Meta:
        managed = True
        db_table = 'interview_response'
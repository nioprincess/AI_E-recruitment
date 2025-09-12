from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ExamViewSet, ExamQuestionViewSet, ExamAnswerViewSet, ExamObservationViewSet,
    InterviewViewSet, InterviewQuestionViewSet, InterviewResponseViewSet, InterviewObservationViewSet
)

router = DefaultRouter()
router.register(r'exams', ExamViewSet)
router.register(r'exam-questions', ExamQuestionViewSet)
router.register(r'exam-answers', ExamAnswerViewSet)
router.register(r'exam-observations', ExamObservationViewSet)
router.register(r'interviews', InterviewViewSet)
router.register(r'interview-questions', InterviewQuestionViewSet)
router.register(r'interview-responses', InterviewResponseViewSet)
router.register(r'interview-observations', InterviewObservationViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
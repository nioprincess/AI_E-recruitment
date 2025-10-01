from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ExamViewSet, ExamQuestionViewSet, ExamAnswerViewSet, ExamObservationViewSet,
    InterviewQuestionViewSet, InterviewResponseViewSet, InterviewObservationViewSet,
    ApplicationExamViewSet, ExamNoiseHistoryViewSet
)

router = DefaultRouter()
router.register(r'exams', ExamViewSet)
router.register(r'application-exams', ApplicationExamViewSet)
router.register(r'exam-questions', ExamQuestionViewSet)
router.register(r'exam-answers', ExamAnswerViewSet)
router.register(r'exam-observations', ExamObservationViewSet)
router.register(r'exam-noise', ExamNoiseHistoryViewSet)
router.register(r'interview-questions', InterviewQuestionViewSet)
router.register(r'interview-responses', InterviewResponseViewSet)
router.register(r'interview-observations', InterviewObservationViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
from django.urls import path
from .views import download_cv_file, download_job_attachment

urlpatterns = [
    path('cv/<int:cv_id>/', download_cv_file, name='download-cv'),
     path('attachment/<int:file_id>/', download_job_attachment, name='download_attachment')
]

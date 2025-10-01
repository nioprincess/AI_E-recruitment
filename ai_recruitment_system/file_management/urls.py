from django.urls import path
from .views import download_cv_file, download_job_attachment, download_cv_user_file, download_job_cover

urlpatterns = [
    path('cv/<int:cv_id>/', download_cv_file, name='download-cv'),
    path('user_cv/<int:user_id>/', download_cv_user_file, name='download-cv-user'),
     path('attachment/<int:file_id>/', download_job_attachment, name='download_attachment'),
      path('cover/<int:file_id>/', download_job_cover, name='download_attachment_cover')
]

 
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path('api/users/', include('user_management.urls')),
    path('api/companies/', include('company_management.urls')),
    path('api/files/', include('file_management.urls')),
    path('api/jobs/', include('job_management.urls')),
    path('api/examination/', include("examination_management.urls"))
   
   
]


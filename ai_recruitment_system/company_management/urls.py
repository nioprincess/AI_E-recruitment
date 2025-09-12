from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (CompanyViewSet)

router = DefaultRouter()
router.register(r'', CompanyViewSet, basename='companies')
# router.register(r'company-users', CompanyUserViewSet, basename='company-users')
 
 

urlpatterns = [
  
     
    path('', include(router.urls)),
]
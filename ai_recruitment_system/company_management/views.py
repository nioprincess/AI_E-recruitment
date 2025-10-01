from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from .serializers import  *
from .permissions import IsAdmin, IsRecruiter
from .models import CompanyUser, Company
from sharedapp_management.serializers import AddressSerializer
from sharedapp_management.serializers import CompanySerializer
from django.db import transaction
from rest_framework.decorators import action
from rest_framework import permissions
from user_management.models import Address
from notification_management.serializers import NotificationSerializer
from notification_management.models import Notification
from notification_management.tasks import send_notification
User = get_user_model()
 
class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [IsRecruiter | IsAdmin]


    def perform_create(self, serializer):
        with transaction.atomic():
            serializer.save(c_admin=self.request.user)

            CompanyUser.objects.create(
                u_id=self.request.user,
                c=serializer.instance,
                role='admin',
                status='active'
            )
            self.request.user.has_company = True
            self.request.user.save()


    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response({
            'success': True,
            'data': serializer.data,
            'message': 'Company created successfully'
        }, status=status.HTTP_201_CREATED, headers=headers)
    

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'success': True,
            'data': serializer.data,
            'message': 'Companies fetched successfully'
        })
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({
            'success': True,
            'data': serializer.data,
            'message': 'Company fetched successfully'
        })
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({
            'success': True,
            'data': serializer.data,
            'message': 'Company updated successfully'
        })
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({
            'success': True,
            'message': 'Company deleted successfully'
        }, status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=False, methods=['get'], permission_classes=[])
    def my_company(self,request, *args, **kwargs):
        try:
                   
            
            company= Company.objects.filter(c_admin= request.user).first()
            serializer= CompanySerializer(company)
            
            
            return Response({
                'success': True,
                'data': serializer.data,
                'message': 'Company user fetched successfully'
            })
        except CompanyUser.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Company user not found'
            }, status=status.HTTP_404_NOT_FOUND)
    @action(detail=False, methods=['get', 'post', 'put', 'patch', 'delete'], permission_classes=[IsAdmin])
    def user(self,request, *args, **kwargs):
        
        if request.method == 'GET':
            user_id =  request.query_params.get('id')
            if user_id:
                try:
                    company_user = CompanyUser.objects.get(id=user_id, c__c_admin=request.user)
                    serializer = CompanyUserSerializer(company_user)
                    return Response({
                        'success': True,
                        'data': serializer.data,
                        'message': 'Company user fetched successfully'
                    })
                except CompanyUser.DoesNotExist:
                    return Response({
                        'success': False,
                        'message': 'Company user not found'
                    }, status=status.HTTP_404_NOT_FOUND)
            else:
                users=CompanyUser.objects.filter(c__c_admin=request.user).select_related('u_id', 'c').all()
            
                 
                serializer = self.get_serializer(users, many=True)
                return Response({
                    'success': True,
                    'data': serializer.data,
                    'message': 'Users fetched successfully'
                })

        elif request.method == 'POST':

            data = request.data.copy()
            
            company_admin= Company.objects.filter(c_admin=request.user).first()
            if not company_admin:
                return Response({
                    'success': False,
                    'message': 'You are not authorized to create a company user'
                }, status=status.HTTP_403_FORBIDDEN)
            data['c'] = company_admin.id
            
            serializer = CompanyUserSerializer(data=data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            
            return Response({
                'success': True,
                'data': serializer.data,
                'message': 'Company user created successfully'
            }, status=status.HTTP_201_CREATED)
        elif request.method == 'PUT' or request.method == 'PATCH':
           
            try:
                user_id =  request.query_params.get('id')
                company_user = CompanyUser.objects.get(id=user_id, c__c_admin=request.user)
                serializer = CompanyUserSerializer(company_user, data=request.data, partial=True)
                serializer.is_valid(raise_exception=True)
                serializer.save()
                return Response({
                    'success': True,
                    'data': serializer.data,
                    'message': 'Company user updated successfully'
                })
            except CompanyUser .DoesNotExist:
                return Response({
                    'success': False,
                    'message': 'Company user not found'
                }, status=status.HTTP_404_NOT_FOUND)
        elif request.method == 'DELETE':
            try:
                user_id =  request.query_params.get('id')
                company_user = CompanyUser.objects.get(id=user_id, c__c_admin=request.user)
                company_user.delete()
                return Response({
                    'success': True,
                    'message': 'Company user deleted successfully'
                }, status=status.HTTP_204_NO_CONTENT)
            except CompanyUser.DoesNotExist:
                return Response({
                    'success': False,
                    'message': 'Company user not found'
                }, status=status.HTTP_404_NOT_FOUND)
            
    @action(detail=False, methods=['get', 'post', 'put', 'patch', 'delete'], permission_classes=[permissions.IsAuthenticated], url_path='address')
    def address(self, request, *args, **kwargs):
        print(request.data)
        if request.method == 'GET':
            company_id = request.query_params.get('c_id')
            if  company_id:
                try:
                    address = Address.objects.filter(c_id__id=company_id).first()
                    if not address:
                        return Response({
                            'success': False,
                            'message': 'Address not found or unauthorized'
                        }, status=status.HTTP_404_NOT_FOUND)
                    serializer = AddressSerializer(address)
                    return Response({
                        'success': True,
                        'data': serializer.data,
                        'message': 'Address fetched successfully'
                    })
                except Address.DoesNotExist:
                    return Response({
                        'success': False,
                        'message': 'Address not found'
                    }, status=status.HTTP_404_NOT_FOUND)
            addresses = Address.objects.filter(c_id__c_admin=request.user).select_related('c_id').all()
            serializer = AddressSerializer(addresses, many=True)
            return Response({
                'success': True,
                'data': serializer.data,
                'message': 'Addresses fetched successfully'
            })
        
        elif request.method == 'POST':
            company= Company.objects.filter(c_admin=request.user).first()
            if not company:
                return Response({
                    'success': False,
                    'message': 'You are not authorized to create an address'
                }, status=status.HTTP_403_FORBIDDEN)
            serializer = AddressSerializer(data=request.data)
            
            serializer.is_valid(raise_exception=True)
            serializer.save(c_id = company)
            send_notification.delay(
                message=f"New Address created for {company.c_email} by {request.user.u_first_name}",
                n_type='address_creation',
                is_read=False,
                c_id=company.id,
                user_id=request.user.id,
                broadcast=False
            )
            return Response({
                'success': True,
                'data': serializer.data,
                'message': 'Address created successfully'
            }, status=status.HTTP_201_CREATED)
        
        elif request.method == 'PUT' or request.method == 'PATCH':
            company= Company.objects.filter(c_admin=request.user).first()
            if not company:
                return Response({
                    'success': False,
                    'message': 'You are not authorized to create an address'
                }, status=status.HTTP_403_FORBIDDEN)
            
            try:
                address = Address.objects.filter(
                    c_id__id=company.id, 
                    c_id__c_admin=request.user
                ).first()
                if not address:
                    return Response({
                        'success': False,
                        'message': 'Address not found or unauthorized'
                    }, status=status.HTTP_404_NOT_FOUND)
                serializer = AddressSerializer(address, data=request.data, partial=True)
                serializer.is_valid(raise_exception=True)
                serializer.save()
                return Response({
                    'success': True,
                    'data': serializer.data,
                    'message': 'Address updated successfully'
                })
            except Address.DoesNotExist:
                return Response({
                    'success': False,
                    'message': 'Address not found'
                }, status=status.HTTP_404_NOT_FOUND)
        
        elif request.method == 'DELETE':
            company_id = request.query_params.get('c_id')
            
            try:

                address = Address.objects.filter(
                    c_id__id=company_id, 
                    c_id__c_admin=request.user
                ).first()
                if not address:
                    return Response({
                        'success': False,
                        'message': 'Address not found or unauthorized'
                    }, status=status.HTTP_404_NOT_FOUND)

                address.delete()
                return Response({
                    'success': True,
                    'message': 'Address deleted successfully'
                }, status=status.HTTP_204_NO_CONTENT)
            except Address.DoesNotExist:
                return Response({
                    'success': False,
                    'message': 'Address not found'
                }, status=status.HTTP_404_NOT_FOUND)
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated], url_path='notifications')
    def notifications(self, request):
        queryset = Notification.objects.filter(c_id__c_admin=request.user).select_related('u_id', 'c_id').all()
        serializer = NotificationSerializer(queryset, many=True)
        return Response({'success': True, 'data': serializer.data, 'message': 'Notifications fetched successfully'})

    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAuthenticated], url_path='create-notification')
    def create_notification(self, request):
        data = request.data.copy()
        company = Company.objects.filter(c_admin=request.user).first()
        if not company:
            return Response({'success': False, 'message': 'You are not authorized to create a notification'}, status=status.HTTP_403_FORBIDDEN)
        data['c_id'] = company.id

        serializer = NotificationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(u_id=request.user)
        return Response({'success': True, 'data': serializer.data, 'message': 'Notification created successfully'})
    
    @action(detail=False, methods=['put', 'patch'], permission_classes=[permissions.IsAuthenticated], url_path='update-notification-status')
    def update_notification_status(self, request):
        notification_id = request.data.get('id')
        if not notification_id:
            return Response({'success': False, 'message': 'Notification ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            notification = Notification.objects.get(id=notification_id, c_id__c_admin=request.user)
            notification.n_is_read = True
            notification.save()
            serializer = NotificationSerializer(notification)
            return Response({'success': True, 'data': serializer.data, 'message': 'Notification status updated successfully'})
        except Notification.DoesNotExist:
            return Response({'success': False, 'message': 'Notification not found or unauthorized'}, status=status.HTTP_404_NOT_FOUND)
    



 


 

    















from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from .serializers import  *
from sharedapp_management.serializers import UserSerializer, AddressSerializer
from .permissions import IsAdmin
from .validators import get_password_strength
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken
from file_management.tasks import upload_file_and_save, delete_file, update_file, save_cv_file
from user_management.models import Cv
from notification_management.serializers import NotificationSerializer
from notification_management.models import Notification

User = get_user_model()

class CustomTokenRefreshView(TokenRefreshView):
    # permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        
        refresh_token = request.COOKIES.get('refresh_token')
        if refresh_token is None:
            return Response({"detail": "Refresh token not found in cookies."}, status=status.HTTP_401_UNAUTHORIZED)
         
        request.data['refresh'] = refresh_token
        return super().post(request, *args, **kwargs)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = [permissions.AllowAny]
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == status.HTTP_200_OK:
            refresh_token = response.data.get('refresh')
            response.set_cookie(
                key='refresh_token',
                value=refresh_token,
                httponly=True,
                secure=True,  
                samesite='Lax',  
                max_age=60*60*24   
            )
            response.data.pop('refresh', None)
        return response

 
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [permissions.AllowAny]
        elif self.action in ['list', 'retrieve', "logout"]:
            permission_classes = [permissions.IsAuthenticated]
        elif self.action in ['check_password_strength']:
            permission_classes = [permissions.AllowAny]
        elif self.action in ['change_password', 'cv']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [IsAdmin]  
        return [permission() for permission in permission_classes]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response({
            'success': True,
            'data': serializer.data,
            'message': 'User created successfully'
        }, status=status.HTTP_201_CREATED, headers=headers)
    
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'success': True,
            'data': serializer.data,
            'message': 'Users fetched successfully'
        })
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({
            'success': True,
            'data': serializer.data,
            'message': 'User fetched successfully'
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
            'message': 'User updated successfully'
        })
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({
            'success': True,
            'message': 'User deleted successfully'
        }, status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def profile(self, request):
        serializer = self.get_serializer(request.user)
        return Response({
            'success': True,
            'data': serializer.data,
            'message': 'Profile fetched successfully'
        })
    
    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny], url_path='check-password-strength')
    def check_password_strength(self, request):
        """
        Check the strength of a password without saving it
        """
        password = request.data.get('password')
        if not password:
            return Response({
                'success': False,
                'message': 'Password is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        user = None
        if request.user.is_authenticated:
            user = request.user
            
        strength_info = get_password_strength(password, user)
        
        return Response({
            'success': True,
            'data': strength_info,
            'message': 'Password strength checked successfully'
        })
    
    
    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAuthenticated], url_path='change-password')
    def change_password(self, request):
        """
        Change user password
        """
        serializer = PasswordChangeSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response({
            'success': True,
            'data': {'password_strength': serializer.data.get('password_strength')},
            'message': 'Password changed successfully'
        })
    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAuthenticated], url_path='logout')
    def logout(self, request):
        try:
           
            refresh_token = request.COOKIES.get('refresh_token')
 
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()

            auth_header = request.headers.get('Authorization')
            if auth_header and auth_header.startswith('Bearer '):
                access_token_str = auth_header.split(' ')[1]
                access_token = AccessToken(access_token_str)
                try:
                    outstanding_token = OutstandingToken.objects.get(token=access_token_str)
                    BlacklistedToken.objects.get_or_create(token=outstanding_token)
                except OutstandingToken.DoesNotExist:
                    pass

            response = Response({'success': True, 'message': 'Logged out'})
            response.delete_cookie('refresh_token')
            return response

        except Exception as e:
            return Response({'success': False, 'message': str(e)}, status=400)
    @action(detail=False, methods=['get', 'post', 'put', 'patch', 'delete'], permission_classes=[permissions.IsAuthenticated], url_path='profile')
    def profile(self, request):
        user = request.user

        if request.method == 'GET':
            profile = Profile.objects.filter(u_id=user).first()
            if not profile:
                return Response({'success': False, 'message': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
            
            serializer = ProfileSerializer(profile)
            return Response({'success': True, 'data': serializer.data, 'message': 'Profile fetched successfully'})

        elif request.method == 'POST':
            if Profile.objects.filter(u_id=user).exists():
                return Response({'success': False, 'message': 'Profile already exists'}, status=status.HTTP_400_BAD_REQUEST)

            data = request.data.copy()

            for field in ['p_picture', 'p_cover_picture']:
                if field in request.FILES:
                    f = request.FILES[field]
                    file_data_bytes = f.read()
                    upload_file_and_save.delay(
                        file_data_bytes=file_data_bytes,
                        file_name=f.name,
                        file_type=f.content_type,
                        file_size=f.size,
                        user_id=user.id,
                        category=field
                    )
                    data.pop(field)

            serializer = ProfileSerializer(data=data)
            serializer.is_valid(raise_exception=True)
            serializer.save(u_id=user)
            return Response({'success': True, 'data': serializer.data, 'message': 'Profile created successfully'}, status=status.HTTP_201_CREATED)

        elif request.method in ['PUT', 'PATCH']:
            try:
                profile = Profile.objects.get(u_id=user)
            except Profile.DoesNotExist:
                return Response({'success': False, 'message': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)

            data = request.data.copy()

            for field in ['p_picture', 'p_cover_picture']:
                if field in request.FILES:
                    f = request.FILES[field]
                    file_data_bytes = f.read()
                    
                    update_file.delay( 
                        file_id=getattr(profile, field).id if getattr(profile, field) else None,
                        new_file_data_bytes=file_data_bytes,
                        new_file_name=f.name,
                        new_file_type=f.content_type,
                        new_file_size=f.size
                    )
                    data.pop(field)

            serializer = ProfileSerializer(profile, data=data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response({'success': True, 'data': serializer.data, 'message': 'Profile updated successfully'})

        elif request.method == 'DELETE':
            try:
                profile = Profile.objects.get(u_id=user)
                p_picture = profile.p_picture
                p_cover_picture = profile.p_cover_picture
                if p_picture:
                    delete_file.delay(p_picture.id)
                if p_cover_picture:
                    delete_file.delay(p_cover_picture.id)
                profile.delete()
                return Response({'success': True, 'message': 'Profile deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
            except Profile.DoesNotExist:
                return Response({'success': False, 'message': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)

 
    @action(detail=False, methods=['get', 'post', 'put', 'patch', 'delete'], permission_classes=[permissions.IsAuthenticated], url_path='cv')
    def cv(self, request):
        user = request.user

        if request.method == 'GET':
            cv = Cv.objects.filter(user_id=user).first()
            if not cv:
                return Response({'success': False, 'message': 'CV not found'}, status=status.HTTP_404_NOT_FOUND)
            serializer = CvSerializer(cv)
            return Response({'success': True, 'data': serializer.data, 'message': 'CV fetched successfully'})

        elif request.method == 'POST':
            if Cv.objects.filter(user_id=user).exists():
                return Response({'success': False, 'message': 'CV already exists'}, status=status.HTTP_400_BAD_REQUEST)

            data = request.data.copy()

            if 'c_f_id' in request.FILES:
                f = request.FILES['c_f_id']
                file_data_bytes = f.read()
                save_cv_file.delay(
                    file_data_bytes=file_data_bytes,
                    file_name=f.name,
                    file_type=f.content_type,
                    file_size=f.size,
                    user_id=user.id,
                    category='cv'
                )
                data.pop('c_f_id')   

            serializer = CvSerializer(data=data)
            serializer.is_valid(raise_exception=True)
            serializer.save(user_id=user)

            return Response({'success': True, 'data': serializer.data, 'message': 'CV created successfully'}, status=status.HTTP_201_CREATED)

        elif request.method in ['PUT', 'PATCH']:
            try:
                cv = Cv.objects.get(user_id=user)
            except Cv.DoesNotExist:
                return Response({'success': False, 'message': 'CV not found'}, status=status.HTTP_404_NOT_FOUND)

            data = request.data.dict()

            if 'c_f_id' in request.FILES:
                f = request.FILES['c_f_id']
                print(f.name, f.content_type, f.size)
                file_data_bytes = f.read()
                update_file.delay(
                    file_id=cv.c_f_id.id if cv.c_f_id else None,
                    new_file_data_bytes=file_data_bytes,
                    new_file_name=f.name,
                    new_file_type=f.content_type,
                    new_file_size=f.size
                )
                data.pop('c_f_id')


            serializer = CvSerializer(cv, data=data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()

            return Response({'success': True, 'data': serializer.data, 'message': 'CV updated successfully'})

        elif request.method == 'DELETE':
            try:
                cv = Cv.objects.get(user_id=user)
                if cv.c_f_id:
                    delete_file.delay(cv.c_f_id.id)
                cv.delete()
                return Response({'success': True, 'message': 'CV deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
            except Cv.DoesNotExist:
                return Response({'success': False, 'message': 'CV not found'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated], url_path='notifications')
    def notifications(self, request):
        queryset = Notification.objects.filter(u_id=request.user).select_related('u_id')
        serializer = NotificationSerializer(queryset, many=True)
        return Response({'success': True, 'data': serializer.data, 'message': 'Notifications fetched successfully'})

    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAuthenticated], url_path='create-notification')
    def create_notification(self, request):
        serializer = NotificationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(u_id=request.user)
        return Response({'success': True, 'data': serializer.data, 'message': 'Notification created successfully'})


 
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated], url_path='updte-notification-status')
    def update_notification_status(self, request):
        notification_id = request.query_params.get('notification_id')
        if not notification_id:
            return Response({'success': False, 'message': 'Notification ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            notification = Notification.objects.get(id=notification_id, u_id=request.user)
            notification.n_is_read = True
            notification.save()
            return Response({'success': True, 'message': 'Notification status updated successfully'})
        except Notification.DoesNotExist:
            return Response({'success': False, 'message': 'Notification not found'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated], url_path='audit-logs')
    def audit_logs(self, request):
        queryset = AuditLog.objects.filter(u_id=request.user).select_related('u_id')
        serializer = AuditLogSerializer(queryset, many=True)
        return Response({'success': True, 'data': serializer.data, 'message': 'Audit logs fetched successfully'})
    @action (detail=False, methods=['get', 'post', 'put', 'patch', 'delete'], permission_classes=[permissions.IsAuthenticated], url_path='address')
    def address(self, request):
        user = request.user

        if request.method == 'GET':
            address = Address.objects.filter(u_id=user).first()
            if not address:
                return Response({'success': False, 'message': 'Address not found'}, status=status.HTTP_404_NOT_FOUND)
            serializer = AddressSerializer(address)
            return Response({'success': True, 'data': serializer.data, 'message': 'Address fetched successfully'})

        elif request.method == 'POST':
            if Address.objects.filter(u_id=user).exists():
                return Response({'success': False, 'message': 'Address already exists'}, status=status.HTTP_400_BAD_REQUEST)
           
            serializer = AddressSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save(u_id=user)
            return Response({'success': True, 'data': serializer.data, 'message': 'Address created successfully'}, status=status.HTTP_201_CREATED)

        elif request.method in ['PUT', 'PATCH']:
            try:
                address = Address.objects.get(u_id=user)
            except Address.DoesNotExist:
                return Response({'success': False, 'message': 'Address not found'}, status=status.HTTP_404_NOT_FOUND)

            serializer = AddressSerializer(address, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response({'success': True, 'data': serializer.data, 'message': 'Address updated successfully'})

        elif request.method == 'DELETE':
            try:
                address = Address.objects.get(u_id=user)
                address.delete()
                return Response({'success': True, 'message': 'Address deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
            except Address.DoesNotExist:
                return Response({'success': False, 'message': 'Address not found'}, status=status.HTTP_404_NOT_FOUND)


 

    





 


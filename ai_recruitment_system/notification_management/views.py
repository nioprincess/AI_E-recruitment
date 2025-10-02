from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Notification
from .serializers import NotificationSerializer
from user_management.permissions import IsAdmin
from user_management.serializers import AuditLogSerializer
from user_management.models import AuditLog

class NotificationViewSet(viewsets.ModelViewSet):
    
    serializer_class = NotificationSerializer
    queryset = Notification.objects.all().select_related('u_id', 'c_id')
    
    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action in ['list', 'retrieve', 'get_user_notifications', 'mark_as_read', 'mark_all_as_read']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAdmin]
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            return self.queryset.filter(u_id=user)
        return self.queryset.none()
    
    @action(detail=False, methods=['GET'], url_path='my-notifications')
    def get_user_notifications(self, request):
        """
        View for regular users to see their own notifications
        """
        try:
            # Get query parameters for filtering
            status_filter = request.query_params.get('status', 'all')
            limit = request.query_params.get('limit')
            
            # Base queryset - user's own notifications
            notifications = Notification.objects.filter(u_id=request.user).select_related('u_id', 'c_id')
            
            # Apply status filters
            if status_filter == 'read':
                notifications = notifications.filter(n_is_read=True)
            elif status_filter == 'unread':
                notifications = notifications.filter(n_is_read=False)
            
            # Order by latest first
            notifications = notifications.order_by('-created_at')
            
            # Apply limit if provided
            if limit and limit.isdigit():
                notifications = notifications[:int(limit)]
            
            serializer = self.get_serializer(notifications, many=True)
            
            # Count unread notifications for the response
            unread_count = Notification.objects.filter(u_id=request.user, n_is_read=False).count()
            
            return Response({
                'success': True,
                'data': serializer.data,
                'unread_count': unread_count,
                'total_count': notifications.count(),
                'message': 'Notifications fetched successfully'
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'success': False,
                'message': f'Error fetching notifications: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=True, methods=['POST'], url_path='mark-read')
    def mark_as_read(self, request, pk=None):
        """
        Mark a specific notification as read
        """
        try:
            notification = self.get_queryset().get(pk=pk)
            notification.n_is_read = True
            notification.save()
            
            serializer = self.get_serializer(notification)
            return Response({
                'success': True,
                'data': serializer.data,
                'message': 'Notification marked as read successfully'
            }, status=status.HTTP_200_OK)
            
        except Notification.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Notification not found'
            }, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['POST'], url_path='mark-all-read')
    def mark_all_as_read(self, request):
        """
        Mark all user's notifications as read
        """
        try:
            updated_count = self.get_queryset().filter(n_is_read=False).update(n_is_read=True)
            
            return Response({
                'success': True,
                'message': f'{updated_count} notifications marked as read successfully'
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'success': False,
                'message': f'Error marking notifications as read: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['DELETE'], url_path='delete-all')
    def delete_all_notifications(self, request):
        """
        Admin only - delete notifications based on status
        """
        notification_status = request.query_params.get('status')
        if notification_status == 'read':
            deleted_count, _ = Notification.objects.filter(n_is_read=True).delete()
            return Response({'success': True, 'message': f'{deleted_count} read notifications deleted successfully.'}, status=204)
        elif notification_status == 'unread':
            deleted_count, _ = Notification.objects.filter(n_is_read=False).delete()
            return Response({'success': True, 'message': f'{deleted_count} unread notifications deleted successfully.'}, status=204)
        else:
            deleted_count, _ = Notification.objects.all().delete()
            return Response({'success': True, 'message': f'{deleted_count} notifications deleted successfully.'}, status=204)
    
    @action(detail=False, methods=['GET'], url_path='audit-logs')
    def audit_logs(self, request):
        """
        Admin only - get audit logs
        """
        audit_logs = AuditLog.objects.filter().order_by('-created_at')
        serializer = AuditLogSerializer(audit_logs, many=True)
        
        return Response({'success': True, 'data': serializer.data, 'message': 'Audit logs fetched successfully'}, status=200)
    
    @action(detail=False, methods=['delete'], url_path='delete-audit-log')
    def delete_audit_log(self, request):
        """
        Admin only - delete audit logs
        """
        log_id = request.query_params.get('log_id')
        
        try:
            if log_id:
                audit_log = AuditLog.objects.get(id=log_id, u_id=request.user)
                audit_log.delete()
                return Response({'success': True, 'message': 'Audit log deleted successfully'}, status=204)
            else:
                AuditLog.objects.all().delete()
                return Response({'success': True, 'message': 'All audit logs deleted successfully'}, status=204)
                
        except AuditLog.DoesNotExist:
            return Response({'success': False, 'message': 'Audit log not found'}, status=404)
from rest_framework import  viewsets
from rest_framework.decorators import action
from .models import Notification
from .serializers import NotificationSerializer
from user_management.permissions  import IsAdmin
from rest_framework.response import Response
from user_management.serializers import AuditLogSerializer
from user_management.models import AuditLog

class NotificationViewSet(viewsets.ModelViewSet):
    
    serializer_class = NotificationSerializer
    queryset = Notification.objects.all().select_related('u_id', 'c_id')
    permission_classes= [IsAdmin]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            return self.queryset.filter(u_id=user)
        return self.queryset.none()  
    
    @action(detail=False, methods=['DELETE'], permission_classes=[IsAdmin], url_path='delete-all')
    def delete_all_notifications(self, request):
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
    @action(detail=False, methods=['GET'], permission_classes=[IsAdmin], url_path='audit-logs')
    def audit_logs(self, request):
        audit_logs = AuditLog.objects.filter().order_by('-created_at')
        serializer = AuditLogSerializer(audit_logs, many=True)
        
        return Response({'success': True, 'data': serializer.data, 'message': 'Audit logs fetched successfully'}, status=200)
    
    @action(detail=False, methods=['delete'], permission_classes=[IsAdmin], url_path='delete-audit-log')
    def delete_audit_log(self, request):
        log_id = request.query_params.get('log_id')
       
        
        try:
            if  log_id:
                audit_log = AuditLog.objects.get(id=log_id, u_id=request.user)
                audit_log.delete()
                return Response({'success': True, 'message': 'Audit log deleted successfully'}, status=204)
            else:
                AuditLog.objects.all().delete()
                return Response({'success': True, 'message': 'All audit logs deleted successfully'}, status=204)
                
        except AuditLog.DoesNotExist:
            return Response({'success': False, 'message': 'Audit log not found'}, status=404)

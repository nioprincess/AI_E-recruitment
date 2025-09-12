import json
from django.utils import timezone
from django.utils.deprecation import MiddlewareMixin
from django.contrib.auth.models import User
from user_management.models import AuditLog
from rest_framework_simplejwt.authentication import JWTAuthentication
from channels.auth import AuthMiddlewareStack
from channels.db import database_sync_to_async

 

class AuditLogHttpMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        # Required for Django's MiddlewareMixin compatibility
        self.async_capable = True
        self.sync_capable = True

    def __call__(self, request):
        # Don't log OPTIONS requests
        if request.method == 'OPTIONS':
            return self.get_response(request)

        # Initialize request.audit_log for later use
        request.audit_log = {
            'action': f"{request.method} {request.path}",
            'ip_address': self._get_client_ip(request),
            'user_agent': request.META.get('HTTP_USER_AGENT', ''),
            'metadata': json.dumps({
                'path': request.path,
                'method': request.method,
                'query_params': dict(request.GET),
            })
        }

        response = self.get_response(request)

        try:
            user = self._get_authenticated_user(request)
            
            # Update metadata with response info
            metadata = json.loads(request.audit_log['metadata'])
            metadata.update({
                'status_code': response.status_code,
                'response_size': len(getattr(response, 'content', b'')),
            })
            request.audit_log['metadata'] = json.dumps(metadata)

            # Create the log entry
            self._create_audit_log(
                user=user,
                action=request.audit_log['action'],
                ip_address=request.audit_log['ip_address'],
                user_agent=request.audit_log['user_agent'],
                metadata=request.audit_log['metadata']
            )
        except Exception as e:
            # Don't break the request if logging fails
            pass

        return response

    def _get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

    def _get_authenticated_user(self, request):
        # Try JWT authentication first
        try:
            auth = JWTAuthentication()
            validated_token = auth.get_validated_token(auth.get_raw_token(auth.get_header(request)))
            user = auth.get_user(validated_token)
            if user:
                return user
        except:
            pass

        # Fall back to session auth
        if hasattr(request, 'user') and request.user.is_authenticated:
            return request.user

        return None

    def _create_audit_log(self, user, **kwargs):
        if user is None:
            return

        AuditLog.objects.create(
            u_id=user,
            a_action=kwargs.get('action', ''),
            a_ip_address=kwargs.get('ip_address', ''),
            a_user_agent=kwargs.get('user_agent', ''),
            a_metadata=kwargs.get('metadata', ''),
            created_at=timezone.now(),
            updated_at=timezone.now()
        )



 
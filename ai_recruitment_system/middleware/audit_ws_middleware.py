from channels.middleware import BaseMiddleware
from django.utils.timezone import now
from user_management.models import AuditLog
import json


class AuditLogWebSocketMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        user = scope.get("user", None)
        if user and user.is_authenticated:
            AuditLog.objects.create(
                u_id=user,
                a_action=f"WebSocket CONNECT to {scope['path']}",
                a_ip_address=self.get_ip(scope),
                a_user_agent=scope.get("headers", b""),
                a_metadata=json.dumps({
                    "query_string": scope.get("query_string", b"").decode(),
                    "headers": {k.decode(): v.decode() for k, v in scope.get("headers", [])}
                }),
                created_at=now(),
                updated_at=now()
            )
        return await super().__call__(scope, receive, send)

    def get_ip(self, scope):
        for header in scope.get("headers", []):
            if header[0].decode() == "x-forwarded-for":
                return header[1].decode().split(",")[0]
        return scope.get("client", [""])[0]

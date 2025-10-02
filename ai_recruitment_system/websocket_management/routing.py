from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.urls import path, re_path
from . import consumers
from notification_management.consumers import NotificationConsumer


websocket_urlpatterns = [
    re_path(r"^ws/audio/$", consumers.AudioConsumer.as_asgi()),
    path("ws/audio", consumers.AudioConsumer.as_asgi()),
    re_path(r"^ws/video/$", consumers.FrameConsumer.as_asgi()),
    path("ws/video", consumers.FrameConsumer.as_asgi()),
    re_path(r"^ws/stream/$", consumers.WebRTCConsumer.as_asgi()),
    path("ws/stream", consumers.WebRTCConsumer.as_asgi()),
    re_path(r"^ws/notification/$", NotificationConsumer.as_asgi()),
    path("ws/notification", NotificationConsumer.as_asgi()),
    re_path(r"^ws/quas/$", consumers.QuasiPeerConsumer.as_asgi()),
    path("ws/quas", consumers.QuasiPeerConsumer.as_asgi()),
    re_path(r"^ws/interview/$", consumers.InterviewConsumer.as_asgi()),
    path("ws/interview", consumers.InterviewConsumer.as_asgi()),
    re_path(r"^ws/observation/$", consumers.ObservationConsumer.as_asgi()),
    path("ws/observation", consumers.ObservationConsumer.as_asgi()),
]

application = ProtocolTypeRouter(
    {
        "websocket": AuthMiddlewareStack(URLRouter(websocket_urlpatterns)),
    }
)

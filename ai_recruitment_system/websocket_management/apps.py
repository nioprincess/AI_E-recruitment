from django.apps import AppConfig
from .voski_loader import load_model 


class WebsocketManagementConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "websocket_management"
    def ready(self):
        load_model()
        return super().ready()

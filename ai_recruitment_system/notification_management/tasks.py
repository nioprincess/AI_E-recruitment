from celery import shared_task
from .models import Notification
from django.contrib.auth import get_user_model
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from company_management.models import  Company

@shared_task
def send_notification( message, n_type='info', is_read=False, c_id=None,user_id=None, broadcast=False):
    user = get_user_model().objects.get(id=user_id)
    company=None
    if c_id:
        company= Company.objects.filter(id=c_id).first()
    if user and not broadcast:
        Notification.objects.create(u_id=user, n_message=message, n_type=n_type, n_is_read=is_read, c_id=company)
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f"user_{user_id}", {
                "type": "notify",
                "message": message
            }
        )
    elif broadcast:
        # Notification.objects.create(n_message=message, n_type=n_type, n_is_read=is_read, c_id=c_id)
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            "broadcast_notifications", {
                "type": "notify",
                "message": message
            }
        )

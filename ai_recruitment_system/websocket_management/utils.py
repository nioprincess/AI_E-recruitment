 
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
 
 
def process_ai_response(response, user_id):
    print(response, user_id)
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"user_{user_id}_interview",
        {
            "type": "send_interview_response", 
            "message":  response,
            "message_type": "info"
        }
    )
    return "Done"
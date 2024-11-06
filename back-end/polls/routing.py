from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path(r'ws/game/<int:game_id>/', consumers.ChatConsumer.as_asgi()),
]

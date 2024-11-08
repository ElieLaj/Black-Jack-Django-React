import json
from channels.generic.websocket import AsyncWebsocketConsumer

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.game_id = self.scope['url_route']['kwargs']['game_id']
        self.game_group_name = f'game_{self.game_id}'
        print(self.game_group_name)
        # Join game group 
        await self.channel_layer.group_add(
            self.game_group_name,
            self.channel_name
        )

        self.send(text_data=json.dumps({
            'type': 'connection established',
            'message': 'You are connected'
        }))

        await self.accept()

    async def disconnect(self, close_code):
        # Leave game group
        await self.channel_layer.group_discard(
            self.game_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']

        # Send message to game group
        await self.channel_layer.group_send(
            self.game_group_name,
            {
                'type': 'game_message',
                'message': message
            }
        )

    async def game_message(self, event):
        message = event['message']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))
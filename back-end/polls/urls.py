from ninja import NinjaAPI, ModelSchema, Schema
from polls.models import Game, Player
from django.http import Http404
from tools.dice import *
from tools.decideWinner import *

from typing import Optional
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

api = NinjaAPI()

class PlayerSchema(ModelSchema):
    class Meta:
        model = Player
        fields = ["id", "name", "score", "out"]

class GameSchema(ModelSchema):
    class Meta:
        model = Game
        fields = ["id", "name", "turn", "ended"]
    players: list[PlayerSchema]
    dealer: PlayerSchema
    winner: Optional[PlayerSchema]
    current_player: Optional[PlayerSchema]

    @staticmethod
    def resolve_players(obj):
        players = obj.players.exclude(id=obj.dealer_id)
        return players

class AddGameSchema(Schema):
    name: str
    players: list[str]

class JoinGameSchema(Schema):
    game_id: str
    players: list[str]

class ThrowDicesSchema(Schema):
    game_id: str
    nb_dices: int


@api.post("/create_game", response=GameSchema)
def add(request, add_game: AddGameSchema):
    game = Game.objects.create(
        name = add_game.name
        )
    
    dealer = Player.objects.create(name="Dealer", game=game)
    game.dealer = dealer


    for player in add_game.players:
        Player.objects.create(
            name = player,
            game = game
        )
    game.current_player = dealer

    game.save()

    return game

@api.put("/join_game/{game_id}/{players}", response=GameSchema)
def join(request, game_id, players):
    try:
        game = Game.objects.get(pk=game_id)
    except Game.DoesNotExist:
        raise Http404("Game does not exist")
    print(players)
    players
    Player.objects.create(
        name = players,
        game = game
    )

    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f'game_{game_id}',
        {
            'type': 'game_message',
            'message': f'Player {players} has joined.',
        }
    )
    game.save()
    return game

@api.get("/game/{game_id}", response=GameSchema)
def get(request, game_id: int):
    try:
        game = Game.objects.get(pk=game_id)
    except Game.DoesNotExist:
        raise Http404("Game does not exist")
    return game

@api.put("/game/dice_throw/{game_id}/{nb_dices}", response=GameSchema)
def dice_throw(request, game_id: int, nb_dices: int):
    try:
        game = Game.objects.get(pk=game_id)
        if game.ended:
            return game

        if game.current_player == game.dealer:
            if game.dealer.score < 17:
                game.dealer.score += ThrowDice(AIDice(game.dealer.score))
                game.dealer.out = True if game.dealer.score > 17 else False
            else:
                game.dealer.out = True
            game.dealer.save()

        else:
            if not game.current_player.out:
                player = Player.objects.get(pk=game.current_player.id)
                player.score += ThrowDice(nb_dices)
                player.out = True if game.dealer.score > 21 else False

                if player.score >= 21:
                    player.out = True
                player.save()
                
        game.save()
        player_list = game.players.all().exclude(pk=game.winner.id if game.winner else None)
        
        if all(player.out for player in player_list) or len(player_list.filter(score=21)):
            game.ended = True
            game.winner = decideWinner(game)
        else:
            game.turn += 1
            in_player_list = player_list.exclude(out=True)
            in_player_list_len = len(in_player_list)
            if in_player_list_len > 0:
                game.current_player = in_player_list[game.turn % in_player_list_len]            
            else:
                game.current_player = None
        game.save()

        return game
    except Game.DoesNotExist:
        raise Http404("Game does not exist")
    

@api.patch("/game/player_out/{game_id}", response=GameSchema)
def patch_player_out(request, game_id: str):
    try:
        game = Game.objects.get(pk=game_id)
        player = Player.objects.get(pk=game.current_player.id)
        player.out = True
        player.save()

        player_list = game.players.all().exclude(pk=game.winner.id if game.winner else None)

        if all(player.out for player in game.players.all().exclude(pk=game.winner.id if game.winner else None)):
            game.ended = True
            game.winner = decideWinner(game)
        
        if all(player.out for player in player_list) or len(player_list.filter(score=21)):
            game.ended = True
            game.winner = decideWinner(game)
        else:
            game.turn += 1
            in_player_list = player_list.exclude(out=True)
            in_player_list_len = len(in_player_list)
            if in_player_list_len > 0:
                game.current_player = in_player_list[game.turn % in_player_list_len]            
            else:
                game.current_player = None

        game.save()

    except Game.DoesNotExist:
        raise Http404("Game does not exist")
    return game
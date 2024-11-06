from ninja import NinjaAPI, ModelSchema, Schema
from polls.models import Game, Player
from django.http import Http404
from tools.Dice import *
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
    game.save()


    for player in add_game.players:
        Player.objects.create(
            name = player,
            game = game
        )

    return game

@api.put("/join_game/{game_id}/{players}", response=GameSchema)
def join(request, game_id, player):
    try:
        game = Game.objects.get(pk=game_id)
    except Game.DoesNotExist:
        raise Http404("Game does not exist")

    Player.objects.create(
        name = player,
        game = game
    )

    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f'game_{game_id}',
        {
            'type': 'game_message',
            'message': f'Player {player} has joined.',
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

        # Lancer les dés pour le dealer
        if game.dealer.score < 17:
            game.dealer.score += ThrowDice(AIDice(game.dealer.score))
            if game.dealer.score == 21:
                    game.ended = True
                    game.winner = game.dealer
                    game.dealer.save()
            if game.dealer.score > 21:
                game.dealer.out = True
            game.dealer.save()

        # Lancer les dés pour les joueurs
        for player in game.players.exclude(pk=game.dealer.id):
            if not player.out:
                if player.id == game.players.exclude(pk=game.dealer.id)[0].id:
                    player.score += ThrowDice(nb_dices)
                else:
                    if (AIDice(player.score)) > 0:
                        player.score += ThrowDice(AIDice(player.score))
                    else:
                        player.out = True
                if player.score == 21:
                    game.ended = True
                    game.winner = player
                    player.save()
                    break
                elif player.score > 21:
                    player.out = True
                player.save()

        # Vérifier si tous les joueurs sont out
        if all(player.out for player in game.players.exclude(pk=game.dealer.id)):
            game.ended = True
            if not game.dealer.out or game.dealer.score == 21:
                game.winner = game.dealer
            else:
                players = list(game.players.exclude(pk=-1))
                maxi = players[0]
                for player in game.players:
                    if player.score >= maxi.score and player.score <= 21:
                        maxi = player
                game.winner = maxi
        game.turn += 1

        game.save()
        return game
    except Game.DoesNotExist:
        raise Http404("Game does not exist")
    

@api.patch("/game/player_out/{game_id}/{player_id}", response=GameSchema)
def patch_player_out(request, game_id: int, player_id: int):
    try:
        game = Game.objects.get(pk=game_id)
        player = Player.objects.get(pk=player_id)
        player.out = True
        player.save()
    except Game.DoesNotExist:
        raise Http404("Game does not exist")
    return game
from polls.models import Game
from polls.models import Player

def create_game(game_name, players: list[str]):
    game = Game.objects.create(name=game_name)
    Player.objects.bulk_create([Player(name=player, game=game) for player in players])
    return game

def get_players(game_id: str):
    game = Game.objects.get(id=game_id)
    players = game.players.all()
    return players
    
def change_score(player_id: str, score: int):
    player = Player.objects.get(id=player_id)
    player.score = score
    player.save()
    return player

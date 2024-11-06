def decideWinner(game):
    if not game.dealer.out or game.dealer.score == 21:
        game.winner = game.dealer
        return game.dealer
    else:
        players = game.players.all()
        closest_player = None
        closest_score = 0
        for player in players:
            if player.score <= 21 and player.score > closest_score:
                closest_player = player
                closest_score = player.score
        return closest_player
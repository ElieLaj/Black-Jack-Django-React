from ninja import NinjaAPI, ModelSchema, Schema
from polls.models import Choice, Question, Game, Player
from django.utils import timezone
from django.http import Http404

api = NinjaAPI()

class ChoiceSchema(ModelSchema):
    class Meta:
        model = Choice
        fields = ["id", "choice_text", "votes"]


class QuestionSchema(ModelSchema):
    class Meta:
        model = Question
        fields = ["id", "question_text", "pub_date"]
    choices: list[ChoiceSchema]

class AddQuestionSchema(Schema):
    question_text: str
    choices: list[str]

# @api.post("/create_question", response=QuestionSchema)
# def add(request, add_question: AddQuestionSchema):
#     question = Question.objects.create(
#         question_text = add_question.question_text, pub_date=timezone.now()
#         )
    
#     for choice in add_question.choices:
#         Choice.objects.create(
#             choice_text = choice,
#             question = question
#         )

#     return question

# @api.get("/question/{question_id}", response=QuestionSchema)
# def get(request, question_id: int):
#     question = Question.objects.get(pk=question_id)
#     return question

# ----------------

class PlayerSchema(ModelSchema):
    class Meta:
        model = Player
        fields = ["id", "name", "score"]

class GameSchema(ModelSchema):
    class Meta:
        model = Game
        fields = ["id", "name", "turn", "ended"]
    players: list[PlayerSchema]


class AddGameSchema(Schema):
    name: str
    players: list[str]


@api.post("/create_game", response=GameSchema)
def add(request, add_game: AddGameSchema):
    game = Game.objects.create(
        name = add_game.name
        )
    
    for player in add_game.players:
        Player.objects.create(
            name = player,
            game = game
        )
    return game

@api.get("/game/{game_id}", response=GameSchema)
def get(request, game_id: int):
    try:
        game = Game.objects.get(pk=game_id)
    except Game.DoesNotExist:
        raise Http404("Game does not exist")
    return game
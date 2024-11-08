from django.db import models

# Create your models here.
class Question(models.Model):
    question_text = models.CharField(max_length=200)
    pub_date = models.DateTimeField('date published')

class Choice(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='choices')
    choice_text = models.CharField(max_length=200)
    votes = models.IntegerField(default=0)

    def __str__(self):
        return self.choice_text
    
class Game(models.Model):
    name = models.CharField(max_length=50)
    turn = models.IntegerField(default=0)
    ended = models.BooleanField(default=False)
    dealer = models.ForeignKey('Player', related_name='dealt_games', on_delete=models.SET_NULL, null=True, blank=True)
    winner = models.ForeignKey('Player', related_name='won_games', on_delete=models.SET_NULL, null=True, blank=True, default=None)
    current_player = models.ForeignKey('Player', related_name='current_turn', on_delete=models.SET_NULL, null=True, blank=True)

class Player(models.Model):
    game = models.ForeignKey(Game, related_name='players', on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    score = models.IntegerField(default=0)
    out = models.BooleanField(default=False)

import random

def AIDice(dealerScore: int):
    max_dices = 3
    dealerCantPlay = True
    while dealerCantPlay:
        max_roll = 6
        while max_roll > 1:
            if dealerScore + max_dices * max_roll > 21:
                max_roll -= 1
            else:
                dealerCantPlay = False
                break
            if max_roll == 1:
                max_dices -= 1
                break
    if max_dices == 3 and dealerScore + 6 * 3 > 21:
        return 2
    if max_dices == 2 and dealerScore + 6 * 2 > 21:
        return 1
    if max_dices == 1 and dealerScore + 3 > 21:
        return 0
    return max_dices

def ThrowDice(nb_dices: int):
    result = 0
    for i in range (nb_dices):
        result += random.randint(1, 6)
    return result
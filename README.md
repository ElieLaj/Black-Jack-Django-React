# Black Jack - Django & React

Un projet de jeu de Black Jack développé avec Django (backend) et React (frontend).

## Description

Ce projet est une application de jeu de Black Jack simplifié. Le backend est construit en Django, qui gère la logique du jeu et les API, tandis que le frontend est développé en React pour une interface utilisateur dynamique et interactive.

## Fonctionnalités
**Gestion des parties** : commencez une partie de Black Jack, jeter jusqu'à 3 dés tour par tour, et essayez d'atteindre 21 points sans dépasser.

## Installation Back-End
Créer un fichier .venv dans back-end:
cd back-end
python -m venv .venv

Lancer le venv:
.venv\Scripts\activate

Mettre pip à jour:
python.exe -m pip install --upgrade pip 


Installer les dépendances:
pip install Django
pip install Django-ninja
pip install django-cors-headers

Gérer les migrations:
python manage.py makemigrations
python manage.py migrate

Lancer le serveur:
python manage.py runserver 0.0.0.0:8000

## Installation Front-End
Aller dans le dossier Black-jack:
cd Black-jack

Lancer le build:
npm run build

Lancer le serveur Vite:
npm run host

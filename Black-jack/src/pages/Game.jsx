import { Table } from "../components/Table";
// import { GameView } from "../components/GameView";
// import { GameCreation } from "../components/GameView";

import useCreateGame from "../hooks/useCreateGame"
import useDiceThrow from "../hooks/useDiceThrow";
import usePlayerOut from "../hooks/usePlayerOut";
import useJoinGame from "../hooks/useJoinGame";

import { Icon } from "@iconify/react";

import React, { useState, useEffect } from "react";

export function Game() {
    const { createGame } = useCreateGame();
    const { diceThrow } = useDiceThrow();
    const { playerOut } = usePlayerOut();
    const { joinGame } = useJoinGame();
    const [game, setGame] = useState({});
    const [gameName, setGameName] = useState("");
    const [diceNumber, setDiceNumber] = useState(1);
    const [playerList, setPlayerList] = useState([]);
    const [playerName, setPlayerName] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [joinGameId, setJoinGameId] = useState("");

    const [gameId, setGameId] = useState("");

    const socket = new WebSocket(
      `ws://${window.location.host}/ws/game/${gameId}/`
    );

    useEffect(() => {
      if (gameId) {
        console.log("Game ID:", gameId);

        socket.onmessage = function (event) {
          const data = JSON.parse(event.data);
          console.log("Message from server:", data.message);
          // Mettre à jour l'état du jeu avec les nouvelles données
          fetchGame(gameId);
        };

        socket.onclose = function (event) {
          console.error("WebSocket closed unexpectedly");
        };

        return () => {
        };
      }
    }, [socket, gameId]);

    const handleCreateGame = async () => {
      if (playerList.length < 1) {
        setErrorMessage("Il faut au moins un joueur pour commencer la partie");
        return;
      }
      setErrorMessage("");
      const newGame = await createGame(gameName == "" ? "Black Jack" : gameName, playerList);
      setGame(newGame);
      setGameId(newGame.id);
    };

    const handleJoinGame = async () => {
    if (playerList.length < 1) {
      setErrorMessage(
        "Il faut au moins un joueur pour rejoindre la partie"
      );
      return;
    }
    setErrorMessage("");
      const gameResult = await joinGame(joinGameId, playerList);
      setGame(gameResult);
      setGameId(gameResult.id);
    }

    const handleDiceThrow = async () => {
      if (gameName == "") {
        setGameName("Black Jack");
      }
      const gameResult = await diceThrow(game.id, diceNumber);
      setGame(gameResult);
    };

    const handlePlayerOut = async () => {
      const gameResult = await playerOut(game.id, game.players[0].id);
        setGame(gameResult);
      };
        
    return (
      <div>
        <h1>Game</h1>
        {"players" in game ? (
          <div>
            <h1>ID: {game.id}</h1>
            <h1>Croupier: {game.dealer.score}</h1>
            <Table game={game} />

            {game.ended ? (
              <p>Fin de la partie, {game.winner.name} a gagné !</p>
            ) : (
              <>
                <input
                  type="number"
                  min="1"
                  max="3"
                  value={diceNumber}
                  onChange={(e) => {
                    setDiceNumber(e.target.value);
                  }}
                />
                <button onClick={handleDiceThrow}>Lancer les dés</button>
                <button onClick={handlePlayerOut}>Se retirer</button>
              </>
            )}
          </div>
        ) : (
          <div>
            <h2 className="SubTitle">Entrez le nom de la partie</h2>
            {errorMessage != "" ? <h2>{errorMessage}</h2> : null}
            <div className="ButtonHolder">
              <input
                type="text"
                value={gameName}
                onChange={(e) => {
                  setGameName(e.target.value);
                }}
              />
              <button onClick={handleCreateGame}>Créer la partie</button>
            </div>
            <div className="ButtonHolder">
              <input
                type="text"
                value={playerName}
                onChange={(e) => {
                  setPlayerName(e.target.value);
                }}
              />
              <button
                onClick={() => {
                  if (!playerName) return;
                  setPlayerList([...playerList, playerName]);
                  setPlayerName("");
                }}
              >
                Ajouter un(e) joueur(se)
              </button>
            </div>
            <ul className="PlayerList">
              {playerList.map((player, index) => (
                <li key={index}>
                  <p>Nom: {player}</p>
                  <button
                    onClick={() => {
                      setPlayerList([
                        ...playerList.slice(0, index),
                        ...playerList.slice(index + 1),
                      ]);
                    }}
                  >
                    <Icon icon="twemoji:cross-mark" />
                  </button>
                </li>
              ))}
            </ul>
            <input
              type="text"
              value={joinGameId}
              onChange={(e) => {
                setJoinGameId(e.target.value);
              }}
            />
            <button onClick={handleJoinGame}>Rejoindre une partie</button>
          </div>
        )}
      </div>
    );
}
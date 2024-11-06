import { Table } from "../components/Table";
// import { GameView } from "../components/GameView";
// import { GameCreation } from "../components/GameView";

import useFetchGame from "../hooks/useFetchGame";
import useDiceThrow from "../hooks/useDiceThrow";
import usePlayerOut from "../hooks/usePlayerOut";

import { useParams } from "react-router-dom";
import { Icon } from "@iconify/react";

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export function Game() {
    const { id } = useParams();

    const { fetchGame } = useFetchGame();
    const { diceThrow } = useDiceThrow();
    const { playerOut } = usePlayerOut();

    const [game, setGame] = useState({});
    const [diceNumber, setDiceNumber] = useState(1);

    const socket = new WebSocket(
      `ws://${window.location.host}/ws/game/40`
    );
    
    socket.onmessage = function (event) {
      console.log("Event:", event);
      const data = JSON.parse(event.data);
      console.log("Message from server:", data.message);
      fetchGame(id);
    };

    const handleFetchData = async () => {
      const gameData = await fetchGame(id);
      setGame(gameData);
    };

    useEffect(() => {
      console.log(id);
      if (!game.id){
        handleFetchData();
      }
      if (id) {
        fetchGame(id);

        socket.onclose = function (event) {
          console.error("WebSocket closed unexpectedly");
        };

        return () => {
        };
      }
    }, [socket, id]);

    const handleDiceThrow = async () => {
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
              <>
                <p>Fin de la partie, {game.winner.name} a gagné !</p>
                  <Link to={"/"}>Revenir à l'accueil</Link>
              </>
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
        ) : null}
      </div>
    );
}
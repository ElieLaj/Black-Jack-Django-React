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
      handleFetchData(id);
    };

    const handleFetchData = async () => {
      const gameData = await fetchGame(
        id,
        window.location.host.split(":", 1)[0]
      );
      setGame(gameData);
    };

    useEffect(() => {
      if (!game.id){
        handleFetchData();
      }
      if (id) {
        socket.onclose = function (event) {
          console.error("WebSocket closed unexpectedly");
        };

        return () => {
        };
      }
    }, [socket, id]);

    const handleDiceThrow = async () => {
      const gameResult = await diceThrow(
        game.id,
        diceNumber,
        window.location.host.split(":", 1)[0]
      );
      setGame(gameResult);
    };

    const handlePlayerOut = async () => {
      const gameResult = await playerOut(
        game.id,
        window.location.host.split(":", 1)[0]
      );
        setGame(gameResult);
      };
        
    return (
      <div className="GameContainer">
        {"players" in game ? (
          <div>
            <h1>Dealer: {game.dealer.score}</h1>
            <h2>Retiré: {game.dealer.out ? "Oui" : "Non"}</h2>
            <Table game={game} />

            {game.ended ? (
              <>
                <p>Fin de la partie, {game.winner.name} a gagné !</p>
                <Link to={"/"}>Revenir à l'accueil</Link>
              </>
            ) : (
              <>
                <h2>C'est au tour de {game.current_player.name} </h2>
                {game.current_player.id == game.dealer.id ? (
                  <>
                    <button onClick={handleDiceThrow}>
                      Lancer les dés du Dealer
                    </button>
                  </>
                ) : (
                  <div className="ControlContainer">
                    <div className="GameButtonHolder">
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
                    </div>
                    <button onClick={handlePlayerOut}>Se retirer</button>
                  </div>
                )}
              </>
            )}
          </div>
        ) : null}
      </div>
    );
}
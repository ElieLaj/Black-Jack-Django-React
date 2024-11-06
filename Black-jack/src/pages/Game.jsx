import { Table } from "../components/Table";
// import { GameView } from "../components/GameView";
// import { GameCreation } from "../components/GameView";

import useCreateGame from "../hooks/useCreateGame"
import useDiceThrow from "../hooks/useDiceThrow";

import { useState } from "react";

export function Game() {
    const { createGame } = useCreateGame();
    const { diceThrow } = useDiceThrow();
    const [game, setGame] = useState({});
    const [gameName, setGameName] = useState("");
    const [diceNumber, setDiceNumber] = useState(1);
    
    const handleCreateGame = async () => {
      const newGame = await createGame(gameName == "" ? "Black Jack" : gameName);
      setGame(newGame);
    };

    const handleDiceThrow = async () => {
      if (gameName == "") {
        setGameName("Black Jack");
      }
      const gameResult = await diceThrow(game.id, diceNumber);
      setGame(gameResult);
    };
        
    return (
      <div>
        <h1>Game</h1>
        {"players" in game ? (
          <div>
            <h1>Croupier: {game.dealer.score}</h1>
            <Table game={game}/>

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
              </>
            )}
          </div>
        ) : (
          <div>
            <h2>Entrez le nom de la partie</h2>
            <input
              type="text"
              value={gameName}
              onChange={(e) => {
                setGameName(e.target.value);
              }}
            />
            <button onClick={handleCreateGame}>Create Game</button>
          </div>
        )}
      </div>
    );
}
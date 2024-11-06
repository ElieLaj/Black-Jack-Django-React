import { useState, useEffect } from 'react'
import '../App.jsx'
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import useCreateGame from "../hooks/useCreateGame";
import useJoinGame from "../hooks/useJoinGame";
import dices from '../assets/dices.png'

export function Home() {
    const navigate = useNavigate();

    const { createGame } = useCreateGame();
    const { joinGame } = useJoinGame();

    const [playerName, setPlayerName] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [gameName, setGameName] = useState("");  
    const [playerList, setPlayerList] = useState([]);
    const [joinGameId, setJoinGameId] = useState("");

    const [game, setGame] = useState({});

    useEffect(() => {
      if (game.id) {
            navigate(`/game/${game.id}`);
      }
    }, [game]);

    const handleCreateGame = async () => {
      if (playerList.length < 1) {
        setErrorMessage(
          "Il faut au moins un joueur pour commencer la partie"
        );
        return;
      }
      setErrorMessage("");
      const newGame = await createGame(
        gameName == "" ? "Black Jack" : gameName,
        playerList
      );
      setGame(newGame);
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
    };
    
  return (
    <>
      <div>
        <div className="TitleContainer">
          <img src={dices} alt="" />
          <h1>Black Jack</h1>
          <img src={dices} alt="" />
        </div>
        <h2 className="SubTitle">Entrez le nom de la partie</h2>
        {errorMessage != "" ? <h2>{errorMessage}</h2> : null}
        <div className="ButtonHolder">
          <input
            type="text"
            value={gameName}
            placeholder="Black Jack"
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
            placeholder="Nom du joueur"
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
        <div className="ButtonHolder">
          <input
            type="text"
            value={joinGameId}
            placeholder="ID de la partie"
            onChange={(e) => {
              setJoinGameId(e.target.value);
            }}
          />
          <button onClick={handleJoinGame}>Rejoindre une partie</button>
        </div>
      </div>
    </>
  );
}

import { response } from "express";

export function useCreateGame() {
    const createGame = () => {
        fetch("http://localhost:8000/api/start_game", {
            method: "POST",
            body: {
                name: "Black Jack",
                players: [
                    { id: 1, name: "Player 1", score: 30 },
                    { id: 2, name: "Player 2", score: 10 },
                ],
            }
        }).then((response) => {
            console.log(response);
        })
    }

    return { createGame } ;
}
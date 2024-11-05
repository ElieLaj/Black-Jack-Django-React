import { response } from "express";

export default function useCreateGame() {
    const createGame = () => {
        fetch("http://localhost:8000/api/start_game", {
            method: "POST",
            body: {
                name: "Black Jack",
                players: [
                    "Tim2o", "2lie, Arthurochrome"
                ],
            }
        }).then((response) => {
            console.log(response);
        }).catch((error) => {
            console.log(error);
        });
    }

    return { createGame } ;
}


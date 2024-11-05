import useCreateGame from "../hooks/useCreateGame"

export function Game() {
    const { createGame } = useCreateGame();
    return (
        <div>
            <h1>Game</h1>
            <button onClick={() => createGame()}>Create Game</button>
        </div>
    )
}
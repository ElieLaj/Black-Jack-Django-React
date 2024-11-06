export default function useJoinGame() {
  const joinGame = async (game_id, players, ip) => {
    try {
      const response = await fetch(
        `http://${ip}:8000/api/join_game/${game_id}/${players}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            game_id: game_id,
            players: players,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  };

  return { joinGame };
}

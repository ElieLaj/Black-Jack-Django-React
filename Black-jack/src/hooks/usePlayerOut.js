export default function usePlayerOut() {
  const playerOut = async (game_id, player_id) => {
    try {
      const response = await fetch(
        "http://10.111.9.24:8000/api/game/player_out/" +
          game_id +
          "/" +
          player_id,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            game_id: game_id,
            player_id: player_id,
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

  return { playerOut };
}

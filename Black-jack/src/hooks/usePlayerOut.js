export default function usePlayerOut() {
  const playerOut = async (game_id, ip) => {
    try {
      const response = await fetch(
        `http://${ip}:8000/api/game/player_out/${game_id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            game_id: game_id
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
